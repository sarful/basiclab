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
      question: "What is the focus of this lesson?",
      answer:
        "This lesson explains how a relay coil controls a single-pole single-throw normally open contact and how that contact changes state when the coil is energized.",
    },
    {
      question: "What does SPST NO mean?",
      answer:
        "SPST NO means single-pole single-throw normally open, so the contact path is open in the relay's normal unenergized state.",
    },
    {
      question: "What happens before coil energizing?",
      answer:
        "Before the relay coil is energized, the SPST NO contact stays open, so current cannot pass through that contact path.",
    },
    {
      question: "What happens after the relay coil is energized?",
      answer:
        "After energizing, the relay mechanism moves and closes the normally open contact, allowing the path to conduct.",
    },
    {
      question: "Why is SPST NO important for beginners?",
      answer:
        "Because it shows the most common relay idea: a control signal energizes the coil and creates a new output connection.",
    },
    {
      question: "How is SPST NO different from SPST NC?",
      answer:
        "SPST NO starts open and closes after energizing, while SPST NC starts closed and opens after energizing.",
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
              Relay Coil with SPST NO
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a relay coil controls a single-pole
              single-throw normally open contact.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is simple: in the normal state the contact
              path is open, and after the coil is energized the path closes.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes SPST NO one of the clearest first examples of relay
              output control.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPST NO" tone="emerald" />
            <ValueCard label="Normal State" value="Open Path" tone="violet" />
            <ValueCard label="Coil Effect" value="Closes Contact" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does SPST NO mean?" eyebrow="Contact Name">
        <p>
          SPST means single-pole single-throw, which describes a very simple
          one-path switching arrangement.
        </p>

        <p>
          NO means normally open, so the contact path is open when the relay is
          unenergized.
        </p>

        <p>
          Together, SPST NO describes a contact that connects only after coil
          activation.
        </p>
      </SectionCard>

      <SectionCard title="What happens in the normal state?" eyebrow="Default Condition">
        <p>
          In the normal unenergized state, the SPST NO contact remains open.
        </p>

        <p>
          Because the path is open, current cannot flow through that contact
          route by default.
        </p>

        <p>
          This default-open behavior is the core idea learners should remember.
        </p>
      </SectionCard>

      <SectionCard title="What changes after the coil is energized?" eyebrow="Closing Action">
        <p>
          When the relay coil is energized, magnetic force moves the internal
          switching part of the relay.
        </p>

        <p>
          In an SPST NO contact, that movement closes the contact path.
        </p>

        <p>
          As a result, the previously disconnected route becomes active.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important after SPST NC?" eyebrow="Direct Comparison">
        <p>
          SPST NC shows a default closed path that opens after energizing.
        </p>

        <p>
          SPST NO shows the opposite behavior: it starts open and closes after
          energizing.
        </p>

        <p>
          Learning both gives a strong foundation for understanding relay
          contact logic.
        </p>
      </SectionCard>

      <SectionCard title="Why is SPST NO common in control circuits?" eyebrow="Practical Relevance">
        <p>
          SPST NO is useful when an output should remain off until a control
          signal activates the relay coil.
        </p>

        <p>
          This is one of the most common relay behaviors in automation and
          electrical control systems.
        </p>

        <p>
          That is why this contact type is a key lesson for beginners.
        </p>
      </SectionCard>

      <SectionCard title="What role does the coil play here?" eyebrow="Coil as Control Trigger">
        <p>
          The coil is the control input that causes the contact to change
          state.
        </p>

        <p>
          Without coil energizing, the NO contact stays open and the output path
          remains disconnected.
        </p>

        <p>
          So the coil acts as the switch-triggering mechanism of the relay.
        </p>
      </SectionCard>

      <SectionCard title="What is the simplest way to remember SPST NO?" eyebrow="Formula-Free Idea">
        <p>
          The easiest memory rule is to track the contact before and after coil
          energizing.
        </p>

        <p>
          Before energizing, the path is open. After energizing, the path
          closes.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an SPST NO relay contact creates a connection
          only when the relay coil becomes active.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPST NO means single-pole single-throw normally open.</li>
          <li>The contact path stays open in the default state.</li>
          <li>Coil energizing closes the contact path.</li>
          <li>This is the opposite behavior of SPST NC.</li>
          <li>SPST NO is very common in practical control circuits.</li>
          <li>The coil acts as the trigger for output connection.</li>
          <li>This lesson builds a strong relay contact-state foundation.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
