import { getBlogPosts } from "@/lib/mdx";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const posts = getBlogPosts()
    .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`)
    .join("\n");

  const body = `# Focux

> ${SITE_DESCRIPTION}

Focux é um app web em português (pt-BR) baseado na técnica Pomodoro. Os tempos padrão são 25 minutos de foco, 5 de pausa curta e 15 de pausa longa, e todos podem ser ajustados. O timer básico é gratuito e sem anúncios; o plano Premium (mensal ou vitalício) adiciona painel de Analytics, histórico ilimitado das sessões em nuvem, sincronização entre dispositivos e suporte priorizado.

## Páginas

- [Timer Pomodoro](${SITE_URL}/): o timer online
- [Sobre o Focux](${SITE_URL}/landing): o que é o app e como a técnica Pomodoro funciona
- [Premium](${SITE_URL}/upgrade): planos, recursos e perguntas frequentes

## Blog

${posts}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
