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
      question: "DC to DC SSR circuit কী?",
      answer:
        "DC to DC SSR circuit হলো এমন একটি circuit যেখানে DC control signal ব্যবহার করে solid state relay-এর মাধ্যমে DC load electronically switch করা হয়।",
    },
    {
      question: "Basic SSR lesson-এর পরে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এখানে দেখানো হয় কীভাবে SSR-এর ধারণা বাস্তব circuit-এ ব্যবহার হয়, যেখানে control side আর load side দুটিই DC based।",
    },
    {
      question: "এই lesson-এর মূল beginner idea কী?",
      answer:
        "Learner-এর বোঝা উচিত যে একটি ছোট DC control input electronically এবং isolation বজায় রেখে আলাদা DC load path control করতে পারে।",
    },
    {
      question: "এটি AC SSR discussion থেকে কীভাবে আলাদা?",
      answer:
        "এখানে focus হলো DC input থেকে DC output switching behavior-এর ওপর, AC load switching-এর ওপর নয়।",
    },
    {
      question: "DC to DC SSR circuit-এ isolation এখনও গুরুত্বপূর্ণ কেন?",
      answer:
        "Isolation low-power control side-কে load side থেকে আলাদা রাখে, কিন্তু control signal-কে switching command দিতে সাহায্য করে।",
    },
    {
      question: "Circuit view-এ learner-এর কী observe করা উচিত?",
      answer:
        "Learner-এর control input, internal SSR switching action, আর তার ফলে DC load path on বা off হওয়া - এই সম্পর্ক observe করা উচিত।",
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
              DC to DC SSR Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি solid state relay DC control
              signal ব্যবহার করে DC load circuit electronically switch করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো control side আর output side দুটোই DC
              based হলেও relay controlled switching আর isolation দেয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson SSR theory-কে practical DC control application-এর সাথে
              যুক্ত করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Side" value="DC Control" tone="emerald" />
            <ValueCard label="Output Side" value="DC Load" tone="violet" />
            <ValueCard label="Switching Style" value="Electronic" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="DC to DC SSR circuit কী?" eyebrow="Topic Overview">
        <p>
          DC to DC SSR circuit-এ direct current control signal ব্যবহার করে
          solid state switching-এর মাধ্যমে direct current load path control করা
          হয়।
        </p>

        <p>
          অর্থাৎ control side আর output load side দুটোই DC-তে কাজ করে, কিন্তু
          relay system-এর ভিতরে তারা functionalভাবে আলাদা থাকে।
        </p>

        <p>
          তাই এই lesson electronic DC load control-এর একটি practical form
          দেখায়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>
          আগের SSR lesson-গুলোতে SSR কী এবং internally কীভাবে কাজ করে তা শেখানো
          হয়েছে।
        </p>

        <p>
          এই lesson applied circuit example দেখায়, যাতে learner বাস্তব DC
          switching arrangement-এ সেই idea-গুলো দেখতে পারে।
        </p>

        <p>এটি theory আর real circuit usage-এর মধ্যে bridge তৈরি করে।</p>
      </SectionCard>

      <SectionCard title="Learner-এর প্রথমে কী দেখা উচিত?" eyebrow="Beginner Focus">
        <p>
          প্রথমে ছোট DC control input আর বড় DC load path-এর সম্পর্ক observe করা
          উচিত।
        </p>

        <p>Control signal-কে main load current সরাসরি বহন করতে হয় না।</p>

        <p>
          বরং এটি SSR-কে command দেয়, আর SSR electronically load switch করে।
        </p>
      </SectionCard>

      <SectionCard title="Isolation এখনও গুরুত্বপূর্ণ কেন?" eyebrow="Control Protection">
        <p>
          DC to DC SSR arrangement-এও isolation গুরুত্বপূর্ণ, কারণ low-power
          control section-কে load side থেকে protect রাখা দরকার।
        </p>

        <p>
          Direct high-current path share না করেও control signal switching-কে
          influence করতে পারে।
        </p>

        <p>এটাই SSR-based control-এর বড় advantage-গুলোর একটি।</p>
      </SectionCard>

      <SectionCard title="এটি AC SSR example থেকে কীভাবে আলাদা?" eyebrow="DC vs AC Focus">
        <p>
          AC SSR example-এ সাধারণত AC load side switching-এর ওপর বেশি focus
          করা হয়।
        </p>

        <p>
          এখানে context আলাদা, কারণ control side এবং output side দুটোই DC
          based।
        </p>

        <p>
          তবে মূল relay idea একই থাকে: isolation সহ electronic switching।
        </p>
      </SectionCard>

      <SectionCard title="Circuit view কী explain করতে সাহায্য করে?" eyebrow="Applied Observation">
        <p>
          Circuit view input command, internal switching action, আর output load
          response-কে একসাথে observe করতে সাহায্য করে।
        </p>

        <p>এতে lesson শুধু definition-এর মধ্যে সীমাবদ্ধ থাকে না, practical হয়।</p>

        <p>এটি দেখায় SSR theory কীভাবে actual load-control circuit হয়।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>সবচেয়ে সহজ rule হলো circuit-কে মনে মনে দুইটি side-এ ভাগ করা।</p>

        <p>
          একটি small DC input SSR-কে command দেয়, আর SSR তারপর DC load path
          control করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: DC to DC SSR circuit-এ low-power DC control
          signal electronically এবং safely আলাদা DC load switch করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DC to DC SSR circuit DC control দিয়ে DC load switch করে।</li>
          <li>Input আর output side দুটোই DC based।</li>
          <li>Control side electronically load-কে command দেয়।</li>
          <li>Isolation এখনও একটি গুরুত্বপূর্ণ relay advantage।</li>
          <li>এই lesson আগের SSR theory-কে real circuit-এ apply করে।</li>
          <li>Circuit view cause আর effect বুঝতে সাহায্য করে।</li>
          <li>মূল idea হলো SSR-এর মাধ্যমে electronic DC load switching।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
