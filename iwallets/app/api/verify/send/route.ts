import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";
import { transporter } from "@/lib/sendMail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    // Upsert verification record
    await Verification.findOneAndUpdate(
      { email },
      { token, verified: false, createdAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    const baseUrl = process.env.NODE_ENV === "production"
      ? (process.env.NEXT_PUBLIC_URL || "https://thecarryclub.in")
      : "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email for theCarryClub",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000; margin-bottom: 20px; font-weight: 900;">Complete Your Purchase</h2>
          <p style="color: #333; margin-bottom: 30px;">Click the button below to verify your email address and proceed with placing your order.</p>
          <a href="${verificationUrl}" style="display: inline-block; background: #ff3366; color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Verify Email</a>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Verification email sent" });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 });
  }
}
