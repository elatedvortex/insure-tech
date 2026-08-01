import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter  = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "theBestPolicy — India's Smartest Insurance Platform",
  description:
    "India's AI-powered insurance decision platform. Compare Health, Life & Motor Insurance with IRDAI-backed data. Choose Smart. Claim Better. Live Protected.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
