"use client";

import React from "react";

export interface SpringCompressionAnimatorProps {
  compressed?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showForceArrow?: boolean;
  className?: string;
}

function createSpringPath({
  x,
  y,
  length,
  amplitude,
  turns,
}: {
  x: number;
  y: number;
  length: number;
  amplitude: number;
  turns: number;
}) {
  const step = length / turns;
  let path = `M ${x} ${y}`;

  for (let i = 1; i <= turns; i++) {
    const px = x + i * step;
    const py = y + (i % 2 === 0 ? -amplitude : amplitude);
    path += ` L ${px} ${py}`;
  }

  path += ` L ${x + length + 16} ${y}`;
  return path;
}

export default function SpringCompressionAnimator({
  compressed = false,
  width = 300,
  height = 130,
  showLabels = true,
  showForceArrow = true,
  className = "",
}: SpringCompressionAnimatorProps) {
  const springLength = compressed ? 95 : 165;
  const springTurns = compressed ? 8 : 11;
  const startX = 55;
  const centerY = 62;
  const endX = startX + springLength + 16;

  const springPath = createSpringPath({
    x: startX,
    y: centerY,
    length: springLength,
    amplitude: compressed ? 12 : 17,
    turns: springTurns,
  });

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={compressed ? "Compressed return spring" : "Released return spring"}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="springMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <filter id="springGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <marker
            id="springArrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
          </marker>
        </defs>

        {/* Fixed support */}
        <rect x="22" y="34" width="22" height="58" rx="4" fill="#334155" />
        <circle cx="33" cy="48" r="4" fill="#cbd5e1" />
        <circle cx="33" cy="78" r="4" fill="#cbd5e1" />

        {/* Moving armature plate */}
        <rect
          x={endX + 12}
          y="29"
          width="28"
          height="66"
          rx="5"
          fill={compressed ? "#475569" : "#64748b"}
          style={{ transition: "all 450ms ease" }}
        />

        {/* Spring end hooks */}
        <line x1="44" y1={centerY} x2={startX} y2={centerY} stroke="#64748b" strokeWidth="5" />
        <line x1={endX} y1={centerY} x2={endX + 12} y2={centerY} stroke="#64748b" strokeWidth="5" />

        {/* Spring */}
        <path
          d={springPath}
          fill="none"
          stroke={compressed ? "#f97316" : "url(#springMetal)"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={compressed ? "url(#springGlow)" : undefined}
          style={{ transition: "all 450ms ease" }}
        />

        {/* Force arrow */}
        {showForceArrow && compressed && (
          <g>
            <line
              x1={endX + 56}
              y1={centerY}
              x2={endX + 18}
              y2={centerY}
              stroke="#f97316"
              strokeWidth="4"
              markerEnd="url(#springArrow)"
            />
            <text x={endX + 32} y={centerY - 12} textAnchor="middle" fontSize="12" fill="#c2410c" fontWeight="700">
              Return Force
            </text>
          </g>
        )}

        {/* State badge */}
        <rect
          x="92"
          y="8"
          width={compressed ? 116 : 92}
          height="26"
          rx="13"
          fill={compressed ? "#ffedd5" : "#e2e8f0"}
          stroke={compressed ? "#fb923c" : "#94a3b8"}
        />
        <text
          x={compressed ? 150 : 138}
          y="26"
          textAnchor="middle"
          fontSize="12"
          fill={compressed ? "#c2410c" : "#475569"}
          fontWeight="700"
        >
          {compressed ? "Compressed" : "Released"}
        </text>

        {showLabels && (
          <>
            <text x="22" y="116" fontSize="12" fill="#475569" fontWeight="700">
              Fixed Point
            </text>
            <text x={endX - 18} y="116" fontSize="12" fill="#475569" fontWeight="700">
              Armature Side
            </text>
          </>
        )}
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-800">Return Spring</div>
          <div className="text-xs text-slate-500">
            {compressed
              ? "Spring is compressed while the armature is pulled in."
              : "Spring is released and pushes the armature back."}
          </div>
        </div>
      )}
    </div>
  );
}
