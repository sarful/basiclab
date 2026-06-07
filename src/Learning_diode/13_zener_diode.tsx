"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

type BiasMode = "forward" | "reverse";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getZenerState(voltage: number, zenerVoltage: number, biasMode: BiasMode) {
  const forwardThreshold = 0.7;
  const isForwardOn = biasMode === "forward" && voltage >= forwardThreshold;
  const isBreakdown = biasMode === "reverse" && voltage >= zenerVoltage;
  const active = isForwardOn || isBreakdown;
  const currentMA = isBreakdown
    ? clamp((voltage - zenerVoltage) * 8, 0, 45)
    : isForwardOn
      ? clamp((voltage - forwardThreshold) * 6, 0, 35)
      : 0;

  return {
    active,
    isForwardOn,
    isBreakdown,
    currentMA,
    outputVoltage: isBreakdown ? zenerVoltage : biasMode === "forward" && isForwardOn ? forwardThreshold : 0,
    status: isBreakdown ? "Breakdown Active" : isForwardOn ? "Forward Conducting" : "No Conduction",
  };
}

export function runSimulationTests() {
  const tests = [
    { name: "Reverse below Vz does not breakdown", pass: getZenerState(4, 5.1, "reverse").isBreakdown === false },
    { name: "Reverse above Vz breakdown active", pass: getZenerState(6, 5.1, "reverse").isBreakdown === true },
    { name: "Forward above 0.7V conducts", pass: getZenerState(1, 5.1, "forward").isForwardOn === true },
    { name: "Forward below 0.7V blocks", pass: getZenerState(0.3, 5.1, "forward").isForwardOn === false },
    { name: "Breakdown clamps output voltage to Vz", pass: getZenerState(9, 5.1, "reverse").outputVoltage === 5.1 },
    { name: "Current never goes negative", pass: getZenerState(0, 5.1, "reverse").currentMA >= 0 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}

function ControlButton({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
        active ? "bg-purple-700 text-white" : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-purple-50"
      }`}
    >
      {children}
    </button>
  );
}

function ZenerSymbol() {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 text-xl font-black">Symbol</h2>
      <svg viewBox="0 0 320 130" className="h-[90px] w-full sm:h-[110px]" role="img" aria-label="Zener diode symbol">
        <line x1="18" y1="68" x2="118" y2="68" stroke="#7c3aed" strokeWidth="8" />
        <polygon points="118,35 118,101 190,68" fill="#7c3aed" />
        <path d="M194 35 L194 53 L213 63 L194 73 L194 101" stroke="#7c3aed" strokeWidth="8" fill="none" />
        <line x1="198" y1="68" x2="302" y2="68" stroke="#7c3aed" strokeWidth="8" />
        <text x="75" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Anode</text>
        <text x="250" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">Cathode</text>
      </svg>
      <p className="mt-2 text-sm text-slate-600">Zener diode-এর cathode side-এ বাঁকানো/angled line থাকে।</p>
    </section>
  );
}

function ControlPanel({
  isPlaying,
  setIsPlaying,
  resetKey,
  setResetKey,
  voltage,
  setVoltage,
  zenerVoltage,
  setZenerVoltage,
  biasMode,
  setBiasMode,
  state,
}: {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  resetKey: number;
  setResetKey: (value: number) => void;
  voltage: number;
  setVoltage: (value: number) => void;
  zenerVoltage: number;
  setZenerVoltage: (value: number) => void;
  biasMode: BiasMode;
  setBiasMode: (value: BiasMode) => void;
  state: ReturnType<typeof getZenerState>;
}) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Control Panel</h2>
          <p className="text-sm font-semibold text-slate-500">Voltage, bias mode, and animation control</p>
        </div>
        <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-black text-purple-800">
          Status: {state.status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ControlButton active={isPlaying} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </ControlButton>
        <ControlButton onClick={() => setResetKey(resetKey + 1)}>🔁 Restart</ControlButton>
        <ControlButton active={state.active} onClick={() => setVoltage(biasMode === "reverse" ? zenerVoltage + 1 : 1)}>
          ⚡ Trigger ON
        </ControlButton>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ControlButton active={biasMode === "reverse"} onClick={() => setBiasMode("reverse")}>Reverse Bias</ControlButton>
        <ControlButton active={biasMode === "forward"} onClick={() => setBiasMode("forward")}>Forward Bias</ControlButton>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="voltage" className="font-black">Applied Voltage</label>
            <span className="rounded-xl bg-white px-3 py-1 font-mono font-black shadow-sm">{voltage.toFixed(1)}V</span>
          </div>
          <input
            id="voltage"
            type="range"
            min="0"
            max="12"
            step="0.1"
            value={voltage}
            onChange={(event) => setVoltage(Number(event.target.value))}
            className="w-full accent-purple-700"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>0V</span>
            <span>{biasMode === "reverse" ? `Vz ${zenerVoltage.toFixed(1)}V` : "0.7V"}</span>
            <span>12V</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="zenerVoltage" className="font-black">Zener Voltage (Vz)</label>
            <span className="rounded-xl bg-white px-3 py-1 font-mono font-black shadow-sm">{zenerVoltage.toFixed(1)}V</span>
          </div>
          <input
            id="zenerVoltage"
            type="range"
            min="2"
            max="9"
            step="0.1"
            value={zenerVoltage}
            onChange={(event) => setZenerVoltage(Number(event.target.value))}
            className="w-full accent-purple-700"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>2V</span>
            <span>breakdown point</span>
            <span>9V</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Mode</p>
          <p className="mt-1 text-lg font-black">{biasMode === "reverse" ? "Reverse Bias" : "Forward Bias"}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Current</p>
          <p className="mt-1 text-lg font-black">{state.currentMA.toFixed(1)} mA</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-bold text-slate-300">Output Voltage</p>
          <p className="mt-1 text-lg font-black">{state.outputVoltage.toFixed(1)}V</p>
        </div>
      </div>
    </section>
  );
}

function ZenerAnimation({
  isPlaying,
  resetKey,
  voltage,
  zenerVoltage,
  biasMode,
  state,
}: {
  isPlaying: boolean;
  resetKey: number;
  voltage: number;
  zenerVoltage: number;
  biasMode: BiasMode;
  state: ReturnType<typeof getZenerState>;
}) {
  const isReverse = biasMode === "reverse";
  const leftSign = isReverse ? "−" : "+";
  const rightSign = isReverse ? "+" : "−";
  const leftLabel = "Anode";
  const rightLabel = "Cathode";
  const currentPath = isReverse ? [635, 545, 445, 425, 345, 250, 125] : [125, 250, 345, 425, 545, 635];
  const particleColor = isReverse ? "#a855f7" : "#22c55e";

  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Live Zener Animation</h2>
          <p className="text-sm font-semibold text-slate-600">
            {isReverse
              ? "Reverse bias-এ Vz পার হলে breakdown current Cathode থেকে Anode দিকে যায়।"
              : "Forward bias-এ 0.7V পার হলে সাধারণ diode-এর মতো current Anode থেকে Cathode দিকে যায়।"}
          </p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-black ${state.active ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>
          {state.status}
        </span>
      </div>

      <svg key={resetKey} viewBox="0 0 760 290" className="h-[240px] min-w-[680px] sm:h-[290px] sm:min-w-0 sm:w-full" role="img" aria-label="Zener diode controlled animation">
        <defs>
          <filter id="breakdownGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="35" y="42" width="690" height="185" rx="24" fill={state.active ? "#faf5ff" : "#f8fafc"} stroke={state.active ? "#d8b4fe" : "#e2e8f0"} strokeWidth="2" />
        <line x1="90" y1="135" x2="670" y2="135" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

        <circle cx="90" cy="135" r="30" fill={leftSign === "+" ? "#fee2e2" : "#e0f2fe"} stroke={leftSign === "+" ? "#dc2626" : "#0284c7"} strokeWidth="3" />
        <text x="90" y="143" textAnchor="middle" fontSize="26" fontWeight="900" fill={leftSign === "+" ? "#dc2626" : "#0284c7"}>{leftSign}</text>
        <text x="90" y="179" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">{leftLabel}</text>

        <circle cx="670" cy="135" r="30" fill={rightSign === "+" ? "#fee2e2" : "#e0f2fe"} stroke={rightSign === "+" ? "#dc2626" : "#0284c7"} strokeWidth="3" />
        <text x="670" y="143" textAnchor="middle" fontSize="26" fontWeight="900" fill={rightSign === "+" ? "#dc2626" : "#0284c7"}>{rightSign}</text>
        <text x="670" y="179" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">{rightLabel}</text>

        {state.active && (
          <motion.circle
            cx="405"
            cy="135"
            r="55"
            fill={isReverse ? "#a855f7" : "#22c55e"}
            opacity="0.18"
            filter="url(#breakdownGlow)"
            animate={isPlaying ? { r: [45, 65, 45], opacity: [0.12, 0.35, 0.12] } : { r: 52, opacity: 0.16 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        <polygon points="345,92 345,178 420,135" fill={state.active ? "#7c3aed" : "#94a3b8"} />
        <path d="M425 92 L425 113 L447 124 L425 136 L425 178" stroke="#1e293b" strokeWidth="8" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
        <text x="395" y="211" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b">Zener Diode</text>

        <line x1="315" y1="68" x2="475" y2="68" stroke={state.isBreakdown ? "#7c3aed" : "#cbd5e1"} strokeWidth="4" strokeDasharray="8 7" />
        <text x="395" y="56" textAnchor="middle" fontSize="13" fontWeight="900" fill={state.isBreakdown ? "#6d28d9" : "#64748b"}>
          {state.isBreakdown ? `Vz Clamp Active: ${zenerVoltage.toFixed(1)}V` : `Vz = ${zenerVoltage.toFixed(1)}V`}
        </text>

        {state.active && isPlaying && [0, 0.75, 1.5].map((delay) => (
          <motion.circle
            key={`${biasMode}-${delay}`}
            r="8"
            fill={particleColor}
            stroke="white"
            strokeWidth="3"
            initial={{ cx: currentPath[0], cy: 135, opacity: 0 }}
            animate={{ cx: currentPath, opacity: [0, 1, 1, 1, 1, 1, 0] }}
            transition={{ duration: 2.6, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {!state.active && (
          <g>
            <line x1="348" y1="96" x2="440" y2="174" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <line x1="440" y1="96" x2="348" y2="174" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <text x="395" y="245" textAnchor="middle" fontSize="14" fontWeight="900" fill="#dc2626">BLOCKED / NO BREAKDOWN</text>
          </g>
        )}

        <text x="380" y="265" textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">
          Applied: {voltage.toFixed(1)}V | Current: {state.currentMA.toFixed(1)}mA | {isReverse ? "Reverse current: Cathode → Anode" : "Forward current: Anode → Cathode"}
        </text>
      </svg>
    </section>
  );
}

export default function ZenerDiodeApp() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [biasMode, setBiasMode] = useState<BiasMode>("reverse");
  const [voltage, setVoltage] = useState(6.2);
  const [zenerVoltage, setZenerVoltage] = useState(5.1);

  const state = useMemo(() => getZenerState(voltage, zenerVoltage, biasMode), [voltage, zenerVoltage, biasMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-purple-50 p-3 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-purple-700">Electronics Learning</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">জেনার ডায়োড (Zener Diode)</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Zener diode reverse bias-এ নির্দিষ্ট voltage clamp করে। নিচের control panel দিয়ে voltage, Vz, bias mode এবং animation নিয়ন্ত্রণ করুন।
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4 text-white sm:p-5">
              <p className="text-xs font-bold text-slate-300">Key Idea</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">Reverse voltage ≥ Vz হলে breakdown active হয়।</p>
            </div>
          </div>
        </section>

        <ControlPanel
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          resetKey={resetKey}
          setResetKey={setResetKey}
          voltage={voltage}
          setVoltage={setVoltage}
          zenerVoltage={zenerVoltage}
          setZenerVoltage={setZenerVoltage}
          biasMode={biasMode}
          setBiasMode={setBiasMode}
          state={state}
        />

        <ZenerAnimation
          isPlaying={isPlaying}
          resetKey={resetKey}
          voltage={voltage}
          zenerVoltage={zenerVoltage}
          biasMode={biasMode}
          state={state}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <ZenerSymbol />

          <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-black">Working Principle</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
              Reverse bias-এ Cathode positive এবং Anode negative থাকে। Applied voltage যখন Zener voltage (Vz) অতিক্রম করে, তখন diode breakdown region-এ যায় এবং load-এর voltage প্রায় constant রাখে।
            </p>
            <div className="mt-4 rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-800">
              Current limiting resistor ছাড়া reverse breakdown safe নয়।
            </div>
          </section>
        </div>

        <section className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-xl font-black">Use</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 sm:text-base">
            <li>Voltage regulator</li>
            <li>Over-voltage protection</li>
            <li>Reference voltage circuit</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
