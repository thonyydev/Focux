import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { LightRays } from "@/components/ui/light-rays";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focux — Timer Pomodoro Livre de Distrações",
  description: "Um timer Pomodoro simples para aumentar sua produtividade.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6">
      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center pt-32 pb-24">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          <AuroraText colors={["#16a34a", "#84cc16", "#facc15", "#f97316"]}>
            <TypingAnimation>Foque melhor</TypingAnimation>
          </AuroraText>
        </h1>
        <BlurFade duration={2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
            com um timer Pomodoro
          </h1>
        </BlurFade>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl mt-3">
          <AuroraText colors={["#38bdf8", "#0ea5e9", "#2563eb", "#4f46e5"]}>
            <TypingAnimation>livre de distrações</TypingAnimation>
          </AuroraText>
        </h1>
        {/* Subheadline */}
        <p className="mt-5 text-neutral-300 text-lg sm:text-xl max-w-2xl">
          Um timer Pomodoro limpo e personalizável, feito para ajudar você a
          manter a consistência e a produtividade todos os dias.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="/"
            className="inline-block px-10 py-4 rounded-2xl 
            bg-gradient-to-r from-cyan-500 to-blue-600 
            font-semibold text-lg 
            hover:scale-105 transition shadow-lg shadow-cyan-500/30"
          >
            Comece a focar agora
          </a>
        </div>

        {/* Benefits */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6">
            <h3 className="font-semibold text-lg">
              🎯 Sessões de foco simples
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              Sem bagunça. Apenas foque, pause e repita.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6">
            <h3 className="font-semibold text-lg">
              ⏱️ Totalmente personalizável
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              Ajuste os tempos de foco e pausa ao seu ritmo.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6">
            <h3 className="font-semibold text-lg">🚫 Sempre sem anúncios</h3>
            <p className="mt-2 text-sm text-neutral-400">
              O app é totalmente livre de anúncios. O Premium libera recursos
              extras.
            </p>
          </div>
        </div>

        {/* Before / After */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl w-full text-left">
          <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 p-6">
            <h4 className="font-semibold text-lg text-red-400">Antes</h4>
            <ul className="mt-4 space-y-2 text-neutral-400 text-sm">
              <li>❌ Muitas abas abertas</li>
              <li>❌ Perdendo o foco constantemente</li>
              <li>❌ Rotinas inconsistentes</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 p-6">
            <h4 className="font-semibold text-lg text-green-400">Depois</h4>
            <ul className="mt-4 space-y-2 text-neutral-400 text-sm">
              <li>✅ Sessões de foco claras</li>
              <li>✅ Pausas automáticas</li>
              <li>✅ Consistência diária</li>
            </ul>
          </div>
        </div>

        {/* Social proof (light) */}
        <div className="mt-24 max-w-3xl w-full">
          <p className="text-neutral-400 italic">
            “Finalmente um app Pomodoro que não atrapalha.”
          </p>
          <p className="mt-2 text-neutral-500 text-sm">
            Feito para quem quer apenas focar.
          </p>
        </div>

        {/* Final CTA */}
        <p className="mt-15 text-neutral-400 text-lg sm:text-xl max-w-2xl">
          Pronto para focar melhor?
        </p>

        <div className="mt-5">
          <a
            href="/"
            className="inline-block px-10 py-4 rounded-2xl 
            bg-gradient-to-r from-cyan-500 to-blue-600 
            font-semibold text-lg 
            hover:scale-105 transition shadow-lg shadow-cyan-500/30"
          >
            Comece a focar agora
          </a>
        </div>
      </div>
      <LightRays />
    </main>
  );
}
