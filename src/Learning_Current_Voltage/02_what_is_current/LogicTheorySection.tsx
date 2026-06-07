"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCurrentLevel,
  getCurrentPercent,
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
  const voltage = DEFAULT_VOLTAGE;
  const resistance = DEFAULT_RESISTANCE;
  const current = calculateCurrent(voltage, resistance);
  const currentLevel = getCurrentLevel(current);
  const currentPercent = getCurrentPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does current mean in simple English?",
      answer: "Current means the amount of electric charge moving through the circuit.",
    },
    {
      question: "Can current keep moving in an open circuit?",
      answer: "No. Current needs a complete path to keep moving.",
    },
    {
      question: "What usually happens to current if voltage goes up and resistance stays the same?",
      answer: "Current usually increases because the electrical push becomes stronger.",
    },
    {
      question: "What part of the water analogy matches electric current?",
      answer: "Water flow matches electric current.",
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
              What is Current
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Current is the amount of electric charge moving through a complete path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this in a simple way. If you are a beginner, you are
              in the right place.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Current behaves like water flowing
              through a pipe. More push gives more flow. More blockage gives less
              flow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Resistance" value={`${resistance.toFixed(1)} Ohm`} tone="cyan" />
            <ValueCard label="Current Flow" value={`${current.toFixed(2)} A`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Current is the flow of electric charge through a circuit.
        </p>
        <p>
          In simple English, current tells us how much charge is actually moving.
          If more charge passes through the wire each second, current is higher.
        </p>
        <p>
          Think about water in a pipe. If a lot of water moves through the pipe,
          the flow is strong. If only a little water moves, the flow is weak.
          Current works in the same kind of way.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does current tell us the push, the blockage, or
            the actual flow?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Current is important because it tells us whether a circuit is doing
          real work.
        </p>
        <p>
          A light turns on, a fan spins, and a motor runs only when enough
          current can move through the circuit.
        </p>
        <p>
          If current is too low, the device may be weak or may not work at all.
          If current is too high, the circuit can become unsafe.
        </p>
        <p>
          <strong>Main point:</strong> Current tells us whether energy is really
          moving through the circuit.
        </p>
        <p>
          <strong>What to notice:</strong> A device may have voltage present, but
          without enough current it still may not work properly.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why is current important for a lamp or motor?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          Current depends mainly on two things: voltage and resistance.
        </p>
        <p>
          Voltage is the electrical push. If voltage increases, it tries to move
          more charge through the circuit.
        </p>
        <p>
          Resistance is the opposition to flow. If resistance increases, it
          becomes harder for charge to move.
        </p>
        <p>
          A common beginner mistake is to think current and voltage mean the same
          thing. They do not. Voltage is the push. Current is the flow that
          happens because of that push.
        </p>
        <p>
          So current is the result of both together. More push usually gives
          more current. More resistance usually gives less current.
        </p>
        <p>
          In this simulation, the battery gives <strong>{voltage.toFixed(1)} V</strong>.
          The resistor is <strong>{resistance.toFixed(1)} Ohm</strong>. Because of
          that combination, the current becomes <strong>{current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          That is why current changes when you move the voltage slider or the
          resistance slider in the simulation.
        </p>
        <p>
          <strong>Main point:</strong> Current goes up when push goes up and
          resistance stays the same.
        </p>
        <p>
          <strong>Main point:</strong> Current goes down when resistance goes up
          and voltage stays the same.
        </p>
        <p>
          <strong>
            Checkpoint Question: If resistance becomes larger while voltage
            stays the same, what happens to current?
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
                  Think about a torch light again.
                </p>
                <p>
                  If the battery is healthy and the path is complete, charge
                  moves through the bulb. That moving charge is current.
                </p>
                <p>
                  If the battery becomes weak, the current becomes smaller. If
                  the path breaks, current stops. If resistance becomes too high,
                  the bulb becomes dim.
                </p>
                <p>
                  This is the same reason technicians check current when testing
                  lamps, motors, chargers, and control circuits.
                </p>
                <p>
                  When you look at a real device, imagine this question: is
                  enough charge actually moving, or is the flow too weak?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: In a simple lamp circuit, what happens
                    to current if the path breaks?
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
          <li>Current is the actual flow of electric charge.</li>
          <li>Current needs a complete path.</li>
          <li>Voltage tends to increase current.</li>
          <li>Resistance tends to reduce current.</li>
          <li>Ohm&apos;s Law helps us calculate current: I = V / R.</li>
          <li>Water flow is a good analogy for understanding current.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
