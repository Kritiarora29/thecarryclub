import mongoose from "mongoose";

const SiteConfigSchema = new mongoose.Schema(
  {
    couponCode:      { type: String,  default: "SAVE400" },
    discountAmount:  { type: Number,  default: 400 },
    discountType:    { type: String,  default: "flat", enum: ["flat", "percent"] },
    minOrderAmount:  { type: Number,  default: 0 },
    isActive:        { type: Boolean, default: true },
    displayLabel:    { type: String,  default: "Save ₹400" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);
