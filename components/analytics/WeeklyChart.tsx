"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { SessionData } from "@/lib/db";

interface WeeklyChartProps {
  sessions: SessionData[];
}

export function WeeklyChart({ sessions }: WeeklyChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now, { locale: ptBR });
    const end = endOfWeek(now, { locale: ptBR });
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const daySessions = sessions.filter((s) => {
        if (!s.completedAt) return false;
        // Handle Firestore Timestamp or Date object
        const date = s.completedAt.toDate
          ? s.completedAt.toDate()
          : new Date(s.completedAt);
        return isSameDay(date, day);
      });

      const totalMinutes = daySessions.reduce(
        (acc, s) => acc + (s.duration || 0) / 60,
        0,
      );

      return {
        name: format(day, "EEE", { locale: ptBR }),
        minutes: Math.round(totalMinutes),
        fullDate: format(day, "d 'de' MMMM", { locale: ptBR }),
      };
    });
  }, [sessions]);

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#525252"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#525252"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}m`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-neutral-500">
                          {payload[0].payload.fullDate}
                        </span>
                        <span className="font-bold text-neutral-50">
                          {payload[0].value} minutos
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="minutes"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
