"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export type TimerSettings = {
  focus: number;
  break: number;
  longBreak: number;
};

const GUEST_SETTINGS_KEY = "focux-guest-settings";

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  premiumLoading: boolean;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: TimerSettings) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  premiumLoading: true,
  timerSettings: DEFAULT_SETTINGS,
  updateTimerSettings: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(DEFAULT_SETTINGS);

  // 🔐 Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ⭐ User Data (Premium + Settings) realtime
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      // Carregar configurações de convidado do localStorage
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(GUEST_SETTINGS_KEY);
        if (saved) {
          try {
            setTimerSettings(JSON.parse(saved));
          } catch (e) {
            console.error("Erro ao carregar settings:", e);
            setTimerSettings(DEFAULT_SETTINGS);
          }
        } else {
          setTimerSettings(DEFAULT_SETTINGS);
        }
      } else {
        setTimerSettings(DEFAULT_SETTINGS);
      }
      setPremiumLoading(false);
      return;
    }

    setPremiumLoading(true);

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsPremium(!!data.isPremium);
        if (data.timerSettings) {
          setTimerSettings(data.timerSettings);
        } else {
          setTimerSettings(DEFAULT_SETTINGS);
        }
      } else {
        setIsPremium(false);
        setTimerSettings(DEFAULT_SETTINGS);
      }
      setPremiumLoading(false);
    });

    return () => unsub();
  }, [user]);

  const updateTimerSettings = async (settings: TimerSettings) => {
    if (!user) {
      // Salvar localmente para convidados
      setTimerSettings(settings);
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_SETTINGS_KEY, JSON.stringify(settings));
      }
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { timerSettings: settings },
        { merge: true },
      );
    } catch (error) {
      console.error("Error updating timer settings:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPremium,
        premiumLoading,
        timerSettings,
        updateTimerSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
