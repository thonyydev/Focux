import Dashboard from "@/components/Dashboard";
import { LightRays } from "@/components/ui/light-rays";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen flex items-center pb-28 bg-background text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          inLanguage: "pt-BR",
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        }}
      />
      <Dashboard />
      <LightRays className="opacity-50" />
    </main>
  );
}
