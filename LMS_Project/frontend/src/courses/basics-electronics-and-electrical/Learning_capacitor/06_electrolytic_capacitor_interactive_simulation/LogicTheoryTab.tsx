"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeElectrolyticSnapshot,
  formatCapacitance,
  formatEnergy,
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
  const capacitance = 1000;
  const voltageRating = 25;
  const appliedVoltage = 12;
  const esr = 0.22;
  const rippleCurrent = 0.35;
  const polarity = "correct" as const;

  const sample = computeElectrolyticSnapshot({
    capacitance,
    voltageRating,
    appliedVoltage,
    esr,
    rippleCurrent,
    polarity,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the most important handling rule for an electrolytic capacitor?",
      answer:
        "Polarity must be connected correctly because electrolytic capacitors are polarized components.",
    },
    {
      question: "Why are electrolytic capacitors popular in power supplies?",
      answer:
        "They can provide relatively large capacitance, which helps smooth ripple and store useful energy.",
    },
    {
      question: "What happens if applied voltage gets too close to the voltage rating?",
      answer:
        "The safety margin becomes small, stress increases, and reliability risk becomes higher.",
    },
    {
      question: "Why does ESR matter?",
      answer:
        "ESR causes power loss and heating, especially when ripple current flows through the capacitor.",
    },
    {
      question: "What is the relationship between ripple current and heating?",
      answer:
        "Higher ripple current creates more heat loss, especially when ESR is not low.",
    },
    {
      question: "Why can reverse polarity be dangerous for an electrolytic capacitor?",
      answer:
        "Reverse polarity increases internal stress and leakage risk and can damage the capacitor.",
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
              Electrolytic Capacitor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              An electrolytic capacitor is a polarized capacitor designed to
              provide relatively large capacitance in a compact package.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the key ideas are polarity, large energy storage,
              voltage safety margin, ESR heating, ripple current, and smoothing
              behavior in power circuits.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              These capacitors are especially common in power supplies, bulk
              filtering, and DC smoothing applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Stored Energy"
              value={formatEnergy(sample.storedEnergy)}
              tone="emerald"
            />
            <ValueCard
              label="Safety Margin"
              value={`${formatNumber(sample.safetyMargin, 0)} %`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is an electrolytic capacitor?" eyebrow="Core Concept">
        <p>
          An electrolytic capacitor is a capacitor that uses an electrolytic
          structure to achieve much larger capacitance than many small signal
          capacitor types.
        </p>

        <p>
          Unlike most ceramic capacitors, electrolytic capacitors are{" "}
          <strong>polarized</strong>. That means the positive and negative
          terminals must be connected in the correct direction.
        </p>

        <p>
          This polarity rule is one of the most important things to remember
          when selecting or wiring this component.
        </p>

        <p>
          <strong>
            Checkpoint Question: Why is polarity such a critical issue for an
            electrolytic capacitor?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it useful?" eyebrow="Why It Matters">
        <p>
          Electrolytic capacitors are useful because they can store more charge
          and more energy than many smaller capacitor types of similar size.
        </p>

        <p>
          That makes them very helpful for smoothing rectified DC, supporting
          load changes, and reducing ripple in power supply circuits.
        </p>

        <p>
          In this example, the capacitor value is{" "}
          <strong>{formatCapacitance(capacitance)}</strong>, which is large
          enough to make bulk filtering practical.
        </p>
      </SectionCard>

      <SectionCard title="Why does voltage margin matter?" eyebrow="Safety Margin">
        <p>
          Every electrolytic capacitor has a voltage rating, and the applied
          voltage should stay comfortably below that limit during normal
          operation.
        </p>

        <p>
          In this sample, the applied voltage is <strong>{appliedVoltage} V</strong>{" "}
          and the rating is <strong>{voltageRating} V</strong>.
        </p>

        <p>
          That gives a safety margin of about{" "}
          <strong>{formatNumber(sample.safetyMargin, 0)} %</strong>. A healthier
          margin usually means lower stress and longer service life.
        </p>
      </SectionCard>

      <SectionCard title="What role does ESR play?" eyebrow="Loss and Heating">
        <p>
          ESR stands for equivalent series resistance. It represents internal
          resistive loss inside the capacitor.
        </p>

        <p>
          When ripple current flows, ESR causes heat. In this example, the ESR
          is <strong>{esr} Ohm</strong> and ripple current is{" "}
          <strong>{rippleCurrent} A</strong>.
        </p>

        <p>
          The estimated heat loss is about{" "}
          <strong>{formatNumber(sample.heatLoss * 1000, 2)} mW</strong>.
          Lower ESR usually helps reduce heating and improves performance in
          power filtering jobs.
        </p>
      </SectionCard>

      <SectionCard title="How does ripple smoothing work?" eyebrow="Smoothing Behavior">
        <p>
          In a power supply, the capacitor charges when input voltage rises and
          releases stored energy when the voltage falls between peaks.
        </p>

        <p>
          That charging and discharging action helps smooth the output voltage
          and reduce ripple seen by the load.
        </p>

        <p>
          Larger capacitance generally improves smoothing, while excessive ESR
          makes performance worse and generates more heat.
        </p>
      </SectionCard>

      <SectionCard title="Why is reverse polarity risky?" eyebrow="Polarity Risk">
        <p>
          Electrolytic capacitors are not meant to be connected backwards in
          normal DC operation.
        </p>

        <p>
          Reverse polarity can sharply increase internal stress, raise leakage
          risk, and may permanently damage the component.
        </p>

        <p>
          That is why correct polarity marking and careful installation are so
          important in practical electronics work.
        </p>
      </SectionCard>

      <SectionCard title="Main formula to remember" eyebrow="Formula Sheet">
        <p>
          <strong>E = 1/2 C V^2</strong> is the main energy-storage formula for
          a capacitor.
        </p>

        <p>
          In this sample, the stored energy is about{" "}
          <strong>{formatEnergy(sample.storedEnergy)}</strong>.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: when capacitance or voltage increases, the stored
          energy rises quickly, which is why electrolytic capacitors are useful
          in bulk energy storage roles.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a DC power supply after rectification, an electrolytic capacitor is
          often placed across the output to smooth the pulsating voltage.
        </p>

        <p>
          It stores energy during higher parts of the waveform and releases that
          energy when the waveform dips, helping the load see a steadier DC
          voltage.
        </p>

        <p>
          This is one of the most common and important uses of electrolytic
          capacitors in electronics.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Electrolytic capacitors are polarized components.</li>
          <li>They provide relatively large capacitance in a compact size.</li>
          <li>They are widely used in power supply smoothing and filtering.</li>
          <li>Applied voltage should stay below the voltage rating.</li>
          <li>ESR causes heating when ripple current flows.</li>
          <li>Reverse polarity can increase leakage risk and damage the part.</li>
          <li>Stored energy follows the formula E = 1/2 C V^2.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
