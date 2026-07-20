"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { DIODE_MODEL, getCharacteristicPoint } from "./logic";

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
  const forwardPoint = getCharacteristicPoint(3);
  const reversePoint = getCharacteristicPoint(-12);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "ডায়োড characteristic curve কী দেখায়?",
      answer:
        "এটি diode voltage এবং diode current-এর মধ্যে সম্পর্ক দেখায়।",
    },
    {
      question: "Threshold-এর নিচে forward current খুব ছোট থাকে কেন?",
      answer:
        "কারণ forward voltage যথেষ্ট বেশি না হওয়া পর্যন্ত junction barrier স্বাভাবিক conduction-কে এখনও বাধা দেয়।",
    },
    {
      question: "ডায়োড forward threshold পার হলে current-এর কী হয়?",
      answer:
        "Voltage বাড়তে থাকলে current অনেক বেশি দ্রুত বাড়তে শুরু করে।",
    },
    {
      question: "Characteristic curve-এ reverse bias-এ কী দেখা যায়?",
      answer:
        "স্বাভাবিক reverse operation-এ diode বেশিরভাগ current block করে, তবে খুব ছোট reverse leakage থাকতে পারে।",
    },
    {
      question: "ভিন্ন diode type-এর curve ভিন্ন হয় কেন?",
      answer:
        "কারণ different diode material এবং structure different threshold voltage, leakage, এবং conduction behavior তৈরি করে।",
    },
    {
      question: "V-I curve practical কাজের জন্য গুরুত্বপূর্ণ কেন?",
      answer:
        "এটি engineer-কে real circuit-এ different voltage এবং bias condition-এ diode কীভাবে behave করবে তা predict করতে সাহায্য করে।",
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
              ডায়োডের বৈশিষ্ট্য
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ডায়োডের বৈশিষ্ট্য বোঝায়, diode-এর ওপর voltage পরিবর্তন হলে current
              কীভাবে পরিবর্তিত হয়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনের মূল ধারণা হলো V-I curve, forward threshold, reverse
              leakage, এবং কেন different diode type একদম একইভাবে behave করে
              না।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই লেসনেই diode শুধু একটি one-way symbol না থেকে একটি measurable
              real component হিসেবে দেখা শুরু হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Forward Threshold"
              value={`${DIODE_MODEL.thresholdVoltage.toFixed(1)} V`}
              tone="violet"
            />
            <ValueCard
              label="Forward Current"
              value={`${forwardPoint.currentMA.toFixed(1)} mA`}
              tone="emerald"
            />
            <ValueCard
              label="Reverse Current"
              value={`${reversePoint.currentMA.toFixed(3)} mA`}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="ডায়োডের বৈশিষ্ট্য কী?" eyebrow="Core Concept">
        <p>
          ডায়োডের বৈশিষ্ট্য আমাদের বলে একটি real diode applied voltage-এর
          প্রতি কীভাবে সাড়া দেয়।
        </p>

        <p>
          শুধু diode on না off তা বলার বদলে characteristic curve দেখায় voltage
          পরিবর্তনের সাথে current আসলে কীভাবে বদলায়।
        </p>

        <p>
          এই voltage-current সম্পর্ককেই সাধারণত diode V-I characteristic বলা
          হয়।
        </p>
      </SectionCard>

      <SectionCard title="Forward bias-এ কী ঘটে?" eyebrow="Forward Region">
        <p>
          Forward bias-এ শুরুতে current খুব ছোট থাকে, কারণ diode এখনও তার
          practical threshold-এর নিচে থাকে।
        </p>

        <p>
          Diode প্রায় <strong>{DIODE_MODEL.thresholdVoltage.toFixed(1)} V</strong>{" "}
          এ পৌঁছানোর পর current অনেক বেশি স্পষ্টভাবে বাড়তে শুরু করে।
        </p>

        <p>
          এই sample-এ <strong>{forwardPoint.voltage.toFixed(1)} V</strong>{" "}
          এ current প্রায় <strong>{forwardPoint.currentMA.toFixed(1)} mA</strong>।
        </p>

        <p>
          <strong>
            চেকপয়েন্ট প্রশ্ন: threshold-এর আগে diode current কি অনেক বেশি
            বাড়ে, নাকি threshold পার হওয়ার পর বেশি বাড়ে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Reverse bias-এ কী ঘটে?" eyebrow="Reverse Region">
        <p>
          Reverse bias-এ diode normal operation-এ বেশিরভাগ current block
          করে।
        </p>

        <p>
          এর মানে একদম zero current নয়। খুব ছোট reverse leakage current এখনও
          দেখা যেতে পারে।
        </p>

        <p>
          এই lesson example-এ <strong>{reversePoint.voltage.toFixed(1)} V</strong>{" "}
          এ reverse current প্রায়{" "}
          <strong>{reversePoint.currentMA.toFixed(3)} mA</strong>।
        </p>
      </SectionCard>

      <SectionCard title="Curve বাঁকানো কেন?" eyebrow="Threshold Behavior">
        <p>
          Curve বাঁকানো হয় কারণ junction কোনো ordinary resistor-এর মতো behave
          করে না।
        </p>

        <p>
          Forward threshold-এর নিচে conduction দুর্বল থাকে। Threshold-এর পরে
          ছোট voltage increase-ও current-এ অনেক বড় পরিবর্তন আনতে পারে।
        </p>

        <p>
          এ কারণেই turn-on-এর পরে curve-এর forward অংশ অনেক বেশি steep হয়ে
          যায়।
        </p>
      </SectionCard>

      <SectionCard title="Diode type ভিন্ন হলে পার্থক্য হয় কেন?" eyebrow="Material Differences">
        <p>
          Silicon, germanium, এবং Schottky-এর মতো different diode type-এর
          threshold বা leakage behavior একদম একরকম হয় না।
        </p>

        <p>
          কিছু diode দ্রুত turn on করে, কিছু reverse bias-এ বেশি leakage দেয়,
          আর কিছু low-voltage বা fast application-এর জন্য বেশি উপযোগী।
        </p>

        <p>
          এ কারণেই engineer-রা characteristic curve compare করে, সব diode একই
          ধরে নেয় না।
        </p>
      </SectionCard>

      <SectionCard title="Graph গুরুত্বপূর্ণ কেন?" eyebrow="Measurement View">
        <p>
          একটি graph diode কীভাবে different operating region-এর মধ্যে যায় তা
          সহজে দেখতে সাহায্য করে।
        </p>

        <p>
          আপনি খুব দ্রুত below-threshold area, forward conduction area, এবং
          reverse-blocking area আলাদা করতে পারেন।
        </p>

        <p>
          এটি circuit design, troubleshooting, এবং সঠিক diode type বেছে
          নেওয়ার জন্য খুবই উপকারী।
        </p>
      </SectionCard>

      <SectionCard title="মনে রাখার মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Diode characteristic curve বোঝার সবচেয়ে সহজ উপায় হলো দুইটি প্রশ্ন
          করা।
        </p>

        <p>
          প্রথমত, কোন bias direction প্রয়োগ করা হয়েছে? দ্বিতীয়ত, diode কি
          এখনও threshold-এর নিচে আছে, নাকি ইতিমধ্যে সেটি পার হয়ে গেছে?
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          বাস্তব বোঝার সহজ কথা: V-I curve দেখায় diode কোনো ideal switch নয়।
          এর একটি real turn-on region, real reverse-leakage region, এবং
          material-dependent behavior আছে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি rectifier বা protection circuit-এ engineer-দের শুধু diode
          principle অনুযায়ী কাজ করে কি না জানলেই হয় না, বরং বাস্তবে কত voltage
          drop এবং current হবে তাও জানতে হয়।
        </p>

        <p>
          Characteristic curve final circuit তৈরি করার আগেই সেই behavior
          predict করতে সাহায্য করে।
        </p>

        <p>
          এ কারণেই diode characteristic theory এবং real electronics work-এর
          মধ্যে একটি সেতুর মতো কাজ করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Diode characteristic curve voltage বনাম current দেখায়।</li>
          <li>Practical threshold-এর আগে forward current ছোট থাকে।</li>
          <li>Threshold-এর পরে forward current অনেক দ্রুত বাড়ে।</li>
          <li>Reverse bias বেশিরভাগ current block করে, তবে tiny leakage থাকতে পারে।</li>
          <li>Curve-এর shape simple resistor-এর মতো নয়।</li>
          <li>Different diode type-এর threshold এবং leakage ভিন্ন হয়।</li>
          <li>V-I graph real circuit behavior predict করতে সাহায্য করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
