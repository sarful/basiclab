"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getPhotodiodeState } from "./logic";

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
  const sample = getPhotodiodeState(1000, 5, 100, 0.45, 7.5, true);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Photodiode কী?",
      answer:
        "Photodiode হলো light-sensitive semiconductor diode, যা incoming light-কে electrical current-এ রূপান্তর করে।",
    },
    {
      question: "Photodiode-এ reverse bias সাধারণত ব্যবহার করা হয় কেন?",
      answer:
        "Reverse bias depletion region-কে wider করে এবং light-generated carrier-গুলোকে sensing-এর জন্য আরও ভালোভাবে collect করতে সাহায্য করে।",
    },
    {
      question: "Photocurrent কী?",
      answer:
        "Photocurrent হলো সেই current, যা আলো junction-এর ভিতরে electron-hole pair তৈরি করলে উৎপন্ন হয়।",
    },
    {
      question: "Dark current কী?",
      answer:
        "Dark current হলো সেই ছোট current, যা কোনো আলো না থাকলেও reverse bias-এ flow করে।",
    },
    {
      question: "Load resistance output voltage-কে কীভাবে প্রভাবিত করে?",
      answer:
        "বড় load resistance sensor current-কে সাধারণত বেশি output voltage-এ রূপান্তর করে, তবে circuit limit-এর মধ্যে।",
    },
    {
      question: "Responsivity এবং active area গুরুত্বপূর্ণ কেন?",
      answer:
        "এগুলো নির্ধারণ করে কত light power current-এ রূপান্তর হবে, তাই higher responsivity বা larger area সাধারণত signal বাড়ায়।",
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
              Photodiode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Photodiode optical energy-কে measurable electrical current-এ
              রূপান্তর করে আলো sense করে, সাধারণত reverse bias-এ কাজ করার সময়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো light-generated carrier,
              photocurrent, dark current, reverse-bias sensing, এবং load কীভাবে
              sensor current-কে useful output voltage-এ রূপান্তর করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Light detect করার জন্য এটি সবচেয়ে গুরুত্বপূর্ণ semiconductor
              sensor-গুলোর একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Photocurrent" value={`${sample.photocurrentUA.toFixed(2)} uA`} tone="emerald" />
            <ValueCard label="Dark Current" value={`${sample.darkCurrentUA.toFixed(2)} uA`} tone="amber" />
            <ValueCard label="Output Voltage" value={`${sample.outputVoltage.toFixed(2)} V`} tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Photodiode কী?" eyebrow="Core Concept">
        <p>
          Photodiode হলো একটি semiconductor diode, যা light detect করার জন্য
          design করা হয়।
        </p>

        <p>
          যখন এর junction-এর উপর আলো পড়ে, তখন device electrical carrier
          তৈরি করে, যেগুলো current হিসেবে measure করা যায়।
        </p>

        <p>
          তাই photodiode শুধু ordinary rectifying diode নয়, বরং একটি sensor।
        </p>
      </SectionCard>

      <SectionCard title="Reverse bias সাধারণত preferred কেন?" eyebrow="Sensing Mode">
        <p>
          Photodiode application-এ reverse bias সাধারণত ব্যবহার করা হয়, কারণ
          এটি depletion region-কে wider করে।
        </p>

        <p>
          Wider depletion region carrier collection improve করে এবং incoming
          light-এর প্রতি device-কে আরও কার্যকরভাবে respond করতে সাহায্য করে।
        </p>

        <p>
          এই কারণেই reverse-biased operation অধিকাংশ light-detection
          circuit-এ standard sensing mode।
        </p>
      </SectionCard>

      <SectionCard title="আলো কীভাবে current তৈরি করে?" eyebrow="Carrier Generation">
        <p>
          Incoming photon junction-এর ভিতরে বা কাছাকাছি electron-hole pair
          তৈরি করে।
        </p>

        <p>
          Reverse-biased depletion region-এর electric field সেই carrier-গুলোকে
          আলাদা করে বিপরীত দিকে চালিত করে।
        </p>

        <p>
          এই carrier movement-ই বাইরে থেকে photocurrent হিসেবে দেখা যায়।
        </p>

        <p>
          <strong>
            Checkpoint Question: light level বাড়লে generated carrier-এর সংখ্যা
            এবং photocurrent-এর কী হওয়ার কথা?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Dark current কী?" eyebrow="No-Light Behavior">
        <p>
          কোনো আলো না থাকলেও reverse-biased photodiode-এ খুব ছোট একটি current
          থাকে।
        </p>

        <p>
          এই ছোট leakage-এর মতো current-কে dark current বলা হয়।
        </p>

        <p>
          Dark current গুরুত্বপূর্ণ, কারণ এটি sensor-এর minimum signal floor-এর
          একটি অংশ নির্ধারণ করে।
        </p>
      </SectionCard>

      <SectionCard title="Photocurrent কী?" eyebrow="Signal Output">
        <p>
          Photocurrent হলো আলো থাকার কারণে তৈরি হওয়া অতিরিক্ত current।
        </p>

        <p>
          Sensing application-এ আমরা সাধারণত দেখি light level-এর সঙ্গে
          photocurrent কীভাবে পরিবর্তিত হয়।
        </p>

        <p>
          সাধারণত বেশি আলো বেশি photocurrent তৈরি করে, যতক্ষণ না saturation-এর
          মতো practical limit গুরুত্বপূর্ণ হয়ে ওঠে।
        </p>
      </SectionCard>

      <SectionCard title="Responsivity এবং active area গুরুত্বপূর্ণ কেন?" eyebrow="Sensor Strength">
        <p>
          Responsivity বলে দেয় optical power কতটা কার্যকরভাবে electrical
          current-এ রূপান্তরিত হচ্ছে।
        </p>

        <p>
          Active area নির্ধারণ করে sensor incoming light-এর কতটা অংশ intercept
          করতে পারবে।
        </p>

        <p>
          Higher responsivity বা larger active area সাধারণত generated
          photocurrent বাড়ায়।
        </p>
      </SectionCard>

      <SectionCard title="Load resistor output voltage কীভাবে তৈরি করে?" eyebrow="Current-To-Voltage">
        <p>
          Photodiode মূলত current produce করে, কিন্তু অনেক circuit-এ voltage
          output দরকার হয়।
        </p>

        <p>
          Load resistor Ohm's law ব্যবহার করে photodiode current-কে voltage-এ
          রূপান্তর করে।
        </p>

        <p>
          একই current-এর জন্য বড় load resistor সাধারণত বেশি output voltage
          দেয়, তবে circuit-এর available bias limit-এর মধ্যে।
        </p>
      </SectionCard>

      <SectionCard title="Forward bias-এ কী পরিবর্তন হয়?" eyebrow="Comparison Mode">
        <p>
          Forward bias-এ device বেশি ordinary conducting diode-এর মতো behave
          করে।
        </p>

        <p>
          আলো তখনও current-কে কিছুটা influence করতে পারে, কিন্তু circuit আর
          তার সবচেয়ে useful sensing mode-এ থাকে না।
        </p>

        <p>
          এই কারণেই photodiode-কে মূলত reverse-biased sensor হিসেবে আলোচনা
          করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Photodiode বোঝার সহজ উপায় হলো এটিকে diode junction-এর চারপাশে একটি
          light-controlled current source হিসেবে ভাবা।
        </p>

        <p>
          Light carrier তৈরি করে, reverse bias সেগুলো collect করতে সাহায্য
          করে, আর load resistor resulting current-কে voltage-এ রূপান্তর করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: সাধারণত বেশি আলো মানে বেশি photocurrent, আর
          circuit সেই current-কে measurable output signal-এ রূপান্তর করে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          Photodiode light sensor, optical receiver, counter, remote detection
          system, এবং অনেক automatic control circuit-এ ব্যবহার করা হয়।
        </p>

        <p>
          বিশেষ করে যখন circuit-কে light intensity-র change-এর প্রতি দ্রুত ও
          predictable response দিতে হয়, তখন এটি খুব useful।
        </p>

        <p>
          এই lesson দেখায় light level, bias, এবং load কীভাবে final
          electrical output-কে shape করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Photodiode হলো light-sensitive semiconductor sensor।</li>
          <li>Sensing-এর জন্য reverse bias সাধারণত ব্যবহার করা হয়।</li>
          <li>আলো electron-hole pair তৈরি করে এবং photocurrent উৎপন্ন করে।</li>
          <li>আলো না থাকলেও dark current থাকে।</li>
          <li>Responsivity এবং active area signal strength প্রভাবিত করে।</li>
          <li>Load resistor sensor current-কে output voltage-এ রূপান্তর করে।</li>
          <li>Normal photodiode sensing-এর জন্য forward bias কম useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
