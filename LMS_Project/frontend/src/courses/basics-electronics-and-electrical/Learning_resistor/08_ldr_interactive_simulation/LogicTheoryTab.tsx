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
      question: "What does LDR stand for?",
      answer:
        "LDR stands for Light Dependent Resistor.",
    },
    {
      question: "What happens to an LDR in bright light?",
      answer:
        "In bright light the LDR resistance becomes low.",
    },
    {
      question: "What happens to an LDR in darkness?",
      answer:
        "In darkness the LDR resistance becomes very high.",
    },
    {
      question: "Why is an LDR often used in a voltage divider circuit?",
      answer:
        "Because changing the LDR resistance changes the voltage-divider output, which makes light level easier to measure and use for control decisions.",
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
              LDR
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              An LDR is a light-sensitive resistor whose resistance changes as
              the amount of light on its surface changes.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on how light intensity affects resistance,
              why brighter light usually lowers LDR resistance, and how that
              change influences voltage-divider output and circuit current.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Variable" value="Light Intensity" tone="emerald" />
            <ValueCard label="Key Change" value="Resistance" tone="sky" />
            <ValueCard label="Circuit Use" value="Sensing / Control" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What an LDR is" eyebrow="Foundation">
        <p>
          LDR stands for Light Dependent Resistor.
        </p>
        <p>
          It is a resistor whose value changes according to the amount of light
          falling on it.
        </p>
        <p>
          That makes it useful when a circuit needs to detect brightness or
          react automatically to changing light conditions.
        </p>
      </SectionCard>

      <SectionCard title="How light changes resistance" eyebrow="Core Behavior">
        <p>
          The main idea of an LDR is simple: more light usually means lower
          resistance, while less light means higher resistance.
        </p>
        <p>
          In bright conditions the LDR allows current to flow more easily.
        </p>
        <p>
          In darkness the resistance rises sharply, so the circuit behaves very
          differently.
        </p>
      </SectionCard>

      <SectionCard title="Why LDRs are light sensors" eyebrow="Sensor Role">
        <p>
          An LDR converts a change in brightness into a change in electrical
          resistance.
        </p>
        <p>
          That means light can be turned into a measurable circuit response
          without needing a mechanical switch.
        </p>
        <p>
          This is why LDRs are popular in simple sensing and automation
          circuits.
        </p>
      </SectionCard>

      <SectionCard title="Voltage divider behavior" eyebrow="Circuit Logic">
        <p>
          LDRs are often used with a fixed resistor in a voltage divider.
        </p>
        <p>
          As the LDR resistance changes, the output voltage of the divider also
          changes.
        </p>
        <p>
          This makes the light level easier to feed into another part of the
          circuit for switching, monitoring, or control.
        </p>
      </SectionCard>

      <SectionCard title="How current changes" eyebrow="Ohm's Law">
        <p>
          When the LDR and fixed resistor form one current path, total
          resistance affects current flow.
        </p>
        <p>
          If light increases and LDR resistance falls, the total resistance can
          become smaller and current can increase.
        </p>
        <p>
          So the LDR changes both voltage behavior and current behavior in the
          circuit.
        </p>
      </SectionCard>

      <SectionCard title="How the simulator connects to theory" eyebrow="Live Logic">
        <p>
          The lesson 8 simulator lets you change light intensity, dark
          resistance, fixed resistor value, and supply voltage.
        </p>
        <p>
          As light level changes, the LDR resistance updates live.
        </p>
        <p>
          The lesson also shows voltage-divider output and current, so you can
          directly see how brightness changes circuit behavior.
        </p>
      </SectionCard>

      <SectionCard title="Where LDRs are used" eyebrow="Applications">
        <p>
          One classic example is the automatic street light.
        </p>
        <p>
          When the environment becomes dark, the circuit can detect that change
          and switch the lamp on automatically.
        </p>
        <p>
          LDRs are also used in brightness control, light sensor modules, and
          alarm systems.
        </p>
      </SectionCard>

      <SectionCard title="A limitation to remember" eyebrow="Practical Limits">
        <p>
          LDR response is usually slower and less precise than higher-end light
          sensors.
        </p>
        <p>
          That means it is useful for simple detection and automation, but not
          ideal for high-speed or high-precision sensing.
        </p>
        <p>
          Good design means choosing an LDR where simple light-based switching
          matters more than perfect speed and accuracy.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          One common mistake is thinking an LDR generates voltage by itself.
        </p>
        <p>
          In reality, the LDR changes resistance, and the circuit turns that
          resistance change into a voltage or current change.
        </p>
        <p>
          Another mistake is forgetting that the fixed resistor in the divider
          also affects the final output behavior.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>LDR means Light Dependent Resistor.</li>
          <li>More light usually lowers LDR resistance.</li>
          <li>Less light usually raises LDR resistance.</li>
          <li>LDRs are often used in voltage-divider sensing circuits.</li>
          <li>They are useful for automatic light-based control.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the LDR basics.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
