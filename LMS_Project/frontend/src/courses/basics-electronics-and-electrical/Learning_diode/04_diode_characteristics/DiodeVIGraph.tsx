"use client";

import { motion } from "framer-motion";

import { buildDiodeVICurvePath, currentToY, getDiodeVIState, VI_CHART, voltageToX } from "./diodeVILogic";
import type { DiodeBiasMode, DiodeMode } from "./diodeVITypes";

export default function DiodeVIGraph({
  biasMode,
  currentScale,
  diodeMode,
  voltage,
}: {
  biasMode: DiodeBiasMode;
  currentScale: number;
  diodeMode: DiodeMode;
  voltage: number;
}) {
  const state = getDiodeVIState({ biasMode, currentScale, diodeMode, voltage });
  const curvePath = buildDiodeVICurvePath({ biasMode, currentScale, diodeMode });
  const pointX = voltageToX(state.voltage);
  const pointY = currentToY(state.currentMA);
  const zeroX = voltageToX(0);
  const zeroY = currentToY(0);
  const thresholdX = voltageToX(state.thresholdVoltage);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Graph Panel
          </p>
          <h3 className="text-2xl font-black text-slate-950">Dynamic V-I Plotter</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
          {biasMode === "forward" ? "Forward Region" : "Reverse Region"}
        </span>
      </div>

      <svg viewBox="0 0 560 360" className="h-auto min-h-[360px] w-full" role="img" aria-label="Dynamic diode VI plotter">
        <rect x="42" y="28" width="470" height="285" rx="20" fill="#f8fafc" stroke="#e2e8f0" />

        {[-12, -6, 0, 6, 12].map((tick) => {
          const x = voltageToX(tick);
          return (
            <g key={tick}>
              <line x1={x} y1={VI_CHART.y} x2={x} y2={VI_CHART.zeroY} stroke="#e2e8f0" strokeDasharray="4 6" />
              <text x={x} y="292" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
                {tick}V
              </text>
            </g>
          );
        })}

        {[-25, -10, 0, 10, 25].map((tick) => {
          const y = currentToY(tick);
          return (
            <g key={tick}>
              <line x1={VI_CHART.x} y1={y} x2={VI_CHART.x + VI_CHART.width} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
              <text x="58" y={y + 4} textAnchor="end" fontSize="12" fontWeight="800" fill="#475569">
                {tick}
              </text>
            </g>
          );
        })}

        <line x1={VI_CHART.x} y1={zeroY} x2={VI_CHART.x + VI_CHART.width + 18} y2={zeroY} stroke="#0f172a" strokeWidth="2.5" />
        <line x1={zeroX} y1={VI_CHART.zeroY} x2={zeroX} y2={VI_CHART.y - 18} stroke="#0f172a" strokeWidth="2.5" />

        <line x1={thresholdX} y1={VI_CHART.y} x2={thresholdX} y2={VI_CHART.zeroY} stroke="#f97316" strokeWidth="2" strokeDasharray="7 6" />
        <text x={thresholdX + 8} y="64" fontSize="12" fontWeight="900" fill="#c2410c">
          Knee {state.thresholdVoltage.toFixed(2)}V
        </text>

        <path d={curvePath} fill="none" stroke="#bfdbfe" strokeWidth="10" strokeLinecap="round" opacity="0.42" />
        <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />

        <motion.line
          x1={pointX}
          y1={zeroY}
          x2={pointX}
          y2={pointY}
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          animate={{ x1: pointX, x2: pointX, y2: pointY }}
          transition={{ duration: 0.2 }}
        />
        <motion.line
          x1={zeroX}
          y1={pointY}
          x2={pointX}
          y2={pointY}
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          animate={{ y1: pointY, y2: pointY, x2: pointX }}
          transition={{ duration: 0.2 }}
        />
        <motion.circle
          cx={pointX}
          cy={pointY}
          r="8"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="3"
          animate={{ cx: pointX, cy: pointY }}
          transition={{ duration: 0.2 }}
        />
      </svg>
    </div>
  );
}
