"use client";

import React from "react";

export interface LadderWorkspaceProps {
  startInput?: boolean;
  stopInput?: boolean;
  outputActive?: boolean;
  title?: string;
}

export default function LadderWorkspace({
  startInput = false,
  stopInput = true,
  outputActive = false,
  title = "Ladder Logic Workspace",
}: LadderWorkspaceProps) {
  const energized = startInput && stopInput;
  const motorOn = outputActive || energized;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">
            Live PLC ladder logic visualization
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            motorOn
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {motorOn ? "RUNG TRUE" : "RUNG FALSE"}
        </span>
      </div>

      <svg viewBox="0 0 900 330" className="h-auto w-full">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Power rails */}
        <line x1="70" y1="40" x2="70" y2="290" stroke="#334155" strokeWidth="5" />
        <line x1="830" y1="40" x2="830" y2="290" stroke="#334155" strokeWidth="5" />

        <text x="45" y="30" fill="#475569" fontSize="14" fontWeight="700">
          L+
        </text>
        <text x="810" y="30" fill="#475569" fontSize="14" fontWeight="700">
          0V
        </text>

        {/* Main rung wire */}
        <line
          x1="70"
          y1="145"
          x2="830"
          y2="145"
          stroke={motorOn ? "#22c55e" : "#94a3b8"}
          strokeWidth="5"
        />

        {/* Start NO Contact */}
        <g>
          <line x1="180" y1="110" x2="180" y2="180" stroke="#1f2937" strokeWidth="4" />
          <line
            x1={startInput ? "215" : "225"}
            y1="110"
            x2="215"
            y2="180"
            stroke={startInput ? "#22c55e" : "#1f2937"}
            strokeWidth="4"
          />

          <text x="202" y="205" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
            START
          </text>
          <text x="202" y="225" textAnchor="middle" fill="#64748b" fontSize="12">
            I0.0 NO
          </text>
        </g>

        {/* Stop NC Contact */}
        <g>
          <line x1="370" y1="110" x2="370" y2="180" stroke="#1f2937" strokeWidth="4" />
          <line x1="415" y1="110" x2="415" y2="180" stroke="#1f2937" strokeWidth="4" />
          <line
            x1="365"
            y1="180"
            x2="420"
            y2="110"
            stroke={stopInput ? "#22c55e" : "#ef4444"}
            strokeWidth="4"
          />

          <text x="392" y="205" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
            STOP
          </text>
          <text x="392" y="225" textAnchor="middle" fill="#64748b" fontSize="12">
            I0.1 NC
          </text>
        </g>

        {/* Output Coil */}
        <g>
          <path
            d="M620 110 C585 110,585 180,620 180"
            fill="none"
            stroke={motorOn ? "#22c55e" : "#1f2937"}
            strokeWidth="4"
          />
          <path
            d="M660 110 C695 110,695 180,660 180"
            fill="none"
            stroke={motorOn ? "#22c55e" : "#1f2937"}
            strokeWidth="4"
          />

          <text x="640" y="205" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
            MOTOR
          </text>
          <text x="640" y="225" textAnchor="middle" fill="#64748b" fontSize="12">
            Q0.2
          </text>
        </g>

        {/* Current flow arrows */}
        {motorOn && (
          <>
            <line x1="95" y1="130" x2="150" y2="130" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow)" />
            <line x1="260" y1="130" x2="335" y2="130" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow)" />
            <line x1="455" y1="130" x2="585" y2="130" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow)" />
            <line x1="705" y1="130" x2="800" y2="130" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrow)" />
          </>
        )}

        {/* Rung label */}
        <text x="75" y="95" fill="#475569" fontSize="13" fontWeight="700">
          Rung 001
        </text>

        {/* Status blocks */}
        <g>
          <rect x="120" y="255" width="140" height="45" rx="10" fill={startInput ? "#dcfce7" : "#f1f5f9"} />
          <text x="190" y="283" textAnchor="middle" fill={startInput ? "#15803d" : "#64748b"} fontSize="13" fontWeight="700">
            START {startInput ? "ON" : "OFF"}
          </text>

          <rect x="320" y="255" width="140" height="45" rx="10" fill={stopInput ? "#dcfce7" : "#fee2e2"} />
          <text x="390" y="283" textAnchor="middle" fill={stopInput ? "#15803d" : "#b91c1c"} fontSize="13" fontWeight="700">
            STOP {stopInput ? "OK" : "OPEN"}
          </text>

          <rect x="570" y="255" width="140" height="45" rx="10" fill={motorOn ? "#dcfce7" : "#f1f5f9"} />
          <text x="640" y="283" textAnchor="middle" fill={motorOn ? "#15803d" : "#64748b"} fontSize="13" fontWeight="700">
            Q0.2 {motorOn ? "ON" : "OFF"}
          </text>
        </g>
      </svg>
    </div>
  );
}