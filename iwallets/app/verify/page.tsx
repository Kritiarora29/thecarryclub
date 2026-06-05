import { connectDB } from "@/lib/mongodb";
import Verification from "@/models/Verification";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, Heading, Button } from "@/components/ui/tcc";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full">
          <Card size="lg" className="text-center">
            <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <Heading as="h1" className="text-2xl md:text-2xl mb-2">Invalid Link</Heading>
            <p className="text-muted-foreground mb-6">No verification token was provided.</p>
            <Button href="/cart">Return to Cart</Button>
          </Card>
        </div>
      </div>
    );
  }

  try {
    await connectDB();

    const verification = await Verification.findOneAndUpdate(
      { token },
      { verified: true },
      { returnDocument: "after" }
    );

    if (!verification) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="max-w-md w-full">
            <Card size="lg" className="text-center">
              <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
              <Heading as="h1" className="text-2xl md:text-2xl mb-2">Link Expired</Heading>
              <p className="text-muted-foreground mb-6">This verification link is invalid or has expired.</p>
              <Button href="/cart">Return to Cart</Button>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full">
          <Card size="lg" className="text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <Heading as="h1" className="text-2xl md:text-2xl mb-2">Email Verified!</Heading>
            <p className="text-muted-foreground mb-6">Your email address has been successfully verified.</p>
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm mb-6 font-medium">
              You can now close this tab and return to your checkout page to place your order.
            </div>
            <Button href="/cart">Go to Checkout</Button>
          </Card>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full">
          <Card size="lg" className="text-center">
            <XCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
            <Heading as="h1" className="text-2xl md:text-2xl mb-2">Server Error</Heading>
            <p className="text-muted-foreground mb-6">Something went wrong while verifying your email.</p>
            <Button href="/cart">Return to Cart</Button>
          </Card>
        </div>
      </div>
    );
  }
}
