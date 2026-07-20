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
      question: "What starts the action in a magnetic contactor?",
      answer:
        "The coil starts the action. When A1 and A2 receive the correct control voltage, the coil creates the magnetic pull.",
    },
    {
      question: "What is the role of the armature?",
      answer:
        "The armature is the moving mechanical part that is pulled by the magnetic field and changes the state of the contacts.",
    },
    {
      question: "Why is the return spring important?",
      answer:
        "It returns the contactor to its normal de-energized state when coil power is removed.",
    },
    {
      question: "What do the main contacts do?",
      answer:
        "They connect the line side terminals to the load side terminals and carry the main power current.",
    },
    {
      question: "What are auxiliary contacts used for?",
      answer:
        "They are used in control circuits for holding, interlocking, signaling, and logic functions.",
    },
    {
      question: "Why must the coil voltage match the control circuit?",
      answer:
        "Because the coil is designed for a specific control voltage. A mismatch can cause failure to pull in or overheating.",
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
              Magnetic Contactor Anatomy
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A magnetic contactor is an electrically controlled switching device
              that uses a coil, iron core, armature, spring, and contact system
              to switch power circuits safely.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on identifying the main parts, understanding
              how they work together, and recognizing the terminal and auxiliary
              contact markings used in practical wiring.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is the foundation for later lessons on operation diagrams, DOL
              control, star-delta control, and reverse-forward systems.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Poles" value="3" tone="emerald" />
            <ValueCard label="Coil Terminals" value="A1 / A2" tone="violet" />
            <ValueCard label="Auxiliary Set" value="NO + NC" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a magnetic contactor?" eyebrow="Core Concept">
        <p>
          A magnetic contactor is a heavy-duty switching device used to control
          motors and other power loads.
        </p>

        <p>
          It allows a low-power control circuit to switch a higher-power main
          circuit through an electromagnetic mechanism.
        </p>

        <p>
          That is why contactors are common in motor starters and industrial
          control panels.
        </p>
      </SectionCard>

      <SectionCard title="Which parts make up the anatomy?" eyebrow="Main Parts">
        <p>
          The main visible and functional parts are the coil, iron core,
          armature, return spring, main power contacts, auxiliary contacts, and
          terminal blocks.
        </p>

        <p>
          Each part has a distinct job, but the device works properly only when
          these parts act together as one system.
        </p>

        <p>
          Lesson 1 is mainly about recognizing these parts before moving on to
          detailed operation lessons.
        </p>
      </SectionCard>

      <SectionCard title="What does the coil do?" eyebrow="Electrical Input">
        <p>
          The coil is the control input of the contactor.
        </p>

        <p>
          When the correct voltage is applied across terminals <strong>A1</strong>{" "}
          and <strong>A2</strong>, the coil creates an electromagnetic field.
        </p>

        <p>
          This magnetic field begins the mechanical action that changes the
          contact state.
        </p>
      </SectionCard>

      <SectionCard title="Why are the iron core and armature important?" eyebrow="Magnetic Action">
        <p>
          The iron core provides a strong magnetic path, while the armature is
          the moving part pulled by that magnetic force.
        </p>

        <p>
          When the coil energizes, the armature moves toward the core.
        </p>

        <p>
          That movement is the bridge between electrical control and physical
          contact switching.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the coil energizes but the armature does not
            move, what will happen to the contact switching action?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What is the job of the return spring?" eyebrow="Normal State">
        <p>
          The return spring pushes the moving mechanism back when coil power is removed.
        </p>

        <p>
          This restores the contactor to its normal de-energized condition.
        </p>

        <p>
          In practice, the spring defines the safe default state of the contactor.
        </p>
      </SectionCard>

      <SectionCard title="What do the main contacts do?" eyebrow="Power Switching">
        <p>
          The main contacts carry the main load current.
        </p>

        <p>
          In a typical three-pole contactor, they connect{" "}
          <strong>L1, L2, L3</strong> on the line side to{" "}
          <strong>T1, T2, T3</strong> on the load side.
        </p>

        <p>
          These are the power contacts used to switch motors and other high-current loads.
        </p>
      </SectionCard>

      <SectionCard title="Why are auxiliary contacts useful?" eyebrow="Control Logic">
        <p>
          Auxiliary contacts do not usually carry the main motor current.
        </p>

        <p>
          Instead, they are used in control circuits for holding circuits,
          interlocking, signaling, feedback, and logical control actions.
        </p>

        <p>
          A normally open auxiliary closes on energization, while a normally
          closed auxiliary opens on energization.
        </p>
      </SectionCard>

      <SectionCard title="Why do terminal markings matter?" eyebrow="Wiring Identity">
        <p>
          Terminal markings help technicians wire and troubleshoot correctly.
        </p>

        <p>
          The top side usually takes incoming line power, while the bottom side
          sends power to the load.
        </p>

        <p>
          Standard labels such as <strong>A1/A2</strong>,{" "}
          <strong>L1/L2/L3</strong>, <strong>T1/T2/T3</strong>,{" "}
          <strong>13-14 NO</strong>, and <strong>21-22 NC</strong> are important
          for practical field work.
        </p>
      </SectionCard>

      <SectionCard title="What should be checked before selecting a contactor?" eyebrow="Selection Basics">
        <p>
          The coil voltage must match the control supply.
        </p>

        <p>
          The contactor current rating and application category must match the
          real load, especially for motor duty such as AC-3.
        </p>

        <p>
          The number of auxiliary contacts and the exact terminal arrangement
          must also suit the control design.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The simplest way to understand a magnetic contactor is as a chain of action.
        </p>

        <p>
          Coil energizes, magnetic force is created, armature moves, spring is
          opposed, main contacts change state, and auxiliary contacts follow the
          same mechanism.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: if you know the coil terminals, the main line/load
          terminals, and the auxiliary contact numbers, you already understand
          the most important anatomy of the contactor.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a motor starter panel, a pushbutton or control relay can energize
          the contactor coil.
        </p>

        <p>
          The main contacts then connect three-phase supply to the motor, while
          auxiliary contacts handle holding and interlock logic.
        </p>

        <p>
          This lesson prepares you to read those practical control circuits more easily.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A magnetic contactor is an electrically controlled power switch.</li>
          <li>The coil is the input that starts the action.</li>
          <li>The core and armature convert magnetic force into motion.</li>
          <li>The return spring restores the normal state.</li>
          <li>Main contacts switch line power to the load.</li>
          <li>Auxiliary contacts are used for control logic and feedback.</li>
          <li>Terminal markings are essential for safe wiring and troubleshooting.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
