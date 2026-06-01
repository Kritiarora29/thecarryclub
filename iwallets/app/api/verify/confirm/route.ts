import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 });
    }

    await connectDB();
    
    const verification = await Verification.findOneAndUpdate(
      { token },
      { verified: true },
      { new: true }
    );

    if (!verification) {
      return NextResponse.json({ success: false, error: "Token not found or expired" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Redirect back to the cart page so the user sees a success indication if they are on a new device.
    // However, if they just close the tab, the original tab will pick up the 'verified: true' via polling.
    return NextResponse.redirect(`${baseUrl}/cart?verified=true`);
  } catch (error: any) {
    console.error("Error confirming verification:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
