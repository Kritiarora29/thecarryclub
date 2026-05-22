"use server"

import { getWishlist, setWishlist } from "./wishlist"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(slug: string) {
  const wishlist = await getWishlist()
  const exists = wishlist.find(i => i.slug === slug)

  let newWishlist
  if (exists) {
    newWishlist = wishlist.filter(i => i.slug !== slug)
  } else {
    newWishlist = [...wishlist, { slug }]
  }

  await setWishlist(newWishlist)
  revalidatePath("/")
  revalidatePath("/wishlist")
  revalidatePath("/buy")
}

export async function removeFromWishlist(slug: string) {
  const wishlist = await getWishlist()
  const newWishlist = wishlist.filter(i => i.slug !== slug)
  await setWishlist(newWishlist)
  revalidatePath("/wishlist")
}
