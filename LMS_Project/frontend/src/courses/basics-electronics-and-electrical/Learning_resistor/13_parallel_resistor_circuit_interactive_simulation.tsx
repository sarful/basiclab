"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

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

type BranchItem = {
  id: number;
  value: number;
};

function equivalentParallel(resistors: BranchItem[]) {
  const reciprocalSum = resistors.reduce((sum, item) => sum + 1 / item.value, 0);
  return 1 / reciprocalSum;
}

function BranchBar({ label, current, totalCurrent, color }: { label: string; current: number; totalCurrent: number; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="font-bold text-slate-700">{formatCurrent(current)}</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div className="h-3 rounded-full" style={{ backgroundColor: color }} animate={{ width: `${clamp((current / totalCurrent) * 100, 0, 100)}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{formatNumber((current / totalCurrent) * 100, 1)}% of total current</p>
    </div>
  );
}

function ParallelCircuitVisual({ supplyVoltage, branches }: { supplyVoltage: number; branches: BranchItem[] }) {
  const eqResistance = equivalentParallel(branches);
  const branchCurrents = branches.map((item) => supplyVoltage / item.value);
  const totalCurrent = branchCurrents.reduce((sum, value) => sum + value, 0);
  const flowLevel = clamp(totalCurrent / 0.08, 0.08, 1);
  const mainWireWidth = 5 + flowLevel * 6;
  const branchYs = branches.map((_, index) => 110 + index * 74);
  const topY = branchYs[0];
  const bottomY = branchYs[branchYs.length - 1];
  const electronSpeed = Math.max(0.55, 2.4 - flowLevel * 1.5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Parallel Resistor Circuit Visualizer</h2>
          <p className="text-xs text-slate-600">Parallel circuit-এ voltage একই থাকে। Conventional current left→right, electron flow right→left দেখানো হয়েছে।</p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">PARALLEL CONNECTION</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="parallelGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + flowLevel * 7} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="420" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Same voltage across each branch | Conventional current: left → right | Electron flow: right → left
          </text>

          <rect x="42" y="160" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="196" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="222" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{supplyVoltage}V</text>
          <text x="87" y="272" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Supply</text>

          {/* Positive supply bus */}
          <path d={`M132 186 H190`} stroke="#64748b" strokeWidth={mainWireWidth} fill="none" strokeLinecap="round" />
          <path d={`M190 ${topY} V${bottomY}`} stroke="#64748b" strokeWidth={mainWireWidth} fill="none" strokeLinecap="square" strokeLinejoin="round" />

          {/* Negative return bus */}
          <path d={`M650 ${topY} V${bottomY}`} stroke="#64748b" strokeWidth={mainWireWidth} fill="none" strokeLinecap="square" strokeLinejoin="round" />
          <path d={`M650 ${bottomY + 40} H650 V340 H87 V252`} stroke="#64748b" strokeWidth={mainWireWidth} fill="none" strokeLinecap="square" strokeLinejoin="round" />

          {/* Bottom return connection from branches */}
          {branches.map((_, index) => {
            const y = branchYs[index];
            return (
              <path
                key={`return-${index}`}
                d={`M650 ${y} V${bottomY + 40}`}
                stroke="#64748b"
                strokeWidth={mainWireWidth - 1}
                fill="none"
                strokeLinecap="square"
              />
            );
          })}

          {branches.map((branch, index) => {
            const y = branchYs[index];
            const current = branchCurrents[index];
            const branchFlow = clamp(current / Math.max(totalCurrent, 0.000001), 0.12, 1);
            const wireWidth = 4 + branchFlow * 7;
            const electronCount = Math.min(Math.max(Math.round(branchFlow * 16), 4), 18);
            return (
              <g key={branch.id}>
                <path d={`M190 ${y} H300`} stroke="#64748b" strokeWidth={wireWidth} strokeLinecap="square" strokeLinejoin="round" />
                <path d={`M490 ${y} H650`} stroke="#64748b" strokeWidth={wireWidth} strokeLinecap="square" strokeLinejoin="round" />
                <motion.rect
                  x="300"
                  y={y - 26}
                  width="190"
                  height="52"
                  rx="30"
                  fill={branchFlow > 0.45 ? "#fb923c" : "#f2c879"}
                  stroke="#111827"
                  strokeWidth="3"
                  filter="url(#parallelGlow)"
                  animate={{ opacity: [0.94, 1, 0.94] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <rect x="330" y={y - 26} width="10" height="52" fill="#ef4444" />
                <rect x="378" y={y - 26} width="10" height="52" fill="#111827" />
                <rect x="426" y={y - 26} width="10" height="52" fill="#f59e0b" />
                <rect x="468" y={y - 26} width="10" height="52" fill="#d4af37" />
                <text x="400" y={y - 42} textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">R{index + 1}</text>
                <text x="395" y={y + 42} textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">{formatResistance(branch.value)}</text>
                <text x="585" y={y - 10} textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="900">I{index + 1} = {formatCurrent(current)}</text>
                <text x="250" y={y - 10} textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="900">V = {supplyVoltage}V</text>

                {Array.from({ length: electronCount }).map((_, eIndex) => (
                  <motion.circle
                    key={`parallel-electron-${branch.id}-${eIndex}`}
                    r="4"
                    fill="#0ea5e9"
                    stroke="#e0f2fe"
                    strokeWidth="1.5"
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: eIndex * (electronSpeed / electronCount) }}
                    style={{ offsetPath: `path('M650 ${y} H490 H300 H190')` }}
                  />
                ))}
              </g>
            );
          })}

          <text x="195" y="78" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Conventional current splits →</text>
          <text x="650" y="78" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">← Electron flow starts</text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Equivalent Resistance</text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="12" rx="6" fill="#8b5cf6" animate={{ width: 540 * clamp(eqResistance / 10000, 0.04, 1) }} />
            <text x="540" y="42" textAnchor="end" fill="#64748b" fontSize="11">Req = {formatResistance(eqResistance)}</text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">Equivalent Resistance</p>
          <p className="mt-1 text-sm text-slate-700">1/Req = {branches.map((_, index) => `1/R${index + 1}`).join(" + ")}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Req = {formatResistance(eqResistance)}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Same Voltage</p>
          <p className="mt-1 text-sm text-slate-700">V1 = V2 = V3 = Vs</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Each branch = {supplyVoltage}V</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Total Current</p>
          <p className="mt-1 text-sm text-slate-700">Itotal = {branchCurrents.map((_, index) => `I${index + 1}`).join(" + ")}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Itotal = {formatCurrent(totalCurrent)}</p>
        </div>
      </div>
    </div>
  );
}

export default function ParallelResistorSimulation() {
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [branches, setBranches] = useState<BranchItem[]>([
    { id: 1, value: 1000 },
    { id: 2, value: 2200 },
  ]);

  const eqResistance = useMemo(() => equivalentParallel(branches), [branches]);
  const branchCurrents = branches.map((item) => supplyVoltage / item.value);
  const totalCurrent = branchCurrents.reduce((sum, value) => sum + value, 0);
  const totalPower = supplyVoltage * totalCurrent;

  function updateBranch(id: number, value: number) {
    setBranches((items) => items.map((item) => (item.id === id ? { ...item, value } : item)));
  }

  function addBranch() {
    if (branches.length >= 5) return;
    setBranches((items) => [...items, { id: Date.now(), value: 1000 }]);
  }

  function removeBranch(id: number) {
    if (branches.length <= 1) return;
    setBranches((items) => items.filter((item) => item.id !== id));
  }

  function resetCircuit() {
    setSupplyVoltage(12);
    setBranches([
      { id: 1, value: 1000 },
      { id: 2, value: 2200 },
    ]);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">প্যারালাল সার্কিটে রেজিস্টর — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Parallel circuit-এ resistor গুলো আলাদা branch-এ যুক্ত থাকে। Voltage একই থাকে, current ভাগ হয় এবং equivalent resistance কমে যায়।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Equivalent Resistance" value={formatResistance(eqResistance).replace(" Ω", "").replace(" kΩ", "")} unit={eqResistance >= 1000 ? "kΩ" : "Ω"} tone="text-purple-600" />
          <MetricCard label="Total Current" value={formatCurrent(totalCurrent).replace(" A", "").replace(" mA", "")} unit={totalCurrent >= 1 ? "A" : "mA"} tone="text-green-600" />
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
              <input type="range" min="1" max="30" step="1" value={supplyVoltage} onChange={(event) => setSupplyVoltage(Number(event.target.value))} className="w-full accent-purple-500" />
            </div>

            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div key={branch.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="text-sm font-semibold text-slate-800">Branch R{index + 1}: {formatResistance(branch.value)}</label>
                    <button
                      onClick={() => removeBranch(branch.id)}
                      disabled={branches.length <= 1}
                      className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                  <select value={branch.value} onChange={(event) => updateBranch(branch.id, Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                    {resistorOptions.map((value) => (
                      <option key={value} value={value}>{formatResistance(value)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={addBranch}
              disabled={branches.length >= 5}
              className="mt-5 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add Branch
            </button>
          </div>

          <div className="lg:col-span-2">
            <ParallelCircuitVisual supplyVoltage={supplyVoltage} branches={branches} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Branch Current Distribution</h2>
            <div className="space-y-4">
              {branchCurrents.map((current, index) => (
                <BranchBar
                  key={branches[index].id}
                  label={`Branch ${index + 1} Current`}
                  current={current}
                  totalCurrent={totalCurrent}
                  color={["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ef4444"][index] || "#64748b"}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is Parallel Resistor Circuit?</h2>
            <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-700">Definition</p>
              <p className="mt-1">যখন resistor গুলো আলাদা আলাদা current path বা branch-এ supply-এর একই দুই point-এর মধ্যে যুক্ত থাকে, তাকে parallel resistor circuit বলে।</p>
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Main Rule</p>
              <p className="mt-1">Parallel circuit-এ প্রতিটি resistor-এর voltage একই, কিন্তু current resistance অনুযায়ী ভাগ হয়।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
                <p className="font-semibold text-purple-700">Adding branch reduces Req</p>
                <p className="mt-1">Parallel circuit-এ নতুন resistor branch যোগ করলে equivalent resistance কমে যায়।</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Lower resistance gets more current</p>
                <p className="mt-1">যে branch-এর resistance কম, সেই branch দিয়ে বেশি current flow করে।</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Open branch effect</p>
                <p className="mt-1">Parallel circuit-এর একটি branch open হলেও অন্য branch-গুলোতে current flow চলতে পারে।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
