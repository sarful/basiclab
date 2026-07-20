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

export default function LogicTheoryBanglaTab() {
  const quizItems: QuizAccordionItem[] = [
    {
      question: "এই lesson-এর মূল focus কী?",
      answer:
        "এই lesson-এ বোঝানো হয়েছে কীভাবে relay coil একটি single-pole single-throw normally open contact-কে control করে এবং energized হলে contact state কীভাবে change হয়।",
    },
    {
      question: "SPST NO মানে কী?",
      answer:
        "SPST NO মানে single-pole single-throw normally open। অর্থাৎ relay-এর normal unenergized অবস্থায় contact path open থাকে।",
    },
    {
      question: "Coil energize হওয়ার আগে কী হয়?",
      answer:
        "Relay coil energized হওয়ার আগে SPST NO contact open থাকে, তাই ওই contact path দিয়ে current flow করতে পারে না।",
    },
    {
      question: "Coil energized হওয়ার পরে কী হয়?",
      answer:
        "Coil energized হলে relay-এর mechanism move করে এবং normally open contact close হয়। ফলে path conduct করতে পারে।",
    },
    {
      question: "Beginner-দের জন্য SPST NO গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি relay-এর সবচেয়ে common idea দেখায়: control signal coil-কে energize করে এবং নতুন output connection তৈরি করে।",
    },
    {
      question: "SPST NO আর SPST NC-এর মধ্যে পার্থক্য কী?",
      answer:
        "SPST NO শুরুতে open থাকে এবং energized হলে close হয়, আর SPST NC শুরুতে closed থাকে এবং energized হলে open হয়।",
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
              Relay Coil with SPST NO
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে relay coil একটি single-pole
              single-throw normally open contact-কে control করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো: normal state-এ contact
              path open থাকে, আর coil energized হলে path closed হয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই SPST NO relay output control শেখার সবচেয়ে পরিষ্কার first
              example-গুলোর একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPST NO" tone="emerald" />
            <ValueCard label="Normal State" value="Open Path" tone="violet" />
            <ValueCard label="Coil Effect" value="Closes Contact" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="SPST NO মানে কী?" eyebrow="Contact Name">
        <p>
          SPST মানে single-pole single-throw, অর্থাৎ খুব simple one-path
          switching arrangement।
        </p>

        <p>
          NO মানে normally open, তাই relay unenergized থাকলে contact path open
          থাকে।
        </p>

        <p>
          একসাথে SPST NO বোঝায় এমন contact, যা coil active হওয়ার পরেই connect
          হয়।
        </p>
      </SectionCard>

      <SectionCard title="Normal state-এ কী হয়?" eyebrow="Default Condition">
        <p>Normal unenergized state-এ SPST NO contact open থাকে।</p>

        <p>
          যেহেতু path open থাকে, তাই defaultভাবে ওই contact route দিয়ে current
          flow করতে পারে না।
        </p>

        <p>
          এই default-open behavior-টাই learner-দের সবচেয়ে আগে মনে রাখা উচিত।
        </p>
      </SectionCard>

      <SectionCard title="Coil energized হওয়ার পরে কী change হয়?" eyebrow="Closing Action">
        <p>
          Relay coil energized হলে magnetic force relay-এর internal switching
          part-কে move করায়।
        </p>

        <p>SPST NO contact-এ এই movement contact path-কে close করে।</p>

        <p>ফলে আগে disconnected থাকা route active হয়ে যায়।</p>
      </SectionCard>

      <SectionCard title="SPST NC-এর পরে এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Direct Comparison">
        <p>SPST NC একটি default closed path দেখায়, যা energized হলে open হয়।</p>

        <p>
          SPST NO ঠিক উল্টো behavior দেখায়: এটি শুরুতে open থাকে এবং energized
          হলে close হয়।
        </p>

        <p>
          দুইটি একসাথে শিখলে relay contact logic-এর foundation অনেক strong হয়।
        </p>
      </SectionCard>

      <SectionCard title="Control circuit-এ SPST NO common কেন?" eyebrow="Practical Relevance">
        <p>
          SPST NO useful যখন কোনো output control signal না পাওয়া পর্যন্ত off
          থাকবে।
        </p>

        <p>
          Control signal relay coil-কে activate করলে তবেই output connection
          তৈরি হবে।
        </p>

        <p>
          Automation এবং electrical control system-এ এই behavior খুব common।
        </p>
      </SectionCard>

      <SectionCard title="এখানে coil-এর role কী?" eyebrow="Coil as Control Trigger">
        <p>
          Coil হলো control input, যা contact-কে এক state থেকে আরেক state-এ
          নিয়ে যায়।
        </p>

        <p>
          Coil energized না হলে NO contact open-ই থাকে এবং output path
          disconnected থাকে।
        </p>

        <p>তাই coil relay-এর switch-triggering mechanism হিসেবে কাজ করে।</p>
      </SectionCard>

      <SectionCard title="SPST NO মনে রাখার সবচেয়ে সহজ উপায় কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ memory rule হলো coil energizing-এর আগে ও পরে contact path
          track করা।
        </p>

        <p>Before energizing, path open। After energizing, path closed।</p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: SPST NO relay contact তখনই connection তৈরি করে,
          যখন relay coil active হয়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPST NO মানে single-pole single-throw normally open।</li>
          <li>Default state-এ contact path open থাকে।</li>
          <li>Coil energized হলে contact path close হয়।</li>
          <li>এটি SPST NC-এর উল্টো behavior।</li>
          <li>SPST NO practical control circuit-এ খুব common।</li>
          <li>Coil output connection-এর trigger হিসেবে কাজ করে।</li>
          <li>এই lesson relay contact-state foundation শক্ত করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
