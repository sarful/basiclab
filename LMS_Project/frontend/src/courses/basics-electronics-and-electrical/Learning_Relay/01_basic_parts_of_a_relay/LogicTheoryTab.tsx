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
      question: "What is the first big idea of this relay lesson?",
      answer:
        "The lesson teaches the physical parts of a relay, especially the coil terminals, common terminal, normally closed contact, and normally open contact.",
    },
    {
      question: "Why are A1 and A2 important?",
      answer:
        "A1 and A2 are the coil terminals. When the coil is energized through them, the relay changes the state of its switching contacts.",
    },
    {
      question: "What does COM mean in relay contact language?",
      answer:
        "COM means common terminal. It is the moving contact point that connects either to NC or to NO depending on whether the relay coil is off or on.",
    },
    {
      question: "What is the simplest difference between NC and NO?",
      answer:
        "NC is connected to COM in the normal resting state, while NO connects to COM only after the relay coil is energized.",
    },
    {
      question: "Why is the package sketch useful for beginners?",
      answer:
        "Because it helps learners connect the printed outer relay body with the internal terminal meaning and contact behavior.",
    },
    {
      question: "Why is this lesson important before relay working principle?",
      answer:
        "Because learners need to identify the relay parts and terminals first before they can clearly understand how the coil and contacts operate together.",
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
              Basic Parts of a Relay
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson introduces the basic physical parts of a relay so the
              learner can identify the coil terminals and contact terminals
              before studying full relay operation.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main beginner goal is simple: know what A1, A2, COM, NC, and
              NO mean, and see how those names connect to the real relay package.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes lesson 1 the foundation for all later relay lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Coil Pins" value="A1 / A2" tone="emerald" />
            <ValueCard label="Moving Contact" value="COM" tone="violet" />
            <ValueCard label="States" value="NC / NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is the relay body showing us?" eyebrow="Physical Package">
        <p>
          A relay package is not just a plastic box. It is the outer form that
          contains the coil system and the switching contact mechanism.
        </p>

        <p>
          In beginner learning, the package sketch helps connect printed labels
          and terminal locations with the actual internal switching idea.
        </p>

        <p>
          This is why the lesson begins with physical identification before deep
          theory.
        </p>
      </SectionCard>

      <SectionCard title="What are A1 and A2?" eyebrow="Coil Terminals">
        <p>
          A1 and A2 are the two relay coil terminals.
        </p>

        <p>
          When voltage is applied across these coil pins, the relay coil becomes
          energized and creates the magnetic action that changes the contacts.
        </p>

        <p>
          So A1 and A2 belong to the control side of the relay.
        </p>
      </SectionCard>

      <SectionCard title="What does COM mean?" eyebrow="Common Contact">
        <p>
          COM stands for common terminal.
        </p>

        <p>
          It is the moving contact point that can connect to different contact
          paths depending on whether the relay coil is at rest or energized.
        </p>

        <p>
          This makes COM the key switching terminal in many relay diagrams.
        </p>
      </SectionCard>

      <SectionCard title="What do NC and NO mean?" eyebrow="Contact States">
        <p>
          NC means normally closed, and NO means normally open.
        </p>

        <p>
          Normally means the default state when the relay coil is not energized.
        </p>

        <p>
          In that resting state, COM is connected to NC, while NO remains open
          until the relay is energized.
        </p>
      </SectionCard>

      <SectionCard title="Why is 'normal state' important?" eyebrow="Rest Position">
        <p>
          Many beginners misunderstand NC and NO because they think these words
          describe permanent wiring.
        </p>

        <p>
          Actually, NC and NO describe the contact condition in the relay's
          normal, unpowered state.
        </p>

        <p>
          Once the coil is powered, the contact relationship changes.
        </p>
      </SectionCard>

      <SectionCard title="How do the contact parts relate to switching?" eyebrow="Control Side vs Load Side">
        <p>
          The relay coil side and the contact side do different jobs.
        </p>

        <p>
          The coil side receives the control signal, and the contact side opens
          or closes another circuit path.
        </p>

        <p>
          This separation is one of the most useful practical ideas in relay
          control systems.
        </p>
      </SectionCard>

      <SectionCard title="Why are multiple visual views useful?" eyebrow="Package, Terminal, Sketch">
        <p>
          The Songle package sketch, 3D terminal map, and AC relay power sketch
          all teach the same relay from different angles.
        </p>

        <p>
          One view helps with external package recognition, one helps with pin
          mapping, and one helps connect the relay to practical circuit use.
        </p>

        <p>
          Together they turn labels into real understanding.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important before relay working principle?" eyebrow="Learning Order">
        <p>
          Before studying how a relay works, the learner must first recognize
          the relay's basic parts and terminals.
        </p>

        <p>
          If the names A1, A2, COM, NC, and NO are not clear, later relay logic
          becomes much harder to follow.
        </p>

        <p>
          That is why this lesson is the proper first step.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember relay basics is to separate the relay into
          two sides.
        </p>

        <p>
          A1 and A2 belong to the coil control side, while COM, NC, and NO
          belong to the switching contact side.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: first learn the relay's names and terminals, then
          the working principle becomes much easier to understand.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A relay package contains both the coil system and the switching contacts.</li>
          <li>A1 and A2 are the coil terminals.</li>
          <li>COM is the common moving contact terminal.</li>
          <li>NC is connected in the normal resting state.</li>
          <li>NO connects after the relay coil is energized.</li>
          <li>The coil side controls the relay, while the contact side switches another circuit.</li>
          <li>This lesson builds the vocabulary needed for all later relay lessons.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
