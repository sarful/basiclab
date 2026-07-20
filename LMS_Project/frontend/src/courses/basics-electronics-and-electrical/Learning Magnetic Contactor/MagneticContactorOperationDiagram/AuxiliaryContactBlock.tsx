"use client";

import React from "react";

export interface AuxiliaryContactBlockProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function AuxiliaryContactBlock({
  energized = false,
  width = 360,
  height = 260,
  showLabels = true,
}: AuxiliaryContactBlockProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 360 260">
      <rect x="40" y="45" width="280" height="160" rx="18" fill="#f8fafc" stroke="#334155" strokeWidth="3" />

      <text x="110" y="35" fontSize="16" fontWeight="800" fill="#111827">
        NC 21-22
      </text>
      <text x="245" y="35" fontSize="16" fontWeight="800" fill="#111827">
        NO 13-14
      </text>

      {/* NC Contact */}
      <g>
        <circle cx="105" cy="95" r="10" fill="#f59e0b" />
        <circle cx="105" cy="155" r="10" fill="#f59e0b" />
        <line x1="105" y1="105" x2={energized ? 135 : 105} y2={energized ? 135 : 145} stroke={energized ? "#ef4444" : "#22c55e"} strokeWidth="7" strokeLinecap="round" />
        <text x="70" y="230" fontSize="14" fontWeight="800" fill={energized ? "#ef4444" : "#16a34a"}>
          {energized ? "NC OPEN" : "NC CLOSED"}
        </text>
      </g>

      {/* NO Contact */}
      <g>
        <circle cx="250" cy="95" r="10" fill="#f59e0b" />
        <circle cx="250" cy="155" r="10" fill="#f59e0b" />
        <line x1="250" y1="105" x2={energized ? 250 : 280} y2={energized ? 145 : 125} stroke={energized ? "#22c55e" : "#ef4444"} strokeWidth="7" strokeLinecap="round" />
        <text x="215" y="230" fontSize="14" fontWeight="800" fill={energized ? "#16a34a" : "#ef4444"}>
          {energized ? "NO CLOSED" : "NO OPEN"}
        </text>
      </g>

      {showLabels && (
        <text x="180" y="250" textAnchor="middle" fontSize="14" fontWeight="800" fill="#475569">
          Auxiliary Contact Block
        </text>
      )}
    </svg>
  );
}