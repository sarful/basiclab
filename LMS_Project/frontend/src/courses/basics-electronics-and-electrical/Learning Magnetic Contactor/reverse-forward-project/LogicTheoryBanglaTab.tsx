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
      question: "Reverse-forward starter-এর উদ্দেশ্য কী?",
      answer:
        "এটি একই three-phase motor-কে forward বা reverse দুই দিকেই চালাতে দেয়, দুইটি আলাদা contactor path বেছে নিয়ে।",
    },
    {
      question: "Forward contactor কী কাজ করে?",
      answer:
        "Forward contactor motor-এ normal phase sequence পাঠায়, ফলে shaft forward direction-এ rotate করে।",
    },
    {
      question: "Reverse contactor কীভাবে direction পরিবর্তন করে?",
      answer:
        "এটি motor-এর আগে দুইটি phase swap করে, ফলে phase sequence বদলে যায় এবং rotation direction reverse হয়।",
    },
    {
      question: "K1 আর K2 interlock করা হয় কেন?",
      answer:
        "কারণ forward এবং reverse contactor কখনও একসাথে energized হওয়া যাবে না।",
    },
    {
      question: "Direction change করার আগে STOP function গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ নতুন direction apply করার আগে motor-কে safely drop-out করা উচিত, এতে unsafe switching ও mechanical stress কমে।",
    },
    {
      question: "Overload trip করলে কী হওয়া উচিত?",
      answer:
        "Active contactor release করবে, motor stop করবে, এবং fault clear না হওয়া পর্যন্ত control path blocked থাকবে।",
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
              Reverse-Forward Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি reverse-forward starter একই
              three-phase motor-কে forward বা reverse দুই direction-এ চালাতে পারে,
              আলাদা contactor path ব্যবহার করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো direction selection, phase-sequence change,
              holding logic, এবং interlocking যা forward ও reverse operation-কে
              একই সময়ে active হতে বাধা দেয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই lesson basic motor starting-এর পরের গুরুত্বপূর্ণ ধাপ, কারণ
              circuit এখন শুধু motor run করবে কি না তা নয়, কোন direction-এ run
              করবে সেটাও ঠিক করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Direction 1" value="Forward" tone="emerald" />
            <ValueCard label="Direction 2" value="Reverse" tone="violet" />
            <ValueCard label="Safety Rule" value="No Overlap" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Reverse-forward starter কেন দরকার?" eyebrow="Core Concept">
        <p>
          কিছু motor-driven machine-কে একাধিক direction-এ rotate করতে হয়।
        </p>

        <p>
          Reverse-forward starter একই motor-কে প্রতিবার manual rewiring ছাড়াই
          forward বা reverse চালানোর সুযোগ দেয়।
        </p>

        <p>
          Circuit control side থেকে দুইটি controlled path-এর একটি select করে,
          যাতে direction safely choose করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Forward path কী করে?" eyebrow="Forward Rotation">
        <p>
          Forward contactor, সাধারণত <strong>K1</strong>, motor-এ normal
          three-phase sequence পাঠায়।
        </p>

        <p>
          এই normal phase order apply হলে motor shaft forward direction-এ rotate করে।
        </p>

        <p>
          Machine-কে normal direction-এ চালানোর জন্য এটিই standard running path।
        </p>
      </SectionCard>

      <SectionCard title="Reverse path কী করে?" eyebrow="Reverse Rotation">
        <p>
          Reverse contactor, সাধারণত <strong>K2</strong>, motor-এর আগে দুইটি phase
          swap করে direction change করে।
        </p>

        <p>
          Three-phase motor-এ phase order পরিবর্তন করলে rotation direction-ও বদলে যায়।
        </p>

        <p>
          তাই reverse operation মানে motor-এর ভেতরে আলাদা action নয়, বরং একই motor-এ
          ভিন্ন phase sequence পৌঁছানো।
        </p>
      </SectionCard>

      <SectionCard title="Control circuit থেকে direction কীভাবে select হয়?" eyebrow="Control Logic">
        <p>
          Forward START command forward branch-কে energize করে, আর reverse START command reverse branch-কে energize করে।
        </p>

        <p>
          প্রতিটি branch-এর নিজস্ব contactor coil এবং holding path থাকে, যাতে selected direction push button ছেড়ে দেওয়ার পরও active থাকতে পারে।
        </p>

        <p>
          অর্থাৎ control circuit শুধু motor start করছে না, কোন direction branch active থাকবে সেটাও ঠিক করছে।
        </p>
      </SectionCard>

      <SectionCard title="Interlocking এত গুরুত্বপূর্ণ কেন?" eyebrow="No Simultaneous Direction">
        <p>
          Forward এবং reverse contactor কখনও একসাথে energized হওয়া যাবে না।
        </p>

        <p>
          যদি দুইটি branch একই সাথে close হয়, power circuit একটি severe fault condition-এ যেতে পারে।
        </p>

        <p>
          এই কারণেই reverse-forward starter interlocking logic ব্যবহার করে, যাতে একটি direction branch অন্যটিকে block করে।
        </p>
      </SectionCard>

      <SectionCard title="Electrical interlocking এখানে কী?" eyebrow="Branch Blocking">
        <p>
          প্রতিটি direction branch-এ opposite contactor-এর normally closed interlock contact থাকে।
        </p>

        <p>
          উদাহরণ হিসেবে, forward branch তখনই pass করতে পারে যখন reverse contactor-এর interlock closed থাকে; reverse branch-ও একইভাবে forward interlock closed থাকলে pass করতে পারে।
        </p>

        <p>
          এই electrical interlock নিশ্চিত করে যে একই সময়ে কেবল একটি direction command circuit-কে hold করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Reverse করার আগে motor stop করা উচিত কেন?" eyebrow="Safe Direction Change">
        <p>
          Safe direction change শুধু command select করার বিষয় নয়, sequence-এর বিষয়ও।
        </p>

        <p>
          Opposite direction apply করার আগে running path drop-out হওয়া উচিত।
        </p>

        <p>
          এতে unsafe switching stress কমে এবং motor ও connected machine-এর ওপর harsh mechanical shock এড়ানো যায়।
        </p>
      </SectionCard>

      <SectionCard title="Overload protection-এর ভূমিকা কী?" eyebrow="Motor Safety">
        <p>
          Overload protection motor current monitor করে এবং motor-কে overheating বা damage থেকে রক্ষা করে।
        </p>

        <p>
          Overload trip করলে active control path open হতে হবে এবং motor forward বা reverse যেকোনো direction-এই চলুক না কেন stop হতে হবে।
        </p>

        <p>
          ভালো protection logic direction-এর আগে motor safety-কে গুরুত্ব দেয়।
        </p>
      </SectionCard>

      <SectionCard title="এই project simple starter-এর তুলনায় বেশি advanced কেন?" eyebrow="Learning Progression">
        <p>
          Simple starter-এ circuit প্রধানত ON বা OFF ঠিক করে।
        </p>

        <p>
          Reverse-forward project-এ circuit-কে ON বা OFF, forward বা reverse, এবং safe বা unsafe sequence - সবই ভাবতে হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: reverse-forward control-কে direction-selection circuit হিসেবে বোঝা সবচেয়ে ভালো, যেখানে strict interlocking অপরিহার্য।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Reverse-forward starter একই motor-কে দুই direction-এ চালাতে দেয়।</li>
          <li>Forward path motor-এ normal phase sequence পাঠায়।</li>
          <li>Reverse path দুইটি phase swap করে rotation reverse করে।</li>
          <li>প্রতিটি direction branch-এর নিজস্ব contactor এবং holding logic থাকে।</li>
          <li>Forward এবং reverse কখনও একসাথে energized হওয়া যাবে না।</li>
          <li>Interlocking unsafe simultaneous direction command block করে।</li>
          <li>Overload protection যেকোনো direction-এ motor stop করতে পারে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
