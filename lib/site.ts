import type { Metadata } from "next";

export const SITE_URL = "https://www.focux.app";
export const SITE_NAME = "Focux";
export const SITE_DESCRIPTION =
  "Timer Pomodoro online, gratuito e sem anúncios, com sessões de foco e pausas personalizáveis para manter a produtividade todos os dias.";

const OG_IMAGE = {
  url: "/images/og-image.png",
  width: 1200,
  height: 630,
  alt: "Focux — timer Pomodoro online",
};

// O Next substitui o objeto openGraph/twitter inteiro quando a página define o seu,
// então cada página precisa repetir imagem, siteName etc. Esse helper evita a repetição.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
