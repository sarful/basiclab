"use client";

import React from "react";

export interface NormallyClosedContactProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function NormallyClosedContact({
  x = 0,
  y = 0,
  width = 120,
  height = 60,
  label = "X1",
  active = false,
}: NormallyClosedContactProps) {
  const leftContactX = width * 0.3;
  const rightContactX = width * 0.7;
  const centerY = height / 2;

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Left Connection */}
      <line
        x1={0}
        y1={centerY}
        x2={leftContactX}
        y2={centerY}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* Right Connection */}
      <line
        x1={rightContactX}
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* NC Contact Left Bar */}
      <line
        x1={leftContactX}
        y1={12}
        x2={leftContactX}
        y2={height - 12}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="4"
      />

      {/* NC Contact Right Bar */}
      <line
        x1={rightContactX}
        y1={12}
        x2={rightContactX}
        y2={height - 12}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="4"
      />

      {/* Normally Closed Diagonal Slash */}
      <line
        x1={leftContactX + 4}
        y1={height - 10}
        x2={rightContactX - 4}
        y2={10}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* Address Label */}
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