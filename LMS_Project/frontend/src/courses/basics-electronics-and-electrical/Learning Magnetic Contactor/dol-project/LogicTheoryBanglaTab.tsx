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
      question: "মোটর starter-এ DOL বলতে কী বোঝায়?",
      answer:
        "DOL মানে Direct-On-Line। অর্থাৎ starter-এর components-এর মাধ্যমে মোটরকে সরাসরি full line supply-এর সাথে সংযুক্ত করা হয়।",
    },
    {
      question: "DOL starter-এ control circuit আর power circuit দুটোই কেন দরকার?",
      answer:
        "Control circuit ঠিক করে starter কখন run করবে, আর power circuit আসল three-phase energy মোটরে পৌঁছে দেয়।",
    },
    {
      question: "K1 coil-এর কাজ কী?",
      answer:
        "K1 coil হলো starter-এর actuator। এটি energized হলে main power contacts close হয় এবং মোটর start হয়।",
    },
    {
      question: "Auxiliary NO contact 13-14 গুরুত্বপূর্ণ কেন?",
      answer:
        "এটি holding বা seal-in path তৈরি করে, যাতে START push button ছেড়ে দেওয়ার পরও coil energized থাকতে পারে।",
    },
    {
      question: "Overload relay trip করলে কী হয়?",
      answer:
        "এর NC control contact open হয়ে যায়, K1 coil de-energize হয়, main contacts open হয়, এবং মোটর বন্ধ হয়ে যায়।",
    },
    {
      question: "DOL starter-এর প্রধান limitation কী?",
      answer:
        "কারণ মোটরে সরাসরি full line voltage দেওয়া হয়, startup-এর সময় starting current অনেক বেশি হতে পারে।",
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
              DOL Starter Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি Direct-On-Line starter control
              circuit এবং power circuit একসাথে ব্যবহার করে একটি three-phase motor-কে
              start, hold, protect, এবং stop করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              মূল ধারণাটি সহজ: control side ঠিক করে contactor coil কখন energized হবে,
              আর power side ঠিক করে full three-phase supply মোটরে পৌঁছাবে কি না।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই DOL project হলো contactor theory এবং বাস্তব motor starter operation-এর
              মধ্যে একটি practical bridge।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Starter Type" value="DOL" tone="emerald" />
            <ValueCard label="Main Coil" value="K1" tone="violet" />
            <ValueCard label="Motor Supply" value="3 Phase" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="এই project-এ কী শেখানো হচ্ছে?" eyebrow="Core Concept">
        <p>
          এই project-এ একটি DOL motor starter-এর basic working logic শেখানো হয়।
        </p>

        <p>
          এখানে control circuit এবং power circuit দুটোই দেখানো হয়েছে, যাতে learner
          বুঝতে পারে command logic আর motor power flow কীভাবে একসাথে কাজ করে।
        </p>

        <p>
          শুধু symbol মুখস্থ না করে, প্রতিটি component-এর practical role-এর সাথে
          motor start এবং protection-এর সম্পর্ক বোঝানোই এই lesson-এর উদ্দেশ্য।
        </p>
      </SectionCard>

      <SectionCard title="DOL starter কী?" eyebrow="Starter Meaning">
        <p>
          DOL মানে <strong>Direct-On-Line</strong>।
        </p>

        <p>
          এই পদ্ধতিতে motor-কে breaker, contactor, এবং overload relay-এর মতো
          protective ও switching device-এর মাধ্যমে সরাসরি full three-phase line-এর
          সাথে সংযুক্ত করা হয়।
        </p>

        <p>
          এটি industrial electrical system-এ সবচেয়ে সহজ এবং বহুল ব্যবহৃত motor
          starting method-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Control circuit আর power circuit আলাদা কেন?" eyebrow="Two Functions">
        <p>
          Control circuit ঠিক করে <strong>কখন</strong> system run করবে।
        </p>

        <p>
          Power circuit আসল three-phase current মোটরে পৌঁছে দেয়।
        </p>

        <p>
          এই separation system-কে operate করা, protect করা, এবং troubleshoot করা
          আরও সহজ করে।
        </p>
      </SectionCard>

      <SectionCard title="Start sequence কীভাবে কাজ করে?" eyebrow="Operation Sequence">
        <p>
          প্রথমে breaker বা MCB ON থাকতে হবে, যাতে starter-এ supply available থাকে।
        </p>

        <p>
          START push button চাপলে K1 coil energized হয় এবং contactor pull-in করে।
        </p>

        <p>
          এরপর main power contacts close হয় এবং three-phase power মোটরে পৌঁছে যায়।
        </p>

        <p>
          তারপর auxiliary NO contact close হয়ে holding path তৈরি করে, যাতে START
          button ছেড়ে দেওয়ার পরও starter ON থাকতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Holding contact গুরুত্বপূর্ণ কেন?" eyebrow="Seal-In Logic">
        <p>
          START push button শুধু অল্প সময়ের জন্য চাপা হয়।
        </p>

        <p>
          যদি circuit শুধু ওই button-এর ওপর নির্ভর করত, তাহলে button ছেড়ে দিলেই coil
          de-energize হয়ে যেত।
        </p>

        <p>
          Auxiliary NO contact 13-14 parallel path তৈরি করে এই সমস্যা সমাধান করে,
          ফলে K1 coil normal running-এর সময় energized থাকতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মোটর কীভাবে stop হয়?" eyebrow="Stop Conditions">
        <p>
          K1 coil de-energize হলেই মোটর stop হয়।
        </p>

        <p>
          এটি হতে পারে STOP push button control path open করলে, breaker OFF করলে,
          অথবা overload relay trip করলে।
        </p>

        <p>
          Coil drop-out হওয়ার সাথে সাথে main contacts open হয় এবং মোটর আর power পায় না।
        </p>
      </SectionCard>

      <SectionCard title="Overload protection কেন খুব জরুরি?" eyebrow="Motor Safety">
        <p>
          High load, mechanical jam, stress-এর মধ্যে low speed, বা incorrect setting-এর
          কারণে মোটর অনেক বেশি current টানতে পারে।
        </p>

        <p>
          Overload relay motor winding-কে overheating এবং damage থেকে protect করে।
        </p>

        <p>
          এই starter-এ overload relay protection-এর পাশাপাশি control logic-কেও
          প্রভাবিত করে, কারণ trip হলে এর NC contact coil circuit open করে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="মূল components কী কাজ করে?" eyebrow="Component Roles">
        <p>
          <strong>MCB বা breaker</strong> incoming supply isolate করে।
        </p>

        <p>
          <strong>K1 contactor coil</strong> switching action চালায়, আর{" "}
          <strong>main power contacts</strong> three-phase power মোটরে connect করে।
        </p>

        <p>
          <strong>Overload relay</strong> motor protection দেয়,{" "}
          <strong>auxiliary NO contact</strong> starter-কে hold করে, আর{" "}
          <strong>pilot lamp</strong> energized বা running status দেখায়।
        </p>
      </SectionCard>

      <SectionCard title="DOL starter-এর প্রধান limitation কী?" eyebrow="Design Limitation">
        <p>
          DOL starter startup-এর সময় motor-কে সরাসরি full line voltage দেয়।
        </p>

        <p>
          এ কারণে motor খুব বেশি starting current টানতে পারে।
        </p>

        <p>
          বিশেষ করে বড় motor বা heavy-duty load-এর ক্ষেত্রে এটি voltage drop,
          mechanical shock, এবং rough startup-এর কারণ হতে পারে।
        </p>

        <p>
          তাই বড় application-এ star-delta বা soft starter-এর মতো method ভালো হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson পড়ার ভালো উপায়" eyebrow="Study Tip">
        <p>
          আগে control circuit পড়ুন, কারণ এটি বোঝায়
          <em> system কখন run করবে</em>।
        </p>

        <p>
          তারপর power circuit পড়ুন, কারণ এটি দেখায়
          <em> motor আসলে কীভাবে power পায়</em>।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: DOL starter সবচেয়ে সহজে বোঝা যায় যদি আপনি একটাই chain
          follow করেন: command থেকে coil, coil থেকে contactor, contactor থেকে motor,
          এবং overload থেকে safe shutdown।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DOL মানে Direct-On-Line starter।</li>
          <li>Control circuit ঠিক করে starter কখন run করবে।</li>
          <li>Power circuit three-phase energy মোটরে নিয়ে যায়।</li>
          <li>K1 coil energized হলে main contacts close হয়।</li>
          <li>Auxiliary NO contact holding path তৈরি করে।</li>
          <li>Overload relay motor protect করে এবং coil circuit stop করতে পারে।</li>
          <li>DOL-এর প্রধান limitation হলো high starting current।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
