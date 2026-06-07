"use client";

import React from "react";

export interface CounterCTUProps {
  width?: number;
  height?: number;
  label?: string;
  presetValue?: number;
  currentValue?: number;
  active?: boolean;
  done?: boolean;
}

export default function CounterCTU({
  width = 170,
  height = 90,
  label = "C0",
  presetValue = 10,
  currentValue = 0,
  active = false,
  done = false,
}: CounterCTUProps) {
  const stroke = done ? "#16a34a" : active ? "#f59e0b" : "#000";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Counter Body */}
      <rect
        x="15"
        y="10"
        width={width - 30}
        height={height - 20}
        rx="8"
        fill="#ffffff"
        stroke={stroke}
        strokeWidth="3"
      />

      {/* Counter Type */}
      <text
        x={width / 2}
        y="30"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={stroke}
      >
        CTU
      </text>

      {/* Counter Address */}
      <text
        x={width / 2}
        y="48"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#111827"
      >
        {label}
      </text>

      {/* Preset Value */}
      <text
        x={width / 2}
        y="64"
        textAnchor="middle"
        fontSize="11"
        fill="#374151"
      >
        PV: {presetValue}
      </text>

      {/* Current Value */}
      <text
        x={width / 2}
        y="78"
        textAnchor="middle"
        fontSize="11"
        fill="#374151"
      >
        CV: {currentValue}
      </text>
    </svg>
  );
}