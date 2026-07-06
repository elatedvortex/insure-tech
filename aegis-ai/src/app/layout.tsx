import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import SiteFooter from "@/components/SiteFooter";
import PageEffectsLoader from "@/components/PageEffectsLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Aegis — Insurance that thinks before you do",
  description: "Your AI protection advisor. Conversation, not paperwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <AuthProvider>
          <PageEffectsLoader />
          {children}
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
