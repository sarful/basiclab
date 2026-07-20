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
      question: "What is the main defining property of a thermistor?",
      answer:
        "A thermistor is a resistor whose resistance changes with temperature.",
    },
    {
      question: "What happens to resistance in an NTC thermistor when temperature rises?",
      answer:
        "In an NTC thermistor, rising temperature lowers resistance.",
    },
    {
      question: "What happens to resistance in a PTC thermistor when temperature rises?",
      answer:
        "In a PTC thermistor, rising temperature increases resistance.",
    },
    {
      question: "Why does thermistor current change when temperature changes?",
      answer:
        "Because the thermistor resistance changes, and by Ohm's law current changes when voltage stays the same but resistance changes.",
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
              Thermistor
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A thermistor is a temperature-sensitive resistor whose value
              changes as the surrounding temperature changes.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on NTC and PTC behavior, how temperature
              changes resistance, and why that directly changes circuit current
              in sensing and protection applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Variable" value="Temperature" tone="emerald" />
            <ValueCard label="Main Types" value="NTC / PTC" tone="sky" />
            <ValueCard label="Circuit Effect" value="Resistance Shift" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What a thermistor is" eyebrow="Foundation">
        <p>
          A thermistor is a resistor whose value changes with temperature.
        </p>
        <p>
          Unlike an ordinary fixed resistor, its resistance is meant to respond
          to thermal conditions.
        </p>
        <p>
          That makes it useful when a circuit needs to sense temperature or
          react automatically to heat changes.
        </p>
      </SectionCard>

      <SectionCard title="The two main thermistor types" eyebrow="Core Comparison">
        <p>
          Thermistors are commonly grouped into NTC and PTC types.
        </p>
        <p>
          NTC means negative temperature coefficient, so resistance goes down
          when temperature goes up.
        </p>
        <p>
          PTC means positive temperature coefficient, so resistance goes up
          when temperature goes up.
        </p>
      </SectionCard>

      <SectionCard title="Why temperature changes resistance" eyebrow="Material Behavior">
        <p>
          A thermistor is made from materials whose electrical behavior shifts
          strongly with temperature.
        </p>
        <p>
          As the material warms or cools, the movement of charge inside it
          changes.
        </p>
        <p>
          That is why thermistors are much more temperature-sensitive than
          ordinary resistors.
        </p>
      </SectionCard>

      <SectionCard title="NTC behavior" eyebrow="Negative Coefficient">
        <p>
          In an NTC thermistor, heating causes resistance to fall.
        </p>
        <p>
          If the supply voltage stays the same, lower resistance means more
          current can flow.
        </p>
        <p>
          This is why NTC thermistors are often used in temperature sensing and
          inrush current limiting circuits.
        </p>
      </SectionCard>

      <SectionCard title="PTC behavior" eyebrow="Positive Coefficient">
        <p>
          In a PTC thermistor, heating causes resistance to rise.
        </p>
        <p>
          If the supply voltage stays the same, higher resistance means current
          is reduced.
        </p>
        <p>
          This makes PTC thermistors useful in protection circuits where rising
          temperature should push the circuit toward a safer condition.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 7 simulator lets you switch between NTC and PTC mode and
          move temperature up or down.
        </p>
        <p>
          As the temperature changes, the resistance value updates live.
        </p>
        <p>
          Because the circuit also shows current, you can see Ohm&apos;s law in
          action: when resistance changes, current changes too.
        </p>
      </SectionCard>

      <SectionCard title="Why thermistors matter in circuits" eyebrow="Applications">
        <p>
          Thermistors are valuable because temperature is often an important
          hidden variable in real systems.
        </p>
        <p>
          They are used in battery packs, thermostats, cooling fan control,
          temperature measurement, and protection circuits.
        </p>
        <p>
          Their strength is that they let a circuit respond to heat without a
          complex mechanical system.
        </p>
      </SectionCard>

      <SectionCard title="A key limitation" eyebrow="Practical Limits">
        <p>
          Thermistor response is not perfectly linear.
        </p>
        <p>
          That means a small temperature change does not always produce the same
          amount of resistance change across the whole range.
        </p>
        <p>
          Because of this, calibration or lookup-based interpretation is often
          needed in accurate measurement systems.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          One common mistake is thinking all thermistors behave the same way.
        </p>
        <p>
          Students also often mix up NTC and PTC, even though they respond in
          opposite directions.
        </p>
        <p>
          Another mistake is forgetting that temperature changes resistance
          first, and the current change comes after that.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A thermistor is a resistor whose value changes with temperature.</li>
          <li>NTC resistance decreases when temperature rises.</li>
          <li>PTC resistance increases when temperature rises.</li>
          <li>Changing resistance changes circuit current when voltage is fixed.</li>
          <li>Thermistors are useful for sensing, control, and protection.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the thermistor basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
