"use client";

import React from "react";

export interface MotorLoadProps {
  running?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function MotorLoad({
  running = false,
  width = 300,
  height = 220,
  showLabels = true,
}: MotorLoadProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 300 220">
      <defs>
        <filter id="motorGlow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle
        cx="150"
        cy="105"
        r="60"
        fill={running ? "#dcfce7" : "#e5e7eb"}
        stroke={running ? "#22c55e" : "#64748b"}
        strokeWidth="5"
      />

      <text x="150" y="116" textAnchor="middle" fontSize="42" fontWeight="900" fill="#111827">
        M
      </text>

      {running && (
        <circle cx="150" cy="105" r="75" fill="#22c55e" opacity="0.18" filter="url(#motorGlow)" />
      )}

      <line x1="45" y1="80" x2="95" y2="80" stroke="#ef4444" strokeWidth="5" />
      <line x1="45" y1="105" x2="90" y2="105" stroke="#eab308" strokeWidth="5" />
      <line x1="45" y1="130" x2="95" y2="130" stroke="#2563eb" strokeWidth="5" />

      <text x="20" y="84" fontSize="13" fontWeight="800" fill="#ef4444">T1</text>
      <text x="20" y="109" fontSize="13" fontWeight="800" fill="#ca8a04">T2</text>
      <text x="20" y="134" fontSize="13" fontWeight="800" fill="#2563eb">T3</text>

      <rect
        x="90"
        y="175"
        width="120"
        height="28"
        rx="14"
        fill={running ? "#dcfce7" : "#fee2e2"}
      />

      <text
        x="150"
        y="194"
        textAnchor="middle"
        fontSize="13"
        fontWeight="900"
        fill={running ? "#166534" : "#991b1b"}
      >
        {running ? "MOTOR RUNNING" : "MOTOR OFF"}
      </text>

      {showLabels && (
        <text x="150" y="28" textAnchor="middle" fontSize="17" fontWeight="900" fill="#111827">
          Three Phase Motor Load
        </text>
      )}
    </svg>
  );
}