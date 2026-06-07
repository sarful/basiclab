"use client";

import React from "react";

export interface ThreePhaseSupplyProps {
  width?: number;
  height?: number;
  showLabels?: boolean;
  energized?: boolean;
  animateFlow?: boolean;
}

export default function ThreePhaseSupply({
  width = 420,
  height = 180,
  showLabels = true,
  energized = true,
  animateFlow = true,
}: ThreePhaseSupplyProps) {
  const phases = [
    {
      id: "L1",
      y: 45,
      color: "#ef4444",
      label: "L1",
      name: "Phase 1",
    },
    {
      id: "L2",
      y: 90,
      color: "#eab308",
      label: "L2",
      name: "Phase 2",
    },
    {
      id: "L3",
      y: 135,
      color: "#2563eb",
      label: "L3",
      name: "Phase 3",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <filter id="phaseGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Title */}
        {showLabels && (
          <text
            x={width / 2}
            y="20"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill="#1e3a8a"
          >
            THREE PHASE SUPPLY
          </text>
        )}

        {phases.map((phase) => (
          <g key={phase.id}>
            {/* Terminal */}
            <circle
              cx="40"
              cy={phase.y}
              r="8"
              fill="#ffffff"
              stroke={phase.color}
              strokeWidth="3"
            />

            {/* Supply Line */}
            <line
              x1="48"
              y1={phase.y}
              x2={width - 40}
              y2={phase.y}
              stroke={phase.color}
              strokeWidth="4"
              filter={energized ? "url(#phaseGlow)" : undefined}
              opacity={energized ? 1 : 0.3}
            />

            {/* Animated Current */}
            {energized && animateFlow && (
              <circle r="5" fill={phase.color}>
                <animateMotion
                  dur="1.2s"
                  repeatCount="indefinite"
                  path={`M 50 ${phase.y} L ${width - 40} ${phase.y}`}
                />
              </circle>
            )}

            {/* Labels */}
            {showLabels && (
              <>
                <text
                  x="10"
                  y={phase.y + 6}
                  fontSize="15"
                  fontWeight="700"
                  fill={phase.color}
                >
                  {phase.label}
                </text>

                <text
                  x={width - 30}
                  y={phase.y + 5}
                  fontSize="12"
                  textAnchor="end"
                  fill="#374151"
                >
                  {phase.name}
                </text>
              </>
            )}
          </g>
        ))}

        {/* Source Block */}
        <rect
          x="55"
          y="28"
          width="40"
          height="125"
          rx="6"
          fill="#d1d5db"
          stroke="#6b7280"
          strokeWidth="2"
        />

        <text
          x="75"
          y="95"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#111827"
        >
          3Φ
        </text>
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold">Three Phase AC Supply</div>
          <div className="text-sm text-gray-500">
            L1 • L2 • L3 Power Source
          </div>
        </div>
      )}
    </div>
  );
}