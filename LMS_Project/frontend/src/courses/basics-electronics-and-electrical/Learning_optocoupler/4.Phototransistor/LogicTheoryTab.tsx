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
      question: "What is a phototransistor in this lesson?",
      answer:
        "A phototransistor is the light-sensitive transistor on the output side of an optocoupler that turns on when it receives light from the input LED.",
    },
    {
      question: "Why is a phototransistor useful?",
      answer:
        "It provides stronger output-side switching action than a simple optical receiver, while still keeping input and output electrically isolated.",
    },
    {
      question: "What happens when the input LED emits light?",
      answer:
        "The light crosses the isolation gap and activates the phototransistor, allowing output current to flow in the external circuit.",
    },
    {
      question: "What is the key beginner idea here?",
      answer:
        "The learner should understand that light from the LED controls transistor conduction on the output side.",
    },
    {
      question: "How is a phototransistor different from a photodiode?",
      answer:
        "Both respond to light, but this lesson focuses on the transistor-style output switching behavior of a phototransistor.",
    },
    {
      question: "What is the main takeaway?",
      answer:
        "A phototransistor acts like an optical switch-controlled transistor that converts incoming light into stronger output conduction.",
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
              Phototransistor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a phototransistor works as the output-side
              optical receiver and switching device in an optocoupler.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that the input LED sends light, and that light
              makes the phototransistor conduct on the output side.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This gives the optocoupler a practical transistor-style output
              response.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="Phototransistor" tone="violet" />
            <ValueCard label="Output Result" value="Conduction" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a phototransistor?" eyebrow="Core Definition">
        <p>
          A phototransistor is a transistor-like light-sensitive output device
          that reacts when light reaches it.
        </p>

        <p>
          In this lesson, it is the output component that receives optical
          energy from the input LED side of the optocoupler.
        </p>

        <p>
          That light-controlled behavior allows it to act as a switching device.
        </p>
      </SectionCard>

      <SectionCard title="Why is a phototransistor important?" eyebrow="Output Control">
        <p>
          An optocoupler needs a safe way to turn output-side current on or off
          without direct electrical connection to the input side.
        </p>

        <p>
          The phototransistor provides that function by using light as the
          control signal.
        </p>

        <p>
          So it helps the optocoupler combine isolation with output switching
          action.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the input LED turns on?" eyebrow="Light-Controlled Action">
        <p>
          When input current flows through the LED side, the LED emits light.
        </p>

        <p>
          That light crosses the isolation barrier and reaches the
          phototransistor.
        </p>

        <p>
          The phototransistor then starts conducting, allowing output current to
          flow in the external circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson more advanced than the basic definition?" eyebrow="Focused Device Study">
        <p>
          The first optocoupler lesson introduces the general idea of light-based
          signal transfer.
        </p>

        <p>
          This lesson focuses on a specific output device that gives stronger
          switching behavior: the phototransistor.
        </p>

        <p>
          That makes the learner's understanding of the output side more
          practical.
        </p>
      </SectionCard>

      <SectionCard title="How is a phototransistor different from a photodiode?" eyebrow="Comparison">
        <p>
          Both devices are light-sensitive and can be used on the output side of
          optical isolation systems.
        </p>

        <p>
          But a phototransistor lesson focuses on transistor-style conduction and
          switching response.
        </p>

        <p>
          This helps learners understand why different optical output devices may
          be chosen for different applications.
        </p>
      </SectionCard>

      <SectionCard title="Why does isolation still matter most?" eyebrow="Safety Link">
        <p>
          Even though the lesson is about the phototransistor, the main system
          idea is still isolation.
        </p>

        <p>
          The input side controls the output side through light, not through a
          direct electrical signal wire.
        </p>

        <p>
          That keeps control and load sections separated while still allowing
          switching.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember the lesson is to track the light path and
          the output response.
        </p>

        <p>
          The LED sends light, and the phototransistor receives that light and
          turns conduction on.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a phototransistor is the optocoupler output switch
          that uses incoming light to control output current flow.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A phototransistor is a light-sensitive transistor output device.</li>
          <li>It receives light from the input LED side.</li>
          <li>That light causes output-side conduction.</li>
          <li>It gives transistor-style switching response.</li>
          <li>The lesson focuses on practical output switching behavior.</li>
          <li>It is different from photodiode-based output study.</li>
          <li>The main idea is optical control with isolated output conduction.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
