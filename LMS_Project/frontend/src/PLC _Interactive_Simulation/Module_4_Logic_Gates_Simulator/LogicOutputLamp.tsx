"use client";

import React from "react";

export interface LogicOutputLampProps {
  width?: number;
  height?: number;
  label?: string;
  address?: string;
  active?: boolean;
  color?: "green" | "red" | "yellow" | "blue";
}

export default function LogicOutputLamp({
  width = 110,
  height = 95,
  label = "OUTPUT",
  address = "Q0.0",
  active = false,
  color = "green",
}: LogicOutputLampProps) {
  const colors = {
    green: {
      on: "#22c55e",
      glow: "#bbf7d0",
      off: "#9ca3af",
      border: "#15803d",
    },
    red: {
      on: "#ef4444",
      glow: "#fecaca",
      off: "#9ca3af",
      border: "#b91c1c",
    },
    yellow: {
      on: "#eab308",
      glow: "#fde68a",
      off: "#9ca3af",
      border: "#ca8a04",
    },
    blue: {
      on: "#3b82f6",
      glow: "#bfdbfe",
      off: "#9ca3af",
      border: "#1d4ed8",
    },
  };

  const theme = colors[color];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Lamp housing */}
      <circle
        cx={width / 2}
        cy="32"
        r="22"
        fill={active ? theme.on : theme.off}
        stroke={active ? theme.border : "#4b5563"}
        strokeWidth="3"
      />

      {/* Inner glow */}
      <circle
        cx={width / 2}
        cy="32"
        r="10"
        fill={active ? theme.glow : "#d1d5db"}
      />

      {/* Base */}
      <rect
        x={width / 2 - 12}
        y="54"
        width="24"
        height="8"
        rx="2"
        fill="#6b7280"
      />

      {/* Address */}
      <text
        x={width / 2}
        y="78"
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
        y="92"
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