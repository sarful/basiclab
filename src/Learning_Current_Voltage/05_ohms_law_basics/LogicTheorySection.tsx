"use client";

import {
  DEFAULT_CURRENT,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  formatNumber,
  getFlowPercent,
  solveOhmsLaw,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";
import { WaterFlowAnalogyPreview } from "../../water-flow analogy/WaterFlowAnalogyPreview";

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
  const solved = solveOhmsLaw(
    "current",
    DEFAULT_VOLTAGE,
    DEFAULT_CURRENT,
    DEFAULT_RESISTANCE,
  );
  const flowPercent = getFlowPercent(solved.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does Ohm's Law help us calculate?",
      answer: "Ohm's Law helps us calculate voltage, current, or resistance when the other two values are known.",
    },
    {
      question: "What does I = V / R mean?",
      answer: "It means current equals voltage divided by resistance.",
    },
    {
      question: "If voltage stays the same and resistance increases, what happens to current?",
      answer: "Current decreases because the push stays the same while the opposition becomes larger.",
    },
    {
      question: "Why is Ohm's Law useful in real work?",
      answer: "It helps technicians predict circuit behavior, choose parts, and test whether a circuit is working correctly.",
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
              Ohm&apos;s Law Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Ohm&apos;s Law is the simple rule that connects voltage, current, and resistance.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in a simple way. You do not need any advanced math to understand the idea.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Voltage is the push, current is the flow, and resistance is the difficulty in the path. Ohm&apos;s Law tells us how those three work together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${solved.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Strength" value={`${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Ohm&apos;s Law is a rule that connects three basic circuit values: voltage, current, and resistance.
        </p>
        <p>
          In simple English, it tells us how push, flow, and opposition affect one another.
        </p>
        <p>
          If we know any two of those values, we can calculate the third one.
        </p>
        <p>
          The three common forms are <strong>I = V / R</strong>, <strong>V = I × R</strong>, and <strong>R = V / I</strong>.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does Ohm&apos;s Law connect voltage, current, and resistance, or only current by itself?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Ohm&apos;s Law is important because it helps us understand what a circuit should do before we even build it.
        </p>
        <p>
          It helps students, technicians, and engineers calculate safe values and predict how much current will flow.
        </p>
        <p>
          It also helps when testing a real circuit. If the measured value does not match the expected value, that can tell us something is wrong.
        </p>
        <p>
          <strong>Main point:</strong> Ohm&apos;s Law helps us calculate missing circuit values.
        </p>
        <p>
          <strong>What to notice:</strong> It is useful for design, testing, and troubleshooting.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is it useful to know the expected current before powering a circuit?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          Ohm&apos;s Law works by showing the relationship between voltage, current, and resistance.
        </p>
        <p>
          If voltage increases while resistance stays the same, current increases. If resistance increases while voltage stays the same, current decreases.
        </p>
        <p>
          A common beginner mistake is to memorize only one formula and forget that the same relationship can be rearranged in three useful ways.
        </p>
        <p>
          In this simulation, the battery gives <strong>{solved.voltage.toFixed(1)} V</strong>. The resistor is <strong>{solved.resistance.toFixed(1)} Ohm</strong>. Because of that combination, the current becomes <strong>{solved.current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation: <strong>I = V / R = {formatNumber(solved.voltage, 1)} / {formatNumber(solved.resistance, 1)} = {formatNumber(solved.current, 2)} A</strong>
        </p>
        <p>
          The same relationship can also be written as <strong>V = I × R</strong> and <strong>R = V / I</strong>.
        </p>
        <p>
          <strong>Main point:</strong> Ohm&apos;s Law does not create circuit values. It describes how the three values already work together.
        </p>
        <p>
          <strong>Main point:</strong> Changing one value changes at least one of the others.
        </p>
        <p>
          <strong>
            Checkpoint Question: If resistance stays the same and voltage goes up, what usually happens to current?
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
                <p>
                  Think about a technician choosing a resistor for an LED circuit.
                </p>
                <p>
                  The technician may know the battery voltage and the safe current for the LED. Using Ohm&apos;s Law, the technician can calculate the right resistor value.
                </p>
                <p>
                  In the same way, a student measuring voltage and resistance in a training lab can use Ohm&apos;s Law to estimate the expected current before turning on the circuit.
                </p>
                <p>
                  This is why Ohm&apos;s Law is used in training labs, control panels, repair work, and electronics design.
                </p>
                <p>
                  When you look at a real device, imagine this question: which two values do I know, and which one do I want to calculate?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: If you know voltage and resistance, which value can you calculate with Ohm&apos;s Law?
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <WaterFlowAnalogyPreview />
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Ohm&apos;s Law connects voltage, current, and resistance.</li>
          <li>Voltage is the push, current is the flow, and resistance is the opposition.</li>
          <li>If you know any two values, you can calculate the third one.</li>
          <li>I = V / R is used to calculate current.</li>
          <li>V = I × R is used to calculate voltage.</li>
          <li>R = V / I is used to calculate resistance.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
