"use client";

import React from "react";

export interface XnorGateProps {
  width?: number;
  height?: number;
  active?: boolean;
  label?: string;
}

export default function XnorGate({
  width = 150,
  height = 80,
  active = false,
  label = "XNOR",
}: XnorGateProps) {
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

      {/* XOR Front Curve */}
      <path
        d="
          M22 10
          Q52 40 22 70
        "
        fill="none"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* XOR Body */}
      <path
        d="
          M32 10
          Q62 40 32 70
          Q88 70 108 40
          Q88 10 32 10
          Z
        "
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Inversion Bubble */}
      <circle
        cx="116"
        cy="40"
        r="7"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Output */}
      <line
        x1="123"
        y1="40"
        x2={width}
        y2="40"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Label */}
      <text
        x="70"
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