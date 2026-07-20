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
      question: "What is the main idea of linear regulator working?",
      answer:
        "A linear regulator keeps the output near a target voltage by adjusting its internal conduction smoothly instead of switching fully on and off.",
    },
    {
      question: "Why is it called a linear regulator?",
      answer:
        "Because the regulating device operates in a controlled linear region so it can drop extra voltage continuously and hold the output stable.",
    },
    {
      question: "What must be true for a linear regulator to maintain regulation?",
      answer:
        "The input voltage must stay high enough above the desired output so the regulator still has enough headroom to control the voltage properly.",
    },
    {
      question: "Why can output stay stable when input changes a little?",
      answer:
        "Because the regulator adjusts its internal voltage drop so the load still receives nearly the target output voltage.",
    },
    {
      question: "What is the practical cost of linear regulation?",
      answer:
        "The extra input-to-output voltage is turned into heat, so efficiency can drop when the voltage difference or load current becomes large.",
    },
    {
      question: "Why is this lesson important after learning what a regulator is?",
      answer:
        "Because it explains the actual working behavior: input enters, the regulator controls the drop, and the output stays steady for the load.",
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
              Linear Regulator Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a linear regulator keeps the output
              voltage steady by continuously controlling how much voltage is
              dropped inside the regulator.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that the regulator does not simply pass
              voltage directly to the load. It actively adjusts itself so the
              output stays near a chosen value.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              That is why this topic moves beyond "what a regulator is" and
              focuses on how regulation actually happens in operation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Action" value="Controlled Voltage Drop" tone="emerald" />
            <ValueCard label="Output Goal" value="Stable VOUT" tone="violet" />
            <ValueCard label="Tradeoff" value="Heat Loss" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does a linear regulator really do?" eyebrow="Core Working Idea">
        <p>
          A linear regulator receives a higher DC input and tries to deliver a
          more stable output voltage to the load.
        </p>

        <p>
          It does this by adjusting its own internal conduction so that the
          extra voltage is dropped inside the regulator instead of appearing at
          the output.
        </p>

        <p>
          This is the central idea behind linear regulator working.
        </p>
      </SectionCard>

      <SectionCard title="Why is it called 'linear'?" eyebrow="Operating Region">
        <p>
          The word linear is used because the regulating device works in a
          controlled, partly conducting state rather than acting like a simple
          fully-off or fully-on switch.
        </p>

        <p>
          That allows the regulator to change its internal voltage drop smoothly
          and keep the output near the target level.
        </p>

        <p>
          This makes the output easy to understand, but it also leads to power
          loss as heat.
        </p>
      </SectionCard>

      <SectionCard title="How does input become regulated output?" eyebrow="Input to Output Path">
        <p>
          Input voltage enters the regulator first, but the load does not simply
          receive that same raw voltage.
        </p>

        <p>
          The regulator senses the need for a stable output and controls how
          much voltage is dropped across itself before the remaining voltage
          reaches the output terminal.
        </p>

        <p>
          So the output is the result of active control, not direct transfer.
        </p>
      </SectionCard>

      <SectionCard title="Why can the output stay steady when input changes?" eyebrow="Regulation Action">
        <p>
          If the input changes slightly, the regulator can change its internal
          drop accordingly and still keep the output near the required value.
        </p>

        <p>
          That means the load sees a steadier voltage than it would from the raw
          supply alone.
        </p>

        <p>
          This is one of the main reasons regulators are so useful in real
          electronics.
        </p>
      </SectionCard>

      <SectionCard title="Why does the regulator need extra input voltage?" eyebrow="Headroom Requirement">
        <p>
          A linear regulator cannot regulate properly if the input voltage falls
          too close to the target output voltage.
        </p>

        <p>
          It needs some extra input above the output so it still has room to
          control the voltage drop internally.
        </p>

        <p>
          This is the beginner intuition behind headroom and dropout behavior.
        </p>
      </SectionCard>

      <SectionCard title="What happens to the extra voltage?" eyebrow="Heat Dissipation">
        <p>
          The extra input-to-output voltage does not disappear. In a linear
          regulator, it becomes power loss, usually as heat.
        </p>

        <p>
          That means a larger voltage difference or larger load current can make
          the regulator hotter.
        </p>

        <p>
          This is the main practical tradeoff of linear regulation.
        </p>
      </SectionCard>

      <SectionCard title="Why is the load still important?" eyebrow="Load Interaction">
        <p>
          The regulator is not working alone; it is always supplying a load.
        </p>

        <p>
          As load current changes, the regulator must still hold the output near
          the desired value while managing power loss and internal control.
        </p>

        <p>
          This is why real regulator behavior is always connected to circuit
          demand, not only input voltage.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important after lesson 1?" eyebrow="Learning Progression">
        <p>
          Lesson 1 explains the purpose of a regulator and its basic terminals.
        </p>

        <p>
          Lesson 2 explains the working idea: the regulator actively controls
          voltage drop to protect and stabilize the output for the load.
        </p>

        <p>
          That makes this lesson the bridge between definition and operation.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a linear regulator is to imagine one
          simple flow.
        </p>

        <p>
          A higher input comes in, the regulator absorbs the extra difference,
          and a steadier output is delivered to the circuit.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a linear regulator works by sacrificing extra
          voltage inside itself so the load can receive a cleaner, more stable
          output.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A linear regulator keeps output voltage near a target value.</li>
          <li>It works by controlling internal voltage drop, not by passing raw input directly.</li>
          <li>It needs enough input headroom above the output to regulate properly.</li>
          <li>Small input changes can be absorbed while output remains steadier.</li>
          <li>The extra voltage is lost as heat inside the regulator.</li>
          <li>Load current still matters because regulation happens under real circuit demand.</li>
          <li>This lesson explains operation, not only purpose.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
