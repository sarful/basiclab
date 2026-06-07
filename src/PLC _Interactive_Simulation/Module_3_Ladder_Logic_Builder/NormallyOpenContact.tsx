"use client";

import React from "react";

export interface NormallyOpenContactProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function NormallyOpenContact({
  x = 0,
  y = 0,
  width = 120,
  height = 60,
  label = "X0",
  active = false,
}: NormallyOpenContactProps) {
  const leftLineEnd = width * 0.3;
  const rightLineStart = width * 0.7;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Left rail connection */}
      <line
        x1={0}
        y1={height / 2}
        x2={leftLineEnd}
        y2={height / 2}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* Right rail connection */}
      <line
        x1={rightLineStart}
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* NO Contact */}
      <line
        x1={leftLineEnd}
        y1={12}
        x2={leftLineEnd}
        y2={height - 12}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="4"
      />

      <line
        x1={rightLineStart}
        y1={12}
        x2={rightLineStart}
        y2={height - 12}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="4"
      />

      {/* Label */}
      <text
        x={width / 2}
        y={height - 5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#111827"
      >
        {label}
      </text>
    </svg>
  );
}