"use client";

import React from "react";

export interface HeaterOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
  temperature?: number;
}

export default function HeaterOutput({
  active = false,
  label = "Heater Output",
  address = "Q0.6",
  onClick,
  showAddress = true,
  width = 200,
  height = 150,
  temperature = active ? 85 : 25,
}: HeaterOutputProps) {
  return (
    <div onClick={onClick} className="inline-flex cursor-pointer select-none flex-col items-center gap-2" style={{ width }}>
      <svg width={width} height={height} viewBox="0 0 200 150" className="drop-shadow-lg">
        <defs>
          <linearGradient id="heaterBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <radialGradient id="heatGlow">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {active && <ellipse cx="100" cy="72" rx="78" ry="45" fill="url(#heatGlow)" />}

        <rect x="35" y="45" width="130" height="55" rx="10" fill="url(#heaterBody)" stroke="#64748b" strokeWidth="2" />

        <path
          d="M50 72 C60 50, 75 94, 85 72 C95 50, 110 94, 120 72 C130 50, 145 94, 155 72"
          fill="none"
          stroke={active ? "#ef4444" : "#64748b"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {active && (
          <>
            <path d="M65 35 C58 25, 70 18, 65 8" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M100 35 C93 25, 105 18, 100 8" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M135 35 C128 25, 140 18, 135 8" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </>
        )}

        <path d="M10 72 H35" stroke={active ? "#ef4444" : "#94a3b8"} strokeWidth="5" strokeLinecap="round" />
        <path d="M165 72 H190" stroke={active ? "#ef4444" : "#94a3b8"} strokeWidth="5" strokeLinecap="round" />

        <text x="100" y="125" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">
          {temperature}°C
        </text>
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {showAddress && <div className="text-xs text-slate-500">{address}</div>}

        <div className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
          active ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"
        }`}>
          {active ? "HEATING" : "OFF"}
        </div>
      </div>
    </div>
  );
}