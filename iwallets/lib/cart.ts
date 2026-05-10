import { cookies } from "next/headers"

export type CartItem = {
  slug: string
  qty: number
}

const CART_KEY = "cart"

/* READ CART */
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(CART_KEY)?.value
  return raw ? JSON.parse(raw) : []
}

/* WRITE CART */
export async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies()
  cookieStore.set(CART_KEY, JSON.stringify(cart), {
    path: "/",
    httpOnly: true,
  })
}
