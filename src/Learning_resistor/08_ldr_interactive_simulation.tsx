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

function calculateLdrResistance(lightPercent: number, darkResistance: number) {
  const light = clamp(lightPercent, 0, 100);
  const minResistance = 500;
  const normalized = light / 100;
  return minResistance + darkResistance * Math.pow(1 - normalized, 2.6);
}

function LdrVisual({
  lightPercent,
  resistance,
  voltage,
  fixedResistor,
}: {
  lightPercent: number;
  resistance: number;
  voltage: number;
  fixedResistor: number;
}) {
  const current = voltage / Math.max(resistance + fixedResistor, 1);
  const outputVoltage = voltage * (resistance / (fixedResistor + resistance));
  const lightLevel = clamp(lightPercent / 100, 0, 1);
  const flowLevel = clamp(current / 0.01, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 18), 4), 22);
  const speed = Math.max(0.55, 2.4 - flowLevel * 1.5);
  const ledBrightness = clamp(outputVoltage / Math.max(voltage, 1), 0, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">LDR Behavior Visualizer</h2>
          <p className="text-xs text-slate-600">Light intensity পরিবর্তন করলে LDR resistance, current ও LDR-side output voltage কেমন বদলায়।</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${lightPercent > 60 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
          {lightPercent > 60 ? "BRIGHT LIGHT" : lightPercent > 25 ? "MEDIUM LIGHT" : "DARK"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 370" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="lampGlow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation={6 + ledBrightness * 18} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ldrFace" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="55%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            LDR: Light ↑ → Resistance ↓ | Light ↓ → Resistance ↑
          </text>

          <rect x="42" y="122" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="158" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">DC</text>
          <text x="87" y="184" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">{voltage}V</text>

          <path d="M132 168 H286" stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d="M444 168 H656 V248 H87 V214" stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ scale: lightPercent > 80 ? [1, 1.03, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <circle cx="365" cy="168" r="39" fill="#fde68a" stroke="#111827" strokeWidth="5" />
            <circle cx="365" cy="168" r="34" fill="url(#ldrFace)" stroke="#a16207" strokeWidth="4" />

            <path d="M338 154 C346 145 384 145 392 154" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M334 168 C348 155 382 181 396 168" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M340 182 C350 191 380 191 390 182" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />

            <path d="M326 126 L345 148" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <polygon points="345,148 337,145 341,153" fill="#eab308" />

            <path d="M404 126 L385 148" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <polygon points="385,148 389,153 395,145" fill="#eab308" />

            <line x1="286" y1="168" x2="330" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
            <line x1="400" y1="168" x2="444" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />

            <motion.circle
              cx="365"
              cy="168"
              r={22 + lightLevel * 5}
              fill="rgba(250,204,21,0.12)"
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />

            <text x="365" y="225" textAnchor="middle" fill="#64748b" fontSize="12">R = {formatResistance(resistance)}</text>
          </motion.g>

          <motion.g animate={{ opacity: lightLevel > 0.15 ? [0.25, 1, 0.25] : 0.12 }} transition={{ repeat: Infinity, duration: 1 }}>
            <line x1="275" y1="72" x2="325" y2="116" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
            <line x1="365" y1="58" x2="365" y2="100" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
            <line x1="455" y1="72" x2="405" y2="116" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`ldr-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M87 214 V248 H656 V168 H444 H400 H330 H286 H132')" }}
            />
          ))}

          <g transform="translate(622 85)">
            <circle cx="45" cy="45" r="38" fill={`rgba(250,204,21,${0.15 + ledBrightness * 0.85})`} stroke="#ca8a04" strokeWidth={4 + ledBrightness * 4} filter="url(#lampGlow)" />
            <path d="M30 45 H60 M36 30 L54 60 M54 30 L36 60" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
            <text x="45" y="100" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">Street Light</text>
            <text x="45" y="118" textAnchor="middle" fill="#64748b" fontSize="10">{ledBrightness > 0.65 ? "ON" : ledBrightness > 0.25 ? "DIM" : "OFF"}</text>
          </g>

          <text x="180" y="143" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Current flow</text>
          <text x="580" y="143" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Vout across LDR</text>

          <g transform="translate(130 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Light Intensity</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#eab308" animate={{ width: 150 * lightLevel }} />
          </g>
          <g transform="translate(315 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Resistance Drop</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#22c55e" animate={{ width: 150 * (1 - clamp(resistance / 100000, 0, 1)) }} />
          </g>
          <g transform="translate(500 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Output Voltage</text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#8b5cf6" animate={{ width: 150 * clamp(outputVoltage / Math.max(voltage, 1), 0, 1) }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LdrGraph({ darkResistance, lightPercent }: { darkResistance: number; lightPercent: number }) {
  const width = 430;
  const height = 245;
  const padding = 38;
  const values = Array.from({ length: 11 }, (_, index) => {
    const light = index * 10;
    return {
      light,
      resistance: calculateLdrResistance(light, darkResistance),
    };
  });
  const maxR = Math.max(...values.map((item) => item.resistance));
  const minR = Math.min(...values.map((item) => item.resistance));
  const range = Math.max(maxR - minR, 1);
  const points = values
    .map((item) => {
      const x = padding + (item.light / 100) * (width - padding * 1.5);
      const y = height - padding - ((item.resistance - minR) / range) * (height - padding * 1.8);
      return `${x},${y}`;
    })
    .join(" ");

  const liveLight = clamp(lightPercent, 0, 100);
  const liveResistance = calculateLdrResistance(liveLight, darkResistance);
  const liveX = padding + (liveLight / 100) * (width - padding * 1.5);
  const liveY = height - padding - ((liveResistance - minR) / range) * (height - padding * 1.8);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <h2 className="font-semibold text-slate-900">Light vs Resistance Graph</h2>
      <p className="text-xs text-slate-600">Light বাড়লে LDR resistance দ্রুত কমে যায়।</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 36;
            return <line key={line} x1={padding} y1={y} x2={width - 20} y2={y} stroke="#e2e8f0" />;
          })}
          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <motion.polyline
            points={points}
            fill="none"
            stroke="#eab308"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.circle
            cx={liveX}
            cy={liveY}
            r="7"
            fill="#facc15"
            stroke="#111827"
            strokeWidth="2"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
          <text x={Math.min(liveX + 10, width - 130)} y={Math.max(liveY - 14, 28)} fill="#334155" fontSize="11" fontWeight="700">
            {liveLight}% light, {formatResistance(liveResistance)}
          </text>
          <text x={width - 76} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">Light</text>
          <text x="4" y="18" fill="#334155" fontSize="12" fontWeight="600">R</text>
          <text x={padding + 4} y={height - 18} fill="#64748b" fontSize="10">Dark</text>
          <text x={width - 64} y={height - 18} fill="#64748b" fontSize="10">Bright</text>
        </svg>
      </div>
    </div>
  );
}

export default function LdrSimulation() {
  const [lightPercent, setLightPercent] = useState(35);
  const [darkResistance, setDarkResistance] = useState(100000);
  const [fixedResistor, setFixedResistor] = useState(10000);
  const [voltage, setVoltage] = useState(5);

  const resistance = useMemo(() => {
    return calculateLdrResistance(lightPercent, darkResistance);
  }, [lightPercent, darkResistance]);

  const current = voltage / Math.max(resistance + fixedResistor, 1);
  const outputVoltage = voltage * (resistance / (fixedResistor + resistance));
  const lampLevel = clamp(outputVoltage / Math.max(voltage, 1), 0, 1);
  const lampStatus = lampLevel > 0.65
    ? { label: "LIGHT ON", tone: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
    : lampLevel > 0.25
      ? { label: "DIM / TRANSITION", tone: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
      : { label: "LIGHT OFF", tone: "text-slate-700", bg: "bg-slate-50 border-slate-200" };

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-yellow-50 via-white to-slate-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">এলডিআর (LDR) — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">LDR হলো light-sensitive resistor। আলো বাড়লে resistance কমে, আলো কমলে resistance বাড়ে।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Light Intensity" value={formatNumber(lightPercent, 0)} unit="%" tone="text-yellow-600" />
          <MetricCard label="LDR Resistance" value={formatResistance(resistance).replace(" Ω", "").replace(" kΩ", "").replace(" MΩ", "")} unit={resistance >= 1000000 ? "MΩ" : resistance >= 1000 ? "kΩ" : "Ω"} tone="text-yellow-700" />
          <MetricCard label="Output Voltage" value={formatNumber(outputVoltage, 2)} unit="V" tone="text-purple-600" />
          <div className={`rounded-2xl border p-4 shadow-sm ${lampStatus.bg}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Street Light</p>
            <p className={`mt-2 text-xl font-bold ${lampStatus.tone}`}>{lampStatus.label}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Light Intensity: {lightPercent}%</label>
              <input type="range" min="0" max="100" step="1" value={lightPercent} onChange={(event) => setLightPercent(Number(event.target.value))} className="w-full accent-yellow-500" />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Dark Resistance: {formatResistance(darkResistance)}</label>
              <select value={darkResistance} onChange={(event) => setDarkResistance(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {[50000, 100000, 250000, 500000, 1000000].map((value) => (
                  <option key={value} value={value}>{formatResistance(value)}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Fixed Resistor: {formatResistance(fixedResistor)}</label>
              <select value={fixedResistor} onChange={(event) => setFixedResistor(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3">
                {[1000, 4700, 10000, 22000, 47000, 100000].map((value) => (
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
            <LdrVisual lightPercent={lightPercent} resistance={resistance} voltage={voltage} fixedResistor={fixedResistor} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <LdrGraph darkResistance={darkResistance} lightPercent={lightPercent} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is LDR?</h2>
            <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-slate-700 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">Definition</p>
              <p className="mt-1">LDR বা Light Dependent Resistor হলো এমন resistor যার resistance আলোর intensity অনুযায়ী পরিবর্তিত হয়।</p>
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Main Idea</p>
              <p className="mt-1">আলো বেশি হলে LDR resistance কমে, অন্ধকারে resistance অনেক বেড়ে যায়।</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Applications</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Automatic Street Light</p>
                <p className="mt-1">রাতে আলো কমলে street light ON করা যায়।</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
                <p className="font-semibold text-orange-700">Light Sensor Module</p>
                <p className="mt-1">Light detection, brightness control, alarm system.</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Limitation</p>
                <p className="mt-1">Response slow এবং precision কম, তাই high-speed sensing-এর জন্য suitable নয়।</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Live Formula / Logic</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
              <p className="font-semibold text-yellow-700">LDR Resistance</p>
              <p className="mt-1 text-sm text-slate-700">Light ↑ → Rldr ↓ | Light ↓ → Rldr ↑</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Rldr = {formatResistance(resistance)}</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-700">Voltage Divider Output</p>
              <p className="mt-1 text-sm text-slate-700">Vout = Vs × Rldr / (Rfixed + Rldr)</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Vout = {formatNumber(outputVoltage, 2)}V</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Current</p>
              <p className="mt-1 text-sm text-slate-700">I = V / (Rldr + Rfixed)</p>
              <p className="mt-1 text-sm font-bold text-slate-900">I = {formatCurrent(current)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
