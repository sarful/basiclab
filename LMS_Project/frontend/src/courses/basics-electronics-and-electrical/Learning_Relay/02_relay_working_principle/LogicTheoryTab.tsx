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
      question: "What is the main idea of relay working principle?",
      answer:
        "A small electrical signal energizes the relay coil, creates magnetic force, moves the armature, and changes the switching contact from its normal state.",
    },
    {
      question: "Why is the coil so important in a relay?",
      answer:
        "Because the coil creates the electromagnetic force that causes the armature to move and the contacts to change state.",
    },
    {
      question: "What does the armature do?",
      answer:
        "The armature is the moving mechanical part that responds to the magnetic field and transfers that motion to the contact mechanism.",
    },
    {
      question: "What happens when the relay is not energized?",
      answer:
        "The relay stays in its normal resting condition, where COM is connected according to the default contact state, usually NC in a changeover relay.",
    },
    {
      question: "What happens after the coil is energized?",
      answer:
        "The magnetic field pulls the armature, the contact position changes, and COM moves away from NC toward NO.",
    },
    {
      question: "Why is this lesson important after learning the relay parts?",
      answer:
        "Because once the learner knows the names of the parts, this lesson explains how those parts work together as a complete switching mechanism.",
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
              Relay Working Principle
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a relay changes from a resting contact
              state to an energized switching state by using electromagnetic
              force inside the relay.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that a small coil-control signal creates
              movement inside the relay, and that movement changes the contact
              path.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This topic turns relay parts into a complete working mechanism.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Control Source" value="Relay Coil" tone="emerald" />
            <ValueCard label="Moving Part" value="Armature" tone="violet" />
            <ValueCard label="Switch Result" value="NC to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is the relay working principle in simple terms?" eyebrow="Core Idea">
        <p>
          A relay works by using electrical energy in the coil to create a
          magnetic effect that moves a mechanical switching part.
        </p>

        <p>
          That movement changes which contact path is connected.
        </p>

        <p>
          So the relay turns a control-side electrical signal into contact-side
          switching action.
        </p>
      </SectionCard>

      <SectionCard title="What happens before the relay is energized?" eyebrow="Normal State">
        <p>
          In the normal resting state, the relay coil is not energized.
        </p>

        <p>
          The armature stays in its default position, and the common terminal
          remains connected according to the relay's normal contact arrangement.
        </p>

        <p>
          In many beginner relay explanations, COM rests on NC in this state.
        </p>
      </SectionCard>

      <SectionCard title="What does the coil do?" eyebrow="Electromagnetic Action">
        <p>
          The relay coil is the part that receives electrical input for control.
        </p>

        <p>
          When current flows through the coil, it creates a magnetic field.
        </p>

        <p>
          That magnetic field is the force that begins the relay switching
          process.
        </p>
      </SectionCard>

      <SectionCard title="What is the armature doing?" eyebrow="Mechanical Motion">
        <p>
          The armature is the moving internal part that responds to the magnetic
          field created by the coil.
        </p>

        <p>
          Once magnetic force becomes strong enough, the armature is pulled or
          moved away from its resting position.
        </p>

        <p>
          This motion is what physically changes the relay contacts.
        </p>
      </SectionCard>

      <SectionCard title="How do the contacts change?" eyebrow="Switching Transition">
        <p>
          As the armature moves, the common contact shifts from the normal path
          toward the energized path.
        </p>

        <p>
          In a common changeover explanation, COM leaves NC and connects to NO
          after the coil is energized.
        </p>

        <p>
          This is the contact-change action that makes the relay useful in
          control circuits.
        </p>
      </SectionCard>

      <SectionCard title="What happens when coil power is removed?" eyebrow="Return Motion">
        <p>
          When the coil is no longer energized, the magnetic field collapses.
        </p>

        <p>
          The armature returns to its normal resting position, usually helped by
          the relay's spring action.
        </p>

        <p>
          Then the contacts also return to their default state.
        </p>
      </SectionCard>

      <SectionCard title="Why is this called electrically isolated switching?" eyebrow="Control vs Load Separation">
        <p>
          The coil circuit and the contact circuit are separate sections of the
          relay system.
        </p>

        <p>
          A smaller control-side signal can cause the relay to switch another
          circuit path without directly sharing the same electrical path.
        </p>

        <p>
          This is one of the most important practical benefits of relays.
        </p>
      </SectionCard>

      <SectionCard title="Why is timeline-based learning useful here?" eyebrow="Step-by-Step View">
        <p>
          Relay switching happens in a sequence: rest state, coil energizing,
          armature motion, contact change, and final switched state.
        </p>

        <p>
          A timeline helps the learner see that this is a process, not a magic
          instant event.
        </p>

        <p>
          That makes the relay easier to understand mechanically and
          electrically at the same time.
        </p>
      </SectionCard>

      <SectionCard title="Why does this lesson matter after relay parts?" eyebrow="Learning Progression">
        <p>
          The previous lesson teaches what the relay parts are called.
        </p>

        <p>
          This lesson teaches how those parts interact to produce real switching
          behavior.
        </p>

        <p>
          Together, the two lessons form the foundation of relay understanding.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember relay working is to follow one chain.
        </p>

        <p>
          Coil gets energized, magnetic force appears, armature moves, contact
          changes, and the switched circuit path changes state.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a relay works by converting a coil control signal
          into mechanical movement that changes electrical contacts.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A relay starts in a normal resting contact state.</li>
          <li>The coil creates magnetic force when energized.</li>
          <li>The armature is the moving part that responds to that force.</li>
          <li>The moving armature changes the contact connection.</li>
          <li>COM can move from NC toward NO during energizing.</li>
          <li>When power is removed, the relay returns to its normal state.</li>
          <li>This lesson explains how relay parts become a working switching system.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
