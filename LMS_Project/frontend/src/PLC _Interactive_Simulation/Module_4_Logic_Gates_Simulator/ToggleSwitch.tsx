"use client";

import React from "react";

export interface ToggleSwitchProps {
  width?: number;
  height?: number;
  label?: string;
  value?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  width = 120,
  height = 70,
  label = "SW1",
  value = false,
  onToggle,
  disabled = false,
}: ToggleSwitchProps) {
  const trackColor = value ? "#22c55e" : "#9ca3af";
  const strokeColor = value ? "#16a34a" : "#6b7280";

  const knobRadius = 16;
  const knobY = height / 2;
  const knobX = value ? width - 30 : 30;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className="inline-flex items-center justify-center bg-transparent border-0 p-0"
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Label */}
        <text
          x={width / 2}
          y="14"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#111827"
        >
          {label}
        </text>

        {/* Switch Track */}
        <rect
          x="15"
          y={height / 2 - 12}
          width={width - 30}
          height="24"
          rx="12"
          fill={trackColor}
          opacity="0.25"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Left OFF Text */}
        <text
          x="25"
          y={height / 2 + 4}
          fontSize="11"
          fontWeight="700"
          fill="#374151"
        >
          OFF
        </text>

        {/* Right ON Text */}
        <text
          x={width - 35}
          y={height / 2 + 4}
          fontSize="11"
          fontWeight="700"
          fill="#374151"
        >
          ON
        </text>

        {/* Switch Knob */}
        <circle
          cx={knobX}
          cy={knobY}
          r={knobRadius}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Status Indicator */}
        <circle
          cx={knobX}
          cy={knobY}
          r="6"
          fill={value ? "#22c55e" : "#ef4444"}
        />

        {/* State Text */}
        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={value ? "#16a34a" : "#dc2626"}
        >
          {value ? "TRUE (1)" : "FALSE (0)"}
        </text>
      </svg>
    </button>
  );
}