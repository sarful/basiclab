"use client";

import React from "react";

export interface TimerTONProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: string;
  elapsed?: string;
  active?: boolean;
  done?: boolean;
}

export default function TimerTON({
  width = 150,
  height = 80,
  label = "T0",
  preset = "5s",
  elapsed = "0s",
  active = false,
  done = false,
}: TimerTONProps) {
  const stroke = done ? "#16a34a" : active ? "#f59e0b" : "#000";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Timer block */}
      <rect
        x="20"
        y="10"
        width={width - 40}
        height={height - 20}
        rx="8"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Timer type */}
      <text
        x={width / 2}
        y="30"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={stroke}
      >
        TON
      </text>

      {/* Timer address */}
      <text
        x={width / 2}
        y="48"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#111827"
      >
        {label}
      </text>

      {/* Preset / elapsed value */}
      <text
        x={width / 2}
        y="64"
        textAnchor="middle"
        fontSize="11"
        fontWeight="500"
        fill="#374151"
      >
        PT: {preset} / ET: {elapsed}
      </text>
    </svg>
  );
}