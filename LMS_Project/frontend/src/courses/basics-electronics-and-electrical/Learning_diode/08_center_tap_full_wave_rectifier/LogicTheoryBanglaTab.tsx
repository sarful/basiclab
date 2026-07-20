"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { FIXED_FREQUENCY_HZ, getFullWaveState } from "./logic";

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
  const sample = getFullWaveState(10, 1000, "standard", 0.12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Center-tap full-wave rectifier কী?",
      answer:
        "এটি এমন একটি rectifier circuit, যা center-tapped transformer এবং দুইটি diode ব্যবহার করে AC-এর দুই half-cycle-ই load-এ একই direction-এর output দিতে ব্যবহার করে।",
    },
    {
      question: "এটিকে full-wave বলা হয় কেন?",
      answer:
        "কারণ AC waveform-এর দুই অর্ধাংশই rectified output তৈরির জন্য ব্যবহার করা হয়।",
    },
    {
      question: "এই circuit-এ D1 এবং D2 কীভাবে কাজ করে?",
      answer:
        "এক half-cycle-এ D1 conduct করে এবং অন্য half-cycle-এ D2 conduct করে, তাই load একই output polarity-ই দেখে।",
    },
    {
      question: "এর output half-wave rectifier-এর চেয়ে ভালো কেন?",
      answer:
        "কারণ এটি দুই half-cycle-ই ব্যবহার করে, ফলে average output বেশি হয় এবং pulse-এর মাঝের gap কমে যায়।",
    },
    {
      question: "এখানেও diode forward drop গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ conduction-এর সময় active diode-এর ওপর এখনও কিছু voltage drop হয়।",
    },
    {
      question: "Load resistance এবং current stress গুরুত্বপূর্ণ কেন?",
      answer:
        "এগুলো current level, LED stress, heating, এবং circuit safe operating condition-এর মধ্যে আছে কি না তা প্রভাবিত করে।",
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
              Center-Tap Full-Wave Rectifier
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Center-tap full-wave rectifier AC-কে pulsating DC-তে রূপান্তর
              করে, কারণ এটি waveform-এর দুই half-cycle-ই ব্যবহার করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনের মূল ধারণা হলো alternating diode conduction, center-tap
              action, full-wave output, load effect, এবং কেন diode type এখনও
              result পরিবর্তন করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি half-wave rectification-এর তুলনায় একটি বড় অগ্রগতি, কারণ এটি
              AC source-কে আরও কার্যকরভাবে ব্যবহার করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Frequency" value={`${sample.frequency} Hz`} tone="violet" />
            <ValueCard label="Average Output" value={`${sample.avg.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Conduction" value={`${sample.conductionPercent.toFixed(0)} %`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Center-tap full-wave rectifier কী?" eyebrow="Core Concept">
        <p>
          Center-tap full-wave rectifier হলো এমন একটি circuit, যা
          center-tapped transformer secondary এবং দুইটি diode ব্যবহার করে।
        </p>

        <p>
          এর মূল কাজ হলো AC-এর দুই half-cycle-কে load-এ একই direction-এর
          output-এ পরিণত করা।
        </p>

        <p>
          দুই half-ই ব্যবহার করা হয় বলে এর output half-wave rectifier-এর
          তুলনায় বেশি পূর্ণ হয়।
        </p>
      </SectionCard>

      <SectionCard title="দুইটি diode কীভাবে কাজ করে?" eyebrow="Alternating Conduction">
        <p>
          এক half-cycle-এ diode <strong>D1</strong> forward biased হয়ে conduct
          করে।
        </p>

        <p>
          Opposite half-cycle-এ diode <strong>D2</strong> forward biased হয়ে
          conduct করে।
        </p>

        <p>
          Active diode বদলালেও load একই output polarity-ই দেখতে থাকে।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি D1 এক half-cycle-এ কাজ করে এবং D2 অন্য
            half-cycle-এ কাজ করে, তাহলে load কেন একই output polarity দেখে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটিকে full-wave বলা হয় কেন?" eyebrow="Waveform Use">
        <p>
          এটিকে full-wave বলা হয় কারণ AC waveform-এর দুই half-ই output
          তৈরির জন্য ব্যবহার করা হয়।
        </p>

        <p>
          এর বিপরীতে, half-wave rectifier output path থেকে একটি half-cycle
          বাদ দিয়ে দেয়।
        </p>

        <p>
          এ কারণে center-tap full-wave rectifier basic AC-to-DC conversion-এ
          আরও কার্যকর।
        </p>
      </SectionCard>

      <SectionCard title="এর output half-wave-এর চেয়ে ভালো কেন?" eyebrow="Output Quality">
        <p>
          কারণ এখানে দুই half-cycle-ই ব্যবহার করা হয়, তাই output-এ pulse আরও
          বেশি ঘন ঘন আসে।
        </p>

        <p>
          এতে average output বাড়ে এবং half-wave rectification-এর তুলনায়
          pulse-এর মাঝের gap কমে যায়।
        </p>

        <p>
          এই sample-এ average output প্রায়{" "}
          <strong>{sample.avg.toFixed(2)} V</strong>, এবং conduction অংশ প্রায়{" "}
          <strong>{sample.conductionPercent.toFixed(0)} %</strong>।
        </p>
      </SectionCard>

      <SectionCard title="Diode forward drop এখনও গুরুত্বপূর্ণ কেন?" eyebrow="Voltage Loss">
        <p>
          Full-wave rectifier হলেও conduction-এর সময় diode-এর ওপর কিছু voltage
          drop হয়।
        </p>

        <p>
          এর মানে load ideal input amplitude-এর পুরোটা পায় না।
        </p>

        <p>
          এটিও একটি কারণ, কেন different diode type একই rectifier design-এ
          different output performance দিতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Standard, fast, এবং Schottky diode compare করা কেন?" eyebrow="Diode Selection">
        <p>
          Different diode type-এর forward drop, leakage, এবং
          reverse-recovery behavior ভিন্ন হয়।
        </p>

        <p>
          Schottky diode-এর forward drop কম হতে পারে, তাই average output একটু
          বেশি হতে পারে। Fast-recovery type switching behavior গুরুত্বপূর্ণ
          হলে বেশি গুরুত্বপূর্ণ হতে পারে।
        </p>

        <p>
          তাই rectifier result শুধু circuit structure-এর ওপর নয়, chosen diode
          family-এর ওপরও নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="Load resistance গুরুত্বপূর্ণ কেন?" eyebrow="Load Effect">
        <p>
          Load resistance diode conduct করার সময় কত current flow হবে তা
          নিয়ন্ত্রণ করে।
        </p>

        <p>
          Resistance কম হলে current বাড়ে, যা stress, heating, এবং এই lesson
          model-এ LED risk বাড়াতে পারে।
        </p>

        <p>
          Resistance বেশি হলে current কমে এবং সাধারণত diode ও load-এর জন্য
          operating condition আরও gentle হয়।
        </p>
      </SectionCard>

      <SectionCard title="Center tap-এর ভূমিকা কী?" eyebrow="Transformer Reference">
        <p>
          Center tap transformer-এর দুই অংশের মাঝখানে একটি reference point
          দেয়।
        </p>

        <p>
          এই midpoint-এর কারণে এক diode secondary-এর এক half ব্যবহার করতে
          পারে, আর অন্য diode opposite half ব্যবহার করতে পারে alternate
          half-cycle-এ।
        </p>

        <p>
          এভাবেই এই topology-তে two-diode full-wave action সম্ভব হয়।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Center-tap full-wave rectifier বোঝার সবচেয়ে সহজ উপায় হলো এটিকে দুইটি
          half-wave path হিসেবে ভাবা, যা পালা করে কাজ করে।
        </p>

        <p>
          এক diode এক half-cycle-এ কাজ করে, আর অন্য diode পরের half-cycle-এ
          কাজ করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: center-tap full-wave rectifier AC-এর দুই
          half-cycle থেকেই pulsating DC দেয়, তাই এটি half-wave rectifier-এর
          তুলনায় average output উন্নত করে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          Basic power-supply teaching circuit-এ center-tap full-wave rectifier
          প্রায়ই ব্যবহার করা হয়, যাতে দেখানো যায় AC-এর দুই half কীভাবে আরও
          কার্যকরভাবে ব্যবহার করা যায়।
        </p>

        <p>
          এটি একমাত্র full-wave method নয়, কিন্তু rectification শেখার জন্য এটি
          একটি গুরুত্বপূর্ণ classic topology।
        </p>

        <p>
          এই কারণে এটি simple half-wave rectifier এবং আরও advanced rectifier
          system-এর মধ্যে একটি শক্তিশালী bridge হিসেবে কাজ করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Center-tap full-wave rectifier দুই diode এবং center-tapped transformer ব্যবহার করে।</li>
          <li>D1 এবং D2 alternate half-cycle-এ conduct করে।</li>
          <li>AC waveform-এর দুই half-ই output-এ অবদান রাখে।</li>
          <li>এর output half-wave rectifier-এর তুলনায় বেশি পূর্ণ।</li>
          <li>Diode forward drop এখনও available output কমায়।</li>
          <li>Load resistance current, stress, এবং heat-কে প্রভাবিত করে।</li>
          <li>Different diode type এখনও final behavior পরিবর্তন করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
