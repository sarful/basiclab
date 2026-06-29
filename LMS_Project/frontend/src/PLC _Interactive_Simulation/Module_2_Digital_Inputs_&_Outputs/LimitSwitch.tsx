"use client";

import React from "react";

export interface LimitSwitchProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
}

export default function LimitSwitch({
  active = false,
  label = "Limit Switch",
  address = "I0.2",
  onClick,
  showAddress = true,
  width = 180,
  height = 120,
}: LimitSwitchProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
      style={{ width }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 120"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="lsBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <radialGradient id="lsLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Base */}
        <rect
          x="45"
          y="45"
          width="90"
          height="45"
          rx="6"
          fill="url(#lsBody)"
          stroke="#1f2937"
          strokeWidth="2"
        />

        {/* Mounting Holes */}
        <circle cx="55" cy="55" r="3" fill="#111827" />
        <circle cx="125" cy="55" r="3" fill="#111827" />
        <circle cx="55" cy="80" r="3" fill="#111827" />
        <circle cx="125" cy="80" r="3" fill="#111827" />

        {/* Roller Arm */}
        <line
          x1="90"
          y1="45"
          x2={active ? "135" : "125"}
          y2={active ? "15" : "25"}
          stroke="#d1d5db"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Roller */}
        <circle
          cx={active ? 135 : 125}
          cy={active ? 15 : 25}
          r="10"
          fill="#9ca3af"
          stroke="#374151"
          strokeWidth="2"
        />

        {/* LED Indicator */}
        <circle
          cx="90"
          cy="67"
          r="7"
          fill={active ? "url(#lsLed)" : "#1f2937"}
          stroke="#9ca3af"
        />

        {/* Signal Wire */}
        <path
          d="M135 68 H165"
          stroke={active ? "#22c55e" : "#64748b"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Trigger Indicator */}
        {active && (
          <>
            <line
              x1="145"
              y1="10"
              x2="165"
              y2="10"
              stroke="#ef4444"
              strokeWidth="3"
            />
            <line
              x1="155"
              y1="0"
              x2="155"
              y2="20"
              stroke="#ef4444"
              strokeWidth="3"
            />
          </>
        )}
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
          {active ? "ACTUATED" : "IDLE"}
        </div>
      </div>
    </div>
  );
}