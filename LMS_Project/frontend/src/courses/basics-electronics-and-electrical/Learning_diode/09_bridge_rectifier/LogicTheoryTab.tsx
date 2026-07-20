"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { FIXED_FREQUENCY_HZ, getBridgeRectifierState } from "./logic";

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
  const sample = getBridgeRectifierState(10, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a bridge rectifier?",
      answer:
        "A bridge rectifier is a four-diode full-wave rectifier that converts both AC half-cycles into the same output polarity.",
    },
    {
      question: "Why is it called a bridge?",
      answer:
        "Because the four diodes are arranged in a bridge-like network around the load.",
    },
    {
      question: "Which diode pair conducts in each half-cycle?",
      answer:
        "One pair conducts in one half-cycle and the opposite pair conducts in the next half-cycle, such as D1D4 and D2D3 in this lesson model.",
    },
    {
      question: "Why is the output full-wave?",
      answer:
        "Because both AC half-cycles are redirected so the load always sees the same output polarity.",
    },
    {
      question: "Why is the voltage drop larger than a single-diode rectifier?",
      answer:
        "Because current passes through two conducting diodes in each bridge conduction path.",
    },
    {
      question: "Why is a bridge rectifier popular in practice?",
      answer:
        "Because it gives full-wave rectification without needing a center-tapped transformer.",
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
              Bridge Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A bridge rectifier converts AC into pulsating DC by using four
              diodes so both half-cycles produce the same output polarity.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on bridge conduction pairs, full-wave output,
              two-diode voltage drop, load effect, and why diode type still
              changes the result.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is one of the most common rectifier topologies in practical AC
              to DC conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a bridge rectifier?" eyebrow="Core Concept">
        <p>
          A bridge rectifier is a full-wave rectifier built from four diodes.
        </p>

        <p>
          Its purpose is to make both halves of the AC waveform contribute to an
          output with the same polarity across the load.
        </p>

        <p>
          This gives a fuller rectified output than a half-wave rectifier.
        </p>
      </SectionCard>

      <SectionCard title="Why is it called a bridge?" eyebrow="Diode Network">
        <p>
          The four diodes are arranged in a bridge-shaped path around the load.
        </p>

        <p>
          This arrangement lets the current path change automatically when the
          AC polarity changes.
        </p>

        <p>
          Even though different diodes conduct in different half-cycles, the
          load still sees the same output polarity.
        </p>
      </SectionCard>

      <SectionCard title="How do the diode pairs work?" eyebrow="Alternating Paths">
        <p>
          In one half-cycle, one diode pair conducts. In the next half-cycle,
          the opposite pair conducts.
        </p>

        <p>
          In this lesson model, the two main conduction paths are{" "}
          <strong>D1D4</strong> and <strong>D2D3</strong>.
        </p>

        <p>
          That alternating-pair action is what allows full-wave rectification
          without changing the load polarity.
        </p>

        <p>
          <strong>
            Checkpoint Question: If two different diode pairs work in alternate
          half-cycles but the load polarity stays the same, what rectifier
          advantage does that create?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is the output full-wave?" eyebrow="Waveform Use">
        <p>
          The bridge uses both positive and negative halves of the AC input.
        </p>

        <p>
          Instead of discarding one half-cycle, it redirects both halves so they
          help produce output on the same polarity side.
        </p>

        <p>
          This improves average output compared with half-wave rectification.
        </p>
      </SectionCard>

      <SectionCard title="Why is there more voltage loss?" eyebrow="Two-Diode Drop">
        <p>
          In a bridge rectifier, current passes through two conducting diodes in
          each active path.
        </p>

        <p>
          That means the voltage loss is larger than in a single-diode path,
          because each conducting diode contributes its forward drop.
        </p>

        <p>
          This is one of the main tradeoffs of the bridge topology.
        </p>
      </SectionCard>

      <SectionCard title="Why compare standard, fast, and Schottky diodes?" eyebrow="Diode Selection">
        <p>
          Different diode types have different forward drop, leakage, and
          switching behavior.
        </p>

        <p>
          A Schottky diode may increase output somewhat because its forward drop
          is lower, even though the current still passes through two diodes in
          the bridge path.
        </p>

        <p>
          So the final bridge output depends not only on topology, but also on
          the selected diode family.
        </p>
      </SectionCard>

      <SectionCard title="Why does load resistance matter?" eyebrow="Load Effect">
        <p>
          Load resistance determines how much current flows through the bridge
          when a diode pair is conducting.
        </p>

        <p>
          Lower resistance increases current, which can raise stress, heating,
          and LED risk in this lesson model.
        </p>

        <p>
          Higher resistance reduces current and usually gives gentler operating
          conditions.
        </p>
      </SectionCard>

      <SectionCard title="Why is the bridge so useful in practice?" eyebrow="Practical Advantage">
        <p>
          One major benefit of the bridge rectifier is that it gives full-wave
          rectification without needing a center-tapped transformer.
        </p>

        <p>
          That makes it convenient and widely used in many power-supply
          front-end designs.
        </p>

        <p>
          It is a very common practical choice when efficient use of both
          half-cycles is needed.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a bridge rectifier is to think in terms
          of two alternating diode pairs.
        </p>

        <p>
          One pair carries current in one half-cycle, and the other pair carries
          current in the next half-cycle.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a bridge rectifier gets full-wave output from both
          AC half-cycles, but each active path includes two diode drops.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          Many basic DC power supplies begin with a bridge rectifier at the AC
          input stage.
        </p>

        <p>
          It provides a straightforward way to turn both halves of AC into a
          single-polarity pulsating DC output.
        </p>

        <p>
          That is why the bridge rectifier is one of the most widely taught and
          widely used rectifier circuits.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A bridge rectifier uses four diodes.</li>
          <li>Two different diode pairs conduct in alternate half-cycles.</li>
          <li>Both AC half-cycles contribute to the output.</li>
          <li>The load sees one output polarity even though the active path changes.</li>
          <li>Each bridge conduction path includes two diode drops.</li>
          <li>Load resistance affects current, stress, and heating.</li>
          <li>The bridge is popular because it gives full-wave rectification without a center tap.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
