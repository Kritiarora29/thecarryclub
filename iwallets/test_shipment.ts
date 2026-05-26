import mongoose from "mongoose";

async function run() {
  const email = "9815162277+4002@automatic321signup.com";
  const password = "UTtiFagNyz";
  const baseUrl = "https://api.nimbuspost.com/v1";

  const loginRes = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const loginData = await loginRes.json();
  if (!loginData.status) {
    console.log("Login failed", loginData);
    process.exit(1);
  }
  
  const token = loginData.data;

  const payload = {
    order_number: "TEST_ORDER_12345",
    payment_method: "prepaid",
    payment_type: "prepaid",
    courier_id: "delhivery_surface",
    weight: 200,
    length: 15,
    width: 11,
    height: 3,
    amount: 999,
    consignee: {
      name: "Test User",
      email: "test@example.com",
      phone: "9999999999",
      address: "123 Test Street",
      address_2: "",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    pickup: {
      warehouse_name: "Main Warehouse",
      name: "Main Warehouse",
      phone: "9999999999",
      address: "Test Warehouse Address",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    order_items: [
      {
        name: "Test Wallet",
        qty: 1,
        price: 999,
        sku: "test-wallet",
      }
    ],
  };

  const endpoints = [
    "/shipments/create",
    "/shipments",
    "/orders/create"
  ];

  for (const ep of endpoints) {
    console.log(`\nTesting ${ep}...`);
    const shipRes = await fetch(`${baseUrl}${ep}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`Status: ${shipRes.status}`);
    const text = await shipRes.text();
    console.log(`Response: ${text}`);
  }
}

run().catch(console.error);
