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
      question: "Why is the internal material of a resistor important?",
      answer:
        "Because the material affects resistance stability, heat behavior, noise, precision, and how the resistor performs under electrical stress.",
    },
    {
      question: "What is the role of the ceramic core in many resistors?",
      answer:
        "The ceramic core supports the resistive element, helps manage heat, and gives the resistor mechanical strength.",
    },
    {
      question: "Why can two resistors with similar values behave differently in practice?",
      answer:
        "Because their construction style and material type can change tolerance, temperature drift, noise, and power handling.",
    },
    {
      question: "Why does heat matter in resistor structure?",
      answer:
        "Because rising temperature can change resistance, increase stress, and reduce long-term reliability if the design or material is not suitable.",
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
              Resistor Structure
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A resistor is not just an ohm value. It is a physical structure
              made from specific materials and layers that determine how it
              handles current, heat, stability, and precision.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson focuses on the construction logic behind the
              component: what is inside a resistor, why material choice matters,
              and how structure affects performance in real circuits.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Idea" value="Built in Layers" tone="emerald" />
            <ValueCard label="Main Variable" value="Material Type" tone="sky" />
            <ValueCard label="Big Concern" value="Heat Stress" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why resistor structure matters" eyebrow="Big Picture">
        <p>
          Many beginners treat a resistor as a single simple part, but inside
          the component there is a real physical structure.
        </p>
        <p>
          That structure determines how the resistor produces resistance, how
          it responds to temperature, and how well it survives electrical
          stress over time.
        </p>
        <p>
          So when we study resistor structure, we are really studying why one
          resistor behaves differently from another even if both seem to have a
          similar resistance value.
        </p>
      </SectionCard>

      <SectionCard title="Main parts inside a resistor" eyebrow="Internal Anatomy">
        <p>A practical resistor usually includes several functional parts.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>The resistive element that opposes current flow.</li>
          <li>The core, often ceramic, that supports the structure.</li>
          <li>The outer body or coating that provides insulation and protection.</li>
          <li>The metal leads or terminals that connect the resistor into a circuit.</li>
        </ul>
        <p>
          Each part plays a different role, but together they create a stable
          component that can resist current in a predictable way.
        </p>
      </SectionCard>

      <SectionCard title="What the resistive element really does" eyebrow="Electrical Job">
        <p>
          The resistive element is the heart of the resistor.
        </p>
        <p>
          This is the part where moving charge faces opposition, causing a
          voltage drop and converting some electrical energy into heat.
        </p>
        <p>
          The geometry, thickness, and material of that element all influence
          the final resistance value and performance.
        </p>
      </SectionCard>

      <SectionCard title="Why the ceramic core matters" eyebrow="Mechanical Support">
        <p>
          The core is not only there to hold the resistor together.
        </p>
        <p>
          In many designs, the ceramic core provides thermal stability,
          electrical insulation, and physical support for the resistive
          material wrapped around or placed on it.
        </p>
        <p>
          That is why the simulator highlights structure, not just numbers.
          Good resistor behavior depends on the internal body as well as the
          resistance value.
        </p>
      </SectionCard>

      <SectionCard title="How material choice changes behavior" eyebrow="Material Science">
        <p>
          Different resistor materials do not behave the same way.
        </p>
        <p>
          Carbon composition resistors are older and can show more noise and
          more drift under heat.
        </p>
        <p>
          Metal film resistors are usually more precise, more stable, and
          better for accuracy-focused applications.
        </p>
        <p>
          Wire-wound resistors are strong in power handling and heat tolerance,
          but their structure can introduce other practical effects such as
          inductive behavior.
        </p>
      </SectionCard>

      <SectionCard title="Why heat changes resistor performance" eyebrow="Thermal Logic">
        <p>
          A resistor converts part of electrical energy into heat, so
          temperature naturally becomes part of resistor behavior.
        </p>
        <p>
          As temperature rises, the resistance may shift depending on the
          material and its temperature coefficient.
        </p>
        <p>
          This is why the simulator connects material, temperature, current,
          and power into one learning model instead of treating them as separate
          ideas.
        </p>
      </SectionCard>

      <SectionCard title="Why power handling depends on structure" eyebrow="Safe Operation">
        <p>
          Power handling is not just a printed rating. It depends on how the
          resistor is physically built to manage heat.
        </p>
        <p>
          A structure that handles heat well can remain stable for longer,
          while a weaker structure can drift, overheat, or fail when stress is
          too high.
        </p>
        <p>
          So resistor structure directly affects reliability and safety in real
          circuits.
        </p>
      </SectionCard>

      <SectionCard title="Why visualizing structure helps learning" eyebrow="Learning Value">
        <p>
          Students often understand resistor theory faster when they can see
          the internal build instead of only reading formulas.
        </p>
        <p>
          A cutaway or exploded view helps connect three ideas at once:
          physical construction, electrical resistance, and heat flow.
        </p>
        <p>
          That is why this lesson uses structure modes and material comparison
          instead of only a numeric slider exercise.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner misunderstandings" eyebrow="Watch Out">
        <p>
          Do not assume all resistors with the same ohm value behave exactly
          the same in every situation.
        </p>
        <p>
          Do not ignore material type when accuracy, noise, or heat tolerance
          matters.
        </p>
        <p>
          Do not think the body of a resistor is just packaging. Its structure
          affects stability, durability, and thermal performance.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A resistor has a real internal structure, not just an ohm label.</li>
          <li>The resistive element is where electrical opposition happens.</li>
          <li>The core and body help with support, insulation, and heat behavior.</li>
          <li>Material choice changes precision, drift, noise, and power handling.</li>
          <li>Temperature and structure strongly affect real-world performance.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the structure ideas before moving on.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
