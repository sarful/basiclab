"use client";

import React from "react";

export interface MovingContactsProps {
  /** When true, moving contacts travel downward/forward to close the circuit */
  energized?: boolean;
  /** Number of main contact poles */
  poles?: number;
  /** SVG width */
  width?: number;
  /** SVG height */
  height?: number;
  /** Show L/T pole labels */
  showLabels?: boolean;
  /** Extra className for wrapper SVG */
  className?: string;
}

export default function MovingContacts({
  energized = false,
  poles = 3,
  width = 360,
  height = 170,
  showLabels = true,
  className = "",
}: MovingContactsProps) {
  const safePoles = Math.max(1, Math.min(poles, 4));
  const gap = width / (safePoles + 1);
  const moveY = energized ? 22 : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Moving contacts"
    >
      <defs>
        <linearGradient id="movingContactCopper" x1="0" x2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="movingContactMetal" x1="0" x2="1">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>

        <filter id="movingContactShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background guide */}
      <rect
        x="12"
        y="18"
        width={width - 24}
        height={height - 36}
        rx="14"
        fill="#f8fafc"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Moving carrier bar */}
      <g
        transform={`translate(0 ${moveY})`}
        style={{ transition: "transform 300ms ease" }}
        filter="url(#movingContactShadow)"
      >
        <rect
          x="42"
          y="50"
          width={width - 84}
          height="24"
          rx="8"
          fill="url(#movingContactMetal)"
          stroke="#374151"
          strokeWidth="2"
        />

        {Array.from({ length: safePoles }).map((_, index) => {
          const cx = gap * (index + 1);
          const inputLabel = `${index * 2 + 1}/L${index + 1}`;
          const outputLabel = `${index * 2 + 2}/T${index + 1}`;

          return (
            <g key={index}>
              {/* Vertical moving contact stem */}
              <rect
                x={cx - 8}
                y="70"
                width="16"
                height="48"
                rx="5"
                fill="url(#movingContactMetal)"
                stroke="#4b5563"
                strokeWidth="2"
              />

              {/* Copper contact pad */}
              <rect
                x={cx - 28}
                y="112"
                width="56"
                height="22"
                rx="8"
                fill="url(#movingContactCopper)"
                stroke="#78350f"
                strokeWidth="2"
              />

              {/* Contact face */}
              <rect
                x={cx - 18}
                y="130"
                width="36"
                height="8"
                rx="4"
                fill={energized ? "#22c55e" : "#f97316"}
                opacity="0.9"
              />

              {/* Small rivet */}
              <circle cx={cx} cy="62" r="5" fill="#111827" opacity="0.75" />

              {showLabels && (
                <>
                  <text
                    x={cx}
                    y="34"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#374151"
                  >
                    {inputLabel}
                  </text>
                  <text
                    x={cx}
                    y={height - 14}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#374151"
                  >
                    {outputLabel}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* State indicator */}
      <g>
        <circle cx={width - 34} cy="34" r="8" fill={energized ? "#22c55e" : "#ef4444"} />
        <text x={width - 48} y="61" fontSize="12" fontWeight="700" fill="#374151">
          {energized ? "CLOSED" : "OPEN"}
        </text>
      </g>
    </svg>
  );
}
