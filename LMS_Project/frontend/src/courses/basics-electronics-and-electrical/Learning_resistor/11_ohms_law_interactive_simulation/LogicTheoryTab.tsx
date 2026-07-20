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
      question: "What is the basic formula of Ohm's law?",
      answer: "The basic formula is V = I x R.",
    },
    {
      question: "If resistance stays the same, what happens when voltage increases?",
      answer: "Current increases.",
    },
    {
      question: "If voltage stays the same, what happens when resistance increases?",
      answer: "Current decreases.",
    },
    {
      question: "Why is Ohm's law useful for LEDs?",
      answer:
        "It helps calculate the resistor needed to keep LED current in a safe range.",
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
              Ohm&apos;s Law
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Ohm&apos;s law describes the relationship between voltage, current,
              and resistance in an electric circuit.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how those three quantities affect one
              another, how to solve for the missing value, and how the same idea
              is used in practical LED resistor calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Formula" value="V = I x R" tone="emerald" />
            <ValueCard label="Core Variables" value="V / I / R" tone="sky" />
            <ValueCard label="Practical Use" value="LED Safety" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What Ohm's law means" eyebrow="Foundation">
        <p>
          Ohm&apos;s law explains how voltage, current, and resistance are linked.
        </p>
        <p>
          The most common form is V = I x R, where voltage equals current
          multiplied by resistance.
        </p>
        <p>
          If we know any two of these values, we can calculate the third one.
        </p>
      </SectionCard>

      <SectionCard title="The three main forms" eyebrow="Formula Logic">
        <p>
          Ohm&apos;s law can be rearranged depending on what you need to solve.
        </p>
        <p>
          To find current, use I = V / R.
        </p>
        <p>
          To find resistance, use R = V / I.
        </p>
      </SectionCard>

      <SectionCard title="How voltage affects current" eyebrow="Cause and Effect">
        <p>
          If resistance stays constant, increasing voltage increases current.
        </p>
        <p>
          Lowering voltage reduces current.
        </p>
        <p>
          This is why higher supply voltage can make a circuit drive more
          strongly if resistance does not change.
        </p>
      </SectionCard>

      <SectionCard title="How resistance affects current" eyebrow="Current Control">
        <p>
          If voltage stays constant, increasing resistance reduces current.
        </p>
        <p>
          Lower resistance allows more current to flow.
        </p>
        <p>
          This is why resistors are used to control current in practical
          circuits.
        </p>
      </SectionCard>

      <SectionCard title="Why Ohm's law is so important" eyebrow="Core Idea">
        <p>
          Ohm&apos;s law is one of the most important tools in basic electronics.
        </p>
        <p>
          It helps explain what happens when we change supply voltage, component
          values, or load conditions.
        </p>
        <p>
          Many circuit calculations are built on this one relationship.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 11 simulator lets you choose which quantity to solve for:
          current, voltage, or resistance.
        </p>
        <p>
          As you change the known values, the lesson updates the solved value
          and visual response live.
        </p>
        <p>
          This makes the formula feel less abstract because you can see how one
          change affects the rest of the circuit.
        </p>
      </SectionCard>

      <SectionCard title="LED example and resistor sizing" eyebrow="Applications">
        <p>
          One practical use of Ohm&apos;s law is choosing a resistor for an LED.
        </p>
        <p>
          The resistor is used to limit current so the LED stays in a safe
          operating range.
        </p>
        <p>
          By knowing supply voltage, LED voltage drop, and desired current, we
          can calculate a suitable resistor value.
        </p>
      </SectionCard>

      <SectionCard title="LED brightness and current" eyebrow="Practical Effect">
        <p>
          LED brightness follows current closely in simple circuits.
        </p>
        <p>
          More current usually makes the LED brighter, while less current makes
          it dimmer.
        </p>
        <p>
          Too much current can damage the LED, which is why the resistor
          calculation matters.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="Watch Out">
        <p>
          One common mistake is mixing up the three Ohm&apos;s law formulas.
        </p>
        <p>
          Another mistake is forgetting that units matter, especially when
          current is shown in milliamps instead of amps.
        </p>
        <p>
          Students also often forget that LED resistor calculations must account
          for the LED&apos;s own voltage drop, not only the supply voltage.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Ohm&apos;s law links voltage, current, and resistance.</li>
          <li>The main formula is `V = I x R`.</li>
          <li>If voltage rises and resistance stays fixed, current rises.</li>
          <li>If resistance rises and voltage stays fixed, current falls.</li>
          <li>Ohm&apos;s law is essential for safe LED resistor selection.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the Ohm&apos;s law basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
