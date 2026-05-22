import { cookies } from "next/headers"

export type WishlistItem = {
  slug: string
}

const WISHLIST_KEY = "wishlist"

/* READ WISHLIST */
export async function getWishlist(): Promise<WishlistItem[]> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(WISHLIST_KEY)?.value
  return raw ? JSON.parse(raw) : []
}

/* WRITE WISHLIST */
export async function setWishlist(wishlist: WishlistItem[]) {
  const cookieStore = await cookies()
  cookieStore.set(WISHLIST_KEY, JSON.stringify(wishlist), {
    path: "/",
    httpOnly: true,
  })
}
