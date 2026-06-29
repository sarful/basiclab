"use client";

import React from "react";

export interface TimerResetProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function TimerReset({
  width = 180,
  height = 90,
  label = "RES",
  active = false,
}: TimerResetProps) {
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

        {/* RES Block */}
        <rect
          x="35"
          y="15"
          width="110"
          height="60"
          rx="6"
          fill="white"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* RES Text */}
        <text
          x="90"
          y="40"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          RES
        </text>

        {/* Reset Arrow */}
        <path
          d="M70 58 L85 58 L80 53 M85 58 L80 63"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wire */}
        <line
          x1="145"
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