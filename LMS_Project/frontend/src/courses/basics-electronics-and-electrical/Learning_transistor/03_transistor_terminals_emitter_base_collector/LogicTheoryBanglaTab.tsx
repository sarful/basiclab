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
      question: "একটি transistor-এর তিনটি terminal কী কী?",
      answer:
        "এগুলো হলো emitter, base, এবং collector, যেগুলোকে সাধারণত E, B, এবং C নামে লেখা হয়।",
    },
    {
      question: "Emitter-এর প্রধান কাজ কী?",
      answer:
        "Emitter transistor action-এর মধ্যে charge carrier supply করে।",
    },
    {
      question: "Base-কে control terminal বলা হয় কেন?",
      answer:
        "কারণ একটি ছোট base current বা base control signal অনেক বড় collector current-কে influence করতে পারে।",
    },
    {
      question: "Collector-এর প্রধান দায়িত্ব কী?",
      answer:
        "Collector carrier gather করে এবং output বা load current বহন করে।",
    },
    {
      question: "Transistor symbol-এ emitter arrow গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ arrow emitter terminal-এই থাকে, এবং এটি transistor type ও symbol direction convention বোঝাতে সাহায্য করে।",
    },
    {
      question: "এই lesson-এ NPN এবং PNP terminal behavior compare করা হয় কেন?",
      answer:
        "কারণ দুই ধরনের transistor-এই একই তিনটি terminal থাকে, কিন্তু carrier-flow direction এবং symbol orientation একদম একই নয়।",
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
              Transistor Terminals
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ transistor-এর তিনটি terminal নিয়ে আলোচনা করা হয়েছে এবং
              দেখানো হয়েছে কীভাবে প্রতিটি terminal transistor action-এ আলাদা ভূমিকা রাখে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল লক্ষ্য হলো emitter, base, এবং collector-কে পরিষ্কারভাবে চেনা,
              তাদের কাজ বোঝা, এবং সেই কাজকে transistor symbol ও current-flow idea-এর সাথে যুক্ত করা।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson transistor structure আর full transistor working operation-এর মাঝের গুরুত্বপূর্ণ bridge।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Emitter" value="E" tone="emerald" />
            <ValueCard label="Base" value="B" tone="amber" />
            <ValueCard label="Collector" value="C" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Transistor terminal আলাদা করে শেখা দরকার কেন?" eyebrow="Core Concept">
        <p>
          Learner যদি transistor-এর তিনটি terminal পরিষ্কারভাবে না বোঝে, তাহলে circuit ঠিকভাবে পড়া বা ব্যবহার করা কঠিন হবে।
        </p>

        <p>
          প্রতিটি terminal-এর electrical role আলাদা, তাই এগুলো গুলিয়ে ফেললে circuit understanding ভুল হয়ে যায়।
        </p>

        <p>
          এই কারণেই biasing বা switching-এ যাওয়ার আগে lesson-টি terminal-গুলোকে আলাদা করে বোঝায়।
        </p>
      </SectionCard>

      <SectionCard title="Emitter কী?" eyebrow="E Terminal">
        <p>
          Emitter হলো সেই terminal যেটি transistor action-এর মধ্যে charge carrier supply করে।
        </p>

        <p>
          Structure-এর দিক থেকে এটি সাধারণত সবচেয়ে heavily doped region-এর সাথে যুক্ত থাকে।
        </p>

        <p>
          Symbol পড়ার সময় emitter আরও গুরুত্বপূর্ণ, কারণ transistor-এর arrow সবসময় এই terminal-এ আঁকা হয়।
        </p>
      </SectionCard>

      <SectionCard title="Base কী?" eyebrow="B Terminal">
        <p>
          Base হলো transistor-এর control terminal।
        </p>

        <p>
          একটি ছোট base current বা base control signal অনেক বড় collector current-কে influence করতে পারে।
        </p>

        <p>
          এই কারণেই transistor control device হিসেবে এত useful - base ছোট হলেও এর control effect বড়।
        </p>
      </SectionCard>

      <SectionCard title="Collector কী?" eyebrow="C Terminal">
        <p>
          Collector হলো সেই terminal যা charge carrier gather করে এবং output বা load current বহন করে।
        </p>

        <p>
          এটি transistor operation-এর useful output side-এর সাথে যুক্ত।
        </p>

        <p>
          অনেক beginner circuit-এ visible load result collector path-এই দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="তিনটি terminal interchangeable নয় কেন?" eyebrow="Different Jobs">
        <p>
          Emitter, base, এবং collector - তিনটির কাজ এক নয়।
        </p>

        <p>
          একটি carrier supply করে, একটি control করে, আর একটি output result বহন করে।
        </p>

        <p>
          তাই terminal identification শুধু নাম জানা নয়; transistor behavior বোঝার মূল অংশ।
        </p>
      </SectionCard>

      <SectionCard title="Emitter arrow কী বোঝায়?" eyebrow="Symbol Reading">
        <p>
          Transistor symbol-এ arrow সবসময় emitter terminal-এ আঁকা হয়।
        </p>

        <p>
          এটি learner-কে দ্রুত emitter চেনাতে সাহায্য করে এবং NPN ও PNP symbol convention compare করতে সাহায্য করে।
        </p>

        <p>
          তাই arrow decorative কিছু নয়; transistor symbol-এর সবচেয়ে গুরুত্বপূর্ণ visual clue-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="NPN আর PNP এখানে compare করা হয় কেন?" eyebrow="Type Comparison">
        <p>
          NPN এবং PNP - দুই ধরনের transistor-এই emitter, base, collector terminal থাকে।
        </p>

        <p>
          তবে carrier-flow interpretation এবং symbol direction দুই ধরনের transistor-এ একদম একই নয়।
        </p>

        <p>
          এই comparison learner-কে বুঝতে সাহায্য করে যে সব transistor terminal একই direction logic-এ behave করে না।
        </p>
      </SectionCard>

      <SectionCard title="Terminal কীভাবে structure আর operation-কে যুক্ত করে?" eyebrow="Learning Link">
        <p>
          আগের lesson transistor-এর physical region নিয়ে আলোচনা করেছে।
        </p>

        <p>
          এই lesson দেখায় সেই region-গুলো real circuit এবং symbol-এ কীভাবে named terminal হিসেবে আসে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: emitter supply করে, base control করে, আর collector output result বহন করে। এই chain মনে রাখলে beginner transistor diagram পড়া অনেক সহজ হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>একটি transistor-এর তিনটি terminal আছে: emitter, base, collector।</li>
          <li>Emitter charge carrier supply করে।</li>
          <li>Base হলো control terminal।</li>
          <li>Collector output বা load current বহন করে।</li>
          <li>তিনটি terminal interchangeable নয়।</li>
          <li>Emitter arrow transistor symbol-এর গুরুত্বপূর্ণ clue।</li>
          <li>NPN এবং PNP-এ terminal name একই হলেও direction convention পুরোপুরি একই নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
