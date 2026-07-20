"use client";

import React from "react";

export interface LabelItem {
  id: string;
  text: string;
  targetX: number;
  targetY: number;
  labelX: number;
  labelY: number;
  color?: string;
  highlighted?: boolean;
}

export interface LabelOverlayProps {
  labels: LabelItem[];
  visible?: boolean;
}

export default function LabelOverlay({
  labels,
  visible = true,
}: LabelOverlayProps) {
  if (!visible) return null;

  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="labelGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {labels.map((label) => {
        const color = label.color ?? "#2563eb";

        return (
          <g key={label.id}>
            {/* Leader Line */}
            <line
              x1={label.labelX}
              y1={label.labelY}
              x2={label.targetX}
              y2={label.targetY}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="6 4"
            />

            {/* Target Point */}
            <circle
              cx={label.targetX}
              cy={label.targetY}
              r={label.highlighted ? 8 : 5}
              fill={color}
              filter={label.highlighted ? "url(#labelGlow)" : undefined}
            />

            {/* Label Box */}
            <rect
              x={label.labelX - 55}
              y={label.labelY - 16}
              width="110"
              height="32"
              rx="8"
              fill="white"
              stroke={color}
              strokeWidth={2}
            />

            {/* Label Text */}
            <text
              x={label.labelX}
              y={label.labelY + 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#111827"
            >
              {label.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}