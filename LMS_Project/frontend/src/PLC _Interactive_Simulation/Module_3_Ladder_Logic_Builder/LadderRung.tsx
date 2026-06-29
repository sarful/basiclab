"use client";

import React from "react";

export interface LadderRungProps {
  rungNumber?: number;
  energized?: boolean;
  leftRailX?: number;
  rightRailX?: number;
  y?: number;
  label?: string;
  showCurrentFlow?: boolean;
}

export default function LadderRung({
  rungNumber = 1,
  energized = false,
  leftRailX = 80,
  rightRailX = 820,
  y = 120,
  label = "Main Control Rung",
  showCurrentFlow = true,
}: LadderRungProps) {
  const lineColor = energized ? "#22c55e" : "#94a3b8";

  return (
    <svg
      width="100%"
      height="80"
      viewBox="0 0 900 80"
      className="overflow-visible"
    >
      <defs>
        <marker
          id={`arrow-${rungNumber}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
        </marker>
      </defs>

      {/* Rung Number */}
      <text
        x="15"
        y="45"
        fill="#475569"
        fontSize="13"
        fontWeight="700"
      >
        {String(rungNumber).padStart(3, "0")}
      </text>

      {/* Main Rung Line */}
      <line
        x1={leftRailX}
        y1="40"
        x2={rightRailX}
        y2="40"
        stroke={lineColor}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Current Flow Animation */}
      {energized && showCurrentFlow && (
        <>
          <line
            x1={leftRailX + 20}
            y1="25"
            x2={leftRailX + 90}
            y2="25"
            stroke="#22c55e"
            strokeWidth="3"
            markerEnd={`url(#arrow-${rungNumber})`}
          />

          <line
            x1={leftRailX + 220}
            y1="25"
            x2={leftRailX + 300}
            y2="25"
            stroke="#22c55e"
            strokeWidth="3"
            markerEnd={`url(#arrow-${rungNumber})`}
          />

          <line
            x1={leftRailX + 460}
            y1="25"
            x2={leftRailX + 540}
            y2="25"
            stroke="#22c55e"
            strokeWidth="3"
            markerEnd={`url(#arrow-${rungNumber})`}
          />
        </>
      )}

      {/* Rung Label */}
      <text
        x={(leftRailX + rightRailX) / 2}
        y="68"
        textAnchor="middle"
        fill="#64748b"
        fontSize="12"
      >
        {label}
      </text>

      {/* Status Indicator */}
      <circle
        cx={rightRailX + 35}
        cy="40"
        r="8"
        fill={energized ? "#22c55e" : "#cbd5e1"}
      />

      <text
        x={rightRailX + 52}
        y="45"
        fill={energized ? "#15803d" : "#64748b"}
        fontSize="11"
        fontWeight="600"
      >
        {energized ? "TRUE" : "FALSE"}
      </text>
    </svg>
  );
}