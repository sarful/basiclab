"use client";

import React from "react";

export interface LogicInputSwitchProps {
  width?: number;
  height?: number;
  label?: string;
  value?: boolean;
  onToggle?: () => void;
}

export default function LogicInputSwitch({
  width = 90,
  height = 50,
  label = "A",
  value = false,
  onToggle,
}: LogicInputSwitchProps) {
  const activeColor = "#22c55e";
  const inactiveColor = "#d1d5db";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Label */}
        <text
          x="10"
          y="18"
          fontSize="14"
          fontWeight="700"
          fill="#111827"
        >
          {label}
        </text>

        {/* Toggle Body */}
        <rect
          x="25"
          y="10"
          width="50"
          height="24"
          rx="12"
          fill={value ? activeColor : inactiveColor}
        />

        {/* Toggle Knob */}
        <circle
          cx={value ? 63 : 37}
          cy="22"
          r="9"
          fill="#ffffff"
          stroke="#6b7280"
          strokeWidth="1"
        />

        {/* State Text */}
        <text
          x="50"
          y="47"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={value ? activeColor : "#6b7280"}
        >
          {value ? "1" : "0"}
        </text>
      </svg>
    </button>
  );
}