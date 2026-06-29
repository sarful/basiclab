"use client";

import GenericDiodeReferencePanel from "./GenericDiodeReferencePanel";
import BackwardDiodeReferencePanel from "./BackwardDiodeReferencePanel";
import SchottkyDiodeReferencePanel from "./SchottkyDiodeReferencePanel";
import TunnelDiodeReferencePanel from "./TunnelDiodeReferencePanel";
import ZenerDiodeReferencePanel from "./ZenerDiodeReferencePanel";
import type { DiodeType } from "./types";

export default function DetailPanel({ diode }: { diode: DiodeType }) {
  if (diode.id === "generic-diode") {
    return <GenericDiodeReferencePanel diode={diode} />;
  }

  if (diode.id === "zener-diode") {
    return <ZenerDiodeReferencePanel diode={diode} />;
  }

  if (diode.id === "schottky-diode") {
    return <SchottkyDiodeReferencePanel diode={diode} />;
  }

  if (diode.id === "backward-diode") {
    return <BackwardDiodeReferencePanel diode={diode} />;
  }

  if (diode.id === "tunnel-diode") {
    return <TunnelDiodeReferencePanel diode={diode} />;
  }

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-700">Selected Diode</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{diode.name}</h2>
          <p className="mt-1 text-base font-semibold text-slate-600">{diode.subtitle}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Symbol</p>
          <p className="mt-1 text-lg font-black text-slate-900">{diode.symbol}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Category</p>
          <p className="mt-2 text-lg font-black text-slate-900">{diode.category}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Package Style</p>
          <p className="mt-2 text-lg font-black text-slate-900">{diode.packageStyle}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Key Feature</p>
          <p className="mt-2 text-lg font-black text-slate-900">{diode.keyFeature}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-950">Forward Behavior</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">{diode.forwardBehavior}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-950">Reverse Behavior</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">{diode.reverseBehavior}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-950">Typical Use</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">{diode.typicalUse}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-950">Comparison Focus</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">{diode.comparisonFocus}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-black text-slate-950">Application Examples</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {diode.applications.map((item) => (
              <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <h3 className="text-lg font-black text-emerald-900">Teaching Note</h3>
          <p className="mt-2 text-sm leading-7 text-emerald-900">{diode.notes}</p>
        </div>
      </div>
    </section>
  );
}
