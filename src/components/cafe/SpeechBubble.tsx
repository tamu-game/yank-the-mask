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
  if (!text && !isTyping) return null;

  return (
    <div
      className={`relative rounded-[22px] border border-white/70 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-lg ${
        glitch ? "bubble-glitch" : ""
      } ${className} animate-bubble-pop`}
      role="status"
      aria-live="polite"
    >
      {isTyping ? (
        <div className="flex items-center gap-1">
          <span className="typing-dot h-2 w-2 rounded-full bg-slate-400/70" />
          <span
            className="typing-dot h-2 w-2 rounded-full bg-slate-400/70"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="typing-dot h-2 w-2 rounded-full bg-slate-400/70"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      ) : (
        <span className="block leading-relaxed">{text}</span>
      )}
      <span className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-r border-b border-white/70 bg-white/90" />
    </div>
  );
};
