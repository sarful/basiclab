"use client";

import { DiodeAnodeCathodeDiagram } from "@/src/library";

export function DiodeLibraryReferenceSection() {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
          Library Reference
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Real diode anode and cathode view
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Use this shared library diagram to connect the schematic symbol with
          the real diode body. The anode is the positive side and the cathode is
          the band-marked negative side.
        </p>
      </div>

      <DiodeAnodeCathodeDiagram />
    </section>
  );
}
