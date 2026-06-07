"use client";

import React from "react";

export interface ContactBridgeProps {
  /** When true, the bridge moves down and closes the contact path */
  energized?: boolean;
  /** Width of the SVG canvas */
  width?: number;
  /** Height of the SVG canvas */
  height?: number;
  /** Show small labels */
  showLabels?: boolean;
  /** Optional CSS class */
  className?: string;
}

export default function ContactBridge({
  energized = false,
  width = 260,
  height = 150,
  showLabels = true,
  className = "",
}: ContactBridgeProps) {
  const bridgeY = energized ? 70 : 48;
  const gapColor = energized ? "#22c55e" : "#ef4444";
  const statusText = energized ? "Closed" : "Open";

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Contactor contact bridge"
      >
        <defs>
          <linearGradient id="bridgeCopper" x1="0" x2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="silverContact" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <filter id="bridgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Fixed contact supports */}
        <rect x="42" y="92" width="48" height="34" rx="5" fill="#374151" />
        <rect x="170" y="92" width="48" height="34" rx="5" fill="#374151" />

        {/* Fixed silver pads */}
        <rect x="48" y="82" width="36" height="18" rx="4" fill="url(#silverContact)" stroke="#4b5563" />
        <rect x="176" y="82" width="36" height="18" rx="4" fill="url(#silverContact)" stroke="#4b5563" />

        {/* Moving bridge group */}
        <g
          style={{
            transform: `translateY(${energized ? 18 : 0}px)`,
            transition: "transform 300ms ease-in-out",
            transformOrigin: "center",
          }}
          filter="url(#bridgeShadow)"
        >
          {/* Upper actuator stem */}
          <rect x="122" y="10" width="16" height="40" rx="4" fill="#4b5563" />

          {/* Main bridge */}
          <rect
            x="58"
            y={bridgeY - 18}
            width="144"
            height="22"
            rx="7"
            fill="url(#bridgeCopper)"
            stroke="#78350f"
            strokeWidth="2"
          />

          {/* Moving silver pads */}
          <rect x="64" y={bridgeY - 12} width="30" height="14" rx="4" fill="url(#silverContact)" />
          <rect x="166" y={bridgeY - 12} width="30" height="14" rx="4" fill="url(#silverContact)" />
        </g>

        {/* Contact status indicator */}
        <circle cx="130" cy="132" r="8" fill={gapColor} />
        <text x="145" y="137" fontSize="14" fontWeight="700" fill="#374151">
          {statusText}
        </text>

        {/* Direction arrow */}
        <path
          d="M130 44 V74"
          stroke={energized ? "#2563eb" : "#9ca3af"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={energized ? "0" : "5 5"}
        />
        <path
          d="M122 66 L130 76 L138 66"
          fill="none"
          stroke={energized ? "#2563eb" : "#9ca3af"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showLabels && (
          <>
            <text x="40" y="76" fontSize="12" fontWeight="700" fill="#4b5563">
              Fixed
            </text>
            <text x="166" y="76" fontSize="12" fontWeight="700" fill="#4b5563">
              Fixed
            </text>
            <text x="92" y="32" fontSize="12" fontWeight="700" fill="#4b5563">
              Moving Contact Bridge
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
