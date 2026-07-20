"use client";

import React from "react";

export interface CurrentFlowAnimatorProps {
  active?: boolean;
  width?: number;
  height?: number;
  color?: string;
  path?: string;
  speed?: number;
  particleCount?: number;
  showLabel?: boolean;
  label?: string;
}

export default function CurrentFlowAnimator({
  active = false,
  width = 420,
  height = 120,
  color = "#22c55e",
  path = "M 40 60 L 380 60",
  speed = 1.2,
  particleCount = 3,
  showLabel = true,
  label = "Current Flow",
}: CurrentFlowAnimatorProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <filter id="currentGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={active ? color : "#94a3b8"}
        strokeWidth="6"
        strokeLinecap="round"
        opacity={active ? 1 : 0.35}
      />

      {active &&
        Array.from({ length: particleCount }).map((_, i) => (
          <circle key={i} r="6" fill={color} filter="url(#currentGlow)">
            <animateMotion
              dur={`${speed}s`}
              begin={`${(i * speed) / particleCount}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        ))}

      {showLabel && (
        <text
          x={width / 2}
          y="28"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={active ? color : "#64748b"}
        >
          {label}: {active ? "ACTIVE" : "OFF"}
        </text>
      )}
    </svg>
  );
}