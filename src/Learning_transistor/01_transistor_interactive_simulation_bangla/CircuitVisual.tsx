"use client";

import { motion } from "framer-motion";

import FlowDots from "./FlowDots";
import {
  clamp,
  formatNumber,
  formatResistance,
  getTransistorLevel,
  MIN_BASE_BIAS_CURRENT,
} from "./logic";

type CircuitVisualProps = {
  baseVoltage: number;
  baseResistance: number;
  loadResistance: number;
  switchOn: boolean;
  gain: number;
};

export default function CircuitVisual({
  baseVoltage,
  baseResistance,
  loadResistance,
  switchOn,
  gain,
}: CircuitVisualProps) {
  const rawBaseCurrent = switchOn ? baseVoltage / baseResistance : 0;
  const transistorBiased = rawBaseCurrent >= MIN_BASE_BIAS_CURRENT;
  const baseCurrent = transistorBiased ? rawBaseCurrent : 0;
  const collectorCurrent = transistorBiased
    ? clamp(baseCurrent * gain, 0, baseVoltage / loadResistance)
    : 0;
  const lampGlow = clamp(
    collectorCurrent / Math.max(baseVoltage / loadResistance, 0.00001),
    0,
    1,
  );
  const isSaturated = lampGlow > 0.86;
  const transistorLevel = getTransistorLevel({
    switchOn,
    transistorBiased,
    lampGlow,
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:rounded-3xl sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            Transistor Switch Circuit Visualizer
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            Reference transistor switch circuit for basic switching behavior.
          </p>
        </div>
        <span
          className={`inline-flex flex-wrap items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold sm:px-3 sm:text-xs ${
            transistorBiased
              ? "bg-green-100 text-green-700"
              : switchOn
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {transistorBiased
            ? isSaturated
              ? "TRANSISTOR SATURATED"
              : "TRANSISTOR ON"
            : switchOn
              ? "BIAS CURRENT LOW"
              : "TRANSISTOR OFF"}
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[9px] font-black tracking-wide sm:text-[10px]">
            LEVEL: {transistorLevel}
          </span>
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 sm:p-3">
        <svg
          viewBox="0 0 480 520"
          className="mx-auto h-auto w-full max-w-[480px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="lampGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation={10 + lampGlow * 18} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M38 38 H420 V285"
            stroke="#16a34a"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M420 360 V475 H38 V260"
            stroke="#16a34a"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M38 38 H420 V285"
            stroke="#eab308"
            strokeWidth="4"
            strokeDasharray="6 20"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M420 360 V475 H38 V260"
            stroke="#eab308"
            strokeWidth="4"
            strokeDasharray="6 20"
            fill="none"
            strokeLinecap="round"
          />

          <line
            x1="10"
            y1="238"
            x2="68"
            y2="238"
            stroke="#18e7e9"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="17"
            y1="252"
            x2="61"
            y2="252"
            stroke="#64748b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M38 38 V226" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          <path d="M38 260 V475" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M38 260 V475"
            stroke="#eab308"
            strokeWidth="4"
            strokeDasharray="6 20"
            strokeLinecap="round"
          />

          <circle cx="38" cy="38" r="5" fill="#eab308" stroke="#d9f99d" strokeWidth="2" />
          <circle cx="226" cy="38" r="5" fill="#64748b" stroke="#f8fafc" strokeWidth="2" />

          <path d="M226 38 V95" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M226 95 l-16 8 l32 14 l-32 14 l32 14 l-32 14 l32 14 l-16 8"
            stroke="#16a34a"
            strokeWidth="6"
            fill="none"
            strokeLinejoin="round"
          />
          <path d="M226 181 V222" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          <text x="246" y="121" fill="#ffffff" fontSize="20" fontWeight="900">
            {formatResistance(baseResistance)}
          </text>

          <motion.path
            d={switchOn ? "M226 222 L226 302" : "M226 222 L252 280"}
            animate={{ d: switchOn ? "M226 222 L226 302" : "M226 222 L252 280" }}
            stroke={switchOn ? "#16a34a" : "#374151"}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M226 302 V338 H355"
            stroke="#475569"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path d="M420 38 V118" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M420 126 l-16 8 l32 14 l-32 14 l32 14 l-32 14 l32 14 l-16 8"
            stroke="#16a34a"
            strokeWidth="6"
            fill="none"
            strokeLinejoin="round"
          />
          <path d="M420 214 V285" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          <text x="436" y="162" fill="#ffffff" fontSize="20" fontWeight="900">
            {formatResistance(loadResistance)}
          </text>

          <line x1="362" y1="302" x2="362" y2="375" stroke="#9ca3af" strokeWidth="5" strokeLinecap="square" />
          <text x="332" y="342" fill="#38bdf8" fontSize="12" fontWeight="900">
            BASE
          </text>
          <text x="424" y="294" fill="#22c55e" fontSize="11" fontWeight="900">
            COLLECTOR
          </text>
          <text x="424" y="398" fill="#fde047" fontSize="11" fontWeight="900">
            EMITTER
          </text>
          <line x1="355" y1="338" x2="362" y2="338" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          <path d="M362 322 L420 285" stroke="#16a34a" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M362 352 L420 382" stroke="#eab308" strokeWidth="7" fill="none" strokeLinecap="round" />
          <polygon points="404,369 424,384 399,391" fill="#eab308" />

          <path d="M420 382 V398" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
          <circle
            cx="420"
            cy="435"
            r="22"
            fill={
              transistorBiased
                ? `rgba(250, 204, 21, ${0.25 + lampGlow * 0.55})`
                : "#111827"
            }
            stroke={transistorBiased ? "#fde047" : "#9ca3af"}
            strokeWidth="5"
            filter={transistorBiased ? "url(#lampGlow)" : undefined}
          />
          <path
            d="M405 420 L435 450 M435 420 L405 450"
            stroke={transistorBiased ? "#fff7ed" : "#374151"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M420 457 V475" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />

          <FlowDots
            path="M38 38 H226 V222"
            active={transistorBiased}
            color="#22d3ee"
          />
          <FlowDots
            path="M226 302 V338 H355"
            active={transistorBiased}
            color="#22d3ee"
            delayOffset={0.15}
          />
          <FlowDots
            path="M420 38 V113"
            active={transistorBiased}
            color="#f4f40a"
            delayOffset={0.1}
          />
          <FlowDots
            path="M420 211 V285 L362 322"
            active={transistorBiased}
            color="#f4f40a"
            delayOffset={0.25}
          />
          <FlowDots
            path="M362 352 L420 382 V475 H38 V260"
            active={transistorBiased}
            color="#f4f40a"
            delayOffset={0.4}
          />
        </svg>
      </div>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Base
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Minimum bias current: {formatNumber(MIN_BASE_BIAS_CURRENT * 1000, 2)} mA.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(rawBaseCurrent * 1000, 2)} mA
          </p>
        </div>
        <div className="rounded-2xl bg-green-50 p-3 ring-1 ring-green-100 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Collector
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Load current flows through the collector path.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(collectorCurrent * 1000, 1)} mA
          </p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-3 ring-1 ring-yellow-100 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">
            Load Lamp
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The lamp glows when the transistor turns on.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(lampGlow * 100, 0)}% Glow
          </p>
        </div>
      </div>
    </div>
  );
}
