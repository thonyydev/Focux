"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";

export default function UpgradePage() {
  const { user, isPremium, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-950">
      <BlurFade duration={1}>
        <div className="w-full max-w-md bg-neutral-900 rounded-xl p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-center text-white">
            Plano Premium
          </h1>

          <p className="text-center text-neutral-400">
            Desbloqueie recursos extras e ajude a manter o projeto vivo 🚀
          </p>

          <ul className="space-y-3 text-sm text-neutral-400">
            <li>✅ Histórico salvo na conta</li>
            <li>✅ Sincronização entre dispositivos</li>
            <li>✅ Recursos exclusivos no timer</li>
            <li>✅ Apoio ao desenvolvimento</li>
          </ul>

          {user ? (
            isPremium ? (
              <div className="text-center text-green-500 font-medium">
                Você já é Premium 💚
              </div>
            ) : (
              <button
                className="w-full py-2 rounded bg-white text-black font-medium hover:opacity-90 transition"
                onClick={() => alert("Stripe entra aqui")}
              >
                Assinar Premium
              </button>
            )
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-neutral-400">
                Faça login para assinar o Premium
              </p>

              <Link
                href="/auth/login"
                className="block w-full text-center py-2 rounded bg-white text-black font-medium"
              >
                Entrar / Criar conta
              </Link>
            </div>
          )}
          <BorderBeam duration={10} size={200} />
        </div>
      </BlurFade>
      <LightRays />
    </div>
  );
}
