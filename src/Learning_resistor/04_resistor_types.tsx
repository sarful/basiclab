"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type ResistorTypeKey =
  | "carbon"
  | "metalFilm"
  | "wireWound"
  | "potentiometer"
  | "thermistor"
  | "ldr";

type ResistorType = {
  key: ResistorTypeKey;
  category: "Fixed" | "Variable" | "Sensor";
  name: string;
  bn: string;
  short: string;
  whatIs: string;
  valueLabel: string;
  accuracy: number;
  power: number;
  cost: number;
  response: number;
  color: string;
  bestFor: string;
  limitation: string;
  application: string;
};

const resistorTypes: ResistorType[] = [
  {
    key: "carbon",
    category: "Fixed",
    name: "Carbon Composition Resistor",
    bn: "কার্বন রেজিস্টর",
    short: "Low-cost general purpose fixed resistor.",
    whatIs: "কার্বন ও binding material দিয়ে তৈরি একটি fixed resistor যা সাধারণ electronic circuit-এ ব্যবহৃত হয়।",
    valueLabel: "Fixed resistance",
    accuracy: 35,
    power: 45,
    cost: 90,
    response: 55,
    color: "#334155",
    bestFor: "General low-cost electronics",
    limitation: "Noise বেশি এবং accuracy কম।",
    application: "Basic LED circuit, school lab, simple PCB",
  },
  {
    key: "metalFilm",
    category: "Fixed",
    name: "Metal Film Resistor",
    bn: "মেটাল ফিল্ম রেজিস্টর",
    short: "Precise and stable fixed resistor.",
    whatIs: "Metal film layer ব্যবহার করে তৈরি উচ্চ accuracy ও কম noise-এর resistor।",
    valueLabel: "High precision fixed value",
    accuracy: 92,
    power: 55,
    cost: 65,
    response: 75,
    color: "#2563eb",
    bestFor: "Precision signal circuit",
    limitation: "High power load-এর জন্য সবসময় suitable নয়।",
    application: "Sensor signal, amplifier, measuring circuit",
  },
  {
    key: "wireWound",
    category: "Fixed",
    name: "Wire Wound Resistor",
    bn: "ওয়্যার ওয়াউন্ড রেজিস্টর",
    short: "High power resistor made with wound resistance wire.",
    whatIs: "Resistance wire coil আকারে wound করে তৈরি high-power resistor।",
    valueLabel: "Fixed high-power value",
    accuracy: 80,
    power: 95,
    cost: 45,
    response: 45,
    color: "#f97316",
    bestFor: "High power / heat load",
    limitation: "Size বড় এবং inductance থাকতে পারে।",
    application: "Power supply, heater load, braking resistor",
  },
  {
    key: "potentiometer",
    category: "Variable",
    name: "Potentiometer",
    bn: "পটেনশিওমিটার",
    short: "Variable resistor controlled by knob or slider.",
    whatIs: "একটি variable resistor যার resistance knob বা slider ঘুরিয়ে পরিবর্তন করা যায়।",
    valueLabel: "Adjustable resistance",
    accuracy: 60,
    power: 50,
    cost: 60,
    response: 80,
    color: "#8b5cf6",
    bestFor: "Manual control",
    limitation: "Mechanical wear হতে পারে।",
    application: "Volume control, dimmer, calibration knob",
  },
  {
    key: "thermistor",
    category: "Sensor",
    name: "Thermistor",
    bn: "থার্মিস্টর",
    short: "Temperature-sensitive resistor.",
    whatIs: "Temperature পরিবর্তনের সাথে যার resistance পরিবর্তন হয় তাকে thermistor বলে।",
    valueLabel: "Resistance changes with temperature",
    accuracy: 70,
    power: 35,
    cost: 70,
    response: 88,
    color: "#ef4444",
    bestFor: "Temperature sensing",
    limitation: "Non-linear response থাকে।",
    application: "Battery protection, thermostat, fan control",
  },
  {
    key: "ldr",
    category: "Sensor",
    name: "Light Dependent Resistor",
    bn: "এলডিআর (LDR)",
    short: "Light-sensitive resistor.",
    whatIs: "আলোর intensity পরিবর্তনের সাথে যার resistance পরিবর্তন হয় তাকে LDR বলে।",
    valueLabel: "Resistance changes with light",
    accuracy: 50,
    power: 25,
    cost: 80,
    response: 45,
    color: "#eab308",
    bestFor: "Light detection",
    limitation: "Response slow এবং precision কম।",
    application: "Automatic street light, light sensor module",
  },
];

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
          transition={{ duration: 0.45 }}
        />
      </div>
    </div>
  );
}

function ResistorVisual({ selected, controlValue, environmentValue }: { selected: ResistorType; controlValue: number; environmentValue: number }) {
  const sensorEffect = selected.key === "thermistor" ? environmentValue : selected.key === "ldr" ? 100 - environmentValue : 50;
  const adjustedFlow = selected.category === "Variable" ? 100 - controlValue : selected.category === "Sensor" ? sensorEffect : 55;
  const flowLevel = Math.max(10, Math.min(adjustedFlow, 100));
  const particleCount = Math.round(4 + (flowLevel / 100) * 14);
  const speed = 2.2 - (flowLevel / 100) * 1.3;
  const heat = selected.power > 70 ? 0.65 : selected.key === "thermistor" ? environmentValue / 120 : 0.25;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Interactive Resistor Type Visualizer</h2>
          <p className="text-xs text-slate-600">Selected resistor-এর structure ও behavior live দেখানো হচ্ছে।</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">{selected.category}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 760 330" className="h-auto w-[760px] sm:w-full">
          <defs>
            <filter id="typeGlow" x="-50%" y="-60%" width="200%" height="220%">
              <feGaussianBlur stdDeviation={heat * 10} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text x="380" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            {selected.bn} — {selected.valueLabel}
          </text>

          <line x1="55" y1="160" x2="170" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1="590" y1="160" x2="705" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

          {selected.key === "potentiometer" && (
            <g>
              <rect x="220" y="118" width="320" height="70" rx="35" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
              <line x1="250" y1="153" x2="510" y2="153" stroke={selected.color} strokeWidth="14" strokeLinecap="round" />
              <motion.line
                x1={250 + (controlValue / 100) * 260}
                y1="92"
                x2={250 + (controlValue / 100) * 260}
                y2="153"
                stroke="#111827"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <motion.circle cx={250 + (controlValue / 100) * 260} cy="86" r="16" fill={selected.color} />
              <text x="380" y="220" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">Wiper position: {controlValue}%</text>
            </g>
          )}

          {selected.key !== "potentiometer" && (
            <motion.g animate={{ scale: selected.key === "wireWound" && heat > 0.5 ? [1, 1.02, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <rect x="190" y="115" width="380" height="90" rx="45" fill="#f2c879" stroke="#111827" strokeWidth="3" filter="url(#typeGlow)" />
              <rect x="222" y="134" width="316" height="52" rx="26" fill={selected.color} opacity="0.22" stroke={selected.color} strokeDasharray="6 6" />

              {selected.key === "wireWound" && (
                <path d="M235 160 C250 125 270 195 290 160 C310 125 330 195 350 160 C370 125 390 195 410 160 C430 125 450 195 470 160 C490 125 510 195 530 160" fill="none" stroke={selected.color} strokeWidth="6" strokeLinecap="round" />
              )}

              {selected.key === "thermistor" && (
                <motion.g animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <path d="M300 104 C286 82 314 74 300 52" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M380 104 C366 82 394 74 380 52" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M460 104 C446 82 474 74 460 52" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                </motion.g>
              )}

              {selected.key === "ldr" && (
                <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  <line x1="280" y1="70" x2="330" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <line x1="380" y1="60" x2="410" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                  <line x1="500" y1="70" x2="465" y2="115" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
                </motion.g>
              )}

              <rect x="245" y="115" width="13" height="90" fill="#ef4444" />
              <rect x="300" y="115" width="13" height="90" fill="#111827" />
              <rect x="355" y="115" width="13" height="90" fill="#f59e0b" />
              <rect x="500" y="115" width="13" height="90" fill="#d4af37" />
            </motion.g>
          )}

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`${selected.key}-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M60 160 H700')" }}
            />
          ))}

          <text x="120" y="132" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">Electron flow</text>
          <text x="640" y="132" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">Output</text>

          <g transform="translate(165 260)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Flow</text>
            <rect x="0" y="10" width="160" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#0ea5e9" animate={{ width: 160 * (flowLevel / 100) }} />
          </g>
          <g transform="translate(395 260)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">Heat / Stress</text>
            <rect x="0" y="10" width="160" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#ef4444" animate={{ width: 160 * heat }} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ComparisonTable({ selected }: { selected: ResistorType }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Performance Profile</h2>
      <div className="space-y-4">
        <StatBar label="Accuracy" value={selected.accuracy} color="#2563eb" />
        <StatBar label="Power Handling" value={selected.power} color="#f97316" />
        <StatBar label="Low Cost" value={selected.cost} color="#16a34a" />
        <StatBar label="Response / Control" value={selected.response} color="#8b5cf6" />
      </div>
    </div>
  );
}

export default function ResistorTypesSimulation() {
  const [selectedKey, setSelectedKey] = useState<ResistorTypeKey>("metalFilm");
  const [controlValue, setControlValue] = useState(45);
  const [environmentValue, setEnvironmentValue] = useState(60);
  const [filter, setFilter] = useState<"All" | "Fixed" | "Variable" | "Sensor">("All");

  const selected = resistorTypes.find((item) => item.key === selectedKey) || resistorTypes[1];
  const filteredTypes = useMemo(() => {
    if (filter === "All") return resistorTypes;
    return resistorTypes.filter((item) => item.category === filter);
  }, [filter]);

  const environmentLabel = selected.key === "thermistor" ? "Temperature" : selected.key === "ldr" ? "Light" : "Environment";
  const environmentUnit = selected.key === "thermistor" ? "°C" : selected.key === "ldr" ? "%" : "%";

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">রেজিস্টরের প্রকারভেদ — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Different resistor types select করুন, behavior compare করুন, এবং কোথায় কোন resistor ব্যবহার হয় তা শিখুন।</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Fixed", "Variable", "Sensor"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item as "All" | "Fixed" | "Variable" | "Sensor")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${filter === item ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Select Resistor Type</h2>
            <div className="grid gap-3">
              {filteredTypes.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSelectedKey(item.key)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selected.key === item.key ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.bn}</p>
                      <p className="text-xs text-slate-500">{item.name}</p>
                    </div>
                    <span className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: item.color }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{item.short}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ResistorVisual selected={selected} controlValue={controlValue} environmentValue={environmentValue} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            {selected.category === "Variable" && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-slate-700">Knob / Wiper Position: {controlValue}%</label>
                <input type="range" min="0" max="100" value={controlValue} onChange={(event) => setControlValue(Number(event.target.value))} className="w-full accent-purple-500" />
                <p className="mt-1 text-xs text-slate-500">Wiper position change করলে output resistance/voltage change হয়।</p>
              </div>
            )}

            {selected.category === "Sensor" && (
              <div className="mb-5">
                <label className="mb-2 block text-sm text-slate-700">{environmentLabel}: {environmentValue}{environmentUnit}</label>
                <input type="range" min="0" max="100" value={environmentValue} onChange={(event) => setEnvironmentValue(Number(event.target.value))} className="w-full accent-orange-500" />
                <p className="mt-1 text-xs text-slate-500">Sensor resistor environment অনুযায়ী resistance পরিবর্তন করে।</p>
              </div>
            )}

            {selected.category === "Fixed" && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Fixed Resistor</p>
                <p className="mt-1">এর resistance value সাধারণত স্থির থাকে। Precision, power rating, tolerance অনুযায়ী type নির্বাচন করা হয়।</p>
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Best Use</p>
              <p className="mt-1">{selected.bestFor}</p>
            </div>
          </div>

          <ComparisonTable selected={selected} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">What is {selected.bn}?</h2>

            <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Definition</p>
              <p className="mt-1">{selected.whatIs}</p>
            </div>

            <h2 className="mb-4 font-semibold text-slate-900">Application & Limitation</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Real-world Application</p>
                <p className="mt-1">{selected.application}</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Limitation</p>
                <p className="mt-1">{selected.limitation}</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
                <p className="font-semibold text-yellow-700">Learning Point</p>
                <p className="mt-1">সঠিক resistor type নির্বাচন করলে circuit বেশি stable, safe এবং reliable হয়।</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Quick Classification Map</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">Fixed Resistor</p>
              <p className="mt-1 text-sm text-slate-600">Value স্থির থাকে — carbon, metal film, wire wound।</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
              <p className="font-semibold text-purple-700">Variable Resistor</p>
              <p className="mt-1 text-sm text-slate-600">Value manually change করা যায় — potentiometer।</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
              <p className="font-semibold text-orange-700">Sensor Resistor</p>
              <p className="mt-1 text-sm text-slate-600">Environment অনুযায়ী value change হয় — thermistor, LDR।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
