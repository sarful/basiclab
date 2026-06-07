"use client";

import { motion } from "framer-motion";

import { ColorBand } from "./ColorBand";
import { CurrentFlowAnimation } from "./CurrentFlowAnimation";
import { formatResistance, multiplierText } from "./logic";
import type { DigitColor, MultiplierColor, TempCoeff, ToleranceColor } from "./types";

export function VisualPanelSection({
  mode,
  b1,
  b2,
  b3,
  mult,
  tol,
  tc,
  resistance,
  currentDisplay,
  currentFormula,
  inlineExplanation,
  selectedRows,
  current,
  voltage,
}: {
  mode: 4 | 5 | 6;
  b1: DigitColor;
  b2: DigitColor;
  b3: DigitColor;
  mult: MultiplierColor;
  tol: ToleranceColor;
  tc: TempCoeff;
  resistance: number;
  currentDisplay: string;
  currentFormula: string;
  inlineExplanation: string;
  selectedRows: Array<{ band: string; role: string; color: string; value: string | number; hex: string }>;
  current: number;
  voltage: number;
}) {
  const significant = mode === 4 ? b1.value * 10 + b2.value : b1.value * 100 + b2.value * 10 + b3.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 text-center shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
          <h2 className="mb-2 font-semibold text-slate-950">Interactive Resistor</h2>
          <p className="mb-3 text-xs text-slate-500">Hover over each color band to see structured explanation.</p>

          <svg viewBox="0 0 520 170" className="mx-auto w-full max-w-md overflow-visible drop-shadow-sm">
            <defs>
              <linearGradient id="bodyGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#F5D9A8" />
                <stop offset="55%" stopColor="#E8C48F" />
                <stop offset="100%" stopColor="#D9AD73" />
              </linearGradient>
            </defs>
            <line x1="0" y1="80" x2="95" y2="80" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
            <line x1="425" y1="80" x2="520" y2="80" stroke="#6b7280" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M100 80 C100 35 135 25 165 35 L355 35 C385 25 420 35 420 80 C420 125 385 135 355 125 L165 125 C135 135 100 125 100 80 Z"
              fill="url(#bodyGradient)"
              stroke="#111827"
              strokeWidth="3"
            />
            <ColorBand x={135} color={b1.hex} label="1" title="Band 1 (Digit)" colorName={b1.name} valueText={`${b1.value}`} />
            <ColorBand x={175} color={b2.hex} label="2" title="Band 2 (Digit)" colorName={b2.name} valueText={`${b2.value}`} />
            {mode > 4 && <ColorBand x={215} color={b3.hex} label="3" title="Band 3 (Digit)" colorName={b3.name} valueText={`${b3.value}`} />}
            <ColorBand x={255} color={mult.hex} label="×" title="Multiplier Band" colorName={mult.name} valueText={multiplierText(mult.multiplier)} />
            <ColorBand x={315} color={tol.hex} label="Tol" title="Tolerance Band" colorName={tol.name} valueText={tol.tolerance} />
            {mode === 6 && <ColorBand x={355} color={tc.hex} label="TC" title="Temperature Coefficient" colorName={tc.name} valueText={tc.ppm} />}
          </svg>

          <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
            {inlineExplanation}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-100 p-4 shadow-inner">
            <p className="text-sm text-slate-600">Resistance Value</p>
            <motion.p key={resistance} initial={{ scale: 0.94, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-bold text-slate-950">
              {formatResistance(resistance)}
            </motion.p>
            <p className="text-sm">Tolerance: {tol.tolerance}</p>
            {mode === 6 && <p className="text-sm">Temperature Coefficient: {tc.ppm}</p>}
            <p className="mt-2 text-xs text-slate-500">Significant digits: {significant} × {mult.multiplier.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
          <h2 className="mb-4 text-center font-semibold text-slate-950">Real-time Color to Number Mapping</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-700">
                  <th className="p-3">Band</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Color</th>
                  <th className="p-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row) => (
                  <tr key={row.band} className="border-t transition hover:bg-blue-50">
                    <td className="p-3 font-semibold text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: row.hex }} />
                        {row.band}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{row.role}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
                        <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: row.hex }} />
                        {row.color}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-950">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center">
            <h2 className="mb-2 font-semibold">Current</h2>
            <motion.p key={currentDisplay} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold text-blue-700">
              {currentDisplay}
            </motion.p>
            <p className="mt-1 text-xs text-slate-500">{currentFormula}</p>
          </div>
        </div>
      </div>

      <CurrentFlowAnimation current={current} currentDisplay={currentDisplay} voltage={voltage} resistance={resistance} />
    </div>
  );
}
