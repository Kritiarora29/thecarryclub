"use server"

import { getCart, setCart } from "./cart"

export async function placeOrder(formData: FormData) {
  const order = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    cart: getCart(),
    createdAt: new Date(),
  }

  console.log("ORDER:", order) // 🔁 replace with DB insert
  setCart([])
}
