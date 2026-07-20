"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import AcToAcSsrCircuit from "./AcToAcSsrCircuit";

export default function RelayLessonSixteenEmbeddedPage() {
  const lessonPanel = (
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
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 11"
      currentLessonId={11}
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
