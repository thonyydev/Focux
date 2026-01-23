"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <BlurFade duration={1} delay={0.5}>
        <div className="relative max-w-md w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-8 text-center shadow-2xl">
          <BorderBeam duration={20} size={150} />

          <h1 className="text-7xl font-extrabold text-white mb-2">404</h1>

          <p className="text-neutral-400 mb-6">
            Opa! Essa página não existe ou foi movida.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-green-500/30"
          >
            <ArrowLeft size={18} />
            Voltar para o início
          </Link>
        </div>
      </BlurFade>
    </div>
  );
}