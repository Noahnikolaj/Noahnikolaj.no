import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./halloween.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-press",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-vt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "🎃 ???",
  description: "Finn katten.",
  // Secret page — keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09060d",
  // The root layout locks the site to light; this page is deliberately not.
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function HalloweenLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pressStart.variable} ${vt323.variable}`}>{children}</div>;
}
