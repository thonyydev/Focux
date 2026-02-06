"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, SessionData } from "@/lib/db";
import { Flame, Clock, Target } from "lucide-react";

export function AccountStats() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    totalSessions: 0,
    streak: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      const sessions = await getUserSessions(user.uid);

      const totalMinutes = sessions.reduce(
        (acc, s) => acc + s.duration / 60,
        0,
      );

      // Simple Streak Calculation (days in a row)
      // This is a simplified version, ideally backend handles this
      const dates = sessions.map((s) => s.completedAt?.toDate().toDateString());
      const uniqueDates = Array.from(new Set(dates)).filter(Boolean);

      setStats({
        totalMinutes: Math.floor(totalMinutes),
        totalSessions: sessions.length,
        streak: uniqueDates.length,
      });
      setLoading(false);
    }

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="h-24 bg-neutral-900/50 rounded-2xl animate-pulse" />;
  }

  // Level System Logic
  const getLevel = (minutes: number) => {
    if (minutes < 60)
      return {
        name: "Iniciante",
        color: "text-neutral-400",
        bg: "bg-neutral-800",
      };
    if (minutes < 300)
      return { name: "Focado", color: "text-blue-400", bg: "bg-blue-400/10" };
    if (minutes < 1000)
      return {
        name: "Veterano",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
      };
    if (minutes < 5000)
      return {
        name: "Mestre",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
      };
    return {
      name: "Lendário",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    };
  };

  const level = getLevel(stats.totalMinutes);

  const items = [
    {
      label: "Nível Atual",
      value: level.name,
      icon: Target,
      color: level.color,
      bg: level.bg,
    },
    {
      label: "Horas Totais",
      value: `${Math.floor(stats.totalMinutes / 60)}h`,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Dias Ativos",
      value: stats.streak,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-neutral-900 transition"
        >
          <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
            <item.icon size={18} />
          </div>
          <div>
            <div
              className={`text-lg font-bold leading-none ${i === 0 ? item.color : "text-white"}`}
            >
              {item.value}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
