"use client";

import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSessions } from "@/lib/useSessions";
import { currentStreak, focusMinutesToday } from "@/lib/stats";

export function DailyProgress() {
  const { user, preferences } = useAuth();
  const sessions = useSessions(user?.uid);

  if (!user) return null;

  const goal = preferences.dailyGoalMinutes;
  const minutes = Math.floor(focusMinutesToday(sessions));
  const streak = currentStreak(sessions);
  const percent = Math.min(100, (minutes / goal) * 100);

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-4 px-4 sm:px-0">
      <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-400 mb-2">
        <span>
          Hoje: {minutes} / {goal} min{minutes >= goal && " 🎉"}
        </span>
        <span className="flex items-center gap-1">
          <Flame
            size={14}
            className={streak > 0 ? "text-orange-400" : "text-neutral-600"}
          />
          {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Meta diária de foco"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(minutes, goal)}
        className="h-1.5 rounded-full bg-neutral-800 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
