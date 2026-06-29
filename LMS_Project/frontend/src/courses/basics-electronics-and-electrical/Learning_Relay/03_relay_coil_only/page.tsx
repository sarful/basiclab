"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import RelayInteractiveSimulation from "./RelayInteractiveSimulation";

export default function RelayLessonSixEmbeddedPage() {
  return (
    <UniversalSimulationLessonShell lessonLabel="Lesson 03">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Relay Learning
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Relay Coil Only
          </h1>
        </div>
        <div className="overflow-x-auto">
          <RelayInteractiveSimulation />
        </div>
      </section>
    </UniversalSimulationLessonShell>
  );
}
