"use client";

import React from "react";

export interface OrGateProps {
  width?: number;
  height?: number;
  label?: string;
  inputA?: boolean;
  inputB?: boolean;
}

export default function OrGate({
  width = 220,
  height = 120,
  label = "OR",
  inputA = false,
  inputB = false,
}: OrGateProps) {
  const output = inputA || inputB;

  const activeColor = "#22c55e";
  const inactiveColor = "#000";

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Input A */}
        <line
          x1="0"
          y1="40"
          x2="55"
          y2="40"
          stroke={inputA ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Input B */}
        <line
          x1="0"
          y1="80"
          x2="55"
          y2="80"
          stroke={inputB ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* OR Gate Shape */}
        <path
          d="
            M55 20
            Q95 60 55 100
            Q110 100 155 60
            Q110 20 55 20
          "
          fill="white"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* OR Label */}
        <text
          x="105"
          y="66"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={output ? activeColor : inactiveColor}
        >
          OR
        </text>

        {/* Output Line */}
        <line
          x1="155"
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