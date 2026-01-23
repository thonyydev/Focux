"use client";

import { useEffect, useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-white">
          Entrar
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 outline-none placeholder-neutral-400 text-white"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 outline-none placeholder-neutral-400 text-white"
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded bg-white text-black font-medium hover:bg-gray-200"
        >
          Entrar
        </button>
        <p className="text-center text-sm text-neutral-400">
          Não tem uma conta ainda?{" "}
          <Link href="/auth/register" className="text-white underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
