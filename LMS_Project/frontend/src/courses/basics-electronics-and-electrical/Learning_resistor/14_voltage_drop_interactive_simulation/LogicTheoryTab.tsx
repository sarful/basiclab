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
      question: "What is voltage drop?",
      answer:
        "Voltage drop is the voltage difference across a component where electrical energy is used or dissipated.",
    },
    {
      question: "In a series circuit, what stays the same through all resistors?",
      answer:
        "Current stays the same through all resistors in the series path.",
    },
    {
      question: "Which resistor gets a larger voltage drop in a series circuit?",
      answer:
        "The resistor with the larger resistance gets a larger voltage drop.",
    },
    {
      question: "What should the sum of the voltage drops equal?",
      answer:
        "The sum of the voltage drops should equal the supply voltage.",
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
              Voltage Drop
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Voltage drop is the voltage difference across a component where
              electrical energy is used or dissipated.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how voltage is shared in a series circuit,
              why larger resistors get larger drops, and how the sum of the
              drops explains the full supply voltage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Formula" value="Vdrop = I x R" tone="emerald" />
            <ValueCard label="Series Rule" value="Same Current" tone="sky" />
            <ValueCard label="Key Check" value="Drops Sum to Vs" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What voltage drop means" eyebrow="Foundation">
        <p>
          Voltage drop describes how much electrical potential is used across a
          component.
        </p>
        <p>
          In resistor circuits, that dropped voltage is linked to current and
          resistance.
        </p>
        <p>
          It does not mean voltage disappears for no reason. It means electrical
          energy is being used or dissipated in that part of the circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why voltage drop appears in series circuits" eyebrow="Series Behavior">
        <p>
          In a series circuit, the same current flows through every resistor.
        </p>
        <p>
          Since each resistor has a value of resistance, each one produces its
          own voltage drop.
        </p>
        <p>
          The supply voltage is therefore shared across the resistors in the
          chain.
        </p>
      </SectionCard>

      <SectionCard title="How resistor value affects voltage drop" eyebrow="Main Insight">
        <p>
          When current is the same, a larger resistor produces a larger voltage
          drop.
        </p>
        <p>
          A smaller resistor produces a smaller voltage drop under the same
          current.
        </p>
        <p>
          This is why voltage distribution in a series circuit depends on the
          resistor values.
        </p>
      </SectionCard>

      <SectionCard title="The core formula" eyebrow="Formula Logic">
        <p>
          The basic voltage-drop formula is Vdrop = I x R.
        </p>
        <p>
          First find the current through the series path, then use that same
          current with each resistor to calculate its voltage drop.
        </p>
        <p>
          This combines Ohm&apos;s law with series-circuit rules in a very direct
          way.
        </p>
      </SectionCard>

      <SectionCard title="Why the drops must add up" eyebrow="Conservation Check">
        <p>
          In a complete series loop, the sum of the resistor voltage drops must
          match the total supply voltage.
        </p>
        <p>
          If the drops do not add up correctly, then something in the
          calculation or circuit understanding is wrong.
        </p>
        <p>
          This sum-check is one of the most useful consistency tests in circuit
          analysis.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 14 simulator lets you change supply voltage and resistor
          values while watching current and voltage drops update live.
        </p>
        <p>
          You can also turn the third resistor on or off, which changes total
          resistance and redistributes the drops.
        </p>
        <p>
          This makes it easy to see that same current flows through the chain
          while voltage is shared according to resistance.
        </p>
      </SectionCard>

      <SectionCard title="Why voltage drop matters in practice" eyebrow="Applications">
        <p>
          Voltage drop matters because real circuits often need specific
          voltages across different parts.
        </p>
        <p>
          Designers use resistor values to control how the supply voltage is
          divided.
        </p>
        <p>
          Understanding voltage drop is important for sensor circuits, biasing,
          reference levels, and troubleshooting.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is thinking voltage drop means energy is simply
          lost without explanation.
        </p>
        <p>
          Another mistake is forgetting that current stays the same through all
          resistors in a series path.
        </p>
        <p>
          Students also often forget to check whether all the individual drops
          add back up to the supply voltage.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage drop is the voltage difference across a component.</li>
          <li>In a series circuit, the same current flows through all resistors.</li>
          <li>Larger resistors get larger voltage drops under the same current.</li>
          <li>`Vdrop = I x R` is the key formula.</li>
          <li>The sum of all drops should equal the supply voltage.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the voltage-drop basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
