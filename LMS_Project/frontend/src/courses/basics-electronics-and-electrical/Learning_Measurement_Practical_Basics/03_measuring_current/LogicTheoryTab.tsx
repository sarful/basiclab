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
  tone: "emerald" | "orange" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "orange"
        ? "border-orange-200 bg-orange-50 text-orange-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

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
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-rose-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
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
      question: "What is the biggest setup difference between measuring voltage and measuring current?",
      answer:
        "Voltage is measured across two points, but current is measured in series so the current flows through the meter.",
    },
    {
      question: "When do you use the VΩmA jack for current?",
      answer:
        "Use it for small DC current ranges such as 20mA and 200mA.",
    },
    {
      question: "When should the red lead move to the 10A jack?",
      answer:
        "Only for higher-current tests that require the dedicated 10A current range.",
    },
    {
      question: "Why does the circuit need an open gap during a current test?",
      answer:
        "Because the meter must bridge that gap so all current passes through the meter.",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Logic &amp; Theory
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Measuring Current
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Measuring current means checking how much electrical flow is
              moving through a circuit path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is built around one critical beginner rule: current
              must flow <strong>through</strong> the meter, so the meter is
              inserted in series instead of being placed across the source.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Main Family" value="DCA" tone="orange" />
            <ValueCard label="High Current Jack" value="10A" tone="rose" />
          </div>
        </div>
      </section>

      <SectionCard title="What is current measurement?" eyebrow="Core Concept">
        <p>
          Current measurement checks the amount of electric charge flowing
          through a path.
        </p>
        <p>
          In simple language, voltage tells you the push, but current tells you
          the actual flow.
        </p>
        <p>
          Because current is flow inside the path, the meter cannot simply
          touch two points across the source like a voltage test.
        </p>
        <p>
          The circuit must be opened, and the meter must bridge that gap so the
          same current passes through the meter itself.
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Current measurement helps confirm whether a load is really drawing the
          expected amount of power from the source.
        </p>
        <p>It helps answer practical questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Is a sensor loop really carrying about 20mA?</li>
          <li>Is a DC load drawing a normal current or too much current?</li>
          <li>Does a high-current load require the 10A setup instead of the small-current jack?</li>
          <li>Did the meter get inserted correctly into the open path?</li>
        </ul>
        <p>
          That is why current measurement is useful in troubleshooting,
          commissioning, and safe circuit learning.
        </p>
      </SectionCard>

      <SectionCard
        title="How current setup differs from voltage setup"
        eyebrow="Key Difference"
      >
        <p>
          <strong>Voltage measurement:</strong> the meter goes across two
          points.
        </p>
        <p>
          <strong>Current measurement:</strong> the meter goes in series inside
          the path.
        </p>
        <p>
          That means you usually open one side of the circuit, then connect the
          red probe to the source side and the black probe to the load side.
        </p>
        <p>
          If both probes sit on the same node, no current passes through the
          meter, so the reading is not meaningful for the lesson.
        </p>
      </SectionCard>

      <SectionCard title="Dial and jack selection rules" eyebrow="Setup Rules">
        <p>
          For this lesson, the meter family must be <strong>DCA</strong>,
          because all scenarios are DC current measurements.
        </p>
        <p>
          The black lead stays in <strong>COM</strong>.
        </p>
        <p>
          For small current ranges such as <strong>20mA</strong> and{" "}
          <strong>200mA</strong>, the red lead stays in{" "}
          <strong>VΩmA</strong>.
        </p>
        <p>
          For high-current measurement, the red lead must move to the dedicated{" "}
          <strong>10A</strong> jack and the dial must match that current range.
        </p>
        <p>
          After a high-current test, the red lead should return to the normal
          voltage-and-small-current jack so the meter is ready for general use.
        </p>
      </SectionCard>

      <SectionCard title="Series measurement examples" eyebrow="Practical Logic">
        <p>
          In a <strong>20mA sensor loop</strong>, the circuit is opened and the
          meter is inserted into the loop so the loop current flows through the
          meter.
        </p>
        <p>
          In a <strong>200mA DC load</strong>, the positive feed can be opened
          and the meter bridges that break.
        </p>
        <p>
          In a <strong>high-current 10A test</strong>, the same series rule
          still applies, but the jack and range must change to the 10A setup.
        </p>
        <p>
          The logic is the same in every case: open the path, insert the meter,
          and let current pass through the meter.
        </p>
      </SectionCard>

      <SectionCard title="Safety mistakes to avoid" eyebrow="High Priority">
        <p>
          Never try to measure current the same way you measure voltage across
          a source.
        </p>
        <p>
          Do not leave the red lead in <strong>VΩmA</strong> when the lesson
          calls for a high-current <strong>10A</strong> test.
        </p>
        <p>
          Do not leave the red lead in <strong>10A</strong> after the high-current
          test is over, because that creates risk for the next measurement.
        </p>
        <p>
          If the dial family, jack selection, and series placement do not all
          match the job, stop and correct the setup before continuing.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Current tells us the amount of electrical flow.</li>
          <li>Current is measured in series, not across the source.</li>
          <li>The black lead stays in COM.</li>
          <li>Small current uses VΩmA, and high current uses 10A.</li>
          <li>The meter must bridge an open gap so current flows through it.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these short questions to lock in the key setup rules.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
