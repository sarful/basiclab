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
  tone: "emerald" | "amber" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-sky-200 bg-sky-50 text-sky-800";

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
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-300 to-sky-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
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
      question: "একটি circuit-এ resistor-এর প্রধান কাজ কী?",
      answer:
        "Resistor current flow-কে oppose করে, ফলে circuit-এ কত current চলবে তা control করা যায়।",
    },
    {
      question: "Resistor-এর across voltage drop হয় কেন?",
      answer:
        "কারণ resistor current limit করতে গিয়ে source voltage-এর একটি অংশ নিজের across ধরে রাখে।",
    },
    {
      question: "Resistance ছোট হলে current সাধারণত কী হয়?",
      answer:
        "Current সাধারণত বাড়ে, কারণ একই voltage-এ কম resistance বেশি electrical flow allow করে।",
    },
    {
      question: "Resistor power rating কেন গুরুত্বপূর্ণ?",
      answer:
        "কারণ resistor electrical energy-এর একটি অংশ heat-এ convert করে, আর power rating বলে দেয় সে কত heat safely handle করতে পারবে।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              রেজিস্টর কী
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistor হলো এমন একটি component যা electrical current-কে oppose
              করে, ফলে circuit-এ flow control হয়, voltage কমে, আর electrical
              energy-এর একটি অংশ heat-এ convert হয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল practical idea হলো: resistor শুধু ohm value-ওয়ালা
              একটা part নয়। এটি component protect করে, current limit করে,
              voltage drop তৈরি করে, আর safe power rating অনুযায়ী choose করতে
              হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Job" value="Limit Current" tone="emerald" />
            <ValueCard label="Circuit Effect" value="Voltage Drop" tone="amber" />
            <ValueCard label="Energy Result" value="Heat" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="Resistor কী?" eyebrow="Core Concept">
        <p>
          Resistor হলো একটি electronic component যা electric current-এর flow-কে
          oppose করে।
        </p>
        <p>
          সহজভাবে বললে, এটি current flow-কে harder করে, যাতে source থেকে
          unlimited current circuit-এ না যায়।
        </p>
        <p>
          এই কারণেই resistor অনেক সময় part protect করতে, current control
          করতে, আর circuit-এ voltage share কেমন হবে তা ঠিক করতে ব্যবহার করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="Resistor কেন গুরুত্বপূর্ণ" eyebrow="Why It Matters">
        <p>
          Resistance না থাকলে অনেক circuit-এ খুব বেশি current flow করতে পারত।
        </p>
        <p>এতে practical question তৈরি হয়, যেমন:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>LED-কে extra current থেকে কীভাবে protect করব?</li>
          <li>Simple DC path-এ current কীভাবে কমাব?</li>
          <li>Current flow করলে resistor গরম হয় কেন?</li>
          <li>Resistor-এর পরে output voltage কমে যায় কেন?</li>
        </ul>
        <p>
          এই কারণেই resistor electronics-এর সবচেয়ে common control component-এর
          একটি।
        </p>
      </SectionCard>

      <SectionCard title="Resistor কীভাবে current limit করে" eyebrow="Flow Control">
        <p>Current নির্ভর করে voltage আর resistance দুটির ওপর।</p>
        <p>
          যদি supply voltage একই থাকে আর resistance ছোট হয়, তাহলে বেশি current
          flow করতে পারে।
        </p>
        <p>আর resistance বড় হলে current ছোট হয়ে যায়।</p>
        <p>
          তাই resistor electrical path-এ flow-control component-এর মতো কাজ
          করে।
        </p>
      </SectionCard>

      <SectionCard title="Resistor-এর across voltage drop হয় কেন" eyebrow="Voltage Logic">
        <p>
          Current যখন resistor-এর মধ্য দিয়ে যায়, source voltage-এর একটি অংশ
          resistor-এর across দেখা যায়।
        </p>
        <p>
          এই কারণেই simulator resistor voltage drop আর resistor-এর পরে ছোট
          output voltage দেখায়।
        </p>
        <p>
          Basic resistor-only path-এ circuit arrangement অনুযায়ী resistor input
          voltage-এর বেশিরভাগ বা পুরোটা drop করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Resistor কীভাবে LED protect করে" eyebrow="Practical Use">
        <p>
          LED mode-এ resistor-কে LED-এর সাথে series-এ বসানো হয়, যাতে current
          safer level-এ থাকে।
        </p>
        <p>
          LED-এর নিজের forward voltage থাকে, তাই resistor বাকি voltage নিয়ে
          current limit করে।
        </p>
        <p>
          Resistor না থাকলে LED খুব বেশি current পেতে পারে এবং damage হতে
          পারে।
        </p>
      </SectionCard>

      <SectionCard title="Resistor গরম হয় কেন" eyebrow="Energy Conversion">
        <p>
          Resistor energy destroy করে না। এটি electrical energy-এর একটি অংশকে
          heat-এ convert করে।
        </p>
        <p>
          এই কারণেই visual section-এ দেখা যায় electrical energy resistor-এ
          ঢুকছে আর heat energy বাইরে যাচ্ছে।
        </p>
        <p>
          Resistor যত বেশি power handle করে, heating তত বেশি practical concern
          হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Power rating কেন গুরুত্বপূর্ণ" eyebrow="Safety First">
        <p>
          প্রতিটি resistor-এর power rating থাকে, যেমন 1/8W, 1/4W, 1/2W, বা
          তার বেশি।
        </p>
        <p>
          এই rating বলে দেয় resistor heat হিসেবে কত power safely handle করতে
          পারবে।
        </p>
        <p>
          যদি circuit খুব বেশি power ছোট rating-এর resistor-এ force করে, তাহলে
          resistor অতিরিক্ত গরম হতে পারে বা fail করতে পারে।
        </p>
        <p>
          তাই resistor choose করার সময় শুধু ohm value নয়, safe wattage-ও
          ভাবতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="High Priority">
        <p>
          Resistor-এর শুধু একটাই কাজ, এমন ভাবা যাবে না। এটি একই সঙ্গে current
          limit করতে, voltage drop তৈরি করতে, আর energy-কে heat-এ convert
          করতে পারে।
        </p>
        <p>
          Current কীভাবে বদলাবে তা না ভেবে resistor value choose করা যাবে না।
        </p>
        <p>
          Resistor heat dissipate করলে power rating ignore করা যাবে না।
        </p>
        <p>
          আর resistor-এর পরে output voltage input voltage-এর সমান থাকবে, এমনও
          assume করা যাবে না।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistor current flow-কে oppose করে।</li>
          <li>Resistance বেশি হলে current সাধারণত কমে।</li>
          <li>Resistor নিজের across voltage drop তৈরি করে।</li>
          <li>Resistor electrical energy-এর একটি অংশ heat-এ convert করে।</li>
          <li>Power rating গুরুত্বপূর্ণ, কারণ heat safe limit-এর মধ্যে থাকতে হবে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে resistor-এর core idea ঝালাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
