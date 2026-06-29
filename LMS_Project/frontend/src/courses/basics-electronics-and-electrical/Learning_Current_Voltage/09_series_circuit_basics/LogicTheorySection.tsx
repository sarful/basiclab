"use client";

import {
  DEFAULT_RESISTANCE_ONE,
  DEFAULT_RESISTANCE_TWO,
  DEFAULT_VOLTAGE,
  LED_DROP,
  getFlowLevel,
  getFlowPercent,
  solveSeriesCircuitLesson,
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
  const solved = solveSeriesCircuitLesson(
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE_ONE,
    DEFAULT_RESISTANCE_TWO,
  );
  const flowPercent = getFlowPercent(solved.current);
  const flowLevel = getFlowLevel(solved.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a series circuit in simple language?",
      answer:
        "A series circuit is a circuit where components are connected one after another in a single path.",
    },
    {
      question: "How many current paths are there in a series circuit?",
      answer:
        "There is only one current path in a series circuit.",
    },
    {
      question: "What happens to total resistance in a series circuit?",
      answer:
        "The resistances add together, so the total resistance becomes larger.",
    },
    {
      question: "What happens if one part in a series circuit opens?",
      answer:
        "If one part opens, the whole circuit stops because the single path is broken.",
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
              Series Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              In a series circuit, current has only one path to follow.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in simple language. You do not need
              advanced theory before starting this lesson.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. In a series circuit, components stand in
              one line, so the same current passes through each one.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${solved.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={flowLevel} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A series circuit is a circuit where components are connected one after
          another in a single path.
        </p>
        <p>
          In simple English, current has only one road to follow.
        </p>
        <p>
          That means the same current passes through resistor one, resistor two,
          the LED, and the rest of the path.
        </p>
        <p>
          If any one part opens, the whole path breaks and the circuit stops.
        </p>
        <p>
          <strong>
            Checkpoint Question: In a series circuit, does current have one path or many paths?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because many simple training circuits and basic
          control circuits are built in series.
        </p>
        <p>
          It helps students understand how current behaves when all parts share a
          single path.
        </p>
        <p>
          Technicians also use this idea when they test continuity, find broken
          connections, and calculate total resistance.
        </p>
        <p>
          <strong>Main point:</strong> One broken part can stop the whole series circuit.
        </p>
        <p>
          <strong>What to notice:</strong> Resistances add together in series.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why can one broken component stop the whole series circuit?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          In a series circuit, the source pushes current through every component
          along one complete path.
        </p>
        <p>
          Because there is only one path, the same current flows through all the
          series components.
        </p>
        <p>
          The resistances add together. In this lesson, resistor one is{" "}
          <strong>{solved.resistanceOne.toFixed(1)} Ohm</strong> and resistor two is{" "}
          <strong>{solved.resistanceTwo.toFixed(1)} Ohm</strong>, so the total
          resistance becomes <strong>{solved.totalResistance.toFixed(1)} Ohm</strong>.
        </p>
        <p>
          The LED also uses about <strong>{solved.ledDrop.toFixed(1)} V</strong>, so the
          available voltage across the resistors becomes smaller.
        </p>
        <p>
          Simple calculation:{" "}
          <strong>
            I = (V - LED drop) / R total = ({solved.voltage.toFixed(1)} - {LED_DROP.toFixed(1)}) /{" "}
            {solved.totalResistance.toFixed(1)} = {solved.current.toFixed(2)} A
          </strong>
        </p>
        <p>
          A common beginner mistake is to think each resistor gets a different
          current in series. In reality, the current is the same through the whole path.
        </p>
        <p>
          The voltage drops divide across the resistors. In this example, one drop is{" "}
          <strong>{solved.dropOne.toFixed(1)} V</strong> and the other is{" "}
          <strong>{solved.dropTwo.toFixed(1)} V</strong>.
        </p>
        <p>
          <strong>Main point:</strong> Series circuit means one path and shared current.
        </p>
        <p>
          <strong>Main point:</strong> Total resistance increases when more series resistors are added.
        </p>
        <p>
          <strong>
            Checkpoint Question: What happens to total resistance when you add another resistor in series?
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
                <p>Think about a flashlight with batteries, a switch, and a lamp in one line.</p>
                <p>
                  Current leaves the battery, passes through the switch, then through
                  the lamp, and returns to the battery.
                </p>
                <p>
                  If the lamp filament breaks, the single path opens and the whole
                  flashlight stops working.
                </p>
                <p>
                  The same idea appears in simple sensor loops, basic training boards,
                  and many introductory control circuits.
                </p>
                <p>
                  When you look at a real series circuit, imagine this question: are
                  all the parts standing in one line on the same path?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: In a flashlight-style series circuit, what happens if one part fails open?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A series circuit has only one path for current.</li>
          <li>The same current flows through all series components.</li>
          <li>Resistances add together in series.</li>
          <li>Voltage drops are shared across the components.</li>
          <li>If one part opens, the whole circuit stops.</li>
          <li>Series circuits are useful for learning basic circuit behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
