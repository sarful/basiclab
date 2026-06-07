"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type SolveMode = "current" | "voltage" | "resistance";
type LedColor = "green" | "red" | "yellow";

type LedOption = {
  color: LedColor;
  label: string;
  emoji: string;
  ledDrop: number;
  safeCurrentMa: number;
  fill: string;
  stroke: string;
  glow: string;
  buttonClass: string;
};

type LedProblem = {
  color: LedColor;
  label: string;
  emoji: string;
  supplyVoltage: number;
  ledDrop: number;
  currentMa: number;
  safeCurrentMa: number;
  className: string;
};

const ledOptions: LedOption[] = [
  {
    color: "green",
    label: "Green LED",
    emoji: "🟢",
    ledDrop: 2.2,
    safeCurrentMa: 20,
    fill: "#22c55e",
    stroke: "#16a34a",
    glow: "34,197,94",
    buttonClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    color: "red",
    label: "Red LED",
    emoji: "🔴",
    ledDrop: 2,
    safeCurrentMa: 20,
    fill: "#ef4444",
    stroke: "#dc2626",
    glow: "239,68,68",
    buttonClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    color: "yellow",
    label: "Yellow LED",
    emoji: "🟡",
    ledDrop: 2.1,
    safeCurrentMa: 20,
    fill: "#eab308",
    stroke: "#ca8a04",
    glow: "234,179,8",
    buttonClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

function formatResistance(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kΩ`;
  return `${formatNumber(value, 1)} Ω`;
}

const standardResistors = [
  10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82,
  100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
  1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
  10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000, 68000, 82000,
  100000,
];

function nearestStandardResistor(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return standardResistors.reduce((nearest, current) =>
    Math.abs(current - value) < Math.abs(nearest - value) ? current : nearest
  );
}

function getSafeLedStatus(current: number, safeCurrentMa: number) {
  const currentMa = current * 1000;

  if (currentMa > safeCurrentMa * 1.25) {
    return {
      label: "UNSAFE",
      tone: "text-red-600",
      bg: "bg-red-50",
      message: "Current বেশি — LED damage হতে পারে।",
    };
  }

  if (currentMa > safeCurrentMa) {
    return {
      label: "CAUTION",
      tone: "text-orange-600",
      bg: "bg-orange-50",
      message: "Safe current-এর কাছাকাছি বা বেশি।",
    };
  }

  if (currentMa < safeCurrentMa * 0.25) {
    return {
      label: "DIM",
      tone: "text-yellow-700",
      bg: "bg-yellow-50",
      message: "Current কম — LED dim দেখাবে।",
    };
  }

  return {
    label: "SAFE",
    tone: "text-green-600",
    bg: "bg-green-50",
    message: "Current safe range-এর মধ্যে আছে।",
  };
}

function MetricCard({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600 sm:text-xs sm:tracking-[0.22em]">{label}</p>
      <div className="mt-2 flex items-end gap-1 sm:gap-2">
        <p className={`text-2xl font-bold sm:text-3xl ${tone}`}>{value}</p>
        <p className="pb-1 text-xs text-slate-600 sm:text-sm">{unit}</p>
      </div>
    </div>
  );
}

function OhmsGraph({ resistance, voltage }: { resistance: number; voltage: number }) {
  const width = 420;
  const height = 240;
  const padding = 36;
  const maxVoltage = 50;
  const safeResistance = Math.max(resistance, 0.001);
  const maxCurrent = Math.max(1, maxVoltage / safeResistance);

  const points = Array.from({ length: 11 }, (_, index) => {
    const v = (maxVoltage / 10) * index;
    const i = v / safeResistance;
    const x = padding + (v / maxVoltage) * (width - padding * 1.4);
    const y = height - padding - (i / maxCurrent) * (height - padding * 1.5);
    return `${x},${y}`;
  }).join(" ");

  const liveVoltage = clamp(voltage, 0, maxVoltage);
  const liveX = padding + (liveVoltage / maxVoltage) * (width - padding * 1.4);
  const liveY = height - padding - ((liveVoltage / safeResistance) / maxCurrent) * (height - padding * 1.5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">V vs I Curve</h2>
          <p className="text-xs text-slate-600">Slope depends on resistance: I = V / R</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">LIVE GRAPH</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[320px]">
          <defs>
            <linearGradient id="graphLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((line) => {
            const y = padding + line * 38;
            return <line key={`h-${line}`} x1={padding} y1={y} x2={width - 22} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
          })}

          {[0, 1, 2, 3, 4, 5].map((line) => {
            const x = padding + line * 70;
            return <line key={`v-${line}`} x1={x} y1={20} x2={x} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />;
          })}

          <line x1={padding} y1="20" x2={padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - 20} y2={height - padding} stroke="#475569" strokeWidth="2" />

          <motion.polyline
            points={points}
            fill="none"
            stroke="url(#graphLine)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7 }}
          />

          <motion.circle
            cx={liveX}
            cy={liveY}
            r="7"
            fill="#facc15"
            stroke="#fefce8"
            strokeWidth="3"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          <text x={width - 76} y={height - 8} fill="#334155" fontSize="12" fontWeight="600">Voltage (V)</text>
          <text x="6" y="18" fill="#334155" fontSize="12" fontWeight="600">Current (A)</text>
          <text x={padding - 4} y={height - 18} textAnchor="end" fill="#64748b" fontSize="10">0</text>
          <text x={padding + 68} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">10V</text>
          <text x={padding + 138} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">20V</text>
          <text x={padding + 278} y={height - 18} textAnchor="middle" fill="#64748b" fontSize="10">40V</text>
          <text x={padding - 8} y="28" textAnchor="end" fill="#64748b" fontSize="10">{formatNumber(maxCurrent, 2)}A</text>
        </svg>
      </div>
    </div>
  );
}

function CircuitDiagram({
  voltage,
  resistance,
  current,
  ledBrightness,
  led,
}: {
  voltage: number;
  resistance: number;
  current: number;
  ledBrightness: number;
  led: LedOption;
}) {
  const currentLevel = clamp(current / 0.08, 0, 1);
  const heatLevel = clamp((current * current * resistance) / 2, 0, 1);
  const wireWidth = 4 + currentLevel * 5;
  const particleCount = Math.min(Math.max(Math.round(currentLevel * 18), 4), 22);
  const electronSpeed = Math.max(0.5, 2.3 - currentLevel * 1.65);
  const collisionCount = Math.min(Math.max(Math.round(resistance / 85), 3), 11);
  const resistorShake = heatLevel > 0.7 ? 1.6 : heatLevel > 0.4 ? 0.7 : 0;
  const ledStatus = getSafeLedStatus(current, led.safeCurrentMa);
  const showBurnWarning = ledStatus.label === "UNSAFE" || ledStatus.label === "CAUTION";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Industrial Circuit View</h2>
          <p className="text-xs text-slate-600">Electron flow: negative terminal → load path → positive terminal</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-green-600">LIVE FLOW + STRUCTURE</span>
      </div>

      <p className="mb-2 text-xs text-slate-500 sm:hidden">Swipe horizontally to view full circuit.</p>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <svg viewBox="0 0 760 330" className="h-auto w-[760px] overflow-visible rounded-2xl bg-white sm:w-full">
          <defs>
            <linearGradient id="resistorBodyCircuit" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="48%" stopColor={heatLevel > 0.55 ? "#fb923c" : "#f2c879"} />
              <stop offset="100%" stopColor={heatLevel > 0.82 ? "#ef4444" : "#d6a35f"} />
            </linearGradient>
            <filter id="ledGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={8 + ledBrightness * 14} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="resistorHeatGlowCircuit" x="-45%" y="-60%" width="190%" height="220%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="380" y="24" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            Electron flow is shown from negative terminal to positive terminal
          </text>

          <rect x="35" y="88" width="90" height="92" rx="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="80" y="124" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="700">DC</text>
          <text x="80" y="150" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="700">{formatNumber(voltage, 2)}V</text>
          <text x="80" y="198" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">POWER SOURCE</text>
          <line x1="62" y1="77" x2="62" y2="57" stroke="#22c55e" strokeWidth="4" />
          <line x1="98" y1="77" x2="98" y2="57" stroke="#ef4444" strokeWidth="4" />
          <text x="62" y="47" textAnchor="middle" fill="#22c55e" fontSize="12">−</text>
          <text x="98" y="47" textAnchor="middle" fill="#ef4444" fontSize="12">+</text>

          <path d="M125 134 H202" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />

          <motion.g animate={{ x: [0, resistorShake, -resistorShake, 0] }} transition={{ repeat: Infinity, duration: 0.22 }}>
            <rect x="202" y="92" width="230" height="84" rx="42" fill="url(#resistorBodyCircuit)" stroke="#111827" strokeWidth="3" filter="url(#resistorHeatGlowCircuit)" />
            <rect x="230" y="112" width="170" height="44" rx="22" fill="rgba(120,53,15,0.26)" stroke="#92400e" strokeDasharray="6 6" />
            <text x="316" y="129" textAnchor="middle" fill="#78350f" fontSize="10" fontWeight="700">RESISTIVE LAYER</text>
            <text x="316" y="146" textAnchor="middle" fill="#78350f" fontSize="9">collisions create resistance + heat</text>

            <rect x="235" y="92" width="13" height="84" fill="#ef4444" />
            <rect x="278" y="92" width="13" height="84" fill="#111827" />
            <rect x="326" y="92" width="13" height="84" fill="#f59e0b" />
            <rect x="390" y="92" width="13" height="84" fill="#d4af37" />

            {Array.from({ length: collisionCount }).map((_, index) => {
              const x = 238 + index * (155 / Math.max(collisionCount - 1, 1));
              const y = index % 2 === 0 ? 121 : 151;
              return (
                <motion.g key={`circuit-collision-${index}`}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={4 + heatLevel * 4}
                    fill="#f97316"
                    opacity={0.2 + heatLevel * 0.6}
                    animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.2, 0.85, 0.2] }}
                    transition={{ repeat: Infinity, duration: 0.9 + index * 0.04 }}
                  />
                  <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.4" opacity="0.65" />
                  <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="#ea580c" strokeWidth="1.4" opacity="0.65" />
                </motion.g>
              );
            })}

            <motion.g animate={{ opacity: heatLevel > 0.18 ? [0.15, 1, 0.15] : 0.08 }} transition={{ repeat: Infinity, duration: 1.1 }}>
              <path d="M260 82 C246 62 274 55 260 36" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M315 82 C301 62 329 55 315 36" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M370 82 C356 62 384 55 370 36" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
            </motion.g>
          </motion.g>

          <text x="317" y="76" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">Resistor Internal Structure</text>
          <text x="317" y="194" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">R = {formatResistance(resistance)}</text>
          <text x="317" y="212" textAnchor="middle" fill="#64748b" fontSize="10">I = {formatCurrent(current)}</text>

          <path d="M432 134 H500" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />
          <circle cx="552" cy="134" r="38" fill={`rgba(${led.glow},${0.15 + ledBrightness * 0.8})`} stroke={led.stroke} strokeWidth={4 + ledBrightness * 3} filter="url(#ledGlow)" />
          <polygon points="537,112 537,156 576,134" fill={led.fill} stroke={led.stroke} strokeWidth="3" />
          <line x1="586" y1="112" x2="586" y2="156" stroke={led.fill} strokeWidth="4" />
          <text x="552" y="82" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700">{led.label.toUpperCase()}</text>
          <text x="552" y="198" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">LED Brightness {Math.round(ledBrightness * 100)}%</text>
          {showBurnWarning && (
            <motion.g animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 0.9 }}>
              <rect x="490" y="34" width="124" height="30" rx="12" fill={ledStatus.label === "UNSAFE" ? "#fee2e2" : "#ffedd5"} stroke={ledStatus.label === "UNSAFE" ? "#dc2626" : "#ea580c"} />
              <text x="552" y="54" textAnchor="middle" fill={ledStatus.label === "UNSAFE" ? "#dc2626" : "#c2410c"} fontSize="11" fontWeight="800">
                ⚠ LED may burn
              </text>
            </motion.g>
          )}

          <path d="M590 134 H675 V238 H80 V180" stroke="#94a3b8" strokeWidth={wireWidth} fill="none" strokeLinecap="round" />

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`circuit-electron-${particleCount}-${index}`}
              r={4 + currentLevel * 1.5}
              fill="#38bdf8"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: electronSpeed, repeat: Infinity, ease: "linear", delay: index * (electronSpeed / particleCount) }}
              style={{ offsetPath: "path('M80 180 V238 H675 V134 H590 H500 H432 C396 134 368 104 336 134 C302 164 260 104 230 134 H125')" }}
            />
          ))}

          <text x="142" y="116" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="700">Voltage pressure</text>
          <text x="470" y="116" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700">← Electron flow</text>

          <g transform="translate(180 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">Electron Density</text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#0ea5e9" animate={{ width: 130 * currentLevel }} />
          </g>
          <g transform="translate(338 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">Collision</text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#f59e0b" animate={{ width: 130 * clamp(resistance / 1000, 0, 1) }} />
          </g>
          <g transform="translate(496 274)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">Heat</text>
            <rect x="0" y="10" width="130" height="8" rx="4" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="8" rx="4" fill="#ef4444" animate={{ width: 130 * heatLevel }} />
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
          <p className="font-semibold text-blue-700">Voltage effect</p>
          <p className="mt-1 text-xs text-slate-700">Voltage বাড়ালে electric field বেশি হয়, তাই electron drift visualization দ্রুত/ঘন দেখায়।</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100">
          <p className="font-semibold text-yellow-700">Resistance effect</p>
          <p className="mt-1 text-xs text-slate-700">Resistance বাড়ালে collision বেশি হয় এবং current কমে।</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
          <p className="font-semibold text-red-700">Heat effect</p>
          <p className="mt-1 text-xs text-slate-700">Power বেশি হলে resistor glow/shake করে।</p>
        </div>
      </div>
    </div>
  );
}

function LedResistorProblems({ supplyVoltage }: { supplyVoltage: number }) {
  const problems: LedProblem[] = [
    {
      color: "green",
      label: "Green LED",
      emoji: "🟢",
      supplyVoltage,
      ledDrop: 2.2,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-green-50 text-green-700",
    },
    {
      color: "red",
      label: "Red LED",
      emoji: "🔴",
      supplyVoltage,
      ledDrop: 2,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-red-50 text-red-700",
    },
    {
      color: "yellow",
      label: "Yellow LED",
      emoji: "🟡",
      supplyVoltage,
      ledDrop: 2.1,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-yellow-50 text-yellow-700",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">LED Resistor Calculation (Practice)</h2>
      <p className="mb-4 text-sm text-slate-600">Formula: R = (Vs - Vled) / I</p>

      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((problem) => {
          const currentAmp = problem.currentMa / 1000;
          const resistorValue = Math.max(0, (problem.supplyVoltage - problem.ledDrop) / currentAmp);
          const roundedResistor = nearestStandardResistor(resistorValue);

          return (
            <div key={problem.color} className={`rounded-2xl p-4 ${problem.className}`}>
              <p className="font-semibold">{problem.emoji} {problem.label}</p>
              <p className="mt-2 text-sm text-slate-700">Supply: {problem.supplyVoltage}V</p>
              <p className="text-sm text-slate-700">LED drop: {problem.ledDrop}V</p>
              <p className="text-sm text-slate-700">Target Current: {problem.currentMa}mA</p>
              <p className="text-sm font-semibold text-slate-800">Safe Current: {problem.safeCurrentMa}mA</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                R = ({problem.supplyVoltage} - {problem.ledDrop}) / {currentAmp} = {formatNumber(resistorValue, 0)}Ω
              </p>
              {problem.supplyVoltage <= problem.ledDrop ? (
                <p className="mt-1 text-sm font-bold text-red-600">Supply too low for this LED</p>
              ) : (
                <p className="mt-1 text-sm font-bold text-slate-900">Use nearest standard: {formatResistance(roundedResistor)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OhmsLawSimulation() {
  const [mode, setMode] = useState<SolveMode>("current");
  const [voltage, setVoltage] = useState(12);
  const [currentInput, setCurrentInput] = useState(0.12);
  const [resistance, setResistance] = useState(100);
  const [selectedLed, setSelectedLed] = useState<LedOption>(ledOptions[0]);

  const solved = useMemo(() => {
    if (mode === "current") {
      const current = voltage / resistance;
      return {
        voltage,
        current,
        resistance,
        formula: `I = V / R = ${voltage} / ${resistance} = ${formatCurrent(current)}`,
      };
    }

    if (mode === "voltage") {
      const calculatedVoltage = currentInput * resistance;
      return {
        voltage: calculatedVoltage,
        current: currentInput,
        resistance,
        formula: `V = I × R = ${currentInput} × ${resistance} = ${formatNumber(calculatedVoltage, 2)} V`,
      };
    }

    const calculatedResistance = voltage / currentInput;
    return {
      voltage,
      current: currentInput,
      resistance: calculatedResistance,
      formula: `R = V / I = ${voltage} / ${currentInput} = ${formatResistance(calculatedResistance)}`,
    };
  }, [mode, voltage, currentInput, resistance]);

  const ledBrightness = clamp(solved.current / (selectedLed.safeCurrentMa / 1000), 0, 1);
  const power = solved.current * solved.current * solved.resistance;
  const ledStatus = getSafeLedStatus(solved.current, selectedLed.safeCurrentMa);
  const ledSupplyVoltage = solved.voltage;
  const requiredLedResistor = Math.max(0, (ledSupplyVoltage - selectedLed.ledDrop) / (selectedLed.safeCurrentMa / 1000));
  const roundedLedResistor = nearestStandardResistor(requiredLedResistor);

  function resetSimulation() {
    setMode("current");
    setVoltage(12);
    setCurrentInput(0.12);
    setResistance(100);
    setSelectedLed(ledOptions[0]);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Industrial Electronics Trainer</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">ওহমের সূত্র (Ohm’s Law) Simulation</h1>
              <p className="mt-2 text-sm text-slate-600">Solve V, I, R with live graph, LED load, and animated circuit flow.</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-50 px-4 py-3 text-left sm:px-5 sm:text-right">
              <p className="text-xs text-blue-500">System Status</p>
              <p className={`text-lg font-bold ${ledStatus.tone}`}>{ledStatus.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          {[
            { id: "current", label: "Solve Current (I)" },
            { id: "voltage", label: "Solve Voltage (V)" },
            { id: "resistance", label: "Solve Resistance (R)" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as SolveMode)}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 sm:w-auto sm:py-2 ${
                mode === item.id ? "bg-cyan-500 text-slate-950" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={resetSimulation}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto sm:py-2"
          >
            Reset Default
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Voltage" value={formatNumber(solved.voltage, 2)} unit="V" tone="text-blue-600" />
          <MetricCard
            label="Current"
            value={formatCurrent(solved.current).replace(" A", "").replace(" mA", "")}
            unit={solved.current >= 1 ? "A" : "mA"}
            tone="text-green-600"
          />
          <MetricCard
            label="Resistance"
            value={formatResistance(solved.resistance).replace(" Ω", "").replace(" kΩ", "")}
            unit={solved.resistance >= 1000 ? "kΩ" : "Ω"}
            tone="text-yellow-600"
          />
          <MetricCard label="Power" value={formatNumber(power, 3)} unit="W" tone="text-orange-600" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">LED Color & Safe Current</h2>
              <p className="text-sm text-slate-600">Select LED color to update circuit color, voltage drop, safe current, and warning status.</p>
            </div>
            <div className={`rounded-2xl px-4 py-3 ${ledStatus.bg}`}>
              <p className={`text-sm font-bold ${ledStatus.tone}`}>{selectedLed.emoji} {selectedLed.label}: {ledStatus.label}</p>
              <p className="text-xs text-slate-700">{ledStatus.message}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ledOptions.map((led) => (
              <button
                key={led.color}
                onClick={() => setSelectedLed(led)}
                className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${led.buttonClass} ${selectedLed.color === led.color ? "ring-2 ring-blue-500" : ""}`}
              >
                <p className="text-lg font-bold">{led.emoji} {led.label}</p>
                <p className="mt-1 text-sm text-slate-700">Vf: {led.ledDrop}V</p>
                <p className="text-sm font-semibold text-slate-900">Safe Current: {led.safeCurrentMa}mA</p>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">For selected {selectedLed.label} with live supply voltage: {formatNumber(ledSupplyVoltage, 2)}V</p>
            {ledSupplyVoltage <= selectedLed.ledDrop ? (
              <p className="text-red-600">
                Supply voltage LED forward voltage-এর চেয়ে কম বা সমান, তাই LED ঠিকভাবে জ্বলবে না।
              </p>
            ) : (
              <p>
                R = (Vs - Vled) / I = ({formatNumber(ledSupplyVoltage, 2)} - {selectedLed.ledDrop}) / {selectedLed.safeCurrentMa / 1000} = {formatNumber(requiredLedResistor, 0)}Ω
                <br />
                Nearest standard resistor: <b>{formatResistance(roundedLedResistor)}</b>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl lg:col-span-1">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            {(mode === "current" || mode === "resistance") && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
                <input type="range" min="1" max="50" value={voltage} onChange={(event) => setVoltage(Number(event.target.value))} className="w-full accent-cyan-400" />
              </div>
            )}

            {(mode === "voltage" || mode === "resistance") && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-slate-700">Current: {formatCurrent(currentInput)}</label>
                <input type="range" min="0.005" max="0.2" step="0.005" value={currentInput} onChange={(event) => setCurrentInput(Number(event.target.value))} className="w-full accent-emerald-400" />
              </div>
            )}

            {(mode === "current" || mode === "voltage") && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-slate-700">Resistance: {formatResistance(resistance)}</label>
                <input type="range" min="10" max="1000" step="10" value={resistance} onChange={(event) => setResistance(Number(event.target.value))} className="w-full accent-yellow-400" />
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Formula</p>
              <p className="mt-2 text-sm font-semibold text-blue-700">{solved.formula}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">LED Load</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
                <motion.div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-300" animate={{ width: `${ledBrightness * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-600">Brightness follows current flow and selected LED safe current.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <CircuitDiagram voltage={solved.voltage} resistance={solved.resistance} current={solved.current} ledBrightness={ledBrightness} led={selectedLed} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <OhmsGraph resistance={solved.resistance} voltage={solved.voltage} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Learning Insight</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-blue-600">Voltage ↑ → Current ↑</p>
                <p className="mt-1 text-slate-600">Resistance constant থাকলে voltage বাড়ালে current বাড়ে।</p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-yellow-600">Resistance ↑ → Current ↓</p>
                <p className="mt-1 text-slate-600">Voltage constant থাকলে resistance বাড়ালে current কমে।</p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-green-600">LED brightness follows current</p>
                <p className="mt-1 text-slate-600">Current বেশি হলে LED উজ্জ্বল, current কম হলে LED dim হয়।</p>
              </div>
            </div>
          </div>
        </div>

        <LedResistorProblems supplyVoltage={ledSupplyVoltage} />
      </div>
    </div>
  );
}
