"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getBridgeRectifierState } from "./logic";

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
  const sample = getBridgeRectifierState(10, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ব্রিজ রেকটিফায়ার কী?",
      answer:
        "ব্রিজ রেকটিফায়ার হলো চারটি ডায়োড দিয়ে তৈরি একটি ফুল-ওয়েভ রেকটিফায়ার, যা AC-এর দুই half-cycle-কেই একই polarity-র output-এ রূপান্তর করে।",
    },
    {
      question: "এটিকে bridge বলা হয় কেন?",
      answer:
        "কারণ চারটি ডায়োড load-এর চারপাশে bridge-এর মতো একটি network-এ সাজানো থাকে।",
    },
    {
      question: "প্রতি half-cycle-এ কোন diode pair conduct করে?",
      answer:
        "এক half-cycle-এ একটি diode pair conduct করে, আর পরের half-cycle-এ বিপরীত pair conduct করে। এই lesson model-এ সেটি D1D4 এবং D2D3।",
    },
    {
      question: "Output full-wave হয় কেন?",
      answer:
        "কারণ AC-এর positive ও negative দুই half-cycle-ই redirect হয়ে load-এ একই output polarity দেয়।",
    },
    {
      question: "Single-diode rectifier-এর তুলনায় voltage drop বেশি কেন?",
      answer:
        "কারণ bridge-এর প্রতিটি conduction path-এ current-কে দুইটি conducting diode-এর মধ্য দিয়ে যেতে হয়।",
    },
    {
      question: "Practical কাজে bridge rectifier এত জনপ্রিয় কেন?",
      answer:
        "কারণ এটি center-tapped transformer ছাড়াই full-wave rectification দিতে পারে।",
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
              Bridge Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Bridge rectifier চারটি diode ব্যবহার করে AC-কে pulsating DC-তে
              রূপান্তর করে, যাতে দুই half-cycle-ই একই output polarity তৈরি
              করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো bridge conduction pair, full-wave
              output, two-diode voltage drop, load effect, এবং diode type বদলালে
              ফলাফল কেন বদলে যায়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Practical AC to DC conversion-এ এটি সবচেয়ে common rectifier
              topology-গুলোর একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="ব্রিজ রেকটিফায়ার কী?" eyebrow="Core Concept">
        <p>
          Bridge rectifier হলো চারটি diode দিয়ে তৈরি একটি full-wave rectifier।
        </p>

        <p>
          এর কাজ হলো AC waveform-এর দুই অর্ধাংশকেই এমনভাবে ব্যবহার করা, যাতে
          load-এর উপর একই polarity-র output পাওয়া যায়।
        </p>

        <p>
          তাই এটি half-wave rectifier-এর তুলনায় বেশি পূর্ণ rectified output
          দেয়।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে bridge বলা হয় কেন?" eyebrow="Diode Network">
        <p>
          চারটি diode load-এর চারপাশে bridge-এর মতো একটি path-এ সাজানো থাকে।
        </p>

        <p>
          এই arrangement-এর কারণে AC polarity বদলালেও current path
          automatically বদলে যায়।
        </p>

        <p>
          Different diode আলাদা half-cycle-এ conduct করলেও load একই output
          polarity-ই দেখে।
        </p>
      </SectionCard>

      <SectionCard title="Diode pair কীভাবে কাজ করে?" eyebrow="Alternating Paths">
        <p>
          এক half-cycle-এ একটি diode pair conduct করে। পরের half-cycle-এ
          বিপরীত pair conduct করে।
        </p>

        <p>
          এই lesson model-এ দুইটি মূল conduction path হলো <strong>D1D4</strong>{" "}
          এবং <strong>D2D3</strong>।
        </p>

        <p>
          এই alternating-pair action-ই load polarity না বদলে full-wave
          rectification সম্ভব করে।
        </p>

        <p>
          <strong>
            Checkpoint Question: যদি দুইটি ভিন্ন diode pair alternate
            half-cycle-এ কাজ করে কিন্তু load polarity একই থাকে, তাহলে এর ফলে
            rectifier-এর কোন advantage তৈরি হয়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Output full-wave হয় কেন?" eyebrow="Waveform Use">
        <p>
          Bridge AC input-এর positive এবং negative দুই half-কেই ব্যবহার করে।
        </p>

        <p>
          এক half-cycle ফেলে না দিয়ে, এটি দুইটিকেই redirect করে একই polarity
          side-এ output তৈরি করে।
        </p>

        <p>
          এতে half-wave rectification-এর তুলনায় average output উন্নত হয়।
        </p>
      </SectionCard>

      <SectionCard title="Voltage loss বেশি কেন?" eyebrow="Two-Diode Drop">
        <p>
          Bridge rectifier-এ প্রতিটি active path-এ current দুইটি conducting
          diode-এর মধ্য দিয়ে যায়।
        </p>

        <p>
          এর মানে single-diode path-এর তুলনায় voltage loss বেশি, কারণ প্রতিটি
          conducting diode নিজস্ব forward drop যোগ করে।
        </p>

        <p>এটি bridge topology-এর অন্যতম প্রধান tradeoff।</p>
      </SectionCard>

      <SectionCard
        title="Standard, fast, এবং Schottky diode compare করা হয় কেন?"
        eyebrow="Diode Selection"
      >
        <p>
          Different diode type-এর forward drop, leakage, এবং switching behavior
          ভিন্ন হয়।
        </p>

        <p>
          Schottky diode-এর forward drop কম হতে পারে, তাই bridge path-এ current
          এখনও দুই diode-এর মধ্য দিয়ে গেলেও output কিছুটা বাড়তে পারে।
        </p>

        <p>
          তাই final bridge output শুধু topology-এর উপর নয়, selected diode
          family-র উপরও নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="Load resistance গুরুত্বপূর্ণ কেন?" eyebrow="Load Effect">
        <p>
          Load resistance নির্ধারণ করে diode pair conduct করার সময় bridge-এর
          মধ্য দিয়ে কত current flow হবে।
        </p>

        <p>
          Resistance কম হলে current বাড়ে, ফলে stress, heating, এবং এই lesson
          model-এ LED risk বাড়তে পারে।
        </p>

        <p>
          Resistance বেশি হলে current কমে এবং operating condition সাধারণত আরও
          gentle হয়।
        </p>
      </SectionCard>

      <SectionCard title="Practical কাজে bridge এত useful কেন?" eyebrow="Practical Advantage">
        <p>
          Bridge rectifier-এর একটি বড় সুবিধা হলো এটি center-tapped
          transformer ছাড়াই full-wave rectification দেয়।
        </p>

        <p>
          এই কারণে এটি অনেক power-supply front-end design-এ convenient এবং
          widely used।
        </p>

        <p>
          দুই half-cycle-কে কার্যকরভাবে ব্যবহার করতে হলে এটি খুব common
          practical choice।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Bridge rectifier বোঝার সবচেয়ে সহজ উপায় হলো এটিকে দুইটি alternating
          diode pair-এর দৃষ্টিতে দেখা।
        </p>

        <p>
          এক pair এক half-cycle-এ current বহন করে, আর অন্য pair পরের
          half-cycle-এ current বহন করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          সহজ takeaway: bridge rectifier দুই AC half-cycle থেকেই full-wave
          output দেয়, কিন্তু প্রতিটি active path-এ দুইটি diode drop থাকে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          অনেক basic DC power supply AC input stage-এ bridge rectifier দিয়ে
          শুরু হয়।
        </p>

        <p>
          এটি AC-এর দুই half-কেই ব্যবহার করে single-polarity pulsating DC
          output তৈরির একটি সহজ উপায় দেয়।
        </p>

        <p>
          এই কারণেই bridge rectifier সবচেয়ে বেশি শেখানো এবং সবচেয়ে বেশি
          ব্যবহৃত rectifier circuit-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Bridge rectifier চারটি diode ব্যবহার করে।</li>
          <li>দুইটি ভিন্ন diode pair alternate half-cycle-এ conduct করে।</li>
          <li>AC-এর দুই half-cycle-ই output-এ অবদান রাখে।</li>
          <li>Active path বদলালেও load একই output polarity দেখে।</li>
          <li>প্রতিটি bridge conduction path-এ দুইটি diode drop থাকে।</li>
          <li>Load resistance current, stress, এবং heating-কে প্রভাবিত করে।</li>
          <li>
            Bridge জনপ্রিয় কারণ এটি center tap ছাড়াই full-wave
            rectification দেয়।
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
