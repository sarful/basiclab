"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatNumber, formatResistance } from "./logic";
import type { ResistorItem } from "./types";

export function SeriesCircuitVisual({ supplyVoltage, resistors }: { supplyVoltage: number; resistors: ResistorItem[] }) {
  const totalResistance = resistors.reduce((sum, item) => sum + item.value, 0);
  const current = supplyVoltage / totalResistance;
  const voltageDrops = resistors.map((item) => current * item.value);
  const sumDrop = voltageDrops.reduce((sum, value) => sum + value, 0);
  const flowLevel = clamp(current / 0.035, 0.08, 1);
  const electronCount = Math.min(Math.max(Math.round(flowLevel * 22), 4), 26);
  const electronSpeed = Math.max(0.55, 2.4 - flowLevel * 1.5);
  const wireWidth = 5 + flowLevel * 5;
  const startX = 175;
  const gap = resistors.length <= 3 ? 145 : 108;
  const resistorWidth = resistors.length <= 3 ? 92 : 76;
  const resistorXs = resistors.map((_, index) => startX + index * gap);
  const lastX = resistorXs[resistorXs.length - 1] + resistorWidth;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Series Resistor Circuit Visualizer</h2>
          <p className="text-xs text-slate-600">In a series circuit, resistance adds together, current stays the same, and voltage is shared.</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">SERIES CONNECTION</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 820 390" className="h-auto w-[820px] sm:w-full">
          <defs>
            <filter id="seriesGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + flowLevel * 7} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="410" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Rtotal = R1 + R2 + R3 ... | Current is same everywhere
          </text>

          <rect x="42" y="128" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="164" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="87" y="190" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {supplyVoltage}V
          </text>
          <text x="87" y="240" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            Supply
          </text>

          <path d={`M132 174 H${startX}`} stroke="#64748b" strokeWidth={wireWidth} strokeLinecap="round" />
          <path d={`M${lastX} 174 H700 V275 H87 V220`} stroke="#64748b" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />

          {resistors.map((item, index) => {
            const x = resistorXs[index];
            const drop = voltageDrops[index];
            const heatLevel = clamp(drop / Math.max(supplyVoltage, 1), 0.08, 1);
            const nextStart = index === 0 ? startX : resistorXs[index - 1] + resistorWidth;
            return (
              <g key={item.id}>
                {index > 0 && <path d={`M${nextStart} 174 H${x}`} stroke="#64748b" strokeWidth={wireWidth} strokeLinecap="round" />}
                <motion.rect
                  x={x}
                  y="135"
                  width={resistorWidth}
                  height="78"
                  rx="36"
                  fill={heatLevel > 0.45 ? "#fb923c" : "#f2c879"}
                  stroke="#111827"
                  strokeWidth="3"
                  filter="url(#seriesGlow)"
                  animate={{ opacity: [0.94, 1, 0.94] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <rect x={x + 16} y="135" width="8" height="78" fill="#ef4444" />
                <rect x={x + 36} y="135" width="8" height="78" fill="#111827" />
                <rect x={x + 56} y="135" width="8" height="78" fill="#f59e0b" />
                <text x={x + resistorWidth / 2} y="124" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
                  R{index + 1}
                </text>
                <text x={x + resistorWidth / 2} y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
                  {formatResistance(item.value)}
                </text>
                <text x={x + resistorWidth / 2} y="257" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">
                  {formatNumber(drop, 2)}V
                </text>
              </g>
            );
          })}

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`series-electron-${electronCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / electronCount) }}
              style={{ offsetPath: `path('M87 220 V275 H700 V174 H${lastX} H${startX} H132')` }}
            />
          ))}

          <text x="190" y="150" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            Same current
          </text>
          <text x="625" y="150" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Voltage shared
          </text>

          <g transform="translate(140 320)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Total Resistance Build-up
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#f59e0b" animate={{ width: 540 * clamp(totalResistance / 20000, 0.06, 1) }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">
              Rtotal = {formatResistance(totalResistance)}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">Total Resistance</p>
          <p className="mt-1 text-sm text-slate-700">Rtotal = {resistors.map((_, index) => `R${index + 1}`).join(" + ")}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Rtotal = {formatResistance(totalResistance)}</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Same Current</p>
          <p className="mt-1 text-sm text-slate-700">I = Vs / Rtotal</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            I = {supplyVoltage}V / {formatResistance(totalResistance)} = {formatCurrent(current)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Voltage Drop Check</p>
          <p className="mt-1 text-sm text-slate-700">{voltageDrops.map((_, index) => `V${index + 1}`).join(" + ")} = Vs</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(sumDrop, 2)}V ≈ {supplyVoltage}V
          </p>
        </div>
      </div>
    </div>
  );
}
