"use client";

import React from "react";

export interface IndicatorOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  color?: "green" | "red" | "yellow" | "blue";
  onClick?: () => void;
  showAddress?: boolean;
  size?: number;
}

export default function IndicatorOutput({
  active = false,
  label = "Indicator Output",
  address = "Q0.7",
  color = "yellow",
  onClick,
  showAddress = true,
  size = 120,
}: IndicatorOutputProps) {
  const colors = {
    green: ["#bbf7d0", "#22c55e", "#15803d"],
    red: ["#fecaca", "#ef4444", "#991b1b"],
    yellow: ["#fef3c7", "#facc15", "#b45309"],
    blue: ["#bfdbfe", "#3b82f6", "#1d4ed8"],
  };

  const [light, mid, dark] = colors[color];
  const center = size / 2;

  return (
    <div onClick={onClick} className="inline-flex cursor-pointer select-none flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-lg">
        <defs>
          <radialGradient id="indicatorLens">
            <stop offset="0%" stopColor={light} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={dark} />
          </radialGradient>

          <radialGradient id="indicatorGlow">
            <stop offset="0%" stopColor={mid} stopOpacity="0.85" />
            <stop offset="100%" stopColor={mid} stopOpacity="0" />
          </radialGradient>
        </defs>

        {active && <circle cx={center} cy={center} r="48" fill="url(#indicatorGlow)" />}

        <circle cx={center} cy={center} r="42" fill="#9ca3af" stroke="#475569" strokeWidth="2" />
        <circle cx={center} cy={center} r="32" fill="#1f2937" stroke="#e5e7eb" strokeWidth="2" />
        <circle cx={center} cy={center} r="24" fill={active ? "url(#indicatorLens)" : "#374151"} stroke={dark} strokeWidth="2" />

        <ellipse cx="50" cy="46" rx="8" ry="5" fill="#ffffff" opacity="0.35" />

        <path
          d="M95 60 H118"
          stroke={active ? mid : "#94a3b8"}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {showAddress && <div className="text-xs text-slate-500">{address}</div>}
        <div className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
          active ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
        }`}>
          {active ? "ON" : "OFF"}
        </div>
      </div>
    </div>
  );
}