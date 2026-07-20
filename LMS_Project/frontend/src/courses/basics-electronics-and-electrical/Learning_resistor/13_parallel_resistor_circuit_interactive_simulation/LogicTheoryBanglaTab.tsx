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
      question: "Parallel circuit-এ voltage-এর main rule কী?",
      answer:
        "প্রতিটি parallel branch-এর across একই voltage থাকে।",
    },
    {
      question: "Parallel circuit-এ total current-এর কী হয়?",
      answer:
        "Total current branch-গুলোর মধ্যে split হয় এবং সব branch current-এর যোগফল total current-এর সমান হয়।",
    },
    {
      question: "Parallel-এ নতুন branch যোগ করলে equivalent resistance-এর কী হয়?",
      answer:
        "Equivalent resistance আরও ছোট হয়ে যায়।",
    },
    {
      question: "একটি branch open হলে কি parallel circuit-এর সব current বন্ধ হয়ে যায়?",
      answer:
        "না। অন্য branch-গুলো এখনও current carry করতে পারে।",
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
              প্যারালাল রেজিস্টর সার্কিট
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Parallel resistor circuit-এ একাধিক resistor একই দুইটি supply
              node-এর across আলাদা current path-এ connected থাকে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা দেখব কেন সব branch একই voltage share করে,
              current কীভাবে branch-গুলোর মধ্যে split হয়, এবং কেন parallel
              branch বাড়ালে equivalent resistance ছোট হয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Rule" value="Same Voltage" tone="emerald" />
            <ValueCard label="Current" value="Splits by Branch" tone="sky" />
            <ValueCard label="Resistance" value="Req Gets Smaller" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Parallel resistor circuit কী" eyebrow="Foundation">
        <p>
          Parallel circuit-এ প্রতিটি resistor branch একই দুইটি supply point-এর
          across connected থাকে।
        </p>
        <p>
          এর মানে circuit-এ একটির বদলে multiple current path থাকে।
        </p>
        <p>
          এই structure-এর কারণেই parallel circuit series circuit-এর তুলনায়
          ভিন্ন set of rules follow করে।
        </p>
      </SectionCard>

      <SectionCard title="প্রতিটি branch-এ voltage একই কেন" eyebrow="Main Rule">
        <p>
          যেহেতু সব branch একই দুইটি node-এর across connected থাকে, তাই প্রতিটি
          branch একই supply voltage পায়।
        </p>
        <p>
          এখানে series resistor-এর মতো voltage branch-গুলোর মধ্যে ভাগ হয় না।
        </p>
        <p>
          এই same-voltage rule parallel circuit analysis-এর সবচেয়ে গুরুত্বপূর্ণ
          idea-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Parallel-এ current কীভাবে behave করে" eyebrow="Current Split">
        <p>
          Parallel circuit-এ current available branch-গুলোর মধ্যে split হয়।
        </p>
        <p>
          প্রতিটি branch তার own resistance অনুযায়ী current নেয়।
        </p>
        <p>
          Source থেকে আসা total current সব branch current-এর যোগফলের সমান।
        </p>
      </SectionCard>

      <SectionCard title="কম resistance branch বেশি current পায় কেন" eyebrow="Ohm's Law">
        <p>
          যেহেতু প্রতিটি branch একই voltage পায়, তাই Ohm&apos;s law অনুযায়ী কম
          resistance মানে বেশি branch current।
        </p>
        <p>
          Higher-resistance branch একই voltage-এর অধীনে কম current নেয়।
        </p>
        <p>
          এই কারণেই branch resistance equal না হলে current সমানভাবে split হয়
          না।
        </p>
      </SectionCard>

      <SectionCard title="Equivalent resistance কীভাবে কাজ করে" eyebrow="Equivalent Model">
        <p>
          Parallel branch-গুলোর equivalent resistance সবসময় সবচেয়ে ছোট
          individual branch resistance-এর চেয়েও ছোট হয়।
        </p>
        <p>
          নতুন branch যোগ হলে current flow-এর জন্য আরেকটি path তৈরি হয়, ফলে
          overall current flow সহজ হয়ে যায়।
        </p>
        <p>
          এই কারণেই parallel-এ branch যোগ করলে equivalent resistance কমে যায়।
        </p>
      </SectionCard>

      <SectionCard title="একটি branch open হলে কী হয়" eyebrow="Failure Behavior">
        <p>
          Parallel circuit-এ একটি branch open হলে সাধারণত পুরো circuit বন্ধ
          হয়ে যায় না।
        </p>
        <p>
          যে branch-গুলো connected থাকে, সেগুলো এখনও current carry করতে পারে।
        </p>
        <p>
          এটি parallel circuit এবং series circuit-এর মধ্যে একটি গুরুত্বপূর্ণ
          reliability difference।
        </p>
      </SectionCard>

      <SectionCard title="Simulator theory-কে কীভাবে দেখায়" eyebrow="Live Logic">
        <p>
          Lesson 13 simulator-এ আপনি resistor branch add, remove, এবং edit
          করতে পারেন।
        </p>
        <p>
          Branch value change করলে equivalent resistance, total current, এবং
          প্রতিটি branch current live update হয়।
        </p>
        <p>
          এতে same-voltage branch, current splitting, এবং reduced equivalent
          resistance action-এ দেখা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Parallel circuit useful কেন" eyebrow="Applications">
        <p>
          Parallel circuit useful যখন multiple load একই supply voltage দরকার
          হয়।
        </p>
        <p>
          এটি তখনও useful যখন একটি branch বন্ধ হলেও অন্য branch কাজ চালিয়ে
          যাবে।
        </p>
        <p>
          Practical circuit design এবং troubleshooting-এর জন্য parallel behavior
          বোঝা essential।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="Watch Out">
        <p>
          একটি common mistake হলো ভাবা parallel branch-গুলোর current একই হয়।
        </p>
        <p>
          আরেকটি mistake হলো branch বাড়ালে equivalent resistance বড় হবে মনে
          করা।
        </p>
        <p>
          Student-রা অনেক সময় ভুলে যায় branch current ভিন্ন হলেও সব branch-এর
          across voltage একই থাকে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Parallel circuit-এ multiple current path থাকে।</li>
          <li>প্রতিটি branch একই voltage পায়।</li>
          <li>Total current সব branch current-এর যোগফল।</li>
          <li>কম resistance branch বেশি current carry করে।</li>
          <li>Branch বাড়ালে equivalent resistance কমে যায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে parallel circuit-এর basic idea verify করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
