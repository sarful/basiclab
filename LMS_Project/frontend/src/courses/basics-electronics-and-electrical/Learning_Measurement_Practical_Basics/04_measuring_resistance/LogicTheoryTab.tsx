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
  tone: "emerald" | "amber" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-sky-200 bg-sky-50 text-sky-800";

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
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-300 to-sky-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
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
      question: "What is the most important safety rule before measuring resistance?",
      answer:
        "Power must be removed from the circuit before resistance measurement starts.",
    },
    {
      question: "Which meter family is used for resistance measurement?",
      answer: "The ohms family, shown by the Ω symbol.",
    },
    {
      question: "Where should the probes go when measuring a resistor?",
      answer:
        "One probe goes on each resistor terminal so the meter measures across the component.",
    },
    {
      question: "Why is the 10A jack not used for resistance checks?",
      answer:
        "Resistance measurement uses the VΩmA jack, not the high-current 10A jack.",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Logic &amp; Theory
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Measuring Resistance
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Measuring resistance means checking how strongly a component
              opposes current flow.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is built around one critical beginner rule: resistance
              is measured with power <strong>off</strong>, using the ohms
              family, with one probe on each side of the resistor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Main Family" value="Ω" tone="amber" />
            <ValueCard label="Red Lead" value="VΩmA" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="What is resistance measurement?" eyebrow="Core Concept">
        <p>
          Resistance measurement checks how much a component resists the flow of
          electric current.
        </p>
        <p>
          In simple language, a resistor makes current flow harder, and the
          ohms reading tells us how strong that opposition is.
        </p>
        <p>
          The meter does this by using its own internal test method, so it must
          not be combined with live external circuit power.
        </p>
        <p>
          That is why resistance measurement is a power-off test, not a live
          operating test like some voltage or current checks.
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Resistance measurement helps confirm whether a resistor or component
          is close to the value we expect.
        </p>
        <p>It helps answer practical questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Is this resistor really 220 ohms?</li>
          <li>Is this resistor closer to 680 ohms or 2.2k ohms?</li>
          <li>Did I choose the correct ohms range for this component?</li>
          <li>Are the probes really across the resistor, or on the same side?</li>
        </ul>
        <p>
          That makes resistance measurement useful for part checking, training,
          troubleshooting, and reading component values with confidence.
        </p>
      </SectionCard>

      <SectionCard title="Meter setup rules" eyebrow="Setup Rules">
        <p>
          For this lesson, the meter family must be the <strong>ohms</strong>{" "}
          family, shown by the <strong>Ω</strong> symbol.
        </p>
        <p>
          The black lead stays in <strong>COM</strong>.
        </p>
        <p>
          The red lead stays in <strong>VΩmA</strong>.
        </p>
        <p>
          The <strong>10A</strong> jack is not used for resistance
          measurement, because that jack is for high-current measurement.
        </p>
        <p>
          The selected ohms range should match the expected resistor value. For
          example, 220 ohms and 680 ohms fit comfortably in a 2000-ohm range,
          while 2.2k ohms needs a higher range such as 20k.
        </p>
      </SectionCard>

      <SectionCard title="Probe placement logic" eyebrow="Measurement Method">
        <p>
          To measure a resistor correctly, place one probe on each resistor
          terminal.
        </p>
        <p>
          This means the meter is measuring <strong>across the component</strong>.
        </p>
        <p>
          If both probes touch the same node or the same side of the resistor,
          the meter is not really checking the resistor value.
        </p>
        <p>
          In this lesson, correct setup means bridging both resistor leads with
          the probes so the display shows the expected ohms reading.
        </p>
      </SectionCard>

      <SectionCard title="Why power must stay off" eyebrow="Safety First">
        <p>
          Resistance measurement must be done on a de-energized circuit.
        </p>
        <p>
          If external power is still present, the reading can become wrong and
          the setup can become unsafe.
        </p>
        <p>
          A safe beginner habit is simple: before checking ohms, disconnect or
          remove power first, then confirm the meter is in Ω mode.
        </p>
        <p>
          This is one of the most important practical safety differences
          between resistance checks and voltage checks.
        </p>
      </SectionCard>

      <SectionCard title="Typical resistance examples" eyebrow="Practical Logic">
        <p>
          A <strong>220Ω resistor</strong> is a low-value resistor, so a lower
          ohms range works well.
        </p>
        <p>
          A <strong>680Ω resistor</strong> still fits comfortably in that same
          general low-ohms range.
        </p>
        <p>
          A <strong>2.2kΩ resistor</strong> is larger, so the meter usually
          needs a higher ohms range to display it correctly.
        </p>
        <p>
          The logic is simple: estimate the resistor value first, then choose
          the ohms range that can display it clearly.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="High Priority">
        <p>
          Do not try to measure resistance on a live powered circuit.
        </p>
        <p>
          Do not leave the dial in voltage or current mode when the lesson is
          asking for resistance measurement.
        </p>
        <p>
          Do not move the red lead to the <strong>10A</strong> jack for an
          ohms test.
        </p>
        <p>
          And do not place both probes on the same side of the component,
          because that does not measure the resistor properly.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistance tells us how strongly a component opposes current flow.</li>
          <li>Resistance is measured with power off.</li>
          <li>The meter must be in the Ω family.</li>
          <li>The black lead stays in COM and the red lead stays in VΩmA.</li>
          <li>One probe goes on each resistor terminal.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these short questions to lock in the key resistance rules.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
