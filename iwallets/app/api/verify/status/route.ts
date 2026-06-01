import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    await connectDB();
    
    const verification = await Verification.findOne({ email }).sort({ createdAt: -1 });

    if (!verification) {
      return NextResponse.json({ verified: false });
    }

    return NextResponse.json({ verified: verification.verified });
  } catch (error: any) {
    console.error("Error checking verification status:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
