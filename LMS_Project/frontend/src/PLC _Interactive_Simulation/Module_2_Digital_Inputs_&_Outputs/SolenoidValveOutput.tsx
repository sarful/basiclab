"use client";

import React from "react";

export interface SolenoidValveOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
}

export default function SolenoidValveOutput({
  active = false,
  label = "Solenoid Valve",
  address = "Q0.3",
  onClick,
  showAddress = true,
  width = 200,
  height = 150,
}: SolenoidValveOutputProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
      style={{ width }}
    >
      <svg width={width} height={height} viewBox="0 0 200 150" className="drop-shadow-lg">
        <defs>
          <linearGradient id="valveBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="55%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="coilBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <radialGradient id="valveLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Pipe */}
        <path
          d="M10 82 H55"
          stroke={active ? "#38bdf8" : "#94a3b8"}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M145 82 H190"
          stroke={active ? "#38bdf8" : "#94a3b8"}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Flow animation dots */}
        {active && (
          <>
            <circle cx="35" cy="82" r="4" fill="#0ea5e9" />
            <circle cx="90" cy="82" r="4" fill="#0ea5e9" />
            <circle cx="160" cy="82" r="4" fill="#0ea5e9" />
          </>
        )}

        {/* Valve body */}
        <rect
          x="55"
          y="60"
          width="90"
          height="44"
          rx="8"
          fill="url(#valveBody)"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Valve symbol */}
        <path
          d={active ? "M70 96 L130 68" : "M70 68 L130 96"}
          stroke={active ? "#22c55e" : "#ef4444"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Solenoid coil */}
        <rect
          x="75"
          y="18"
          width="50"
          height="42"
          rx="6"
          fill="url(#coilBody)"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* Coil windings */}
        {Array.from({ length: 5 }).map((_, index) => (
          <line
            key={index}
            x1={84 + index * 8}
            y1="24"
            x2={84 + index * 8}
            y2="54"
            stroke={active ? "#facc15" : "#64748b"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {/* Coil link */}
        <path
          d="M100 60 V68"
          stroke="#334155"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Status LED */}
        <circle
          cx="132"
          cy="35"
          r="6"
          fill={active ? "url(#valveLed)" : "#1f2937"}
          stroke="#94a3b8"
        />

        {/* Output wire */}
        <path
          d="M125 35 H165"
          stroke={active ? "#22c55e" : "#94a3b8"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <text x="100" y="130" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">
          {active ? "VALVE OPEN" : "VALVE CLOSED"}
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
          {active ? "ENERGIZED" : "DE-ENERGIZED"}
        </div>
      </div>
    </div>
  );
}