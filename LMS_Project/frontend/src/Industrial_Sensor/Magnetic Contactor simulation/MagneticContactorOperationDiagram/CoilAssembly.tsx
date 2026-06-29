"use client";

import React from "react";

export interface CoilAssemblyProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function CoilAssembly({
  energized = false,
  width = 320,
  height = 220,
  showLabels = true,
}: CoilAssemblyProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 320 220">
      <defs>
        <filter id="coilGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="coilWire" x1="0" x2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="coreMetal" x1="0" x2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Coil body */}
      <rect
        x="45"
        y="55"
        width="230"
        height="110"
        rx="18"
        fill={energized ? "#fef3c7" : "#e5e7eb"}
        stroke="#92400e"
        strokeWidth="3"
        opacity={energized ? 1 : 0.75}
        filter={energized ? "url(#coilGlow)" : undefined}
      />

      {/* Iron core inside coil */}
      <rect
        x="145"
        y="30"
        width="35"
        height="160"
        rx="6"
        fill="url(#coreMetal)"
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Coil winding */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 60 + i * 10;
        return (
          <path
            key={i}
            d={`M ${x} 70 Q ${x + 12} 110 ${x} 150`}
            fill="none"
            stroke={energized ? "url(#coilWire)" : "#9ca3af"}
            strokeWidth="5"
            strokeLinecap="round"
          />
        );
      })}

      {/* A1 terminal */}
      <circle
        cx="30"
        cy="110"
        r="12"
        fill={energized ? "#22c55e" : "#9ca3af"}
        stroke="#111827"
        strokeWidth="2"
      />
      <text x="16" y="88" fontSize="16" fontWeight="800" fill="#111827">
        A1
      </text>

      {/* A2 terminal */}
      <circle
        cx="290"
        cy="110"
        r="12"
        fill={energized ? "#22c55e" : "#9ca3af"}
        stroke="#111827"
        strokeWidth="2"
      />
      <text x="276" y="88" fontSize="16" fontWeight="800" fill="#111827">
        A2
      </text>

      {/* Lead wires */}
      <line x1="42" y1="110" x2="55" y2="110" stroke="#374151" strokeWidth="4" />
      <line x1="265" y1="110" x2="278" y2="110" stroke="#374151" strokeWidth="4" />

      {/* Magnetic field */}
      {energized &&
        [0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx="160"
            cy="110"
            rx={105 + i * 25}
            ry={55 + i * 18}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity={0.75 - i * 0.15}
            filter="url(#coilGlow)"
          />
        ))}

      {showLabels && (
        <>
          <text x="160" y="205" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">
            Coil Assembly
          </text>
          <text x="160" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="#475569">
            {energized ? "ENERGIZED" : "DE-ENERGIZED"}
          </text>
        </>
      )}
    </svg>
  );
}