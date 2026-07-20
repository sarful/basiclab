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
      question: "Contactor operation diagram-এর প্রধান উদ্দেশ্য কী?",
      answer:
        "এটি দেখায় coil-এ control voltage এলে armature, main contacts, এবং auxiliary contacts-এর state কীভাবে পরিবর্তিত হয়।",
    },
    {
      question: "Coil energized হলে প্রথমে কী হয়?",
      answer:
        "A1 এবং A2-এর across control voltage আসে, এবং coil magnetic field তৈরি করতে শুরু করে।",
    },
    {
      question: "Main contacts পুরোপুরি close হওয়ার আগে NC auxiliary contact open হয় কেন?",
      answer:
        "কারণ full power contact closure-এর আগেই mechanism move শুরু করে, তাই transition stage-এই auxiliary state change দেখা যেতে পারে।",
    },
    {
      question: "L1, L2, L3 এবং T1, T2, T3 কী বোঝায়?",
      answer:
        "L1, L2, এবং L3 হলো তিনটি line input, আর T1, T2, এবং T3 হলো তাদের corresponding load output।",
    },
    {
      question: "AC এবং DC coil option দুটোই দেখানো হয় কেন?",
      answer:
        "কারণ contactor বিভিন্ন coil type ও voltage-এ পাওয়া যায়, এবং control circuit-কে selected coil-এর সাথে match করতে হয়।",
    },
    {
      question: "ON/OFF mode এবং timeline mode-এর মূল পার্থক্য কী?",
      answer:
        "ON/OFF mode final state সরাসরি দেখায়, আর timeline mode pickup এবং transition process step by step explain করে।",
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
              Magnetic Contactor Operation Diagram
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Contactor operation diagram দেখায় coil energization কীভাবে
              magnetic force তৈরি করে, armature move করায়, auxiliary contacts
              change করে, এবং শেষে main power path close করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো full operating sequence: coil voltage,
              pickup action, auxiliary transition, main contact closure, এবং
              line side থেকে load side-এ current flow।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি simple contactor anatomy আর practical motor-control circuit
              reading-এর মধ্যে gap কমাতে সাহায্য করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Power Phases" value="L1-L2-L3" tone="emerald" />
            <ValueCard label="Coil Input" value="A1 / A2" tone="violet" />
            <ValueCard label="Auxiliary Action" value="NO / NC" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Operation diagram কী দেখায়?" eyebrow="Core Concept">
        <p>
          Operation diagram দেখায় contactor কীভাবে তার de-energized state থেকে
          energized working state-এ যায়।
        </p>

        <p>
          এটি control side, magnetic action, mechanical movement, এবং power side-কে
          একটি connected picture-এ একসাথে দেখায়।
        </p>

        <p>
          এর ফলে contactor-এর cause and effect সহজে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Normal OFF state কী?" eyebrow="De-Energized State">
        <p>
          Normal OFF state-এ coil terminal-এর across কোনো control voltage থাকে না।
        </p>

        <p>
          Magnetic field থাকে না, armature released থাকে, main contacts open
          থাকে, NO auxiliary open থাকে, আর NC auxiliary closed থাকে।
        </p>

        <p>
          কোনো control command apply করার আগে এটাই contactor-এর resting state।
        </p>
      </SectionCard>

      <SectionCard title="Coil energized হলে প্রথমে কী হয়?" eyebrow="Control Input">
        <p>
          প্রথম ধাপ হলো <strong>A1</strong> এবং <strong>A2</strong>-এর across
          control voltage apply হওয়া।
        </p>

        <p>
          Voltage বাড়ার সঙ্গে সঙ্গে coil electromagnetic force build করে।
        </p>

        <p>
          এই magnetic force-ই armature-কে fixed core-এর দিকে টানতে শুরু করে।
        </p>
      </SectionCard>

      <SectionCard title="Transition stage কীভাবে কাজ করে?" eyebrow="Pickup Sequence">
        <p>
          Contactor instantaneously fully open থেকে fully closed-এ jump করে না।
        </p>

        <p>
          একটি transition stage থাকে, যেখানে magnetic pull armature move করার
          মতো strong হয়, কিন্তু main contacts তখনও travel করছে।
        </p>

        <p>
          এই সময় auxiliary contacts state change করতে পারে, যদিও main power
          contacts এখনও পুরোপুরি settle হয়নি।
        </p>

        <p>
          <strong>
            Checkpoint Question: coil voltage এখনও rise করছে এবং armature
            appena move শুরু করেছে, তখন কি main power path-কে already fully
            closed ধরা উচিত?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Auxiliary contacts কীভাবে behave করে?" eyebrow="Auxiliary Logic">
        <p>
          Auxiliary contacts armature-এর একই movement follow করে, কিন্তু control logic-এর কাজ করে।
        </p>

        <p>
          Normally open auxiliary contact contactor pull-in হলে close হয়।
        </p>

        <p>
          Normally closed auxiliary contact contactor pull-in হলে open হয়।
        </p>
      </SectionCard>

      <SectionCard title="Main current কখন flow করে?" eyebrow="Power Path">
        <p>
          Main current flow শুরু হয় তখনই, যখন main contacts পুরোপুরি close হয়।
        </p>

        <p>
          একটি three-phase contactor-এ তখন current <strong>L1, L2, L3</strong>{" "}
          থেকে <strong>T1, T2, T3</strong>-তে যায়।
        </p>

        <p>
          এই stage-এই connected motor বা load আসল power পায়।
        </p>
      </SectionCard>

      <SectionCard title="Line এবং load terminal number গুরুত্বপূর্ণ কেন?" eyebrow="Wiring Identity">
        <p>
          Terminal number line side এবং load side-কে clearly আলাদা করতে সাহায্য করে।
        </p>

        <p>
          Line side-এ সাধারণত <strong>1L1</strong>, <strong>3L2</strong>, এবং{" "}
          <strong>5L3</strong> এর মতো label থাকে।
        </p>

        <p>
          Output side-এ <strong>2T1</strong>, <strong>4T2</strong>, এবং{" "}
          <strong>6T3</strong> এর মতো label থাকে, যা correct wiring ও
          troubleshooting-এ সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Different AC এবং DC coil option দেখানো হয় কেন?" eyebrow="Coil Selection">
        <p>
          Control design-এর উপর নির্ভর করে contactor AC coil বা DC coil - দুটোই ব্যবহার করতে পারে।
        </p>

        <p>
          প্রতিটি coil নির্দিষ্ট voltage range-এর জন্য design করা হয়, যেমন 24 V, 110 V, 220 V ইত্যাদি।
        </p>

        <p>
          Reliable operation-এর জন্য selected control supply-কে coil type ও voltage-এর সাথে match করতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="Timeline mode useful কেন?" eyebrow="Learning Sequence">
        <p>
          ON/OFF mode final state দ্রুত দেখার জন্য useful।
        </p>

        <p>
          Timeline mode pickup-এর সময় event-এর order বোঝার জন্য useful।
        </p>

        <p>
          এটি learner-কে বুঝতে সাহায্য করে যে coil voltage build-up, magnetic action,
          auxiliary switching, এবং main contact closure - সবই একটি sequence-এর মধ্যে ঘটে।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Contactor operation diagram পড়ার সহজ উপায় হলো action-গুলোকে order ধরে follow করা।
        </p>

        <p>
          Control voltage আসে, magnetic field build হয়, armature move করে,
          NC open হয়, NO close হয়, main contacts close হয়, এবং line power
          load-এ পৌঁছে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: coil side command explain করে, কিন্তু main contact
          side দেখায় load-এ আসল power ঠিক কখন deliver হচ্ছে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          একটি motor starter-এ start command contactor coil-কে energize করে
          এবং main three-phase power path close করে।
        </p>

        <p>
          একই সময় NO auxiliary holding circuit support করতে পারে, আর NC
          auxiliary stop বা interlock logic-এ ব্যবহার হতে পারে।
        </p>

        <p>
          এ কারণেই practical motor-control schematic পড়ার জন্য operation diagram খুব জরুরি।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Operation diagram control, magnetic, mechanical, এবং power action-কে একসাথে link করে।</li>
          <li>OFF state মানে coil de-energized এবং main contacts open।</li>
          <li>A1/A2-তে coil voltage আসলে magnetic pull শুরু হয়।</li>
          <li>Pickup sequence-এর সময় auxiliary contacts state change করে।</li>
          <li>Main current flow শুরু হয় main contacts পুরোপুরি close হওয়ার পরে।</li>
          <li>Correct wiring-এর জন্য line ও load terminal number গুরুত্বপূর্ণ।</li>
          <li>Timeline mode step-by-step transition process বুঝতে সাহায্য করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
