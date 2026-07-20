"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { FIXED_FREQUENCY_HZ, getHalfWaveState } from "./logic";

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
  const sample = getHalfWaveState(10, FIXED_FREQUENCY_HZ, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Half-wave rectifier কী?",
      answer:
        "Half-wave rectifier একটি diode ব্যবহার করে AC waveform-এর এক অর্ধাংশকে pass করে এবং অন্য অর্ধাংশকে block করে।",
    },
    {
      question: "Output smooth DC voltage হয় না কেন?",
      answer:
        "কারণ শুধু এক half-cycle pass হয়, তাই output একটি pulsating DC waveform হয়।",
    },
    {
      question: "Blocked half-cycle-এর সময় কী ঘটে?",
      answer:
        "Diode main current path-কে block করে, তাই basic half-wave case-এ output voltage প্রায় zero-র কাছে নেমে যায়।",
    },
    {
      question: "Rectifier-এ diode forward drop গুরুত্বপূর্ণ কেন?",
      answer:
        "Forward drop conduction-এর সময় available output voltage কমিয়ে দেয়।",
    },
    {
      question: "এখানে Schottky diode average output বেশি দিতে পারে কেন?",
      answer:
        "কারণ এর forward voltage drop কম, তাই conduction-এর সময় কম voltage loss হয়।",
    },
    {
      question: "Load resistance এবং current stress গুরুত্বপূর্ণ কেন?",
      answer:
        "এগুলো current level, heating, LED stress, এবং circuit safe operating condition-এর মধ্যে আছে কি না তা প্রভাবিত করে।",
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
              Half-Wave Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Half-wave rectifier AC-কে pulsating DC-তে রূপান্তর করে, কারণ এটি
              waveform-এর শুধু এক অর্ধাংশকে load-এ যেতে দেয়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনের মূল ধারণা হলো diode conduction, blocked half-cycle,
              average output, load effect, diode drop, এবং কেন different diode
              type result পরিবর্তন করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি AC-to-DC conversion-এ diode-এর সবচেয়ে সহজ এবং গুরুত্বপূর্ণ
              application-এর একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Half-wave rectifier কী?" eyebrow="Core Concept">
        <p>
          Half-wave rectifier হলো এমন একটি circuit, যা diode ব্যবহার করে AC
          waveform-এর শুধু এক অর্ধাংশকে load-এ যেতে দেয়।
        </p>

        <p>
          Allowed half-cycle-এর সময় diode conduct করে। Opposite half-cycle-এর
          সময় এটি main current path-কে block করে।
        </p>

        <p>
          এর ফল steady DC নয়, বরং pulsating DC।
        </p>
      </SectionCard>

      <SectionCard title="Rectification কীভাবে ঘটে?" eyebrow="Working Principle">
        <p>
          যখন input AC polarity diode-কে forward-bias করে, তখন current load-এর
          মধ্য দিয়ে flow করে এবং output voltage দেখা যায়।
        </p>

        <p>
          যখন AC polarity উল্টো হয়, diode reverse-biased হয়ে main current
          path-কে block করে।
        </p>

        <p>
          এ কারণেই AC waveform-এর শুধু এক half output-এ দেখা যায়।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি diode এক half-cycle block করে এবং অন্যটি
            pass করে, তাহলে সেটি কোন ধরনের rectifier behavior?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Output pulsating DC কেন?" eyebrow="Waveform Shape">
        <p>
          Output-কে pulsating DC বলা হয় কারণ এটি এক polarity side-এ থাকে,
          কিন্তু constant নয়।
        </p>

        <p>
          Diode conduct করলে waveform উপরে ওঠে, আর blocked half-cycle-এ আবার
          প্রায় zero-র কাছে নেমে আসে।
        </p>

        <p>
          এই sample-এ average output প্রায়{" "}
          <strong>{sample.avg.toFixed(2)} V</strong>, যা full smooth DC supply-এর
          তুলনায় অনেক কম।
        </p>
      </SectionCard>

      <SectionCard title="Diode forward drop গুরুত্বপূর্ণ কেন?" eyebrow="Voltage Loss">
        <p>
          একটি real diode load-এ full input voltage pass করে না।
        </p>

        <p>
          Conduction-এর সময় diode-এর forward drop-এর কারণে কিছু voltage diode-এর
          ওপরেই loss হয়।
        </p>

        <p>
          এটাই একটি কারণ, কেন একই rectifier circuit-এ different diode type
          different output result দিতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Standard, fast, এবং Schottky diode compare করা কেন?" eyebrow="Diode Selection">
        <p>
          Different diode type-এর forward drop, leakage, এবং reverse-recovery
          behavior আলাদা হয়।
        </p>

        <p>
          Schottky diode-এর forward drop সাধারণত কম, তাই output একটু বেশি হতে
          পারে। Fast-recovery diode switching behavior গুরুত্বপূর্ণ হলে useful
          হতে পারে।
        </p>

        <p>
          তাই rectifier result শুধু circuit idea-এর ওপর নয়, chosen diode
          family-এর ওপরও নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="Load resistance গুরুত্বপূর্ণ কেন?" eyebrow="Load Effect">
        <p>
          Load resistance conduction-এর সময় circuit কত current draw করবে তা
          নিয়ন্ত্রণ করে।
        </p>

        <p>
          Resistance কম হলে current বাড়ে, যা stress, heat, এবং এই lesson
          model-এ LED risk বাড়াতে পারে।
        </p>

        <p>
          Resistance বেশি হলে current কমে এবং সাধারণত diode ও load-এর জন্য
          circuit কম stressful হয়।
        </p>
      </SectionCard>

      <SectionCard title="Reverse recovery এবং leakage কেন বলা হয়?" eyebrow="Real Diode Behavior">
        <p>
          Real rectifier behavior পুরোপুরি ideal নয়, বিশেষ করে diode switching
          বিবেচনা করলে।
        </p>

        <p>
          Reverse recovery বোঝায় polarity change হওয়ার পর কিছু diode-এর briefly
          conduct বন্ধ করতে সময় লাগে।
        </p>

        <p>
          Leakage বোঝায় blocking-এর সময়ও খুব ছোট reverse current থাকতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Half-wave rectifier বোঝার সবচেয়ে সহজ উপায় হলো এটিকে দুইটি repeating
          state হিসেবে ভাবা।
        </p>

        <p>
          একটি state হলো conduction, যেখানে diode এক half-cycle pass করে।
          অন্য state হলো blocking, যেখানে opposite half-cycle reject হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: half-wave rectifier selective one-way
          conduction-এর মাধ্যমে AC-কে pulsating DC-তে রূপান্তর করে, কিন্তু
          নিজে থেকে smooth output তৈরি করে না।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি simple low-cost rectifier stage-এ একটি diode ব্যবহার করেই
          AC-to-DC conversion-এর basic idea দেখানো যায়।
        </p>

        <p>
          যদিও এটি advanced rectifier-এর মতো efficient বা smooth নয়, তবু এটি
          খুব পরিষ্কারভাবে দেখায় diode direction output waveform-কে কীভাবে
          control করে।
        </p>

        <p>
          এই কারণেই half-wave rectifier circuit electronics fundamentals শেখার
          জন্য এত গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Half-wave rectifier AC waveform-এর শুধু এক half pass করে।</li>
          <li>Output pulsating DC হয়, smooth DC নয়।</li>
          <li>Diode এক half-cycle-এ conduct করে এবং অন্যটিতে block করে।</li>
          <li>Forward voltage drop conduction-এর সময় output কমিয়ে দেয়।</li>
          <li>Different diode type efficiency এবং switching behavior পরিবর্তন করে।</li>
          <li>Load resistance current, stress, এবং heat-কে প্রভাবিত করে।</li>
          <li>Real diode behavior-এ reverse recovery এবং leakage গুরুত্বপূর্ণ।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
