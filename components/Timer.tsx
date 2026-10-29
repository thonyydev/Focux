"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { BorderBeam } from "@/components/ui/border-beam";
import { logout } from "@/lib/auth";
import { BlurFade } from "./ui/blur-fade";
import { saveSession } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import TaskList from "@/components/TaskList";
import {
  AMBIENT_LABELS,
  Ambient,
  toAmbient,
  useAmbientSound,
} from "@/lib/useAmbientSound";

type Mode = "focus" | "break" | "longBreak";

const modeEmoji = {
  focus: "🎯",
  break: "☕",
  longBreak: "🌙",
};

const modeText = {
  focus: "Foco",
  break: "Pausa",
  longBreak: "Pausa Longa",
};

const STORAGE_KEY = "focux-timer";

export default function Timer() {
  const { timerSettings, updateTimerSettings, user, preferences, updatePreferences } =
    useAuth();
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(25 * 60); // Default fallback
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [focusCount, setFocusCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    focus: 25,
    break: 5,
    longBreak: 15,
  });

  const modeRef = useRef<Mode>(mode);
  const focusCountRef = useRef<number>(focusCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const activeTaskRef = useRef(activeTaskId);
  const hasTriggeredRef = useRef(false);

  // Atualizar refs
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    focusCountRef.current = focusCount;
  }, [focusCount]);

  useEffect(() => {
    activeTaskRef.current = activeTaskId;
  }, [activeTaskId]);

  // Escolha local vence a salva: visitantes não gravam preferências, mas podem escolher o som.
  const [ambientChoice, setAmbientChoice] = useState<Ambient | null>(null);
  const ambient = ambientChoice ?? toAmbient(preferences.ambientSound);
  useAmbientSound(ambient, running && mode === "focus", preferences.volume);

  const handleLogout = async () => {
    await logout();
    console.log("Usuário deslogado com sucesso");
  };

  const handleOpenSettings = () => {
    setTempSettings({
      focus: Math.floor(timerSettings.focus / 60),
      break: Math.floor(timerSettings.break / 60),
      longBreak: Math.floor(timerSettings.longBreak / 60),
    });
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async () => {
    const newSettings = {
      focus: tempSettings.focus * 60,
      break: tempSettings.break * 60,
      longBreak: tempSettings.longBreak * 60,
    };
    await updateTimerSettings(newSettings);
    setShowSettingsModal(false);

    // Se o timer não estiver rodando, atualiza o tempo atual se estiver no modo correspondente
    // Isso é útil para feedback imediato
    if (!running) {
      setSeconds(newSettings[mode]);
    }
  };

  const handleCancelSettings = () => {
    setShowSettingsModal(false);
  };

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

  // Atualizar seconds quando timerSettings mudar, SE não estiver rodando e não tiver salvo no localStorage (ou seja, comportamento inicial/resetado)
  // Mas cuidado para não sobrescrever o estado atual se estiver no meio de um timer.
  // Vamos simplificar: se carregar settings e não tiver nada salvo/rodando, atualiza.
  useEffect(() => {
    if (isInitialized && !running && !localStorage.getItem(STORAGE_KEY)) {
      setSeconds(timerSettings[mode]);
    }
  }, [timerSettings, isInitialized]);

  // Atualizar título da página dinamicamente
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!running) {
      document.title = "Focux — Pomodoro e Produtividade";
      return;
    }

    const timeText = format(seconds);
    const emoji = modeEmoji[mode];
    const text = modeText[mode];

    document.title = `⏳ [${timeText}] ${emoji} ${text} - Focux`;

    return () => {
      document.title = "Focux — Pomodoro e Produtividade";
    };
  }, [seconds, mode, running]);

  // Som
  const playBeep = () => {
    if (!preferences?.soundEnabled) return;

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
    if (!preferences?.notificationsEnabled) return;

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
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    playBeep();

    if (modeRef.current === "focus") {
      setSessionsCompleted((p) => p + 1);

      // Salvar sessão no Firestore se usuário estiver logado
      if (user) {
        saveSession(user.uid, {
          mode: "focus",
          duration: timerSettings.focus,
          // o Firestore rejeita campos undefined, então só entra se houver tarefa
          ...(activeTaskRef.current && { taskId: activeTaskRef.current }),
        });
      }

      const nextFocus = focusCountRef.current + 1;
      if (nextFocus >= 4) {
        setMode("longBreak");
        setSeconds(timerSettings.longBreak);
        setFocusCount(0);
        TriggerConfetti();
        notify(
          "Pausa Longa!",
          "Você completou 4 sessões. Aproveite uma pausa mais longa!",
        );
      } else {
        setMode("break");
        setSeconds(timerSettings.break);
        setFocusCount(nextFocus);
        notify(
          "Pausa Curta",
          "Relaxe um pouco antes da próxima sessão de foco.",
        );
      }
    } else {
      setMode("focus");
      setSeconds(timerSettings.focus);
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
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setRunning(false);
    setMode("focus");
    setSeconds(timerSettings.focus);
    setFocusCount(0);
    hasTriggeredRef.current = false;
    setShowResetModal(false);
  };

  const resetAll = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleModeChange = (newMode: Mode) => {
    hasTriggeredRef.current = false;
    setMode(newMode);
    setSeconds(timerSettings[newMode]);
  };

  // Atalhos: Espaço inicia/pausa, R reinicia, 1/2/3 troca o modo.
  // Ignora campos de texto e botões (o botão focado já reage ao Espaço sozinho) e os modais abertos.
  useEffect(() => {
    const modeKeys: Record<string, Mode> = {
      "1": "focus",
      "2": "break",
      "3": "longBreak",
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (showSettingsModal || showResetModal) return;
      if ((e.target as Element).closest("input, textarea, select, button, a, [contenteditable]")) return;

      if (e.code === "Space") {
        if (seconds > 0) setRunning((r) => !r);
      } else if (e.key.toLowerCase() === "r") {
        setShowResetModal(true);
      } else if (e.key in modeKeys) {
        handleModeChange(modeKeys[e.key]);
      } else {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Modal de Configurações */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-br from-card to-background border border-input/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            {/* Glow de fundo */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-3xl bg-break rounded-2xl" />

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
              {/* Cabeçalho */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">⚙️</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Configurações
                </h3>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground/80">
                    Foco (minutos)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.focus}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        focus: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-input/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground/80">
                    Pausa Curta (minutos)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.break}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        break: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-input/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground/80">
                    Pausa Longa (minutos)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.longBreak}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        longBreak: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-input/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCancelSettings}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-secondary hover:bg-accent text-foreground font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-gradient-to-br from-card to-background border border-input/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            {/* Glow de fundo */}
            <div className="absolute inset-0 pointer-events-none opacity-10 blur-3xl bg-destructive rounded-2xl" />

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
              {/* Ícone e título */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/20 border border-destructive/50 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">⚠️</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Resetar Timer?
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground text-center">
                Tem certeza que deseja resetar o timer? Todo o progresso atual
                será perdido.
              </p>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-secondary hover:bg-accent text-foreground font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-destructive hover:bg-destructive/90 text-foreground font-semibold shadow-lg shadow-destructive/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Sim, resetar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BlurFade duration={1} delay={0.5}>
        <div className="relative flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-10 rounded-3xl bg-gradient-to-br from-card/80 to-background/80 backdrop-blur-xl border border-input/50 shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden">
          {/* Glow de fundo (não intercepta cliques) */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-10 blur-3xl ${
              mode === "focus"
                ? "bg-primary"
                : mode === "break"
                  ? "bg-break"
                  : "bg-long-break"
            }`}
          />

          {/* Círculo decorativo de fundo (não intercepta cliques) */}
          <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-xl scale-110" />

          {/* Seletor de Modo */}
          <div className="relative flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-background/70 rounded-2xl border border-border/50 shadow-inner w-full">
            <button
              onClick={() => handleModeChange("focus")}
              className={`flex-1 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                mode === "focus"
                  ? "bg-focus text-background shadow-lg shadow-focus/30 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>Foco
            </button>
            <button
              onClick={() => handleModeChange("break")}
              className={`flex-1 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                mode === "break"
                  ? "bg-break text-background shadow-lg shadow-break/30 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="hidden sm:inline">☕ </span>Pausa
            </button>
            <button
              onClick={() => handleModeChange("longBreak")}
              className={`flex-1 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                mode === "longBreak"
                  ? "bg-long-break text-background shadow-lg shadow-long-break/30 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="hidden sm:inline">🌙 </span>Pausa Longa
            </button>
          </div>

          {/* Timer Display com círculo de progresso visual */}
          <div className="relative flex items-center justify-center w-full">
            {/* Círculo decorativo de fundo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-xl scale-110" />

            {/* Timer */}
            <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 py-6 sm:py-0">
              <div className="text-7xl sm:text-8xl md:text-9xl font-bold tabular-nums tracking-tight bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                {format(seconds)}
              </div>
              <div
                className={`text-xs sm:text-sm font-medium tracking-widest uppercase ${
                  mode === "focus"
                    ? "text-primary"
                    : mode === "break"
                      ? "text-break"
                      : "text-long-break"
                }`}
              >
                {mode === "focus"
                  ? "Modo Foco"
                  : mode === "break"
                    ? "Pausa Curta"
                    : "Pausa Longa"}
              </div>
            </div>
          </div>

          {/* Indicador de Progresso */}
          <div className="flex gap-2 sm:gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 ${
                  i < focusCount
                    ? "bg-focus shadow-lg shadow-focus/60 scale-110"
                    : "bg-secondary border border-input"
                }`}
              >
                {i < focusCount && (
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                )}
              </div>
            ))}
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setRunning((r) => !r)}
              aria-keyshortcuts="Space"
              disabled={seconds === 0}
              className={`w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl ${
                running
                  ? "bg-destructive text-foreground hover:bg-destructive/90 shadow-destructive/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30"
              }`}
            >
              {running ? "⏸ Pausar" : "▶ Iniciar"}
            </button>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={reset}
                aria-keyshortcuts="R"
                className="flex-1 sm:flex-none px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-br from-secondary to-card text-foreground hover:from-accent hover:to-secondary transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold border border-input/50 shadow-lg text-xl"
              >
                ↻
              </button>
              <button
                onClick={handleOpenSettings}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-br from-secondary to-card text-foreground hover:from-accent hover:to-secondary transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold border border-input/50 shadow-lg text-xl"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Som ambiente */}
          <label className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span aria-hidden="true">🎧</span>
            <select
              aria-label="Som ambiente (toca durante o foco)"
              value={ambient}
              onChange={(e) => {
                const value = toAmbient(e.target.value);
                setAmbientChoice(value);
                updatePreferences({ ambientSound: value });
              }}
              className="rounded-lg bg-card border border-input px-2 py-1 text-foreground/90 focus:outline-none focus:border-muted-foreground/50"
            >
              {Object.entries(AMBIENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {/* Estatísticas */}
          <div className="relative flex flex-col items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-card/50 border border-border/50">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
              <span className="text-foreground font-bold">{focusCount}</span> de{" "}
              <span className="text-foreground font-bold">4</span> sessões até a
              pausa longa
            </div>
          </div>

          <p className="hidden sm:block text-xs text-subtle text-center">
            Atalhos: Espaço inicia/pausa · R reinicia · 1, 2, 3 trocam o modo
          </p>

          <BorderBeam duration={10} size={200} />
        </div>
      </BlurFade>

      <TaskList activeTaskId={activeTaskId} onSelect={setActiveTaskId} />
    </>
  );
}
