"use client";

import React from "react";

export interface NotGateProps {
  width?: number;
  height?: number;
  active?: boolean;
  label?: string;
}

export default function NotGate({
  width = 120,
  height = 80,
  active = false,
  label = "NOT",
}: NotGateProps) {
  const stroke = active ? "#22c55e" : "#000";
  const fill = active ? "#dcfce7" : "#ffffff";

  const centerY = height / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Input */}
      <line
        x1="0"
        y1={centerY}
        x2="25"
        y2={centerY}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Triangle */}
      <path
        d={`
          M25 10
          L25 ${height - 10}
          L85 ${centerY}
          Z
        `}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Inversion Bubble */}
      <circle
        cx="92"
        cy={centerY}
        r="7"
        fill="#fff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Output */}
      <line
        x1="99"
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Label */}
      <text
        x="52"
        y={centerY + 5}
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