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
      question: "Linear regulator working-এর মূল ধারণা কী?",
      answer:
        "একটি linear regulator output voltage-কে target-এর কাছে রাখতে regulator-এর ভেতরে কত voltage drop হবে তা continuously control করে।",
    },
    {
      question: "এটিকে linear regulator বলা হয় কেন?",
      answer:
        "কারণ regulating device সম্পূর্ণ ON বা OFF switch-এর মতো না থেকে controlled linear region-এ কাজ করে এবং smoothly extra voltage drop করতে পারে।",
    },
    {
      question: "Linear regulator ঠিকমতো regulate করার জন্য কী দরকার?",
      answer:
        "Input voltage-কে desired output-এর চেয়ে যথেষ্ট বেশি থাকতে হবে, যাতে regulator-এর ভেতরে control করার জন্য প্রয়োজনীয় headroom থাকে।",
    },
    {
      question: "Input একটু বদলালেও output stable থাকতে পারে কেন?",
      answer:
        "কারণ regulator তার internal voltage drop adjust করে load-এ প্রায় target output voltage বজায় রাখে।",
    },
    {
      question: "Linear regulation-এর practical cost কী?",
      answer:
        "Input আর output-এর extra voltage heat হিসেবে নষ্ট হয়, তাই voltage difference বা load current বেশি হলে efficiency কমে যেতে পারে।",
    },
    {
      question: "Lesson 1-এর পরে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি actual working behavior বোঝায়: input আসে, regulator drop control করে, আর load-এর জন্য output steady রাখে।",
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
              Linear Regulator Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি linear regulator output
              voltage steady রাখে, regulator-এর ভিতরে কত voltage drop হবে তা
              continuously control করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো: regulator raw input
              voltage সরাসরি load-এ পাঠায় না; এটি নিজেকে adjust করে output-কে
              target value-এর কাছাকাছি রাখে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই topic "regulator কী" থেকে এক ধাপ এগিয়ে "regulation
              বাস্তবে কীভাবে কাজ করে" সেটার উপর focus করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Action" value="Controlled Voltage Drop" tone="emerald" />
            <ValueCard label="Output Goal" value="Stable VOUT" tone="violet" />
            <ValueCard label="Tradeoff" value="Heat Loss" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Linear regulator আসলে কী করে?" eyebrow="Core Working Idea">
        <p>
          একটি linear regulator higher DC input নেয় এবং load-এর জন্য আরও
          stable output voltage দেওয়ার চেষ্টা করে।
        </p>

        <p>
          এটি নিজের internal conduction adjust করে extra voltage নিজের
          ভেতরেই drop করায়, যাতে সেই extra অংশ output-এ না পৌঁছায়।
        </p>

        <p>
          এটাই linear regulator working-এর central idea।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে 'linear' বলা হয় কেন?" eyebrow="Operating Region">
        <p>
          Linear শব্দটি ব্যবহার হয় কারণ regulating device simple fully-off বা
          fully-on switch-এর মতো না থেকে controlled partly-conducting state-এ
          কাজ করে।
        </p>

        <p>
          এতে regulator smoothly internal voltage drop change করতে পারে এবং
          output-কে target-এর কাছে রাখতে পারে।
        </p>

        <p>
          এই সুবিধার সঙ্গে একটি tradeoff-ও আছে: power heat হিসেবে নষ্ট হয়।
        </p>
      </SectionCard>

      <SectionCard title="Input কীভাবে regulated output হয়?" eyebrow="Input to Output Path">
        <p>
          Input voltage আগে regulator-এ ঢোকে, কিন্তু load সরাসরি সেই raw
          voltage পায় না।
        </p>

        <p>
          Regulator stable output-এর দরকার বুঝে নিজের উপর কত voltage drop
          হবে তা control করে, তারপর বাকি useful voltage output terminal-এ দেয়।
        </p>

        <p>
          তাই output হলো active control-এর result, direct transfer নয়।
        </p>
      </SectionCard>

      <SectionCard title="Input বদলালেও output steady থাকতে পারে কেন?" eyebrow="Regulation Action">
        <p>
          যদি input সামান্য বদলায়, regulator তার internal drop-ও adjust করতে
          পারে এবং output-কে required value-এর কাছাকাছি রাখতে পারে।
        </p>

        <p>
          ফলে raw supply-এর তুলনায় load একটি steadier voltage পায়।
        </p>

        <p>
          এটাই regulator practical electronics-এ useful হওয়ার বড় কারণগুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Regulator-এর extra input voltage দরকার কেন?" eyebrow="Headroom Requirement">
        <p>
          Input voltage যদি desired output-এর খুব কাছে নেমে আসে, তাহলে linear
          regulator আর ঠিকমতো regulate করতে পারে না।
        </p>

        <p>
          Regulator-এর এমন কিছু extra input দরকার হয়, যাতে তার internal
          voltage drop control করার জন্য যথেষ্ট headroom থাকে।
        </p>

        <p>
          এটাই beginner intuition for headroom এবং dropout behavior।
        </p>
      </SectionCard>

      <SectionCard title="Extra voltage কোথায় যায়?" eyebrow="Heat Dissipation">
        <p>
          Input আর output-এর extra voltage কোথাও হারিয়ে যায় না; linear
          regulator-এ এটি power loss হয়ে সাধারণত heat-এ পরিণত হয়।
        </p>

        <p>
          তাই voltage difference বেশি হলে বা load current বেশি হলে regulator
          আরও গরম হতে পারে।
        </p>

        <p>
          এটিই linear regulation-এর সবচেয়ে বড় practical tradeoff।
        </p>
      </SectionCard>

      <SectionCard title="Load এখনও গুরুত্বপূর্ণ কেন?" eyebrow="Load Interaction">
        <p>
          Regulator কখনও একা কাজ করে না; এটি সবসময় একটি load supply করে।
        </p>

        <p>
          Load current বদলালে regulator-কে এখনও output stable রাখতে হয়, সেই
          সঙ্গে internal power loss-ও manage করতে হয়।
        </p>

        <p>
          এই কারণেই real regulator behavior সবসময় circuit demand-এর সাথে
          যুক্ত, শুধু input voltage-এর সাথে নয়।
        </p>
      </SectionCard>

      <SectionCard title="Lesson 1-এর পরে এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>
          Lesson 1 regulator-এর purpose আর basic terminals বোঝায়।
        </p>

        <p>
          Lesson 2 actual working idea বোঝায়: regulator voltage drop actively
          control করে load-এর জন্য output stabilize করে।
        </p>

        <p>
          তাই এই lesson definition আর operation-এর মধ্যে bridge হিসেবে কাজ করে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          Linear regulator বোঝার সবচেয়ে সহজ উপায় হলো একটি simple flow কল্পনা করা।
        </p>

        <p>
          Higher input আসে, regulator extra difference নিজের মধ্যে absorb
          করে, আর circuit-এ steadier output পাঠায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি linear regulator extra voltage নিজের মধ্যে
          sacrifice করে, যাতে load আরও clean এবং stable output পায়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Linear regulator output voltage-কে target-এর কাছে রাখে।</li>
          <li>এটি raw input সরাসরি pass করে না; internal voltage drop control করে।</li>
          <li>ঠিকমতো regulate করতে input headroom দরকার হয়।</li>
          <li>Input সামান্য বদলালেও output steadier রাখা যায়।</li>
          <li>Extra voltage heat হিসেবে নষ্ট হয়।</li>
          <li>Load current গুরুত্বপূর্ণ, কারণ regulation real circuit demand-এর অধীনে ঘটে।</li>
          <li>এই lesson purpose নয়, actual operation বোঝায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
