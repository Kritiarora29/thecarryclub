import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

function isAdmin(req: Request) {
  return (req.headers.get("cookie") || "").includes("admin-auth=true");
}

// GET — all products (id, title, color, price only)
export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const products = await Product.find()
    .select("_id title color price imageUrl slug")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, products });
}

// PATCH — update a single product's price (body: { id, price })
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id, price } = await req.json();

  if (!id || price == null || isNaN(Number(price)) || Number(price) < 0) {
    return NextResponse.json({ error: "Valid id and price required" }, { status: 400 });
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    { price: Number(price) },
    { new: true, select: "_id title color price" }
  );

  if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  try {
    revalidatePath("/buy");
    revalidatePath("/");
  } catch {}

  return NextResponse.json({ success: true, product: updated });
}
