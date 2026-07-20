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
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300" />
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
      question: "What is the main rule for voltage in a parallel circuit?",
      answer:
        "Each parallel branch has the same voltage across it.",
    },
    {
      question: "What happens to total current in a parallel circuit?",
      answer:
        "Total current splits across the branches and equals the sum of the branch currents.",
    },
    {
      question: "What happens to equivalent resistance when a new branch is added in parallel?",
      answer:
        "Equivalent resistance becomes smaller.",
    },
    {
      question: "Does one open branch stop all current in a parallel circuit?",
      answer:
        "No. The other branches can still continue to carry current.",
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
              Parallel Resistor Circuit
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A parallel resistor circuit connects multiple resistors across the
              same two supply nodes in separate current paths.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on why all branches share the same voltage,
              how current splits between branches, and why equivalent resistance
              becomes smaller when more parallel branches are added.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Rule" value="Same Voltage" tone="emerald" />
            <ValueCard label="Current" value="Splits by Branch" tone="sky" />
            <ValueCard label="Resistance" value="Req Gets Smaller" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What a parallel resistor circuit is" eyebrow="Foundation">
        <p>
          In a parallel circuit, each resistor branch is connected across the
          same two supply points.
        </p>
        <p>
          That means the circuit has multiple current paths instead of only one
          path.
        </p>
        <p>
          Because of that structure, parallel circuits follow a different set
          of rules from series circuits.
        </p>
      </SectionCard>

      <SectionCard title="Why voltage is the same in every branch" eyebrow="Main Rule">
        <p>
          Since every branch is connected across the same two nodes, each branch
          sees the same supply voltage.
        </p>
        <p>
          The voltage does not need to divide between branches the way it does
          across series resistors.
        </p>
        <p>
          This same-voltage rule is one of the most important ideas in parallel
          circuit analysis.
        </p>
      </SectionCard>

      <SectionCard title="How current behaves in parallel" eyebrow="Current Split">
        <p>
          Current in a parallel circuit splits between the available branches.
        </p>
        <p>
          Each branch takes an amount of current based on its own resistance.
        </p>
        <p>
          The total current from the source equals the sum of all branch
          currents.
        </p>
      </SectionCard>

      <SectionCard title="Why lower resistance gets more current" eyebrow="Ohm's Law">
        <p>
          Because each branch has the same voltage, Ohm&apos;s law tells us that
          lower resistance means higher branch current.
        </p>
        <p>
          A higher-resistance branch takes less current under the same voltage.
        </p>
        <p>
          This is why current does not split equally unless the branch
          resistances are equal.
        </p>
      </SectionCard>

      <SectionCard title="How equivalent resistance works" eyebrow="Equivalent Model">
        <p>
          The equivalent resistance of parallel branches is always smaller than
          the smallest individual branch resistance.
        </p>
        <p>
          Adding another branch creates another path for current, which makes it
          easier for current to flow overall.
        </p>
        <p>
          That is why adding branches in parallel reduces equivalent
          resistance.
        </p>
      </SectionCard>

      <SectionCard title="What happens if one branch opens" eyebrow="Failure Behavior">
        <p>
          In a parallel circuit, one open branch does not usually stop the whole
          circuit.
        </p>
        <p>
          The remaining branches can still carry current as long as they remain
          connected.
        </p>
        <p>
          This is an important reliability difference between parallel and
          series circuits.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 13 simulator lets you add, remove, and edit resistor
          branches in parallel.
        </p>
        <p>
          As branch values change, the lesson updates equivalent resistance,
          total current, and each branch current live.
        </p>
        <p>
          This makes it easy to see same-voltage branches, current splitting,
          and reduced equivalent resistance in action.
        </p>
      </SectionCard>

      <SectionCard title="Why parallel circuits are useful" eyebrow="Applications">
        <p>
          Parallel circuits are useful when multiple loads need the same supply
          voltage.
        </p>
        <p>
          They are also useful when one branch should continue working even if
          another branch stops.
        </p>
        <p>
          Understanding parallel behavior is essential for practical circuit
          design and troubleshooting.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is thinking current is the same in every parallel
          branch.
        </p>
        <p>
          Another mistake is assuming equivalent resistance gets larger when
          more branches are added.
        </p>
        <p>
          Students also often forget that voltage is the same across all
          branches even when the branch currents are different.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Parallel circuits have multiple current paths.</li>
          <li>Each branch has the same voltage.</li>
          <li>Total current is the sum of the branch currents.</li>
          <li>Lower-resistance branches carry more current.</li>
          <li>Adding branches reduces equivalent resistance.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the parallel circuit basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
