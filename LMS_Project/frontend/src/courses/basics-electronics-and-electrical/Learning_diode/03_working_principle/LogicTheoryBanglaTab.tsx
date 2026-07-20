"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getWorkingState } from "./logic";

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
  const forwardVoltage = 3;
  const reverseVoltage = 12;
  const forwardState = getWorkingState("forward", forwardVoltage);
  const reverseState = getWorkingState("reverse", reverseVoltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "P-type এবং N-type material একসাথে যুক্ত হলে কী তৈরি হয়?",
      answer:
        "একটি PN junction তৈরি হয়, সঙ্গে depletion region এবং একটি internal barrier-ও তৈরি হয়।",
    },
    {
      question: "Depletion region কেন তৈরি হয়?",
      answer:
        "কারণ junction-এর কাছে carrier diffusion এবং recombination হয়, ফলে সেখানে charged ion থেকে যায়।",
    },
    {
      question: "Forward bias-এ কী ঘটে?",
      answer:
        "Forward bias barrier কমিয়ে দেয়, ফলে voltage যথেষ্ট হলে current flow শুরু হয়।",
    },
    {
      question: "Reverse bias-এ কী ঘটে?",
      answer:
        "Reverse bias barrier আরও প্রশস্ত করে এবং main current path-কে ব্লক করে।",
    },
    {
      question: "এখানে প্রায় 0.7 V গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি typical silicon forward threshold হিসেবে ব্যবহার করা হয়েছে, যেখানে conduction শুরু হয়।",
    },
    {
      question: "ডায়োডকে one-way device বলা হয় কেন?",
      answer:
        "কারণ এর junction structure একদিকে current flow-কে বেশি সমর্থন করে, আর অন্যদিকে বাধা দেয়।",
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
              ডায়োডের কার্যপ্রণালী
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ডায়োড কাজ করে কারণ PN junction একটি barrier তৈরি করে, যা
              forward bias-এ কমে যায় এবং reverse bias-এ আরও শক্তিশালী হয়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনে তিনটি মূল ধারণা একসাথে যুক্ত হয়েছে: diode কীভাবে
              তৈরি হয়, junction কীভাবে গঠিত হয়, এবং bias কীভাবে current flow
              পরিবর্তন করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Junction-এর logic পরিষ্কার হলে diode-এর one-way behavior বোঝা
              অনেক সহজ হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Threshold" value={`${forwardState.threshold.toFixed(1)} V`} tone="violet" />
            <ValueCard
              label="Forward State"
              value={forwardState.isConducting ? "Conducting" : "Blocked"}
              tone="emerald"
            />
            <ValueCard
              label="Reverse State"
              value={reverseState.isConducting ? "Conducting" : "Blocked"}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="ডায়োড কীভাবে শুরু হয়?" eyebrow="Construction">
        <p>
          একটি ডায়োড শুরু হয় দুই ধরনের semiconductor region দিয়ে: P-type এবং
          N-type material।
        </p>

        <p>
          P-type পাশে hole হলো প্রধান carrier, আর N-type পাশে electron হলো
          প্রধান carrier।
        </p>

        <p>
          এই দুই region একসাথে যুক্ত হলে directional current control-এর জন্য
          প্রয়োজনীয় basic structure তৈরি হয়।
        </p>
      </SectionCard>

      <SectionCard title="Junction কীভাবে তৈরি হয়?" eyebrow="Formation">
        <p>
          P-type এবং N-type material একে অপরকে স্পর্শ করার পর carrier-গুলো
          boundary-এর ওপারে diffuse করতে শুরু করে।
        </p>

        <p>
          কিছু electron এবং hole junction-এর কাছে recombine করে, ফলে সেখানে
          fixed charged ion থেকে যায়।
        </p>

        <p>
          এর ফলেই depletion region এবং internal electric barrier তৈরি হয়, যা
          carrier-এর সহজ গতি বাধাগ্রস্ত করে।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: যদি junction-এর কাছে carrier recombine হয়ে একটি
            carrier-poor region রেখে যায়, তাহলে কোন region তৈরি হচ্ছে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Forward bias-এ কী ঘটে?" eyebrow="Forward Bias">
        <p>
          Forward bias P-side এবং N-side-কে এমনভাবে push করে, যাতে junction
          barrier কমে যায়।
        </p>

        <p>
          Applied voltage যথেষ্ট বেশি হলে carrier-গুলো junction সহজে অতিক্রম
          করতে পারে এবং current flow শুরু হয়।
        </p>

        <p>
          এই lesson model-এ forward conduction দেখানো হয়েছে যখন voltage প্রায়{" "}
          <strong>{forwardState.threshold.toFixed(1)} V</strong> বা তার বেশি
          হয়।
        </p>
      </SectionCard>

      <SectionCard title="Reverse bias-এ কী ঘটে?" eyebrow="Reverse Bias">
        <p>
          Reverse bias ঠিক উল্টো কাজ করে। এটি barrier বাড়িয়ে দেয় এবং depletion
          region আরও প্রশস্ত করে।
        </p>

        <p>
          ফলে junction-এর মধ্য দিয়ে main current pass করা অনেক কঠিন হয়ে যায়।
        </p>

        <p>
          এ কারণেই normal operation-এ diode reverse direction-এ blocker-এর
          মতো আচরণ করে।
        </p>
      </SectionCard>

      <SectionCard title="ডায়োড one-way কেন?" eyebrow="Working Logic">
        <p>
          ডায়োডকে one-way device বলা হয় কারণ এর PN junction দুই polarity-তে
          একইভাবে প্রতিক্রিয়া দেখায় না।
        </p>

        <p>
          এক polarity barrier কমায় এবং conduction-কে support করে। অন্য polarity
          barrier বাড়ায় এবং main current path-কে block করে।
        </p>

        <p>
          তাই one-way effect আসে junction physics থেকে, কোনো mechanical switch
          থেকে নয়।
        </p>
      </SectionCard>

      <SectionCard title="0.7 V এত বেশি বলা হয় কেন?" eyebrow="Threshold Idea">
        <p>
          অনেক basic silicon-diode example-এ প্রায় <strong>0.7 V</strong> কে
          practical turn-on threshold হিসেবে ব্যবহার করা হয়।
        </p>

        <p>
          এই simplified lesson model-এ সেই মানের নিচে normal forward
          conduction এখনও তুলনামূলক দুর্বল ধরা হয়েছে।
        </p>

        <p>
          আর এই মানের ওপরে diode-কে অনেক বেশি স্পষ্টভাবে conducting ধরা হয়।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          ডায়োডের working principle মনে রাখার সবচেয়ে সহজ উপায় হলো এটিকে তিনটি
          stage-এ ভাবা।
        </p>

        <p>
          প্রথমে P-type এবং N-type material junction তৈরি করে। দ্বিতীয়ত
          junction depletion barrier তৈরি করে। তৃতীয়ত applied bias সেই barrier
          কমায় বা বাড়ায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: যদি bias barrier কমায়, current flow হতে পারে;
          যদি bias barrier শক্তিশালী করে, main current path ব্লক হয়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি rectifier circuit-এ diode forward condition-এ current যেতে দেয়
          এবং reverse condition-এ সেটিকে block করে।
        </p>

        <p>
          এই simple one-way control সম্ভব হয় শুধুমাত্র এই PN junction working
          principle-এর কারণে।
        </p>

        <p>
          তাই এই লেসনটি diode-এর অনেক practical use-এর ভিত্তি তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>ডায়োড P-type এবং N-type semiconductor region দিয়ে তৈরি হয়।</li>
          <li>এগুলো যুক্ত হলে একটি PN junction তৈরি হয়।</li>
          <li>Carrier diffusion এবং recombination থেকে depletion region তৈরি হয়।</li>
          <li>Forward bias barrier কমিয়ে conduction-কে support করে।</li>
          <li>Reverse bias barrier বাড়িয়ে main current-কে block করে।</li>
          <li>এখানে প্রায় 0.7 V practical silicon threshold হিসেবে ব্যবহৃত হয়েছে।</li>
          <li>ডায়োডের one-way behavior junction physics থেকে আসে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
