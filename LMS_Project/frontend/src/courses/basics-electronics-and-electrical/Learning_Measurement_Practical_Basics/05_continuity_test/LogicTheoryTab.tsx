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
      question: "What does a continuity test actually check?",
      answer:
        "It checks whether an electrical path is closed and conductive from one test point to the other.",
    },
    {
      question: "Why must the circuit be unpowered before continuity testing?",
      answer:
        "Because continuity mode is a power-off test and should not be used on a live powered path.",
    },
    {
      question: "What usually happens on a real meter when continuity is present?",
      answer:
        "A real meter usually gives a beep and may show a near-zero resistance reading.",
    },
    {
      question: "What does an open fuse or broken wire usually mean in continuity mode?",
      answer:
        "It means there is no continuity, so the meter should stay silent or show no closed-path indication.",
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
              Continuity Test
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A continuity test checks whether an electrical path is complete
              enough for current to pass from one point to another.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              This lesson is built around one practical idea: continuity mode is
              used to answer a simple yes-or-no question about a path. Is the
              path closed, or is it broken?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Meter Function" value="Diode / Continuity" tone="slate" />
            <ValueCard label="Power Rule" value="OFF" tone="rose" />
          </div>
        </div>
      </section>

      <SectionCard title="What is a continuity test?" eyebrow="Core Concept">
        <p>
          A continuity test checks whether there is a complete conductive path
          between two test points.
        </p>
        <p>
          In simple language, it helps answer this question: can electricity
          get from point A to point B through this path?
        </p>
        <p>
          If the path is closed and continuous, the meter usually gives a
          positive continuity indication.
        </p>
        <p>
          If the path is broken, open, or interrupted, the meter should not
          show continuity.
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          Continuity testing helps confirm whether a wire, fuse, switch
          contact, or connection path is still electrically complete.
        </p>
        <p>It helps answer practical questions such as:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Is this wire link closed from one end to the other?</li>
          <li>Is this fuse open or still continuous?</li>
          <li>Is this contact path really closed?</li>
          <li>Is there a hidden break in the path even though the component looks normal?</li>
        </ul>
        <p>
          That makes continuity testing useful for troubleshooting, maintenance,
          and confirming basic path integrity before applying power.
        </p>
      </SectionCard>

      <SectionCard title="Meter setup rules" eyebrow="Setup Rules">
        <p>
          For this lesson, the meter uses the <strong>diode /
          continuity-style</strong> function.
        </p>
        <p>
          The black lead stays in <strong>COM</strong>.
        </p>
        <p>
          The red lead stays in <strong>VΩmA</strong>.
        </p>
        <p>
          The <strong>10A</strong> jack is not used for continuity checks,
          because continuity is not a high-current measurement.
        </p>
        <p>
          The learner’s job is to set the correct function first, then place
          one probe on each of the two test points being checked.
        </p>
      </SectionCard>

      <SectionCard title="Why power must stay off" eyebrow="Safety First">
        <p>
          Continuity testing must be done on an unpowered path.
        </p>
        <p>
          This is a power-off test, not a live operating test.
        </p>
        <p>
          If the circuit is still energized, the reading can be misleading and
          the setup can become unsafe.
        </p>
        <p>
          A safe beginner habit is simple: remove or isolate power first, then
          run the continuity test.
        </p>
      </SectionCard>

      <SectionCard title="How the result is interpreted" eyebrow="Reading Logic">
        <p>
          If the path is closed, continuity should be detected.
        </p>
        <p>
          On many real meters, that means you hear a <strong>beep</strong>, and
          the display may show a very low resistance value.
        </p>
        <p>
          If the path is open, the meter should not beep, and the test should
          indicate that the path is broken or not continuous.
        </p>
        <p>
          In this lesson, a closed wire path or closed switch path should show
          continuity, while a blown fuse or broken path should not.
        </p>
      </SectionCard>

      <SectionCard title="Probe placement logic" eyebrow="Measurement Method">
        <p>
          Continuity is checked by placing one probe on each of the two test
          points.
        </p>
        <p>
          The meter must test <strong>across the path</strong>, not on the same
          point.
        </p>
        <p>
          If both probes touch the same node, the learner is not really testing
          the condition of the path between two separate points.
        </p>
        <p>
          Proper continuity testing always compares two ends of the path.
        </p>
      </SectionCard>

      <SectionCard title="Typical continuity examples" eyebrow="Practical Logic">
        <p>
          A <strong>closed wire path</strong> should show continuity because
          the conductor is complete from one side to the other.
        </p>
        <p>
          A <strong>blown fuse</strong> should not show continuity because the
          conductive link inside the fuse is broken.
        </p>
        <p>
          A <strong>closed switch contact</strong> should show continuity
          because the path is intentionally connected.
        </p>
        <p>
          The logic is always the same: closed path means continuity, open path
          means no continuity.
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistakes" eyebrow="High Priority">
        <p>
          Do not use continuity mode on a powered circuit.
        </p>
        <p>
          Do not leave the dial in voltage or ohms mode when the lesson is
          asking for continuity testing.
        </p>
        <p>
          Do not move the red lead to the <strong>10A</strong> jack.
        </p>
        <p>
          And do not place both probes on the same test point, because that
          does not check the actual path between two ends.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Continuity tests whether a path is closed or broken.</li>
          <li>Continuity mode is a power-off test.</li>
          <li>The black lead stays in COM and the red lead stays in VΩmA.</li>
          <li>A closed path should usually beep on a real meter.</li>
          <li>An open path should not show continuity.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Use these short questions to lock in the key continuity rules.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
