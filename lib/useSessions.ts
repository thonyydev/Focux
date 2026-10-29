import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { sessionsQuery, SessionData } from "./db";

// Tempo real: uma sessão recém-salva aparece na hora (data estimada até o servidor confirmar).
export function useSessions(userId?: string) {
  // Guarda o dono junto das sessões: ao trocar de usuário não aparecem as do anterior.
  const [loaded, setLoaded] = useState<{
    userId?: string;
    sessions: (SessionData & { id: string })[];
  }>({ sessions: [] });

  useEffect(() => {
    if (!userId) return;
    return onSnapshot(
      sessionsQuery(userId),
      (snap) =>
        setLoaded({
          userId,
          sessions: snap.docs.map((d) => ({
            id: d.id,
            ...(d.data({ serverTimestamps: "estimate" }) as SessionData),
          })),
        }),
      (error) => console.error("Erro ao ouvir sessões:", error),
    );
  }, [userId]);

  return loaded.userId === userId ? loaded.sessions : [];
}
