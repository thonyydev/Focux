"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export type TimerSettings = {
  focus: number;
  break: number;
  longBreak: number;
};

export type UserPreferences = {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  volume: number;
  ambientSound?: string;
};

const GUEST_SETTINGS_KEY = "focux-guest-settings";

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: false,
  volume: 50,
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  premiumLoading: boolean;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: TimerSettings) => Promise<void>;
  plan: "monthly" | "lifetime" | null;
  badges: string[];
  displayName: string | null;
  updateDisplayName: (name: string) => Promise<void>;
  preferences: UserPreferences;
  updatePreferences: (settings: Partial<UserPreferences>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  premiumLoading: true,
  timerSettings: DEFAULT_SETTINGS,
  updateTimerSettings: async () => {},
  plan: null,
  badges: [],
  displayName: null,
  updateDisplayName: async () => {},
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState<"monthly" | "lifetime" | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(DEFAULT_SETTINGS);
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);

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
      setPlan(null);
      setBadges([]);
      setDisplayName(null);
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
        setPlan(data.plan || null);
        setBadges(data.badges || []);
        setDisplayName(data.displayName || null);
        if (data.preferences) {
          setPreferences(data.preferences);
        } else {
          setPreferences(DEFAULT_PREFERENCES);
        }

        if (data.timerSettings) {
          setTimerSettings(data.timerSettings);
        } else {
          setTimerSettings(DEFAULT_SETTINGS);
        }
      } else {
        setIsPremium(false);
        setPlan(null);
        setBadges([]);
        setDisplayName(null);
        setPreferences(DEFAULT_PREFERENCES);
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

    setTimerSettings(settings);

    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      const updates: any = { timerSettings: settings };
      const data = docSnap.exists() ? docSnap.data() : {};

      // Se não existir dados do usuário (ou estiver incompleto), preenche
      if (!data.email) {
        updates.email = user.email;
      }
      if (data.isPremium === undefined) {
        updates.isPremium = false;
      }
      if (!data.createdAt) {
        updates.createdAt = serverTimestamp();
      }

      await setDoc(userRef, updates, { merge: true });
    } catch (error) {
      console.error("Error saving timer settings:", error);
      throw error;
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { displayName: name }, { merge: true });
      setDisplayName(name); // creating optimistic update
    } catch (error) {
      console.error("Error updating display name:", error);
      throw error;
    }
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) return;
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { preferences: updated }, { merge: true });
    } catch (error) {
      console.error("Error updating preferences:", error);
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
        plan,
        badges,
        displayName,
        updateDisplayName,
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
