"use client";

import React from "react";

export interface MoveInstructionProps {
  width?: number;
  height?: number;
  label?: string;
  source?: number | string;
  destination?: number | string;
}

export default function MoveInstruction({
  width = 260,
  height = 90,
  label = "MOV",
  source = 100,
  destination = 100,
}: MoveInstructionProps) {
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

        {/* MOV Block */}
        <rect
          x="35"
          y="15"
          width="170"
          height="60"
          rx="6"
          fill="white"
          stroke="#000"
          strokeWidth="3"
        />

        {/* MOV Title */}
        <text
          x="120"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
        >
          MOV
        </text>

        {/* Source */}
        <text
          x="120"
          y="52"
          textAnchor="middle"
          fontSize="11"
        >
          Source: {source}
        </text>

        {/* Destination */}
        <text
          x="120"
          y="67"
          textAnchor="middle"
          fontSize="11"
        >
          Dest: {destination}
        </text>

        {/* Transfer Arrow */}
        <path
          d="M165 45 L190 45 M190 45 L184 40 M190 45 L184 50"
          fill="none"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wire */}
        <line
          x1="205"
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