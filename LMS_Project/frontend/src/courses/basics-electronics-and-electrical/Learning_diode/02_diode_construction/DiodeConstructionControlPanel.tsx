"use client";

import type { LayerView } from "./types";

const VIEW_OPTIONS: {
  value: LayerView;
  label: string;
  note: string;
  tone: string;
}[] = [
  {
    value: "basic",
    label: "Basic Structure",
    note: "See the raw P-side and N-side material blocks first.",
    tone: "border-slate-300 bg-slate-50 text-slate-800",
  },
  {
    value: "doping",
    label: "Show Doping",
    note: "Reveal the majority carriers in both semiconductor regions.",
    tone: "border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    value: "junction",
    label: "PN Junction",
    note: "Focus on the depletion region at the meeting boundary.",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    value: "formation",
    label: "Formation",
    note: "Animate diffusion, recombination, and barrier creation.",
    tone: "border-violet-200 bg-violet-50 text-violet-800",
  },
];

export default function DiodeConstructionControlPanel({
  animationSpeed,
  onAnimationSpeedChange,
  onReset,
  onShowCarriersChange,
  onShowLabelsChange,
  onShowProbeTargetsChange,
  view,
  onViewChange,
  showCarriers,
  showLabels,
  showProbeTargets,
}: {
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  onReset: () => void;
  onShowCarriersChange: (value: boolean) => void;
  onShowLabelsChange: (value: boolean) => void;
  onShowProbeTargetsChange: (value: boolean) => void;
  view: LayerView;
  onViewChange: (view: LayerView) => void;
  showCarriers: boolean;
  showLabels: boolean;
  showProbeTargets: boolean;
}) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-700">
          Control Panel
        </p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">
          Diode Views
        </h2>
      </div>

      <div className="mt-6 grid gap-3">
        {VIEW_OPTIONS.map((option) => {
          const active = option.value === view;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onViewChange(option.value)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active
                  ? `${option.tone} ring-2 ring-offset-0 ring-slate-300`
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-extrabold uppercase tracking-[0.18em]">
                {option.label}
              </p>
              <p className="mt-2 text-sm leading-6 opacity-90">{option.note}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
            Display Options
          </p>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Show Labels</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Keep terminals and annotations visible.</p>
            </div>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(event) => onShowLabelsChange(event.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
          </label>

          <label className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Show Carriers</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Display holes, electrons, and diffusion activity.</p>
            </div>
            <input
              type="checkbox"
              checked={showCarriers}
              onChange={(event) => onShowCarriersChange(event.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
          </label>

          <label className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Probe Targets</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Show clickable verification points for anode, cathode, and junction zones.</p>
            </div>
            <input
              type="checkbox"
              checked={showProbeTargets}
              onChange={(event) => onShowProbeTargetsChange(event.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">Animation Speed</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Tune how fast carrier motion is shown.</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                {animationSpeed.toFixed(1)}x
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                <span>Slow</span>
                <span>Fast</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={animationSpeed}
                onChange={(event) => onAnimationSpeedChange(Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
