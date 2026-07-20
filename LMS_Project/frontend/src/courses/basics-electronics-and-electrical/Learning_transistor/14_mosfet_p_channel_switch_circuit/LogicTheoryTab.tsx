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
      question: "What is the main idea of this PMOS switch lesson?",
      answer:
        "It shows how a P-channel MOSFET works as a high-side switch so the positive supply path to the load can be controlled electronically.",
    },
    {
      question: "Why is this called a high-side switch?",
      answer:
        "Because the PMOS is placed on the supply side of the load and controls whether positive voltage is delivered into the LED branch.",
    },
    {
      question: "What turns the PMOS on in this circuit?",
      answer:
        "The gate must be pulled low enough below the source so that VGS becomes sufficiently negative to cross the PMOS turn-on requirement.",
    },
    {
      question: "Why is the pull-up resistor important here?",
      answer:
        "It keeps the gate near the source voltage when the control switch is open, which holds the PMOS safely in the OFF state.",
    },
    {
      question: "How is this lesson different from the NMOS low-side switch lesson?",
      answer:
        "The circuit position and gate rule are reversed: the PMOS sits on the high side and turns on with a negative VGS relative to its source.",
    },
    {
      question: "Why is VGS still more important than gate voltage alone?",
      answer:
        "Because PMOS behavior depends on the gate voltage relative to the source voltage, not only the absolute gate number.",
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
              PMOS High-Side Switch Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a P-channel MOSFET works as a practical
              high-side switch that controls the positive supply path to an LED
              load.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The circuit links MOSFET theory with a real application: battery,
              pull-up resistor, control switch, PMOS gate, and LED branch all
              cooperate to create an electronic switching system.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes lesson 14 the practical counterpart to the previous
              NMOS low-side switch lesson.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Switch Type" value="PMOS High-Side" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="Negative VGS" tone="violet" />
            <ValueCard label="Load Control" value="Supply Path" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is this project teaching?" eyebrow="Practical Goal">
        <p>
          The project teaches how a PMOS can act as a practical switch in the
          positive supply path instead of the ground-return path.
        </p>

        <p>
          In this lesson, the PMOS decides whether the LED branch receives
          supply voltage from the battery.
        </p>

        <p>
          This helps learners understand that MOSFET switching can be designed
          from either side of the load, depending on circuit needs.
        </p>
      </SectionCard>

      <SectionCard title="Why is this called high-side switching?" eyebrow="Circuit Position">
        <p>
          The PMOS is placed on the supply side of the load, above the LED and
          resistor branch.
        </p>

        <p>
          That means the transistor controls whether positive voltage is fed
          into the load path.
        </p>

        <p>
          This arrangement is known as high-side switching and is a natural
          application for P-channel MOSFET control.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the control switch closes?" eyebrow="Gate Pull-Down Action">
        <p>
          When the control switch closes, the gate is pulled downward toward
          ground.
        </p>

        <p>
          Since the PMOS source is near the battery voltage, that makes the
          gate-source voltage more negative.
        </p>

        <p>
          Once VGS becomes negative enough, the PMOS turns on and connects the
          battery supply into the LED branch.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the control switch opens?" eyebrow="Safe OFF State">
        <p>
          When the control switch opens, the direct path pulling the gate low is
          removed.
        </p>

        <p>
          The pull-up path then returns the gate near the source voltage, so VGS
          is no longer negative enough to keep the PMOS on.
        </p>

        <p>
          This returns the PMOS to its OFF state and removes supply power from
          the load branch.
        </p>
      </SectionCard>

      <SectionCard title="Why is the pull-up resistor so important?" eyebrow="Gate Stability">
        <p>
          The PMOS gate should not float, because a floating gate can store
          charge and create unpredictable switching.
        </p>

        <p>
          The pull-up resistor keeps the gate near the source voltage when the
          control switch is open.
        </p>

        <p>
          That gives the circuit a stable and safe default OFF condition.
        </p>
      </SectionCard>

      <SectionCard title="Why does the LED resistor still matter?" eyebrow="Load Protection">
        <p>
          The PMOS controls whether supply reaches the LED branch, but it does
          not automatically limit the current to a safe value.
        </p>

        <p>
          The LED resistor still sets the current to a practical operating
          level.
        </p>

        <p>
          This reminds learners that switching control and current limiting are
          two different circuit functions.
        </p>
      </SectionCard>

      <SectionCard title="Why is VGS the real PMOS control variable?" eyebrow="Gate-Source Logic">
        <p>
          A PMOS does not turn on because the gate is simply at some number of
          volts by itself.
        </p>

        <p>
          It turns on because the gate becomes sufficiently lower than the
          source, making VGS negative enough.
        </p>

        <p>
          This lesson is especially useful because it trains learners to think
          in relative gate-source terms instead of absolute gate voltage only.
        </p>
      </SectionCard>

      <SectionCard title="How does the current path work when ON?" eyebrow="Complete Loop">
        <p>
          When the PMOS is ON, current can move from the battery through the
          PMOS, through the LED resistor, through the LED, and then to ground.
        </p>

        <p>
          When the PMOS is OFF, the positive supply path is broken, so the LED
          branch cannot receive power.
        </p>

        <p>
          This makes the LED a clear visual indicator of high-side switching
          behavior.
        </p>
      </SectionCard>

      <SectionCard title="How is this different from the previous NMOS lesson?" eyebrow="High Side vs Low Side">
        <p>
          The previous lesson used an N-channel MOSFET on the low side, where
          the transistor controlled the ground-return path.
        </p>

        <p>
          This lesson uses a P-channel MOSFET on the high side, where the
          transistor controls the positive supply path instead.
        </p>

        <p>
          Together, the two lessons help learners compare circuit position,
          polarity rule, and switching logic across both transistor types.
        </p>
      </SectionCard>

      <SectionCard title="What is the simplest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to read the circuit is to follow one logic chain.
        </p>

        <p>
          Control switch closes, gate is pulled low, VGS becomes negative, PMOS
          turns on, supply reaches the load branch, and the LED lights.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a PMOS high-side switch lets the circuit control
          the positive supply path by using gate voltage relative to a high
          source node.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>This lesson uses a P-channel MOSFET as a high-side switch.</li>
          <li>The PMOS controls whether supply voltage reaches the LED branch.</li>
          <li>Closing the control switch pulls the gate low and makes VGS negative.</li>
          <li>The pull-up resistor keeps the gate near the source for a safe OFF state.</li>
          <li>The LED resistor still limits current while the PMOS controls switching.</li>
          <li>PMOS turn-on depends on gate voltage relative to the source.</li>
          <li>This lesson is the practical high-side counterpart to the NMOS low-side lesson.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
