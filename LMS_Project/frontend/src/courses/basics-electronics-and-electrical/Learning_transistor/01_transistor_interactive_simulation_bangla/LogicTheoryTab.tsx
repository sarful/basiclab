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
      question: "What is the simplest job of a transistor in this lesson?",
      answer:
        "It acts like an electronically controlled switch where a small base signal controls a larger collector-emitter current path.",
    },
    {
      question: "Why is the base terminal important?",
      answer:
        "Because the base is the control terminal. Without enough base bias current, the transistor does not turn on.",
    },
    {
      question: "What happens when the transistor is in cut-off?",
      answer:
        "The collector-emitter path is effectively off, so the load current stays near zero and the lamp remains off.",
    },
    {
      question: "What does active region mean in a beginner transistor lesson?",
      answer:
        "It means the transistor is conducting and controlling output current, but it is not yet driven as hard as full saturation.",
    },
    {
      question: "What is saturation in this simulation?",
      answer:
        "It is the strong ON state where the transistor is driven enough that the load current is mainly limited by the load path, making the lamp brightest.",
    },
    {
      question: "Why do we use a base resistor?",
      answer:
        "The base resistor limits base current so the control input does not overstress or damage the transistor.",
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
              What Is a Transistor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson introduces the transistor as a three-terminal
              semiconductor device that can work as a switch and as a current
              control element.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that a small current at the base can
              control a much larger current through the collector-emitter path.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              In the simulation, that control relationship is shown by how the
              lamp responds when the transistor moves through OFF, cut-off,
              active, and saturation states.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Terminals" value="B C E" tone="emerald" />
            <ValueCard label="Main Role" value="Switch" tone="violet" />
            <ValueCard label="Control Idea" value="Small to Large" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a transistor?" eyebrow="Core Concept">
        <p>
          A transistor is a semiconductor device with three terminals:
          <strong> base</strong>, <strong>collector</strong>, and{" "}
          <strong>emitter</strong>.
        </p>

        <p>
          In beginner electronics, it is often introduced as a device that can
          act like an electronic switch.
        </p>

        <p>
          It can also work as a control device where a small input affects a
          larger output current.
        </p>
      </SectionCard>

      <SectionCard title="Why is the transistor useful?" eyebrow="Practical Role">
        <p>
          Many circuits need a weak control signal to operate a stronger output
          load.
        </p>

        <p>
          A transistor makes that possible because the control side and the load
          side are not equal in power.
        </p>

        <p>
          That is why transistors are used in switching, amplification, driving
          indicators, and controlling other electronic stages.
        </p>
      </SectionCard>

      <SectionCard title="What does the base do?" eyebrow="Control Terminal">
        <p>
          The base is the control terminal of the transistor in this lesson.
        </p>

        <p>
          When enough base bias current is present, the transistor starts
          allowing current through the collector-emitter path.
        </p>

        <p>
          Without enough base drive, the transistor remains off even if the load
          side has supply voltage available.
        </p>
      </SectionCard>

      <SectionCard title="What happens in the collector-emitter path?" eyebrow="Output Path">
        <p>
          The collector-emitter path is the main output path that carries the
          larger load current.
        </p>

        <p>
          In the simulation, this is the path that determines whether the lamp
          remains dark, glows weakly, or becomes bright.
        </p>

        <p>
          So the transistor is not creating power by itself. It is controlling
          whether the load path can conduct.
        </p>
      </SectionCard>

      <SectionCard title="What are OFF and cut-off states?" eyebrow="No Conduction">
        <p>
          When the control condition is not satisfied, the transistor stays in
          an OFF or cut-off state.
        </p>

        <p>
          In that condition, collector current is extremely small and the load
          does not turn on in a useful way.
        </p>

        <p>
          For a beginner, the easiest meaning is simple: no proper base drive
          means no useful output conduction.
        </p>
      </SectionCard>

      <SectionCard title="What is the active region?" eyebrow="Controlled Conduction">
        <p>
          In the active region, the transistor is on and responding to the base
          drive, but it is not yet in the strongest possible ON state.
        </p>

        <p>
          That means the output current is being controlled and the load can
          operate at an intermediate level.
        </p>

        <p>
          In this lesson, you can think of active region as the middle zone
          between fully off and strongly on.
        </p>
      </SectionCard>

      <SectionCard title="What is saturation?" eyebrow="Strong ON State">
        <p>
          Saturation is the strong ON condition in this simulation.
        </p>

        <p>
          Here the transistor is driven enough that the collector-emitter path
          allows the load to receive as much current as the rest of the circuit
          can reasonably provide.
        </p>

        <p>
          In practical beginner terms, saturation is the state where the
          transistor behaves most like a closed switch.
        </p>
      </SectionCard>

      <SectionCard title="Why do we need a base resistor?" eyebrow="Protection Logic">
        <p>
          The base input should not be connected without current limiting.
        </p>

        <p>
          A base resistor protects the transistor by limiting how much base
          current can flow.
        </p>

        <p>
          This is why the lesson connects control strength and resistor choice
          to safe transistor operation.
        </p>
      </SectionCard>

      <SectionCard title="What does the lamp teach us?" eyebrow="Visible Output">
        <p>
          The lamp gives a simple visible result of transistor behavior.
        </p>

        <p>
          If the transistor is off, the lamp stays off. If conduction begins,
          the lamp starts to glow. If the transistor reaches strong conduction,
          the lamp becomes brighter.
        </p>

        <p>
          This helps learners connect invisible current control with an obvious
          output effect.
        </p>
      </SectionCard>

      <SectionCard title="Main beginner rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to remember one control
          chain.
        </p>

        <p>
          Base signal controls transistor state, transistor state controls
          collector-emitter conduction, and that conduction controls the load.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a transistor lets a small input decide whether a
          larger output path stays off, partly on, or strongly on.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A transistor has three terminals: base, collector, and emitter.</li>
          <li>The base is the control terminal in this lesson.</li>
          <li>The collector-emitter path carries the larger load current.</li>
          <li>Without enough base drive, the transistor stays off or in cut-off.</li>
          <li>Active region means controlled conduction.</li>
          <li>Saturation is the strong ON state.</li>
          <li>A base resistor limits current and helps protect the transistor.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
