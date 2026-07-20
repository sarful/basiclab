"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeWorkingPrincipleSnapshot,
  formatCharge,
  formatCurrent,
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
  const supplyVoltage = 12;
  const resistance = 1000;
  const capacitance = 470;
  const time = 0.47;
  const mode = "charging" as const;
  const sample = computeWorkingPrincipleSnapshot({
    supplyVoltage,
    resistance,
    capacitance,
    time,
    mode,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ক্যাপাসিটরকে ব্যাটারির সাথে যুক্ত করলে প্রথমে কী ঘটে?",
      answer:
        "চার্জ আলাদা হতে শুরু করে। এক প্লেটে ইলেকট্রন জমা হয় এবং অন্য প্লেট থেকে ইলেকট্রন সরে যায়।",
    },
    {
      question: "ক্যাপাসিটরে শক্তি কোথায় সঞ্চিত থাকে?",
      answer: "শক্তি দুই প্লেটের মাঝের বৈদ্যুতিক ক্ষেত্রে সঞ্চিত থাকে।",
    },
    {
      question: "চার্জিংয়ের শুরুতে কারেন্ট বেশি কেন থাকে?",
      answer:
        "শুরুর সময়ে ক্যাপাসিটর আনচার্জড থাকে, তাই উৎস সবচেয়ে বেশি চার্জিং কারেন্ট সরবরাহ করে।",
    },
    {
      question: "সময় বাড়ার সাথে চার্জিং কারেন্টের কী হয়?",
      answer:
        "ক্যাপাসিটরের ভোল্টেজ বাড়ার সাথে সাথে চার্জিং কারেন্ট ধীরে ধীরে কমে যায়।",
    },
    {
      question: "আদর্শভাবে সম্পূর্ণ চার্জড ক্যাপাসিটর স্থির DC-তে কী করে?",
      answer: "সম্পূর্ণ চার্জ হওয়ার পর এটি স্থির DC কারেন্টকে ব্লক করে।",
    },
    {
      question: "ডিসচার্জের সময় কী ঘটে?",
      answer:
        "সঞ্চিত চার্জ এবং সঞ্চিত শক্তি আবার সার্কিটে ফিরে যায়।",
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
              ক্যাপাসিটরের কার্যপ্রণালী
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ক্যাপাসিটর দুই প্লেটে চার্জ আলাদা করে এবং তাদের মাঝখানের
              বৈদ্যুতিক ক্ষেত্রে শক্তি সঞ্চয় করে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনে আমরা চার্জিং ও ডিসচার্জিংয়ের বাস্তব আচরণ দেখব:
              ভোল্টেজ কীভাবে তৈরি হয়, কারেন্ট কীভাবে কমে, এবং শক্তি কীভাবে
              সঞ্চিত থাকে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি মূল কথা মনে রাখুন: ক্যাপাসিটর শুধু চলমান কারেন্টে শক্তি
              জমা রাখে না, বরং চার্জ বিভাজনের ফলে তৈরি বৈদ্যুতিক ক্ষেত্রে শক্তি
              সঞ্চয় করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="সঞ্চিত ভোল্টেজ"
              value={`${formatNumber(sample.capacitorVoltage, 2)} V`}
              tone="violet"
            />
            <ValueCard
              label="সঞ্চিত চার্জ"
              value={formatCharge(sample.storedCharge)}
              tone="emerald"
            />
            <ValueCard
              label="সঞ্চিত শক্তি"
              value={formatEnergy(sample.storedEnergy)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="কার্যপ্রণালী কী?" eyebrow="Core Concept">
        <p>
          ক্যাপাসিটরকে ভোল্টেজ সোর্সের সাথে যুক্ত করলে এক প্লেটে ইলেকট্রন
          জমা হয় এবং অন্য প্লেট থেকে ইলেকট্রন সরে যায়।
        </p>

        <p>
          এর ফলে চার্জ বিভাজন তৈরি হয়। এক প্লেট তুলনামূলক বেশি নেগেটিভ এবং
          অন্য প্লেট বেশি পজিটিভ হয়ে যায়।
        </p>

        <p>
          প্লেট দুটির মাঝখানে ইনসুলেটিং ডাইইলেকট্রিক থাকায় কারেন্ট সরাসরি
          ক্যাপাসিটরের ভেতর দিয়ে যেতে পারে না। বরং প্লেট দুটির মাঝে একটি
          বৈদ্যুতিক ক্ষেত্র তৈরি হয়।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: ক্যাপাসিটরে শক্তি কি শুধু তারে সঞ্চিত থাকে, নাকি
            দুই প্লেটের মাঝের বৈদ্যুতিক ক্ষেত্রে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          এই কার্যপ্রণালী বোঝা জরুরি, কারণ এর মাধ্যমেই বোঝা যায় কেন
          ক্যাপাসিটর ফিল্টার, টাইমিং সার্কিট, পালস সার্কিট এবং এনার্জি বাফারিং
          অ্যাপ্লিকেশনে এত দরকারি।
        </p>

        <p>
          চার্জ বিভাজন এবং বৈদ্যুতিক ক্ষেত্রে শক্তি সঞ্চয়ের ধারণা পরিষ্কার
          হলে চার্জিং, ডিসচার্জিং এবং RC সার্কিটের আচরণ বোঝা অনেক সহজ হয়ে
          যায়।
        </p>

        <p>
          এই ধারণাই ব্যাখ্যা করে কেন ক্যাপাসিটর পরিবর্তনশীল সিগন্যালকে পার হতে
          সাহায্য করতে পারে, কিন্তু সম্পূর্ণ চার্জ হওয়ার পর স্থির DC-কে ব্লক
          করে।
        </p>
      </SectionCard>

      <SectionCard title="চার্জিং কীভাবে ঘটে?" eyebrow="Charging Behavior">
        <p>
          চার্জিংয়ের প্রথম মুহূর্তে কারেন্ট সবচেয়ে বেশি থাকে, কারণ তখন
          ক্যাপাসিটর এখনও আনচার্জড।
        </p>

        <p>
          চার্জ জমতে থাকলে ক্যাপাসিটরের ভোল্টেজ বাড়ে। তখন সোর্স ভোল্টেজ এবং
          ক্যাপাসিটর ভোল্টেজের পার্থক্য কমে যায়, তাই চার্জিং কারেন্টও সময়ের
          সাথে কমতে থাকে।
        </p>

        <p>
          এই উদাহরণে সোর্স ভোল্টেজ <strong>{supplyVoltage} V</strong>, রেজিস্টর{" "}
          <strong>{resistance} Ohm</strong>, ক্যাপাসিট্যান্স{" "}
          <strong>{capacitance} uF</strong>, এবং সময় <strong>{time} s</strong>।
        </p>

        <p>
          এই মুহূর্তে ক্যাপাসিটরের ভোল্টেজ প্রায়{" "}
          <strong>{formatNumber(sample.capacitorVoltage, 2)} V</strong> এবং
          চার্জিং কারেন্ট প্রায় <strong>{formatCurrent(sample.current)}</strong>।
        </p>
      </SectionCard>

      <SectionCard title="ডিসচার্জিং কীভাবে ঘটে?" eyebrow="Discharge Behavior">
        <p>
          ডিসচার্জের সময় সঞ্চিত চার্জ চিরকাল আটকে থাকে না। এটি আবার সার্কিটে
          ফিরে যায়।
        </p>

        <p>
          ক্যাপাসিটর ডিসচার্জ হওয়ার সাথে সাথে এর ভোল্টেজ এবং সঞ্চিত শক্তি
          দুটিই সময়ের সাথে কমে যায়।
        </p>

        <p>
          এ কারণেই ক্যাপাসিটর স্বল্প সময়ের জন্য রিপল স্মুথ করতে, পালস সাপোর্ট
          দিতে, বা টাইমিং সার্কিটে ডিলে তৈরি করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল সূত্র" eyebrow="Formula Sheet">
        <p>
          <strong>Q = C x V</strong> সূত্রটি সঞ্চিত চার্জ, ক্যাপাসিট্যান্স এবং
          ভোল্টেজের সম্পর্ক দেখায়।
        </p>

        <p>
          <strong>E = 1/2 x C x V^2</strong> সূত্রটি সঞ্চিত বৈদ্যুতিক শক্তি
          নির্ণয় করে।
        </p>

        <p>
          <strong>tau = R x C</strong> সূত্রটি টাইম কনস্ট্যান্ট দেয়, যা বলে
          দেয় চার্জিং বা ডিসচার্জিং কত দ্রুত ঘটবে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          সহজ নিয়ম হলো, প্রায় <strong>5 tau</strong> সময় পরে ক্যাপাসিটর
          প্রায় সম্পূর্ণ চার্জ বা ডিসচার্জের খুব কাছাকাছি পৌঁছে যায়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Real Device Example">
        <p>একটি ছোট ডিলে টাইমার সার্কিট কল্পনা করুন।</p>

        <p>
          প্রথমে পাওয়ার দিলে ক্যাপাসিটর চার্জ হতে শুরু করে। আউটপুট তখনই
          পরিবর্তিত হয়, যখন ক্যাপাসিটরের ভোল্টেজ প্রয়োজনীয় মানে পৌঁছায়।
        </p>

        <p>
          আবার পাওয়ার সাপ্লাই ফিল্টারে একই কার্যপ্রণালী ক্যাপাসিটরকে ভোল্টেজ
          বেশি থাকলে শক্তি সঞ্চয় করতে এবং ভোল্টেজ কমতে শুরু করলে সেই শক্তি
          ছেড়ে দিতে সাহায্য করে।
        </p>

        <p>
          তাই বাস্তব ইলেকট্রনিক্সে ক্যাপাসিটরের কার্যপ্রণালী বোঝা খুবই
          গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>ক্যাপাসিটরের দুই প্লেটে চার্জ আলাদা হয়।</li>
          <li>প্লেট দুটির মাঝে বৈদ্যুতিক ক্ষেত্র তৈরি হয়।</li>
          <li>শক্তি সেই বৈদ্যুতিক ক্ষেত্রেই সঞ্চিত থাকে।</li>
          <li>চার্জিং কারেন্ট শুরুতে বেশি থাকে, পরে কমে যায়।</li>
          <li>চার্জিংয়ের সময় ক্যাপাসিটরের ভোল্টেজ বাড়ে।</li>
          <li>ডিসচার্জের সময় সঞ্চিত শক্তি আবার সার্কিটে ফিরে যায়।</li>
          <li>RC টাইম কনস্ট্যান্ট চার্জিং ও ডিসচার্জিংয়ের গতি নিয়ন্ত্রণ করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
