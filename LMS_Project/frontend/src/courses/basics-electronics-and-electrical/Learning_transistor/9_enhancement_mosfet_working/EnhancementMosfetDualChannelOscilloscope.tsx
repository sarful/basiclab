"use client";

import { graphPath } from "./enhancementMosfetLogic";

type EnhancementMosfetDualChannelOscilloscopeProps = {
  gateVoltage: number;
  drainCurrent: number;
  running: boolean;
  autoScale: boolean;
  setRunning: (value: boolean) => void;
  setAutoScale: (value: boolean) => void;
};

export default function EnhancementMosfetDualChannelOscilloscope({
  gateVoltage,
  drainCurrent,
  running,
  autoScale,
  setRunning,
  setAutoScale,
}: EnhancementMosfetDualChannelOscilloscopeProps) {
  const vMax = autoScale ? Math.max(10, gateVoltage + 1) : 10;
  const iMax = autoScale ? Math.max(100, drainCurrent * 1200) : 250;
  const vgsWave = Array.from({ length: 48 }, (_, i) =>
    gateVoltage + (running ? Math.sin(i / 2) * 0.25 : 0)
  );
  const idWave = Array.from({ length: 48 }, (_, i) =>
    drainCurrent * 1000 + (running ? Math.sin(i / 1.8) * drainCurrent * 180 : 0)
  );

  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
            Dual Channel Oscilloscope
          </p>
          <h3 className="mt-2 text-lg font-black text-slate-900">Waveform Monitor</h3>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <button onClick={() => setRunning(!running)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700">
            {running ? "Pause" : "Run"}
          </button>
          <button onClick={() => setAutoScale(!autoScale)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700">
            Auto {autoScale ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <svg viewBox="0 0 260 140" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="12" y1={20 + i * 24} x2="248" y2={20 + i * 24} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            <path d={graphPath(vgsWave, 16, 22, 224, 92, vMax)} fill="none" stroke="#1d72e8" strokeWidth="3" />
          </svg>
          <p className="mt-3 text-sm font-bold text-blue-700">CH1 VGS</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <svg viewBox="0 0 260 140" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="12" y1={20 + i * 24} x2="248" y2={20 + i * 24} stroke="#e5e7eb" strokeWidth="1" />
            ))}
            <path d={graphPath(idWave, 16, 22, 224, 92, iMax)} fill="none" stroke="#0f7a25" strokeWidth="3" />
          </svg>
          <p className="mt-3 text-sm font-bold text-emerald-700">CH2 ID</p>
        </div>
      </div>
    </section>
  );
}
