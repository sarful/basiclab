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
      question: "What makes a fixed resistor different from a variable resistor?",
      answer:
        "A fixed resistor keeps one resistance value during normal use, while a variable resistor allows that value to be adjusted.",
    },
    {
      question: "Why is tolerance important when selecting a fixed resistor?",
      answer:
        "Because tolerance tells us how close the real resistor value is to its labeled value, which affects circuit accuracy.",
    },
    {
      question: "Why would a metal film resistor be preferred in measurement circuits?",
      answer:
        "Because it usually offers better accuracy, lower noise, and more stable performance than simpler low-cost options.",
    },
    {
      question: "Why is a wire-wound resistor often chosen for high-power work?",
      answer:
        "Because its construction handles heat and power dissipation much better than many smaller precision-oriented resistor types.",
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
              Fixed Resistor
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A fixed resistor is designed to provide one stable resistance
              value in a circuit. It is one of the most common components for
              controlling current, dividing voltage, and protecting other parts.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on what a fixed resistor is, how resistance,
              tolerance, and power rating shape its behavior, and why different
              fixed resistor constructions are chosen for different jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Behavior" value="Stable Value" tone="emerald" />
            <ValueCard label="Key Selection" value="Ohm / Tolerance / Power" tone="sky" />
            <ValueCard label="Common Types" value="Carbon / Metal Film / Wire Wound" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What a fixed resistor really does" eyebrow="Foundation">
        <p>
          A fixed resistor opposes current flow using one intended resistance
          value that does not normally change by user adjustment.
        </p>
        <p>
          Its job is often to limit current, drop voltage, create bias
          conditions, or divide voltage inside a circuit.
        </p>
        <p>
          The key idea is stability. When we use a fixed resistor, we expect
          the circuit to see nearly the same resistance each time it operates.
        </p>
      </SectionCard>

      <SectionCard title="Why fixed resistors matter so much" eyebrow="Big Picture">
        <p>
          Many electronic circuits depend on predictable current and voltage.
        </p>
        <p>
          Without a resistor to control electrical flow, other components could
          receive too much current or the circuit could produce the wrong
          operating condition.
        </p>
        <p>
          That is why fixed resistors appear everywhere from basic LED projects
          to amplifiers, sensors, power supplies, and industrial equipment.
        </p>
      </SectionCard>

      <SectionCard title="The three main ideas in selection" eyebrow="Selection Logic">
        <p>
          Choosing a fixed resistor is not only about reading the ohm value.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistance value tells us how strongly current is opposed.</li>
          <li>Tolerance tells us how close the real value is to the labeled value.</li>
          <li>Power rating tells us how much heat energy the resistor can safely handle.</li>
        </ul>
        <p>
          If any one of these is chosen badly, the circuit may become
          inaccurate, unstable, or unsafe.
        </p>
      </SectionCard>

      <SectionCard title="Resistance value and circuit behavior" eyebrow="Ohm Value">
        <p>
          A higher resistance value usually reduces current more strongly.
        </p>
        <p>
          A lower resistance value allows more current to pass.
        </p>
        <p>
          This is why the correct resistor value must match the purpose of the
          circuit, whether the goal is LED protection, signal conditioning, or
          voltage division.
        </p>
      </SectionCard>

      <SectionCard title="Why tolerance changes design confidence" eyebrow="Accuracy">
        <p>
          The printed value on a resistor is the target value, but real
          components are not perfect.
        </p>
        <p>
          Tolerance tells us the possible variation around that target. A lower
          tolerance percentage means the resistor is more precise.
        </p>
        <p>
          In casual circuits, a wider tolerance may be acceptable. In
          measurement, sensing, and precise signal work, tighter tolerance
          becomes much more important.
        </p>
      </SectionCard>

      <SectionCard title="Why power rating cannot be ignored" eyebrow="Heat Safety">
        <p>
          Whenever current flows through a resistor, electrical energy is
          converted into heat.
        </p>
        <p>
          If the resistor is asked to dissipate more power than it is designed
          for, it may overheat, drift in value, or fail completely.
        </p>
        <p>
          Good resistor selection always checks not only value and tolerance,
          but also whether the resistor can survive the expected power safely.
        </p>
      </SectionCard>

      <SectionCard title="Common fixed resistor types" eyebrow="Type Comparison">
        <p>
          Fixed resistors come in different constructions because different
          applications need different strengths.
        </p>
        <p>
          Carbon composition resistors are low-cost and simple, but they tend
          to have higher noise and lower precision.
        </p>
        <p>
          Metal film resistors are known for low noise, high accuracy, and
          stable performance, so they are common in precision work.
        </p>
        <p>
          Wire-wound resistors are strong in heat handling and power
          dissipation, making them useful in heavier-duty applications.
        </p>
      </SectionCard>

      <SectionCard title="When one fixed type is better than another" eyebrow="Use Cases">
        <p>
          If cost and simplicity matter most, a basic carbon composition
          resistor may be acceptable for educational or general circuits.
        </p>
        <p>
          If accuracy and low noise matter more, metal film is often the better
          option.
        </p>
        <p>
          If the circuit must handle larger power and more heat, wire-wound may
          be the correct choice even if it is larger physically.
        </p>
      </SectionCard>

      <SectionCard title="What students often confuse" eyebrow="Common Mistakes">
        <p>
          One common mistake is choosing a resistor only by its ohm value and
          ignoring tolerance or power rating.
        </p>
        <p>
          Another mistake is assuming all fixed resistors behave the same just
          because they share the same labeled resistance.
        </p>
        <p>
          In reality, accuracy, noise, heat handling, and reliability all
          depend on resistor type and construction.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A fixed resistor provides one stable resistance value.</li>
          <li>Its main jobs include current limiting, voltage drop, and bias control.</li>
          <li>Selection depends on resistance value, tolerance, and power rating.</li>
          <li>Carbon, metal film, and wire-wound fixed resistors serve different needs.</li>
          <li>The best fixed resistor is the one that matches the real circuit job safely.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to confirm the core fixed resistor ideas.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
