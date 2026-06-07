"use client";

import { QuizAccordion, type QuizAccordionItem } from "../../Learning_Current_Voltage/shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "sky" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {eyebrow}
        </div>
        <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
          {title}
        </h2>
        <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function LogicTheoryTab() {
  const quizItems: QuizAccordionItem[] = [
    {
      question: "Why is a multimeter useful for a beginner?",
      answer: "Because one tool can check several important electrical conditions without needing separate meters.",
    },
    {
      question: "What does the COM jack usually hold?",
      answer: "The black lead.",
    },
    {
      question: "What is the safest memory rule for resistance and continuity?",
      answer: "Measure them only with power off.",
    },
    {
      question: "What is the main difference between voltage mode and current mode?",
      answer: "Voltage is measured across a source or component, while current is measured in series through the path.",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic & Theory
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              What is a Multimeter
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A multimeter is a measurement tool that helps you check what a circuit is doing before you make assumptions.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, think of the multimeter as a decision tool. It tells you if voltage is present, if current is flowing, if a part has resistance, or if a path is continuous.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Main Risk" value="Wrong mode" tone="amber" />
            <ValueCard label="Core Job" value="Measure, don't guess" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>A multimeter is an electrical measuring instrument.</p>
        <p>It combines multiple functions in one device, so you can use the same tool to check voltage, current, resistance, and continuity.</p>
        <p>That is why the name starts with <strong>multi</strong>. One tool can do several measuring jobs.</p>
        <p>For a beginner, the important idea is simple: the tool is useful only when the mode, lead position, and probe placement match the job.</p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>Without a meter, a learner often guesses. Guessing leads to confusion and sometimes unsafe mistakes.</p>
        <p>A multimeter helps answer practical questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Is this battery still giving voltage?</li>
          <li>Is current actually flowing to the load?</li>
          <li>Does this resistor have the value I expect?</li>
          <li>Is this wire open or complete?</li>
        </ul>
        <p>That makes the multimeter the bridge between theory and real circuit troubleshooting.</p>
      </SectionCard>

      <SectionCard title="Main parts of a basic multimeter" eyebrow="Tool Anatomy">
        <p><strong>Display:</strong> shows the result.</p>
        <p><strong>Rotary dial:</strong> selects the job, such as voltage, current, resistance, or continuity.</p>
        <p><strong>COM jack:</strong> the normal home for the black lead.</p>
        <p><strong>Voltage or ohm jack:</strong> common red-lead jack for voltage, resistance, and continuity.</p>
        <p><strong>Current jack:</strong> special red-lead jack used only for current measurements.</p>
        <p><strong>Probes:</strong> the pointed leads that touch the test points.</p>
      </SectionCard>

      <SectionCard title="How the four common modes differ" eyebrow="Practical Logic">
        <p><strong>Voltage mode:</strong> tells you the electrical push between two points. It is measured across a source or component.</p>
        <p><strong>Current mode:</strong> tells you the flow through a path. It is measured in series, not across the source.</p>
        <p><strong>Resistance mode:</strong> tells you how much a part resists current flow. It must be checked with power off.</p>
        <p><strong>Continuity mode:</strong> tells you if a path is complete. It is also checked with power off.</p>
        <p>This is where beginners need to slow down. The tool is the same, but the job changes completely with the selected mode.</p>
      </SectionCard>

      <SectionCard title="Safety rules to remember first" eyebrow="High Priority">
        <p>Keep the black lead in COM unless the meter instructions say otherwise.</p>
        <p>Move the red lead only when the job changes.</p>
        <p>Never check voltage with the red lead still in the current jack.</p>
        <p>Never measure resistance or continuity on a powered circuit.</p>
        <p>When in doubt, stop and verify the dial, the jack, and the probe placement before touching the circuit.</p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A multimeter is one tool with multiple measuring functions.</li>
          <li>The black lead usually stays in COM.</li>
          <li>The red lead position depends on the measurement type.</li>
          <li>Voltage and current are not measured the same way.</li>
          <li>Resistance and continuity are power-off tests.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to confirm the core lesson before moving on.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
