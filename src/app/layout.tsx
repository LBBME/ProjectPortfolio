import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dennis Román | Project Portfolio",
  description:
    "CFD-focused portfolio: verification, validation, reproducibility, and automation."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        <main className="container-shell py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
