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
  tone: "emerald" | "sky" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300" />
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
      question: "What does resistor power rating mean?",
      answer:
        "It means the maximum wattage a resistor can safely dissipate as heat.",
    },
    {
      question: "Can a resistor with the correct resistance value still fail?",
      answer:
        "Yes. If its power rating is too low for the actual circuit power, it can overheat and fail.",
    },
    {
      question: "What are three common formulas for resistor power?",
      answer:
        "P = V x I, P = I^2R, and P = V^2/R.",
    },
    {
      question: "Why is using a higher wattage resistor often safer?",
      answer:
        "Because it provides more heat-handling margin, lowers stress, and reduces the risk of overload.",
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
              Resistor Power Rating
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistor power rating tells us how much electrical power a
              resistor can safely turn into heat without damage.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how power is calculated, why overheating
              happens, and how to choose a resistor wattage that gives safe
              working margin in real circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Risk" value="Heat" tone="emerald" />
            <ValueCard label="Main Check" value="Power vs Rating" tone="sky" />
            <ValueCard label="Safe Habit" value="Use Margin" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What power rating means" eyebrow="Foundation">
        <p>
          Every resistor converts some electrical energy into heat while
          current flows through it.
        </p>
        <p>
          Power rating tells us the maximum wattage that resistor can safely
          dissipate.
        </p>
        <p>
          If the circuit forces the resistor to handle more power than that
          limit, overheating and damage can occur.
        </p>
      </SectionCard>

      <SectionCard title="Why correct resistance is not enough" eyebrow="Common Trap">
        <p>
          A resistor can have the exact correct ohmic value and still be the
          wrong component for the circuit.
        </p>
        <p>
          The missing check is whether its wattage rating is large enough for
          the actual power being dissipated.
        </p>
        <p>
          This is why real component selection always includes both resistance
          value and power rating.
        </p>
      </SectionCard>

      <SectionCard title="How resistor power is calculated" eyebrow="Formula Logic">
        <p>
          There are three common formulas for resistor power: P = V x I, P =
          I^2R, and P = V^2/R.
        </p>
        <p>
          These formulas are mathematically connected, so they should produce
          the same power result when the circuit values are correct.
        </p>
        <p>
          Which formula you use depends on what circuit quantities are already
          known.
        </p>
      </SectionCard>

      <SectionCard title="Why overheating happens" eyebrow="Thermal Behavior">
        <p>
          When a resistor dissipates power, that power appears as heat.
        </p>
        <p>
          If the heat produced is too large for the resistor package to handle,
          its temperature rises too much.
        </p>
        <p>
          At that point the resistor may become hot, drift in value, discolor,
          smoke, or fail completely.
        </p>
      </SectionCard>

      <SectionCard title="Safe, warm, caution, and overload" eyebrow="Operating States">
        <p>
          Real resistor operation is not just pass or fail.
        </p>
        <p>
          A resistor may operate safely, run warm, approach a caution zone, or
          enter overload depending on how close the actual power is to its
          rating.
        </p>
        <p>
          Good design avoids living too close to the limit for long-term
          reliability.
        </p>
      </SectionCard>

      <SectionCard title="Why safety margin matters" eyebrow="Selection Rule">
        <p>
          Engineers often choose a resistor wattage that is higher than the
          calculated minimum.
        </p>
        <p>
          A common safe habit is to use at least about two times the actual
          calculated power.
        </p>
        <p>
          This gives margin for temperature rise, airflow differences,
          tolerances, and real-world operating stress.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 10 simulator lets you change voltage, resistance, and the
          selected resistor wattage package.
        </p>
        <p>
          As those values change, the lesson updates current, calculated power,
          and operating status live.
        </p>
        <p>
          It also compares selected package size with the recommended safer
          wattage choice, which makes the heat-risk idea visual and practical.
        </p>
      </SectionCard>

      <SectionCard title="Why larger packages are often used" eyebrow="Practical Selection">
        <p>
          A higher wattage resistor usually has a physically larger body.
        </p>
        <p>
          That larger package can dissipate heat more safely than a small one.
        </p>
        <p>
          So selecting a larger wattage part is not about changing resistance,
          but about improving heat-handling capability.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is choosing a resistor only by ohm value and
          ignoring wattage.
        </p>
        <p>
          Another mistake is assuming a resistor is safe just because it works
          for a short moment on the bench.
        </p>
        <p>
          Students also often forget that a resistor running very near its
          limit may still be risky even if it has not failed yet.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Power rating is the safe heat-dissipation limit of a resistor.</li>
          <li>Correct resistance value alone is not enough for safe selection.</li>
          <li>Power can be calculated with `P = V x I`, `P = I^2R`, or `P = V^2/R`.</li>
          <li>Too much power causes overheating and possible failure.</li>
          <li>Using extra wattage margin improves safety and reliability.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the resistor power rating basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
