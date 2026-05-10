import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      current: { type: String, required: true },
    },
    price: { type: Number, required: true },
    description: String,
    color: String,
    imageUrl: String,
    videoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
