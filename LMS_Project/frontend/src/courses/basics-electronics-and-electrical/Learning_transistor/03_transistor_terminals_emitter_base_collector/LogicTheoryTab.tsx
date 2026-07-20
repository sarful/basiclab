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
      question: "What are the three transistor terminals?",
      answer:
        "They are emitter, base, and collector, often labeled E, B, and C.",
    },
    {
      question: "What is the main job of the emitter?",
      answer:
        "The emitter supplies charge carriers into the transistor action.",
    },
    {
      question: "Why is the base called the control terminal?",
      answer:
        "Because a small base current or base control signal can influence a much larger collector current.",
    },
    {
      question: "What is the collector mainly responsible for?",
      answer:
        "The collector gathers carriers and carries the output or load current.",
    },
    {
      question: "Why is the emitter arrow important in the transistor symbol?",
      answer:
        "Because the arrow is on the emitter terminal and helps identify transistor type and direction convention in the symbol.",
    },
    {
      question: "Why compare NPN and PNP terminal behavior in this lesson?",
      answer:
        "Because the same three terminals exist in both types, but carrier-flow direction and symbol orientation are not identical.",
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
              Transistor Terminals
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson focuses on the three transistor terminals and explains
              how each one contributes to transistor action.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main goal is to identify emitter, base, and collector clearly,
              understand their roles, and connect those roles to the transistor
              symbol and current-flow idea.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This is the bridge between transistor structure and full transistor
              working operation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Emitter" value="E" tone="emerald" />
            <ValueCard label="Base" value="B" tone="amber" />
            <ValueCard label="Collector" value="C" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Why learn transistor terminals separately?" eyebrow="Core Concept">
        <p>
          A learner cannot confidently read or use a transistor unless the three
          terminals are clearly understood.
        </p>

        <p>
          Each terminal has a different electrical role, and mixing them up
          leads to incorrect circuit understanding.
        </p>

        <p>
          So this lesson isolates the terminals first before moving deeper into
          biasing and switching behavior.
        </p>
      </SectionCard>

      <SectionCard title="What is the emitter?" eyebrow="E Terminal">
        <p>
          The emitter is the terminal that supplies charge carriers into the
          transistor action.
        </p>

        <p>
          In structural terms, it is usually the most heavily doped region.
        </p>

        <p>
          In symbol reading, the emitter is also especially important because
          the transistor arrow is drawn on that terminal.
        </p>
      </SectionCard>

      <SectionCard title="What is the base?" eyebrow="B Terminal">
        <p>
          The base is the control terminal of the transistor.
        </p>

        <p>
          A small base current or base control signal can influence a much
          larger collector current.
        </p>

        <p>
          This is why the base is central to the transistor's usefulness as a
          control device.
        </p>
      </SectionCard>

      <SectionCard title="What is the collector?" eyebrow="C Terminal">
        <p>
          The collector is the terminal that gathers charge carriers and carries
          the output or load current.
        </p>

        <p>
          It is associated with the useful output side of transistor operation.
        </p>

        <p>
          In many beginner circuits, the collector path is where the visible
          load result appears.
        </p>
      </SectionCard>

      <SectionCard title="Why are the three terminals not interchangeable?" eyebrow="Different Jobs">
        <p>
          The emitter, base, and collector do not perform the same function.
        </p>

        <p>
          One supplies carriers, one controls, and one carries the output
          result.
        </p>

        <p>
          That is why terminal identification is not just naming parts. It is a
          key part of understanding transistor behavior.
        </p>
      </SectionCard>

      <SectionCard title="What does the emitter arrow tell us?" eyebrow="Symbol Reading">
        <p>
          In transistor symbols, the arrow is always drawn on the emitter
          terminal.
        </p>

        <p>
          This helps learners identify the emitter quickly and compare NPN and
          PNP symbol conventions.
        </p>

        <p>
          So the arrow is not decorative. It is one of the most important visual
          clues in transistor symbols.
        </p>
      </SectionCard>

      <SectionCard title="Why compare NPN and PNP here?" eyebrow="Type Comparison">
        <p>
          Both NPN and PNP transistors use emitter, base, and collector
          terminals.
        </p>

        <p>
          However, the carrier-flow interpretation and symbol direction are not
          identical between the two types.
        </p>

        <p>
          This comparison helps the learner avoid assuming that every transistor
          terminal behaves in exactly the same directional way.
        </p>
      </SectionCard>

      <SectionCard title="How do terminals connect structure and operation?" eyebrow="Learning Link">
        <p>
          The previous lesson explained the physical regions of the transistor.
        </p>

        <p>
          This lesson explains how those regions appear as named terminals in
          real circuits and symbols.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the emitter supplies, the base controls, and the
          collector carries the output result. If you remember that chain, most
          beginner transistor diagrams become easier to read.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A transistor has three terminals: emitter, base, and collector.</li>
          <li>The emitter supplies charge carriers.</li>
          <li>The base is the control terminal.</li>
          <li>The collector carries the output or load current.</li>
          <li>The three terminals are not interchangeable.</li>
          <li>The emitter arrow is a key clue in the transistor symbol.</li>
          <li>NPN and PNP use the same terminal names but not identical direction conventions.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
