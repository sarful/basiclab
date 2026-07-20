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
      question: "What is the simplest special feature of a depletion MOSFET?",
      answer:
        "It already has a conducting channel at VGS = 0, so it is normally on unless gate control weakens that channel enough.",
    },
    {
      question: "Why is it called a depletion MOSFET?",
      answer:
        "Because gate voltage can deplete or narrow the existing channel and reduce current instead of needing to build the channel from nothing first.",
    },
    {
      question: "What happens when the gate voltage becomes more negative in this lesson?",
      answer:
        "The depletion region expands, the channel becomes weaker, and drain current decreases toward cutoff.",
    },
    {
      question: "What is VGS(off) here?",
      answer:
        "It is the gate-source voltage where the channel is depleted enough that the MOSFET reaches cutoff and useful drain current stops.",
    },
    {
      question: "How is positive gate voltage treated in this simulator?",
      answer:
        "Positive gate voltage strengthens the existing channel even more, pushing the depletion MOSFET into enhancement-style stronger conduction.",
    },
    {
      question: "Why is this lesson important after enhancement MOSFET working?",
      answer:
        "Because it shows the opposite starting condition: an enhancement MOSFET begins normally off, while a depletion MOSFET begins normally on.",
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
              Depletion MOSFET Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a depletion MOSFET behaves when a channel
              already exists at zero gate voltage and can be weakened or
              strengthened by gate control.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that this device starts from a normally on
              condition and can be driven toward weak channel, cutoff, or
              stronger conduction depending on gate voltage.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the depletion MOSFET a very useful contrast to the
              enhancement MOSFET learned in the previous lesson.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Start State" value="Normally On" tone="emerald" />
            <ValueCard label="Main Effect" value="Channel Depletion" tone="amber" />
            <ValueCard label="Gate Rule" value="Negative VGS Narrows" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Why is a depletion MOSFET different?" eyebrow="Core Concept">
        <p>
          A depletion MOSFET is different because it begins with an existing
          conduction channel even when the gate-source voltage is zero.
        </p>

        <p>
          That means the device is normally on at the start, unlike an
          enhancement MOSFET which needs gate voltage to build the channel first.
        </p>

        <p>
          This starting condition is the most important beginner idea in the
          lesson.
        </p>
      </SectionCard>

      <SectionCard title="What does 'depletion' mean here?" eyebrow="Channel Narrowing">
        <p>
          Depletion means the existing channel can be narrowed or weakened by
          the gate effect.
        </p>

        <p>
          As the gate condition pushes the device toward depletion, the
          drain-source conduction becomes weaker.
        </p>

        <p>
          So instead of creating a channel from nothing, the gate is reducing a
          channel that already exists.
        </p>
      </SectionCard>

      <SectionCard title="What happens at VGS = 0?" eyebrow="Normally On State">
        <p>
          At VGS = 0, the lesson shows the depletion MOSFET in its normally on
          state.
        </p>

        <p>
          A conduction path is already present, so drain current can exist even
          without positive gate drive.
        </p>

        <p>
          This is the biggest contrast with enhancement MOSFET behavior.
        </p>
      </SectionCard>

      <SectionCard title="What happens when gate voltage goes negative?" eyebrow="Depletion Action">
        <p>
          As the gate voltage becomes more negative, the depletion effect grows.
        </p>

        <p>
          The depletion region expands, the channel narrows, and current flow
          becomes weaker.
        </p>

        <p>
          If the negative gate effect becomes strong enough, the MOSFET can move
          all the way toward cutoff.
        </p>
      </SectionCard>

      <SectionCard title="What are weak channel and cutoff?" eyebrow="Toward OFF">
        <p>
          Weak channel means conduction still exists, but the channel has become
          too narrow for strong current flow.
        </p>

        <p>
          Cutoff is reached when depletion becomes strong enough that useful
          drain current effectively stops.
        </p>

        <p>
          This helps learners see that MOSFET turn-off can happen gradually
          through channel weakening, not only as an instant jump.
        </p>
      </SectionCard>

      <SectionCard title="What is VGS(off)?" eyebrow="Cutoff Boundary">
        <p>
          VGS(off) is the gate-source voltage where the channel is depleted
          enough to bring the MOSFET into cutoff.
        </p>

        <p>
          It acts like a turn-off boundary for the depletion behavior in this
          lesson.
        </p>

        <p>
          Learners can think of it as the point where the original normally-on
          channel has been weakened too much to stay useful.
        </p>
      </SectionCard>

      <SectionCard title="What happens when gate voltage becomes positive?" eyebrow="Enhancement Effect">
        <p>
          Positive gate voltage strengthens the already existing channel.
        </p>

        <p>
          In this simulator, that pushes the device beyond its normally on state
          into stronger conduction behavior.
        </p>

        <p>
          This is why the lesson includes an enhancement-style stronger region
          even though the topic is depletion MOSFET working.
        </p>
      </SectionCard>

      <SectionCard title="Why does this lesson matter after enhancement MOSFET?" eyebrow="Learning Contrast">
        <p>
          The previous lesson teaches a device that starts normally off and needs
          gate action to build a channel.
        </p>

        <p>
          This lesson teaches a device that starts normally on and can be
          weakened by negative gate action.
        </p>

        <p>
          That contrast helps learners understand that MOSFET types cannot all
          be explained with the same default turn-on story.
        </p>
      </SectionCard>

      <SectionCard title="Why do drain voltage, load, and temperature still matter?" eyebrow="Real Operation">
        <p>
          Even though the lesson focuses on gate control and channel depletion,
          drain voltage, load resistance, and temperature still affect the final
          operating result.
        </p>

        <p>
          Those factors influence drain current, power, heating, and the visible
          strength of conduction.
        </p>

        <p>
          This reminds the learner that the MOSFET is always part of a full
          circuit, not an isolated idea.
        </p>
      </SectionCard>

      <SectionCard title="What is the main beginner rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to remember the starting
          condition first.
        </p>

        <p>
          The channel already exists at zero gate voltage, negative gate voltage
          depletes it, and positive gate voltage strengthens it.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a depletion MOSFET is best understood as a
          normally-on MOSFET whose gate can either weaken the channel toward
          cutoff or strengthen it toward stronger conduction.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A depletion MOSFET starts with a channel already present at VGS = 0.</li>
          <li>That means it begins as a normally on device.</li>
          <li>Negative gate voltage depletes and narrows the channel.</li>
          <li>Weak channel is the reduced-conduction region before cutoff.</li>
          <li>VGS(off) is the cutoff boundary for useful conduction.</li>
          <li>Positive gate voltage strengthens the channel even more.</li>
          <li>This lesson is the key contrast to enhancement MOSFET working.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
