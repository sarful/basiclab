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
  const quizItems: QuizAccordionItem[] = [
    {
      question: "Why do we need different diode types instead of one single diode for everything?",
      answer:
        "Because different applications need different behaviors such as low forward drop, controlled reverse breakdown, light emission, light sensing, or variable capacitance.",
    },
    {
      question: "Which diode type is commonly chosen for voltage regulation?",
      answer:
        "A Zener diode is commonly chosen when controlled reverse-voltage regulation is needed.",
    },
    {
      question: "Why is a Schottky diode popular in efficient power circuits?",
      answer:
        "Because it has a lower forward voltage drop and very fast switching behavior.",
    },
    {
      question: "What is special about an LED compared with a generic diode?",
      answer:
        "An LED emits light when forward current flows through it.",
    },
    {
      question: "What is special about a photodiode?",
      answer:
        "A photodiode is designed to respond to light and convert it into an electrical effect.",
    },
    {
      question: "Why is a varactor diode different from a normal rectifier diode?",
      answer:
        "A varactor is mainly used for voltage-controlled capacitance, not for ordinary rectification.",
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
              Diode Types
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Different diode types are built to solve different electronic
              problems, even though they all come from the basic diode idea.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is about comparing diode families by behavior,
              purpose, and application instead of treating every diode as the
              same component.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Once you know what makes each family special, component selection
              becomes much more practical.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Generic Diode" value="Rectify" tone="violet" />
            <ValueCard label="Zener Diode" value="Regulate" tone="emerald" />
            <ValueCard label="Varactor Diode" value="Tune" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why are there many diode types?" eyebrow="Core Concept">
        <p>
          A basic diode already gives one-way current control, but real circuits
          need more specialized behavior.
        </p>

        <p>
          Some circuits need fast switching, some need voltage regulation, some
          need light emission, and some need light detection or tuning.
        </p>

        <p>
          That is why many diode families exist even though they share the same
          broad diode foundation.
        </p>
      </SectionCard>

      <SectionCard title="What is the generic diode?" eyebrow="Reference Type">
        <p>
          The generic diode is the baseline teaching diode for rectification,
          polarity protection, and simple switching.
        </p>

        <p>
          It mainly conducts in forward bias and blocks reverse current except
          for a tiny leakage current.
        </p>

        <p>
          It is the reference point from which the more specialized diode types
          are easier to understand.
        </p>
      </SectionCard>

      <SectionCard title="Why is the Zener diode special?" eyebrow="Regulation">
        <p>
          A Zener diode is designed to operate in a controlled way in reverse
          breakdown.
        </p>

        <p>
          That makes it useful for voltage reference and small regulation tasks,
          not just ordinary one-way conduction.
        </p>

        <p>
          When reverse-voltage control matters more than ordinary rectification,
          the Zener family becomes important.
        </p>

        <p>
          <strong>
            Checkpoint Question: If a circuit needs a stable reverse-voltage
            reference, would a generic diode or a Zener diode be the more
            natural choice?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is the Schottky diode special?" eyebrow="Fast and Efficient">
        <p>
          A Schottky diode is known for low forward voltage drop and very fast
          switching behavior.
        </p>

        <p>
          Because of this, it is often used where efficiency matters, especially
          in switch-mode power supply paths and fast power circuits.
        </p>

        <p>
          The tradeoff is that it often has more reverse leakage and a lower
          reverse-voltage rating than some standard PN diodes.
        </p>
      </SectionCard>

      <SectionCard title="What about LED and photodiode?" eyebrow="Light Interaction">
        <p>
          An LED is a diode designed to emit light when forward current flows.
        </p>

        <p>
          A photodiode does the opposite kind of job: it is designed to respond
          to incoming light and produce an electrical effect.
        </p>

        <p>
          These examples show that some diode types are made not only for power
          or signal direction, but also for interaction with light.
        </p>
      </SectionCard>

      <SectionCard title="Why is the varactor diode different?" eyebrow="Tuning Use">
        <p>
          A varactor or varicap diode is not mainly chosen for ordinary current
          rectification.
        </p>

        <p>
          Instead, it is valued because its junction capacitance changes with
          reverse voltage.
        </p>

        <p>
          This makes it useful for tuning circuits, RF control, and
          voltage-controlled oscillators.
        </p>
      </SectionCard>

      <SectionCard title="How should we compare diode families?" eyebrow="Selection Logic">
        <p>
          A good comparison begins by asking what the circuit actually needs.
        </p>

        <p>
          If the need is rectification, a generic diode may be enough. If the
          need is voltage regulation, think Zener. If the need is efficiency and
          speed, think Schottky.
        </p>

        <p>
          If the need is light, sensing, or tuning, then the specialized optical
          and RF diode families become more relevant.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to choose a diode type is not to memorize every part
          number first.
        </p>

        <p>
          Instead, start by matching the diode family to the circuit purpose:
          rectify, regulate, emit light, sense light, switch fast, or tune
          frequency.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: different diode types exist because different
          electronics problems need different diode behaviors.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          A power supply may use a rectifier diode or Schottky diode, while a
          small regulator section may use a Zener diode.
        </p>

        <p>
          A front-panel indicator may use an LED, and an optical sensing circuit
          may use a photodiode.
        </p>

        <p>
          So choosing the right diode type is really about choosing the right
          function for the job.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Different diode types exist because circuits need different behaviors.</li>
          <li>Generic diodes are the baseline for rectification and protection.</li>
          <li>Zener diodes are important for reverse-voltage regulation.</li>
          <li>Schottky diodes are valued for low drop and fast switching.</li>
          <li>LEDs emit light, while photodiodes respond to light.</li>
          <li>Varactor diodes are used for voltage-controlled capacitance and tuning.</li>
          <li>Diode selection should start from circuit purpose, not just name.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
