"use client";

import React from "react";

export interface MagneticFieldVisualizerProps {
  energized?: boolean;
  intensity?: number;
  width?: number;
  height?: number;
  showCore?: boolean;
  showLabels?: boolean;
  className?: string;
}

export default function MagneticFieldVisualizer({
  energized = false,
  intensity = 1,
  width = 420,
  height = 260,
  showCore = true,
  showLabels = true,
  className = "",
}: MagneticFieldVisualizerProps) {
  const safeIntensity = Math.max(0.2, Math.min(intensity, 2));
  const centerX = width / 2;
  const centerY = height / 2;

  const fieldLines = [
    { rx: 70, ry: 38, opacity: 0.9 },
    { rx: 105, ry: 58, opacity: 0.72 },
    { rx: 140, ry: 78, opacity: 0.56 },
    { rx: 175, ry: 98, opacity: 0.4 },
  ];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Magnetic field visualizer"
        className="overflow-visible"
      >
        <defs>
          <filter id="magneticFieldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="coreMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="coilCopper" x1="0" x2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Background plate */}
        <rect x="20" y="30" width={width - 40} height={height - 60} rx="22" fill="#0f172a" />
        <rect x="34" y="44" width={width - 68} height={height - 88} rx="16" fill="#1e293b" />

        {/* Magnetic field lines */}
        {fieldLines.map((line, index) => (
          <ellipse
            key={index}
            cx={centerX}
            cy={centerY}
            rx={line.rx * safeIntensity}
            ry={line.ry * safeIntensity}
            fill="none"
            stroke={energized ? "#38bdf8" : "#64748b"}
            strokeWidth={energized ? 3 : 2}
            strokeDasharray={energized ? "10 8" : "6 10"}
            opacity={energized ? line.opacity : 0.22}
            filter={energized ? "url(#magneticFieldGlow)" : undefined}
          >
            {energized && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-72"
                dur={`${1.8 - index * 0.18}s`}
                repeatCount="indefinite"
              />
            )}
          </ellipse>
        ))}

        {/* Coil body */}
        <rect
          x={centerX - 90}
          y={centerY - 50}
          width="180"
          height="100"
          rx="14"
          fill={energized ? "#fef3c7" : "#334155"}
          opacity={energized ? 0.95 : 0.6}
          stroke={energized ? "#f59e0b" : "#64748b"}
          strokeWidth="3"
        />

        {/* Coil turns */}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = centerX - 72 + i * 11;
          return (
            <path
              key={i}
              d={`M ${x} ${centerY - 37} Q ${x + 8} ${centerY} ${x} ${centerY + 37}`}
              fill="none"
              stroke={energized ? "url(#coilCopper)" : "#94a3b8"}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Iron core */}
        {showCore && (
          <rect
            x={centerX - 18}
            y={centerY - 75}
            width="36"
            height="150"
            rx="6"
            fill="url(#coreMetal)"
            stroke="#475569"
            strokeWidth="2"
          />
        )}

        {/* A1 / A2 terminals */}
        <circle cx={centerX - 112} cy={centerY} r="9" fill={energized ? "#22c55e" : "#94a3b8"} />
        <circle cx={centerX + 112} cy={centerY} r="9" fill={energized ? "#22c55e" : "#94a3b8"} />
        <line x1={centerX - 112} y1={centerY} x2={centerX - 90} y2={centerY} stroke="#cbd5e1" strokeWidth="4" />
        <line x1={centerX + 90} y1={centerY} x2={centerX + 112} y2={centerY} stroke="#cbd5e1" strokeWidth="4" />

        <text x={centerX - 130} y={centerY + 34} fill="#e2e8f0" fontSize="13" fontWeight="700">A1</text>
        <text x={centerX + 118} y={centerY + 34} fill="#e2e8f0" fontSize="13" fontWeight="700">A2</text>
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold text-slate-800">Magnetic Field Visualizer</div>
          <div className="text-sm text-slate-500">
            {energized ? "Flux lines active around the energized coil" : "No active magnetic field"}
          </div>
        </div>
      )}
    </div>
  );
}
