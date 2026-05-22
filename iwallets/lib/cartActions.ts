"use server"

import { getCart, setCart } from "./cart"
import { redirect } from "next/navigation"

export async function addToCart(slug: string) {
  const cart = await getCart()

  const item = cart.find(i => i.slug === slug)
  if (item) item.qty += 1
  else cart.push({ slug, qty: 1 })

  await setCart(cart)
}

export async function buyItNow(slug: string) {
  await addToCart(slug)
  redirect("/cart")
}

export async function updateQty(slug: string, qty: number) {
  const cart = (await getCart())
    .map(i => i.slug === slug ? { ...i, qty } : i)
    .filter(i => i.qty > 0)

  await setCart(cart)
}

export async function removeFromCart(slug: string) {
  const cart = (await getCart()).filter(i => i.slug !== slug)
  await setCart(cart)
}

export async function clearCart() {
  await setCart([])
  redirect("/cart")
}