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
        "Fixed resistor-এর resistance value একটিই থাকে, আর variable resistor-এর resistance adjust করা যায়।",
    },
    {
      question: "Thermistor-কে সাধারণ fixed resistor থেকে আলাদা ধরা হয় কেন?",
      answer:
        "কারণ এর resistance temperature-এর সাথে বদলায়, তাই এটি constant resistor-এর চেয়ে sensing component-এর মতো কাজ করে।",
    },
    {
      question: "কেন metal film resistor অনেক সময় carbon composition resistor-এর চেয়ে ভালো পছন্দ হতে পারে?",
      answer:
        "কারণ metal film resistor সাধারণত বেশি precise এবং বেশি stable, আর carbon composition resistor-এ noise বেশি ও precision কম হতে পারে।",
    },
    {
      question: "Practical design-এ resistor type selection গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ ভিন্ন resistor type accuracy, power handling, manual control, বা sensing-এর মতো ভিন্ন প্রয়োজনের জন্য optimize করা থাকে।",
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
              রেজিস্টরের ধরন
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              সব resistor একই কাজের জন্য তৈরি নয়। ভিন্ন resistor type তৈরি হয়
              ভিন্ন লক্ষ্য নিয়ে, যেমন fixed control, variable adjustment,
              sensing, high precision, বা heavy power handling।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর focus হলো classification আর selection logic: প্রধান
              resistor type-গুলো কী, তারা কীভাবে আলাদা, আর practical circuit-এ
              কেন একটি type অন্যটির চেয়ে ভালো choice হতে পারে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Groups" value="Fixed / Variable / Sensor" tone="emerald" />
            <ValueCard label="Selection Basis" value="Job Fit" tone="sky" />
            <ValueCard label="Design Focus" value="Accuracy / Power / Response" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Resistor type কেন গুরুত্বপূর্ণ" eyebrow="Big Picture">
        <p>
          একটি resistor সবসময় শুধু এক fixed value-ওয়ালা part নয়।
        </p>
        <p>
          Practical electronics-এ ভিন্ন resistor type আছে, কারণ ভিন্ন circuit-এর
          প্রয়োজনও ভিন্ন।
        </p>
        <p>
          কিছু circuit-এ low cost দরকার, কিছুতে high precision দরকার, কিছুতে
          manual adjustment দরকার, আর কিছুতে temperature বা light-এর উপর
          ভিত্তি করে sensing দরকার।
        </p>
      </SectionCard>

      <SectionCard title="Resistor-এর তিনটি বড় family" eyebrow="Core Classification">
        <p>Lesson level-এ বেশিরভাগ resistor category-কে তিনটি group-এ বোঝা যায়।</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Fixed resistor, যেখানে normal use-এ value একই থাকে।</li>
          <li>Variable resistor, যেখানে user resistance adjust করতে পারে।</li>
          <li>Sensor resistor, যেখানে environment বদলালে resistance বদলায়।</li>
        </ul>
        <p>
          এই classification student-দের দ্রুত বুঝতে সাহায্য করে circuit-এ
          resistor কোন role পালন করছে।
        </p>
      </SectionCard>

      <SectionCard title="Fixed resistor type" eyebrow="Stable Values">
        <p>
          Fixed resistor তখন ব্যবহার করা হয় যখন circuit-এর একটি consistent
          resistance value দরকার।
        </p>
        <p>
          Carbon composition resistor পুরনো এবং low-cost option, কিন্তু এতে
          সাধারণত noise বেশি এবং precision কম।
        </p>
        <p>
          Metal film resistor বেশি accurate এবং বেশি stable, তাই signal বা
          measurement-related কাজের জন্য এটি common choice।
        </p>
        <p>
          Wire-wound resistor high-power situation-এ শক্তিশালী, তবে এর size আর
          construction কিছু fast বা sensitive circuit-এর জন্য কম উপযুক্ত হতে
          পারে।
        </p>
      </SectionCard>

      <SectionCard title="Variable resistor" eyebrow="Adjustable Control">
        <p>
          Variable resistor user বা system-কে resistance change করতে দেয়,
          fixed রাখে না।
        </p>
        <p>
          Potentiometer এর একটি common example। এটি volume change, light dim
          করা, বা calibration point adjust করার মতো manual control-এর জন্য
          ব্যবহার হয়।
        </p>
        <p>
          মূল idea হলো খুব সহজ: একটি permanent resistance value-এর বদলে,
          component circuit-কে adjustable resistance path দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Sensor resistor" eyebrow="Environmental Response">
        <p>
          কিছু resistor এমনভাবে design করা হয় যাতে environment বদলালে তাদের
          resistance-ও বদলায়।
        </p>
        <p>
          Thermistor temperature-এর সাথে resistance বদলায়, তাই heat-related
          detection আর protection-এর জন্য এটি useful।
        </p>
        <p>
          LDR বা light dependent resistor light-এর সাথে resistance বদলায়, তাই
          automatic lighting আর basic light-sensing কাজের জন্য useful।
        </p>
        <p>
          এই parts-গুলোর মূল focus fixed current limiting নয়। এগুলো
          environmental change-কে electrical change-এ convert করে।
        </p>
      </SectionCard>

      <SectionCard title="Resistor type কীভাবে compare করা হয়" eyebrow="Selection Logic">
        <p>
          Resistor type choose করা শুধু resistance value-এর উপর নির্ভর করে না।
        </p>
        <p>
          Engineer-রা accuracy, power handling, response speed, cost, stability,
          আর best application-এর মতো factor-ও compare করে।
        </p>
        <p>
          এই কারণেই simulator-এ precision, heat tolerance, response, আর
          application fit-এর মতো comparison idea আছে।
        </p>
      </SectionCard>

      <SectionCard title="কখন কোন type ভালো choice" eyebrow="Use Case Thinking">
        <p>
          যদি low-cost general use দরকার হয়, simple fixed resistor-ই যথেষ্ট
          হতে পারে।
        </p>
        <p>
          যদি precision দরকার হয়, metal film সাধারণত ভালো choice।
        </p>
        <p>
          যদি high power dissipation দরকার হয়, wire-wound বেশি suitable হতে
          পারে।
        </p>
        <p>
          যদি adjustment দরকার হয়, potentiometer বেশি যুক্তিযুক্ত।
        </p>
        <p>
          আর যদি sensing দরকার হয়, thermistor বা LDR category প্রথমে ভাবাই
          সঠিক দিক।
        </p>
      </SectionCard>

      <SectionCard title="কেন কোনো এক resistor type সবকিছুর জন্য best নয়" eyebrow="Tradeoffs">
        <p>
          প্রতিটি resistor type-এর সুবিধা আছে, আবার limitation-ও আছে।
        </p>
        <p>
          যে resistor খুব precise, সেটি power dissipation-এ best নাও হতে পারে।
          যে resistor power-এ শক্তিশালী, সেটি বড় হতে পারে এবং সব জায়গায়
          convenient নাও হতে পারে। Sensor resistor environment-এ ভালো response
          দিলেও fixed accuracy নাও দিতে পারে।
        </p>
        <p>
          ভালো design মানে হলো component type-কে real job-এর সাথে match করা।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner confusion" eyebrow="Watch Out">
        <p>
          সব resistor শুধু fixed current limiting-এর জন্য, এমন ভাবা যাবে না।
        </p>
        <p>
          Potentiometer, thermistor, বা LDR সব condition-এ ordinary fixed
          resistor-এর মতো behave করবে, এটাও ভাবা যাবে না।
        </p>
        <p>
          আর application need না ভেবে শুধু price বা appearance দেখে resistor
          type choose করাও ঠিক না।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistor fixed, variable, বা sensor-based হতে পারে।</li>
          <li>Carbon, metal film, আর wire-wound common fixed resistor type।</li>
          <li>Potentiometer adjustable resistance দেয়।</li>
          <li>Thermistor temperature-এ respond করে, আর LDR light-এ respond করে।</li>
          <li>Best resistor type job-এর উপর নির্ভর করে, শুধু value-এর উপর নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে resistor type selection idea ঝালাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
