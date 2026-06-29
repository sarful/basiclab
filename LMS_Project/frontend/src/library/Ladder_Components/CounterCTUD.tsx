"use client";

import React from "react";

export interface CounterCTUDProps {
  width?: number;
  height?: number;
  label?: string;
  preset?: number;
  count?: number;
  upEnabled?: boolean;
  downEnabled?: boolean;
  done?: boolean;
}

export default function CounterCTUD({
  width = 220,
  height = 100,
  label = "CTUD",
  preset = 100,
  count = 25,
  upEnabled = false,
  downEnabled = false,
  done = false,
}: CounterCTUDProps) {
  const strokeColor =
    upEnabled || downEnabled ? "#22c55e" : "#000";

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Up Input */}
        <line
          x1="0"
          y1="35"
          x2="35"
          y2="35"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Down Input */}
        <line
          x1="0"
          y1="65"
          x2="35"
          y2="65"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Counter Block */}
        <rect
          x="35"
          y="15"
          width="140"
          height="70"
          rx="6"
          fill="white"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Name */}
        <text
          x="105"
          y="35"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={strokeColor}
        >
          CTUD
        </text>

        {/* Preset */}
        <text
          x="105"
          y="55"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          PV: {preset}
        </text>

        {/* Current Value */}
        <text
          x="105"
          y="70"
          textAnchor="middle"
          fontSize="11"
          fill={strokeColor}
        >
          CV: {count}
        </text>

        {/* Up Arrow */}
        <path
          d="M48 35 L48 25 M48 25 L43 30 M48 25 L53 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Down Arrow */}
        <path
          d="M48 65 L48 75 M48 75 L43 70 M48 75 L53 70"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Done Indicator */}
        <circle
          cx="160"
          cy="30"
          r="5"
          fill={done ? "#22c55e" : "white"}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Output */}
        <line
          x1="175"
          y1="50"
          x2={width}
          y2="50"
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