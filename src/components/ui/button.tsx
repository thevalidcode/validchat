"use client";

import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

/**
 * Lightweight button using Tailwind utilities.
 * Keep this in place of shadcn Button for reliability.
 */
export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-transform focus:outline-none focus:ring-4 focus:ring-opacity-20";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-md",
    lg: "px-7 py-3 text-lg",
  };
  const variants = {
    primary:
      "bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-2xl hover:scale-[1.02] active:scale-[0.99] focus:ring-[#7c3aed]/30",
    ghost: "bg-transparent text-white hover:bg-white/6",
    outline:
      "bg-transparent border border-white/10 text-white hover:border-white/20 focus:ring-white/20",
  };

  return (
    <button
      {...rest}
      className={clsx(base, sizes[size], variants[variant], className)}
      onClick={rest.onClick}
    >
      {children}
    </button>
  );
}
