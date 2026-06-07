"use client";

import { motion } from "framer-motion";

import { ceramicCodeToPf, clamp, dielectricOptions, formatCapacitancePf, formatNumber } from "./logic";

type CeramicCapacitorVisualProps = {
  code: string;
  dielectricIndex: number;
  appliedVoltage: number;
  voltageRating: number;
  frequency: number;
};

export function CeramicCapacitorVisual({
  code,
  dielectricIndex,
  appliedVoltage,
  voltageRating,
  frequency,
}: CeramicCapacitorVisualProps) {
  const capacitancePf = ceramicCodeToPf(code);
  const dielectric = dielectricOptions[dielectricIndex];
  const voltageStress = clamp(appliedVoltage / voltageRating, 0, 1.4);
  const filterEffect = clamp(Math.log10(frequency + 1) / 5, 0.05, 1);
  const rippleLevel = clamp(filterEffect * (capacitancePf / 100000), 0.08, 1);
  const bodyGlow = clamp((capacitancePf / 100000) * dielectric.stability, 0.12, 1);
  const electronCount = Math.min(Math.max(Math.round(rippleLevel * 18), 5), 18);
  const electronDuration = Math.max(0.55, 2.4 - rippleLevel * 1.4);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Ceramic Capacitor Visualizer</h2>
          <p className="text-xs text-slate-600">
            Ceramic capacitors are small, non-polarized, and excellent for bypass,
            decoupling, and high-frequency filtering.
          </p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          NON-POLARIZED
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="ceramicGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + bodyGlow * 7} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Ceramic dielectric between metal electrodes | No polarity | Best for bypass and filtering
          </text>

          <path d="M90 210 H260" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <path d="M580 210 H750" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

          <motion.ellipse
            cx="420"
            cy="210"
            rx="160"
            ry="92"
            fill={dielectric.color}
            stroke="#111827"
            strokeWidth="4"
            filter="url(#ceramicGlow)"
            animate={{ opacity: [0.88, 1, 0.88] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />

          <rect x="310" y="140" width="18" height="140" rx="7" fill="#475569" opacity="0.9" />
          <rect x="512" y="140" width="18" height="140" rx="7" fill="#475569" opacity="0.9" />
          <rect x="342" y="155" width="156" height="110" rx="22" fill="#ffffff" opacity="0.42" stroke="#334155" strokeDasharray="6 5" />

          {Array.from({ length: 9 }).map((_, index) => {
            const y = 162 + index * 12;
            const directionRight = index % 2 === 0;
            return (
              <motion.g key={`field-${index}`}>
                <line
                  x1={directionRight ? "340" : "500"}
                  y1={y}
                  x2={directionRight ? "500" : "340"}
                  y2={y}
                  stroke="#8b5cf6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <polygon
                  points={
                    directionRight
                      ? `500,${y} 492,${y - 4} 492,${y + 4}`
                      : `340,${y} 348,${y - 4} 348,${y + 4}`
                  }
                  fill="#8b5cf6"
                />
              </motion.g>
            );
          })}

          <text x="420" y="205" textAnchor="middle" fill="#111827" fontSize="30" fontWeight="900">
            {code}
          </text>
          <text x="420" y="235" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {formatCapacitancePf(capacitancePf)}
          </text>
          <text x="420" y="262" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="800">
            Dielectric: {dielectric.name}
          </text>

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`electron-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: ["0%", "100%", "0%"], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: electronDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * (electronDuration / electronCount),
              }}
              style={{ offsetPath: "path('M90 210 H260 H310')" }}
            />
          ))}

          <text x="175" y="170" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="800">
            AC ripple / high-frequency noise
          </text>
          <text x="665" y="170" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="800">
            Filtered / cleaner signal
          </text>
          <text x="420" y="330" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
            Applied Voltage: {appliedVoltage}V / Rating: {voltageRating}V | Voltage Margin:{" "}
            {formatNumber(voltageRating - appliedVoltage, 1)}V
          </text>

          <g transform="translate(150 382)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Filtering / Bypass Effect
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#f97316" animate={{ width: 540 * rippleLevel }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              Higher-frequency noise is bypassed more easily
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Ceramic Dielectric
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Ceramic dielectric gives compact size and practical capacitance values.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{dielectric.name}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Capacitance Code
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The first two digits are the value and the last digit is the multiplier.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {code} = {formatCapacitancePf(capacitancePf)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Voltage Rating
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Applied voltage should stay below the rated voltage.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">{voltageRating}V rated</p>
        </div>
      </div>
    </div>
  );
}
