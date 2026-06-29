"use client";

import React from "react";

export interface FloatSwitchProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
  waterLevel?: number; // 0-100
}

export default function FloatSwitch({
  active = false,
  label = "Float Switch",
  address = "I0.5",
  onClick,
  showAddress = true,
  width = 220,
  height = 180,
  waterLevel = active ? 75 : 35,
}: FloatSwitchProps) {
  const level = Math.max(0, Math.min(100, waterLevel));
  const waterY = 130 - level * 0.8;

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
          <linearGradient id="tankWall" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="waterFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <radialGradient id="statusLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Tank */}
        <rect
          x="40"
          y="20"
          width="100"
          height="120"
          rx="4"
          fill="url(#tankWall)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Water */}
        <clipPath id="tankClip">
          <rect x="42" y="22" width="96" height="116" rx="2" />
        </clipPath>

        <g clipPath="url(#tankClip)">
          <rect
            x="42"
            y={waterY}
            width="96"
            height={140 - waterY}
            fill="url(#waterFill)"
          />

          <path
            d={`M42 ${waterY} 
                C55 ${waterY - 3}, 
                70 ${waterY + 3}, 
                85 ${waterY}
                C100 ${waterY - 3},
                115 ${waterY + 3},
                138 ${waterY}`}
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="2"
          />
        </g>

        {/* Float Rod */}
        <line
          x1="160"
          y1="35"
          x2="160"
          y2="125"
          stroke="#374151"
          strokeWidth="4"
        />

        {/* Float Ball */}
        <circle
          cx="160"
          cy={active ? 65 : 105}
          r="12"
          fill={active ? "#f97316" : "#fb923c"}
          stroke="#9a3412"
          strokeWidth="2"
        />

        {/* Switch Housing */}
        <rect
          x="145"
          y="20"
          width="30"
          height="25"
          rx="4"
          fill="#374151"
          stroke="#111827"
        />

        {/* Status LED */}
        <circle
          cx="160"
          cy="32"
          r="5"
          fill={active ? "url(#statusLed)" : "#1f2937"}
        />

        {/* Signal Wire */}
        <path
          d="M175 32 H205"
          stroke={active ? "#22c55e" : "#64748b"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Water Level Label */}
        <text
          x="90"
          y="160"
          textAnchor="middle"
          fill="#475569"
          fontSize="11"
          fontWeight="600"
        >
          Water Level: {level}%
        </text>

        {/* ON/OFF Label */}
        <text
          x="160"
          y="155"
          textAnchor="middle"
          fill={active ? "#16a34a" : "#64748b"}
          fontSize="11"
          fontWeight="700"
        >
          {active ? "LEVEL HIGH" : "LEVEL LOW"}
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
          {active ? "FLOAT ACTIVE" : "FLOAT INACTIVE"}
        </div>
      </div>
    </div>
  );
}