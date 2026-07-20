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
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300" />
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
      question: "ভোল্টেজ measure করতে probe কোথায় বসাতে হয়?",
      answer:
        "দুইটি test point-এর across বসাতে হয়, যেমন battery plus ও minus বা V+ ও GND.",
    },
    {
      question: "Voltage lesson-এ red lead-এর জন্য কোন jack ভুল?",
      answer:
        "10A current jack voltage measurement-এর জন্য ভুল এবং ঝুঁকিপূর্ণ setup.",
    },
    {
      question: "Negative DC reading সাধারণত কী বোঝায়?",
      answer:
        "সাধারণত probe polarity উল্টো হয়েছে, source AC হয়ে গেছে তা নয়.",
    },
    {
      question: "Battery আর mains outlet-এর mode family কি এক?",
      answer:
        "না. Battery DCV-তে measure হয়, আর mains-style outlet ACV-তে.",
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
              ভোল্টেজ মাপা
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              ভোল্টেজ মাপা মানে দুইটি পয়েন্টের মধ্যে electrical push কত আছে
              সেটা দেখা।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল beginner habit হলো: source চিনতে হবে, সঠিক
              voltage mode বেছে নিতে হবে, lead সঠিক jack-এ রাখতে হবে, তারপর
              দুইটি test point-এর across probe বসাতে হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Red Lead" value="VΩmA" tone="sky" />
            <ValueCard label="Wrong Jack Risk" value="10A" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="ভোল্টেজ measurement কী?" eyebrow="Core Concept">
        <p>
          Voltage measurement হলো দুইটি point-এর মধ্যে electrical potential
          difference check করা।
        </p>
        <p>
          সহজভাবে বললে, এক point থেকে অন্য point-এ কত electrical push আছে
          সেটাই আমরা দেখি।
        </p>
        <p>
          তাই voltage সবসময় <strong>across two points</strong> measure করা হয়।
          Current-এর মতো path কেটে series-এ meter বসানো হয় না।
        </p>
        <p>
          Battery plus ও minus, DC supply-এর V+ ও GND, অথবা AC source-এর L ও N
          হলো voltage measurement-এর common example.
        </p>
      </SectionCard>

      <SectionCard title="এটা কেন গুরুত্বপূর্ণ?" eyebrow="Why It Matters">
        <p>
          Real troubleshooting-এ voltage check অনেক সময় প্রথম practical test
          হয়।
        </p>
        <p>এটা দিয়ে আমরা যেমন প্রশ্নের উত্তর পাই:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Battery-তে এখনো usable voltage আছে কি?</li>
          <li>12V supply সত্যি 12V-এর কাছাকাছি দিচ্ছে কি?</li>
          <li>Outlet বা terminal-এ AC present আছে কি?</li>
          <li>Polarity ঠিক আছে, নাকি probe উল্টো ধরা হয়েছে?</li>
        </ul>
        <p>
          Source-এই যদি voltage না থাকে, তাহলে circuit-এর পরের behaviour বোঝা
          কঠিন হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard
        title="Circuit ছোঁয়ার আগে meter setup logic"
        eyebrow="Setup Rules"
      >
        <p>
          <strong>Black lead:</strong> COM-এ থাকবে।
        </p>
        <p>
          <strong>Red lead:</strong> সাধারণ voltage jack, অর্থাৎ VΩmA-তে
          থাকবে।
        </p>
        <p>
          <strong>Dial family:</strong> battery ও DC supply-এর জন্য DCV, আর
          mains-style AC source-এর জন্য ACV বেছে নিতে হবে।
        </p>
        <p>
          <strong>Probe placement:</strong> যে দুই point compare করতে চাই,
          তাদের across probe বসাতে হবে।
        </p>
        <p>
          Dial, jack, আর probe placement মিললে তবেই meter beginner-কে সঠিক
          শিক্ষা দেয়।
        </p>
      </SectionCard>

      <SectionCard title="DC voltage আর AC voltage" eyebrow="Mode Selection">
        <p>
          <strong>9V battery</strong> এবং <strong>12V DC supply</strong> হলো
          DC source, তাই meter-এ DC voltage range নিতে হবে।
        </p>
        <p>
          <strong>220V AC demo source</strong> হলো AC source, তাই AC voltage
          range নিতে হবে।
        </p>
        <p>
          ভুল family নিলে learner ভুল habit তৈরি করে। Battery ACV-তে check
          করা ঠিক না, আর mains-style AC source DCV-তে check করা ঠিক না।
        </p>
        <p>
          এই lesson source চিনে mode family match করার অভ্যাস তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="Reading কীভাবে বুঝবে?" eyebrow="Reading Logic">
        <p>
          Setup ঠিক থাকলে আর probe সঠিক দুই point-এ থাকলে meter display voltage
          difference দেখাবে।
        </p>
        <p>
          এই training scenario-তে battery প্রায় <strong>9.0V</strong>, DC
          supply প্রায় <strong>12.0V</strong>, আর AC demo source প্রায়{" "}
          <strong>220V</strong> দেখায়।
        </p>
        <p>
          DC measurement-এ probe উল্টো ধরলে reading negative হতে পারে। এই
          negative sign useful, কারণ এটা polarity reverse হয়েছে সেটা জানায়।
        </p>
        <p>
          দুই probe যদি একই node-এ থাকে, তাহলে reading প্রায় zero হবে, কারণ
          একই point-এর সাথে একই point-এর voltage difference প্রায় নেই।
        </p>
      </SectionCard>

      <SectionCard title="যে ভুলগুলো এড়াতে হবে" eyebrow="High Priority">
        <p>
          Voltage test করার সময় red lead <strong>10A</strong> jack-এ রাখা যাবে
          না।
        </p>
        <p>
          Voltage mode আর current mode এক জিনিস না। Current measurement-এর setup
          আলাদা।
        </p>
        <p>
          AC source measure করার আগে ACV range verify না করে তাড়াহুড়ো করা ঠিক
          না।
        </p>
        <p>
          Beginner safety-এর সবচেয়ে ভালো rule হলো: dial check করো, jack check
          করো, probe target check করো, তারপর circuit touch করো।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage দুইটি point-এর across measure করা হয়।</li>
          <li>এই lesson-এ black lead COM-এ থাকে।</li>
          <li>Red lead VΩmA jack-এ থাকে।</li>
          <li>DC source-এর জন্য DCV, AC source-এর জন্য ACV লাগে।</li>
          <li>Negative DC reading সাধারণত probe reverse বোঝায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের short question-গুলো দিয়ে lesson-এর main idea যাচাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
