"use client";

import React from "react";

export interface AuxiliaryNCContactProps {
  energized?: boolean;
  width?: number;
  height?: number;
  label?: string;
  terminalA?: string;
  terminalB?: string;
  showLabels?: boolean;
  animateFlow?: boolean;
}

export default function AuxiliaryNCContact({
  energized = false,
  width = 220,
  height = 180,
  label = "NC",
  terminalA = "21",
  terminalB = "22",
  showLabels = true,
  animateFlow = true,
}: AuxiliaryNCContactProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 180">
      <defs>
        <filter id="ncGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text x="110" y="22" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">
        Normally Closed Contact
      </text>

      <circle cx="70" cy="90" r="10" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
      <circle cx="150" cy="90" r="10" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />

      <line x1="80" y1="90" x2="105" y2="90" stroke="#374151" strokeWidth="6" strokeLinecap="round" />

      <line
        x1="115"
        y1={energized ? 72 : 90}
        x2="140"
        y2="90"
        stroke={energized ? "#ef4444" : "#22c55e"}
        strokeWidth="6"
        strokeLinecap="round"
        filter={!energized ? "url(#ncGlow)" : undefined}
        style={{ transition: "all 400ms ease" }}
      />

      {!energized && animateFlow && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1s" repeatCount="indefinite" path="M 70 90 L 150 90" />
        </circle>
      )}

      <text x="62" y="125" fontSize="15" fontWeight="800" fill="#374151">
        {terminalA}
      </text>

      <text x="142" y="125" fontSize="15" fontWeight="800" fill="#374151">
        {terminalB}
      </text>

      <rect x="48" y="140" width="124" height="24" rx="12" fill={energized ? "#fee2e2" : "#dcfce7"} />

      <text
        x="110"
        y="156"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill={energized ? "#991b1b" : "#166534"}
      >
        {energized ? "NC OPEN" : "NC CLOSED"}
      </text>

      {showLabels && (
        <text x="110" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563eb">
          {label} Contact
        </text>
      )}
    </svg>
  );
}