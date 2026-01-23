import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    isPremium: false,
    createdAt: serverTimestamp(),
  });

  return cred;
}

export function logout() {
  return signOut(auth);
}