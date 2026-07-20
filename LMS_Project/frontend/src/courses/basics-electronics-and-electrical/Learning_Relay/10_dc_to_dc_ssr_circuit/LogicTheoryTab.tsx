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
      question: "What is a DC to DC SSR circuit?",
      answer:
        "A DC to DC SSR circuit uses a DC control signal to electronically switch a DC load through a solid state relay arrangement.",
    },
    {
      question: "Why is this lesson important after basic SSR lessons?",
      answer:
        "Because it shows how SSR ideas are applied in an actual circuit where both the control side and load side are DC based.",
    },
    {
      question: "What is the main beginner idea here?",
      answer:
        "The learner should notice that a small DC control input can control a separate DC load path electronically and with isolation.",
    },
    {
      question: "How is this different from AC SSR discussion?",
      answer:
        "Here the lesson focuses on DC input to DC output switching behavior rather than AC load switching behavior.",
    },
    {
      question: "Why is isolation still important in DC to DC SSR circuits?",
      answer:
        "Isolation helps keep the low-power control side separated from the load side while still allowing the control signal to command the switching action.",
    },
    {
      question: "What should learners observe in the circuit view?",
      answer:
        "They should observe the relationship between control input, internal SSR switching action, and the resulting DC load path turning on or off.",
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
              DC to DC SSR Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a solid state relay can use a DC control
              signal to switch a DC load circuit electronically.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that both sides are DC based, but the relay still
              provides controlled switching and isolation between sections.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This lesson connects SSR theory with a practical DC control
              application.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Side" value="DC Control" tone="emerald" />
            <ValueCard label="Output Side" value="DC Load" tone="violet" />
            <ValueCard label="Switching Style" value="Electronic" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a DC to DC SSR circuit?" eyebrow="Topic Overview">
        <p>
          A DC to DC SSR circuit uses a direct current control signal to command
          a direct current load path through solid state switching.
        </p>

        <p>
          This means the control side and the output load side both operate with
          DC, but they are still functionally separated inside the relay system.
        </p>

        <p>
          So the lesson shows a practical form of electronic DC load control.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important?" eyebrow="Learning Progression">
        <p>
          Earlier SSR lessons explain what an SSR is and how it works internally.
        </p>

        <p>
          This lesson moves to an applied circuit example so the learner can see
          how those ideas appear in a real DC switching arrangement.
        </p>

        <p>
          It helps bridge theory and real circuit usage.
        </p>
      </SectionCard>

      <SectionCard title="What should the learner watch first?" eyebrow="Beginner Focus">
        <p>
          The first thing to observe is the relationship between the small DC
          control input and the larger DC load path.
        </p>

        <p>
          The control signal does not need to carry the main load current
          directly.
        </p>

        <p>
          Instead, it commands the SSR to switch the load electronically.
        </p>
      </SectionCard>

      <SectionCard title="Why is isolation still valuable?" eyebrow="Control Protection">
        <p>
          Even in a DC to DC SSR arrangement, isolation remains important
          because the low-power control section should stay protected from the
          load side.
        </p>

        <p>
          The control signal can still influence switching without a direct
          shared high-current path.
        </p>

        <p>
          This is one of the main advantages of SSR-based control.
        </p>
      </SectionCard>

      <SectionCard title="How is this different from AC SSR examples?" eyebrow="DC vs AC Focus">
        <p>
          In AC SSR examples, the lesson usually focuses on switching an AC load
          side.
        </p>

        <p>
          Here the emphasis is different because both the control side and the
          output side are DC based.
        </p>

        <p>
          That changes the application context even though the SSR idea remains
          electronic switching with isolation.
        </p>
      </SectionCard>

      <SectionCard title="What does the circuit view help explain?" eyebrow="Applied Observation">
        <p>
          The circuit view helps the learner track input command, internal
          switching action, and output load response in one picture.
        </p>

        <p>
          This makes the lesson more practical than a definition-only topic.
        </p>

        <p>
          It shows how SSR theory becomes an actual load-control circuit.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest rule is to separate the circuit into two sides in your
          mind.
        </p>

        <p>
          A small DC input commands the SSR, and the SSR then controls the DC
          load path.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a DC to DC SSR circuit lets a low-power DC control
          signal switch a separate DC load electronically and safely.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A DC to DC SSR circuit uses DC control to switch a DC load.</li>
          <li>Both input and output sides are DC based.</li>
          <li>The control side commands the load electronically.</li>
          <li>Isolation is still an important relay advantage.</li>
          <li>This lesson applies earlier SSR theory to a real circuit.</li>
          <li>The circuit view helps learners follow cause and effect.</li>
          <li>The main idea is electronic DC load switching through SSR.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
