"use client";

import React from "react";

export interface NormallyClosedContactProps {
  width?: number;
  height?: number;
  label?: string;
  active?: boolean;
}

export default function NormallyClosedContact({
  width = 120,
  height = 60,
  label = "NC",
  active = false,
}: NormallyClosedContactProps) {
  const centerY = height / 2;
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
          y1={centerY}
          x2="40"
          y2={centerY}
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Left Contact */}
        <line
          x1="40"
          y1="15"
          x2="40"
          y2="45"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Right Contact */}
        <line
          x1="80"
          y1="15"
          x2="80"
          y2="45"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* NC Diagonal Slash */}
        <line
          x1="35"
          y1="45"
          x2="85"
          y2="15"
          stroke={strokeColor}
          strokeWidth="3"
        />

        {/* Right Wire */}
        <line
          x1="80"
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