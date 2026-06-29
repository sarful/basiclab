"use client";

import React from "react";

export interface L3PhaseLineProps {
  width?: number;
  y?: number;
  active?: boolean;
  animateFlow?: boolean;
  label?: string;
  startX?: number;
  endX?: number;
}

export default function L3PhaseLine({
  width = 500,
  y = 50,
  active = true,
  animateFlow = true,
  label = "L3",
  startX = 40,
  endX = 460,
}: L3PhaseLineProps) {
  return (
    <svg
      width={width}
      height={100}
      viewBox={`0 0 ${width} 100`}
      className="overflow-visible"
    >
      <defs>
        <filter id="l3Glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="l3Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* Label */}
      <text
        x="5"
        y={y + 6}
        fontSize="18"
        fontWeight="700"
        fill="#2563eb"
      >
        {label}
      </text>

      {/* Input Terminal */}
      <circle
        cx={startX}
        cy={y}
        r="8"
        fill="#ffffff"
        stroke="#2563eb"
        strokeWidth="3"
      />

      {/* Phase Line */}
      <line
        x1={startX + 10}
        y1={y}
        x2={endX}
        y2={y}
        stroke="url(#l3Gradient)"
        strokeWidth="5"
        strokeLinecap="round"
        filter={active ? "url(#l3Glow)" : undefined}
        opacity={active ? 1 : 0.25}
      />

      {/* Animated Current Flow */}
      {active && animateFlow && (
        <>
          <circle r="5" fill="#2563eb">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>

          <circle r="5" fill="#60a5fa">
            <animateMotion
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>

          <circle r="5" fill="#93c5fd">
            <animateMotion
              dur="1.2s"
              begin="0.8s"
              repeatCount="indefinite"
              path={`M ${startX + 10} ${y} L ${endX} ${y}`}
            />
          </circle>
        </>
      )}

      {/* Output Terminal */}
      <circle
        cx={endX}
        cy={y}
        r="8"
        fill="#ffffff"
        stroke="#2563eb"
        strokeWidth="3"
      />

      {/* Status Indicator */}
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

      {/* Phase Name */}
      <text
        x={width / 2}
        y={y - 15}
        textAnchor="middle"
        fontSize="12"
        fill="#64748b"
        fontWeight="600"
      >
        Phase 3
      </text>
    </svg>
  );
}