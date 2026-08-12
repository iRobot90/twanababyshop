import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import StorefrontShell from "@/components/layout/StorefrontShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Twana Baby Shop | Premium Comfort",
  description: "Experience the softest baby essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <SmoothScroll>
          <StorefrontShell>{children}</StorefrontShell>
        </SmoothScroll>
      </body>
    </html>
  );
}
