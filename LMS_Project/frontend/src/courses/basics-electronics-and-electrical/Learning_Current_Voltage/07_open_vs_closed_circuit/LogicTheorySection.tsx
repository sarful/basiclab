"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCircuitExplanation,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "red" | "blue";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

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
  const closedCurrent = calculateCurrent("closed", DEFAULT_VOLTAGE, DEFAULT_RESISTANCE);
  const openCurrent = calculateCurrent("open", DEFAULT_VOLTAGE, DEFAULT_RESISTANCE);
  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the main difference between an open circuit and a closed circuit?",
      answer: "A closed circuit has a complete path, while an open circuit has a broken path.",
    },
    {
      question: "Can current flow in an open circuit?",
      answer: "No. Current cannot flow when the path is broken.",
    },
    {
      question: "Why does the LED turn off in an open circuit?",
      answer: "The LED turns off because current cannot complete the loop through the circuit.",
    },
    {
      question: "Why is a closed path important in electronics?",
      answer: "A closed path is necessary because electrical charge must return to the source through a complete loop.",
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
              Open Circuit vs Closed Circuit
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A circuit works only when the electrical path is complete.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in a simple way. You do not need
              any previous electrical theory to understand this lesson.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. A closed circuit is like a full loop.
              An open circuit is like a broken road where movement must stop.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Closed State" value="Current Flows" tone="amber" />
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Closed Current" value={`${closedCurrent.toFixed(2)} A`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A closed circuit has a complete path from the source, through the components, and back to the source.
        </p>
        <p>
          An open circuit has a break somewhere in that path.
        </p>
        <p>
          In simple English, a closed circuit lets charge move, but an open circuit stops charge from moving.
        </p>
        <p>
          This is why a switch can turn a device on or off. It closes the path or opens the path.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does a circuit work when the path is complete or when the path is broken?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This idea is important because every working electrical circuit needs a complete path.
        </p>
        <p>
          If the path breaks, current stops immediately and the load stops working.
        </p>
        <p>
          Students, technicians, and electricians use this idea every day when they check switches, fuses, broken wires, and loose connections.
        </p>
        <p>
          <strong>Main point:</strong> A complete path is required for current flow.
        </p>
        <p>
          <strong>What to notice:</strong> Even one small break can stop the whole circuit.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why can one broken wire stop an entire circuit?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          In a closed circuit, the battery pushes charge through a full loop, so current can move through the components and return to the source.
        </p>
        <p>
          In an open circuit, there is a break in the loop, so charge cannot complete the path.
        </p>
        <p>
          A common beginner mistake is to think voltage alone can keep a device on. In reality, the voltage may still be present, but without a complete path current cannot flow.
        </p>
        <p>
          In this lesson, the closed circuit explanation is: <strong>{getCircuitExplanation("closed")}</strong>
        </p>
        <p>
          In the open state, the current becomes <strong>{openCurrent.toFixed(2)} A</strong> because the path is broken.
        </p>
        <p>
          In the closed state, with <strong>{DEFAULT_VOLTAGE.toFixed(1)} V</strong> and <strong>{DEFAULT_RESISTANCE.toFixed(1)} Ohm</strong>, the current becomes <strong>{closedCurrent.toFixed(2)} A</strong>.
        </p>
        <p>
          <strong>Main point:</strong> Current flows only when the loop is complete.
        </p>
        <p>
          <strong>Main point:</strong> A break in the path stops the entire circuit, not just one part of it.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why does the LED turn off when the circuit becomes open?
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
                  Think about a wall switch and a room light.
                </p>
                <p>
                  When you turn the switch on, the path closes and the light turns on.
                </p>
                <p>
                  When you turn the switch off, the path opens and the light turns off.
                </p>
                <p>
                  The same idea is used in door switches, emergency stop buttons, fuse holders, and many control panels.
                </p>
                <p>
                  When you look at a real device, imagine this question: is the path complete, or is there a break somewhere?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: In a room light circuit, what usually happens when the switch opens the path?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A closed circuit has a complete path.</li>
          <li>An open circuit has a broken path.</li>
          <li>Current flows only in a closed circuit.</li>
          <li>Open circuits make loads turn off.</li>
          <li>Switches work by opening or closing the path.</li>
          <li>One break can stop the whole circuit.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
