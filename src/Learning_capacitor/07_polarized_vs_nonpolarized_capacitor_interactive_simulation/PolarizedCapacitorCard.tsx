"use client";

import { motion } from "framer-motion";

import { FlowDots } from "./FlowDots";

type PolarizedCapacitorCardProps = {
  voltage: number;
  reverse: boolean;
};

export function PolarizedCapacitorCard({ voltage, reverse }: PolarizedCapacitorCardProps) {
  const danger = reverse || voltage > 25;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Polarized Capacitor</h2>
          <p className="text-xs text-slate-600">
            Electrolytic capacitor - polarity must be correct.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            danger ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {danger ? "Danger" : "Correct Connection"}
        </span>
      </div>

      <svg viewBox="0 0 720 360" className="w-full">
        <rect x="40" y="165" width="80" height="85" rx="15" fill="#0f172a" />
        <text x="80" y="198" textAnchor="middle" fill="white" fontSize="15" fontWeight="800">
          DC
        </text>
        <text x="80" y="225" textAnchor="middle" fill="#7dd3fc" fontSize="13">
          {voltage}V
        </text>

        <path d="M120 205 H250" stroke="#64748b" strokeWidth="8" fill="none" />
        <path d="M520 205 H650 V300 H80 V250" stroke="#64748b" strokeWidth="8" fill="none" />

        <FlowDots reverse={reverse} />

        <motion.g animate={{ opacity: [0.92, 1, 0.92] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <rect x="250" y="110" width="270" height="180" rx="32" fill={danger ? "#fee2e2" : "#e2e8f0"} stroke={danger ? "#ef4444" : "#111827"} strokeWidth="4" />
          <ellipse cx="250" cy="200" rx="28" ry="90" fill="#cbd5e1" stroke="#334155" strokeWidth="4" />
          <ellipse cx="520" cy="200" rx="28" ry="90" fill="#94a3b8" stroke="#334155" strokeWidth="4" />

          <rect x="465" y="118" width="36" height="164" rx="8" fill="#111827" />
          {Array.from({ length: 8 }).map((_, i) => (
            <text key={i} x="483" y={136 + i * 18} textAnchor="middle" fill="white" fontSize="15" fontWeight="900">
              -
            </text>
          ))}
        </motion.g>

        <text x="230" y="148" fill="#f97316" fontSize="14" fontWeight="900">
          + Lead
        </text>
        <text x="550" y="148" fill="#0284c7" fontSize="14" fontWeight="900">
          - Stripe
        </text>

        <text x="385" y="188" textAnchor="middle" fill="#111827" fontSize="30" fontWeight="900">
          100 uF
        </text>
        <text x="385" y="220" textAnchor="middle" fill="#334155" fontSize="16" fontWeight="800">
          25V Rated
        </text>

        {danger && (
          <motion.g animate={{ opacity: [0.35, 1, 0.35] }} transition={{ repeat: Infinity, duration: 0.8 }}>
            <polygon points="385,42 420,95 350,95" fill="#ef4444" />
            <text x="385" y="84" textAnchor="middle" fill="white" fontSize="28" fontWeight="900">
              !
            </text>
            <text x="385" y="110" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="900">
              Reverse polarity or over-voltage can damage capacitor
            </text>
          </motion.g>
        )}
      </svg>

      <div className="mt-3 rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
        <p className="font-semibold text-orange-700">Main Rule</p>
        <p className="mt-1">
          A polarized capacitor must have its plus and minus terminals connected correctly.
          Wrong polarity can cause leakage, heating, or explosion.
        </p>
      </div>
    </div>
  );
}
