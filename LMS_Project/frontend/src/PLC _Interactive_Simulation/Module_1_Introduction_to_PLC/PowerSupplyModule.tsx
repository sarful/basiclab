"use client";

import React from "react";

export interface PowerSupplyModuleProps {
  selected?: boolean;
  onClick?: () => void;

  voltage?: string;
  frequency?: string;

  powerLed?: boolean;

  width?: number;
  height?: number;
}

export default function PowerSupplyModule({
  selected = false,
  onClick,
  voltage = "AC 100-240V",
  frequency = "50/60Hz",
  powerLed = true,
  width = 180,
  height = 420,
}: PowerSupplyModuleProps) {
  const borderColor = selected ? "#2563eb" : "#4b5563";

  return (
    <div
      onClick={onClick}
      className="select-none cursor-pointer"
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 180 420"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient
            id="bodyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8d949c" />
            <stop offset="40%" stopColor="#5f6670" />
            <stop offset="100%" stopColor="#353a42" />
          </linearGradient>

          <linearGradient
            id="panelGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6c737d" />
            <stop offset="100%" stopColor="#444b54" />
          </linearGradient>

          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="5"
              floodOpacity="0.35"
            />
          </filter>

          <radialGradient id="ledGlow">
            <stop offset="0%" stopColor="#7cff7c" />
            <stop offset="100%" stopColor="#00c853" />
          </radialGradient>
        </defs>

        {/* Main Body */}
        <rect
          x="10"
          y="10"
          width="160"
          height="400"
          rx="8"
          fill="url(#bodyGradient)"
          stroke={borderColor}
          strokeWidth={selected ? 3 : 1.5}
          filter="url(#shadow)"
        />

        {/* Top Cap */}
        <rect
          x="18"
          y="18"
          width="144"
          height="22"
          rx="4"
          fill="#9ea5ad"
          opacity="0.7"
        />

        {/* Label Panel */}
        <rect
          x="28"
          y="70"
          width="124"
          height="170"
          rx="6"
          fill="url(#panelGradient)"
          stroke="#9ca3af"
          strokeWidth="0.8"
        />

        {/* Title */}
        <text
          x="90"
          y="105"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="700"
        >
          POWER
        </text>

        <text
          x="90"
          y="126"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="700"
        >
          SUPPLY
        </text>

        {/* LED */}
        <circle
          cx="55"
          cy="170"
          r="7"
          fill={powerLed ? "url(#ledGlow)" : "#374151"}
        />

        <text
          x="72"
          y="175"
          fill="#ffffff"
          fontSize="12"
        >
          POWER
        </text>

        {/* Specifications */}
        <text
          x="90"
          y="255"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
        >
          {voltage}
        </text>

        <text
          x="90"
          y="273"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
        >
          {frequency}
        </text>

        {/* Terminal Labels */}
        <text
          x="45"
          y="350"
          fill="#ffffff"
          fontSize="14"
          fontWeight="700"
        >
          L
        </text>

        <text
          x="83"
          y="350"
          fill="#ffffff"
          fontSize="14"
          fontWeight="700"
        >
          N
        </text>

        <text
          x="118"
          y="350"
          fill="#ffffff"
          fontSize="14"
          fontWeight="700"
        >
          ⏚
        </text>

        {/* Terminals */}
        <g>
          <circle
            cx="50"
            cy="375"
            r="11"
            fill="#111827"
            stroke="#9ca3af"
          />
          <circle
            cx="90"
            cy="375"
            r="11"
            fill="#111827"
            stroke="#9ca3af"
          />
          <circle
            cx="130"
            cy="375"
            r="11"
            fill="#111827"
            stroke="#9ca3af"
          />
        </g>

        {/* Input Wires */}
        <path
          d="M50 385 V420"
          stroke="#dc2626"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M90 385 V420"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M130 385 V420"
          stroke="#16a34a"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Side Highlight */}
        <rect
          x="12"
          y="20"
          width="3"
          height="380"
          fill="#9ca3af"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}