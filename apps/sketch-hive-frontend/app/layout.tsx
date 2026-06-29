import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WaterRippleBg } from "@repo/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SketchHive",
  description: "Collaborative whiteboard for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-screen bg-black overflow-x-hidden">
        {/* Animated Background */}
        <WaterRippleBg />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}