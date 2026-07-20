"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeCapacitorSnapshot,
  formatCapacitance,
  formatCharge,
  formatCurrent,
  formatEnergy,
  formatNumber,
  formatResistance,
} from "./logic";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "violet" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

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
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />
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
  const supplyVoltage = 12;
  const capacitance = 470;
  const resistance = 1000;
  const time = 0.47;
  const sample = computeCapacitorSnapshot({
    supplyVoltage,
    capacitance,
    resistance,
    time,
    mode: "charge",
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does a capacitor do in simple English?",
      answer:
        "A capacitor stores electric charge and electrical energy for a short time.",
    },
    {
      question: "What are the two main physical parts of a capacitor?",
      answer:
        "A capacitor is commonly made from two conductive plates separated by a dielectric material.",
    },
    {
      question: "What happens to capacitor voltage while charging?",
      answer:
        "The capacitor voltage rises as more charge is stored on the plates.",
    },
    {
      question: "What happens to charging current over time?",
      answer:
        "Charging current starts high and then falls as the capacitor voltage rises.",
    },
    {
      question: "What does Q = C x V mean?",
      answer:
        "It means stored charge depends on capacitance and voltage.",
    },
    {
      question: "What does tau = R x C tell us?",
      answer:
        "It tells us how fast the capacitor charges or discharges in an RC circuit.",
    },
    {
      question: "Why is a capacitor useful in a power supply?",
      answer:
        "It helps smooth ripple and stabilize the output voltage.",
    },
    {
      question: "After a long time in steady DC, what happens ideally?",
      answer:
        "An ideal capacitor becomes fully charged and stops passing steady DC current.",
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
              What Is a Capacitor?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A capacitor stores electric charge and energy between two plates
              separated by an insulating dielectric material.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, you will learn the basic logic of capacitors step
              by step. No advanced electronics background is required.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one simple picture in mind: a capacitor behaves like a tiny
              electrical storage tank that charges up and later releases energy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Stored Charge"
              value={formatCharge(sample.storedCharge)}
              tone="emerald"
            />
            <ValueCard
              label="Stored Energy"
              value={formatEnergy(sample.storedEnergy)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A capacitor is a passive electronic component that stores electric
          charge.
        </p>

        <p>
          It is commonly built from two conductive plates with a dielectric
          material between them. The dielectric prevents direct conduction, but
          it allows an electric field to form between the plates.
        </p>

        <p>
          When voltage is applied, charge builds up on the plates. One plate
          becomes more positive and the other becomes more negative.
        </p>

        <p>
          <strong>
            Checkpoint Question: Does a capacitor store charge by shorting the
            plates together, or by separating charge across the plates?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Capacitors are important because many electronic circuits need
          temporary energy storage, timing control, filtering, and voltage
          smoothing.
        </p>

        <p>
          They are used in power supplies, audio circuits, timer circuits,
          motor-control boards, sensor power lines, and high-speed digital
          electronics.
        </p>

        <p>
          Once you understand the basic capacitor idea, later topics like
          charging, discharging, RC time constant, and filter circuits become
          much easier.
        </p>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <strong>Safety note:</strong> Real capacitors can store energy even
          after power is removed, so practical work must follow proper safety
          rules.
        </p>

        <p>
          <strong>
            Checkpoint Question: Name one real device or circuit where a
            capacitor is useful.
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          At the start of charging, current is highest because the capacitor
          voltage begins near zero.
        </p>

        <p>
          As more charge is stored, the capacitor voltage rises. That reduces
          the difference between source voltage and capacitor voltage, so the
          charging current gradually falls.
        </p>

        <p>
          In ideal steady DC conditions, once the capacitor is fully charged,
          it stops passing steady DC current.
        </p>

        <p>
          In this simulation, the source gives <strong>{supplyVoltage} V</strong>.
          The capacitor is <strong>{formatCapacitance(capacitance)}</strong> and
          the resistor is <strong>{formatResistance(resistance)}</strong>.
        </p>

        <p>
          The time constant is{" "}
          <strong>{formatNumber(sample.timeConstant, 3)} s</strong>. At{" "}
          <strong>{time} s</strong>, the capacitor voltage is about{" "}
          <strong>{formatNumber(sample.capacitorVoltage, 2)} V</strong> and the
          charging current is about{" "}
          <strong>{formatCurrent(sample.current)}</strong>.
        </p>

        <p>
          <strong>
            Checkpoint Question: As capacitor voltage rises, what happens to the
            charging current?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Main formulas to remember" eyebrow="Formula Sheet">
        <p>
          <strong>Q = C x V</strong> tells us how much charge a capacitor stores
          at a given voltage.
        </p>

        <p>
          <strong>E = 1/2 x C x V^2</strong> tells us how much energy is stored
          in the capacitor&apos;s electric field.
        </p>

        <p>
          <strong>tau = R x C</strong> is the RC time constant. A larger
          resistance or larger capacitance makes charging and discharging
          slower.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          A useful rule of thumb is that after about <strong>5 tau</strong>, the
          capacitor is very close to fully charged or discharged.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Real Device Example">
        <p>Think about a simple power supply after a rectifier.</p>

        <p>
          The output is not perfectly smooth. It has ripple. A capacitor helps
          smooth that ripple by storing charge when voltage is high and
          releasing charge when voltage starts dropping.
        </p>

        <p>
          Another example is a timing circuit. There, a capacitor works
          together with a resistor to create a delay before an LED, relay, or
          switching action turns on.
        </p>

        <p>
          This same logic is used in adapters, control boards, sensor supplies,
          audio coupling stages, and electronic filters.
        </p>

        <p>
          <strong>
            Checkpoint Question: In a ripple filter, does the capacitor help
            make the output more stable or more uneven?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A capacitor stores charge and electrical energy.</li>
          <li>It usually has two plates separated by a dielectric.</li>
          <li>Charging current starts high and then falls over time.</li>
          <li>Capacitor voltage rises as charge is stored.</li>
          <li>Q = C x V gives stored charge.</li>
          <li>E = 1/2 x C x V^2 gives stored energy.</li>
          <li>tau = R x C tells how fast charging or discharging happens.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
