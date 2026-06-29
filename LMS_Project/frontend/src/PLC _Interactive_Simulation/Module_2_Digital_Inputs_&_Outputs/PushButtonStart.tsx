"use client";

import React from "react";

export interface PushButtonStartProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  size?: number;
  showAddress?: boolean;
}

export default function PushButtonStart({
  active = false,
  label = "PB Start",
  address = "I0.0",
  onClick,
  size = 120,
  showAddress = true,
}: PushButtonStartProps) {
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
          <radialGradient id="startBtnTop" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#7dff7d" />
            <stop offset="70%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>

          <radialGradient id="startBtnGlow">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>

        {/* Glow */}
        {active && (
          <circle
            cx={center}
            cy={center}
            r="48"
            fill="url(#startBtnGlow)"
          />
        )}

        {/* Base */}
        <ellipse
          cx={center}
          cy="85"
          rx="42"
          ry="16"
          fill="#9ca3af"
          opacity="0.35"
        />

        {/* Metal Housing */}
        <circle
          cx={center}
          cy={center}
          r="42"
          fill="url(#metalBody)"
          stroke="#4b5563"
          strokeWidth="2"
        />

        {/* Inner Ring */}
        <circle
          cx={center}
          cy={center}
          r="34"
          fill="#1f2937"
          stroke="#d1d5db"
          strokeWidth="2"
        />

        {/* Green Button */}
        <circle
          cx={center}
          cy={active ? center + 2 : center}
          r="26"
          fill="url(#startBtnTop)"
          stroke="#166534"
          strokeWidth="2"
        />

        {/* Highlight */}
        <ellipse
          cx="50"
          cy="45"
          rx="10"
          ry="6"
          fill="white"
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
      </div>
    </div>
  );
}