import CartClient from "./CartClient"
import { getCart } from "@/lib/cart"
import { getProducts } from "@/lib/getProduct"

export default async function Page() {
  const cart = await getCart()
  const products = await getProducts()

  return <CartClient cart={cart || []} products={products || []} />
}