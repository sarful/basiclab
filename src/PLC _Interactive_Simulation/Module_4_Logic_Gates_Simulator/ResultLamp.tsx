"use client";

import React from "react";

export interface ResultLampProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
  color?: "green" | "red" | "yellow" | "blue";
  showState?: boolean;
}

export default function ResultLamp({
  width = 140,
  height = 120,
  label = "OUTPUT",
  active = false,
  color = "green",
  showState = true,
}: ResultLampProps) {
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
      className="overflow-visible"
    >
      {/* Lamp Glow */}
      {active && (
        <circle
          cx={width / 2}
          cy="40"
          r="34"
          fill={theme.glow}
          opacity="0.6"
        />
      )}

      {/* Lamp Housing */}
      <circle
        cx={width / 2}
        cy="40"
        r="24"
        fill={active ? theme.on : "#9ca3af"}
        stroke={active ? theme.border : "#4b5563"}
        strokeWidth="3"
      />

      {/* Reflection */}
      <circle
        cx={width / 2 - 8}
        cy="32"
        r="6"
        fill="#ffffff"
        opacity="0.7"
      />

      {/* Lamp Base */}
      <rect
        x={width / 2 - 12}
        y="64"
        width="24"
        height="10"
        rx="2"
        fill="#6b7280"
      />

      {/* Label */}
      <text
        x={width / 2}
        y="92"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#111827"
      >
        {label}
      </text>

      {/* State */}
      {showState && (
        <text
          x={width / 2}
          y="110"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={active ? theme.border : "#6b7280"}
        >
          {active ? "TRUE (1)" : "FALSE (0)"}
        </text>
      )}
    </svg>
  );
}