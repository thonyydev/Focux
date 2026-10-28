import { JsonLd } from "@/components/JsonLd";
import { upgradeFaqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Focux Premium — Analytics, histórico ilimitado e sincronização",
  description:
    "Conheça o Focux Premium: painel completo de Analytics, histórico ilimitado das sessões em nuvem, sincronização entre dispositivos e suporte priorizado. Plano mensal ou vitalício.",
  path: "/upgrade",
});

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: upgradeFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      {children}
    </>
  );
}
