import { COOKIE_NAME, findUser, registerGuest, signJwt } from "@/lib/auth";
import { NextResponse } from "next/server";

const json = (v: unknown, status = 200) => NextResponse.json(v, { status });

export async function POST(request: Request) {
  try {
    const { email, password, name, action } = (await request.json()) as Record<string, string>;

    let user;
    if (action === "register") {
      if (!name?.trim()) return json({ error: "Name is required." }, 400);
      user = registerGuest(name.trim(), email?.trim() ?? "", password ?? "");
    } else {
      user = findUser(email?.trim() ?? "", password ?? "");
      if (!user) return json({ error: "Incorrect email or password." }, 401);
    }

    const token = await signJwt(user);
    const res = json({ user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Authentication failed." }, 422);
  }
}
