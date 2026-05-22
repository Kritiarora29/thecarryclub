import WishlistClient from "./WishlistClient"
import { getWishlist } from "@/lib/wishlist"
import { getProducts } from "@/lib/getProduct"

export const metadata = {
  title: "Your Wishlist | theCarryClub",
  description: "View and manage your favorite iWallets from theCarryClub.",
}

export default async function Page() {
  const wishlist = await getWishlist()
  const products = await getProducts()

  return <WishlistClient wishlist={wishlist || []} products={products || []} />
}
