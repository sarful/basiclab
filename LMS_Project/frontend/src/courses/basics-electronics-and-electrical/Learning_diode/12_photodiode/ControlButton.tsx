"use client";

import type { ReactNode } from "react";

export function ControlButton({
  active,
  children,
  onClick,
  tone = "slate",
  caption,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
  tone?: "green" | "blue" | "amber" | "slate";
  caption?: string;
}) {
  const activeClass =
    tone === "green"
      ? "border-green-600 bg-green-600 text-white shadow-[0_10px_22px_rgba(22,163,74,0.24)]"
      : tone === "blue"
        ? "border-blue-600 bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]"
        : tone === "amber"
          ? "border-amber-500 bg-amber-500 text-white shadow-[0_10px_22px_rgba(245,158,11,0.24)]"
          : "border-slate-800 bg-slate-800 text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)]";

  const idleClass =
    tone === "green"
      ? "border-slate-200 bg-white text-slate-800 hover:border-green-200 hover:bg-green-50"
      : tone === "blue"
        ? "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50"
        : tone === "amber"
          ? "border-slate-200 bg-white text-slate-800 hover:border-amber-200 hover:bg-amber-50"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[72px] rounded-[20px] border px-3 py-3 text-center transition ${
        active ? activeClass : idleClass
      }`}
    >
      <span className="flex min-h-[44px] flex-col items-center justify-center gap-1">
        <span className="block text-sm font-black leading-5 tracking-[0.02em]">
          {children}
        </span>
        {caption ? (
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] opacity-75">
            {caption}
          </span>
        ) : null}
      </span>
    </button>
  );
}
