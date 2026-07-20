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
      question: "এই lesson-এ PhotoTRIAC কী?",
      answer:
        "PhotoTRIAC হলো optocoupler-এর output side-এর light-triggered AC switching device, যা input LED-এর light পেলে ON হয়।",
    },
    {
      question: "PhotoTRIAC useful কেন?",
      answer:
        "কারণ এটি isolated low-power input signal দিয়ে AC load path control করতে দেয়, direct electrical connection ছাড়াই।",
    },
    {
      question: "Input LED light emit করলে কী হয়?",
      answer:
        "Light isolation barrier পার হয়ে PhotoTRIAC-কে trigger করে এবং output load path-এ AC current flow করতে দেয়।",
    },
    {
      question: "এই topic-এর মূল beginner idea কী?",
      answer:
        "Learner-এর বোঝা উচিত যে light AC-side switching trigger করতে পারে, কিন্তু input side electrically isolated থাকে।",
    },
    {
      question: "PhotoTRIAC আর phototransistor output-এর মধ্যে পার্থক্য কী?",
      answer:
        "এই lesson AC output switching-এর জন্য TRIAC-type optical receiver-এর ওপর focus করে, transistor-style DC output conduction-এর ওপর নয়।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ takeaway কী?",
      answer:
        "PhotoTRIAC light-কে trigger signal হিসেবে ব্যবহার করে optocoupler-কে safely AC load control করতে দেয়।",
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
              PhotoTRIAC
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে PhotoTRIAC optocoupler-এর AC
              output-side switching device হিসেবে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো input LED light পাঠায়, আর সেই light
              output side-এ AC switching trigger করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই optocoupler isolated AC control application-এ খুব useful হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="PhotoTRIAC" tone="violet" />
            <ValueCard label="Output Type" value="AC Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="PhotoTRIAC কী?" eyebrow="Core Definition">
        <p>
          PhotoTRIAC হলো একটি light-triggered AC switching device, যা কিছু
          optocoupler-এর output side-এ ব্যবহৃত হয়।
        </p>

        <p>
          এটি input LED side থেকে আসা optical energy-তে response দেয়।
        </p>

        <p>
          এর ফলে input side-এর সাথে direct electrical coupling ছাড়াই AC load
          switching করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="PhotoTRIAC গুরুত্বপূর্ণ কেন?" eyebrow="AC Output Role">
        <p>
          কিছু control system-এ isolated উপায়ে AC output path switch বা trigger
          করা দরকার হয়।
        </p>

        <p>
          PhotoTRIAC light-কে trigger mechanism হিসেবে ব্যবহার করে সেই কাজটি
          করে।
        </p>

        <p>
          তাই এটি isolation আর AC output control - দুইটিকে একই concept-এর
          মধ্যে আনে।
        </p>
      </SectionCard>

      <SectionCard title="Input LED on হলে কী হয়?" eyebrow="Light Trigger">
        <p>Input current LED side-এ flow করলে LED light emit করে।</p>

        <p>
          সেই light internal isolation barrier পার হয়ে PhotoTRIAC-এর কাছে
          পৌঁছায়।
        </p>

        <p>
          তারপর PhotoTRIAC trigger হয় এবং AC current output load path দিয়ে flow
          করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="এই topic phototransistor output থেকে কীভাবে আলাদা?" eyebrow="Output-Type Difference">
        <p>
          Phototransistor lesson সাধারণত transistor-style output conduction-এর
          ওপর focus করে।
        </p>

        <p>
          এই lesson আলাদা, কারণ এখানে output device AC-side switching behavior-এর
          সাথে সম্পর্কিত।
        </p>

        <p>
          এতে learner DC optical output আর AC optical switching output-এর
          পার্থক্য বুঝতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Isolation এখনও সবচেয়ে গুরুত্বপূর্ণ system idea কেন?" eyebrow="Safety Link">
        <p>
          Lessonটি AC switching নিয়ে হলেও, system-এর সবচেয়ে গুরুত্বপূর্ণ principle
          হলো electrical isolation।
        </p>

        <p>
          Input side direct wire দিয়ে AC output side-এ control signal পাঠায় না।
        </p>

        <p>
          বরং light safely barrier পার হয়ে trigger information বহন করে।
        </p>
      </SectionCard>

      <SectionCard title="Practical use-এ PhotoTRIAC কোথায় useful?" eyebrow="Practical Use">
        <p>
          PhotoTRIAC-based optocoupler AC lamp control, mains triggering, এবং
          other isolated AC switching task-এ useful।
        </p>

        <p>
          বিশেষ করে small control circuit দিয়ে safely AC load control করতে হলে
          এটি অনেক helpful।
        </p>

        <p>
          তাই power-electronics learning-এ এই topic-এর practical value অনেক।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ rule হলো light আর AC load-কে follow করা।
        </p>

        <p>
          LED light পাঠায়, আর PhotoTRIAC সেই light ব্যবহার করে AC output path
          enable করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: PhotoTRIAC light-based isolation ব্যবহার করে
          optocoupler-কে safely AC load trigger করতে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>PhotoTRIAC একটি light-triggered AC output device।</li>
          <li>এটি input LED side থেকে light receive করে।</li>
          <li>এই light AC-side switching trigger করে।</li>
          <li>এটি isolated AC control application-এ useful।</li>
          <li>এটি phototransistor-style output study থেকে আলাদা।</li>
          <li>Isolation এখনও সবচেয়ে গুরুত্বপূর্ণ system principle।</li>
          <li>মূল idea হলো optical triggering দিয়ে safe AC switching।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
