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
      question: "এই optocoupler lesson-এ photodiode কী?",
      answer:
        "Photodiode হলো light-sensitive output device, যা optocoupler-এর input side থেকে আসা LED light-এর প্রতি response দেয়।",
    },
    {
      question: "Photodiode গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি received light-কে electrical output behavior-এ রূপান্তর করে, কিন্তু input আর output side-কে isolated রাখে।",
    },
    {
      question: "Input LED on হলে কী ঘটে?",
      answer:
        "Input LED light emit করে, আর সেই light isolation gap পার হয়ে photodiode-এর কাছে পৌঁছে যায়।",
    },
    {
      question: "এই lesson-এর মূল beginner idea কী?",
      answer:
        "Learner-এর বোঝা উচিত যে input side-এর light output photodiode side-এ response তৈরি করে।",
    },
    {
      question: "Photodiode আর phototransistor-এর মধ্যে পার্থক্য কী?",
      answer:
        "দুইটিই light-sensitive device, কিন্তু এই lesson photodiode-based output behavior-এর ওপর focus করে, phototransistor output behavior-এর ওপর নয়।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ takeaway কী?",
      answer:
        "Photodiode হলো optical receiver, যা incoming light-কে usable output-side effect-এ পরিণত করে।",
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
              Photodiode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে photodiode optocoupler circuit-এ
              light-sensitive output device হিসেবে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো input LED light পাঠায়, আর photodiode
              সেই light receive করে output-side response তৈরি করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এতে learner বুঝতে পারে কীভাবে optical signal transfer electrical
              output action-এ রূপ নেয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Action" value="LED Light" tone="emerald" />
            <ValueCard label="Receiver" value="Photodiode" tone="violet" />
            <ValueCard label="Main Benefit" value="Isolation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Photodiode কী?" eyebrow="Core Definition">
        <p>
          Photodiode হলো একটি light-sensitive semiconductor device, যা light
          পড়লে response দেয়।
        </p>

        <p>
          এই optocoupler lesson-এ photodiode হলো optical signal-এর receiving
          side।
        </p>

        <p>
          অর্থাৎ এটি incoming light information-কে output electrical behavior-এ
          রূপ দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Optocoupler-এ photodiode গুরুত্বপূর্ণ কেন?" eyebrow="Output Role">
        <p>
          Optocoupler-এর output side-এ এমন একটি device দরকার, যা input side-এর
          সাথে direct electrical connection ছাড়া light-এর response দিতে পারে।
        </p>

        <p>
          Photodiode সেই কাজটি করে, কারণ এটি isolation barrier-এর ওপারে LED
          light sense করে।
        </p>

        <p>
          তাই optical isolation-কে useful করে তোলার ক্ষেত্রে photodiode একটি
          key part।
        </p>
      </SectionCard>

      <SectionCard title="Input LED on হলে কী হয়?" eyebrow="Light Response">
        <p>Input current LED side-এ flow করলে LED light emit করে।</p>

        <p>
          সেই light internal isolation space পার হয়ে photodiode-এর কাছে
          পৌঁছায়।
        </p>

        <p>
          এরপর photodiode light input-এর ভিত্তিতে output-side electrical
          response তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson basic optocoupler definition থেকে কীভাবে আলাদা?" eyebrow="Focused Device Study">
        <p>
          প্রথম lesson-এ signal transfer through light-এর general idea বোঝানো
          হয়েছে।
        </p>

        <p>
          এই lesson output side-এর একটি specific receiver device, অর্থাৎ
          photodiode-এর ওপর focus করে।
        </p>

        <p>
          এতে learner output side সম্পর্কে আরও detailed understanding পায়।
        </p>
      </SectionCard>

      <SectionCard title="Photodiode আর phototransistor কীভাবে আলাদা?" eyebrow="Comparison">
        <p>
          দুইটি device-ই light-এর প্রতি response দেয় এবং optical system-এর
          output side-এ ব্যবহৃত হয়।
        </p>

        <p>
          কিন্তু এই lesson photodiode behavior-এর ওপর focus করে, phototransistor
          style output action-এর ওপর নয়।
        </p>

        <p>
          এতে learner optocoupler-এর different output device আলাদা করে চিনতে
          শেখে।
        </p>
      </SectionCard>

      <SectionCard title="Isolation এখনও core idea কেন?" eyebrow="Signal Safety">
        <p>
          এই lesson photodiode-এর ওপর focus করলেও, সবচেয়ে গুরুত্বপূর্ণ overall
          idea এখনও electrical isolation।
        </p>

        <p>
          Input LED আর output photodiode signal information light-এর মাধ্যমে
          exchange করে, direct electrical wiring দিয়ে নয়।
        </p>

        <p>
          তাই photodiode signal transfer এবং safety separation - দুইটিকেই support
          করে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ উপায় হলো sender আর receiver-কে track করা।
        </p>

        <p>
          LED light পাঠায়, আর photodiode সেই light receive করে output effect
          তৈরি করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: photodiode হলো optocoupler receiver, যা incoming
          LED light-কে output-side electrical response-এ পরিণত করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Photodiode একটি light-sensitive output device।</li>
          <li>এটি input LED side থেকে আসা light receive করে।</li>
          <li>এই light output electrical response তৈরি করে।</li>
          <li>Photodiode isolation barrier-এর ওপারে কাজ করে।</li>
          <li>এই lesson photodiode output behavior-এর ওপর focus করে।</li>
          <li>এটি phototransistor-based output study থেকে আলাদা।</li>
          <li>মূল idea হলো isolation সহ optical receiving।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
