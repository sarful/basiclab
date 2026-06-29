"use client";

import { graphPath } from "./mosfetSimulatorLogic";

type SignalChartProps = {
  color: string;
  label: string;
  max: number;
  values: number[];
};

function SignalChart({ color, label, max, values }: SignalChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <svg viewBox="0 0 240 110" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="240" height="110" rx="14" fill="#fbfbfb" />
        {Array.from({ length: 5 }).map((_, index) => (
          <line
            key={index}
            x1="10"
            y1={15 + index * 20}
            x2="230"
            y2={15 + index * 20}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        <path d={graphPath(values, 12, 12, 216, 82, max)} fill="none" stroke={color} strokeWidth="3" />
      </svg>
    </div>
  );
}

export type MosfetDualChannelOscilloscopeProps = {
  autoScale: boolean;
  drainCurrent: number;
  gateVoltage: number;
  running: boolean;
  setAutoScale: (value: boolean) => void;
  setRunning: (value: boolean) => void;
};

export default function MosfetDualChannelOscilloscope({
  autoScale,
  drainCurrent,
  gateVoltage,
  running,
  setAutoScale,
  setRunning,
}: MosfetDualChannelOscilloscopeProps) {
  const vMax = autoScale ? Math.max(10, gateVoltage + 1) : 10;
  const iMax = autoScale ? Math.max(100, drainCurrent * 1200) : 250;

  const vgsWave = Array.from({ length: 48 }, (_, index) =>
    gateVoltage + (running ? Math.sin(index / 2) * 0.25 : 0)
  );
  const idWave = Array.from({ length: 48 }, (_, index) =>
    drainCurrent * 1000 + (running ? Math.sin(index / 1.8) * drainCurrent * 180 : 0)
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
            Dual Channel Oscilloscope
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Watch gate voltage and drain current change while you tune the live controls.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRunning(!running)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
          >
            {running ? "Pause" : "Run"}
          </button>
          <button
            type="button"
            onClick={() => setAutoScale(!autoScale)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
          >
            Auto {autoScale ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <SignalChart color="#1d72e8" label="CH1 VGS" max={vMax} values={vgsWave} />
        <SignalChart color="#0f7a25" label="CH2 ID" max={iMax} values={idWave} />
      </div>
    </section>
  );
}
