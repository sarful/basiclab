"use client";

import React from "react";

export interface BuzzerOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  size?: number;
}

export default function BuzzerOutput({
  active = false,
  label = "Buzzer",
  address = "Q0.4",
  onClick,
  showAddress = true,
  size = 140,
}: BuzzerOutputProps) {
  return (
    <div onClick={onClick} className="inline-flex cursor-pointer select-none flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 140 140" className="drop-shadow-lg">
        <defs>
          <radialGradient id="buzzerLed">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        <circle cx="70" cy="70" r="42" fill="#1f2937" stroke="#64748b" strokeWidth="3" />
        <circle cx="70" cy="70" r="30" fill={active ? "url(#buzzerLed)" : "#374151"} stroke="#111827" strokeWidth="2" />

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={50 + i * 8} cy="70" r="3" fill="#111827" />
        ))}

        {active && (
          <>
            <path d="M105 50 Q125 70 105 90" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <path d="M112 38 Q140 70 112 102" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          </>
        )}

        <text x="70" y="124" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">
          {active ? "BUZZING" : "SILENT"}
        </text>
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {showAddress && <div className="text-xs text-slate-500">{address}</div>}
      </div>
    </div>
  );
}