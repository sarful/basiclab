"use client";

import React from "react";

export interface InputModuleProps {
  selected?: boolean;
  onClick?: () => void;
  activeInputs?: boolean[];
  width?: number;
  height?: number;
}

export default function InputModule({
  selected = false,
  onClick,
  activeInputs = [true, true, true, true, true, true, true, true],
  width = 250,
  height = 420,
}: InputModuleProps) {
  const borderColor = selected ? "#f97316" : "#4b5563";

  return (
    <div onClick={onClick} className="select-none cursor-pointer" style={{ width, height }}>
      <svg viewBox="0 0 250 420" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="inputBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b929b" />
            <stop offset="45%" stopColor="#555c65" />
            <stop offset="100%" stopColor="#30343b" />
          </linearGradient>

          <radialGradient id="inputLed">
            <stop offset="0%" stopColor="#b8ff9c" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>

        <rect
          x="10"
          y="10"
          width="230"
          height="400"
          rx="8"
          fill="url(#inputBody)"
          stroke={borderColor}
          strokeWidth={selected ? 3 : 1.5}
        />

        <rect x="58" y="22" width="134" height="10" rx="3" fill="#2b3037" opacity="0.8" />

        <rect x="25" y="55" width="200" height="42" rx="5" fill="#4b5563" stroke="#9ca3af" />
        <text x="125" y="82" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="700">
          INPUT MODULE
        </text>

        {activeInputs.map((active, index) => {
          const y = 130 + index * 28;

          return (
            <g key={index}>
              <circle cx="55" cy={y} r="7" fill={active ? "url(#inputLed)" : "#374151"} />
              <text x="72" y={y + 5} fill="#ffffff" fontSize="12">
                I0.{index}
              </text>

              <rect x="150" y={y - 16} width="44" height="32" rx="4" fill="#111827" stroke="#6b7280" />
              <circle cx="172" cy={y} r="8" fill="#1f2937" stroke="#facc15" strokeWidth="2" />

              <text x="205" y={y + 5} fill="#ffffff" fontSize="12">
                {index}
              </text>
            </g>
          );
        })}

        <text x="125" y="385" textAnchor="middle" fill="#ffffff" fontSize="12">
          DI 8 × DC 24V
        </text>
      </svg>
    </div>
  );
}