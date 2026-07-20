"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getFilterCircuitState } from "./logic";

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
  const sample = getFilterCircuitState(10, 1000, "standard", 0.12, true, 1000);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Filter capacitor-এর কাজ কী?",
      answer:
        "এটি voltage peak-এর কাছে charge হয় এবং peak-এর মাঝখানে load-এর মাধ্যমে discharge হয়ে ripple কমায়।",
    },
    {
      question: "Filter ON থাকলে diode সব সময় conduct করে না কেন?",
      answer:
        "কারণ capacitor charge হয়ে গেলে input voltage-কে আবার capacitor voltage-এর উপরে উঠতে হয়, তবেই diode conduct করতে পারে।",
    },
    {
      question: "Capacitor থাকলেও ripple কেন পুরোপুরি যায় না?",
      answer:
        "কারণ charging pulse-এর মাঝখানে capacitor ধীরে ধীরে load-এ discharge হয়, তাই output মসৃণ হয় কিন্তু একেবারে flat হয় না।",
    },
    {
      question: "বড় capacitor output-এ কী পরিবর্তন আনে?",
      answer:
        "বড় capacitor সাধারণত ripple কমায় এবং peak-এর মাঝখানে output voltage-কে বেশি ধরে রাখতে সাহায্য করে।",
    },
    {
      question: "Filtered rectifier-এ diode current sharp হতে পারে কেন?",
      answer:
        "কারণ capacitor waveform peak-এর কাছে short burst-এ recharge হয়, তাই diode current pulse-এর মতো হয়।",
    },
    {
      question: "Load resistance গুরুত্বপূর্ণ কেন?",
      answer:
        "Resistance কম হলে বেশি current flow হয়, capacitor দ্রুত discharge হয়, আর সাধারণত ripple ও device stress বাড়ে।",
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
              Filter Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Filter circuit rectifier output-কে smoother করে, কারণ capacitor
              voltage peak-এর কাছে charge সঞ্চয় করে এবং pulse-এর মাঝখানে সেই
              charge release করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো ripple reduction, capacitor charging
              ও discharging, pulsed diode conduction, এবং load resistance ও
              diode type practical result কীভাবে বদলে দেয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Rectified AC-কে আরও smooth DC supply-তে রূপান্তর করার এটি একটি
              মৌলিক ধারণা।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Ripple Vpp" value={`${sample.filterRipple.toFixed(2)} V`} tone="amber" />
            <ValueCard
              label="Capacitor Charging"
              value={`${sample.capacitorChargePercent.toFixed(0)} %`}
              tone="violet"
            />
          </div>
        </div>
      </section>

      <SectionCard title="Filter circuit কী?" eyebrow="Core Concept">
        <p>
          Filter circuit rectification-এর পরে যোগ করা হয়, যাতে output voltage
          আরও smooth হয়।
        </p>

        <p>
          এই lesson-এ main filter element হলো একটি capacitor, যা rectified
          voltage বাড়লে energy store করতে পারে।
        </p>

        <p>
          এই stored energy waveform peak-এর মাঝখানে load-কে support করতে
          সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Capacitor ব্যবহার করা হয় কেন?" eyebrow="Energy Storage">
        <p>
          Capacitor-কে একটি ছোট energy reservoir হিসেবে ভাবা যায়।
        </p>

        <p>
          যখন rectified input capacitor voltage-এর উপরে ওঠে, diode conduct
          করে এবং capacitor charge হয়।
        </p>

        <p>
          Input নিচে নেমে গেলে capacitor load-এর মাধ্যমে discharge হয় এবং
          output-কে সঙ্গে সঙ্গে zero-তে নেমে যেতে দেয় না।
        </p>
      </SectionCard>

      <SectionCard title="Charging cycle কীভাবে কাজ করে?" eyebrow="Peak Charging">
        <p>
          Capacitor পুরো waveform জুড়ে সমানভাবে charge হয় না।
        </p>

        <p>
          এটি মূলত waveform peak-এর কাছে charge হয়, যখন rectified input
          diode drop অতিক্রম করে capacitor voltage-এর চেয়ে বেশি হয়।
        </p>

        <p>
          এই কারণেই filter enabled থাকলে diode conduction window সরু এবং
          pulse-like হয়ে যায়।
        </p>

        <p>
          <strong>
            Checkpoint Question: capacitor যদি আগেই high voltage ধরে রাখে,
            তাহলে diode আবার conduct করার আগে কী ঘটতে হবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Peak-এর মাঝখানে diode OFF হয়ে যায় কেন?" eyebrow="Conduction Window">
        <p>
          Capacitor charge হওয়ার পরে cycle-এর একটি অংশে input waveform সাধারণত
          capacitor voltage-এর নিচে নেমে যায়।
        </p>

        <p>
          তখন diode reverse-biased বা কার্যত inactive হয়ে যায়, তাই conduction
          বন্ধ হয়।
        </p>

        <p>
          Capacitor filter-এ এটি স্বাভাবিক behavior, এবং এই কারণেই diode
          current continuous না হয়ে pulsed হয়।
        </p>
      </SectionCard>

      <SectionCard title="Ripple কী এবং কেন থেকে যায়?" eyebrow="Smoothing Limit">
        <p>
          Ripple হলো filtered output voltage-এর মধ্যে থেকে যাওয়া variation।
        </p>

        <p>
          Capacitor থাকলেও output পুরোপুরি flat হয় না, কারণ charging event-এর
          মাঝখানে capacitor ধীরে ধীরে load-এ discharge হয়।
        </p>

        <p>
          ফলে waveform আরও smooth DC-এর মতো হয়, কিন্তু তবুও কিছু rise ও fall
          থেকে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Capacitor size output-কে কীভাবে প্রভাবিত করে?" eyebrow="Component Choice">
        <p>
          বড় capacitor বেশি charge store করতে পারে, তাই output voltage
          সাধারণত দ্রুত sag করে না।
        </p>

        <p>
          এতে সাধারণত ripple কমে এবং average filtered output বাড়ে।
        </p>

        <p>
          ছোট capacitor stored charge দ্রুত হারায়, তাই ripple বেশি হয় এবং
          smoothing effect দুর্বল হয়।
        </p>
      </SectionCard>

      <SectionCard title="Load resistance গুরুত্বপূর্ণ কেন?" eyebrow="Load Effect">
        <p>
          Load resistance নির্ধারণ করে output-কে কত current supply করতে হবে।
        </p>

        <p>
          Resistance কম হলে current বেশি হয়, তাই capacitor peak-এর মাঝখানে
          দ্রুত discharge হয়।
        </p>

        <p>
          এতে সাধারণত ripple বাড়ে, diode path-এর stress বাড়ে, এবং load-এ
          higher current risk তৈরি হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Different diode type compare করা হয় কেন?" eyebrow="Diode Selection">
        <p>
          Standard, fast, এবং Schottky diode একরকম behave করে না।
        </p>

        <p>
          তাদের forward drop ও switching behavior বদলালে capacitor এবং load-এ
          পৌঁছানো voltage-ও বদলে যায়।
        </p>

        <p>
          উদাহরণ হিসেবে, low-drop Schottky diode standard silicon diode-এর
          তুলনায় কিছুটা বেশি filtered output দিতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          এই circuit বোঝার সহজ উপায় হলো cycle-কে দুইটি mode-এ ভাগ করা:
          capacitor charging এবং capacitor discharging।
        </p>

        <p>
          Charging-এর সময় diode conduct করে, আর discharging-এর সময় capacitor
          load-কে support করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: filter capacitor peak-এর কাছে charge নিয়ে
          peak-এর মাঝখানে load-কে supply দিয়ে output smooth করে, কিন্তু ripple
          পুরোপুরি দূর করে না।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          অনেক basic DC power supply-তে প্রথমে rectifier থাকে, তারপর next
          regulation stage-এর আগে capacitor filter যোগ করা হয়।
        </p>

        <p>
          এর ফলে raw pulsating rectifier output-এর চেয়ে voltage electronics-এর
          জন্য বেশি usable হয়।
        </p>

        <p>
          এই lesson সেই practical idea-টাই দেখায়, যেখানে filter average
          output, ripple, এবং current behavior বদলে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Filter circuit rectified output-কে smooth করে।</li>
          <li>Capacitor voltage peak-এর কাছে charge হয়।</li>
          <li>Peak-এর মাঝখানে capacitor load-এর মাধ্যমে discharge হয়।</li>
          <li>Ripple কমে, কিন্তু পুরোপুরি disappear করে না।</li>
          <li>Filtering active হলে diode conduction short ও pulsed হয়।</li>
          <li>বড় capacitance সাধারণত smoothing improve করে।</li>
          <li>কম load resistance সাধারণত ripple ও current stress বাড়ায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
