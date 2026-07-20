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
      question: "সব কাজের জন্য একটি single diode ব্যবহার না করে different diode type কেন দরকার?",
      answer:
        "কারণ different application-এর জন্য low forward drop, controlled reverse breakdown, light emission, light sensing, বা variable capacitance-এর মতো different behavior দরকার হয়।",
    },
    {
      question: "Voltage regulation-এর জন্য সাধারণত কোন diode type বেছে নেওয়া হয়?",
      answer:
        "Controlled reverse-voltage regulation দরকার হলে সাধারণত Zener diode বেছে নেওয়া হয়।",
    },
    {
      question: "Efficient power circuit-এ Schottky diode জনপ্রিয় কেন?",
      answer:
        "কারণ এর forward voltage drop কম এবং switching behavior খুব fast।",
    },
    {
      question: "Generic diode-এর তুলনায় LED-এর বিশেষত্ব কী?",
      answer:
        "Forward current flow করলে LED আলো emit করে।",
    },
    {
      question: "Photodiode-এর বিশেষত্ব কী?",
      answer:
        "Photodiode light-এর প্রতি respond করার জন্য তৈরি এবং সেটিকে electrical effect-এ রূপান্তর করে।",
    },
    {
      question: "Varactor diode সাধারণ rectifier diode থেকে আলাদা কেন?",
      answer:
        "Varactor মূলত voltage-controlled capacitance-এর জন্য ব্যবহৃত হয়, ordinary rectification-এর জন্য নয়।",
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
              ডায়োডের ধরন
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Different diode type তৈরি করা হয় different electronic problem
              সমাধানের জন্য, যদিও সবগুলোর ভিত্তি basic diode idea থেকেই আসে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনটি diode family-কে behavior, purpose, এবং application-এর
              ভিত্তিতে compare করে; সব diode-কে একই component হিসেবে ধরে নেয়
              না।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              কোন family-র special feature কী তা বুঝে গেলে component selection
              অনেক বেশি practical হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Generic Diode" value="Rectify" tone="violet" />
            <ValueCard label="Zener Diode" value="Regulate" tone="emerald" />
            <ValueCard label="Varactor Diode" value="Tune" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="ডায়োডের এত ধরন কেন আছে?" eyebrow="Core Concept">
        <p>
          একটি basic diode একদিকে current control দেয়, কিন্তু real circuit-এ
          আরও special behavior দরকার হয়।
        </p>

        <p>
          কিছু circuit-এ fast switching দরকার, কিছুতে voltage regulation,
          কিছুতে light emission, আর কিছুতে light detection বা tuning দরকার
          হয়।
        </p>

        <p>
          এ কারণেই অনেক diode family আছে, যদিও এদের সবার broad diode
          foundation একই।
        </p>
      </SectionCard>

      <SectionCard title="Generic diode কী?" eyebrow="Reference Type">
        <p>
          Generic diode হলো baseline teaching diode, যা rectification, polarity
          protection, এবং simple switching-এর জন্য ব্যবহৃত হয়।
        </p>

        <p>
          এটি মূলত forward bias-এ conduct করে এবং reverse current-কে block
          করে, তবে tiny leakage current থাকতে পারে।
        </p>

        <p>
          এটি এমন একটি reference point, যেখান থেকে specialized diode type-গুলো
          বোঝা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Zener diode বিশেষ কেন?" eyebrow="Regulation">
        <p>
          Zener diode reverse breakdown region-এ controlled way-তে operate
          করার জন্য design করা হয়েছে।
        </p>

        <p>
          তাই এটি voltage reference এবং small regulation task-এর জন্য useful,
          শুধু ordinary one-way conduction-এর জন্য নয়।
        </p>

        <p>
          যখন reverse-voltage control ordinary rectification-এর চেয়ে বেশি
          গুরুত্বপূর্ণ হয়, তখন Zener family গুরুত্বপূর্ণ হয়ে ওঠে।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি কোনো circuit-এর জন্য stable reverse-voltage
            reference দরকার হয়, তাহলে generic diode নাকি Zener diode বেশি
            natural choice হবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Schottky diode বিশেষ কেন?" eyebrow="Fast and Efficient">
        <p>
          Schottky diode low forward voltage drop এবং very fast switching
          behavior-এর জন্য পরিচিত।
        </p>

        <p>
          এ কারণে efficiency গুরুত্বপূর্ণ এমন circuit-এ, বিশেষ করে switch-mode
          power supply path এবং fast power circuit-এ, এটি বেশি ব্যবহৃত হয়।
        </p>

        <p>
          এর tradeoff হলো সাধারণ PN diode-এর তুলনায় reverse leakage বেশি হতে
          পারে এবং reverse-voltage rating কম হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="LED এবং photodiode সম্পর্কে কী?" eyebrow="Light Interaction">
        <p>
          LED হলো এমন একটি diode, যা forward current flow করলে আলো emit করে।
        </p>

        <p>
          Photodiode ঠিক উল্টো ধরনের কাজ করে: এটি incoming light-এর প্রতি
          respond করে এবং electrical effect তৈরি করে।
        </p>

        <p>
          এই উদাহরণগুলো দেখায় কিছু diode type শুধু power বা signal direction-এর
          জন্য নয়, light interaction-এর জন্যও তৈরি।
        </p>
      </SectionCard>

      <SectionCard title="Varactor diode আলাদা কেন?" eyebrow="Tuning Use">
        <p>
          Varactor বা varicap diode মূলত ordinary current rectification-এর
          জন্য বেছে নেওয়া হয় না।
        </p>

        <p>
          বরং এটি গুরুত্বপূর্ণ কারণ reverse voltage-এর সাথে এর junction
          capacitance পরিবর্তিত হয়।
        </p>

        <p>
          এ কারণে এটি tuning circuit, RF control, এবং voltage-controlled
          oscillator-এ useful।
        </p>
      </SectionCard>

      <SectionCard title="Diode family কীভাবে compare করব?" eyebrow="Selection Logic">
        <p>
          একটি ভালো comparison শুরু হয় এই প্রশ্ন থেকে: circuit-এর আসলে কী
          দরকার?
        </p>

        <p>
          যদি rectification দরকার হয়, generic diode যথেষ্ট হতে পারে। যদি
          voltage regulation দরকার হয়, তাহলে Zener ভাবুন। যদি efficiency এবং
          speed দরকার হয়, Schottky ভাবুন।
        </p>

        <p>
          যদি light, sensing, বা tuning দরকার হয়, তাহলে specialized optical
          এবং RF diode family বেশি relevant হয়ে ওঠে।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          একটি diode type বেছে নেওয়ার সবচেয়ে সহজ উপায় হলো সব part number আগে
          মুখস্থ না করে circuit-এর purpose-এর সাথে diode family match করা।
        </p>

        <p>
          যেমন: rectify, regulate, emit light, sense light, switch fast, বা
          tune frequency।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: different diode type আছে কারণ different
          electronics problem-এর জন্য different diode behavior দরকার হয়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি power supply-তে rectifier diode বা Schottky diode ব্যবহার হতে
          পারে, আবার একটি small regulator section-এ Zener diode ব্যবহার হতে
          পারে।
        </p>

        <p>
          একটি front-panel indicator-এ LED থাকতে পারে, আর optical sensing
          circuit-এ photodiode থাকতে পারে।
        </p>

        <p>
          তাই সঠিক diode type বেছে নেওয়া মানে আসলে কাজের জন্য সঠিক function
          বেছে নেওয়া।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Different diode type আছে কারণ circuit-এর different behavior দরকার হয়।</li>
          <li>Generic diode rectification এবং protection-এর baseline type।</li>
          <li>Zener diode reverse-voltage regulation-এর জন্য গুরুত্বপূর্ণ।</li>
          <li>Schottky diode low drop এবং fast switching-এর জন্য মূল্যবান।</li>
          <li>LED আলো emit করে, আর photodiode light-এর প্রতি respond করে।</li>
          <li>Varactor diode voltage-controlled capacitance এবং tuning-এ ব্যবহৃত হয়।</li>
          <li>Diode selection circuit purpose থেকে শুরু করা উচিত, শুধু নাম থেকে নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
