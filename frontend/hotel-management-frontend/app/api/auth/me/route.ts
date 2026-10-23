import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value ?? "";
  const user = token ? await verifyJwt(token) : null;
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
