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
      question: "What makes the NPN transistor turn on in this lesson?",
      answer:
        "The transistor turns on when the base-emitter junction gets enough drive, allowing base current to start transistor conduction.",
    },
    {
      question: "What happens when the switch is open?",
      answer:
        "Base drive is disconnected, so the transistor stays in cutoff and the LED path remains off.",
    },
    {
      question: "What is the active region in this simulation?",
      answer:
        "The transistor is conducting, but base drive is still limiting collector current before full saturation is reached.",
    },
    {
      question: "What is saturation here?",
      answer:
        "Saturation is the strong switching state where base drive is high enough to force the transistor close to a closed switch for the LED load path.",
    },
    {
      question: "Why does base resistance matter so much?",
      answer:
        "Because base resistance controls how much base current can flow, which directly affects whether the transistor stays in cutoff, active region, or saturation.",
    },
    {
      question: "Why are fault modes useful in this lesson?",
      answer:
        "They show that a transistor may have base drive or supply present, yet still fail to operate correctly if a key path is open, reversed, or missing.",
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
              NPN Transistor Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how an NPN transistor works as a practical
              switching device in a simple LED load circuit.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main ideas are base drive, collector current, LED load
              control, and the transition between cutoff, active, and saturation
              states.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It also introduces troubleshooting logic by showing how faults in
              the base path or load path can change the result.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="NPN" tone="emerald" />
            <ValueCard label="Main Load" value="LED" tone="amber" />
            <ValueCard label="Switch Goal" value="Cutoff to Sat" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="What is this NPN lesson teaching?" eyebrow="Core Concept">
        <p>
          This lesson teaches how an NPN transistor controls a load path using a
          much smaller base-drive path.
        </p>

        <p>
          The circuit shows a realistic switching idea: the control side decides
          whether the transistor stays off, partly conducts, or switches hard
          on.
        </p>

        <p>
          That makes the lesson more practical than a purely symbolic
          transistor introduction.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the switch is open?" eyebrow="Cutoff State">
        <p>
          When the switch is open, base drive is disconnected from the
          transistor.
        </p>

        <p>
          Without enough base-emitter drive, the transistor remains in cutoff.
        </p>

        <p>
          In that state, collector current cannot properly flow through the LED
          branch, so the LED stays off.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the switch is closed?" eyebrow="Base Drive Starts">
        <p>
          Closing the switch gives the base path a chance to conduct.
        </p>

        <p>
          If the base-emitter junction gets enough forward drive, base current
          starts flowing.
        </p>

        <p>
          That base current is what allows the transistor to begin opening the
          collector-emitter path for the load.
        </p>
      </SectionCard>

      <SectionCard title="Why is base resistance so important?" eyebrow="Control Strength">
        <p>
          Base resistance directly affects how much base current can enter the
          transistor.
        </p>

        <p>
          A higher base resistance reduces base drive, while a lower base
          resistance can increase it.
        </p>

        <p>
          This is why the transistor can move between cutoff, active region, and
          saturation just by changing the base path conditions.
        </p>
      </SectionCard>

      <SectionCard title="What is the active region here?" eyebrow="Partial Conduction">
        <p>
          In the active region, the transistor is conducting and the LED path
          can carry current, but the transistor is not yet driven as strongly as
          possible.
        </p>

        <p>
          In this state, collector current is still being limited mainly by the
          available base drive.
        </p>

        <p>
          This is a useful middle state because it shows that the transistor is
          not only OFF or fully ON.
        </p>
      </SectionCard>

      <SectionCard title="What is saturation in this lesson?" eyebrow="Strong Switching">
        <p>
          Saturation is the strong switching condition for the NPN transistor.
        </p>

        <p>
          In this state, base drive is high enough to force the transistor close
          to closed-switch behavior for the collector-emitter path.
        </p>

        <p>
          That allows the LED branch to conduct strongly, making the LED turn on
          properly.
        </p>
      </SectionCard>

      <SectionCard title="Why do load resistance and supply matter?" eyebrow="Load Demand">
        <p>
          The collector path does not depend only on the transistor. It also
          depends on the supply voltage and the load path resistance.
        </p>

        <p>
          Even with a good transistor drive condition, the load branch still has
          its own current limit based on the circuit values.
        </p>

        <p>
          That is why switching behavior must be understood as a full circuit
          relationship, not a transistor-only event.
        </p>
      </SectionCard>

      <SectionCard title="Why are pull-down and fault cases included?" eyebrow="Troubleshooting Logic">
        <p>
          Real circuits do not fail in only one way.
        </p>

        <p>
          A base resistor path can open, a pull-down can be missing, the LED can
          be reversed, the collector path can open, or supply voltage can become
          too low.
        </p>

        <p>
          These fault examples help learners understand that a wrong result may
          come from control-path failure, load-path failure, or poor operating
          conditions.
        </p>
      </SectionCard>

      <SectionCard title="What is the main working rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to follow one chain of
          cause and effect.
        </p>

        <p>
          Base drive decides transistor mode, transistor mode decides
          collector-emitter conduction, and collector-emitter conduction decides
          whether the LED branch works.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an NPN transistor works like a controlled switch,
          but whether it reaches proper switching depends on both the base path
          and the load path.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>An NPN transistor uses base drive to control collector current.</li>
          <li>Open switch means cutoff and LED OFF.</li>
          <li>Closing the switch allows base current to begin transistor action.</li>
          <li>Base resistance strongly affects the transistor mode.</li>
          <li>Active region means conduction without full saturation.</li>
          <li>Saturation is the strong ON switching state.</li>
          <li>Faults can block proper operation even when part of the circuit looks normal.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
