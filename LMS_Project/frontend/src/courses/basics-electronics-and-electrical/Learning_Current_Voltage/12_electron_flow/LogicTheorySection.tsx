"use client";

import {
  DEFAULT_DIRECTION,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  calculateCurrent,
  getDriftDescription,
  getFlowLevel,
  getFlowPercent,
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
  const current = calculateCurrent(DEFAULT_VOLTAGE, DEFAULT_RESISTANCE);
  const flowPercent = getFlowPercent(current);
  const flowLevel = getFlowLevel(current);
  const driftText = getDriftDescription(DEFAULT_DIRECTION);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is electron flow in simple language?",
      answer:
        "Electron flow means electrons move through a conductor from the negative terminal toward the positive terminal.",
    },
    {
      question: "Which direction do electrons move in a basic DC circuit?",
      answer:
        "Electrons move from the negative terminal to the positive terminal.",
    },
    {
      question: "What is conventional current?",
      answer:
        "Conventional current is the standard current direction used in diagrams, from positive to negative.",
    },
    {
      question: "Can electron flow and conventional current point in opposite directions?",
      answer:
        "Yes. In a simple DC circuit, they point in opposite directions.",
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
              Electron Flow
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Electron flow explains how negatively charged electrons move inside a circuit.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in simple language. You do not need
              advanced theory before starting this lesson.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Electrons drift from the negative side
              toward the positive side in a basic DC circuit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={`${flowLevel} - ${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Electron flow means electrons move through a conductor inside a complete circuit.
        </p>
        <p>
          Electrons are negatively charged particles. In simple English, they are tiny charge carriers that move inside the wire.
        </p>
        <p>
          In a basic DC circuit, electron flow moves from the negative terminal toward the positive terminal.
        </p>
        <p>
          This is different from conventional current, which is the standard diagram direction used from positive to negative.
        </p>
        <p>
          <strong>
            Checkpoint Question: In a simple DC circuit, do electrons move from negative to positive, or from positive to negative?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because many beginners hear about current direction and electron direction and think they are exactly the same thing.
        </p>
        <p>
          If you understand electron flow, circuit diagrams, troubleshooting, and electrical explanations become easier to follow.
        </p>
        <p>
          Technicians and students often use conventional current in symbols and drawings, but it still helps to know what the actual electrons are doing.
        </p>
        <p>
          <strong>Main point:</strong> Electron flow helps explain what physically moves inside the conductor.
        </p>
        <p>
          <strong>What to notice:</strong> Diagram current direction and electron movement direction are opposite in a simple DC circuit.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is it useful to know both electron flow and conventional current direction?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          A source such as a battery creates an electric push, and that push makes electrons drift through the circuit.
        </p>
        <p>
          Electrons do not jump randomly from nowhere. They move through a complete path made from wires and components.
        </p>
        <p>
          In this lesson, the battery gives <strong>{DEFAULT_VOLTAGE.toFixed(1)} V</strong> and the circuit resistance is{" "}
          <strong>{DEFAULT_RESISTANCE.toFixed(1)} Ohm</strong>, so the current becomes{" "}
          <strong>{current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation:{" "}
          <strong>
            I = V / R = {DEFAULT_VOLTAGE.toFixed(1)} / {DEFAULT_RESISTANCE.toFixed(1)} = {current.toFixed(2)} A
          </strong>
        </p>
        <p>
          In this simulation, the default direction view is: <strong>{driftText}</strong>
        </p>
        <p>
          A common beginner mistake is to think electrons and conventional current are the same direction. In reality, they point opposite ways in a basic DC circuit.
        </p>
        <p>
          <strong>Main point:</strong> Electron flow describes real negative charges moving in the wire.
        </p>
        <p>
          <strong>Main point:</strong> Conventional current is still the standard direction used in most circuit diagrams.
        </p>
        <p>
          <strong>
            Checkpoint Question: What is the main direction difference between electron flow and conventional current?
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
                <p>Think about a battery, a wire, and a small lamp.</p>
                <p>
                  When the path is complete, electrons drift through the wire and the lamp can light up.
                </p>
                <p>
                  In training labs, textbooks, and circuit diagrams, you will usually see conventional current arrows. But inside the metal conductor, electrons are the actual moving charges.
                </p>
                <p>
                  This idea helps when you study semiconductors, batteries, grounding, and later electronics topics.
                </p>
                <p>
                  When you look at a real circuit, ask this question: am I talking about the real moving electrons, or the standard current direction shown in diagrams?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: In a battery-and-lamp circuit, what actually moves inside the wire?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Electron flow means electrons move through a conductor.</li>
          <li>Electrons are negatively charged particles.</li>
          <li>In a simple DC circuit, electrons move from negative to positive.</li>
          <li>Conventional current goes from positive to negative.</li>
          <li>These two directions are opposite in a basic DC circuit.</li>
          <li>Knowing the difference helps with circuit understanding and troubleshooting.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
