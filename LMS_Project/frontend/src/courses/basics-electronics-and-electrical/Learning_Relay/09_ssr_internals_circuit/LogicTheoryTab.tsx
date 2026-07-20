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
      question: "What is the focus of the SSR internals circuit lesson?",
      answer:
        "This lesson focuses on the internal operating structure of an SSR and how the internal circuit connects the input control stage to the output switching stage.",
    },
    {
      question: "Why study SSR internals after learning what SSR is?",
      answer:
        "Because after knowing that SSR switches electronically, the next step is understanding which internal sections perform that switching job.",
    },
    {
      question: "What internal blocks are usually important in an SSR?",
      answer:
        "The learner usually needs to notice the input stage, opto-isolation stage, triggering section, and output power switching section.",
    },
    {
      question: "Why is opto-isolation important?",
      answer:
        "Opto-isolation helps transfer the control signal to the switching side while keeping electrical isolation between input and output.",
    },
    {
      question: "What is the difference between the internals view and the with-circuit view?",
      answer:
        "The internals view explains the parts inside the SSR, while the with-circuit view shows how that SSR fits into a real control and load connection.",
    },
    {
      question: "What is the main beginner takeaway?",
      answer:
        "An SSR is not a simple black box; it contains several electronic stages that work together to isolate, trigger, and switch the load.",
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
              SSR Internals Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains the internal operating sections of a solid
              state relay and how those sections work together.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that an SSR contains multiple electronic stages,
              not just one switching element.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Understanding those stages makes the external circuit behavior much
              easier to follow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Focus" value="Internal Blocks" tone="emerald" />
            <ValueCard label="Key Isolation" value="Opto Stage" tone="violet" />
            <ValueCard label="Output Action" value="Electronic Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why study SSR internals?" eyebrow="Learning Progression">
        <p>
          The earlier SSR lesson explains that a solid state relay switches
          electronically instead of using mechanical contacts.
        </p>

        <p>
          This lesson goes one step deeper and shows the internal circuit idea
          behind that switching behavior.
        </p>

        <p>
          It helps the learner move from a surface-level definition to a working
          internal understanding.
        </p>
      </SectionCard>

      <SectionCard title="What internal sections matter most?" eyebrow="Block Overview">
        <p>
          In a basic SSR explanation, the most important internal sections are
          the input stage, isolation stage, trigger stage, and output switching
          stage.
        </p>

        <p>
          Each stage has its own job in receiving, isolating, and passing the
          switching action.
        </p>

        <p>
          Seeing the relay in blocks makes the internal circuit easier to learn.
        </p>
      </SectionCard>

      <SectionCard title="What does the input stage do?" eyebrow="Control Entry">
        <p>
          The input stage receives the control signal from the low-power side of
          the circuit.
        </p>

        <p>
          That signal begins the process that eventually turns the load side on
          or off.
        </p>

        <p>
          So the input stage is the entry point of the SSR control action.
        </p>
      </SectionCard>

      <SectionCard title="Why is opto-isolation important?" eyebrow="Isolation Concept">
        <p>
          Opto-isolation allows the control signal to influence the output side
          without a direct electrical connection between the two sides.
        </p>

        <p>
          This improves safety and protects the low-power control section from
          the load side.
        </p>

        <p>
          It is one of the most important concepts in SSR internal design.
        </p>
      </SectionCard>

      <SectionCard title="What does the output stage do?" eyebrow="Load Switching">
        <p>
          The output stage is the part that actually controls load current on
          the load side.
        </p>

        <p>
          Instead of moving a contact, it uses electronic power switching
          devices to allow or stop current flow.
        </p>

        <p>
          This is why SSR switching is fast and silent.
        </p>
      </SectionCard>

      <SectionCard title="Why does the lesson show two views?" eyebrow="Internals vs Circuit">
        <p>
          The internals view helps the learner understand what is happening
          inside the SSR package.
        </p>

        <p>
          The with-circuit view helps the learner understand how that same SSR
          behaves in a real connection with control input and load output.
        </p>

        <p>
          Together, the two views connect theory with application.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest rule is to think of SSR internals as a chain of stages.
        </p>

        <p>
          Input signal enters, isolation transfers control safely, and output
          electronics switch the load.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an SSR works through internal electronic blocks
          that receive the signal, isolate the control side, and switch the load
          side.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>This lesson explains the internal structure of an SSR.</li>
          <li>SSR operation can be understood as multiple electronic stages.</li>
          <li>The input stage receives the control signal.</li>
          <li>Opto-isolation separates control side and load side.</li>
          <li>The output stage performs the actual load switching.</li>
          <li>The internals view and with-circuit view support each other.</li>
          <li>The main learner goal is understanding the SSR as a working internal system.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
