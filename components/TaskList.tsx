"use client";

import { useEffect, useState } from "react";
import { Check, Crosshair, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  addTask,
  deleteTask,
  setTaskDone,
  subscribeTasks,
  Task,
} from "@/lib/db";
import { useSessions } from "@/lib/useSessions";

type Props = {
  activeTaskId: string | null;
  onSelect: (taskId: string | null) => void;
};

// Só para usuários logados: convidado não tem onde guardar as tarefas.
export default function TaskList({ activeTaskId, onSelect }: Props) {
  const { user } = useAuth();
  const uid = user?.uid;
  const sessions = useSessions(uid);
  // Guarda o dono junto das tarefas: ao trocar de usuário não aparecem as do anterior.
  const [loaded, setLoaded] = useState<{ uid?: string; tasks: Task[] }>({
    tasks: [],
  });
  const tasks = loaded.uid === uid ? loaded.tasks : [];
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!uid) return;
    return subscribeTasks(uid, (list) => setLoaded({ uid, tasks: list }));
  }, [uid]);

  if (!uid) return null;

  const run = async (action: Promise<unknown>) => {
    try {
      await action;
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Não foi possível salvar a tarefa. Tente novamente.");
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    setTitle("");
    run(addTask(uid, text));
  };

  const toggle = (task: Task) => {
    if (!task.done && task.id === activeTaskId) onSelect(null);
    run(setTaskDone(uid, task.id, !task.done));
  };

  const remove = (task: Task) => {
    if (task.id === activeTaskId) onSelect(null);
    run(deleteTask(uid, task.id));
  };

  return (
    <section
      aria-label="Tarefas"
      className="w-full max-w-sm sm:max-w-md md:max-w-lg mt-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4"
    >
      <form onSubmit={add} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="No que você vai focar?"
          aria-label="Nova tarefa"
          className="flex-1 min-w-0 rounded-xl bg-neutral-950/70 border border-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold text-white transition"
        >
          Adicionar
        </button>
      </form>

      {tasks.length > 0 && (
        <ul className="mt-3 space-y-2">
          {tasks.map((task) => {
            const active = task.id === activeTaskId;
            const pomodoros = sessions.filter(
              (s) => s.taskId === task.id,
            ).length;

            return (
              <li
                key={task.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                  active
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-neutral-800"
                }`}
              >
                <button
                  onClick={() => toggle(task)}
                  role="checkbox"
                  aria-checked={task.done}
                  aria-label={`Marcar "${task.title}" como ${task.done ? "pendente" : "concluída"}`}
                  className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                    task.done
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {task.done && <Check size={14} />}
                </button>

                <span
                  className={`flex-1 min-w-0 truncate ${
                    task.done ? "line-through text-neutral-500" : "text-neutral-200"
                  }`}
                >
                  {task.title}
                </span>

                {pomodoros > 0 && (
                  <span
                    className="shrink-0 text-xs text-neutral-400"
                    title="Sessões de foco nesta tarefa"
                  >
                    🍅 {pomodoros}
                  </span>
                )}

                {!task.done && (
                  <button
                    onClick={() => onSelect(active ? null : task.id)}
                    aria-pressed={active}
                    aria-label={`${active ? "Parar de focar" : "Focar"} em "${task.title}"`}
                    title={active ? "Parar de focar nesta" : "Focar nesta tarefa"}
                    className={`shrink-0 p-1 rounded-md transition ${
                      active
                        ? "text-green-400"
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    <Crosshair size={16} />
                  </button>
                )}

                <button
                  onClick={() => remove(task)}
                  aria-label={`Excluir "${task.title}"`}
                  title="Excluir"
                  className="shrink-0 p-1 rounded-md text-neutral-500 hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
