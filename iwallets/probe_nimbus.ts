import mongoose from "mongoose";

const NimbusConfigSchema = new mongoose.Schema({
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    mode: { type: String, enum: ["sandbox", "production"], default: "sandbox" },
}, { strict: false });

const NimbusConfig = mongoose.models.NimbusConfig || mongoose.model("NimbusConfig", NimbusConfigSchema);

async function run() {
  console.log("Connecting to MongoDB to get your saved Nimbus credentials...");
  await mongoose.connect("mongodb+srv://kritiarora29:kritiarora29@cluster1.h2vgcmb.mongodb.net/thecarryclub?appName=Cluster1");
  
  const email = "9815162277+4002@automatic321signup.com";
  const password = "UTtiFagNyz";
  const mode = "production"; // Assuming production for now

  const baseUrl = mode === "production" 
    ? "https://api.nimbuspost.com/v1" 
    : "https://sandbox-api.nimbuspost.com/v1";

  console.log(`Testing endpoints with ${email} on ${baseUrl}`);

  const loginRes = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  });
  
  const loginData = await loginRes.json();
  if (!loginData.status) {
    console.log("Login failed", loginData);
    process.exit(1);
  }
  
  const token = loginData.data;
  console.log("Login successful! Testing common warehouse endpoints...");

  const endpointsToTest = [
    "/warehouses",
    "/users/warehouses",
    "/pickup_addresses",
    "/pickup-addresses",
    "/courier/pickup-locations",
    "/pickups"
  ];

  for (const ep of endpointsToTest) {
    const res = await fetch(`${baseUrl}${ep}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    console.log(`GET ${ep} -> Status: ${res.status}`);
    if (res.ok) {
        const text = await res.text();
        console.log(`✅ Success on ${ep}! Response:`, text.substring(0, 200));
    }
  }

  process.exit(0);
}
run().catch(console.error);
