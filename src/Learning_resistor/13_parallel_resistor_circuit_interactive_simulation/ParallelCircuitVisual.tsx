"use client";

import { motion } from "framer-motion";

import { clamp, equivalentParallel, formatCurrent, formatResistance } from "./logic";
import type { BranchItem } from "./types";

export function ParallelCircuitVisual({
  supplyVoltage,
  branches,
}: {
  supplyVoltage: number;
  branches: BranchItem[];
}) {
  const eqResistance = equivalentParallel(branches);
  const branchCurrents = branches.map((item) => supplyVoltage / item.value);
  const totalCurrent = branchCurrents.reduce((sum, value) => sum + value, 0);
  const flowLevel = clamp(totalCurrent / 0.08, 0.08, 1);
  const mainWireWidth = 5 + flowLevel * 6;
  const branchYs = branches.map((_, index) => 110 + index * 74);
  const topY = branchYs[0];
  const bottomY = branchYs[branchYs.length - 1];
  const electronSpeed = Math.max(0.55, 2.4 - flowLevel * 1.5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Parallel Resistor Circuit Visualizer</h2>
          <p className="text-xs text-slate-600">
            In a parallel circuit, voltage stays the same across each branch while
            current divides.
          </p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          PARALLEL CONNECTION
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 840 430" className="h-auto w-[840px] sm:w-full">
          <defs>
            <filter id="parallelGlow" x="-45%" y="-55%" width="190%" height="210%">
              <feGaussianBlur stdDeviation={3 + flowLevel * 7} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text
            x="420"
            y="28"
            textAnchor="middle"
            fill="#334155"
            fontSize="14"
            fontWeight="800"
          >
            Same voltage across each branch | Conventional current: left → right |
            Electron flow: right → left
          </text>

          <rect
            x="42"
            y="160"
            width="90"
            height="92"
            rx="14"
            fill="#0f172a"
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <text
            x="87"
            y="196"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="16"
            fontWeight="800"
          >
            DC
          </text>
          <text
            x="87"
            y="222"
            textAnchor="middle"
            fill="#7dd3fc"
            fontSize="14"
            fontWeight="800"
          >
            {supplyVoltage}V
          </text>
          <text
            x="87"
            y="272"
            textAnchor="middle"
            fill="#334155"
            fontSize="12"
            fontWeight="700"
          >
            Supply
          </text>

          <path
            d="M132 186 H190"
            stroke="#64748b"
            strokeWidth={mainWireWidth}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M190 ${topY} V${bottomY}`}
            stroke="#64748b"
            strokeWidth={mainWireWidth}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
          />

          <path
            d={`M650 ${topY} V${bottomY}`}
            stroke="#64748b"
            strokeWidth={mainWireWidth}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d={`M650 ${bottomY + 40} H650 V340 H87 V252`}
            stroke="#64748b"
            strokeWidth={mainWireWidth}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="round"
          />

          {branches.map((_, index) => {
            const y = branchYs[index];
            return (
              <path
                key={`return-${index}`}
                d={`M650 ${y} V${bottomY + 40}`}
                stroke="#64748b"
                strokeWidth={mainWireWidth - 1}
                fill="none"
                strokeLinecap="square"
              />
            );
          })}

          {branches.map((branch, index) => {
            const y = branchYs[index];
            const current = branchCurrents[index];
            const branchFlow = clamp(
              current / Math.max(totalCurrent, 0.000001),
              0.12,
              1,
            );
            const wireWidth = 4 + branchFlow * 7;
            const electronCount = Math.min(
              Math.max(Math.round(branchFlow * 16), 4),
              18,
            );

            return (
              <g key={branch.id}>
                <path
                  d={`M190 ${y} H300`}
                  stroke="#64748b"
                  strokeWidth={wireWidth}
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
                <path
                  d={`M490 ${y} H650`}
                  stroke="#64748b"
                  strokeWidth={wireWidth}
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
                <motion.rect
                  x="300"
                  y={y - 26}
                  width="190"
                  height="52"
                  rx="30"
                  fill={branchFlow > 0.45 ? "#fb923c" : "#f2c879"}
                  stroke="#111827"
                  strokeWidth="3"
                  filter="url(#parallelGlow)"
                  animate={{ opacity: [0.94, 1, 0.94] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                <rect x="330" y={y - 26} width="10" height="52" fill="#ef4444" />
                <rect x="378" y={y - 26} width="10" height="52" fill="#111827" />
                <rect x="426" y={y - 26} width="10" height="52" fill="#f59e0b" />
                <rect x="468" y={y - 26} width="10" height="52" fill="#d4af37" />
                <text
                  x="400"
                  y={y - 42}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="12"
                  fontWeight="800"
                >
                  R{index + 1}
                </text>
                <text
                  x="395"
                  y={y + 42}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="12"
                  fontWeight="700"
                >
                  {formatResistance(branch.value)}
                </text>
                <text
                  x="585"
                  y={y - 10}
                  textAnchor="middle"
                  fill="#16a34a"
                  fontSize="12"
                  fontWeight="900"
                >
                  I{index + 1} = {formatCurrent(current)}
                </text>
                <text
                  x="250"
                  y={y - 10}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="12"
                  fontWeight="900"
                >
                  V = {supplyVoltage}V
                </text>

                {Array.from({ length: electronCount }).map((_, eIndex) => (
                  <motion.circle
                    key={`parallel-electron-${branch.id}-${eIndex}`}
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
                      delay: eIndex * (electronSpeed / electronCount),
                    }}
                    style={{ offsetPath: `path('M650 ${y} H490 H300 H190')` }}
                  />
                ))}
              </g>
            );
          })}

          <text
            x="195"
            y="78"
            textAnchor="middle"
            fill="#2563eb"
            fontSize="12"
            fontWeight="700"
          >
            Conventional current splits →
          </text>
          <text
            x="650"
            y="78"
            textAnchor="middle"
            fill="#16a34a"
            fontSize="12"
            fontWeight="700"
          >
            ← Electron flow starts
          </text>

          <g transform="translate(150 390)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Equivalent Resistance
            </text>
            <rect x="0" y="12" width="540" height="12" rx="6" fill="#e2e8f0" />
            <motion.rect
              x="0"
              y="12"
              height="12"
              rx="6"
              fill="#8b5cf6"
              animate={{ width: 540 * clamp(eqResistance / 10000, 0.04, 1) }}
            />
            <text
              x="540"
              y="42"
              textAnchor="end"
              fill="#64748b"
              fontSize="11"
            >
              Req = {formatResistance(eqResistance)}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Equivalent Resistance
          </p>
          <p className="mt-1 text-sm text-slate-700">
            1/Req = {branches.map((_, index) => `1/R${index + 1}`).join(" + ")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Req = {formatResistance(eqResistance)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Same Voltage
          </p>
          <p className="mt-1 text-sm text-slate-700">V1 = V2 = V3 = Vs</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Each branch = {supplyVoltage}V
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            Total Current
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Itotal = {branchCurrents.map((_, index) => `I${index + 1}`).join(" + ")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Itotal = {formatCurrent(totalCurrent)}
          </p>
        </div>
      </div>
    </div>
  );
}
