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
      question: "What is the main purpose of a contactor operation diagram?",
      answer:
        "It shows how control voltage at the coil changes the state of the armature, main contacts, and auxiliary contacts.",
    },
    {
      question: "What happens first when the coil is energized?",
      answer:
        "A control voltage appears across A1 and A2, and the coil begins creating a magnetic field.",
    },
    {
      question: "Why does the NC auxiliary contact open before the main contacts fully close?",
      answer:
        "Because the mechanism starts moving before full power contact closure, so auxiliary state changes can appear during the transition stage.",
    },
    {
      question: "What do L1, L2, L3 and T1, T2, T3 represent?",
      answer:
        "L1, L2, and L3 are the three line inputs, while T1, T2, and T3 are the corresponding load outputs.",
    },
    {
      question: "Why are AC and DC coil options both shown?",
      answer:
        "Because contactors are available with different coil types and voltages, and the control circuit must match the selected coil.",
    },
    {
      question: "What is the key difference between ON/OFF mode and timeline mode?",
      answer:
        "ON/OFF mode shows the final states directly, while timeline mode explains the pickup and transition process step by step.",
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
              Magnetic Contactor Operation Diagram
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A contactor operation diagram explains how coil energization
              produces magnetic force, moves the armature, changes auxiliary
              contacts, and finally closes the main power path.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on the full operating sequence: coil voltage,
              pickup action, auxiliary transition, main contact closure, and
              current flow from the line side to the load side.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It helps bridge the gap between simple contactor anatomy and
              practical motor-control circuit reading.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Power Phases" value="L1-L2-L3" tone="emerald" />
            <ValueCard label="Coil Input" value="A1 / A2" tone="violet" />
            <ValueCard label="Auxiliary Action" value="NO / NC" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does the operation diagram show?" eyebrow="Core Concept">
        <p>
          The operation diagram shows how the contactor changes from its
          de-energized state to its energized working state.
        </p>

        <p>
          It combines the control side, the magnetic action, the mechanical
          movement, and the power side in one connected picture.
        </p>

        <p>
          This makes it easier to understand cause and effect in the contactor.
        </p>
      </SectionCard>

      <SectionCard title="What is the normal OFF state?" eyebrow="De-Energized State">
        <p>
          In the normal OFF state, no control voltage is present across the coil terminals.
        </p>

        <p>
          The magnetic field is absent, the armature is released, the main
          contacts are open, the NO auxiliary is open, and the NC auxiliary is closed.
        </p>

        <p>
          This is the resting state of the contactor before any control command is applied.
        </p>
      </SectionCard>

      <SectionCard title="What happens first when the coil is energized?" eyebrow="Control Input">
        <p>
          The first step is the application of control voltage across{" "}
          <strong>A1</strong> and <strong>A2</strong>.
        </p>

        <p>
          As the voltage rises, the coil builds electromagnetic force.
        </p>

        <p>
          That magnetic force begins attracting the armature toward the fixed core.
        </p>
      </SectionCard>

      <SectionCard title="How does the transition stage work?" eyebrow="Pickup Sequence">
        <p>
          The contactor does not jump instantly from fully open to fully closed.
        </p>

        <p>
          There is a transition stage where the magnetic pull becomes strong
          enough to move the armature, but the main contacts are still traveling.
        </p>

        <p>
          During this period, auxiliary contacts may change state before the
          main power contacts are fully settled.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the coil voltage is still rising and the
            armature has only started moving, should the main power path already
            be treated as fully closed?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How do the auxiliary contacts behave?" eyebrow="Auxiliary Logic">
        <p>
          Auxiliary contacts follow the same movement of the armature but serve control logic purposes.
        </p>

        <p>
          The normally open auxiliary contact closes when the contactor pulls in.
        </p>

        <p>
          The normally closed auxiliary contact opens when the contactor pulls in.
        </p>
      </SectionCard>

      <SectionCard title="When does the main current flow?" eyebrow="Power Path">
        <p>
          Main current begins to flow only when the main contacts close fully.
        </p>

        <p>
          In a three-phase contactor, current then passes from{" "}
          <strong>L1, L2, L3</strong> to <strong>T1, T2, T3</strong>.
        </p>

        <p>
          This is the stage where the connected motor or load actually receives power.
        </p>
      </SectionCard>

      <SectionCard title="Why are line and load terminal numbers important?" eyebrow="Wiring Identity">
        <p>
          Terminal numbers help separate the line side from the load side clearly.
        </p>

        <p>
          The line side usually uses labels such as <strong>1L1</strong>,{" "}
          <strong>3L2</strong>, and <strong>5L3</strong>.
        </p>

        <p>
          The output side uses labels such as <strong>2T1</strong>,{" "}
          <strong>4T2</strong>, and <strong>6T3</strong>, which helps correct wiring and troubleshooting.
        </p>
      </SectionCard>

      <SectionCard title="Why show different AC and DC coil options?" eyebrow="Coil Selection">
        <p>
          Contactors can use either AC coils or DC coils depending on the control design.
        </p>

        <p>
          Each coil is designed for a specific voltage range, such as 24 V, 110 V, 220 V, or others.
        </p>

        <p>
          The selected control supply must match the coil type and voltage for reliable operation.
        </p>
      </SectionCard>

      <SectionCard title="Why is timeline mode useful?" eyebrow="Learning Sequence">
        <p>
          ON/OFF mode is useful for seeing the final states quickly.
        </p>

        <p>
          Timeline mode is useful for understanding the order of events during pickup.
        </p>

        <p>
          It helps learners see that coil voltage build-up, magnetic action,
          auxiliary switching, and main contact closure happen as a sequence, not as disconnected events.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to read a contactor operation diagram is to follow the action in order.
        </p>

        <p>
          Control voltage appears, magnetic field builds, armature moves, NC opens,
          NO closes, main contacts close, and line power reaches the load.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the coil side explains the command, but the main
          contact side shows when the real load power is actually delivered.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a motor starter, a start command energizes the contactor coil and
          closes the main three-phase power path.
        </p>

        <p>
          At the same time, the NO auxiliary can support a holding circuit while
          the NC auxiliary can be used in stop or interlock logic.
        </p>

        <p>
          This is why operation diagrams are essential for reading practical motor-control schematics.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The operation diagram links control, magnetic, mechanical, and power actions together.</li>
          <li>OFF state means coil is de-energized and main contacts are open.</li>
          <li>Coil voltage at A1/A2 starts the magnetic pull.</li>
          <li>Auxiliary contacts change state during the pickup sequence.</li>
          <li>Main current flows only after the main contacts fully close.</li>
          <li>Line and load terminal numbers are important for correct wiring.</li>
          <li>Timeline mode helps explain the step-by-step transition process.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
