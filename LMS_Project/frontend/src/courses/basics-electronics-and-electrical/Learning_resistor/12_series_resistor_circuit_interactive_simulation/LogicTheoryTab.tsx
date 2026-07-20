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
      question: "What is the main rule for total resistance in a series circuit?",
      answer:
        "Total resistance equals the sum of all resistor values.",
    },
    {
      question: "How many current paths exist in a series resistor circuit?",
      answer: "There is only one current path.",
    },
    {
      question: "Is current the same through every series resistor?",
      answer:
        "Yes. Because the circuit has only one path, the same current flows through every resistor.",
    },
    {
      question: "What happens if one connection opens in a series circuit?",
      answer:
        "The whole current stops because the single path is broken.",
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
              Series Resistor Circuit
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A series resistor circuit connects resistors one after another in
              a single current path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how total resistance is formed, why the
              same current flows through every resistor, and how the supply
              voltage is distributed across the series chain.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Rule" value="Rtotal = Sum" tone="emerald" />
            <ValueCard label="Current Path" value="Single Path" tone="sky" />
            <ValueCard label="Voltage" value="Shared Across Parts" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What a series resistor circuit is" eyebrow="Foundation">
        <p>
          In a series circuit, resistors are connected one after another in one
          continuous path.
        </p>
        <p>
          Because there is only one path, current does not have multiple routes
          to choose from.
        </p>
        <p>
          That simple path structure creates several important rules for
          resistance, current, and voltage.
        </p>
      </SectionCard>

      <SectionCard title="How total resistance works" eyebrow="Main Rule">
        <p>
          In a series resistor circuit, total resistance is the sum of all
          resistor values.
        </p>
        <p>
          If you add more resistors in series, the total resistance increases.
        </p>
        <p>
          This is one of the most important identifying rules of a series
          network.
        </p>
      </SectionCard>

      <SectionCard title="Why current is the same everywhere" eyebrow="Single Path Logic">
        <p>
          Since the circuit has only one path, the same current must pass
          through every resistor in the chain.
        </p>
        <p>
          Current cannot split into branches because no branches exist.
        </p>
        <p>
          This makes current behavior in series circuits simpler than in
          parallel circuits.
        </p>
      </SectionCard>

      <SectionCard title="How total resistance affects current" eyebrow="Ohm's Law">
        <p>
          If supply voltage stays the same, increasing total resistance reduces
          current.
        </p>
        <p>
          Adding more resistors in series therefore tends to decrease the
          circuit current.
        </p>
        <p>
          This idea follows directly from Ohm&apos;s law.
        </p>
      </SectionCard>

      <SectionCard title="How voltage is distributed" eyebrow="Voltage Division">
        <p>
          The supply voltage is shared across the resistors in the series path.
        </p>
        <p>
          Each resistor gets a voltage drop, and all those drops together equal
          the total supply voltage.
        </p>
        <p>
          Larger resistor values usually take a larger share of the total
          voltage drop.
        </p>
      </SectionCard>

      <SectionCard title="Why one open connection stops everything" eyebrow="Failure Behavior">
        <p>
          A series circuit depends on one complete path from source to return.
        </p>
        <p>
          If one resistor disconnects or one connection opens, the path is
          broken.
        </p>
        <p>
          When that happens, current stops everywhere in the whole series
          circuit.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 12 simulator lets you add, remove, and edit resistors in a
          series chain.
        </p>
        <p>
          As the resistor values change, the lesson updates total resistance,
          current, and voltage drops live.
        </p>
        <p>
          This makes it easy to see that one path means same current everywhere
          and divided voltage across the parts.
        </p>
      </SectionCard>

      <SectionCard title="Why series circuits are useful" eyebrow="Applications">
        <p>
          Series connections are useful when we want one current path and a
          predictable total resistance.
        </p>
        <p>
          They are also useful for creating voltage drops or simple resistor
          networks.
        </p>
        <p>
          Understanding series behavior is a foundation for later circuit
          analysis.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is thinking voltage is the same across every
          resistor in series.
        </p>
        <p>
          Another mistake is forgetting that current remains the same through
          all the series parts.
        </p>
        <p>
          Students also often forget that opening one point in a series chain
          stops the entire circuit, not just one section.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Series circuits have one current path.</li>
          <li>Total resistance equals the sum of all resistors.</li>
          <li>The same current flows through every resistor.</li>
          <li>Supply voltage is divided across the resistors.</li>
          <li>One open connection stops the whole circuit.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the series circuit basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
