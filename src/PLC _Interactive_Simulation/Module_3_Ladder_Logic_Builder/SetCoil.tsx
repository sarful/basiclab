"use client";

import React from "react";

export interface SetCoilProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function SetCoil({
  x = 0,
  y = 0,
  width = 120,
  height = 60,
  label = "Y0",
  active = false,
}: SetCoilProps) {
  const centerY = height / 2;
  const coilLeftX = width * 0.35;
  const coilRightX = width * 0.65;
  const stroke = active ? "#22c55e" : "#000";

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
      <line x1={0} y1={centerY} x2={coilLeftX} y2={centerY} stroke={stroke} strokeWidth="3" />

      {/* Right wire */}
      <line x1={coilRightX} y1={centerY} x2={width} y2={centerY} stroke={stroke} strokeWidth="3" />

      {/* Set coil symbol */}
      <path
        d={`M ${coilLeftX + 8} 12 Q ${coilLeftX - 8} ${centerY} ${coilLeftX + 8} ${height - 12}`}
        fill="none"
        stroke={stroke}
        strokeWidth="4"
      />

      <path
        d={`M ${coilRightX - 8} 12 Q ${coilRightX + 8} ${centerY} ${coilRightX - 8} ${height - 12}`}
        fill="none"
        stroke={stroke}
        strokeWidth="4"
      />

      {/* S mark */}
      <text
        x={width / 2}
        y={centerY + 5}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={stroke}
      >
        S
      </text>

      {/* Address label */}
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