"use client";

import React from "react";

export interface OutputTerminalProps {
  width?: number;
  height?: number;
  label?: string;
  address?: string;
  active?: boolean;
  color?: "green" | "red" | "yellow" | "blue";
}

export default function OutputTerminal({
  width = 120,
  height = 70,
  label = "Output",
  address = "Q0.0",
  active = false,
  color = "green",
}: OutputTerminalProps) {
  const themes = {
    green: "#22c55e",
    red: "#ef4444",
    yellow: "#eab308",
    blue: "#3b82f6",
  };

  const activeColor = themes[color];
  const stroke = active ? activeColor : "#111827";
  const fill = active ? "#f0fdf4" : "#ffffff";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Terminal body */}
      <rect
        x="10"
        y="10"
        width={width - 20}
        height={height - 20}
        rx="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Screw terminal */}
      <circle
        cx="28"
        cy={height / 2}
        r="10"
        fill="#f3f4f6"
        stroke={stroke}
        strokeWidth="2"
      />

      <line
        x1="22"
        y1={height / 2}
        x2="34"
        y2={height / 2}
        stroke={stroke}
        strokeWidth="2"
      />

      {/* Output wire */}
      <line
        x1="38"
        y1={height / 2}
        x2={width - 18}
        y2={height / 2}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Address */}
      <text
        x={width - 20}
        y="28"
        textAnchor="end"
        fontSize="13"
        fontWeight="700"
        fill="#111827"
      >
        {address}
      </text>

      {/* Label */}
      <text
        x={width - 20}
        y="48"
        textAnchor="end"
        fontSize="11"
        fontWeight="600"
        fill="#374151"
      >
        {label}
      </text>

      {/* Status LED */}
      <circle
        cx={width - 18}
        cy={height - 14}
        r="5"
        fill={active ? activeColor : "#9ca3af"}
      />
    </svg>
  );
}