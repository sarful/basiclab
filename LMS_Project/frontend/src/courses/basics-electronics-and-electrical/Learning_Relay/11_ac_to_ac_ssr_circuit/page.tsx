"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import AcToAcSsrCircuit from "./AcToAcSsrCircuit";

export default function RelayLessonSixteenEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 11">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Relay Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            AC to AC SSR Circuit
          </h1>
        </div>
        <div className="overflow-x-auto">
          <AcToAcSsrCircuit />
        </div>
      </section>
    </UniversalSimulationLessonShell>
  );
}
