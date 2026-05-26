import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import NimbusConfig from "@/models/NimbusConfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (!order.nimbusAwb) {
      return NextResponse.json({ error: "Order is not shipped yet." }, { status: 400 });
    }

    const config = await NimbusConfig.findOne();
    if (!config || !config.isConfigured) {
      return NextResponse.json({ 
        error: "NimbusPost is not configured. Please configure your settings." 
      }, { status: 400 });
    }

    // 1. SIMULATOR MODE
    if (config.isSimulator) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      order.nimbusShipmentId = undefined;
      order.nimbusAwb = undefined;
      order.nimbusCourier = undefined;
      order.nimbusLabelUrl = undefined;
      order.nimbusStatus = undefined;
      order.nimbusShippedAt = undefined;
      await order.save();

      return NextResponse.json({ 
        success: true, 
        message: "Shipment cancelled successfully (Simulator Mode)!",
        order 
      });
    }

    // 2. LIVE MODE
    const baseUrl = config.mode === "production" 
      ? "https://api.nimbuspost.com/v1" 
      : "https://sandbox-api.nimbuspost.com/v1";

    // A. Login to get token
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: config.email, password: config.password }),
    });

    if (!loginRes.ok) {
      throw new Error(`Authentication failed with status ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    if (!loginData.status || !loginData.data) {
      throw new Error(loginData.message || "Failed to retrieve authentication token.");
    }

    const token = loginData.data;

    // B. Cancel Shipment
    if (order.nimbusAwb !== "check_portal") {
      const cancelRes = await fetch(`${baseUrl}/shipments/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ awb: order.nimbusAwb })
      });

      if (!cancelRes.ok) {
        throw new Error(`Cancellation failed: status ${cancelRes.status}`);
      }

      const cancelData = await cancelRes.json();
      if (!cancelData.status) {
        throw new Error(cancelData.message || "Failed to cancel shipment.");
      }
    }

    // C. Update Order Document (clear shipment details so it can be re-shipped)
    order.nimbusShipmentId = undefined;
    order.nimbusAwb = undefined;
    order.nimbusCourier = undefined;
    order.nimbusLabelUrl = undefined;
    order.nimbusStatus = undefined;
    order.nimbusShippedAt = undefined;
    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: "Shipment cancelled successfully!", 
      order 
    });
  } catch (error: any) {
    console.error("Cancel Shipment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
