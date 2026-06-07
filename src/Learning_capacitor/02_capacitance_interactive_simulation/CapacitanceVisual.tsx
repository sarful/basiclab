"use client";

import { motion } from "framer-motion";

import { clamp, computeCapacitanceSnapshot, dielectricOptions, formatCapacitance, formatCharge, formatEnergy } from "./logic";

type CapacitanceVisualProps = {
  plateArea: number;
  plateDistance: number;
  dielectricIndex: number;
  voltage: number;
};

export function CapacitanceVisual({
  plateArea,
  plateDistance,
  dielectricIndex,
  voltage,
}: CapacitanceVisualProps) {
  const dielectric = dielectricOptions[dielectricIndex];
  const { capacitance, charge, energy, capacitanceLevel } = computeCapacitanceSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
    voltage,
  });
  const plateHeight = 92 + plateArea * 2.25;
  const gap = 44 + plateDistance * 5.4;
  const leftPlateX = 420 - gap / 2;
  const rightPlateX = 420 + gap / 2;
  const topY = 205 - plateHeight / 2;
  const fieldLineCount = Math.min(Math.max(Math.round(capacitanceLevel * 15), 4), 15);
  const chargeDotCount = Math.min(Math.max(Math.round(capacitanceLevel * voltage), 6), 26);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Capacitance Visualizer</h2>
          <p className="text-xs text-slate-600">
            Capacitance is the measure of how much charge a capacitor can store at a given voltage.
          </p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          Q = C x V
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="capacitanceGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={4 + capacitanceLevel * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Capacitance: charge storing ability of a capacitor
          </text>

          <rect x="72" y="160" width="110" height="92" rx="15" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="127" y="196" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="800">DC</text>
          <text x="127" y="222" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{voltage}V</text>
          <text x="185" y="178" fill="#38bdf8" fontSize="18" fontWeight="900">-</text>
          <text x="125" y="258" fill="#f97316" fontSize="18" fontWeight="900">+</text>

          <path d={`M182 185 H${leftPlateX}`} stroke="#64748b" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path
            d={`M${rightPlateX + 16} 185 H705 V335 H127 V252`}
            stroke="#64748b"
            strokeWidth="8"
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
          />

          <motion.rect
            x={leftPlateX}
            y={topY}
            width="16"
            height={plateHeight}
            rx="5"
            fill="#2563eb"
            filter="url(#capacitanceGlow)"
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
            filter="url(#capacitanceGlow)"
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />

          <motion.rect
            x={leftPlateX + 18}
            y={topY + 5}
            width={Math.max(rightPlateX - leftPlateX - 20, 8)}
            height={plateHeight - 10}
            rx="13"
            fill={dielectric.color}
            stroke="#334155"
            strokeDasharray="6 5"
            strokeWidth="2"
            animate={{ opacity: [0.68, 0.96, 0.68] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />

          {Array.from({ length: fieldLineCount }).map((_, index) => {
            const y = topY + 20 + index * ((plateHeight - 40) / Math.max(fieldLineCount - 1, 1));
            return (
              <motion.g key={`field-${index}`}>
                <line x1={leftPlateX + 28} y1={y} x2={rightPlateX - 10} y2={y} stroke="#8b5cf6" strokeWidth="2.4" strokeLinecap="round" />
                <polygon points={`${rightPlateX - 10},${y} ${rightPlateX - 18},${y - 4} ${rightPlateX - 18},${y + 4}`} fill="#8b5cf6" />
              </motion.g>
            );
          })}

          {Array.from({ length: chargeDotCount }).map((_, index) => {
            const y = topY + 16 + (index % 13) * ((plateHeight - 32) / 13);
            const sideOffset = Math.floor(index / 13) * 7;
            return (
              <g key={`charge-dot-${index}`}>
                <circle cx={leftPlateX - 10 - sideOffset} cy={y} r="4" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="1.3" />
                <text x={leftPlateX - 10 - sideOffset} y={y + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="900">-</text>
                <circle cx={rightPlateX + 26 + sideOffset} cy={y} r="4" fill="#ef4444" stroke="#fee2e2" strokeWidth="1.3" />
                <text x={rightPlateX + 26 + sideOffset} y={y + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="900">+</text>
              </g>
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
              style={{ offsetPath: `path('M182 185 H${leftPlateX}')` }}
            />
          ))}

          <text x={leftPlateX - 34} y={topY - 12} textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">- Plate</text>
          <text x={rightPlateX + 46} y={topY - 12} textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="900">+ Plate</text>
          <text x="420" y={topY + plateHeight + 36} textAnchor="middle" fill="#7c3aed" fontSize="13" fontWeight="900">
            Dielectric: {dielectric.label} | k = {dielectric.k}
          </text>
          <text x="420" y="82" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
            C = {formatCapacitance(capacitance)} | Q = {formatCharge(charge)} | Energy = {formatEnergy(energy)}
          </text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Charge Storing Ability
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * capacitanceLevel }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              More capacitance means more charge at the same voltage
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Capacitance Definition
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Capacitance is how much charge a capacitor can store per volt.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">C = Q / V</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Stored Charge
          </p>
          <p className="mt-1 text-sm text-slate-700">
            At the same voltage, higher capacitance stores more charge.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">Q = {formatCharge(charge)}</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Main Unit
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The SI unit of capacitance is the farad. Practical circuits often use uF, nF, and pF.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">1F = 1C/V</p>
        </div>
      </div>
    </div>
  );
}
