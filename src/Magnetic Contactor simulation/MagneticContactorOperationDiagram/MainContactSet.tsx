"use client";

import React from "react";

export interface MainContactSetProps {
  closed?: boolean;
  active?: boolean;
  animateFlow?: boolean;
  width?: number;
  height?: number;
}

export default function MainContactSet({
  closed = false,
  active = false,
  animateFlow = true,
  width = 520,
  height = 260,
}: MainContactSetProps) {
  const contacts = [
    { id: "L1", input: "1/L1", output: "2/T1", x: 100, color: "#ef4444" },
    { id: "L2", input: "3/L2", output: "4/T2", x: 260, color: "#eab308" },
    { id: "L3", input: "5/L3", output: "6/T3", x: 420, color: "#2563eb" },
  ];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <filter id="mainContactGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {contacts.map((c) => (
        <g key={c.id}>
          <text x={c.x} y="25" textAnchor="middle" fontSize="15" fontWeight="700" fill={c.color}>
            {c.input}
          </text>

          <line x1={c.x} y1="40" x2={c.x} y2="90" stroke={c.color} strokeWidth="6" />

          <circle cx={c.x} cy="95" r="12" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
          <circle cx={c.x} cy="175" r="12" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />

          <line
            x1={c.x}
            y1="112"
            x2={c.x}
            y2={closed ? 158 : 138}
            stroke={closed ? "#22c55e" : "#fb923c"}
            strokeWidth="8"
            strokeLinecap="round"
            filter={closed ? "url(#mainContactGlow)" : undefined}
            style={{ transition: "all 400ms ease" }}
          />

          <line
            x1={c.x}
            y1="188"
            x2={c.x}
            y2="230"
            stroke={closed ? c.color : "#94a3b8"}
            strokeWidth="6"
            opacity={closed ? 1 : 0.45}
          />

          {active && closed && animateFlow && (
            <circle r="6" fill={c.color}>
              <animateMotion
                dur="1.1s"
                repeatCount="indefinite"
                path={`M ${c.x} 40 L ${c.x} 230`}
              />
            </circle>
          )}

          <text x={c.x} y="255" textAnchor="middle" fontSize="15" fontWeight="700" fill={c.color}>
            {c.output}
          </text>
        </g>
      ))}
    </svg>
  );
}