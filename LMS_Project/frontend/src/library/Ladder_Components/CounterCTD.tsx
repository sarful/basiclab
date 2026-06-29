"use client";

import React from "react";

export interface CounterCTDProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: number;
  count?: number;
  enabled?: boolean;
  done?: boolean;
}

export default function CounterCTD({
  width = 190,
  height = 90,
  label = "CTD",
  preset = 10,
  count = 10,
  enabled = false,
  done = false,
}: CounterCTDProps) {
  const strokeColor = enabled ? "#22c55e" : "#000";

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

        {/* Counter Block */}
        <rect
          x="35"
          y="15"
          width="120"
          height="60"
          rx="6"
          fill="white"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Counter Name */}
        <text
          x="95"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          CTD
        </text>

        {/* Preset Value */}
        <text
          x="95"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          PV: {preset}
        </text>

        {/* Current Value */}
        <text
          x="95"
          y="67"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          CV: {count}
        </text>

        {/* Done Indicator */}
        <circle
          cx="142"
          cy="28"
          r="5"
          fill={done ? "#22c55e" : "white"}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Down Arrow */}
        <path
          d="M48 45 L48 58 M48 58 L43 53 M48 58 L53 53"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Wire */}
        <line
          x1="155"
          y1="45"
          x2={width}
          y2="45"
          stroke={done ? "#22c55e" : strokeColor}
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