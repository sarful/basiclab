"use client";

import { motion } from "framer-motion";

import { ElectronFlow, HoleFlow } from "./ElectronFlow";
import {
  BASE_EMITTER_THRESHOLD,
  calculateBaseCurrent,
  clamp,
  formatNumber,
} from "./logic";
import type { TransistorType } from "./types";

type StructureVisualProps = {
  transistorType: TransistorType;
  active: boolean;
  dopingLevel: number;
  collectorVoltage: number;
  baseVoltage: number;
  baseResistance: number;
  loadResistance: number;
};

export default function StructureVisual({
  transistorType,
  active,
  dopingLevel,
  collectorVoltage,
  baseVoltage,
  baseResistance,
  loadResistance,
}: StructureVisualProps) {
  const gainLevel = clamp(dopingLevel / 100, 0, 1);
  const rawBaseCurrent = calculateBaseCurrent(active, baseVoltage, baseResistance);
  const transistorGain = clamp(dopingLevel * 2, 20, 200);
  const isBiased = rawBaseCurrent >= 0.00002;
  const collectorCurrent = isBiased
    ? clamp(rawBaseCurrent * transistorGain, 0, collectorVoltage / loadResistance)
    : 0;
  const lampGlow = clamp(
    collectorCurrent / Math.max(collectorVoltage / loadResistance, 0.00001),
    0,
    1,
  );
  const flowActive = active && isBiased;
  const baseCurrentMA = rawBaseCurrent * 1000;
  const collectorCurrentMA = collectorCurrent * 1000;
  const flowIntensity = clamp((gainLevel + lampGlow) / 2, 0.05, 1);
  const emitterDotCount = 18 + Math.round(gainLevel * 42);
  const baseDotCount = 8 + Math.round(gainLevel * 24);
  const collectorDotCount = 18 + Math.round(gainLevel * 42);
  const nDotRadius = 1.7 + gainLevel * 0.9;
  const pDotRadius = 3 + gainLevel * 1.4;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Transistor Structure
          </h2>
          <p className="text-sm text-slate-600">
            Interactive visualization of Emitter, Base, and Collector layers
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black ${
            flowActive
              ? "bg-green-100 text-green-700"
              : active
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {flowActive ? "CURRENT FLOW ACTIVE" : active ? "BIAS TOO LOW" : "NO CURRENT FLOW"}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 sm:p-4 shadow-inner">
        <svg viewBox="0 0 760 460" className="mx-auto h-auto w-full max-w-[760px]">
          <rect width="760" height="460" fill="#ffffff" />

          <path d="M38 82 H350" stroke="#4b4b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M370 82 H698 V206 H530" stroke="#4b4b4b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 82 V418 H188" stroke="#4b4b4b" strokeWidth="3" fill="none" strokeLinecap="round" />

          <line x1="350" y1="55" x2="350" y2="103" stroke="#ef4444" strokeWidth="3" />
          <line x1="370" y1="45" x2="370" y2="113" stroke="#ef4444" strokeWidth="6" />
          <text x="316" y="28" fill="#111827" fontSize="16" fontWeight="700">
            UCE {collectorVoltage}V
          </text>
          <text x="378" y="93" fill="#ef4444" fontSize="20" fontWeight="900">
            +
          </text>
          <text x="336" y="93" fill="#ef4444" fontSize="20" fontWeight="900">
            -
          </text>

          <circle
            cx="586"
            cy="82"
            r="19"
            fill={flowActive ? `rgba(250, 204, 21, ${0.22 + lampGlow * 0.62})` : "#fafafa"}
            stroke={flowActive ? "#ca8a04" : "#666"}
            strokeWidth="4"
          />
          <path d="M572 68 L600 96 M600 68 L572 96" stroke={flowActive ? "#92400e" : "#666"} strokeWidth="3" />
          <text x="610" y="88" fill="#111827" fontSize="13" fontWeight="700">
            {Math.round(lampGlow * 100)}%
          </text>

          <rect x="145" y="152" width="385" height="128" fill="#c7ecec" stroke="#7a8f8f" strokeWidth="2" />
          <rect x="288" y="152" width="94" height="128" fill="#f1d12d" stroke="#8d7500" strokeWidth="2" />

          <path d="M38 206 H145" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />
          <path d="M530 206 H698" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />
          <path d="M335 280 V340" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />

          <path
            d="M335 340 l-10 8 l20 12 l-20 12 l20 12 l-20 12 l20 12 l-10 8"
            stroke="#5b5b5b"
            strokeWidth="3"
            fill="none"
          />
          <text x="354" y="392" fill="#111827" fontSize="13" fontWeight="700">
            RB {Math.round(baseResistance / 1000)}kOhm
          </text>
          <text x="610" y="192" fill="#111827" fontSize="13" fontWeight="700">
            RL {loadResistance}Ohm
          </text>

          <line x1="92" y1="392" x2="92" y2="446" stroke="#ef4444" strokeWidth="3" />
          <line x1="112" y1="380" x2="112" y2="456" stroke="#ef4444" strokeWidth="6" />
          <text x="68" y="418" fill="#111827" fontSize="16" fontWeight="700">
            UBE {baseVoltage.toFixed(1)}V
          </text>
          <text x="120" y="430" fill="#ef4444" fontSize="20" fontWeight="900">
            +
          </text>
          <text x="72" y="430" fill="#ef4444" fontSize="20" fontWeight="900">
            -
          </text>

          <line x1="188" y1="418" x2="246" y2="418" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />
          <line x1="296" y1="418" x2="335" y2="418" stroke="#4b4b4b" strokeWidth="3" strokeLinecap="round" />
          <motion.line
            x1="246"
            y1="418"
            x2={active ? 296 : 278}
            y2={active ? 418 : 400}
            stroke="#4b4b4b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <text x="215" y="138" fill="#111827" fontSize="18" fontWeight="700">
            N
          </text>
          <text x="331" y="138" fill="#111827" fontSize="18" fontWeight="700">
            P
          </text>
          <text x="455" y="138" fill="#111827" fontSize="18" fontWeight="700">
            N
          </text>
          <text x="570" y="138" fill="#166534" fontSize="13" fontWeight="800">
            Doping {dopingLevel}%
          </text>

          <text x="56" y="122" fill="#4338ca" fontSize="24" fontWeight="700">
            IC
          </text>
          <text x="92" y="122" fill="#4338ca" fontSize="12" fontWeight="700">
            {formatNumber(collectorCurrentMA, 1)}mA
          </text>
          <text x="74" y="194" fill="#4f46e5" fontSize="20" fontWeight="700">
            IE
          </text>
          <text x="56" y="260" fill="#4338ca" fontSize="24" fontWeight="700">
            IB
          </text>
          <text x="92" y="260" fill="#4338ca" fontSize="12" fontWeight="700">
            {formatNumber(baseCurrentMA, 2)}mA
          </text>

          <text x="108" y="222" fill="#333" fontSize="16" fontWeight="700">
            E
          </text>
          <text x="346" y="318" fill="#333" fontSize="16" fontWeight="700">
            B
          </text>
          <text x="540" y="222" fill="#333" fontSize="16" fontWeight="700">
            C
          </text>

          {Array.from({ length: emitterDotCount }).map((_, i) => {
            const x = 160 + (i % 7) * 18;
            const y = 170 + Math.floor(i / 7) * 13;
            return (
              <circle
                key={`left-${dopingLevel}-${i}`}
                cx={x}
                cy={y}
                r={nDotRadius}
                fill="#111827"
                opacity={0.45 + gainLevel * 0.55}
              />
            );
          })}

          {Array.from({ length: baseDotCount }).map((_, i) => {
            const x = 302 + (i % 4) * 18;
            const y = 168 + Math.floor(i / 4) * 15;
            return (
              <circle
                key={`mid-${dopingLevel}-${i}`}
                cx={x}
                cy={y}
                r={pDotRadius}
                fill="#fffef7"
                stroke="#7c6500"
                strokeWidth="1"
                opacity={0.55 + gainLevel * 0.45}
              />
            );
          })}

          {Array.from({ length: collectorDotCount }).map((_, i) => {
            const x = 400 + (i % 7) * 18;
            const y = 170 + Math.floor(i / 7) * 13;
            return (
              <circle
                key={`right-${dopingLevel}-${i}`}
                cx={x}
                cy={y}
                r={nDotRadius}
                fill="#111827"
                opacity={0.45 + gainLevel * 0.55}
              />
            );
          })}

          {flowActive && transistorType === "NPN" && (
            <ElectronFlow
              active={flowActive}
              intensity={flowIntensity}
            />
          )}

          {flowActive && transistorType === "NPN" &&
            Array.from({ length: 4 + Math.round(flowIntensity * 5) }).map((_, i) => (
              <motion.circle
                key={`base-current-${dopingLevel}-${i}`}
                r="3.5"
                fill="#ef4444"
                initial={{ x: 335, y: 410, opacity: 0 }}
                animate={{
                  y: [410, 350, 285],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 2.2 - flowIntensity * 0.8,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "linear",
                }}
              />
            ))}

          {flowActive && transistorType === "PNP" && (
            <HoleFlow
              active={flowActive}
              intensity={flowIntensity}
            />
          )}
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
            Emitter
          </p>
          <p className="mt-2 text-sm text-slate-700">
            The emitter is heavily doped and supplies charge carriers.
          </p>
          <p className="mt-3 text-xl font-black text-green-700">
            Beta {formatNumber(transistorGain, 0)}
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-700">
            Base
          </p>
          <p className="mt-2 text-sm text-slate-700">
            The base is very thin and lightly doped, so a small base current can
            control a larger collector current.
          </p>
          <p className="mt-3 text-xl font-black text-yellow-700">
            IB {formatNumber(baseCurrentMA, 2)}mA
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            Collector
          </p>
          <p className="mt-2 text-sm text-slate-700">
            The collector gathers the emitted carriers and carries the output
            current.
          </p>
          <p className="mt-3 text-xl font-black text-blue-700">
            IC {formatNumber(collectorCurrentMA, 1)}mA
          </p>
        </div>
      </div>
    </div>
  );
}
