"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin-orders", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("API Error:", data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6">Order History</h1>

      {orders.map((order, i) => (
        <div
          key={i}
          className="mb-4 p-4 border border-white/10 rounded-lg"
        >
          <p><b>{order.name}</b> ({order.phone})</p>
          <p>{order.email}</p>

          <p>
            {order.address?.city}, {order.address?.state} -{" "}
            {order.address?.pincode}
            {order.address?.landmark && ` (LM: ${order.address.landmark})`}
          </p>

          <p className="mt-2 font-semibold">Items:</p>
          {order.items?.map((item: any, idx: number) => (
            <div key={idx}>
              {item.title} × {item.quantity}
            </div>
          ))}

          <div className="mt-4 flex items-center gap-3">
            <p>Amount: <b>₹{order.amount}</b></p>
            {order.paymentId === "COD" ? (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-full text-xs font-black uppercase tracking-wider">
                ⚠️ Cash on Delivery
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full text-xs font-black uppercase tracking-wider">
                Prepaid: {order.paymentId}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}