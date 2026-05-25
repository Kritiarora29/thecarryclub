import mongoose from "mongoose";
import Razorpay from "razorpay";

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
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

const razorpay = new Razorpay({
  key_id: "rzp_live_StWBAcDOX16aUy",
  key_secret: "gwPLnlssdZdV63AjA3331uoA",
});

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(
    "mongodb+srv://kritiarora29:kritiarora29@cluster1.h2vgcmb.mongodb.net/thecarryclub?appName=Cluster1"
  );
  console.log("Connected to MongoDB.");

  console.log("Fetching payments from Razorpay...");
  const payments = await razorpay.payments.all({
    // Fetch recent payments
  });

  const capturedPayments = payments.items.filter(
    (p: any) => p.status === "captured"
  );
  console.log(`Found ${capturedPayments.length} successful payments in Razorpay.`);

  let recoveredCount = 0;

  for (const p of capturedPayments) {
    const existing = await Order.findOne({ paymentId: p.id });
    if (!existing) {
      console.log(`Recovering missing order for payment ${p.id}...`);
      await Order.create({
        name: p.email ? p.email.split("@")[0] : "Unknown",
        email: p.email,
        phone: p.contact,
        amount: p.amount / 100, // Razorpay amount is in paise
        paymentId: p.id,
        items: [], // Cannot be recovered as it wasn't sent to Razorpay
        address: {
          street: "Address missing (Crash during checkout)",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
        },
      });
      recoveredCount++;
    }
  }

  console.log(`\nRecovery complete! Recovered ${recoveredCount} missing orders.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
