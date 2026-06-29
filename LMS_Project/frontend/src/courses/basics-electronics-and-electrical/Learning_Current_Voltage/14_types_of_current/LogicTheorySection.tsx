"use client";

import {
  DEFAULT_AC_PEAK_CURRENT,
  DEFAULT_DC_CURRENT,
  DEFAULT_FREQUENCY,
  calculateRmsCurrent,
  getCurrentStrengthPercent,
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
  const dcStrength = getCurrentStrengthPercent(DEFAULT_DC_CURRENT);
  const acStrength = getCurrentStrengthPercent(DEFAULT_AC_PEAK_CURRENT);
  const acRms = calculateRmsCurrent(DEFAULT_AC_PEAK_CURRENT);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the simplest type of current from a battery?",
      answer: "A battery normally gives direct current, or DC.",
    },
    {
      question: "What is the main idea of alternating current?",
      answer:
        "Alternating current changes direction again and again over time.",
    },
    {
      question: "Can two current types have the same peak value but different behavior?",
      answer:
        "Yes. They can have similar sizes while behaving very differently because one is steady and the other alternates.",
    },
    {
      question: "What does frequency describe in AC?",
      answer:
        "Frequency tells us how fast the AC pattern repeats or changes direction.",
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
              Types of Current
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson helps you see the main current types in a simple side-by-side way.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will compare steady current and changing current step by step in beginner-friendly language.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. One type stays steady. The other type changes with time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Current" value={`${DEFAULT_DC_CURRENT.toFixed(1)} A`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK_CURRENT.toFixed(1)} A`} tone="blue" />
            <ValueCard label="Frequency" value={`${DEFAULT_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Types of current means the different ways electric current can behave.
        </p>
        <p>
          The two main types in this lesson are direct current and alternating current.
        </p>
        <p>
          Direct current, or DC, moves in one steady direction.
        </p>
        <p>
          Alternating current, or AC, changes direction over time in a repeating pattern.
        </p>
        <p>
          <strong>
            Checkpoint Question: What are the two main current types in this lesson?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because real electrical systems use different current types for different jobs.
        </p>
        <p>
          If you understand the current type first, later lessons about devices, circuits, and safety become easier to follow.
        </p>
        <p>
          Beginners often focus only on the number value and forget that current behavior also matters.
        </p>
        <p>
          <strong>Main point:</strong> Current type affects how electricity behaves in a system.
        </p>
        <p>
          <strong>Main point:</strong> Batteries, electronics, outlets, and machines can use different current forms.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is it useful to know the current type before studying a system?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          DC stays steady in one direction, so its current pattern looks flat and stable.
        </p>
        <p>
          AC rises, falls, and reverses direction, so its current pattern changes over time.
        </p>
        <p>
          In this lesson, the DC current is <strong>{DEFAULT_DC_CURRENT.toFixed(1)} A</strong>, which gives a strength of about <strong>{dcStrength}%</strong>.
        </p>
        <p>
          The AC peak current is <strong>{DEFAULT_AC_PEAK_CURRENT.toFixed(1)} A</strong>, and the frequency is <strong>{DEFAULT_FREQUENCY.toFixed(1)} Hz</strong>.
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK_CURRENT.toFixed(1)} / sqrt(2) = {acRms.toFixed(2)} A
          </strong>
        </p>
        <p>
          A common beginner mistake is to think every current value should be read the same way. But AC often needs extra ideas like peak and RMS, while DC is usually read as a steady value.
        </p>
        <p>
          <strong>Main point:</strong> DC gives a steady current level.
        </p>
        <p>
          <strong>Main point:</strong> AC needs both size and frequency to describe its behavior clearly.
        </p>
        <p>
          <strong>
            Checkpoint Question: What extra value helps describe AC besides current size?
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
                <p>Think about a battery-powered flashlight and a home wall outlet.</p>
                <p>
                  The flashlight battery gives DC, so the current stays steady in one direction.
                </p>
                <p>
                  The wall outlet gives AC, so the current changes direction again and again.
                </p>
                <p>
                  This is why some devices work directly from batteries, while others need adapters or conversion stages.
                </p>
                <p>
                  When you look at a real device, ask this question first: does it use a steady current or an alternating one?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Which example usually uses AC, a flashlight battery or a wall outlet?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Current can appear in different forms.</li>
          <li>DC is steady and moves in one direction.</li>
          <li>AC changes direction over time.</li>
          <li>AC is often described with peak, RMS, and frequency.</li>
          <li>Batteries usually give DC.</li>
          <li>Wall power usually gives AC.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
