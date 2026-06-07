"use client";

import React from "react";

export interface LadderRailProps {
  side?: "left" | "right";
  height?: number;
  label?: string;
  energized?: boolean;
}

export default function LadderRail({
  side = "left",
  height = 320,
  label,
  energized = false,
}: LadderRailProps) {
  const railLabel = label ?? (side === "left" ? "L+" : "0V");

  return (
    <svg
      width="70"
      height={height}
      viewBox={`0 0 70 ${height}`}
      className="overflow-visible"
    >
      <text
        x={side === "left" ? 18 : 36}
        y="20"
        fill="#475569"
        fontSize="14"
        fontWeight="700"
        textAnchor="middle"
      >
        {railLabel}
      </text>

      <line
        x1="35"
        y1="35"
        x2="35"
        y2={height - 20}
        stroke={energized ? "#22c55e" : "#334155"}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {energized && (
        <line
          x1="35"
          y1="35"
          x2="35"
          y2={height - 20}
          stroke="#86efac"
          strokeWidth="13"
          strokeLinecap="round"
          opacity="0.25"
        />
      )}
    </svg>
  );
}