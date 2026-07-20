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
      question: "Ohm's law-এর basic formula কী?",
      answer: "Basic formula হলো V = I x R.",
    },
    {
      question: "Resistance একই থাকলে voltage বাড়লে কী হয়?",
      answer: "Current বেড়ে যায়।",
    },
    {
      question: "Voltage একই থাকলে resistance বাড়লে কী হয়?",
      answer: "Current কমে যায়।",
    },
    {
      question: "LED-এর জন্য Ohm's law useful কেন?",
      answer:
        "কারণ এটি LED current safe range-এ রাখতে প্রয়োজনীয় resistor value calculate করতে সাহায্য করে।",
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
              ওহমের সূত্র
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Ohm&apos;s law একটি electric circuit-এ voltage, current, এবং
              resistance-এর সম্পর্ক বোঝায়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব এই তিনটি quantity কীভাবে একে অপরকে
              প্রভাবিত করে, missing value কীভাবে solve করতে হয়, এবং একই idea
              practical LED resistor calculation-এ কীভাবে ব্যবহার করা হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Formula" value="V = I x R" tone="emerald" />
            <ValueCard label="Core Variables" value="V / I / R" tone="sky" />
            <ValueCard label="Practical Use" value="LED Safety" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Ohm's law কী বোঝায়" eyebrow="Foundation">
        <p>
          Ohm&apos;s law বোঝায় voltage, current, এবং resistance কীভাবে একে
          অপরের সাথে যুক্ত।
        </p>
        <p>
          এর সবচেয়ে common form হলো V = I x R, যেখানে voltage সমান current
          এবং resistance-এর গুণফল।
        </p>
        <p>
          এই তিনটির মধ্যে যেকোনো দুইটি value জানা থাকলে আমরা তৃতীয়টি calculate
          করতে পারি।
        </p>
      </SectionCard>

      <SectionCard title="তিনটি প্রধান form" eyebrow="Formula Logic">
        <p>
          কোন value solve করতে হবে তার উপর ভিত্তি করে Ohm&apos;s law rearrange
          করা যায়।
        </p>
        <p>
          Current বের করতে ব্যবহার হয় I = V / R।
        </p>
        <p>
          Resistance বের করতে ব্যবহার হয় R = V / I।
        </p>
      </SectionCard>

      <SectionCard title="Voltage current-কে কীভাবে প্রভাবিত করে" eyebrow="Cause and Effect">
        <p>
          Resistance একই থাকলে voltage বাড়ালে current বেড়ে যায়।
        </p>
        <p>
          Voltage কমালে current-ও কমে যায়।
        </p>
        <p>
          তাই resistance না বদলালে higher supply voltage circuit-কে আরও
          strongly drive করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Resistance current-কে কীভাবে প্রভাবিত করে" eyebrow="Current Control">
        <p>
          Voltage একই থাকলে resistance বাড়ালে current কমে যায়।
        </p>
        <p>
          Lower resistance current-কে আরও সহজে flow করতে দেয়।
        </p>
        <p>
          এই কারণেই practical circuit-এ current control করার জন্য resistor
          ব্যবহার করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="Ohm's law এত গুরুত্বপূর্ণ কেন" eyebrow="Core Idea">
        <p>
          Basic electronics-এর সবচেয়ে গুরুত্বপূর্ণ tools-এর একটি হলো
          Ohm&apos;s law।
        </p>
        <p>
          এটি supply voltage, component value, বা load condition change হলে কী
          ঘটবে তা বুঝতে সাহায্য করে।
        </p>
        <p>
          অসংখ্য circuit calculation এই এক relationship-এর উপর ভিত্তি করে।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 11 simulator-এ আপনি current, voltage, বা resistance-এর মধ্যে
          কোন quantity solve করবেন তা choose করতে পারেন।
        </p>
        <p>
          Known value change করলে solved value এবং visual response live update
          হয়।
        </p>
        <p>
          এতে formula-টি abstract না থেকে practical হয়ে ওঠে, কারণ আপনি দেখতে
          পারেন এক change circuit-এর অন্য অংশগুলোকে কীভাবে প্রভাবিত করে।
        </p>
      </SectionCard>

      <SectionCard title="LED example এবং resistor sizing" eyebrow="Applications">
        <p>
          Ohm&apos;s law-এর একটি practical use হলো LED-এর জন্য resistor নির্বাচন
          করা।
        </p>
        <p>
          Resistor current limit করে যাতে LED safe operating range-এর মধ্যে
          থাকে।
        </p>
        <p>
          Supply voltage, LED voltage drop, এবং desired current জানা থাকলে
          suitable resistor value calculate করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="LED brightness এবং current" eyebrow="Practical Effect">
        <p>
          Simple circuit-এ LED brightness current-এর সাথে ঘনিষ্ঠভাবে সম্পর্কিত।
        </p>
        <p>
          বেশি current LED-কে brighter করে, আর কম current LED-কে dimmer করে।
        </p>
        <p>
          অতিরিক্ত current LED damage করতে পারে, তাই resistor calculation খুব
          গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো Ohm&apos;s law-এর তিনটি formula গুলিয়ে ফেলা।
        </p>
        <p>
          আরেকটি mistake হলো unit-এর গুরুত্ব ভুলে যাওয়া, বিশেষ করে যখন
          current amps-এর বদলে milliamps-এ দেখানো হয়।
        </p>
        <p>
          Student-রা অনেক সময় ভুলে যায় যে LED resistor calculation-এ শুধু
          supply voltage নয়, LED-এর own voltage drop-ও account করতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Ohm&apos;s law voltage, current, এবং resistance-কে যুক্ত করে।</li>
          <li>Main formula হলো `V = I x R`।</li>
          <li>Voltage বাড়লে এবং resistance fixed থাকলে current বাড়ে।</li>
          <li>Resistance বাড়লে এবং voltage fixed থাকলে current কমে।</li>
          <li>Safe LED resistor selection-এর জন্য Ohm&apos;s law essential।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে Ohm&apos;s law-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
