"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type ViewMode = "assembled" | "exploded" | "cutaway" | "microscopic";
type FlowMode = "electron" | "conventional";
type MaterialKey = "carbon" | "metalFilm" | "wireWound";

type Material = {
  key: MaterialKey;
  name: string;
  bn: string;
  layerLabel: string;
  color: string;
  resistanceFactor: number;
  heatFactor: number;
  tempCoefficient: number;
  description: string;
  use: string;
  stability: string;
};

const materials: Material[] = [
  {
    key: "carbon",
    name: "Carbon Composition",
    bn: "কার্বন",
    layerLabel: "Carbon resistive core",
    color: "#334155",
    resistanceFactor: 1.2,
    heatFactor: 0.75,
    tempCoefficient: 0.0015,
    description: "Carbon material current flow-কে বাধা দেয় এবং resistance তৈরি করে।",
    use: "Low-cost general circuit",
    stability: "Noise বেশি, precision কম, heat-এ value slightly drift করতে পারে।",
  },
  {
    key: "metalFilm",
    name: "Metal Film",
    bn: "মেটাল ফিল্ম",
    layerLabel: "Thin metal film layer with spiral trim",
    color: "#2563eb",
    resistanceFactor: 0.85,
    heatFactor: 0.45,
    tempCoefficient: 0.00045,
    description: "Ceramic core-এর উপর thin metal film layer দিয়ে precise resistance তৈরি করা হয়।",
    use: "Precision electronics",
    stability: "Stable, low noise, accurate measurement circuit-এর জন্য ভালো।",
  },
  {
    key: "wireWound",
    name: "Wire Wound",
    bn: "ওয়্যার ওয়াউন্ড",
    layerLabel: "Wound resistance wire",
    color: "#f97316",
    resistanceFactor: 0.95,
    heatFactor: 0.9,
    tempCoefficient: 0.0009,
    description: "Resistance wire ceramic core-এর উপর coil আকারে wound করা থাকে।",
    use: "High-power circuit",
    stability: "Power handling বেশি, কিন্তু inductive effect থাকতে পারে।",
  },
];

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

function StructureVisual({
  mode,
  material,
  voltage,
  baseResistance,
  rotation,
  temperature,
  flowMode,
}: {
  mode: ViewMode;
  material: Material;
  voltage: number;
  baseResistance: number;
  rotation: number;
  temperature: number;
  flowMode: FlowMode;
}) {
  const temperatureFactor = 1 + (temperature - 25) * material.tempCoefficient;
  const resistance = baseResistance * material.resistanceFactor * temperatureFactor;
  const current = voltage / resistance;
  const power = voltage * current;
  const currentLevel = clamp(current / 0.08, 0.06, 1);
  const heatLevel = clamp((power * material.heatFactor) / 2 + temperature / 220, 0, 1);
  const particleCount = Math.min(Math.max(Math.round(currentLevel * 24), 5), 34);
  const electronSpeed = Math.max(0.5, 2.4 - currentLevel * 1.6);
  const explode = mode === "exploded";
  const cutaway = mode === "cutaway" || mode === "microscopic";
  const shellY = explode ? 72 : 118;
  const coreY = explode ? 160 : 140;
  const filmY = explode ? 232 : 140;
  const rotateScale = 1 + Math.abs(rotation) / 900;
  const failureRisk = heatLevel > 0.78;
  const flowPath = flowMode === "electron" ? "path('M750 170 H610 H550 H270 H210 H70')" : "path('M70 170 H210 H270 H550 H610 H750')";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Industrial-Grade Resistor Internal Structure</h2>
          <p className="text-xs text-slate-600">Atomic collision, spiral trim, temperature drift, heat stress এবং failure risk একসাথে দেখানো হয়েছে।</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${failureRisk ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
          {failureRisk ? "THERMAL STRESS" : mode.toUpperCase()}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 820 450" className="h-auto w-[820px] sm:w-full">
          <defs>
            <linearGradient id="bodyGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="50%" stopColor={heatLevel > 0.55 ? "#fb923c" : "#e9c27d"} />
              <stop offset="100%" stopColor={heatLevel > 0.82 ? "#ef4444" : "#c99755"} />
            </linearGradient>
            <filter id="structureGlow" x="-50%" y="-65%" width="200%" height="230%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 14} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="410" y="30" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {flowMode === "electron" ? "Electron flow: − → +" : "Conventional current: + → −"} | R = ρL/A | Heat comes from collisions
          </text>

          <line x1="70" y1="170" x2="210" y2="170" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
          <line x1="610" y1="170" x2="750" y2="170" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />

          <motion.g
            animate={{ rotate: rotation, scale: rotateScale }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            style={{ transformOrigin: "410px 170px" }}
          >
            <motion.rect
              x="210"
              y={shellY}
              width="400"
              height="104"
              rx="52"
              fill="url(#bodyGradient)"
              stroke="#111827"
              strokeWidth="4"
              filter="url(#structureGlow)"
              opacity={cutaway ? 0.35 : 1}
            />

            <motion.rect
              x="250"
              y={coreY}
              width="320"
              height="60"
              rx="30"
              fill="#f8fafc"
              stroke="#475569"
              strokeWidth="3"
              opacity={cutaway || explode ? 1 : 0.22}
            />

            <motion.rect
              x="270"
              y={filmY}
              width="280"
              height="36"
              rx="18"
              fill={material.color}
              opacity={cutaway || explode ? 0.72 : 0.25}
              stroke={material.color}
              strokeDasharray="6 6"
              strokeWidth="2"
            />

            {material.key === "metalFilm" && (
              <motion.path
                d={`M285 ${filmY + 18} H315 L335 ${filmY + 2} L355 ${filmY + 34} L375 ${filmY + 2} L395 ${filmY + 34} L415 ${filmY + 2} L435 ${filmY + 34} L455 ${filmY + 2} L475 ${filmY + 34} L505 ${filmY + 18}`}
                fill="none"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {material.key === "wireWound" && (
              <motion.path
                d={`M285 ${filmY + 18} C300 ${filmY - 18} 320 ${filmY + 54} 340 ${filmY + 18} C360 ${filmY - 18} 380 ${filmY + 54} 400 ${filmY + 18} C420 ${filmY - 18} 440 ${filmY + 54} 460 ${filmY + 18} C480 ${filmY - 18} 500 ${filmY + 54} 525 ${filmY + 18}`}
                fill="none"
                stroke={material.color}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.95"
              />
            )}

            {mode === "microscopic" && (
              <g>
                {Array.from({ length: 28 }).map((_, index) => {
                  const col = index % 7;
                  const row = Math.floor(index / 7);
                  const x = 295 + col * 35;
                  const y = 125 + row * 22;
                  return (
                    <motion.circle
                      key={`atom-${index}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#f8fafc"
                      stroke="#475569"
                      strokeWidth="2"
                      animate={{ x: heatLevel > 0.35 ? [0, 1.5, -1.5, 0] : 0, y: heatLevel > 0.35 ? [0, -1, 1, 0] : 0 }}
                      transition={{ repeat: Infinity, duration: 0.6 + index * 0.01 }}
                    />
                  );
                })}
              </g>
            )}

            {failureRisk && (
              <motion.g animate={{ opacity: [0.35, 1, 0.35] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <path d="M365 124 L382 150 L358 168 L388 196" stroke="#7f1d1d" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M455 124 L438 150 L462 168 L432 196" stroke="#7f1d1d" strokeWidth="4" fill="none" strokeLinecap="round" />
                <text x="410" y="225" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="900">⚠ overheating / crack risk</text>
              </motion.g>
            )}

            <rect x="260" y={shellY} width="16" height="104" fill="#ef4444" />
            <rect x="330" y={shellY} width="16" height="104" fill="#111827" />
            <rect x="445" y={shellY} width="16" height="104" fill="#f59e0b" />
            <rect x="540" y={shellY} width="16" height="104" fill="#d4af37" />

            <text x="410" y={filmY + 6} textAnchor="middle" fill={cutaway || explode ? "#111827" : "#78350f"} fontSize="12" fontWeight="800">
              {material.layerLabel}
            </text>
            <text x="410" y={filmY + 24} textAnchor="middle" fill="#475569" fontSize="10">
              collisions + path length create resistance
            </text>
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`structure-electron-${particleCount}-${index}-${flowMode}`}
              r={3.5 + currentLevel * 1.5}
              fill={flowMode === "electron" ? "#0ea5e9" : "#22c55e"}
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: flowPath }}
            />
          ))}

          {Array.from({ length: 12 }).map((_, index) => {
            const x = 285 + index * 24;
            const y = index % 2 === 0 ? 145 : 192;
            return (
              <motion.g key={`collision-${index}`} animate={{ opacity: heatLevel > 0.1 ? [0.2, 0.9, 0.2] : 0.12 }} transition={{ repeat: Infinity, duration: 1 + index * 0.05 }}>
                <circle cx={x} cy={y} r={4 + heatLevel * 5} fill="#f97316" opacity="0.5" />
                <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.5" />
                <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.5" />
              </motion.g>
            );
          })}

          <motion.g animate={{ opacity: heatLevel > 0.18 ? [0.15, 1, 0.15] : 0.08 }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M310 96 C294 72 324 64 310 42" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M410 96 C394 72 424 64 410 42" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M510 96 C494 72 524 64 510 42" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          <text x="132" y="143" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Terminal lead</text>
          <text x="680" y="143" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">{flowMode === "electron" ? "Electron flow ←" : "Current flow →"}</text>
          <text x="410" y="302" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="800">R = {formatResistance(resistance)} | I = {formatCurrent(current)} | T = {temperature}°C</text>

          <g transform="translate(110 340)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Current Density</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="10" rx="5" fill="#0ea5e9" animate={{ width: 150 * currentLevel }} />
          </g>
          <g transform="translate(300 340)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Collision / Resistance</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="10" rx="5" fill="#f59e0b" animate={{ width: 150 * clamp(resistance / 5000, 0, 1) }} />
          </g>
          <g transform="translate(520 340)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Thermal Stress</text>
            <rect x="0" y="12" width="150" height="10" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="12" height="10" rx="5" fill={failureRisk ? "#dc2626" : "#ef4444"} animate={{ width: 150 * heatLevel }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ComparisonPanel({ voltage, baseResistance, temperature }: { voltage: number; baseResistance: number; temperature: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Material Comparison Mode</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((material) => {
          const resistance = baseResistance * material.resistanceFactor * (1 + (temperature - 25) * material.tempCoefficient);
          const current = voltage / resistance;
          const heat = clamp((voltage * current * material.heatFactor) / 2 + temperature / 220, 0, 1);
          return (
            <div key={material.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-900">{material.bn}</p>
              <p className="mt-1 text-xs text-slate-500">{material.use}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>R = <b>{formatResistance(resistance)}</b></p>
                <p>I = <b>{formatCurrent(current)}</b></p>
                <div>
                  <p className="mb-1 text-xs font-semibold text-red-600">Heat stress</p>
                  <div className="h-2 rounded-full bg-slate-200">
                    <motion.div className="h-2 rounded-full bg-red-500" animate={{ width: `${heat * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResistorStructureSimulation() {
  const [mode, setMode] = useState<ViewMode>("cutaway");
  const [materialKey, setMaterialKey] = useState<MaterialKey>("metalFilm");
  const [voltage, setVoltage] = useState(9);
  const [baseResistance, setBaseResistance] = useState(1000);
  const [temperature, setTemperature] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [flowMode, setFlowMode] = useState<FlowMode>("electron");
  const [showComparison, setShowComparison] = useState(true);

  const material = materials.find((item) => item.key === materialKey) || materials[1];
  const resistance = baseResistance * material.resistanceFactor * (1 + (temperature - 25) * material.tempCoefficient);
  const current = voltage / resistance;
  const power = voltage * current;

  function resetSimulation() {
    setMode("cutaway");
    setMaterialKey("metalFilm");
    setVoltage(9);
    setBaseResistance(1000);
    setTemperature(25);
    setRotation(0);
    setFlowMode("electron");
    setShowComparison(true);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-700">Industrial-Grade Electronics Learning Engine</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">রেজিস্টরের গঠন — Advanced Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Atomic lattice, resistive layer, spiral trim, temperature drift, heat stress ও failure behavior একসাথে শেখার industrial-style simulator।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Resistance" value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "")} unit={resistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
          <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
          <MetricCard label="Temperature" value={formatNumber(temperature, 0)} unit="°C" tone="text-red-600" />
          <MetricCard label="Power / Heat" value={formatNumber(power, 3)} unit="W" tone="text-orange-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">Control Panel</h2>
              <button onClick={resetSimulation} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">Reset</button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2">
              {[
                { id: "assembled", label: "Assembled" },
                { id: "cutaway", label: "Cutaway" },
                { id: "exploded", label: "Exploded" },
                { id: "microscopic", label: "Atomic" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as ViewMode)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${mode === item.id ? "border-orange-400 bg-orange-50 text-orange-700 ring-2 ring-orange-200" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setFlowMode("electron")}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${flowMode === "electron" ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 bg-white text-slate-700"}`}
              >
                Electron Flow
              </button>
              <button
                onClick={() => setFlowMode("conventional")}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${flowMode === "conventional" ? "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-200" : "border-slate-200 bg-white text-slate-700"}`}
              >
                Current Flow
              </button>
            </div>

            <div className="mb-5 space-y-2">
              {materials.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setMaterialKey(item.key)}
                  className={`w-full rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${material.key === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"}`}
                >
                  <p className="font-semibold text-slate-900">{item.bn}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
              <input type="range" min="1" max="30" step="1" value={voltage} onChange={(event) => setVoltage(Number(event.target.value))} className="w-full accent-blue-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Base Resistance: {formatResistance(baseResistance)}</label>
              <input type="range" min="100" max="5000" step="100" value={baseResistance} onChange={(event) => setBaseResistance(Number(event.target.value))} className="w-full accent-yellow-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Temperature: {temperature}°C</label>
              <input type="range" min="0" max="150" step="5" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} className="w-full accent-red-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">3D-like Rotation: {rotation}°</label>
              <input type="range" min="-18" max="18" step="1" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="w-full accent-purple-500" />
            </div>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
            >
              {showComparison ? "Hide" : "Show"} Material Comparison
            </button>
          </div>

          <div className="lg:col-span-2">
            <StructureVisual mode={mode} material={material} voltage={voltage} baseResistance={baseResistance} rotation={rotation} temperature={temperature} flowMode={flowMode} />
          </div>
        </div>

        {showComparison && <ComparisonPanel voltage={voltage} baseResistance={baseResistance} temperature={temperature} />}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">রেজিস্টরের প্রধান অংশ</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
                <p className="font-semibold text-orange-700">Outer Coating</p>
                <p className="mt-1">Protective layer; heat, dust ও mechanical damage থেকে component রক্ষা করে।</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">Resistive Layer</p>
                <p className="mt-1">Electron collision তৈরি করে current limit করে। Metal film-এ spiral trim path length বাড়ায়।</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-800">Terminal Leads</p>
                <p className="mt-1">Circuit-এর সাথে resistor connect করে এবং current path complete করে।</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Material Behavior</h2>
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Selected: {material.bn}</p>
              <p className="mt-1">{material.description}</p>
              <p className="mt-3 font-semibold text-slate-900">Use: {material.use}</p>
              <p className="mt-1 text-xs text-slate-600">{material.stability}</p>
            </div>
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-slate-700 ring-1 ring-red-100">
              <p className="font-semibold text-red-700">Failure Insight</p>
              <p className="mt-1">Heat stress বেশি হলে resistive layer crack/open হতে পারে, ফলে circuit fail করে।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Formula Visualizer</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Resistance relation</p>
                <p className="mt-1 text-lg font-bold text-slate-900">R = ρL / A</p>
                <p className="mt-1">Length ↑ হলে R ↑, Area ↑ হলে R ↓, material ρ বেশি হলে R ↑।</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
                <p className="font-semibold text-yellow-700">Power heat</p>
                <p className="mt-1 text-lg font-bold text-slate-900">P = VI = I²R</p>
                <p className="mt-1">Power বেশি হলে body temperature ও failure risk বাড়ে।</p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
                <p className="font-semibold text-purple-700">Flow direction</p>
                <p className="mt-1">Electron flow − থেকে +; conventional current + থেকে −।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
