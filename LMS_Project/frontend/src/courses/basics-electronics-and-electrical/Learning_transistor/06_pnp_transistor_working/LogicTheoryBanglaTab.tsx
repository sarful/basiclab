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
      question: "এই lesson-এ PNP transistor কীভাবে turn on হয়?",
      answer:
        "যখন base-কে emitter-এর তুলনায় যথেষ্ট নিচে নামানো হয়, তখন emitter-base junction forward-driven হয় এবং PNP transistor turn on করে।",
    },
    {
      question: "Switch open থাকলে transistor off থাকে কেন?",
      answer:
        "কারণ pull-up path base-কে emitter voltage-এর কাছাকাছি রাখে, ফলে VEB transistor turn on করার মতো বড় হয় না।",
    },
    {
      question: "এই PNP lesson আর NPN lesson-এর main difference কী?",
      answer:
        "এখানে high-side PNP control দেখানো হয়েছে, তাই switching logic উল্টো: base-কে নিচে টানলে transistor on হয়।",
    },
    {
      question: "এই simulation-এ active region কী?",
      answer:
        "Transistor on আছে এবং load current carry করছে, কিন্তু base drive এখনও full saturation-এর জন্য যথেষ্ট শক্তিশালী নয়।",
    },
    {
      question: "এখানে saturation কী?",
      answer:
        "Saturation হলো strong ON state, যেখানে PNP transistor LED load path-এ পুরোপুরি current supply করছে।",
    },
    {
      question: "Pull-up resistor গুরুত্বপূর্ণ কেন?",
      answer:
        "এটি switch open থাকলে base-কে emitter-এর কাছাকাছি রাখে, accidental turn-on আটকায় এবং transistor-কে off রাখে।",
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
              PNP Transistor Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি PNP transistor একটি simple LED load
              circuit-এ high-side switching device হিসেবে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো emitter-reference base control, collector load
              current, এবং cutoff, active, আর saturation state-এর মধ্যে পরিবর্তন।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson বিশেষভাবে useful, কারণ এটি learner-কে PNP working logic-কে
              NPN-এর opposite switching style-এর সাথে compare করতে সাহায্য করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="PNP" tone="emerald" />
            <ValueCard label="Switch Style" value="High Side" tone="violet" />
            <ValueCard label="Base Action" value="Pull Low" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="এই PNP lesson কী শেখাচ্ছে?" eyebrow="Core Concept">
        <p>
          এই lesson শেখায় কীভাবে একটি PNP transistor supply side থেকে load control করে, ground side থেকে নয়।
        </p>

        <p>
          অর্থাৎ এই transistor-টি simulation-এ high-side switch হিসেবে কাজ করছে, যা NPN low-side switch-এর সাথে গুরুত্বপূর্ণ practical contrast তৈরি করে।
        </p>

        <p>
          এই lesson learner-কে দেখায় transistor type বদলালে working logic-ও বদলে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Emitter supply side-এ থাকে কেন?" eyebrow="High-Side Setup">
        <p>
          এই lesson-এ emitter positive supply side-এর সাথে connected থাকে।
        </p>

        <p>
          এ কারণেই PNP transistor-কে এখানে high-side device হিসেবে দেখানো হয়েছে।
        </p>

        <p>
          Load current emitter side থেকে transistor পেরিয়ে LED branch-এ যায়।
        </p>
      </SectionCard>

      <SectionCard title="Switch open থাকলে কী হয়?" eyebrow="Cutoff State">
        <p>
          Switch open থাকলে pull-up path base-কে emitter voltage-এর কাছাকাছি রাখে।
        </p>

        <p>
          এই অবস্থায় emitter-base difference transistor-কে on করার মতো যথেষ্ট হয় না।
        </p>

        <p>
          ফলে transistor cutoff-এ থাকে এবং LED load off থাকে।
        </p>
      </SectionCard>

      <SectionCard title="Switch closed হলে কী হয়?" eyebrow="Base Pulled Low">
        <p>
          Switch closed হলে base base-resistor path দিয়ে নিচের দিকে pull হয়।
        </p>

        <p>
          এতে emitter-to-base drive condition বাড়ে, যা PNP transistor-কে on করতে দরকার।
        </p>

        <p>
          সহজভাবে বললে, এই lesson-এ base-কে low করা transistor conduction শুরু করে।
        </p>
      </SectionCard>

      <SectionCard title="Pull-up resistor গুরুত্বপূর্ণ কেন?" eyebrow="Stable OFF Logic">
        <p>
          Pull-up resistor control switch inactive থাকলে base-কে emitter-এর কাছাকাছি ধরে রাখে।
        </p>

        <p>
          এতে accidental turn-on আটকানো যায় এবং circuit একটি predictable OFF condition পায়।
        </p>

        <p>
          তাই pull-up resistor শুধু extra part নয়; এটি control logic-এর অংশ।
        </p>
      </SectionCard>

      <SectionCard title="এখানে active region কী?" eyebrow="Partial Conduction">
        <p>
          Active region-এ PNP transistor on আছে এবং load current carry করছে, কিন্তু base drive এখনও strongest conduction-এর জন্য যথেষ্ট নয়।
        </p>

        <p>
          এই state-এ LED branch কাজ করতে পারে, কিন্তু transistor এখনও strongest possible switch-এর মতো behave করছে না।
        </p>

        <p>
          এতে learner বোঝে transistor switching শুধু OFF আর fully ON - এই দুই state-এ সীমাবদ্ধ নয়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson-এ saturation কী?" eyebrow="Strong ON State">
        <p>
          Saturation হলো এই circuit-এ PNP transistor-এর strong ON state।
        </p>

        <p>
          এই অবস্থায় base drive এতটাই strong হয় যে transistor LED load path-এ intended full current supply করতে পারে।
        </p>

        <p>
          Circuit-কে reliable ON switch-এর মতো behave করাতে এটি switching goal।
        </p>
      </SectionCard>

      <SectionCard title="এটি NPN switching থেকে আলাদা কীভাবে?" eyebrow="Opposite Logic">
        <p>
          NPN lesson low-side switching শেখায়, যেখানে base drive lower side-এর path on করে।
        </p>

        <p>
          এই PNP lesson logic-কে উল্টোভাবে দেখায়: base-কে emitter-এর চেয়ে নিচে টানলে high-side transistor on হয়।
        </p>

        <p>
          এই contrast-ই পুরো topic-এর সবচেয়ে গুরুত্বপূর্ণ learning point-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="মূল working rule কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো একটি reversed control chain follow করা।
        </p>

        <p>
          Base up থাকলে transistor off, base down হলে transistor on, আর stronger base drive transistor-কে saturation-এর দিকে নিয়ে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি PNP transistor সবচেয়ে সহজে বোঝা যায় যখন মনে রাখা হয় যে এর switching logic simple NPN example-এর তুলনায় উল্টো অনুভূত হয়, বিশেষ করে high-side circuit-এ।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>এই lesson-এ PNP transistor high-side switch হিসেবে কাজ করে।</li>
          <li>Emitter positive supply side-এর কাছে থাকে।</li>
          <li>Switch open থাকলে base emitter-এর কাছে থাকে এবং transistor OFF থাকে।</li>
          <li>Switch closed হলে base নিচে pull হয় এবং transistor ON হয়।</li>
          <li>Pull-up resistor stable OFF condition তৈরি করতে সাহায্য করে।</li>
          <li>Active region মানে partial conduction, full saturation নয়।</li>
          <li>Saturation হলো LED load path-এর strong ON state।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
