"use client";

import React from "react";

export interface LampGreenOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  size?: number;
}

export default function LampGreenOutput({
  active = false,
  label = "Green Pilot Lamp",
  address = "Q0.0",
  onClick,
  showAddress = true,
  size = 120,
}: LampGreenOutputProps) {
  const center = size / 2;

  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="drop-shadow-lg"
      >
        <defs>
          <radialGradient id="lampGlow">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lampLens">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>

          <linearGradient id="lampHousing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>

        {/* Active Glow */}
        {active && (
          <circle
            cx={center}
            cy={center}
            r="48"
            fill="url(#lampGlow)"
          />
        )}

        {/* Shadow */}
        <ellipse
          cx={center}
          cy="90"
          rx="40"
          ry="14"
          fill="#94a3b8"
          opacity="0.25"
        />

        {/* Housing */}
        <circle
          cx={center}
          cy={center}
          r="42"
          fill="url(#lampHousing)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Inner Ring */}
        <circle
          cx={center}
          cy={center}
          r="32"
          fill="#1f2937"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Lamp Lens */}
        <circle
          cx={center}
          cy={center}
          r="24"
          fill={active ? "url(#lampLens)" : "#374151"}
          stroke="#166534"
          strokeWidth="2"
        />

        {/* Reflection */}
        <ellipse
          cx="50"
          cy="46"
          rx="8"
          ry="5"
          fill="#ffffff"
          opacity="0.35"
        />

        {/* Output Signal */}
        <path
          d="M95 60 H118"
          stroke={active ? "#22c55e" : "#94a3b8"}
          strokeWidth="4"
          strokeLinecap="round"
        />
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
          {active ? "ON" : "OFF"}
        </div>
      </div>
    </div>
  );
}