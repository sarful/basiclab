import type { CurrentFlowModel } from "./currentFlow";

type CurrentFlowPanelProps = {
  model: CurrentFlowModel;
};

export default function CurrentFlowPanel({
  model,
}: CurrentFlowPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Current Flow
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900">{model.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{model.direction}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
          {model.badge}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Path
          </p>
          <p className="mt-2 text-base font-black text-slate-900">{model.path}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Carrier Logic
          </p>
          <p className="mt-2 text-base font-black text-slate-900">{model.carrier}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
            Math Model
          </p>
          <p className="mt-2 text-sm font-black text-slate-900">{model.equation}</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Current Intensity
          </p>
          <span className="text-xs font-black text-slate-700">{model.intensityLabel}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-300"
            style={{ width: model.intensityWidth }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {model.explanation}
        </p>
      </div>
    </div>
  );
}
