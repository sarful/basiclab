"use client";

import React from "react";

export interface PushButtonStopProps {
  active?: boolean;
  label?: string;
  address?: string;
  onClick?: () => void;
  size?: number;
  showAddress?: boolean;
}

export default function PushButtonStop({
  active = false,
  label = "PB Stop",
  address = "I0.1",
  onClick,
  size = 120,
  showAddress = true,
}: PushButtonStopProps) {
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
          <radialGradient id="stopBtnTop" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ff9a9a" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>

          <radialGradient id="stopBtnGlow">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="stopMetalBody" x1="0%" y1="0%" x2="100%" y2="100%">
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
            fill="url(#stopBtnGlow)"
          />
        )}

        {/* Shadow */}
        <ellipse
          cx={center}
          cy="86"
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
          fill="url(#stopMetalBody)"
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

        {/* Red Button */}
        <circle
          cx={center}
          cy={active ? center + 2 : center}
          r="26"
          fill="url(#stopBtnTop)"
          stroke="#7f1d1d"
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

        {/* STOP Symbol */}
        <rect
          x="48"
          y="48"
          width="24"
          height="24"
          rx="3"
          fill="white"
          opacity="0.9"
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