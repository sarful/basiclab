"use client";

import { motion } from "framer-motion";

import ACFlowDots from "./ACFlowDots";
import Coil from "./Coil";
import { clamp, computeTransformerSnapshot, formatNumber } from "./logic";

type TransformerVisualProps = {
  primaryTurns: number;
  secondaryTurns: number;
  inputVoltage: number;
  frequency: number;
};

export default function TransformerVisual({
  primaryTurns,
  secondaryTurns,
  inputVoltage,
  frequency,
}: TransformerVisualProps) {
  const { turnsRatio, outputVoltage } = computeTransformerSnapshot({
    inputVoltage,
    primaryTurns,
    secondaryTurns,
    frequency,
  });
  const isStepUp = outputVoltage > inputVoltage;
  const magneticStrength = clamp((inputVoltage / 240) * (frequency / 50), 0.1, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Transformer Magnetic Coupling Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            AC current in the primary coil creates magnetic flux, which induces
            voltage in the secondary coil.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isStepUp
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isStepUp ? "STEP-UP TRANSFORMER" : "STEP-DOWN TRANSFORMER"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 900 430" className="h-auto w-[900px] sm:w-full">
          <defs>
            <linearGradient id="coreGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          <text
            x="450"
            y="28"
            textAnchor="middle"
            fill="#334155"
            fontSize="14"
            fontWeight="800"
          >
            No electron crosses the core: primary and secondary are isolated;
            energy transfers by changing magnetic flux
          </text>

          <rect
            x="350"
            y="90"
            width="200"
            height="240"
            rx="14"
            fill="url(#coreGradient)"
            stroke="#334155"
            strokeWidth="5"
          />
          <rect
            x="400"
            y="140"
            width="100"
            height="140"
            rx="8"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="3"
          />

          <text
            x="450"
            y="210"
            textAnchor="middle"
            fill="#334155"
            fontSize="15"
            fontWeight="900"
          >
            Iron Core
          </text>

          <Coil x={285} turns={primaryTurns} color="#2563eb" />
          <Coil x={615} turns={secondaryTurns} color="#ef4444" />

          <path d="M90 225 H285" stroke="#64748b" strokeWidth="8" fill="none" />
          <path d="M90 285 H285" stroke="#64748b" strokeWidth="8" fill="none" />

          <path d="M633 225 H860" stroke="#64748b" strokeWidth="8" fill="none" />
          <path d="M633 285 H860" stroke="#64748b" strokeWidth="8" fill="none" />

          <rect x="30" y="195" width="60" height="120" rx="12" fill="#0f172a" />
          <text
            x="60"
            y="240"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="900"
          >
            AC
          </text>
          <text
            x="60"
            y="273"
            textAnchor="middle"
            fill="#7dd3fc"
            fontSize="14"
          >
            {inputVoltage}V
          </text>

          <rect x="840" y="195" width="60" height="120" rx="12" fill="#0f172a" />
          <text
            x="870"
            y="240"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="900"
          >
            OUT
          </text>
          <text
            x="870"
            y="273"
            textAnchor="middle"
            fill="#fca5a5"
            fontSize="14"
          >
            {formatNumber(outputVoltage, 1)}V
          </text>

          {Array.from({ length: 8 }).map((_, index) => (
            <motion.path
              key={index}
              d={`M ${385 + index * 8} 145 Q 450 210 ${385 + index * 8} 255`}
              stroke="#8b5cf6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 6"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1 + index * 0.1 }}
            />
          ))}

          <ACFlowDots path="M90 225 H285" color="#0ea5e9" />
          <ACFlowDots path="M90 285 H285" color="#0ea5e9" delayOffset={0.35} />
          <ACFlowDots path="M633 225 H860" color="#ef4444" delayOffset={0.15} />
          <ACFlowDots path="M633 285 H860" color="#ef4444" delayOffset={0.5} />

          <text
            x="285"
            y="62"
            textAnchor="middle"
            fill="#2563eb"
            fontSize="13"
            fontWeight="900"
          >
            Primary Turns: {primaryTurns}
          </text>
          <text
            x="285"
            y="82"
            textAnchor="middle"
            fill="#2563eb"
            fontSize="12"
            fontWeight="700"
          >
            AC current oscillates in primary coil
          </text>

          <text
            x="615"
            y="62"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="13"
            fontWeight="900"
          >
            Secondary Turns: {secondaryTurns}
          </text>
          <text
            x="615"
            y="82"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="12"
            fontWeight="700"
          >
            Induced AC current in secondary coil
          </text>

          <text
            x="450"
            y="382"
            textAnchor="middle"
            fill="#7c3aed"
            fontSize="13"
            fontWeight="900"
          >
            Turns Ratio = {secondaryTurns}:{primaryTurns} | Output ={" "}
            {formatNumber(outputVoltage, 1)}V
          </text>

          <g transform="translate(160 398)">
            <rect x="0" y="0" width="560" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect
              x="0"
              y="0"
              height="12"
              rx="6"
              fill="#8b5cf6"
              animate={{ width: 560 * magneticStrength }}
            />
            <text x="560" y="28" textAnchor="end" fill="#64748b" fontSize="11">
              Magnetic Flux Strength
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Primary Coil
          </p>
          <p className="mt-1 text-sm text-slate-700">
            AC current oscillates in the primary winding and creates a changing
            magnetic field.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {primaryTurns} Turns
          </p>
        </div>

        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Magnetic Flux
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The iron core improves magnetic flux transfer efficiency between the
            windings.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            AC Magnetic Field
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
            Secondary Coil
          </p>
          <p className="mt-1 text-sm text-slate-700">
            The secondary is a separate circuit. Magnetic flux induces AC
            voltage and current in it.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatNumber(outputVoltage, 1)}V Output
          </p>
        </div>
      </div>
    </div>
  );
}
