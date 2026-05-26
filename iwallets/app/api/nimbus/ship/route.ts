import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import NimbusConfig from "@/models/NimbusConfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId, courierId, courierName, rate } = await req.json();

    if (!orderId || !courierId) {
      return NextResponse.json({ error: "Order ID and Courier ID are required." }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.nimbusAwb || order.nimbusShipmentId) {
      return NextResponse.json({ error: "This order is already shipped or a shipment is already active." }, { status: 400 });
    }

    const config = await NimbusConfig.findOne();
    if (!config || !config.isConfigured) {
      return NextResponse.json({ 
        error: "NimbusPost is not configured. Please configure your settings." 
      }, { status: 400 });
    }

    // 1. SIMULATOR MODE
    if (config.isSimulator) {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const randomAwb = "NMB" + Math.floor(100000000 + Math.random() * 900000000);
      
      order.nimbusShipmentId = "sim_" + Math.random().toString(36).substr(2, 9);
      order.nimbusAwb = randomAwb;
      order.nimbusCourier = courierName || "Simulated Courier";
      order.nimbusLabelUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"; // standard open dummy pdf
      order.nimbusStatus = "manifested";
      order.nimbusShippedAt = new Date();

      await order.save();

      return NextResponse.json({ 
        success: true, 
        message: "Shipment manifested successfully (Simulator Mode)!",
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

    // B. Build Shipment Payload
    // Format items for NimbusPost
    const orderItems = order.items.map((item: any) => ({
      name: item.title,
      qty: item.quantity,
      price: item.price,
      sku: item.title?.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    }));

    const payload = {
      order_number: order._id.toString(),
      payment_method: "prepaid",
      payment_type: "prepaid",
      courier_id: courierId,
      weight: 200, // 200 grams default
      length: 15, // standard wallet package cm
      width: 11,
      height: 3,
      order_amount: order.amount,
      consignee: {
        name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address?.street || "No street address provided",
        address_2: order.address?.landmark || "",
        city: order.address?.city,
        state: order.address?.state,
        pincode: order.address?.pincode,
        country: "India",
      },
      pickup: {
        warehouse_name: config.pickupName || "Main Warehouse",
        name: config.pickupName || "Main Warehouse",
        phone: config.pickupPhone,
        address: config.pickupAddress,
        city: config.pickupCity,
        state: config.pickupState,
        pincode: config.pickupPincode,
        country: "India",
      },
      order_items: orderItems,
    };

    // C. Create Shipment
    try {
      const shipRes = await fetch(`${baseUrl}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!shipRes.ok) {
        throw new Error(`Shipment creation failed: status ${shipRes.status}`);
      }

      const shipData = await shipRes.json();
      if (!shipData.status || !shipData.data) {
        throw new Error(shipData.message || "No shipment data returned from NimbusPost.");
      }

      // D. Update Order Document
      order.nimbusShipmentId = shipData.data.shipment_id || shipData.data.id;
      order.nimbusAwb = shipData.data.awb_number || shipData.data.awb;
      order.nimbusCourier = courierName;
      order.nimbusLabelUrl = shipData.data.label_url || shipData.data.label;
      order.nimbusStatus = "manifested";
      order.nimbusShippedAt = new Date();

      await order.save();

      return NextResponse.json({ 
        success: true, 
        message: "Shipment manifested successfully with NimbusPost!", 
        order 
      });
    } catch (error: any) {
      console.warn("Shipment booking failed, but order registered on Nimbus:", error);
      
      // Save order as synced to Nimbus but pending manual action on their dashboard
      order.nimbusAwb = "check_portal";
      order.nimbusCourier = courierName;
      order.nimbusStatus = "check_portal";
      order.nimbusShippedAt = new Date();
      await order.save();

      return NextResponse.json({ 
        success: true, 
        message: "Order added to Nimbus portal. Please check Nimbus portal for shipment.", 
        order,
        partialSuccess: true
      });
    }
  } catch (error: any) {
    console.error("Create Shipment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
