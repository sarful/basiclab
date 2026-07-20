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
      question: "What is the main idea of an SPDT relay?",
      answer:
        "An SPDT relay uses one common contact that can switch between two output paths, usually the NC path and the NO path.",
    },
    {
      question: "What does SPDT mean?",
      answer:
        "SPDT means single-pole double-throw, so one movable contact can connect to one of two different terminals.",
    },
    {
      question: "What happens in the normal unenergized state?",
      answer:
        "In the normal state, the common terminal is usually connected to the normally closed contact.",
    },
    {
      question: "What changes after coil energizing?",
      answer:
        "After energizing, the relay armature moves and the common terminal disconnects from NC and connects to NO.",
    },
    {
      question: "Why is SPDT important in relay learning?",
      answer:
        "Because it introduces changeover action, where one input can be switched between two output states.",
    },
    {
      question: "How is SPDT different from SPST?",
      answer:
        "SPST only opens or closes a single path, while SPDT switches one common path between two different outputs.",
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
              Relay SPDT
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how an SPDT relay switches one common path
              between a normally closed output and a normally open output.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is changeover action: one common terminal changes its
              connection depending on whether the relay coil is energized.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes SPDT one of the most important relay contact
              configurations to understand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPDT" tone="emerald" />
            <ValueCard label="Default Path" value="COM to NC" tone="violet" />
            <ValueCard label="Coil Effect" value="COM to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does SPDT mean?" eyebrow="Contact Name">
        <p>
          SPDT means single-pole double-throw, which describes a relay contact
          with one movable common point and two possible connection paths.
        </p>

        <p>
          One path is usually the normally closed contact, and the other is the
          normally open contact.
        </p>

        <p>
          This structure allows one common terminal to select between two
          outputs.
        </p>
      </SectionCard>

      <SectionCard title="What happens in the normal state?" eyebrow="Default Condition">
        <p>
          In the normal unenergized state, the common terminal is connected to
          the NC contact.
        </p>

        <p>
          That means the relay provides a default connection through the NC
          path.
        </p>

        <p>
          The NO path remains disconnected until the coil is energized.
        </p>
      </SectionCard>

      <SectionCard title="What changes after coil energizing?" eyebrow="Changeover Action">
        <p>
          When the relay coil is energized, magnetic action moves the armature
          and the contact position changes.
        </p>

        <p>
          The common terminal disconnects from NC and connects to NO.
        </p>

        <p>
          This changeover movement is the main operating idea of an SPDT relay.
        </p>
      </SectionCard>

      <SectionCard title="Why is SPDT more powerful than SPST?" eyebrow="Functional Difference">
        <p>
          SPST contacts only control one path by opening or closing it.
        </p>

        <p>
          SPDT does more because it redirects one common line between two
          different outputs.
        </p>

        <p>
          That extra flexibility makes SPDT extremely useful in practical relay
          control.
        </p>
      </SectionCard>

      <SectionCard title="Why is COM important in SPDT?" eyebrow="Common Terminal">
        <p>
          The COM terminal is the moving reference point of the relay contact
          system.
        </p>

        <p>
          It is the terminal that changes from NC to NO depending on coil
          state.
        </p>

        <p>
          So understanding COM is essential for reading SPDT relay diagrams
          correctly.
        </p>
      </SectionCard>

      <SectionCard title="Where is SPDT used in practice?" eyebrow="Practical Use">
        <p>
          SPDT relays are useful when one signal or supply must be redirected
          between two different circuit paths.
        </p>

        <p>
          This is common in automation, signal routing, interlocking, and basic
          electrical control logic.
        </p>

        <p>
          That is why SPDT relays are a standard topic in electrical training.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest rule is to follow the common terminal before and after
          coil energizing.
        </p>

        <p>
          In the normal state, COM is with NC. After energizing, COM moves to
          NO.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an SPDT relay changes one common connection from
          the NC side to the NO side when the coil becomes active.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPDT means single-pole double-throw.</li>
          <li>One common terminal can connect to NC or NO.</li>
          <li>Default state usually keeps COM connected to NC.</li>
          <li>Coil energizing moves COM from NC to NO.</li>
          <li>SPDT introduces relay changeover behavior.</li>
          <li>It is more flexible than SPST contact control.</li>
          <li>SPDT is widely used in practical control circuits.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
