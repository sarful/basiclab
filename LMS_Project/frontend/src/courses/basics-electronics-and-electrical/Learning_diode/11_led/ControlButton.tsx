"use client";

import type { ReactNode } from "react";

export function ControlButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
        active
          ? "bg-yellow-500 text-slate-950"
          : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-yellow-50"
      }`}
    >
      {children}
    </button>
  );
}
