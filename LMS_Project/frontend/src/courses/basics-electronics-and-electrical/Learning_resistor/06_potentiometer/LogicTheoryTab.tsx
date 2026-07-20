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
      question: "What makes a potentiometer different from a fixed resistor?",
      answer:
        "A potentiometer is adjustable. Moving its wiper changes the output voltage or active resistance, while a fixed resistor keeps one value.",
    },
    {
      question: "Why is a potentiometer called a three-terminal variable resistor?",
      answer:
        "Because it has two end terminals and one movable wiper terminal that changes position along the resistive track.",
    },
    {
      question: "What is the difference between voltage divider mode and rheostat mode?",
      answer:
        "In voltage divider mode the potentiometer uses three terminals to provide an adjustable output voltage. In rheostat mode it uses two terminals to provide adjustable resistance.",
    },
    {
      question: "Why is a potentiometer useful in calibration and volume control?",
      answer:
        "Because the wiper position can be adjusted smoothly, which makes it easy to fine-tune voltage or resistance levels.",
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
              Potentiometer
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A potentiometer is a variable resistor with a movable wiper. It
              allows us to adjust voltage or resistance instead of keeping one
              fixed value all the time.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how a potentiometer works, what the wiper
              actually changes, and why voltage-divider mode and rheostat mode
              are both useful in practical circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Behavior" value="Adjustable Control" tone="emerald" />
            <ValueCard label="Key Part" value="Wiper" tone="sky" />
            <ValueCard label="Main Modes" value="Divider / Rheostat" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What a potentiometer is" eyebrow="Foundation">
        <p>
          A potentiometer is a three-terminal variable resistor.
        </p>
        <p>
          Unlike a fixed resistor, it does not force the circuit to use only
          one permanent value.
        </p>
        <p>
          Instead, the user can move a wiper across the resistive track, which
          changes how the component behaves inside the circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why the wiper matters" eyebrow="Control Element">
        <p>
          The most important moving part in a potentiometer is the wiper.
        </p>
        <p>
          As the wiper moves, it changes the ratio between the two sections of
          the resistive path.
        </p>
        <p>
          That is why a potentiometer can provide smooth adjustment instead of
          only fixed resistor values.
        </p>
      </SectionCard>

      <SectionCard title="Voltage divider mode" eyebrow="Three-Terminal Use">
        <p>
          In voltage divider mode, all three terminals are used.
        </p>
        <p>
          The potentiometer takes an input voltage and provides an adjustable
          output voltage at the wiper.
        </p>
        <p>
          The wiper position changes the output ratio, which makes this mode
          useful when we want controlled voltage adjustment.
        </p>
      </SectionCard>

      <SectionCard title="Rheostat mode" eyebrow="Two-Terminal Use">
        <p>
          In rheostat mode, the potentiometer is used like a two-terminal
          variable resistor.
        </p>
        <p>
          The wiper changes the active resistance in the circuit rather than
          directly providing a divided output voltage.
        </p>
        <p>
          This mode is useful when we want adjustable current control or a
          change in effective resistance.
        </p>
      </SectionCard>

      <SectionCard title="Why potentiometers are useful" eyebrow="Applications">
        <p>
          Potentiometers are useful because many circuits need manual
          adjustment rather than one locked value.
        </p>
        <p>
          Common examples include volume control, brightness adjustment,
          calibration, tuning, and setting reference levels.
        </p>
        <p>
          Their value comes from giving a simple mechanical way to fine-tune
          electrical behavior.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The simulator shows two important ideas at once.
        </p>
        <p>
          In voltage divider mode, moving the wiper changes the output voltage
          ratio.
        </p>
        <p>
          In rheostat mode, moving the wiper changes the active resistance and
          therefore changes current flow in the circuit.
        </p>
      </SectionCard>

      <SectionCard title="Why potentiometers are not the same as ordinary resistors" eyebrow="Comparison">
        <p>
          A fixed resistor is selected for stability, but a potentiometer is
          selected for adjustability.
        </p>
        <p>
          The potentiometer is valuable when we expect the user or technician
          to tune the circuit after it is built.
        </p>
        <p>
          That makes it especially useful in control panels, audio systems, and
          calibration circuits.
        </p>
      </SectionCard>

      <SectionCard title="Limitations to remember" eyebrow="Practical Limits">
        <p>
          A potentiometer has moving mechanical parts, so wear can happen over
          time.
        </p>
        <p>
          It is also not the best choice for heavy power loads compared with
          parts designed for stronger heat handling.
        </p>
        <p>
          Good design means using potentiometers where smooth adjustment is
          needed, not where heavy-duty power dissipation is the main goal.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          One common mistake is thinking a potentiometer is only for changing
          volume.
        </p>
        <p>
          Another mistake is forgetting that the same component can be used in
          two different ways: voltage divider mode and rheostat mode.
        </p>
        <p>
          Students also often forget that the wiper position changes a ratio,
          not just a number on a dial.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A potentiometer is a three-terminal variable resistor.</li>
          <li>The wiper is the moving part that changes circuit behavior.</li>
          <li>It can work in voltage divider mode or rheostat mode.</li>
          <li>It is useful for volume control, calibration, and adjustable settings.</li>
          <li>Its strength is adjustability, not heavy power handling.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the potentiometer basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
