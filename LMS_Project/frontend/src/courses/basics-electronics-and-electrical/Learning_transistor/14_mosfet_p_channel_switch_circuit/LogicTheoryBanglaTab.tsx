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
      question: "এই PMOS switch lesson-এর মূল ধারণা কী?",
      answer:
        "এখানে দেখানো হয়েছে কীভাবে একটি P-channel MOSFET high-side switch হিসেবে কাজ করে, যাতে load-এর positive supply path electronically control করা যায়।",
    },
    {
      question: "এটিকে high-side switch বলা হয় কেন?",
      answer:
        "কারণ PMOS-টি load-এর supply side-এ বসানো থাকে এবং LED branch-এ positive voltage যাবে কি না তা control করে।",
    },
    {
      question: "এই circuit-এ PMOS turn on হয় কীভাবে?",
      answer:
        "Gate-কে source-এর তুলনায় যথেষ্ট নিচে pull করতে হয়, যাতে VGS যথেষ্ট negative হয়ে PMOS turn-on requirement cross করে।",
    },
    {
      question: "এখানে pull-up resistor কেন গুরুত্বপূর্ণ?",
      answer:
        "Control switch open থাকলে এটি gate-কে source voltage-এর কাছাকাছি ধরে রাখে, ফলে PMOS safely OFF state-এ থাকে।",
    },
    {
      question: "এই lesson, NMOS low-side switch lesson থেকে আলাদা কীভাবে?",
      answer:
        "এখানে circuit position আর gate rule উল্টো: PMOS high side-এ থাকে এবং source-এর তুলনায় negative VGS পেলে turn on হয়।",
    },
    {
      question: "Gate voltage-এর চেয়ে VGS এখনও বেশি গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ PMOS behavior gate voltage relative to source voltage-এর উপর নির্ভর করে, শুধু gate-এর absolute number-এর উপর নয়।",
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
              PMOS High-Side Switch Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ দেখানো হয়েছে কীভাবে একটি P-channel MOSFET practical
              high-side switch হিসেবে LED load-এর positive supply path control
              করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই circuit MOSFET theory-কে real application-এর সাথে যুক্ত করে:
              battery, pull-up resistor, control switch, PMOS gate, আর LED branch
              একসাথে কাজ করে একটি electronic switching system তৈরি করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই lesson 14 আগের NMOS low-side switch lesson-এর practical
              counterpart হিসেবে কাজ করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Switch Type" value="PMOS High-Side" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="Negative VGS" tone="violet" />
            <ValueCard label="Load Control" value="Supply Path" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="এই project কী শেখাচ্ছে?" eyebrow="Practical Goal">
        <p>
          এই project শেখায় কীভাবে একটি PMOS ground-return path-এর বদলে
          positive supply path-এ practical switch হিসেবে কাজ করতে পারে।
        </p>

        <p>
          এই lesson-এ PMOS ঠিক করে LED branch battery থেকে supply voltage
          পাবে কি না।
        </p>

        <p>
          এর মাধ্যমে learner বুঝতে পারে যে circuit-এর প্রয়োজন অনুযায়ী MOSFET
          switching load-এর দুই পাশ থেকেই design করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে high-side switching বলা হয় কেন?" eyebrow="Circuit Position">
        <p>
          PMOS-টি load-এর supply side-এ বসানো থাকে, অর্থাৎ LED এবং resistor
          branch-এর ওপরে।
        </p>

        <p>
          এর মানে transistor-টি control করে positive voltage load path-এ
          যাবে কি না।
        </p>

        <p>
          এই arrangement-কে high-side switching বলা হয়, এবং এটি P-channel
          MOSFET control-এর একটি natural application।
        </p>
      </SectionCard>

      <SectionCard title="Control switch বন্ধ হলে কী হয়?" eyebrow="Gate Pull-Down Action">
        <p>
          যখন control switch বন্ধ হয়, gate নিচের দিকে, অর্থাৎ ground-এর দিকে
          pull হয়।
        </p>

        <p>
          PMOS-এর source battery voltage-এর কাছাকাছি থাকায় এতে gate-source
          voltage আরও negative হয়ে যায়।
        </p>

        <p>
          একবার VGS যথেষ্ট negative হলে PMOS turn on হয় এবং battery supply
          LED branch-এ connect করে।
        </p>
      </SectionCard>

      <SectionCard title="Control switch open হলে কী হয়?" eyebrow="Safe OFF State">
        <p>
          যখন control switch open হয়, gate-কে low-তে টানার direct path
          সরিয়ে যায়।
        </p>

        <p>
          তখন pull-up path gate-কে source voltage-এর কাছাকাছি ফিরিয়ে আনে,
          ফলে VGS আর যথেষ্ট negative থাকে না PMOS-কে ON রাখার জন্য।
        </p>

        <p>
          এতে PMOS আবার OFF state-এ ফিরে যায় এবং load branch থেকে supply
          power কেটে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Pull-up resistor এত গুরুত্বপূর্ণ কেন?" eyebrow="Gate Stability">
        <p>
          PMOS gate floating রাখা উচিত নয়, কারণ floating gate charge store
          করতে পারে এবং unpredictable switching তৈরি করতে পারে।
        </p>

        <p>
          Pull-up resistor control switch open থাকলে gate-কে source voltage-এর
          কাছাকাছি ধরে রাখে।
        </p>

        <p>
          এতে circuit একটি stable এবং safe default OFF condition পায়।
        </p>
      </SectionCard>

      <SectionCard title="LED resistor এখনও matter করে কেন?" eyebrow="Load Protection">
        <p>
          PMOS ঠিক করে supply LED branch-এ পৌঁছাবে কি না, কিন্তু এটি নিজে
          current-কে safe value-এ limit করে না।
        </p>

        <p>
          LED resistor এখনও current-কে practical operating level-এ set করে।
        </p>

        <p>
          এতে learner মনে রাখে যে switching control আর current limiting দুইটি
          আলাদা circuit function।
        </p>
      </SectionCard>

      <SectionCard title="VGS-ই আসল PMOS control variable কেন?" eyebrow="Gate-Source Logic">
        <p>
          PMOS শুধু gate কোনো নির্দিষ্ট voltage number-এ আছে বলে turn on হয় না।
        </p>

        <p>
          এটি turn on হয় তখন, যখন gate source-এর তুলনায় যথেষ্ট নিচে নামে,
          অর্থাৎ VGS যথেষ্ট negative হয়।
        </p>

        <p>
          এই lesson learner-কে absolute gate voltage-এর বদলে relative
          gate-source term-এ চিন্তা করতে প্রশিক্ষণ দেয়।
        </p>
      </SectionCard>

      <SectionCard title="ON অবস্থায় current path কীভাবে কাজ করে?" eyebrow="Complete Loop">
        <p>
          PMOS ON থাকলে current battery থেকে PMOS হয়ে, LED resistor হয়ে,
          LED-এর মধ্য দিয়ে, তারপর ground-এ যেতে পারে।
        </p>

        <p>
          PMOS OFF থাকলে positive supply path ভেঙে যায়, ফলে LED branch power
          পায় না।
        </p>

        <p>
          এই কারণে LED high-side switching behavior-এর একটি clear visual
          indicator হয়ে ওঠে।
        </p>
      </SectionCard>

      <SectionCard title="এটি আগের NMOS lesson থেকে কীভাবে আলাদা?" eyebrow="High Side vs Low Side">
        <p>
          আগের lesson-এ N-channel MOSFET low side-এ ছিল, যেখানে transistor
          ground-return path control করত।
        </p>

        <p>
          এই lesson-এ P-channel MOSFET high side-এ আছে, যেখানে transistor
          positive supply path control করে।
        </p>

        <p>
          দুটি lesson একসাথে learner-কে circuit position, polarity rule, আর
          switching logic দুই transistor type-এ compare করতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          এই circuit বোঝার সবচেয়ে সহজ উপায় হলো একটি logic chain follow করা।
        </p>

        <p>
          Control switch বন্ধ হয়, gate low-তে pull হয়, VGS negative হয়, PMOS
          turn on হয়, supply load branch-এ পৌঁছে যায়, আর LED জ্বলে ওঠে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি PMOS high-side switch gate voltage-কে high
          source node-এর তুলনায় ব্যবহার করে positive supply path control করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>এই lesson-এ একটি P-channel MOSFET high-side switch হিসেবে ব্যবহৃত হয়েছে।</li>
          <li>PMOS control করে supply voltage LED branch-এ পৌঁছাবে কি না।</li>
          <li>Control switch বন্ধ করলে gate low হয় এবং VGS negative হয়।</li>
          <li>Pull-up resistor gate-কে source-এর কাছে রেখে safe OFF state তৈরি করে।</li>
          <li>LED resistor current limit করে, আর PMOS switching control করে।</li>
          <li>PMOS turn-on gate voltage relative to source-এর উপর নির্ভর করে।</li>
          <li>এই lesson, NMOS low-side lesson-এর practical high-side counterpart।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
