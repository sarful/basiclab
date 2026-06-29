"use client";

import React from "react";

export interface MotorOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  size?: number;
  speedRpm?: number;
}

export default function MotorOutput({
  active = false,
  label = "Motor Output",
  address = "Q0.2",
  onClick,
  showAddress = true,
  size = 150,
  speedRpm = active ? 1450 : 0,
}: MotorOutputProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
    >
      <svg width={size} height={size} viewBox="0 0 150 150" className="drop-shadow-lg">
        <defs>
          <linearGradient id="motorBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="55%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <radialGradient id="motorLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        <rect x="30" y="45" width="85" height="58" rx="10" fill="url(#motorBody)" stroke="#0f172a" strokeWidth="2" />
        <rect x="112" y="58" width="18" height="32" rx="4" fill="#64748b" stroke="#334155" strokeWidth="2" />

        <line
          x1="130"
          y1="74"
          x2="145"
          y2="74"
          stroke={active ? "#22c55e" : "#94a3b8"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle cx="72" cy="74" r="24" fill="#1f2937" stroke="#cbd5e1" strokeWidth="2" />

        <g className={active ? "animate-spin origin-[72px_74px]" : ""}>
          <line x1="72" y1="74" x2="72" y2="53" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="74" x2="90" y2="84" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="74" x2="54" y2="84" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
        </g>

        <circle cx="72" cy="74" r="5" fill="#facc15" />

        <circle cx="42" cy="55" r="5" fill={active ? "url(#motorLed)" : "#1f2937"} stroke="#94a3b8" />

        <rect x="42" y="103" width="60" height="12" rx="3" fill="#334155" />
        <rect x="35" y="115" width="74" height="10" rx="3" fill="#64748b" />

        <text x="72" y="139" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">
          {speedRpm} RPM
        </text>
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {showAddress && <div className="text-xs text-slate-500">{address}</div>}

        <div
          className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "RUNNING" : "STOPPED"}
        </div>
      </div>
    </div>
  );
}