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
      question: "Magnetic contactor-এ action কী দিয়ে শুরু হয়?",
      answer:
        "Coil দিয়েই action শুরু হয়। A1 এবং A2-তে সঠিক control voltage এলে coil magnetic pull তৈরি করে।",
    },
    {
      question: "Armature-এর ভূমিকা কী?",
      answer:
        "Armature হলো moving mechanical part, যা magnetic field দ্বারা টানা হয় এবং contacts-এর state পরিবর্তন করে।",
    },
    {
      question: "Return spring গুরুত্বপূর্ণ কেন?",
      answer:
        "Coil power remove হলে এটি contactor-কে তার normal de-energized state-এ ফিরিয়ে আনে।",
    },
    {
      question: "Main contacts কী করে?",
      answer:
        "এগুলো line side terminal-কে load side terminal-এর সাথে connect করে এবং main power current carry করে।",
    },
    {
      question: "Auxiliary contacts কী কাজে ব্যবহৃত হয়?",
      answer:
        "এগুলো control circuit-এ holding, interlocking, signaling, feedback, এবং logic function-এর জন্য ব্যবহৃত হয়।",
    },
    {
      question: "Coil voltage control circuit-এর সাথে match করা কেন জরুরি?",
      answer:
        "কারণ coil নির্দিষ্ট control voltage-এর জন্য design করা। mismatch হলে pull-in failure বা overheating হতে পারে।",
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
              Magnetic Contactor Anatomy
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Magnetic contactor হলো electrically controlled switching device,
              যা coil, iron core, armature, spring, এবং contact system ব্যবহার
              করে power circuit safely switch করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো main part-গুলো চিহ্নিত করা, তারা
              কীভাবে একসাথে কাজ করে তা বোঝা, এবং practical wiring-এ ব্যবহৃত
              terminal ও auxiliary contact marking চিনে নেওয়া।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Operation diagram, DOL control, star-delta control, এবং
              reverse-forward system-এর পরের lesson-গুলোর জন্য এটিই foundation।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Poles" value="3" tone="emerald" />
            <ValueCard label="Coil Terminals" value="A1 / A2" tone="violet" />
            <ValueCard label="Auxiliary Set" value="NO + NC" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Magnetic contactor কী?" eyebrow="Core Concept">
        <p>
          Magnetic contactor হলো heavy-duty switching device, যা motor এবং
          অন্যান্য power load control করতে ব্যবহৃত হয়।
        </p>

        <p>
          এটি low-power control circuit-এর মাধ্যমে higher-power main circuit-কে
          electromagnetic mechanism ব্যবহার করে switch করতে দেয়।
        </p>

        <p>
          এ কারণেই motor starter এবং industrial control panel-এ contactor খুব common।
        </p>
      </SectionCard>

      <SectionCard title="Anatomy-তে কোন কোন part থাকে?" eyebrow="Main Parts">
        <p>
          Main visible এবং functional part হলো coil, iron core, armature,
          return spring, main power contacts, auxiliary contacts, এবং terminal blocks।
        </p>

        <p>
          প্রতিটি part-এর আলাদা কাজ আছে, কিন্তু device ঠিকভাবে কাজ করে তখনই
          যখন এই part-গুলো একসাথে একটি system হিসেবে কাজ করে।
        </p>

        <p>
          Lesson 1-এর মূল লক্ষ্য হলো detailed operation lesson-এ যাওয়ার আগে
          এই part-গুলোকে clearly চিনে নেওয়া।
        </p>
      </SectionCard>

      <SectionCard title="Coil কী কাজ করে?" eyebrow="Electrical Input">
        <p>
          Coil হলো contactor-এর control input।
        </p>

        <p>
          <strong>A1</strong> এবং <strong>A2</strong> terminal-এর across সঠিক
          voltage প্রয়োগ করলে coil electromagnetic field তৈরি করে।
        </p>

        <p>
          এই magnetic field-ই contact state change করার mechanical action শুরু করে।
        </p>
      </SectionCard>

      <SectionCard title="Iron core এবং armature গুরুত্বপূর্ণ কেন?" eyebrow="Magnetic Action">
        <p>
          Iron core একটি strong magnetic path দেয়, আর armature হলো সেই moving
          part, যেটি magnetic force দ্বারা টানা হয়।
        </p>

        <p>
          Coil energize হলে armature core-এর দিকে move করে।
        </p>

        <p>
          এই movement-ই electrical control আর physical contact switching-এর
          মধ্যে bridge হিসেবে কাজ করে।
        </p>

        <p>
          <strong>
            Checkpoint Question: coil energize হলেও যদি armature move না করে,
            তাহলে contact switching action-এর কী হবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Return spring-এর কাজ কী?" eyebrow="Normal State">
        <p>
          Coil power remove হলে return spring moving mechanism-কে পিছনে ঠেলে দেয়।
        </p>

        <p>
          এর ফলে contactor তার normal de-energized condition-এ ফিরে আসে।
        </p>

        <p>
          Practical ক্ষেত্রে spring-ই contactor-এর safe default state define করে।
        </p>
      </SectionCard>

      <SectionCard title="Main contacts কী করে?" eyebrow="Power Switching">
        <p>
          Main contacts main load current carry করে।
        </p>

        <p>
          একটি typical three-pole contactor-এ এগুলো line side-এর{" "}
          <strong>L1, L2, L3</strong> terminal-কে load side-এর{" "}
          <strong>T1, T2, T3</strong> terminal-এর সাথে connect করে।
        </p>

        <p>
          এগুলোই motor এবং অন্যান্য high-current load switch করার power contacts।
        </p>
      </SectionCard>

      <SectionCard title="Auxiliary contacts useful কেন?" eyebrow="Control Logic">
        <p>
          Auxiliary contacts সাধারণত main motor current carry করে না।
        </p>

        <p>
          বরং এগুলো control circuit-এ holding circuit, interlocking,
          signaling, feedback, এবং logical control action-এর জন্য ব্যবহৃত হয়।
        </p>

        <p>
          A normally open auxiliary energization-এ close হয়, আর a normally
          closed auxiliary energization-এ open হয়।
        </p>
      </SectionCard>

      <SectionCard title="Terminal marking গুরুত্বপূর্ণ কেন?" eyebrow="Wiring Identity">
        <p>
          Terminal marking technician-কে সঠিক wiring এবং troubleshooting করতে সাহায্য করে।
        </p>

        <p>
          সাধারণত top side incoming line power নেয়, আর bottom side load-এর দিকে power পাঠায়।
        </p>

        <p>
          <strong>A1/A2</strong>, <strong>L1/L2/L3</strong>,{" "}
          <strong>T1/T2/T3</strong>, <strong>13-14 NO</strong>, এবং{" "}
          <strong>21-22 NC</strong> এর মতো standard label practical field work-এ খুব গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Contactor select করার আগে কী check করা উচিত?" eyebrow="Selection Basics">
        <p>
          Coil voltage অবশ্যই control supply-এর সাথে match করতে হবে।
        </p>

        <p>
          Contactor current rating এবং application category-কে actual load-এর
          সাথে match করতে হবে, বিশেষ করে AC-3 motor duty-এর ক্ষেত্রে।
        </p>

        <p>
          Auxiliary contact-এর সংখ্যা এবং exact terminal arrangement-ও control
          design-এর জন্য suitable হতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Magnetic contactor বোঝার সহজ উপায় হলো এটিকে একটি chain of action হিসেবে দেখা।
        </p>

        <p>
          Coil energize হয়, magnetic force তৈরি হয়, armature move করে,
          spring oppose করে, main contacts state change করে, এবং auxiliary
          contacts একই mechanism follow করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: যদি coil terminal, main line/load terminal, এবং
          auxiliary contact number জানা থাকে, তাহলে contactor-এর সবচেয়ে
          গুরুত্বপূর্ণ anatomy ইতিমধ্যেই বোঝা হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি motor starter panel-এ pushbutton বা control relay contactor
          coil-কে energize করতে পারে।
        </p>

        <p>
          তখন main contacts three-phase supply-কে motor-এর সাথে connect করে,
          আর auxiliary contacts holding এবং interlock logic handle করে।
        </p>

        <p>
          এই lesson আপনাকে practical control circuit আরও সহজে পড়তে প্রস্তুত করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Magnetic contactor হলো electrically controlled power switch।</li>
          <li>Coil হলো input, যা action শুরু করে।</li>
          <li>Core এবং armature magnetic force-কে motion-এ রূপান্তর করে।</li>
          <li>Return spring normal state restore করে।</li>
          <li>Main contacts line power-কে load-এ switch করে।</li>
          <li>Auxiliary contacts control logic এবং feedback-এর জন্য ব্যবহৃত হয়।</li>
          <li>Safe wiring ও troubleshooting-এর জন্য terminal marking অপরিহার্য।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
