"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-rose-500 text-white shadow-[0_10px_20px_rgba(244,63,94,0.25)] hover:bg-rose-400",
  secondary:
    "bg-white/80 text-slate-700 shadow-sm ring-1 ring-white/80 hover:bg-white",
  outline:
    "border-2 border-rose-300 text-rose-600 shadow-sm hover:bg-rose-50",
  ghost: "text-slate-600 hover:bg-rose-50",
  danger:
    "border-2 border-rose-300 bg-white/80 text-rose-600 shadow-sm hover:bg-rose-50",
  success:
    "border-2 border-emerald-200 bg-white/80 text-emerald-600 shadow-sm hover:bg-emerald-50"
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
