"use client";

import Link from "next/link";

export const TopBar = ({ title, backHref }: { title: string; backHref?: string }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="rounded-full border-2 border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
          >
            Back
          </Link>
        ) : null}
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
        <span className="h-2 w-2 rounded-full bg-rose-400 shadow-sm" />
        Maskle
      </span>
    </div>
  );
};
