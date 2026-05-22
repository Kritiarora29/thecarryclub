import { connectDB } from "@/lib/mongodb";
import NimbusConfig from "@/models/NimbusConfig";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    let config = await NimbusConfig.findOne();
    if (!config) {
      config = await NimbusConfig.create({
        email: "",
        password: "",
        mode: "sandbox",
        isConfigured: false,
        isSimulator: true,
      });
    }
    // Return config masking password for security
    const safeConfig = {
      ...config.toObject(),
      password: config.password ? "••••••••" : "",
    };
    return NextResponse.json(safeConfig);
  } catch (error: any) {
    console.error("GET /api/nimbus/config error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let config = await NimbusConfig.findOne();
    if (!config) {
      config = new NimbusConfig();
    }

    // Update fields
    config.email = body.email !== undefined ? body.email : config.email;
    
    // Only update password if it's changed (not the masked one)
    if (body.password !== undefined && body.password !== "••••••••") {
      config.password = body.password;
    }
    
    config.mode = body.mode !== undefined ? body.mode : config.mode;
    config.isSimulator = body.isSimulator !== undefined ? body.isSimulator : config.isSimulator;
    config.pickupName = body.pickupName !== undefined ? body.pickupName : config.pickupName;
    config.pickupPhone = body.pickupPhone !== undefined ? body.pickupPhone : config.pickupPhone;
    config.pickupAddress = body.pickupAddress !== undefined ? body.pickupAddress : config.pickupAddress;
    config.pickupCity = body.pickupCity !== undefined ? body.pickupCity : config.pickupCity;
    config.pickupState = body.pickupState !== undefined ? body.pickupState : config.pickupState;
    config.pickupPincode = body.pickupPincode !== undefined ? body.pickupPincode : config.pickupPincode;

    // Check if configuration is complete
    config.isConfigured = !!(config.email && config.password && config.pickupPincode);

    await config.save();

    const safeConfig = {
      ...config.toObject(),
      password: config.password ? "••••••••" : "",
    };

    return NextResponse.json({ success: true, config: safeConfig });
  } catch (error: any) {
    console.error("POST /api/nimbus/config error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
