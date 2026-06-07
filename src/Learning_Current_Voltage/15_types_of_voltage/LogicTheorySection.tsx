"use client";

import {
  calculateCurrent,
  calculateRms,
  DEFAULT_AC_FREQUENCY,
  DEFAULT_AC_PEAK_VOLTAGE,
  DEFAULT_AC_RESISTANCE,
  DEFAULT_DC_RESISTANCE,
  DEFAULT_DC_VOLTAGE,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "cyan";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

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
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
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

export function LogicTheorySection() {
  const dcCurrent = calculateCurrent(DEFAULT_DC_VOLTAGE, DEFAULT_DC_RESISTANCE);
  const acRmsVoltage = calculateRms(DEFAULT_AC_PEAK_VOLTAGE);
  const acRmsCurrent = calculateCurrent(acRmsVoltage, DEFAULT_AC_RESISTANCE);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the simplest difference between DC voltage and AC voltage?",
      answer:
        "DC voltage stays steady in one direction, while AC voltage changes direction in a repeating pattern.",
    },
    {
      question: "Why is RMS useful for AC voltage?",
      answer:
        "RMS gives a practical working value that helps us compare AC with steady DC more clearly.",
    },
    {
      question: "If voltage rises and resistance stays the same, what happens to current?",
      answer:
        "Current rises, because a stronger voltage push moves more charge through the same resistance.",
    },
    {
      question: "What does frequency describe in AC voltage?",
      answer:
        "Frequency tells us how fast the AC pattern repeats over time.",
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
              Types of Voltage
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson helps you compare steady voltage and changing voltage in a simple way.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will look at DC voltage and AC voltage step by step using clear beginner-friendly language.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. One voltage stays steady. The other voltage changes with time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Voltage" value={`${DEFAULT_DC_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} V`} tone="blue" />
            <ValueCard label="Frequency" value={`${DEFAULT_AC_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Types of voltage means the different ways voltage can behave in a circuit.
        </p>
        <p>
          The two main types in this lesson are direct voltage and alternating voltage.
        </p>
        <p>
          Direct voltage, or DC voltage, stays steady in one direction.
        </p>
        <p>
          Alternating voltage, or AC voltage, changes direction in a repeating pattern over time.
        </p>
        <p>
          <strong>
            Checkpoint Question: What are the two main voltage types in this lesson?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic matters because real electrical systems do not all use the same kind of voltage.
        </p>
        <p>
          Some systems need a steady source, while others work with a changing voltage pattern.
        </p>
        <p>
          If you understand the voltage type first, later topics like current, power, and device behavior become easier to understand.
        </p>
        <p>
          Beginners often look only at the voltage number and forget that voltage behavior also matters.
        </p>
        <p>
          <strong>Main point:</strong> Voltage type changes how a system pushes charge.
        </p>
        <p>
          <strong>Main point:</strong> Batteries and wall power usually use different voltage forms.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is it useful to know the voltage type before studying a device?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          DC voltage stays at one steady level, so the push on charge stays stable.
        </p>
        <p>
          AC voltage rises, falls, and reverses direction, so the push keeps changing over time.
        </p>
        <p>
          In this lesson, the DC voltage is <strong>{DEFAULT_DC_VOLTAGE.toFixed(1)} V</strong> and the resistance is <strong>{DEFAULT_DC_RESISTANCE.toFixed(1)} Ohm</strong>.
        </p>
        <p>
          That gives a DC current of <strong>{dcCurrent.toFixed(2)} A</strong>.
        </p>
        <p>
          The AC peak voltage is <strong>{DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} V</strong>, the frequency is <strong>{DEFAULT_AC_FREQUENCY.toFixed(1)} Hz</strong>, and the resistance is <strong>{DEFAULT_AC_RESISTANCE.toFixed(1)} Ohm</strong>.
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} / sqrt(2) = {acRmsVoltage.toFixed(2)} V
          </strong>
        </p>
        <p>
          With that RMS voltage and the same resistance, the AC RMS current becomes <strong>{acRmsCurrent.toFixed(2)} A</strong>.
        </p>
        <p>
          A common beginner mistake is to think AC voltage should be read exactly like DC voltage. But AC often needs ideas like peak, RMS, and frequency to describe it clearly.
        </p>
        <p>
          <strong>Main point:</strong> DC voltage gives a steady push.
        </p>
        <p>
          <strong>Main point:</strong> AC voltage needs both size and frequency to describe its behavior.
        </p>
        <p>
          <strong>
            Checkpoint Question: What extra value helps describe AC voltage besides voltage size?
          </strong>
        </p>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-cyan-300 to-sky-400" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Real Device Example
              </div>
              <h2 className="text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                Real-world example
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>Think about a battery charger and a wall outlet.</p>
                <p>
                  A battery side normally works with steady DC voltage.
                </p>
                <p>
                  A wall outlet normally gives AC voltage that changes direction again and again.
                </p>
                <p>
                  That is why many electronic devices need adapters, rectifiers, or power supplies between the outlet and the final circuit.
                </p>
                <p>
                  When you look at a real system, ask this question first: is the voltage steady or alternating?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Which source usually gives AC voltage, a battery or a wall outlet?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage can appear in different forms.</li>
          <li>DC voltage is steady and one-directional.</li>
          <li>AC voltage changes direction over time.</li>
          <li>AC is often described with peak, RMS, and frequency.</li>
          <li>Steady voltage gives a steady push on charge.</li>
          <li>Changing voltage creates a changing push on charge.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
