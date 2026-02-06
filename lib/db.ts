import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type SessionData = {
  mode: "focus" | "break" | "longBreak";
  duration: number; // em segundos
  completedAt?: any; // Timestamp do Firestore
};

export async function saveSession(userId: string, sessionData: SessionData) {
  try {
    const sessionsRef = collection(db, "users", userId, "sessions");

    await addDoc(sessionsRef, {
      ...sessionData,
      completedAt: serverTimestamp(),
    });

    // Sucesso silencioso
  } catch (error) {
    // mas logamos para debug
  }
}

import { getDocs, query, orderBy, limit } from "firebase/firestore";

export async function getUserSessions(userId: string) {
  try {
    const sessionsRef = collection(db, "users", userId, "sessions");
    const q = query(sessionsRef, orderBy("completedAt", "desc"), limit(100));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as SessionData;
      return {
        id: doc.id,
        ...data,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    return [];
  }
}
