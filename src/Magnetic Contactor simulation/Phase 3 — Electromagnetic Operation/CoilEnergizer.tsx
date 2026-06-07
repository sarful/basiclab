"use client";

import React, { useMemo } from "react";

export interface CoilEnergizerProps {
  voltage?: number;
  ratedVoltage?: number;
  energized?: boolean;
  showLabels?: boolean;
  showStatus?: boolean;
  onToggle?: () => void;
  onVoltageChange?: (voltage: number) => void;
  className?: string;
}

export default function CoilEnergizer({
  voltage = 0,
  ratedVoltage = 220,
  energized,
  showLabels = true,
  showStatus = true,
  onToggle,
  onVoltageChange,
  className = "",
}: CoilEnergizerProps) {
  const isEnergized = energized ?? voltage >= ratedVoltage * 0.85;

  const voltagePercent = useMemo(() => {
    return Math.max(0, Math.min(100, (voltage / ratedVoltage) * 100));
  }, [voltage, ratedVoltage]);

  const statusText = isEnergized ? "Coil Energized" : "Coil De-Energized";
  const statusColor = isEnergized ? "text-green-700" : "text-slate-500";

  return (
    <div className={`rounded-3xl border bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Coil Energizer</h2>
          <p className="text-sm text-slate-500">A1-A2 control coil voltage input</p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isEnergized ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {isEnergized ? "ON" : "OFF"}
        </div>
      </div>

      <svg viewBox="0 0 520 230" className="h-auto w-full">
        <defs>
          <filter id="coilEnergizerGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="coilWireGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="coreMetalGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Panel background */}
        <rect x="22" y="24" width="476" height="170" rx="24" fill="#f8fafc" stroke="#cbd5e1" />

        {/* A1 terminal */}
        <circle cx="78" cy="110" r="24" fill={isEnergized ? "#22c55e" : "#94a3b8"} />
        <circle cx="78" cy="110" r="10" fill="#ffffff" opacity="0.8" />
        <text x="66" y="160" fontSize="18" fontWeight="800" fill="#334155">
          A1
        </text>

        {/* A2 terminal */}
        <circle cx="442" cy="110" r="24" fill={isEnergized ? "#22c55e" : "#94a3b8"} />
        <circle cx="442" cy="110" r="10" fill="#ffffff" opacity="0.8" />
        <text x="430" y="160" fontSize="18" fontWeight="800" fill="#334155">
          A2
        </text>

        {/* Lead wires */}
        <line x1="102" y1="110" x2="155" y2="110" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
        <line x1="365" y1="110" x2="418" y2="110" stroke="#334155" strokeWidth="7" strokeLinecap="round" />

        {/* Energized glow */}
        {isEnergized && (
          <rect
            x="150"
            y="58"
            width="220"
            height="104"
            rx="20"
            fill="#fde68a"
            opacity="0.55"
            filter="url(#coilEnergizerGlow)"
          />
        )}

        {/* Iron core */}
        <rect x="246" y="52" width="34" height="116" rx="8" fill="url(#coreMetalGradient)" stroke="#475569" />

        {/* Coil frame */}
        <rect
          x="150"
          y="62"
          width="220"
          height="96"
          rx="18"
          fill={isEnergized ? "#fef3c7" : "#e2e8f0"}
          stroke={isEnergized ? "#d97706" : "#94a3b8"}
          strokeWidth="3"
        />

        {/* Coil turns */}
        {Array.from({ length: 20 }).map((_, index) => {
          const x = 166 + index * 9.6;
          return (
            <path
              key={index}
              d={`M ${x} 72 Q ${x + 8} 110 ${x} 148`}
              fill="none"
              stroke={isEnergized ? "url(#coilWireGradient)" : "#94a3b8"}
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Animated current dots */}
        {isEnergized && (
          <>
            <circle r="6" fill="#22c55e" filter="url(#coilEnergizerGlow)">
              <animateMotion dur="1.1s" repeatCount="indefinite" path="M 78 110 L 155 110" />
            </circle>
            <circle r="6" fill="#22c55e" filter="url(#coilEnergizerGlow)">
              <animateMotion dur="1.1s" repeatCount="indefinite" path="M 365 110 L 442 110" />
            </circle>
          </>
        )}

        {/* Voltage text */}
        <text x="260" y="210" textAnchor="middle" fontSize="18" fontWeight="800" fill={isEnergized ? "#16a34a" : "#64748b"}>
          {voltage}V / Rated {ratedVoltage}V
        </text>
      </svg>

      {showLabels && (
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>Input Voltage</span>
              <span>{voltagePercent.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isEnergized ? "bg-green-500" : "bg-slate-400"}`}
                style={{ width: `${voltagePercent}%` }}
              />
            </div>
          </div>

          {onVoltageChange && (
            <input
              type="range"
              min={0}
              max={ratedVoltage}
              value={Math.max(0, Math.min(ratedVoltage, voltage))}
              onChange={(event) => onVoltageChange(Number(event.target.value))}
              className="w-full accent-blue-600"
            />
          )}

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className={`w-full rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
                isEnergized ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEnergized ? "De-Energize Coil" : "Energize Coil"}
            </button>
          )}
        </div>
      )}

      {showStatus && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
          <div className={`font-bold ${statusColor}`}>{statusText}</div>
          <p className="mt-1 text-slate-500">
            When A1-A2 receives enough voltage, the coil produces a magnetic field and pulls the armature.
          </p>
        </div>
      )}
    </div>
  );
}
