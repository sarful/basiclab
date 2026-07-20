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
  const quizItems: QuizAccordionItem[] = [
    {
      question: "Relay working principle-এর মূল ধারণা কী?",
      answer:
        "একটি ছোট electrical signal relay coil-কে energize করে, magnetic force তৈরি করে, armature-কে move করায়, এবং contact-কে তার normal state থেকে পরিবর্তন করে।",
    },
    {
      question: "Relay-তে coil এত গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ coil-ই electromagnetic force তৈরি করে, যা armature-কে move করায় এবং contact-এর state change করতে সাহায্য করে।",
    },
    {
      question: "Armature কী কাজ করে?",
      answer:
        "Armature হলো moving mechanical part, যা magnetic field-এর response-এ নড়ে এবং সেই movement contact mechanism-এ transfer করে।",
    },
    {
      question: "Relay energized না থাকলে কী হয়?",
      answer:
        "Relay তার normal resting condition-এ থাকে, যেখানে COM default contact state অনুযায়ী connected থাকে, সাধারণত changeover relay-এ NC-এর সাথে।",
    },
    {
      question: "Coil energized হওয়ার পরে কী হয়?",
      answer:
        "Magnetic field armature-কে টানে, contact position change হয়, আর COM NC থেকে সরে NO-এর দিকে যায়।",
    },
    {
      question: "Relay part শেখার পরে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ learner part-এর নাম জানার পরে এই lesson দেখায় কীভাবে সেই part-গুলো একসাথে complete switching mechanism হিসেবে কাজ করে।",
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
              Relay Working Principle
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে relay electromagnetic force
              ব্যবহার করে resting contact state থেকে energized switching
              state-এ যায়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে সহজ beginner idea হলো: একটি ছোট coil-control signal relay-এর
              ভিতরে movement তৈরি করে, আর সেই movement contact path change করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই topic relay part-গুলোকে একটি complete working mechanism-এ
              পরিণত করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Control Source" value="Relay Coil" tone="emerald" />
            <ValueCard label="Moving Part" value="Armature" tone="violet" />
            <ValueCard label="Switch Result" value="NC to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="সহজভাবে relay working principle কী?" eyebrow="Core Idea">
        <p>
          Relay electrical energy ব্যবহার করে coil-এর মাধ্যমে magnetic effect
          তৈরি করে, যা mechanical switching part-কে move করায়।
        </p>

        <p>
          সেই movement contact path পরিবর্তন করে।
        </p>

        <p>
          তাই relay control-side electrical signal-কে contact-side switching
          action-এ পরিণত করে।
        </p>
      </SectionCard>

      <SectionCard title="Relay energized হওয়ার আগে কী হয়?" eyebrow="Normal State">
        <p>
          Normal resting state-এ relay coil energized থাকে না।
        </p>

        <p>
          Armature default position-এ থাকে, আর common terminal relay-এর normal
          contact arrangement অনুযায়ী connected থাকে।
        </p>

        <p>
          Beginner relay explanation-এ এই state-এ COM সাধারণত NC-এর উপর rest করে।
        </p>
      </SectionCard>

      <SectionCard title="Coil কী কাজ করে?" eyebrow="Electromagnetic Action">
        <p>
          Relay coil হলো সেই অংশ, যা control-এর জন্য electrical input নেয়।
        </p>

        <p>
          Coil-এর মধ্যে current flow করলে magnetic field তৈরি হয়।
        </p>

        <p>
          এই magnetic field-ই relay switching process শুরু করার force দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Armature কী করছে?" eyebrow="Mechanical Motion">
        <p>
          Armature হলো moving internal part, যা coil তৈরি করা magnetic field-এর
          response-এ নড়ে।
        </p>

        <p>
          Magnetic force যথেষ্ট শক্তিশালী হলে armature resting position থেকে
          টানা হয় বা move করে।
        </p>

        <p>
          এই movement-ই physicalভাবে relay contact change করে।
        </p>
      </SectionCard>

      <SectionCard title="Contact কীভাবে change হয়?" eyebrow="Switching Transition">
        <p>
          Armature move করলে common contact normal path থেকে energized path-এর
          দিকে shift করে।
        </p>

        <p>
          Common changeover explanation-এ coil energized হলে COM NC ছেড়ে NO-এর
          সাথে connect হয়।
        </p>

        <p>
          এই contact-change action relay-কে control circuit-এ useful করে তোলে।
        </p>
      </SectionCard>

      <SectionCard title="Coil power সরিয়ে নিলে কী হয়?" eyebrow="Return Motion">
        <p>
          Coil energized না থাকলে magnetic field collapse হয়ে যায়।
        </p>

        <p>
          তখন armature relay-এর spring action-এর সাহায্যে normal resting
          position-এ ফিরে যায়।
        </p>

        <p>
          এরপর contact-ও আবার default state-এ ফিরে আসে।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে electrically isolated switching বলা হয় কেন?" eyebrow="Control vs Load Separation">
        <p>
          Coil circuit আর contact circuit relay system-এর ভিতরে separate section।
        </p>

        <p>
          ছোট control-side signal relay-কে এমন আরেকটি circuit path switch
          করতে পারে, যেটি direct same electrical path share করছে না।
        </p>

        <p>
          এটাই relay-এর সবচেয়ে গুরুত্বপূর্ণ practical benefit-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Timeline-based learning useful কেন?" eyebrow="Step-by-Step View">
        <p>
          Relay switching একটি sequence-এ ঘটে: rest state, coil energizing,
          armature motion, contact change, আর final switched state।
        </p>

        <p>
          Timeline learner-কে বুঝতে সাহায্য করে যে এটি একটি process, magic
          instant event নয়।
        </p>

        <p>
          এতে relay-কে mechanical আর electrical দুই angle থেকেই বোঝা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Relay part lesson-এর পরে এই lesson কেন গুরুত্বপূর্ণ?" eyebrow="Learning Progression">
        <p>
          আগের lesson relay part-এর নাম শেখায়।
        </p>

        <p>
          এই lesson দেখায় কীভাবে সেই part-গুলো একসাথে real switching behavior
          তৈরি করে।
        </p>

        <p>
          একসাথে এই দুই lesson relay বোঝার foundation তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          Relay working মনে রাখার সবচেয়ে সহজ উপায় হলো একটি simple chain follow করা।
        </p>

        <p>
          Coil energized হয়, magnetic force তৈরি হয়, armature move করে,
          contact change হয়, আর switched circuit path-এর state বদলে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: relay coil control signal-কে mechanical movement-এ
          বদলে electrical contact change করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Relay normal resting contact state দিয়ে শুরু হয়।</li>
          <li>Coil energized হলে magnetic force তৈরি হয়।</li>
          <li>Armature সেই force-এর response-এ move করা moving part।</li>
          <li>Armature movement contact connection change করে।</li>
          <li>Energizing-এর সময় COM NC থেকে NO-এর দিকে যেতে পারে।</li>
          <li>Power সরালে relay আবার normal state-এ ফিরে আসে।</li>
          <li>এই lesson relay part-গুলোকে complete switching system হিসেবে বোঝায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
