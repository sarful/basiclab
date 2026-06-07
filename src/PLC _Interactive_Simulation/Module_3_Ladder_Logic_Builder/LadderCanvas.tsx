"use client";

import React from "react";

export interface LadderCanvasProps {
  rungTrue?: boolean;
  title?: string;
}

export default function LadderCanvas({
  rungTrue = false,
  title = "Ladder Canvas",
}: LadderCanvasProps) {
  const lineColor = rungTrue ? "#22c55e" : "#94a3b8";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">
          PLC ladder diagram drawing area
        </p>
      </div>

      <svg viewBox="0 0 900 360" className="h-auto w-full">
        {/* Grid */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={50 + i * 45}
            y1="30"
            x2={50 + i * 45}
            y2="330"
            stroke="#e2e8f0"
          />
        ))}

        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="50"
            y1={50 + i * 40}
            x2="850"
            y2={50 + i * 40}
            stroke="#e2e8f0"
          />
        ))}

        {/* Power Rails */}
        <line x1="80" y1="40" x2="80" y2="320" stroke="#334155" strokeWidth="5" />
        <line x1="820" y1="40" x2="820" y2="320" stroke="#334155" strokeWidth="5" />

        {/* Rung */}
        <line
          x1="80"
          y1="160"
          x2="820"
          y2="160"
          stroke={lineColor}
          strokeWidth="5"
        />

        {/* Empty Drop Zones */}
        {[180, 360, 540, 690].map((x, index) => (
          <rect
            key={index}
            x={x - 55}
            y="120"
            width="110"
            height="80"
            rx="12"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeDasharray="6 6"
          />
        ))}

        <text x="80" y="30" fill="#475569" fontSize="13" fontWeight="700">
          L+
        </text>

        <text x="800" y="30" fill="#475569" fontSize="13" fontWeight="700">
          0V
        </text>

        <text x="90" y="145" fill="#475569" fontSize="13" fontWeight="700">
          Rung 001
        </text>

        <text
          x="450"
          y="285"
          textAnchor="middle"
          fill="#64748b"
          fontSize="14"
          fontWeight="600"
        >
          Drag or place contacts, coils, timers, and counters here
        </text>
      </svg>
    </div>
  );
}