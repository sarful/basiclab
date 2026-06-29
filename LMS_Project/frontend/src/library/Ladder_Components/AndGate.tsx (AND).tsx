"use client";

import React from "react";

export interface AndGateProps {
  width?: number;
  height?: number;
  label?: string;
  inputA?: boolean;
  inputB?: boolean;
}

export default function AndGate({
  width = 220,
  height = 120,
  label = "AND",
  inputA = false,
  inputB = false,
}: AndGateProps) {
  const output = inputA && inputB;
  const activeColor = "#22c55e";
  const inactiveColor = "#000";

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Input A */}
        <line
          x1="0"
          y1="40"
          x2="60"
          y2="40"
          stroke={inputA ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Input B */}
        <line
          x1="0"
          y1="80"
          x2="60"
          y2="80"
          stroke={inputB ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* AND Gate */}
        <path
          d="M60 20 L100 20
             Q160 20 160 60
             Q160 100 100 100
             L60 100 Z"
          fill="white"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* AND Label */}
        <text
          x="105"
          y="67"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={output ? activeColor : inactiveColor}
        >
          AND
        </text>

        {/* Output */}
        <line
          x1="160"
          y1="60"
          x2="220"
          y2="60"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Output Indicator */}
        <circle
          cx="190"
          cy="40"
          r="6"
          fill={output ? activeColor : "white"}
          stroke={inactiveColor}
          strokeWidth="2"
        />
      </svg>

      <span className="mt-1 text-xs font-medium">
        {label}
      </span>
    </div>
  );
}