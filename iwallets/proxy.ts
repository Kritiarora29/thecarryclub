import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  const adminAuth = req.cookies.get("admin-auth")?.value;

  // 🔐 Protect admin routes
  if (isAdminRoute && adminAuth !== "true") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply only to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};