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
      question: "Why do we study optocoupler pins separately?",
      answer:
        "Because understanding the pin functions is the first practical step in wiring and reading an optocoupler correctly.",
    },
    {
      question: "Which pins usually belong to the input side?",
      answer:
        "In a common 4-pin optocoupler, Pin 1 and Pin 2 usually belong to the LED input side.",
    },
    {
      question: "Which pins usually belong to the output side?",
      answer:
        "Pin 4 and Pin 3 usually belong to the output transistor side, often collector and emitter respectively.",
    },
    {
      question: "What does Pin 1 normally do?",
      answer:
        "Pin 1 is commonly the anode of the input LED, where the input current begins.",
    },
    {
      question: "What does Pin 2 normally do?",
      answer:
        "Pin 2 is commonly the cathode of the input LED, where the input current returns.",
    },
    {
      question: "What is the main beginner takeaway?",
      answer:
        "The input pins drive the LED, and the output pins belong to the light-controlled transistor side.",
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
              Optocoupler Pins
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains the pin functions of a common optocoupler and
              how those pins are divided between the input side and output side.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that the LED side and transistor side use
              different pins for different jobs.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Learning the pin layout makes optocoupler wiring much easier and
              safer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Pins" value="1 and 2" tone="emerald" />
            <ValueCard label="Output Pins" value="4 and 3" tone="violet" />
            <ValueCard label="Main Goal" value="Correct Wiring" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why learn the pins first?" eyebrow="Practical Start">
        <p>
          Before using an optocoupler in a circuit, the learner must know which
          pin belongs to which internal section.
        </p>

        <p>
          Without that knowledge, it is easy to connect the component
          incorrectly.
        </p>

        <p>
          So pin identification is one of the first practical skills in this
          topic.
        </p>
      </SectionCard>

      <SectionCard title="How are the pins divided?" eyebrow="Input vs Output">
        <p>
          In a common 4-pin optocoupler, the pins are divided into two groups.
        </p>

        <p>
          One group belongs to the input LED side, and the other group belongs
          to the output phototransistor side.
        </p>

        <p>
          This division reflects the two isolated halves of the optocoupler.
        </p>
      </SectionCard>

      <SectionCard title="What do Pin 1 and Pin 2 do?" eyebrow="Input LED Side">
        <p>
          Pin 1 is usually the anode of the internal LED, and Pin 2 is usually
          the cathode.
        </p>

        <p>
          When input current flows from Pin 1 to Pin 2, the LED turns on and
          emits light.
        </p>

        <p>
          So these two pins form the signal entry side of the optocoupler.
        </p>
      </SectionCard>

      <SectionCard title="What do Pin 4 and Pin 3 do?" eyebrow="Output Side">
        <p>
          Pin 4 and Pin 3 commonly belong to the phototransistor output side.
        </p>

        <p>
          In many basic diagrams, Pin 4 is treated as collector and Pin 3 as
          emitter.
        </p>

        <p>
          These pins respond when the input LED shines light onto the output
          device.
        </p>
      </SectionCard>

      <SectionCard title="Why is pin order important?" eyebrow="Reading Diagrams">
        <p>
          Pin order matters because circuit symbols, package drawings, and real
          connections depend on correct identification.
        </p>

        <p>
          If the learner confuses the LED side with the transistor side, the
          circuit will not behave as expected.
        </p>

        <p>
          Good pin reading habits help prevent basic design mistakes.
        </p>
      </SectionCard>

      <SectionCard title="How does this lesson connect to optocoupler working?" eyebrow="Concept Link">
        <p>
          The previous lesson explains that an optocoupler transfers signal
          through light.
        </p>

        <p>
          This lesson adds the practical detail of where that signal enters and
          where the controlled output appears.
        </p>

        <p>
          That makes the device easier to understand in real circuits.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest rule is to think of the optocoupler as two isolated pairs
          of pins.
        </p>

        <p>
          Pins 1 and 2 drive the LED input, while Pins 4 and 3 belong to the
          output transistor side.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: first identify the input pair and output pair,
          then wiring the optocoupler becomes much clearer.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Pin learning is the first practical step in using an optocoupler.</li>
          <li>Pins 1 and 2 usually belong to the LED input side.</li>
          <li>Pins 4 and 3 usually belong to the transistor output side.</li>
          <li>Pin 1 is commonly anode and Pin 2 is commonly cathode.</li>
          <li>Pin 4 is commonly collector and Pin 3 is commonly emitter.</li>
          <li>Correct pin identification helps prevent wiring mistakes.</li>
          <li>The main idea is to separate the device into input pins and output pins.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
