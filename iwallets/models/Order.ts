import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
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

    // NimbusPost shipping fields
    nimbusShipmentId: String,
    nimbusAwb: String,
    nimbusCourier: String,
    nimbusLabelUrl: String,
    nimbusStatus: String,
    nimbusShippedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);