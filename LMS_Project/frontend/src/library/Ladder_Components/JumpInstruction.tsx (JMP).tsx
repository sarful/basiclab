"use client";

import React from "react";

export interface JumpInstructionProps {
  width?: number;
  height?: number;
  label?: string;
  targetLabel?: string;
  active?: boolean;
}

export default function JumpInstruction({
  width = 240,
  height = 90,
  label = "JMP",
  targetLabel = "LBL_1",
  active = false,
}: JumpInstructionProps) {
  const strokeColor = active ? "#22c55e" : "#000";

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

        {/* JMP Block */}
        <rect
          x="35"
          y="15"
          width="150"
          height="60"
          rx="6"
          fill="white"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* JMP Text */}
        <text
          x="110"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          JMP
        </text>

        {/* Target Label */}
        <text
          x="110"
          y="58"
          textAnchor="middle"
          fontSize="12"
          fill={strokeColor}
        >
          {targetLabel}
        </text>

        {/* Jump Arrow */}
        <path
          d="M160 45 L180 45 M180 45 L174 39 M180 45 L174 51"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wire */}
        <line
          x1="185"
          y1="45"
          x2={width}
          y2="45"
          stroke={strokeColor}
          strokeWidth="3"
        />
      </svg>

      <span className="mt-1 text-xs font-medium text-center">
        {label}
      </span>
    </div>
  );
}