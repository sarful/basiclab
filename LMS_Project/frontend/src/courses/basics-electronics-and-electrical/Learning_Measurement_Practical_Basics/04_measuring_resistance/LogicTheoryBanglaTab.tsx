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
      question: "Resistance measure করার আগে সবচেয়ে গুরুত্বপূর্ণ safety rule কী?",
      answer:
        "Resistance measurement শুরু করার আগে circuit-এর power অবশ্যই remove করতে হবে.",
    },
    {
      question: "Resistance measurement-এর জন্য meter-এর কোন family ব্যবহার করা হয়?",
      answer: "Ohms family, যেটা Ω symbol দিয়ে দেখানো হয়.",
    },
    {
      question: "Resistor measure করার সময় probe কোথায় বসাতে হয়?",
      answer:
        "একটি probe resistor-এর এক terminal-এ, আরেকটি probe অন্য terminal-এ, যাতে meter component-এর across measure করে.",
    },
    {
      question: "Resistance test-এ 10A jack কেন ব্যবহার করা হয় না?",
      answer:
        "Resistance measurement-এর জন্য VΩmA jack ব্যবহার হয়, high-current 10A jack না.",
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
              রেজিস্ট্যান্স মাপা
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistance measure করা মানে কোনো component current flow-কে কত
              strongly oppose করছে সেটা দেখা।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর সবচেয়ে গুরুত্বপূর্ণ beginner rule হলো: resistance
              measure করতে power <strong>off</strong> থাকতে হবে, meter-কে ohms
              family-তে রাখতে হবে, আর probe-কে resistor-এর দুই পাশে বসাতে হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Main Family" value="Ω" tone="amber" />
            <ValueCard label="Red Lead" value="VΩmA" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="Resistance measurement কী?" eyebrow="Core Concept">
        <p>
          Resistance measurement হলো কোনো component current flow-কে কত resist
          করছে সেটা check করা।
        </p>
        <p>
          সহজভাবে বললে, resistor current flow-কে harder করে, আর ohms reading
          আমাদের বলে এই opposition কত strong।
        </p>
        <p>
          Meter এটা নিজের internal test method দিয়ে করে, তাই এর সাথে live
          external circuit power একসাথে থাকা যাবে না।
        </p>
        <p>
          এই কারণেই resistance measurement power-off test, live operating test
          না।
        </p>
      </SectionCard>

      <SectionCard title="এটা কেন গুরুত্বপূর্ণ?" eyebrow="Why It Matters">
        <p>
          Resistance measurement দিয়ে বোঝা যায় resistor বা component expected
          value-এর কাছাকাছি আছে কি না।
        </p>
        <p>এটা দিয়ে আমরা যেমন practical question-এর উত্তর পাই:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>এই resistor সত্যিই 220 ohm কি?</li>
          <li>এই resistor 680 ohm-এর কাছাকাছি, নাকি 2.2k ohm-এর?</li>
          <li>আমি কি এই component-এর জন্য সঠিক ohms range নিয়েছি?</li>
          <li>Probe সত্যিই resistor-এর across আছে, নাকি একই side-এ আছে?</li>
        </ul>
        <p>
          তাই resistance measurement part checking, training, troubleshooting,
          আর component value confidence-এর জন্য খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="Meter setup rule" eyebrow="Setup Rules">
        <p>
          এই lesson-এ meter family অবশ্যই <strong>ohms</strong> family হতে হবে,
          যেটা <strong>Ω</strong> symbol দিয়ে দেখানো হয়।
        </p>
        <p>
          Black lead <strong>COM</strong>-এ থাকে।
        </p>
        <p>
          Red lead <strong>VΩmA</strong>-এ থাকে।
        </p>
        <p>
          <strong>10A</strong> jack resistance measurement-এর জন্য ব্যবহার করা
          হয় না, কারণ ওই jack high-current measurement-এর জন্য।
        </p>
        <p>
          Selected ohms range resistor value-এর সাথে match করতে হবে। যেমন 220
          ohm আর 680 ohm একটি 2000-ohm range-এ comfortably fit করে, কিন্তু 2.2k
          ohm-এর জন্য 20k-এর মতো higher range দরকার হয়।
        </p>
      </SectionCard>

      <SectionCard title="Probe placement logic" eyebrow="Measurement Method">
        <p>
          Resistor ঠিকভাবে measure করতে একটি probe resistor-এর এক terminal-এ
          আরেকটি probe অন্য terminal-এ বসাতে হয়।
        </p>
        <p>
          এর মানে meter component-এর <strong>across</strong> measure করছে।
        </p>
        <p>
          যদি দুই probe একই node-এ বা resistor-এর একই side-এ থাকে, তাহলে meter
          আসলে resistor value ঠিকভাবে check করছে না।
        </p>
        <p>
          এই lesson-এ correct setup মানে দুই resistor lead-কে probe দিয়ে bridge
          করা, যাতে display expected ohms reading দেখায়।
        </p>
      </SectionCard>

      <SectionCard title="Power off কেন থাকতে হবে" eyebrow="Safety First">
        <p>
          Resistance measurement de-energized circuit-এ করতে হয়।
        </p>
        <p>
          যদি external power এখনো present থাকে, তাহলে reading wrong হতে পারে
          এবং setup unsafe হয়ে যেতে পারে।
        </p>
        <p>
          Safe beginner habit খুব simple: ohms check করার আগে power disconnect
          বা remove করো, তারপর meter Ω mode-এ আছে কি না confirm করো।
        </p>
        <p>
          এই rule resistance check আর voltage check-এর মধ্যে সবচেয়ে গুরুত্বপূর্ণ
          practical safety difference-এর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Typical resistance example" eyebrow="Practical Logic">
        <p>
          <strong>220Ω resistor</strong> low-value resistor, তাই lower ohms
          range ভালো কাজ করে।
        </p>
        <p>
          <strong>680Ω resistor</strong> একই general low-ohms range-এ comfortably
          fit করে।
        </p>
        <p>
          <strong>2.2kΩ resistor</strong> বড় value, তাই meter-কে higher ohms
          range নিতে হয় যাতে reading clearly display হয়।
        </p>
        <p>
          Logic খুব simple: আগে resistor value estimate করো, তারপর এমন ohms
          range নাও যেটা সেটা clearly display করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="High Priority">
        <p>
          Live powered circuit-এ resistance measure করার চেষ্টা করা যাবে না।
        </p>
        <p>
          Lesson যখন resistance measurement চায়, তখন dial-কে voltage বা current
          mode-এ ফেলে রাখা যাবে না।
        </p>
        <p>
          Ohms test-এর জন্য red lead-কে <strong>10A</strong> jack-এ নেওয়া যাবে
          না।
        </p>
        <p>
          আর দুই probe-কে component-এর একই side-এ রাখা যাবে না, কারণ এতে
          resistor ঠিকভাবে measure হয় না।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistance বোঝায় কোনো component current flow-কে কত oppose করে.</li>
          <li>Resistance power off অবস্থায় measure হয়.</li>
          <li>Meter-কে Ω family-তে রাখতে হয়.</li>
          <li>Black lead COM-এ আর red lead VΩmA-তে থাকে.</li>
          <li>একটি probe resistor-এর এক terminal-এ, আরেকটি অন্য terminal-এ যায়.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের short question-গুলো দিয়ে main resistance rule যাচাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
