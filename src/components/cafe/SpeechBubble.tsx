"use client";

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
      <div className="rounded-[18px] border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700/70">
          Answer
        </div>
        <div className="mt-1 translate-y-[-2px]">
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
              className="typing-reveal block leading-relaxed text-slate-600"
            >
              {text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
