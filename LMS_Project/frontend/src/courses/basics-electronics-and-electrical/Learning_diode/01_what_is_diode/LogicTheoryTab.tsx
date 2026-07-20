"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  DIODE_CONSTANTS,
  getLedState,
  formatCurrent,
  formatPower,
} from "./logic";

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
  const forwardVoltage = 5;
  const reverseVoltage = 12;
  const forwardState = getLedState("forward", forwardVoltage);
  const reverseState = getLedState("reverse", reverseVoltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is the main job of a diode?",
      answer:
        "A diode mainly allows current to pass in one direction and blocks it in the opposite direction.",
    },
    {
      question: "What is forward bias?",
      answer:
        "Forward bias means the diode is connected so the external voltage helps current flow through the junction.",
    },
    {
      question: "What happens in reverse bias?",
      answer:
        "In reverse bias, the junction barrier becomes wider and the diode blocks the main current path.",
    },
    {
      question: "Why is 0.7 V important for a silicon diode in this lesson?",
      answer:
        "It is used as the typical forward turn-on threshold where the diode starts conducting normally.",
    },
    {
      question: "Why is a series resistor used with the LED and diode example?",
      answer:
        "The resistor limits current so the circuit stays safe and the diode is not overstressed.",
    },
    {
      question: "Does reverse bias mean absolutely zero current?",
      answer:
        "Not exactly. Tiny leakage current may still exist, but the main current path is blocked.",
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
              What Is a Diode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A diode is a semiconductor device that mainly lets current move in
              one direction and blocks it in the opposite direction.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              In this lesson, the key ideas are one-way conduction, forward
              bias, reverse bias, the typical 0.7 V silicon threshold, and why
              the LED turns on only in the correct condition.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Once these ideas are clear, many later diode topics become much
              easier to understand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Forward Threshold"
              value={`${DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP.toFixed(1)} V`}
              tone="violet"
            />
            <ValueCard
              label="Forward Current"
              value={formatCurrent(forwardState.estimatedCurrent)}
              tone="emerald"
            />
            <ValueCard
              label="Reverse Leakage"
              value={formatCurrent(reverseState.estimatedCurrent)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="What is a diode?" eyebrow="Core Concept">
        <p>
          A diode is an electronic component made from semiconductor material.
        </p>

        <p>
          Its most important behavior is directional current control: it prefers
          one current direction and opposes the other.
        </p>

        <p>
          Because of this one-way behavior, a diode is often described as an
          electrical one-way gate.
        </p>

        <p>
          <strong>
            Checkpoint Question: If a component allows current more easily in
            one direction than the other, what kind of component does that sound
            like?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What is forward bias?" eyebrow="Forward Bias">
        <p>
          Forward bias means the diode is connected so the external voltage helps
          carriers cross the junction barrier.
        </p>

        <p>
          In a silicon diode, normal conduction usually begins around{" "}
          <strong>{DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP.toFixed(1)} V</strong>.
        </p>

        <p>
          In this sample, at <strong>{forwardVoltage} V</strong> forward bias,
          the current is about <strong>{formatCurrent(forwardState.estimatedCurrent)}</strong>{" "}
          and the power in the diode is about{" "}
          <strong>{formatPower(forwardState.powerDissipation)}</strong>.
        </p>
      </SectionCard>

      <SectionCard title="What is reverse bias?" eyebrow="Reverse Bias">
        <p>
          Reverse bias means the polarity is flipped so the junction barrier
          becomes wider.
        </p>

        <p>
          In this condition, the diode blocks the main current path and the LED
          stays off.
        </p>

        <p>
          The lesson also shows that reverse bias does not always mean perfectly
          zero current. A tiny leakage current may still exist.
        </p>
      </SectionCard>

      <SectionCard title="Why does the LED turn on only sometimes?" eyebrow="Conduction Logic">
        <p>
          The LED turns on only when the diode is forward biased and the voltage
          is high enough to cross the forward threshold.
        </p>

        <p>
          If the voltage is below the threshold, the junction has not opened
          enough for normal conduction.
        </p>

        <p>
          If reverse bias is selected, the diode blocks the main path even if
          the voltage value itself is high.
        </p>
      </SectionCard>

      <SectionCard title="Why is a resistor used?" eyebrow="Circuit Protection">
        <p>
          The lesson circuit includes a series resistor of{" "}
          <strong>{DIODE_CONSTANTS.SERIES_RESISTANCE_OHMS} Ohm</strong>.
        </p>

        <p>
          This resistor limits current so the LED and diode do not draw too much
          current when conduction starts.
        </p>

        <p>
          Without current limiting, the diode circuit could be overstressed and
          damaged.
        </p>
      </SectionCard>

      <SectionCard title="Main ideas to remember" eyebrow="Practical Rules">
        <p>
          A diode is not just an on/off switch. Its behavior depends on both
          direction and voltage level.
        </p>

        <p>
          Forward bias plus enough voltage leads to conduction. Reverse bias
          blocks the main current path.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: before expecting a diode to conduct, always check
          the polarity direction and whether the forward threshold has been
          reached.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          In a simple LED indicator circuit, the diode direction matters because
          current must pass through the device the correct way for the LED to
          light.
        </p>

        <p>
          The same one-way behavior is also why diodes are used in rectifiers,
          protection circuits, and signal steering circuits.
        </p>

        <p>
          This first lesson gives the foundation for all of those later uses.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A diode mainly allows current in one direction.</li>
          <li>Forward bias supports conduction through the junction.</li>
          <li>Reverse bias blocks the main current path.</li>
          <li>A silicon diode often starts normal conduction near 0.7 V.</li>
          <li>The LED turns on only in the correct forward condition.</li>
          <li>A resistor is used to limit current and protect the circuit.</li>
          <li>Tiny leakage current may still exist in reverse bias.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
