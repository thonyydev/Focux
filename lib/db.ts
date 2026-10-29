import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export type SessionData = {
  mode: "focus" | "break" | "longBreak";
  duration: number; // em segundos
  taskId?: string; // tarefa em foco quando a sessão terminou
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

export const sessionsQuery = (userId: string) =>
  query(
    collection(db, "users", userId, "sessions"),
    orderBy("completedAt", "desc"),
    limit(100),
  );

export async function getUserSessions(userId: string) {
  try {
    const querySnapshot = await getDocs(sessionsQuery(userId));

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as SessionData;
      return {
        id: doc.id,
        ...data,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar sessões do usuário:", error);
    return [];
  }
}

export type Task = { id: string; title: string; done: boolean };

const tasksRef = (userId: string) => collection(db, "users", userId, "tasks");

export function subscribeTasks(
  userId: string,
  onChange: (tasks: Task[]) => void,
) {
  return onSnapshot(
    query(tasksRef(userId), orderBy("createdAt")),
    (snap) =>
      onChange(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) })),
      ),
    (error) => console.error("Erro ao ouvir tarefas:", error),
  );
}

export const addTask = (userId: string, title: string) =>
  addDoc(tasksRef(userId), {
    title,
    done: false,
    createdAt: serverTimestamp(),
  });

export const setTaskDone = (userId: string, taskId: string, done: boolean) =>
  updateDoc(doc(db, "users", userId, "tasks", taskId), { done });

export const deleteTask = (userId: string, taskId: string) =>
  deleteDoc(doc(db, "users", userId, "tasks", taskId));
