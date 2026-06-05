import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";

// Public endpoint — CartClient reads this to get the active coupon
export async function GET() {
  await connectDB();
  let config = await SiteConfig.findOne()
    .select("couponCode discountAmount discountType minOrderAmount isActive displayLabel")
    .lean();

  if (!config) {
    // Return sensible defaults if no config row exists yet
    return NextResponse.json({
      couponCode:     "SAVE400",
      discountAmount: 400,
      discountType:   "flat",
      minOrderAmount: 0,
      isActive:       true,
      displayLabel:   "Save ₹400",
    });
  }

  return NextResponse.json(config);
}
