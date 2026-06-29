"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowPercent,
  getResistanceLevel,
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
  const resistanceLevel = getResistanceLevel(resistance);
  const flowPercent = getFlowPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does resistance mean in simple English?",
      answer: "Resistance means opposition to current flow. It makes charge movement harder.",
    },
    {
      question: "What happens when resistance increases and voltage stays the same?",
      answer: "Current decreases because the path becomes harder for charge to move through.",
    },
    {
      question: "Does resistance create current?",
      answer: "No. Voltage creates the push. Resistance controls how easily that push can move charge.",
    },
    {
      question: "In the water analogy, what matches resistance?",
      answer: "A narrow pipe matches resistance because it restricts the flow.",
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
              What is Resistance
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistance is the part of a circuit that slows down the movement of charge.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in a simple way. You do not need any previous electronics knowledge.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Resistance behaves like a narrow pipe. The narrower the pipe, the harder it is for water to move through.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Resistance Level" value={resistanceLevel} tone="cyan" />
            <ValueCard label="Flow Strength" value={`${flowPercent}%`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Resistance is the opposition to current flow.
        </p>
        <p>
          In simple English, resistance makes it harder for electric charge to move through a circuit.
        </p>
        <p>
          A resistor is a component that adds this opposition in a controlled way. It helps protect parts of the circuit and control how much current can move.
        </p>
        <p>
          Think about water moving through a pipe. If the pipe becomes narrow, water can still move, but it has a harder time. Resistance works in that same kind of way.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does resistance help charge move easily, or does it make movement harder?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Resistance is important because it controls current and helps keep circuits safe.
        </p>
        <p>
          Without enough resistance, too much current can move through a circuit. That can overheat wires, damage parts, or make a component fail.
        </p>
        <p>
          With the right resistance, a lamp can glow properly, an LED can stay safe, and a circuit can work in a controlled way.
        </p>
        <p>
          <strong>Main point:</strong> Resistance protects and controls the circuit.
        </p>
        <p>
          <strong>What to notice:</strong> More resistance usually means less current if voltage stays the same.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why do circuits need resistance instead of letting charge move freely all the time?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          A battery provides voltage, which is the push. Resistance stands in the path and makes that push work harder.
        </p>
        <p>
          If resistance is small, charge can move more easily. If resistance is large, charge has a harder time moving, so current becomes smaller.
        </p>
        <p>
          A common beginner mistake is to think resistance stops all current completely. That is not always true. It usually reduces current instead of stopping it entirely.
        </p>
        <p>
          In this simulation, the battery gives <strong>{voltage.toFixed(1)} V</strong>. The resistor is <strong>{resistance.toFixed(1)} Ohm</strong>. Because of that combination, the current becomes <strong>{current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          So the simple idea is this: voltage provides the push, resistance slows the movement, and current is the result we observe.
        </p>
        <p>
          <strong>Main point:</strong> More resistance means less current when voltage stays the same.
        </p>
        <p>
          <strong>Main point:</strong> Resistance helps control the circuit instead of letting current become too large.
        </p>
        <p>
          <strong>
            Checkpoint Question: If resistance increases while voltage stays the same, what usually happens to current?
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
                  Think about an LED in a small electronic board.
                </p>
                <p>
                  That LED usually has a resistor in series with it. The resistor limits current so the LED does not burn out.
                </p>
                <p>
                  If the resistor is too small, too much current may flow. If the resistor is too large, the LED may become dim.
                </p>
                <p>
                  This is why technicians use resistors in control boards, chargers, signal circuits, and many industrial devices.
                </p>
                <p>
                  When you look at a real device, imagine this question: is the resistance here helping control the amount of current safely?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: What can happen if a circuit has too little resistance for an LED?
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
          <li>Resistance is opposition to current flow.</li>
          <li>Resistance is like a narrow pipe in a water system.</li>
          <li>More resistance means charge moves less easily.</li>
          <li>Less resistance means current can increase more easily.</li>
          <li>Resistance helps protect and control the circuit.</li>
          <li>The simulation shows how resistance changes current flow.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
