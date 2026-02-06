"use client";

import { useMemo } from "react";
import { SessionData } from "@/lib/db";
import { differenceInCalendarDays } from "date-fns";

interface StatsCardsProps {
  sessions: SessionData[];
}

export function StatsCards({ sessions }: StatsCardsProps) {
  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (acc, s) => acc + (s.duration || 0) / 60,
      0,
    );

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.round(totalMinutes % 60);

    // Calculate Streak (Simplified version)
    // In a real app we'd need more robust logic for gaps
    // This just counts unique days with sessions
    const daysWithSessions = new Set(
      sessions.map((s) => {
        const date = s.completedAt.toDate
          ? s.completedAt.toDate()
          : new Date(s.completedAt);
        return date.toDateString();
      }),
    );

    return {
      hours: totalHours,
      minutes: remainingMinutes,
      sessions: sessions.length,
      days: daysWithSessions.size,
    };
  }, [sessions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-neutral-400">
            Total Focado
          </h3>
          <span className="text-xl">⏱️</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.hours}h {stats.minutes}m
        </div>
        <p className="text-xs text-neutral-500">
          +20% em relação à semana passada
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-neutral-400">
            Sessões
          </h3>
          <span className="text-xl">🎯</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.sessions}</div>
        <p className="text-xs text-neutral-500">Sessões completadas</p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-neutral-400">
            Dias Ativos
          </h3>
          <span className="text-xl">🔥</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.days}</div>
        <p className="text-xs text-neutral-500">Dias com foco registrado</p>
      </div>
    </div>
  );
}
