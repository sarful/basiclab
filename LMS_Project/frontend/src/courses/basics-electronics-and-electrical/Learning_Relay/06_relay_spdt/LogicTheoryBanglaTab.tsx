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
      question: "SPDT relay-এর মূল ধারণা কী?",
      answer:
        "SPDT relay-এ একটি common contact থাকে, যা দুইটি output path-এর মধ্যে switch করতে পারে, সাধারণত NC path আর NO path।",
    },
    {
      question: "SPDT মানে কী?",
      answer:
        "SPDT মানে single-pole double-throw। অর্থাৎ একটি movable contact দুইটি আলাদা terminal-এর যেকোনো একটির সাথে connect হতে পারে।",
    },
    {
      question: "Normal unenergized state-এ কী হয়?",
      answer:
        "Normal state-এ common terminal সাধারণত normally closed contact-এর সাথে connected থাকে।",
    },
    {
      question: "Coil energized হওয়ার পরে কী change হয়?",
      answer:
        "Coil energized হলে relay armature move করে এবং common terminal NC থেকে disconnect হয়ে NO-এর সাথে connect হয়।",
    },
    {
      question: "Relay learning-এ SPDT গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি changeover action শেখায়, যেখানে একটি input দুইটি output state-এর মধ্যে switch হয়।",
    },
    {
      question: "SPDT আর SPST-এর মধ্যে পার্থক্য কী?",
      answer:
        "SPST শুধু একটি path open বা close করে, কিন্তু SPDT একটি common path-কে দুইটি ভিন্ন output-এর মধ্যে switch করে।",
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
              Relay SPDT
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি SPDT relay একটি common path-কে
              normally closed output আর normally open output-এর মধ্যে switch করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো changeover action: relay coil energized
              কি না তার ওপর common terminal-এর connection পরিবর্তন হয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই SPDT relay contact configuration বোঝা relay learning-এর খুবই
              গুরুত্বপূর্ণ অংশ।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPDT" tone="emerald" />
            <ValueCard label="Default Path" value="COM to NC" tone="violet" />
            <ValueCard label="Coil Effect" value="COM to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="SPDT মানে কী?" eyebrow="Contact Name">
        <p>
          SPDT মানে single-pole double-throw। অর্থাৎ relay contact-এ একটি movable
          common point থাকে এবং দুইটি possible connection path থাকে।
        </p>

        <p>
          একটি path সাধারণত normally closed contact, আর অন্যটি normally open
          contact।
        </p>

        <p>
          এই structure-এর কারণে একটি common terminal দুইটি output-এর মধ্যে select
          করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Normal state-এ কী হয়?" eyebrow="Default Condition">
        <p>
          Normal unenergized state-এ common terminal normally closed contact-এর
          সাথে connected থাকে।
        </p>

        <p>অর্থাৎ relay defaultভাবে NC path দিয়ে connection দেয়।</p>

        <p>NO path coil energized না হওয়া পর্যন্ত disconnected থাকে।</p>
      </SectionCard>

      <SectionCard title="Coil energized হওয়ার পরে কী change হয়?" eyebrow="Changeover Action">
        <p>
          Relay coil energized হলে magnetic action armature-কে move করায় এবং
          contact position change হয়।
        </p>

        <p>Common terminal NC থেকে disconnect হয়ে NO-এর সাথে connect হয়।</p>

        <p>এই changeover movement-ই SPDT relay-এর প্রধান operating idea।</p>
      </SectionCard>

      <SectionCard title="SPDT, SPST-এর চেয়ে বেশি powerful কেন?" eyebrow="Functional Difference">
        <p>SPST contact শুধু একটি path open বা close করে।</p>

        <p>
          কিন্তু SPDT একটি common line-কে দুইটি ভিন্ন output-এর মধ্যে redirect
          করতে পারে।
        </p>

        <p>
          এই extra flexibility-এর কারণেই practical relay control-এ SPDT অনেক
          useful।
        </p>
      </SectionCard>

      <SectionCard title="SPDT-এ COM গুরুত্বপূর্ণ কেন?" eyebrow="Common Terminal">
        <p>
          COM terminal হলো relay contact system-এর moving reference point।
        </p>

        <p>
          Coil state-এর ওপর নির্ভর করে এই terminal-টাই NC থেকে NO-তে change হয়।
        </p>

        <p>তাই SPDT relay diagram ঠিকভাবে পড়তে COM বোঝা জরুরি।</p>
      </SectionCard>

      <SectionCard title="Practical use-এ SPDT কোথায় লাগে?" eyebrow="Practical Use">
        <p>
          SPDT relay useful যখন একটি signal বা supply-কে দুইটি ভিন্ন circuit
          path-এর মধ্যে redirect করতে হয়।
        </p>

        <p>
          Automation, signal routing, interlocking, আর basic electrical control
          logic-এ এই relay অনেক common।
        </p>

        <p>
          এই কারণেই electrical training-এ SPDT relay একটি standard topic।
        </p>
      </SectionCard>

      <SectionCard title="Beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ rule হলো coil energized হওয়ার আগে ও পরে common terminal-কে
          follow করা।
        </p>

        <p>Normal state-এ COM, NC-এর সাথে থাকে। Energized হলে COM, NO-তে যায়।</p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: SPDT relay coil active হলে common connection-কে NC
          side থেকে NO side-এ change করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPDT মানে single-pole double-throw।</li>
          <li>একটি common terminal NC বা NO-এর সাথে connect হতে পারে।</li>
          <li>Default state-এ COM সাধারণত NC-এর সাথে connected থাকে।</li>
          <li>Coil energized হলে COM, NC থেকে NO-তে move করে।</li>
          <li>SPDT relay changeover behavior শেখায়।</li>
          <li>এটি SPST contact control-এর চেয়ে বেশি flexible।</li>
          <li>Practical control circuit-এ SPDT খুব widely used।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
