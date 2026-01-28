import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppDock, { DockItem } from "@/components/AppDock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focux",
  description: "A simple Pomodoro timer to boost your productivity.",
  keywords: ["pomodoro", "produtividade", "foco", "timer"],
  openGraph: {
    title: "Focux — Pomodoro e Produtividade",
    description:
      "Use Focux para organizar seus ciclos de foco e aumentar sua produtividade.",
    url: "https://focux.app",
    images: [
      {
        url: "https://focux.app/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}

          {/* Dock global */}
          <AppDock />
        </AuthProvider>
      </body>
    </html>
  );
}
