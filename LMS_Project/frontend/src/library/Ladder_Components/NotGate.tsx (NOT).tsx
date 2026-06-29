"use client";

import React from "react";

export interface NotGateProps {
  width?: number;
  height?: number;
  label?: string;
  input?: boolean;
}

export default function NotGate({
  width = 220,
  height = 100,
  label = "NOT",
  input = false,
}: NotGateProps) {
  const output = !input;

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
        {/* Input */}
        <line
          x1="0"
          y1="50"
          x2="60"
          y2="50"
          stroke={input ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Triangle */}
        <path
          d="M60 20 L60 80 L140 50 Z"
          fill="white"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Inversion Bubble */}
        <circle
          cx="150"
          cy="50"
          r="10"
          fill="white"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Output */}
        <line
          x1="160"
          y1="50"
          x2="220"
          y2="50"
          stroke={output ? activeColor : inactiveColor}
          strokeWidth="3"
        />

        {/* Output Indicator */}
        <circle
          cx="190"
          cy="25"
          r="6"
          fill={output ? activeColor : "white"}
          stroke={inactiveColor}
          strokeWidth="2"
        />

        {/* Label */}
        <text
          x="100"
          y="55"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={output ? activeColor : inactiveColor}
        >
          NOT
        </text>
      </svg>

      <span className="mt-1 text-xs font-medium">
        {label}
      </span>
    </div>
  );
}