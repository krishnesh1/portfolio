import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import TransitionProvider from "@/components/transition/TransitionProvider";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://krishneshkarn.vercel.app"),
  title: "Krishnesh Karn — Full-Stack Developer",
  description:
    "Portfolio of Krishnesh Karn, a MERN full-stack developer building fast, secure and user-centric web applications.",
  openGraph: {
    title: "Krishnesh Karn — Full-Stack Developer",
    description: "MERN full-stack developer · React, Node.js, MongoDB.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <SmoothScroll>
          <TransitionProvider>
            <Navbar />
            {children}
            <Cursor />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
