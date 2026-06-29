"use client";

import BasicCircuitSafetyFocusGrid from "./components/BasicCircuitSafetyFocusGrid";
import BasicCircuitSafetyIntro from "./components/BasicCircuitSafetyIntro";
import BasicCircuitSafetyPracticeBoard from "./components/BasicCircuitSafetyPracticeBoard";
import BasicCircuitSafetyReadinessChecklist from "./components/BasicCircuitSafetyReadinessChecklist";

export default function BasicCircuitSafetyInteractiveSimulation() {
  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6">
        <BasicCircuitSafetyIntro />

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
          <BasicCircuitSafetyPracticeBoard />
          <BasicCircuitSafetyReadinessChecklist />
        </div>

        <div className="mt-5">
          <BasicCircuitSafetyFocusGrid />
        </div>
      </section>
    </div>
  );
}
