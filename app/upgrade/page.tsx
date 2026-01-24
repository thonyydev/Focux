"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";
import { AuroraText } from "@/components/ui/aurora-text";

export default function UpgradePage() {
  const { user, isPremium, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-950">
      <BlurFade duration={1}>
        <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl p-6 space-y-6 border border-neutral-800">
          <h1 className="text-2xl font-bold text-center text-white">
            <AuroraText colors={["#16a34a", "#84cc16", "#facc15", "#f97316"]}>Premium (Em Breve)</AuroraText>
          </h1>

          <p className="text-center text-neutral-400 text-sm">
            O <strong>Focux</strong> continuará <strong>100% gratuito</strong> para usar o timer,
            sem anúncios e sem limitações.
            <br />
            <br />
            O plano Premium será apenas um <strong>extra opcional</strong> para
            quem quiser mais recursos e apoiar o desenvolvimento do projeto 💚
          </p>

          <div className="bg-neutral-800/50 rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-2">
              Recursos planejados para o Premium:
            </p>

            <ul className="space-y-2 text-sm text-neutral-400">
              <li>⭐ Histórico salvo na conta</li>
              <li>⭐ Sincronização entre dispositivos</li>
              <li>⭐ Mais opções de personalização</li>
              <li>⭐ Novas funções avançadas no timer</li>
            </ul>
          </div>

          <div className="text-center text-sm text-neutral-500">
            O lançamento do Premium acontece em breve 🚀
          </div>

          {user ? (
            isPremium ? (
              <div className="text-center text-green-500 font-medium">
                Você já é Premium 💚
              </div>
            ) : (
              <button
                disabled
                className="w-full py-2 rounded-xl bg-neutral-700 text-neutral-400 font-medium cursor-not-allowed"
              >
                Premium em breve
              </button>
            )
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-neutral-400">
                Faça login para acompanhar o lançamento
              </p>

              <Link
                href="/auth/login"
                className="block w-full text-center py-2 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
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
