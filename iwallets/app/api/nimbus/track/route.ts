import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import NimbusConfig from "@/models/NimbusConfig";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const awb = searchParams.get("awb");

    if (!awb) {
      return NextResponse.json({ error: "AWB number is required." }, { status: 400 });
    }

    const order = await Order.findOne({ nimbusAwb: awb });
    if (!order) {
      return NextResponse.json({ error: "Order with this AWB not found." }, { status: 404 });
    }

    const config = await NimbusConfig.findOne();
    if (!config) {
      return NextResponse.json({ error: "NimbusPost config not found." }, { status: 400 });
    }

    // 1. SIMULATOR MODE
    if (config.isSimulator) {
      const shippedAt = order.nimbusShippedAt ? new Date(order.nimbusShippedAt).getTime() : Date.now();
      const elapsedHours = (Date.now() - shippedAt) / (1000 * 60 * 60);

      // Generate a progressive tracking timeline based on elapsed time
      const events = [
        {
          status: "manifested",
          activity: "Shipment Manifested & AWB Generated",
          location: config.pickupCity || "Warehouse",
          date: new Date(shippedAt).toLocaleString("en-IN"),
          completed: true,
        }
      ];

      let currentStatus = "manifested";

      if (elapsedHours > 0.05) { // 3 minutes for testing
        events.push({
          status: "picked_up",
          activity: "Package Picked Up by Courier Partner",
          location: config.pickupCity || "Warehouse Hub",
          date: new Date(shippedAt + 3 * 60 * 1000).toLocaleString("en-IN"),
          completed: true,
        });
        currentStatus = "picked_up";
      }

      if (elapsedHours > 0.1) { // 6 minutes for testing
        events.push({
          status: "in_transit",
          activity: "In Transit - Dispatched to Destination Hub",
          location: "Central Sorting Facility",
          date: new Date(shippedAt + 6 * 60 * 1000).toLocaleString("en-IN"),
          completed: true,
        });
        currentStatus = "in_transit";
      }

      if (elapsedHours > 0.2) { // 12 minutes for testing
        events.push({
          status: "out_for_delivery",
          activity: "Out for Delivery - Out with courier representative",
          location: order.address?.city || "Destination Hub",
          date: new Date(shippedAt + 12 * 60 * 1000).toLocaleString("en-IN"),
          completed: true,
        });
        currentStatus = "out_for_delivery";
      }

      if (elapsedHours > 0.3) { // 18 minutes for testing
        events.push({
          status: "delivered",
          activity: "Delivered - Package delivered successfully",
          location: order.address?.city || "Destination",
          date: new Date(shippedAt + 18 * 60 * 1000).toLocaleString("en-IN"),
          completed: true,
        });
        currentStatus = "delivered";
      }

      // Update order status if it changed
      if (order.nimbusStatus !== currentStatus) {
        order.nimbusStatus = currentStatus;
        await order.save();
      }

      return NextResponse.json({
        success: true,
        status: currentStatus,
        events: events.reverse(), // latest events first
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
      throw new Error("Authentication failed");
    }

    const loginData = await loginRes.json();
    const token = loginData.data;

    // B. Call Tracking Endpoint
    // Note: NimbusPost tracking endpoint is GET /v1/shipments/track/{awb}
    const trackRes = await fetch(`${baseUrl}/shipments/track/${awb}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!trackRes.ok) {
      throw new Error(`Tracking check failed: status ${trackRes.status}`);
    }

    const trackData = await trackRes.json();
    if (!trackData.status || !trackData.data) {
      throw new Error(trackData.message || "No tracking history found.");
    }

    const history = trackData.data.history || [];
    const currentStatus = trackData.data.status?.toLowerCase() || "manifested";

    // Format events for UI stepper
    const liveEvents = history.map((event: any) => ({
      status: event.status?.toLowerCase(),
      activity: event.activity || event.message || "Shipment Update",
      location: event.location || "",
      date: event.event_time || event.date || new Date().toLocaleString("en-IN"),
      completed: true,
    }));

    // Update order status if changed
    if (order.nimbusStatus !== currentStatus) {
      order.nimbusStatus = currentStatus;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      status: currentStatus,
      events: liveEvents.reverse(),
    });
  } catch (error: any) {
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
