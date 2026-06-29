"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import RelaySPDT from "./RelaySPDT";

export default function RelayLessonEighteenEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 06">
      <section className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Relay Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Relay SPDT
          </h1>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-950">
            SPDT Relay
          </h2>
          <div className="overflow-x-auto">
            <RelaySPDT />
          </div>
        </section>
      </section>
    </UniversalSimulationLessonShell>
  );
}
