"use client";

import { motion } from "framer-motion";

import { formatNumber } from "./logic";

type NonPolarizedCapacitorCardProps = {
  frequency: number;
};

export function NonPolarizedCapacitorCard({
  frequency,
}: NonPolarizedCapacitorCardProps) {
  const reactance = 1 / (2 * Math.PI * frequency * 0.0000001);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Non-Polarized Capacitor</h2>
          <p className="text-xs text-slate-600">
            Ceramic / film capacitor - can connect in any direction.
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          NO POLARITY
        </span>
      </div>

      <svg viewBox="0 0 720 360" className="w-full">
        <rect x="40" y="165" width="80" height="85" rx="15" fill="#0f172a" />
        <text x="80" y="198" textAnchor="middle" fill="white" fontSize="15" fontWeight="800">
          AC
        </text>
        <text x="80" y="225" textAnchor="middle" fill="#7dd3fc" fontSize="13">
          Signal
        </text>

        <path d="M120 205 H260" stroke="#64748b" strokeWidth="8" fill="none" />
        <path d="M460 205 H650" stroke="#64748b" strokeWidth="8" fill="none" />

        <motion.rect x="260" y="115" width="18" height="180" rx="6" fill="#2563eb" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <motion.rect x="442" y="115" width="18" height="180" rx="6" fill="#ef4444" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.2 }} />

        <rect x="280" y="125" width="160" height="160" rx="18" fill="#f8fafc" stroke="#334155" strokeDasharray="5 4" />

        {Array.from({ length: 10 }).map((_, index) => {
          const y = 140 + index * 14;
          const directionRight = index % 2 === 0;
          return (
            <motion.g key={index}>
              <line
                x1={directionRight ? 290 : 430}
                y1={y}
                x2={directionRight ? 430 : 290}
                y2={y}
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              <polygon
                points={
                  directionRight
                    ? `${430},${y} ${422},${y - 4} ${422},${y + 4}`
                    : `${290},${y} ${298},${y - 4} ${298},${y + 4}`
                }
                fill="#8b5cf6"
              />
            </motion.g>
          );
        })}

        <text x="360" y="175" textAnchor="middle" fill="#111827" fontSize="28" fontWeight="900">
          104
        </text>
        <text x="360" y="208" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="800">
          100 nF
        </text>
        <text x="360" y="236" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="800">
          Ceramic Capacitor
        </text>

        <text x="360" y="322" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
          AC Frequency = {formatNumber(frequency, 0)} Hz | Xc = {formatNumber(reactance, 0)} Ohm
        </text>
      </svg>

      <div className="mt-3 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
        <p className="font-semibold text-blue-700">Main Rule</p>
        <p className="mt-1">
          A non-polarized capacitor can be connected in either direction. It is commonly
          used for AC signal coupling and filtering.
        </p>
      </div>
    </div>
  );
}
