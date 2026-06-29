"use client";

import React from "react";

export interface MagneticFieldLinesProps {
  energized?: boolean;
  width?: number;
  height?: number;
  intensity?: "low" | "medium" | "high";
  showLabels?: boolean;
  className?: string;
}

export default function MagneticFieldLines({
  energized = false,
  width = 260,
  height = 180,
  intensity = "medium",
  showLabels = true,
  className = "",
}: MagneticFieldLinesProps) {
  const opacity = energized ? 1 : 0.18;
  const strokeWidth = intensity === "high" ? 3 : intensity === "low" ? 1.6 : 2.2;
  const dashSpeed = intensity === "high" ? "1.4s" : intensity === "low" ? "3s" : "2s";

  const fieldPaths = [
    `M ${width / 2} 22 C ${width - 18} 28, ${width - 18} ${height - 28}, ${width / 2} ${height - 22}`,
    `M ${width / 2} 36 C ${width - 48} 42, ${width - 48} ${height - 42}, ${width / 2} ${height - 36}`,
    `M ${width / 2} 50 C ${width - 78} 58, ${width - 78} ${height - 58}, ${width / 2} ${height - 50}`,
    `M ${width / 2} 22 C 18 28, 18 ${height - 28}, ${width / 2} ${height - 22}`,
    `M ${width / 2} 36 C 48 42, 48 ${height - 42}, ${width / 2} ${height - 36}`,
    `M ${width / 2} 50 C 78 58, 78 ${height - 58}, ${width / 2} ${height - 50}`,
  ];

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Magnetic field lines around energized contactor coil"
        className="overflow-visible"
      >
        <defs>
          <marker
            id="fieldArrow"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L7,3 z" fill={energized ? "#2563eb" : "#94a3b8"} />
          </marker>

          <filter id="fieldGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central iron core reference */}
        <rect
          x={width / 2 - 18}
          y={34}
          width={36}
          height={height - 68}
          rx={6}
          fill="#9ca3af"
          opacity="0.35"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Magnetic field lines */}
        {fieldPaths.map((d, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke={energized ? "#2563eb" : "#94a3b8"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity={opacity - index * 0.05}
            markerEnd="url(#fieldArrow)"
            filter={energized ? "url(#fieldGlow)" : undefined}
          >
            {energized && (
              <animate
                attributeName="stroke-dashoffset"
                values="0;-36"
                dur={dashSpeed}
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}

        {/* Coil symbol reference */}
        <g opacity="0.75">
          {Array.from({ length: 9 }).map((_, index) => {
            const y = 46 + index * 11;
            return (
              <path
                key={index}
                d={`M ${width / 2 - 42} ${y} Q ${width / 2} ${y + 10} ${width / 2 + 42} ${y}`}
                fill="none"
                stroke={energized ? "#f59e0b" : "#d1d5db"}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Status badge */}
        <rect
          x={width / 2 - 47}
          y={height - 28}
          width="94"
          height="22"
          rx="11"
          fill={energized ? "#dcfce7" : "#f1f5f9"}
          stroke={energized ? "#22c55e" : "#cbd5e1"}
        />
        <text
          x={width / 2}
          y={height - 12}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={energized ? "#166534" : "#475569"}
        >
          {energized ? "FIELD ON" : "FIELD OFF"}
        </text>
      </svg>

      {showLabels && (
        <div className="text-center leading-tight">
          <div className="text-sm font-semibold text-slate-800">Magnetic Field Lines</div>
          <div className="text-xs text-slate-500">
            {energized ? "Coil current creates magnetic flux" : "No coil current, weak/no flux"}
          </div>
        </div>
      )}
    </div>
  );
}
