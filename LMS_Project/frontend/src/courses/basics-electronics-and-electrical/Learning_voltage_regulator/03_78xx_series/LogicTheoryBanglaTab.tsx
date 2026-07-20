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
      question: "78xx family name-এর মানে সহজভাবে কী?",
      answer:
        "এটি positive fixed-voltage linear regulator-এর একটি series, যেখানে শেষের দুই digit সাধারণত output voltage বোঝায়, যেমন 7805 মানে 5 V।",
    },
    {
      question: "78xx series beginner-দের জন্য গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি simple fixed regulated output দেয় এবং practical circuit-এ standard three-terminal positive regulator কীভাবে ব্যবহার হয় তা পরিষ্কারভাবে শেখায়।",
    },
    {
      question: "78xx regulator-এ input, ground, আর output কী করে?",
      answer:
        "Input higher DC source নেয়, ground voltage reference দেয়, আর output load-এ fixed regulated voltage দেয়।",
    },
    {
      question: "7805 সবচেয়ে common example কেন?",
      answer:
        "কারণ 5 V small electronics আর digital circuit-এ খুব বেশি ব্যবহৃত হয়, তাই 7805 একটি সহজ এবং familiar teaching model হয়ে গেছে।",
    },
    {
      question: "সব 78xx regulator কি একই output voltage দেয়?",
      answer:
        "না। Family একই basic principle-এ কাজ করে, কিন্তু 7805, 7809, বা 7812-এর মতো model-গুলো different fixed output voltage-এর জন্য design করা।",
    },
    {
      question: "Linear regulator working শেখার পরে এই lesson useful কেন?",
      answer:
        "কারণ এটি linear regulation-এর general idea-কে বাস্তব regulator part family-র সাথে connect করে, যা actual circuit-এ ব্যবহার হয়।",
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
              78xx Series
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ 78xx family-এর fixed positive linear regulator-গুলো
              বোঝানো হয়েছে এবং কেন এই part-গুলো beginner-friendly voltage
              regulator example হিসেবে এত common তা explain করা হয়েছে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো: 78xx family standard fixed output
              voltage দেয় এবং familiar three-terminal regulator structure
              follow করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই topic learner-কে linear regulation-এর general idea থেকে
              real regulator part family-এর দিকে নিয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Family Type" value="Positive Fixed Regulator" tone="emerald" />
            <ValueCard label="Common Example" value="7805" tone="violet" />
            <ValueCard label="Pin Logic" value="IN-GND-OUT" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="78xx series কী?" eyebrow="Part Family">
        <p>
          78xx series হলো fixed positive linear voltage regulator-এর একটি
          family।
        </p>

        <p>
          এই part-গুলো specific regulated output voltage দেওয়ার জন্য design
          করা, যেমন 5 V, 9 V, বা 12 V, model number অনুযায়ী।
        </p>

        <p>
          এই কারণে 78xx family beginner-দের জন্য সবচেয়ে সহজ regulator
          family-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="শেষের দুই digit সাধারণত কী বোঝায়?" eyebrow="Model Naming">
        <p>
          Common beginner explanation-এ শেষের দুই digit সাধারণত intended fixed
          output voltage বোঝায়।
        </p>

        <p>
          উদাহরণ হিসেবে 7805 মানে 5 V output, 7809 মানে 9 V, আর 7812 মানে 12 V।
        </p>

        <p>
          এই naming pattern learner-কে part number আর target voltage-এর
          সম্পর্ক দ্রুত বুঝতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="78xx family learning-এ এত popular কেন?" eyebrow="Beginner Value">
        <p>
          78xx family সহজ কারণ এটি basic use-এর জন্য adjustment formula ছাড়াই
          fixed regulated voltage দেয়।
        </p>

        <p>
          ফলে beginner-রা আগে input, ground, output, আর regulation behavior
          বুঝতে পারে advanced design step-এর আগে।
        </p>

        <p>
          এটি theory থেকে practical part selection-এ যাওয়ার একটি পরিষ্কার bridge।
        </p>
      </SectionCard>

      <SectionCard title="78xx regulator linear regulator idea-র সাথে কীভাবে fit করে?" eyebrow="Working Principle">
        <p>
          78xx regulator-ও linear regulator হিসেবেই কাজ করে, অর্থাৎ এটি fixed
          target output value-এর কাছে output রাখার জন্য internal voltage drop
          control করে।
        </p>

        <p>
          তাই এই family কোনো নতুন regulation method নয়; বরং এটি linear
          regulation principle-এর বাস্তব part family।
        </p>

        <p>
          এই কারণেই lesson 3 lesson 2-এর natural continuation।
        </p>
      </SectionCard>

      <SectionCard title="Input, ground, আর output-এর মানে কী?" eyebrow="Three-Terminal Logic">
        <p>
          Input হলো যেখানে higher raw DC supply regulator-এ ঢোকে।
        </p>

        <p>
          Ground voltage reference দেয়, আর output fixed regulated voltage
          load-এ পাঠায়।
        </p>

        <p>
          এই same three-terminal logic অনেক 78xx-based circuit পড়া আর বানানো
          সহজ করে।
        </p>
      </SectionCard>

      <SectionCard title="7805 সবচেয়ে familiar example কেন?" eyebrow="Most Common Model">
        <p>
          7805 সবচেয়ে common কারণ 5 V small electronics, logic circuit, আর
          beginner project-এ খুব পরিচিত supply level।
        </p>

        <p>
          এই কারণে first regulator demonstration-এ 7805 সবচেয়ে বেশি use হয়।
        </p>

        <p>
          একবার এই model clear হয়ে গেলে পুরো 78xx family-কে pattern হিসেবে
          বোঝা সহজ হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="সব 78xx part কি একেবারে একইভাবে behave করে?" eyebrow="Family Similarity">
        <p>
          Family-র general concept একই: positive fixed linear regulation।
          তবে different model different output voltage value-এর জন্য intended।
        </p>

        <p>
          তাই working idea similar হলেও actual part choice circuit-এর প্রয়োজনীয়
          voltage-এর উপর নির্ভর করে।
        </p>

        <p>
          এতে learner family pattern এবং specific model number দুটোই ভাবতে শেখে।
        </p>
      </SectionCard>

      <SectionCard title="Physical package view useful কেন?" eyebrow="Real Component View">
        <p>
          Physical regulator package দেখলে abstract pin label-কে real
          component-এর সাথে connect করা সহজ হয়।
        </p>

        <p>
          Actual device-এ input, ground, আর output terminal কোনটা তা মনে রাখা
          symbol-এর তুলনায় আরও সহজ হয়।
        </p>

        <p>
          এতে lesson আরও practical এবং workshop-friendly হয়।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          78xx family বোঝার সবচেয়ে সহজ উপায় হলো একটি simple pattern মনে রাখা।
        </p>

        <p>
          এটি fixed positive regulator-এর একটি family, যা higher DC input নিয়ে
          simple three-pin structure-এর মাধ্যমে named fixed output দেয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: কোনো circuit যদি standard fixed positive DC
          voltage চায়, তাহলে 78xx regulator beginner-friendly starting point-গুলোর
          একটি।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>78xx series fixed positive linear regulator-এর একটি family।</li>
          <li>শেষের দুই digit সাধারণত fixed output voltage বোঝায়।</li>
          <li>এই part-গুলো lesson 2-এ শেখা linear regulation idea-ই ব্যবহার করে।</li>
          <li>তিনটি basic terminal হলো input, ground, আর output।</li>
          <li>7805 সবচেয়ে common beginner example।</li>
          <li>ভিন্ন 78xx model ভিন্ন fixed output voltage দেয়।</li>
          <li>এই lesson regulator theory-কে real part family আর package view-এর সাথে connect করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
