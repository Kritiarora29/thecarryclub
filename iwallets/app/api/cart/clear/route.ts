import { setCart } from "@/lib/cart";
import { NextResponse } from "next/server";

export async function POST() {
  await setCart([]);
  return NextResponse.json({ success: true });
}
