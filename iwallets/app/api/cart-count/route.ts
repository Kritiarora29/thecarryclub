import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cart = await getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}
