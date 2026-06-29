"use client";

import React from "react";

export interface CompareNotEqualProps {
  width?: number;
  height?: number;
  label?: string;
  sourceA?: number | string;
  sourceB?: number | string;
  result?: boolean;
}

export default function CompareNotEqual({
  width = 220,
  height = 90,
  label = "NEQ",
  sourceA = 10,
  sourceB = 20,
  result = true,
}: CompareNotEqualProps) {
  const strokeColor = result ? "#22c55e" : "#000";

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Wire */}
        <line
          x1="0"
          y1="45"
          x2="35"
          y2="45"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Compare Block */}
        <rect
          x="35"
          y="15"
          width="140"
          height="60"
          rx="6"
          fill="white"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Instruction */}
        <text
          x="105"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          NEQ
        </text>

        {/* Values */}
        <text
          x="105"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          A: {sourceA}
        </text>

        <text
          x="105"
          y="66"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          B: {sourceB}
        </text>

        {/* Result Indicator */}
        <circle
          cx="162"
          cy="30"
          r="5"
          fill={result ? "#22c55e" : "white"}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Right Wire */}
        <line
          x1="175"
          y1="45"
          x2={width}
          y2="45"
          stroke={strokeColor}
          strokeWidth="3"
        />
      </svg>

      {label && (
        <span className="mt-1 text-xs font-medium text-center">
          {label}
        </span>
      )}
    </div>
  );
}