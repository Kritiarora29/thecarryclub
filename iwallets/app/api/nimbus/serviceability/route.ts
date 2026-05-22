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

    const config = await NimbusConfig.findOne();
    if (!config || !config.isConfigured) {
      return NextResponse.json({ 
        error: "NimbusPost is not configured. Please go to settings and configure your credentials." 
      }, { status: 400 });
    }

    const pickupPincode = config.pickupPincode;
    const deliveryPincode = order.address?.pincode;

    if (!pickupPincode || !deliveryPincode) {
      return NextResponse.json({ 
        error: "Pincodes missing. Ensure both warehouse and order delivery pincodes are set." 
      }, { status: 400 });
    }

    // 1. SIMULATOR MODE
    if (config.isSimulator) {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate realistic EDD (e.g. 2-5 days depending on pincode difference)
      const distanceFactor = Math.abs(parseInt(pickupPincode) - parseInt(deliveryPincode)) % 4;
      const baseDays = 2 + distanceFactor;

      const mockCouriers = [
        {
          courier_id: "delhivery_surface",
          name: "Delhivery Surface",
          rate: 45 + (distanceFactor * 5),
          expected_delivery: new Date(Date.now() + baseDays * 86400000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          etd_days: baseDays,
          service_type: "Surface",
          rating: 4.2,
        },
        {
          courier_id: "bluedart_express",
          name: "BlueDart Express (Air)",
          rate: 95 + (distanceFactor * 10),
          expected_delivery: new Date(Date.now() + Math.max(1, baseDays - 2) * 86400000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          etd_days: Math.max(1, baseDays - 2),
          service_type: "Air",
          rating: 4.8,
        },
        {
          courier_id: "xpressbees_surface",
          name: "Xpressbees Surface",
          rate: 38 + (distanceFactor * 4),
          expected_delivery: new Date(Date.now() + (baseDays + 1) * 86400000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          etd_days: baseDays + 1,
          service_type: "Surface",
          rating: 3.9,
        },
        {
          courier_id: "shadowfax_surface",
          name: "Shadowfax Surface",
          rate: 40 + (distanceFactor * 5),
          expected_delivery: new Date(Date.now() + baseDays * 86400000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          etd_days: baseDays,
          service_type: "Surface",
          rating: 4.0,
        }
      ].sort((a, b) => a.rate - b.rate);

      return NextResponse.json({ success: true, couriers: mockCouriers });
    }

    // 2. LIVE MODE - Call NimbusPost API
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
      throw new Error(`Authentication with NimbusPost failed: status ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    if (!loginData.status || !loginData.data) {
      throw new Error(loginData.message || "Failed to retrieve authentication token from NimbusPost.");
    }

    const token = loginData.data;

    // B. Check Serviceability
    // Wallet weight is around 0.1 - 0.2 kg. Let's use 0.2 kg (200 grams) as standard
    const weight = 0.2; 
    const orderAmount = order.amount || 999;
    const isCod = 0; // The client pays online via Razorpay in our flow

    const serviceabilityRes = await fetch(`${baseUrl}/courier/serviceability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        origin: pickupPincode,
        destination: deliveryPincode,
        weight: weight,
        payment_method: "prepaid",
        order_amount: orderAmount
      })
    });

    if (!serviceabilityRes.ok) {
      throw new Error(`Serviceability check failed: status ${serviceabilityRes.status}`);
    }

    const serviceabilityData = await serviceabilityRes.json();
    if (!serviceabilityData.status || !serviceabilityData.data) {
      throw new Error(serviceabilityData.message || "No serviceability data returned from NimbusPost.");
    }

    // Format couriers to match UI structure
    const liveCouriers = serviceabilityData.data.map((c: any) => {
      // Calculate delivery date if expected_delivery is not directly provided as string
      let deliveryDateStr = c.expected_delivery || "";
      if (!deliveryDateStr && c.etd) {
        deliveryDateStr = new Date(Date.now() + parseInt(c.etd) * 86400000).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }

      return {
        courier_id: c.courier_id || c.name?.toLowerCase().replace(" ", "_"),
        name: c.name || "Standard Courier",
        rate: c.rate || c.freight_charge || 50,
        expected_delivery: deliveryDateStr || "3-5 Business Days",
        etd_days: c.etd || 3,
        service_type: c.service_type || "Surface",
        rating: c.rating || 4.0,
      };
    }).sort((a: any, b: any) => a.rate - b.rate);

    return NextResponse.json({ success: true, couriers: liveCouriers });
  } catch (error: any) {
    console.error("Serviceability API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
