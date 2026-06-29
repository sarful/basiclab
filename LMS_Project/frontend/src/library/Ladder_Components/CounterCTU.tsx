"use client";

import React from "react";

export interface CounterCTUProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: number;
  count?: number;
  enabled?: boolean;
  done?: boolean;
}

export default function CounterCTU({
  width = 190,
  height = 90,
  label = "CTU",
  preset = 10,
  count = 0,
  enabled = false,
  done = false,
}: CounterCTUProps) {
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

        {/* Counter Type */}
        <text
          x="95"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          CTU
        </text>

        {/* Preset */}
        <text
          x="95"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          PV: {preset}
        </text>

        {/* Current Count */}
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

        {/* Up Arrow */}
        <path
          d="M48 58 L48 45 M48 45 L43 50 M48 45 L53 50"
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