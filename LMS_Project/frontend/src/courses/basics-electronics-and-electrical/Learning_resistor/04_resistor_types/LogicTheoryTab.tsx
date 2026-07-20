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
      question: "What is the basic difference between fixed and variable resistors?",
      answer:
        "A fixed resistor has one set resistance value, while a variable resistor allows the resistance to be adjusted.",
    },
    {
      question: "Why is a thermistor considered different from a standard fixed resistor?",
      answer:
        "Because its resistance changes with temperature, so it acts more like a sensing component than a constant resistor.",
    },
    {
      question: "Why might a metal film resistor be preferred over a carbon composition resistor?",
      answer:
        "Because metal film resistors are usually more precise and more stable, while carbon composition resistors tend to have higher noise and lower precision.",
    },
    {
      question: "Why is resistor type selection important in practical design?",
      answer:
        "Because different resistor types are optimized for different needs such as accuracy, power handling, manual control, or sensing.",
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
              Resistor Types
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Not all resistors are made for the same job. Different resistor
              types are designed for different goals such as fixed control,
              variable adjustment, sensing, high precision, or heavy power
              handling.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on classification and selection logic: what
              the major resistor types are, how they differ, and why one type
              may be a better choice than another in a practical circuit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Groups" value="Fixed / Variable / Sensor" tone="emerald" />
            <ValueCard label="Selection Basis" value="Job Fit" tone="sky" />
            <ValueCard label="Design Focus" value="Accuracy / Power / Response" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why resistor types matter" eyebrow="Big Picture">
        <p>
          A resistor is not always just a fixed part with one permanent value.
        </p>
        <p>
          In practical electronics, different resistor types exist because
          circuits need different behaviors.
        </p>
        <p>
          Some circuits need low cost, some need high precision, some need
          manual adjustment, and some need sensing based on temperature or
          light.
        </p>
      </SectionCard>

      <SectionCard title="The three broad resistor families" eyebrow="Core Classification">
        <p>Most lesson-level resistor categories can be understood in three groups.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Fixed resistors, where the value stays the same during normal use.</li>
          <li>Variable resistors, where the user can adjust resistance.</li>
          <li>Sensor resistors, where resistance changes because the environment changes.</li>
        </ul>
        <p>
          This classification helps students quickly understand what role a
          resistor is playing inside a circuit.
        </p>
      </SectionCard>

      <SectionCard title="Fixed resistor types" eyebrow="Stable Values">
        <p>
          Fixed resistors are used when the circuit needs a consistent
          resistance value.
        </p>
        <p>
          Carbon composition resistors are older, low-cost options, but they
          usually have more noise and lower precision.
        </p>
        <p>
          Metal film resistors are more accurate and more stable, which makes
          them a common choice for signal and measurement-related work.
        </p>
        <p>
          Wire-wound resistors are strong in high-power situations, but their
          size and construction can make them less ideal for some fast or
          sensitive circuits.
        </p>
      </SectionCard>

      <SectionCard title="Variable resistors" eyebrow="Adjustable Control">
        <p>
          Variable resistors allow a user or system to change resistance rather
          than keeping it fixed.
        </p>
        <p>
          A potentiometer is a common example. It is used when we want manual
          control, such as changing volume, dimming a light, or adjusting a
          calibration point.
        </p>
        <p>
          The main idea is simple: instead of one permanent resistance value,
          the component gives the circuit an adjustable resistance path.
        </p>
      </SectionCard>

      <SectionCard title="Sensor resistors" eyebrow="Environmental Response">
        <p>
          Some resistors are designed so their resistance changes with the
          environment.
        </p>
        <p>
          A thermistor changes resistance with temperature, so it is useful for
          heat-related detection and protection.
        </p>
        <p>
          An LDR, or light dependent resistor, changes resistance with light,
          so it is useful in automatic lighting and basic light-sensing tasks.
        </p>
        <p>
          These parts are not mainly about fixed current limiting. They are
          about converting environmental change into electrical change.
        </p>
      </SectionCard>

      <SectionCard title="How to compare resistor types" eyebrow="Selection Logic">
        <p>
          Choosing a resistor type is not only about resistance value.
        </p>
        <p>
          Engineers also compare factors such as accuracy, power handling,
          response speed, cost, stability, and best application.
        </p>
        <p>
          That is why the simulator includes comparison ideas like precision,
          heat tolerance, response, and application fit.
        </p>
      </SectionCard>

      <SectionCard title="When one type is better than another" eyebrow="Use Case Thinking">
        <p>
          If you need low-cost general use, a simple fixed resistor may be
          enough.
        </p>
        <p>
          If you need precision, metal film is often a better choice.
        </p>
        <p>
          If you need high power dissipation, wire-wound may be more suitable.
        </p>
        <p>
          If you need adjustment, a potentiometer makes more sense.
        </p>
        <p>
          If you need sensing, a thermistor or LDR is usually the correct
          category to think about first.
        </p>
      </SectionCard>

      <SectionCard title="Why no single resistor type is best for everything" eyebrow="Tradeoffs">
        <p>
          Every resistor type comes with advantages and limitations.
        </p>
        <p>
          A precise resistor may not be the best at power dissipation. A
          powerful resistor may be larger and less convenient. A sensor resistor
          may respond to the environment well but may not offer fixed accuracy.
        </p>
        <p>
          Good design means matching the component type to the real job.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          Do not assume every resistor is only for fixed current limiting.
        </p>
        <p>
          Do not assume a potentiometer, thermistor, or LDR works like an
          ordinary fixed resistor in every condition.
        </p>
        <p>
          And do not choose a resistor type only by price or appearance without
          thinking about application needs.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistors can be fixed, variable, or sensor-based.</li>
          <li>Carbon, metal film, and wire-wound are common fixed resistor types.</li>
          <li>Potentiometers provide adjustable resistance.</li>
          <li>Thermistors respond to temperature and LDRs respond to light.</li>
          <li>The best resistor type depends on the job, not just the value.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the resistor type selection ideas.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
