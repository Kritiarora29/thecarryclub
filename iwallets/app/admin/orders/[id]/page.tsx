"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin-orders/${id}`)
      .then((res) => res.json())
      .then(setOrder);
  }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl mb-4">Order Details</h1>

      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl">
        <p><b>Name:</b> {order.name}</p>
        <p><b>Email:</b> {order.email}</p>
        <p><b>Phone:</b> {order.phone}</p>

        <p className="mt-3">
          <b>Address:</b> {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>

        <div className="mt-3">
          <b>Items:</b>
          {order.items?.map((item: any, i: number) => (
            <div key={i}>
              {item.title} × {item.quantity} (₹{item.price})
            </div>
          ))}
        </div>

        <p className="mt-3">Amount: ₹{order.amount}</p>
        <p className="text-xs">{order.paymentId}</p>
      </div>
    </div>
  );
}