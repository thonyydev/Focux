import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppDock, { DockItem } from "@/components/AppDock";
import CookieBanner from "@/components/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Focux — Timer Pomodoro Online para Produtividade",
    template: "%s | Focux",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "pomodoro",
    "timer pomodoro",
    "timer pomodoro online",
    "técnica pomodoro",
    "produtividade",
    "foco",
  ],
  openGraph: {
    title: "Focux — Timer Pomodoro Online para Produtividade",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focux — timer Pomodoro online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focux — Timer Pomodoro Online para Produtividade",
    description: SITE_DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: "pt-BR",
          }}
        />
        <AuthProvider>
          {children}

          {/* Dock global */}
          <AppDock />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
