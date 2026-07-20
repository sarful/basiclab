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
      question: "What is the main idea of a DPDT relay?",
      answer:
        "A DPDT relay contains two separate changeover contact sets, so it can switch two common lines between NC and NO outputs at the same time.",
    },
    {
      question: "What does DPDT mean?",
      answer:
        "DPDT means double-pole double-throw, which means there are two poles and each pole can switch between two contact positions.",
    },
    {
      question: "How is DPDT related to SPDT?",
      answer:
        "DPDT can be thought of as two SPDT contact sets operated together by the same relay coil.",
    },
    {
      question: "What happens in the default state?",
      answer:
        "In the unenergized state, both common terminals are usually connected to their normally closed contacts.",
    },
    {
      question: "What happens after coil energizing?",
      answer:
        "When the coil is energized, both common terminals switch from the NC side to the NO side at the same time.",
    },
    {
      question: "Why is DPDT useful in control circuits?",
      answer:
        "Because one relay can control two separate paths together, which is useful for reversing, interlocking, and multi-line switching tasks.",
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
              Relay DPDT
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a DPDT relay switches two separate common
              lines between NC and NO contacts using one relay coil.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The core idea is that one relay can perform two changeover actions
              at the same time.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              That makes DPDT relays powerful for more advanced control logic
              than SPST or SPDT.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="DPDT" tone="emerald" />
            <ValueCard label="Default Paths" value="2 x COM to NC" tone="violet" />
            <ValueCard label="Coil Effect" value="2 x COM to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does DPDT mean?" eyebrow="Contact Name">
        <p>
          DPDT means double-pole double-throw, which tells us there are two
          separate poles and each one can switch between two positions.
        </p>

        <p>
          In relay terms, that usually means two common terminals, two NC
          contacts, and two NO contacts.
        </p>

        <p>
          So one relay can control two independent changeover contact paths
          together.
        </p>
      </SectionCard>

      <SectionCard title="How is DPDT related to SPDT?" eyebrow="Building Concept">
        <p>
          An SPDT relay has one common terminal that changes between NC and NO.
        </p>

        <p>
          A DPDT relay is similar, but it provides two such changeover contact
          sets in the same relay body.
        </p>

        <p>
          A simple beginner way to remember it is: DPDT is like two SPDT
          systems working together.
        </p>
      </SectionCard>

      <SectionCard title="What happens in the normal state?" eyebrow="Default Condition">
        <p>
          In the normal unenergized state, both common terminals are usually
          connected to their NC contacts.
        </p>

        <p>
          That means both contact sections provide default NC connections.
        </p>

        <p>
          Both NO paths remain disconnected until the relay coil is energized.
        </p>
      </SectionCard>

      <SectionCard title="What changes after coil energizing?" eyebrow="Dual Changeover Action">
        <p>
          When the relay coil is energized, magnetic action moves the internal
          switching mechanism.
        </p>

        <p>
          Both common terminals change from NC to NO at the same time.
        </p>

        <p>
          This synchronized dual switching is the most important operating
          feature of a DPDT relay.
        </p>
      </SectionCard>

      <SectionCard title="Why is DPDT useful?" eyebrow="Practical Advantage">
        <p>
          DPDT is useful when two separate lines need to change state together
          from one coil command.
        </p>

        <p>
          This can be important in reversing circuits, signal selection,
          interlocking, and multi-path control systems.
        </p>

        <p>
          It reduces the need for multiple separate relays in some designs.
        </p>
      </SectionCard>

      <SectionCard title="Why is this more advanced than SPDT?" eyebrow="Learning Progression">
        <p>
          SPDT introduces one common terminal and one changeover action.
        </p>

        <p>
          DPDT extends that same idea to two contact groups working together.
        </p>

        <p>
          So it helps learners move from basic contact logic toward more complex
          relay-controlled systems.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember DPDT is to track both common terminals at
          the same time.
        </p>

        <p>
          In the normal state, both COM contacts sit on NC. After energizing,
          both move to NO.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a DPDT relay acts like two coordinated SPDT
          switchovers driven by one relay coil.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DPDT means double-pole double-throw.</li>
          <li>It contains two changeover contact sections.</li>
          <li>It can be understood as two SPDT sets in one relay.</li>
          <li>Default state usually keeps both COM terminals on NC.</li>
          <li>Coil energizing moves both COM terminals to NO.</li>
          <li>DPDT is useful for switching two paths together.</li>
          <li>It is common in more advanced relay control tasks.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
