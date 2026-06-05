import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";

function isAdmin(req: Request) {
  return (req.headers.get("cookie") || "").includes("admin-auth=true");
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  let config = await SiteConfig.findOne().lean();
  if (!config) config = await SiteConfig.create({});

  return NextResponse.json({ success: true, config });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const allowed = ["couponCode", "discountAmount", "discountType", "minOrderAmount", "isActive", "displayLabel"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  let config = await SiteConfig.findOne();
  if (!config) config = new SiteConfig();
  Object.assign(config, update);
  await config.save();

  return NextResponse.json({ success: true, config });
}
