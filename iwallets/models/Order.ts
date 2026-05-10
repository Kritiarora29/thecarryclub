import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    address: {
      pincode: String,
      city: String,
      state: String,
    },

    items: [
      {
        title: String,
        quantity: Number,
        price: Number,
      },
    ],

    amount: Number,
    paymentId: String,

    
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);