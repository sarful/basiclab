"use client";

import React from "react";

export interface IronCoreProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function IronCore({
  energized = false,
  width = 320,
  height = 240,
  showLabels = true,
}: IronCoreProps) {
  const coreColor = energized ? "#cbd5e1" : "#94a3b8";

  return (
    <svg width={width} height={height} viewBox="0 0 320 240">
      <defs>
        <linearGradient id="ironMetal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <filter id="magneticGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* U Core */}
      <path
        d="
          M70 40
          H130
          V180
          H190
          V40
          H250
          V210
          H70
          Z
        "
        fill="url(#ironMetal)"
        stroke="#334155"
        strokeWidth="3"
      />

      {/* Center Pole */}
      <rect
        x="145"
        y="40"
        width="30"
        height="140"
        rx="4"
        fill={coreColor}
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Magnetic Field Visualization */}
      {energized &&
        [0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="160"
            cy="115"
            rx={55 + i * 18}
            ry={30 + i * 12}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity={0.8 - i * 0.15}
            filter="url(#magneticGlow)"
          />
        ))}

      {/* Top Pole Face */}
      <rect
        x="95"
        y="25"
        width="130"
        height="18"
        rx="3"
        fill="#64748b"
      />

      {/* Bottom Base */}
      <rect
        x="55"
        y="210"
        width="210"
        height="16"
        rx="3"
        fill="#475569"
      />

      {showLabels && (
        <>
          <text
            x="160"
            y="20"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#111827"
          >
            Iron Core
          </text>

          <text
            x="160"
            y="235"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#475569"
          >
            {energized ? "MAGNETIZED CORE" : "NON-MAGNETIZED CORE"}
          </text>
        </>
      )}
    </svg>
  );
}