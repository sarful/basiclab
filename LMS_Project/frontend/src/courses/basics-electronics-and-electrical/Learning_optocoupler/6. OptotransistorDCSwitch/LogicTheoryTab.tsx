"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "violet" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow = "Course Module",
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />
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
      question: "What is the optotransistor DC switch lesson about?",
      answer:
        "This lesson explains how an optocoupler with a transistor-type output can use a low-voltage DC control signal to switch a separate DC output circuit.",
    },
    {
      question: "Why is this lesson important?",
      answer:
        "Because it shows a practical isolated DC switching application where the input side and output side use different supplies.",
    },
    {
      question: "What is the key beginner idea?",
      answer:
        "A small input signal on one side can control a different DC load circuit on the other side without direct electrical connection.",
    },
    {
      question: "What role does the optotransistor play here?",
      answer:
        "It acts as the output-side switching element that turns the output path on after receiving optical energy from the input LED.",
    },
    {
      question: "Why are two different DC sources shown?",
      answer:
        "They show that the control circuit and the output circuit can stay electrically separate while still transferring switching information.",
    },
    {
      question: "What is the main takeaway?",
      answer:
        "An optotransistor-based optocoupler can safely isolate and control one DC circuit from another DC circuit.",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic &amp; Theory
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Optotransistor DC Switch
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how an optotransistor-based optocoupler can
              use a 5V control side to switch a separate 12V DC output circuit.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that one DC circuit controls another DC circuit
              through light-based isolation.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This is one of the clearest practical examples of isolated DC
              switching.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Side" value="5V Control" tone="emerald" />
            <ValueCard label="Output Side" value="12V DC Load" tone="violet" />
            <ValueCard label="Main Function" value="Isolated Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is an optotransistor DC switch?" eyebrow="Topic Overview">
        <p>
          An optotransistor DC switch is a circuit where the output transistor of
          an optocoupler controls a DC output path after receiving light from the
          input LED side.
        </p>

        <p>
          The input side can use one DC source, while the output side can use a
          separate DC source.
        </p>

        <p>
          So the lesson demonstrates isolated DC-to-DC control behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson practical?" eyebrow="Real Circuit Use">
        <p>
          Many real electronic systems need a low-voltage controller to switch a
          different DC supply or load safely.
        </p>

        <p>
          This lesson shows how that can be done without direct electrical
          connection between the two sides.
        </p>

        <p>
          That makes the topic highly useful for control-interface learning.
        </p>
      </SectionCard>

      <SectionCard title="What happens on the input side?" eyebrow="Input Action">
        <p>
          The input side uses a small DC source, switch, and resistor to drive
          the internal LED of the optocoupler.
        </p>

        <p>
          When the input current flows, the LED turns on and emits light inside
          the optocoupler.
        </p>

        <p>
          This is the starting point of the switching process.
        </p>
      </SectionCard>

      <SectionCard title="What happens on the output side?" eyebrow="Output Action">
        <p>
          The light reaches the output optotransistor and makes it conduct.
        </p>

        <p>
          Once that output transistor turns on, current can flow in the separate
          DC output circuit.
        </p>

        <p>
          In this example, the output side powers an indicator LED path.
        </p>
      </SectionCard>

      <SectionCard title="Why are the 5V and 12V supplies separate?" eyebrow="Isolation Meaning">
        <p>
          The separate supplies show that the control side and the output side do
          not need to share the same power source.
        </p>

        <p>
          The switching information crosses by light, not by direct electrical
          wiring.
        </p>

        <p>
          This is one of the most important real-world advantages of
          optocouplers.
        </p>
      </SectionCard>

      <SectionCard title="Why is an optotransistor useful here?" eyebrow="Output Device Choice">
        <p>
          The optotransistor gives a strong and practical transistor-style output
          response for DC circuits.
        </p>

        <p>
          That makes it suitable for switching indicators, logic interfaces, and
          other DC control tasks.
        </p>

        <p>
          It is one of the most common output devices used in optocouplers.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember this lesson is to track the two separate
          DC sides.
        </p>

        <p>
          The 5V input side sends light, and the 12V output side turns on
          through the optotransistor.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an optotransistor optocoupler can isolate one DC
          supply from another while still transferring switching control.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>This lesson shows isolated DC switching with an optotransistor output.</li>
          <li>The input side uses one DC source and the output side uses another.</li>
          <li>The LED side sends light when input current flows.</li>
          <li>The optotransistor turns on the output-side DC path.</li>
          <li>The two circuits stay electrically separate.</li>
          <li>This is a practical example of DC control isolation.</li>
          <li>The main idea is DC-to-DC switching through optical coupling.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
