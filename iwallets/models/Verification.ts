import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  token: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 900 } // Expires in 15 minutes (900 seconds)
});

// Avoid OverwriteModelError in Next.js
export default mongoose.models.Verification || mongoose.model("Verification", verificationSchema);
