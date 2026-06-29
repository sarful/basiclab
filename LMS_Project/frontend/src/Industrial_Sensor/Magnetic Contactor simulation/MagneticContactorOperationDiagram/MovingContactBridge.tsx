"use client";

import React from "react";

export interface MovingContactBridgeProps {
  closed?: boolean;
  active?: boolean;
  width?: number;
  height?: number;
}

export default function MovingContactBridge({
  closed = false,
  active = false,
  width = 520,
  height = 180,
}: MovingContactBridgeProps) {
  const bridges = [
    { x: 100, label: "L1-T1", color: "#ef4444" },
    { x: 260, label: "L2-T2", color: "#eab308" },
    { x: 420, label: "L3-T3", color: "#2563eb" },
  ];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="bridgeMetal" x1="0" x2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <filter id="bridgeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {bridges.map((b) => (
        <g key={b.label}>
          <circle cx={b.x} cy="45" r="13" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <circle cx={b.x} cy="135" r="13" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />

          <rect
            x={b.x - 13}
            y={closed ? 58 : 72}
            width="26"
            height={closed ? 64 : 42}
            rx="8"
            fill="url(#bridgeMetal)"
            stroke="#78350f"
            strokeWidth="2"
            filter={active && closed ? "url(#bridgeGlow)" : undefined}
            style={{ transition: "all 400ms ease" }}
          />

          {active && closed && (
            <circle r="6" fill={b.color}>
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                path={`M ${b.x} 40 L ${b.x} 140`}
              />
            </circle>
          )}

          <text
            x={b.x}
            y="170"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#374151"
          >
            {b.label}
          </text>
        </g>
      ))}

      <text x={width / 2} y="18" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">
        Moving Contact Bridge
      </text>
    </svg>
  );
}