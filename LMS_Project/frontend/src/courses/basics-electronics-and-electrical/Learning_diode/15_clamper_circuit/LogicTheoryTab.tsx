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
      question: "What is the main job of a clamper circuit?",
      answer:
        "A clamper shifts the entire waveform upward or downward without mainly changing its basic shape.",
    },
    {
      question: "Which main components are used in a clamper circuit?",
      answer:
        "A clamper circuit mainly uses a diode, a capacitor, and usually a resistor or load path.",
    },
    {
      question: "Does a clamper mainly clip the signal amplitude?",
      answer:
        "No. Clipping and clamping are different. A clamper shifts the DC level, while a clipper cuts part of the waveform.",
    },
    {
      question: "Why is capacitor charging important in a clamper circuit?",
      answer:
        "The stored capacitor voltage helps shift the waveform level during the next part of the cycle.",
    },
    {
      question: "What decides whether the clamp is positive or negative?",
      answer:
        "The diode orientation decides whether the waveform is shifted upward or downward.",
    },
    {
      question: "Why is RC timing important in clamper behavior?",
      answer:
        "The capacitor must hold enough charge between cycles, so the RC time constant affects how well the clamp is maintained.",
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
              Clamper Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A clamper circuit shifts the whole waveform upward or downward by
              adding a DC level to an AC signal.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key ideas are waveform shifting, capacitor charge storage,
              diode direction, and why clamping is different from clipping.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This circuit is important whenever we need to reposition a signal
              around a different reference level.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Signal Action" value="DC Shift" tone="violet" />
            <ValueCard label="Capacitor Role" value="Stores Charge" tone="emerald" />
            <ValueCard label="Diode Role" value="Sets Direction" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a clamper circuit?" eyebrow="Core Concept">
        <p>
          A clamper circuit is a wave-shaping circuit that shifts the entire
          waveform to a new DC level.
        </p>

        <p>
          The important point is that the waveform is moved up or down rather
          than mainly being cut off.
        </p>

        <p>
          This is why a clamper is often called a DC restorer or level shifter
          in basic electronics discussions.
        </p>

        <p>
          <strong>
            Checkpoint Question: If a circuit moves a waveform to a new level
            without mainly chopping its peaks, is it acting more like a clamper
            or a clipper?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Which components make clamping work?" eyebrow="Main Parts">
        <p>
          A basic clamper circuit usually contains a diode, a capacitor, and a
          resistor or load path.
        </p>

        <p>
          The diode controls when the capacitor charges, and the capacitor then
          holds a voltage that shifts the waveform.
        </p>

        <p>
          The resistor or load path gives the circuit a discharge path and helps
          determine how long the stored voltage is maintained.
        </p>
      </SectionCard>

      <SectionCard title="How does the capacitor help?" eyebrow="Charge Storage">
        <p>
          During one part of the input cycle, the diode becomes forward biased
          and allows the capacitor to charge.
        </p>

        <p>
          During the opposite part of the cycle, the diode becomes reverse
          biased, so the capacitor tends to hold its stored voltage.
        </p>

        <p>
          That stored voltage effectively adds or subtracts a DC shift from the
          input waveform.
        </p>
      </SectionCard>

      <SectionCard title="What decides positive or negative clamping?" eyebrow="Diode Direction">
        <p>
          The orientation of the diode decides whether the waveform is shifted
          upward or downward.
        </p>

        <p>
          If the diode orientation changes, the charging direction of the
          capacitor also changes, and the clamp direction changes with it.
        </p>

        <p>
          So diode direction is one of the most important design choices in a
          clamper circuit.
        </p>
      </SectionCard>

      <SectionCard title="How is a clamper different from a clipper?" eyebrow="Compare the Ideas">
        <p>
          A clipper removes or limits part of the waveform beyond a certain
          level.
        </p>

        <p>
          A clamper does something different: it shifts the whole waveform
          upward or downward by changing its DC reference level.
        </p>

        <p>
          Both use diodes, but their goals are not the same.
        </p>
      </SectionCard>

      <SectionCard title="Why does RC timing matter?" eyebrow="Time Constant">
        <p>
          For a clamper to work well, the capacitor must keep enough charge
          between cycles.
        </p>

        <p>
          That means the RC time constant should usually be large compared with
          the signal period.
        </p>

        <p>
          If the capacitor discharges too quickly, the clamping effect becomes
          weak and unstable.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a clamper is to think in three steps.
        </p>

        <p>
          First, the diode charges the capacitor during one part of the cycle.
        </p>

        <p>
          Second, the capacitor stores that charge. Third, the stored voltage
          shifts the next part of the waveform to a new level.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          Suppose a signal needs to be moved so that its lowest point sits near
          ground instead of swinging equally above and below zero.
        </p>

        <p>
          A clamper can reposition that waveform without mainly changing the
          signal shape itself.
        </p>

        <p>
          That is why clamper circuits are useful in signal conditioning and
          waveform level shifting.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A clamper shifts the whole waveform up or down.</li>
          <li>It mainly changes the DC level, not just the amplitude limits.</li>
          <li>The circuit usually uses a diode, capacitor, and resistor path.</li>
          <li>The capacitor stores charge that helps create the level shift.</li>
          <li>The diode orientation decides positive or negative clamping.</li>
          <li>A clamper is different from a clipper.</li>
          <li>RC timing affects how well the clamp is maintained.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
