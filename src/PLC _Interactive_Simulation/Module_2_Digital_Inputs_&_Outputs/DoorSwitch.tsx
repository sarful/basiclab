"use client";

import React from "react";

export interface DoorSwitchProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
}

export default function DoorSwitch({
  active = false,
  label = "Door Switch",
  address = "I0.6",
  onClick,
  showAddress = true,
  width = 220,
  height = 180,
}: DoorSwitchProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
      style={{ width }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 220 180"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="doorFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="doorPanel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <radialGradient id="statusLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Frame */}
        <rect
          x="40"
          y="20"
          width="90"
          height="120"
          rx="4"
          fill="url(#doorFrame)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Door */}
        <g
          transform={
            active
              ? "rotate(-35 45 80)"
              : "rotate(0 45 80)"
          }
        >
          <rect
            x="45"
            y="25"
            width="75"
            height="110"
            rx="4"
            fill="url(#doorPanel)"
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* Handle */}
          <circle
            cx="108"
            cy="80"
            r="4"
            fill="#374151"
          />
        </g>

        {/* Door Switch Housing */}
        <rect
          x="145"
          y="45"
          width="30"
          height="45"
          rx="4"
          fill="#374151"
          stroke="#111827"
        />

        {/* Status LED */}
        <circle
          cx="160"
          cy="58"
          r="5"
          fill={active ? "url(#statusLed)" : "#1f2937"}
        />

        {/* Reed Sensor */}
        <rect
          x="148"
          y="70"
          width="24"
          height="8"
          rx="2"
          fill="#9ca3af"
        />

        {/* Signal Wire */}
        <path
          d="M175 58 H205"
          stroke={active ? "#22c55e" : "#64748b"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Magnetic Contact */}
        <rect
          x={active ? 120 : 128}
          y="70"
          width="8"
          height="28"
          rx="2"
          fill="#ef4444"
        />

        {/* Door State */}
        <text
          x="85"
          y="160"
          textAnchor="middle"
          fill={active ? "#16a34a" : "#64748b"}
          fontSize="11"
          fontWeight="700"
        >
          {active ? "DOOR OPEN" : "DOOR CLOSED"}
        </text>

        {/* PLC Input State */}
        <text
          x="160"
          y="160"
          textAnchor="middle"
          fill="#475569"
          fontSize="11"
          fontWeight="600"
        >
          {active ? "I0.6 = ON" : "I0.6 = OFF"}
        </text>
      </svg>

      <div className="text-center">
        <div className="text-sm font-semibold text-slate-800">
          {label}
        </div>

        {showAddress && (
          <div className="text-xs text-slate-500">
            {address}
          </div>
        )}

        <div
          className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "OPEN DETECTED" : "SECURED"}
        </div>
      </div>
    </div>
  );
}