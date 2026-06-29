"use client";

import React from "react";

export interface MainContactsProps {
  /** When true, the moving bridges close the three main contacts */
  closed?: boolean;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showCurrentFlow?: boolean;
  className?: string;
}

const poles = [
  { x: 70, top: "L1", bottom: "T1" },
  { x: 150, top: "L2", bottom: "T2" },
  { x: 230, top: "L3", bottom: "T3" },
];

export default function MainContacts({
  closed = false,
  width = 300,
  height = 260,
  showLabels = true,
  showCurrentFlow = true,
  className = "",
}: MainContactsProps) {
  const bridgeY = closed ? 130 : 103;
  const currentOpacity = closed && showCurrentFlow ? 1 : 0;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 260"
        role="img"
        aria-label="Three phase main contacts"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="contactMetal" x1="0" x2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="45%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <linearGradient id="copperBridge" x1="0" x2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <filter id="contactGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background panel */}
        <rect x="20" y="22" width="260" height="216" rx="16" fill="#111827" />
        <rect x="32" y="34" width="236" height="192" rx="12" fill="#1f2937" stroke="#374151" />

        {/* Status badge */}
        <rect
          x="92"
          y="10"
          width="116"
          height="28"
          rx="14"
          fill={closed ? "#dcfce7" : "#fee2e2"}
          stroke={closed ? "#22c55e" : "#ef4444"}
        />
        <text
          x="150"
          y="29"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={closed ? "#166534" : "#991b1b"}
        >
          {closed ? "CONTACTS CLOSED" : "CONTACTS OPEN"}
        </text>

        {poles.map((pole) => (
          <g key={pole.x}>
            {/* Labels */}
            <text x={pole.x} y="62" textAnchor="middle" fontSize="16" fontWeight="700" fill="#e5e7eb">
              {pole.top}
            </text>
            <text x={pole.x} y="214" textAnchor="middle" fontSize="16" fontWeight="700" fill="#e5e7eb">
              {pole.bottom}
            </text>

            {/* Top and bottom fixed conductors */}
            <line x1={pole.x} y1="72" x2={pole.x} y2="105" stroke="url(#contactMetal)" strokeWidth="12" strokeLinecap="round" />
            <line x1={pole.x} y1="155" x2={pole.x} y2="198" stroke="url(#contactMetal)" strokeWidth="12" strokeLinecap="round" />

            {/* Contact pads */}
            <circle cx={pole.x} cy="108" r="12" fill="url(#contactMetal)" stroke="#d1d5db" strokeWidth="2" />
            <circle cx={pole.x} cy="152" r="12" fill="url(#contactMetal)" stroke="#d1d5db" strokeWidth="2" />

            {/* Moving contact bridge */}
            <g
              style={{
                transform: `translateY(${closed ? 0 : -27}px) rotate(${closed ? 0 : -10}deg)`,
                transformOrigin: `${pole.x}px 130px`,
                transition: "transform 350ms ease-in-out",
              }}
            >
              <rect
                x={pole.x - 23}
                y={bridgeY - 7}
                width="46"
                height="14"
                rx="7"
                fill="url(#copperBridge)"
                stroke="#78350f"
                strokeWidth="2"
              />
              <circle cx={pole.x - 16} cy={bridgeY} r="4" fill="#fef3c7" opacity="0.8" />
              <circle cx={pole.x + 16} cy={bridgeY} r="4" fill="#fef3c7" opacity="0.8" />
            </g>

            {/* Current flow */}
            <g opacity={currentOpacity} filter="url(#contactGlow)">
              <line x1={pole.x} y1="76" x2={pole.x} y2="194" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8">
                <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.7s" repeatCount="indefinite" />
              </line>
              <polygon points={`${pole.x - 6},190 ${pole.x + 6},190 ${pole.x},202`} fill="#22c55e" />
            </g>
          </g>
        ))}

        {/* Mechanical link */}
        <rect
          x="45"
          y={closed ? "123" : "96"}
          width="210"
          height="12"
          rx="6"
          fill="#2563eb"
          opacity="0.9"
          style={{ transition: "y 350ms ease-in-out" }}
        />
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold text-gray-900">Main Power Contacts</div>
          <div className="text-sm text-gray-500">
            {closed ? "L1/L2/L3 connected to T1/T2/T3" : "Power path is open"}
          </div>
        </div>
      )}
    </div>
  );
}
