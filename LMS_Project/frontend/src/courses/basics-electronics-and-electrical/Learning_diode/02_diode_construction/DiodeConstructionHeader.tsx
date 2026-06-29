"use client";

import type { LayerView } from "./types";

const MODE_LABEL: Record<LayerView, string> = {
  basic: "Structure View",
  doping: "Carrier View",
  junction: "Junction View",
  formation: "Formation View",
};

export function DiodeConstructionHeader({ view }: { view: LayerView }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(239,246,255,0.85))] px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-emerald-700">
              Lesson 2
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Diode Construction
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              Explore how P-type and N-type semiconductor materials join to form a PN junction, how carriers redistribute, and why the depletion region becomes the diode&apos;s internal control barrier.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-emerald-700">
                Active Mode
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">{MODE_LABEL[view]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
