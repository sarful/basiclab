"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeStructureSnapshot,
  dielectricOptions,
  formatCapacitance,
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
  const plateArea = 60;
  const plateDistance = 4;
  const dielectric = dielectricOptions[3];
  const sample = computeStructureSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What are the two main physical parts of a basic capacitor?",
      answer:
        "A basic capacitor has two conductive plates and a dielectric material between them.",
    },
    {
      question: "Why is the dielectric important?",
      answer:
        "The dielectric prevents a short circuit between the plates and helps increase capacitance.",
    },
    {
      question: "What happens when plate area increases?",
      answer:
        "Larger plate area increases capacitance because the field surface becomes larger.",
    },
    {
      question: "What happens when plate spacing increases?",
      answer:
        "Greater plate spacing reduces capacitance because field coupling becomes weaker.",
    },
    {
      question: "What does a higher dielectric constant do?",
      answer:
        "A higher dielectric constant increases capacitance.",
    },
    {
      question: "Can steady direct conduction pass through the dielectric layer?",
      answer:
        "No. The dielectric is an insulator, so direct current cannot pass straight through it.",
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
              Capacitor Structure
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A capacitor is built from conductive plates and a dielectric layer
              arranged so charge can be separated and stored safely.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, we focus on how the physical structure of a
              capacitor controls its capacitance and electrical behavior.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              The main design idea is simple: plate area, plate spacing, and
              dielectric material all shape the final capacitance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Plate Area"
              value={`${plateArea} cm^2`}
              tone="violet"
            />
            <ValueCard
              label="Plate Distance"
              value={`${plateDistance} mm`}
              tone="emerald"
            />
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(sample.capacitance)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A capacitor structure usually contains two conductive plates connected
          to the terminals, with a dielectric material placed between them.
        </p>

        <p>
          The conductive plates allow charge to gather, while the dielectric
          keeps the plates electrically separated so they do not short together.
        </p>

        <p>
          This arrangement allows an electric field to form between the plates,
          which is the foundation of charge storage in a capacitor.
        </p>

        <p>
          <strong>
            Checkpoint Question: Which part stores separated charge directly,
            and which part prevents a short circuit?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Capacitor structure matters because the physical build directly
          affects capacitance, stability, size, and voltage handling.
        </p>

        <p>
          Designers choose plate shape, spacing, and dielectric type based on
          what the circuit needs: more capacitance, better stability, smaller
          size, or better insulation strength.
        </p>

        <p>
          Once you understand capacitor structure, it becomes easier to
          understand why ceramic, mica, electrolytic, and other capacitors
          behave differently.
        </p>
      </SectionCard>

      <SectionCard title="Main parts of the structure" eyebrow="Physical Parts">
        <p>
          The first main part is the conductive plates. These plates connect to
          the capacitor terminals and hold opposite charges.
        </p>

        <p>
          The second main part is the dielectric. This is the insulating layer
          between the plates.
        </p>

        <p>
          The dielectric is important because it prevents direct conduction and
          also helps determine the final capacitance.
        </p>

        <p>
          In this example, the selected dielectric is{" "}
          <strong>{dielectric.label}</strong>, which has a dielectric constant
          of <strong>{dielectric.k}</strong>.
        </p>
      </SectionCard>

      <SectionCard title="How structure changes capacitance" eyebrow="Construction Effect">
        <p>
          Larger plate area increases capacitance because the effective electric
          field surface becomes larger.
        </p>

        <p>
          Smaller plate spacing increases capacitance because the electric field
          coupling becomes stronger between the two plates.
        </p>

        <p>
          A dielectric with a higher dielectric constant also increases
          capacitance.
        </p>

        <p>
          In this structure snapshot, the resulting capacitance is about{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Real Device Example">
        <p>Think about a ceramic capacitor on an electronic control board.</p>

        <p>
          It uses a dielectric material and carefully arranged conductive layers
          so that useful capacitance can fit inside a small package.
        </p>

        <p>
          If the dielectric changes or the internal plate arrangement changes,
          the capacitance and performance also change.
        </p>

        <p>
          This same structural thinking is used when designing filter
          capacitors, timing capacitors, and compact high-value capacitors.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A capacitor has conductive plates and a dielectric.</li>
          <li>The plates hold separated charge.</li>
          <li>The dielectric prevents a short circuit.</li>
          <li>Larger plate area increases capacitance.</li>
          <li>Smaller plate spacing increases capacitance.</li>
          <li>A higher dielectric constant increases capacitance.</li>
          <li>Capacitor structure directly affects real circuit behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
