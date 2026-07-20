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
      question: "What is an optocoupler?",
      answer:
        "An optocoupler is an electronic component that transfers a signal using light while keeping two circuits electrically isolated.",
    },
    {
      question: "Why is electrical isolation important?",
      answer:
        "Isolation protects the low-power control side from the high-voltage or noisy side while still allowing signal transfer.",
    },
    {
      question: "What are the two main parts inside a simple optocoupler?",
      answer:
        "A basic optocoupler usually contains an LED on the input side and a light-sensitive device such as a phototransistor on the output side.",
    },
    {
      question: "How does signal transfer happen?",
      answer:
        "When current flows through the input LED, it emits light. That light activates the output sensor device, which then changes the output circuit state.",
    },
    {
      question: "Why is the optocoupler different from a direct electrical connection?",
      answer:
        "The two sides do not share a direct electrical path for the signal; the signal crosses the gap through light.",
    },
    {
      question: "What is the main beginner takeaway?",
      answer:
        "An optocoupler sends signal information through light, not through direct metal connection, and that creates safe circuit isolation.",
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
              What Is Optocoupler
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains what an optocoupler is and why it is used to
              transfer signals between two electrically isolated circuits.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is simple: the input side sends light, and the output
              side receives that light to control another circuit state.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              That means signal transfer happens without direct electrical
              connection between the two sides.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Device" value="LED" tone="emerald" />
            <ValueCard label="Signal Bridge" value="Light" tone="violet" />
            <ValueCard label="Main Benefit" value="Isolation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is an optocoupler?" eyebrow="Core Definition">
        <p>
          An optocoupler is an electronic isolation component that transfers a
          signal from one circuit to another by using light.
        </p>

        <p>
          It helps one side of the system communicate with another side without
          forming a direct electrical signal connection.
        </p>

        <p>
          That makes it very useful in protection and control applications.
        </p>
      </SectionCard>

      <SectionCard title="Why is isolation important?" eyebrow="Protection Idea">
        <p>
          Isolation is important because many electronic systems need a low-power
          control side to remain protected from a high-voltage or noisy load
          side.
        </p>

        <p>
          If both sides were directly connected, unwanted voltage or noise could
          damage sensitive parts.
        </p>

        <p>
          An optocoupler helps solve that problem while still allowing the signal
          to pass.
        </p>
      </SectionCard>

      <SectionCard title="What are the two basic parts inside it?" eyebrow="Internal Idea">
        <p>
          A simple optocoupler usually has an LED on the input side and a
          light-sensitive device on the output side.
        </p>

        <p>
          The LED creates light when input current flows, and the output device
          reacts to that light.
        </p>

        <p>
          This pair forms the basic working structure of the component.
        </p>
      </SectionCard>

      <SectionCard title="How does the signal move from one side to the other?" eyebrow="Signal Transfer">
        <p>
          The signal begins as electrical current on the input side.
        </p>

        <p>
          That current turns on the internal LED, which emits light across the
          isolation gap.
        </p>

        <p>
          The output device receives the light and changes the output circuit
          condition.
        </p>
      </SectionCard>

      <SectionCard title="Why is this different from normal wiring?" eyebrow="Direct vs Optical">
        <p>
          In normal wiring, the signal usually travels through a direct metallic
          electrical path.
        </p>

        <p>
          In an optocoupler, the signal crosses from one side to the other by
          light, not by direct metal connection.
        </p>

        <p>
          That is the most important identity of an optocoupler.
        </p>
      </SectionCard>

      <SectionCard title="Where is an optocoupler useful?" eyebrow="Practical Use">
        <p>
          Optocouplers are useful in microcontroller interfaces, power control,
          industrial circuits, switching systems, and safety-related signal
          isolation.
        </p>

        <p>
          They are especially valuable when a delicate logic circuit must
          communicate with a more powerful circuit safely.
        </p>

        <p>
          So the component is both practical and protective.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest memory rule is to separate the device into two sides.
        </p>

        <p>
          One side sends light, and the other side receives it to create output
          action.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an optocoupler transfers signal through light so
          two circuits can communicate while staying electrically isolated.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>An optocoupler transfers signal through light.</li>
          <li>It keeps input and output circuits electrically isolated.</li>
          <li>A simple optocoupler contains an LED and a light-sensitive output device.</li>
          <li>The input current turns on the LED.</li>
          <li>The emitted light controls the output side.</li>
          <li>This is different from a direct wired signal path.</li>
          <li>The main beginner idea is safe optical signal transfer.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
