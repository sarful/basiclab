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
      question: "What are the two main transistor families in this lesson?",
      answer:
        "They are BJT and FET, which are grouped separately because they use different control ideas.",
    },
    {
      question: "How is a BJT mainly controlled?",
      answer:
        "A BJT is mainly current controlled, where base drive influences collector current.",
    },
    {
      question: "How is a FET mainly controlled?",
      answer:
        "A FET is mainly controlled by an electric field at the gate, which affects conduction through the channel.",
    },
    {
      question: "What is the basic difference between NPN and PNP?",
      answer:
        "They belong to the BJT family, but they use opposite carrier emphasis and opposite symbol-arrow direction conventions.",
    },
    {
      question: "What is the main difference between JFET and MOSFET in this lesson?",
      answer:
        "Both are FETs, but JFET controls the channel through a junction field, while MOSFET uses an insulated gate field.",
    },
    {
      question: "Why compare N-channel and P-channel devices?",
      answer:
        "Because channel type changes carrier behavior and the usual current-flow direction description.",
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
              Transistor Types
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson compares the main transistor families and shows how
              different transistor types are grouped by control method and
              current-flow behavior.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The main idea is that not all transistors control conduction in
              the same way. Some are current controlled and some are field
              controlled.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This lesson helps learners move from “what is a transistor” to
              “what kind of transistor am I looking at?”
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Family 1" value="BJT" tone="emerald" />
            <ValueCard label="Family 2" value="FET" tone="violet" />
            <ValueCard label="Key Idea" value="Control Type" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Why study transistor types?" eyebrow="Core Concept">
        <p>
          The word transistor does not refer to only one exact device form.
        </p>

        <p>
          There are different transistor families and types, and each one has
          its own control behavior, symbol style, and current-flow logic.
        </p>

        <p>
          Learning the types helps prevent confusion when a circuit uses a
          device that is not the same as the one learned in the previous lesson.
        </p>
      </SectionCard>

      <SectionCard title="What is the difference between BJT and FET?" eyebrow="Two Families">
        <p>
          In this lesson, transistors are grouped mainly into{" "}
          <strong>BJT</strong> and <strong>FET</strong> families.
        </p>

        <p>
          A BJT is mainly taught as a current-controlled device, while a FET is
          mainly taught as a field-controlled device.
        </p>

        <p>
          This means the control idea changes depending on the family, even
          though both are still transistors.
        </p>
      </SectionCard>

      <SectionCard title="How does a BJT differ by type?" eyebrow="NPN And PNP">
        <p>
          Inside the BJT family, the lesson compares <strong>NPN</strong> and{" "}
          <strong>PNP</strong> transistors.
        </p>

        <p>
          Both are bipolar junction transistors, but their carrier emphasis and
          direction conventions are opposite in important ways.
        </p>

        <p>
          This is why the symbol arrow direction and current-flow explanation
          are not the same between NPN and PNP.
        </p>
      </SectionCard>

      <SectionCard title="How does a FET differ by type?" eyebrow="JFET And MOSFET">
        <p>
          Inside the FET family, the lesson compares <strong>JFET</strong> and{" "}
          <strong>MOSFET</strong>.
        </p>

        <p>
          A JFET controls conduction through a junction electric field, while a
          MOSFET uses an insulated gate field to influence the channel.
        </p>

        <p>
          So both belong to the FET family, but they are not identical in how
          control is established.
        </p>
      </SectionCard>

      <SectionCard title="Why compare N-channel and P-channel?" eyebrow="Channel Logic">
        <p>
          FETs are also divided by channel type, such as N-channel and
          P-channel.
        </p>

        <p>
          Channel type affects the majority carrier idea and the usual
          direction-based description of current flow.
        </p>

        <p>
          This helps the learner understand why two devices with similar shapes
          may still behave differently in a circuit.
        </p>
      </SectionCard>

      <SectionCard title="What is the main control comparison?" eyebrow="Control Behavior">
        <p>
          A beginner can summarize the lesson by asking one question first:
          <em> what controls the device?</em>
        </p>

        <p>
          For BJTs, the lesson emphasizes base drive and current control. For
          FETs, the lesson emphasizes gate action and field control.
        </p>

        <p>
          This is one of the simplest ways to separate the transistor families
          clearly.
        </p>
      </SectionCard>

      <SectionCard title="Why does current-flow language change?" eyebrow="Flow Interpretation">
        <p>
          The lesson shows that carrier type and device family affect how flow
          is described.
        </p>

        <p>
          For example, NPN and PNP do not use the same carrier emphasis, and
          N-channel and P-channel devices also differ in their flow convention.
        </p>

        <p>
          That is why the learner should not memorize only one transistor flow
          explanation and apply it to every transistor type.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important?" eyebrow="Learning Progression">
        <p>
          Earlier lessons explain what a transistor is, how it is structured,
          and what its terminals do.
        </p>

        <p>
          This lesson adds classification, so the learner can begin identifying
          which transistor family and subtype is being used in a real circuit.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: the fastest way to identify a transistor type is
          to ask which family it belongs to, what controls it, and what its
          symbol and flow direction are telling you.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Transistors are grouped into different families, not just one device type.</li>
          <li>BJT and FET are the two main families in this lesson.</li>
          <li>BJTs are introduced here as mainly current controlled.</li>
          <li>FETs are introduced here as mainly field controlled.</li>
          <li>NPN and PNP are BJT subtypes with opposite direction conventions.</li>
          <li>JFET and MOSFET are FET subtypes with different gate-control ideas.</li>
          <li>N-channel and P-channel devices differ in carrier and flow interpretation.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
