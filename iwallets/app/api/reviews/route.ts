import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, text, stars } = await req.json();

    if (!name || !text || !stars) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = await Review.create({ name, text, stars, approved: true });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
