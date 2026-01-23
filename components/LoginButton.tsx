"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function LoginButton() {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <button
      onClick={login}
      className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200"
    >
      Entrar
    </button>
  );
}