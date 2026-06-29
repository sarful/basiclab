"use client";

import DetailPanel from "./DetailPanel";
import DiodeTypesControlPanel from "./DiodeTypesControlPanel";
import DiodeTypesHeader from "./DiodeTypesHeader";
import { useDiodeTypesSimulation } from "./useDiodeTypesSimulation";

export default function WhatIsDiodeTypesInteractiveSimulation() {
  const simulation = useDiodeTypesSimulation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 p-3 text-slate-900 sm:p-5">
      <div className="mx-auto max-w-[1520px] space-y-4 sm:space-y-6">
        <DiodeTypesHeader />

        <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-700">Diode Library</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Available Diode Types</h2>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                Explore the diode catalog by type, compare behavior, and study where each device fits in practical electronics.
              </p>
            </div>
            <div className="w-full max-w-[260px]">
              <DiodeTypesControlPanel
                selectedId={simulation.selectedId}
                onSelectedIdChange={simulation.setSelectedId}
                diodeOptions={simulation.filteredTypes.map((diode) => ({ id: diode.id, name: diode.name }))}
              />
            </div>
          </div>

          <div className="mt-5">
            <DetailPanel diode={simulation.selectedDiode} />
          </div>
        </section>
      </div>
    </main>
  );
}
