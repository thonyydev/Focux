"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";
import { AuroraText } from "@/components/ui/aurora-text";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Check, Crown, Zap, ChevronLeft } from "lucide-react";
import { UpgradeFAQ } from "@/components/UpgradeFAQ";
import confetti from "canvas-confetti";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function UpgradeContent() {
  const { user, isPremium, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      TriggerConfetti();
    }
    if (searchParams.get("canceled") === "true") {
      alert("Checkout cancelado.");
    }
  }, [searchParams]);

  const handleSubscribe = async (selectedPlan: "monthly" | "vitalicio") => {
    if (!user) {
      alert("Faça login para assinar.");
      router.push("/auth/login");
      return;
    }

    const planKey = selectedPlan === "vitalicio" ? "lifetime" : "monthly";

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao conectar com o serviço de pagamento.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  function SideCannons() {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }

  function Fireworks() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  function TriggerConfetti() {
    SideCannons();
    Fireworks();
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
      <LightRays className="opacity-40" />

      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ChevronLeft size={16} /> Voltar
        </Link>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 pb-20">
        <BlurFade duration={0.8}>
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <AuroraText colors={["#FFD700", "#FFA500", "#FF8C00", "#F4A460"]}>
                Focux Premium
              </AuroraText>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desbloqueie seu potencial máximo com Analytics avançado, histórico
              em nuvem ilimitado e muito mais — e também apoie o desenvolvimento
              contínuo do <strong>Focux</strong>, ajudando a manter o app simples,
              independente e sempre sem anúncios.
            </p>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <BlurFade duration={0.8} delay={0.2}>
            <div className="relative h-full flex flex-col p-8 rounded-3xl bg-card border border-border hover:border-input transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-foreground/90">Mensal</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">R$ 9,90</span>
                  <span className="text-subtle">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Flexibilidade total. Cancele quando quiser.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Acesso ao Analytics",
                  "Histórico em Nuvem",
                  "Sincronização de Dispositivos",
                  "Contribui para manter o Focux sem anúncios",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-foreground/80"
                  >
                    <div className="p-1 rounded-full bg-secondary text-muted-foreground">
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe("monthly")}
                disabled={isPremium}
                className={`w-full py-4 rounded-xl font-medium transition-all ${
                  isPremium
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                }`}
              >
                {isPremium ? "Você já é Premium" : "Assinar Agora"}
              </button>
            </div>
          </BlurFade>

          {/* Plano Vitalício */}
          <BlurFade duration={0.8} delay={0.4}>
            <div className="relative h-full flex flex-col p-8 rounded-3xl bg-card border border-premium/30 shadow-2xl shadow-premium/10 hover:border-premium/50 transition-all overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-premium/10 blur-3xl rounded-full"></div>

              <div className="absolute top-0 right-0 m-6">
                <span className="px-3 py-1 rounded-full bg-premium/10 text-premium text-xs font-bold border border-premium/30 flex items-center gap-1">
                  <Zap size={12} fill="currentColor" /> Apoiador Inicial
                </span>
              </div>

              <div className="mb-8 relative">
                <h3 className="text-xl font-medium text-foreground flex items-center gap-2">
                  Vitalício <Crown size={16} className="text-premium" />
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    R$ 34,90
                  </span>
                  <span className="text-subtle">único</span>
                </div>
                <p className="mt-2 text-sm text-premium/80">
                  Pague uma vez, use para sempre. Inclui atualizações futuras.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Todos os recursos do Mensal",
                  "Badge Exclusiva de Apoiador",
                  "Acesso antecipado a novas features",
                  "Prioridade no suporte",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-foreground/80"
                  >
                    <div className="p-1 rounded-full bg-premium/10 text-premium">
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe("vitalicio")}
                disabled={isPremium}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
                  isPremium
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "bg-premium text-background hover:bg-premium/90 shadow-premium/25"
                }`}
              >
                {isPremium
                  ? "Muito obrigado pelo apoio!"
                  : "Garantir Acesso Vitalício"}
              </button>

              <BorderBeam
                size={300}
                duration={12}
                delay={9}
                colorFrom="#fbbf24"
                colorTo="#f59e0b"
              />
            </div>
          </BlurFade>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <UpgradeFAQ />
        </div>

        <BlurFade duration={0.8} delay={0.6}>
          <div className="mt-16 text-center">
            <p className="text-subtle text-sm">
              Dúvidas? Entre em contato ou acesse o{" "}
              <Link href="/blog" className="underline hover:text-foreground">
                Blog
              </Link>{" "}
              para saber mais.
            </p>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <UpgradeContent />
    </Suspense>
  );
}
