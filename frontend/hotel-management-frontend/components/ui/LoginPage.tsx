"use client";
import { useState, type FormEvent } from "react";
import { Hotel, Leaf, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

type Mode = "login" | "register";

// Demo credentials card
const DEMO_ACCOUNTS = [
  { label: "Admin / Executive", email: "admin@atelier.hotel", password: "admin123", badge: "admin" },
  { label: "Front Desk Staff", email: "frontdesk@atelier.hotel", password: "frontdesk123", badge: "staff" },
  { label: "Guest", email: "guest@example.com", password: "guest123", badge: "guest" },
];

export default function LoginPage() {
  const { login, register, error, isLoading, clearError } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearError();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const name = String(fd.get("name") ?? "");
        await register(name, email, password);
      }
    } catch {
      // error state is set inside AuthProvider
    }
  }

  function quickLogin(email: string, password: string) {
    clearError();
    login(email, password).catch(() => {});
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "linear-gradient(135deg, #1a1c14 0%, #2a2d1e 50%, #1a1c14 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #7a8c5c, #a0b070)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(122,140,92,0.3)",
          }}>
            <Hotel size={26} color="#fff" />
          </div>
          <h1 style={{ color: "#e8e4d4", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            ATELIER
          </h1>
          <p style={{ color: "#8a8470", fontSize: 12, marginTop: 4, letterSpacing: 2 }}>
            HOTEL &amp; RESIDENCES
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,253,246,0.04)",
          border: "1px solid rgba(255,253,246,0.1)",
          borderRadius: 18,
          padding: 32,
          backdropFilter: "blur(16px)",
        }}>
          {/* Mode toggle */}
          <div style={{
            display: "flex", background: "rgba(0,0,0,0.25)", borderRadius: 10,
            padding: 3, marginBottom: 28,
          }}>
            {(["login", "register"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); clearError(); }} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 13, letterSpacing: "0.3px",
                transition: "all 0.2s",
                background: mode === m ? "rgba(122,140,92,0.8)" : "transparent",
                color: mode === m ? "#fff" : "#8a8470",
              }}>
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(180,60,60,0.15)", border: "1px solid rgba(180,60,60,0.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
              color: "#e07070", fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#a09880", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                  FULL NAME
                </label>
                <input name="name" required placeholder="Your name"
                  style={inputStyle} />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#a09880", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                EMAIL ADDRESS
              </label>
              <input name="email" type="email" required placeholder="your@email.com"
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: 24, position: "relative" }}>
              <label style={{ display: "block", color: "#a09880", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                PASSWORD
              </label>
              <input name="password" type={showPass ? "text" : "password"} required
                placeholder="Password" style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: 12, bottom: 11,
                background: "none", border: "none", cursor: "pointer", color: "#8a8470",
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={isLoading} style={{
              width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
              background: isLoading ? "rgba(122,140,92,0.4)" : "linear-gradient(135deg, #7a8c5c, #a0b070)",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}>
              {isLoading ? "Please wait…" : mode === "login" ? "Sign in to your account" : "Create account"}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Demo logins */}
          {mode === "login" && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,253,246,0.08)" }} />
                <span style={{ color: "#6a6454", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                  DEMO ACCOUNTS
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,253,246,0.08)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DEMO_ACCOUNTS.map((a) => (
                  <button key={a.email} onClick={() => quickLogin(a.email, a.password)}
                    disabled={isLoading}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 10,
                      background: "rgba(255,253,246,0.04)", border: "1px solid rgba(255,253,246,0.08)",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(122,140,92,0.12)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,253,246,0.04)")}
                  >
                    <span style={{ color: "#c8c0a8", fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "2px 8px",
                      borderRadius: 6,
                      background: a.badge === "admin" ? "rgba(180,140,60,0.25)" :
                        a.badge === "staff" ? "rgba(92,140,122,0.25)" : "rgba(140,92,122,0.25)",
                      color: a.badge === "admin" ? "#e0b870" :
                        a.badge === "staff" ? "#70c0a0" : "#c070a8",
                    }}>
                      {a.badge.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 20 }}>
          <ShieldCheck size={13} color="#6a6454" />
          <p style={{ color: "#6a6454", fontSize: 11, margin: 0, textAlign: "center" }}>
            Sessions are secured with signed JWT tokens. Credentials are stored in-memory for this demo.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,253,246,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "#e8e4d4",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
