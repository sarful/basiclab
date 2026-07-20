"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeComparisonSnapshot,
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
  const voltage = 12;
  const frequency = 1000;
  const sample = computeComparisonSnapshot({
    voltage,
    frequency,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the main difference between polarized and non-polarized capacitors?",
      answer:
        "Polarized capacitors need correct polarity, while non-polarized capacitors can usually be connected in either direction.",
    },
    {
      question: "Which type is commonly used for DC ripple smoothing in power supplies?",
      answer:
        "Polarized electrolytic capacitors are commonly used for DC ripple smoothing.",
    },
    {
      question: "Which type is better suited for AC coupling and signal work?",
      answer:
        "Non-polarized capacitors are better suited for AC coupling, audio, and RF signal applications.",
    },
    {
      question: "Why can reverse polarity be dangerous for a polarized capacitor?",
      answer:
        "Reverse polarity can damage the capacitor because polarized capacitors are designed for one connection direction.",
    },
    {
      question: "Why does frequency matter more in the non-polarized comparison side?",
      answer:
        "Because non-polarized capacitors are often used with AC signals, so frequency strongly affects their behavior and reactance.",
    },
    {
      question: "Can a non-polarized capacitor handle both positive and negative AC cycles?",
      answer:
        "Yes. That is one of the main reasons non-polarized capacitors are AC friendly.",
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
              Polarized vs Non-Polarized Capacitor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson compares two major capacitor families by focusing on
              connection direction, AC behavior, safety, and practical use.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key question is simple: when should we choose a polarized
              capacitor, and when should we choose a non-polarized capacitor?
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Once this comparison is clear, capacitor selection in real circuits
              becomes much easier.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Applied Voltage"
              value={`${formatNumber(voltage, 0)} V`}
              tone="violet"
            />
            <ValueCard
              label="Voltage Safety"
              value={`${formatNumber(sample.safeMargin * 100, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="AC Behavior"
              value={`${formatNumber(sample.acBehavior * 100, 0)} %`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is the core difference?" eyebrow="Core Concept">
        <p>
          A polarized capacitor must be connected with the correct positive and
          negative direction.
        </p>

        <p>
          A non-polarized capacitor normally does not have that direction
          restriction, so it can be used in either connection direction.
        </p>

        <p>
          This single difference strongly affects where each capacitor type is
          used in electronics.
        </p>

        <p>
          <strong>
            Checkpoint Question: If a circuit has alternating polarity, which
            capacitor type is usually safer to choose?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Where is each type used?" eyebrow="Application Choice">
        <p>
          Polarized capacitors, especially electrolytic types, are widely used
          in power supply filtering, bulk energy storage, and DC ripple
          smoothing.
        </p>

        <p>
          Non-polarized capacitors are common in AC coupling, audio circuits,
          timing networks, and RF applications.
        </p>

        <p>
          So in practical design, the capacitor choice is not random. It depends
          on whether the circuit is mainly DC-focused or AC-signal-focused.
        </p>
      </SectionCard>

      <SectionCard title="Why is polarity important?" eyebrow="Safety Rule">
        <p>
          For a polarized capacitor, correct polarity is a basic safety and
          reliability rule.
        </p>

        <p>
          If reverse polarity is applied, the capacitor may heat up, degrade, or
          become damaged.
        </p>

        <p>
          In this sample comparison, the applied voltage is{" "}
          <strong>{formatNumber(voltage, 0)} V</strong>, leaving about{" "}
          <strong>{formatNumber(sample.safeMargin * 100, 0)} %</strong> safety
          relative to a 25 V reference level.
        </p>
      </SectionCard>

      <SectionCard title="Why are non-polarized capacitors AC friendly?" eyebrow="AC Behavior">
        <p>
          Non-polarized capacitors can work with both positive and negative
          signal swings, which makes them suitable for AC circuits.
        </p>

        <p>
          Frequency matters here because capacitor behavior changes with AC
          frequency and reactance.
        </p>

        <p>
          In this example, the comparison uses{" "}
          <strong>{formatNumber(frequency, 0)} Hz</strong>, giving an AC behavior
          indicator of about <strong>{formatNumber(sample.acBehavior * 100, 0)} %</strong>.
        </p>
      </SectionCard>

      <SectionCard title="How should we choose between them?" eyebrow="Selection Logic">
        <p>
          Choose a polarized capacitor when you need high capacitance and the
          circuit polarity is fixed and known.
        </p>

        <p>
          Choose a non-polarized capacitor when the signal changes direction, or
          when the circuit is handling AC, audio, or higher-frequency content.
        </p>

        <p>
          A good engineer first checks polarity conditions, then checks voltage,
          frequency, and the purpose of the circuit.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          This lesson is less about one equation and more about a practical
          decision rule.
        </p>

        <p>
          <strong>
            Fixed DC polarity plus large capacitance need usually points toward
            a polarized capacitor.
          </strong>
        </p>

        <p>
          <strong>
            Alternating signal direction or AC handling usually points toward a
            non-polarized capacitor.
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a power supply output stage, a polarized electrolytic capacitor is
          often used to smooth ripple because high capacitance is useful there
          and polarity is fixed.
        </p>

        <p>
          In an audio coupling stage, a non-polarized capacitor is often the
          safer choice because the signal can swing positive and negative.
        </p>

        <p>
          These two examples show why understanding capacitor type matters more
          than just memorizing a definition.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Polarized capacitors need correct connection direction.</li>
          <li>Non-polarized capacitors can usually connect in either direction.</li>
          <li>Polarized types are common in DC filtering and ripple smoothing.</li>
          <li>Non-polarized types are common in AC coupling and signal circuits.</li>
          <li>Reverse polarity can damage a polarized capacitor.</li>
          <li>Frequency behavior is especially important for AC applications.</li>
          <li>Capacitor selection depends on polarity, voltage, frequency, and use case.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
