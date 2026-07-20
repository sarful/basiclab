"use client";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import DcToDcSsrCircuit from "./DcToDcSsrCircuit";

export default function RelayLessonFifteenEmbeddedPage() {
  const lessonPanel = (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          Relay Learning
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          DC to DC SSR Circuit
        </h1>
      </div>
      <div className="overflow-x-auto">
        <DcToDcSsrCircuit />
      </div>
    </section>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 10"
      currentLessonId={10}
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
