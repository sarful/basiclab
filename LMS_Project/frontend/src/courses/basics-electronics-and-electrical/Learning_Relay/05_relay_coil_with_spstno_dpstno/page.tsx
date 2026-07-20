"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import RelayCoilWithSPSTNO from "./RelayCoilWithSPSTNO";

export default function RelayLessonEightEmbeddedPage() {
  const lessonPanel = (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          Relay Learning
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Relay Coil with SPST NO
        </h1>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black text-slate-950">SPST NO</h2>
        <div className="overflow-x-auto">
          <RelayCoilWithSPSTNO />
        </div>
      </section>
    </section>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 05"
      currentLessonId={5}
      track="relay"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
      tabs={[
        { id: "logic", label: "Logic & Theory" },
        { id: "logic_bn", label: "Logic & Theory (Bangla)" },
        { id: "lesson", label: "Simulation" },
      ]}
    >
      {lessonPanel}
    </UniversalSimulationLessonShell>
  );
}
