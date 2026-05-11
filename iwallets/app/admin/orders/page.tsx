"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/admin-orders");
      const data = await res.json();
      setOrders(data);
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

          <p className="mt-2">Amount: ₹{order.amount}</p>
          <p className="text-xs">{order.paymentId}</p>
        </div>
      ))}
    </div>
  );
}