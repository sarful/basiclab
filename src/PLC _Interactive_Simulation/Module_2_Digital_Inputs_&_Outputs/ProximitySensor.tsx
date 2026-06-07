"use client";

import React from "react";

export interface ProximitySensorProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  showAddress?: boolean;
  width?: number;
  height?: number;
  sensingDistance?: number;
}

export default function ProximitySensor({
  active = false,
  label = "Proximity Sensor",
  address = "I0.3",
  onClick,
  showAddress = true,
  width = 180,
  height = 140,
  sensingDistance = 15,
}: ProximitySensorProps) {
  return (
    <div
      onClick={onClick}
      className="inline-flex cursor-pointer select-none flex-col items-center gap-2"
      style={{ width }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 140"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="sensorBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <radialGradient id="sensorLed">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>

          <radialGradient id="detectGlow">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sensor Body */}
        <rect
          x="35"
          y="50"
          width="90"
          height="40"
          rx="6"
          fill="url(#sensorBody)"
          stroke="#111827"
          strokeWidth="2"
        />

        {/* Sensor Face */}
        <circle
          cx="120"
          cy="70"
          r="12"
          fill="#111827"
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Detection Zone */}
        <path
          d="M120 58 Q150 70 120 82"
          fill="none"
          stroke={active ? "#3b82f6" : "#64748b"}
          strokeWidth="2"
        />

        <path
          d="M120 48 Q165 70 120 92"
          fill="none"
          stroke={active ? "#60a5fa" : "#64748b"}
          strokeWidth="2"
          opacity="0.7"
        />

        {active && (
          <ellipse
            cx="155"
            cy="70"
            rx="18"
            ry="24"
            fill="url(#detectGlow)"
          />
        )}

        {/* Target Object */}
        <rect
          x={active ? 145 : 165}
          y="50"
          width="10"
          height="40"
          rx="2"
          fill={active ? "#f59e0b" : "#94a3b8"}
        />

        {/* LED */}
        <circle
          cx="55"
          cy="70"
          r="7"
          fill={active ? "url(#sensorLed)" : "#1f2937"}
          stroke="#9ca3af"
        />

        {/* Cable */}
        <path
          d="M35 70 H10"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Wire Colors */}
        <line x1="15" y1="64" x2="15" y2="40" stroke="#2563eb" strokeWidth="2" />
        <line x1="22" y1="64" x2="22" y2="40" stroke="#92400e" strokeWidth="2" />
        <line x1="29" y1="64" x2="29" y2="40" stroke="#111827" strokeWidth="2" />

        {/* Distance Label */}
        <text
          x="90"
          y="118"
          textAnchor="middle"
          fill="#475569"
          fontSize="11"
        >
          Sensing Distance: {sensingDistance} mm
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
          {active ? "OBJECT DETECTED" : "NO OBJECT"}
        </div>
      </div>
    </div>
  );
}