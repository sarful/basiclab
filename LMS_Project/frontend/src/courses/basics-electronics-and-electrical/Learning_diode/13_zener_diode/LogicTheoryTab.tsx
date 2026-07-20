"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getZenerState } from "./logic";

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
  const sample = getZenerState(7, 5.1, "reverse");

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What makes a Zener diode different from a normal diode?",
      answer:
        "A Zener diode is designed to operate safely in reverse breakdown at a specified Zener voltage.",
    },
    {
      question: "What happens when reverse voltage reaches the Zener voltage?",
      answer:
        "The diode enters breakdown and begins conducting while holding the voltage near its Zener value.",
    },
    {
      question: "Why is a series resistor important in a Zener circuit?",
      answer:
        "It limits current so the diode can stay in breakdown without being damaged.",
    },
    {
      question: "Why is a Zener diode useful for regulation?",
      answer:
        "Because once breakdown is active, the output voltage stays close to the Zener voltage even if input or load changes moderately.",
    },
    {
      question: "Does a Zener diode also work in forward bias?",
      answer:
        "Yes. In forward bias it behaves much like a normal silicon diode with about a 0.7 V drop.",
    },
    {
      question: "What happens below the Zener voltage in reverse bias?",
      answer:
        "The diode does not enter breakdown, so reverse current remains very small and clamping does not occur.",
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
              Zener Diode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A Zener diode is a special diode that is built to work safely in
              reverse breakdown so it can hold a nearly constant voltage.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on Zener voltage, reverse breakdown, voltage
              clamping, current limiting, and why Zener diodes are widely used
              in simple regulator circuits.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is one of the most important practical diodes for reference and
              protection tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Zener Voltage" value="5.1 V" tone="violet" />
            <ValueCard label="Output Clamp" value={`${sample.outputVoltage.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Current" value={`${sample.currentMA.toFixed(1)} mA`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a Zener diode?" eyebrow="Core Concept">
        <p>
          A Zener diode is a diode specially designed for controlled reverse-bias operation.
        </p>

        <p>
          Unlike an ordinary diode, it is meant to enter reverse breakdown at a
          specified voltage without being destroyed, as long as current is limited.
        </p>

        <p>
          That makes it useful for voltage control rather than only for rectification.
        </p>
      </SectionCard>

      <SectionCard title="What is Zener voltage?" eyebrow="Breakdown Point">
        <p>
          Zener voltage, often written as <strong>Vz</strong>, is the reverse
          voltage at which the diode begins breakdown conduction.
        </p>

        <p>
          Once that point is reached, the diode starts conducting strongly in
          reverse and tends to hold the voltage near that value.
        </p>

        <p>
          This is the key property that makes a Zener diode valuable in regulator circuits.
        </p>
      </SectionCard>

      <SectionCard title="How does reverse breakdown help?" eyebrow="Voltage Clamping">
        <p>
          In reverse bias below the Zener voltage, current is very small.
        </p>

        <p>
          When the reverse voltage reaches or exceeds the Zener voltage, the
          diode enters breakdown and begins conducting.
        </p>

        <p>
          As it conducts, the voltage across the diode stays close to the Zener
          voltage instead of rising freely with the supply.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the input voltage rises above the Zener
            voltage, what quantity stays nearly fixed across the diode?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is the series resistor necessary?" eyebrow="Current Limiting">
        <p>
          A Zener diode must not be connected directly across a strong supply
          without current limiting.
        </p>

        <p>
          The series resistor absorbs excess voltage and limits the current
          flowing through the diode.
        </p>

        <p>
          Without that resistor, the breakdown current could become too large
          and damage the diode.
        </p>
      </SectionCard>

      <SectionCard title="Why is the Zener diode useful as a regulator?" eyebrow="Regulation">
        <p>
          A regulator circuit tries to keep the output voltage reasonably steady.
        </p>

        <p>
          When the Zener is in reverse breakdown, the output can remain close to
          the Zener voltage even if the input voltage or load changes moderately.
        </p>

        <p>
          This makes the Zener diode a simple and practical voltage reference or clamp.
        </p>
      </SectionCard>

      <SectionCard title="How does load condition affect the circuit?" eyebrow="Load Effect">
        <p>
          The load draws part of the available current, and the Zener uses the rest.
        </p>

        <p>
          A heavier load means more load current, leaving less current available
          for the Zener diode.
        </p>

        <p>
          If the load becomes too heavy, the diode may leave breakdown and the
          regulation effect becomes weaker.
        </p>
      </SectionCard>

      <SectionCard title="What happens in forward bias?" eyebrow="Comparison Mode">
        <p>
          In forward bias, a Zener diode behaves much like a normal silicon diode.
        </p>

        <p>
          It starts conducting around a typical forward drop of about 0.7 V.
        </p>

        <p>
          So the special behavior of a Zener diode is mainly about reverse breakdown, not forward conduction.
        </p>
      </SectionCard>

      <SectionCard title="Why is breakdown safe here but unsafe in a normal diode?" eyebrow="Device Design">
        <p>
          Ordinary diodes are not intended to remain in reverse breakdown during normal use.
        </p>

        <p>
          Zener diodes are manufactured so breakdown happens in a controlled way
          at a specified reverse voltage.
        </p>

        <p>
          That controlled construction is what lets them serve as reliable clamping devices.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a Zener diode is to think of it as a
          reverse-bias voltage clamp.
        </p>

        <p>
          Below the Zener voltage, very little happens. Once the voltage reaches
          the breakdown level, the diode conducts and holds the voltage near Vz.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a Zener diode can stabilize or limit voltage, but
          only when a proper series resistor keeps the current safe.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          Zener diodes are used in simple voltage regulators, voltage reference
          circuits, and overvoltage protection designs.
        </p>

        <p>
          They are especially helpful when a circuit needs an inexpensive way to
          hold or cap a voltage at a known level.
        </p>

        <p>
          This lesson mirrors that idea by showing both breakdown conduction and clamp behavior.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A Zener diode is built for controlled reverse breakdown.</li>
          <li>Zener voltage is the breakdown voltage where clamping begins.</li>
          <li>In breakdown, the diode holds voltage near Vz.</li>
          <li>A series resistor is required to limit current safely.</li>
          <li>Zener diodes are useful for simple regulation and protection.</li>
          <li>Heavy load can weaken regulation by taking too much current.</li>
          <li>In forward bias, the diode behaves like a normal silicon diode.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
