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
      question: "Voltage drop কী?",
      answer:
        "Voltage drop হলো কোনো component-এর across voltage difference, যেখানে electrical energy ব্যবহার বা dissipate হয়।",
    },
    {
      question: "Series circuit-এ সব resistor-এর মধ্যে কী একই থাকে?",
      answer:
        "Series path-এর সব resistor-এর মধ্যে current একই থাকে।",
    },
    {
      question: "Series circuit-এ কোন resistor বড় voltage drop পায়?",
      answer:
        "যে resistor-এর resistance বেশি, সে বড় voltage drop পায়।",
    },
    {
      question: "সব voltage drop-এর যোগফল কী হওয়া উচিত?",
      answer:
        "সব voltage drop-এর যোগফল supply voltage-এর সমান হওয়া উচিত।",
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
              ভোল্টেজ ড্রপ
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Voltage drop হলো কোনো component-এর across voltage difference,
              যেখানে electrical energy ব্যবহার বা dissipate হয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব series circuit-এ voltage কীভাবে share হয়,
              কেন বড় resistor বড় drop পায়, এবং কেন সব drop-এর sum পুরো supply
              voltage-কে explain করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Formula" value="Vdrop = I x R" tone="emerald" />
            <ValueCard label="Series Rule" value="Same Current" tone="sky" />
            <ValueCard label="Key Check" value="Drops Sum to Vs" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Voltage drop কী বোঝায়" eyebrow="Foundation">
        <p>
          Voltage drop বোঝায় কোনো component-এর across কত electrical potential
          ব্যবহার হচ্ছে।
        </p>
        <p>
          Resistor circuit-এ এই dropped voltage current এবং resistance-এর সাথে
          linked থাকে।
        </p>
        <p>
          এর মানে এই নয় যে voltage কারণ ছাড়াই vanish হয়ে যায়। এর মানে হলো
          circuit-এর ওই অংশে electrical energy ব্যবহার বা dissipate হচ্ছে।
        </p>
      </SectionCard>

      <SectionCard title="Series circuit-এ voltage drop কেন হয়" eyebrow="Series Behavior">
        <p>
          Series circuit-এ সব resistor-এর মধ্য দিয়ে একই current flow করে।
        </p>
        <p>
          যেহেতু প্রতিটি resistor-এর একটি resistance value আছে, তাই প্রতিটি
          resistor নিজের voltage drop তৈরি করে।
        </p>
        <p>
          এই কারণে supply voltage resistor-গুলোর মধ্যে share হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Resistor value voltage drop-কে কীভাবে প্রভাবিত করে" eyebrow="Main Insight">
        <p>
          Current একই থাকলে বড় resistor বড় voltage drop তৈরি করে।
        </p>
        <p>
          একই current-এর অধীনে ছোট resistor ছোট voltage drop তৈরি করে।
        </p>
        <p>
          এই কারণেই series circuit-এ voltage distribution resistor value-এর
          উপর নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="মূল formula" eyebrow="Formula Logic">
        <p>
          Basic voltage-drop formula হলো Vdrop = I x R।
        </p>
        <p>
          আগে series path-এর current বের করতে হয়, তারপর সেই একই current এবং
          প্রতিটি resistor-এর value ব্যবহার করে voltage drop calculate করতে হয়।
        </p>
        <p>
          এটি Ohm&apos;s law এবং series-circuit rule-কে খুব সরাসরি ভাবে combine
          করে।
        </p>
      </SectionCard>

      <SectionCard title="সব drop-এর যোগফল কেন equal হতে হবে" eyebrow="Conservation Check">
        <p>
          একটি complete series loop-এ সব resistor voltage drop-এর sum total
          supply voltage-এর সমান হতে হবে।
        </p>
        <p>
          যদি সব drop সঠিকভাবে add up না করে, তাহলে calculation বা circuit
          understanding-এর কোথাও ভুল আছে।
        </p>
        <p>
          এই sum-check circuit analysis-এর সবচেয়ে useful consistency test-গুলোর
          একটি।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 14 simulator-এ আপনি supply voltage এবং resistor value change
          করতে পারেন, এবং current ও voltage drop live update হতে দেখেন।
        </p>
        <p>
          আপনি third resistor on বা off-ও করতে পারেন, ফলে total resistance
          change হয় এবং drop-গুলো redistribute হয়।
        </p>
        <p>
          এতে স্পষ্ট দেখা যায় যে series chain-এ current একই থাকে, কিন্তু
          voltage resistance অনুযায়ী share হয়।
        </p>
      </SectionCard>

      <SectionCard title="Practical-এ voltage drop গুরুত্বপূর্ণ কেন" eyebrow="Applications">
        <p>
          Voltage drop গুরুত্বপূর্ণ কারণ real circuit-এ বিভিন্ন অংশে নির্দিষ্ট
          voltage দরকার হয়।
        </p>
        <p>
          Designer-রা supply voltage কীভাবে divide হবে তা control করার জন্য
          resistor value ব্যবহার করেন।
        </p>
        <p>
          Sensor circuit, biasing, reference level, এবং troubleshooting-এর জন্য
          voltage drop বোঝা গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো ভাবা voltage drop মানে energy কোনো explanation
          ছাড়াই lost হয়ে যায়।
        </p>
        <p>
          আরেকটি mistake হলো ভুলে যাওয়া যে series path-এর সব resistor-এর মধ্যে
          current একই থাকে।
        </p>
        <p>
          Student-রা অনেক সময় check করতে ভুলে যায় যে সব individual drop add
          করলে supply voltage ফিরে পাওয়া উচিত।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage drop হলো কোনো component-এর across voltage difference।</li>
          <li>Series circuit-এ সব resistor-এর মধ্য দিয়ে একই current flow করে।</li>
          <li>একই current-এর অধীনে বড় resistor বড় voltage drop পায়।</li>
          <li>`Vdrop = I x R` হলো key formula।</li>
          <li>সব drop-এর যোগফল supply voltage-এর সমান হওয়া উচিত।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে voltage-drop-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
