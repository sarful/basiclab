"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  codeOptions,
  computeCeramicSnapshot,
  dielectricOptions,
  formatCapacitancePf,
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
  const code = codeOptions[3].code;
  const dielectric = dielectricOptions[1];
  const appliedVoltage = 12;
  const voltageRating = 25;
  const frequency = 10000;

  const sample = computeCeramicSnapshot({
    code,
    dielectric,
    appliedVoltage,
    voltageRating,
    frequency,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সেরামিক ক্যাপাসিটরের গায়ে 104 কোডের অর্থ কী?",
      answer:
        "এর মানে হলো 10-এর পরে 4টি শূন্য pF এককে, অর্থাৎ 100000 pF বা 100 nF।",
    },
    {
      question: "ডিকাপলিং সার্কিটে সেরামিক ক্যাপাসিটর এত বেশি ব্যবহৃত হয় কেন?",
      answer:
        "এগুলো ছোট, সাশ্রয়ী, দ্রুত প্রতিক্রিয়াশীল এবং নয়েজ ও উচ্চ-ফ্রিকোয়েন্সি রিপল কমাতে খুব কার্যকর।",
    },
    {
      question: "ফ্রিকোয়েন্সি বাড়লে ক্যাপাসিটিভ রিয়্যাক্ট্যান্সের কী হয়?",
      answer:
        "ফ্রিকোয়েন্সি বাড়লে রিয়্যাক্ট্যান্স কমে যায়, তাই ক্যাপাসিটর AC-কে কম বাধা দেয়।",
    },
    {
      question: "ভোল্টেজ রেটিং গুরুত্বপূর্ণ কেন?",
      answer:
        "প্রয়োগ করা ভোল্টেজকে ভোল্টেজ রেটিংয়ের আরামদায়ক নিচে রাখতে হয়, যাতে স্ট্রেস ও নির্ভরযোগ্যতার সমস্যা না হয়।",
    },
    {
      question: "C0G/NP0 আর Y5V এর মধ্যে কোন ডাইইলেকট্রিক বেশি স্থিতিশীল?",
      answer:
        "C0G/NP0 অনেক বেশি স্থিতিশীল, আর Y5V ছোট আকারে বেশি ক্যাপাসিট্যান্স দিলেও স্থিতিশীলতা কম।",
    },
    {
      question: "সেরামিক ক্যাপাসিটর কি পোলারাইজড?",
      answer:
        "সাধারণত ব্যবহৃত বেশিরভাগ সেরামিক ক্যাপাসিটর নন-পোলারাইজড, তাই দুই দিকেই সংযোগ করা যায়।",
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
              সেরামিক ক্যাপাসিটর
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              সেরামিক ক্যাপাসিটর হলো একটি ছোট আকারের নন-পোলারাইজড ক্যাপাসিটর,
              যেখানে প্লেট দুটির মাঝের ডাইইলেকট্রিক হিসেবে সেরামিক পদার্থ
              ব্যবহার করা হয়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনে আমরা কোড মার্কিং, ডাইইলেকট্রিক টাইপ, ভোল্টেজ সেফটি
              মার্জিন, এবং কেন ফ্রিকোয়েন্সি বাড়লে ক্যাপাসিটিভ রিয়্যাক্ট্যান্স
              কমে যায় তা শিখব।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              সেরামিক ক্যাপাসিটর বিশেষভাবে ডিকাপলিং, বাইপাসিং, ফিল্টারিং এবং
              অনেক উচ্চ-ফ্রিকোয়েন্সির ইলেকট্রনিক সার্কিটে ব্যবহৃত হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="ক্যাপাসিট্যান্স"
              value={formatCapacitancePf(sample.capacitancePf)}
              tone="violet"
            />
            <ValueCard
              label="সেফটি মার্জিন"
              value={`${formatNumber(sample.safePercent, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="রিয়্যাক্ট্যান্স"
              value={`${formatNumber(sample.reactanceOhm, 2)} Ohm`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="সেরামিক ক্যাপাসিটর কী?" eyebrow="Core Concept">
        <p>
          সেরামিক ক্যাপাসিটর পরিবাহী প্লেটের মাঝখানে সেরামিক ডাইইলেকট্রিক
          ব্যবহার করে বৈদ্যুতিক চার্জ সঞ্চয় করে।
        </p>

        <p>
          বেশিরভাগ সেরামিক ক্যাপাসিটর নন-পোলারাইজড, অর্থাৎ এগুলো সাধারণত
          নির্দিষ্ট পজিটিভ বা নেগেটিভ সংযোগ দিকের ওপর নির্ভর করে না।
        </p>

        <p>
          এগুলো জনপ্রিয় কারণ আকারে ছোট, নির্ভরযোগ্য, সাশ্রয়ী, এবং উচ্চ
          ফ্রিকোয়েন্সিতে দ্রুত প্রতিক্রিয়া দরকার এমন সার্কিটে খুব উপযোগী।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: IC-এর পাওয়ার পিনের কাছাকাছি ডিকাপলিংয়ের জন্য
            সেরামিক ক্যাপাসিটর কেন বেশি ব্যবহার করা হয়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="প্রিন্টেড কোড কীভাবে কাজ করে?" eyebrow="Code Marking">
        <p>
          ছোট সেরামিক ক্যাপাসিটরে পুরো ক্যাপাসিট্যান্স মান লিখে না দিয়ে
          সাধারণত 3-ডিজিট কোড ব্যবহার করা হয়।
        </p>

        <p>
          প্রথম দুইটি ডিজিট হলো significant figure, আর তৃতীয় ডিজিট বলে দেয়
          pF এককে কতটি শূন্য যোগ করতে হবে।
        </p>

        <p>
          উদাহরণ হিসেবে <strong>{code}</strong> কোডের মান হলো{" "}
          <strong>{formatCapacitancePf(sample.capacitancePf)}</strong>।
        </p>

        <p>
          এই ছোট কোড পদ্ধতির কারণে খুব ছোট কম্পোনেন্টেও দ্রুত ক্যাপাসিট্যান্স
          চিহ্নিত করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="ডাইইলেকট্রিক টাইপ গুরুত্বপূর্ণ কেন?" eyebrow="Material Behavior">
        <p>
          ডাইইলেকট্রিক হলো ক্যাপাসিটরের ভেতরের সেরামিক পদার্থ, যা
          স্থিতিশীলতা, তাপমাত্রা পরিবর্তনে আচরণ, এবং ব্যবহারযোগ্যতা নির্ধারণে
          বড় ভূমিকা রাখে।
        </p>

        <p>
          এই লেসনে <strong>{dielectric.name}</strong> দেখানো হয়েছে একটি
          ভারসাম্যপূর্ণ দৈনন্দিন পছন্দ হিসেবে। এটি ডিকাপলিং এবং ফিল্টারিংয়ে
          খুব সাধারণ।
        </p>

        <p>
          <strong>C0G / NP0</strong> এর মতো বেশি স্থিতিশীল পরিবার precision
          timing এবং RF সার্কিটের জন্য ভালো, আর <strong>Y5V</strong> ছোট
          আকারে বেশি ক্যাপাসিট্যান্স দিলেও স্থিতিশীলতা তুলনামূলক কম।
        </p>
      </SectionCard>

      <SectionCard title="ভোল্টেজ রেটিং গুরুত্বপূর্ণ কেন?" eyebrow="Safety Margin">
        <p>
          প্রতিটি ক্যাপাসিটরের একটি সর্বোচ্চ ভোল্টেজ রেটিং থাকে। স্বাভাবিক
          ব্যবহারে প্রয়োগ করা ভোল্টেজকে সেই সীমার আরামদায়ক নিচে রাখা উচিত।
        </p>

        <p>
          এই উদাহরণে applied voltage হলো <strong>{appliedVoltage} V</strong>{" "}
          এবং voltage rating হলো <strong>{voltageRating} V</strong>।
        </p>

        <p>
          এতে প্রায় <strong>{formatNumber(sample.safePercent, 0)} %</strong>{" "}
          সেফটি মার্জিন পাওয়া যায়। ভালো সেফটি মার্জিন সাধারণত কম স্ট্রেস এবং
          দীর্ঘমেয়াদে ভালো নির্ভরযোগ্যতা দেয়।
        </p>
      </SectionCard>

      <SectionCard title="রিয়্যাক্ট্যান্স কীভাবে আচরণ করে?" eyebrow="Frequency Response">
        <p>
          ক্যাপাসিটর AC-কে রেজিস্টরের মতো বাধা দেয় না। বরং এর একটি
          capacitive reactance থাকে, যাকে <strong>Xc</strong> দিয়ে প্রকাশ করা
          হয়।
        </p>

        <p>
          মূল নিয়মটি সহজ: ফ্রিকোয়েন্সি বাড়লে capacitive reactance কমে যায়।
        </p>

        <p>
          এই উদাহরণে <strong>{formatNumber(frequency, 0)} Hz</strong>{" "}
          ফ্রিকোয়েন্সিতে reactance প্রায়{" "}
          <strong>{formatNumber(sample.reactanceOhm, 2)} Ohm</strong>।
        </p>

        <p>
          এ কারণেই সেরামিক ক্যাপাসিটর উচ্চ-ফ্রিকোয়েন্সির বাইপাসিং এবং নয়েজ
          ফিল্টারিংয়ে এত কার্যকর।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল সূত্র" eyebrow="Formula Sheet">
        <p>
          <strong>Xc = 1 / (2pi f C)</strong> হলো AC সার্কিটে ক্যাপাসিটরের
          রিয়্যাক্ট্যান্সের মূল সূত্র।
        </p>

        <p>
          এই সূত্র দেখায় যে ফ্রিকোয়েন্সি <strong>f</strong> বাড়লে বা
          ক্যাপাসিট্যান্স <strong>C</strong> বাড়লে reactance কমে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: বড় ক্যাপাসিট্যান্স এবং বেশি ফ্রিকোয়েন্সি
          দুটোই AC পরিবর্তনকে ক্যাপাসিটরের মধ্য দিয়ে তুলনামূলক সহজে যেতে
          সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব ব্যবহার" eyebrow="Application Insight">
        <p>
          মাইক্রোকন্ট্রোলারের পাওয়ার পিনের কাছে বসানো একটি সেরামিক
          ক্যাপাসিটর দ্রুত নয়েজ শোষণ করতে পারে এবং খুব ছোট ভোল্টেজ ডিপের সময়
          চার্জ ছেড়ে দিতে পারে।
        </p>

        <p>
          সিগন্যাল ও RF অংশেও stable ceramic type ব্যবহৃত হয়, কারণ এগুলো
          উচ্চ ফ্রিকোয়েন্সিতে ভালো আচরণ করে।
        </p>

        <p>
          এই কারণেই আধুনিক সার্কিট বোর্ডে প্রায় সর্বত্র সেরামিক ক্যাপাসিটর
          দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>সেরামিক ক্যাপাসিটরে ডাইইলেকট্রিক হিসেবে সেরামিক ব্যবহৃত হয়।</li>
          <li>সাধারণত ব্যবহৃত বেশিরভাগ সেরামিক ক্যাপাসিটর নন-পোলারাইজড।</li>
          <li>3-ডিজিট কোড দিয়ে ক্যাপাসিট্যান্সের মান দেখানো হয়।</li>
          <li>ডাইইলেকট্রিক টাইপ স্থিতিশীলতা ও তাপমাত্রাগত আচরণকে প্রভাবিত করে।</li>
          <li>Applied voltage-কে voltage rating-এর নিচে রাখতে হয়।</li>
          <li>ফ্রিকোয়েন্সি বাড়লে capacitive reactance কমে যায়।</li>
          <li>সেরামিক ক্যাপাসিটর ডিকাপলিং ও ফিল্টারিংয়ে খুব কার্যকর।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
