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
      question: "Fixed resistor আর variable resistor-এর মূল পার্থক্য কী?",
      answer:
        "Fixed resistor normal use-এ একটি নির্দিষ্ট resistance value ধরে রাখে, আর variable resistor-এর value adjust করা যায়।",
    },
    {
      question: "Fixed resistor নির্বাচন করার সময় tolerance গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ tolerance বলে দেয় বাস্তব resistor value তার label value-এর কতটা কাছে থাকবে, যা circuit-এর accuracy-কে প্রভাবিত করে।",
    },
    {
      question: "Measurement circuit-এ metal film resistor বেশি পছন্দের হতে পারে কেন?",
      answer:
        "কারণ এটি সাধারণত বেশি accurate, কম noisy, এবং low-cost simple resistor-এর তুলনায় বেশি stable performance দেয়।",
    },
    {
      question: "High-power কাজের জন্য wire-wound resistor কেন বেশি উপযোগী?",
      answer:
        "কারণ এর construction heat আর power dissipation অনেক ভালোভাবে handle করতে পারে।",
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
              ফিক্সড রেজিস্টর
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              একটি fixed resistor circuit-এ একটি স্থির resistance value দেওয়ার
              জন্য তৈরি করা হয়। এটি current control, voltage division, এবং
              অন্য component-কে protect করার সবচেয়ে common component-গুলোর একটি।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব fixed resistor আসলে কী, resistance,
              tolerance, আর power rating কীভাবে এর behavior নির্ধারণ করে, এবং
              কেন ভিন্ন fixed resistor construction ভিন্ন কাজের জন্য বেছে নেওয়া হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Behavior" value="Stable Value" tone="emerald" />
            <ValueCard label="Key Selection" value="Ohm / Tolerance / Power" tone="sky" />
            <ValueCard label="Common Types" value="Carbon / Metal Film / Wire Wound" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Fixed resistor আসলে কী করে" eyebrow="Foundation">
        <p>
          একটি fixed resistor current flow-এর বিপরীতে কাজ করে এবং সাধারণত একটি
          নির্দিষ্ট resistance value ধরে রাখে।
        </p>
        <p>
          এর কাজ হতে পারে current limit করা, voltage drop তৈরি করা, bias
          condition set করা, বা circuit-এর ভেতরে voltage divide করা।
        </p>
        <p>
          এখানে মূল ধারণা হলো stability। Fixed resistor ব্যবহার করলে আমরা আশা
          করি circuit প্রায় একই resistance প্রতিবারই দেখবে।
        </p>
      </SectionCard>

      <SectionCard title="Fixed resistor এত গুরুত্বপূর্ণ কেন" eyebrow="Big Picture">
        <p>
          অনেক electronic circuit predictable current আর voltage-এর উপর নির্ভর করে।
        </p>
        <p>
          Resistor ছাড়া electrical flow control করা কঠিন হয়ে যায়, ফলে অন্য
          component অতিরিক্ত current পেতে পারে বা circuit ভুল operating
          condition-এ চলে যেতে পারে।
        </p>
        <p>
          এই কারণেই basic LED project থেকে amplifier, sensor, power supply,
          আর industrial equipment পর্যন্ত fixed resistor everywhere দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Selection-এর তিনটি প্রধান বিষয়" eyebrow="Selection Logic">
        <p>
          Fixed resistor বেছে নেওয়া শুধু ohm value দেখার বিষয় নয়।
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistance value বলে current কতটা oppose হবে।</li>
          <li>Tolerance বলে actual value label value-এর কতটা কাছে থাকবে।</li>
          <li>Power rating বলে resistor কতটা heat safely handle করতে পারবে।</li>
        </ul>
        <p>
          এই তিনটির যেকোনো একটি ভুল হলে circuit inaccurate, unstable, বা unsafe
          হয়ে যেতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Resistance value circuit-কে কীভাবে প্রভাবিত করে" eyebrow="Ohm Value">
        <p>
          Resistance value বেশি হলে সাধারণত current আরও বেশি কমে যায়।
        </p>
        <p>
          Resistance value কম হলে current তুলনামূলক বেশি flow করতে পারে।
        </p>
        <p>
          তাই LED protection, signal conditioning, বা voltage division যাই হোক,
          resistor value অবশ্যই circuit-এর উদ্দেশ্যের সঙ্গে match করতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="Tolerance design confidence কেন বদলে দেয়" eyebrow="Accuracy">
        <p>
          Resistor-এর উপর লেখা value হলো target value, কিন্তু বাস্তব component
          একেবারে perfect হয় না।
        </p>
        <p>
          Tolerance target value-এর চারপাশে possible variation বোঝায়। Lower
          tolerance percentage মানে resistor বেশি precise।
        </p>
        <p>
          Casual circuit-এ wider tolerance acceptable হতে পারে, কিন্তু
          measurement, sensing, আর precise signal work-এ tighter tolerance অনেক
          বেশি গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Power rating কখনও ignore করা যাবে না" eyebrow="Heat Safety">
        <p>
          Current resistor-এর মধ্য দিয়ে গেলে electrical energy-এর একটি অংশ heat-এ
          convert হয়।
        </p>
        <p>
          যদি resistor তার design limit-এর চেয়ে বেশি power dissipate করতে বাধ্য
          হয়, তাহলে এটি overheat করতে পারে, value drift করতে পারে, বা পুরোপুরি
          fail করতে পারে।
        </p>
        <p>
          ভালো resistor selection মানে শুধু value আর tolerance নয়, expected
          power safely survive করতে পারবে কি না সেটাও check করা।
        </p>
      </SectionCard>

      <SectionCard title="Common fixed resistor type" eyebrow="Type Comparison">
        <p>
          Fixed resistor-এর construction ভিন্ন হয়, কারণ different application-এর
          জন্য different strength দরকার।
        </p>
        <p>
          Carbon composition resistor low-cost এবং simple, কিন্তু সাধারণত noise
          বেশি এবং precision কম।
        </p>
        <p>
          Metal film resistor low noise, high accuracy, আর stable performance-এর
          জন্য পরিচিত, তাই precision work-এ এটি common।
        </p>
        <p>
          Wire-wound resistor heat handling আর power dissipation-এ শক্তিশালী,
          তাই heavier-duty application-এ এটি useful।
        </p>
      </SectionCard>

      <SectionCard title="কখন কোন fixed type ভালো choice" eyebrow="Use Cases">
        <p>
          যদি cost আর simplicity সবচেয়ে গুরুত্বপূর্ণ হয়, তাহলে basic carbon
          composition resistor educational বা general circuit-এ acceptable হতে পারে।
        </p>
        <p>
          যদি accuracy আর low noise বেশি গুরুত্বপূর্ণ হয়, metal film সাধারণত
          better option।
        </p>
        <p>
          যদি circuit-এ বেশি power আর heat handle করতে হয়, wire-wound সঠিক
          choice হতে পারে, যদিও physical size বড় হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Student-রা কোথায় বেশি ভুল করে" eyebrow="Common Mistakes">
        <p>
          একটি common mistake হলো শুধু ohm value দেখে resistor choose করা, কিন্তু
          tolerance বা power rating ignore করা।
        </p>
        <p>
          আরেকটি mistake হলো ভাবা যে একই labeled resistance হলে সব fixed resistor
          practically একইভাবে behave করবে।
        </p>
        <p>
          বাস্তবে accuracy, noise, heat handling, আর reliability resistor-এর
          construction আর type-এর উপর নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Fixed resistor একটি stable resistance value দেয়।</li>
          <li>এর main job হলো current limiting, voltage drop, আর bias control।</li>
          <li>Selection depends on resistance value, tolerance, and power rating.</li>
          <li>Carbon, metal film, আর wire-wound fixed resistor ভিন্ন প্রয়োজনে ব্যবহৃত হয়।</li>
          <li>সেরা fixed resistor হলো যেটি circuit-এর real job safely match করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে fixed resistor-এর core idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
