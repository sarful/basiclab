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
      question: "Magnetic contactor-এ internal operation বলতে কী বোঝায়?",
      answer:
        "এটি contactor-এর ভিতরের hidden magnetic এবং mechanical process-কে বোঝায়, যেখানে coil, core, armature, spring, এবং contacts একসাথে কাজ করে।",
    },
    {
      question: "Armature movement গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ armature হলো moving link, যা magnetic pull-কে actual contact switching-এ রূপান্তর করে।",
    },
    {
      question: "Contactor-এর ভিতরে magnetic field কী করে?",
      answer:
        "Coil energized হলে magnetic field moving armature-কে fixed core-এর দিকে টানে।",
    },
    {
      question: "Internal operation-এ spring এখনও গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ coil de-energized হলে এটি moving part-গুলোকে normal state-এ ফিরিয়ে আনার restoring force দেয়।",
    },
    {
      question: "Main current flow হওয়ার আগে auxiliary contacts change করতে পারে কেন?",
      answer:
        "কারণ power contacts পুরোপুরি close হওয়ার আগেই internal mechanism move শুরু করে, তাই auxiliary state change travel stage-এও হতে পারে।",
    },
    {
      question: "Troubleshooting-এর জন্য internal-operation understanding useful কেন?",
      answer:
        "কারণ এটি problem electrical, magnetic, mechanical, নাকি contact-related - সেটা চিহ্নিত করতে সাহায্য করে।",
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
              Magnetic Contactor Internal Operation
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Internal operation ব্যাখ্যা করে coil-এ control voltage পৌঁছানোর
              পরে এবং load power পাওয়ার আগে contactor-এর ভিতরে কী কী ঘটে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো invisible chain of events: coil
              energization, magnetic field formation, armature travel, spring
              compression, auxiliary switching, এবং main contact closure।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি learner-কে শুধু external terminal বা final switching result
              নয়, contactor-এর ভেতরের mechanism-ও বুঝতে সাহায্য করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Core Motion" value="Armature Pull-In" tone="emerald" />
            <ValueCard label="Coil Side" value="A1 / A2" tone="violet" />
            <ValueCard label="Return Force" value="Spring Reset" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Internal operation কী?" eyebrow="Core Concept">
        <p>
          Internal operation বলতে contactor-এর ভেতরের magnetic এবং mechanical process-কে বোঝায়।
        </p>

        <p>
          এটি ব্যাখ্যা করে control voltage apply করা থেকে load power deliver হওয়া পর্যন্ত কী ঘটে।
        </p>

        <p>
          এতে শুধু terminal connection নয়, hidden motion এবং hidden force - দুটোই অন্তর্ভুক্ত থাকে।
        </p>
      </SectionCard>

      <SectionCard title="Coil কীভাবে internal action শুরু করে?" eyebrow="Electrical Start">
        <p>
          সঠিক control voltage coil-এর across এলে internal sequence শুরু হয়।
        </p>

        <p>
          Coil-এর মধ্য দিয়ে current flow করলে core-এর চারপাশে magnetic field তৈরি হয়।
        </p>

        <p>
          এই magnetic field-ই পরবর্তী internal mechanism drive করার starting force।
        </p>
      </SectionCard>

      <SectionCard title="Magnetic field কী করে?" eyebrow="Magnetic Pull">
        <p>
          Magnetic field moving armature-কে fixed iron core-এর দিকে টানে।
        </p>

        <p>
          Coil action spring force overcome করার মতো strong হলে এই pull আরও বাড়ে।
        </p>

        <p>
          তাই field electrical input-কে mechanical movement-এ convert করে।
        </p>
      </SectionCard>

      <SectionCard title="Armature travel গুরুত্বপূর্ণ কেন?" eyebrow="Mechanical Link">
        <p>
          Armature হলো magnetism আর switching-এর মধ্যে internal moving bridge।
        </p>

        <p>
          এটি move করলে contact system-ও তার সঙ্গে move করে।
        </p>

        <p>
          যদি armature ঠিকভাবে travel না করে, তাহলে contactor hum করতে পারে,
          close না-ও হতে পারে, অথবা only partially switch করতে পারে।
        </p>

        <p>
          <strong>
            Checkpoint Question: coil energized হলেও যদি armature তার travel
            complete না করে, তাহলে main power path-কে কি fully closed হিসেবে trust করা যাবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Spring-এর internal role কী?" eyebrow="Restoring Force">
        <p>
          Spring pull-in motion-কে resist করে এবং movement-এর সময় restoring force store করে।
        </p>

        <p>
          Coil power remove হলে spring armature এবং contacts-কে তাদের normal state-এ ঠেলে ফিরিয়ে আনে।
        </p>

        <p>
          তাই spring reset action এবং stable normal-state behavior - দুটির জন্যই essential।
        </p>
      </SectionCard>

      <SectionCard title="Motion-এর সময় auxiliary contacts change হয় কেন?" eyebrow="Auxiliary Timing">
        <p>
          Auxiliary contacts একই internal moving mechanism-এর সঙ্গে linked থাকে।
        </p>

        <p>
          Full main-contact closure-এর আগেই mechanism move শুরু হয় বলে
          transition period-এ auxiliary state change দেখা যেতে পারে।
        </p>

        <p>
          এই timing holding circuit, feedback logic, এবং interlocking-এ খুব গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Main contacts সত্যিই কখন close হয়?" eyebrow="Power Closure">
        <p>
          Moving system যথেষ্ট travel complete করার পরেই main contacts close হয়।
        </p>

        <p>
          তখন line থেকে load-এর power path continuous হয়ে যায়।
        </p>

        <p>
          Full closure হওয়ার আগে load-কে fully powered ধরে নেওয়া উচিত নয়।
        </p>
      </SectionCard>

      <SectionCard title="AC এবং DC coil-এর জন্য internal view useful কেন?" eyebrow="Coil Behavior">
        <p>
          AC এবং DC - দুই ধরনের coil-ই একই internal mechanism drive করতে পারে,
          কিন্তু control supply-কে coil design-এর সাথে match করতে হয়।
        </p>

        <p>
          Internal-operation view learner-কে selected coil voltage, pull strength,
          এবং resulting motion-এর মধ্যে সম্পর্ক বুঝতে সাহায্য করে।
        </p>

        <p>
          এটি বুঝতে কাজে লাগে কেন একটি contactor properly pick up করে বা pick up করতে ব্যর্থ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Timeline mode এখানে বিশেষভাবে helpful কেন?" eyebrow="Sequence Understanding">
        <p>
          Internal operation-এ sequence final state-এর মতোই গুরুত্বপূর্ণ।
        </p>

        <p>
          Timeline mode coil action-এর gradual build-up, armature travel-এর
          শুরু, এবং main contact-এর later closure - এই ধাপগুলো clearly দেখায়।
        </p>

        <p>
          এতে simple ON বা OFF view-এর তুলনায় inner process সহজে visualize করা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Troubleshooting-এ এটি কীভাবে সাহায্য করে?" eyebrow="Practical Diagnosis">
        <p>
          Internal-operation knowledge fault-এর ধরন আলাদা করতে সাহায্য করে।
        </p>

        <p>
          যেমন problem হতে পারে coil voltage না থাকা, weak magnetic pull,
          stuck armature motion, damaged spring behavior, বা poor contact closure।
        </p>

        <p>
          Sequence বোঝা diagnosis-কে আরও systematic এবং practical করে তোলে।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Internal operation বোঝার সহজ উপায় হলো energy conversion path follow করা।
        </p>

        <p>
          Electrical energy coil-কে চালায়, coil magnetic force তৈরি করে,
          magnetic force armature move করে, আর armature contacts change করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: internal operation হলো control circuit command আর
          actual load circuit switching-এর মধ্যে hidden link।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি panel-এ technician দেখতে পারে coil voltage আছে, কিন্তু motor তবুও start করছে না।
        </p>

        <p>
          Internal-operation understanding তখন armature travel, magnetic pull,
          spring action, এবং contact closure check করতে ইঙ্গিত দেয়, শুধু terminal voltage নয়।
        </p>

        <p>
          এ কারণেই internal diagram learning এবং service work - দুটির জন্যই valuable।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Internal operation hidden magnetic এবং mechanical process-কে বোঝায়।</li>
          <li>Coil magnetic force তৈরি করে sequence শুরু করে।</li>
          <li>Magnetic field armature-কে core-এর দিকে টানে।</li>
          <li>Spring restoring force এবং reset action দেয়।</li>
          <li>Movement stage-এ auxiliary contacts state change করতে পারে।</li>
          <li>Main contacts fully close হওয়ার পরেই real load current flow করে।</li>
          <li>Troubleshooting-এর জন্য internal understanding খুব useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
