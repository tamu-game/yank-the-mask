"use client";

import type { ReactNode } from "react";

type ChatBubbleProps = {
  from: "player" | "date";
  children: ReactNode;
  glitch?: boolean;
};

export const ChatBubble = ({ from, children, glitch = false }: ChatBubbleProps) => {
  const isPlayer = from === "player";
  return (
    <div className={`flex ${isPlayer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-lg transition ${
          isPlayer
            ? "bg-pink-500 text-white"
            : "bg-slate-800 text-slate-100"
        } ${glitch ? "glitch" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
