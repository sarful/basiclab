"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeVariableCapacitorSnapshot,
  formatCapacitance,
  formatFrequency,
  formatNumber,
} from "./logic";

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
  const rotation = 90;
  const minCapacitance = 20;
  const maxCapacitance = 320;
  const inductanceUh = 220;
  const plateCount = 6;

  const sample = computeVariableCapacitorSnapshot({
    rotation,
    minCapacitance,
    maxCapacitance,
    inductanceUh,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the main purpose of a variable capacitor?",
      answer:
        "Its main purpose is to change capacitance so a circuit can be tuned to different frequencies.",
    },
    {
      question: "How is capacitance changed in a variable capacitor?",
      answer:
        "Capacitance changes by changing the overlap between movable and fixed plates.",
    },
    {
      question: "What happens to tuning frequency when capacitance increases in an LC circuit?",
      answer:
        "The resonant frequency decreases when capacitance increases.",
    },
    {
      question: "Why is a variable capacitor useful in radio tuning?",
      answer:
        "It lets the resonant frequency shift so the circuit can select different stations or signal bands.",
    },
    {
      question: "What does plate overlap represent in this lesson?",
      answer:
        "It represents how much of the capacitor plates face each other, which directly affects capacitance.",
    },
    {
      question: "Why does inductance matter in the tuning formula?",
      answer:
        "Because the tuned frequency depends on both inductance and capacitance in the LC circuit.",
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
              Variable Capacitor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A variable capacitor is a capacitor whose capacitance can be
              adjusted, usually by rotating movable plates relative to fixed
              plates.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the main ideas are plate overlap, capacitance
              range, tuning control, and how capacitance changes the resonant
              frequency of an LC circuit.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This is one of the classic components used in tuners, radios, and
              frequency-selective circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(sample.capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Overlap"
              value={`${formatNumber(sample.overlapRatio * 100, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="Tuned Frequency"
              value={formatFrequency(sample.frequency)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is a variable capacitor?" eyebrow="Core Concept">
        <p>
          A variable capacitor is designed so its capacitance does not stay
          fixed. Instead, it can be adjusted over a range.
        </p>

        <p>
          In many designs, this happens by rotating one set of plates so the
          overlap with another set changes.
        </p>

        <p>
          More overlap means more effective plate area facing each other, which
          increases capacitance.
        </p>

        <p>
          <strong>
            Checkpoint Question: If plate overlap increases, does capacitance go
            up or down?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is plate overlap important?" eyebrow="Mechanical Tuning">
        <p>
          Plate overlap is the direct physical control that changes the
          capacitor value in this lesson.
        </p>

        <p>
          In this sample, the rotation is <strong>{rotation} degrees</strong>,
          which gives an overlap of about{" "}
          <strong>{formatNumber(sample.overlapRatio * 100, 0)} %</strong>.
        </p>

        <p>
          That overlap produces a capacitance of about{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong> within the
          selected tuning range.
        </p>
      </SectionCard>

      <SectionCard title="What is the capacitance range?" eyebrow="Range Control">
        <p>
          A variable capacitor usually works between a minimum and maximum
          capacitance value instead of a single fixed value.
        </p>

        <p>
          In this example, the range is from{" "}
          <strong>{formatCapacitance(minCapacitance)}</strong> to{" "}
          <strong>{formatCapacitance(maxCapacitance)}</strong>.
        </p>

        <p>
          This adjustable range is what makes tuning possible across different
          frequencies.
        </p>
      </SectionCard>

      <SectionCard title="How does tuning frequency change?" eyebrow="LC Resonance">
        <p>
          A variable capacitor is often used with an inductor to form an LC
          tuning circuit.
        </p>

        <p>
          In this lesson, the inductance is{" "}
          <strong>{formatNumber(inductanceUh, 0)} uH</strong>, and the tuned
          frequency becomes about <strong>{formatFrequency(sample.frequency)}</strong>.
        </p>

        <p>
          The important rule is that when capacitance increases, resonant
          frequency decreases. When capacitance decreases, resonant frequency
          increases.
        </p>
      </SectionCard>

      <SectionCard title="Why does plate count matter?" eyebrow="Construction Detail">
        <p>
          Plate count affects how much total effective area can participate in
          the capacitor structure.
        </p>

        <p>
          In this sample, the lesson uses <strong>{plateCount} plates</strong>{" "}
          to illustrate the construction idea.
        </p>

        <p>
          More effective plate area can help produce a larger capacitance range
          in a compact mechanical design.
        </p>
      </SectionCard>

      <SectionCard title="Main formula to remember" eyebrow="Formula Sheet">
        <p>
          The key tuning idea comes from the LC resonance relationship:
          frequency depends on both <strong>L</strong> and <strong>C</strong>.
        </p>

        <p>
          You do not need to memorize every detail first. The main rule is:
          increasing <strong>C</strong> lowers the tuned frequency.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: rotating the capacitor changes overlap, overlap
          changes capacitance, and capacitance shifts the tuned frequency.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a traditional radio tuner, a variable capacitor lets the circuit
          move from one resonant frequency to another.
        </p>

        <p>
          That means the user can select different stations by changing the
          capacitance value mechanically.
        </p>

        <p>
          This is a clear example of how electrical tuning can be controlled by
          physical movement.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Variable capacitors have adjustable capacitance.</li>
          <li>Plate overlap is a major factor that changes capacitance.</li>
          <li>More overlap usually means higher capacitance.</li>
          <li>Variable capacitors work across a capacitance range.</li>
          <li>They are commonly used in LC tuning circuits.</li>
          <li>Increasing capacitance lowers the resonant frequency.</li>
          <li>They are useful in radios and frequency-selection circuits.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
