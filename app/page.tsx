import Timer from "@/components/Timer";
import { Header } from "@/components/Header";
import { LightRays } from "@/components/ui/light-rays";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
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
      <Header />
      <Timer />
      <LightRays />
    </main>
  );
}
