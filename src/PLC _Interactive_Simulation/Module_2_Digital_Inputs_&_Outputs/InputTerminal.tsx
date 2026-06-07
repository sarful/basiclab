"use client";

import React from "react";

export interface InputTerminalProps {
  active?: boolean;
  label?: string;
  address?: string;
  wireColor?: string;
  onClick?: () => void;
  showAddress?: boolean;
}

export default function InputTerminal({
  active = false,
  label = "Input Terminal",
  address = "I0.0",
  wireColor = "#2563eb",
  onClick,
  showAddress = true,
}: InputTerminalProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <svg width="120" height="70" viewBox="0 0 120 70">
        <defs>
          <radialGradient id="terminalLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Terminal Block */}
        <rect
          x="35"
          y="12"
          width="50"
          height="46"
          rx="6"
          fill="#1f2937"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* Screw Terminal */}
        <circle
          cx="60"
          cy="35"
          r="13"
          fill="#111827"
          stroke={active ? "#22c55e" : "#94a3b8"}
          strokeWidth="3"
        />

        <line
          x1="52"
          y1="35"
          x2="68"
          y2="35"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Input Wire */}
        <path
          d="M0 35 H35"
          stroke={wireColor}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* PLC Internal Signal */}
        <path
          d="M85 35 H118"
          stroke={active ? "#22c55e" : "#94a3b8"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* LED */}
        <circle
          cx="102"
          cy="20"
          r="6"
          fill={active ? "url(#terminalLed)" : "#1f2937"}
          stroke="#64748b"
        />
      </svg>

      <div>
        <div className="text-sm font-semibold text-slate-800">{label}</div>

        {showAddress && (
          <div className="text-xs text-slate-500">{address}</div>
        )}

        <div
          className={`mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "SIGNAL ON" : "SIGNAL OFF"}
        </div>
      </div>
    </div>
  );
}