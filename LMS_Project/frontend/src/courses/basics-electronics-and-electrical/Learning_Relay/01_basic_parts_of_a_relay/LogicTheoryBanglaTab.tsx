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
      question: "এই relay lesson-এর প্রথম বড় idea কী?",
      answer:
        "এই lesson relay-এর physical part শেখায়, বিশেষ করে coil terminal, common terminal, normally closed contact, আর normally open contact চেনায়।",
    },
    {
      question: "A1 আর A2 গুরুত্বপূর্ণ কেন?",
      answer:
        "A1 আর A2 হলো coil terminal। এই দুটির মাধ্যমে coil energized হলে relay তার switching contact-এর state change করে।",
    },
    {
      question: "Relay contact language-এ COM মানে কী?",
      answer:
        "COM মানে common terminal। এটি moving contact point, যা relay coil off বা on অবস্থার উপর নির্ভর করে NC বা NO-এর সাথে connect হয়।",
    },
    {
      question: "NC আর NO-এর সবচেয়ে সহজ difference কী?",
      answer:
        "NC normal resting state-এ COM-এর সাথে connected থাকে, আর NO relay energized হওয়ার পরে COM-এর সাথে connect হয়।",
    },
    {
      question: "Package sketch beginner-এর জন্য useful কেন?",
      answer:
        "কারণ এটি relay-এর বাইরের body, terminal label, আর internal contact behavior-এর মধ্যে সম্পর্ক বোঝাতে সাহায্য করে।",
    },
    {
      question: "Relay working principle শেখার আগে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ coil আর contact একসাথে কীভাবে operate করে তা বোঝার আগে learner-কে relay-এর part আর terminal নামগুলো পরিষ্কারভাবে চিনতে হয়।",
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
              Basic Parts of a Relay
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ relay-এর basic physical part বোঝানো হয়েছে, যাতে
              learner relay working principle শেখার আগে coil terminal আর
              contact terminal চিনতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে সহজ beginner goal হলো: A1, A2, COM, NC, আর NO মানে কী
              সেটা জানা, এবং এই নামগুলো real relay package-এর সাথে connect করা।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই lesson 1 পরে আসা সব relay lesson-এর foundation।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Coil Pins" value="A1 / A2" tone="emerald" />
            <ValueCard label="Moving Contact" value="COM" tone="violet" />
            <ValueCard label="States" value="NC / NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Relay body আমাদের কী দেখায়?" eyebrow="Physical Package">
        <p>
          Relay package শুধু একটি plastic box নয়; এর ভিতরে coil system আর
          switching contact mechanism থাকে।
        </p>

        <p>
          Beginner learning-এ package sketch outer body, printed label, আর
          terminal location-কে internal switching idea-এর সাথে connect করতে সাহায্য করে।
        </p>

        <p>
          এই কারণেই deep theory-এর আগে lesson physical identification দিয়ে শুরু হয়।
        </p>
      </SectionCard>

      <SectionCard title="A1 আর A2 কী?" eyebrow="Coil Terminals">
        <p>
          A1 আর A2 হলো relay coil-এর দুটি terminal।
        </p>

        <p>
          এই coil pin-এ voltage apply করলে relay coil energized হয় এবং
          magnetic action তৈরি করে contact state পরিবর্তন করে।
        </p>

        <p>
          তাই A1 আর A2 relay-এর control side-এর অংশ।
        </p>
      </SectionCard>

      <SectionCard title="COM মানে কী?" eyebrow="Common Contact">
        <p>
          COM মানে common terminal।
        </p>

        <p>
          এটি moving contact point, যা relay coil rest-এ আছে নাকি energized
          তার উপর নির্ভর করে different contact path-এর সাথে connect হয়।
        </p>

        <p>
          এই কারণে relay diagram-এ COM key switching terminal হিসেবে দেখা হয়।
        </p>
      </SectionCard>

      <SectionCard title="NC আর NO মানে কী?" eyebrow="Contact States">
        <p>
          NC মানে normally closed, আর NO মানে normally open।
        </p>

        <p>
          Normally বলতে relay coil unpowered বা normal resting state বোঝায়।
        </p>

        <p>
          এই অবস্থায় COM, NC-এর সাথে connected থাকে, আর NO open থাকে যতক্ষণ না relay energized হয়।
        </p>
      </SectionCard>

      <SectionCard title="'Normal state' গুরুত্বপূর্ণ কেন?" eyebrow="Rest Position">
        <p>
          অনেক beginner NC আর NO দেখে মনে করে এগুলো permanent wiring condition।
        </p>

        <p>
          আসলে NC আর NO relay-এর normal unpowered state-এ contact condition বোঝায়।
        </p>

        <p>
          Coil power পেলেই এই contact relationship বদলে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Contact part switching-এর সাথে কীভাবে relate করে?" eyebrow="Control Side vs Load Side">
        <p>
          Relay coil side আর contact side আলাদা কাজ করে।
        </p>

        <p>
          Coil side control signal নেয়, আর contact side অন্য একটি circuit path
          open বা close করে।
        </p>

        <p>
          এই separation relay control system-এর সবচেয়ে useful practical idea-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="একাধিক visual view useful কেন?" eyebrow="Package, Terminal, Sketch">
        <p>
          Songle package sketch, 3D terminal map, আর AC relay power sketch একই
          relay-কে different angle থেকে শেখায়।
        </p>

        <p>
          একটি outer package বুঝতে সাহায্য করে, একটি pin mapping বোঝায়, আর
          একটি practical circuit use-এর সাথে relay-কে connect করে।
        </p>

        <p>
          একসাথে এগুলো label-কে real understanding-এ পরিণত করে।
        </p>
      </SectionCard>

      <SectionCard title="Relay working principle-এর আগে এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Order">
        <p>
          Relay কীভাবে কাজ করে তা শেখার আগে learner-কে relay-এর basic part আর
          terminal নামগুলো চিনতে হবে।
        </p>

        <p>
          যদি A1, A2, COM, NC, আর NO clear না হয়, তাহলে পরের relay logic
          follow করা অনেক কঠিন হয়ে যায়।
        </p>

        <p>
          এই কারণেই এটি সঠিক first lesson।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          Relay basic মনে রাখার সবচেয়ে সহজ উপায় হলো relay-কে দুই side-এ ভাগ করা।
        </p>

        <p>
          A1 আর A2 coil control side-এর অংশ, আর COM, NC, NO switching contact side-এর অংশ।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: আগে relay-এর নাম আর terminal শিখুন, তারপর working
          principle অনেক সহজ হয়ে যাবে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Relay package-এর ভিতরে coil system আর switching contact থাকে।</li>
          <li>A1 আর A2 হলো coil terminal।</li>
          <li>COM হলো common moving contact terminal।</li>
          <li>NC normal resting state-এ connected থাকে।</li>
          <li>NO relay energized হওয়ার পরে connect হয়।</li>
          <li>Coil side relay control করে, আর contact side অন্য circuit switch করে।</li>
          <li>এই lesson পরের সব relay lesson-এর vocabulary তৈরি করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
