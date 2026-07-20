"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getPhotodiodeState } from "./logic";

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
  const sample = getPhotodiodeState(1000, 5, 100, 0.45, 7.5, true);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a photodiode?",
      answer:
        "A photodiode is a light-sensitive semiconductor diode that converts incoming light into electrical current.",
    },
    {
      question: "Why is reverse bias commonly used in photodiodes?",
      answer:
        "Reverse bias widens the depletion region and helps collect light-generated carriers more effectively for sensing.",
    },
    {
      question: "What is photocurrent?",
      answer:
        "Photocurrent is the current created when light generates electron-hole pairs inside the photodiode junction.",
    },
    {
      question: "What is dark current?",
      answer:
        "Dark current is the small current that still flows in reverse bias even when no light is present.",
    },
    {
      question: "How does load resistance affect the output voltage?",
      answer:
        "A larger load resistance converts the sensor current into a larger output voltage, up to the circuit limits.",
    },
    {
      question: "Why do responsivity and active area matter?",
      answer:
        "They affect how much light power is converted into current, so higher responsivity or larger area usually increases the signal.",
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
              Photodiode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A photodiode senses light by converting optical energy into a
              measurable electrical current, usually while operating in reverse bias.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on light-generated carriers, photocurrent,
              dark current, reverse-bias sensing, and how the load turns sensor
              current into a useful output voltage.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              It is one of the most important semiconductor sensors for detecting light.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Photocurrent" value={`${sample.photocurrentUA.toFixed(2)} uA`} tone="emerald" />
            <ValueCard label="Dark Current" value={`${sample.darkCurrentUA.toFixed(2)} uA`} tone="amber" />
            <ValueCard label="Output Voltage" value={`${sample.outputVoltage.toFixed(2)} V`} tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a photodiode?" eyebrow="Core Concept">
        <p>
          A photodiode is a semiconductor diode designed to detect light.
        </p>

        <p>
          When light falls on its junction, the device produces electrical
          carriers that can be measured as current.
        </p>

        <p>
          This makes a photodiode a sensor rather than just an ordinary rectifying diode.
        </p>
      </SectionCard>

      <SectionCard title="Why is reverse bias usually preferred?" eyebrow="Sensing Mode">
        <p>
          In photodiode applications, reverse bias is commonly used because it
          widens the depletion region.
        </p>

        <p>
          A wider depletion region improves carrier collection and makes the
          device respond more effectively to incoming light.
        </p>

        <p>
          That is why reverse-biased operation is the standard sensing mode in
          most light-detection circuits.
        </p>
      </SectionCard>

      <SectionCard title="How does light create current?" eyebrow="Carrier Generation">
        <p>
          Incoming photons create electron-hole pairs inside or near the junction.
        </p>

        <p>
          The electric field in the reverse-biased depletion region separates
          those carriers and drives them in opposite directions.
        </p>

        <p>
          That carrier movement appears externally as photocurrent.
        </p>

        <p>
          <strong>
            Checkpoint Question: If the light level increases, what should
            happen to the number of generated carriers and the photocurrent?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="What is dark current?" eyebrow="No-Light Behavior">
        <p>
          Even with no light present, a reverse-biased photodiode still has a
          very small current.
        </p>

        <p>
          That small leakage-like current is called dark current.
        </p>

        <p>
          Dark current matters because it sets part of the minimum signal floor
          of the sensor.
        </p>
      </SectionCard>

      <SectionCard title="What is photocurrent?" eyebrow="Signal Output">
        <p>
          Photocurrent is the additional current generated because of light.
        </p>

        <p>
          In a sensing application, we usually care about how photocurrent
          changes with light level.
        </p>

        <p>
          More light generally produces more photocurrent, until practical
          limits such as saturation begin to matter.
        </p>
      </SectionCard>

      <SectionCard title="Why do responsivity and active area matter?" eyebrow="Sensor Strength">
        <p>
          Responsivity tells us how effectively optical power is converted into
          electrical current.
        </p>

        <p>
          Active area determines how much of the incoming light the sensor can
          intercept.
        </p>

        <p>
          Higher responsivity or a larger active area usually increases the
          generated photocurrent.
        </p>
      </SectionCard>

      <SectionCard title="How does the load resistor create output voltage?" eyebrow="Current-To-Voltage">
        <p>
          The photodiode mainly produces current, but many circuits need a
          voltage output.
        </p>

        <p>
          A load resistor converts the photodiode current into a voltage by
          Ohm's law.
        </p>

        <p>
          A larger load resistor can raise the output voltage for the same
          current, though only within the circuit's available bias limits.
        </p>
      </SectionCard>

      <SectionCard title="What changes in forward bias?" eyebrow="Comparison Mode">
        <p>
          In forward bias, the device behaves more like a normal conducting diode.
        </p>

        <p>
          Light can still influence the current somewhat, but the circuit is no
          longer operating in its most useful sensing mode.
        </p>

        <p>
          That is why photodiodes are mainly discussed as reverse-biased sensors.
        </p>
      </SectionCard>

      <SectionCard title="Main practical rule" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to understand a photodiode is to think of it as a
          light-controlled current source around a diode junction.
        </p>

        <p>
          Light creates carriers, reverse bias helps collect them, and the load
          resistor turns the resulting current into voltage.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: more light usually means more photocurrent, and
          the circuit converts that current into a measurable output signal.
        </p>
      </SectionCard>

      <SectionCard title="Real-world example" eyebrow="Application Insight">
        <p>
          Photodiodes are used in light sensors, optical receivers, counters,
          remote detection systems, and many automatic control circuits.
        </p>

        <p>
          They are especially useful when a circuit must respond quickly and
          predictably to changes in light intensity.
        </p>

        <p>
          This lesson mirrors that idea by showing how light level, bias, and
          load shape the final electrical output.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A photodiode is a light-sensitive semiconductor sensor.</li>
          <li>Reverse bias is commonly used for sensing.</li>
          <li>Light creates electron-hole pairs and produces photocurrent.</li>
          <li>Dark current exists even without light.</li>
          <li>Responsivity and active area affect signal strength.</li>
          <li>A load resistor converts sensor current into output voltage.</li>
          <li>Forward bias is less useful for normal photodiode sensing.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
