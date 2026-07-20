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
      question: "What is meant by internal operation in a magnetic contactor?",
      answer:
        "It means the hidden magnetic and mechanical process inside the contactor, where the coil, core, armature, spring, and contacts interact.",
    },
    {
      question: "Why is the armature movement important?",
      answer:
        "Because the armature is the moving link that transfers magnetic pull into actual contact switching.",
    },
    {
      question: "What does the magnetic field do inside the contactor?",
      answer:
        "The magnetic field pulls the armature toward the fixed core when the coil is energized.",
    },
    {
      question: "Why is the spring still important during internal operation?",
      answer:
        "It provides the restoring force that returns the moving parts to the normal state when the coil is de-energized.",
    },
    {
      question: "Why can auxiliary contacts change before main current flows?",
      answer:
        "Because the internal mechanism begins moving before the power contacts have fully closed, so auxiliary state changes can happen during travel.",
    },
    {
      question: "Why is internal-operation understanding useful in troubleshooting?",
      answer:
        "Because it helps identify whether a problem is electrical, magnetic, mechanical, or contact-related.",
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
              Magnetic Contactor Internal Operation
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Internal operation explains what happens inside the contactor after
              control voltage reaches the coil and before the load finally receives power.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on the invisible chain of events: coil
              energization, magnetic field formation, armature travel, spring
              compression, auxiliary switching, and main contact closure.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It helps learners understand the inside mechanism rather than only
              the external terminals and final switching result.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Motion" value="Armature Pull-In" tone="emerald" />
            <ValueCard label="Coil Side" value="A1 / A2" tone="violet" />
            <ValueCard label="Return Force" value="Spring Reset" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is internal operation?" eyebrow="Core Concept">
        <p>
          Internal operation means the magnetic and mechanical process inside the contactor.
        </p>

        <p>
          It describes what happens between applying control voltage and
          delivering load power.
        </p>

        <p>
          This includes both hidden motion and hidden force, not just terminal connections.
        </p>
      </SectionCard>

      <SectionCard title="How does the coil begin the internal action?" eyebrow="Electrical Start">
        <p>
          The internal sequence begins when the correct control voltage appears across the coil.
        </p>

        <p>
          Current through the coil creates a magnetic field around the core.
        </p>

        <p>
          That magnetic field is the starting force that drives the rest of the internal mechanism.
        </p>
      </SectionCard>

      <SectionCard title="What does the magnetic field do?" eyebrow="Magnetic Pull">
        <p>
          The magnetic field pulls the moving armature toward the fixed iron core.
        </p>

        <p>
          This pull grows as the coil action becomes strong enough to overcome the spring force.
        </p>

        <p>
          The field therefore converts electrical input into mechanical movement.
        </p>
      </SectionCard>

      <SectionCard title="Why is armature travel important?" eyebrow="Mechanical Link">
        <p>
          The armature is the internal moving bridge between magnetism and switching.
        </p>

        <p>
          When it moves, it carries the contact system with it.
        </p>

        <p>
          If the armature does not travel correctly, the contactor may hum, fail
          to close, or only partially switch.
        </p>

        <p>
          <strong>
            Checkpoint Question: if the coil is energized but the armature does
            not complete its travel, can the main power path be trusted as fully closed?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What role does the spring play internally?" eyebrow="Restoring Force">
        <p>
          The spring resists the pull-in motion and stores restoring force during movement.
        </p>

        <p>
          When coil power is removed, the spring pushes the armature and contacts
          back to their normal state.
        </p>

        <p>
          So the spring is essential for both reset action and stable normal-state behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why do auxiliary contacts change during motion?" eyebrow="Auxiliary Timing">
        <p>
          Auxiliary contacts are linked to the same internal moving mechanism.
        </p>

        <p>
          Because the mechanism starts moving before full main-contact closure,
          auxiliary state changes can appear during the transition period.
        </p>

        <p>
          This timing matters in holding circuits, feedback logic, and interlocking.
        </p>
      </SectionCard>

      <SectionCard title="When do the main contacts really close?" eyebrow="Power Closure">
        <p>
          The main contacts close only after the moving system completes enough travel.
        </p>

        <p>
          At that point, the power path from line to load becomes continuous.
        </p>

        <p>
          Until full closure happens, the load should not be considered fully powered.
        </p>
      </SectionCard>

      <SectionCard title="Why is the internal view useful for AC and DC coils?" eyebrow="Coil Behavior">
        <p>
          Both AC and DC coils can drive the same internal mechanism, but the control supply must match the coil design.
        </p>

        <p>
          The internal-operation view helps learners connect the selected coil
          voltage with the strength of pull and the resulting motion.
        </p>

        <p>
          This is useful when studying why a contactor picks up properly or fails to pick up.
        </p>
      </SectionCard>

      <SectionCard title="Why is timeline mode especially helpful here?" eyebrow="Sequence Understanding">
        <p>
          In internal operation, sequence matters as much as final state.
        </p>

        <p>
          Timeline mode helps show the gradual build-up of coil action, the
          beginning of armature travel, and the later closure of the main contacts.
        </p>

        <p>
          This makes the inner process easier to visualize than a simple ON or OFF view.
        </p>
      </SectionCard>

      <SectionCard title="How does this help in troubleshooting?" eyebrow="Practical Diagnosis">
        <p>
          Internal-operation knowledge helps separate different kinds of faults.
        </p>

        <p>
          For example, the problem might be lack of coil voltage, weak magnetic
          pull, stuck armature motion, damaged spring behavior, or poor contact closure.
        </p>

        <p>
          Understanding the sequence makes diagnosis more systematic and practical.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand internal operation is to follow the
          energy conversion path.
        </p>

        <p>
          Electrical energy drives the coil, the coil creates magnetic force,
          magnetic force moves the armature, and the armature changes the contacts.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: internal operation is the hidden link between the
          control circuit command and the actual switching of the load circuit.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a panel, a technician may see that the coil receives voltage but
          the motor still does not start.
        </p>

        <p>
          Internal-operation understanding suggests checking armature travel,
          magnetic pull, spring action, and contact closure instead of only
          checking terminal voltage.
        </p>

        <p>
          This is why internal diagrams are valuable for both learning and service work.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Internal operation describes the hidden magnetic and mechanical process.</li>
          <li>The coil starts the sequence by creating magnetic force.</li>
          <li>The magnetic field pulls the armature toward the core.</li>
          <li>The spring provides restoring force and reset action.</li>
          <li>Auxiliary contacts can change during the movement stage.</li>
          <li>Main contacts must fully close before real load current flows.</li>
          <li>Internal understanding is very useful for troubleshooting.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
