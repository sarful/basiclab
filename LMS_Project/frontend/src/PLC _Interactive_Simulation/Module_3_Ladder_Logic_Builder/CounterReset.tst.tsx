"use client";

import React from "react";

export interface CounterResetProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function CounterReset({
  width = 150,
  height = 80,
  label = "C0",
  active = false,
}: CounterResetProps) {
  const stroke = active ? "#22c55e" : "#000";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Instruction Block */}
      <rect
        x="15"
        y="10"
        width={width - 30}
        height={height - 20}
        rx="8"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Instruction Type */}
      <text
        x={width / 2}
        y="32"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill={stroke}
      >
        RES
      </text>

      {/* Counter Address */}
      <text
        x={width / 2}
        y="55"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#111827"
      >
        {label}
      </text>
    </svg>
  );
}