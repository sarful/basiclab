"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  codeOptions,
  computeCeramicSnapshot,
  dielectricOptions,
  formatCapacitancePf,
  formatNumber,
} from "./logic";

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
  const code = codeOptions[3].code;
  const dielectric = dielectricOptions[1];
  const appliedVoltage = 12;
  const voltageRating = 25;
  const frequency = 10000;

  const sample = computeCeramicSnapshot({
    code,
    dielectric,
    appliedVoltage,
    voltageRating,
    frequency,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does the code 104 mean on a ceramic capacitor?",
      answer:
        "It means 10 followed by 4 zeros in pF, which equals 100,000 pF or 100 nF.",
    },
    {
      question: "Why are ceramic capacitors common in decoupling circuits?",
      answer:
        "They are small, inexpensive, fast, and useful for shunting noise and high-frequency ripple.",
    },
    {
      question: "What happens to capacitive reactance when frequency increases?",
      answer:
        "Reactance decreases as frequency increases, so the capacitor opposes AC less strongly.",
    },
    {
      question: "Why does voltage rating matter?",
      answer:
        "Applied voltage should stay comfortably below the voltage rating to avoid stress and reliability problems.",
    },
    {
      question: "Which dielectric family is usually more stable: C0G/NP0 or Y5V?",
      answer:
        "C0G/NP0 is much more stable, while Y5V gives higher capacitance in small size but lower stability.",
    },
    {
      question: "Is a ceramic capacitor polarized?",
      answer:
        "Most common ceramic capacitors are non-polarized, so they can be connected in either direction.",
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
              Ceramic Capacitor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A ceramic capacitor is a compact, non-polarized capacitor that
              uses ceramic as the dielectric material between its plates.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the key ideas are code marking, dielectric type,
              voltage safety margin, and why higher frequency lowers capacitive
              reactance.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Ceramic capacitors are especially common in decoupling, bypassing,
              filtering, and many high-frequency electronic circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitancePf(sample.capacitancePf)}
              tone="violet"
            />
            <ValueCard
              label="Safety Margin"
              value={`${formatNumber(sample.safePercent, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="Reactance"
              value={`${formatNumber(sample.reactanceOhm, 2)} Ohm`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is a ceramic capacitor?" eyebrow="Core Concept">
        <p>
          A ceramic capacitor stores electric charge using a ceramic dielectric
          placed between conductive plates.
        </p>

        <p>
          Most ceramic capacitors are non-polarized, which means they usually do
          not need a fixed positive or negative connection direction.
        </p>

        <p>
          They are popular because they are small, reliable, inexpensive, and
          especially useful when circuits need fast response at higher
          frequencies.
        </p>

        <p>
          <strong>
            Checkpoint Question: Why is a ceramic capacitor often chosen for
            decoupling near IC power pins?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How do the printed codes work?" eyebrow="Code Marking">
        <p>
          Small ceramic capacitors often use a 3-digit code instead of printing
          the full capacitance value directly.
        </p>

        <p>
          The first two digits are significant figures, and the third digit
          tells how many zeros to add in pF.
        </p>

        <p>
          For example, <strong>{code}</strong> means{" "}
          <strong>{formatCapacitancePf(sample.capacitancePf)}</strong>.
        </p>

        <p>
          This compact code system helps identify capacitance quickly even on
          very small components.
        </p>
      </SectionCard>

      <SectionCard title="Why does dielectric type matter?" eyebrow="Material Behavior">
        <p>
          The dielectric is the ceramic material inside the capacitor, and it
          strongly affects stability, temperature drift, and application fit.
        </p>

        <p>
          In this lesson, <strong>{dielectric.name}</strong> is shown as a
          balanced everyday choice. It is common for decoupling and filtering.
        </p>

        <p>
          More stable families such as <strong>C0G / NP0</strong> are better
          for precision timing and RF circuits, while <strong>Y5V</strong> can
          provide more capacitance in a small size but with lower stability.
        </p>
      </SectionCard>

      <SectionCard title="Why is voltage rating important?" eyebrow="Safety Margin">
        <p>
          Every capacitor has a maximum voltage rating. The applied voltage in
          normal use should stay comfortably below that limit.
        </p>

        <p>
          In this example, the applied voltage is <strong>{appliedVoltage} V</strong>{" "}
          and the voltage rating is <strong>{voltageRating} V</strong>.
        </p>

        <p>
          That gives a safety margin of about{" "}
          <strong>{formatNumber(sample.safePercent, 0)} %</strong>. A healthier
          safety margin usually means lower stress and better long-term
          reliability.
        </p>
      </SectionCard>

      <SectionCard title="How does reactance behave?" eyebrow="Frequency Response">
        <p>
          A capacitor does not resist AC in the same way a resistor does.
          Instead, it has capacitive reactance, written as <strong>Xc</strong>.
        </p>

        <p>
          The main rule is simple: when frequency increases, capacitive
          reactance decreases.
        </p>

        <p>
          For this sample, at <strong>{formatNumber(frequency, 0)} Hz</strong>,
          the reactance is about <strong>{formatNumber(sample.reactanceOhm, 2)} Ohm</strong>.
        </p>

        <p>
          That is why ceramic capacitors are so effective for high-frequency
          bypassing and noise filtering.
        </p>
      </SectionCard>

      <SectionCard title="Main formula to remember" eyebrow="Formula Sheet">
        <p>
          <strong>Xc = 1 / (2pi f C)</strong> is the main reactance formula for
          a capacitor in AC circuits.
        </p>

        <p>
          This formula shows that reactance becomes smaller when frequency{" "}
          <strong>f</strong> becomes larger, or when capacitance{" "}
          <strong>C</strong> becomes larger.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: bigger capacitance and higher frequency both make
          it easier for AC variation to pass through the capacitor.
        </p>
      </SectionCard>

      <SectionCard title="Real-world use" eyebrow="Application Insight">
        <p>
          A ceramic capacitor placed close to a microcontroller power pin can
          quickly absorb fast noise and release charge during tiny voltage dips.
        </p>

        <p>
          In signal and RF sections, stable ceramic types are also used because
          they behave well at higher frequencies.
        </p>

        <p>
          This is why ceramic capacitors appear almost everywhere on modern
          circuit boards.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Ceramic capacitors use ceramic as the dielectric material.</li>
          <li>Most common ceramic capacitors are non-polarized.</li>
          <li>3-digit codes are used to show capacitance values.</li>
          <li>Dielectric type affects stability and temperature behavior.</li>
          <li>Applied voltage should stay below the voltage rating.</li>
          <li>Higher frequency means lower capacitive reactance.</li>
          <li>Ceramic capacitors are excellent for decoupling and filtering.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
