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
      question: "What do the first two or three resistor bands usually represent?",
      answer:
        "They represent the significant digits of the resistor value.",
    },
    {
      question: "What does the multiplier band do?",
      answer:
        "The multiplier band sets the decimal scale or number of zeros applied to the significant digits.",
    },
    {
      question: "What does the tolerance band tell us?",
      answer:
        "It tells us how much the actual resistor value may vary from the nominal value.",
    },
    {
      question: "What extra information does a 6-band resistor include?",
      answer:
        "A 6-band resistor adds a temperature coefficient band, usually expressed in ppm per degree Celsius.",
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
              Resistor Color Code
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistor color code is a visual system that uses colored bands to
              show resistor value, multiplier, tolerance, and sometimes
              temperature coefficient.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how to read 4-band, 5-band, and 6-band
              resistors correctly, how band order affects the calculation, and
              why tolerance matters in real circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Idea" value="Band Decoding" tone="emerald" />
            <ValueCard label="Main Output" value="Resistance Value" tone="sky" />
            <ValueCard label="Extra Detail" value="Tolerance / Temp" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What resistor color code is" eyebrow="Foundation">
        <p>
          Small resistors often do not have enough space to print their values
          in numbers.
        </p>
        <p>
          Instead, they use a set of colored bands to encode important
          information.
        </p>
        <p>
          By reading those bands in the correct order, we can determine the
          resistor&apos;s nominal value and other practical details.
        </p>
      </SectionCard>

      <SectionCard title="What the bands mean" eyebrow="Band Roles">
        <p>
          The first two or three bands usually represent the significant
          digits.
        </p>
        <p>
          The next band is the multiplier, which scales the number by adding
          zeros or shifting the decimal value.
        </p>
        <p>
          The tolerance band tells us how far the real resistor value may vary
          from the ideal printed value.
        </p>
      </SectionCard>

      <SectionCard title="4-band, 5-band, and 6-band resistors" eyebrow="Modes">
        <p>
          A 4-band resistor usually uses two significant digits, one
          multiplier band, and one tolerance band.
        </p>
        <p>
          A 5-band resistor usually uses three significant digits, then
          multiplier and tolerance.
        </p>
        <p>
          A 6-band resistor adds one more band for temperature coefficient,
          usually measured in ppm per degree Celsius.
        </p>
      </SectionCard>

      <SectionCard title="Why reading direction matters" eyebrow="Reading Order">
        <p>
          The order of the bands matters because the same colors mean different
          things depending on position.
        </p>
        <p>
          If you start from the wrong side, you can decode a completely wrong
          resistor value.
        </p>
        <p>
          The tolerance band is often spaced slightly apart, which helps show
          the correct reading direction.
        </p>
      </SectionCard>

      <SectionCard title="How the calculation works" eyebrow="Formula Logic">
        <p>
          First, combine the significant digit bands into one number.
        </p>
        <p>
          Then apply the multiplier band to scale that number.
        </p>
        <p>
          After that, use the tolerance band to calculate the allowed minimum
          and maximum range around the nominal value.
        </p>
      </SectionCard>

      <SectionCard title="Why tolerance matters" eyebrow="Practical Meaning">
        <p>
          A resistor is not always exactly equal to its nominal value.
        </p>
        <p>
          Tolerance tells us how much variation is acceptable in real
          manufacturing.
        </p>
        <p>
          That becomes important in precision circuits, filters, measurement
          systems, and calibration work.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 9 simulator lets you switch between 4-band, 5-band, and
          6-band resistor modes.
        </p>
        <p>
          As you change each band color, the decoded resistor value updates
          immediately.
        </p>
        <p>
          The lesson also shows the live formula, allowed tolerance range, and
          temperature coefficient when the 6-band mode is selected.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is starting to read from the wrong side of the
          resistor.
        </p>
        <p>
          Another mistake is confusing the multiplier band with a digit band.
        </p>
        <p>
          Students also often forget that a black first digit creates a leading
          zero problem and usually should not be used as the first readable
          digit.
        </p>
      </SectionCard>

      <SectionCard title="Why resistor color code is useful" eyebrow="Applications">
        <p>
          Resistor color code makes it possible to identify component values
          quickly without test equipment.
        </p>
        <p>
          It helps during circuit assembly, troubleshooting, repair, and parts
          selection.
        </p>
        <p>
          For anyone working with real electronic components, reading color
          bands is a core practical skill.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The first bands usually give the significant digits.</li>
          <li>The multiplier band scales the value.</li>
          <li>The tolerance band shows the allowed variation.</li>
          <li>5-band and 6-band resistors provide more detail than 4-band ones.</li>
          <li>Correct reading direction is essential for correct decoding.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the resistor color code basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
