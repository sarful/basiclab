"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
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

export default function LogicTheoryTab() {
  const voltage = DEFAULT_VOLTAGE;
  const resistance = DEFAULT_RESISTANCE;
  const current = calculateCurrent(voltage, resistance);
  const flowLevel = getFlowLevel(current);
  const flowPercent = getFlowPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does electricity mean in simple English?",
      answer: "Electricity means electric charge is moving through a complete path.",
    },
    {
      question: "Can charge move if the path is broken?",
      answer: "No. Charge needs a complete path to keep moving.",
    },
    {
      question: "In the water analogy, what represents resistance?",
      answer: "A narrow pipe represents resistance.",
    },
    {
      question: "What does current tell us?",
      answer: "Current tells us how much charge is actually flowing.",
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
              What is Electricity
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Electricity is the flow of electric charge through a complete path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step. You do not need any previous electronics knowledge.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one simple picture in mind. Electricity behaves like water moving through a full pipe path.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Charge Flow" value={`${current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={`${flowLevel} - ${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>Electricity is the movement of electric charge through a complete path.</p>
        <p>
          Electric charge is the tiny electrical quantity that moves inside a circuit. A circuit is a complete path made from wires and components.
        </p>
        <p>
          Imagine water moving through a closed pipe loop. If the pipe loop is complete, water can move. If the loop is broken, water stops. We will use this same water-flow analogy throughout this lesson.
        </p>
        <p>
          <strong>Checkpoint Question: If the path is broken, can electric charge move through the circuit?</strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>Electricity is important because most modern devices use it to work.</p>
        <p>
          A phone charger, a fan, a light, a motor, and a control panel all depend on electric charge moving in the right path.
        </p>
        <p>
          If you understand what electricity is, later topics like current, voltage, resistance, and circuit testing become much easier.
        </p>
        <p>
          <strong>Checkpoint Question: Name one real device that needs electricity to operate.</strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>First, the source gives a push. In this lesson, the battery is the source.</p>
        <p>
          Voltage is the electrical push. In plain English, voltage is the force that tries to move charge through the circuit.
        </p>
        <p>
          Resistance is the part that slows movement. In plain English, resistance makes it harder for charge to move, just like a narrow pipe makes water flow harder.
        </p>
        <p>
          Current is the actual flow. In plain English, current tells us how much charge is really moving after push and resistance work together.
        </p>
        <p>
          In this simulation, the battery gives <strong>{voltage.toFixed(1)} V</strong>. The resistor is <strong>{resistance.toFixed(1)} Ohm</strong>. Because of that combination, the current becomes <strong>{current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          So the order is simple: source gives push, path stays complete, resistance slows movement, and current shows the result.
        </p>
        <p>
          <strong>Checkpoint Question: Which term means electrical push: voltage, resistance, or current?</strong>
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
              <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                Real-world example
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>Think about a simple torch light or battery light.</p>
                <p>
                  When the switch closes, the path becomes complete. Then charge can move from the battery, through the bulb, and back again.
                </p>
                <p>
                  If the battery is weak, the push is smaller. If the path is damaged, the light does not turn on. If the lamp has too much resistance, less current flows.
                </p>
                <p>
                  This same logic is used in home lighting, machine panels, alarm circuits, and electronic boards.
                </p>
                <p>
                  <strong>Checkpoint Question: In a torch light, what must happen before the lamp can turn on?</strong>
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
          <li>Electricity means electric charge is moving.</li>
          <li>A complete path is required.</li>
          <li>Voltage gives the push.</li>
          <li>Resistance slows the movement.</li>
          <li>Current shows the actual flow.</li>
          <li>The water-flow analogy helps visualize the same idea.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
