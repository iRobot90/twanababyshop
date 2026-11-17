import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import StorefrontShell from "@/components/layout/StorefrontShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Twaana | Little essentials, everyday moments",
  description:
    "Explore clothing, toys and everyday baby essentials at Twaana. Prices in Kenyan shillings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
