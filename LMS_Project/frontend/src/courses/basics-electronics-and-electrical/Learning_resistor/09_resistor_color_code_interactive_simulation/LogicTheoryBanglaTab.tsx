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
  tone: "emerald" | "sky" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300" />
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
      question: "Resistor-এর প্রথম দুই বা তিনটি band সাধারণত কী বোঝায়?",
      answer:
        "এগুলো সাধারণত resistor value-এর significant digit বোঝায়।",
    },
    {
      question: "Multiplier band কী কাজ করে?",
      answer:
        "Multiplier band significant digit-এর সাথে decimal scale বা number of zeros যোগ করে value scale করে।",
    },
    {
      question: "Tolerance band আমাদের কী বলে?",
      answer:
        "এটি বলে actual resistor value nominal value থেকে কতটা ভিন্ন হতে পারে।",
    },
    {
      question: "6-band resistor-এ extra কী information থাকে?",
      answer:
        "6-band resistor-এ একটি temperature coefficient band থাকে, যা সাধারণত ppm per degree Celsius-এ প্রকাশ করা হয়।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              রেজিস্টর কালার কোড
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistor color code হলো এমন একটি visual system যেখানে colored
              band ব্যবহার করে resistor value, multiplier, tolerance, এবং
              কখনো temperature coefficient দেখানো হয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা 4-band, 5-band, এবং 6-band resistor কীভাবে
              correctly read করতে হয়, band order কীভাবে calculation-কে
              প্রভাবিত করে, এবং real circuit-এ tolerance কেন গুরুত্বপূর্ণ
              তা বুঝব।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Idea" value="Band Decoding" tone="emerald" />
            <ValueCard label="Main Output" value="Resistance Value" tone="sky" />
            <ValueCard label="Extra Detail" value="Tolerance / Temp" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Resistor color code কী" eyebrow="Foundation">
        <p>
          ছোট resistor-এ অনেক সময় number আকারে value print করার মতো যথেষ্ট
          জায়গা থাকে না।
        </p>
        <p>
          তাই সেখানে important information encode করার জন্য colored band
          ব্যবহার করা হয়।
        </p>
        <p>
          এই band-গুলো correct order-এ read করলে আমরা resistor-এর nominal
          value এবং অন্য practical detail বুঝতে পারি।
        </p>
      </SectionCard>

      <SectionCard title="Band-গুলো কী বোঝায়" eyebrow="Band Roles">
        <p>
          প্রথম দুই বা তিনটি band সাধারণত significant digit বোঝায়।
        </p>
        <p>
          এর পরের band হলো multiplier, যা number-টিকে scale করে zeros যোগ
          করে বা decimal value shift করে।
        </p>
        <p>
          Tolerance band বলে real resistor value ideal printed value থেকে কতটা
          ভিন্ন হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="4-band, 5-band, এবং 6-band resistor" eyebrow="Modes">
        <p>
          4-band resistor-এ সাধারণত দুইটি significant digit, একটি multiplier
          band, এবং একটি tolerance band থাকে।
        </p>
        <p>
          5-band resistor-এ সাধারণত তিনটি significant digit থাকে, তারপর
          multiplier এবং tolerance থাকে।
        </p>
        <p>
          6-band resistor-এ এর সাথে আরও একটি band যোগ হয়, যা temperature
          coefficient দেখায় এবং সাধারণত ppm per degree Celsius-এ প্রকাশ করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="Reading direction কেন গুরুত্বপূর্ণ" eyebrow="Reading Order">
        <p>
          Band-এর order খুব গুরুত্বপূর্ণ, কারণ একই color position অনুযায়ী
          ভিন্ন অর্থ বহন করতে পারে।
        </p>
        <p>
          যদি ভুল side থেকে reading শুরু করা হয়, তাহলে পুরো resistor value-ই
          ভুল decode হতে পারে।
        </p>
        <p>
          Tolerance band অনেক সময় একটু আলাদা spacing-এ থাকে, যা correct
          reading direction বুঝতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Calculation কীভাবে কাজ করে" eyebrow="Formula Logic">
        <p>
          প্রথমে significant digit band-গুলো একসাথে করে একটি number বানাতে হয়।
        </p>
        <p>
          এরপর multiplier band apply করে সেই number scale করতে হয়।
        </p>
        <p>
          তারপর tolerance band ব্যবহার করে nominal value-এর allowed minimum ও
          maximum range বের করতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="Tolerance কেন গুরুত্বপূর্ণ" eyebrow="Practical Meaning">
        <p>
          একটি resistor সবসময় nominal value-এর সাথে একদম exactly মিলে না।
        </p>
        <p>
          Tolerance বলে real manufacturing-এ কতটা variation acceptable।
        </p>
        <p>
          Precision circuit, filter, measurement system, এবং calibration work-এ
          এটি খুব গুরুত্বপূর্ণ হয়ে ওঠে।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 9 simulator-এ আপনি 4-band, 5-band, এবং 6-band resistor
          mode-এর মধ্যে switch করতে পারেন।
        </p>
        <p>
          প্রতিটি band-এর color বদলালে decoded resistor value সঙ্গে সঙ্গে
          update হয়।
        </p>
        <p>
          6-band mode-এ live formula, allowed tolerance range, এবং temperature
          coefficient-ও দেখানো হয়।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো resistor-এর wrong side থেকে reading শুরু করা।
        </p>
        <p>
          আরেকটি mistake হলো multiplier band-কে digit band মনে করা।
        </p>
        <p>
          Student-রা অনেক সময় ভুলে যায় যে black first digit leading zero
          problem তৈরি করে, তাই সাধারণত এটি first readable digit হিসেবে ব্যবহার
          করা ঠিক নয়।
        </p>
      </SectionCard>

      <SectionCard title="Resistor color code useful কেন" eyebrow="Applications">
        <p>
          Resistor color code test equipment ছাড়াই component value দ্রুত
          identify করতে সাহায্য করে।
        </p>
        <p>
          এটি circuit assembly, troubleshooting, repair, এবং parts selection-এ
          useful।
        </p>
        <p>
          যারা real electronic component নিয়ে কাজ করে, তাদের জন্য color band
          পড়া একটি core practical skill।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>প্রথম band-গুলো সাধারণত significant digit দেয়।</li>
          <li>Multiplier band value scale করে।</li>
          <li>Tolerance band allowed variation দেখায়।</li>
          <li>5-band ও 6-band resistor, 4-band-এর চেয়ে বেশি detail দেয়।</li>
          <li>Correct reading direction ঠিক decoding-এর জন্য essential।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে resistor color code-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
