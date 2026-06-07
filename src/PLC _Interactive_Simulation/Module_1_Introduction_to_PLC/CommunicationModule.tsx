"use client";

import React from "react";

export interface CommunicationModuleProps {
  selected?: boolean;
  onClick?: () => void;
  linkLed?: boolean;
  txLed?: boolean;
  rxLed?: boolean;
  width?: number;
  height?: number;
}

export default function CommunicationModule({
  selected = false,
  onClick,
  linkLed = true,
  txLed = true,
  rxLed = false,
  width = 250,
  height = 420,
}: CommunicationModuleProps) {
  const borderColor = selected ? "#8b5cf6" : "#4b5563";

  return (
    <div onClick={onClick} className="select-none cursor-pointer" style={{ width, height }}>
      <svg viewBox="0 0 250 420" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="commBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b929b" />
            <stop offset="45%" stopColor="#555c65" />
            <stop offset="100%" stopColor="#30343b" />
          </linearGradient>

          <radialGradient id="greenLed">
            <stop offset="0%" stopColor="#b8ff9c" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>

          <radialGradient id="blueLed">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>

          <radialGradient id="purpleLed">
            <stop offset="0%" stopColor="#ddd6fe" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
        </defs>

        {/* Main Body */}
        <rect
          x="10"
          y="10"
          width="230"
          height="400"
          rx="8"
          fill="url(#commBody)"
          stroke={borderColor}
          strokeWidth={selected ? 3 : 1.5}
        />

        {/* Top Slot */}
        <rect x="58" y="22" width="134" height="10" rx="3" fill="#2b3037" opacity="0.8" />

        {/* Header */}
        <rect x="25" y="55" width="200" height="42" rx="5" fill="#4b5563" stroke="#9ca3af" />
        <text x="125" y="81" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">
          COMMUNICATION
        </text>

        {/* Status LEDs */}
        <rect x="35" y="120" width="180" height="82" rx="6" fill="#111827" stroke="#6b7280" />

        <circle cx="62" cy="148" r="7" fill={linkLed ? "url(#greenLed)" : "#374151"} />
        <text x="82" y="153" fill="#ffffff" fontSize="12">LINK</text>

        <circle cx="62" cy="176" r="7" fill={txLed ? "url(#blueLed)" : "#374151"} />
        <text x="82" y="181" fill="#ffffff" fontSize="12">TX</text>

        <circle cx="150" cy="176" r="7" fill={rxLed ? "url(#purpleLed)" : "#374151"} />
        <text x="170" y="181" fill="#ffffff" fontSize="12">RX</text>

        {/* Ethernet Port */}
        <rect x="70" y="230" width="110" height="82" rx="8" fill="#111827" stroke="#9ca3af" strokeWidth="2" />
        <rect x="82" y="244" width="86" height="54" rx="4" fill="#1f2937" stroke="#6b7280" />

        {/* RJ45 pins */}
        {Array.from({ length: 8 }).map((_, index) => (
          <rect
            key={index}
            x={88 + index * 9.5}
            y="252"
            width="5"
            height="16"
            rx="1"
            fill="#facc15"
          />
        ))}

        {/* Port inner cut */}
        <path
          d="M92 286 H158 V296 H92 Z"
          fill="#0f172a"
          stroke="#374151"
        />

        <text x="125" y="332" textAnchor="middle" fill="#ffffff" fontSize="12">
          ETHERNET / MODBUS
        </text>

        <text x="125" y="355" textAnchor="middle" fill="#d1d5db" fontSize="11">
          PROFINET READY
        </text>

        <text x="125" y="385" textAnchor="middle" fill="#ffffff" fontSize="12">
          RS485 / TCP-IP
        </text>

        {/* Side Shine */}
        <rect x="13" y="22" width="3" height="375" fill="#ffffff" opacity="0.16" />
      </svg>
    </div>
  );
}