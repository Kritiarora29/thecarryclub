import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    
    const tagline = formData.get("tagline") as string;
    const bulletsRaw = formData.get("bullets") as string;
    const quote = formData.get("quote") as string;
    const subQuote = formData.get("subQuote") as string;
    const collectionName = formData.get("collectionName") as string;
    const brand = formData.get("brand") as string;
    
    const images = formData.getAll("images") as File[];
    const singleImage = formData.get("image") as File; // legacy fallback
    const video = formData.get("video") as File;

    if (!title || !price) {
      return NextResponse.json({ success: false, error: "Title and Price are required" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    let imageUrls: string[] = [];

    // Process multiple uploaded images
    if (images && images.length > 0) {
      fs.mkdirSync(uploadDir, { recursive: true });
      for (const img of images) {
        if (img.size > 0) {
          const buffer = Buffer.from(await img.arrayBuffer());
          const ext = path.extname(img.name);
          const filename = `${slug}-${Date.now()}-${Math.floor(Math.random() * 100000)}${ext}`;
          fs.writeFileSync(path.join(uploadDir, filename), buffer);
          imageUrls.push(`/uploads/${filename}`);
        }
      }
    }

    // Legacy single image input fallback
    if (imageUrls.length === 0 && singleImage && singleImage.size > 0) {
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await singleImage.arrayBuffer());
      const ext = path.extname(singleImage.name);
      const filename = `${slug}-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      const legacyImageUrl = `/uploads/${filename}`;
      imageUrls.push(legacyImageUrl);
    }

    let imageUrl = imageUrls.length > 0 ? imageUrls[0] : "";
    let videoUrl = "";

    // Upload Video locally
    if (video && video.size > 0) {
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await video.arrayBuffer());
      const ext = path.extname(video.name);
      const filename = `${slug}-video-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      videoUrl = `/uploads/${filename}`;
    }

    const bullets = bulletsRaw
      ? bulletsRaw.split("\n").map(b => b.trim()).filter(Boolean)
      : [];

    const newProduct = await Product.create({
      title,
      slug: { current: slug },
      price,
      description: description || "",
      color: color || "",
      imageUrl,
      videoUrl,
      images: imageUrls,
      tagline: tagline || "",
      bullets,
      quote: quote || "",
      subQuote: subQuote || "",
      collectionName: collectionName || "",
      brand: brand || "",
    });

    // Invalidate products cache
    try {
      const { revalidatePath } = require("next/cache");
      (revalidateTag as any)("products");
      revalidatePath("/buy");
      revalidatePath("/");
    } catch (e) {
      console.error("Cache revalidation failed on product creation:", e);
    }

    return NextResponse.json({ success: true, product: newProduct });

  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    // Delete files from disk to prevent storage leaks
    const publicDir = path.join(process.cwd(), "public");
    const pathsToDelete = [];
    if (product.images && product.images.length > 0) {
      pathsToDelete.push(...product.images);
    } else if (product.imageUrl) {
      pathsToDelete.push(product.imageUrl);
    }
    if (product.videoUrl) {
      pathsToDelete.push(product.videoUrl);
    }

    for (const fileUrl of pathsToDelete) {
      if (fileUrl && fileUrl.startsWith("/uploads/")) {
        const filePath = path.join(publicDir, fileUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);

    // Invalidate products cache
    try {
      const { revalidatePath } = require("next/cache");
      (revalidateTag as any)("products");
      revalidatePath("/buy");
      revalidatePath("/");
    } catch (e) {
      console.error("Cache revalidation failed on product deletion:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
