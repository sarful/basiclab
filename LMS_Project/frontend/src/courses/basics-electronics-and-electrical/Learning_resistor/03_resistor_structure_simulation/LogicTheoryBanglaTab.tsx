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
      question: "রেজিস্টরের ভিতরের material কেন গুরুত্বপূর্ণ?",
      answer:
        "কারণ material-এর উপর নির্ভর করে resistance stability, heat behavior, noise, precision, এবং electrical stress-এর সময় resistor কীভাবে behave করবে।",
    },
    {
      question: "অনেক resistor-এ ceramic core-এর কাজ কী?",
      answer:
        "Ceramic core resistive element-কে support দেয়, heat manage করতে সাহায্য করে, এবং resistor-কে mechanical strength দেয়।",
    },
    {
      question: "একই রকম resistance value হলেও দুইটি resistor বাস্তবে আলাদা behave করতে পারে কেন?",
      answer:
        "কারণ construction style আর material type tolerance, temperature drift, noise, এবং power handling বদলে দিতে পারে।",
    },
    {
      question: "রেজিস্টর structure-এ heat এত গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ temperature বাড়লে resistance বদলাতে পারে, stress বাড়তে পারে, এবং design বা material উপযুক্ত না হলে long-term reliability কমে যেতে পারে।",
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
              রেজিস্টরের গঠন
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              রেজিস্টর শুধু একটি ohm value নয়। এটি নির্দিষ্ট material এবং layer
              দিয়ে তৈরি একটি physical structure, যা ঠিক করে এটি current, heat,
              stability, আর precision কীভাবে handle করবে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর focus হলো resistor-এর construction logic: ভিতরে কী
              থাকে, material choice কেন গুরুত্বপূর্ণ, আর structure কীভাবে real
              circuit performance বদলায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Idea" value="Built in Layers" tone="emerald" />
            <ValueCard label="Main Variable" value="Material Type" tone="sky" />
            <ValueCard label="Big Concern" value="Heat Stress" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="রেজিস্টরের structure কেন গুরুত্বপূর্ণ" eyebrow="Big Picture">
        <p>
          অনেক beginner resistor-কে খুব simple একটা part হিসেবে দেখে, কিন্তু
          component-এর ভিতরে একটি real physical structure থাকে।
        </p>
        <p>
          এই structure ঠিক করে resistor কীভাবে resistance তৈরি করবে,
          temperature-এর সাথে কীভাবে respond করবে, আর electrical stress-এর
          মধ্যে কতটা ভালোভাবে survive করবে।
        </p>
        <p>
          তাই resistor structure পড়া মানে আসলে বোঝা কেন একই রকম value মনে
          হলেও এক resistor অন্য resistor-এর মতো behave করে না।
        </p>
      </SectionCard>

      <SectionCard title="রেজিস্টরের ভিতরের প্রধান অংশগুলো" eyebrow="Internal Anatomy">
        <p>একটি practical resistor-এ সাধারণত কয়েকটি functional part থাকে।</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistive element, যা current flow-কে oppose করে।</li>
          <li>Core, যা অনেক সময় ceramic হয় এবং structure-কে support দেয়।</li>
          <li>Outer body বা coating, যা insulation এবং protection দেয়।</li>
          <li>Metal leads বা terminals, যা resistor-কে circuit-এর সাথে যুক্ত করে।</li>
        </ul>
        <p>
          প্রতিটি part-এর কাজ আলাদা, কিন্তু সবগুলো মিলে এমন একটি stable
          component তৈরি করে যা predictable way-তে current resist করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Resistive element আসলে কী কাজ করে" eyebrow="Electrical Job">
        <p>Resistive element-ই resistor-এর মূল অংশ।</p>
        <p>
          এখানেই moving charge opposition-এর মুখে পড়ে, voltage drop তৈরি হয়,
          এবং electrical energy-এর একটি অংশ heat-এ convert হয়।
        </p>
        <p>
          এই element-এর geometry, thickness, এবং material final resistance
          value এবং performance-এর উপর বড় প্রভাব ফেলে।
        </p>
      </SectionCard>

      <SectionCard title="Ceramic core কেন গুরুত্বপূর্ণ" eyebrow="Mechanical Support">
        <p>Core শুধু resistor-কে ধরে রাখার জন্য নয়।</p>
        <p>
          অনেক design-এ ceramic core thermal stability, electrical insulation,
          এবং resistive material-এর physical support দেয়।
        </p>
        <p>
          এই কারণেই simulator structure-কে highlight করে, শুধু number-কে নয়।
          ভালো resistor behavior internal body-এর উপরও নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="Material choice কীভাবে behavior বদলায়" eyebrow="Material Science">
        <p>সব resistor material একইভাবে behave করে না।</p>
        <p>
          Carbon composition resistor পুরনো ধরনের, এবং তাপে বেশি noise ও বেশি
          drift দেখাতে পারে।
        </p>
        <p>
          Metal film resistor সাধারণত বেশি precise, বেশি stable, এবং
          accuracy-focused application-এর জন্য ভালো।
        </p>
        <p>
          Wire-wound resistor power handling আর heat tolerance-এ শক্তিশালী,
          কিন্তু এর structure অন্য practical effect যেমন inductive behavior
          introduce করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Heat কেন resistor performance বদলায়" eyebrow="Thermal Logic">
        <p>
          Resistor electrical energy-এর একটি অংশ heat-এ convert করে, তাই
          temperature resistor behavior-এর স্বাভাবিক অংশ।
        </p>
        <p>
          Temperature বাড়লে material এবং তার temperature coefficient-এর উপর
          নির্ভর করে resistance shift করতে পারে।
        </p>
        <p>
          এই কারণেই simulator material, temperature, current, আর power-কে
          একসাথে দেখায়, আলাদা আলাদা concept হিসেবে নয়।
        </p>
      </SectionCard>

      <SectionCard title="Power handling structure-এর উপর কেন নির্ভর করে" eyebrow="Safe Operation">
        <p>
          Power handling শুধু printed rating নয়। এটি অনেকটাই নির্ভর করে
          resistor কীভাবে physically built হয়েছে এবং heat কীভাবে manage করে।
        </p>
        <p>
          যে structure heat ভালোভাবে handle করতে পারে, সেটি বেশি সময় stable
          থাকতে পারে। দুর্বল structure drift করতে পারে, overheat করতে পারে,
          বা stress বেশি হলে fail করতে পারে।
        </p>
        <p>
          তাই resistor structure সরাসরি reliability এবং safety-কে প্রভাবিত
          করে।
        </p>
      </SectionCard>

      <SectionCard title="Structure visual করলে শেখা সহজ হয় কেন" eyebrow="Learning Value">
        <p>
          অনেক student formula পড়ার চেয়ে internal build দেখলে resistor theory
          দ্রুত বুঝতে পারে।
        </p>
        <p>
          Cutaway বা exploded view একসাথে তিনটি idea connect করতে সাহায্য করে:
          physical construction, electrical resistance, এবং heat flow।
        </p>
        <p>
          তাই এই lesson শুধু numeric slider exercise না হয়ে structure mode আর
          material comparison ব্যবহার করে।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner misunderstanding" eyebrow="Watch Out">
        <p>
          একই ohm value-এর সব resistor সব situation-এ একরকম behave করবে, এমন
          ভাবা যাবে না।
        </p>
        <p>
          Accuracy, noise, বা heat tolerance গুরুত্বপূর্ণ হলে material type
          ignore করা যাবে না।
        </p>
        <p>
          আর resistor-এর body শুধু packaging, এমনও ভাবা যাবে না। এর structure
          stability, durability, আর thermal performance-এর উপর প্রভাব ফেলে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>রেজিস্টরের একটি real internal structure থাকে, শুধু ohm label নয়।</li>
          <li>Resistive element-এ electrical opposition তৈরি হয়।</li>
          <li>Core এবং body support, insulation, আর heat behavior-এ সাহায্য করে।</li>
          <li>Material choice precision, drift, noise, আর power handling বদলায়।</li>
          <li>Temperature এবং structure real-world performance-এ বড় প্রভাব ফেলে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে structure lesson-এর core idea ঝালাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
