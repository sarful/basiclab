"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeCapacitorSnapshot,
  formatCapacitance,
  formatCharge,
  formatCurrent,
  formatEnergy,
  formatNumber,
  formatResistance,
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
  const supplyVoltage = 12;
  const capacitance = 470;
  const resistance = 1000;
  const time = 0.47;
  const sample = computeCapacitorSnapshot({
    supplyVoltage,
    capacitance,
    resistance,
    time,
    mode: "charge",
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় ক্যাপাসিটর কী?",
      answer:
        "ক্যাপাসিটর হলো এমন একটি component, যা কিছু সময়ের জন্য electric charge এবং energy store করতে পারে।",
    },
    {
      question: "ক্যাপাসিটর সাধারণত কী দিয়ে তৈরি হয়?",
      answer:
        "সাধারণভাবে ক্যাপাসিটর দুইটি conductive plate এবং মাঝখানে dielectric material দিয়ে তৈরি হয়।",
    },
    {
      question: "Charging-এর সময় capacitor voltage-এর কী হয়?",
      answer:
        "Charging-এর সময় capacitor voltage ধীরে ধীরে বাড়তে থাকে।",
    },
    {
      question: "Charging current শুরুতে কেমন থাকে?",
      answer:
        "শুরুতে charging current বেশি থাকে, পরে capacitor voltage বাড়ার সাথে সাথে তা কমে যায়।",
    },
    {
      question: "Q = C x V কী বোঝায়?",
      answer:
        "এটি বোঝায় stored charge নির্ভর করে capacitance এবং voltage-এর উপর।",
    },
    {
      question: "tau = R x C কী বলে?",
      answer:
        "এটি বলে RC circuit-এ charging বা discharging কত দ্রুত হবে।",
    },
    {
      question: "Power supply-তে ক্যাপাসিটর কেন দরকার হয়?",
      answer:
        "Power supply-তে ক্যাপাসিটর ripple কমিয়ে output voltage-কে আরও stable করতে সাহায্য করে।",
    },
    {
      question: "Ideal steady DC condition-এ অনেক সময় পরে কী ঘটে?",
      answer:
        "অনেক সময় পরে ideal capacitor প্রায় পুরো charge হয়ে যায় এবং steady DC current প্রায় বন্ধ হয়ে যায়।",
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
              ক্যাপাসিটর কী?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ক্যাপাসিটর হলো এমন একটি passive electronic component, যা electric
              charge এবং energy সাময়িকভাবে store করতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা step by step শিখব ক্যাপাসিটর কীভাবে charge
              store করে, কেন current পরিবর্তন হয়, এবং বাস্তব circuit-এ এটি
              কেন এত গুরুত্বপূর্ণ।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি সহজ ছবি মনে রাখো: ক্যাপাসিটর অনেকটা ছোট electrical storage
              tank-এর মতো, যা charge জমায় এবং পরে তা release করতে পারে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Stored Charge"
              value={formatCharge(sample.storedCharge)}
              tone="emerald"
            />
            <ValueCard
              label="Stored Energy"
              value={formatEnergy(sample.storedEnergy)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="এটি কী?" eyebrow="Core Concept">
        <p>
          ক্যাপাসিটর হলো এমন একটি electronic component, যা voltage apply করলে
          দুই plate-এর মধ্যে charge আলাদা করে জমা রাখে।
        </p>

        <p>
          সাধারণভাবে এটি দুইটি conductive plate এবং মাঝখানে dielectric
          material দিয়ে তৈরি হয়। Dielectric direct current flow হতে দেয় না,
          কিন্তু electric field তৈরি হতে দেয়।
        </p>

        <p>
          Voltage প্রয়োগ করলে এক plate-এ positive charge এবং অন্য plate-এ
          negative charge জমা হয়। এই charge separation-ই ক্যাপাসিটরের মূল
          ধারণা।
        </p>

        <p>
          <strong>
            Checkpoint Question: ক্যাপাসিটর কি plate দুটি short করে charge
            store করে, নাকি plate দুটি আলাদা রেখে charge separation-এর মাধ্যমে
            store করে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          ক্যাপাসিটর গুরুত্বপূর্ণ কারণ অনেক electronic circuit-এ temporary
          energy storage, timing control, filtering, এবং smoothing দরকার হয়।
        </p>

        <p>
          এটি power supply, audio circuit, timer circuit, motor-control board,
          sensor supply, এবং filter circuit-এ ব্যবহার হয়।
        </p>

        <p>
          যদি তুমি ক্যাপাসিটরের basic logic বুঝতে পারো, তাহলে charging,
          discharging, RC time constant, এবং ripple filter-এর মতো topic সহজ
          হয়ে যাবে।
        </p>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <strong>নিরাপত্তা নোট:</strong> বাস্তব ক্যাপাসিটর power বন্ধ হওয়ার
          পরেও কিছু energy ধরে রাখতে পারে, তাই practical কাজের সময় proper
          safety rules follow করতে হবে।
        </p>

        <p>
          <strong>
            Checkpoint Question: এমন একটি real circuit বা device-এর নাম বলো,
            যেখানে ক্যাপাসিটর দরকার হয়।
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>
          Charging-এর শুরুতে current সবচেয়ে বেশি থাকে, কারণ শুরুতে capacitor
          voltage প্রায় শূন্যের কাছাকাছি থাকে।
        </p>

        <p>
          Charge জমতে জমতে capacitor voltage বাড়ে। ফলে source voltage এবং
          capacitor voltage-এর difference কমে যায়, তাই charging current ধীরে
          ধীরে কমে।
        </p>

        <p>
          Ideal steady DC condition-এ অনেক সময় পরে ক্যাপাসিটর প্রায় পুরো
          charge হয়ে যায় এবং steady DC current প্রায় বন্ধ হয়ে যায়।
        </p>

        <p>
          এই simulation-এ source হলো <strong>{supplyVoltage} V</strong>।
          Capacitor হলো <strong>{formatCapacitance(capacitance)}</strong> এবং
          resistor হলো <strong>{formatResistance(resistance)}</strong>।
        </p>

        <p>
          Time constant হলো{" "}
          <strong>{formatNumber(sample.timeConstant, 3)} s</strong>।{" "}
          <strong>{time} s</strong> সময়ে capacitor voltage প্রায়{" "}
          <strong>{formatNumber(sample.capacitorVoltage, 2)} V</strong> এবং
          charging current প্রায় <strong>{formatCurrent(sample.current)}</strong>।
        </p>

        <p>
          <strong>
            Checkpoint Question: capacitor voltage বাড়লে charging current-এর কী
            হয়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার সূত্র" eyebrow="Formula Sheet">
        <p>
          <strong>Q = C x V</strong> বোঝায় একটি capacitor নির্দিষ্ট voltage-এ
          কত charge store করতে পারে।
        </p>

        <p>
          <strong>E = 1/2 x C x V^2</strong> বোঝায় capacitor electric field-এ
          কত energy store করছে।
        </p>

        <p>
          <strong>tau = R x C</strong> হলো RC time constant। Resistance বা
          capacitance বাড়লে charging এবং discharging আরও slow হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          একটি useful rule হলো, প্রায় <strong>5 tau</strong> পরে capacitor
          almost fully charged বা discharged হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Real Device Example">
        <p>একটি power supply rectifier stage-এর পরের অংশের কথা ভাবো।</p>

        <p>
          Rectifier-এর output একদম smooth থাকে না, ripple থাকে। ক্যাপাসিটর
          সেই ripple কমাতে সাহায্য করে।
        </p>

        <p>
          Voltage যখন বেশি থাকে, তখন capacitor charge store করে। Voltage যখন
          কমতে শুরু করে, তখন capacitor stored charge release করে output-কে আরও
          stable রাখতে সাহায্য করে।
        </p>

        <p>
          আর timing circuit-এ capacitor resistor-এর সাথে মিলে delay তৈরি করে,
          যাতে relay, LED, বা switching action কিছু সময় পরে activate হয়।
        </p>

        <p>
          <strong>
            Checkpoint Question: ripple filter-এ capacitor output-কে বেশি
            stable করে, নাকি আরও uneven করে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত পুনরাবৃত্তি" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>ক্যাপাসিটর charge এবং electrical energy store করে।</li>
          <li>এটি সাধারণত দুই plate এবং একটি dielectric দিয়ে তৈরি হয়।</li>
          <li>Charging current শুরুতে বেশি থাকে, পরে কমে যায়।</li>
          <li>Charge জমার সাথে সাথে capacitor voltage বাড়ে।</li>
          <li>Q = C x V stored charge বোঝায়।</li>
          <li>E = 1/2 x C x V^2 stored energy বোঝায়।</li>
          <li>tau = R x C charging বা discharging speed বোঝায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="জ্ঞান যাচাই কুইজ" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer check করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
