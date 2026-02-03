import Timer from "@/components/Timer";
import { Header } from "@/components/Header";
import { LightRays } from "@/components/ui/light-rays";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focux – Pomodoro Timer Online para Produtividade",
  description: "A simple Pomodoro timer to boost your productivity.",
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2 bg-neutral-950 text-white">
      <Header />
      <Timer />
      <LightRays />
    </main>
  );
}
