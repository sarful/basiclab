"use client";

import React from "react";

export interface CopyInstructionProps {
  width?: number;
  height?: number;
  label?: string;
  source?: string;
  destination?: string;
  length?: number;
}

export default function CopyInstruction({
  width = 280,
  height = 100,
  label = "COP",
  source = "N7:0",
  destination = "N7:10",
  length = 5,
}: CopyInstructionProps) {
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
          y1="50"
          x2="35"
          y2="50"
          stroke="#000"
          strokeWidth="3"
        />

        {/* COP Block */}
        <rect
          x="35"
          y="15"
          width="190"
          height="70"
          rx="6"
          fill="white"
          stroke="#000"
          strokeWidth="3"
        />

        {/* Instruction Name */}
        <text
          x="130"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
        >
          COP
        </text>

        {/* Source */}
        <text
          x="130"
          y="52"
          textAnchor="middle"
          fontSize="11"
        >
          SRC: {source}
        </text>

        {/* Destination */}
        <text
          x="130"
          y="66"
          textAnchor="middle"
          fontSize="11"
        >
          DEST: {destination}
        </text>

        {/* Length */}
        <text
          x="130"
          y="79"
          textAnchor="middle"
          fontSize="11"
        >
          LEN: {length}
        </text>

        {/* Copy Arrow */}
        <path
          d="M185 50 L210 50 M210 50 L204 45 M210 50 L204 55"
          fill="none"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wire */}
        <line
          x1="225"
          y1="50"
          x2={width}
          y2="50"
          stroke="#000"
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