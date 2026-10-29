"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { BlurFade } from "@/components/ui/blur-fade";
import { LightRays } from "@/components/ui/light-rays";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  Zap,
  Settings,
  LogOut,
  ArrowUpRight,
  Crown,
  CreditCard,
  Bell,
  Volume2,
} from "lucide-react";
import { ProfileHeader } from "@/components/account/ProfileHeader";
import { AccountStats } from "@/components/account/AccountStats";
import { DailyGoalSetting } from "@/components/account/DailyGoalSetting";
import { BorderBeam } from "@/components/ui/border-beam";

export default function AccountPage() {
  const { user, isPremium, plan, loading, preferences, updatePreferences } =
    useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-background">
        Carregando...
      </div>
    );
  }

  if (!user) {
    setTimeout(() => {
      router.push("/auth/register");
    }, 500);
    return null;
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
      <LightRays className="opacity-30" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie seu perfil e assinatura</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile & Menu */}
          <div className="space-y-6">
            <BlurFade duration={0.5}>
              {/* Profile Info */}
              <ProfileHeader />
            </BlurFade>

            {/* Menu */}
            <BlurFade duration={0.5} delay={0.1}>
              <div className="bg-card/50 border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Configurações
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  <div
                    onClick={() =>
                      updatePreferences({
                        soundEnabled: !preferences.soundEnabled,
                      })
                    }
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                      <Volume2 size={18} />
                      <span>Sons e Efeitos</span>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${preferences.soundEnabled ? "bg-primary" : "bg-accent"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${preferences.soundEnabled ? "right-1" : "left-1"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    onClick={async () => {
                      if (!preferences.notificationsEnabled) {
                        const permission =
                          await Notification.requestPermission();
                        if (permission === "granted") {
                          updatePreferences({ notificationsEnabled: true });
                          new Notification("Focux", {
                            body: "Notificações ativadas com sucesso!",
                          });
                        } else {
                          alert(
                            "Você precisa permitir notificações no navegador para ativar esta função.",
                          );
                        }
                      } else {
                        updatePreferences({ notificationsEnabled: false });
                      }
                    }}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                      <Bell size={18} />
                      <span>Notificações</span>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${preferences.notificationsEnabled ? "bg-primary" : "bg-accent"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${preferences.notificationsEnabled ? "right-1" : "left-1"}`}
                      ></div>
                    </div>
                  </div>
                  <DailyGoalSetting />
                </div>
              </div>
            </BlurFade>

            <BlurFade duration={0.5} delay={0.2}>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border text-muted-foreground hover:text-destructive hover:bg-red-950/20 hover:border-red-900/50 transition-all font-medium"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </BlurFade>
          </div>

          {/* Right Column: Stats & Plan */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats Overview */}
            <BlurFade duration={0.5} delay={0.1}>
              <AccountStats />
            </BlurFade>

            {/* Subscription Card */}
            <BlurFade duration={0.5} delay={0.2}>
              <div className="relative bg-card/80 border border-border rounded-2xl p-6 overflow-hidden">
                {plan === "lifetime" && (
                  <BorderBeam
                    size={150}
                    duration={12}
                    colorFrom="#facc15"
                    colorTo="#a16207"
                  />
                )}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Plano Atual
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl font-bold ${isPremium ? "text-foreground" : "text-foreground/90"}`}
                      >
                        {isPremium
                          ? plan === "lifetime"
                            ? "Vitalício ⚡"
                            : "Premium Mensal"
                          : "Gratuito"}
                      </span>
                      {plan === "lifetime" && (
                        <span className="px-2 py-0.5 rounded-full bg-premium/10 text-premium text-xs font-bold border border-premium/20 uppercase tracking-wider">
                          Apoiador Inicial
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-full ${isPremium ? "bg-premium text-background shadow-lg shadow-premium/20" : "bg-secondary text-subtle"}`}
                  >
                    {isPremium ? (
                      <Crown size={24} fill="currentColor" />
                    ) : (
                      <CreditCard size={24} />
                    )}
                  </div>
                </div>

                {isPremium ? (
                  <div className="bg-background/50 rounded-xl p-4 border border-border flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {plan === "lifetime"
                        ? "Você possui acesso ilimitado a todas as funcionalidades."
                        : "Sua assinatura renova automaticamente."}
                    </div>
                    {plan !== "lifetime" && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/portal", {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${await user.getIdToken()}`,
                              },
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else
                              alert(
                                "Erro ao abrir portal: " +
                                  (data.error || "Desconhecido"),
                              );
                          } catch (e) {
                            console.error(e);
                            alert("Erro de conexão");
                          }
                        }}
                        className="text-sm text-foreground underline hover:text-foreground/80"
                      >
                        Gerenciar
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className="bg-gradient-to-r from-secondary to-secondary/50 rounded-xl p-4 border border-input flex items-center justify-between group cursor-pointer hover:border-muted-foreground/40 transition"
                    onClick={() => router.push("/upgrade")}
                  >
                    <div>
                      <p className="text-foreground font-medium">
                        Faça upgrade para Premium
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desbloqueie Analytics e Histórico
                      </p>
                    </div>
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-105 transition-transform">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                )}
              </div>
            </BlurFade>

            {/* Quick Links / Danger Zone */}
            <BlurFade duration={0.5} delay={0.3}>
              <div className="bg-card/50 border border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-foreground font-medium">Em breve</span>
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Zona de Perigo
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/80 font-medium">
                      Deletar conta
                    </p>
                    <p className="text-xs text-subtle">
                      Esta ação é irreversível e excluirá todos os seus dados.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition text-sm font-medium">
                    Deletar conta
                  </button>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </main>
  );
}
