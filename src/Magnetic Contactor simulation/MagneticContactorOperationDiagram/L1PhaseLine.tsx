"use client";

import React from "react";

export interface L1PhaseLineProps {
  width?: number;
  y?: number;
  active?: boolean;
  animateFlow?: boolean;
  label?: string;
  startX?: number;
  endX?: number;
}

export default function L1PhaseLine({
  width = 500,
  y = 50,
  active = true,
  animateFlow = true,
  label = "L1",
  startX = 40,
  endX = 460,
}: L1PhaseLineProps) {
  return (
    <svg
      width={width}
      height={100}
      viewBox={`0 0 ${width} 100`}
      className="overflow-visible"
    >
      <defs>
        <filter id="l1Glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="l1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      {/* Label */}
      <text
        x="5"
        y={y + 6}
        fontSize="18"
        fontWeight="700"
        fill="#dc2626"
      >
        {label}
      </text>

      {/* Terminal */}
      <circle
        cx={startX}
        cy={y}
        r="8"
        fill="#ffffff"
        stroke="#dc2626"
        strokeWidth="3"
      />

      {/* Phase Line */}
      <line
        x1={startX + 10}
        y1={y}
        x2={endX}
        y2={y}
        stroke="url(#l1Gradient)"
        strokeWidth="5"
        strokeLinecap="round"
        filter={active ? "url(#l1Glow)" : undefined}
        opacity={active ? 1 : 0.25}
      />

      {/* Animated Current Flow */}
      {active && animateFlow && (
        <>
          <circle r="5" fill="#ef4444">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>

          <circle r="5" fill="#f87171">
            <animateMotion
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>

          <circle r="5" fill="#fecaca">
            <animateMotion
              dur="1.2s"
              begin="0.8s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>
        </>
      )}

      {/* Status */}
      <circle
        cx={endX + 20}
        cy={y}
        r="8"
        fill={active ? "#22c55e" : "#9ca3af"}
      />

      <text
        x={endX + 35}
        y={y + 5}
        fontSize="13"
        fill="#374151"
        fontWeight="600"
      >
        {active ? "LIVE" : "OFF"}
      </text>
    </svg>
  );
}