"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeElectrolyticSnapshot,
  formatCapacitance,
  formatEnergy,
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
  const capacitance = 1000;
  const voltageRating = 25;
  const appliedVoltage = 12;
  const esr = 0.22;
  const rippleCurrent = 0.35;
  const polarity = "correct" as const;

  const sample = computeElectrolyticSnapshot({
    capacitance,
    voltageRating,
    appliedVoltage,
    esr,
    rippleCurrent,
    polarity,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ইলেক্ট্রোলাইটিক ক্যাপাসিটর ব্যবহারের সবচেয়ে গুরুত্বপূর্ণ নিয়ম কী?",
      answer:
        "পোলারিটি অবশ্যই ঠিকভাবে সংযোগ করতে হবে, কারণ ইলেক্ট্রোলাইটিক ক্যাপাসিটর পোলারাইজড কম্পোনেন্ট।",
    },
    {
      question: "পাওয়ার সাপ্লাইতে ইলেক্ট্রোলাইটিক ক্যাপাসিটর এত জনপ্রিয় কেন?",
      answer:
        "এগুলো তুলনামূলক বড় ক্যাপাসিট্যান্স দিতে পারে, যা রিপল স্মুথ করতে এবং উপযোগী শক্তি সঞ্চয় করতে সাহায্য করে।",
    },
    {
      question: "Applied voltage যদি voltage rating-এর খুব কাছে চলে যায়, তখন কী হয়?",
      answer:
        "সেফটি মার্জিন কমে যায়, স্ট্রেস বাড়ে, এবং নির্ভরযোগ্যতার ঝুঁকি বেশি হয়।",
    },
    {
      question: "ESR গুরুত্বপূর্ণ কেন?",
      answer:
        "ESR এর কারণে power loss ও heating হয়, বিশেষ করে ripple current ক্যাপাসিটরের মধ্য দিয়ে প্রবাহিত হলে।",
    },
    {
      question: "Ripple current আর heating-এর মধ্যে সম্পর্ক কী?",
      answer:
        "Ripple current বেশি হলে heat loss-ও বেশি হয়, বিশেষ করে ESR কম না হলে।",
    },
    {
      question: "Reverse polarity ইলেক্ট্রোলাইটিক ক্যাপাসিটরের জন্য বিপজ্জনক কেন?",
      answer:
        "Reverse polarity internal stress এবং leakage risk বাড়ায়, এবং এতে ক্যাপাসিটর ক্ষতিগ্রস্ত হতে পারে।",
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
              ইলেক্ট্রোলাইটিক ক্যাপাসিটর
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ইলেক্ট্রোলাইটিক ক্যাপাসিটর হলো একটি পোলারাইজড ক্যাপাসিটর, যা
              ছোট প্যাকেজে তুলনামূলক বড় ক্যাপাসিট্যান্স দেওয়ার জন্য তৈরি।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনে আমরা polarity, বড় energy storage, voltage safety
              margin, ESR heating, ripple current, এবং power circuit-এ smoothing
              behavior নিয়ে শিখব।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই ধরনের ক্যাপাসিটর বিশেষভাবে power supply, bulk filtering, এবং
              DC smoothing অ্যাপ্লিকেশনে খুব বেশি ব্যবহৃত হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="ক্যাপাসিট্যান্স"
              value={formatCapacitance(capacitance)}
              tone="violet"
            />
            <ValueCard
              label="সঞ্চিত শক্তি"
              value={formatEnergy(sample.storedEnergy)}
              tone="emerald"
            />
            <ValueCard
              label="সেফটি মার্জিন"
              value={`${formatNumber(sample.safetyMargin, 0)} %`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="ইলেক্ট্রোলাইটিক ক্যাপাসিটর কী?" eyebrow="Core Concept">
        <p>
          ইলেক্ট্রোলাইটিক ক্যাপাসিটর এমন একটি ক্যাপাসিটর, যা electrolytic
          structure ব্যবহার করে অনেক ছোট signal capacitor-এর তুলনায় অনেক বেশি
          ক্যাপাসিট্যান্স অর্জন করতে পারে।
        </p>

        <p>
          বেশিরভাগ ceramic capacitor-এর বিপরীতে, electrolytic capacitor{" "}
          <strong>polarized</strong>। অর্থাৎ positive এবং negative terminal
          অবশ্যই সঠিক দিকে সংযোগ করতে হবে।
        </p>

        <p>
          এই polarity rule হলো এই কম্পোনেন্ট নির্বাচন বা wiring করার সময়
          মনে রাখার সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলোর একটি।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: ইলেক্ট্রোলাইটিক ক্যাপাসিটরের ক্ষেত্রে polarity
            এত গুরুত্বপূর্ণ কেন?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি উপকারী কেন?" eyebrow="Why It Matters">
        <p>
          ইলেক্ট্রোলাইটিক ক্যাপাসিটর উপকারী, কারণ এগুলো একই ধরনের অনেক ছোট
          ক্যাপাসিটরের তুলনায় বেশি চার্জ এবং বেশি শক্তি সঞ্চয় করতে পারে।
        </p>

        <p>
          তাই এগুলো rectified DC smooth করা, load change support করা, এবং power
          supply circuit-এ ripple কমাতে খুব সাহায্য করে।
        </p>

        <p>
          এই উদাহরণে ক্যাপাসিটরের মান <strong>{formatCapacitance(capacitance)}</strong>,
          যা bulk filtering-এর জন্য যথেষ্ট বড়।
        </p>
      </SectionCard>

      <SectionCard title="ভোল্টেজ মার্জিন গুরুত্বপূর্ণ কেন?" eyebrow="Safety Margin">
        <p>
          প্রতিটি electrolytic capacitor-এর একটি voltage rating থাকে, এবং
          স্বাভাবিক ব্যবহারে applied voltage-কে সেই সীমার আরামদায়ক নিচে রাখা
          উচিত।
        </p>

        <p>
          এই উদাহরণে applied voltage হলো <strong>{appliedVoltage} V</strong>{" "}
          এবং rating হলো <strong>{voltageRating} V</strong>।
        </p>

        <p>
          এতে প্রায় <strong>{formatNumber(sample.safetyMargin, 0)} %</strong>{" "}
          সেফটি মার্জিন পাওয়া যায়। ভালো মার্জিন সাধারণত কম স্ট্রেস এবং বেশি
          service life দেয়।
        </p>
      </SectionCard>

      <SectionCard title="ESR-এর ভূমিকা কী?" eyebrow="Loss and Heating">
        <p>
          ESR এর পূর্ণরূপ equivalent series resistance। এটি ক্যাপাসিটরের
          ভেতরের internal resistive loss বোঝায়।
        </p>

        <p>
          Ripple current প্রবাহিত হলে ESR-এর কারণে heat তৈরি হয়। এই উদাহরণে
          ESR হলো <strong>{esr} Ohm</strong> এবং ripple current হলো{" "}
          <strong>{rippleCurrent} A</strong>।
        </p>

        <p>
          আনুমানিক heat loss হলো{" "}
          <strong>{formatNumber(sample.heatLoss * 1000, 2)} mW</strong>।
          সাধারণত ESR কম হলে heating কমে এবং power filtering-এ performance
          ভালো হয়।
        </p>
      </SectionCard>

      <SectionCard title="রিপল স্মুথিং কীভাবে কাজ করে?" eyebrow="Smoothing Behavior">
        <p>
          Power supply-তে input voltage বাড়লে ক্যাপাসিটর চার্জ হয়, আর peak-এর
          মাঝখানে voltage কমে গেলে সঞ্চিত শক্তি ছেড়ে দেয়।
        </p>

        <p>
          এই charging এবং discharging action output voltage-কে smoother করতে
          এবং load-এর দেখা ripple কমাতে সাহায্য করে।
        </p>

        <p>
          বড় capacitance সাধারণত smoothing উন্নত করে, আর অতিরিক্ত ESR
          performance খারাপ করে এবং বেশি heat তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="Reverse polarity ঝুঁকিপূর্ণ কেন?" eyebrow="Polarity Risk">
        <p>
          Electrolytic capacitor-কে স্বাভাবিক DC operation-এ উল্টোভাবে
          সংযোগ করার জন্য তৈরি করা হয়নি।
        </p>

        <p>
          Reverse polarity internal stress হঠাৎ বাড়িয়ে দিতে পারে, leakage risk
          বাড়ায়, এবং স্থায়ীভাবে component নষ্ট করতে পারে।
        </p>

        <p>
          এই কারণেই বাস্তব ইলেকট্রনিক্সে সঠিক polarity marking এবং careful
          installation এত গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল সূত্র" eyebrow="Formula Sheet">
        <p>
          <strong>E = 1/2 C V^2</strong> হলো ক্যাপাসিটরের শক্তি সঞ্চয়ের মূল
          সূত্র।
        </p>

        <p>
          এই উদাহরণে stored energy প্রায়{" "}
          <strong>{formatEnergy(sample.storedEnergy)}</strong>।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: capacitance বা voltage বাড়লে stored energy
          দ্রুত বাড়ে, তাই electrolytic capacitor bulk energy storage-এর কাজে
          খুব উপযোগী।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          Rectification-এর পরে একটি DC power supply-তে output-এর দুই পাশে
          প্রায়ই একটি electrolytic capacitor বসানো হয়, যাতে pulsating voltage
          smooth করা যায়।
        </p>

        <p>
          এটি waveform-এর উচ্চ অংশে শক্তি সঞ্চয় করে এবং waveform dip করলে সেই
          শক্তি ছেড়ে দেয়, ফলে load তুলনামূলক steady DC voltage পায়।
        </p>

        <p>
          এটি ইলেকট্রনিক্সে electrolytic capacitor-এর সবচেয়ে সাধারণ এবং
          গুরুত্বপূর্ণ ব্যবহারগুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Electrolytic capacitor হলো polarized component।</li>
          <li>এগুলো ছোট আকারে তুলনামূলক বড় capacitance দেয়।</li>
          <li>Power supply smoothing ও filtering-এ এগুলো ব্যাপকভাবে ব্যবহৃত হয়।</li>
          <li>Applied voltage-কে voltage rating-এর নিচে রাখতে হয়।</li>
          <li>Ripple current প্রবাহিত হলে ESR heating তৈরি করে।</li>
          <li>Reverse polarity leakage risk বাড়ায় এবং component নষ্ট করতে পারে।</li>
          <li>Stored energy এর সূত্র হলো E = 1/2 C V^2।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
