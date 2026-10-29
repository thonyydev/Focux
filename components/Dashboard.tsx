"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import Timer from "@/components/Timer";
import { DailyProgress } from "@/components/DailyProgress";
import TaskList from "@/components/TaskList";

// Logado: timer à esquerda, meta e tarefas numa coluna ao lado. Visitante: só o timer.
export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  return (
    <div
      className={`relative z-10 w-full mx-auto px-4 py-12 ${user ? "max-w-5xl" : "max-w-lg"}`}
    >
      <Header />

      {/* Invisível até o login resolver, para o layout não pular de uma coluna para duas. */}
      <div
        className={`${loading ? "invisible " : ""}${
          user ? "lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 lg:items-start" : ""
        }`}
      >
        <div className="flex flex-col items-center">
          <Timer activeTaskId={activeTaskId} />
          <p className="hidden sm:block mt-4 text-xs text-subtle text-center">
            Atalhos: Espaço inicia/pausa · R reinicia · 1, 2, 3 trocam o modo
          </p>
        </div>

        {user && (
          <aside className="mt-6 lg:mt-0 space-y-4">
            <DailyProgress />
            <TaskList activeTaskId={activeTaskId} onSelect={setActiveTaskId} />
          </aside>
        )}
      </div>
    </div>
  );
}
