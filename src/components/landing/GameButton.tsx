"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type GameButtonProps = {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  icon?: ReactNode;
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 rounded-[24px] px-6 font-semibold uppercase tracking-[0.35em] transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-70";

const variantStyles: Record<NonNullable<GameButtonProps["variant"]>, string> = {
  primary:
    "border-[3px] border-amber-200 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-[#1a0900] shadow-[0_18px_0_rgba(0,0,0,0.35)] hover:brightness-110 active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.3)]",
  secondary:
    "border-[3px] border-amber-200/80 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-100 text-amber-900 shadow-[0_10px_0_rgba(0,0,0,0.25)] hover:from-amber-200 hover:via-amber-150 hover:to-amber-50 active:translate-y-1 active:shadow-[0_4px_0_rgba(0,0,0,0.2)]"
};

const sizeStyles: Record<NonNullable<GameButtonProps["size"]>, string> = {
  md: "h-14 text-sm sm:text-base",
  sm: "h-12 text-[11px]"
};

export const GameButton = ({
  href,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: GameButtonProps) => {
  const { type, ...rest } = props;
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
  const content = (
    <span className="flex items-center gap-2">
      {icon ? <span className="text-lg leading-none">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type={type ?? "button"} {...rest}>
      {content}
    </button>
  );
};
