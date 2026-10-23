import type { Metadata } from "next";
import "./globals.css";
import "./atelier.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { VantaBackground } from "@/components/providers/VantaBackground";

import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "L'Atelier Grand Hotel & Residences | Management System",
  description: "Luxury hotel operational management system with 9 role profiles, live workflows, and guest experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative">
        <VantaBackground />
        <AuthProvider>
          <SmoothScrollProvider>
            <div className="relative z-10 w-full min-h-full">
              {children}
            </div>
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
