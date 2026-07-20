"use client";

import React from "react";

export interface CoilAssemblyProps {
  /** Shows the coil as powered/energized */
  energized?: boolean;
  /** Optional part highlight */
  highlighted?: boolean;
  /** Show A1/A2 terminal labels */
  showTerminals?: boolean;
  /** Show title label under the SVG */
  showLabel?: boolean;
  /** Component width */
  width?: number;
  /** Component height */
  height?: number;
  /** Number of visible coil turns */
  turns?: number;
  /** Extra CSS class for wrapper */
  className?: string;
}

export default function CoilAssembly({
  energized = false,
  highlighted = false,
  showTerminals = true,
  showLabel = true,
  width = 260,
  height = 160,
  turns = 28,
  className = "",
}: CoilAssemblyProps) {
  const centerY = height / 2;
  const startX = 42;
  const endX = width - 42;
  const turnGap = (endX - startX) / turns;

  const wireColor = energized ? "#f97316" : "#d97706";
  const wireShadow = energized ? "#fed7aa" : "#92400e";

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Magnetic contactor coil assembly"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="coil-core-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="45%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          <linearGradient id="coil-frame-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <filter id="coil-energy-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer highlight */}
        {highlighted && (
          <rect
            x="10"
            y="10"
            width={width - 20}
            height={height - 20}
            rx="18"
            fill="#fde68a"
            opacity="0.35"
          />
        )}

        {/* Energized magnetic glow */}
        {energized && (
          <ellipse
            cx={width / 2}
            cy={centerY}
            rx={width * 0.44}
            ry={height * 0.38}
            fill="#fbbf24"
            opacity="0.26"
            filter="url(#coil-energy-glow)"
          />
        )}

        {/* Coil plastic bobbin/frame */}
        <rect
          x="28"
          y="34"
          width={width - 56}
          height={height - 68}
          rx="14"
          fill="url(#coil-frame-gradient)"
          stroke="#92400e"
          strokeWidth="3"
        />

        <rect
          x="44"
          y="48"
          width={width - 88}
          height={height - 96}
          rx="10"
          fill="#fff7ed"
          opacity="0.55"
        />

        {/* Iron core passing through coil */}
        <rect
          x={width / 2 - 18}
          y="22"
          width="36"
          height={height - 44}
          rx="5"
          fill="url(#coil-core-gradient)"
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Coil turns */}
        {Array.from({ length: turns }).map((_, index) => {
          const x = startX + index * turnGap;
          return (
            <g key={index}>
              <path
                d={`M ${x} ${centerY - 38} C ${x + turnGap * 0.8} ${centerY - 18}, ${x + turnGap * 0.8} ${centerY + 18}, ${x} ${centerY + 38}`}
                fill="none"
                stroke={wireShadow}
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d={`M ${x} ${centerY - 38} C ${x + turnGap * 0.8} ${centerY - 18}, ${x + turnGap * 0.8} ${centerY + 18}, ${x} ${centerY + 38}`}
                fill="none"
                stroke={wireColor}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Coil lead wires */}
        <line x1="20" y1={centerY} x2="45" y2={centerY} stroke="#374151" strokeWidth="4" />
        <line x1={width - 45} y1={centerY} x2={width - 20} y2={centerY} stroke="#374151" strokeWidth="4" />

        {/* A1 / A2 terminals */}
        {showTerminals && (
          <>
            <circle cx="18" cy={centerY} r="10" fill={energized ? "#22c55e" : "#9ca3af"} stroke="#111827" strokeWidth="2" />
            <circle cx={width - 18} cy={centerY} r="10" fill={energized ? "#22c55e" : "#9ca3af"} stroke="#111827" strokeWidth="2" />

            <text x="8" y={centerY - 18} fontSize="15" fontWeight="700" fill="#111827">
              A1
            </text>
            <text x={width - 30} y={centerY - 18} fontSize="15" fontWeight="700" fill="#111827">
              A2
            </text>
          </>
        )}

        {/* Status badge */}
        <rect
          x={width / 2 - 48}
          y={height - 28}
          width="96"
          height="22"
          rx="11"
          fill={energized ? "#dcfce7" : "#f3f4f6"}
          stroke={energized ? "#16a34a" : "#9ca3af"}
        />
        <text
          x={width / 2}
          y={height - 12}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={energized ? "#166534" : "#4b5563"}
        >
          {energized ? "ENERGIZED" : "OFF"}
        </text>
      </svg>

      {showLabel && (
        <div className="mt-2 text-center">
          <div className="text-sm font-semibold text-gray-900">Coil Assembly</div>
          <div className="text-xs text-gray-500">A1–A2 electromagnetic coil</div>
        </div>
      )}
    </div>
  );
}
