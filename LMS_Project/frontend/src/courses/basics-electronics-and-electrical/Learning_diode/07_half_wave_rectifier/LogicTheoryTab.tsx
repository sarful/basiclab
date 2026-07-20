"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { FIXED_FREQUENCY_HZ, getHalfWaveState } from "./logic";

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
  const sample = getHalfWaveState(10, FIXED_FREQUENCY_HZ, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a half-wave rectifier?",
      answer:
        "A half-wave rectifier uses a diode to pass one half of the AC waveform and block the other half.",
    },
    {
      question: "Why is the output not a smooth DC voltage?",
      answer:
        "Because only one half-cycle is passed, so the output is a pulsating DC waveform.",
    },
    {
      question: "What happens during the blocked half-cycle?",
      answer:
        "The diode blocks the main current path, so the output voltage drops near zero in the basic half-wave case.",
    },
    {
      question: "Why does diode forward drop matter in a rectifier?",
      answer:
        "The forward drop reduces the available output voltage during conduction.",
    },
    {
      question: "Why might a Schottky diode produce a higher average output here?",
      answer:
        "Because its forward voltage drop is lower, so less voltage is lost in conduction.",
    },
    {
      question: "Why are load resistance and current stress important?",
      answer:
        "They affect current level, heating, LED stress, and whether the circuit stays within safe operating conditions.",
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
              Half-Wave Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A half-wave rectifier converts AC into pulsating DC by allowing
              only one half of the waveform to reach the load.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on diode conduction, blocked half-cycles,
              average output, load effect, diode drop, and why different diode
              types change the result.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is one of the simplest and most important applications of a
              diode in AC-to-DC conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a half-wave rectifier?" eyebrow="Core Concept">
        <p>
          A half-wave rectifier is a circuit that uses a diode to allow only one
          half of an AC waveform to pass to the load.
        </p>

        <p>
          During the allowed half-cycle, the diode conducts. During the opposite
          half-cycle, it blocks the main current path.
        </p>

        <p>
          The result is not steady DC, but pulsating DC.
        </p>
      </SectionCard>

      <SectionCard title="How does rectification happen?" eyebrow="Working Principle">
        <p>
          When the input AC polarity forward-biases the diode, current flows
          through the load and an output voltage appears.
        </p>

        <p>
          When the AC polarity reverses, the diode becomes reverse-biased and
          blocks the main current path.
        </p>

        <p>
          This is why only one half of the AC waveform appears at the output.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the diode blocks one half-cycle and passes
            the other, what kind of rectifier behavior is that?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is the output pulsating DC?" eyebrow="Waveform Shape">
        <p>
          The output is called pulsating DC because it stays on one polarity
          side, but it is not constant.
        </p>

        <p>
          The waveform rises when the diode conducts and falls back near zero
          during the blocked half-cycle.
        </p>

        <p>
          In this sample, the average output is about{" "}
          <strong>{sample.avg.toFixed(2)} V</strong>, which is much smaller than
          a full smooth DC supply.
        </p>
      </SectionCard>

      <SectionCard title="Why does diode forward drop matter?" eyebrow="Voltage Loss">
        <p>
          A real diode does not pass the full input voltage to the load.
        </p>

        <p>
          Some voltage is lost across the diode during conduction because of its
          forward drop.
        </p>

        <p>
          This is one reason different diode types can produce different output
          results in the same rectifier circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why compare standard, fast, and Schottky diodes?" eyebrow="Diode Selection">
        <p>
          Different diode types have different forward drop, leakage, and
          reverse-recovery behavior.
        </p>

        <p>
          A Schottky diode usually gives lower forward drop, so the output can
          be a bit higher. A fast-recovery diode can be useful when switching
          behavior matters more.
        </p>

        <p>
          So the rectifier result is influenced not only by the circuit idea,
          but also by the chosen diode family.
        </p>
      </SectionCard>

      <SectionCard title="Why does load resistance matter?" eyebrow="Load Effect">
        <p>
          Load resistance controls how much current the circuit draws during
          conduction.
        </p>

        <p>
          Lower resistance increases current, which can raise stress, heat, and
          LED risk in this lesson model.
        </p>

        <p>
          Higher resistance reduces current and usually makes the circuit less
          stressful for the diode and load.
        </p>
      </SectionCard>

      <SectionCard title="Why are reverse recovery and leakage mentioned?" eyebrow="Real Diode Behavior">
        <p>
          Real rectifier behavior is not perfectly ideal, especially when diode
          switching is considered.
        </p>

        <p>
          Reverse recovery describes how some diodes briefly take time to stop
          conducting after the polarity changes.
        </p>

        <p>
          Leakage describes the tiny reverse current that can still exist during
          blocking.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a half-wave rectifier is to think in two
          repeating states.
        </p>

        <p>
          One state is conduction, where the diode passes one half-cycle. The
          other state is blocking, where the opposite half-cycle is rejected.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a half-wave rectifier converts AC to pulsating DC
          by selective one-way conduction, not by creating a smooth output on
          its own.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          A simple low-cost rectifier stage can use one diode to demonstrate the
          basic idea of AC-to-DC conversion.
        </p>

        <p>
          Although it is not as efficient or smooth as more advanced rectifiers,
          it clearly shows how diode direction controls the output waveform.
        </p>

        <p>
          That is why half-wave rectifier circuits are so important in learning
          electronics fundamentals.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A half-wave rectifier passes only one half of the AC waveform.</li>
          <li>The output is pulsating DC, not smooth DC.</li>
          <li>The diode conducts in one half-cycle and blocks the other.</li>
          <li>Forward voltage drop reduces the output during conduction.</li>
          <li>Different diode types change efficiency and switching behavior.</li>
          <li>Load resistance affects current, stress, and heat.</li>
          <li>Reverse recovery and leakage matter in real diode behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
