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
      question: "Optocoupler কী?",
      answer:
        "Optocoupler হলো এমন একটি electronic component, যা light ব্যবহার করে signal transfer করে এবং দুইটি circuit-কে electrically isolated রাখে।",
    },
    {
      question: "Electrical isolation গুরুত্বপূর্ণ কেন?",
      answer:
        "Isolation low-power control side-কে high-voltage বা noisy side থেকে protect করে, কিন্তু signal transfer চালু রাখে।",
    },
    {
      question: "একটি simple optocoupler-এর ভিতরে প্রধান দুইটি অংশ কী?",
      answer:
        "সাধারণত input side-এ একটি LED থাকে এবং output side-এ phototransistor-এর মতো light-sensitive device থাকে।",
    },
    {
      question: "Signal transfer কীভাবে হয়?",
      answer:
        "Input LED-তে current flow করলে LED light emit করে। সেই light output sensor device-কে activate করে এবং output circuit state change হয়।",
    },
    {
      question: "Direct electrical connection থেকে optocoupler কীভাবে আলাদা?",
      answer:
        "দুই side-এর মধ্যে signal direct electrical path দিয়ে যায় না; signal light-এর মাধ্যমে isolation gap পার হয়।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ beginner takeaway কী?",
      answer:
        "Optocoupler signal-কে direct metal connection দিয়ে নয়, light দিয়ে transfer করে এবং এতে safe circuit isolation পাওয়া যায়।",
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
              What Is Optocoupler
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ optocoupler কী এবং কেন এটি দুইটি electrically
              isolated circuit-এর মধ্যে signal transfer করতে ব্যবহৃত হয়, তা
              বোঝানো হয়েছে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো input side light পাঠায়, আর output
              side সেই light receive করে circuit state control করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              অর্থাৎ দুই side-এর মধ্যে direct electrical connection ছাড়াই signal
              transfer হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Device" value="LED" tone="emerald" />
            <ValueCard label="Signal Bridge" value="Light" tone="violet" />
            <ValueCard label="Main Benefit" value="Isolation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Optocoupler কী?" eyebrow="Core Definition">
        <p>
          Optocoupler হলো একটি electronic isolation component, যা light
          ব্যবহার করে এক circuit থেকে আরেক circuit-এ signal transfer করে।
        </p>

        <p>
          এটি system-এর এক side-কে অন্য side-এর সাথে communicate করতে দেয়,
          কিন্তু direct electrical signal connection তৈরি করে না।
        </p>

        <p>
          তাই protection এবং control application-এ এটি খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="Isolation গুরুত্বপূর্ণ কেন?" eyebrow="Protection Idea">
        <p>
          Isolation গুরুত্বপূর্ণ কারণ অনেক electronic system-এ low-power control
          side-কে high-voltage বা noisy load side থেকে protect রাখা দরকার।
        </p>

        <p>
          যদি দুই side direct connected হতো, তাহলে unwanted voltage বা noise
          sensitive part damage করতে পারত।
        </p>

        <p>
          Optocoupler signal pass করতে দেয়, কিন্তু সেই ঝুঁকি কমায়।
        </p>
      </SectionCard>

      <SectionCard title="ভিতরে প্রধান দুইটি basic part কী?" eyebrow="Internal Idea">
        <p>
          একটি simple optocoupler-এ সাধারণত input side-এ LED এবং output side-এ
          একটি light-sensitive device থাকে।
        </p>

        <p>
          Input current flow করলে LED light emit করে, আর output device সেই
          light receive করে।
        </p>

        <p>এই pair-টাই component-এর basic working structure তৈরি করে।</p>
      </SectionCard>

      <SectionCard title="Signal এক side থেকে আরেক side-এ কীভাবে যায়?" eyebrow="Signal Transfer">
        <p>Signal input side-এ electrical current হিসেবে শুরু হয়।</p>

        <p>
          সেই current internal LED-কে on করে, আর LED isolation gap-এর ওপারে
          light পাঠায়।
        </p>

        <p>
          Output device সেই light receive করে এবং output circuit condition
          change করে।
        </p>
      </SectionCard>

      <SectionCard title="এটি normal wiring থেকে কীভাবে আলাদা?" eyebrow="Direct vs Optical">
        <p>
          Normal wiring-এ signal সাধারণত direct metallic electrical path দিয়ে
          travel করে।
        </p>

        <p>
          Optocoupler-এ signal এক side থেকে আরেক side-এ light দিয়ে যায়, direct
          metal connection দিয়ে নয়।
        </p>

        <p>এটাই optocoupler-এর সবচেয়ে গুরুত্বপূর্ণ identity।</p>
      </SectionCard>

      <SectionCard title="Optocoupler কোথায় useful?" eyebrow="Practical Use">
        <p>
          Optocoupler microcontroller interface, power control, industrial
          circuit, switching system, আর safety-related signal isolation-এ useful।
        </p>

        <p>
          বিশেষ করে delicate logic circuit-কে powerful circuit-এর সাথে safely
          communicate করাতে এটি খুব valuable।
        </p>

        <p>তাই componentটি practical এবং protective - দুইভাবেই গুরুত্বপূর্ণ।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>সবচেয়ে সহজ memory rule হলো device-কে দুই side-এ ভাগ করে দেখা।</p>

        <p>
          এক side light পাঠায়, আর অন্য side সেই light receive করে output action
          তৈরি করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: optocoupler light-এর মাধ্যমে signal transfer
          করে, তাই দুইটি circuit communicate করতে পারে কিন্তু electrically
          isolated থাকে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Optocoupler light দিয়ে signal transfer করে।</li>
          <li>এটি input আর output circuit-কে electrically isolated রাখে।</li>
          <li>একটি simple optocoupler-এ LED এবং light-sensitive output device থাকে।</li>
          <li>Input current LED-কে on করে।</li>
          <li>Emitted light output side-কে control করে।</li>
          <li>এটি direct wired signal path থেকে আলাদা।</li>
          <li>মূল beginner idea হলো safe optical signal transfer।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
