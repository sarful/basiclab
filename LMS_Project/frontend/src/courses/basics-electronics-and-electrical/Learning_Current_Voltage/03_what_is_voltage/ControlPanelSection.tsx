"use client";

import { motion } from "framer-motion";

import { ActivityIcon, RotateCcwIcon, SlidersHorizontalIcon } from "./icons";
import { MAX_VOLTAGE, MIN_VOLTAGE, VOLTAGE_PRESETS } from "./logic";
import { IndustrialHeader } from "./ui";

export function ControlPanelSection({
  voltage,
  pressurePercent,
  pressureLabel,
  relationText,
  onVoltageChange,
  onReset,
}: {
  voltage: number;
  pressurePercent: number;
  pressureLabel: string;
  relationText: string;
  onVoltageChange: (value: number) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
      <IndustrialHeader
        icon={<SlidersHorizontalIcon className="h-5 w-5 text-cyan-700" />}
        code="Controls"
        title="Try the controls"
        subtitle="Adjust the battery voltage and watch the push, flow, and lamp brightness change."
      />

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="voltage-slider"
            className="block text-[0.98rem] font-semibold text-slate-700"
          >
            Adjust battery voltage
          </label>
          <input
            id="voltage-slider"
            type="range"
            min={MIN_VOLTAGE}
            max={MAX_VOLTAGE}
            step="0.5"
            value={voltage}
            onChange={(event) => onVoltageChange(Number(event.target.value))}
            className="mt-2 w-full accent-cyan-600"
          />

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-cyan-600"
              animate={{ width: `${pressurePercent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Low voltage</span>
            <span className="font-semibold text-cyan-700">{voltage.toFixed(1)}V</span>
            <span>High voltage</span>
          </div>
        </div>

        <motion.div
          className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 0.35 }}
          key={pressureLabel}
        >
          <div className="flex items-start gap-3">
            <ActivityIcon className="mt-0.5 h-5 w-5 text-cyan-700" />
            <div>
              <p className="text-sm font-semibold text-cyan-900">Live relation</p>
              <p className="mt-1 text-sm leading-6 text-cyan-800">
                {voltage.toFixed(1)}V gives {pressureLabel.toLowerCase()} and about{" "}
                {pressurePercent}% push strength. {relationText}
              </p>
            </div>
          </div>
        </motion.div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Quick presets
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use these values to compare weak, medium, and strong voltage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-2">
          {VOLTAGE_PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onVoltageChange(value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                voltage === value
                  ? "border-cyan-500 bg-cyan-600 text-white shadow-md"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
              }`}
            >
              {value}V
            </button>
          ))}

          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
          >
            <div className="flex items-center justify-center gap-2">
              <RotateCcwIcon className="h-4 w-4" />
              Reset
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
