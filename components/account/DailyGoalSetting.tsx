"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function DailyGoalSetting() {
  const { preferences, updatePreferences } = useAuth();
  const goal = preferences.dailyGoalMinutes;
  // Rascunho enquanto o usuário digita; null = mostra a meta salva.
  const [draft, setDraft] = useState<string | null>(null);

  const save = () => {
    const minutes = Math.min(
      1440,
      Math.max(5, Math.round(Number(draft)) || goal),
    );
    setDraft(null);
    if (minutes !== goal) updatePreferences({ dailyGoalMinutes: minutes });
  };

  return (
    <div className="flex items-center justify-between p-4 text-foreground/80">
      <label htmlFor="daily-goal" className="flex items-center gap-3">
        <Target size={18} />
        <span>Meta diária (min)</span>
      </label>
      <input
        id="daily-goal"
        type="number"
        inputMode="numeric"
        min={5}
        max={1440}
        step={5}
        value={draft ?? String(goal)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className="w-20 rounded-lg bg-secondary border border-input px-2 py-1 text-right text-foreground focus:outline-none focus:border-muted-foreground/50"
      />
    </div>
  );
}
