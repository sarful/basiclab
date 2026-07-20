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
      question: "What is an enhancement MOSFET in simple terms?",
      answer:
        "It is a MOSFET that needs enough gate voltage above threshold before a strong conduction channel is formed.",
    },
    {
      question: "What happens below threshold voltage?",
      answer:
        "The MOSFET stays off because the conductive channel is not yet formed strongly enough.",
    },
    {
      question: "Why is threshold shown as its own region in this lesson?",
      answer:
        "Because it helps learners see the transition point where the MOSFET begins moving from off behavior toward conduction.",
    },
    {
      question: "What does channel formation mean here?",
      answer:
        "It means the gate field is becoming strong enough to build a useful conduction path between drain and source.",
    },
    {
      question: "What is the linear region?",
      answer:
        "The MOSFET is on and conducting through a controllable channel while drain voltage is still below the saturation-region boundary.",
    },
    {
      question: "What is the saturation region in this enhancement MOSFET lesson?",
      answer:
        "It is the region reached when the drain-voltage condition crosses the boundary set by gate overdrive, so the channel no longer behaves like the simpler linear case.",
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
              Enhancement MOSFET Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how an enhancement MOSFET turns on only after
              sufficient gate voltage creates a usable channel between drain and
              source.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main idea is that conduction develops in stages: OFF,
              threshold, channel formation, linear region, and saturation
              region.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This gives learners a more detailed view of MOSFET turn-on than a
              simple OFF and ON explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="Enhancement MOSFET" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="VGS Above VTH" tone="violet" />
            <ValueCard label="Core Process" value="Channel Formation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What makes an enhancement MOSFET special?" eyebrow="Core Concept">
        <p>
          An enhancement MOSFET does not begin with a strongly conducting channel
          already ready for use.
        </p>

        <p>
          Instead, the gate voltage must build the channel strongly enough before
          useful drain current can flow.
        </p>

        <p>
          That is why the word <em>enhancement</em> is important in this topic.
        </p>
      </SectionCard>

      <SectionCard title="What happens in the OFF state?" eyebrow="No Channel">
        <p>
          In the OFF state, gate voltage is below the threshold needed for useful
          channel formation.
        </p>

        <p>
          Because the channel is not properly formed, drain current remains
          effectively absent for practical use.
        </p>

        <p>
          This is the open-path condition of the enhancement MOSFET.
        </p>
      </SectionCard>

      <SectionCard title="Why is threshold treated separately?" eyebrow="Turn-On Boundary">
        <p>
          Threshold is the region where the MOSFET is just beginning to move
          away from off behavior.
        </p>

        <p>
          This region is worth showing separately because it helps learners see
          that turn-on starts gradually, not magically at one instant.
        </p>

        <p>
          It is the first important transition between no useful channel and
          meaningful channel development.
        </p>
      </SectionCard>

      <SectionCard title="What does channel formation mean?" eyebrow="Developing Conduction">
        <p>
          Channel formation means the gate field is becoming strong enough to
          create a practical conduction path between drain and source.
        </p>

        <p>
          The stronger the channel becomes, the more easily drain current can
          move through the device.
        </p>

        <p>
          This is one of the most important visual ideas in the enhancement
          MOSFET lesson.
        </p>
      </SectionCard>

      <SectionCard title="What is the linear region?" eyebrow="Controlled Channel Region">
        <p>
          In the linear region, the MOSFET has a usable channel and is
          conducting.
        </p>

        <p>
          Here the drain-source path behaves like a controllable conduction path
          while the drain-voltage condition is still below the saturation-region
          boundary.
        </p>

        <p>
          This region is often the easier practical switching region for
          beginners to recognize.
        </p>
      </SectionCard>

      <SectionCard title="What is the saturation region here?" eyebrow="Region Change">
        <p>
          The saturation region appears when the drain-voltage condition becomes
          high enough relative to gate overdrive.
        </p>

        <p>
          At that point, the MOSFET is no longer behaving like the simpler
          linear-region conduction case.
        </p>

        <p>
          This is another reminder that MOSFET region names describe how the
          device is operating, not just whether it is on or off.
        </p>
      </SectionCard>

      <SectionCard title="Why do threshold voltage and temperature both matter?" eyebrow="Real Device Behavior">
        <p>
          The channel is influenced not only by gate voltage, but also by device
          conditions such as threshold setting and temperature.
        </p>

        <p>
          Temperature can weaken channel strength, and threshold voltage changes
          the point where meaningful conduction begins.
        </p>

        <p>
          That is why this lesson treats the MOSFET like a real device, not just
          a perfect switch symbol.
        </p>
      </SectionCard>

      <SectionCard title="Why do drain voltage and load matter?" eyebrow="Circuit Interaction">
        <p>
          Even with a strong gate signal, the MOSFET still interacts with the
          external circuit.
        </p>

        <p>
          Drain voltage and load resistance affect how much drain current can
          actually flow.
        </p>

        <p>
          This is why the final operating region depends on both device control
          and circuit conditions.
        </p>
      </SectionCard>

      <SectionCard title="What is the main beginner rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand this lesson is to follow one sequence.
        </p>

        <p>
          Gate voltage rises, threshold is crossed, the channel forms, drain
          current increases, and the MOSFET moves through its operating regions.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an enhancement MOSFET does not simply “already
          have a path” that gets opened. The gate voltage must build that path
          strongly enough first.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>An enhancement MOSFET needs enough gate voltage to build its channel.</li>
          <li>Below threshold, the MOSFET stays effectively off.</li>
          <li>Threshold is the beginning of meaningful turn-on behavior.</li>
          <li>Channel formation means the drain-source path is becoming usable.</li>
          <li>Linear region is the controllable channel-conduction region.</li>
          <li>Saturation region happens after the drain-voltage boundary is crossed.</li>
          <li>Temperature, threshold, drain voltage, and load all affect operation.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
