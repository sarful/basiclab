"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeStructureSnapshot,
  dielectricOptions,
  formatCapacitance,
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
  const plateArea = 60;
  const plateDistance = 4;
  const dielectric = dielectricOptions[3];
  const sample = computeStructureSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "একটি basic capacitor-এর প্রধান দুইটি physical part কী?",
      answer:
        "একটি basic capacitor-এ দুইটি conductive plate এবং মাঝখানে একটি dielectric material থাকে।",
    },
    {
      question: "Dielectric কেন গুরুত্বপূর্ণ?",
      answer:
        "Dielectric plate দুটির মধ্যে short circuit হতে বাধা দেয় এবং capacitance বাড়াতে সাহায্য করে।",
    },
    {
      question: "Plate area বাড়লে কী হয়?",
      answer:
        "Plate area বাড়লে capacitance বাড়ে, কারণ effective field surface বড় হয়।",
    },
    {
      question: "Plate spacing বাড়লে কী হয়?",
      answer:
        "Plate spacing বাড়লে capacitance কমে যায়, কারণ field coupling দুর্বল হয়।",
    },
    {
      question: "Dielectric constant বেশি হলে কী হয়?",
      answer: "Dielectric constant বেশি হলে capacitance বাড়ে।",
    },
    {
      question: "Dielectric layer-এর ভেতর দিয়ে steady direct conduction যেতে পারে কি?",
      answer:
        "না। Dielectric হলো insulator, তাই direct current straight line-এ pass করতে পারে না।",
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
              ক্যাপাসিটরের গঠন
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              একটি capacitor conductive plate এবং dielectric layer দিয়ে তৈরি
              হয়, যাতে charge নিরাপদভাবে আলাদা করে store করা যায়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব capacitor-এর physical structure কীভাবে এর
              capacitance এবং electrical behavior নিয়ন্ত্রণ করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              মূল design idea হলো simple: plate area, plate spacing, এবং
              dielectric material - এই তিনটি জিনিস final capacitance নির্ধারণ
              করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Plate Area"
              value={`${plateArea} cm^2`}
              tone="violet"
            />
            <ValueCard
              label="Plate Distance"
              value={`${plateDistance} mm`}
              tone="emerald"
            />
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(sample.capacitance)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="এটি কী?" eyebrow="Core Concept">
        <p>
          একটি capacitor-এর structure-এ সাধারণত দুইটি conductive plate থাকে,
          যা terminal-এর সাথে যুক্ত থাকে, এবং তাদের মাঝখানে একটি dielectric
          material থাকে।
        </p>

        <p>
          Conductive plate charge জমতে দেয়, আর dielectric plate দুটিকে
          electrically আলাদা রাখে যাতে তারা short না হয়ে যায়।
        </p>

        <p>
          এই arrangement-এর কারণে plate দুটির মধ্যে electric field তৈরি হয়,
          আর এই field-ই capacitor-এ charge storage-এর ভিত্তি।
        </p>

        <p>
          <strong>
            Checkpoint Question: কোন part আলাদা charge ধরে রাখে, আর কোন part
            short circuit হতে বাধা দেয়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          Capacitor-এর structure গুরুত্বপূর্ণ, কারণ এর physical build সরাসরি
          capacitance, stability, size, এবং voltage handling-এর উপর প্রভাব
          ফেলে।
        </p>

        <p>
          Designer-রা plate shape, spacing, এবং dielectric type নির্বাচন করে
          circuit-এর প্রয়োজন অনুযায়ী: বেশি capacitance, ভালো stability, ছোট
          size, বা ভালো insulation strength-এর জন্য।
        </p>

        <p>
          Capacitor structure বুঝতে পারলে ceramic, mica, electrolytic এবং
          অন্য ধরনের capacitor কেন আলাদা আচরণ করে তা সহজে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Structure-এর প্রধান অংশ" eyebrow="Physical Parts">
        <p>
          প্রথম প্রধান অংশ হলো conductive plate। এই plate-গুলো capacitor
          terminal-এর সাথে যুক্ত থাকে এবং opposite charge ধরে রাখে।
        </p>

        <p>
          দ্বিতীয় প্রধান অংশ হলো dielectric। এটি plate দুটির মাঝের insulating
          layer।
        </p>

        <p>
          Dielectric গুরুত্বপূর্ণ কারণ এটি direct conduction বন্ধ করে এবং final
          capacitance নির্ধারণেও সাহায্য করে।
        </p>

        <p>
          এই example-এ selected dielectric হলো{" "}
          <strong>{dielectric.label}</strong>, যার dielectric constant{" "}
          <strong>{dielectric.k}</strong>।
        </p>
      </SectionCard>

      <SectionCard title="Structure কীভাবে capacitance বদলায়?" eyebrow="Construction Effect">
        <p>
          Plate area বড় হলে capacitance বাড়ে, কারণ effective electric field
          surface বড় হয়।
        </p>

        <p>
          Plate spacing ছোট হলে capacitance বাড়ে, কারণ plate দুটির মধ্যে field
          coupling আরও শক্তিশালী হয়।
        </p>

        <p>
          Dielectric constant বেশি হলে capacitance-ও বাড়ে।
        </p>

        <p>
          এই structure snapshot-এ resulting capacitance প্রায়{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong>।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Real Device Example">
        <p>একটি electronic control board-এর ceramic capacitor-এর কথা ভাবো।</p>

        <p>
          এটি dielectric material এবং carefully arranged conductive layer
          ব্যবহার করে, যাতে ছোট package-এর মধ্যেও useful capacitance রাখা যায়।
        </p>

        <p>
          যদি dielectric বদলে যায় বা internal plate arrangement বদলে যায়,
          তাহলে capacitance এবং performance-ও বদলে যায়।
        </p>

        <p>
          Filter capacitor, timing capacitor, এবং compact high-value
          capacitor design-এর সময়ও এই একই structural idea ব্যবহার করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত পুনরাবৃত্তি" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>একটি capacitor-এ conductive plate এবং dielectric থাকে।</li>
          <li>Plate-গুলো separated charge ধরে রাখে।</li>
          <li>Dielectric short circuit হতে বাধা দেয়।</li>
          <li>Plate area বড় হলে capacitance বাড়ে।</li>
          <li>Plate spacing ছোট হলে capacitance বাড়ে।</li>
          <li>Dielectric constant বেশি হলে capacitance বাড়ে।</li>
          <li>Capacitor structure সরাসরি real circuit behavior-এ প্রভাব ফেলে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="জ্ঞান যাচাই কুইজ" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer check করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
