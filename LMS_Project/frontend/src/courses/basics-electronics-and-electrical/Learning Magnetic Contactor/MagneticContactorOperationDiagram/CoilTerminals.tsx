"use client";

import React from "react";

export interface CoilTerminalsProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function CoilTerminals({
  energized = false,
  width = 260,
  height = 120,
  showLabels = true,
}: CoilTerminalsProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 260 120">
      <defs>
        <filter id="terminalGlow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <line x1="55" y1="60" x2="205" y2="60" stroke="#374151" strokeWidth="5" />

      {[
        { label: "A1", x: 45 },
        { label: "A2", x: 215 },
      ].map((t) => (
        <g key={t.label}>
          <circle
            cx={t.x}
            cy="60"
            r="18"
            fill={energized ? "#22c55e" : "#d1d5db"}
            stroke="#111827"
            strokeWidth="3"
          />
          {energized && (
            <circle
              cx={t.x}
              cy="60"
              r="25"
              fill="#22c55e"
              opacity="0.25"
              filter="url(#terminalGlow)"
            />
          )}
          <text
            x={t.x}
            y="66"
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill="#111827"
          >
            {t.label}
          </text>
        </g>
      ))}

      {showLabels && (
        <text x="130" y="105" textAnchor="middle" fontSize="14" fontWeight="800" fill="#374151">
          Coil Terminals A1 / A2
        </text>
      )}
    </svg>
  );
}