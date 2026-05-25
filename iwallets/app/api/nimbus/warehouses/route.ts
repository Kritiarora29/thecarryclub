import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, mode, isSimulator } = await req.json();

    if (isSimulator) {
      // Return dummy data in simulator mode
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({
        success: true,
        warehouses: [
          {
            warehouse_name: "Mock Delhi Warehouse",
            phone: "9876543210",
            address: "123 Simulator St, Industrial Area",
            city: "New Delhi",
            state: "Delhi",
            pincode: "110001",
          },
          {
            warehouse_name: "Mock Mumbai Hub",
            phone: "9123456780",
            address: "456 Mock Road, Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400069",
          }
        ]
      });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required to fetch warehouses." });
    }

    const baseUrl = mode === "production" 
      ? "https://api.nimbuspost.com/v1" 
      : "https://sandbox-api.nimbuspost.com/v1";

    // 1. Authenticate to get token
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      return NextResponse.json({ success: false, message: `Login failed: ${loginRes.status}` });
    }

    const loginData = await loginRes.json();
    if (!loginData.status || !loginData.data) {
      return NextResponse.json({ success: false, message: "Invalid credentials." });
    }

    const token = loginData.data; // Nimbus typically returns token directly in 'data'

    // 2. Fetch warehouses
    // Endpoint is typically /warehouses or /users/warehouses
    const warehouseRes = await fetch(`${baseUrl}/warehouses`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!warehouseRes.ok) {
       return NextResponse.json({ success: false, message: `Failed to fetch warehouses: ${warehouseRes.status}` });
    }

    const warehouseData = await warehouseRes.json();
    
    if (warehouseData.status && warehouseData.data) {
       return NextResponse.json({ success: true, warehouses: warehouseData.data });
    } else {
       return NextResponse.json({ success: false, message: warehouseData.message || "No warehouses found." });
    }

  } catch (error: any) {
    console.error("Fetch Warehouses Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
