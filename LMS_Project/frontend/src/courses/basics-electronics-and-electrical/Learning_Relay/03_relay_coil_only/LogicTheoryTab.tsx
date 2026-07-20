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
      question: "What is the main idea of the relay coil-only lesson?",
      answer:
        "This lesson isolates the coil section so the learner can understand how the relay coil behaves before adding the full contact-switching story.",
    },
    {
      question: "Why study the coil by itself?",
      answer:
        "Because the coil is the control side of the relay, and understanding its electrical behavior first makes full relay operation easier to follow.",
    },
    {
      question: "What happens when current flows through the relay coil?",
      answer:
        "The coil creates a magnetic field, which is the first step in producing the relay's mechanical movement.",
    },
    {
      question: "What is the relation between the coil and electromagnetism?",
      answer:
        "The relay coil acts like an electromagnet when energized, converting electrical input into magnetic force.",
    },
    {
      question: "Why is this lesson simpler than full relay working principle?",
      answer:
        "Because it focuses only on the coil side and magnetic action, without requiring the learner to track every contact change at the same time.",
    },
    {
      question: "Why is this lesson useful before more advanced relay circuits?",
      answer:
        "Because many relay control circuits begin with the basic question of how the coil is energized and what that energizing action does.",
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
              Relay Coil Only
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson focuses only on the relay coil so the learner can
              understand the control side of the relay before dealing with full
              contact switching.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key beginner idea is that the coil is the part that receives
              electrical input and turns that input into magnetic force.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              By learning the coil separately, the whole relay becomes easier to
              understand later.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Relay Side" value="Control Side" tone="emerald" />
            <ValueCard label="Main Action" value="Magnetic Field" tone="violet" />
            <ValueCard label="Electrical Input" value="Coil Current" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why isolate the relay coil?" eyebrow="Focused Learning">
        <p>
          A full relay contains both the coil system and the switching contacts,
          but beginners often understand the topic faster when the coil is
          studied first on its own.
        </p>

        <p>
          This lesson removes some contact complexity so the learner can focus
          only on what the coil does.
        </p>

        <p>
          That makes the first electromagnetic idea much clearer.
        </p>
      </SectionCard>

      <SectionCard title="What is the relay coil?" eyebrow="Core Part">
        <p>
          The relay coil is a wound conductor section inside the relay.
        </p>

        <p>
          It receives electrical input from the control side and responds by
          producing magnetic effect.
        </p>

        <p>
          This is the part that begins relay action.
        </p>
      </SectionCard>

      <SectionCard title="What happens when current flows in the coil?" eyebrow="Magnetic Effect">
        <p>
          When current flows through the relay coil, a magnetic field is
          created.
        </p>

        <p>
          This magnetic field is the first physical force that makes a relay
          useful as an electromechanical device.
        </p>

        <p>
          Without coil current, that magnetic action does not appear.
        </p>
      </SectionCard>

      <SectionCard title="Why is the relay coil called an electromagnet?" eyebrow="Electrical to Magnetic">
        <p>
          A relay coil behaves like an electromagnet because electrical input
          causes it to produce magnetic force.
        </p>

        <p>
          This is the bridge between the relay's electrical side and its later
          mechanical switching side.
        </p>

        <p>
          That is why the coil is the real starting point of relay operation.
        </p>
      </SectionCard>

      <SectionCard title="What does coil energizing mean?" eyebrow="Powered State">
        <p>
          Coil energizing simply means the relay coil is receiving enough
          electrical input to become active.
        </p>

        <p>
          In that energized state, the coil can create the magnetic condition
          needed for relay motion.
        </p>

        <p>
          In an unenergized state, the relay remains in its default rest
          condition.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson simpler than full relay working principle?" eyebrow="Reduced Complexity">
        <p>
          In the full working principle, the learner has to track coil current,
          magnetic field, armature motion, and contact changes together.
        </p>

        <p>
          This lesson reduces that load by keeping the focus on the coil and
          magnetic behavior alone.
        </p>

        <p>
          That helps build a strong first layer of understanding.
        </p>
      </SectionCard>

      <SectionCard title="How does the coil relate to later relay switching?" eyebrow="Next Step Connection">
        <p>
          The coil does not switch the external circuit directly by itself, but
          it creates the magnetic action that later causes the relay's moving
          parts to change contact position.
        </p>

        <p>
          So even though this lesson studies only the coil, it still prepares
          the learner for the complete switching story.
        </p>

        <p>
          This makes it an important foundation lesson.
        </p>
      </SectionCard>

      <SectionCard title="Why does this matter in practical control circuits?" eyebrow="Real Use">
        <p>
          Many practical relay circuits are first designed around the question
          of how to energize the coil safely and reliably.
        </p>

        <p>
          Once the coil behavior is clear, later topics such as relay driving,
          transistor control, and power switching become easier to design.
        </p>

        <p>
          This is why the coil deserves its own lesson.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The easiest way to remember this lesson is to treat the relay coil as
          the relay's control engine.
        </p>

        <p>
          Electrical current enters the coil, the coil creates magnetic force,
          and that force becomes the basis for later relay action.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: understand the relay coil first, and the rest of
          the relay's switching behavior becomes much easier to understand.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>The relay coil belongs to the control side of the relay.</li>
          <li>Current through the coil creates a magnetic field.</li>
          <li>The energized coil behaves like an electromagnet.</li>
          <li>Coil energizing is the beginning of relay action.</li>
          <li>This lesson simplifies relay learning by isolating the coil behavior.</li>
          <li>Understanding the coil prepares the learner for full relay working principle.</li>
          <li>Many practical relay circuits begin with coil-control design.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
