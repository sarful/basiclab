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
      question: "সহজ ভাষায় enhancement MOSFET কী?",
      answer:
        "এটি এমন একটি MOSFET, যেখানে useful conduction channel তৈরি করতে threshold-এর ওপরে যথেষ্ট gate voltage দরকার হয়।",
    },
    {
      question: "Threshold voltage-এর নিচে কী হয়?",
      answer:
        "MOSFET off থাকে, কারণ conductive channel এখনও যথেষ্ট শক্তভাবে তৈরি হয় না।",
    },
    {
      question: "এই lesson-এ threshold-কে আলাদা region হিসেবে দেখানো হয়েছে কেন?",
      answer:
        "কারণ এটি learner-কে দেখায় MOSFET ঠিক কোন transition point-এ off behavior থেকে conduction-এর দিকে যেতে শুরু করে।",
    },
    {
      question: "এখানে channel formation বলতে কী বোঝায়?",
      answer:
        "এতে বোঝায় gate field এতটা strong হচ্ছে যে drain আর source-এর মধ্যে একটি useful conduction path তৈরি হতে শুরু করছে।",
    },
    {
      question: "Linear region কী?",
      answer:
        "MOSFET on আছে এবং controllable channel দিয়ে conduct করছে, যখন drain voltage এখনও saturation-region boundary-এর নিচে থাকে।",
    },
    {
      question: "এই enhancement MOSFET lesson-এ saturation region কী?",
      answer:
        "এটি সেই region যেখানে drain-voltage condition gate overdrive দ্বারা নির্ধারিত boundary cross করে, ফলে channel আর simple linear case-এর মতো behave করে না।",
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
              Enhancement MOSFET Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি enhancement MOSFET তখনই turn on হয়,
              যখন যথেষ্ট gate voltage drain আর source-এর মধ্যে usable channel তৈরি করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো conduction ধাপে ধাপে develop হয়: OFF, threshold,
              channel formation, linear region, এবং saturation region।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson learner-কে simple OFF/ON explanation-এর চেয়ে আরও detailed
              MOSFET turn-on process বোঝায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="Enhancement MOSFET" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="VGS Above VTH" tone="violet" />
            <ValueCard label="Core Process" value="Channel Formation" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Enhancement MOSFET বিশেষ কেন?" eyebrow="Core Concept">
        <p>
          একটি enhancement MOSFET শুরু থেকেই strongly conducting channel নিয়ে ready থাকে না।
        </p>

        <p>
          Useful drain current flow করার আগে gate voltage-কে channel যথেষ্ট শক্তভাবে build করতে হয়।
        </p>

        <p>
          এই কারণেই এই topic-এ <em>enhancement</em> শব্দটি গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="OFF state-এ কী হয়?" eyebrow="No Channel">
        <p>
          OFF state-এ gate voltage useful channel formation-এর জন্য দরকারি threshold-এর নিচে থাকে।
        </p>

        <p>
          Channel properly formed না হওয়ায় practical use-এর জন্য drain current কার্যত থাকে না।
        </p>

        <p>
          এটি enhancement MOSFET-এর open-path condition।
        </p>
      </SectionCard>

      <SectionCard title="Threshold-কে আলাদা করে দেখানো হয় কেন?" eyebrow="Turn-On Boundary">
        <p>
          Threshold হলো সেই region যেখানে MOSFET off behavior থেকে সরে আসতে শুরু করে।
        </p>

        <p>
          এই region আলাদা করে দেখানো দরকার, কারণ এতে learner বুঝতে পারে turn-on gradual, instant নয়।
        </p>

        <p>
          এটি no useful channel এবং meaningful channel development-এর মাঝের প্রথম গুরুত্বপূর্ণ transition।
        </p>
      </SectionCard>

      <SectionCard title="Channel formation বলতে কী বোঝায়?" eyebrow="Developing Conduction">
        <p>
          Channel formation মানে gate field এতটা strong হচ্ছে যে drain আর source-এর মধ্যে একটি practical conduction path তৈরি হচ্ছে।
        </p>

        <p>
          Channel যত strong হয়, drain current তত সহজে flow করতে পারে।
        </p>

        <p>
          Enhancement MOSFET lesson-এর সবচেয়ে important visual idea-গুলোর একটি হলো এই channel formation।
        </p>
      </SectionCard>

      <SectionCard title="Linear region কী?" eyebrow="Controlled Channel Region">
        <p>
          Linear region-এ MOSFET-এর usable channel তৈরি হয়ে গেছে এবং device conduct করছে।
        </p>

        <p>
          এখানে drain-source path controllable conduction path-এর মতো behave করে, যখন drain-voltage condition এখনও saturation-region boundary-এর নিচে থাকে।
        </p>

        <p>
          Beginner-দের জন্য এটি practical switching region হিসেবে সহজে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson-এ saturation region কী?" eyebrow="Region Change">
        <p>
          Saturation region তখন আসে যখন drain-voltage condition gate overdrive-এর তুলনায় যথেষ্ট বড় হয়ে যায়।
        </p>

        <p>
          তখন MOSFET আর simple linear-region conduction case-এর মতো behave করে না।
        </p>

        <p>
          এটি learner-কে মনে করিয়ে দেয় যে MOSFET-এর region name শুধু ON/OFF বোঝায় না, বরং device কীভাবে operate করছে তা বোঝায়।
        </p>
      </SectionCard>

      <SectionCard title="Threshold voltage আর temperature দুটোই গুরুত্বপূর্ণ কেন?" eyebrow="Real Device Behavior">
        <p>
          Channel শুধু gate voltage-এর ওপর নির্ভর করে না; threshold setting এবং temperature-এর মতো device condition-ও গুরুত্বপূর্ণ।
        </p>

        <p>
          Temperature channel strength কমিয়ে দিতে পারে, আর threshold voltage ঠিক করে meaningful conduction কোথা থেকে শুরু হবে।
        </p>

        <p>
          এই কারণেই lesson-এ MOSFET-কে শুধু perfect switch symbol হিসেবে নয়, real device হিসেবে দেখানো হয়েছে।
        </p>
      </SectionCard>

      <SectionCard title="Drain voltage আর load কেন matter করে?" eyebrow="Circuit Interaction">
        <p>
          Gate signal strong হলেও MOSFET circuit-এর অন্য অংশগুলোর সাথে interact করে।
        </p>

        <p>
          Drain voltage এবং load resistance ঠিক করে actual drain current কতটা flow করতে পারবে।
        </p>

        <p>
          তাই final operating region device control আর external circuit condition - দুইটির ওপরই নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="মূল beginner rule কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো একটি sequence follow করা।
        </p>

        <p>
          Gate voltage বাড়ে, threshold cross হয়, channel form হয়, drain current বাড়ে, আর MOSFET তার operating region-গুলোর মধ্যে move করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি enhancement MOSFET-এ conduction path আগে থেকেই strongly ready থাকে না; gate voltage-কে সেই path যথেষ্ট strong করে তৈরি করতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Enhancement MOSFET-এ useful channel build করতে যথেষ্ট gate voltage দরকার।</li>
          <li>Threshold-এর নিচে MOSFET কার্যত off থাকে।</li>
          <li>Threshold meaningful turn-on behavior-এর শুরু।</li>
          <li>Channel formation মানে drain-source path usable হচ্ছে।</li>
          <li>Linear region হলো controllable channel-conduction region।</li>
          <li>Saturation region boundary cross করার পরের operating region।</li>
          <li>Temperature, threshold, drain voltage, আর load - সবই operation-কে প্রভাবিত করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
