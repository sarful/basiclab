"use client";

import {
  DEFAULT_VOLTAGE,
  getPressureLevel,
  getPressurePercent,
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
  const resistance = 6;
  const current = voltage / resistance;
  const pressureLevel = getPressureLevel(voltage);
  const pressurePercent = getPressurePercent(voltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does voltage mean in simple English?",
      answer: "Voltage means electrical push or electrical pressure.",
    },
    {
      question: "Does voltage mean the same thing as current?",
      answer: "No. Voltage is the push. Current is the flow that happens because of that push.",
    },
    {
      question: "What happens when voltage increases and resistance stays the same?",
      answer: "The push becomes stronger, so current usually increases.",
    },
    {
      question: "In the water analogy, what matches voltage?",
      answer: "Water pressure matches voltage.",
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
              What is Voltage
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Voltage is the electrical push that moves charge through a circuit.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in a simple way. You do not need any previous electronics knowledge.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Voltage behaves like water pressure in a pipe. More pressure gives stronger push.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Pressure Level" value={pressureLevel} tone="cyan" />
            <ValueCard label="Flow Strength" value={`${pressurePercent}%`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Voltage is the electrical push that tries to move charge through a circuit.
        </p>
        <p>
          In simple English, voltage tells us how strong the push is. It does not tell us the actual flow. It tells us how strongly the circuit is trying to move charge.
        </p>
        <p>
          Think about water in a pipe. If the pressure is strong, water wants to move harder. Voltage works in the same kind of way.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does voltage mean electrical push or actual charge flow?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Voltage is important because it provides the push that helps a circuit work.
        </p>
        <p>
          Without enough voltage, a lamp may stay dim, a motor may turn weakly, or a device may not start at all.
        </p>
        <p>
          If voltage becomes higher, the push becomes stronger. That often makes more current move, as long as the resistance stays the same.
        </p>
        <p>
          <strong>Main point:</strong> Voltage is what starts the push in the circuit.
        </p>
        <p>
          <strong>What to notice:</strong> A circuit may have wires and components, but without enough voltage the device may still not work properly.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why does a weak battery often make a lamp look dim?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          A battery creates voltage. That voltage pushes charge from one side of the battery, through the circuit, and back again.
        </p>
        <p>
          If the path is complete, that push can create current. If the path is broken, the push is present, but current cannot keep moving.
        </p>
        <p>
          Resistance makes it harder for charge to move. So voltage and resistance work together.
        </p>
        <p>
          A common beginner mistake is to think voltage and current are the same thing. They are not. Voltage is the push. Current is the moving charge.
        </p>
        <p>
          In this simulation, the battery gives <strong>{voltage.toFixed(1)} V</strong>. The resistor is <strong>{resistance.toFixed(1)} Ohm</strong>. Because of that combination, the current becomes <strong>{current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          That is why higher voltage creates stronger push and usually stronger flow when resistance stays the same.
        </p>
        <p>
          <strong>Main point:</strong> More voltage means stronger electrical pressure.
        </p>
        <p>
          <strong>Main point:</strong> Stronger electrical pressure usually produces more current if resistance stays the same.
        </p>
        <p>
          <strong>
            Checkpoint Question: If voltage increases while resistance stays the same, what usually happens to current?
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
                  Think about a torch light or a small battery fan.
                </p>
                <p>
                  When the battery is fresh, the voltage is stronger. That means the electrical push is stronger too.
                </p>
                <p>
                  Because of that stronger push, the lamp can glow brighter or the fan can spin better. When the battery becomes weak, the push becomes smaller.
                </p>
                <p>
                  This is why technicians check voltage when testing batteries, power supplies, control panels, and electronic boards.
                </p>
                <p>
                  When you look at a real device, imagine this question: is the electrical push strong enough for the device to work correctly?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: What usually happens when a battery loses voltage?
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
          <li>Voltage is the electrical push.</li>
          <li>Voltage is like water pressure in a pipe.</li>
          <li>More voltage means stronger push.</li>
          <li>Voltage and resistance together affect current.</li>
          <li>Voltage is not the same thing as current.</li>
          <li>The simulation shows how stronger push affects the circuit.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
