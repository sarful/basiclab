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
  tone: "emerald" | "amber" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-sky-200 bg-sky-50 text-sky-800";

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
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-300 to-sky-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
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
      question: "কন্টিনিউটি টেস্ট আসলে কী যাচাই করে?",
      answer:
        "এটি যাচাই করে দুইটি টেস্ট পয়েন্টের মধ্যে বৈদ্যুতিক পথটি বন্ধ ও পরিবাহী আছে কি না।",
    },
    {
      question: "কন্টিনিউটি টেস্ট করার আগে সার্কিটের পাওয়ার বন্ধ রাখতে হয় কেন?",
      answer:
        "কারণ কন্টিনিউটি মোড হলো power-off test। এটি live energized circuit-এ ব্যবহার করা নিরাপদ নয়।",
    },
    {
      question: "বাস্তব মিটারে continuity থাকলে সাধারণত কী হয়?",
      answer:
        "সাধারণত মিটার beep দেয় এবং খুব কম resistance reading দেখাতে পারে।",
    },
    {
      question: "ফিউজ blown বা তার ভাঙা থাকলে continuity mode-এ কী বোঝায়?",
      answer:
        "এতে বোঝায় path open, তাই continuity থাকবে না এবং মিটার beep দেবে না।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              কন্টিনিউটি টেস্ট
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Continuity test মানে হলো দুইটি পয়েন্টের মধ্যে বৈদ্যুতিক পথটি
              সম্পূর্ণ আছে কি না তা যাচাই করা।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ধারণা খুব সহজ: continuity mode দিয়ে আমরা একটি
              yes-or-no প্রশ্নের উত্তর খুঁজি। Path বন্ধ আছে, নাকি কোথাও break
              হয়েছে?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard
              label="Meter Function"
              value="Diode / Continuity"
              tone="amber"
            />
            <ValueCard label="Power Rule" value="OFF" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="Continuity test কী?" eyebrow="Core Concept">
        <p>
          Continuity test যাচাই করে দুইটি test point-এর মধ্যে complete
          conductive path আছে কি না।
        </p>
        <p>
          সহজভাবে বললে, এটি এই প্রশ্নের উত্তর দেয়: point A থেকে point B-তে
          বিদ্যুৎ যেতে পারবে কি?
        </p>
        <p>
          যদি path বন্ধ ও continuous থাকে, তাহলে meter continuity detect করবে।
        </p>
        <p>
          আর যদি path open, broken, বা interrupted হয়, তাহলে continuity
          দেখাবে না।
        </p>
      </SectionCard>

      <SectionCard title="এটি কেন গুরুত্বপূর্ণ?" eyebrow="Why It Matters">
        <p>
          Continuity testing দিয়ে বোঝা যায় wire, fuse, switch contact, বা
          connection path এখনও electrically complete আছে কি না।
        </p>
        <p>এটি আমাদের এমন practical question-এর উত্তর দেয়:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>এই wire কি এক প্রান্ত থেকে আরেক প্রান্ত পর্যন্ত ঠিক আছে?</li>
          <li>এই fuse open হয়ে গেছে, নাকি এখনও continuous আছে?</li>
          <li>এই switch contact সত্যিই closed আছে কি?</li>
          <li>বাইরে ঠিক দেখালেও path-এর ভিতরে hidden break আছে কি না?</li>
        </ul>
        <p>
          তাই troubleshooting, maintenance, এবং power দেওয়ার আগে basic path
          integrity confirm করার জন্য continuity test খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="Meter setup rule" eyebrow="Setup Rules">
        <p>
          এই lesson-এ meter-কে <strong>diode / continuity-style</strong>{" "}
          function-এ রাখতে হবে।
        </p>
        <p>
          Black lead থাকবে <strong>COM</strong>-এ।
        </p>
        <p>
          Red lead থাকবে <strong>VΩmA</strong>-এ।
        </p>
        <p>
          <strong>10A</strong> jack continuity check-এর জন্য ব্যবহার করা হয়
          না, কারণ continuity high-current measurement নয়।
        </p>
        <p>
          সঠিক নিয়ম হলো আগে function ঠিক করা, তারপর দুইটি test point-এর একটিতে
          একটি probe এবং অন্যটিতে আরেকটি probe বসানো।
        </p>
      </SectionCard>

      <SectionCard title="Power off কেন থাকতে হবে" eyebrow="Safety First">
        <p>Continuity test সবসময় unpowered path-এ করতে হয়।</p>
        <p>এটি power-off test, live operating test নয়।</p>
        <p>
          যদি circuit energized থাকে, তাহলে reading misleading হতে পারে এবং
          setup unsafe হয়ে যেতে পারে।
        </p>
        <p>
          Beginner-safe habit হলো: আগে power remove বা isolate করো, তারপর
          continuity test করো।
        </p>
      </SectionCard>

      <SectionCard title="Result কীভাবে বোঝা হয়" eyebrow="Reading Logic">
        <p>যদি path closed থাকে, continuity detect হওয়া উচিত।</p>
        <p>
          অনেক real meter-এ এর মানে হলো <strong>beep</strong> শোনা যায়, এবং
          display-তে খুব low resistance value দেখা যেতে পারে।
        </p>
        <p>
          যদি path open থাকে, meter beep দেবে না এবং broken বা non-continuous
          path হিসেবে বোঝাবে।
        </p>
        <p>
          এই lesson-এ closed wire path বা closed switch path continuity দেখাবে,
          কিন্তু blown fuse বা broken path continuity দেখাবে না।
        </p>
      </SectionCard>

      <SectionCard title="Probe placement logic" eyebrow="Measurement Method">
        <p>
          Continuity check করার সময় এক probe এক test point-এ এবং অন্য probe
          অন্য test point-এ রাখতে হয়।
        </p>
        <p>
          অর্থাৎ meter-কে <strong>path-এর across</strong> test করতে হবে, একই
          point-এ নয়।
        </p>
        <p>
          যদি দুই probe একই node-এ থাকে, তাহলে path-এর দুই প্রান্তের condition
          সত্যিকারের যাচাই হয় না।
        </p>
        <p>
          সঠিক continuity testing সবসময় path-এর দুই প্রান্তকে compare করে।
        </p>
      </SectionCard>

      <SectionCard title="Typical continuity example" eyebrow="Practical Logic">
        <p>
          <strong>Closed wire path</strong> continuity দেখাবে, কারণ conductor
          এক পাশ থেকে অন্য পাশ পর্যন্ত complete।
        </p>
        <p>
          <strong>Blown fuse</strong> continuity দেখাবে না, কারণ fuse-এর ভিতরের
          conductive link break হয়ে গেছে।
        </p>
        <p>
          <strong>Closed switch contact</strong> continuity দেখাবে, কারণ path
          ইচ্ছাকৃতভাবে connected।
        </p>
        <p>
          মূল logic সবসময় একই: closed path মানে continuity, open path মানে no
          continuity।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="High Priority">
        <p>Powered circuit-এ continuity mode ব্যবহার করা যাবে না।</p>
        <p>
          Lesson যখন continuity test চায়, তখন dial-কে voltage বা ohms mode-এ
          ফেলে রাখা যাবে না।
        </p>
        <p>
          Red lead-কে <strong>10A</strong> jack-এ নেওয়া যাবে না।
        </p>
        <p>
          আর দুই probe একই test point-এ বসানো যাবে না, কারণ এতে দুই প্রান্তের
          আসল path check হয় না।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Continuity test দেখে path closed নাকি broken।</li>
          <li>Continuity mode হলো power-off test।</li>
          <li>Black lead COM-এ এবং red lead VΩmA-তে থাকে।</li>
          <li>Closed path হলে real meter সাধারণত beep দেয়।</li>
          <li>Open path হলে continuity দেখায় না।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের short question দিয়ে continuity-এর মূল rule ঝালাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
