"use client";

import {
  Timer,
  Crown,
  User,
  Book,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function AppDock() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      onClick: () => router.push("/analytics"),
    },
    {
      icon: <Book size={20} />,
      label: "Blog",
      onClick: () => router.push("/blog"),
    },
    {
      icon: <User size={20} />,
      label: "Conta",
      onClick: () => router.push("/account"),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            key="dock"
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 rounded-2xl bg-neutral-900/90 backdrop-blur-md px-4 py-3 shadow-lg border border-white/10"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl
                           bg-neutral-800 text-neutral-300
                           transition hover:bg-neutral-700 hover:text-white dark:hover:bg-neutral-600"
              >
                {item.icon}

                {/* Tooltip */}
                <span
                  className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md
                             bg-black px-2 py-1 text-xs text-white opacity-0
                             transition group-hover:opacity-100"
                >
                  {item.label}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="h-8 w-px bg-white/10 mx-1" />

            <button
              onClick={() => setIsCollapsed(true)}
              className="group flex h-8 w-8 items-center justify-center rounded-full
                         bg-transparent text-neutral-500
                         transition hover:bg-neutral-800 hover:text-neutral-300"
              title="Minimizar"
            >
              <ChevronDown size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ y: 100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setIsCollapsed(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/90 backdrop-blur-md shadow-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Expandir menu"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
