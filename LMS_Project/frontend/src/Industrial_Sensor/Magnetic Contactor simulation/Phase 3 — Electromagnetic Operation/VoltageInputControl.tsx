"use client";

import React from "react";

export type CoilVoltageMode = "off" | "24v-dc" | "110v-ac" | "220v-ac" | "overvoltage";

export interface VoltageInputControlProps {
  mode?: CoilVoltageMode;
  onModeChange?: (mode: CoilVoltageMode) => void;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  showTerminals?: boolean;
  className?: string;
}

const voltageOptions: {
  key: CoilVoltageMode;
  label: string;
  value: string;
  type: string;
  safe: boolean;
  note: string;
}[] = [
  {
    key: "off",
    label: "OFF",
    value: "0V",
    type: "No Supply",
    safe: true,
    note: "Coil is de-energized. Armature remains released.",
  },
  {
    key: "24v-dc",
    label: "24V DC",
    value: "24V",
    type: "DC Control",
    safe: true,
    note: "Common safe control voltage for training panels.",
  },
  {
    key: "110v-ac",
    label: "110V AC",
    value: "110V",
    type: "AC Control",
    safe: true,
    note: "Industrial control voltage used in many systems.",
  },
  {
    key: "220v-ac",
    label: "220V AC",
    value: "220V",
    type: "AC Control",
    safe: true,
    note: "Coil energizes when the contactor coil rating matches 220V AC.",
  },
  {
    key: "overvoltage",
    label: "Over Voltage",
    value: "380V+",
    type: "Fault",
    safe: false,
    note: "Wrong coil voltage can damage the contactor coil.",
  },
];

export default function VoltageInputControl({
  mode = "off",
  onModeChange,
  enabled = mode !== "off",
  onEnabledChange,
  showTerminals = true,
  className = "",
}: VoltageInputControlProps) {
  const selected = voltageOptions.find((item) => item.key === mode) ?? voltageOptions[0];
  const isActive = enabled && mode !== "off";
  const isFault = isActive && !selected.safe;

  const handlePowerToggle = () => {
    const nextEnabled = !enabled;
    onEnabledChange?.(nextEnabled);

    if (!nextEnabled) {
      onModeChange?.("off");
    } else if (mode === "off") {
      onModeChange?.("220v-ac");
    }
  };

  return (
    <div className={`w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Voltage Input Control</h3>
          <p className="text-sm text-slate-500">Apply control voltage to coil terminals A1 and A2.</p>
        </div>

        <button
          type="button"
          onClick={handlePowerToggle}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
            isActive
              ? isFault
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {isActive ? "POWER ON" : "POWER OFF"}
        </button>
      </div>

      {showTerminals && (
        <div className="mb-5 rounded-2xl bg-slate-900 p-4 text-white">
          <svg viewBox="0 0 520 145" className="h-auto w-full" role="img" aria-label="A1 A2 coil voltage terminals">
            <defs>
              <filter id="terminalGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="terminalMetal" x1="0" x2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            <rect x="40" y="30" width="440" height="82" rx="18" fill="#1e293b" stroke="#475569" strokeWidth="3" />

            <circle cx="120" cy="72" r="30" fill="url(#terminalMetal)" />
            <circle cx="400" cy="72" r="30" fill="url(#terminalMetal)" />

            <path d="M105 72 H135" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
            <path d="M385 72 H415" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

            <text x="105" y="128" fill="#e2e8f0" fontSize="24" fontWeight="800">A1</text>
            <text x="385" y="128" fill="#e2e8f0" fontSize="24" fontWeight="800">A2</text>

            <line
              x1="150"
              y1="72"
              x2="370"
              y2="72"
              stroke={isFault ? "#ef4444" : isActive ? "#22c55e" : "#64748b"}
              strokeWidth="8"
              strokeLinecap="round"
              filter={isActive ? "url(#terminalGlow)" : undefined}
            />

            {isActive && (
              <circle r="8" fill={isFault ? "#ef4444" : "#22c55e"} filter="url(#terminalGlow)">
                <animateMotion dur="1.1s" repeatCount="indefinite" path="M 155 72 L 365 72" />
              </circle>
            )}

            <text x="232" y="58" fill="#e2e8f0" fontSize="18" fontWeight="700">
              {selected.value}
            </text>
            <text x="210" y="95" fill="#94a3b8" fontSize="14" fontWeight="600">
              Coil Supply
            </text>
          </svg>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {voltageOptions.map((option) => {
          const active = option.key === mode;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                onModeChange?.(option.key);
                onEnabledChange?.(option.key !== "off");
              }}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                active
                  ? option.safe
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-red-600 bg-red-50 text-red-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="text-sm font-bold">{option.label}</div>
              <div className="text-xs opacity-80">{option.type}</div>
            </button>
          );
        })}
      </div>

      <div
        className={`mt-4 rounded-2xl p-4 text-sm ${
          isFault
            ? "bg-red-50 text-red-800"
            : isActive
            ? "bg-emerald-50 text-emerald-800"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        <div className="font-bold">
          {isFault ? "Fault Condition" : isActive ? "Coil Energized" : "Coil De-Energized"}
        </div>
        <p className="mt-1">{selected.note}</p>
      </div>
    </div>
  );
}
