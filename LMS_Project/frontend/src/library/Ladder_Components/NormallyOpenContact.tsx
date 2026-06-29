"use client";

import React from "react";

export interface NormallyOpenContactProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function NormallyOpenContact({
  width = 120,
  height = 60,
  label = "NO",
  active = false,
}: NormallyOpenContactProps) {
  const centerY = height / 2;

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
          stroke={active ? "#22c55e" : "#000"}
          strokeWidth="3"
        />

        {/* Left Contact */}
        <line
          x1="40"
          y1="15"
          x2="40"
          y2="45"
          stroke={active ? "#22c55e" : "#000"}
          strokeWidth="3"
        />

        {/* Right Contact */}
        <line
          x1="80"
          y1="15"
          x2="80"
          y2="45"
          stroke={active ? "#22c55e" : "#000"}
          strokeWidth="3"
        />

        {/* Right Wire */}
        <line
          x1="80"
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke={active ? "#22c55e" : "#000"}
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