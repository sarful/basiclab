"use client";

import React from "react";

export interface TimerTPProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: string;
  elapsed?: string;
  triggered?: boolean;
  active?: boolean;
}

export default function TimerTP({
  width = 180,
  height = 90,
  label = "TP",
  preset = "PT: 2s",
  elapsed = "ET: 0s",
  triggered = false,
  active = false,
}: TimerTPProps) {
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

        {/* Timer Block */}
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

        {/* Timer Name */}
        <text
          x="90"
          y="38"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill={strokeColor}
        >
          TP
        </text>

        {/* Preset Time */}
        <text
          x="90"
          y="55"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          {preset}
        </text>

        {/* Elapsed Time */}
        <text
          x="90"
          y="68"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          {elapsed}
        </text>

        {/* Pulse Indicator */}
        <circle
          cx="132"
          cy="28"
          r="5"
          fill={triggered ? "#22c55e" : "white"}
          stroke={strokeColor}
          strokeWidth="2"
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