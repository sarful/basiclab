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
      question: "What is a PhotoTRIAC in this lesson?",
      answer:
        "A PhotoTRIAC is the light-triggered AC output device inside an optocoupler that turns on when light from the input LED reaches it.",
    },
    {
      question: "Why is PhotoTRIAC useful?",
      answer:
        "It allows an isolated low-power input signal to control an AC load path without a direct electrical connection.",
    },
    {
      question: "What happens when the input LED emits light?",
      answer:
        "The light crosses the isolation barrier and triggers the PhotoTRIAC, allowing AC current to flow through the output load path.",
    },
    {
      question: "What is the key beginner idea of this topic?",
      answer:
        "The learner should understand that light can trigger AC-side switching while keeping the input side electrically isolated.",
    },
    {
      question: "How is PhotoTRIAC different from phototransistor output?",
      answer:
        "This lesson focuses on AC output switching through a TRIAC-type optical receiver, rather than transistor-style DC output conduction.",
    },
    {
      question: "What is the main takeaway?",
      answer:
        "A PhotoTRIAC lets an optocoupler safely control AC loads by using light as the trigger signal.",
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
              PhotoTRIAC
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a PhotoTRIAC works as the AC output-side
              switching device inside an optocoupler.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that the input LED sends light, and that light
              triggers AC-side switching on the output side.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes optocouplers useful for isolated AC control
              applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="PhotoTRIAC" tone="violet" />
            <ValueCard label="Output Type" value="AC Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a PhotoTRIAC?" eyebrow="Core Definition">
        <p>
          A PhotoTRIAC is a light-triggered AC switching device used on the
          output side of some optocouplers.
        </p>

        <p>
          It responds when optical energy from the input LED reaches it across
          the isolation barrier.
        </p>

        <p>
          This allows it to participate in AC load switching without direct
          electrical coupling to the input side.
        </p>
      </SectionCard>

      <SectionCard title="Why is PhotoTRIAC important?" eyebrow="AC Output Role">
        <p>
          Some control systems need an isolated way to switch or trigger an AC
          output path.
        </p>

        <p>
          A PhotoTRIAC provides that by using light as the trigger mechanism for
          the AC-side device.
        </p>

        <p>
          So it combines isolation and AC output control in one concept.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the input LED turns on?" eyebrow="Light Trigger">
        <p>
          When input current flows through the LED side, the LED emits light.
        </p>

        <p>
          That light crosses the internal isolation barrier and reaches the
          PhotoTRIAC.
        </p>

        <p>
          The PhotoTRIAC is then triggered, and AC current can flow through the
          output load path.
        </p>
      </SectionCard>

      <SectionCard title="Why is this topic different from phototransistor output?" eyebrow="Output-Type Difference">
        <p>
          A phototransistor lesson usually focuses on transistor-style output
          conduction, often in DC-oriented control ideas.
        </p>

        <p>
          This lesson is different because the output device is tied to AC-side
          switching behavior.
        </p>

        <p>
          That helps learners distinguish DC optical outputs from AC optical
          switching outputs.
        </p>
      </SectionCard>

      <SectionCard title="Why is isolation still the main system idea?" eyebrow="Safety Link">
        <p>
          Even though the lesson focuses on AC switching, the most important
          system principle is still electrical isolation.
        </p>

        <p>
          The input side does not directly wire into the AC output side to send
          the control signal.
        </p>

        <p>
          Instead, light carries the trigger information safely across the
          barrier.
        </p>
      </SectionCard>

      <SectionCard title="Where is PhotoTRIAC useful in practice?" eyebrow="Practical Use">
        <p>
          PhotoTRIAC-based optocouplers are useful in AC lamp control, mains
          triggering, and other isolated AC switching tasks.
        </p>

        <p>
          They are especially helpful when a small control circuit must safely
          influence an AC load.
        </p>

        <p>
          That is why this topic matters in practical power-electronics
          learning.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember the lesson is to follow the light and the
          AC load.
        </p>

        <p>
          The LED sends light, and the PhotoTRIAC uses that light to enable the
          AC output path.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a PhotoTRIAC lets an optocoupler safely trigger AC
          load control through light-based isolation.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A PhotoTRIAC is a light-triggered AC output device.</li>
          <li>It receives light from the input LED side.</li>
          <li>That light triggers AC-side switching.</li>
          <li>It is useful for isolated AC control applications.</li>
          <li>This topic is different from phototransistor-style output study.</li>
          <li>Isolation is still the most important system principle.</li>
          <li>The main idea is safe AC switching through optical triggering.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
