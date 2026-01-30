import type { ReactNode } from "react";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-rose-200/60 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-purple-200/50 blur-[140px]" />
        <div className="absolute left-10 top-20 h-12 w-12 rotate-12 rounded-2xl border-2 border-rose-200/80 bg-white/60 shadow-sm" />
        <div className="absolute right-16 top-32 h-14 w-14 -rotate-6 rounded-full border-2 border-amber-200/80 bg-white/60 shadow-sm" />
        <div className="absolute bottom-24 left-10 h-10 w-10 rounded-full border-2 border-teal-200/80 bg-white/60 shadow-sm" />
      </div>
      <div className="relative mx-auto min-h-screen w-full sm:max-w-[430px]">
        {children}
      </div>
    </div>
  );
};
