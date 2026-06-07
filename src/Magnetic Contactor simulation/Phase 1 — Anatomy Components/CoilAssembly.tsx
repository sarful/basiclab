"use client";

import React from "react";

export interface CoilAssemblyProps {
  energized?: boolean;
  width?: number;
  height?: number;
  turns?: number;
  showLabels?: boolean;
}

export default function CoilAssembly({
  energized = false,
  width = 180,
  height = 120,
  turns = 22,
  showLabels = true,
}: CoilAssemblyProps) {
  const centerY = height / 2;
  const padding = 20;
  const coilStart = padding;
  const coilEnd = width - padding;

  const wireColor = energized ? "#f59e0b" : "#facc15";
  const glowColor = energized ? "#fde68a" : "#fef3c7";

  const turnSpacing = (coilEnd - coilStart) / turns;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <filter id="coilGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="coilBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="coreGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c7f86" />
            <stop offset="50%" stopColor="#c3c7cf" />
            <stop offset="100%" stopColor="#5b6068" />
          </linearGradient>
        </defs>

        {/* Iron Core */}
        <rect
          x={width / 2 - 18}
          y={12}
          width={36}
          height={height - 24}
          rx={4}
          fill="url(#coreGradient)"
          stroke="#4b5563"
          strokeWidth="2"
        />

        {/* Coil Glow */}
        {energized && (
          <rect
            x={18}
            y={22}
            width={width - 36}
            height={height - 44}
            rx={10}
            fill={glowColor}
            opacity={0.4}
            filter="url(#coilGlow)"
          />
        )}

        {/* Coil Turns */}
        {Array.from({ length: turns }).map((_, i) => {
          const x = coilStart + i * turnSpacing;

          return (
            <path
              key={i}
              d={`
                M ${x} ${centerY - 32}
                Q ${x + turnSpacing / 2} ${centerY}
                ${x} ${centerY + 32}
              `}
              fill="none"
              stroke={wireColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Coil Body Border */}
        <rect
          x={16}
          y={20}
          width={width - 32}
          height={height - 40}
          rx={10}
          fill="none"
          stroke="#92400e"
          strokeWidth="3"
        />

        {/* A1 Terminal */}
        <circle
          cx={20}
          cy={centerY}
          r={8}
          fill={energized ? "#22c55e" : "#9ca3af"}
        />

        {/* A2 Terminal */}
        <circle
          cx={width - 20}
          cy={centerY}
          r={8}
          fill={energized ? "#22c55e" : "#9ca3af"}
        />

        {/* Lead Wires */}
        <line
          x1={20}
          y1={centerY}
          x2={40}
          y2={centerY}
          stroke="#374151"
          strokeWidth="3"
        />

        <line
          x1={width - 40}
          y1={centerY}
          x2={width - 20}
          y2={centerY}
          stroke="#374151"
          strokeWidth="3"
        />
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold">Coil Assembly</div>
          <div className="text-sm text-gray-500">
            {energized ? "Energized" : "De-Energized"}
          </div>
          <div className="text-xs text-gray-400">
            A1 ↔ A2 Electromagnetic Coil
          </div>
        </div>
      )}
    </div>
  );
}