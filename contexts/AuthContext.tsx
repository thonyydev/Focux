"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  premiumLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  premiumLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  // 🔐 Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ⭐ Premium realtime
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setPremiumLoading(false);
      return;
    }

    setPremiumLoading(true);

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setIsPremium(!!snap.data().isPremium);
      } else {
        setIsPremium(false);
      }
      setPremiumLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, isPremium, premiumLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
