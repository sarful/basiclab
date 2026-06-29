"use client";

import { motion } from "framer-motion";

import { fixedTypeVisuals } from "./fixedTypeVisuals";
import { clamp, formatResistance } from "./logic";
import type { FixedType } from "./types";

export function FixedResistorVisual({
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
  const SelectedVisual = fixedTypeVisuals[type.key];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Fixed Resistor Behavior Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Fixed value, tolerance, and power rating behavior for carbon,
            metal film, and wire wound resistors.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${isOverloaded ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
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

          <text
            x="380"
            y="28"
            textAnchor="middle"
            fill="#334155"
            fontSize="14"
            fontWeight="800"
          >
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

          <motion.g
            filter="url(#fixedHeatGlow)"
            animate={{ opacity: [0.96, 1, 0.96] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <SelectedVisual
              type={type}
              resistance={resistance}
              tolerance={tolerance}
              powerRating={powerRating}
              voltage={voltage}
              heatLevel={heatLevel}
            />
          </motion.g>

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
            <motion.g
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <rect
                x="310"
                y="232"
                width="140"
                height="32"
                rx="14"
                fill="#fee2e2"
                stroke="#dc2626"
              />
              <text
                x="380"
                y="253"
                textAnchor="middle"
                fill="#dc2626"
                fontSize="12"
                fontWeight="800"
              >
                May Burn
              </text>
            </motion.g>
          )}

          <text
            x="380"
            y="245"
            textAnchor="middle"
            fill="#334155"
            fontSize="13"
            fontWeight="700"
          >
            Nominal: {formatResistance(resistance)}
          </text>

          <text
            x="380"
            y="284"
            textAnchor="middle"
            fill="#64748b"
            fontSize="12"
          >
            Tolerance range: {formatResistance(minValue)} to {formatResistance(maxValue)}
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
