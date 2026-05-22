import mongoose from "mongoose";

const NimbusConfigSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    mode: { type: String, enum: ["sandbox", "production"], default: "sandbox" },
    isConfigured: { type: Boolean, default: false },
    isSimulator: { type: Boolean, default: true }, // Enable testing without active production API credentials

    // Default pickup/warehouse details
    pickupName: { type: String, default: "" },
    pickupPhone: { type: String, default: "" },
    pickupAddress: { type: String, default: "" },
    pickupCity: { type: String, default: "" },
    pickupState: { type: String, default: "" },
    pickupPincode: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.NimbusConfig ||
  mongoose.model("NimbusConfig", NimbusConfigSchema);
