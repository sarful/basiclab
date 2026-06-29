"use client";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function graphPath(values: number[], x: number, y: number, w: number, h: number, max: number) {
  return values
    .map((value, index) => {
      const px = x + (index / Math.max(1, values.length - 1)) * w;
      const py = y + h - (clamp(value, 0, max) / max) * h;
      return `${index === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

type MosfetTypesScopePanelProps = {
  vgsHistory: number[];
  idHistory: number[];
  running: boolean;
  autoScale: boolean;
  timeScale: number;
  setRunning: (value: boolean) => void;
  setAutoScale: (value: boolean) => void;
  setTimeScale: (value: number) => void;
};

export default function MosfetTypesScopePanel({
  vgsHistory,
  idHistory,
  running,
  autoScale,
  timeScale,
  setRunning,
  setAutoScale,
  setTimeScale,
}: MosfetTypesScopePanelProps) {
  const visible = Math.max(20, Math.round(60 / timeScale));
  const vgs = vgsHistory.slice(-visible).map((value) => value + 6);
  const id = idHistory.slice(-visible);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
            Dual Channel Scope
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

      <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3">
        <svg viewBox="0 0 320 170" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 6 }).map((_, index) => (
            <g key={index}>
              <line x1="12" y1={20 + index * 24} x2="308" y2={20 + index * 24} stroke="#1e293b" />
              <line x1={20 + index * 48} y1="12" x2={20 + index * 48} y2="158" stroke="#1e293b" />
            </g>
          ))}
          <path d={graphPath(vgs, 16, 20, 288, 130, autoScale ? 12 : 15)} stroke="#2563eb" strokeWidth="2.5" fill="none" />
          <path d={graphPath(id, 16, 20, 288, 130, autoScale ? Math.max(50, Math.max(...id, 1)) : 300)} stroke="#16a34a" strokeWidth="2.5" fill="none" />
        </svg>
      </div>

      <div className="mt-4">
        <label className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-800">Time Scale</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {timeScale.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={timeScale}
            onChange={(event) => setTimeScale(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
          />
        </label>
      </div>
    </section>
  );
}
