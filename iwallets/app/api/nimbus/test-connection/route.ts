import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, mode, isSimulator } = await req.json();

    if (isSimulator) {
      // Simulate connection testing
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required." });
      }
      return NextResponse.json({ success: true, message: "Simulator Connection Successful! (Simulated Mode)" });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." });
    }

    const baseUrl = mode === "production" 
      ? "https://api.nimbuspost.com/v1" 
      : "https://sandbox-api.nimbuspost.com/v1";

    const response = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        message: `HTTP error! status: ${response.status}` 
      });
    }

    const data = await response.json();
    if (data.status === true || data.status === "true") {
      return NextResponse.json({ success: true, message: "NimbusPost Connection Successful!" });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: data.message || "Invalid credentials or login failed." 
      });
    }
  } catch (error: any) {
    console.error("Test Connection Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
