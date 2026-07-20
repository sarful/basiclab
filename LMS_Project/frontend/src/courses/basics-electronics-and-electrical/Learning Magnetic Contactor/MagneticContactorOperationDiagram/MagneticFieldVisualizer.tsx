"use client";

import React from "react";

export interface MagneticFieldVisualizerProps {
  active?: boolean;
  width?: number;
  height?: number;
  intensity?: number;
  showLabels?: boolean;
}

export default function MagneticFieldVisualizer({
  active = false,
  width = 360,
  height = 240,
  intensity = 1,
  showLabels = true,
}: MagneticFieldVisualizerProps) {
  const opacity = active ? Math.min(0.9, 0.35 + intensity * 0.45) : 0.12;

  return (
    <svg width={width} height={height} viewBox="0 0 360 240">
      <defs>
        <filter id="fieldGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <marker
          id="fieldArrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L8 3 L0 6 Z" fill="#38bdf8" />
        </marker>
      </defs>

      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx="180"
          cy="120"
          rx={55 + i * 25}
          ry={30 + i * 14}
          fill="none"
          stroke={active ? "#38bdf8" : "#94a3b8"}
          strokeWidth={active ? 3 : 2}
          opacity={opacity - i * 0.1}
          filter={active ? "url(#fieldGlow)" : undefined}
        />
      ))}

      {active &&
        [0, 1, 2].map((i) => (
          <circle key={i} r="5" fill="#0ea5e9">
            <animateMotion
              dur={`${1.4 - i * 0.2}s`}
              repeatCount="indefinite"
              path={`M ${90 - i * 15} 120 C ${100} ${40 + i * 10}, ${260} ${
                40 + i * 10
              }, ${270 + i * 15} 120 C ${260} ${200 - i * 10}, ${100} ${
                200 - i * 10
              }, ${90 - i * 15} 120`}
            />
          </circle>
        ))}

      <rect
        x="150"
        y="62"
        width="60"
        height="116"
        rx="8"
        fill={active ? "#cbd5e1" : "#94a3b8"}
        stroke="#334155"
        strokeWidth="3"
      />

      <text x="180" y="118" textAnchor="middle" fontSize="13" fontWeight="800" fill="#111827">
        CORE
      </text>

      {showLabels && (
        <>
          <text x="180" y="25" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">
            Magnetic Field Visualizer
          </text>

          <text x="180" y="222" textAnchor="middle" fontSize="13" fontWeight="700" fill="#475569">
            {active ? "Magnetic flux active around iron core" : "No magnetic field"}
          </text>
        </>
      )}
    </svg>
  );
}