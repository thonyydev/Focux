"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, SessionData } from "@/lib/db";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { StatsCards } from "@/components/analytics/StatsCards";
import { BlurFade } from "@/components/ui/blur-fade";
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Carregando dados...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-4">
        <p className="text-neutral-400">
          Faça login para ver suas estatísticas.
        </p>
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-white text-black rounded-lg"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-neutral-400">
              Acompanhe seu progresso e produtividade.
            </p>
          </div>
        </div>

        {/* Conteúdo com verificação Premium */}
        <div className="relative">
          {/* Overlay de Bloqueio Premium */}
          {!isPremium && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/60 backdrop-blur-md rounded-3xl border border-white/5">
              <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl max-w-md text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
                  <span className="text-3xl">👑</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Recurso Premium
                </h2>
                <p className="text-neutral-400">
                  Desbloqueie estatísticas detalhadas, gráficos de desempenho e
                  veja seu histórico completo.
                </p>
                <Link
                  href="/upgrade"
                  className="block w-full py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/20"
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
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Foco Semanal
                  </h2>
                  <WeeklyChart sessions={sessions} />
                </div>
              </BlurFade>

              <BlurFade duration={0.5} delay={0.4}>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 h-full">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Histórico Recente
                  </h2>
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white capitalize">
                            {session.mode === "focus"
                              ? "Foco"
                              : session.mode === "break"
                                ? "Pausa"
                                : "Pausa Longa"}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {session.completedAt?.toDate
                              ? session.completedAt
                                  .toDate()
                                  .toLocaleDateString()
                              : "Hoje"}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-neutral-300">
                          {Math.floor(session.duration / 60)}m
                        </span>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <p className="text-sm text-neutral-500 text-center py-4">
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
