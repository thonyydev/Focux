import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
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

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if user exists first to avoid overwriting or redundant writes
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      isPremium: false,
      createdAt: serverTimestamp(),
    });
  }

  return result;
}
