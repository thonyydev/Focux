import Timer from "@/components/Timer";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focux – Pomodoro Timer Online para Produtividade",
  description: "A simple Pomodoro timer to boost your productivity.",
};


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-neutral-950 text-white">
      <BlurFade duration={1}>
        <AnimatedGradientText
          speed={1}
          colorFrom="#4ade80"
          colorTo="#06b6d4"
          className="text-4xl font-bold tracking-tight"
        >
          Focux
        </AnimatedGradientText>
      </BlurFade>
      <Timer />
      <LightRays />
    </main>
  );
}
