import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Focux",
  description: "A simple Pomodoro timer to boost your productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        {/* main ocupa toda a tela, mas centraliza o conteúdo com padding no mobile */}
        <main className="min-h-screen w-full bg-neutral-950 flex items-start sm:items-center justify-center px-4 pb-[env(safe-area-inset-bottom)]">
          {children}
        </main>
      </body>
    </html>
  );
}