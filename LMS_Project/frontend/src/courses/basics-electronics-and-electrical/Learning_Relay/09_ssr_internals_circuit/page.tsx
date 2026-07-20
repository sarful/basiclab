"use client";

import { useState } from "react";
import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import SsrInternalsCircuit from "./SsrInternalsCircuit";
import SsrWithCircuit from "./ssrwithckt";

type LessonNineTab = "internals" | "circuit";

const lessonNineTabs: Array<{
  id: LessonNineTab;
  label: string;
  description: string;
}> = [
  {
    id: "internals",
    label: "SSR Internals",
    description: "SSR internal opto-isolation and output switching path.",
  },
  {
    id: "circuit",
    label: "SSR With Circuit",
    description: "SSR connected with input DC control and output load circuit.",
  },
];

export default function RelayLessonFourteenEmbeddedPage() {
  const [activeTab, setActiveTab] = useState<LessonNineTab>("internals");
  const lessonPanel = (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          Relay Learning
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          SSR Internals Circuit
        </h1>
      </div>

      <div className="mb-5 rounded-3xl border border-slate-200 bg-slate-50 p-2">
        <div className="grid gap-2 sm:grid-cols-2">
          {lessonNineTabs.map((tab) => {
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-4 py-3 text-left transition ${
                  selected
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-blue-200"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
                aria-pressed={selected}
              >
                <span className="block text-sm font-black">{tab.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-5">
                  {tab.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTab === "internals" ? (
          <SsrInternalsCircuit />
        ) : (
          <div className="flex justify-center">
            <SsrWithCircuit width="100%" />
          </div>
        )}
      </div>
    </section>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 09"
      currentLessonId={9}
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
