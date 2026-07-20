"use client";

import React from "react";

export interface ArmatureAssemblyProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function ArmatureAssembly({
  energized = false,
  width = 340,
  height = 220,
  showLabels = true,
}: ArmatureAssemblyProps) {
  const moveX = energized ? -45 : 0;

  return (
    <svg width={width} height={height} viewBox="0 0 340 220">
      <defs>
        <linearGradient id="armatureMetal" x1="0" x2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      <rect x="35" y="35" width="45" height="150" rx="8" fill="#334155" />

      <g
        style={{
          transform: `translateX(${moveX}px)`,
          transition: "transform 450ms ease",
        }}
      >
        <rect x="145" y="60" width="145" height="32" rx="6" fill="url(#armatureMetal)" />
        <rect x="145" y="125" width="145" height="32" rx="6" fill="url(#armatureMetal)" />
        <rect x="275" y="45" width="24" height="128" rx="6" fill="#94a3b8" />

        <circle cx="145" cy="76" r="8" fill="#f59e0b" />
        <circle cx="145" cy="141" r="8" fill="#f59e0b" />
      </g>

      <path
        d={energized ? "M300 75 L315 85 L300 95 L315 105" : "M300 60 L325 78 L300 96 L325 114 L300 132"}
        fill="none"
        stroke="#fb923c"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ transition: "all 450ms ease" }}
      />

      {showLabels && (
        <>
          <text x="170" y="25" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">
            Armature Assembly
          </text>
          <text x="170" y="205" textAnchor="middle" fontSize="13" fontWeight="700" fill="#475569">
            {energized ? "Pulled toward core" : "Released by spring"}
          </text>
        </>
      )}
    </svg>
  );
}