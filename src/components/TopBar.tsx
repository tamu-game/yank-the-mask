"use client";

import Link from "next/link";

export const TopBar = ({
  title,
  backHref,
  showBrand = true,
  titleAlign = "left"
}: {
  title: string;
  backHref?: string;
  showBrand?: boolean;
  titleAlign?: "left" | "center";
}) => {
  const isCentered = titleAlign === "center";

  return (
    <div className="relative flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="rounded-full border-2 border-amber-200/80 bg-[#fff6e6]/95 px-3 py-1 text-xs font-semibold text-amber-900 shadow-[0_3px_0_rgba(197,139,79,0.2)]"
          >
            Back
          </Link>
        ) : null}
        {!isCentered ? (
          <span className="text-sm font-semibold text-amber-900">{title}</span>
        ) : null}
      </div>
      {isCentered ? (
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-amber-900">
          {title}
        </span>
      ) : null}
      {showBrand ? (
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/80">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-sm" />
          Maskle
        </span>
      ) : null}
    </div>
  );
};
