import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import SmoothScroll from "@/components/layout/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Twana Baby Shop | Premium Comfort",
  description: "Experience the softest baby essentials.",
};

import Footer from "@/components/layout/Footer";
import GlobalCartDrawer from "@/components/cart/GlobalCartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
        <GlobalCartDrawer />
      </body>
    </html>
  );
}
