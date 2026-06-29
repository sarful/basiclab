"use client";

import React from "react";

export function ControlButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
        active
          ? "bg-purple-700 text-white"
          : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-purple-50"
      }`}
    >
      {children}
    </button>
  );
}
