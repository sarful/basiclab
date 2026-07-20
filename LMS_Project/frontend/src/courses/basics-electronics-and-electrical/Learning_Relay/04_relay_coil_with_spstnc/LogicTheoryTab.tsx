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
      question: "What is the main idea of a relay coil with SPST NC contact?",
      answer:
        "This lesson combines the relay coil with a single-pole single-throw normally closed contact, so the learner can see how one simple contact path behaves before and after energizing.",
    },
    {
      question: "What does SPST NC mean?",
      answer:
        "It means a single-pole single-throw contact that is normally closed in the relay's default, unenergized state.",
    },
    {
      question: "What happens in the normal state?",
      answer:
        "In the unenergized state, the NC contact remains closed, so the circuit path through that contact is available by default.",
    },
    {
      question: "What happens after the relay coil is energized?",
      answer:
        "The armature moves, and the normally closed path opens, interrupting that contact route.",
    },
    {
      question: "Why is this lesson simpler than COM-NC-NO changeover study?",
      answer:
        "Because it focuses on one simple normally closed switching path instead of asking the learner to track both NC and NO outputs at the same time.",
    },
    {
      question: "Why is this lesson useful in practical control circuits?",
      answer:
        "Because normally closed relay contacts are often used where a circuit must stay connected by default and open only when the coil is energized.",
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
              Relay Coil with SPST NC
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a relay coil works together with a
              single-pole single-throw normally closed contact.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that the contact path is closed in the
              normal state and opens after the coil is energized.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the lesson a simple introduction to default-closed
              relay control behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPST NC" tone="emerald" />
            <ValueCard label="Normal State" value="Closed Path" tone="violet" />
            <ValueCard label="Coil Effect" value="Opens Contact" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What does SPST NC mean?" eyebrow="Contact Name">
        <p>
          SPST means single-pole single-throw, which describes a simple one-path
          switching arrangement.
        </p>

        <p>
          NC means normally closed, so the contact path is closed in the relay's
          unenergized default state.
        </p>

        <p>
          Together, this gives a very clear first example of a default-closed
          relay contact.
        </p>
      </SectionCard>

      <SectionCard title="What happens before the coil is energized?" eyebrow="Default Path">
        <p>
          Before the relay coil is energized, the contact stays in its normal
          closed position.
        </p>

        <p>
          That means the electrical path through the contact is available by
          default.
        </p>

        <p>
          This is the most important starting idea for an NC relay contact.
        </p>
      </SectionCard>

      <SectionCard title="What changes after coil energizing?" eyebrow="Opening Action">
        <p>
          When the relay coil is energized, the relay's internal moving part
          changes position.
        </p>

        <p>
          In this SPST NC case, that movement opens the normally closed contact
          path.
        </p>

        <p>
          So the previously connected route becomes interrupted.
        </p>
      </SectionCard>

      <SectionCard title="Why is this different from an NO contact?" eyebrow="Default Condition Contrast">
        <p>
          An NO contact starts open and becomes connected only after the relay
          is energized.
        </p>

        <p>
          An NC contact does the opposite: it begins connected and then opens
          after coil energizing.
        </p>

        <p>
          This opposite behavior is one of the most important beginner relay
          comparisons.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson simpler than a full changeover relay?" eyebrow="Reduced Switching Complexity">
        <p>
          A changeover relay asks the learner to track COM, NC, and NO together.
        </p>

        <p>
          This lesson is easier because it focuses on one simple normally closed
          path only.
        </p>

        <p>
          That makes the contact-state idea easier to understand before more
          advanced relay contact systems.
        </p>
      </SectionCard>

      <SectionCard title="Why is the relay coil still important here?" eyebrow="Coil as Trigger">
        <p>
          Even though the lesson focuses on an NC contact, the coil is still the
          trigger that causes the contact to change.
        </p>

        <p>
          Without coil energizing, the contact stays in its normal closed state.
        </p>

        <p>
          So this lesson still reinforces that the coil is the control engine of
          relay action.
        </p>
      </SectionCard>

      <SectionCard title="Where is SPST NC useful in practice?" eyebrow="Practical Use">
        <p>
          SPST NC relay contacts are useful when a circuit should remain
          connected in the normal state and disconnect only during coil
          activation.
        </p>

        <p>
          This kind of behavior can be helpful in safety, default-pass, or
          fail-state control ideas.
        </p>

        <p>
          So the lesson is not only academic; it connects directly to control
          logic design.
        </p>
      </SectionCard>

      <SectionCard title="Why does this lesson matter after the relay coil lesson?" eyebrow="Learning Progression">
        <p>
          The relay coil lesson teaches how magnetic action begins.
        </p>

        <p>
          This lesson adds one simple contact behavior and shows the result of
          coil action on a real relay output path.
        </p>

        <p>
          That makes it a natural next step in relay learning.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember SPST NC relay behavior is to track one
          sentence.
        </p>

        <p>
          In the normal state the path is closed, and after coil energizing the
          path opens.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an SPST NC relay contact gives a default closed
          path that opens only when the relay coil becomes active.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPST NC means single-pole single-throw normally closed.</li>
          <li>The contact path is closed in the default unenergized state.</li>
          <li>Coil energizing causes the NC path to open.</li>
          <li>This behavior is the opposite of a normally open contact.</li>
          <li>The lesson is simpler than full COM-NC-NO changeover switching.</li>
          <li>The coil still acts as the control trigger for contact change.</li>
          <li>This lesson introduces practical default-closed relay control behavior.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
