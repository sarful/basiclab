"use client";

import React from "react";

export interface AuxiliaryNOContactProps {
  energized?: boolean;
  width?: number;
  height?: number;
  label?: string;
  terminalA?: string;
  terminalB?: string;
  showLabels?: boolean;
  animateFlow?: boolean;
}

export default function AuxiliaryNOContact({
  energized = false,
  width = 220,
  height = 180,
  label = "NO",
  terminalA = "13",
  terminalB = "14",
  showLabels = true,
  animateFlow = true,
}: AuxiliaryNOContactProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 180">
      <defs>
        <filter id="noGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Header */}
      <text
        x="110"
        y="22"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#111827"
      >
        Normally Open Contact
      </text>

      {/* Left Terminal */}
      <circle
        cx="70"
        cy="90"
        r="10"
        fill="#f59e0b"
        stroke="#92400e"
        strokeWidth="2"
      />

      {/* Right Terminal */}
      <circle
        cx="150"
        cy="90"
        r="10"
        fill="#f59e0b"
        stroke="#92400e"
        strokeWidth="2"
      />

      {/* Fixed Contact */}
      <line
        x1="80"
        y1="90"
        x2="105"
        y2="90"
        stroke="#374151"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Moving Contact */}
      <line
        x1="115"
        y1={energized ? 90 : 72}
        x2="140"
        y2="90"
        stroke={energized ? "#22c55e" : "#ef4444"}
        strokeWidth="6"
        strokeLinecap="round"
        filter={energized ? "url(#noGlow)" : undefined}
        style={{
          transition: "all 400ms ease",
        }}
      />

      {/* Current Flow Animation */}
      {energized && animateFlow && (
        <circle r="5" fill="#22c55e">
          <animateMotion
            dur="1s"
            repeatCount="indefinite"
            path="M 70 90 L 150 90"
          />
        </circle>
      )}

      {/* Terminal Numbers */}
      <text
        x="62"
        y="125"
        fontSize="15"
        fontWeight="800"
        fill="#374151"
      >
        {terminalA}
      </text>

      <text
        x="142"
        y="125"
        fontSize="15"
        fontWeight="800"
        fill="#374151"
      >
        {terminalB}
      </text>

      {/* Status */}
      <rect
        x="50"
        y="140"
        width="120"
        height="24"
        rx="12"
        fill={energized ? "#dcfce7" : "#fee2e2"}
      />

      <text
        x="110"
        y="156"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill={energized ? "#166534" : "#991b1b"}
      >
        {energized ? "NO CLOSED" : "NO OPEN"}
      </text>

      {showLabels && (
        <text
          x="110"
          y="48"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#2563eb"
        >
          {label} Contact
        </text>
      )}
    </svg>
  );
}