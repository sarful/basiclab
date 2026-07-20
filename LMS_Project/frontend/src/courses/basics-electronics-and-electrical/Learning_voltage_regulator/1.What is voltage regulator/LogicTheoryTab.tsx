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
      question: "What is the main job of a voltage regulator?",
      answer:
        "Its main job is to keep the output voltage stable even when input voltage or load conditions change within the regulator's operating range.",
    },
    {
      question: "Why is a regulator needed if a battery or supply already gives voltage?",
      answer:
        "Because raw supply voltage can rise, fall, or fluctuate, while many circuits need a more controlled and predictable voltage level.",
    },
    {
      question: "What do input, ground, and output mean in a basic regulator package?",
      answer:
        "Input receives the unregulated source, ground provides the reference point, and output delivers the regulated voltage to the circuit.",
    },
    {
      question: "Why is the 7805 family so common in beginner lessons?",
      answer:
        "Because it is a simple fixed-voltage linear regulator that clearly demonstrates the idea of converting a higher DC input into a stable 5 V output.",
    },
    {
      question: "What is the simplest difference between raw input and regulated output?",
      answer:
        "Raw input may vary more, while regulated output is intentionally held near a target value for safer and more reliable circuit operation.",
    },
    {
      question: "Why is this lesson important before deeper regulator topics?",
      answer:
        "Because it builds the basic mental model of why regulators exist, how their three terminals work, and how a stable DC output supports electronic circuits.",
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
              What Is a Voltage Regulator?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains why a voltage regulator is used to keep a DC
              output more stable and useful than a raw supply line.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The core beginner idea is simple: many electronic circuits do not
              want an uncontrolled supply, they want a predictable working
              voltage.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              That is why this lesson focuses on the regulator's purpose, its
              three terminals, and the basic idea of stable output.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Job" value="Stable Output" tone="emerald" />
            <ValueCard label="Basic Part" value="Input-GND-Output" tone="violet" />
            <ValueCard label="Beginner Example" value="7805 Regulator" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a voltage regulator in simple words?" eyebrow="Core Concept">
        <p>
          A voltage regulator is a circuit or device that keeps the output
          voltage closer to a desired value for the load.
        </p>

        <p>
          Instead of sending raw supply variation directly into the circuit, the
          regulator tries to provide a more controlled DC output.
        </p>

        <p>
          This makes it one of the most practical building blocks in electronics.
        </p>
      </SectionCard>

      <SectionCard title="Why is regulation needed at all?" eyebrow="Why It Matters">
        <p>
          A source such as an adapter, battery, or upstream power stage may not
          always stay at the exact voltage a sensitive circuit wants.
        </p>

        <p>
          Input voltage can change, load current can change, and the useful
          operating condition can shift.
        </p>

        <p>
          The regulator helps keep the downstream circuit safer and more
          predictable under those changes.
        </p>
      </SectionCard>

      <SectionCard title="What do the three terminals mean?" eyebrow="Pin Logic">
        <p>
          A basic regulator package is often introduced with three terminals:
          input, ground, and output.
        </p>

        <p>
          Input receives the unregulated supply, ground acts as the reference
          point, and output delivers the regulated voltage to the load.
        </p>

        <p>
          Once this terminal logic is clear, many beginner regulator circuits
          become much easier to understand.
        </p>
      </SectionCard>

      <SectionCard title="Why is 7805 such a common example?" eyebrow="Familiar Device">
        <p>
          The 7805 is a classic fixed linear regulator used to produce about 5 V
          from a higher DC input.
        </p>

        <p>
          It is popular in beginner lessons because its job is easy to explain:
          accept a higher input and provide a stable 5 V output if the operating
          conditions are suitable.
        </p>

        <p>
          That makes it a strong teaching example for the idea of regulation.
        </p>
      </SectionCard>

      <SectionCard title="What is the difference between raw input and regulated output?" eyebrow="Input vs Output">
        <p>
          Raw input is the original supply entering the regulator and may be
          less controlled.
        </p>

        <p>
          Regulated output is the voltage the regulator is trying to keep near
          its target value for the circuit.
        </p>

        <p>
          This difference is the heart of the lesson: supply comes in, stable
          usable voltage goes out.
        </p>
      </SectionCard>

      <SectionCard title="Why is ground important here?" eyebrow="Reference Point">
        <p>
          Voltage is always understood relative to a reference, and ground
          provides that reference in the basic regulator lesson.
        </p>

        <p>
          Without a clear reference point, input and output voltage labels would
          not have practical meaning in the circuit.
        </p>

        <p>
          This is why ground appears as one of the essential regulator terminals.
        </p>
      </SectionCard>

      <SectionCard title="Does a regulator create energy?" eyebrow="Correct Intuition">
        <p>
          No, a regulator does not create extra energy or voltage out of
          nothing.
        </p>

        <p>
          Its purpose is to control, shape, and stabilize how the input supply
          is delivered to the load.
        </p>

        <p>
          This helps beginners avoid confusing voltage regulation with voltage
          generation.
        </p>
      </SectionCard>

      <SectionCard title="Why is stable output so useful for electronics?" eyebrow="Practical Use">
        <p>
          Many ICs, sensors, logic circuits, and small controllers work better
          when their supply stays near a known value.
        </p>

        <p>
          If the voltage swings too much, the circuit may behave badly, reset,
          heat incorrectly, or become unreliable.
        </p>

        <p>
          A regulator is one of the simplest tools for improving that supply
          condition.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand the topic is to remember one flow.
        </p>

        <p>
          Raw DC comes into the regulator, the regulator references ground, and
          a steadier output is sent to the circuit.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a voltage regulator is the device we use when a
          circuit needs a more dependable DC supply than the raw source can give
          directly.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A voltage regulator helps keep output voltage more stable for the load.</li>
          <li>It is used because raw supply voltage may vary or be less controlled.</li>
          <li>The three basic terminals are input, ground, and output.</li>
          <li>The 7805 is a common beginner example of fixed linear regulation.</li>
          <li>Raw input and regulated output are not the same thing.</li>
          <li>Ground provides the reference point for voltage meaning.</li>
          <li>The regulator controls energy delivery; it does not create energy from nothing.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
