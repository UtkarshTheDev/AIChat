import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FilterX - AI Chat App with Filteration",
  description:
    "Modern AI Chat application with Gemini integration which filters the sensitive content from the user.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {children}
  <Analytics /> 
    <SpeedInsights />
      </body>
    </html>
  );
}
