import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

// Routes that require a valid session
const PROTECTED = ["/api/hotel", "/api/guest"];

// Routes that only admin/staff may access
const STAFF_ONLY = ["/api/hotel"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value ?? "";
  const user = token ? await verifyJwt(token) : null;

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to access this resource." },
      { status: 401 }
    );
  }

  // /api/hotel is staff/admin only – guests may not call it
  const isStaffOnly = STAFF_ONLY.some((p) => pathname.startsWith(p));
  if (isStaffOnly && user.role === "guest") {
    return NextResponse.json(
      { error: "You do not have permission to access this area." },
      { status: 403 }
    );
  }

  // Attach user info to request headers so route handlers can read it
  const headers = new Headers(request.headers);
  headers.set("x-auth-user-id", user.id);
  headers.set("x-auth-user-role", user.role);
  headers.set("x-auth-hotel-role", user.hotelRole ?? "");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/hotel/:path*", "/api/guest/:path*"],
};
