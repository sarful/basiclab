"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "sky" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50 text-sky-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300" />
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
  const quizItems: QuizAccordionItem[] = [
    {
      question: "Potentiometer fixed resistor থেকে আলাদা কেন?",
      answer:
        "Potentiometer adjustable। এর wiper সরালে output voltage বা active resistance বদলায়, কিন্তু fixed resistor একটি value-তেই থাকে।",
    },
    {
      question: "Potentiometer-কে three-terminal variable resistor বলা হয় কেন?",
      answer:
        "কারণ এতে দুইটি end terminal এবং একটি movable wiper terminal থাকে, যা resistive track-এর উপর position change করে।",
    },
    {
      question: "Voltage divider mode আর rheostat mode-এর মধ্যে পার্থক্য কী?",
      answer:
        "Voltage divider mode-এ তিনটি terminal ব্যবহার করে adjustable output voltage পাওয়া যায়। Rheostat mode-এ দুইটি terminal ব্যবহার করে adjustable resistance পাওয়া যায়।",
    },
    {
      question: "Calibration আর volume control-এ potentiometer useful কেন?",
      answer:
        "কারণ wiper position smoothly adjust করা যায়, তাই voltage বা resistance level সহজে fine-tune করা সম্ভব হয়।",
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
              পটেনশিওমিটার
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              একটি potentiometer হলো movable wiper-সহ একটি variable resistor।
              এটি circuit-এ সবসময় এক fixed value ধরে রাখার বদলে voltage বা
              resistance adjust করার সুযোগ দেয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব potentiometer কীভাবে কাজ করে, wiper আসলে
              কী change করে, এবং কেন voltage-divider mode আর rheostat mode
              practical circuit-এ দুটোই গুরুত্বপূর্ণ।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Behavior" value="Adjustable Control" tone="emerald" />
            <ValueCard label="Key Part" value="Wiper" tone="sky" />
            <ValueCard label="Main Modes" value="Divider / Rheostat" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Potentiometer কী" eyebrow="Foundation">
        <p>
          একটি potentiometer হলো three-terminal variable resistor।
        </p>
        <p>
          Fixed resistor-এর মতো এটি circuit-কে একটিমাত্র permanent value ব্যবহার
          করতে বাধ্য করে না।
        </p>
        <p>
          এর বদলে user resistive track-এর উপর wiper সরাতে পারে, আর সেই movement
          circuit-এর ভেতরে component-এর behavior বদলে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Wiper কেন গুরুত্বপূর্ণ" eyebrow="Control Element">
        <p>
          Potentiometer-এর সবচেয়ে গুরুত্বপূর্ণ moving part হলো wiper।
        </p>
        <p>
          Wiper move করলে resistive path-এর দুই অংশের ratio বদলে যায়।
        </p>
        <p>
          এই কারণেই potentiometer শুধু fixed resistor value নয়, smooth adjustment
          দিতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Voltage divider mode" eyebrow="Three-Terminal Use">
        <p>
          Voltage divider mode-এ তিনটি terminal-ই ব্যবহার করা হয়।
        </p>
        <p>
          Potentiometer input voltage নিয়ে wiper point-এ একটি adjustable output
          voltage দেয়।
        </p>
        <p>
          Wiper position output ratio change করে, তাই controlled voltage
          adjustment দরকার হলে এই mode খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="Rheostat mode" eyebrow="Two-Terminal Use">
        <p>
          Rheostat mode-এ potentiometer-কে two-terminal variable resistor-এর মতো
          ব্যবহার করা হয়।
        </p>
        <p>
          এখানে wiper divided output voltage দেওয়ার বদলে circuit-এর active
          resistance change করে।
        </p>
        <p>
          এই mode useful যখন adjustable current control বা effective resistance
          change দরকার হয়।
        </p>
      </SectionCard>

      <SectionCard title="Potentiometer useful কেন" eyebrow="Applications">
        <p>
          Potentiometer useful কারণ অনেক circuit-এ locked value নয়, manual
          adjustment দরকার হয়।
        </p>
        <p>
          Common example হলো volume control, brightness adjustment, calibration,
          tuning, আর reference level set করা।
        </p>
        <p>
          এর আসল value হলো electrical behavior-কে সহজ mechanical control দিয়ে
          fine-tune করার সুযোগ।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Simulator একসঙ্গে দুইটি গুরুত্বপূর্ণ ধারণা দেখায়।
        </p>
        <p>
          Voltage divider mode-এ wiper move করলে output voltage ratio বদলায়।
        </p>
        <p>
          Rheostat mode-এ wiper move করলে active resistance বদলায়, আর সেই সঙ্গে
          circuit-এর current flow-ও বদলায়।
        </p>
      </SectionCard>

      <SectionCard title="Potentiometer ordinary resistor-এর মতো নয় কেন" eyebrow="Comparison">
        <p>
          Fixed resistor বেছে নেওয়া হয় stability-এর জন্য, কিন্তু potentiometer
          বেছে নেওয়া হয় adjustability-এর জন্য।
        </p>
        <p>
          Potentiometer তখন বেশি valuable যখন circuit build হওয়ার পর user বা
          technician-কে tuning করতে হয়।
        </p>
        <p>
          এই কারণেই control panel, audio system, আর calibration circuit-এ এটি
          বিশেষভাবে useful।
        </p>
      </SectionCard>

      <SectionCard title="যে limitation মনে রাখতে হবে" eyebrow="Practical Limits">
        <p>
          Potentiometer-এর moving mechanical part থাকে, তাই সময়ের সঙ্গে wear
          হতে পারে।
        </p>
        <p>
          Heavy power load-এর জন্যও এটি সবসময় best choice নয়, বিশেষ করে stronger
          heat-handling component-এর তুলনায়।
        </p>
        <p>
          ভালো design মানে potentiometer-কে smooth adjustment-এর জন্য ব্যবহার করা,
          heavy-duty power dissipation-এর জন্য নয়।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো ভাবা potentiometer শুধু volume change করার জন্য।
        </p>
        <p>
          আরেকটি mistake হলো ভুলে যাওয়া যে একই component দুইভাবে ব্যবহার করা যায়:
          voltage divider mode এবং rheostat mode।
        </p>
        <p>
          Student-রা অনেক সময় এটাও ভুলে যায় যে wiper position শুধু dial-এর number
          change করে না, circuit-এর ratio-ও change করে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Potentiometer হলো three-terminal variable resistor।</li>
          <li>Wiper হলো moving part যা circuit behavior change করে।</li>
          <li>এটি voltage divider mode বা rheostat mode-এ কাজ করতে পারে।</li>
          <li>Volume control, calibration, আর adjustable setting-এ এটি useful।</li>
          <li>এর strength হলো adjustability, heavy power handling নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে potentiometer-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
