"use client";

import { Timer, Crown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function AppDock() {
  const router = useRouter();

  const items: DockItem[] = [
    {
      icon: <Timer size={20} />,
      label: "Início",
      onClick: () => router.push("/"),
    },
    {
      icon: <Crown size={20} />,
      label: "Premium",
      onClick: () => router.push("/upgrade"),
    },
    {
      icon: <User size={20} />,
      label: "Conta",
      onClick: () => router.push("/account"),
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl bg-neutral-900 px-4 py-3 shadow-lg">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="group relative flex h-11 w-11 items-center justify-center rounded-xl
                       bg-neutral-800 text-neutral-300
                       transition hover:bg-neutral-700 hover:text-white"
          >
            {item.icon}

            {/* Tooltip */}
            <span
              className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md
                         bg-black px-2 py-1 text-xs text-white opacity-0
                         transition group-hover:opacity-100"
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}