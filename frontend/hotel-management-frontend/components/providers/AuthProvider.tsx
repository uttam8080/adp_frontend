"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "guest" | "staff" | "admin";
  hotelRole?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string;
  clearError: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  // Check existing session on mount
  const fetchMe = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await r.json();
      setUser(r.ok ? j.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const authAction = async (body: object) => {
    setError("");
    setIsLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Authentication failed.");
      setUser(j.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (email: string, password: string) =>
    authAction({ action: "login", email, password });

  const register = (name: string, email: string, password: string) =>
    authAction({ action: "register", name, email, password });

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isLoading, login, register, logout, error, clearError }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
