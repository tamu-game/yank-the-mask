"use client";

type SpeechBubbleProps = {
  text: string;
  isTyping?: boolean;
  glitch?: boolean;
  className?: string;
};

export const SpeechBubble = ({
  text,
  isTyping = false,
  glitch = false,
  className = ""
}: SpeechBubbleProps) => {
  return (
    <div
      className={`bubble-pop relative max-w-[80%] rounded-[28px] border-2 border-white/80 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-lg ${
        glitch ? "bubble-glitch" : ""
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`block ${
          isTyping ? "tracking-[0.4em] text-slate-400 animate-pulse" : ""
        }`}
      >
        {text}
      </span>
      <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white/80 bg-white/90 shadow-sm" />
    </div>
  );
};
