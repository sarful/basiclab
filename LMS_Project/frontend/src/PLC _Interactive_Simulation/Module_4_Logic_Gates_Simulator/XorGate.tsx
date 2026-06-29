"use client";

import React from "react";

export interface XorGateProps {
  width?: number;
  height?: number;
  active?: boolean;
  label?: string;
}

export default function XorGate({
  width = 140,
  height = 80,
  active = false,
  label = "XOR",
}: XorGateProps) {
  const stroke = active ? "#22c55e" : "#000";
  const fill = active ? "#dcfce7" : "#ffffff";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Input A */}
      <line
        x1="0"
        y1="25"
        x2="32"
        y2="25"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Input B */}
      <line
        x1="0"
        y1="55"
        x2="32"
        y2="55"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* XOR Extra Input Curve */}
      <path
        d="
          M22 10
          Q52 40 22 70
        "
        fill="none"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Main XOR Body */}
      <path
        d="
          M32 10
          Q62 40 32 70
          Q85 70 105 40
          Q85 10 32 10
          Z
        "
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Output */}
      <line
        x1="105"
        y1="40"
        x2={width}
        y2="40"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Label */}
      <text
        x="68"
        y="45"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={stroke}
      >
        {label}
      </text>
    </svg>
  );
}