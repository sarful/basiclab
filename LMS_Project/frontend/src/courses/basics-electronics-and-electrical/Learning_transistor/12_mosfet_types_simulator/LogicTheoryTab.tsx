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
      question: "Why is this simulator useful after separate MOSFET lessons?",
      answer:
        "Because it places enhancement and depletion devices, plus N-channel and P-channel behavior, into one comparison space so the learner can see their differences together.",
    },
    {
      question: "What is the simplest contrast between enhancement and depletion MOSFETs?",
      answer:
        "Enhancement MOSFETs begin normally off and need gate action to form a channel, while depletion MOSFETs begin with an existing channel and are normally on.",
    },
    {
      question: "What is the main contrast between N-channel and P-channel devices?",
      answer:
        "Their required gate polarity is opposite, and their dominant carriers are different, with electrons in N-channel and holes in P-channel devices.",
    },
    {
      question: "Why does threshold matter in the comparison?",
      answer:
        "Threshold helps explain when enhancement devices begin useful channel formation, while depletion devices are better understood with a cutoff-style boundary for turn-off behavior.",
    },
    {
      question: "Why does the simulator compare two MOSFETs side by side?",
      answer:
        "Because learners can keep the same drain voltage, load, and gate setting while observing how different MOSFET families respond under the same conditions.",
    },
    {
      question: "Why are load type and drain voltage still important in a theory lesson?",
      answer:
        "Because MOSFET behavior is never only about gate theory; the external circuit still determines current, power, visible output, and operating region.",
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
              MOSFET Types Comparison
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson brings multiple MOSFET families into one comparison
              view so learners can understand how enhancement, depletion,
              N-channel, and P-channel devices differ under the same conditions.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Instead of learning each device in isolation, the simulator shows
              how channel type, gate polarity, threshold behavior, and load
              response change from one MOSFET family to another.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes lesson 12 a summary-and-contrast lesson that ties
              together the MOSFET topics learned earlier.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Goal" value="Compare Families" tone="emerald" />
            <ValueCard label="Big Contrast" value="Enhancement vs Depletion" tone="violet" />
            <ValueCard label="Side-by-Side Focus" value="N vs P Channel" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why compare MOSFET types in one lesson?" eyebrow="Big Picture">
        <p>
          Earlier lessons explain specific MOSFET ideas one at a time, but real
          understanding becomes stronger when those ideas are placed side by
          side.
        </p>

        <p>
          This simulator helps learners compare how different MOSFET families
          respond when the gate voltage, drain voltage, and load are changed
          together.
        </p>

        <p>
          That comparison approach turns separate facts into a connected mental
          model.
        </p>
      </SectionCard>

      <SectionCard title="Enhancement and depletion MOSFETs start differently" eyebrow="Starting State">
        <p>
          Enhancement MOSFETs begin from a normally off condition and require
          enough gate voltage to create a useful conduction channel.
        </p>

        <p>
          Depletion MOSFETs begin with an existing channel, so they start
          normally on and can be weakened toward cutoff by the gate.
        </p>

        <p>
          This starting-state difference is one of the most important ideas in
          the whole MOSFET topic.
        </p>
      </SectionCard>

      <SectionCard title="What changes between N-channel and P-channel?" eyebrow="Polarity Rule">
        <p>
          N-channel and P-channel MOSFETs are not simply mirror labels; they
          require opposite gate polarity behavior and rely on different dominant
          carriers.
        </p>

        <p>
          N-channel devices are associated mainly with electrons, while
          P-channel devices are associated mainly with holes.
        </p>

        <p>
          That is why a gate setting that helps one type may oppose useful
          operation in another type.
        </p>
      </SectionCard>

      <SectionCard title="Why is side-by-side viewing so important?" eyebrow="Same Conditions">
        <p>
          The strongest comparison happens when two MOSFETs are observed under
          the same operating conditions.
        </p>

        <p>
          If gate voltage, drain voltage, and load remain shared, the learner
          can focus on how device type alone changes channel strength, region,
          and current behavior.
        </p>

        <p>
          This removes confusion and makes the theory much easier to trust.
        </p>
      </SectionCard>

      <SectionCard title="How do threshold and cutoff ideas fit together?" eyebrow="Operating Boundaries">
        <p>
          Enhancement MOSFET theory depends strongly on threshold voltage
          because that marks the beginning of useful channel formation.
        </p>

        <p>
          Depletion MOSFET theory is easier to read through a cutoff-style
          boundary, where gate action weakens the existing channel until useful
          current disappears.
        </p>

        <p>
          Putting both ideas in one lesson helps learners avoid treating all
          MOSFET families as if they turn on and off in exactly the same way.
        </p>
      </SectionCard>

      <SectionCard title="Why are region names still important?" eyebrow="OFF to Saturation">
        <p>
          The simulator does not only compare ON and OFF states; it also shows
          regions such as threshold, weak channel, linear operation, cutoff, or
          saturation.
        </p>

        <p>
          These names matter because they describe how the MOSFET is operating,
          not just whether current exists.
        </p>

        <p>
          A learner who understands region changes can interpret device
          behavior much more accurately in later circuit lessons.
        </p>
      </SectionCard>

      <SectionCard title="Why do load type and drain voltage still matter?" eyebrow="Circuit Context">
        <p>
          A MOSFET never operates as a theory-only object; it always works as
          part of a circuit.
        </p>

        <p>
          That means drain voltage and load type still affect drain current,
          power, visible output, and the final operating region even when gate
          theory is the main lesson topic.
        </p>

        <p>
          This is why a comparison lab becomes more realistic than a single
          textbook definition.
        </p>
      </SectionCard>

      <SectionCard title="Why are carrier flow and conventional current both shown?" eyebrow="Two Viewpoints">
        <p>
          Many beginners become confused because carrier motion and conventional
          current direction are not always described the same way.
        </p>

        <p>
          Showing both viewpoints helps learners understand that the same device
          can be explained through physical carriers or standard circuit-current
          language.
        </p>

        <p>
          This is especially useful when comparing N-channel and P-channel
          families.
        </p>
      </SectionCard>

      <SectionCard title="What is the most practical beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The simplest way to understand lesson 12 is to compare three things
          in order: starting state, required gate polarity, and resulting
          channel strength.
        </p>

        <p>
          Once those three ideas are clear, current, region, and load behavior
          become much easier to predict.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: do not memorize MOSFET names as separate labels.
          Read each type through its start condition, gate rule, carrier type,
          and channel response under the same circuit conditions.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Lesson 12 is a comparison lesson that connects earlier MOSFET topics.</li>
          <li>Enhancement MOSFETs start normally off, while depletion MOSFETs start normally on.</li>
          <li>N-channel and P-channel devices require opposite gate-polarity behavior.</li>
          <li>Threshold is central for enhancement devices, while cutoff-style behavior is central for depletion devices.</li>
          <li>Side-by-side comparison under the same conditions reveals the real device differences.</li>
          <li>Load type and drain voltage still shape current, power, and visible operation.</li>
          <li>Region names explain how the device is operating, not only whether it is on.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
