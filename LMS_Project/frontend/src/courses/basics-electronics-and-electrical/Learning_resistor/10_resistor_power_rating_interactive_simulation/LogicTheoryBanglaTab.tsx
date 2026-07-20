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
      question: "Resistor power rating বলতে কী বোঝায়?",
      answer:
        "এটি বোঝায় resistor সর্বোচ্চ কত watt power নিরাপদভাবে heat হিসেবে dissipate করতে পারে।",
    },
    {
      question: "সঠিক resistance value থাকলেও কি resistor fail করতে পারে?",
      answer:
        "হ্যাঁ। যদি actual circuit power-এর তুলনায় resistor-এর power rating কম হয়, তাহলে এটি overheat করে fail করতে পারে।",
    },
    {
      question: "Resistor power-এর তিনটি common formula কী?",
      answer:
        "P = V x I, P = I^2R, এবং P = V^2/R।",
    },
    {
      question: "উচ্চ wattage resistor ব্যবহার করা অনেক সময় safer কেন?",
      answer:
        "কারণ এটি বেশি heat-handling margin দেয়, stress কমায়, এবং overload risk কমায়।",
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
              রেজিস্টর পাওয়ার রেটিং
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistor power rating আমাদের বলে একটি resistor damage ছাড়া কত
              electrical power নিরাপদভাবে heat-এ পরিণত করতে পারে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব power কীভাবে calculate করা হয়, overheating
              কেন হয়, এবং real circuit-এ safe working margin পাওয়ার জন্য কীভাবে
              সঠিক resistor wattage বেছে নিতে হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Risk" value="Heat" tone="emerald" />
            <ValueCard label="Main Check" value="Power vs Rating" tone="sky" />
            <ValueCard label="Safe Habit" value="Use Margin" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Power rating বলতে কী বোঝায়" eyebrow="Foundation">
        <p>
          Current flow হলে প্রতিটি resistor কিছু electrical energy-কে heat-এ
          convert করে।
        </p>
        <p>
          Power rating আমাদের বলে resistor সর্বোচ্চ কত wattage নিরাপদভাবে
          dissipate করতে পারে।
        </p>
        <p>
          যদি circuit resistor-কে সেই limit-এর বেশি power handle করতে বাধ্য
          করে, তাহলে overheating এবং damage হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="শুধু সঠিক resistance যথেষ্ট নয় কেন" eyebrow="Common Trap">
        <p>
          একটি resistor-এর ohmic value একদম ঠিক হলেও সেটি circuit-এর জন্য
          wrong component হতে পারে।
        </p>
        <p>
          Missing check হলো actual dissipated power-এর তুলনায় এর wattage rating
          যথেষ্ট বড় কি না।
        </p>
        <p>
          এই কারণেই real component selection-এ resistance value-এর সাথে power
          rating-ও সবসময় consider করতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="Resistor power কীভাবে calculate করা হয়" eyebrow="Formula Logic">
        <p>
          Resistor power-এর তিনটি common formula হলো P = V x I, P = I^2R, এবং
          P = V^2/R।
        </p>
        <p>
          এই formula-গুলো mathematically connected, তাই circuit value ঠিক হলে
          এগুলো একই power result দেবে।
        </p>
        <p>
          কোন formula ব্যবহার করবেন তা নির্ভর করে circuit-এর কোন quantity আগে
          থেকেই জানা আছে তার উপর।
        </p>
      </SectionCard>

      <SectionCard title="Overheating কেন হয়" eyebrow="Thermal Behavior">
        <p>
          যখন resistor power dissipate করে, সেই power heat হিসেবে বের হয়।
        </p>
        <p>
          যদি সেই heat resistor package নিরাপদভাবে handle করতে না পারে, তাহলে
          তার temperature খুব বেশি বেড়ে যায়।
        </p>
        <p>
          তখন resistor গরম হয়ে যেতে পারে, value drift করতে পারে, discolor হতে
          পারে, smoke করতে পারে, বা পুরোপুরি fail করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Safe, warm, caution, এবং overload" eyebrow="Operating States">
        <p>
          Real resistor operation শুধু pass বা fail নয়।
        </p>
        <p>
          Actual power rating-এর কত কাছাকাছি তার উপর ভিত্তি করে resistor safe,
          warm, caution zone, বা overload-এ যেতে পারে।
        </p>
        <p>
          Long-term reliability-এর জন্য ভালো design সবসময় limit-এর খুব কাছে
          operate করা এড়িয়ে চলে।
        </p>
      </SectionCard>

      <SectionCard title="Safety margin কেন গুরুত্বপূর্ণ" eyebrow="Selection Rule">
        <p>
          Engineer-রা অনেক সময় calculated minimum-এর চেয়ে বেশি wattage-এর
          resistor choose করেন।
        </p>
        <p>
          একটি common safe habit হলো actual calculated power-এর অন্তত প্রায়
          দুই গুণ wattage use করা।
        </p>
        <p>
          এতে temperature rise, airflow difference, tolerance, এবং real-world
          stress-এর জন্য বাড়তি margin পাওয়া যায়।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 10 simulator-এ আপনি voltage, resistance, এবং selected
          resistor wattage package change করতে পারেন।
        </p>
        <p>
          Value বদলালে current, calculated power, এবং operating status live
          update হয়।
        </p>
        <p>
          এটি selected package size-এর সাথে recommended safer wattage choice-ও
          compare করে, ফলে heat-risk idea-টি visual এবং practical হয়ে ওঠে।
        </p>
      </SectionCard>

      <SectionCard title="Larger package অনেক সময় ব্যবহার করা হয় কেন" eyebrow="Practical Selection">
        <p>
          Higher wattage resistor-এর body সাধারণত physically বড় হয়।
        </p>
        <p>
          এই বড় package ছোট package-এর তুলনায় heat আরও safely dissipate করতে
          পারে।
        </p>
        <p>
          তাই larger wattage part select করা resistance বদলানোর জন্য নয়, বরং
          heat-handling capability বাড়ানোর জন্য।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো শুধু ohm value দেখে resistor choose করা এবং
          wattage ignore করা।
        </p>
        <p>
          আরেকটি mistake হলো bench-এ অল্প সময় কাজ করলেই resistor safe ধরে
          নেওয়া।
        </p>
        <p>
          Student-রা অনেক সময় ভুলে যায় যে limit-এর খুব কাছাকাছি running
          resistor fail না করলেও তবুও risky হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Power rating হলো resistor-এর safe heat-dissipation limit।</li>
          <li>শুধু correct resistance value safe selection-এর জন্য যথেষ্ট নয়।</li>
          <li>Power `P = V x I`, `P = I^2R`, বা `P = V^2/R` দিয়ে calculate করা যায়।</li>
          <li>অতিরিক্ত power overheating এবং failure ঘটাতে পারে।</li>
          <li>Extra wattage margin safety ও reliability বাড়ায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে resistor power rating-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
