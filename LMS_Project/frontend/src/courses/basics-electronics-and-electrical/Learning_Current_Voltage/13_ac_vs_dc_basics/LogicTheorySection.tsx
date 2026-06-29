"use client";

import {
  DEFAULT_AC_PEAK,
  DEFAULT_DC_LEVEL,
  DEFAULT_FREQUENCY,
  getAcStrength,
  getDcStrength,
  getRmsFromPeak,
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
  const dcStrength = Math.round(getDcStrength(DEFAULT_DC_LEVEL));
  const acStrength = Math.round(getAcStrength(DEFAULT_AC_PEAK));
  const acRms = getRmsFromPeak(DEFAULT_AC_PEAK);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does DC mean in simple language?",
      answer:
        "DC means direct current. It flows in one steady direction.",
    },
    {
      question: "What does AC mean in simple language?",
      answer:
        "AC means alternating current. It changes direction again and again.",
    },
    {
      question: "Which one is common in batteries?",
      answer: "Batteries normally provide DC.",
    },
    {
      question: "Which one is common in home wall power?",
      answer: "Home wall power is AC in most countries.",
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
              AC vs DC Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson shows the simple difference between one-way current and changing current.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will compare DC and AC step by step in beginner-friendly language.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. DC moves one way. AC keeps changing direction.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Level" value={`${DEFAULT_DC_LEVEL.toFixed(1)} V`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK.toFixed(1)} V`} tone="blue" />
            <ValueCard label="AC Frequency" value={`${DEFAULT_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          AC and DC are two different ways electric current can behave.
        </p>
        <p>
          DC means direct current. In simple language, it moves in one main direction.
        </p>
        <p>
          AC means alternating current. In simple language, it keeps changing direction over time.
        </p>
        <p>
          This lesson is not about which one is better in every case. It is about understanding how they are different.
        </p>
        <p>
          <strong>
            Checkpoint Question: Which one changes direction, AC or DC?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because real electrical systems use both AC and DC.
        </p>
        <p>
          If you know the difference, you can understand batteries, chargers, adapters, home power, and many industrial systems more clearly.
        </p>
        <p>
          Beginners often mix them up and assume all current moves the same way. That creates confusion later.
        </p>
        <p>
          <strong>Main point:</strong> DC is common in batteries and electronics.
        </p>
        <p>
          <strong>Main point:</strong> AC is common in wall outlets and power distribution systems.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is it useful to know whether a system uses AC or DC?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          DC stays at one direction, so the push remains steady in the same way.
        </p>
        <p>
          AC keeps reversing direction, so the push changes back and forth again and again.
        </p>
        <p>
          In this lesson, the DC level is <strong>{DEFAULT_DC_LEVEL.toFixed(1)} V</strong>. That gives a steady strength of about <strong>{dcStrength}%</strong>.
        </p>
        <p>
          The AC side has a peak of <strong>{DEFAULT_AC_PEAK.toFixed(1)} V</strong> and a frequency of <strong>{DEFAULT_FREQUENCY.toFixed(1)} Hz</strong>.
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK.toFixed(1)} / sqrt(2) = {acRms.toFixed(2)} V
          </strong>
        </p>
        <p>
          A common beginner mistake is to think AC always means “more powerful” and DC always means “weaker.” The real difference is direction behavior, not a simple strong-versus-weak rule.
        </p>
        <p>
          <strong>Main point:</strong> DC is steady in one direction.
        </p>
        <p>
          <strong>Main point:</strong> AC changes direction repeatedly, and its frequency tells us how fast that change happens.
        </p>
        <p>
          <strong>
            Checkpoint Question: In this lesson, what tells us how fast the AC direction changes?
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
                <p>Think about a phone battery and a wall outlet.</p>
                <p>
                  A phone battery gives DC because the current moves in one main direction.
                </p>
                <p>
                  A home wall outlet gives AC because the current changes direction again and again.
                </p>
                <p>
                  Chargers and adapters are useful because they help convert power into the form the device needs.
                </p>
                <p>
                  When you look at a real system, ask this simple question first: is the current steady in one direction, or does it keep alternating?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Which real device example usually uses DC, a battery or a wall outlet?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DC means direct current.</li>
          <li>DC moves in one main direction.</li>
          <li>AC means alternating current.</li>
          <li>AC changes direction again and again.</li>
          <li>Frequency tells us how fast AC changes direction.</li>
          <li>Batteries usually give DC, and wall power is usually AC.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
