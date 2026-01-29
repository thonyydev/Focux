"use client";

import { loginWithGoogle } from "@/lib/auth";

export function LoginButton() {
  const login = async () => {
    await loginWithGoogle();
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
