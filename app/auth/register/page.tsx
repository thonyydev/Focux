"use client";

import { useEffect, useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  
    useEffect(() => {
      if (!loading && user) {
        router.push("/");
      }
    }, [user, loading]);
  
    if (loading) return null;

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está em uso");
      } else {
        setError("Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-white">Criar conta</h1>

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

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-neutral-800 outline-none placeholder-neutral-400 text-white"
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="text-center text-sm text-neutral-400">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-white underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}