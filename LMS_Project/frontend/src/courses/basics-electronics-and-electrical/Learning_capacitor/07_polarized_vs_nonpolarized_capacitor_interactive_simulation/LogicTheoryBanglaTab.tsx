"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeComparisonSnapshot,
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
  const voltage = 12;
  const frequency = 1000;
  const sample = computeComparisonSnapshot({
    voltage,
    frequency,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "পোলারাইজড এবং নন-পোলারাইজড ক্যাপাসিটরের প্রধান পার্থক্য কী?",
      answer:
        "পোলারাইজড ক্যাপাসিটরে সঠিক polarity দরকার, আর non-polarized capacitor সাধারণত দুই দিকেই সংযোগ করা যায়।",
    },
    {
      question: "পাওয়ার সাপ্লাইতে DC ripple smoothing-এর জন্য সাধারণত কোন ধরনের ক্যাপাসিটর ব্যবহার করা হয়?",
      answer:
        "পোলারাইজড electrolytic capacitor সাধারণত DC ripple smoothing-এর জন্য ব্যবহার করা হয়।",
    },
    {
      question: "AC coupling এবং signal কাজের জন্য কোন ধরনের ক্যাপাসিটর বেশি উপযোগী?",
      answer:
        "Non-polarized capacitor AC coupling, audio, এবং RF signal application-এর জন্য বেশি উপযোগী।",
    },
    {
      question: "পোলারাইজড ক্যাপাসিটরের ক্ষেত্রে reverse polarity বিপজ্জনক কেন?",
      answer:
        "কারণ polarized capacitor একদিকের সংযোগের জন্য তৈরি, তাই reverse polarity component-টিকে ক্ষতিগ্রস্ত করতে পারে।",
    },
    {
      question: "Non-polarized side-এ frequency বেশি গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ non-polarized capacitor প্রায়ই AC signal-এর সাথে ব্যবহৃত হয়, তাই frequency তার behavior এবং reactance-কে অনেক প্রভাবিত করে।",
    },
    {
      question: "Non-polarized capacitor কি positive এবং negative দুই ধরনের AC cycle সামলাতে পারে?",
      answer:
        "হ্যাঁ। এটাই non-polarized capacitor-এর AC friendly হওয়ার প্রধান কারণগুলোর একটি।",
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
              পোলারাইজড বনাম নন-পোলারাইজড ক্যাপাসিটর
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই লেসনে আমরা দুইটি প্রধান ক্যাপাসিটর পরিবারের তুলনা করব:
              সংযোগের দিক, AC behavior, safety, এবং practical use-এর ভিত্তিতে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              মূল প্রশ্নটি খুব সহজ: কখন polarized capacitor বেছে নেব, আর
              কখন non-polarized capacitor বেছে নেব?
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই তুলনা পরিষ্কার হয়ে গেলে বাস্তব সার্কিটে capacitor selection
              অনেক সহজ হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Applied Voltage"
              value={`${formatNumber(voltage, 0)} V`}
              tone="violet"
            />
            <ValueCard
              label="Voltage Safety"
              value={`${formatNumber(sample.safeMargin * 100, 0)} %`}
              tone="emerald"
            />
            <ValueCard
              label="AC Behavior"
              value={`${formatNumber(sample.acBehavior * 100, 0)} %`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="মূল পার্থক্য কী?" eyebrow="Core Concept">
        <p>
          একটি polarized capacitor-কে অবশ্যই সঠিক positive এবং negative
          direction-এ সংযোগ করতে হয়।
        </p>

        <p>
          একটি non-polarized capacitor-এর ক্ষেত্রে সাধারণত এই direction
          restriction থাকে না, তাই এটি দুই দিকেই ব্যবহার করা যায়।
        </p>

        <p>
          এই একটিমাত্র পার্থক্যই ইলেকট্রনিক্সে প্রতিটি capacitor type কোথায়
          ব্যবহার হবে তা অনেকটাই নির্ধারণ করে।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি কোনো সার্কিটে alternating polarity থাকে,
            তাহলে সাধারণত কোন capacitor type বেছে নেওয়া বেশি নিরাপদ?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="কোথায় কোনটি ব্যবহার হয়?" eyebrow="Application Choice">
        <p>
          Polarized capacitor, বিশেষ করে electrolytic type, power supply
          filtering, bulk energy storage, এবং DC ripple smoothing-এ ব্যাপকভাবে
          ব্যবহৃত হয়।
        </p>

        <p>
          Non-polarized capacitor AC coupling, audio circuit, timing network,
          এবং RF application-এ বেশি দেখা যায়।
        </p>

        <p>
          তাই practical design-এ capacitor choice এলোমেলো নয়। এটি নির্ভর করে
          সার্কিটটি মূলত DC-focused নাকি AC-signal-focused।
        </p>
      </SectionCard>

      <SectionCard title="Polarity গুরুত্বপূর্ণ কেন?" eyebrow="Safety Rule">
        <p>
          একটি polarized capacitor-এর জন্য correct polarity হলো basic safety
          এবং reliability rule।
        </p>

        <p>
          যদি reverse polarity দেওয়া হয়, তাহলে capacitor গরম হতে পারে,
          degrade করতে পারে, বা ক্ষতিগ্রস্ত হতে পারে।
        </p>

        <p>
          এই sample comparison-এ applied voltage হলো{" "}
          <strong>{formatNumber(voltage, 0)} V</strong>, যা 25 V reference level
          এর তুলনায় প্রায়{" "}
          <strong>{formatNumber(sample.safeMargin * 100, 0)} %</strong> safety
          margin দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Non-polarized capacitor AC friendly কেন?" eyebrow="AC Behavior">
        <p>
          Non-polarized capacitor positive এবং negative দুই ধরনের signal swing
          সামলাতে পারে, তাই এগুলো AC circuit-এর জন্য উপযোগী।
        </p>

        <p>
          এখানে frequency গুরুত্বপূর্ণ, কারণ AC frequency এবং reactance-এর
          সাথে capacitor behavior পরিবর্তিত হয়।
        </p>

        <p>
          এই উদাহরণে comparison-এ{" "}
          <strong>{formatNumber(frequency, 0)} Hz</strong> ব্যবহার করা হয়েছে,
          যেখানে AC behavior indicator প্রায়{" "}
          <strong>{formatNumber(sample.acBehavior * 100, 0)} %</strong>।
        </p>
      </SectionCard>

      <SectionCard title="কীভাবে নির্বাচন করব?" eyebrow="Selection Logic">
        <p>
          যদি fixed polarity-এর সার্কিটে high capacitance দরকার হয়, তাহলে
          polarized capacitor বেছে নিন।
        </p>

        <p>
          যদি signal direction পরিবর্তিত হয়, বা circuit AC, audio, কিংবা
          higher-frequency content handle করে, তাহলে non-polarized capacitor
          বেছে নিন।
        </p>

        <p>
          একজন ভালো engineer প্রথমে polarity condition দেখে, তারপর voltage,
          frequency, এবং circuit-এর purpose যাচাই করে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে গুরুত্বপূর্ণ ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          এই লেসনটি একটি নির্দিষ্ট equation-এর চেয়ে বেশি একটি practical
          decision rule শেখায়।
        </p>

        <p>
          <strong>
            Fixed DC polarity এবং বড় capacitance need থাকলে সাধারণত polarized
            capacitor-এর দিকে যাওয়া হয়।
          </strong>
        </p>

        <p>
          <strong>
            Alternating signal direction বা AC handling থাকলে সাধারণত
            non-polarized capacitor-এর দিকে যাওয়া হয়।
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি power supply output stage-এ ripple smooth করার জন্য প্রায়ই একটি
          polarized electrolytic capacitor ব্যবহার করা হয়, কারণ সেখানে high
          capacitance দরকার এবং polarity fixed থাকে।
        </p>

        <p>
          একটি audio coupling stage-এ non-polarized capacitor অনেক সময় বেশি
          নিরাপদ পছন্দ, কারণ signal positive এবং negative দুই দিকেই swing
          করতে পারে।
        </p>

        <p>
          এই দুইটি উদাহরণ দেখায়, capacitor type বোঝা শুধু definition মুখস্থ
          করার চেয়ে অনেক বেশি গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Polarized capacitor-এ সঠিক connection direction দরকার।</li>
          <li>Non-polarized capacitor সাধারণত দুই দিকেই সংযোগ করা যায়।</li>
          <li>Polarized type DC filtering এবং ripple smoothing-এ সাধারণ।</li>
          <li>Non-polarized type AC coupling এবং signal circuit-এ সাধারণ।</li>
          <li>Reverse polarity polarized capacitor-কে ক্ষতিগ্রস্ত করতে পারে।</li>
          <li>AC application-এ frequency behavior বিশেষভাবে গুরুত্বপূর্ণ।</li>
          <li>Capacitor selection polarity, voltage, frequency, এবং use case-এর ওপর নির্ভর করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
