import type { Metadata } from "next";
import { Outfit, Unbounded } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-unbounded" });

export const metadata: Metadata = {
  title: "TME Insights",
  description: "One central analytics hub for all TME Looker Studio dashboards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${unbounded.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
