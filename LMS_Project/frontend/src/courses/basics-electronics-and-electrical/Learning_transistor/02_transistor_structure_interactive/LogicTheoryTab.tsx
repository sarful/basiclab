"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";

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
  const quizItems: QuizAccordionItem[] = [
    {
      question: "Why does a transistor need three semiconductor regions?",
      answer:
        "Because the emitter, base, and collector each have a different job, and the transistor works only when those three regions are arranged with different doping and roles.",
    },
    {
      question: "Why is the emitter heavily doped?",
      answer:
        "Because the emitter must supply a strong number of charge carriers into the transistor action.",
    },
    {
      question: "Why is the base very thin and lightly doped?",
      answer:
        "So a small base current can control transistor action without absorbing too many carriers itself.",
    },
    {
      question: "What is the collector mainly responsible for?",
      answer:
        "The collector gathers carriers coming through the transistor and carries the output current.",
    },
    {
      question: "Why is transistor structure important before learning full working operation?",
      answer:
        "Because structure explains why the transistor behaves the way it does when bias and current flow are later applied.",
    },
    {
      question: "Why compare NPN and PNP structure in the same lesson?",
      answer:
        "Because both use three regions, but their material arrangement and carrier behavior are mirrored in opposite ways.",
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
              Transistor Structure
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a transistor is physically organized into
              three regions so it can control current in a useful way.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main goal is to understand the structural roles of the
              emitter, base, and collector, and why those regions do not have
              the same doping level or the same purpose.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This gives the foundation for later lessons on transistor
              terminals, biasing, and current flow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Region 1" value="Emitter" tone="emerald" />
            <ValueCard label="Region 2" value="Base" tone="amber" />
            <ValueCard label="Region 3" value="Collector" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Why study transistor structure first?" eyebrow="Core Concept">
        <p>
          Before a learner studies transistor operation, it helps to know how
          the transistor is built internally.
        </p>

        <p>
          Structure explains why one terminal controls, another supplies
          carriers, and another collects the output current.
        </p>

        <p>
          In other words, structure is the reason the transistor can behave as a
          useful electronic control device.
        </p>
      </SectionCard>

      <SectionCard title="What are the three main regions?" eyebrow="Three Layers">
        <p>
          A basic bipolar transistor is made from three semiconductor regions:
          <strong> emitter</strong>, <strong>base</strong>, and{" "}
          <strong>collector</strong>.
        </p>

        <p>
          These regions are not identical. Each one is designed for a specific
          electrical job.
        </p>

        <p>
          That is why transistor structure is more than just three pieces placed
          side by side. It is an intentional arrangement.
        </p>
      </SectionCard>

      <SectionCard title="Why is the emitter heavily doped?" eyebrow="Carrier Source">
        <p>
          The emitter is designed to supply charge carriers into the transistor
          action.
        </p>

        <p>
          Because of that job, it is heavily doped so it can inject carriers
          strongly and effectively.
        </p>

        <p>
          In simple terms, the emitter is the source side that must be ready to
          provide plenty of carriers when the transistor is biased properly.
        </p>
      </SectionCard>

      <SectionCard title="Why is the base thin and lightly doped?" eyebrow="Control Region">
        <p>
          The base is the control region of the transistor.
        </p>

        <p>
          It is made very thin and lightly doped so a small base influence can
          control a much larger overall transistor action.
        </p>

        <p>
          This is one of the most important beginner ideas: the base is small in
          physical and electrical influence, but powerful in control effect.
        </p>
      </SectionCard>

      <SectionCard title="What does the collector do?" eyebrow="Output Region">
        <p>
          The collector gathers the carriers that have moved through transistor
          action and carries the output current.
        </p>

        <p>
          It is responsible for handling the useful output side of the device.
        </p>

        <p>
          So while the base controls and the emitter supplies, the collector is
          the region that takes the output result.
        </p>
      </SectionCard>

      <SectionCard title="Why are doping levels different?" eyebrow="Layer Design">
        <p>
          If all three regions were doped the same way, they would not perform
          different jobs effectively.
        </p>

        <p>
          The emitter needs strong carrier supply, the base needs sensitive
          control behavior, and the collector needs to receive and carry output
          current.
        </p>

        <p>
          Different doping levels are what make those three roles possible.
        </p>
      </SectionCard>

      <SectionCard title="How do NPN and PNP structures relate?" eyebrow="Type Comparison">
        <p>
          Both NPN and PNP transistors use three regions with emitter, base, and
          collector roles.
        </p>

        <p>
          The difference is in how the semiconductor types are arranged and what
          kind of charge carriers become important.
        </p>

        <p>
          This lesson helps learners see that transistor type changes the layer
          arrangement, but not the need for a purposeful three-region structure.
        </p>
      </SectionCard>

      <SectionCard title="Why does structure matter for later lessons?" eyebrow="Learning Foundation">
        <p>
          Later lessons will discuss terminals, biasing, switching, and current
          flow.
        </p>

        <p>
          None of those ideas make full sense unless the learner first knows why
          the transistor has a thin base, a strong emitter, and a collector for
          output handling.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: transistor structure is the physical reason a
          small control action at the base can influence a much larger collector
          current path.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A transistor has three main regions: emitter, base, and collector.</li>
          <li>The emitter is heavily doped to supply carriers strongly.</li>
          <li>The base is thin and lightly doped for control sensitivity.</li>
          <li>The collector gathers carriers and carries output current.</li>
          <li>Different doping levels give each region a different job.</li>
          <li>NPN and PNP both use three-region structure with different material arrangement.</li>
          <li>Structure is the foundation for understanding transistor operation later.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
