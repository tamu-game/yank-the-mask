"use client";

import { TypingText } from "@/components/TypingText";

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
      className={`relative text-sm text-amber-900 ${
        glitch ? "bubble-glitch" : ""
      } ${className} animate-bubble-pop`}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-[18px] border-2 border-amber-200/80 bg-[#fff6e6]/95 px-4 py-3 text-sm text-amber-900 shadow-[0_10px_20px_rgba(197,139,79,0.18)] backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700/70">
          Answer
        </div>
        <div className="mt-1 translate-y-[-2px]">
          {isTyping ? (
            <div className="flex items-center justify-center gap-1">
              <span className="typing-dot h-2 w-2 rounded-full bg-amber-700/70" />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-amber-700/70"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="typing-dot h-2 w-2 rounded-full bg-amber-700/70"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          ) : (
            <TypingText
              key={animateKey ?? text}
              text={text}
              animateKey={animateKey ?? text}
              className="block leading-relaxed text-amber-800/90"
            />
          )}
        </div>
      </div>
    </div>
  );
};
