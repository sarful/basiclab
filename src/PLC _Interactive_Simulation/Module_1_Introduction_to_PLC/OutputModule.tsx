"use client";

import React from "react";

export interface OutputModuleProps {
  selected?: boolean;
  onClick?: () => void;
  activeOutputs?: boolean[];
  width?: number;
  height?: number;
}

export default function OutputModule({
  selected = false,
  onClick,
  activeOutputs = [true, false, true, false, true, false, true, false],
  width = 250,
  height = 420,
}: OutputModuleProps) {
  const borderColor = selected ? "#3b82f6" : "#4b5563";

  return (
    <div
      onClick={onClick}
      className="select-none cursor-pointer"
      style={{ width, height }}
    >
      <svg viewBox="0 0 250 420" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="outputBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b929b" />
            <stop offset="45%" stopColor="#555c65" />
            <stop offset="100%" stopColor="#30343b" />
          </linearGradient>

          <radialGradient id="outputLed">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
        </defs>

        {/* Main Body */}
        <rect
          x="10"
          y="10"
          width="230"
          height="400"
          rx="8"
          fill="url(#outputBody)"
          stroke={borderColor}
          strokeWidth={selected ? 3 : 1.5}
        />

        {/* Top Rail Slot */}
        <rect
          x="58"
          y="22"
          width="134"
          height="10"
          rx="3"
          fill="#2b3037"
          opacity="0.8"
        />

        {/* Header */}
        <rect
          x="25"
          y="55"
          width="200"
          height="42"
          rx="5"
          fill="#4b5563"
          stroke="#9ca3af"
        />

        <text
          x="125"
          y="82"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="15"
          fontWeight="700"
        >
          OUTPUT MODULE
        </text>

        {/* Output Channels */}
        {activeOutputs.map((active, index) => {
          const y = 130 + index * 28;

          return (
            <g key={index}>
              {/* LED Indicator */}
              <circle
                cx="55"
                cy={y}
                r="7"
                fill={active ? "url(#outputLed)" : "#374151"}
              />

              {/* Address Label */}
              <text x="72" y={y + 5} fill="#ffffff" fontSize="12">
                Q0.{index}
              </text>

              {/* Output Terminal */}
              <rect
                x="150"
                y={y - 16}
                width="44"
                height="32"
                rx="4"
                fill="#111827"
                stroke="#6b7280"
              />

              <circle
                cx="172"
                cy={y}
                r="8"
                fill="#1f2937"
                stroke={active ? "#60a5fa" : "#9ca3af"}
                strokeWidth="2"
              />

              {/* Load Symbol */}
              <path
                d={`M198 ${y} H218`}
                stroke={active ? "#60a5fa" : "#9ca3af"}
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle
                cx="224"
                cy={y}
                r="5"
                fill={active ? "#60a5fa" : "#4b5563"}
              />
            </g>
          );
        })}

        {/* Bottom Specification */}
        <text
          x="125"
          y="385"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="12"
        >
          DO 8 × DC 24V / RELAY
        </text>

        {/* Side Shine */}
        <rect
          x="13"
          y="22"
          width="3"
          height="375"
          fill="#ffffff"
          opacity="0.16"
        />
      </svg>
    </div>
  );
}