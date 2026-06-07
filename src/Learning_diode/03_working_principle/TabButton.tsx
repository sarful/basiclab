"use client";

import React from "react";

export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2 font-semibold transition ${active ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
    >
      {children}
    </button>
  );
}
