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
      question: "What is the most important structural difference between a JFET and a MOSFET?",
      answer:
        "A JFET uses a PN-junction gate that directly touches semiconductor regions, while a MOSFET uses an insulated gate separated by oxide.",
    },
    {
      question: "Why is MOSFET input resistance usually higher than JFET input resistance?",
      answer:
        "Because the MOSFET gate is oxide insulated, so gate current is almost zero, whereas a JFET gate still behaves as a reverse-biased junction with small leakage.",
    },
    {
      question: "How is channel existence different in JFET and enhancement MOSFET?",
      answer:
        "A JFET already has a channel by default, while an enhancement MOSFET starts without a usable channel and must create one by gate field action.",
    },
    {
      question: "Why is a JFET often compared more closely with a depletion MOSFET than an enhancement MOSFET?",
      answer:
        "Because both JFET and depletion MOSFET begin with an existing channel and are normally on in their basic starting condition.",
    },
    {
      question: "What is the control mechanism difference?",
      answer:
        "A JFET mainly controls current by widening depletion regions in a PN-junction structure, while a MOSFET uses electric field action through an insulated gate.",
    },
    {
      question: "Why is this comparison lesson useful after learning JFET and MOSFET separately?",
      answer:
        "Because it turns isolated facts into a side-by-side understanding of how gate structure, channel behavior, and input characteristics differ across transistor families.",
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
              JFET vs MOSFET Difference
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson compares JFET and MOSFET families side by side so
              learners can clearly see how gate structure, channel behavior,
              and control method differ.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Instead of treating JFET and MOSFET as just two names, this
              topic explains why their construction produces different input
              behavior, different control logic, and different default channel
              states.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              That makes lesson 16 an important summary lesson across field
              effect transistor families.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Comparison" value="JFET vs MOSFET" tone="emerald" />
            <ValueCard label="Gate Contrast" value="Junction vs Oxide" tone="violet" />
            <ValueCard label="Channel Story" value="Existing vs Created" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why compare JFET and MOSFET together?" eyebrow="Big Picture">
        <p>
          JFET and MOSFET both belong to the field effect transistor family,
          but they are not built or controlled in the same way.
        </p>

        <p>
          A side-by-side comparison helps learners understand why they behave
          differently instead of memorizing them as unrelated definitions.
        </p>

        <p>
          This lesson turns separate transistor topics into one connected view.
        </p>
      </SectionCard>

      <SectionCard title="What is the biggest construction difference?" eyebrow="Gate Structure">
        <p>
          The biggest structural difference is the gate itself.
        </p>

        <p>
          A JFET uses a PN-junction gate that touches semiconductor regions,
          while a MOSFET uses a metal gate insulated from the semiconductor by
          an oxide layer.
        </p>

        <p>
          This one design difference explains many of the practical behavior
          differences that follow.
        </p>
      </SectionCard>

      <SectionCard title="How is channel existence different?" eyebrow="Starting Condition">
        <p>
          A JFET begins with an existing channel, so it is naturally understood
          as a normally on style device in its basic starting condition.
        </p>

        <p>
          An enhancement MOSFET starts without a usable channel and must create
          one by electric field action.
        </p>

        <p>
          A depletion MOSFET sits between these comparison ideas because it also
          begins with an existing channel, but still uses an insulated gate.
        </p>
      </SectionCard>

      <SectionCard title="How is the control mechanism different?" eyebrow="Channel Control">
        <p>
          A JFET mainly controls current by changing depletion regions inside a
          PN-junction structure.
        </p>

        <p>
          A MOSFET controls current through electric field action produced by an
          insulated gate.
        </p>

        <p>
          That is why a MOSFET story naturally includes oxide, field effect,
          and channel creation or channel modification more explicitly.
        </p>
      </SectionCard>

      <SectionCard title="Why is MOSFET input resistance usually higher?" eyebrow="Input Behavior">
        <p>
          Since a MOSFET gate is insulated by oxide, almost no gate current is
          needed in normal operation.
        </p>

        <p>
          A JFET gate is still a junction, so although it is reverse biased and
          draws very little current, it is not as ideally isolated as a MOSFET
          gate.
        </p>

        <p>
          This is why MOSFET input resistance is usually described as very high
          or extremely high compared with JFET.
        </p>
      </SectionCard>

      <SectionCard title="Why is JFET often compared with depletion MOSFET?" eyebrow="Closer Match">
        <p>
          JFET and depletion MOSFET are often compared because both begin with
          an existing channel in their starting state.
        </p>

        <p>
          That makes them both feel more naturally normally on than enhancement
          MOSFET devices.
        </p>

        <p>
          The key difference is that the JFET still uses a junction gate, while
          the depletion MOSFET keeps the insulated MOS gate structure.
        </p>
      </SectionCard>

      <SectionCard title="What makes enhancement MOSFET the odd contrast here?" eyebrow="Created Channel">
        <p>
          Enhancement MOSFET stands out because it does not begin with a ready
          conduction channel.
        </p>

        <p>
          Instead, the gate field must create a usable inversion channel before
          meaningful conduction can begin.
        </p>

        <p>
          This gives a much stronger contrast against the JFET than depletion
          MOSFET does.
        </p>
      </SectionCard>

      <SectionCard title="Why does the lesson compare carrier flow and current direction too?" eyebrow="Visualization">
        <p>
          Device structure becomes easier to understand when learners can also
          watch how current and carriers move through the channel.
        </p>

        <p>
          Comparing carrier flow and conventional current helps connect physical
          transistor behavior with standard circuit language.
        </p>

        <p>
          That is especially useful in a comparison simulator where the same
          control idea is being examined across different devices.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner takeaway?" eyebrow="Formula-Free Idea">
        <p>
          The simplest way to compare these devices is to ask three questions.
        </p>

        <p>
          Does the channel already exist, what kind of gate structure is used,
          and how is the channel being controlled?
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: JFET means junction-gate control of an existing
          channel, while MOSFET means insulated-gate field control that either
          creates or modifies the channel.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>JFET and MOSFET are both field effect transistors but use different gate structures.</li>
          <li>JFET uses a PN-junction gate, while MOSFET uses an oxide-insulated gate.</li>
          <li>JFET begins with an existing channel, while enhancement MOSFET must create one.</li>
          <li>Depletion MOSFET is closer to JFET in starting channel behavior, but not in gate construction.</li>
          <li>MOSFET input resistance is usually higher because the gate is better insulated.</li>
          <li>JFET controls current through depletion-region behavior, while MOSFET relies on electric field control.</li>
          <li>This lesson connects construction, control, and input behavior into one comparison view.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
