import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const image = formData.get("image") as File;
    const video = formData.get("video") as File;

    if (!title || !price) {
      return NextResponse.json({ success: false, error: "Title and Price are required" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let imageUrl = "";
    let videoUrl = "";

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Upload Image locally
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = path.extname(image.name);
      const filename = `${slug}-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Upload Video locally
    if (video && video.size > 0) {
      const buffer = Buffer.from(await video.arrayBuffer());
      const ext = path.extname(video.name);
      const filename = `${slug}-video-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      videoUrl = `/uploads/${filename}`;
    }

    const newProduct = await Product.create({
      title,
      slug: { current: slug },
      price,
      description: description || "",
      color: color || "",
      imageUrl,
      videoUrl,
    });

    return NextResponse.json({ success: true, product: newProduct });

  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
