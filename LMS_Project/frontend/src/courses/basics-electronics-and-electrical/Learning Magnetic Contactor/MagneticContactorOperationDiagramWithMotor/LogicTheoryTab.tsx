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
      question: "What is the main purpose of adding a motor to the contactor operation diagram?",
      answer:
        "It shows the final practical result of contactor action: whether the three-phase motor receives power and runs.",
    },
    {
      question: "When does the motor actually start receiving power?",
      answer:
        "The motor receives power only after the main contacts close and the path from L1/L2/L3 to the motor terminals becomes complete.",
    },
    {
      question: "Why is the coil still separate from the motor circuit?",
      answer:
        "Because the coil belongs to the control circuit, while the motor belongs to the main power circuit.",
    },
    {
      question: "What do T1, T2, and T3 connect to in this lesson?",
      answer:
        "They connect to the motor side terminals, usually represented as U, V, and W.",
    },
    {
      question: "Why is it useful to see motor running and motor stopped states?",
      answer:
        "Because it helps connect contactor switching logic with the real operational state of the load.",
    },
    {
      question: "Why are auxiliary contacts still important even when the motor is the final load?",
      answer:
        "Because auxiliary contacts help with holding, interlocking, and status logic even though the main contacts carry the motor power.",
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
              Operation Diagram With Motor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson extends the contactor operation diagram to the real
              load side by showing how contactor switching controls a three-phase motor.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              It focuses on the relationship between coil command, main contact
              closure, three-phase power delivery, and the final running or
              stopped state of the motor.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the contactor lesson more practical by linking internal
              switching action to a real industrial load.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Motor Supply" value="3 Phase" tone="emerald" />
            <ValueCard label="Coil Control" value="A1 / A2" tone="violet" />
            <ValueCard label="Motor State" value="Run / Stop" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why add the motor to the diagram?" eyebrow="Core Concept">
        <p>
          A contactor is usually not the final purpose of the circuit. It exists
          to control a load.
        </p>

        <p>
          Adding the motor to the diagram shows the practical outcome of contactor action.
        </p>

        <p>
          It makes the lesson more realistic by connecting switching logic to the actual machine load.
        </p>
      </SectionCard>

      <SectionCard title="How is the control circuit different from the motor circuit?" eyebrow="Two Circuits">
        <p>
          The coil belongs to the control circuit, and the motor belongs to the main power circuit.
        </p>

        <p>
          The control side uses relatively low control power to command the contactor.
        </p>

        <p>
          The main side carries the larger three-phase power needed by the motor.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the coil is OFF?" eyebrow="Motor Stopped">
        <p>
          When the coil is OFF, the contactor remains in its normal state.
        </p>

        <p>
          The main contacts stay open, so the path from the supply to the motor is broken.
        </p>

        <p>
          As a result, the motor does not receive three-phase power and stays stopped.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the coil is energized?" eyebrow="Motor Start Path">
        <p>
          When the coil is energized, magnetic force pulls the armature and closes the main contacts.
        </p>

        <p>
          Once those contacts close, the line side phases can pass through the contactor to the motor side.
        </p>

        <p>
          That is the moment when the motor becomes electrically supplied and can run.
        </p>

        <p>
          <strong>
            Checkpoint Question: if the coil is energized but the main contacts
            have not yet fully closed, should the motor already be considered powered?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does three-phase power reach the motor?" eyebrow="Power Flow">
        <p>
          The three line phases enter the contactor at <strong>L1</strong>,{" "}
          <strong>L2</strong>, and <strong>L3</strong>.
        </p>

        <p>
          After the main contacts close, the current leaves through{" "}
          <strong>T1</strong>, <strong>T2</strong>, and <strong>T3</strong>.
        </p>

        <p>
          These outputs are then connected to the motor terminals, commonly represented as <strong>U</strong>, <strong>V</strong>, and <strong>W</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Why is the motor state important in the lesson?" eyebrow="Load Outcome">
        <p>
          The motor state shows the actual result of contactor switching.
        </p>

        <p>
          If the main contacts are open, the motor is stopped. If the main
          contacts are closed, the motor receives supply and can run.
        </p>

        <p>
          This helps learners connect abstract contact changes with real machine behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why do auxiliary contacts still matter here?" eyebrow="Control Logic">
        <p>
          Even though the motor is the final load, auxiliary contacts still play an important role.
        </p>

        <p>
          They are used for holding circuits, interlocking, feedback, and operational logic.
        </p>

        <p>
          The main contacts power the motor, but auxiliary contacts help manage the control sequence.
        </p>
      </SectionCard>

      <SectionCard title="Why show AC and DC coil options with a motor load?" eyebrow="Coil Selection">
        <p>
          The motor may be a power load, but the contactor coil still depends on the control design.
        </p>

        <p>
          Some systems use AC control coils and others use DC control coils.
        </p>

        <p>
          The selected control supply must always match the chosen coil type and voltage.
        </p>
      </SectionCard>

      <SectionCard title="Why is timeline mode useful in this lesson?" eyebrow="Sequence Understanding">
        <p>
          Timeline mode helps show that the motor does not start at the same instant the control command begins.
        </p>

        <p>
          First the coil voltage rises, then magnetic action develops, then the
          contacts move, and only after full closure does motor power flow.
        </p>

        <p>
          This makes the start process clearer than a simple ON/OFF snapshot.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this diagram is to think in two linked results.
        </p>

        <p>
          The control circuit decides what the contactor does, and the contactor
          decides whether the motor receives three-phase power.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the motor does not run just because a command was
          given; it runs only after the contactor has completed the switching action and closed the power path.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a basic motor starter, a start signal energizes the contactor coil.
        </p>

        <p>
          The contactor then connects the three-phase supply to the motor, while
          auxiliary contacts help maintain or supervise the control logic.
        </p>

        <p>
          This is why understanding the contactor-motor relationship is essential in practical motor control.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The motor is the practical load side of the contactor circuit.</li>
          <li>The coil belongs to the control circuit, not the motor power circuit.</li>
          <li>Open main contacts mean the motor is stopped.</li>
          <li>Closed main contacts allow three-phase power to reach the motor.</li>
          <li>T1, T2, and T3 connect the contactor output to the motor side.</li>
          <li>Auxiliary contacts still support holding and control logic.</li>
          <li>Timeline mode helps explain when motor power really begins.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
