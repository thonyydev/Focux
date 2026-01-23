"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "./ui/blur-fade";

type Mode = "focus" | "break" | "longBreak";

const TIMES = {
  focus: 25 * 60, // 25 minutos
  break: 5 * 60, // 5 minutos
  longBreak: 15 * 60, // 15 minutos
};

const STORAGE_KEY = "focux-timer";

export default function Timer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(TIMES.focus);
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [focusCount, setFocusCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const modeRef = useRef<Mode>(mode);
  const focusCountRef = useRef<number>(focusCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef(false);

  // Atualizar refs
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    focusCountRef.current = focusCount;
  }, [focusCount]);

  // Carregar estado salvo (apenas no cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setIsInitialized(true);
      return;
    }

    try {
      const data = JSON.parse(saved);
      if (data.mode) setMode(data.mode);
      if (typeof data.seconds === "number") setSeconds(data.seconds);
      if (typeof data.running === "boolean") setRunning(data.running);
      if (typeof data.sessionsCompleted === "number")
        setSessionsCompleted(data.sessionsCompleted);
      if (typeof data.focusCount === "number") setFocusCount(data.focusCount);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Salvar estado (apenas após inicialização)
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        seconds,
        running,
        sessionsCompleted,
        focusCount,
      }),
    );
  }, [mode, seconds, running, sessionsCompleted, focusCount, isInitialized]);

  // Som
  const playBeep = () => {
    try {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 1050;
      g.gain.value = 0.1;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 200);
    } catch (err) {
      console.error("Erro ao tocar som:", err);
    }
  };

  // Notificação
  const notify = (title: string, body?: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification(title, { body, icon: "/favicon.ico" });
        }
      });
    }
  };

  // Transição de fases
  const nextPhase = () => {
    playBeep();

    if (modeRef.current === "focus") {
      setSessionsCompleted((p) => p + 1);

      const nextFocus = focusCountRef.current + 1;
      if (nextFocus >= 4) {
        setMode("longBreak");
        setSeconds(TIMES.longBreak);
        setFocusCount(0);
        TriggerConfetti();
        notify(
          "Pausa Longa!",
          "Você completou 4 sessões. Aproveite uma pausa mais longa!",
        );
      } else {
        setMode("break");
        setSeconds(TIMES.break);
        setFocusCount(nextFocus);
        notify(
          "Pausa Curta",
          "Relaxe um pouco antes da próxima sessão de foco.",
        );
      }
    } else {
      setMode("focus");
      setSeconds(TIMES.focus);
      notify(
        "Hora de Focar!",
        "Vamos lá! Nova sessão de foco começando agora.",
      );
    }

    setRunning(false);
  };

  const SideCannons = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const Fireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const TriggerConfetti = () => {
    SideCannons();
    Fireworks();
  };

  // Timer principal
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset flag quando timer inicia
    hasTriggeredRef.current = false;

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // Para o timer ANTES de chamar nextPhase
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Agenda nextPhase para o próximo tick para evitar problemas de estado
          setTimeout(() => nextPhase(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const reset = () => {
    setRunning(false);
    setMode("focus");
    setSeconds(TIMES.focus);
    setFocusCount(0);
    hasTriggeredRef.current = false;
  };

  const resetAll = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setMode("focus");
    setSeconds(TIMES.focus);
    setRunning(false);
    setSessionsCompleted(0);
    setFocusCount(0);
    hasTriggeredRef.current = false;
  };

  const handleModeChange = (newMode: Mode) => {
    hasTriggeredRef.current = false;
    setMode(newMode);
    setSeconds(TIMES[newMode]);
    setRunning(true);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-400">Carregando...</div>
      </div>
    );
  }

  return (
    <BlurFade duration={1} delay={0.5}>
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 shadow-2xl max-w-lg w-full">
        {/* Seletor de Modo */}
        <div className="flex gap-2 p-1 bg-neutral-950/50 rounded-lg">
          <button
            onClick={() => handleModeChange("focus")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "focus"
                ? "bg-green-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Foco
          </button>
          <button
            onClick={() => handleModeChange("break")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "break"
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pausa
          </button>
          <button
            onClick={() => handleModeChange("longBreak")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "longBreak"
                ? "bg-purple-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pausa Longa
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-8xl font-mono font-bold tracking-wider text-white drop-shadow-lg">
          {format(seconds)}
        </div>

        {/* Indicador de Progresso */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < focusCount
                  ? "bg-green-500 shadow-lg shadow-green-500/50"
                  : "bg-neutral-800"
              }`}
            />
          ))}
        </div>

        {/* Controles */}
        <div className="flex gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={seconds === 0}
            className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              running
                ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30"
            }`}
          >
            {running ? "Pausar" : "Iniciar"}
          </button>

          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-all transform hover:scale-105 font-semibold"
          >
            Resetar
          </button>
        </div>

        {/* Estatísticas */}
        <div className="flex flex-col items-center gap-2 text-neutral-300">
          <div className="text-sm text-neutral-500">
            {focusCount} de 4 sessões até a pausa longa
          </div>
        </div>
        <BorderBeam duration={10} size={200} />
      </div>
    </BlurFade>
  );
}
