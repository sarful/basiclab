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
      question: "What does the 78xx family name mean in simple terms?",
      answer:
        "It refers to a series of positive fixed-voltage linear regulators where the last two digits usually indicate the output voltage, such as 7805 for 5 V.",
    },
    {
      question: "Why is the 78xx series important for beginners?",
      answer:
        "Because it gives simple fixed regulated outputs and clearly teaches how a standard three-terminal positive regulator is used in practical circuits.",
    },
    {
      question: "What do input, ground, and output do in a 78xx regulator?",
      answer:
        "Input receives the higher DC source, ground provides the voltage reference, and output delivers the fixed regulated voltage to the load.",
    },
    {
      question: "Why is 7805 the most common example?",
      answer:
        "Because 5 V is widely used in small electronics and digital circuits, so 7805 becomes an easy and familiar teaching model.",
    },
    {
      question: "Does every 78xx regulator give the same output voltage?",
      answer:
        "No. The family works on the same basic principle, but different models such as 7805, 7809, or 7812 are designed for different fixed output voltages.",
    },
    {
      question: "Why is this lesson useful after learning linear regulator working?",
      answer:
        "Because it turns the general idea of linear regulation into a concrete family of real regulator parts used in practical circuits.",
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
              78xx Series
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains the 78xx family of fixed positive linear
              regulators and why these devices are some of the most common
              beginner-friendly voltage regulator parts.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main idea is that the 78xx family gives standard fixed output
              voltages through a familiar three-terminal regulator structure.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This topic helps learners move from the general idea of linear
              regulation to actual regulator part families used in real circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Family Type" value="Positive Fixed Regulator" tone="emerald" />
            <ValueCard label="Common Example" value="7805" tone="violet" />
            <ValueCard label="Pin Logic" value="IN-GND-OUT" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is the 78xx series?" eyebrow="Part Family">
        <p>
          The 78xx series is a family of fixed positive linear voltage
          regulators.
        </p>

        <p>
          These parts are designed to provide specific regulated output
          voltages, such as 5 V, 9 V, or 12 V, depending on the model number.
        </p>

        <p>
          That makes the 78xx family one of the easiest regulator families for
          beginners to recognize.
        </p>
      </SectionCard>

      <SectionCard title="What do the last two digits usually mean?" eyebrow="Model Naming">
        <p>
          In common beginner explanations, the last two digits usually indicate
          the intended fixed output voltage.
        </p>

        <p>
          For example, 7805 is associated with 5 V output, 7809 with 9 V, and
          7812 with 12 V.
        </p>

        <p>
          This naming pattern helps learners quickly connect a part number to a
          target output level.
        </p>
      </SectionCard>

      <SectionCard title="Why is the 78xx family so widely used in learning?" eyebrow="Beginner Value">
        <p>
          The 78xx family is simple to understand because it offers a fixed
          regulated voltage without requiring adjustment formulas for basic use.
        </p>

        <p>
          That lets beginners focus on input, ground, output, and regulation
          behavior without first needing more advanced design steps.
        </p>

        <p>
          It is one of the clearest bridges from theory to practical part
          selection.
        </p>
      </SectionCard>

      <SectionCard title="How does a 78xx regulator fit the linear regulator idea?" eyebrow="Working Principle">
        <p>
          A 78xx regulator still works as a linear regulator, meaning it
          controls internal voltage drop to keep output near its fixed target
          value.
        </p>

        <p>
          So the family does not introduce a new kind of regulation, it gives a
          real-world set of parts that apply the linear regulation principle.
        </p>

        <p>
          This is why lesson 3 naturally follows lesson 2.
        </p>
      </SectionCard>

      <SectionCard title="What do input, ground, and output mean here?" eyebrow="Three-Terminal Logic">
        <p>
          Input is where the higher raw DC supply enters the regulator.
        </p>

        <p>
          Ground provides the voltage reference, and output is where the fixed
          regulated voltage is delivered to the load.
        </p>

        <p>
          This same three-terminal logic makes many 78xx-based circuits easy to
          read and build.
        </p>
      </SectionCard>

      <SectionCard title="Why is 7805 the most familiar example?" eyebrow="Most Common Model">
        <p>
          The 7805 is especially common because 5 V is a very familiar supply
          level in small electronics, logic circuits, and beginner projects.
        </p>

        <p>
          As a result, many first regulator demonstrations use 7805 as the main
          teaching model.
        </p>

        <p>
          Once that model is understood, the rest of the 78xx family becomes
          easier to understand as a pattern.
        </p>
      </SectionCard>

      <SectionCard title="Does every 78xx part behave exactly the same?" eyebrow="Family Similarity">
        <p>
          The family shares the same general concept of positive fixed linear
          regulation, but different models are intended for different output
          voltage values.
        </p>

        <p>
          So the operating idea is similar, even though the exact part choice
          depends on what voltage the circuit needs.
        </p>

        <p>
          This teaches learners to think in both family patterns and specific
          part numbers.
        </p>
      </SectionCard>

      <SectionCard title="Why is physical package view useful in this lesson?" eyebrow="Real Component View">
        <p>
          Seeing the physical regulator package helps learners connect abstract
          pin labels to a real component.
        </p>

        <p>
          It becomes easier to remember which terminal is input, which is
          ground, and which is output when the part is shown as an actual device
          instead of only as a symbol.
        </p>

        <p>
          That makes the lesson more practical and workshop-friendly.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand the 78xx family is to remember one
          pattern.
        </p>

        <p>
          It is a family of fixed positive regulators that take a higher DC
          input and provide a named fixed output through a simple three-pin
          structure.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: if a circuit needs a standard fixed positive DC
          voltage, a 78xx regulator is one of the most familiar and beginner
          friendly places to start.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The 78xx series is a family of fixed positive linear regulators.</li>
          <li>The last two digits usually indicate the fixed output voltage.</li>
          <li>These parts use the same linear regulation idea learned earlier.</li>
          <li>The three basic terminals are input, ground, and output.</li>
          <li>7805 is the most common beginner example.</li>
          <li>Different 78xx models give different fixed output voltages.</li>
          <li>This lesson connects regulator theory with real part families and package views.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
