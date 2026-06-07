"use client";

import {
  DEFAULT_BRANCH_ONE,
  DEFAULT_BRANCH_THREE,
  DEFAULT_BRANCH_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  solveParallelCircuitLesson,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "cyan";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

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
  const solved = solveParallelCircuitLesson(
    DEFAULT_VOLTAGE,
    DEFAULT_BRANCH_ONE,
    DEFAULT_BRANCH_TWO,
    DEFAULT_BRANCH_THREE,
  );
  const flowLevel = getFlowLevel(solved.totalCurrent);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "What is a parallel circuit in simple language?",
      answer:
        "A parallel circuit is a circuit where current has more than one path to follow.",
    },
    {
      question: "What stays the same across parallel branches?",
      answer:
        "The voltage stays the same across each parallel branch.",
    },
    {
      question: "How is total current found in a parallel circuit?",
      answer:
        "The total current is the sum of the branch currents.",
    },
    {
      question: "What happens if one branch opens in a parallel circuit?",
      answer:
        "The other branches can still keep working if their paths remain complete.",
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
              Parallel Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              In a parallel circuit, current can move through more than one path.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              We will learn this step by step in simple language. You do not need
              advanced theory before starting this lesson.
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Keep one picture in mind. Parallel branches are like separate roads
              connected to the same source.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard
              label="Total Current"
              value={`${solved.totalCurrent.toFixed(2)} A`}
              tone="blue"
            />
            <ValueCard label="Flow Level" value={flowLevel} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="What is it?" eyebrow="Core Concept">
        <p>
          A parallel circuit is a circuit where current has more than one path to follow.
        </p>
        <p>
          In simple English, the source gives the same push to several branches at the same time.
        </p>
        <p>
          Each branch connects across the same source, so each branch receives the same voltage.
        </p>
        <p>
          The current then splits between the branches based on their resistance values.
        </p>
        <p>
          <strong>
            Checkpoint Question: In a parallel circuit, does current have one path or more than one path?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Why is it important?" eyebrow="Why It Matters">
        <p>
          This topic is important because many real electrical systems use parallel connections.
        </p>
        <p>
          Homes, buildings, and machines often use parallel circuits so each load can receive the same source voltage.
        </p>
        <p>
          Parallel design also helps one branch continue working even if another branch stops.
        </p>
        <p>
          <strong>Main point:</strong> Parallel circuits let multiple loads work from the same source.
        </p>
        <p>
          <strong>What to notice:</strong> Each branch gets the same voltage, but the current can be different.
        </p>
        <p>
          <strong>
            Checkpoint Question: Why are parallel circuits useful when several loads need to run from one source?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="How does it work?" eyebrow="How It Works">
        <p>
          In a parallel circuit, the source voltage appears across every branch.
        </p>
        <p>
          That means branch one, branch two, and branch three each receive{" "}
          <strong>{solved.voltage.toFixed(1)} V</strong>.
        </p>
        <p>
          The branch currents are found by dividing the same voltage by each branch resistance.
        </p>
        <p>
          In this lesson, the branch currents are{" "}
          <strong>{solved.currentOne.toFixed(2)} A</strong>,{" "}
          <strong>{solved.currentTwo.toFixed(2)} A</strong>, and{" "}
          <strong>{solved.currentThree.toFixed(2)} A</strong>.
        </p>
        <p>
          Simple branch calculations:{" "}
          <strong>
            I1 = {solved.voltage.toFixed(1)} / {solved.branchOneResistance.toFixed(1)} ={" "}
            {solved.currentOne.toFixed(2)} A
          </strong>
          {", "}
          <strong>
            I2 = {solved.voltage.toFixed(1)} / {solved.branchTwoResistance.toFixed(1)} ={" "}
            {solved.currentTwo.toFixed(2)} A
          </strong>
          {", "}
          <strong>
            I3 = {solved.voltage.toFixed(1)} / {solved.branchThreeResistance.toFixed(1)} ={" "}
            {solved.currentThree.toFixed(2)} A
          </strong>
        </p>
        <p>
          Then the total current becomes{" "}
          <strong>{solved.branchRuleText}</strong>.
        </p>
        <p>
          A common beginner mistake is to think the current stays the same in every branch.
          In reality, the voltage stays the same, but the current depends on each branch resistance.
        </p>
        <p>
          <strong>Main point:</strong> Same voltage across all branches.
        </p>
        <p>
          <strong>Main point:</strong> Total current is the sum of the branch currents.
        </p>
        <p>
          <strong>
            Checkpoint Question: In a parallel circuit, what do you add together to get total current?
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
                <p>Think about the lights in a house.</p>
                <p>
                  Each light is usually connected in parallel, so every light receives the same source voltage.
                </p>
                <p>
                  If one light burns out, the other lights can still stay on because their branches are still complete.
                </p>
                <p>
                  The same idea is used in distribution boards, machine panels, and many control systems.
                </p>
                <p>
                  When you look at a real parallel circuit, notice whether each load is connected across the same source.
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Why can one house light fail while the other lights still work?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>A parallel circuit has more than one current path.</li>
          <li>Each branch receives the same source voltage.</li>
          <li>Branch current depends on branch resistance.</li>
          <li>Total current equals the sum of all branch currents.</li>
          <li>One branch can fail while other branches still work.</li>
          <li>Parallel circuits are common in real electrical systems.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to check the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
