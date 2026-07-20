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
      question: "What makes the PNP transistor turn on in this lesson?",
      answer:
        "The PNP transistor turns on when the base is pulled low enough relative to the emitter so the emitter-base junction becomes forward-driven.",
    },
    {
      question: "Why does the transistor stay off when the switch is open?",
      answer:
        "Because the pull-up path keeps the base close to the emitter voltage, so VEB is not high enough to start conduction.",
    },
    {
      question: "What is the main difference between this PNP lesson and the NPN lesson?",
      answer:
        "This lesson uses high-side PNP control, so the switching logic is reversed: pulling the base downward turns the transistor on.",
    },
    {
      question: "What is the active region here?",
      answer:
        "The transistor is on and carrying load current, but the base drive is still not strong enough for full saturation.",
    },
    {
      question: "What is saturation in this simulation?",
      answer:
        "Saturation is the strong ON state where the PNP transistor is fully supplying current to the LED load path.",
    },
    {
      question: "Why is the pull-up resistor important?",
      answer:
        "It helps keep the base near the emitter when the switch is open, preventing accidental turn-on and keeping the transistor off.",
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
              PNP Transistor Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a PNP transistor works as a high-side
              switching device in a simple LED load circuit.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main ideas are emitter-referenced base control, collector
              load current, and the transition between cutoff, active, and
              saturation states.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is especially useful because it helps learners compare
              PNP working logic against the opposite switching style of NPN.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="PNP" tone="emerald" />
            <ValueCard label="Switch Style" value="High Side" tone="violet" />
            <ValueCard label="Base Action" value="Pull Low" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is this PNP lesson teaching?" eyebrow="Core Concept">
        <p>
          This lesson teaches how a PNP transistor controls a load from the
          supply side rather than the ground side.
        </p>

        <p>
          That means the transistor is acting as a high-side switch, which is a
          very important practical contrast with an NPN low-side switch.
        </p>

        <p>
          The lesson helps the learner see that transistor working logic changes
          when the device type changes.
        </p>
      </SectionCard>

      <SectionCard title="Why does the emitter sit at the supply side?" eyebrow="High-Side Setup">
        <p>
          In this lesson, the emitter is connected to the positive supply side.
        </p>

        <p>
          That is why the PNP transistor is treated as a high-side device in the
          simulation.
        </p>

        <p>
          The load current is supplied from the emitter side, through the
          transistor, and into the LED branch.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the switch is open?" eyebrow="Cutoff State">
        <p>
          When the switch is open, the pull-up path keeps the base close to the
          emitter voltage.
        </p>

        <p>
          In that condition, the emitter-base difference is not large enough to
          turn the PNP transistor on.
        </p>

        <p>
          So the transistor remains in cutoff and the LED load stays off.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the switch is closed?" eyebrow="Base Pulled Low">
        <p>
          Closing the switch pulls the base downward through the base resistor
          path.
        </p>

        <p>
          This increases the emitter-to-base drive condition needed to turn the
          PNP transistor on.
        </p>

        <p>
          In simple terms, pulling the base low is what starts transistor
          conduction in this lesson.
        </p>
      </SectionCard>

      <SectionCard title="Why is the pull-up resistor important?" eyebrow="Stable OFF Logic">
        <p>
          The pull-up resistor helps hold the base near the emitter when the
          control switch is not active.
        </p>

        <p>
          This prevents accidental turn-on and gives the circuit a predictable
          OFF condition.
        </p>

        <p>
          So the pull-up resistor is part of the control logic, not just an
          extra part.
        </p>
      </SectionCard>

      <SectionCard title="What is the active region here?" eyebrow="Partial Conduction">
        <p>
          In the active region, the PNP transistor is on and carrying load
          current, but base drive is still limiting how strongly it conducts.
        </p>

        <p>
          The LED branch can work in this state, but the transistor is not yet
          acting like the strongest possible switch.
        </p>

        <p>
          This shows the learner that transistor switching has a middle zone,
          not only OFF and fully ON states.
        </p>
      </SectionCard>

      <SectionCard title="What is saturation in this lesson?" eyebrow="Strong ON State">
        <p>
          Saturation is the strong ON state of the PNP transistor in this
          circuit.
        </p>

        <p>
          In saturation, the base drive is strong enough that the transistor can
          fully supply the LED load path as intended.
        </p>

        <p>
          This is the switching goal when the circuit is meant to behave like a
          reliable ON switch.
        </p>
      </SectionCard>

      <SectionCard title="How is this different from NPN switching?" eyebrow="Opposite Logic">
        <p>
          The NPN lesson teaches a low-side switching idea, where base drive
          turns on a path toward the lower side of the circuit.
        </p>

        <p>
          This PNP lesson reverses that logic by showing a high-side transistor
          that turns on when the base is pulled lower than the emitter.
        </p>

        <p>
          That contrast is one of the most important learning points in this
          topic.
        </p>
      </SectionCard>

      <SectionCard title="What is the main working rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to follow one reversed
          control chain.
        </p>

        <p>
          Base pulled up keeps the transistor off, base pulled down turns it on,
          and stronger base drive pushes it toward saturation.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a PNP transistor is easiest to understand when you
          remember that its switching logic is opposite in feel to a simple NPN
          example, especially in a high-side circuit.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A PNP transistor in this lesson works as a high-side switch.</li>
          <li>The emitter is tied near the positive supply side.</li>
          <li>Open switch keeps the base near the emitter and the transistor OFF.</li>
          <li>Closing the switch pulls the base lower and turns the transistor ON.</li>
          <li>The pull-up resistor helps create a stable OFF condition.</li>
          <li>Active region means partial conduction before full saturation.</li>
          <li>Saturation is the strong ON state for the LED load path.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
