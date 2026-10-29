"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, SessionData } from "@/lib/db";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { StatsCards } from "@/components/analytics/StatsCards";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LightRays } from "@/components/ui/light-rays";
import { BorderBeam } from "@/components/ui/border-beam";

export default function AnalyticsPage() {
  const { user, loading, isPremium } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setFetching(true);
        const data = await getUserSessions(user.uid);
        setSessions(data);
        setFetching(false);
      } else if (!loading) {
        setFetching(false);
      }
    }

    fetchData();
  }, [user, loading]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando dados...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">
          Faça login para ver suas estatísticas.
        </p>
        <Button asChild>
          <Link href="/auth/login">Entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Acompanhe seu progresso e produtividade.
            </p>
          </div>
        </div>

        {/* Conteúdo com verificação Premium */}
        <div className="relative">
          {/* Overlay de Bloqueio Premium */}
          {!isPremium && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md rounded-3xl border border-white/5">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-md text-center space-y-4">
                <div className="w-16 h-16 bg-premium rounded-full flex items-center justify-center mx-auto shadow-lg shadow-premium/20">
                  <span className="text-3xl">👑</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Recurso Premium
                </h2>
                <p className="text-muted-foreground">
                  Desbloqueie estatísticas detalhadas, gráficos de desempenho e
                  veja seu histórico completo.
                </p>
                <Link
                  href="/upgrade"
                  className="block w-full py-3 px-6 rounded-xl bg-premium text-background font-bold hover:opacity-90 transition-opacity shadow-lg shadow-premium/25"
                >
                  Seja Premium
                </Link>
              </div>
            </div>
          )}

          <div
            className={
              !isPremium
                ? "opacity-50 pointer-events-none select-none blur-sm transition-all duration-500"
                : ""
            }
          >
            <BlurFade duration={0.5}>
              <StatsCards sessions={sessions} />
            </BlurFade>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <BlurFade duration={0.5} delay={0.2} className="lg:col-span-2">
                <div className="bg-card/50 border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Foco Semanal
                  </h2>
                  <WeeklyChart sessions={sessions} />
                </div>
              </BlurFade>

              <BlurFade duration={0.5} delay={0.4}>
                <div className="bg-card/50 border border-border rounded-2xl p-6 h-full">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Histórico Recente
                  </h2>
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {session.mode === "focus"
                              ? "Foco"
                              : session.mode === "break"
                                ? "Pausa"
                                : "Pausa Longa"}
                          </span>
                          <span className="text-xs text-subtle">
                            {session.completedAt?.toDate
                              ? session.completedAt
                                  .toDate()
                                  .toLocaleDateString()
                              : "Hoje"}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-foreground/80">
                          {Math.floor(session.duration / 60)}m
                        </span>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <p className="text-sm text-subtle text-center py-4">
                        Nenhuma sessão registrada.
                      </p>
                    )}
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
