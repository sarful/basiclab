"use client";

import type { ReactNode } from "react";

import { WaterFlowAnalogyPreview } from "../../water-flow analogy/WaterFlowAnalogyPreview";
import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../shared/quiz_accordion";
import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
} from "./logic";

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
  children: ReactNode;
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
      answer:
        "Electricity means electric charge is moving through a complete closed path.",
    },
    {
      question: "What is electric charge?",
      answer:
        "Electric charge is a basic electrical property. In wires, moving electrons carry this charge.",
    },
    {
      question: "Can charge move if the circuit path is broken?",
      answer: "No. Charge needs a complete closed circuit path to keep moving.",
    },
    {
      question: "What does voltage do?",
      answer:
        "Voltage gives the electrical push that tries to move charge through the circuit.",
    },
    {
      question: "What does resistance do?",
      answer:
        "Resistance makes it harder for charge to move, so it reduces the current.",
    },
    {
      question: "What does current tell us?",
      answer:
        "Current tells us how much electric charge is actually flowing through the circuit.",
    },
    {
      question: "In the water analogy, what represents voltage?",
      answer:
        "Water pressure represents voltage because both create a push for flow.",
    },
    {
      question: "In the water analogy, what represents resistance?",
      answer:
        "A narrow pipe represents resistance because it makes flow harder.",
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
              What is Electricity?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Electricity is the flow of electric charge through a complete
              closed path.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, you will learn the basic logic of electricity step
              by step. No previous electronics knowledge is required.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one simple picture in mind: electricity behaves like water
              moving through a complete pipe path.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Voltage Push"
              value={`${voltage.toFixed(1)} V`}
              tone="red"
            />
            <ValueCard
              label="Charge Flow"
              value={`${current.toFixed(2)} A`}
              tone="blue"
            />
            <ValueCard
              label="Flow Level"
              value={`${flowLevel} - ${flowPercent}%`}
              tone="cyan"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Electricity is the movement of electric charge through a complete
          closed circuit.
        </p>

        <p>
          Electric charge is a basic electrical property. In metal wires,
          electrons are the small particles that carry charge and can move from
          one place to another.
        </p>

        <p>
          A circuit is a complete path made from wires and components. If the
          path is complete, charge can move. If the path is broken, charge flow
          stops.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the circuit path is broken, can electric
            charge keep moving?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Electricity is important because most modern devices need it to work.
        </p>

        <p>
          A phone charger, fan, light, motor, computer, control panel, and
          sensor circuit all depend on electric charge moving through the right
          path.
        </p>

        <p>
          Once you understand electricity, later topics like current, voltage,
          resistance, Ohm&apos;s law, and circuit testing become much easier.
        </p>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <strong>Safety note:</strong> This lesson is for learning basic
          concepts. Real electrical systems can be dangerous, so practical
          electrical work should always follow proper safety rules.
        </p>

        <p>
          <strong>
            Checkpoint Question: Name one real device that needs electricity to
            operate.
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          First, the source gives a push. In this lesson, the battery is the
          source.
        </p>

        <p>
          Voltage is the electrical push. In plain English, voltage tries to
          move charge through the circuit.
        </p>

        <p>
          Resistance is the part that slows the movement. It makes it harder for
          charge to move, just like a narrow pipe makes water flow harder.
        </p>

        <p>
          Current is the actual flow. It tells us how much charge is really
          moving after voltage and resistance work together.
        </p>

        <p>
          In this simulation, the battery gives{" "}
          <strong>{voltage.toFixed(1)} V</strong>. The resistor is{" "}
          <strong>{resistance.toFixed(1)} Ohm</strong>. Because of that
          combination, the current becomes{" "}
          <strong>{current.toFixed(2)} A</strong>.
        </p>

        <p>
          Simple calculation:{" "}
          <strong>
            I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} ={" "}
            {current.toFixed(2)} A
          </strong>
        </p>

        <p>
          So the order is simple: source gives push, path stays complete,
          resistance slows movement, and current shows the result.
        </p>

        <p>
          <strong>
            Checkpoint Question: Which term means electrical push: voltage,
            resistance, or current?
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

              <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                Real-world example
              </h2>

              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>Think about a simple torch light or battery light.</p>

                <p>
                  When the switch is open, the path is broken, so the lamp does
                  not turn on.
                </p>

                <p>
                  When the switch closes, the path becomes complete. Then charge
                  can move from the battery, through the lamp, and back to the
                  battery.
                </p>

                <p>
                  If the battery is weak, the voltage push is smaller. If the
                  path is damaged, current cannot flow properly. If the lamp has
                  too much resistance, less current flows.
                </p>

                <p>
                  This same basic logic is used in home lighting, machine
                  panels, alarm circuits, and electronic boards.
                </p>

                <p>
                  <strong>
                    Checkpoint Question: In a torch light, what must happen
                    before the lamp can turn on?
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
          <li>Electricity means electric charge is moving.</li>
          <li>A complete closed circuit path is required.</li>
          <li>Electrons carry charge through metal wires.</li>
          <li>Voltage gives the electrical push.</li>
          <li>Resistance slows the movement of charge.</li>
          <li>Current shows the actual charge flow.</li>
          <li>The water-flow analogy helps beginners visualize the idea.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
