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
      question: "What is SSR40DA Relay?",
      answer:
        "SSR40DA is a solid state relay that allows a low-power control input to switch an AC load without using moving mechanical contacts.",
    },
    {
      question: "Why is it called a solid state relay?",
      answer:
        "Because it uses semiconductor devices for switching instead of a coil-driven armature and mechanical contact system.",
    },
    {
      question: "What is the basic purpose of SSR40DA?",
      answer:
        "Its purpose is to isolate a control side from a load side and switch the load electronically and safely.",
    },
    {
      question: "How is SSR different from an electromagnetic relay?",
      answer:
        "An electromagnetic relay uses moving contacts, while an SSR uses internal electronic parts such as an optocoupler and power switching devices.",
    },
    {
      question: "Why is SSR useful in modern control circuits?",
      answer:
        "Because it offers silent operation, fast switching, long life, and less mechanical wear.",
    },
    {
      question: "What should learners focus on in this lesson?",
      answer:
        "They should focus on the idea that SSR switches load electronically and uses internal semiconductor circuitry instead of physical contacts.",
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
              SSR40DA Relay
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains the basic idea of an SSR40DA solid state
              relay and how it switches a load without mechanical contacts.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The most important concept is that the control side and load side
              are connected through electronic switching, not through moving
              metal contacts.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes SSR operation different from traditional relay
              behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Relay Type" value="Solid State" tone="emerald" />
            <ValueCard label="Switching Style" value="Electronic" tone="violet" />
            <ValueCard label="Mechanical Parts" value="None" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is SSR40DA Relay?" eyebrow="Topic Overview">
        <p>
          SSR40DA is a solid state relay designed to switch a load using an
          electronic control method instead of a mechanical contact mechanism.
        </p>

        <p>
          It usually takes a low-power control signal and uses that signal to
          control a higher-power AC load side.
        </p>

        <p>
          So the lesson introduces a relay type that works without moving relay
          contacts.
        </p>
      </SectionCard>

      <SectionCard title="Why is it called a solid state relay?" eyebrow="Naming Logic">
        <p>
          It is called solid state because the switching action is performed by
          semiconductor devices.
        </p>

        <p>
          Unlike electromagnetic relays, there is no armature physically moving
          from one contact point to another.
        </p>

        <p>
          This is the first key contrast learners should understand.
        </p>
      </SectionCard>

      <SectionCard title="How does the control side help the load side?" eyebrow="Isolation Idea">
        <p>
          In an SSR, the control side sends a small signal that activates an
          internal electronic switching stage.
        </p>

        <p>
          That stage then allows the load side to turn on or off without direct
          mechanical contact movement.
        </p>

        <p>
          This helps provide control-to-load isolation in a compact form.
        </p>
      </SectionCard>

      <SectionCard title="How is SSR different from a normal relay?" eyebrow="Relay Comparison">
        <p>
          A normal electromagnetic relay uses a coil, armature, and mechanical
          contacts.
        </p>

        <p>
          An SSR uses internal electronic parts such as an optocoupler and power
          switching devices to perform the same switching idea in a different
          way.
        </p>

        <p>
          That is why SSRs operate silently and avoid mechanical contact wear.
        </p>
      </SectionCard>

      <SectionCard title="Why is SSR useful in practice?" eyebrow="Practical Advantage">
        <p>
          SSRs are useful where silent switching, fast response, and long
          operating life are important.
        </p>

        <p>
          Because there are no moving contacts, mechanical wear is reduced
          compared with traditional relays.
        </p>

        <p>
          This makes them popular in many automation and industrial control
          applications.
        </p>
      </SectionCard>

      <SectionCard title="What should beginners focus on?" eyebrow="Beginner Focus">
        <p>
          Beginners should focus first on the switching concept, not on the full
          semiconductor detail.
        </p>

        <p>
          The key idea is simple: an SSR switches load electronically and does
          not use physical metal contact movement.
        </p>

        <p>
          Once that idea is clear, the learner can understand internal SSR
          circuits more easily.
        </p>
      </SectionCard>

      <SectionCard title="What is the easiest memory rule?" eyebrow="Formula-Free Idea">
        <p>
          The easiest memory rule is to compare it with a normal relay.
        </p>

        <p>
          A normal relay switches with moving contacts. An SSR switches with
          electronics.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: SSR40DA controls a load like a relay, but it does
          the switching through semiconductor circuitry instead of mechanical
          contact action.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SSR40DA is a solid state relay.</li>
          <li>It switches loads without mechanical contacts.</li>
          <li>The control side activates internal electronic switching.</li>
          <li>It is different from electromagnetic relays.</li>
          <li>SSR operation is silent and has less mechanical wear.</li>
          <li>It is useful in modern control and automation systems.</li>
          <li>The main beginner idea is electronic switching instead of contact movement.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
