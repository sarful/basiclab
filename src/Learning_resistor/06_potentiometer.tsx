"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Mode = "voltageDivider" | "rheostat";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

function formatResistance(value: number) {
  if (value >= 1000000) return `${formatNumber(value / 1000000, 2)} MΩ`;
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kΩ`;
  return `${formatNumber(value, 1)} Ω`;
}

function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

function MetricCard({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <p className={`text-2xl font-bold sm:text-3xl ${tone}`}>{value}</p>
        <p className="pb-1 text-sm text-slate-500">{unit}</p>
      </div>
    </div>
  );
}

function PotentiometerVisual({
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
  const flowLevel = mode === "voltageDivider"
    ? clamp(dividerCurrent / 0.01, 0.12, 1)
    : clamp(rheostatCurrent / 0.05, 0.08, 1);
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
          <p className="text-xs text-slate-600">Knob ঘোরালে wiper position বদলায় এবং output resistance/voltage পরিবর্তিত হয়।</p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          {mode === "voltageDivider" ? "3-PIN VOLTAGE DIVIDER" : "2-PIN RHEOSTAT"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="potGlow" x="-40%" y="-50%" width="180%" height="200%">
              <feGaussianBlur stdDeviation={4 + flowLevel * 8} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {mode === "voltageDivider"
              ? "Voltage divider: R1/R2 change, total resistance stays fixed"
              : "Rheostat: active resistance changes, current changes"}
          </text>

          <rect x="180" y="125" width="420" height="86" rx="42" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
          <line x1="220" y1="168" x2="520" y2="168" stroke="#8b5cf6" strokeWidth="18" strokeLinecap="round" />
          <motion.line x1={wiperX} y1="72" x2={wiperX} y2="168" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
          <motion.circle cx={wiperX} cy="68" r="18" fill="#8b5cf6" stroke="#111827" strokeWidth="3" />
          <text x={wiperX} y="73" textAnchor="middle" fill="white" fontSize="10" fontWeight="800">W</text>

          <line x1="220" y1="168" x2="90" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
          <line x1="520" y1="168" x2="690" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
          <line x1={wiperX} y1="68" x2={wiperX} y2="38" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />

          <text x="220" y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Terminal 1</text>
          <text x="220" y="252" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="800">{formatNumber(terminal1Voltage, 2)}V</text>

          <text x="520" y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Terminal 3</text>
          <text x="520" y="252" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="800">{formatNumber(terminal3Voltage, 2)}V</text>

          <text x={wiperX} y="35" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Wiper</text>
          <text x={wiperX} y="20" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="800">{formatNumber(wiperVoltage, 2)}V</text>

          <text x="305" y="202" textAnchor="middle" fill="#475569" fontSize="11">R1 = {formatResistance(rLeft)}</text>
          <text x="435" y="202" textAnchor="middle" fill="#475569" fontSize="11">R2 = {formatResistance(rRight)}</text>
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
            <text x="50" y="112" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Knob {wiperPercent}%</text>
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
            <motion.rect
              x="0"
              y="10"
              height="10"
              rx="5"
              fill="#8b5cf6"
              animate={{ width: 500 * (mode === "voltageDivider" ? outputLevel : flowLevel) }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function VariableResistorSimulation() {
  const [mode, setMode] = useState<Mode>("voltageDivider");
  const [supplyVoltage, setSupplyVoltage] = useState(5);
  const [totalResistance, setTotalResistance] = useState(10000);
  const [wiperPercent, setWiperPercent] = useState(50);

  const ratio = wiperPercent / 100;
  const rLeft = totalResistance * ratio;
  const rRight = totalResistance * (1 - ratio);
  const terminal1Voltage = 0;
  const terminal3Voltage = supplyVoltage;
  const outputVoltage = supplyVoltage * ratio;
  const wiperVoltage = mode === "voltageDivider" ? outputVoltage : supplyVoltage;
  const rheostatResistance = Math.max(rLeft, 1);
  const rheostatCurrent = supplyVoltage / rheostatResistance;
  const dividerCurrent = supplyVoltage / totalResistance;
  const activeCurrent = mode === "voltageDivider" ? dividerCurrent : rheostatCurrent;
  const power = activeCurrent * activeCurrent * (mode === "voltageDivider" ? totalResistance : rheostatResistance);

  const status = useMemo(() => {
    if (activeCurrent > 0.05) return { label: "HIGH CURRENT", tone: "text-red-600", bg: "bg-red-50 border-red-200" };
    if (activeCurrent > 0.02) return { label: "MEDIUM CURRENT", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    return { label: "SAFE LOW CURRENT", tone: "text-green-600", bg: "bg-green-50 border-green-200" };
  }, [activeCurrent]);

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">ভ্যারিয়েবল রেজিস্টর (পটেনশিওমিটার) — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Potentiometer-এর wiper position পরিবর্তন করে resistance, voltage output এবং current কিভাবে পরিবর্তিত হয় দেখুন।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Wiper Voltage" value={formatNumber(wiperVoltage, 2)} unit="V" tone="text-purple-600" />
          <MetricCard
            label={mode === "voltageDivider" ? "Total Resistance" : "Active Resistance"}
            value={formatResistance(mode === "voltageDivider" ? totalResistance : rheostatResistance).replace(" Ω", "").replace(" kΩ", "")}
            unit={mode === "voltageDivider" ? (totalResistance >= 1000 ? "kΩ" : "Ω") : (rheostatResistance >= 1000 ? "kΩ" : "Ω")}
            tone="text-yellow-600"
          />
          <MetricCard label="Current" value={formatCurrent(activeCurrent).replace(" A", "").replace(" mA", "")} unit={activeCurrent >= 1 ? "A" : "mA"} tone="text-green-600" />
          <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className={`mt-2 text-xl font-bold ${status.tone}`}>{status.label}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-600">Terminal 1 Voltage</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{formatNumber(terminal1Voltage, 2)}V</p>
            <p className="mt-1 text-xs text-slate-600">Usually connected to Ground / 0V</p>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-purple-600">Wiper Voltage</p>
            <p className="mt-2 text-2xl font-bold text-purple-700">{formatNumber(wiperVoltage, 2)}V</p>
            <p className="mt-1 text-xs text-slate-600">Changes with knob position</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-green-600">Terminal 3 Voltage</p>
            <p className="mt-2 text-2xl font-bold text-green-700">{formatNumber(terminal3Voltage, 2)}V</p>
            <p className="mt-1 text-xs text-slate-600">Connected to supply voltage</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-purple-600">R1 / Terminal 1 → Wiper</p>
            <p className="mt-2 text-2xl font-bold text-purple-700">{formatResistance(rLeft)}</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-600">R2 / Wiper → Terminal 3</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{formatResistance(rRight)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Logic</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {mode === "voltageDivider"
                ? "Wiper changes R1/R2 split; total resistance stays same."
                : "Wiper changes active resistance; current changes by I = V/R."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => setMode("voltageDivider")}
                className={`rounded-2xl border p-3 text-left transition ${mode === "voltageDivider" ? "border-purple-400 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 bg-white"}`}
              >
                <p className="font-semibold text-slate-900">Voltage Divider</p>
                <p className="text-xs text-slate-600">3-pin output voltage control</p>
              </button>
              <button
                onClick={() => setMode("rheostat")}
                className={`rounded-2xl border p-3 text-left transition ${mode === "rheostat" ? "border-purple-400 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 bg-white"}`}
              >
                <p className="font-semibold text-slate-900">Rheostat</p>
                <p className="text-xs text-slate-600">2-pin current control</p>
              </button>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {supplyVoltage}V</label>
              <input type="range" min="1" max="24" step="1" value={supplyVoltage} onChange={(event) => setSupplyVoltage(Number(event.target.value))} className="w-full accent-blue-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Total Resistance: {formatResistance(totalResistance)}</label>
              <select value={totalResistance} onChange={(event) => setTotalResistance(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {[1000, 2200, 4700, 10000, 22000, 47000, 100000].map((value) => (
                  <option key={value} value={value}>{formatResistance(value)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Wiper Position: {wiperPercent}%</label>
              <input type="range" min="1" max="99" step="1" value={wiperPercent} onChange={(event) => setWiperPercent(Number(event.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <PotentiometerVisual
              mode={mode}
              supplyVoltage={supplyVoltage}
              totalResistance={totalResistance}
              wiperPercent={wiperPercent}
              terminal1Voltage={terminal1Voltage}
              terminal3Voltage={terminal3Voltage}
              wiperVoltage={wiperVoltage}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is Potentiometer?</h2>
            <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-700">Definition</p>
              <p className="mt-1">পটেনশিওমিটার হলো তিন-terminal variable resistor, যার wiper সরিয়ে output voltage বা resistance পরিবর্তন করা যায়।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Live Calculation</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">Voltage Divider Mode</p>
                <p className="mt-1">Vout = Vin × Wiper%</p>
                <p className="font-bold text-slate-900">Wiper Voltage = {formatNumber(terminal1Voltage, 2)}V + ({supplyVoltage} × {formatNumber(ratio, 2)}) = {formatNumber(wiperVoltage, 2)}V</p>
                <p className="mt-1 text-xs text-slate-600">Note: divider current stays Vin / Rtotal = {formatCurrent(dividerCurrent)}</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
                <p className="font-semibold text-yellow-700">Rheostat Mode</p>
                <p className="mt-1">Ractive = R1 = {formatResistance(rheostatResistance)}</p>
                <p className="font-bold text-slate-900">I = {formatCurrent(rheostatCurrent)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Application</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Volume Control</p>
                <p className="mt-1">Audio signal level adjust করতে potentiometer ব্যবহৃত হয়।</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
                <p className="font-semibold text-orange-700">Calibration</p>
                <p className="mt-1">Sensor বা circuit tuning-এর জন্য wiper adjust করা হয়।</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Limitation</p>
                <p className="mt-1">Mechanical wear হতে পারে এবং high power load-এর জন্য সবসময় suitable নয়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
