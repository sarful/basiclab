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
      question: "Why is a star-delta starter used instead of a simple DOL starter?",
      answer:
        "It reduces starting current and starting stress by beginning the motor in star mode before changing to delta mode for normal running.",
    },
    {
      question: "What happens first after the START command in this lesson?",
      answer:
        "The main and star contactor path energize first, so the motor begins in star connection while the timer starts counting.",
    },
    {
      question: "What is the timer doing in a star-delta circuit?",
      answer:
        "It delays the changeover so the motor can accelerate in star before the circuit transfers to delta.",
    },
    {
      question: "Why is there a transfer-open gap between star and delta?",
      answer:
        "The gap prevents the star and delta contactors from being ON at the same time during changeover.",
    },
    {
      question: "Why must star and delta never overlap?",
      answer:
        "Because overlapping star and delta contactors creates an unsafe condition and can cause a serious electrical fault.",
    },
    {
      question: "What should happen when overload trips?",
      answer:
        "The control sequence must drop out, contactors must release, and the motor must stop to protect the system.",
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
              Star-Delta Control Diagram
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a star-delta starter uses timed
              switching to start a three-phase motor more smoothly than a
              direct full-voltage start.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main learning goal is to understand the start sequence, the
              timer-controlled transfer from star to delta, and the interlocking
              that keeps the changeover safe.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the lesson a practical next step after DOL starter
              theory, especially for larger motors that need lower starting
              current.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Start Mode" value="Star" tone="emerald" />
            <ValueCard label="Run Mode" value="Delta" tone="violet" />
            <ValueCard label="Transfer Logic" value="Timer" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why use a star-delta starter?" eyebrow="Core Concept">
        <p>
          A star-delta starter is used when a motor should not receive full
          heavy starting stress immediately.
        </p>

        <p>
          Instead of applying the most demanding starting condition at once, the
          circuit first starts the motor in star connection and later changes to
          delta for normal running.
        </p>

        <p>
          This helps reduce starting current and makes the startup process more
          controlled than a simple DOL method.
        </p>
      </SectionCard>

      <SectionCard title="What is the basic idea of star and delta modes?" eyebrow="Two Running Stages">
        <p>
          In this lesson, <strong>star mode</strong> is the starting stage.
        </p>

        <p>
          After the motor begins accelerating, the circuit changes to{" "}
          <strong>delta mode</strong> for normal running operation.
        </p>

        <p>
          So the starter is not only switching the motor ON or OFF. It is also
          deciding <em>which connection stage</em> the motor should use at each
          part of the sequence.
        </p>
      </SectionCard>

      <SectionCard title="What happens when START is pressed?" eyebrow="Startup Sequence">
        <p>
          First, the control circuit must be healthy: MCB ON, no overload trip,
          and no active fault condition.
        </p>

        <p>
          After the START command, the main contactor path and the star path
          energize first.
        </p>

        <p>
          That means the motor begins in star mode while the timer also starts
          running in the background.
        </p>
      </SectionCard>

      <SectionCard title="What is the timer doing?" eyebrow="Timer Logic">
        <p>
          The timer decides when the starter should leave star mode and prepare
          for delta mode.
        </p>

        <p>
          Its job is not to start the motor by itself, but to create the
          correct delay so the motor can accelerate before the next switching
          stage begins.
        </p>

        <p>
          Without the timer, the transfer could happen too early, too late, or
          with unsafe overlap.
        </p>
      </SectionCard>

      <SectionCard title="Why is there a transfer-open gap?" eyebrow="Safe Changeover">
        <p>
          During changeover, the star contactor must release before the delta
          contactor takes over.
        </p>

        <p>
          That short transfer-open gap creates a safe separation between the two
          switching states.
        </p>

        <p>
          It exists to make sure the circuit does not keep star and delta active
          together during the transition.
        </p>
      </SectionCard>

      <SectionCard title="Why must star and delta never overlap?" eyebrow="Interlocking Rule">
        <p>
          Star and delta contactors must never be ON at the same time.
        </p>

        <p>
          If both states overlap, the circuit enters an abnormal and dangerous
          electrical condition.
        </p>

        <p>
          This is why interlocking logic is one of the most important ideas in
          the star-delta control diagram.
        </p>
      </SectionCard>

      <SectionCard title="What happens after transfer to delta?" eyebrow="Normal Running">
        <p>
          Once the timer-controlled transfer is completed safely, the delta path
          becomes active for normal motor running.
        </p>

        <p>
          At that point, the startup stage is over and the motor continues in
          its regular running configuration.
        </p>

        <p>
          This is the final goal of the sequence: controlled starting followed
          by stable running.
        </p>
      </SectionCard>

      <SectionCard title="What stops the sequence?" eyebrow="Stop And Fault Response">
        <p>
          The sequence must stop if the STOP command is given, if the MCB is
          turned OFF, or if overload protection trips.
        </p>

        <p>
          In those cases, the contactor states must drop out and the motor
          should return to a safe stopped condition.
        </p>

        <p>
          A good starter is not only about starting correctly. It must also stop
          cleanly and safely.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important after DOL?" eyebrow="Learning Progression">
        <p>
          DOL theory teaches direct starting logic, but star-delta introduces a
          staged starting process.
        </p>

        <p>
          That means the learner now has to think about sequence timing,
          transition states, and interlocking, not only simple ON and OFF
          switching.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: star-delta control is best understood as a timed
          three-part sequence: start in star, separate safely, then run in
          delta.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Star-delta is used to reduce starting current and startup stress.</li>
          <li>The motor starts in star mode first.</li>
          <li>A timer controls when the changeover should happen.</li>
          <li>A transfer-open gap keeps the handover safe.</li>
          <li>Star and delta must never be active together.</li>
          <li>After transfer, the motor continues normal running in delta.</li>
          <li>Stop, trip, or supply loss must return the system to a safe OFF state.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
