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
      question: "LDR এর পূর্ণরূপ কী?",
      answer: "LDR এর পূর্ণরূপ হলো Light Dependent Resistor.",
    },
    {
      question: "Bright light-এ LDR-এর কী হয়?",
      answer: "Bright light-এ LDR-এর resistance কমে যায়।",
    },
    {
      question: "Darkness-এ LDR-এর কী হয়?",
      answer: "Darkness-এ LDR-এর resistance অনেক বেশি হয়ে যায়।",
    },
    {
      question: "LDR-কে voltage divider circuit-এ কেন ব্যবহার করা হয়?",
      answer:
        "কারণ LDR-এর resistance বদলালে voltage-divider output-ও বদলায়, ফলে light level measure করা এবং control decision নেওয়া সহজ হয়।",
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
              এলডিআর
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              LDR হলো এমন একটি light-sensitive resistor যার resistance তার
              উপর পড়া আলোর পরিমাণের সাথে পরিবর্তিত হয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব light intensity কীভাবে resistance
              প্রভাবিত করে, কেন বেশি আলোতে LDR-এর resistance সাধারণত কমে,
              এবং সেই পরিবর্তন কীভাবে voltage-divider output ও circuit current
              বদলায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Variable" value="Light Intensity" tone="emerald" />
            <ValueCard label="Key Change" value="Resistance" tone="sky" />
            <ValueCard label="Circuit Use" value="Sensing / Control" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="LDR কী" eyebrow="Foundation">
        <p>LDR এর পূর্ণরূপ হলো Light Dependent Resistor।</p>
        <p>
          এটি এমন একটি resistor যার মান তার উপর পড়া আলোর পরিমাণ অনুযায়ী
          পরিবর্তিত হয়।
        </p>
        <p>
          তাই circuit যদি brightness detect করতে চায় বা changing light
          condition অনুযায়ী automatically react করতে চায়, তাহলে LDR useful।
        </p>
      </SectionCard>

      <SectionCard title="আলো কীভাবে resistance বদলায়" eyebrow="Core Behavior">
        <p>
          LDR-এর মূল ধারণা খুব সহজ: বেশি আলো মানে সাধারণত কম resistance, আর
          কম আলো মানে বেশি resistance।
        </p>
        <p>
          Bright condition-এ LDR current flow সহজ করে দেয়।
        </p>
        <p>
          Darkness-এ resistance দ্রুত বেড়ে যায়, তাই circuit-এর behavior-ও
          অনেক বদলে যায়।
        </p>
      </SectionCard>

      <SectionCard title="LDR কেন light sensor" eyebrow="Sensor Role">
        <p>
          LDR brightness-এর change-কে electrical resistance-এর change-এ
          রূপান্তর করে।
        </p>
        <p>
          অর্থাৎ mechanical switch ছাড়াই light-কে measurable circuit response-এ
          পরিণত করা যায়।
        </p>
        <p>
          এই কারণেই LDR simple sensing এবং automation circuit-এ জনপ্রিয়।
        </p>
      </SectionCard>

      <SectionCard title="Voltage divider behavior" eyebrow="Circuit Logic">
        <p>
          LDR-কে অনেক সময় একটি fixed resistor-এর সাথে voltage divider-এ
          ব্যবহার করা হয়।
        </p>
        <p>
          LDR-এর resistance বদলালে divider-এর output voltage-ও বদলায়।
        </p>
        <p>
          এতে light level-কে circuit-এর অন্য অংশে switching, monitoring, বা
          control-এর জন্য ব্যবহার করা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Current কীভাবে বদলায়" eyebrow="Ohm's Law">
        <p>
          যখন LDR এবং fixed resistor একই current path-এ থাকে, তখন total
          resistance current flow নির্ধারণ করে।
        </p>
        <p>
          যদি light বাড়ে এবং LDR resistance কমে, তাহলে total resistance কমে
          যেতে পারে এবং current বাড়তে পারে।
        </p>
        <p>
          তাই LDR circuit-এ voltage behavior এবং current behavior দুটোই
          পরিবর্তন করে।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 8 simulator-এ আপনি light intensity, dark resistance, fixed
          resistor value, এবং supply voltage পরিবর্তন করতে পারেন।
        </p>
        <p>
          Light level বদলানোর সাথে সাথে LDR resistance live update হয়।
        </p>
        <p>
          একই সাথে voltage-divider output এবং current-ও দেখানো হয়, তাই
          brightness circuit behavior কীভাবে বদলায় তা সরাসরি দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="LDR কোথায় ব্যবহার হয়" eyebrow="Applications">
        <p>এর একটি classic example হলো automatic street light।</p>
        <p>
          পরিবেশ অন্ধকার হয়ে গেলে circuit সেই change detect করে lamp
          automatically on করতে পারে।
        </p>
        <p>
          এছাড়াও LDR brightness control, light sensor module, এবং alarm
          system-এ ব্যবহার হয়।
        </p>
      </SectionCard>

      <SectionCard title="একটি limitation মনে রাখো" eyebrow="Practical Limits">
        <p>
          LDR-এর response সাধারণত higher-end light sensor-এর তুলনায় slower এবং
          কম precise।
        </p>
        <p>
          তাই simple detection ও automation-এর জন্য useful হলেও high-speed বা
          high-precision sensing-এর জন্য ideal নয়।
        </p>
        <p>
          ভালো design মানে এমন জায়গায় LDR ব্যবহার করা যেখানে simple light-based
          switching speed এবং perfect accuracy-এর চেয়ে বেশি গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো ভাবা LDR নিজে নিজে voltage তৈরি করে।
        </p>
        <p>
          বাস্তবে LDR resistance change করে, আর circuit সেই resistance change-কে
          voltage বা current change-এ রূপান্তর করে।
        </p>
        <p>
          আরেকটি mistake হলো ভুলে যাওয়া যে divider-এর fixed resistor-ও final
          output behavior-এ প্রভাব ফেলে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>LDR মানে Light Dependent Resistor।</li>
          <li>বেশি আলোতে LDR-এর resistance সাধারণত কমে যায়।</li>
          <li>কম আলোতে LDR-এর resistance সাধারণত বেড়ে যায়।</li>
          <li>LDR-কে প্রায়ই voltage-divider sensing circuit-এ ব্যবহার করা হয়।</li>
          <li>এটি automatic light-based control-এর জন্য useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে LDR-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
