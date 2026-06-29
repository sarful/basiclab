"use client";

import type { BiasMode } from "./types";

export function WorkingControlsSection({
  bias,
  voltage,
  onBiasChange,
  onVoltageChange,
}: {
  bias: BiasMode;
  voltage: number;
  onBiasChange: (bias: BiasMode) => void;
  onVoltageChange: (voltage: number) => void;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
          Bias Control
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Switch the diode between forward and reverse bias, then tune the applied voltage.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onBiasChange("forward")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.14em] transition ${
            bias === "forward"
              ? "bg-emerald-600 text-white shadow-[0_10px_20px_rgba(5,150,105,0.25)]"
              : "bg-emerald-100 text-emerald-900"
          }`}
        >
          Forward Bias
        </button>
        <button
          type="button"
          onClick={() => onBiasChange("reverse")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.14em] transition ${
            bias === "reverse"
              ? "bg-rose-600 text-white shadow-[0_10px_20px_rgba(225,29,72,0.25)]"
              : "bg-rose-100 text-rose-900"
          }`}
        >
          Reverse Bias
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="voltage"
            className="text-sm font-black uppercase tracking-[0.14em] text-slate-800"
          >
            Voltage Controller
          </label>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm font-bold shadow-sm">
            {voltage.toFixed(1)}V
          </span>
        </div>
        <input
          id="voltage"
          type="range"
          min="0"
          max="12"
          step="0.1"
          value={voltage}
          onChange={(event) => onVoltageChange(Number(event.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
          <span>0V</span>
          <span>approximately 0.7V threshold</span>
          <span>12V</span>
        </div>
      </div>
    </div>
  );
}
