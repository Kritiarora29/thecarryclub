import { getProducts } from "@/lib/getProduct";
import BuyClient from "./BuyClient";
import { getWishlist } from "@/lib/wishlist";

export default async function Page() {
  const products = await getProducts();
  const wishlist = await getWishlist();

  return <BuyClient products={products} wishlist={wishlist} />;
}