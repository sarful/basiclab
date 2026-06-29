"use client";

import React from "react";

export interface SetCoilProps {
  width?: number;
  height?: number;
  label?: string;
  energized?: boolean;
}

export default function SetCoil({
  width = 140,
  height = 60,
  label = "SET",
  energized = false,
}: SetCoilProps) {
  const centerY = height / 2;
  const strokeColor = energized ? "#22c55e" : "#000";

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
          y1={centerY}
          x2="40"
          y2={centerY}
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Coil */}
        <path
          d="M60 12 Q40 30 60 48"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M80 12 Q100 30 80 48"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* S Symbol */}
        <text
          x="70"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          S
        </text>

        {/* Right Wire */}
        <line
          x1="100"
          y1={centerY}
          x2={width}
          y2={centerY}
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