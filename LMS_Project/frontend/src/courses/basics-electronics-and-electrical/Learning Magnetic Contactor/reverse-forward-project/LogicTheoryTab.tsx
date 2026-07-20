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
      question: "What is the purpose of a reverse-forward starter?",
      answer:
        "It allows the same three-phase motor to run in either forward or reverse direction by selecting one of two contactor paths.",
    },
    {
      question: "What does the forward contactor do?",
      answer:
        "The forward contactor sends the normal phase sequence to the motor so the shaft rotates in the forward direction.",
    },
    {
      question: "How does the reverse contactor change direction?",
      answer:
        "It reverses the motor direction by swapping two phases before the motor, which changes the rotation sequence.",
    },
    {
      question: "Why are K1 and K2 interlocked?",
      answer:
        "They are interlocked so the forward and reverse contactors cannot energize at the same time.",
    },
    {
      question: "Why is the STOP function important before changing direction?",
      answer:
        "Because the motor should drop out safely before a new direction is commanded, reducing unsafe switching and mechanical stress.",
    },
    {
      question: "What should happen when overload trips?",
      answer:
        "The active contactor must release, the motor must stop, and the control path must remain blocked until the fault is cleared.",
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
              Reverse-Forward Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a reverse-forward starter lets one
              three-phase motor run in either forward or reverse direction by
              selecting different contactor paths.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main ideas are direction selection, phase-sequence change,
              holding logic, and the interlocking that keeps forward and reverse
              operation from happening at the same time.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the lesson an important step after basic motor starting
              because the circuit is no longer deciding only whether the motor
              runs, but also which direction it should run.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Direction 1" value="Forward" tone="emerald" />
            <ValueCard label="Direction 2" value="Reverse" tone="violet" />
            <ValueCard label="Safety Rule" value="No Overlap" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why do we need a reverse-forward starter?" eyebrow="Core Concept">
        <p>
          Some motor-driven machines need to rotate in more than one direction.
        </p>

        <p>
          A reverse-forward starter allows the same motor to run forward or
          reverse without rewiring the motor manually each time.
        </p>

        <p>
          The circuit chooses one of two controlled paths so direction can be
          selected safely from the control side.
        </p>
      </SectionCard>

      <SectionCard title="What does the forward path do?" eyebrow="Forward Rotation">
        <p>
          The forward contactor, often labeled <strong>K1</strong>, passes the
          normal three-phase sequence to the motor.
        </p>

        <p>
          With the normal phase order applied, the motor shaft rotates in the
          forward direction.
        </p>

        <p>
          This is the standard running path when the machine is commanded to
          move normally.
        </p>
      </SectionCard>

      <SectionCard title="What does the reverse path do?" eyebrow="Reverse Rotation">
        <p>
          The reverse contactor, often labeled <strong>K2</strong>, changes the
          motor direction by swapping two phases before the motor.
        </p>

        <p>
          Changing the phase order changes the rotation direction of a
          three-phase motor.
        </p>

        <p>
          So reverse operation is not a different motor action inside the
          machine. It is a different phase sequence reaching the same motor.
        </p>
      </SectionCard>

      <SectionCard title="How is the direction selected from the control circuit?" eyebrow="Control Logic">
        <p>
          A forward START command energizes the forward branch, and a reverse
          START command energizes the reverse branch.
        </p>

        <p>
          Each branch has its own contactor coil and its own holding path so the
          selected direction can remain active after the push button is
          released.
        </p>

        <p>
          That means the control circuit is not only starting the motor. It is
          also deciding which direction branch is allowed to stay active.
        </p>
      </SectionCard>

      <SectionCard title="Why is interlocking so important?" eyebrow="No Simultaneous Direction">
        <p>
          Forward and reverse contactors must never energize at the same time.
        </p>

        <p>
          If both branches close together, the power circuit can enter a severe
          fault condition.
        </p>

        <p>
          For that reason, the reverse-forward starter uses interlocking logic
          so one direction branch blocks the other.
        </p>
      </SectionCard>

      <SectionCard title="What is electrical interlocking here?" eyebrow="Branch Blocking">
        <p>
          Each direction branch includes the opposite contactor's normally
          closed interlock contact.
        </p>

        <p>
          For example, the forward branch can pass only if the reverse
          contactor's interlock is still closed, and the reverse branch can pass
          only if the forward interlock is still closed.
        </p>

        <p>
          This electrical interlock helps make sure only one direction command
          can hold the circuit at a time.
        </p>
      </SectionCard>

      <SectionCard title="Why should the motor stop before reversing?" eyebrow="Safe Direction Change">
        <p>
          Changing direction safely is not only about command selection. It is
          also about sequence.
        </p>

        <p>
          The running path should drop out before the opposite direction is
          applied.
        </p>

        <p>
          This reduces unsafe switching stress and helps avoid harsh mechanical
          shock on the motor and the connected machine.
        </p>
      </SectionCard>

      <SectionCard title="What is the role of overload protection?" eyebrow="Motor Safety">
        <p>
          Overload protection monitors the motor current and protects the motor
          from overheating or damage.
        </p>

        <p>
          If overload trips, the active control path must open and the motor
          must stop regardless of whether it was running forward or reverse.
        </p>

        <p>
          Good protection logic does not care about direction first. It cares
          about motor safety first.
        </p>
      </SectionCard>

      <SectionCard title="What makes this project more advanced than a simple starter?" eyebrow="Learning Progression">
        <p>
          In a simple starter, the circuit mainly decides ON or OFF.
        </p>

        <p>
          In a reverse-forward project, the circuit must decide ON or OFF,
          forward or reverse, and safe or unsafe sequence.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: reverse-forward control is best understood as a
          direction-selection circuit with strict interlocking, not just a motor
          starter with extra buttons.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A reverse-forward starter lets one motor run in two directions.</li>
          <li>The forward path sends the normal phase sequence to the motor.</li>
          <li>The reverse path swaps two phases to reverse rotation.</li>
          <li>Each direction branch uses its own contactor and holding logic.</li>
          <li>Forward and reverse must never energize together.</li>
          <li>Interlocking blocks unsafe simultaneous direction commands.</li>
          <li>Overload protection must stop the motor in either direction.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
