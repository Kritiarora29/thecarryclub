import { connectDB } from "./mongodb";
import Product from "@/models/Product";
import { sanityClient } from "./sanity";

export async function getProducts() {
  let sanityProducts: any[] = [];
  try {
    const query = `*[_type == "product"] | order(title asc) {
      _id,
      title,
      price,
      slug,
      description,
      "imageUrl": image.asset->url
    }`;
    sanityProducts = await sanityClient.fetch(query) || [];
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
  }

  let mongoProducts: any[] = [];
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    
    mongoProducts = products.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      price: p.price,
      slug: p.slug,
      description: p.description,
      color: p.color,
      imageUrl: p.imageUrl?.startsWith("http") || p.imageUrl?.startsWith("/") ? p.imageUrl : `/${p.imageUrl}`,
      videoUrl: p.videoUrl?.startsWith("http") || p.videoUrl?.startsWith("/") ? p.videoUrl : `/${p.videoUrl}`,
    }));
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);
  }

  return [...sanityProducts, ...mongoProducts];
}