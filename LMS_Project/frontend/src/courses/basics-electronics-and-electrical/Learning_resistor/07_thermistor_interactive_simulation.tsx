"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type ThermistorMode = "ntc" | "ptc";

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

function calculateThermistorResistance(mode: ThermistorMode, nominalResistance: number, temperature: number) {
  const delta = temperature - 25;
  if (mode === "ntc") {
    return nominalResistance * Math.exp(-0.045 * delta);
  }
  return nominalResistance * Math.exp(0.028 * delta);
}

function ThermistorVisual({ mode, temperature, resistance, voltage }: { mode: ThermistorMode; temperature: number; resistance: number; voltage: number }) {
  const current = voltage / Math.max(resistance, 1);
  const tempLevel = clamp(temperature / 120, 0, 1);
  const flowLevel = clamp(current / 0.02, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 18), 4), 22);
  const speed = Math.max(0.55, 2.4 - flowLevel * 1.5);
  const glow = mode === "ntc" ? tempLevel : clamp(1 - flowLevel + tempLevel * 0.2, 0.1, 1);
  const fanSpeed = tempLevel;
  const fanStatus = temperature > 85 ? "High Speed Cooling" : temperature > 55 ? "Medium Speed Cooling" : "Low / Standby Cooling";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Thermistor Behavior Visualizer</h2>
          <p className="text-xs text-slate-600">Temperature পরিবর্তন করলে thermistor resistance ও current কেমন বদলায়।</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${mode === "ntc" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
          {mode.toUpperCase()} MODE
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 360" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="thermalGlow" x="-55%" y="-65%" width="220%" height="230%">
              <feGaussianBlur stdDeviation={4 + glow * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {mode === "ntc" ? "NTC: Temperature ↑ → Resistance ↓ → Current ↑" : "PTC: Temperature ↑ → Resistance ↑ → Current ↓"}
          </text>
          <text x="390" y="48" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
            Fan response follows temperature for cooling control
          </text>

          <rect x="42" y="114" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="150" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="176" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{voltage}V</text>

          <path d="M132 160 H218" stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d="M510 160 H655 V240 H87 V206" stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ scale: temperature > 85 ? [1, 1.03, 1] : 1 }} transition={{ repeat: Infinity, duration: 1 }}>
            <line x1="250" y1="160" x2="300" y2="160" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            <line x1="430" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

            <rect
              x="300"
              y="128"
              width="130"
              height="64"
              fill="#ffffff"
              stroke="#111827"
              strokeWidth="4"
              filter="url(#thermalGlow)"
            />

            <path
              d="M288 205 L438 105"
              stroke={mode === "ntc" ? "#2563eb" : "#f97316"}
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="M418 108 L438 108 L438 128"
              stroke={mode === "ntc" ? "#2563eb" : "#f97316"}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            <text
              x="392"
              y="108"
              fill={mode === "ntc" ? "#2563eb" : "#f97316"}
              fontSize="14"
              fontWeight="800"
            >
              {mode.toUpperCase()}
            </text>

            <text x="365" y="255" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="800">
              Real Thermistor Symbol
            </text>

            <text x="365" y="285" textAnchor="middle" fill="#64748b" fontSize="12">
              R = {formatResistance(resistance)}
            </text>
          </motion.g>

          <motion.g animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <path d="M315 92 C300 70 330 62 315 40" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M365 86 C350 64 380 56 365 34" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M415 92 C400 70 430 62 415 40" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`thermistor-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M87 206 V240 H655 V160 H510 H425 H305 H218 H132')" }}
            />
          ))}

          <g transform="translate(620 72)">
            <circle cx="45" cy="45" r="38" fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
            <motion.path
              d="M45 45 L45 15 M45 45 L75 45 M45 45 L25 72"
              stroke="#0891b2"
              strokeWidth="5"
              strokeLinecap="round"
              animate={{ rotate: fanSpeed * 720 }}
              transition={{ repeat: Infinity, duration: Math.max(0.35, 1.8 - fanSpeed), ease: "linear" }}
              style={{ transformOrigin: "45px 45px" }}
            />
            <text x="45" y="-20" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Fan response</text>
            <text x="45" y="-2" textAnchor="middle" fill="#64748b" fontSize="10">{fanStatus}</text>
          </g>

          <text x="180" y="135" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Electron flow</text>
          <text x="580" y="135" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Current output</text>

          <g transform="translate(145 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Temperature</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#ef4444" animate={{ width: 150 * tempLevel }} />
          </g>
          <g transform="translate(315 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Current Flow</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#0ea5e9" animate={{ width: 150 * flowLevel }} />
          </g>
          <g transform="translate(485 310)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Heat Stress</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#f97316" animate={{ width: 150 * glow }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ThermistorGraph({ mode, nominalResistance }: { mode: ThermistorMode; nominalResistance: number }) {
  const width = 430;
  const height = 245;
  const padding = 38;
  const values = Array.from({ length: 13 }, (_, index) => {
    const temperature = index * 10;
    return {
      temperature,
      resistance: calculateThermistorResistance(mode, nominalResistance, temperature),
    };
  });
  const maxR = Math.max(...values.map((item) => item.resistance));
  const minR = Math.min(...values.map((item) => item.resistance));
  const range = Math.max(maxR - minR, 1);
  const points = values
    .map((item) => {
      const x = padding + (item.temperature / 120) * (width - padding * 1.5);
      const y = height - padding - ((item.resistance - minR) / range) * (height - padding * 1.8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <h2 className="font-semibold text-slate-900">Temperature vs Resistance Graph</h2>
      <p className="text-xs text-slate-600">NTC এবং PTC thermistor-এর curve বিপরীত behavior দেখায়।</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 36;
            return <line key={line} x1={padding} y1={y} x2={width - 20} y2={y} stroke="#e2e8f0" />;
          })}
          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <motion.polyline points={points} fill="none" stroke={mode === "ntc" ? "#2563eb" : "#f97316"} strokeWidth="4" strokeLinecap="round" />
          <text x={width - 92} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">Temperature</text>
          <text x="4" y="18" fill="#334155" fontSize="12" fontWeight="600">R</text>
          <text x={padding + 4} y={height - 18} fill="#64748b" fontSize="10">0°C</text>
          <text x={width - 58} y={height - 18} fill="#64748b" fontSize="10">120°C</text>
        </svg>
      </div>
    </div>
  );
}

export default function ThermistorSimulation() {
  const [mode, setMode] = useState<ThermistorMode>("ntc");
  const [temperature, setTemperature] = useState(25);
  const [nominalResistance, setNominalResistance] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(() => {
    return calculateThermistorResistance(mode, nominalResistance, temperature);
  }, [mode, nominalResistance, temperature]);

  const current = voltage / Math.max(resistance, 1);
  const power = current * current * resistance;
  const status = temperature > 85 ? { label: "HIGH TEMP", tone: "text-red-600", bg: "bg-red-50 border-red-200" } : temperature > 55 ? { label: "WARM", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" } : { label: "NORMAL", tone: "text-green-600", bg: "bg-green-50 border-green-200" };

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-red-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-red-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">থার্মিস্টর — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Thermistor হলো temperature-sensitive resistor। Temperature পরিবর্তন করলে resistance কীভাবে পরিবর্তিত হয় তা live দেখুন।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Temperature" value={formatNumber(temperature, 0)} unit="°C" tone="text-red-600" />
          <MetricCard label="Resistance" value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "").replace(" MΩ", "")} unit={resistance >= 1000000 ? "MΩ" : resistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-600" />
          <MetricCard label="Current" value={formatCurrent(current).replace(" A", "").replace(" mA", "")} unit={current >= 1 ? "A" : "mA"} tone="text-green-600" />
          <div className={`rounded-2xl border p-4 shadow-sm ${status.bg}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className={`mt-2 text-2xl font-bold ${status.tone}`}>{status.label}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => setMode("ntc")}
                className={`rounded-2xl border p-3 text-left transition ${mode === "ntc" ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"}`}
              >
                <p className="font-semibold text-slate-900">NTC Thermistor</p>
                <p className="text-xs text-slate-600">Temp ↑ → Resistance ↓</p>
              </button>
              <button
                onClick={() => setMode("ptc")}
                className={`rounded-2xl border p-3 text-left transition ${mode === "ptc" ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200" : "border-slate-200 bg-white"}`}
              >
                <p className="font-semibold text-slate-900">PTC Thermistor</p>
                <p className="text-xs text-slate-600">Temp ↑ → Resistance ↑</p>
              </button>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Temperature: {temperature}°C</label>
              <input type="range" min="0" max="120" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} className="w-full accent-red-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Nominal Resistance @25°C: {formatResistance(nominalResistance)}</label>
              <select value={nominalResistance} onChange={(event) => setNominalResistance(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {[1000, 4700, 10000, 47000, 100000].map((value) => (
                  <option key={value} value={value}>{formatResistance(value)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {voltage}V</label>
              <input type="range" min="1" max="24" step="1" value={voltage} onChange={(event) => setVoltage(Number(event.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <ThermistorVisual mode={mode} temperature={temperature} resistance={resistance} voltage={voltage} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ThermistorGraph mode={mode} nominalResistance={nominalResistance} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is Thermistor?</h2>
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Definition</p>
              <p className="mt-1">থার্মিস্টর হলো এমন একটি resistor যার resistance temperature পরিবর্তনের সাথে পরিবর্তিত হয়।</p>
            </div>
            <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Main Idea</p>
              <p className="mt-1">NTC-তে temperature বাড়লে resistance কমে, PTC-তে temperature বাড়লে resistance বাড়ে।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Temperature Sensor</p>
                <p className="mt-1">Battery pack, thermostat, room temperature measurement, cooling fan control.</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
                <p className="font-semibold text-orange-700">Protection Circuit</p>
                <p className="mt-1">Over-temperature protection ও inrush current limiting.</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Limitation</p>
                <p className="mt-1">Thermistor response non-linear, তাই calibration দরকার হতে পারে।</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Selected Mode</p>
              <p className="mt-1 text-sm text-slate-700">{mode.toUpperCase()} thermistor</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Resistance</p>
              <p className="mt-1 text-sm text-slate-700">R = {formatResistance(resistance)}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Current</p>
              <p className="mt-1 text-sm text-slate-700">I = V / R = {voltage} / {formatResistance(resistance)} = {formatCurrent(current)}</p>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-4 ring-1 ring-cyan-100">
              <p className="font-semibold text-cyan-700">Fan Response Logic</p>
              <p className="mt-1 text-sm text-slate-700">Cooling fan speed follows temperature: low temp → slow fan, high temp → fast fan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
