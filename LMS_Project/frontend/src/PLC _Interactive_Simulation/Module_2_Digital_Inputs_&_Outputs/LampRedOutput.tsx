"use client";

import React from "react";

export interface LampRedOutputProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  size?: number;
}

export default function LampRedOutput({
  active = false,
  label = "Red Pilot Lamp",
  address = "Q0.1",
  onClick,
  showAddress = true,
  size = 120,
}: LampRedOutputProps) {
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
          <radialGradient id="redLampGlow">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="redLampLens">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          <linearGradient
            id="redLampHousing"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
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
            fill="url(#redLampGlow)"
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

        {/* Metal Housing */}
        <circle
          cx={center}
          cy={center}
          r="42"
          fill="url(#redLampHousing)"
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

        {/* Red Lens */}
        <circle
          cx={center}
          cy={center}
          r="24"
          fill={active ? "url(#redLampLens)" : "#374151"}
          stroke="#7f1d1d"
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

        {/* Alarm Symbol */}
        {active && (
          <>
            <line
              x1="60"
              y1="48"
              x2="60"
              y2="66"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx="60"
              cy="74"
              r="3"
              fill="#ffffff"
            />
          </>
        )}

        {/* Output Signal Wire */}
        <path
          d="M95 60 H118"
          stroke={active ? "#ef4444" : "#94a3b8"}
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
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "ALARM ON" : "OFF"}
        </div>
      </div>
    </div>
  );
}