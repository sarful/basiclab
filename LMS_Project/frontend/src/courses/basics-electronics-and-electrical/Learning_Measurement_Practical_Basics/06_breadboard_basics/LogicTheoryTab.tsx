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
      question: "Are A-E in the same numbered column internally connected on this breadboard?",
      answer:
        "Yes. A-E in the same numbered column form one internal terminal-strip group.",
    },
    {
      question: "Are E20 and F20 internally connected without a jumper?",
      answer:
        "No. The center gap separates the top and bottom halves, so a jumper is required to bridge them.",
    },
    {
      question: "Does a power rail automatically feed the terminal strip below it?",
      answer:
        "No. The power rail is separate until you add a jumper wire from the rail to the terminal strip.",
    },
    {
      question: "Why do breadboard coordinates like A8 or C30 matter?",
      answer:
        "They identify the exact hole position so you can understand which holes are internally connected and where a jumper must go.",
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
              Breadboard Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A breadboard is a practice board that lets you build and test
              circuits without soldering, but only if you understand which
              holes are already connected inside.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is built around one practical idea: breadboards are
              not random grids. Internal connection groups, power rails, and
              the center gap control where electricity can and cannot travel.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Top Group" value="A-E" tone="emerald" />
            <ValueCard label="Bottom Group" value="F-J" tone="slate" />
            <ValueCard label="Gap Rule" value="Needs Jumper" tone="rose" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a breadboard?" eyebrow="Core Concept">
        <p>
          A breadboard is a reusable board for building temporary electronic
          circuits without soldering.
        </p>
        <p>
          Components and jumper wires are placed into holes, and the internal
          metal strips connect certain holes together automatically.
        </p>
        <p>
          The key learning goal is not just placing parts into holes. It is
          understanding which holes are already connected and which ones are
          still separate.
        </p>
      </SectionCard>

      <SectionCard title="Why breadboard logic matters" eyebrow="Why It Matters">
        <p>
          Beginners often assume every nearby hole is connected, but that is
          not how a breadboard works.
        </p>
        <p>Practical circuit work depends on questions like these:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Which holes share one internal strip?</li>
          <li>Which holes are separated by the center gap?</li>
          <li>When does a jumper wire become necessary?</li>
          <li>Does a power rail already feed the nearby terminal row, or do I need to wire it?</li>
        </ul>
        <p>
          If you understand those rules, you can place wires with purpose
          instead of trial and error.
        </p>
      </SectionCard>

      <SectionCard title="Internal terminal groups" eyebrow="Connection Logic">
        <p>
          In this lesson, the holes <strong>A-E</strong> in the same numbered
          column form one internal connection group on the top half.
        </p>
        <p>
          The holes <strong>F-J</strong> in the same numbered column form a
          separate internal connection group on the bottom half.
        </p>
        <p>
          That means A8, B8, C8, D8, and E8 are already connected internally.
        </p>
        <p>
          But those top-half holes are not internally connected to F8, G8, H8,
          I8, or J8 below the center gap.
        </p>
      </SectionCard>

      <SectionCard title="What the center gap does" eyebrow="Critical Structure">
        <p>
          The center gap breaks the connection between the top terminal strip
          and the bottom terminal strip.
        </p>
        <p>
          So even if two holes share the same column number, they may still be
          electrically separate if one is above the gap and one is below it.
        </p>
        <p>
          In this lesson, <strong>E20</strong> and <strong>F20</strong> are a
          perfect example. They line up in the same column, but they are not
          connected unless you add a jumper.
        </p>
      </SectionCard>

      <SectionCard title="How power rails work" eyebrow="Power Distribution">
        <p>
          Power rails are long distribution lines used to carry supply voltage
          and ground across the board.
        </p>
        <p>
          A power rail can feed many points, but it is still separate from the
          terminal strips until you connect them with a jumper wire.
        </p>
        <p>
          So connecting a rail hole like <strong>Top + rail 8</strong> to a
          hole such as A8 is a deliberate wiring step, not an automatic
          built-in connection.
        </p>
      </SectionCard>

      <SectionCard title="Why coordinates matter" eyebrow="Reading the Board">
        <p>
          Breadboard coordinates such as A8, C30, or F20 tell you the exact
          hole location.
        </p>
        <p>
          The row letter and column number together help you judge whether two
          holes belong to the same internal group or different groups.
        </p>
        <p>
          Good breadboard work depends on reading coordinates carefully rather
          than guessing based on visual closeness.
        </p>
      </SectionCard>

      <SectionCard title="When a jumper wire is needed" eyebrow="Practical Rule">
        <p>
          A jumper wire is required when you want to connect two holes that are
          not already linked by the breadboard's internal metal strips.
        </p>
        <p>
          For example, A8 to A14 needs a jumper because those columns are
          separate.
        </p>
        <p>
          A power rail to a terminal row also needs a jumper because the rail
          and the row are separate systems.
        </p>
        <p>
          And the center gap must be crossed with a jumper whenever the circuit
          needs to continue from the top half to the bottom half.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="High Priority">
        <p>
          Do not assume holes in the same row letter are automatically
          connected across different columns.
        </p>
        <p>
          Do not assume the power rail already feeds the nearby terminal strip.
        </p>
        <p>
          Do not assume the center gap can be ignored just because two holes
          share the same column number.
        </p>
        <p>
          And do not add a jumper where holes are already internally connected,
          because that wire does no real job.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A-E in one numbered column are internally connected on the top half.</li>
          <li>F-J in one numbered column are internally connected on the bottom half.</li>
          <li>The center gap separates the top and bottom halves.</li>
          <li>Power rails are separate from terminal strips until you add a jumper.</li>
          <li>Breadboard coordinates help you choose the correct connection points.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these questions to lock in the core breadboard rules.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
