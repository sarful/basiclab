"use client";

import React from "react";

export interface IronCoreProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export default function IronCore({
  energized = false,
  width = 180,
  height = 180,
  showLabels = true,
  className = "",
}: IronCoreProps) {
  const coreX = width * 0.32;
  const coreY = height * 0.12;
  const coreW = width * 0.36;
  const coreH = height * 0.76;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Iron core of magnetic contactor"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="ironCoreMetal" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="18%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#e5e7eb" />
            <stop offset="82%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <linearGradient id="laminationLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#111827" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0.1" />
          </linearGradient>

          <filter id="magneticGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Magnetic field glow when coil is energized */}
        {energized && (
          <g opacity="0.65" filter="url(#magneticGlow)">
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={width * 0.43}
              ry={height * 0.36}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
            />
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={width * 0.34}
              ry={height * 0.27}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
          </g>
        )}

        {/* U-shaped fixed iron core */}
        <path
          d={`
            M ${coreX} ${coreY}
            H ${coreX + coreW}
            V ${coreY + coreH}
            H ${coreX + coreW * 0.72}
            V ${coreY + coreH * 0.24}
            H ${coreX + coreW * 0.28}
            V ${coreY + coreH}
            H ${coreX}
            Z
          `}
          fill="url(#ironCoreMetal)"
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Lamination lines */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = coreY + 14 + i * ((coreH - 28) / 8);
          return (
            <line
              key={i}
              x1={coreX + 4}
              y1={y}
              x2={coreX + coreW - 4}
              y2={y}
              stroke="url(#laminationLine)"
              strokeWidth="1.4"
            />
          );
        })}

        {/* Center air gap */}
        <rect
          x={coreX + coreW * 0.32}
          y={coreY + coreH * 0.25}
          width={coreW * 0.36}
          height={coreH * 0.5}
          rx="4"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Pole faces */}
        <rect
          x={coreX + 2}
          y={coreY + 3}
          width={coreW - 4}
          height={coreH * 0.15}
          rx="4"
          fill="#cbd5e1"
          opacity="0.7"
        />
        <rect
          x={coreX + 2}
          y={coreY + coreH * 0.82}
          width={coreW - 4}
          height={coreH * 0.15}
          rx="4"
          fill="#64748b"
          opacity="0.45"
        />

        {/* Status badge */}
        <g transform={`translate(${width * 0.08}, ${height * 0.08})`}>
          <rect
            width="68"
            height="24"
            rx="12"
            fill={energized ? "#dcfce7" : "#e5e7eb"}
            stroke={energized ? "#22c55e" : "#9ca3af"}
          />
          <circle
            cx="14"
            cy="12"
            r="5"
            fill={energized ? "#22c55e" : "#6b7280"}
          />
          <text x="26" y="16" fontSize="11" fontWeight="700" fill="#374151">
            {energized ? "ON" : "OFF"}
          </text>
        </g>
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold text-gray-800">Iron Core</div>
          <div className="text-sm text-gray-500">
            {energized ? "Magnetic field active" : "No magnetic field"}
          </div>
          <div className="text-xs text-gray-400">
            Guides magnetic flux and pulls the armature
          </div>
        </div>
      )}
    </div>
  );
}
