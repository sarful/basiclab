"use client";

import React from "react";

export interface OutputCoilProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function OutputCoil({
  x = 0,
  y = 0,
  width = 120,
  height = 60,
  label = "Y0",
  active = false,
}: OutputCoilProps) {
  const centerY = height / 2;
  const coilLeftX = width * 0.35;
  const coilRightX = width * 0.65;

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Left wire */}
      <line
        x1={0}
        y1={centerY}
        x2={coilLeftX}
        y2={centerY}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* Right wire */}
      <line
        x1={coilRightX}
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="3"
      />

      {/* Output coil left curve */}
      <path
        d={`M ${coilLeftX + 8} 12 Q ${coilLeftX - 8} ${centerY} ${coilLeftX + 8} ${
          height - 12
        }`}
        fill="none"
        stroke={active ? "#22c55e" : "#000"}
        strokeWidth="4"
      />

      {/* Output coil right curve */}
      <path
        d={`M ${coilRightX - 8} 12 Q ${coilRightX + 8} ${centerY} ${coilRightX - 8} ${
          height - 12
        }`}
        fill="none"
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