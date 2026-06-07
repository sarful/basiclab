"use client";

import React from "react";

export interface PhotoelectricSensorProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
}

export default function PhotoelectricSensor({
  active = false,
  label = "Photoelectric Sensor",
  address = "I0.4",
  onClick,
  showAddress = true,
  width = 200,
  height = 140,
}: PhotoelectricSensorProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
      style={{ width }}
    >
      <svg width={width} height={height} viewBox="0 0 200 140" className="drop-shadow-lg">
        <defs>
          <linearGradient id="photoBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <radialGradient id="photoLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        {/* Sensor body */}
        <rect
          x="25"
          y="48"
          width="70"
          height="44"
          rx="6"
          fill="url(#photoBody)"
          stroke="#111827"
          strokeWidth="2"
        />

        {/* Lens */}
        <circle
          cx="90"
          cy="70"
          r="10"
          fill="#111827"
          stroke="#93c5fd"
          strokeWidth="2"
        />

        {/* LED indicator */}
        <circle
          cx="45"
          cy="70"
          r="7"
          fill={active ? "url(#photoLed)" : "#1f2937"}
          stroke="#9ca3af"
        />

        {/* Cable */}
        <path
          d="M25 70 H5"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Light beam */}
        <line
          x1="100"
          y1="70"
          x2="170"
          y2="70"
          stroke={active ? "#ef4444" : "#38bdf8"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={active ? "8 7" : "0"}
        />

        {/* Receiver / reflector */}
        <rect
          x="170"
          y="45"
          width="18"
          height="50"
          rx="4"
          fill="#e5e7eb"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* Object blocking beam */}
        {active && (
          <rect
            x="130"
            y="40"
            width="16"
            height="60"
            rx="3"
            fill="#f59e0b"
            stroke="#92400e"
            strokeWidth="2"
          />
        )}

        {/* Beam labels */}
        <text x="100" y="118" textAnchor="middle" fill="#475569" fontSize="11">
          {active ? "Beam Blocked" : "Beam Clear"}
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
          {active ? "OBJECT DETECTED" : "NO OBJECT"}
        </div>
      </div>
    </div>
  );
}