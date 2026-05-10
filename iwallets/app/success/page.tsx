import { cookies } from "next/headers"

export default async function SuccessPage() {

  // ✅ Await is REQUIRED in Next 16
  const cookieStore = await cookies()

  // ✅ Type-safe way (important)
  cookieStore.set({
    name: "cart",
    value: "",
    path: "/",
    maxAge: 0,
  })

  return (
    <section className="min-h-screen grid place-items-center bg-white text-black">
      <div className="text-center max-w-md">

        <h1 className="text-3xl font-semibold mb-3">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>

        <a href="/buy" className="underline">
          Continue Shopping
        </a>

      </div>
    </section>
  )
}