"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeCapacitanceSnapshot,
  dielectricOptions,
  formatCapacitance,
  formatCharge,
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
  const voltage = 12;
  const plateArea = 60;
  const plateDistance = 4;
  const dielectric = dielectricOptions[2];
  const sample = computeCapacitanceSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
    voltage,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is capacitance in simple English?",
      answer:
        "Capacitance is the ability of a capacitor to store electric charge.",
    },
    {
      question: "What is the SI unit of capacitance?",
      answer: "The SI unit of capacitance is the farad.",
    },
    {
      question: "What happens to capacitance when plate area increases?",
      answer:
        "Larger plate area increases capacitance because more charge can be separated and stored.",
    },
    {
      question: "What happens to capacitance when plate distance increases?",
      answer:
        "Greater plate distance reduces capacitance because the electric field coupling becomes weaker.",
    },
    {
      question: "What does a higher dielectric constant do?",
      answer:
        "A higher dielectric constant increases capacitance.",
    },
    {
      question: "What does Q = C x V mean?",
      answer:
        "It means stored charge depends on capacitance and voltage.",
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
              What Is Capacitance?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Capacitance is the ability of a capacitor to store charge for each
              volt applied across it.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, we focus on what changes capacitance: plate area,
              plate distance, and dielectric material.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one key idea in mind: higher capacitance means more stored
              charge at the same voltage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(sample.capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Stored Charge"
              value={formatCharge(sample.charge)}
              tone="emerald"
            />
            <ValueCard
              label="Stored Energy"
              value={formatEnergy(sample.energy)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          Capacitance tells us how much electric charge a capacitor can store
          per volt.
        </p>

        <p>
          If two capacitors are connected to the same voltage, the one with
          higher capacitance stores more charge.
        </p>

        <p>
          The unit of capacitance is the farad. One farad means one coulomb of
          charge stored per volt.
        </p>

        <p>
          <strong>
            Checkpoint Question: At the same voltage, which stores more charge:
            a larger capacitance or a smaller capacitance?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Capacitance matters because it affects how much charge and energy a
          capacitor can store in real circuits.
        </p>

        <p>
          It directly influences ripple filtering, energy buffering, sensor
          stability, timing behavior, and coupling performance.
        </p>

        <p>
          Once you understand capacitance clearly, topics like capacitor
          charging, discharging, and RC time constant become easier to follow.
        </p>
      </SectionCard>

      <SectionCard title="What changes capacitance?" eyebrow="Main Factors">
        <p>
          Larger plate area increases capacitance because more separated charge
          can exist on the plates.
        </p>

        <p>
          Smaller plate distance increases capacitance because the electric
          field coupling between the plates becomes stronger.
        </p>

        <p>
          A dielectric with a higher dielectric constant also increases
          capacitance.
        </p>

        <p>
          In this example, plate area is <strong>{plateArea} cm^2</strong>,
          plate distance is <strong>{plateDistance} mm</strong>, dielectric is{" "}
          <strong>{dielectric.label}</strong>, and the applied voltage is{" "}
          <strong>{voltage} V</strong>.
        </p>
      </SectionCard>

      <SectionCard title="How does the math work?" eyebrow="Formula Sheet">
        <p>
          A simple practical relationship is{" "}
          <strong>Q = C x V</strong>. More capacitance means more stored charge
          at the same voltage.
        </p>

        <p>
          Stored energy follows <strong>E = 1/2 x C x V^2</strong>.
        </p>

        <p>
          In this simulation snapshot, capacitance is about{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong>, stored charge
          is about <strong>{formatCharge(sample.charge)}</strong>, and stored
          energy is about <strong>{formatEnergy(sample.energy)}</strong>.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          A useful design idea is simple: if voltage stays fixed, increasing
          capacitance increases both stored charge and stored energy.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Real Device Example">
        <p>Think about a filtered DC power supply.</p>

        <p>
          If the capacitance is too low, the output voltage drops more between
          peaks and ripple becomes more visible.
        </p>

        <p>
          If the capacitance is higher, the capacitor can store more charge and
          support the output for longer, so the voltage looks smoother.
        </p>

        <p>
          This same idea appears in adapters, timer circuits, sensor supplies,
          and digital decoupling networks.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Capacitance means charge storage ability.</li>
          <li>The SI unit of capacitance is the farad.</li>
          <li>Larger plate area increases capacitance.</li>
          <li>Smaller plate spacing increases capacitance.</li>
          <li>A higher dielectric constant increases capacitance.</li>
          <li>Q = C x V links capacitance, charge, and voltage.</li>
          <li>Higher capacitance means more stored charge at the same voltage.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
