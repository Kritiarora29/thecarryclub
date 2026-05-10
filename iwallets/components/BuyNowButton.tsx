declare const window: any;
declare const localStorage: any;

"use client";

import { useRouter } from "next/navigation";

export default function BuyNowButton({ product }: { product: any }) {
  const router = useRouter();

  const handleBuyNow = () => {
    if (typeof window === "undefined") return;
    if (!product) return;

    localStorage.setItem(
      "cartItem",
      JSON.stringify({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      })
    );

    router.push("/cart");
  };

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      className="mt-6 w-full bg-black text-white py-3 rounded-full"
    >
      Buy Now
    </button>
  );
}
