"use client";

import React from "react";

export interface PushButtonInputProps {
  width?: number;
  height?: number;
  label?: string;
  pressed?: boolean;
  type?: "NO" | "NC";
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
}

export default function PushButtonInput({
  width = 120,
  height = 90,
  label = "PB1",
  pressed = false,
  type = "NO",
  onMouseDown,
  onMouseUp,
  onMouseLeave,
}: PushButtonInputProps) {
  const active = type === "NO" ? pressed : !pressed;
  const stroke = active ? "#16a34a" : "#111827";
  const buttonFill = pressed ? "#dc2626" : "#ef4444";
  const baseFill = active ? "#dcfce7" : "#f3f4f6";

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className="inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer select-none"
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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

        {/* Base */}
        <rect
          x="25"
          y="35"
          width={width - 50}
          height="32"
          rx="8"
          fill={baseFill}
          stroke={stroke}
          strokeWidth="3"
        />

        {/* Button head */}
        <circle
          cx={width / 2}
          cy={pressed ? 33 : 27}
          r="22"
          fill={buttonFill}
          stroke="#991b1b"
          strokeWidth="3"
        />

        {/* Highlight */}
        <circle
          cx={width / 2 - 7}
          cy={pressed ? 25 : 19}
          r="6"
          fill="#fecaca"
          opacity="0.8"
        />

        {/* Contact type */}
        <text
          x={width / 2}
          y="62"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={stroke}
        >
          {type}
        </text>

        {/* State */}
        <text
          x={width / 2}
          y={height - 6}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={active ? "#16a34a" : "#dc2626"}
        >
          {active ? "TRUE (1)" : "FALSE (0)"}
        </text>
      </svg>
    </button>
  );
}