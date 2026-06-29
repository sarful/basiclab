"use client";

import {
  DEFAULT_LOAD_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
  SHORT_PATH_RESISTANCE,
  solveShortCircuitLesson,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "amber";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
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
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
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

export function LogicTheorySection() {
  const normalCase = solveShortCircuitLesson(
    "normal",
    DEFAULT_VOLTAGE,
    DEFAULT_LOAD_RESISTANCE,
  );
  const shortCase = solveShortCircuitLesson(
    "short",
    DEFAULT_VOLTAGE,
    DEFAULT_LOAD_RESISTANCE,
  );
  const flowPercent = getFlowPercent(shortCase.current);
  const flowLevel = getFlowLevel(shortCase.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a short circuit in simple language?",
      answer:
        "A short circuit is a very low-resistance path that lets current return to the source too easily, without passing through the load in the normal way.",
    },
    {
      question: "Why is a short circuit dangerous?",
      answer:
        "It is dangerous because current can rise very quickly, which can overheat wires, damage components, or create fire risk.",
    },
    {
      question: "What usually happens to resistance in a short circuit?",
      answer:
        "The resistance becomes very low, so current rises sharply.",
    },
    {
      question: "In a normal circuit, where should current go?",
      answer:
        "In a normal circuit, current should pass through the intended load, such as a resistor, lamp, or other device.",
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
              Short Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              A short circuit creates an unsafe low-resistance path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in simple language. You do not need
              advanced theory before starting this lesson.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. In a normal circuit, current goes through
              the load. In a short circuit, current finds an easier path and rises
              too fast.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Short Current" value={`${shortCase.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Risk Level" value={flowLevel} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A short circuit is a very low-resistance path that lets current move too
          easily from the source back to the source.
        </p>
        <p>
          In simple English, current takes the easier path instead of going through
          the load in the normal way.
        </p>
        <p>
          This can bypass the intended device and make the current rise sharply.
        </p>
        <p>
          A short circuit is not the same as a normal closed circuit. A normal
          closed circuit has a complete path through the load. A short circuit has
          an unsafe shortcut.
        </p>
        <p>
          <strong>
            Checkpoint Question: Does a short circuit create a normal load path or
            an unsafe easy path?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because short circuits can damage components,
          overheat wires, trip protection devices, or create fire risk.
        </p>
        <p>
          Electricians and technicians must understand short circuits so they can
          prevent dangerous conditions and troubleshoot faults safely.
        </p>
        <p>
          In real systems, fuses and circuit breakers are used because short
          circuits can make current rise very quickly.
        </p>
        <p>
          <strong>Main point:</strong> Very low resistance can create very high current.
        </p>
        <p>
          <strong>What to notice:</strong> The danger comes from the unwanted easy path.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why do protection devices matter when a short
            circuit happens?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          Current depends on voltage and resistance. When resistance becomes very
          small, current becomes very large.
        </p>
        <p>
          In a normal circuit in this lesson, the load resistance is{" "}
          <strong>{normalCase.loadResistance.toFixed(1)} Ohm</strong>, so the current
          stays at a more controlled value of{" "}
          <strong>{normalCase.current.toFixed(2)} A</strong>.
        </p>
        <p>
          In the short-circuit case, the effective resistance drops to{" "}
          <strong>{SHORT_PATH_RESISTANCE.toFixed(2)} Ohm</strong>, so the current rises
          to <strong>{shortCase.current.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple calculation:{" "}
          <strong>
            I = V / R = {DEFAULT_VOLTAGE.toFixed(1)} / {SHORT_PATH_RESISTANCE.toFixed(2)} ={" "}
            {shortCase.current.toFixed(2)} A
          </strong>
        </p>
        <p>
          A common beginner mistake is to think a shorter path is always better.
          In a short circuit, the easier path is actually dangerous because it lets
          too much current flow.
        </p>
        <p>
          The short-circuit power becomes <strong>{shortCase.power.toFixed(2)} W</strong>,
          and the flow reaches about <strong>{flowPercent}%</strong>. That is why the
          lesson marks it as <strong>{flowLevel}</strong>.
        </p>
        <p>
          <strong>Main point:</strong> Short circuit means low resistance and high current.
        </p>
        <p>
          <strong>Main point:</strong> High current can quickly become unsafe.
        </p>
        <p>
          <strong>
            Checkpoint Question: What happens to current when resistance becomes very small?
          </strong>
        </p>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-cyan-300 to-sky-400" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Real Device Example
              </div>
              <h2 className="text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                Real-world example
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>Think about a damaged wire whose insulation has broken.</p>
                <p>
                  If the conductor touches another conductor or metal body in the wrong
                  place, current may find an easier path than the intended load path.
                </p>
                <p>
                  That can make the wire heat up quickly and can trip a fuse or breaker.
                </p>
                <p>
                  This is why short-circuit protection is important in home wiring,
                  control panels, battery systems, and machines.
                </p>
                <p>
                  When you think about a real short circuit, imagine this question: did
                  current find an unsafe shortcut?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Why can a damaged wire become dangerous in a
                    real circuit?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A short circuit creates an unsafe low-resistance path.</li>
          <li>Lower resistance can make current rise sharply.</li>
          <li>Short circuits can bypass the intended load.</li>
          <li>High current can overheat wires and damage parts.</li>
          <li>Fuses and breakers help protect against short circuits.</li>
          <li>A normal closed circuit is not the same as a short circuit.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
