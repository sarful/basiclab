"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { DIODE_MODEL, getCharacteristicPoint } from "./logic";

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
  const forwardPoint = getCharacteristicPoint(3);
  const reversePoint = getCharacteristicPoint(-12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What does a diode characteristic curve show?",
      answer:
        "It shows the relationship between diode voltage and diode current.",
    },
    {
      question: "Why is the forward current very small below threshold?",
      answer:
        "Because the junction barrier is still resisting normal conduction until the forward voltage becomes high enough.",
    },
    {
      question: "What happens to current after the diode passes its forward threshold?",
      answer:
        "The current rises much more strongly as voltage continues increasing.",
    },
    {
      question: "What is seen in reverse bias on the characteristic curve?",
      answer:
        "The diode mostly blocks current, with only tiny reverse leakage during normal reverse operation.",
    },
    {
      question: "Why do different diode types have different curves?",
      answer:
        "Because different diode materials and structures produce different threshold voltages, leakage, and conduction behavior.",
    },
    {
      question: "Why is the V-I curve important in practice?",
      answer:
        "It helps engineers predict how a diode will behave in real circuits under different voltages and bias conditions.",
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
              Diode Characteristics
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Diode characteristics describe how current changes as voltage
              changes across the diode.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the main ideas are the V-I curve, forward
              threshold, reverse leakage, and why different diode types do not
              all behave exactly the same.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This is the lesson where the diode stops being just a one-way
              symbol and starts being a measurable real component.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Forward Threshold"
              value={`${DIODE_MODEL.thresholdVoltage.toFixed(1)} V`}
              tone="violet"
            />
            <ValueCard
              label="Forward Current"
              value={`${forwardPoint.currentMA.toFixed(1)} mA`}
              tone="emerald"
            />
            <ValueCard
              label="Reverse Current"
              value={`${reversePoint.currentMA.toFixed(3)} mA`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What are diode characteristics?" eyebrow="Core Concept">
        <p>
          Diode characteristics tell us how a real diode responds to applied
          voltage.
        </p>

        <p>
          Instead of only saying the diode is on or off, the characteristic
          curve shows how current actually changes with voltage.
        </p>

        <p>
          This voltage-current relationship is often called the diode V-I
          characteristic.
        </p>
      </SectionCard>

      <SectionCard title="What happens in forward bias?" eyebrow="Forward Region">
        <p>
          In forward bias, current stays very small at first while the diode is
          still below its practical threshold.
        </p>

        <p>
          After the diode reaches about{" "}
          <strong>{DIODE_MODEL.thresholdVoltage.toFixed(1)} V</strong>, the
          current begins to rise much more clearly.
        </p>

        <p>
          In this sample, at <strong>{forwardPoint.voltage.toFixed(1)} V</strong>,
          the current is about <strong>{forwardPoint.currentMA.toFixed(1)} mA</strong>.
        </p>

        <p>
          <strong>
            Checkpoint Question: Does the diode current increase strongly before
            the threshold, or mainly after it?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What happens in reverse bias?" eyebrow="Reverse Region">
        <p>
          In reverse bias, the diode mostly blocks current during normal
          operation.
        </p>

        <p>
          That does not mean perfectly zero current. A very small reverse
          leakage current may still appear.
        </p>

        <p>
          In this lesson example, at <strong>{reversePoint.voltage.toFixed(1)} V</strong>,
          the reverse current is about{" "}
          <strong>{reversePoint.currentMA.toFixed(3)} mA</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Why does the curve bend?" eyebrow="Threshold Behavior">
        <p>
          The curve bends because the junction does not behave like an ordinary
          resistor.
        </p>

        <p>
          Below the forward threshold, conduction is weak. After the threshold,
          a small increase in voltage can produce a much larger change in
          current.
        </p>

        <p>
          This is why the forward part of the curve becomes much steeper after
          turn-on.
        </p>
      </SectionCard>

      <SectionCard title="Why do diode types differ?" eyebrow="Material Differences">
        <p>
          Different diode types such as silicon, germanium, and Schottky do not
          have identical thresholds or leakage behavior.
        </p>

        <p>
          Some turn on earlier, some leak more in reverse bias, and some are
          preferred for fast or low-voltage applications.
        </p>

        <p>
          That is why engineers compare characteristic curves instead of
          assuming all diodes behave the same way.
        </p>
      </SectionCard>

      <SectionCard title="Why is the graph important?" eyebrow="Measurement View">
        <p>
          A graph makes it easier to see how the diode moves through different
          operating regions.
        </p>

        <p>
          You can quickly spot the below-threshold area, the forward conduction
          area, and the reverse-blocking area.
        </p>

        <p>
          This is extremely useful for circuit design, troubleshooting, and
          choosing the right diode type.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to read a diode characteristic curve is to ask two
          questions.
        </p>

        <p>
          First, which bias direction is being applied? Second, is the diode
          still below threshold or already beyond it?
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the V-I curve shows that a diode is not an ideal
          switch. It has a real turn-on region, a real reverse-leakage region,
          and real material-dependent behavior.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a rectifier or protection circuit, engineers need to know not only
          whether the diode works in principle, but also how much voltage drop
          and current will appear in practice.
        </p>

        <p>
          The characteristic curve helps predict that behavior before building
          the final circuit.
        </p>

        <p>
          This is why diode characteristics are a bridge between theory and real
          electronics work.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The diode characteristic curve shows voltage versus current.</li>
          <li>Forward current stays small before the practical threshold.</li>
          <li>After threshold, forward current rises much more strongly.</li>
          <li>Reverse bias mostly blocks current but still allows tiny leakage.</li>
          <li>The curve shape is not the same as a simple resistor.</li>
          <li>Different diode types have different thresholds and leakage.</li>
          <li>The V-I graph helps predict real circuit behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
