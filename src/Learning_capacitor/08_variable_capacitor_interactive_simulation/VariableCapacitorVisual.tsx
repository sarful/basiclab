"use client";

import { motion } from "framer-motion";

import { clamp, computeVariableCapacitorSnapshot, formatCapacitance, formatFrequency, formatNumber } from "./logic";

type VariableCapacitorVisualProps = {
  rotation: number;
  minCapacitance: number;
  maxCapacitance: number;
  inductanceUh: number;
  plateCount: number;
};

export function VariableCapacitorVisual({
  rotation,
  minCapacitance,
  maxCapacitance,
  inductanceUh,
  plateCount,
}: VariableCapacitorVisualProps) {
  const { overlapRatio, capacitance, frequency, tuningPercent } =
    computeVariableCapacitorSnapshot({
      rotation,
      minCapacitance,
      maxCapacitance,
      inductanceUh,
    });
  const fieldLines = Math.min(Math.max(Math.round(overlapRatio * 12), 3), 12);
  const rotorAngle = -70 + rotation * 0.78;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Variable Capacitor Tuning Visualizer</h2>
          <p className="text-xs text-slate-600">
            Turning the knob changes rotor/stator overlap, which changes capacitance and
            therefore the LC tuning frequency.
          </p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          ADJUSTABLE CAPACITANCE
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="variableGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + overlapRatio * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            More plate overlap {"->"} higher capacitance {"->"} lower resonant frequency
          </text>

          <rect x="58" y="166" width="105" height="86" rx="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="110" y="198" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="800">
            RF
          </text>
          <text x="110" y="224" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="800">
            Signal
          </text>

          <path d="M163 208 H260" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <path d="M580 208 H710" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <path d="M710 208 V328 H110 V252" stroke="#64748b" strokeWidth="8" strokeLinecap="square" strokeLinejoin="round" fill="none" />

          <g transform="translate(420 208)">
            <circle r="122" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <circle r="18" fill="#334155" />

            {Array.from({ length: plateCount }).map((_, index) => {
              const y = -80 + index * (160 / Math.max(plateCount - 1, 1));
              return (
                <g key={`stator-${index}`}>
                  <rect x="-100" y={y - 6} width="94" height="12" rx="5" fill="#2563eb" opacity="0.9" />
                  <rect x="8" y={y - 6} width="94" height="12" rx="5" fill="#ef4444" opacity="0.9" />
                </g>
              );
            })}

            <motion.g animate={{ rotate: rotorAngle }} transition={{ type: "spring", stiffness: 80, damping: 16 }}>
              {Array.from({ length: plateCount - 1 }).map((_, index) => {
                const y = -64 + index * (128 / Math.max(plateCount - 2, 1));
                return (
                  <g key={`rotor-${index}`} filter="url(#variableGlow)">
                    <rect x="-86" y={y - 5} width="172" height="10" rx="5" fill="#94a3b8" stroke="#334155" strokeWidth="1.2" />
                    <circle cx="0" cy={y} r="4" fill="#475569" />
                  </g>
                );
              })}
              <line x1="0" y1="0" x2="0" y2="-118" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
              <circle cy="-122" r="9" fill="#111827" />
            </motion.g>

            {Array.from({ length: fieldLines }).map((_, index) => {
              const y = -70 + index * (140 / Math.max(fieldLines - 1, 1));
              return (
                <motion.g key={`field-${index}`}>
                  <line x1="-4" y1={y} x2="4" y2={y} stroke="#8b5cf6" strokeWidth="2" />
                  <circle cx="0" cy={y} r="2" fill="#8b5cf6" />
                </motion.g>
              );
            })}

            <text x="0" y="152" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="900">
              Rotor + Stator Plate Assembly
            </text>
          </g>

          <text x="260" y="122" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="800">
            Fixed stator plates
          </text>
          <text x="590" y="122" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="800">
            Movable rotor plates
          </text>
          <text x="420" y="78" textAnchor="middle" fill="#7c3aed" fontSize="13" fontWeight="900">
            Overlap = {formatNumber(overlapRatio * 100, 0)}% | C = {formatCapacitance(capacitance)} | f = {formatFrequency(frequency)}
          </text>

          <g transform="translate(150 382)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Radio Tuning Position
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * tuningPercent }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              Lower capacitance increases frequency; higher capacitance lowers it
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">Variable Capacitance</p>
          <p className="mt-1 text-sm text-slate-700">
            Rotating the rotor changes effective plate overlap, so capacitance changes.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">C = {formatCapacitance(capacitance)}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">LC Tuning</p>
          <p className="mt-1 text-sm text-slate-700">
            A variable capacitor and inductor together form a resonant tuning circuit.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">f = {formatFrequency(frequency)}</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Overlap Area</p>
          <p className="mt-1 text-sm text-slate-700">
            More plate overlap means more capacitance.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatNumber(overlapRatio * 100, 0)}%</p>
        </div>
      </div>
    </div>
  );
}
