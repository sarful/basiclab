"use client";

import React from "react";

export interface TimerTOFProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: string;
  accumulated?: string;
  enabled?: boolean;
  done?: boolean;
}

export default function TimerTOF({
  width = 180,
  height = 90,
  label = "TOF",
  preset = "PT: 5s",
  accumulated = "ET: 0s",
  enabled = false,
  done = false,
}: TimerTOFProps) {
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

        {/* Timer Type */}
        <text
          x="90"
          y="38"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill={strokeColor}
        >
          TOF
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
          {accumulated}
        </text>

        {/* Done Indicator */}
        <circle
          cx="132"
          cy="28"
          r="5"
          fill={done ? "#22c55e" : "white"}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Right Wire */}
        <line
          x1="145"
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