"use client";

import React from "react";

export interface OutputIndicatorProps {
  width?: number;
  height?: number;
  address?: string;
  label?: string;
  active?: boolean;
  color?: "green" | "red" | "yellow" | "blue";
}

export default function OutputIndicator({
  width = 100,
  height = 75,
  address = "Q0.0",
  label = "OUTPUT",
  active = false,
  color = "green",
}: OutputIndicatorProps) {
  const themes = {
    green: {
      on: "#22c55e",
      glow: "#bbf7d0",
      border: "#15803d",
    },
    red: {
      on: "#ef4444",
      glow: "#fecaca",
      border: "#b91c1c",
    },
    yellow: {
      on: "#eab308",
      glow: "#fde68a",
      border: "#ca8a04",
    },
    blue: {
      on: "#3b82f6",
      glow: "#bfdbfe",
      border: "#1d4ed8",
    },
  };

  const theme = themes[color];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Output LED */}
      <circle
        cx={width / 2}
        cy="22"
        r="16"
        fill={active ? theme.on : "#9ca3af"}
        stroke={active ? theme.border : "#4b5563"}
        strokeWidth="3"
      />

      {/* Inner Glow */}
      <circle
        cx={width / 2}
        cy="22"
        r="7"
        fill={active ? theme.glow : "#d1d5db"}
      />

      {/* Address */}
      <text
        x={width / 2}
        y="52"
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
        y="66"
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