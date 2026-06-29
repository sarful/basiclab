"use client";

import React from "react";

export interface CounterResetProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function CounterReset({
  width = 180,
  height = 90,
  label = "COUNTER RESET",
  active = false,
}: CounterResetProps) {
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

        {/* Reset Block */}
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

        {/* Circular Reset Arrow */}
        <path
          d="M78 58
             A10 10 0 1 1 98 58"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />

        <path
          d="M98 58 L93 54 M98 58 L93 62"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
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