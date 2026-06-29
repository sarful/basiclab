"use client";

import React from "react";

export interface AndGateProps {
  width?: number;
  height?: number;
  active?: boolean;
  label?: string;
}

export default function AndGate({
  width = 120,
  height = 80,
  active = false,
  label = "AND",
}: AndGateProps) {
  const stroke = active ? "#22c55e" : "#000";
  const fill = active ? "#dcfce7" : "#fff";

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
        x2="25"
        y2="25"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Input B */}
      <line
        x1="0"
        y1="55"
        x2="25"
        y2="55"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Gate Body */}
      <path
        d={`
          M25 10
          L60 10
          A30 30 0 0 1 60 70
          L25 70
          Z
        `}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Output */}
      <line
        x1="90"
        y1="40"
        x2={width}
        y2="40"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Label */}
      <text
        x="52"
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