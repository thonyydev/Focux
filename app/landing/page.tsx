import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { LightRays } from "@/components/ui/light-rays";
import { TypingAnimation } from "@/components/ui/typing-animation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Focux — Timer Pomodoro Livre de Distrações",
  description:
    "Um timer Pomodoro online, limpo e personalizável, sem anúncios. Ajuste foco e pausas ao seu ritmo e mantenha a consistência todos os dias.",
  path: "/landing",
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6">
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center pt-7 md:pt-32 pb-24">
        {/* Headline: h1 real (texto completo no HTML); as linhas animadas são decorativas */}
        <h1 className="sr-only">
          Foque melhor com um timer Pomodoro livre de distrações
        </h1>
        <div
          aria-hidden="true"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-none"
        >
          <AuroraText colors={["#16a34a", "#22c55e", "#84cc16", "#bef264"]}>
            <TypingAnimation>Foque melhor</TypingAnimation>
          </AuroraText>
        </div>
        <BlurFade duration={2}>
          <div
            aria-hidden="true"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-none"
          >
            com um timer Pomodoro
          </div>
        </BlurFade>
        <div
          aria-hidden="true"
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-none"
        >
          <AuroraText colors={["#38bdf8", "#0ea5e9", "#2563eb", "#4f46e5"]}>
            <TypingAnimation>livre de distrações</TypingAnimation>
          </AuroraText>
        </div>
        {/* Subheadline */}
        <p className="mt-4 text-foreground/80 text-lg sm:text-xl max-w-2xl">
          Um timer Pomodoro limpo e personalizável, feito para ajudar você a
          manter a consistência e a produtividade todos os dias.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Button asChild size="xl">
            <Link href="/">Comece a focar agora</Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="rounded-2xl bg-card/60 border border-border p-6">
            <h3 className="font-semibold text-lg">
              🎯 Sessões de foco simples
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Sem bagunça. Apenas foque, pause e repita.
            </p>
          </div>

          <div className="rounded-2xl bg-card/60 border border-border p-6">
            <h3 className="font-semibold text-lg">
              ⏱️ Totalmente personalizável
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste os tempos de foco e pausa ao seu ritmo.
            </p>
          </div>

          <div className="rounded-2xl bg-card/60 border border-border p-6">
            <h3 className="font-semibold text-lg">🚫 Sempre sem anúncios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O app é totalmente livre de anúncios. O Premium libera recursos
              extras.
            </p>
          </div>
        </div>

        {/* Before / After */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl w-full text-left">
          <div className="rounded-2xl bg-card/40 border border-border p-6">
            <h4 className="font-semibold text-lg text-destructive">Antes</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
              <li>❌ Muitas abas abertas</li>
              <li>❌ Perdendo o foco constantemente</li>
              <li>❌ Rotinas inconsistentes</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-card/40 border border-border p-6">
            <h4 className="font-semibold text-lg text-primary">Depois</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
              <li>✅ Sessões de foco claras</li>
              <li>✅ Pausas automáticas</li>
              <li>✅ Consistência diária</li>
            </ul>
          </div>
        </div>

        {/* O que é Pomodoro (conteúdo textual para busca) */}
        <section className="mt-24 max-w-3xl w-full text-left">
          <h2 className="text-2xl font-bold">O que é a técnica Pomodoro?</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A técnica Pomodoro é um método de gestão de tempo criado por
            Francesco Cirillo no fim dos anos 1980. Você trabalha em blocos de
            foco de 25 minutos, separados por pausas curtas de 5 minutos. A cada
            quatro blocos, faz uma pausa longa de 15 a 30 minutos.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            No Focux, os tempos padrão são 25 minutos de foco, 5 de pausa curta
            e 15 de pausa longa, e você pode ajustar todos eles ao seu ritmo.
            O timer básico é gratuito e não tem anúncios.
          </p>
        </section>

        {/* Social proof (light) */}
        <div className="mt-24 max-w-3xl w-full">
          <p className="text-muted-foreground italic">
            “Finalmente um app Pomodoro que não atrapalha.”
          </p>
          <p className="mt-2 text-subtle text-sm">
            Feito para quem quer apenas focar.
          </p>
        </div>

        {/* Final CTA */}
        <p className="mt-15 text-muted-foreground text-lg sm:text-xl max-w-2xl">
          Pronto para focar melhor?
        </p>

        <div className="mt-5">
          <Button asChild size="xl">
            <Link href="/">Comece a focar agora</Link>
          </Button>
        </div>
      </div>
      <LightRays />
    </main>
  );
}
