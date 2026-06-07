"use client";

import { useMemo, useState } from "react";
import { motion } from "./motion";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 2) {
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

const resistorOptions = [100, 220, 330, 470, 680, 1000, 2200, 4700, 10000];

type ResistorItem = {
  id: number;
  value: number;
};

function SeriesCircuitVisual({ supplyVoltage, resistors }: { supplyVoltage: number; resistors: ResistorItem[] }) {
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
          <p className="text-xs text-slate-600">Series circuit-এ resistance যোগ হয় এবং সব resistor দিয়ে একই current flow করে।</p>
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
          <text x="87" y="164" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="190" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{supplyVoltage}V</text>
          <text x="87" y="240" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Supply</text>

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
                <text x={x + resistorWidth / 2} y="124" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">R{index + 1}</text>
                <text x={x + resistorWidth / 2} y="235" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">{formatResistance(item.value)}</text>
                <text x={x + resistorWidth / 2} y="257" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">{formatNumber(drop, 2)}V</text>
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

          <text x="190" y="150" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Same current</text>
          <text x="625" y="150" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Voltage shared</text>

          <g transform="translate(140 320)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Total Resistance Build-up</text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#f59e0b" animate={{ width: 540 * clamp(totalResistance / 20000, 0.06, 1) }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">Rtotal = {formatResistance(totalResistance)}</text>
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
          <p className="mt-1 text-lg font-bold text-slate-900">I = {supplyVoltage}V / {formatResistance(totalResistance)} = {formatCurrent(current)}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Voltage Drop Check</p>
          <p className="mt-1 text-sm text-slate-700">{voltageDrops.map((_, index) => `V${index + 1}`).join(" + ")} = Vs</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatNumber(sumDrop, 2)}V ≈ {supplyVoltage}V</p>
        </div>
      </div>
    </div>
  );
}

function DropBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="font-bold text-slate-700">{formatNumber(value, 2)}V</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div className="h-3 rounded-full" style={{ backgroundColor: color }} animate={{ width: `${clamp((value / total) * 100, 0, 100)}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{formatNumber((value / total) * 100, 1)}% of supply</p>
    </div>
  );
}

export default function SeriesResistorSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [resistors, setResistors] = useState<ResistorItem[]>([
    { id: 1, value: 1000 },
    { id: 2, value: 2200 },
  ]);

  const totalResistance = useMemo(() => resistors.reduce((sum, item) => sum + item.value, 0), [resistors]);
  const current = supplyVoltage / totalResistance;
  const voltageDrops = resistors.map((item) => current * item.value);
  const totalPower = supplyVoltage * current;

  function updateResistor(id: number, value: number) {
    setResistors((items) => items.map((item) => (item.id === id ? { ...item, value } : item)));
  }

  function addResistor() {
    if (resistors.length >= 5) return;
    setResistors((items) => [...items, { id: Date.now(), value: 1000 }]);
  }

  function removeResistor(id: number) {
    if (resistors.length <= 1) return;
    setResistors((items) => items.filter((item) => item.id !== id));
  }

  function resetCircuit() {
    setSupplyVoltage(12);
    setResistors([
      { id: 1, value: 1000 },
      { id: 2, value: 2200 },
    ]);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">সিরিজ সার্কিটে রেজিস্টর — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Series circuit-এ resistor গুলো একটার পর একটা যুক্ত হয়। Total resistance যোগ হয়, current একই থাকে এবং voltage ভাগ হয়।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Total Resistance" value={formatResistance(totalResistance).replace(" Ω", "").replace(" kΩ", "")} unit={totalResistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
          <MetricCard label="Same Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
          <MetricCard label="Supply Voltage" value={formatNumber(supplyVoltage, 1)} unit="V" tone="text-blue-600" />
          <MetricCard label="Total Power" value={formatNumber(totalPower, 3)} unit="W" tone="text-orange-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">Control Panel</h2>
              <button onClick={resetCircuit} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">Reset</button>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {supplyVoltage}V</label>
              <input type="range" min="1" max="30" step="1" value={supplyVoltage} onChange={(event) => setSupplyVoltage(Number(event.target.value))} className="w-full accent-blue-500" />
            </div>

            <div className="space-y-4">
              {resistors.map((resistor, index) => (
                <div key={resistor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="text-sm font-semibold text-slate-800">R{index + 1}: {formatResistance(resistor.value)}</label>
                    <button
                      onClick={() => removeResistor(resistor.id)}
                      disabled={resistors.length <= 1}
                      className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                  <select value={resistor.value} onChange={(event) => updateResistor(resistor.id, Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                    {resistorOptions.map((value) => (
                      <option key={value} value={value}>{formatResistance(value)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={addResistor}
              disabled={resistors.length >= 5}
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add Resistor
            </button>
          </div>

          <div className="lg:col-span-2">
            <SeriesCircuitVisual supplyVoltage={supplyVoltage} resistors={resistors} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Voltage Distribution</h2>
            <div className="space-y-4">
              {voltageDrops.map((drop, index) => (
                <DropBar
                  key={resistors[index].id}
                  label={`R${index + 1} Voltage Drop`}
                  value={drop}
                  total={supplyVoltage}
                  color={["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ef4444"][index] || "#64748b"}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is Series Resistor Circuit?</h2>
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Definition</p>
              <p className="mt-1">যখন resistor গুলো একটার পর একটা একই current path-এ যুক্ত থাকে, তাকে series resistor circuit বলে।</p>
            </div>
            <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Main Rule</p>
              <p className="mt-1">Series circuit-এ total resistance = সব resistor-এর যোগফল।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">Adding resistor increases Rtotal</p>
                <p className="mt-1">Series circuit-এ resistor যোগ করলে total resistance বাড়ে, তাই current কমে।</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Current is same</p>
                <p className="mt-1">একই path হওয়ায় সব resistor দিয়ে একই current flow করে।</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Open circuit effect</p>
                <p className="mt-1">Series circuit-এর কোনো একটি resistor/connection open হলে পুরো circuit current বন্ধ হয়ে যায়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
