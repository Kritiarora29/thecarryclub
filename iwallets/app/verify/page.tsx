import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">No verification token was provided.</p>
          <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  try {
    await connectDB();
    
    const verification = await Verification.findOneAndUpdate(
      { token },
      { verified: true },
      { returnDocument: 'after' }
    );

    if (!verification) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
            <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Link Expired</h1>
            <p className="text-gray-600 mb-6">This verification link is invalid or has expired.</p>
            <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors">
              Return to Cart
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email address has been successfully verified.</p>
          <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm mb-6 font-medium">
            You can now close this tab and return to your checkout page to place your order.
          </div>
          <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-colors">
            Go to Checkout
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Server Error</h1>
          <p className="text-gray-600 mb-6">Something went wrong while verifying your email.</p>
          <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-colors">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }
}
