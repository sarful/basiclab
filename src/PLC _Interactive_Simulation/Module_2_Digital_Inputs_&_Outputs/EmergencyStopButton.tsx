"use client";

import React from "react";

export interface EmergencyStopButtonProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  size?: number;
  showAddress?: boolean;
}

export default function EmergencyStopButton({
  active = false,
  label = "Emergency Stop",
  address = "I0.7",
  onClick,
  size = 140,
  showAddress = true,
}: EmergencyStopButtonProps) {
  const center = size / 2;

  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        className="drop-shadow-xl"
      >
        <defs>
          <radialGradient id="estopRed" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffb4b4" />
            <stop offset="55%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          <radialGradient id="estopYellow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#facc15" />
          </radialGradient>

          <radialGradient id="estopGlow">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="metalRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>

        {/* Active Emergency Glow */}
        {active && (
          <circle
            cx={center}
            cy={center}
            r="58"
            fill="url(#estopGlow)"
          />
        )}

        {/* Shadow */}
        <ellipse
          cx={center}
          cy="108"
          rx="50"
          ry="16"
          fill="#94a3b8"
          opacity="0.3"
        />

        {/* Yellow Safety Base */}
        <circle
          cx={center}
          cy={center}
          r="50"
          fill="url(#estopYellow)"
          stroke="#ca8a04"
          strokeWidth="3"
        />

        {/* Metal Ring */}
        <circle
          cx={center}
          cy={center}
          r="38"
          fill="url(#metalRing)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Mushroom Head */}
        <circle
          cx={center}
          cy={active ? center + 4 : center}
          r="30"
          fill="url(#estopRed)"
          stroke="#7f1d1d"
          strokeWidth="3"
        />

        {/* Emergency Symbol */}
        <line
          x1="55"
          y1="70"
          x2="85"
          y2="70"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Highlight */}
        <ellipse
          cx="58"
          cy="56"
          rx="12"
          ry="7"
          fill="#ffffff"
          opacity="0.35"
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
              : "bg-green-100 text-green-700"
          }`}
        >
          {active ? "TRIPPED" : "READY"}
        </div>
      </div>
    </div>
  );
}