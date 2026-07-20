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
      question: "এই lesson-এ phototransistor কী?",
      answer:
        "Phototransistor হলো optocoupler-এর output side-এর light-sensitive transistor, যা input LED থেকে আসা light পেলে ON হয়।",
    },
    {
      question: "Phototransistor useful কেন?",
      answer:
        "কারণ এটি simple optical receiver-এর তুলনায় stronger output switching action দেয়, কিন্তু input আর output side-কে electrically isolated রাখে।",
    },
    {
      question: "Input LED light emit করলে কী হয়?",
      answer:
        "Light isolation gap পার হয়ে phototransistor-কে activate করে এবং external circuit-এ output current flow করতে দেয়।",
    },
    {
      question: "এই lesson-এর মূল beginner idea কী?",
      answer:
        "Learner-এর বোঝা উচিত যে LED-এর light output side-এ transistor conduction control করে।",
    },
    {
      question: "Phototransistor আর photodiode-এর মধ্যে পার্থক্য কী?",
      answer:
        "দুইটিই light-sensitive device, কিন্তু এই lesson phototransistor-এর transistor-style output switching behavior-এর ওপর focus করে।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ takeaway কী?",
      answer:
        "Phototransistor incoming light-কে stronger output conduction-এ রূপ দেয়, তাই এটি optical switch-controlled transistor-এর মতো কাজ করে।",
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
              Phototransistor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে phototransistor optocoupler-এর
              output-side optical receiver এবং switching device হিসেবে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো input LED light পাঠায়, আর সেই light
              output side-এ phototransistor-কে conduct করতে সাহায্য করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এতে optocoupler transistor-style output response দিতে পারে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="Phototransistor" tone="violet" />
            <ValueCard label="Output Result" value="Conduction" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Phototransistor কী?" eyebrow="Core Definition">
        <p>
          Phototransistor হলো transistor-এর মতো একটি light-sensitive output
          device, যা light পেলে response দেয়।
        </p>

        <p>
          এই lesson-এ এটি optocoupler-এর output component, যা input LED side
          থেকে আসা optical energy receive করে।
        </p>

        <p>
          Light-controlled behavior-এর কারণে এটি switching device হিসেবে কাজ
          করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Phototransistor গুরুত্বপূর্ণ কেন?" eyebrow="Output Control">
        <p>
          Optocoupler-এর output side-এ এমন একটি safe device দরকার, যা input
          side-এর সাথে direct electrical connection ছাড়াই output current on/off
          করতে পারে।
        </p>

        <p>
          Phototransistor সেই কাজটি করে, কারণ light-ই এর control signal।
        </p>

        <p>
          তাই এটি optocoupler-এ isolation আর output switching - দুইটিকেই একসাথে
          support করে।
        </p>
      </SectionCard>

      <SectionCard title="Input LED on হলে কী হয়?" eyebrow="Light-Controlled Action">
        <p>Input current LED side-এ flow করলে LED light emit করে।</p>

        <p>
          সেই light isolation barrier পার হয়ে phototransistor-এর কাছে পৌঁছে
          যায়।
        </p>

        <p>
          এরপর phototransistor conduct করতে শুরু করে এবং external circuit-এ
          output current flow হতে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson basic definition-এর চেয়ে advanced কেন?" eyebrow="Focused Device Study">
        <p>
          প্রথম optocoupler lesson light-based signal transfer-এর general idea
          বোঝায়।
        </p>

        <p>
          এই lesson একটি specific output device - phototransistor - এর ওপর
          focus করে, যা stronger switching behavior দেয়।
        </p>

        <p>
          এতে learner output side-কে আরও practicalভাবে বুঝতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Phototransistor আর photodiode কীভাবে আলাদা?" eyebrow="Comparison">
        <p>
          দুইটিই light-sensitive device এবং optical isolation system-এর output
          side-এ ব্যবহৃত হয়।
        </p>

        <p>
          কিন্তু phototransistor lesson transistor-style conduction আর switching
          response-এর ওপর focus করে।
        </p>

        <p>
          এতে learner বোঝে কেন different application-এ different optical
          output device ব্যবহার করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="Isolation এখনও সবচেয়ে গুরুত্বপূর্ণ কেন?" eyebrow="Safety Link">
        <p>
          Lessonটি phototransistor নিয়ে হলেও, পুরো system-এর মূল idea এখনও
          isolation।
        </p>

        <p>
          Input side light-এর মাধ্যমে output side-কে control করে, direct
          electrical signal wire দিয়ে নয়।
        </p>

        <p>
          এতে control section আর load section আলাদা থাকে, কিন্তু switching
          সম্ভব হয়।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ rule হলো light path আর output response-কে track করা।
        </p>

        <p>
          LED light পাঠায়, আর phototransistor সেই light receive করে conduction
          on করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: phototransistor হলো optocoupler output switch,
          যা incoming light ব্যবহার করে output current flow control করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Phototransistor একটি light-sensitive transistor output device।</li>
          <li>এটি input LED side থেকে light receive করে।</li>
          <li>এই light output-side conduction তৈরি করে।</li>
          <li>এটি transistor-style switching response দেয়।</li>
          <li>এই lesson practical output switching behavior-এর ওপর focus করে।</li>
          <li>এটি photodiode-based output study থেকে আলাদা।</li>
          <li>মূল idea হলো isolation সহ optical control of output conduction।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
