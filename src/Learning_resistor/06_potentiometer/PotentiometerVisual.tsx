"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber, formatResistance } from "./logic";
import type { Mode } from "./types";

export function PotentiometerVisual({
  mode,
  supplyVoltage,
  totalResistance,
  wiperPercent,
  terminal1Voltage,
  terminal3Voltage,
  wiperVoltage,
}: {
  mode: Mode;
  supplyVoltage: number;
  totalResistance: number;
  wiperPercent: number;
  terminal1Voltage: number;
  terminal3Voltage: number;
  wiperVoltage: number;
}) {
  const ratio = wiperPercent / 100;
  const rLeft = totalResistance * ratio;
  const rRight = totalResistance * (1 - ratio);
  const rheostatResistance = Math.max(rLeft, 1);
  const rheostatCurrent = supplyVoltage / rheostatResistance;
  const dividerCurrent = supplyVoltage / totalResistance;
  const flowLevel = mode === "voltageDivider" ? clamp(dividerCurrent / 0.01, 0.12, 1) : clamp(rheostatCurrent / 0.05, 0.08, 1);
  const outputLevel = clamp(wiperVoltage / Math.max(supplyVoltage, 1), 0, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 18), 4), 22);
  const electronSpeed = Math.max(0.55, 2.2 - flowLevel * 1.4);
  const knobAngle = -135 + ratio * 270;
  const wiperX = 220 + ratio * 300;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Potentiometer Live Visualizer</h2>
          <p className="text-xs text-slate-600">Move the wiper and watch the output voltage or active resistance change live.</p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          {mode === "voltageDivider" ? "3-PIN VOLTAGE DIVIDER" : "2-PIN RHEOSTAT"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {mode === "voltageDivider"
              ? "Voltage divider: R1/R2 change while total resistance stays fixed"
              : "Rheostat: active resistance changes, current changes"}
          </text>

          <rect x="180" y="125" width="420" height="86" rx="42" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
          <line x1="220" y1="168" x2="520" y2="168" stroke="#8b5cf6" strokeWidth="18" strokeLinecap="round" />
          <motion.line x1={wiperX} y1="72" x2={wiperX} y2="168" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
          <motion.circle cx={wiperX} cy="68" r="18" fill="#8b5cf6" stroke="#111827" strokeWidth="3" />
          <text x={wiperX} y="73" textAnchor="middle" fill="white" fontSize="10" fontWeight="800">
            W
          </text>

          <line x1="220" y1="168" x2="90" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
          <line x1="520" y1="168" x2="690" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
          <line x1={wiperX} y1="68" x2={wiperX} y2="38" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />

          <text x="220" y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            Terminal 1
          </text>
          <text x="220" y="252" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="800">
            {formatNumber(terminal1Voltage, 2)}V
          </text>

          <text x="520" y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            Terminal 3
          </text>
          <text x="520" y="252" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="800">
            {formatNumber(terminal3Voltage, 2)}V
          </text>

          <text x={wiperX} y="35" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
            Wiper
          </text>
          <text x={wiperX} y="20" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="800">
            {formatNumber(wiperVoltage, 2)}V
          </text>

          <text x="305" y="202" textAnchor="middle" fill="#475569" fontSize="11">
            R1 = {formatResistance(rLeft)}
          </text>
          <text x="435" y="202" textAnchor="middle" fill="#475569" fontSize="11">
            R2 = {formatResistance(rRight)}
          </text>
          <text x="370" y="222" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="700">
            {mode === "voltageDivider" ? `Rtotal = ${formatResistance(totalResistance)}` : `Ractive = ${formatResistance(rheostatResistance)}`}
          </text>

          <g transform="translate(615 70)">
            <circle cx="50" cy="50" r="44" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="#8b5cf6"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ rotate: knobAngle }}
              style={{ transformOrigin: "50px 50px" }}
            />
            <circle cx="50" cy="50" r="8" fill="#111827" />
            <text x="50" y="112" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
              Knob {wiperPercent}%
            </text>
          </g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`pot-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: mode === "voltageDivider" ? "path('M90 168 H220 H520 H690')" : `path('M90 168 H${wiperX}')` }}
            />
          ))}

          <g transform="translate(140 285)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              {mode === "voltageDivider" ? "Output Voltage Level" : "Current Flow Level"}
            </text>
            <rect x="0" y="10" width="500" height="10" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="10" rx="5" fill="#8b5cf6" animate={{ width: 500 * (mode === "voltageDivider" ? outputLevel : flowLevel) }} />
          </g>
        </svg>
      </div>
    </div>
  );
}
