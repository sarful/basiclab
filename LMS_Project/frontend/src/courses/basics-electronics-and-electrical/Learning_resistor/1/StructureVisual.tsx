"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatResistance } from "./logic";
import type { FlowMode, Material, ViewMode } from "./types";

export function StructureVisual({
  mode,
  material,
  voltage,
  baseResistance,
  rotation,
  temperature,
  flowMode,
}: {
  mode: ViewMode;
  material: Material;
  voltage: number;
  baseResistance: number;
  rotation: number;
  temperature: number;
  flowMode: FlowMode;
}) {
  const temperatureFactor = 1 + (temperature - 25) * material.tempCoefficient;
  const resistance = baseResistance * material.resistanceFactor * temperatureFactor;
  const current = voltage / resistance;
  const power = voltage * current;
  const currentLevel = clamp(current / 0.08, 0.06, 1);
  const heatLevel = clamp((power * material.heatFactor) / 2 + temperature / 220, 0, 1);
  const particleCount = Math.min(Math.max(Math.round(currentLevel * 24), 5), 34);
  const electronSpeed = Math.max(0.5, 2.4 - currentLevel * 1.6);
  const explode = mode === "exploded";
  const cutaway = mode === "cutaway" || mode === "microscopic";
  const shellY = explode ? 72 : 118;
  const coreY = explode ? 160 : 140;
  const filmY = explode ? 232 : 140;
  const rotateScale = 1 + Math.abs(rotation) / 900;
  const failureRisk = heatLevel > 0.78;
  const flowPath =
    flowMode === "electron"
      ? "path('M750 170 H610 H550 H270 H210 H70')"
      : "path('M70 170 H210 H270 H550 H610 H750')";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Industrial-Grade Resistor Internal Structure
          </h2>
          <p className="text-xs text-slate-600">
            Atomic collision, spiral trim, temperature drift, heat stress
            à¦à¦¬à¦‚ failure risk à¦à¦•à¦¸à¦¾à¦¥à§‡ à¦¦à§‡à¦–à¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            failureRisk ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
          }`}
        >
          {failureRisk ? "THERMAL STRESS" : mode.toUpperCase()}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 820 450" className="h-auto w-[820px] sm:w-full">
          <defs>
            <linearGradient id="bodyGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop
                offset="50%"
                stopColor={heatLevel > 0.55 ? "#fb923c" : "#e9c27d"}
              />
              <stop
                offset="100%"
                stopColor={heatLevel > 0.82 ? "#ef4444" : "#c99755"}
              />
            </linearGradient>
          </defs>

          <text
            x="410"
            y="30"
            textAnchor="middle"
            fill="#334155"
            fontSize="14"
            fontWeight="800"
          >
            {flowMode === "electron"
              ? "Electron flow: âˆ’ â†’ +"
              : "Conventional current: + â†’ âˆ’"}{" "}
            | R = ÏL/A
          </text>

          <line
            x1="70"
            y1="170"
            x2="210"
            y2="170"
            stroke="#64748b"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="610"
            y1="170"
            x2="750"
            y2="170"
            stroke="#64748b"
            strokeWidth="9"
            strokeLinecap="round"
          />

          <motion.g
            animate={{ rotate: rotation, scale: rotateScale }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            style={{ transformOrigin: "410px 170px" }}
          >
            <motion.rect
              x="210"
              y={shellY}
              width="400"
              height="104"
              rx="52"
              fill="url(#bodyGradient)"
              stroke="#111827"
              strokeWidth="4"
              opacity={cutaway ? 0.35 : 1}
            />
            <motion.rect
              x="250"
              y={coreY}
              width="320"
              height="60"
              rx="30"
              fill="#f8fafc"
              stroke="#475569"
              strokeWidth="3"
              opacity={cutaway || explode ? 1 : 0.22}
            />
            <motion.rect
              x="270"
              y={filmY}
              width="280"
              height="36"
              rx="18"
              fill={material.color}
              opacity={cutaway || explode ? 0.72 : 0.25}
              stroke={material.color}
              strokeDasharray="6 6"
              strokeWidth="2"
            />
            <rect x="260" y={shellY} width="16" height="104" fill="#ef4444" />
            <rect x="330" y={shellY} width="16" height="104" fill="#111827" />
            <rect x="445" y={shellY} width="16" height="104" fill="#f59e0b" />
            <rect x="540" y={shellY} width="16" height="104" fill="#d4af37" />
            <text
              x="410"
              y={filmY + 6}
              textAnchor="middle"
              fill="#111827"
              fontSize="12"
              fontWeight="800"
            >
              {material.layerLabel}
            </text>
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`electron-${index}-${flowMode}`}
              r={3.5 + currentLevel * 1.5}
              fill={flowMode === "electron" ? "#0ea5e9" : "#22c55e"}
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: electronSpeed,
                repeat: Infinity,
                ease: "linear",
                delay: index * (electronSpeed / particleCount),
              }}
              style={{ offsetPath: flowPath }}
            />
          ))}

          {Array.from({ length: 12 }).map((_, index) => {
            const x = 285 + index * 24;
            const y = index % 2 === 0 ? 145 : 192;
            return (
              <motion.g
                key={`collision-${index}`}
                animate={{ opacity: heatLevel > 0.1 ? [0.2, 0.9, 0.2] : 0.12 }}
                transition={{ repeat: Infinity, duration: 1 + index * 0.05 }}
              >
                <circle cx={x} cy={y} r={4 + heatLevel * 5} fill="#f97316" opacity="0.5" />
                <line
                  x1={x - 6}
                  y1={y - 6}
                  x2={x + 6}
                  y2={y + 6}
                  stroke="#ea580c"
                  strokeWidth="1.5"
                />
                <line
                  x1={x + 6}
                  y1={y - 6}
                  x2={x - 6}
                  y2={y + 6}
                  stroke="#ea580c"
                  strokeWidth="1.5"
                />
              </motion.g>
            );
          })}

          <text
            x="410"
            y="302"
            textAnchor="middle"
            fill="#334155"
            fontSize="13"
            fontWeight="800"
          >
            R = {formatResistance(resistance)} | I = {formatCurrent(current)} | T ={" "}
            {temperature}Â°C
          </text>
        </svg>
      </div>
    </div>
  );
}
