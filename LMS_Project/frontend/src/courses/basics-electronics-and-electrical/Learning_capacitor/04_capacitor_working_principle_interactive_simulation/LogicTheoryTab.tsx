"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeWorkingPrincipleSnapshot,
  formatCharge,
  formatCurrent,
  formatEnergy,
  formatNumber,
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
  const resistance = 1000;
  const capacitance = 470;
  const time = 0.47;
  const mode = "charging" as const;
  const sample = computeWorkingPrincipleSnapshot({
    supplyVoltage,
    resistance,
    capacitance,
    time,
    mode,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What happens first when a capacitor is connected to a battery?",
      answer:
        "Charge begins to separate, with electrons building up on one plate and leaving the other.",
    },
    {
      question: "Where is the energy stored in a capacitor?",
      answer:
        "The energy is stored in the electric field between the plates.",
    },
    {
      question: "Why is charging current high at the beginning?",
      answer:
        "At the beginning the capacitor is still uncharged, so the source drives the strongest charging current.",
    },
    {
      question: "What happens to current during charging over time?",
      answer:
        "The charging current gradually decreases as capacitor voltage rises.",
    },
    {
      question: "What does an ideal fully charged capacitor do in steady DC?",
      answer:
        "It blocks steady DC current once fully charged.",
    },
    {
      question: "What happens during discharge?",
      answer:
        "Stored charge and stored energy are released back into the circuit.",
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
              Capacitor Working Principle
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A capacitor works by separating charge on two plates and storing
              energy in the electric field between them.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, we focus on the real behavior during charging and
              discharging: voltage build-up, current decay, and energy storage.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one key idea in mind: the capacitor does not store energy in
              moving current alone, but in the electric field created by charge
              separation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Stored Voltage"
              value={`${formatNumber(sample.capacitorVoltage, 2)} V`}
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

      <SectionCard title="What is the working principle?" eyebrow="Core Concept">
        <p>
          When a capacitor is connected to a voltage source, electrons collect
          on one plate and leave the other plate.
        </p>

        <p>
          This creates charge separation. One plate becomes more negative and
          the other becomes more positive.
        </p>

        <p>
          Because the plates are separated by an insulating dielectric, current
          does not pass directly through the capacitor material. Instead, an
          electric field forms between the plates.
        </p>

        <p>
          <strong>
            Checkpoint Question: In a capacitor, is the energy stored in the
            wire itself or in the electric field between the plates?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          The working principle matters because it explains why capacitors are
          useful in filters, timing circuits, pulse circuits, and energy
          buffering applications.
        </p>

        <p>
          Once you understand charge separation and electric field storage, it
          becomes much easier to understand charging, discharging, and RC
          circuit behavior.
        </p>

        <p>
          This idea also explains why a capacitor can appear to pass changing
          signals while eventually blocking steady DC after it becomes fully
          charged.
        </p>
      </SectionCard>

      <SectionCard title="How does charging behave?" eyebrow="Charging Behavior">
        <p>
          At the first moment of charging, the current is highest because the
          capacitor is still uncharged.
        </p>

        <p>
          As charge builds up, capacitor voltage rises. That reduces the
          difference between the source voltage and capacitor voltage, so the
          charging current falls over time.
        </p>

        <p>
          In this example, the source is <strong>{supplyVoltage} V</strong>, the
          resistor is <strong>{resistance} Ohm</strong>, the capacitor is{" "}
          <strong>{capacitance} uF</strong>, and the time is{" "}
          <strong>{time} s</strong>.
        </p>

        <p>
          At that moment, the capacitor voltage is about{" "}
          <strong>{formatNumber(sample.capacitorVoltage, 2)} V</strong> and the
          charging current is about{" "}
          <strong>{formatCurrent(sample.current)}</strong>.
        </p>
      </SectionCard>

      <SectionCard title="How does discharging behave?" eyebrow="Discharge Behavior">
        <p>
          During discharge, the stored charge does not stay trapped forever. It
          is released back into the circuit.
        </p>

        <p>
          As the capacitor discharges, both the capacitor voltage and the stored
          energy decrease over time.
        </p>

        <p>
          This is why capacitors can briefly supply energy to smooth ripple,
          support a pulse, or create a delay in timing circuits.
        </p>
      </SectionCard>

      <SectionCard title="Main formulas to remember" eyebrow="Formula Sheet">
        <p>
          <strong>Q = C x V</strong> relates stored charge to capacitance and
          voltage.
        </p>

        <p>
          <strong>E = 1/2 x C x V^2</strong> gives the stored electric field
          energy.
        </p>

        <p>
          <strong>tau = R x C</strong> gives the time constant, which tells us
          how fast charging or discharging happens.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          A simple rule is that the capacitor gets very close to full charge or
          discharge after about <strong>5 tau</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Real Device Example">
        <p>Think about a small delay timer circuit.</p>

        <p>
          When power is first applied, the capacitor begins charging. The output
          changes only after the capacitor voltage reaches the required level.
        </p>

        <p>
          In a power supply filter, the same working principle lets the
          capacitor store energy when voltage is high and release it when
          voltage starts dropping.
        </p>

        <p>
          That is why the working principle is so important in practical
          electronics.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Charge separates across the capacitor plates.</li>
          <li>An electric field forms between the plates.</li>
          <li>Energy is stored in that electric field.</li>
          <li>Charging current starts high and then falls.</li>
          <li>Capacitor voltage rises during charging.</li>
          <li>Stored energy is released during discharge.</li>
          <li>RC time constant controls charging and discharging speed.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
