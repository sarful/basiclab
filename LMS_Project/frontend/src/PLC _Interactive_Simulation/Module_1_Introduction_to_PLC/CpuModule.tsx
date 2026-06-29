"use client";

import React from "react";

export interface CpuModuleProps {
  selected?: boolean;
  onClick?: () => void;
  runLed?: boolean;
  stopLed?: boolean;
  errorLed?: boolean;
  batteryLed?: boolean;
  mode?: "RUN" | "STOP";
  width?: number;
  height?: number;
}

export default function CpuModule({
  selected = false,
  onClick,
  runLed = true,
  stopLed = true,
  errorLed = false,
  batteryLed = true,
  mode = "RUN",
  width = 190,
  height = 420,
}: CpuModuleProps) {
  const borderColor = selected ? "#22c55e" : "#4b5563";

  return (
    <div onClick={onClick} className="select-none cursor-pointer" style={{ width, height }}>
      <svg viewBox="0 0 190 420" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="cpuBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7b828b" />
            <stop offset="45%" stopColor="#4b525b" />
            <stop offset="100%" stopColor="#2f343b" />
          </linearGradient>

          <linearGradient id="cpuPanel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#323842" />
            <stop offset="100%" stopColor="#171b22" />
          </linearGradient>

          <radialGradient id="greenLed">
            <stop offset="0%" stopColor="#b8ff9c" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>

          <radialGradient id="redLed">
            <stop offset="0%" stopColor="#ffb4b4" />
            <stop offset="100%" stopColor="#ef4444" />
          </radialGradient>

          <radialGradient id="yellowLed">
            <stop offset="0%" stopColor="#fff6a3" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
        </defs>

        {/* Main CPU body */}
        <rect
          x="10"
          y="10"
          width="170"
          height="400"
          rx="8"
          fill="url(#cpuBody)"
          stroke={borderColor}
          strokeWidth={selected ? 3 : 1.5}
        />

        {/* Top slot */}
        <rect x="42" y="22" width="106" height="10" rx="3" fill="#2b3037" opacity="0.8" />
        <rect x="52" y="24" width="86" height="4" rx="2" fill="#9ca3af" opacity="0.35" />

        {/* Header */}
        <rect x="28" y="54" width="134" height="42" rx="5" fill="#5d646e" stroke="#9ca3af" />
        <text x="95" y="81" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">
          CPU
        </text>

        {/* Status panel */}
        <rect x="28" y="96" width="134" height="210" rx="6" fill="url(#cpuPanel)" stroke="#6b7280" />

        {/* LED rows */}
        <circle cx="55" cy="132" r="7" fill={runLed ? "url(#greenLed)" : "#374151"} />
        <text x="73" y="137" fill="#ffffff" fontSize="12">RUN</text>

        <circle cx="55" cy="164" r="7" fill={stopLed ? "url(#greenLed)" : "#374151"} />
        <text x="73" y="169" fill="#ffffff" fontSize="12">STOP</text>

        <circle cx="55" cy="196" r="7" fill={errorLed ? "url(#redLed)" : "#374151"} />
        <text x="73" y="201" fill="#ffffff" fontSize="12">ERROR</text>

        <circle cx="55" cy="228" r="7" fill={batteryLed ? "url(#yellowLed)" : "#374151"} />
        <text x="73" y="233" fill="#ffffff" fontSize="12">BATTERY</text>

        {/* Mode switch */}
        <text x="55" y="267" textAnchor="middle" fill="#d1d5db" fontSize="10">I</text>

        <rect x="45" y="276" width="26" height="58" rx="13" fill="#111827" stroke="#9ca3af" />
        <rect
          x="49"
          y={mode === "RUN" ? 280 : 304}
          width="18"
          height="26"
          rx="9"
          fill="#9ca3af"
          stroke="#e5e7eb"
        />

        <text x="88" y="297" fill="#ffffff" fontSize="12">RUN</text>
        <text x="88" y="326" fill="#ffffff" fontSize="12">STOP</text>

        {/* Bottom specification */}
        <text x="95" y="345" textAnchor="middle" fill="#ffffff" fontSize="12">
          CPU 1214C
        </text>
        <text x="95" y="364" textAnchor="middle" fill="#ffffff" fontSize="12">
          DC/DC/DC
        </text>

        {/* Side shine */}
        <rect x="13" y="22" width="3" height="375" fill="#ffffff" opacity="0.18" />
      </svg>
    </div>
  );
}