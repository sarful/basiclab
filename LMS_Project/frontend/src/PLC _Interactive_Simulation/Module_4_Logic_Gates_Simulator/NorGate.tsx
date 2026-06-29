"use client";

import React from "react";

export interface NorGateProps {
  width?: number;
  height?: number;
  active?: boolean;
  label?: string;
}

export default function NorGate({
  width = 140,
  height = 80,
  active = false,
  label = "NOR",
}: NorGateProps) {
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
        x2="28"
        y2="25"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Input B */}
      <line
        x1="0"
        y1="55"
        x2="28"
        y2="55"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* OR Gate Body */}
      <path
        d="
          M28 10
          Q58 40 28 70
          Q80 70 100 40
          Q80 10 28 10
          Z
        "
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Inversion Bubble */}
      <circle
        cx="108"
        cy="40"
        r="7"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Output */}
      <line
        x1="115"
        y1="40"
        x2={width}
        y2="40"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Label */}
      <text
        x="64"
        y="45"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={stroke}
      >
        {label}
      </text>
    </svg>
  );
}