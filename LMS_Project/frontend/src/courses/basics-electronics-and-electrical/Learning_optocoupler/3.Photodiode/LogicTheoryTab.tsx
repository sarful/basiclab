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
      question: "What is a photodiode in this optocoupler lesson?",
      answer:
        "A photodiode is the light-sensitive output device that reacts to the LED light coming from the input side of the optocoupler.",
    },
    {
      question: "Why is the photodiode important?",
      answer:
        "It converts received light into electrical output behavior while keeping the input and output sides isolated.",
    },
    {
      question: "What happens when the input LED turns on?",
      answer:
        "The input LED emits light, and that light reaches the photodiode across the isolation gap.",
    },
    {
      question: "What is the main beginner idea of this lesson?",
      answer:
        "The learner should understand that light from the input side causes the photodiode side to produce output response.",
    },
    {
      question: "How is a photodiode different from a phototransistor?",
      answer:
        "Both are light-sensitive devices, but this lesson focuses on photodiode-based output behavior rather than phototransistor output behavior.",
    },
    {
      question: "What is the most important takeaway?",
      answer:
        "The photodiode is the optical receiver that turns incoming light into a usable output-side effect.",
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
              Photodiode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a photodiode works as the light-sensitive
              output device in an optocoupler circuit.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that the input LED sends light, and the photodiode
              receives that light to create output-side response.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This helps learners see how optical signal transfer becomes
              electrical output action.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="Photodiode" tone="violet" />
            <ValueCard label="Main Benefit" value="Isolation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a photodiode?" eyebrow="Core Definition">
        <p>
          A photodiode is a light-sensitive semiconductor device that responds
          when light falls on it.
        </p>

        <p>
          In this optocoupler lesson, the photodiode is the receiving side of
          the optical signal.
        </p>

        <p>
          That means it turns incoming light information into output electrical
          behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why is the photodiode important in an optocoupler?" eyebrow="Output Role">
        <p>
          The optocoupler needs an output-side device that can react to light
          without direct electrical connection to the input side.
        </p>

        <p>
          The photodiode performs that role by sensing the LED light across the
          isolation barrier.
        </p>

        <p>
          So it is one of the key parts that makes optical isolation useful.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the input LED turns on?" eyebrow="Light Response">
        <p>
          When input current flows through the LED side, the LED emits light.
        </p>

        <p>
          That light crosses the internal isolation space and reaches the
          photodiode.
        </p>

        <p>
          The photodiode then produces output-side electrical response based on
          that light input.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson different from a basic optocoupler definition?" eyebrow="Focused Device Study">
        <p>
          The first lesson explains the general idea of signal transfer through
          light.
        </p>

        <p>
          This lesson focuses on one specific kind of light receiver: the
          photodiode.
        </p>

        <p>
          That gives the learner a more detailed understanding of the output
          side.
        </p>
      </SectionCard>

      <SectionCard title="How is a photodiode different from a phototransistor?" eyebrow="Comparison">
        <p>
          Both devices respond to light and are used on the output side of
          optical systems.
        </p>

        <p>
          But this lesson is centered on photodiode behavior, not on the
          transistor-style output action of a phototransistor.
        </p>

        <p>
          That helps learners distinguish between different optocoupler output
          devices.
        </p>
      </SectionCard>

      <SectionCard title="Why is isolation still the core idea?" eyebrow="Signal Safety">
        <p>
          Even though the lesson focuses on the photodiode, the most important
          overall idea remains electrical isolation.
        </p>

        <p>
          The input LED and output photodiode exchange signal information through
          light, not by direct electrical wiring.
        </p>

        <p>
          So the photodiode supports both signal transfer and safety separation.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember this lesson is to track the sender and the
          receiver.
        </p>

        <p>
          The LED sends light, and the photodiode receives it to create output
          effect.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a photodiode is the optocoupler receiver that
          turns incoming LED light into output-side electrical response.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A photodiode is a light-sensitive output device.</li>
          <li>It receives light from the input LED side.</li>
          <li>That light creates output electrical response.</li>
          <li>The photodiode works across the isolation barrier.</li>
          <li>This lesson focuses on photodiode output behavior.</li>
          <li>It is different from phototransistor-based output study.</li>
          <li>The main idea is optical receiving with electrical isolation.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
