"use client";

import { motion } from "framer-motion";

import { clamp, computeStructureSnapshot, dielectricOptions } from "./logic";

type CapacitorStructureVisualProps = {
  plateArea: number;
  plateDistance: number;
  dielectricIndex: number;
  showField: boolean;
};

export function CapacitorStructureVisual({
  plateArea,
  plateDistance,
  dielectricIndex,
  showField,
}: CapacitorStructureVisualProps) {
  const dielectric = dielectricOptions[dielectricIndex];
  const { relativeEffect } = computeStructureSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
  });
  const plateHeight = 95 + plateArea * 2.2;
  const gap = 42 + plateDistance * 5.5;
  const leftPlateX = 420 - gap / 2;
  const rightPlateX = 420 + gap / 2;
  const topY = 210 - plateHeight / 2;
  const bottomY = 210 + plateHeight / 2;
  const fieldLineCount = Math.min(Math.max(Math.round(plateHeight / 18), 5), 14);
  const capacitanceEffect = clamp((plateArea * dielectric.k) / plateDistance / 90, 0.08, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Capacitor Construction Visualizer</h2>
          <p className="text-xs text-slate-600">
            A capacitor is built from two conductive plates with a dielectric material between them.
            Changing area, spacing, and dielectric changes capacitance.
          </p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          STRUCTURE VIEW
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="plateGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={4 + capacitanceEffect * 7} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="30" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Basic capacitor structure: Metal Plate + Dielectric + Metal Plate
          </text>

          <rect x="80" y="165" width="120" height="90" rx="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="140" y="200" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="800">DC Source</text>
          <text x="193" y="180" fill="#38bdf8" fontSize="18" fontWeight="900">-</text>
          <text x="138" y="260" fill="#f97316" fontSize="18" fontWeight="900">+</text>

          <path d={`M200 185 H${leftPlateX}`} stroke="#64748b" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d={`M${rightPlateX + 16} 185 H700 V335 H140 V255`} stroke="#64748b" strokeWidth="8" fill="none" strokeLinecap="square" strokeLinejoin="round" />

          <motion.rect
            x={leftPlateX}
            y={topY}
            width="16"
            height={plateHeight}
            rx="5"
            fill="#2563eb"
            filter="url(#plateGlow)"
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
          <motion.rect
            x={rightPlateX}
            y={topY}
            width="16"
            height={plateHeight}
            rx="5"
            fill="#ef4444"
            filter="url(#plateGlow)"
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />

          <motion.rect
            x={leftPlateX + 18}
            y={topY + 4}
            width={Math.max(rightPlateX - leftPlateX - 20, 8)}
            height={plateHeight - 8}
            rx="12"
            fill={dielectric.color}
            stroke="#334155"
            strokeDasharray="6 5"
            strokeWidth="2"
            animate={{ opacity: [0.72, 0.95, 0.72] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />

          <text x={leftPlateX - 30} y={topY - 12} textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">
            Negative Plate
          </text>
          <text x={rightPlateX + 48} y={topY - 12} textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900">
            Positive Plate
          </text>
          <text x="420" y={bottomY + 35} textAnchor="middle" fill="#7c3aed" fontSize="13" fontWeight="900">
            Dielectric: {dielectric.label} | k = {dielectric.k}
          </text>

          {showField &&
            Array.from({ length: fieldLineCount }).map((_, index) => {
              const y = topY + 20 + index * ((plateHeight - 40) / Math.max(fieldLineCount - 1, 1));
              return (
                <motion.g key={`field-${index}`}>
                  <line x1={leftPlateX + 28} y1={y} x2={rightPlateX - 10} y2={y} stroke="#8b5cf6" strokeWidth="2.4" strokeLinecap="round" />
                  <polygon points={`${rightPlateX - 10},${y} ${rightPlateX - 18},${y - 4} ${rightPlateX - 18},${y + 4}`} fill="#8b5cf6" />
                </motion.g>
              );
            })}

          {Array.from({ length: 10 }).map((_, index) => (
            <motion.circle
              key={`electron-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "linear", delay: index * 0.16 }}
              style={{ offsetPath: `path('M200 185 H${leftPlateX}')` }}
            />
          ))}

          <text x="270" y="150" fill="#2563eb" fontSize="12" fontWeight="800">
            {"Electron collects on negative plate ->"}
          </text>
          <text x="585" y="150" fill="#dc2626" fontSize="12" fontWeight="800">
            Positive plate lacks electrons
          </text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Capacitance Effect
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * relativeEffect }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              Area up and dielectric up increase C; distance up lowers C
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">Metal Plates</p>
          <p className="mt-1 text-sm text-slate-700">
            The two conductive plates store separated charge. More plate area increases capacitance.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">Area = {plateArea} cm2</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Dielectric Layer</p>
          <p className="mt-1 text-sm text-slate-700">
            The dielectric sits between the plates, prevents a short, and increases capacitance.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">k = {dielectric.k}</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Plate Distance</p>
          <p className="mt-1 text-sm text-slate-700">
            When the plates are closer together, field strength is stronger and capacitance rises.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">d = {plateDistance} mm</p>
        </div>
      </div>
    </div>
  );
}
