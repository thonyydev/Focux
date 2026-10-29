"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ProfileHeader() {
  const { user, displayName, updateDisplayName, badges } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (displayName) setNewName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (newName.trim() === "") return;
    await updateDisplayName(newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(displayName || "");
    setIsEditing(false);
  };

  // Avatar Initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const displayInitials = displayName
    ? getInitials(displayName)
    : user?.email
      ? user.email[0].toUpperCase()
      : "U";

  return (
    <div className="flex items-center gap-6 p-6 bg-card/50 border border-border rounded-2xl">
      {/* Avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-card border border-input flex items-center justify-center shadow-inner">
          <span className="text-2xl font-bold text-foreground tracking-wider">
            {displayInitials}
          </span>
        </div>
        {/* Status indicator could go here */}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                maxLength={20}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-secondary border border-input text-foreground px-3 py-1 rounded-lg text-lg font-semibold focus:outline-none focus:border-muted-foreground/40 w-full min-w-0"
                placeholder="Seu nome"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleSave}
                  className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h2 className="text-2xl font-bold text-foreground">
                {displayName || "Usuário Focux"}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1 text-subtle hover:text-foreground transition-all transform translate-x-1 group-hover:translate-x-0"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-subtle font-mono">{user?.email}</p>
      </div>
    </div>
  );
}
