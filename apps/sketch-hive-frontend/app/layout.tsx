import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppBackground } from "@/components/AppBackground";
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
  // Tab/favicon icon. Uses favicon.svg — a zoomed (125%) copy of the app logo so
  // the mascot fills more of the tab icon. The on-page logo still uses logo.svg.
  icons: {
    icon: "/mascot/favicon.svg",
    shortcut: "/mascot/favicon.svg",
    apple: "/mascot/favicon.svg",
  },
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
        {/* Animated Background (hidden on the whiteboard route) */}
        <AppBackground />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}