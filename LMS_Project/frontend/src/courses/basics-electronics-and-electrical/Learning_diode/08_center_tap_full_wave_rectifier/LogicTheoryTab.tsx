"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { FIXED_FREQUENCY_HZ, getFullWaveState } from "./logic";

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
  const sample = getFullWaveState(10, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a center-tap full-wave rectifier?",
      answer:
        "It is a rectifier circuit that uses a center-tapped transformer and two diodes so both AC half-cycles can produce output in the same load direction.",
    },
    {
      question: "Why is it called full-wave?",
      answer:
        "Because both halves of the AC waveform are used to produce rectified output.",
    },
    {
      question: "How do D1 and D2 work in this circuit?",
      answer:
        "D1 conducts in one half-cycle and D2 conducts in the other half-cycle, so the load still sees the same output polarity.",
    },
    {
      question: "Why is the output better than a half-wave rectifier?",
      answer:
        "Because the circuit uses both half-cycles, giving a higher average output and less gap between pulses.",
    },
    {
      question: "Why does diode forward drop still matter here?",
      answer:
        "Because each conducting path still loses voltage across the active diode during conduction.",
    },
    {
      question: "Why do load resistance and current stress matter?",
      answer:
        "They affect current level, LED stress, heating, and whether the circuit stays within safe operating conditions.",
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
              Center-Tap Full-Wave Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A center-tap full-wave rectifier converts AC into pulsating DC by
              using both half-cycles of the waveform.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on alternating diode conduction, center-tap
              action, full-wave output, load effect, and why diode type still
              changes the result.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is a major step forward from half-wave rectification because it
              uses the AC source more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a center-tap full-wave rectifier?" eyebrow="Core Concept">
        <p>
          A center-tap full-wave rectifier is a circuit that uses a
          center-tapped transformer secondary and two diodes.
        </p>

        <p>
          Its main goal is to make both AC half-cycles contribute to the output
          in the same load direction.
        </p>

        <p>
          Because both halves are used, the output is fuller than in a
          half-wave rectifier.
        </p>
      </SectionCard>

      <SectionCard title="How do the two diodes work?" eyebrow="Alternating Conduction">
        <p>
          During one half-cycle, diode <strong>D1</strong> becomes forward
          biased and conducts.
        </p>

        <p>
          During the opposite half-cycle, diode <strong>D2</strong> becomes
          forward biased and conducts instead.
        </p>

        <p>
          Even though the active diode changes, the load still sees the same
          output polarity.
        </p>

        <p>
          <strong>
            Checkpoint Question: If D1 works in one half-cycle and D2 works in
            the other, why does the load still see one output polarity?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it called full-wave?" eyebrow="Waveform Use">
        <p>
          It is called full-wave because both halves of the AC waveform are used
          to generate output.
        </p>

        <p>
          In contrast, a half-wave rectifier throws away one half-cycle from the
          output path.
        </p>

        <p>
          This makes the center-tap full-wave rectifier more effective in basic
          AC-to-DC conversion.
        </p>
      </SectionCard>

      <SectionCard title="Why is the output better than half-wave?" eyebrow="Output Quality">
        <p>
          Because both half-cycles are used, the pulses arrive more often at the
          output.
        </p>

        <p>
          That increases the average output and reduces the empty gap between
          pulses compared with half-wave rectification.
        </p>

        <p>
          In this sample, the average output is about{" "}
          <strong>{sample.avg.toFixed(2)} V</strong>, and the conduction portion
          is about <strong>{sample.conductionPercent.toFixed(0)} %</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Why does diode forward drop still matter?" eyebrow="Voltage Loss">
        <p>
          Even in a full-wave rectifier, the conducting diode still drops some
          voltage.
        </p>

        <p>
          That means the load does not receive the full ideal input amplitude.
        </p>

        <p>
          This is one reason why different diode types can produce different
          output performance in the same rectifier design.
        </p>
      </SectionCard>

      <SectionCard title="Why compare standard, fast, and Schottky diodes?" eyebrow="Diode Selection">
        <p>
          Different diode types have different forward drop, leakage, and
          reverse-recovery behavior.
        </p>

        <p>
          A Schottky diode may provide a somewhat higher average output because
          its forward drop is lower. Fast-recovery types can matter more when
          switching behavior is important.
        </p>

        <p>
          So the rectifier result depends not only on the circuit structure, but
          also on the chosen diode family.
        </p>
      </SectionCard>

      <SectionCard title="Why does load resistance matter?" eyebrow="Load Effect">
        <p>
          Load resistance controls how much current flows when either diode is
          conducting.
        </p>

        <p>
          Lower resistance causes higher current, which can increase stress,
          heating, and LED risk in this lesson model.
        </p>

        <p>
          Higher resistance reduces current and usually makes the operating
          condition gentler for the diode and load.
        </p>
      </SectionCard>

      <SectionCard title="What is the role of the center tap?" eyebrow="Transformer Reference">
        <p>
          The center tap provides a reference point between the two transformer
          halves.
        </p>

        <p>
          Because of that midpoint, one diode can use one half of the secondary
          while the other diode uses the opposite half during the alternate
          half-cycle.
        </p>

        <p>
          This is what makes the two-diode full-wave action possible in this
          topology.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a center-tap full-wave rectifier is to
          think of it as two half-wave paths that take turns.
        </p>

        <p>
          One diode works during one half-cycle, and the other diode works
          during the next half-cycle.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a center-tap full-wave rectifier gives pulsating
          DC from both AC half-cycles, which improves average output compared
          with a half-wave rectifier.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In basic power-supply teaching circuits, a center-tap full-wave
          rectifier is often used to show how both halves of AC can be used more
          efficiently.
        </p>

        <p>
          It is not the only full-wave method, but it is an important classic
          topology for learning rectification.
        </p>

        <p>
          This makes it a strong bridge between the simple half-wave rectifier
          and more advanced rectifier systems.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A center-tap full-wave rectifier uses two diodes and a center-tapped transformer.</li>
          <li>D1 and D2 conduct in alternate half-cycles.</li>
          <li>Both halves of the AC waveform contribute to the output.</li>
          <li>The output is fuller than in a half-wave rectifier.</li>
          <li>Diode forward drop still reduces the available output.</li>
          <li>Load resistance affects current, stress, and heat.</li>
          <li>Different diode types still change the final behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
