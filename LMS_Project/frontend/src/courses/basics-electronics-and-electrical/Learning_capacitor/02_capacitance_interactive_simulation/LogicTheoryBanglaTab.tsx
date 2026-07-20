"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import {
  computeCapacitanceSnapshot,
  dielectricOptions,
  formatCapacitance,
  formatCharge,
  formatEnergy,
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
  const voltage = 12;
  const plateArea = 60;
  const plateDistance = 4;
  const dielectric = dielectricOptions[2];
  const sample = computeCapacitanceSnapshot({
    plateArea,
    plateDistance,
    dielectricK: dielectric.k,
    voltage,
  });

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় capacitance কী?",
      answer:
        "Capacitance হলো একটি capacitor কত charge store করতে পারে তার পরিমাপ।",
    },
    {
      question: "Capacitance-এর SI unit কী?",
      answer: "Capacitance-এর SI unit হলো farad।",
    },
    {
      question: "Plate area বাড়লে capacitance-এর কী হয়?",
      answer:
        "Plate area বাড়লে capacitance বাড়ে, কারণ আরও বেশি charge আলাদা করে ধরে রাখা যায়।",
    },
    {
      question: "Plate distance বাড়লে capacitance-এর কী হয়?",
      answer:
        "Plate distance বাড়লে capacitance কমে যায়, কারণ plate দুটির field coupling দুর্বল হয়।",
    },
    {
      question: "Dielectric constant বেশি হলে কী হয়?",
      answer: "Dielectric constant বেশি হলে capacitance বাড়ে।",
    },
    {
      question: "Q = C x V কী বোঝায়?",
      answer:
        "এটি বোঝায় stored charge নির্ভর করে capacitance এবং voltage-এর উপর।",
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
              ক্যাপাসিট্যান্স কী?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Capacitance হলো একটি capacitor প্রতি volt-এ কত charge store করতে
              পারে তার ক্ষমতা।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব কোন কোন factor capacitance পরিবর্তন করে:
              plate area, plate distance, এবং dielectric material।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি মূল কথা মনে রাখো: একই voltage-এ capacitance যত বেশি, stored
              charge তত বেশি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Capacitance"
              value={formatCapacitance(sample.capacitance)}
              tone="violet"
            />
            <ValueCard
              label="Stored Charge"
              value={formatCharge(sample.charge)}
              tone="emerald"
            />
            <ValueCard
              label="Stored Energy"
              value={formatEnergy(sample.energy)}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <SectionCard title="এটি কী?" eyebrow="Core Concept">
        <p>
          Capacitance আমাদের বলে একটি capacitor প্রতি volt-এ কত electric charge
          store করতে পারে।
        </p>

        <p>
          যদি দুইটি capacitor-এ একই voltage দেওয়া হয়, তাহলে যেটির capacitance
          বেশি, সেটি বেশি charge store করবে।
        </p>

        <p>
          Capacitance-এর unit হলো farad। এক farad মানে এক volt-এ এক coulomb
          charge store করা।
        </p>

        <p>
          <strong>
            Checkpoint Question: একই voltage-এ কোনটি বেশি charge store করবে:
            বড় capacitance নাকি ছোট capacitance?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটি গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          Capacitance গুরুত্বপূর্ণ কারণ এটি ঠিক করে একটি capacitor বাস্তব
          circuit-এ কত charge এবং energy store করতে পারবে।
        </p>

        <p>
          এটি ripple filtering, energy buffering, sensor stability, timing
          behavior, এবং coupling performance-এ প্রভাব ফেলে।
        </p>

        <p>
          Capacitance ভালোভাবে বুঝতে পারলে capacitor charging, discharging,
          এবং RC time constant-এর topic অনেক সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Capacitance কীসে বদলায়?" eyebrow="Main Factors">
        <p>
          Plate area বড় হলে capacitance বাড়ে, কারণ আরও বেশি separated charge
          plate-এর উপর রাখা যায়।
        </p>

        <p>
          Plate distance কম হলে capacitance বাড়ে, কারণ plate দুটির electric
          field coupling আরও শক্তিশালী হয়।
        </p>

        <p>
          Dielectric constant বেশি হলে capacitance-ও বাড়ে।
        </p>

        <p>
          এই example-এ plate area <strong>{plateArea} cm^2</strong>, plate
          distance <strong>{plateDistance} mm</strong>, dielectric হলো{" "}
          <strong>{dielectric.label}</strong>, এবং applied voltage হলো{" "}
          <strong>{voltage} V</strong>।
        </p>
      </SectionCard>

      <SectionCard title="গণিত কীভাবে কাজ করে?" eyebrow="Formula Sheet">
        <p>
          একটি সহজ practical সম্পর্ক হলো <strong>Q = C x V</strong>। অর্থাৎ
          একই voltage-এ capacitance বেশি হলে stored charge বেশি হবে।
        </p>

        <p>
          Stored energy-এর জন্য ব্যবহার করি{" "}
          <strong>E = 1/2 x C x V^2</strong>।
        </p>

        <p>
          এই simulation snapshot-এ capacitance প্রায়{" "}
          <strong>{formatCapacitance(sample.capacitance)}</strong>, stored
          charge প্রায় <strong>{formatCharge(sample.charge)}</strong>, এবং
          stored energy প্রায় <strong>{formatEnergy(sample.energy)}</strong>।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          একটি useful design idea হলো: voltage একই থাকলে capacitance বাড়লে
          stored charge এবং stored energy দুটোই বাড়ে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Real Device Example">
        <p>একটি filtered DC power supply-এর কথা ভাবো।</p>

        <p>
          যদি capacitance খুব কম হয়, তাহলে peaks-এর মাঝখানে output voltage
          বেশি drop করবে এবং ripple আরও পরিষ্কার দেখা যাবে।
        </p>

        <p>
          যদি capacitance বেশি হয়, তাহলে capacitor আরও বেশি charge store করে
          output-কে বেশি সময় support করতে পারে, ফলে voltage আরও smooth দেখায়।
        </p>

        <p>
          এই একই logic adapter, timer circuit, sensor supply, এবং digital
          decoupling network-এও দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত পুনরাবৃত্তি" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Capacitance মানে charge storage ability।</li>
          <li>Capacitance-এর SI unit হলো farad।</li>
          <li>Plate area বড় হলে capacitance বাড়ে।</li>
          <li>Plate spacing ছোট হলে capacitance বাড়ে।</li>
          <li>Dielectric constant বেশি হলে capacitance বাড়ে।</li>
          <li>Q = C x V capacitance, charge, এবং voltage-এর সম্পর্ক দেখায়।</li>
          <li>একই voltage-এ capacitance বেশি হলে stored charge বেশি হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="জ্ঞান যাচাই কুইজ" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer check করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
