"use client";

import { useState } from "react";

export default function OrdersTable({ orders }: any) {
  const [color, setColor] = useState("");
  const [date, setDate] = useState("");

  const filteredOrders = orders.filter((o:any) => {

    const matchColor =
      !color || o.color === color;

    const matchDate =
      !date ||
      new Date(o.orderDate)
        .toISOString()
        .slice(0,10) === date;

    return matchColor && matchDate;
  });

  return (
    <>
      {/* FILTERS */}
      <div className="flex gap-4 mb-4">

        <select
          onChange={(e)=>setColor(e.target.value)}
          className="border p-2"
        >
          <option value="">All Colors</option>
          <option>Black</option>
          <option>Space Grey</option>
          <option>White</option>
        </select>

        <input
          type="date"
          onChange={(e)=>setDate(e.target.value)}
          className="border p-2"
        />
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Color</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o:any)=>(
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>{o.email}</td>
              <td>{o.color}</td>
              <td>
                {new Date(o.orderDate)
                  .toLocaleDateString()}
              </td>
              <td>₹{o.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}