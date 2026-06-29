"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type FixedTypeKey = "carbon" | "metalFilm" | "wireWound";

type FixedType = {
  key: FixedTypeKey;
  name: string;
  bn: string;
  bodyColor: string;
  layerColor: string;
  description: string;
  whatIs: string;
  toleranceOptions: number[];
  powerOptions: number[];
  accuracy: number;
  noise: number;
  heatHandling: number;
  application: string;
  limitation: string;
};

const fixedTypes: FixedType[] = [
  {
    key: "carbon",
    name: "Carbon Composition",
    bn: "কার্বন রেজিস্টর",
    bodyColor: "#d6b27b",
    layerColor: "#334155",
    description: "কম খরচের fixed resistor, সাধারণ circuit ও learning lab-এ ব্যবহৃত হয়।",
    whatIs: "কার্বন ও binding material দিয়ে তৈরি একটি fixed resistor, যা সাধারণ electronic circuit-এ current control করার জন্য ব্যবহৃত হয়।",
    toleranceOptions: [5, 10, 20],
    powerOptions: [0.25, 0.5, 1],
    accuracy: 35,
    noise: 75,
    heatHandling: 45,
    application: "Basic LED circuit, school lab, simple electronics",
    limitation: "Noise বেশি এবং precision কম।",
  },
  {
    key: "metalFilm",
    name: "Metal Film",
    bn: "মেটাল ফিল্ম রেজিস্টর",
    bodyColor: "#e6d5b8",
    layerColor: "#2563eb",
    description: "উচ্চ নির্ভুলতা, কম noise এবং stable performance-এর fixed resistor।",
    whatIs: "Metal film layer ব্যবহার করে তৈরি উচ্চ accuracy ও stable performance-এর fixed resistor।",
    toleranceOptions: [0.1, 0.5, 1, 2],
    powerOptions: [0.125, 0.25, 0.5, 1],
    accuracy: 92,
    noise: 15,
    heatHandling: 55,
    application: "Sensor signal, amplifier, measuring circuit",
    limitation: "High power load-এর জন্য সবসময় best choice নয়।",
  },
  {
    key: "wireWound",
    name: "Wire Wound",
    bn: "ওয়্যার ওয়াউন্ড রেজিস্টর",
    bodyColor: "#f1c27d",
    layerColor: "#f97316",
    description: "Resistance wire wound করে তৈরি high-power fixed resistor।",
    whatIs: "Resistance wire coil আকারে wound করে তৈরি high-power fixed resistor, যা বেশি heat ও power handle করতে পারে।",
    toleranceOptions: [1, 2, 5],
    powerOptions: [1, 2, 5, 10],
    accuracy: 80,
    noise: 20,
    heatHandling: 95,
    application: "Power supply, braking resistor, heater load",
    limitation: "Size বড় এবং inductance effect থাকতে পারে।",
  },
];

const standardValues = [10, 22, 47, 100, 150, 220, 330, 470, 680, 1000, 2200, 4700, 10000, 22000, 47000, 100000];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 3) {
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

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FixedResistorVisual({
  type,
  resistance,
  tolerance,
  powerRating,
  voltage,
}: {
  type: FixedType;
  resistance: number;
  tolerance: number;
  powerRating: number;
  voltage: number;
}) {
  const current = voltage / resistance;
  const power = current * current * resistance;
  const powerLoad = clamp(power / powerRating, 0, 1.4);
  const heatLevel = clamp(power / powerRating, 0, 1);
  const electronCount = Math.min(Math.max(Math.round(current * 250), 4), 24);
  const electronSpeed = Math.max(0.55, 2.3 - clamp(current * 20, 0, 1.6));
  const minValue = resistance * (1 - tolerance / 100);
  const maxValue = resistance * (1 + tolerance / 100);
  const isOverloaded = power > powerRating;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Fixed Resistor Behavior Visualizer</h2>
          <p className="text-xs text-slate-600">
            Fixed value, tolerance এবং power rating-এর effect live দেখুন।
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isOverloaded ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {isOverloaded ? "OVERLOAD" : "SAFE LOAD"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 760 340" className="h-auto w-[760px] sm:w-full">
          <defs>
            <filter id="fixedHeatGlow" x="-45%" y="-60%" width="190%" height="220%">
              <feGaussianBlur stdDeviation={3 + heatLevel * 12} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="380" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Fixed Resistor: value does not change manually
          </text>

          <line
            x1="50"
            y1="165"
            x2="180"
            y2="165"
            stroke="#64748b"
            strokeWidth={5 + clamp(current * 50, 0, 6)}
            strokeLinecap="round"
          />

          <line
            x1="580"
            y1="165"
            x2="710"
            y2="165"
            stroke="#64748b"
            strokeWidth={5 + clamp(current * 50, 0, 6)}
            strokeLinecap="round"
          />

          <motion.rect
            x="180"
            y="108"
            width="400"
            height="114"
            rx="56"
            fill={type.bodyColor}
            stroke="#111827"
            strokeWidth="3"
            filter="url(#fixedHeatGlow)"
            animate={{ opacity: [0.96, 1, 0.96] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />

          <rect
            x="225"
            y="135"
            width="310"
            height="58"
            rx="28"
            fill={type.layerColor}
            opacity="0.18"
            stroke={type.layerColor}
            strokeDasharray="6 6"
          />

          <text x="380" y="157" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="800">
            FIXED RESISTIVE ELEMENT
          </text>

          <text x="380" y="176" textAnchor="middle" fill="#64748b" fontSize="10">
            Resistance value stays constant
          </text>

          {type.key === "wireWound" && (
            <path
              d="M245 165 C260 125 280 205 300 165 C320 125 340 205 360 165 C380 125 400 205 420 165 C440 125 460 205 480 165 C500 125 520 205 540 165"
              fill="none"
              stroke={type.layerColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}

          {Array.from({ length: electronCount }).map((_, index) => (
            <motion.circle
              key={`electron-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: electronSpeed,
                repeat: Infinity,
                ease: "linear",
                delay: index * (electronSpeed / electronCount),
              }}
              style={{ offsetPath: "path('M60 165 H700')" }}
            />
          ))}

          {isOverloaded && (
            <motion.g animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <rect x="310" y="232" width="140" height="32" rx="14" fill="#fee2e2" stroke="#dc2626" />
              <text x="380" y="253" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="800">
                ⚠ May Burn
              </text>
            </motion.g>
          )}

          <text x="380" y="245" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            Nominal: {formatResistance(resistance)}
          </text>

          <text x="380" y="284" textAnchor="middle" fill="#64748b" fontSize="12">
            Tolerance range: {formatResistance(minValue)} → {formatResistance(maxValue)}
          </text>

          <g transform="translate(160 305)">
            <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="700">
              Power Load
            </text>
            <rect x="0" y="10" width="440" height="10" rx="5" fill="#e2e8f0" />
            <motion.rect
              x="0"
              y="10"
              height="10"
              rx="5"
              fill={isOverloaded ? "#ef4444" : "#22c55e"}
              animate={{ width: 440 * clamp(powerLoad, 0, 1) }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function FixedResistorSimulation() {
  const [typeKey, setTypeKey] = useState<FixedTypeKey>("metalFilm");
  const [resistance, setResistance] = useState(1000);
  const [voltage, setVoltage] = useState(5);
  const [tolerance, setTolerance] = useState(1);
  const [powerRating, setPowerRating] = useState(0.25);

  const selected = fixedTypes.find((item) => item.key === typeKey) || fixedTypes[1];

  const current = voltage / resistance;
  const power = current * current * resistance;
  const minValue = resistance * (1 - tolerance / 100);
  const maxValue = resistance * (1 + tolerance / 100);
  const isOverloaded = power > powerRating;

  const recommendedPower = useMemo(() => {
    if (power <= 0.125) return "1/4W recommended";
    if (power <= 0.25) return "1/2W recommended";
    if (power <= 0.5) return "1W recommended";
    if (power <= 1) return "2W recommended";
    return "High watt resistor needed";
  }, [power]);

  function applyType(key: FixedTypeKey) {
    const next = fixedTypes.find((item) => item.key === key) || fixedTypes[1];
    setTypeKey(key);
    setTolerance(next.toleranceOptions[0]);
    setPowerRating(next.powerOptions[0]);
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            ফিক্সড রেজিস্টর — Interactive Simulation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Fixed resistor-এর value স্থির থাকে। Tolerance, power rating এবং type অনুযায়ী circuit behavior কেমন বদলায় দেখুন।
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{formatCurrent(current)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Power</p>
            <p className={`mt-2 text-3xl font-bold ${isOverloaded ? "text-red-600" : "text-orange-600"}`}>
              {formatNumber(power, 3)} W
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tolerance Range</p>
            <p className="mt-2 text-sm font-bold text-blue-600">
              {formatResistance(minValue)} → {formatResistance(maxValue)}
            </p>
          </div>

          <div className={`rounded-2xl border p-4 shadow-sm ${isOverloaded ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className={`mt-2 text-2xl font-bold ${isOverloaded ? "text-red-600" : "text-green-600"}`}>
              {isOverloaded ? "OVERLOAD" : "SAFE"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5 grid gap-2">
              {fixedTypes.map((item) => (
                <button
                  key={item.key}
                  onClick={() => applyType(item.key)}
                  className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${selected.key === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"}`}
                >
                  <p className="font-semibold text-slate-900">{item.bn}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">
                Resistance: {formatResistance(resistance)}
              </label>
              <select
                value={resistance}
                onChange={(event) => setResistance(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                {standardValues.map((value) => (
                  <option key={value} value={value}>
                    {formatResistance(value)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={voltage}
                onChange={(event) => setVoltage(Number(event.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-slate-700">Tolerance: ±{tolerance}%</label>
              <select
                value={tolerance}
                onChange={(event) => setTolerance(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                {selected.toleranceOptions.map((value) => (
                  <option key={value} value={value}>
                    ±{value}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Power Rating: {powerRating}W</label>
              <select
                value={powerRating}
                onChange={(event) => setPowerRating(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                {selected.powerOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}W
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-2">
            <FixedResistorVisual
              type={selected}
              resistance={resistance}
              tolerance={tolerance}
              powerRating={powerRating}
              voltage={voltage}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Performance Profile</h2>
            <div className="space-y-4">
              <StatBar label="Accuracy" value={selected.accuracy} color="#2563eb" />
              <StatBar label="Noise Level" value={selected.noise} color="#ef4444" />
              <StatBar label="Heat Handling" value={selected.heatHandling} color="#f97316" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is {selected.bn}?</h2>

            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Definition</p>
              <p className="mt-1">{selected.whatIs}</p>
            </div>

            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm text-slate-700 ring-1 ring-green-100">
              <p className="font-semibold text-green-700">Application</p>
              <p className="mt-1">{selected.application}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Selection Guide</h2>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                <p className="font-semibold text-blue-700">Power Check</p>
                <p className="mt-1">Calculated power: {formatNumber(power, 3)}W</p>
                <p className="font-bold text-slate-900">{recommendedPower}</p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Limitation</p>
                <p className="mt-1">{selected.limitation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
