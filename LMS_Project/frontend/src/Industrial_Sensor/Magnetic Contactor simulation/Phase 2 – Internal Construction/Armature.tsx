"use client";

import React from "react";

export interface ArmatureProps {
  energized?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export default function Armature({
  energized = false,
  width = 260,
  height = 120,
  showLabels = true,
  className = "",
}: ArmatureProps) {
  const armatureY = energized ? 48 : 36;
  const angle = energized ? 0 : -7;
  const pivotX = 46;
  const pivotY = 54;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Moving armature of magnetic contactor"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="armatureSteel" x1="0" x2="1">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <linearGradient id="armatureDark" x1="0" x2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <filter id="armatureShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Fixed support bracket */}
        <rect
          x="18"
          y="22"
          width="38"
          height="70"
          rx="5"
          fill="url(#armatureDark)"
        />
        <rect x="28" y="30" width="18" height="54" rx="3" fill="#6b7280" />

        {/* Pivot pin */}
        <circle cx={pivotX} cy={pivotY} r="13" fill="#111827" />
        <circle cx={pivotX} cy={pivotY} r="7" fill="#ef4444" />
        <circle cx={pivotX - 2} cy={pivotY - 2} r="2" fill="#fecaca" />

        {/* Moving armature bar */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: `${pivotX}px ${pivotY}px`,
            transition: "transform 300ms ease, translate 300ms ease",
            transform: `rotate(${angle}deg) translateY(${energized ? 5 : 0}px)`,
          }}
          filter="url(#armatureShadow)"
        >
          <rect
            x="48"
            y={armatureY}
            width="160"
            height="18"
            rx="5"
            fill="url(#armatureSteel)"
            stroke="#1f2937"
            strokeWidth="2"
          />

          {/* Contact push rod connection */}
          <rect
            x="196"
            y={armatureY - 12}
            width="20"
            height="42"
            rx="4"
            fill="#64748b"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Small highlight line */}
          <line
            x1="62"
            y1={armatureY + 5}
            x2="188"
            y2={armatureY + 5}
            stroke="#f8fafc"
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* Coil attraction zone */}
        <rect
          x="82"
          y="78"
          width="84"
          height="16"
          rx="3"
          fill={energized ? "#fbbf24" : "#9ca3af"}
          opacity={energized ? 0.85 : 0.35}
        />

        {energized && (
          <g opacity="0.75">
            <path d="M92 74 C102 58 124 58 134 74" fill="none" stroke="#f59e0b" strokeWidth="3" />
            <path d="M110 70 C120 54 142 54 152 70" fill="none" stroke="#f59e0b" strokeWidth="3" />
          </g>
        )}

        <text x="84" y="112" fontSize="11" fill="#6b7280">
          {energized ? "Pulled toward core" : "Released by spring"}
        </text>
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold text-gray-800">Armature</div>
          <div className="text-sm text-gray-500">
            {energized ? "Pulled In" : "Released"}
          </div>
          <div className="text-xs text-gray-400">
            Moves contacts when the coil is energized
          </div>
        </div>
      )}
    </div>
  );
}
