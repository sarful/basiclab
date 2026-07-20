"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeVariableCapacitorSnapshot,
  formatCapacitance,
  formatFrequency,
  formatNumber,
} from "./logic";

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
  const rotation = 90;
  const minCapacitance = 20;
  const maxCapacitance = 320;
  const inductanceUh = 220;
  const plateCount = 6;

  const sample = computeVariableCapacitorSnapshot({
    rotation,
    minCapacitance,
    maxCapacitance,
    inductanceUh,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ভ্যারিয়েবল ক্যাপাসিটরের প্রধান কাজ কী?",
      answer:
        "এর প্রধান কাজ হলো capacitance পরিবর্তন করা, যাতে একটি circuit-কে বিভিন্ন frequency-তে tune করা যায়।",
    },
    {
      question: "ভ্যারিয়েবল ক্যাপাসিটরে capacitance কীভাবে পরিবর্তিত হয়?",
      answer:
        "Movable plate এবং fixed plate-এর overlap পরিবর্তনের মাধ্যমে capacitance পরিবর্তিত হয়।",
    },
    {
      question: "LC circuit-এ capacitance বাড়লে tuning frequency-এর কী হয়?",
      answer:
        "Capacitance বাড়লে resonant frequency কমে যায়।",
    },
    {
      question: "Radio tuning-এ variable capacitor উপকারী কেন?",
      answer:
        "এটি resonant frequency সরাতে সাহায্য করে, ফলে circuit বিভিন্ন station বা signal band select করতে পারে।",
    },
    {
      question: "এই লেসনে plate overlap কী বোঝায়?",
      answer:
        "এটি বোঝায় capacitor-এর plate-গুলো কতটা একে অন্যের মুখোমুখি রয়েছে, যা সরাসরি capacitance-কে প্রভাবিত করে।",
    },
    {
      question: "Tuning formula-তে inductance গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ LC circuit-এ tuned frequency inductance এবং capacitance দুটির ওপরই নির্ভর করে।",
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
              ভ্যারিয়েবল ক্যাপাসিটর
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ভ্যারিয়েবল ক্যাপাসিটর হলো এমন একটি ক্যাপাসিটর যার capacitance
              সমন্বয় করা যায়, সাধারণত movable plate-কে fixed plate-এর তুলনায়
              ঘুরিয়ে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনের মূল ধারণা হলো plate overlap, capacitance range,
              tuning control, এবং কীভাবে capacitance একটি LC circuit-এর
              resonant frequency পরিবর্তন করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি tuner, radio, এবং frequency-selective circuit-এ ব্যবহৃত
              একধরনের ক্লাসিক কম্পোনেন্ট।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="ক্যাপাসিট্যান্স"
              value={formatCapacitance(sample.capacitance)}
              tone="violet"
            />
            <ValueCard
              label="ওভারল্যাপ"
              value={`${formatNumber(sample.overlapRatio * 100, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="টিউনড ফ্রিকোয়েন্সি"
              value={formatFrequency(sample.frequency)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="ভ্যারিয়েবল ক্যাপাসিটর কী?" eyebrow="Core Concept">
        <p>
          ভ্যারিয়েবল ক্যাপাসিটর এমনভাবে তৈরি করা হয় যাতে এর capacitance স্থির
          না থাকে। বরং এটি একটি range-এর মধ্যে পরিবর্তন করা যায়।
        </p>

        <p>
          অনেক design-এ এটি ঘটে এক সেট plate ঘুরিয়ে, যাতে অন্য সেট plate-এর
          সাথে overlap পরিবর্তিত হয়।
        </p>

        <p>
          Overlap বেশি হলে plate-এর কার্যকর মুখোমুখি area বেড়ে যায়, ফলে
          capacitance-ও বৃদ্ধি পায়।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: plate overlap বাড়লে capacitance বাড়ে নাকি কমে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Plate overlap গুরুত্বপূর্ণ কেন?" eyebrow="Mechanical Tuning">
        <p>
          এই লেসনে plate overlap-ই হলো সেই সরাসরি physical control, যা
          capacitor value পরিবর্তন করে।
        </p>

        <p>
          এই sample-এ rotation হলো <strong>{rotation} degrees</strong>, যা
          প্রায় <strong>{formatNumber(sample.overlapRatio * 100, 0)} %</strong>{" "}
          overlap তৈরি করে।
        </p>

        <p>
          এই overlap থেকে নির্বাচিত tuning range-এর মধ্যে প্রায়{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong> capacitance
          পাওয়া যায়।
        </p>
      </SectionCard>

      <SectionCard title="Capacitance range কী?" eyebrow="Range Control">
        <p>
          একটি variable capacitor সাধারণত একটি single fixed value-এ কাজ করে
          না। বরং এটি minimum এবং maximum capacitance value-এর মধ্যে কাজ করে।
        </p>

        <p>
          এই উদাহরণে range হলো{" "}
          <strong>{formatCapacitance(minCapacitance)}</strong> থেকে{" "}
          <strong>{formatCapacitance(maxCapacitance)}</strong>।
        </p>

        <p>
          এই adjustable range-এর কারণেই বিভিন্ন frequency-তে tuning সম্ভব হয়।
        </p>
      </SectionCard>

      <SectionCard title="Tuning frequency কীভাবে পরিবর্তিত হয়?" eyebrow="LC Resonance">
        <p>
          একটি variable capacitor প্রায়ই একটি inductor-এর সাথে ব্যবহার হয়ে
          একটি LC tuning circuit তৈরি করে।
        </p>

        <p>
          এই লেসনে inductance হলো{" "}
          <strong>{formatNumber(inductanceUh, 0)} uH</strong>, এবং tuned
          frequency হয় প্রায় <strong>{formatFrequency(sample.frequency)}</strong>।
        </p>

        <p>
          মূল নিয়ম হলো: capacitance বাড়লে resonant frequency কমে যায়, আর
          capacitance কমলে resonant frequency বাড়ে।
        </p>
      </SectionCard>

      <SectionCard title="Plate count গুরুত্বপূর্ণ কেন?" eyebrow="Construction Detail">
        <p>
          Plate count নির্ধারণ করে capacitor structure-এ মোট effective area
          কতটা অংশ নিতে পারে।
        </p>

        <p>
          এই sample-এ construction idea বোঝানোর জন্য{" "}
          <strong>{plateCount} plates</strong> ব্যবহার করা হয়েছে।
        </p>

        <p>
          বেশি effective plate area একটি compact mechanical design-এ বড়
          capacitance range দিতে সাহায্য করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল সূত্র" eyebrow="Formula Sheet">
        <p>
          মূল tuning idea আসে LC resonance relationship থেকে: frequency
          নির্ভর করে <strong>L</strong> এবং <strong>C</strong> উভয়ের ওপর।
        </p>

        <p>
          শুরুতেই সব detail মুখস্থ করার দরকার নেই। সবচেয়ে গুরুত্বপূর্ণ নিয়ম
          হলো: <strong>C</strong> বাড়লে tuned frequency কমে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: capacitor ঘোরালে overlap বদলায়, overlap
          বদলালে capacitance বদলায়, আর capacitance বদলালে tuned frequency-ও
          বদলে যায়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি traditional radio tuner-এ variable capacitor circuit-কে এক
          resonant frequency থেকে অন্যটিতে সরাতে সাহায্য করে।
        </p>

        <p>
          এর ফলে ব্যবহারকারী mechanical উপায়ে capacitance পরিবর্তন করে
          বিভিন্ন station select করতে পারে।
        </p>

        <p>
          এটি একটি স্পষ্ট উদাহরণ, যেখানে physical movement দিয়ে electrical
          tuning control করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Variable capacitor-এর capacitance adjustable হয়।</li>
          <li>Plate overlap capacitance পরিবর্তনের একটি প্রধান কারণ।</li>
          <li>Overlap বেশি হলে সাধারণত capacitance-ও বেশি হয়।</li>
          <li>Variable capacitor একটি capacitance range-এর মধ্যে কাজ করে।</li>
          <li>এগুলো LC tuning circuit-এ সাধারণভাবে ব্যবহৃত হয়।</li>
          <li>Capacitance বাড়লে resonant frequency কমে যায়।</li>
          <li>Radio এবং frequency-selection circuit-এ এগুলো খুব উপকারী।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
