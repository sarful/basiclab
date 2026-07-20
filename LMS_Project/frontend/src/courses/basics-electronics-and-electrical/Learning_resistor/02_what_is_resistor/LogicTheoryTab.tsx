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
  tone: "emerald" | "slate" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "slate"
        ? "border-slate-200 bg-slate-50 text-slate-800"
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
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-rose-300" />
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
      question: "What is the main job of a resistor in a circuit?",
      answer:
        "A resistor opposes current flow, helping control how much current can move through the circuit.",
    },
    {
      question: "Why does a resistor create a voltage drop?",
      answer:
        "Because electrical energy is used across the resistor while it limits current, so part of the supply voltage appears across it.",
    },
    {
      question: "What usually happens to current when resistance becomes smaller?",
      answer:
        "Current usually increases, because lower resistance allows more electrical flow for the same voltage.",
    },
    {
      question: "Why does resistor power rating matter?",
      answer:
        "Because the resistor converts electrical energy into heat, and the power rating tells us how much heat it can safely handle.",
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
              What is Resistor
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A resistor is a component that opposes electrical current, helping
              a circuit control flow, reduce voltage, and turn part of that
              energy into heat.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is built around one practical idea: a resistor is not
              just a part with an ohm value. It protects components, limits
              current, creates voltage drop, and must be chosen with a safe
              power rating.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Job" value="Limit Current" tone="emerald" />
            <ValueCard label="Circuit Effect" value="Voltage Drop" tone="slate" />
            <ValueCard label="Energy Result" value="Heat" tone="rose" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a resistor?" eyebrow="Core Concept">
        <p>
          A resistor is an electronic component that opposes the flow of
          electric current.
        </p>
        <p>
          In simple language, it makes current flow harder, so the circuit does
          not receive unlimited current from the source.
        </p>
        <p>
          That is why a resistor is often used to protect parts, control
          current, and shape how voltage is shared in a circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why a resistor matters" eyebrow="Why It Matters">
        <p>
          Without resistance, many circuits would allow too much current to
          flow.
        </p>
        <p>That leads to practical questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>How can we protect an LED from too much current?</li>
          <li>How do we reduce current in a simple DC path?</li>
          <li>Why does a resistor heat up when current flows through it?</li>
          <li>Why does the output voltage after a resistor become smaller?</li>
        </ul>
        <p>
          This is why resistors are one of the most common control components
          in electronics.
        </p>
      </SectionCard>

      <SectionCard title="How a resistor limits current" eyebrow="Flow Control">
        <p>
          Current depends on both voltage and resistance.
        </p>
        <p>
          If the supply voltage stays the same and resistance becomes smaller,
          more current can flow.
        </p>
        <p>
          If resistance becomes larger, current becomes smaller.
        </p>
        <p>
          So the resistor acts like a flow-control component in the electrical
          path.
        </p>
      </SectionCard>

      <SectionCard title="Why voltage drops across a resistor" eyebrow="Voltage Logic">
        <p>
          When current moves through a resistor, part of the source voltage
          appears across that resistor.
        </p>
        <p>
          That is why the simulator shows a resistor voltage drop and a smaller
          output voltage after the resistor.
        </p>
        <p>
          In a basic resistor-only path, the resistor can drop most or all of
          the input voltage depending on the circuit arrangement.
        </p>
      </SectionCard>

      <SectionCard title="How a resistor protects an LED" eyebrow="Practical Use">
        <p>
          In LED mode, the resistor is placed in series with the LED to keep
          current at a safer level.
        </p>
        <p>
          The LED already has its own forward voltage, so the resistor takes
          the remaining voltage and limits the current.
        </p>
        <p>
          Without the resistor, the LED could receive too much current and be
          damaged.
        </p>
      </SectionCard>

      <SectionCard title="Why a resistor gets hot" eyebrow="Energy Conversion">
        <p>
          A resistor does not destroy energy. It converts part of the
          electrical energy into heat.
        </p>
        <p>
          That is why the lesson visual shows electrical energy entering the
          resistor and heat energy leaving it.
        </p>
        <p>
          The more power the resistor handles, the more heating becomes a
          practical concern.
        </p>
      </SectionCard>

      <SectionCard title="Why power rating matters" eyebrow="Safety First">
        <p>
          Every resistor has a power rating such as 1/8W, 1/4W, 1/2W, or
          larger.
        </p>
        <p>
          This rating tells us how much power the resistor can safely handle as
          heat.
        </p>
        <p>
          If the circuit forces too much power into a resistor with too small a
          rating, the resistor can become too hot or fail.
        </p>
        <p>
          So resistor selection is not only about ohms. It is also about safe
          wattage.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="High Priority">
        <p>
          Do not think a resistor only has one job. It can limit current,
          create voltage drop, and convert energy into heat at the same time.
        </p>
        <p>
          Do not choose a resistor value without considering how current will
          change.
        </p>
        <p>
          Do not ignore the power rating when a resistor is dissipating heat.
        </p>
        <p>
          And do not assume the output voltage after a resistor stays equal to
          the input voltage.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A resistor opposes current flow.</li>
          <li>More resistance usually means less current.</li>
          <li>A resistor creates voltage drop across itself.</li>
          <li>A resistor converts part of electrical energy into heat.</li>
          <li>Power rating matters because heat must stay within a safe limit.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the core resistor ideas.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
