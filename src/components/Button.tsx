"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "border-2 border-amber-200 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-amber-950 shadow-[0_6px_0_rgba(197,139,79,0.35),0_14px_24px_rgba(197,139,79,0.25)] hover:from-amber-200 hover:to-amber-400",
  secondary:
    "border-2 border-amber-200/70 bg-white/90 text-amber-900 shadow-[0_3px_0_rgba(197,139,79,0.2)] hover:bg-[#fff7ea]",
  outline:
    "border-2 border-amber-300 text-amber-800 shadow-[0_3px_0_rgba(197,139,79,0.18)] hover:bg-amber-50",
  ghost: "text-slate-600 hover:bg-rose-50",
  danger:
    "border-2 border-rose-300 bg-white/90 text-rose-700 shadow-[0_3px_0_rgba(214,94,107,0.18)] hover:bg-rose-50",
  success:
    "border-2 border-emerald-200 bg-white/90 text-emerald-700 shadow-[0_3px_0_rgba(56,161,105,0.2)] hover:bg-emerald-50"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: "sm" | "md";
  href?: string;
};

export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) => {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "";
  const classes = `${base} ${variants[variant]} ${sizeClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
