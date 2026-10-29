"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { BlurFade } from "./ui/blur-fade";
import { APP_VERSION } from "@/lib/site";

export function Header() {
  const { user, displayName } = useAuth();
  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  // Pegar primeiro nome (priorizar displayName do Firestore, fallback para Auth ou Visitante)
  const nameToDisplay = displayName || user?.displayName || "Visitante";
  const firstName = nameToDisplay.split(" ")[0];

  return (
    <BlurFade duration={0.8} delay={0.2} className="w-full max-w-lg mb-4">
      <div className="flex flex-col items-center text-center gap-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/50 border border-border text-xs font-medium text-muted-foreground mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Focux {APP_VERSION}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {greeting},{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-lime-300">
            {firstName}
          </span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base max-w-[300px] sm:max-w-none">
          Pronto para alcançar seus objetivos hoje?
        </p>
      </div>
    </BlurFade>
  );
}
