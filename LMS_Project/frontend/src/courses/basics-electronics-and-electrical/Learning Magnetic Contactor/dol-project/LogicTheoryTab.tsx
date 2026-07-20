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
      question: "What does DOL stand for in a motor starter?",
      answer:
        "DOL stands for Direct-On-Line, meaning the motor is connected directly to the full line supply through the starter components.",
    },
    {
      question: "Why does the DOL starter need both a control circuit and a power circuit?",
      answer:
        "The control circuit decides when the starter should run, and the power circuit carries the three-phase energy that actually drives the motor.",
    },
    {
      question: "What is the job of the K1 coil?",
      answer:
        "The K1 coil is the actuator of the starter. When energized, it closes the main power contacts and starts the motor.",
    },
    {
      question: "Why is the auxiliary NO contact 13-14 important?",
      answer:
        "It creates the holding or seal-in path so the coil remains energized after the START push button is released.",
    },
    {
      question: "What happens when the overload relay trips?",
      answer:
        "Its NC control contact opens, the K1 coil de-energizes, the main contacts open, and the motor stops.",
    },
    {
      question: "What is the main limitation of a DOL starter?",
      answer:
        "Because full line voltage is applied directly to the motor, the starting current can be very high.",
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
              DOL Starter Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              This lesson explains how a Direct-On-Line starter combines a
              control circuit and a power circuit to start, hold, protect, and
              stop a three-phase motor.
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              The key idea is simple: the control side decides when the
              contactor coil should energize, and the power side decides whether
              full three-phase supply reaches the motor.
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              This makes the DOL project a practical bridge between contactor
              theory and real motor starter operation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Starter Type" value="DOL" tone="emerald" />
            <ValueCard label="Main Coil" value="K1" tone="violet" />
            <ValueCard label="Motor Supply" value="3 Phase" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="What is this project teaching?" eyebrow="Core Concept">
        <p>
          This project teaches the basic working logic of a DOL motor starter.
        </p>

        <p>
          It shows both the control circuit and the power circuit so a learner
          can understand how command logic and motor power flow work together.
        </p>

        <p>
          Instead of memorizing symbols alone, the lesson helps connect each
          component to its practical role in starting and protecting a motor.
        </p>
      </SectionCard>

      <SectionCard title="What is a DOL starter?" eyebrow="Starter Meaning">
        <p>
          DOL means <strong>Direct-On-Line</strong>.
        </p>

        <p>
          In this method, the motor is connected directly to the full
          three-phase line through protective and switching devices such as the
          breaker, contactor, and overload relay.
        </p>

        <p>
          It is one of the simplest and most widely used motor starting methods
          in industrial electrical systems.
        </p>
      </SectionCard>

      <SectionCard title="Why do we need separate control and power circuits?" eyebrow="Two Functions">
        <p>
          The control circuit decides <strong>when</strong> the system should
          run.
        </p>

        <p>
          The power circuit carries the actual three-phase current that drives
          the motor.
        </p>

        <p>
          This separation makes the system easier to operate, safer to protect,
          and clearer to troubleshoot.
        </p>
      </SectionCard>

      <SectionCard title="How does the start sequence work?" eyebrow="Operation Sequence">
        <p>
          First, the breaker or MCB must be ON so supply is available to the
          starter.
        </p>

        <p>
          When the START push button is pressed, the K1 coil energizes and pulls
          in the contactor.
        </p>

        <p>
          The main power contacts then close, allowing three-phase power to
          reach the motor.
        </p>

        <p>
          After that, the auxiliary NO contact closes and creates the holding
          path so the starter can remain ON after the START button is released.
        </p>
      </SectionCard>

      <SectionCard title="Why is the holding contact important?" eyebrow="Seal-In Logic">
        <p>
          The START push button is only pressed for a short time.
        </p>

        <p>
          If the circuit relied only on that button, the coil would de-energize
          as soon as the button was released.
        </p>

        <p>
          The auxiliary NO contact 13-14 solves this by creating a parallel path
          that keeps the K1 coil energized during normal running.
        </p>
      </SectionCard>

      <SectionCard title="What stops the motor?" eyebrow="Stop Conditions">
        <p>
          The motor stops whenever the K1 coil loses energization.
        </p>

        <p>
          This can happen when the STOP push button opens the control path, when
          the breaker is turned OFF, or when the overload relay trips.
        </p>

        <p>
          Once the coil drops out, the main contacts open and the motor no
          longer receives power.
        </p>
      </SectionCard>

      <SectionCard title="Why is overload protection essential?" eyebrow="Motor Safety">
        <p>
          A motor can draw too much current because of high load, mechanical
          jamming, low speed under stress, or incorrect settings.
        </p>

        <p>
          The overload relay protects the motor winding from overheating and
          damage.
        </p>

        <p>
          In this starter, the overload relay affects both protection and
          control logic because its NC contact opens the coil circuit when a
          trip occurs.
        </p>
      </SectionCard>

      <SectionCard title="What are the key components doing?" eyebrow="Component Roles">
        <p>
          The <strong>MCB or breaker</strong> isolates the incoming supply.
        </p>

        <p>
          The <strong>K1 contactor coil</strong> actuates the switching action,
          and the <strong>main power contacts</strong> connect three-phase power
          to the motor.
        </p>

        <p>
          The <strong>overload relay</strong> provides motor protection, the{" "}
          <strong>auxiliary NO contact</strong> holds the starter ON, and the{" "}
          <strong>pilot lamp</strong> indicates energized or running status.
        </p>
      </SectionCard>

      <SectionCard title="What is the main limitation of a DOL starter?" eyebrow="Design Limitation">
        <p>
          A DOL starter connects the motor directly to full line voltage at
          startup.
        </p>

        <p>
          Because of that, the motor can draw a very high starting current.
        </p>

        <p>
          This may cause voltage drop, mechanical shock, and rough startup,
          especially with larger motors or heavy-duty loads.
        </p>

        <p>
          That is why larger applications may use methods like star-delta or
          soft starting instead.
        </p>
      </SectionCard>

      <SectionCard title="Best way to study this lesson" eyebrow="Study Tip">
        <p>
          Start with the control circuit first, because it explains
          <em> when the system should run</em>.
        </p>

        <p>
          Then study the power circuit, because it shows
          <em> how the motor actually receives power</em>.
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: a DOL starter is easiest to understand when you
          track one chain only: command to coil, coil to contactor, contactor to
          motor, and overload to safe shutdown.
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DOL means Direct-On-Line starter.</li>
          <li>The control circuit decides when the starter should run.</li>
          <li>The power circuit carries three-phase energy to the motor.</li>
          <li>K1 coil energization closes the main contacts.</li>
          <li>The auxiliary NO contact creates the holding path.</li>
          <li>The overload relay protects the motor and can stop the coil circuit.</li>
          <li>The main limitation of DOL is high starting current.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>Open each question to review the answer.</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
