"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";
import { AuroraText } from "@/components/ui/aurora-text";
import { Check, Crown, Zap, ChevronLeft } from "lucide-react";
import { UpgradeFAQ } from "@/components/UpgradeFAQ";

export default function UpgradePage() {
  const { user, isPremium, loading } = useAuth();

  const handleSubscribe = (plan: string) => {
    // Placeholder for payment integration
    console.log(`User selected plan: ${plan}`);
    alert(`Integração de pagamento em breve! Plano escolhido: ${plan}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 relative overflow-hidden">
      <LightRays className="opacity-40" />

      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white transition-colors text-sm"
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
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Desbloqueie seu potencial máximo com Analytics avançado, histórico
              em nuvem ilimitado e muito mais.
            </p>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <BlurFade duration={0.8} delay={0.2}>
            <div className="relative h-full flex flex-col p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-neutral-200">Mensal</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">R$ 9,90</span>
                  <span className="text-neutral-500">/mês</span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">
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
                    className="flex items-center gap-3 text-sm text-neutral-300"
                  >
                    <div className="p-1 rounded-full bg-neutral-800 text-neutral-400">
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe("mensal")}
                disabled={isPremium}
                className={`w-full py-4 rounded-xl font-medium transition-all ${
                  isPremium
                    ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {isPremium ? "Plano Atual (ou Superior)" : "Assinar Agora"}
              </button>
            </div>
          </BlurFade>

          {/* Plano Vitalício */}
          <BlurFade duration={0.8} delay={0.4}>
            <div className="relative h-full flex flex-col p-8 rounded-3xl bg-neutral-900 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 hover:border-yellow-500/40 transition-all overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>

              <div className="absolute top-0 right-0 m-6">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 flex items-center gap-1">
                  <Zap size={12} fill="currentColor" /> EARLY SUPPORTER
                </span>
              </div>

              <div className="mb-8 relative">
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                  Vitalício <Crown size={16} className="text-yellow-500" />
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    R$ 34,90
                  </span>
                  <span className="text-neutral-500">único</span>
                </div>
                <p className="mt-2 text-sm text-yellow-400/80">
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
                    className="flex items-center gap-3 text-sm text-neutral-300"
                  >
                    <div className="p-1 rounded-full bg-yellow-500/10 text-yellow-500">
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
                    ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-orange-500/20"
                }`}
              >
                {isPremium ? "Você já é Premium" : "Garantir Acesso Vitalício"}
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
            <p className="text-neutral-500 text-sm">
              Dúvidas? Entre em contato ou acesse o{" "}
              <Link href="/blog" className="underline hover:text-white">
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
