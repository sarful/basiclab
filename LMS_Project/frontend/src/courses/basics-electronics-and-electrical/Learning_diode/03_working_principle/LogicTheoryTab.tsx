"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getWorkingState } from "./logic";

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
  const forwardVoltage = 3;
  const reverseVoltage = 12;
  const forwardState = getWorkingState("forward", forwardVoltage);
  const reverseState = getWorkingState("reverse", reverseVoltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What forms when P-type and N-type materials are joined?",
      answer:
        "A PN junction forms, along with a depletion region and an internal barrier.",
    },
    {
      question: "Why does a depletion region appear?",
      answer:
        "It appears because carriers diffuse and recombine near the junction, leaving behind charged ions.",
    },
    {
      question: "What happens in forward bias?",
      answer:
        "Forward bias reduces the barrier, allowing current to flow once the voltage is high enough.",
    },
    {
      question: "What happens in reverse bias?",
      answer:
        "Reverse bias widens the barrier and blocks the main current path.",
    },
    {
      question: "Why is about 0.7 V important here?",
      answer:
        "It is the typical silicon forward threshold used in this lesson to show when conduction begins.",
    },
    {
      question: "Why is the diode called a one-way device?",
      answer:
        "Because its junction structure strongly favors current flow in one direction over the other.",
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
              Diode Working Principle
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A diode works because a PN junction forms a barrier that can be
              reduced in forward bias and strengthened in reverse bias.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson connects three ideas: how the diode is built, how the
              junction forms, and how bias changes current flow.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Once the junction logic is clear, the diode’s one-way behavior
              becomes much easier to understand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Threshold" value={`${forwardState.threshold.toFixed(1)} V`} tone="violet" />
            <ValueCard
              label="Forward State"
              value={forwardState.isConducting ? "Conducting" : "Blocked"}
              tone="emerald"
            />
            <ValueCard
              label="Reverse State"
              value={reverseState.isConducting ? "Conducting" : "Blocked"}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="How does the diode begin?" eyebrow="Construction">
        <p>
          A diode starts with two different semiconductor regions: P-type and
          N-type material.
        </p>

        <p>
          The P-type side has holes as the main carriers, while the N-type side
          has electrons as the main carriers.
        </p>

        <p>
          When these two regions are joined, the basic structure needed for
          directional current control is created.
        </p>
      </SectionCard>

      <SectionCard title="How does the junction form?" eyebrow="Formation">
        <p>
          After the P-type and N-type materials touch, carriers begin to diffuse
          across the boundary.
        </p>

        <p>
          Some electrons and holes recombine near the junction, which leaves
          behind fixed charged ions.
        </p>

        <p>
          This creates the depletion region and the internal electric barrier
          that resists further easy carrier motion.
        </p>

        <p>
          <strong>
            Checkpoint Question: If carriers recombine near the junction and
            leave a carrier-poor region behind, what region is being formed?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What happens in forward bias?" eyebrow="Forward Bias">
        <p>
          Forward bias pushes the P-side and N-side in a direction that reduces
          the junction barrier.
        </p>

        <p>
          When the applied voltage becomes high enough, carriers can cross the
          junction much more easily and current begins to flow.
        </p>

        <p>
          In this lesson model, forward conduction is shown when the voltage
          reaches about <strong>{forwardState.threshold.toFixed(1)} V</strong>{" "}
          or higher.
        </p>
      </SectionCard>

      <SectionCard title="What happens in reverse bias?" eyebrow="Reverse Bias">
        <p>
          Reverse bias does the opposite. It increases the barrier and widens
          the depletion region.
        </p>

        <p>
          That makes it much harder for the main current to pass through the
          junction.
        </p>

        <p>
          This is why the diode behaves like a blocker in the reverse direction
          during normal operation.
        </p>
      </SectionCard>

      <SectionCard title="Why is the diode one-way?" eyebrow="Working Logic">
        <p>
          The diode is called a one-way device because its PN junction does not
          react the same way in both polarities.
        </p>

        <p>
          One polarity lowers the barrier and supports conduction. The other
          polarity raises the barrier and blocks the main current path.
        </p>

        <p>
          So the one-way effect comes from the junction physics, not from a
          mechanical switch.
        </p>
      </SectionCard>

      <SectionCard title="Why is 0.7 V mentioned so often?" eyebrow="Threshold Idea">
        <p>
          In many basic silicon-diode examples, about <strong>0.7 V</strong> is
          used as a practical turn-on threshold.
        </p>

        <p>
          Below that level, normal forward conduction is still weak in this
          simplified lesson model.
        </p>

        <p>
          Above that level, the diode is treated as conducting much more
          clearly.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember diode working principle is to think in
          three stages.
        </p>

        <p>
          First, P-type and N-type materials create a junction. Second, the
          junction forms a depletion barrier. Third, the applied bias either
          lowers or raises that barrier.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: if the bias reduces the barrier, current can flow;
          if the bias strengthens the barrier, the main current path is blocked.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a rectifier circuit, the diode allows current through during the
          forward condition and blocks it during the reverse condition.
        </p>

        <p>
          That simple one-way control is possible only because of the PN
          junction working principle explained here.
        </p>

        <p>
          So this lesson is the foundation behind many practical diode uses.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A diode is built from P-type and N-type semiconductor regions.</li>
          <li>When they join, a PN junction forms.</li>
          <li>Carrier diffusion and recombination create a depletion region.</li>
          <li>Forward bias reduces the barrier and supports conduction.</li>
          <li>Reverse bias increases the barrier and blocks the main current.</li>
          <li>About 0.7 V is used here as a practical silicon threshold.</li>
          <li>The diode’s one-way behavior comes from junction physics.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
