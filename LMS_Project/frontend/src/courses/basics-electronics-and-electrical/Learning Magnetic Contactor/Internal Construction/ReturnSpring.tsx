"use client";

import React from "react";

export interface ReturnSpringProps {
  compressed?: boolean;
  width?: number;
  height?: number;
  turns?: number;
  showLabels?: boolean;
  className?: string;
}

function createSpringPath(
  width: number,
  height: number,
  turns: number,
  compressed: boolean
) {
  const startX = width / 2;
  const top = compressed ? 26 : 14;
  const bottom = compressed ? height - 26 : height - 14;
  const springHeight = bottom - top;
  const amplitude = compressed ? width * 0.18 : width * 0.3;
  const step = springHeight / turns;

  let path = `M ${startX} ${top}`;

  for (let i = 0; i < turns; i++) {
    const y1 = top + step * i + step / 2;
    const y2 = top + step * (i + 1);
    const x1 = i % 2 === 0 ? startX + amplitude : startX - amplitude;
    path += ` Q ${x1} ${y1}, ${startX} ${y2}`;
  }

  return path;
}

export default function ReturnSpring({
  compressed = false,
  width = 90,
  height = 180,
  turns = 10,
  showLabels = true,
  className = "",
}: ReturnSpringProps) {
  const springPath = createSpringPath(width, height, turns, compressed);
  const springColor = compressed ? "#f97316" : "#9ca3af";

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Return spring"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="springMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="45%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          <filter id="springShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Top anchor */}
        <rect
          x={width / 2 - 22}
          y="2"
          width="44"
          height="14"
          rx="4"
          fill="#374151"
        />
        <circle cx={width / 2} cy="9" r="4" fill="#111827" />

        {/* Spring coil */}
        <path
          d={springPath}
          fill="none"
          stroke="url(#springMetal)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#springShadow)"
        />

        {/* State highlight line */}
        <path
          d={springPath}
          fill="none"
          stroke={springColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Center guide rod */}
        <line
          x1={width / 2}
          y1="16"
          x2={width / 2}
          y2={height - 16}
          stroke="#4b5563"
          strokeWidth="3"
          strokeDasharray="6 6"
          opacity="0.55"
        />

        {/* Bottom anchor */}
        <rect
          x={width / 2 - 22}
          y={height - 16}
          width="44"
          height="14"
          rx="4"
          fill="#374151"
        />
        <circle cx={width / 2} cy={height - 9} r="4" fill="#111827" />
      </svg>

      {showLabels && (
        <div className="text-center leading-tight">
          <div className="font-semibold text-gray-800">Return Spring</div>
          <div className="text-sm text-gray-500">
            {compressed ? "Compressed" : "Extended"}
          </div>
        </div>
      )}
    </div>
  );
}
