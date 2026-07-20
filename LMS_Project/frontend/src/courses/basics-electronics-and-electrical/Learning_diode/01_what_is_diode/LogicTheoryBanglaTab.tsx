"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  DIODE_CONSTANTS,
  getLedState,
  formatCurrent,
  formatPower,
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
  const forwardVoltage = 5;
  const reverseVoltage = 12;
  const forwardState = getLedState("forward", forwardVoltage);
  const reverseState = getLedState("reverse", reverseVoltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ডায়োডের প্রধান কাজ কী?",
      answer:
        "ডায়োড প্রধানত একদিকে কারেন্ট যেতে দেয় এবং বিপরীত দিকে কারেন্টকে ব্লক করে।",
    },
    {
      question: "Forward bias কী?",
      answer:
        "Forward bias মানে ডায়োডকে এমনভাবে সংযোগ করা, যাতে external voltage junction-এর মধ্য দিয়ে কারেন্ট চলতে সাহায্য করে।",
    },
    {
      question: "Reverse bias-এ কী ঘটে?",
      answer:
        "Reverse bias-এ junction barrier আরও প্রশস্ত হয় এবং ডায়োড মূল current path-কে ব্লক করে।",
    },
    {
      question: "এই লেসনে silicon diode-এর জন্য 0.7 V গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটিকে typical forward turn-on threshold হিসেবে ধরা হয়েছে, যেখানে ডায়োড স্বাভাবিকভাবে conduct করতে শুরু করে।",
    },
    {
      question: "LED ও diode উদাহরণে series resistor কেন ব্যবহার করা হয়?",
      answer:
        "Resistor current limit করে, যাতে circuit নিরাপদ থাকে এবং ডায়োড overstress না হয়।",
    },
    {
      question: "Reverse bias মানে কি একেবারে শূন্য কারেন্ট?",
      answer:
        "পুরোপুরি না। খুব ছোট leakage current থাকতে পারে, তবে মূল current path ব্লক থাকে।",
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
              ডায়োড কী
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ডায়োড হলো একটি semiconductor device, যা প্রধানত একদিকে কারেন্ট
              চলতে দেয় এবং বিপরীত দিকে সেটিকে ব্লক করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনের মূল ধারণা হলো one-way conduction, forward bias,
              reverse bias, silicon diode-এর সাধারণ 0.7 V threshold, এবং কেন
              LED শুধু সঠিক condition-এ জ্বলে ওঠে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই ধারণাগুলো পরিষ্কার হলে পরের অনেক diode topic বোঝা অনেক সহজ
              হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Forward Threshold"
              value={`${DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP.toFixed(1)} V`}
              tone="violet"
            />
            <ValueCard
              label="Forward Current"
              value={formatCurrent(forwardState.estimatedCurrent)}
              tone="emerald"
            />
            <ValueCard
              label="Reverse Leakage"
              value={formatCurrent(reverseState.estimatedCurrent)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="ডায়োড কী?" eyebrow="Core Concept">
        <p>
          ডায়োড হলো semiconductor material দিয়ে তৈরি একটি electronic
          component।
        </p>

        <p>
          এর সবচেয়ে গুরুত্বপূর্ণ আচরণ হলো directional current control: এটি
          একদিকে কারেন্টকে বেশি সহজে যেতে দেয় এবং অন্যদিকে বাধা দেয়।
        </p>

        <p>
          এই one-way behavior-এর কারণে ডায়োডকে অনেক সময় electrical one-way
          gate বলা হয়।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি কোনো component একদিকে কারেন্ট সহজে যেতে দেয়
            কিন্তু অন্যদিকে বাধা দেয়, তাহলে সেটি কোন ধরনের component-এর মতো
            শোনায়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Forward bias কী?" eyebrow="Forward Bias">
        <p>
          Forward bias মানে ডায়োডকে এমনভাবে সংযোগ করা, যাতে external voltage
          junction barrier অতিক্রম করতে carrier-কে সাহায্য করে।
        </p>

        <p>
          একটি silicon diode-এ স্বাভাবিক conduction সাধারণত{" "}
          <strong>{DIODE_CONSTANTS.FORWARD_VOLTAGE_DROP.toFixed(1)} V</strong>{" "}
          এর কাছাকাছি শুরু হয়।
        </p>

        <p>
          এই sample-এ <strong>{forwardVoltage} V</strong> forward bias-এ
          current প্রায় <strong>{formatCurrent(forwardState.estimatedCurrent)}</strong>{" "}
          এবং diode-এ power প্রায়{" "}
          <strong>{formatPower(forwardState.powerDissipation)}</strong>।
        </p>
      </SectionCard>

      <SectionCard title="Reverse bias কী?" eyebrow="Reverse Bias">
        <p>
          Reverse bias মানে polarity উল্টো করে দেওয়া, যাতে junction barrier
          আরও প্রশস্ত হয়ে যায়।
        </p>

        <p>
          এই অবস্থায় ডায়োড মূল current path-কে ব্লক করে এবং LED off থাকে।
        </p>

        <p>
          লেসনটি এটাও দেখায় যে reverse bias মানেই একেবারে zero current নয়।
          খুব ছোট leakage current থাকতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="LED সবসময় জ্বলে না কেন?" eyebrow="Conduction Logic">
        <p>
          LED তখনই জ্বলে, যখন diode forward biased থাকে এবং voltage forward
          threshold অতিক্রম করার মতো যথেষ্ট বেশি হয়।
        </p>

        <p>
          যদি voltage threshold-এর নিচে থাকে, তাহলে junction স্বাভাবিক
          conduction-এর জন্য যথেষ্ট খুলে যায় না।
        </p>

        <p>
          যদি reverse bias নির্বাচন করা হয়, তাহলে voltage value বেশি হলেও
          diode মূল path-টিকে ব্লক করে।
        </p>
      </SectionCard>

      <SectionCard title="Resistor কেন ব্যবহার করা হয়?" eyebrow="Circuit Protection">
        <p>
          এই lesson circuit-এ একটি series resistor আছে, যার মান{" "}
          <strong>{DIODE_CONSTANTS.SERIES_RESISTANCE_OHMS} Ohm</strong>।
        </p>

        <p>
          এই resistor current limit করে, যাতে conduction শুরু হলে LED এবং
          diode অতিরিক্ত current না টানে।
        </p>

        <p>
          Current limiting না থাকলে diode circuit overstress হয়ে ক্ষতিগ্রস্ত
          হতে পারত।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ধারণা" eyebrow="Practical Rules">
        <p>
          ডায়োড শুধু একটি simple on/off switch নয়। এর behavior direction এবং
          voltage level দুটির ওপরই নির্ভর করে।
        </p>

        <p>
          Forward bias এবং যথেষ্ট voltage conduction ঘটায়। Reverse bias মূল
          current path-কে ব্লক করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: diode conduct করবে কি না তা বোঝার আগে সবসময়
          polarity direction এবং forward threshold পৌঁছেছে কি না তা পরীক্ষা
          করুন।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি simple LED indicator circuit-এ diode-এর direction গুরুত্বপূর্ণ,
          কারণ LED জ্বলার জন্য current-কে component-এর মধ্য দিয়ে সঠিক পথে যেতে
          হয়।
        </p>

        <p>
          এই একই one-way behavior-এর কারণেই diode rectifier, protection
          circuit, এবং signal steering circuit-এ ব্যবহার করা হয়।
        </p>

        <p>
          এই প্রথম লেসনটি সেই পরের সব ব্যবহার বোঝার foundation তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>ডায়োড প্রধানত একদিকে কারেন্ট চলতে দেয়।</li>
          <li>Forward bias junction-এর মাধ্যমে conduction-কে সাহায্য করে।</li>
          <li>Reverse bias মূল current path-কে ব্লক করে।</li>
          <li>Silicon diode প্রায় 0.7 V এর কাছাকাছি normal conduction শুরু করে।</li>
          <li>LED শুধু সঠিক forward condition-এ জ্বলে।</li>
          <li>Resistor current limit করে circuit-কে রক্ষা করে।</li>
          <li>Reverse bias-এ খুব ছোট leakage current থাকতে পারে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
