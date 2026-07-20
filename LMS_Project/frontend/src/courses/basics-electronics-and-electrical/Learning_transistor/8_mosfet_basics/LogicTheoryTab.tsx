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
      question: "What is the main control idea of a MOSFET?",
      answer:
        "A MOSFET is mainly controlled by gate voltage creating an electric field, rather than by continuous base current like a BJT.",
    },
    {
      question: "What happens when the gate voltage is too low?",
      answer:
        "The MOSFET stays off or near off because the channel is not formed strongly enough for useful drain current.",
    },
    {
      question: "What does threshold voltage mean in this lesson?",
      answer:
        "It is the gate-voltage region where the MOSFET begins moving from off behavior toward channel formation and conduction.",
    },
    {
      question: "What is the subthreshold region?",
      answer:
        "It is the weak-conduction region before strong channel formation, where the MOSFET is not fully off but not yet strongly on.",
    },
    {
      question: "What is the linear region here?",
      answer:
        "The MOSFET is on and behaving more like a controllable channel path, often like a resistive conduction region.",
    },
    {
      question: "What is saturation in this MOSFET lesson?",
      answer:
        "It is the operating region reached when drain voltage is high enough relative to gate overdrive that the MOSFET no longer behaves like the simpler low-resistance linear case.",
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
              MOSFET Basics
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson introduces the MOSFET as a field-controlled
              transistor and explains how gate voltage influences channel
              strength and drain current.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main idea is that a MOSFET does not use transistor control in
              the same way as a BJT. Instead, gate voltage shapes the
              conductive channel.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This lesson also introduces the main MOSFET operating regions:
              OFF, subthreshold, linear, and saturation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="MOSFET" tone="emerald" />
            <ValueCard label="Main Control" value="Gate Voltage" tone="violet" />
            <ValueCard label="Key Path" value="Drain to Source" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why is a MOSFET different from a BJT?" eyebrow="Core Concept">
        <p>
          A MOSFET and a BJT are both transistors, but they do not use the same
          main control idea.
        </p>

        <p>
          A BJT is usually taught with current-driven control, while a MOSFET is
          usually taught with gate-voltage field control.
        </p>

        <p>
          That makes the MOSFET especially important in switching and electronic
          control circuits where gate control is useful.
        </p>
      </SectionCard>

      <SectionCard title="What does the gate do?" eyebrow="Gate Control">
        <p>
          The gate controls whether a conductive channel is formed strongly
          enough between drain and source.
        </p>

        <p>
          Increasing gate voltage changes the electric field and increases
          channel strength.
        </p>

        <p>
          So the gate is the control point that decides how easily drain current
          can flow.
        </p>
      </SectionCard>

      <SectionCard title="What is threshold voltage?" eyebrow="Turn-On Boundary">
        <p>
          Threshold voltage is the important gate-voltage region where the
          MOSFET begins to move away from fully off behavior.
        </p>

        <p>
          Below that region, channel formation is too weak for strong useful
          current.
        </p>

        <p>
          Around and above that region, the MOSFET begins showing visible
          conduction changes.
        </p>
      </SectionCard>

      <SectionCard title="What is the OFF region?" eyebrow="No Useful Channel">
        <p>
          In the OFF region, gate voltage is too low to create a useful channel.
        </p>

        <p>
          Drain current remains extremely low or effectively absent for practical
          switching purposes.
        </p>

        <p>
          This is the state where the MOSFET behaves like an open path.
        </p>
      </SectionCard>

      <SectionCard title="What is subthreshold?" eyebrow="Weak Conduction">
        <p>
          Subthreshold is the weak-conduction region between clearly off and
          strongly on.
        </p>

        <p>
          In this region, the MOSFET is not fully blocked, but the channel is
          still not strong enough for solid switching performance.
        </p>

        <p>
          This helps learners understand that MOSFET turn-on is not always an
          instant jump from zero to maximum conduction.
        </p>
      </SectionCard>

      <SectionCard title="What is the linear region?" eyebrow="Channel Conduction">
        <p>
          In the linear region, the MOSFET is on and the drain-source path is
          behaving more like a controllable conductive channel.
        </p>

        <p>
          In basic learning language, this region can be thought of as the more
          resistive or switch-channel style operating region.
        </p>

        <p>
          This is often the practical ON region learners first recognize in a
          switching lesson.
        </p>
      </SectionCard>

      <SectionCard title="What is saturation here?" eyebrow="Higher-Region Operation">
        <p>
          In this lesson, saturation is reached when the drain-voltage condition
          is high enough relative to gate overdrive that the MOSFET is no longer
          behaving like the simpler low-resistance linear case.
        </p>

        <p>
          This is a region name in MOSFET operation, and learners should not
          assume it means exactly the same thing as BJT saturation.
        </p>

        <p>
          That distinction is important because the same word appears in both
          transistor topics but describes different device behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why do drain voltage, load, and temperature matter?" eyebrow="Real Circuit Effects">
        <p>
          MOSFET behavior is not decided by gate voltage alone.
        </p>

        <p>
          Drain voltage, load resistance, load type, and temperature all affect
          current, power, and effective switching behavior.
        </p>

        <p>
          This is why the lesson includes not only state names, but also channel
          strength, drain current, efficiency, and junction temperature ideas.
        </p>
      </SectionCard>

      <SectionCard title="What is the main beginner rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to follow a simple chain.
        </p>

        <p>
          Gate voltage shapes the channel, the channel strength affects drain
          current, and the drain current determines how strongly the load
          behaves.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a MOSFET is easiest to understand as a transistor
          whose gate field controls how open the drain-source path becomes.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A MOSFET is mainly controlled by gate voltage and electric field.</li>
          <li>Threshold voltage marks the start of meaningful turn-on behavior.</li>
          <li>OFF means no useful drain-source channel conduction.</li>
          <li>Subthreshold is the weak-conduction region before strong turn-on.</li>
          <li>Linear region is the more direct channel-conduction region.</li>
          <li>MOSFET saturation is a region name that is not the same as BJT saturation.</li>
          <li>Drain voltage, load, and temperature all affect real behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
