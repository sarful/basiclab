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
      question: "What is the main idea of this MOSFET load switch project?",
      answer:
        "It uses an N-channel MOSFET as a low-side electronic switch so a small gate-control action can turn the LED load path on or off.",
    },
    {
      question: "Why is this called a low-side switch?",
      answer:
        "Because the NMOS is placed in the path between the load and ground, so it controls the return path rather than the positive supply side.",
    },
    {
      question: "What happens when the control switch is closed?",
      answer:
        "The gate is driven up toward the battery voltage, VGS increases above threshold, and the NMOS can conduct the load current.",
    },
    {
      question: "Why is the pull-down resistor important?",
      answer:
        "It keeps the gate near source level when the control switch is open, preventing the MOSFET from floating into an accidental ON state.",
    },
    {
      question: "Why does the LED need both the MOSFET and the series resistor?",
      answer:
        "The MOSFET controls whether current can flow, while the LED resistor limits the current to a safe and visible operating value.",
    },
    {
      question: "Why is VGS more important than gate voltage alone?",
      answer:
        "Because MOSFET turn-on depends on the gate voltage relative to the source, not just the absolute gate number by itself.",
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
              MOSFET Load Switch Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how an N-channel MOSFET works as a practical
              low-side load switch to control an LED path using gate voltage.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The project connects MOSFET theory with a real switching circuit:
              battery source, control switch, pull-down resistor, MOSFET gate,
              and LED load path all work together.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes lesson 13 a practical bridge from device behavior to a
              usable electronic control circuit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Switch Type" value="NMOS Low-Side" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="VGS Above Threshold" tone="violet" />
            <ValueCard label="Load Example" value="LED Path Control" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is the project trying to teach?" eyebrow="Practical Goal">
        <p>
          The main purpose of this project is to show that a MOSFET is not only
          a device symbol or a region diagram, but also a practical electronic
          switch inside a working circuit.
        </p>

        <p>
          In this lesson, the N-channel MOSFET controls whether the LED load
          loop is complete or broken.
        </p>

        <p>
          That helps the learner connect abstract MOSFET behavior with visible
          load switching.
        </p>
      </SectionCard>

      <SectionCard title="Why is this called a low-side switch?" eyebrow="Circuit Position">
        <p>
          The MOSFET is placed on the ground-return side of the load, not on
          the positive supply side.
        </p>

        <p>
          That means the LED and resistor sit above the MOSFET, and the NMOS
          controls whether the current can return to ground.
        </p>

        <p>
          This arrangement is called low-side switching and is one of the most
          common practical uses of an N-channel MOSFET.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the control switch closes?" eyebrow="Gate Drive Action">
        <p>
          When the control switch closes, the gate is driven upward toward the
          battery voltage.
        </p>

        <p>
          Since the source is near ground in this project, the gate-to-source
          voltage rises and can exceed the NMOS threshold.
        </p>

        <p>
          Once VGS is high enough, the NMOS forms a usable conduction path and
          allows load current to flow.
        </p>
      </SectionCard>

      <SectionCard title="What happens when the control switch opens?" eyebrow="Gate Safe-Off State">
        <p>
          When the control switch opens, the direct drive path to the gate is
          removed.
        </p>

        <p>
          The pull-down path then keeps the gate near source level, so VGS
          becomes too small for useful conduction.
        </p>

        <p>
          This returns the NMOS to its OFF state and breaks the load current
          path.
        </p>
      </SectionCard>

      <SectionCard title="Why is the pull-down resistor so important?" eyebrow="Gate Stability">
        <p>
          A MOSFET gate should not be left floating, because a floating gate can
          hold charge and cause unpredictable switching behavior.
        </p>

        <p>
          The pull-down resistor provides a controlled path that keeps the gate
          near zero volts when the control switch is open.
        </p>

        <p>
          This makes the OFF condition stable, safe, and easier for beginners to
          understand.
        </p>
      </SectionCard>

      <SectionCard title="Why does the LED resistor matter?" eyebrow="Load Protection">
        <p>
          The MOSFET decides whether current may flow, but it does not by itself
          guarantee a safe load current value.
        </p>

        <p>
          The series resistor with the LED limits the current so the LED can
          light without being overstressed.
        </p>

        <p>
          This teaches an important practical rule: switching control and current
          limiting are different jobs in the same circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why is VGS the real turn-on variable?" eyebrow="Gate-Source Logic">
        <p>
          Many beginners first look only at the gate voltage number, but a
          MOSFET turns on according to gate voltage relative to the source.
        </p>

        <p>
          In this lesson, the source stays near ground, so raising the gate
          directly raises VGS in a very easy-to-see way.
        </p>

        <p>
          This makes the project a clean introduction to why gate-source
          voltage matters more than gate voltage by itself.
        </p>
      </SectionCard>

      <SectionCard title="How does the full current path work?" eyebrow="Complete Loop">
        <p>
          When the NMOS is ON, current can move from the battery through the LED
          resistor, through the LED, through the MOSFET drain-source path, and
          back to ground.
        </p>

        <p>
          When the NMOS is OFF, that return path is broken, so the LED current
          stops.
        </p>

        <p>
          This simple loop is why the LED becomes a clear visual indicator of
          MOSFET switching state.
        </p>
      </SectionCard>

      <SectionCard title="Why does this project matter after MOSFET theory lessons?" eyebrow="Theory to Application">
        <p>
          Earlier MOSFET lessons explain channel formation, threshold,
          depletion, enhancement, and type comparison.
        </p>

        <p>
          This project applies those ideas to a control circuit where the
          learner can see how a gate signal becomes a real load-switching
          action.
        </p>

        <p>
          That makes lesson 13 an important transition from pure device theory
          to practical electronic design thinking.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to read this circuit is to follow one chain of logic.
        </p>

        <p>
          Control switch closes, gate rises, VGS crosses threshold, NMOS turns
          on, the return path completes, and the LED lights.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an NMOS low-side switch lets a small gate-control
          action control a larger load path cleanly and predictably.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>This project uses an N-channel MOSFET as a low-side load switch.</li>
          <li>The MOSFET controls the ground-return path of the LED load loop.</li>
          <li>Closing the control switch raises gate voltage and increases VGS.</li>
          <li>The pull-down resistor keeps the gate safely near source level when control is open.</li>
          <li>The LED resistor limits current while the MOSFET controls switching.</li>
          <li>VGS, not gate voltage alone, determines whether the NMOS turns on.</li>
          <li>This lesson connects MOSFET theory to practical switching design.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
