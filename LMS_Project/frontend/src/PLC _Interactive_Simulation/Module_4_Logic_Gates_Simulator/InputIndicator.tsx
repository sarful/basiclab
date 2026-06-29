"use client";

import React from "react";

export interface InputIndicatorProps {
  width?: number;
  height?: number;
  label?: string;
  address?: string;
  active?: boolean;
}

export default function InputIndicator({
  width = 100,
  height = 70,
  label = "INPUT",
  address = "I0.0",
  active = false,
}: InputIndicatorProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* LED lamp */}
      <circle
        cx={width / 2}
        cy="28"
        r="16"
        fill={active ? "#22c55e" : "#9ca3af"}
        stroke={active ? "#16a34a" : "#4b5563"}
        strokeWidth="3"
      />

      {/* Inner glow */}
      <circle
        cx={width / 2}
        cy="28"
        r="7"
        fill={active ? "#bbf7d0" : "#d1d5db"}
      />

      {/* Address */}
      <text
        x={width / 2}
        y="55"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#111827"
      >
        {address}
      </text>

      {/* Label */}
      <text
        x={width / 2}
        y="68"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#374151"
      >
        {label}
      </text>
    </svg>
  );
}