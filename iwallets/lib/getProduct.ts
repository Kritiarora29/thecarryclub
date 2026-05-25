import { connectDB } from "./mongodb";
import Product from "@/models/Product";
import { sanityClient } from "./sanity";
import { unstable_cache } from "next/cache";

export const getProducts = unstable_cache(
  async () => {
    const query = `*[_type == "product"] | order(title asc) {
      _id,
      title,
      price,
      slug,
      description,
      "imageUrl": image.asset->url
    }`;

    // Parallelize Sanity and MongoDB fetching
    const [sanityProductsResult, mongoProductsResult] = await Promise.allSettled([
      sanityClient.fetch(query),
      (async () => {
        await connectDB();
        return Product.find().sort({ createdAt: -1 }).lean();
      })()
    ]);

    const sanityProducts = sanityProductsResult.status === "fulfilled" && sanityProductsResult.value 
      ? sanityProductsResult.value 
      : [];

    if (sanityProductsResult.status === "rejected") {
      console.error("Sanity Fetch Error:", sanityProductsResult.reason);
    }

    const mongoData = mongoProductsResult.status === "fulfilled" && mongoProductsResult.value
      ? mongoProductsResult.value
      : [];
      
    if (mongoProductsResult.status === "rejected") {
      console.error("MongoDB Fetch Error:", mongoProductsResult.reason);
    }

    const mongoProducts = mongoData.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      price: p.price,
      slug: p.slug,
      description: p.description,
      color: p.color,
      imageUrl: p.imageUrl?.startsWith("http") || p.imageUrl?.startsWith("/") ? p.imageUrl : `/${p.imageUrl}`,
      videoUrl: p.videoUrl?.startsWith("http") || p.videoUrl?.startsWith("/") ? p.videoUrl : `/${p.videoUrl}`,
    }));

    return [...sanityProducts, ...mongoProducts];
  },
  ["products-cache"],
  { revalidate: 900, tags: ["products"] } // Revalidate every 15 minutes
);