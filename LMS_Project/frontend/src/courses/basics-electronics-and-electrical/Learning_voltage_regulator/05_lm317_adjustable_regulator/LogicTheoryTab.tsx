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
      question: "What makes LM317 different from a 78xx regulator?",
      answer:
        "LM317 is adjustable, so its output is not fixed to one value like 7805 or 7812; instead, the output is set using an external resistor network.",
    },
    {
      question: "Why is LM317 called an adjustable regulator?",
      answer:
        "Because the output voltage can be changed by choosing the resistor values around the adjust pin, rather than being fixed inside the part.",
    },
    {
      question: "What is the role of the resistor network in an LM317 circuit?",
      answer:
        "The resistor network sets the output voltage by creating the feedback relationship the regulator uses to control VOUT.",
    },
    {
      question: "Why is the adjust pin important?",
      answer:
        "Because it lets the regulator sense the resistor-divider condition and regulate the output to the value defined by that network.",
    },
    {
      question: "Does LM317 still follow the linear regulator idea?",
      answer:
        "Yes. It is still a linear regulator, so it controls internal voltage drop and still loses extra power as heat when input is above output.",
    },
    {
      question: "Why is this lesson useful after learning fixed regulator families?",
      answer:
        "Because it shows how regulation can move from fixed output models to a more flexible adjustable-output design.",
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
              LM317 Adjustable Regulator
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how the LM317 regulator gives adjustable
              output voltage instead of the single fixed output used in standard
              78xx regulators.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that LM317 still works as a linear
              regulator, but its output is set by an external resistor network.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the topic an important step from fixed-voltage parts to
              flexible regulated output design.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Part Type" value="Adjustable Linear Regulator" tone="emerald" />
            <ValueCard label="Key Pin" value="Adjust" tone="violet" />
            <ValueCard label="Output Method" value="Set by Resistors" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is LM317 in simple words?" eyebrow="Core Concept">
        <p>
          LM317 is a linear voltage regulator whose output can be adjusted to
          different values instead of being locked to one fixed voltage.
        </p>

        <p>
          That makes it more flexible than a standard fixed regulator like a
          7805.
        </p>

        <p>
          It is one of the most common beginner examples of adjustable
          regulation.
        </p>
      </SectionCard>

      <SectionCard title="Why is it called adjustable?" eyebrow="Variable Output">
        <p>
          A fixed regulator gives one built-in output voltage, but LM317 allows
          the output to be set by external components.
        </p>

        <p>
          In practice, that means the designer can choose resistor values and
          obtain different regulated output voltages from the same regulator
          family.
        </p>

        <p>
          This is the main beginner difference between fixed and adjustable
          regulators.
        </p>
      </SectionCard>

      <SectionCard title="What does the adjust pin do?" eyebrow="Feedback Control">
        <p>
          The adjust pin is the special feature that makes LM317 different from
          simple fixed-output regulators.
        </p>

        <p>
          It works with the resistor network so the regulator can sense the
          required output condition and control the voltage accordingly.
        </p>

        <p>
          This is how output becomes settable rather than fixed.
        </p>
      </SectionCard>

      <SectionCard title="Why are resistors so important in the LM317 circuit?" eyebrow="Setting the Output">
        <p>
          In the basic LM317 circuit, the resistor pair defines the feedback
          relationship that determines the output voltage.
        </p>

        <p>
          One resistor is often kept fixed while the other is changed to adjust
          the final output level.
        </p>

        <p>
          This is why the lesson shows output changing as resistor values
          change.
        </p>
      </SectionCard>

      <SectionCard title="How is LM317 still a linear regulator?" eyebrow="Same Core Behavior">
        <p>
          Even though the output is adjustable, LM317 still regulates by
          controlling internal voltage drop in a linear way.
        </p>

        <p>
          So it still follows the same broad linear regulator behavior learned
          earlier.
        </p>

        <p>
          That means it also shares the usual heat-loss tradeoff when input is
          much higher than output.
        </p>
      </SectionCard>

      <SectionCard title="Why must input still be high enough?" eyebrow="Headroom Requirement">
        <p>
          Adjustable output does not remove the need for sufficient input
          voltage.
        </p>

        <p>
          The regulator still needs enough input above the chosen output so it
          can regulate properly.
        </p>

        <p>
          So LM317 remains flexible, but not magical.
        </p>
      </SectionCard>

      <SectionCard title="Why is LM317 useful in practical circuits?" eyebrow="Flexibility">
        <p>
          LM317 is useful because one regulator type can be used for many output
          voltage needs by changing resistor values.
        </p>

        <p>
          This reduces the need to keep many different fixed-voltage regulator
          models for every small variation.
        </p>

        <p>
          It teaches learners how circuit design choices can set regulator
          behavior.
        </p>
      </SectionCard>

      <SectionCard title="How does this lesson extend the earlier regulator lessons?" eyebrow="Learning Progression">
        <p>
          Earlier lessons introduce the purpose of regulation, linear regulator
          working, and fixed regulator families such as 78xx.
        </p>

        <p>
          This lesson adds flexibility by showing that output can also be chosen
          through circuit design, not only by selecting a fixed part number.
        </p>

        <p>
          That makes LM317 an important bridge toward more design-oriented
          thinking.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember LM317 is to compare it with a fixed
          regulator.
        </p>

        <p>
          A fixed regulator gives one fixed output, but LM317 lets resistor
          selection define the regulated output value.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: LM317 is a linear regulator that becomes flexible
          because the circuit around it helps decide the final output voltage.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>LM317 is an adjustable linear regulator.</li>
          <li>Its output is set by an external resistor network instead of one fixed internal value.</li>
          <li>The adjust pin is the key feature that enables output control.</li>
          <li>It still works with the same general linear regulation principle.</li>
          <li>It still needs enough input headroom above the chosen output.</li>
          <li>It offers more flexibility than fixed regulators such as the 78xx family.</li>
          <li>This lesson connects regulator behavior with circuit-based output setting.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
