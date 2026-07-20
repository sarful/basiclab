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
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300" />
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
      question: "Where do you place the probes when measuring voltage?",
      answer:
        "Across two test points, such as battery plus and minus or V+ and GND.",
    },
    {
      question: "Which jack is normally unsafe for a voltage lesson setup?",
      answer:
        "The 10A current jack is the wrong place for the red lead during voltage measurement.",
    },
    {
      question: "What does a negative DC reading usually tell you?",
      answer:
        "It usually means the probes are reversed, not that the battery suddenly became AC.",
    },
    {
      question: "What is the mode family difference between a battery and a mains outlet?",
      answer:
        "A battery uses DC voltage mode, while a mains-style outlet uses AC voltage mode.",
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
              Measuring Voltage
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Measuring voltage means checking the electrical push between two
              points.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the main beginner habit is simple: choose the
              correct voltage family, keep the leads in the correct jacks, and
              place the probes across the two points you want to compare.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Red Lead" value="VΩmA" tone="sky" />
            <ValueCard label="Wrong Jack Risk" value="10A" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is voltage measurement?" eyebrow="Core Concept">
        <p>
          Voltage measurement checks the difference in electrical potential
          between two points.
        </p>
        <p>
          In simple language, it tells you how much electrical push exists from
          one point to another.
        </p>
        <p>
          That is why voltage is always measured <strong>across</strong> two
          points. You do not measure voltage by breaking the path and placing
          the meter in series.
        </p>
        <p>
          A battery plus and minus terminal, a DC supply V+ and GND, or an AC
          live and neutral pair are all examples of the two points needed for a
          voltage reading.
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Voltage measurement is often the first practical check in real
          troubleshooting.
        </p>
        <p>It helps answer questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Is the battery still providing usable power?</li>
          <li>Is a 12V supply really giving about 12V?</li>
          <li>Is mains-style AC present at the outlet or terminal?</li>
          <li>Did the source polarity stay the way we expected?</li>
        </ul>
        <p>
          If the voltage is missing, many later circuit tests will be confusing,
          because the source itself is already wrong or absent.
        </p>
      </SectionCard>

      <SectionCard
        title="Meter setup logic before touching the circuit"
        eyebrow="Setup Rules"
      >
        <p>
          <strong>Black lead:</strong> keep it in COM.
        </p>
        <p>
          <strong>Red lead:</strong> keep it in the normal voltage jack, usually
          marked VΩmA.
        </p>
        <p>
          <strong>Dial family:</strong> choose DCV for batteries and DC power
          supplies, or ACV for mains-style AC sources.
        </p>
        <p>
          <strong>Probe placement:</strong> place the probes across the two
          measurement points, not through the current path.
        </p>
        <p>
          The order matters because a good meter only helps when the dial, jack,
          and probe placement all match the job.
        </p>
      </SectionCard>

      <SectionCard title="DC voltage versus AC voltage" eyebrow="Mode Selection">
        <p>
          A <strong>9V battery</strong> and a <strong>12V DC supply</strong> are
          DC sources, so the meter should use a DC voltage range.
        </p>
        <p>
          A <strong>220V AC demo source</strong> is an AC source, so the meter
          should use an AC voltage range.
        </p>
        <p>
          Using the wrong family confuses the reading and teaches the wrong
          habit. A battery is not checked in ACV, and mains-style AC is not
          checked in DCV.
        </p>
        <p>
          This lesson focuses on recognizing the source first, then matching
          the dial family to that source.
        </p>
      </SectionCard>

      <SectionCard title="How to read the result" eyebrow="Reading Logic">
        <p>
          If the setup is correct and the probes touch the correct two points,
          the display shows the voltage difference.
        </p>
        <p>
          In the training scenarios, the battery reading is about{" "}
          <strong>9.0V</strong>, the DC supply is about <strong>12.0V</strong>,
          and the AC demo source is about <strong>220V</strong>.
        </p>
        <p>
          If you reverse the DC probes, the reading can become negative. That
          negative sign is useful feedback: it tells you the polarity is
          reversed.
        </p>
        <p>
          If both probes touch the same node, the reading should be near zero,
          because there is almost no voltage difference between the same point
          and itself.
        </p>
      </SectionCard>

      <SectionCard title="Safety mistakes to avoid" eyebrow="High Priority">
        <p>
          Never leave the red lead in the <strong>10A</strong> jack for a
          voltage test.
        </p>
        <p>
          Do not confuse voltage mode with current mode. Current measurement
          uses a different setup and is not taken across a source in the same
          way.
        </p>
        <p>
          Do not rush into AC measurement without checking the correct ACV range
          first.
        </p>
        <p>
          Beginner safety often comes down to one pause: verify the dial, verify
          the jacks, and then verify the probe targets.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage is measured across two points.</li>
          <li>The black lead stays in COM for this lesson.</li>
          <li>The red lead stays in the VΩmA jack for voltage practice.</li>
          <li>DC sources use DCV, and AC sources use ACV.</li>
          <li>A negative DC reading usually means the probes are reversed.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these short questions to confirm the lesson before moving on.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
