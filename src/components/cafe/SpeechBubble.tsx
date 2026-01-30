"use client";

import Image from "next/image";

type SpeechBubbleProps = {
  text: string;
  isTyping?: boolean;
  glitch?: boolean;
  className?: string;
  animateKey?: string | null;
};

export const SpeechBubble = ({
  text,
  isTyping = false,
  glitch = false,
  className = "",
  animateKey = null
}: SpeechBubbleProps) => {
  if (!text && !isTyping) return null;

  return (
    <div
      className={`relative text-sm text-slate-700 ${
        glitch ? "bubble-glitch" : ""
      } ${className} animate-bubble-pop`}
      role="status"
      aria-live="polite"
    >
      <div className="relative w-full">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/bubble/bubble.png"
            alt=""
            fill
            sizes="(max-width: 640px) 70vw, 320px"
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center px-6 pb-6 text-center">
          {isTyping ? (
            <div className="flex items-center justify-center gap-1">
              <span className="typing-dot h-2 w-2 rounded-full bg-slate-500/70" />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-slate-500/70"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-slate-500/70"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          ) : (
            <span
              key={animateKey ?? text}
              className="typing-reveal block leading-relaxed"
            >
              {text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
