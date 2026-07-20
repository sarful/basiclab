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
      question: "Optocoupler pin আলাদা করে শেখা জরুরি কেন?",
      answer:
        "কারণ pin function বোঝা optocoupler ঠিকভাবে wiring করা এবং diagram পড়ার প্রথম practical step।",
    },
    {
      question: "কোন pin-গুলো সাধারণত input side-এর?",
      answer:
        "একটি common 4-pin optocoupler-এ Pin 1 এবং Pin 2 সাধারণত LED input side-এর pin।",
    },
    {
      question: "কোন pin-গুলো সাধারণত output side-এর?",
      answer:
        "Pin 4 এবং Pin 3 সাধারণত output transistor side-এর pin, যেখানে Pin 4 collector আর Pin 3 emitter হিসেবে ধরা হয়।",
    },
    {
      question: "Pin 1 সাধারণত কী কাজ করে?",
      answer:
        "Pin 1 সাধারণত internal LED-এর anode, যেখানে input current শুরু হয়।",
    },
    {
      question: "Pin 2 সাধারণত কী কাজ করে?",
      answer:
        "Pin 2 সাধারণত internal LED-এর cathode, যেখানে input current return করে।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ beginner takeaway কী?",
      answer:
        "Input pin-গুলো LED-কে drive করে, আর output pin-গুলো light-controlled transistor side-এর অংশ।",
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
              Optocoupler Pins
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ common optocoupler-এর pin function এবং কীভাবে pin-গুলো
              input side আর output side-এ ভাগ করা থাকে, তা বোঝানো হয়েছে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো LED side এবং transistor side
              আলাদা pin ব্যবহার করে আলাদা কাজ করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Pin layout শিখে নিলে optocoupler wiring অনেক সহজ এবং safe হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Pins" value="1 and 2" tone="emerald" />
            <ValueCard label="Output Pins" value="4 and 3" tone="violet" />
            <ValueCard label="Main Goal" value="Correct Wiring" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Pin আগে শেখা জরুরি কেন?" eyebrow="Practical Start">
        <p>
          Circuit-এ optocoupler ব্যবহার করার আগে learner-কে জানতে হবে কোন pin
          কোন internal section-এর অংশ।
        </p>

        <p>এটি না জানলে component ভুলভাবে connect করা খুব সহজ হয়ে যায়।</p>

        <p>
          তাই pin identification এই topic-এর প্রথম practical skill-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Pin-গুলো কীভাবে ভাগ করা থাকে?" eyebrow="Input vs Output">
        <p>
          একটি common 4-pin optocoupler-এ pin-গুলো সাধারণত দুইটি group-এ ভাগ
          করা থাকে।
        </p>

        <p>
          একটি group input LED side-এর, আর অন্য group output phototransistor
          side-এর।
        </p>

        <p>এই division optocoupler-এর দুইটি isolated half-কে reflect করে।</p>
      </SectionCard>

      <SectionCard title="Pin 1 এবং Pin 2 কী কাজ করে?" eyebrow="Input LED Side">
        <p>
          Pin 1 সাধারণত internal LED-এর anode এবং Pin 2 সাধারণত cathode।
        </p>

        <p>
          যখন input current Pin 1 থেকে Pin 2-তে flow করে, তখন LED on হয় এবং
          light emit করে।
        </p>

        <p>তাই এই দুইটি pin optocoupler-এর signal entry side তৈরি করে।</p>
      </SectionCard>

      <SectionCard title="Pin 4 এবং Pin 3 কী কাজ করে?" eyebrow="Output Side">
        <p>
          Pin 4 এবং Pin 3 সাধারণত phototransistor output side-এর অংশ।
        </p>

        <p>
          অনেক basic diagram-এ Pin 4-কে collector আর Pin 3-কে emitter হিসেবে
          দেখানো হয়।
        </p>

        <p>
          Input LED light পাঠালে এই pin-গুলোর output side response দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Pin order গুরুত্বপূর্ণ কেন?" eyebrow="Reading Diagrams">
        <p>
          Pin order গুরুত্বপূর্ণ কারণ circuit symbol, package drawing, আর real
          connection সবকিছুই সঠিক pin identification-এর ওপর নির্ভর করে।
        </p>

        <p>
          যদি learner LED side আর transistor side গুলিয়ে ফেলে, তাহলে circuit
          expected behavior দেখাবে না।
        </p>

        <p>ভালো pin reading habit basic design mistake কমায়।</p>
      </SectionCard>

      <SectionCard title="এই lesson optocoupler working-এর সাথে কীভাবে যুক্ত?" eyebrow="Concept Link">
        <p>
          আগের lesson-এ শেখানো হয়েছে যে optocoupler light-এর মাধ্যমে signal
          transfer করে।
        </p>

        <p>
          এই lesson সেই concept-এর practical detail যোগ করে, অর্থাৎ signal কোথা
          দিয়ে ঢোকে এবং controlled output কোথা দিয়ে বের হয়।
        </p>

        <p>এতে component-টি real circuit-এ আরও সহজে বোঝা যায়।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ rule হলো optocoupler-কে দুইটি isolated pair of pins হিসেবে
          ভাবা।
        </p>

        <p>
          Pin 1 এবং 2 LED input drive করে, আর Pin 4 এবং 3 output transistor
          side-এর অংশ।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: আগে input pair আর output pair চিনে নিন, তারপর
          optocoupler wiring অনেক clearer হয়ে যাবে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Pin শেখা optocoupler ব্যবহারের প্রথম practical step।</li>
          <li>Pin 1 এবং 2 সাধারণত LED input side-এর।</li>
          <li>Pin 4 এবং 3 সাধারণত transistor output side-এর।</li>
          <li>Pin 1 সাধারণত anode এবং Pin 2 cathode।</li>
          <li>Pin 4 সাধারণত collector এবং Pin 3 emitter।</li>
          <li>সঠিক pin identification wiring mistake কমায়।</li>
          <li>মূল idea হলো device-কে input pin আর output pin-এ ভাগ করে দেখা।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
