"use client";

import { motion } from "framer-motion";

import { meterOptions } from "./logic";
import type { DiodeType, DisplayMode, MeterMode } from "./types";

export function MeterSection({
  mode,
  meterMode,
  diodeType,
  isConnected,
  reading,
  analogRotation,
  analogStatus,
  onToggleMode,
  onResetProbes,
  onSetDiodeType,
  onSetMeterMode,
}: {
  mode: DisplayMode;
  meterMode: MeterMode;
  diodeType: DiodeType;
  isConnected: boolean;
  reading: string;
  analogRotation: number;
  analogStatus: string;
  onToggleMode: () => void;
  onResetProbes: () => void;
  onSetDiodeType: (value: DiodeType) => void;
  onSetMeterMode: (value: MeterMode) => void;
}) {
  const buttonBase =
    "rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-md transition active:scale-95 hover:brightness-110 sm:px-4 sm:text-base";
  const selectedMeter = meterOptions.find((option) => option.mode === meterMode) ?? meterOptions[2];

  return (
    <section className="rounded-3xl border-4 border-gray-800 bg-gradient-to-b from-gray-700 to-gray-950 p-4 text-white shadow-2xl sm:rounded-[2rem] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-orange-300">INDUSTRIAL DMM</p>
          <h2 className="text-xl font-black sm:text-2xl">DX-900</h2>
        </div>
        <div
          className={`h-4 w-4 rounded-full ${isConnected && meterMode !== "off" ? "bg-green-400" : "bg-red-500"}`}
        />
      </div>

      {mode === "digital" ? (
        <div className="rounded-xl border border-gray-700 bg-black p-4 text-center shadow-inner sm:p-5">
          <p className="font-mono text-3xl tracking-widest text-green-400 sm:text-4xl">
            {reading} {meterMode === "diode" && reading !== "OL" && reading !== "---" && reading !== "OFF" ? "V" : ""}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-400">Digital {meterMode}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 sm:p-4">
          <div className="relative h-36 overflow-hidden rounded-t-full border-4 border-gray-300 bg-gray-100 shadow-inner sm:h-44">
            <svg viewBox="0 0 320 190" className="absolute inset-0 h-full w-full">
              <path d="M35 150 A125 125 0 0 1 285 150" fill="none" stroke="#111827" strokeWidth="3" />
              <path d="M55 150 A105 105 0 0 1 265 150" fill="none" stroke="#6b7280" strokeWidth="1.5" />
              {[-60, -40, -20, 0, 20, 40, 60].map((deg, index) => {
                const cx = 160;
                const cy = 150;
                const r1 = 105;
                const r2 = index % 2 === 0 ? 123 : 116;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = cx + r1 * Math.cos(rad);
                const y1 = cy + r1 * Math.sin(rad);
                const x2 = cx + r2 * Math.cos(rad);
                const y2 = cy + r2 * Math.sin(rad);

                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#111827"
                    strokeWidth={index % 2 === 0 ? 3 : 2}
                  />
                );
              })}
              <text x="38" y="158" fill="#111827" fontSize="13" fontWeight="700">
                OL
              </text>
              <text x="86" y="82" fill="#111827" fontSize="11">
                INF
              </text>
              <text x="145" y="47" fill="#111827" fontSize="11">
                0.7V
              </text>
              <text x="224" y="82" fill="#111827" fontSize="11">
                LOW OHM
              </text>
              <text x="258" y="158" fill="#111827" fontSize="13" fontWeight="700">
                0 OHM
              </text>
              <text x="116" y="118" fill="#2563eb" fontSize="12">
                DIODE
              </text>
              <text x="178" y="118" fill="#7c2d12" fontSize="12">
                OHM
              </text>
            </svg>
            <motion.div
              animate={{ rotate: analogRotation }}
              transition={{ type: "spring", stiffness: 130, damping: 14 }}
              className="absolute bottom-5 left-1/2 h-24 w-1 origin-bottom rounded-full bg-red-600 shadow-lg sm:bottom-6 sm:h-28"
            />
            <div className="absolute bottom-4 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-gray-600 bg-gray-900" />
          </div>
          <div className="rounded-b-xl border border-gray-700 bg-black p-3 text-center">
            <p className="font-mono text-lg text-green-400">ANALOG {meterMode.toUpperCase()}</p>
            <p className="mt-1 text-xs text-gray-400">{analogStatus}</p>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-900 p-4 shadow-inner">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Rotary Selector</p>
        <div className="relative mx-auto h-48 w-48 rounded-full border-8 border-gray-800 bg-gradient-to-br from-gray-500 to-gray-950 shadow-2xl">
          {meterOptions.map((option, index) => {
            const labelAngles = [-115, -42, 40, 112];
            const angle = labelAngles[index];
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = 96 + 78 * Math.cos(rad);
            const y = 96 + 78 * Math.sin(rad);

            return (
              <button
                key={option.mode}
                onClick={() => onSetMeterMode(option.mode)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[10px] font-black shadow ${
                  meterMode === option.mode ? "bg-orange-400 text-black" : "bg-gray-200 text-gray-900"
                }`}
                style={{ left: x, top: y }}
              >
                {option.label}
              </button>
            );
          })}

          <motion.div
            animate={{ rotate: selectedMeter.angle }}
            transition={{ type: "spring", stiffness: 130, damping: 16 }}
            className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-gray-900 bg-gradient-to-br from-gray-300 to-gray-700 shadow-xl"
          >
            <div className="absolute left-1/2 top-3 h-10 w-3 -translate-x-1/2 rounded-full bg-orange-500 shadow" />
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-950" />
          </motion.div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={onToggleMode} className={`${buttonBase} bg-green-700`}>
          {mode === "digital" ? "Analog" : "Digital"}
        </button>
        <button onClick={onResetProbes} className={`${buttonBase} bg-gray-700`}>
          Probe Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="text-sm font-semibold text-gray-300">
          Fault Condition
          <select
            value={diodeType}
            onChange={(event) => onSetDiodeType(event.target.value as DiodeType)}
            className="mt-1 w-full rounded-lg border border-gray-500 bg-gray-200 px-3 py-2 text-black shadow-inner"
          >
            <option value="good">Good Diode</option>
            <option value="short">Shorted Diode</option>
            <option value="open">Open Diode</option>
          </select>
        </label>
      </div>
    </section>
  );
}
