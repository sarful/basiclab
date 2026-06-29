"use client";

import React from "react";

export interface MultiplyInstructionProps {
  width?: number;
  height?: number;
  label?: string;
  sourceA?: number;
  sourceB?: number;
}

export default function MultiplyInstruction({
  width = 240,
  height = 90,
  label = "MUL",
  sourceA = 10,
  sourceB = 5,
}: MultiplyInstructionProps) {
  const result = sourceA * sourceB;

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
          stroke="#000"
          strokeWidth="3"
        />

        {/* Function Block */}
        <rect
          x="35"
          y="15"
          width="150"
          height="60"
          rx="6"
          fill="white"
          stroke="#000"
          strokeWidth="3"
        />

        {/* MUL Title */}
        <text
          x="110"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
        >
          MUL
        </text>

        {/* Input A */}
        <text
          x="110"
          y="52"
          textAnchor="middle"
          fontSize="11"
        >
          A: {sourceA}
        </text>

        {/* Input B */}
        <text
          x="110"
          y="66"
          textAnchor="middle"
          fontSize="11"
        >
          B: {sourceB}
        </text>

        {/* Result */}
        <text
          x="170"
          y="35"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          {result}
        </text>

        {/* Right Wire */}
        <line
          x1="185"
          y1="45"
          x2={width}
          y2="45"
          stroke="#000"
          strokeWidth="3"
        />
      </svg>

      {label && (
        <span className="mt-1 text-xs font-medium">
          {label}
        </span>
      )}
    </div>
  );
}