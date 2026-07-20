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
      question: "থার্মিস্টরের মূল বৈশিষ্ট্য কী?",
      answer:
        "থার্মিস্টর হলো এমন একটি resistor যার resistance তাপমাত্রার সাথে পরিবর্তিত হয়।",
    },
    {
      question: "NTC thermistor-এ temperature বাড়লে resistance-এর কী হয়?",
      answer:
        "NTC thermistor-এ temperature বাড়লে resistance কমে যায়।",
    },
    {
      question: "PTC thermistor-এ temperature বাড়লে resistance-এর কী হয়?",
      answer:
        "PTC thermistor-এ temperature বাড়লে resistance বেড়ে যায়।",
    },
    {
      question: "Temperature change হলে thermistor current কেন বদলায়?",
      answer:
        "কারণ আগে thermistor-এর resistance বদলায়, আর voltage একই থাকলে Ohm's law অনুযায়ী resistance বদলালে current-ও বদলায়।",
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
              থার্মিস্টর
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              থার্মিস্টর হলো এমন একটি temperature-sensitive resistor যার মান
              আশেপাশের তাপমাত্রা পরিবর্তনের সাথে বদলে যায়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা NTC ও PTC behavior, temperature কীভাবে
              resistance বদলায়, এবং কেন সেই পরিবর্তন sensing ও protection
              circuit-এ current-কে সরাসরি প্রভাবিত করে তা বুঝব।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Variable" value="Temperature" tone="emerald" />
            <ValueCard label="Main Types" value="NTC / PTC" tone="sky" />
            <ValueCard label="Circuit Effect" value="Resistance Shift" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="থার্মিস্টর কী" eyebrow="Foundation">
        <p>
          থার্মিস্টর হলো এমন একটি resistor যার মান temperature-এর সাথে
          পরিবর্তিত হয়।
        </p>
        <p>
          সাধারণ fixed resistor-এর মতো এটি সবসময় একই resistance ধরে রাখার
          জন্য তৈরি নয়।
        </p>
        <p>
          বরং thermal condition বদলালে এর resistance-ও বদলায়, তাই circuit
          temperature sense করতে বা heat change অনুযায়ী react করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="থার্মিস্টরের দুইটি প্রধান ধরন" eyebrow="Core Comparison">
        <p>
          Thermistor সাধারণত NTC এবং PTC এই দুই ধরনের হয়।
        </p>
        <p>
          NTC মানে negative temperature coefficient, তাই temperature বাড়লে
          resistance কমে।
        </p>
        <p>
          PTC মানে positive temperature coefficient, তাই temperature বাড়লে
          resistance বাড়ে।
        </p>
      </SectionCard>

      <SectionCard title="Temperature কেন resistance বদলায়" eyebrow="Material Behavior">
        <p>
          Thermistor এমন material দিয়ে তৈরি হয় যার electrical behavior
          temperature-এর সাথে শক্তভাবে পরিবর্তিত হয়।
        </p>
        <p>
          Material গরম বা ঠান্ডা হলে charge movement-এর ধরন বদলায়।
        </p>
        <p>
          এই কারণেই thermistor সাধারণ resistor-এর তুলনায় অনেক বেশি
          temperature-sensitive।
        </p>
      </SectionCard>

      <SectionCard title="NTC behavior" eyebrow="Negative Coefficient">
        <p>
          NTC thermistor-এ temperature বাড়লে resistance কমে যায়।
        </p>
        <p>
          Supply voltage একই থাকলে resistance কমা মানে current আরও বেশি flow
          করতে পারবে।
        </p>
        <p>
          এই কারণে NTC thermistor temperature sensing এবং inrush current
          limiting circuit-এ খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="PTC behavior" eyebrow="Positive Coefficient">
        <p>
          PTC thermistor-এ temperature বাড়লে resistance বেড়ে যায়।
        </p>
        <p>
          Supply voltage একই থাকলে resistance বাড়া মানে current কমে যাবে।
        </p>
        <p>
          তাই PTC thermistor protection circuit-এ useful, যেখানে temperature
          rise হলে circuit-কে safer অবস্থার দিকে নিতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 7 simulator-এ আপনি NTC ও PTC mode-এর মধ্যে switch করতে পারেন
          এবং temperature বাড়ানো-কমানো দেখতে পারেন।
        </p>
        <p>
          Temperature বদলানোর সাথে সাথে resistance live update হয়।
        </p>
        <p>
          একই সাথে current-ও দেখানো হয়, তাই Ohm&apos;s law-এর effect স্পষ্ট দেখা
          যায়: resistance বদলালে current-ও বদলায়।
        </p>
      </SectionCard>

      <SectionCard title="Circuit-এ thermistor গুরুত্বপূর্ণ কেন" eyebrow="Applications">
        <p>
          Real system-এ temperature অনেক সময় একটি গুরুত্বপূর্ণ hidden variable।
        </p>
        <p>
          Thermistor battery pack, thermostat, cooling fan control, temperature
          measurement এবং protection circuit-এ ব্যবহার হয়।
        </p>
        <p>
          এর strength হলো জটিল mechanical system ছাড়া circuit-কে heat অনুযায়ী
          respond করানো।
        </p>
      </SectionCard>

      <SectionCard title="একটি গুরুত্বপূর্ণ limitation" eyebrow="Practical Limits">
        <p>
          Thermistor-এর response perfectly linear নয়।
        </p>
        <p>
          অর্থাৎ সব temperature range-এ একই পরিমাণ temperature change একই
          পরিমাণ resistance change তৈরি করে না।
        </p>
        <p>
          এই কারণে accurate measurement system-এ calibration বা lookup-based
          interpretation দরকার হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো ভাবা সব thermistor একইভাবে behave করে।
        </p>
        <p>
          Student-রা অনেক সময় NTC ও PTC গুলিয়ে ফেলে, যদিও এরা বিপরীতভাবে
          respond করে।
        </p>
        <p>
          আরেকটি ভুল হলো ভুলে যাওয়া যে আগে temperature resistance বদলায়, তারপর
          current change হয়।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Thermistor হলো temperature অনুযায়ী resistance বদলানো resistor।</li>
          <li>NTC-তে temperature বাড়লে resistance কমে।</li>
          <li>PTC-তে temperature বাড়লে resistance বাড়ে।</li>
          <li>Resistance বদলালে voltage fixed থাকলে current-ও বদলায়।</li>
          <li>Thermistor sensing, control, এবং protection-এ useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে thermistor-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
