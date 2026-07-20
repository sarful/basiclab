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
      question: "অপারেশন ডায়াগ্রামে মোটর যোগ করার মূল উদ্দেশ্য কী?",
      answer:
        "এটি দেখায় contactor-এর switching action-এর বাস্তব ফল কী হয়, অর্থাৎ তিন-ফেজ supply মোটরে পৌঁছায় কি না এবং মোটর চলে কি না।",
    },
    {
      question: "মোটর ঠিক কখন power পেতে শুরু করে?",
      answer:
        "মেইন contact সম্পূর্ণ close হওয়ার পর, যখন L1, L2, L3 থেকে মোটরের দিকে power path continuous হয়, তখনই মোটর supply পায়।",
    },
    {
      question: "Coil circuit আর motor circuit আলাদা রাখা হয় কেন?",
      answer:
        "কারণ coil হলো control circuit-এর অংশ, আর motor হলো main power circuit-এর load।",
    },
    {
      question: "T1, T2, T3 এই lesson-এ কোথায় যায়?",
      answer:
        "এগুলো motor side terminal-এ যায়, যেগুলো সাধারণত U, V, W নামে দেখানো হয়।",
    },
    {
      question: "Motor running আর stopped state দেখা গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এতে contactor-এর contact change আর বাস্তব machine behavior-এর মধ্যে সরাসরি সম্পর্ক বোঝা যায়।",
    },
    {
      question: "মোটর final load হলেও auxiliary contacts এখনও গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ holding, interlocking, feedback, এবং status logic-এর জন্য auxiliary contacts এখনও দরকার হয়।",
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
              Operation Diagram With Motor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ দেখানো হয় কীভাবে একটি magnetic contactor-এর switching action
              শেষ পর্যন্ত একটি three-phase motor-এর চলা বা থামার অবস্থাকে নিয়ন্ত্রণ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ফোকাস হলো coil command, main contact closure, three-phase
              power delivery, এবং motor-এর final running বা stopped state-এর সম্পর্ক বোঝা।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এতে contactor lesson শুধু internal switching পর্যন্ত সীমাবদ্ধ থাকে না,
              বরং বাস্তব industrial load-এর সাথে এর সম্পর্কও পরিষ্কার হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Motor Supply" value="3 Phase" tone="emerald" />
            <ValueCard label="Coil Control" value="A1 / A2" tone="violet" />
            <ValueCard label="Motor State" value="Run / Stop" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="ডায়াগ্রামে মোটর যোগ করা হয় কেন?" eyebrow="Core Concept">
        <p>
          একটি contactor সাধারণত circuit-এর শেষ উদ্দেশ্য নয়। এর কাজ হলো একটি load control করা।
        </p>

        <p>
          মোটর যোগ করলে contactor action-এর practical outcome সরাসরি দেখা যায়।
        </p>

        <p>
          এতে switching logic আর actual machine load-এর মধ্যে সম্পর্ক অনেক বেশি বাস্তবভাবে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Control circuit আর motor circuit-এর পার্থক্য কী?" eyebrow="Two Circuits">
        <p>
          Coil থাকে control circuit-এ, আর motor থাকে main power circuit-এ।
        </p>

        <p>
          Control side তুলনামূলক কম power ব্যবহার করে contactor-কে command দেয়।
        </p>

        <p>
          Main side মোটর চালানোর জন্য প্রয়োজনীয় বড় three-phase power বহন করে।
        </p>
      </SectionCard>

      <SectionCard title="Coil OFF থাকলে কী ঘটে?" eyebrow="Motor Stopped">
        <p>
          Coil OFF থাকলে contactor তার normal অবস্থায় থাকে।
        </p>

        <p>
          Main contacts open থাকে, তাই supply থেকে motor-এর দিকে power path ভাঙা থাকে।
        </p>

        <p>
          ফলে মোটর three-phase supply পায় না এবং stopped অবস্থায় থাকে।
        </p>
      </SectionCard>

      <SectionCard title="Coil energized হলে কী ঘটে?" eyebrow="Motor Start Path">
        <p>
          Coil energized হলে magnetic force armature-কে টানে এবং main contacts close করে।
        </p>

        <p>
          Contact close হওয়ার পর line side-এর phase contactor পেরিয়ে motor side-এ যেতে পারে।
        </p>

        <p>
          তখনই মোটর electrically supplied হয় এবং run করতে পারে।
        </p>

        <p>
          <strong>
            Checkpoint Question: coil energized হলেও যদি main contacts এখনও পুরোপুরি close না হয়,
            তাহলে কি মোটরকে already powered ধরা যাবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Three-phase power মোটরে কীভাবে পৌঁছায়?" eyebrow="Power Flow">
        <p>
          Three line phase contactor-এ ঢোকে <strong>L1</strong>, <strong>L2</strong>, এবং <strong>L3</strong> দিয়ে।
        </p>

        <p>
          Main contacts close হওয়ার পর current বের হয় <strong>T1</strong>, <strong>T2</strong>, এবং <strong>T3</strong> দিয়ে।
        </p>

        <p>
          এই output-গুলো পরে motor terminal-এ যায়, যেগুলো সাধারণত <strong>U</strong>, <strong>V</strong>, এবং <strong>W</strong> নামে দেখানো হয়।
        </p>
      </SectionCard>

      <SectionCard title="Motor state এই lesson-এ গুরুত্বপূর্ণ কেন?" eyebrow="Load Outcome">
        <p>
          Motor state দেখায় contactor switching-এর বাস্তব ফল কী হচ্ছে।
        </p>

        <p>
          Main contacts open থাকলে motor stopped থাকে। Main contacts closed থাকলে motor supply পায় এবং run করতে পারে।
        </p>

        <p>
          এতে abstract contact change আর actual machine behavior-এর মধ্যে সংযোগ তৈরি হয়।
        </p>
      </SectionCard>

      <SectionCard title="Auxiliary contacts এখনও গুরুত্বপূর্ণ কেন?" eyebrow="Control Logic">
        <p>
          Motor final load হলেও auxiliary contacts-এর ভূমিকা শেষ হয়ে যায় না।
        </p>

        <p>
          এগুলো holding circuit, interlocking, feedback, এবং operational logic-এ ব্যবহার হয়।
        </p>

        <p>
          Main contacts মোটরে power দেয়, কিন্তু auxiliary contacts control sequence manage করতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Motor load-এর সাথেও AC/DC coil option দেখানো হয় কেন?" eyebrow="Coil Selection">
        <p>
          Motor power load হলেও contactor coil সবসময় control design-এর ওপর নির্ভর করে।
        </p>

        <p>
          কিছু system AC control coil ব্যবহার করে, আবার কিছু system DC control coil ব্যবহার করে।
        </p>

        <p>
          তাই selected control supply অবশ্যই chosen coil type এবং voltage-এর সাথে match করতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="Timeline mode এই lesson-এ useful কেন?" eyebrow="Sequence Understanding">
        <p>
          Timeline mode দেখায় যে motor start command আর motor power পাওয়া একদম একই মুহূর্তে ঘটে না।
        </p>

        <p>
          আগে coil voltage build হয়, তারপর magnetic action তৈরি হয়, তারপর contacts move করে, আর full closure-এর পর motor power flow শুরু হয়।
        </p>

        <p>
          তাই simple ON/OFF snapshot-এর তুলনায় start process অনেক পরিষ্কারভাবে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          এই diagram বোঝার সহজ উপায় হলো দুইটি linked result মনে রাখা।
        </p>

        <p>
          Control circuit ঠিক করে contactor কী করবে, আর contactor ঠিক করে motor three-phase power পাবে কি না।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: শুধু command দেওয়া হয়েছে বলেই motor run করবে না; motor তখনই run করবে
          যখন contactor switching action সম্পূর্ণ করে power path close করবে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি basic motor starter-এ start signal contactor coil-কে energized করে।
        </p>

        <p>
          তারপর contactor three-phase supply মোটরের সাথে connect করে, আর auxiliary contacts control logic ধরে রাখতে বা supervise করতে সাহায্য করে।
        </p>

        <p>
          এ কারণেই practical motor control বোঝার জন্য contactor-motor relationship খুবই গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>মোটর হলো contactor circuit-এর practical load side।</li>
          <li>Coil control circuit-এর অংশ, motor power circuit-এর অংশ নয়।</li>
          <li>Main contacts open থাকলে motor stopped থাকে।</li>
          <li>Main contacts closed হলে three-phase power মোটরে পৌঁছায়।</li>
          <li>T1, T2, T3 contactor output থেকে motor side-এ যায়।</li>
          <li>Auxiliary contacts এখনও holding এবং control logic-এ কাজ করে।</li>
          <li>Timeline mode দেখায় motor power আসলে কখন শুরু হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
