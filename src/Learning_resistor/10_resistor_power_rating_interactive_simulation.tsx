"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type ResistorPackage = {
  watt: number;
  label: string;
  size: number;
  bodyWidth: number;
  bodyHeight: number;
};

const packages: ResistorPackage[] = [
  { watt: 0.125, label: "1/8W", size: 35, bodyWidth: 220, bodyHeight: 54 },
  { watt: 0.25, label: "1/4W", size: 45, bodyWidth: 260, bodyHeight: 66 },
  { watt: 0.5, label: "1/2W", size: 58, bodyWidth: 310, bodyHeight: 78 },
  { watt: 1, label: "1W", size: 70, bodyWidth: 350, bodyHeight: 88 },
  { watt: 2, label: "2W", size: 86, bodyWidth: 390, bodyHeight: 102 },
  { watt: 5, label: "5W", size: 108, bodyWidth: 440, bodyHeight: 118 },
];

const resistorValues = [47, 100, 220, 330, 470, 1000, 2200, 4700, 10000];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

function formatResistance(value: number) {
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

function getStatus(power: number, rating: number) {
  const ratio = power / rating;
  if (ratio >= 1) return { label: "OVERLOAD", tone: "text-red-600", bg: "bg-red-50 border-red-200", message: "Power rating exceeded — resistor may burn." };
  if (ratio >= 0.75) return { label: "HOT / CAUTION", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200", message: "Close to limit — choose higher wattage for safety." };
  if (ratio >= 0.5) return { label: "WARM", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", message: "Working, but heat is noticeable." };
  return { label: "SAFE", tone: "text-green-600", bg: "bg-green-50 border-green-200", message: "Good safety margin." };
}

function recommendedPackage(power: number) {
  const safeTarget = power * 2;
  return packages.find((item) => item.watt >= safeTarget) || packages[packages.length - 1];
}

function PowerVisual({ voltage, resistance, rating, selectedPackage }: { voltage: number; resistance: number; rating: number; selectedPackage: ResistorPackage }) {
  const current = voltage / resistance;
  const power = current * current * resistance;
  const loadRatio = power / rating;
  const heatLevel = clamp(loadRatio, 0, 1);
  const flowLevel = clamp(current / 0.15, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 20), 4), 24);
  const electronSpeed = Math.max(0.5, 2.4 - flowLevel * 1.5);
  const status = getStatus(power, rating);
  const isOverload = loadRatio >= 1;
  const bodyX = 380 - selectedPackage.bodyWidth / 2;
  const bodyY = 158 - selectedPackage.bodyHeight / 2;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Power Rating Heat Visualizer</h2>
          <p className="text-xs text-slate-600">Actual power rating-এর বেশি হলে resistor অতিরিক্ত heat তৈরি করে।</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.bg} ${status.tone}`}>{status.label}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <defs>
            <linearGradient id="hotBody" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="50%" stopColor={heatLevel > 0.55 ? "#fb923c" : "#e9c27d"} />
              <stop offset="100%" stopColor={heatLevel > 0.9 ? "#ef4444" : "#c99755"} />
            </linearGradient>
            <filter id="powerHeatGlow" x="-50%" y="-65%" width="200%" height="230%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 16} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            P = V × I = I²R = V²/R
          </text>

          <rect x="42" y="116" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="152" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="178" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{voltage}V</text>

          <path d={`M132 162 H${bodyX}`} stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d={`M${bodyX + selectedPackage.bodyWidth} 162 H656 V248 H87 V208`} stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ x: isOverload ? [0, 2, -2, 0] : 0 }} transition={{ repeat: Infinity, duration: 0.18 }}>
            <rect
              x={bodyX}
              y={bodyY}
              width={selectedPackage.bodyWidth}
              height={selectedPackage.bodyHeight}
              rx={selectedPackage.bodyHeight / 2}
              fill="url(#hotBody)"
              stroke="#111827"
              strokeWidth="4"
              filter="url(#powerHeatGlow)"
            />
            <rect x={bodyX + 45} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#ef4444" />
            <rect x={bodyX + 105} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#111827" />
            <rect x={bodyX + 165} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#f59e0b" />
            <rect x={bodyX + selectedPackage.bodyWidth - 62} y={bodyY} width="16" height={selectedPackage.bodyHeight} fill="#d4af37" />
            <text x="390" y="166" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="800">
              {selectedPackage.label} Resistor
            </text>
          </motion.g>

          <motion.g animate={{ opacity: heatLevel > 0.18 ? [0.15, 1, 0.15] : 0.06 }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M300 92 C286 70 314 62 300 40" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M390 86 C376 64 404 56 390 34" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M480 92 C466 70 494 62 480 40" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          {isOverload && (
            <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <rect x="250" y="250" width="280" height="62" rx="16" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
              <text x="390" y="274" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="800">
                Power rating exceeded — resistor may burn.
              </text>
              <text x="390" y="296" textAnchor="middle" fill="#7f1d1d" fontSize="12" fontWeight="700">
                Recommended: {recommendedPackage(power).label} or higher
              </text>
            </motion.g>
          )}

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`power-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: `path('M87 208 V248 H656 V162 H${bodyX + selectedPackage.bodyWidth} H${bodyX} H132')` }}
            />
          ))}

          <text x="185" y="136" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Current flow</text>
          <text x="590" y="136" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Heat output</text>

          <g transform="translate(140 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Power Load</text>
            <rect x="0" y="10" width="500" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect
              x="0"
              y="10"
              height="12"
              rx="6"
              fill={isOverload ? "#ef4444" : heatLevel > 0.75 ? "#f97316" : "#22c55e"}
              animate={{ width: 500 * clamp(loadRatio, 0, 1) }}
            />
            <text x="500" y="38" textAnchor="end" fill="#64748b" fontSize="11">
              {formatNumber(loadRatio * 100, 1)}% of rating
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function PowerRatingSimulation() {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(220);
  const [rating, setRating] = useState(0.25);

  const selectedPackage = packages.find((item) => item.watt === rating) || packages[1];
  const current = voltage / resistance;
  const power = voltage * current;
  const powerByI2R = current * current * resistance;
  const powerByV2R = (voltage * voltage) / resistance;
  const status = getStatus(power, rating);
  const recommended = recommendedPackage(power);
  const safetyMargin = rating / Math.max(power, 0.000001);

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-red-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">পাওয়ার রেটিং — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Resistor কত watt power safely dissipate করতে পারে, সেটাই power rating। Rating কম হলে resistor গরম হয়ে burn করতে পারে।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Actual Power" value={formatNumber(power, 3)} unit="W" tone={power > rating ? "text-red-600" : "text-orange-600"} />
          <MetricCard label="Power Rating" value={formatNumber(rating, 3)} unit="W" tone="text-blue-600" />
          <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
          <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className={`mt-2 text-xl font-bold ${status.tone}`}>{status.label}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {voltage}V</label>
              <input type="range" min="1" max="30" step="1" value={voltage} onChange={(event) => setVoltage(Number(event.target.value))} className="w-full accent-orange-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Resistance: {formatResistance(resistance)}</label>
              <select value={resistance} onChange={(event) => setResistance(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {resistorValues.map((value) => (
                  <option key={value} value={value}>{formatResistance(value)}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Selected Power Rating: {selectedPackage.label}</label>
              <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {packages.map((item) => (
                  <option key={item.watt} value={item.watt}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className={`rounded-2xl border p-4 text-sm ${status.bg}`}>
              <p className={`font-bold ${status.tone}`}>{status.message}</p>
              <p className="mt-2 text-slate-700">Recommended: <b>{recommended.label}</b> or higher</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <PowerVisual voltage={voltage} resistance={resistance} rating={rating} selectedPackage={selectedPackage} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is Power Rating?</h2>
            <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-700 ring-1 ring-orange-100">
              <p className="font-semibold text-orange-700">Definition</p>
              <p className="mt-1">Power rating হলো resistor কত watt power heat আকারে safely dissipate করতে পারে তার limit।</p>
            </div>
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
              <p className="font-semibold text-red-700">Common Mistake</p>
              <p className="mt-1">Resistance value ঠিক হলেও power rating কম হলে resistor burn হতে পারে।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">P = V × I</p>
                <p className="mt-1">P = {voltage} × {formatCurrent(current)} = {formatNumber(power, 3)}W</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">P = I²R</p>
                <p className="mt-1">P = {formatNumber(current, 4)}² × {formatResistance(resistance)} = {formatNumber(powerByI2R, 3)}W</p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
                <p className="font-semibold text-purple-700">P = V²/R</p>
                <p className="mt-1">P = {voltage}² / {formatResistance(resistance)} = {formatNumber(powerByV2R, 3)}W</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Selection Guide</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Safe Rule</p>
                <p className="mt-1">Use at least 2× actual power rating.</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
                <p className="font-semibold text-yellow-700">Safety Margin</p>
                <p className="mt-1">Selected rating is {formatNumber(safetyMargin, 2)}× actual power.</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">Recommended Wattage</p>
                <p className="mt-1">Choose <b>{recommended.label}</b> or higher.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Power Rating Comparison</h2>
          <div className="grid gap-4 md:grid-cols-6">
            {packages.map((item) => {
              const safe = item.watt >= power * 2;
              const overloaded = item.watt < power;
              return (
                <button
                  key={item.watt}
                  onClick={() => setRating(item.watt)}
                  className={`rounded-2xl border p-4 text-center transition hover:-translate-y-0.5 ${rating === item.watt ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : overloaded ? "border-red-200 bg-red-50" : safe ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}
                >
                  <div className="mx-auto rounded-full bg-amber-200 ring-2 ring-amber-600" style={{ width: item.size, height: item.size / 2 }} />
                  <p className="mt-3 font-bold text-slate-900">{item.label}</p>
                  <p className={`mt-1 text-xs font-semibold ${overloaded ? "text-red-600" : safe ? "text-green-600" : "text-yellow-700"}`}>
                    {overloaded ? "Burn risk" : safe ? "Recommended" : "Caution"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
