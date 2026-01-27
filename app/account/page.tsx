"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";
import { AuroraText } from "@/components/ui/aurora-text";

export default function AccountPage() {
  const { user, isPremium, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 bg-neutral-950">
        Carregando...
      </div>
    );
  }

  if (!user) {
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-950">
      <BlurFade duration={1}>
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <h1 className="text-xl font-semibold text-center text-white">
            Minha conta
          </h1>

          {/* Email */}
          <div className="text-sm text-neutral-400">
            Email
            <div className="mt-1 text-white font-medium">{user.email}</div>
          </div>

          {/* Plano */}
          <div className="text-sm text-neutral-400">
            Plano
            <div
              className={`mt-1 font-medium ${
                isPremium ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {isPremium ? (
                <AuroraText
                  colors={["#22c55e", "#4ade80", "#16a34a", "#10b981"]}
                  speed={3}
                >
                  Premium
                </AuroraText>
              ) : (
                <span>Gratuito</span>
              )}
            </div>
          </div>

          {/* Upgrade */}
          <button
            onClick={() => router.push("/upgrade")}
            disabled={isPremium}
            className={`
    w-full py-2 rounded-lg font-semibold text-white transition
    ${
      isPremium
        ? "bg-green-500/20 cursor-not-allowed"
        : "bg-green-500 hover:bg-green-600"
    }
  `}
          >
            Desbloquear Premium
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-white cursor-pointer"
          >
            Sair da conta
          </button>
          <BorderBeam duration={10} size={200} />
        </div>
      </BlurFade>
      <LightRays />
    </main>
  );
}
