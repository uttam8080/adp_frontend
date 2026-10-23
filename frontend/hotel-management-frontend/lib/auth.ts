// ────────────────────────────────────────────────────────────
// lib/auth.ts  –  HMAC-SHA-256 JWT helpers (Web Crypto, Edge-safe)
// Demo credentials are stored in-memory; swap for a DB in production.
// ────────────────────────────────────────────────────────────

export type AuthRole = "guest" | "staff" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  hotelRole?: string; // maps to hotel-domain Role for staff
}

// ── In-memory user store (demo only) ─────────────────────────
const USERS: (AuthUser & { password: string })[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "admin@atelier.hotel",
    password: "admin123",
    role: "admin",
    hotelRole: "executive",
  },
  {
    id: "u2",
    name: "Emma Wilson",
    email: "frontdesk@atelier.hotel",
    password: "frontdesk123",
    role: "staff",
    hotelRole: "frontdesk",
  },
  {
    id: "u3",
    name: "Guest User",
    email: "guest@example.com",
    password: "guest123",
    role: "guest",
  },
];

export function findUser(email: string, password: string): AuthUser | null {
  const u = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    hotelRole: u.hotelRole,
  };
}

// Allow guest self-registration (demo only)
export function registerGuest(name: string, email: string, password: string): AuthUser {
  const existing = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error("An account with this email already exists.");
  const user: AuthUser & { password: string } = {
    id: "u" + Date.now(),
    name,
    email,
    password,
    role: "guest",
  };
  USERS.push(user);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

// ── JWT helpers ───────────────────────────────────────────────
const SECRET = process.env.JWT_SECRET ?? "atelier-demo-secret-change-in-production";
const EXPIRY_SECONDS = 60 * 60 * 8; // 8 hours

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer | Uint8Array) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function b64urlDecode(s: string) {
  return atob(s.replace(/-/g, "+").replace(/_/g, "/"));
}

export async function signJwt(payload: object): Promise<string> {
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = b64url(
    new TextEncoder().encode(
      JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + EXPIRY_SECONDS })
    )
  );
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(header + "." + body));
  return header + "." + body + "." + b64url(sig);
}

export async function verifyJwt(token: string): Promise<AuthUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Uint8Array.from(b64urlDecode(sig), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(header + "." + body)
    );
    if (!valid) return null;
    const payload = JSON.parse(b64urlDecode(body)) as AuthUser & { exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role, hotelRole: payload.hotelRole };
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "atelier_session";
