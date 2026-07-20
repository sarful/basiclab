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
      question: "What is an AC to AC SSR circuit?",
      answer:
        "An AC to AC SSR circuit uses a control signal to switch an AC load electronically through a solid state relay designed for AC output operation.",
    },
    {
      question: "Why is this lesson important after DC to DC SSR?",
      answer:
        "Because it shows that SSR applications change depending on the type of load, and AC load switching has its own practical behavior and circuit structure.",
    },
    {
      question: "What is the key beginner idea in this lesson?",
      answer:
        "The learner should understand that the SSR is being used to control an AC load electronically while keeping control and load functions separated.",
    },
    {
      question: "How is this different from DC to DC SSR circuits?",
      answer:
        "The main difference is the output side: here the load side is AC, so the lesson focuses on AC switching application rather than DC load switching.",
    },
    {
      question: "Why is SSR useful for AC load control?",
      answer:
        "Because it allows silent, fast, and electronically controlled switching of AC loads without mechanical contact wear.",
    },
    {
      question: "What should learners observe in the circuit?",
      answer:
        "They should observe how the control input commands the SSR and how the SSR then controls the AC load path in the external circuit.",
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
              AC to AC SSR Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a solid state relay is used to
              electronically switch an AC load in an AC to AC relay circuit
              arrangement.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is that the control action commands the relay while
              the output side handles an AC load path.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This lesson helps learners connect SSR theory to practical AC load
              control.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Role" value="Control Signal" tone="emerald" />
            <ValueCard label="Output Role" value="AC Load" tone="violet" />
            <ValueCard label="Switching Style" value="Electronic" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is an AC to AC SSR circuit?" eyebrow="Topic Overview">
        <p>
          An AC to AC SSR circuit is a practical SSR application where the relay
          is used to control an AC load path electronically.
        </p>

        <p>
          The external circuit is arranged so that the SSR becomes the switching
          link between the control action and the AC load.
        </p>

        <p>
          So this lesson focuses on real AC load switching application.
        </p>
      </SectionCard>

      <SectionCard title="Why is this lesson important?" eyebrow="Learning Progression">
        <p>
          Earlier lessons introduce SSR definition, internal structure, and DC
          load application.
        </p>

        <p>
          This lesson expands that understanding by moving into AC load control,
          which is very common in practical systems.
        </p>

        <p>
          It shows that SSR behavior must be understood in the context of the
          actual output type.
        </p>
      </SectionCard>

      <SectionCard title="What should beginners notice first?" eyebrow="Beginner Focus">
        <p>
          The first thing to notice is that the control side and the load side
          still play separate roles.
        </p>

        <p>
          The control side gives the switching command, and the output side
          handles the AC load path.
        </p>

        <p>
          This cause-and-effect relationship is the core of the lesson.
        </p>
      </SectionCard>

      <SectionCard title="How is this different from DC to DC SSR?" eyebrow="AC vs DC Application">
        <p>
          In a DC to DC SSR lesson, the switched load side is DC based.
        </p>

        <p>
          In this lesson, the switched load side is AC based, so the output
          application context changes.
        </p>

        <p>
          That difference is important because relay application depends heavily
          on load type.
        </p>
      </SectionCard>

      <SectionCard title="Why is SSR useful for AC load control?" eyebrow="Practical Advantage">
        <p>
          SSR is useful because it can switch AC loads silently and without
          moving contacts.
        </p>

        <p>
          This reduces mechanical wear and can improve switching life in many
          applications.
        </p>

        <p>
          That makes SSRs popular for heaters, lamps, industrial loads, and
          automation systems.
        </p>
      </SectionCard>

      <SectionCard title="What does the circuit view help explain?" eyebrow="Applied Observation">
        <p>
          The circuit view helps the learner trace the control input, the relay
          switching role, and the AC load response in one connected picture.
        </p>

        <p>
          That is much more useful than only reading a short definition of an
          SSR.
        </p>

        <p>
          It turns a theory topic into a practical circuit lesson.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest beginner memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest rule is to mentally split the circuit into command side
          and load side.
        </p>

        <p>
          The control action tells the SSR what to do, and the SSR then controls
          the AC load path electronically.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: an AC to AC SSR circuit uses electronic relay
          switching so a control signal can safely command an AC load path.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>An AC to AC SSR circuit is used for AC load switching.</li>
          <li>The control side and load side still have separate roles.</li>
          <li>The output side in this lesson is AC based.</li>
          <li>SSR provides electronic switching without moving contacts.</li>
          <li>This makes SSR useful for practical AC load applications.</li>
          <li>The circuit view helps explain command-to-load behavior.</li>
          <li>The main idea is safe electronic control of an AC load path.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
