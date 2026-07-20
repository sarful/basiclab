"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getFilterCircuitState } from "./logic";

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
  const sample = getFilterCircuitState(10, 1000, "standard", 0.12, true, 1000);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the role of the filter capacitor?",
      answer:
        "It charges near the voltage peaks and then discharges through the load between peaks, reducing ripple.",
    },
    {
      question: "Why do the diodes not conduct all the time when the filter is ON?",
      answer:
        "Because once the capacitor is charged, the input must rise above the capacitor voltage before a diode can conduct again.",
    },
    {
      question: "Why is ripple still present even with a capacitor?",
      answer:
        "Because the capacitor slowly discharges into the load between charging pulses, so the output is smoother but not perfectly flat.",
    },
    {
      question: "How does a larger capacitor change the output?",
      answer:
        "A larger capacitor usually reduces ripple and holds the output voltage higher between peaks.",
    },
    {
      question: "Why can diode current be sharp in a filtered rectifier?",
      answer:
        "Because the capacitor recharges in short bursts near the waveform peaks, which creates pulsed diode current.",
    },
    {
      question: "Why does load resistance matter?",
      answer:
        "Lower resistance draws more current, discharges the capacitor faster, and usually increases ripple and device stress.",
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
              Filter Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A filter circuit smooths the rectifier output by adding a capacitor
              that stores charge near the peaks and releases it between pulses.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on ripple reduction, capacitor charging and
              discharging, pulsed diode conduction, and how load resistance and
              diode type change the practical result.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is a core idea in turning rectified AC into a smoother DC supply.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Ripple Vpp" value={`${sample.filterRipple.toFixed(2)} V`} tone="amber" />
            <ValueCard
              label="Capacitor Charging"
              value={`${sample.capacitorChargePercent.toFixed(0)} %`}
              tone="violet"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is a filter circuit?" eyebrow="Core Concept">
        <p>
          A filter circuit is added after rectification to make the output
          voltage smoother.
        </p>

        <p>
          In this lesson, the main filter element is a capacitor connected so it
          can store energy when the rectified voltage rises.
        </p>

        <p>
          That stored energy helps support the load between waveform peaks.
        </p>
      </SectionCard>

      <SectionCard title="Why is a capacitor used?" eyebrow="Energy Storage">
        <p>
          The capacitor behaves like a small energy reservoir.
        </p>

        <p>
          When the rectified input rises above the capacitor voltage, the diode
          conducts and the capacitor charges.
        </p>

        <p>
          When the input falls back down, the capacitor discharges through the
          load and keeps the output from dropping immediately to zero.
        </p>
      </SectionCard>

      <SectionCard title="How does the charging cycle work?" eyebrow="Peak Charging">
        <p>
          The capacitor does not charge equally during the whole waveform.
        </p>

        <p>
          It mainly charges near the waveform peaks, when the rectified input is
          high enough to overcome the diode drop and exceed the capacitor
          voltage.
        </p>

        <p>
          That is why the diode conduction window becomes narrow and pulse-like
          when the filter is enabled.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the capacitor is already holding a high
            voltage, what must happen before the diode can conduct again?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why does the diode turn OFF between peaks?" eyebrow="Conduction Window">
        <p>
          After the capacitor charges, the input waveform usually falls below
          the capacitor voltage for part of the cycle.
        </p>

        <p>
          During that time, the diode becomes reverse-biased or effectively
          inactive, so it stops conducting.
        </p>

        <p>
          This is normal behavior in a capacitor filter and is one reason diode
          current becomes pulsed rather than continuous.
        </p>
      </SectionCard>

      <SectionCard title="What is ripple and why does it remain?" eyebrow="Smoothing Limit">
        <p>
          Ripple is the remaining variation in the filtered output voltage.
        </p>

        <p>
          Even with a capacitor, the output is not perfectly flat because the
          capacitor gradually discharges into the load between charging events.
        </p>

        <p>
          The result is a smoother DC-like waveform, but still with some rise
          and fall.
        </p>
      </SectionCard>

      <SectionCard title="How does capacitor size affect the output?" eyebrow="Component Choice">
        <p>
          A larger capacitor can store more charge, so it usually keeps the
          output voltage from sagging as quickly.
        </p>

        <p>
          That normally reduces ripple and raises the average filtered output.
        </p>

        <p>
          A smaller capacitor loses its stored charge faster, so the ripple
          becomes larger and the smoothing effect is weaker.
        </p>
      </SectionCard>

      <SectionCard title="Why does load resistance matter?" eyebrow="Load Effect">
        <p>
          Load resistance controls how much current the output must supply.
        </p>

        <p>
          Lower resistance means higher current, so the capacitor discharges
          faster between peaks.
        </p>

        <p>
          That usually increases ripple, raises stress on the diode path, and
          can create a higher current risk for the load.
        </p>
      </SectionCard>

      <SectionCard title="Why compare different diode types?" eyebrow="Diode Selection">
        <p>
          Standard, fast, and Schottky diodes do not behave exactly the same.
        </p>

        <p>
          Their forward drop and switching behavior change how much voltage
          reaches the capacitor and load.
        </p>

        <p>
          For example, a lower-drop Schottky diode may allow a somewhat higher
          filtered output than a standard silicon diode.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The simplest way to understand this circuit is to separate the cycle
          into two modes: capacitor charging and capacitor discharging.
        </p>

        <p>
          The diode conducts only during charging, while the capacitor supports
          the load during discharging.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the filter capacitor smooths the output by filling
          up near peaks and feeding the load between peaks, but it never removes
          ripple completely.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          Many basic DC power supplies use a rectifier first and then add a
          capacitor filter before the next regulation stage.
        </p>

        <p>
          This makes the voltage more usable for electronics than raw pulsating
          rectifier output alone.
        </p>

        <p>
          The lesson mirrors that practical idea by showing how a filter changes
          average output, ripple, and current behavior.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A filter circuit smooths the rectified output.</li>
          <li>The capacitor charges near voltage peaks.</li>
          <li>The capacitor discharges through the load between peaks.</li>
          <li>Ripple becomes smaller, but it does not disappear completely.</li>
          <li>Diode conduction becomes short and pulsed when filtering is active.</li>
          <li>Larger capacitance usually improves smoothing.</li>
          <li>Lower load resistance usually increases ripple and current stress.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
