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
      question: "MOSFET-এর main control idea কী?",
      answer:
        "MOSFET মূলত gate voltage এবং electric field দ্বারা control হয়, BJT-এর মতো continuous base current দিয়ে নয়।",
    },
    {
      question: "Gate voltage খুব কম হলে কী হয়?",
      answer:
        "Channel যথেষ্ট শক্তভাবে form হয় না, তাই MOSFET off বা near-off অবস্থায় থাকে এবং useful drain current হয় না।",
    },
    {
      question: "এই lesson-এ threshold voltage বলতে কী বোঝায়?",
      answer:
        "এটি সেই gate-voltage region যেখানে MOSFET off behavior থেকে channel formation এবং conduction-এর দিকে যেতে শুরু করে।",
    },
    {
      question: "Subthreshold region কী?",
      answer:
        "এটি weak-conduction region, যেখানে MOSFET পুরোপুরি off নয় কিন্তু এখনও strongly on-ও নয়।",
    },
    {
      question: "এখানে linear region কী?",
      answer:
        "MOSFET on আছে এবং controllable channel path-এর মতো behave করছে, অনেকটা resistive conduction region-এর মতো।",
    },
    {
      question: "এই MOSFET lesson-এ saturation কী?",
      answer:
        "এটি সেই operating region যেখানে drain voltage gate overdrive-এর তুলনায় যথেষ্ট বেশি হয়ে যায়, ফলে MOSFET আর simple low-resistance linear case-এর মতো behave করে না।",
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
              MOSFET Basics
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ MOSFET-কে field-controlled transistor হিসেবে পরিচয় করানো হয়েছে
              এবং দেখানো হয়েছে কীভাবে gate voltage channel strength ও drain current-কে প্রভাবিত করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো MOSFET transistor control BJT-এর মতো নয়; gate voltage conductive channel-কে shape করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson MOSFET-এর main operating region-গুলোকেও introduce করে: OFF, subthreshold, linear, এবং saturation।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="MOSFET" tone="emerald" />
            <ValueCard label="Main Control" value="Gate Voltage" tone="violet" />
            <ValueCard label="Key Path" value="Drain to Source" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="MOSFET BJT থেকে আলাদা কেন?" eyebrow="Core Concept">
        <p>
          MOSFET আর BJT - দুটোই transistor, কিন্তু এদের main control idea এক নয়।
        </p>

        <p>
          BJT-কে সাধারণত current-driven control দিয়ে শেখানো হয়, আর MOSFET-কে gate-voltage field control দিয়ে শেখানো হয়।
        </p>

        <p>
          এই কারণেই switching এবং electronic control circuit-এ MOSFET খুবই গুরুত্বপূর্ণ।
        </p>
      </SectionCard>

      <SectionCard title="Gate কী কাজ করে?" eyebrow="Gate Control">
        <p>
          Gate ঠিক করে drain আর source-এর মাঝে conductive channel যথেষ্ট শক্তভাবে form হবে কি না।
        </p>

        <p>
          Gate voltage বাড়লে electric field বদলায় এবং channel strength বাড়ে।
        </p>

        <p>
          তাই gate-ই হলো সেই control point যা drain current কত সহজে flow করবে তা নির্ধারণ করে।
        </p>
      </SectionCard>

      <SectionCard title="Threshold voltage কী?" eyebrow="Turn-On Boundary">
        <p>
          Threshold voltage হলো সেই গুরুত্বপূর্ণ gate-voltage region যেখানে MOSFET পুরোপুরি off behavior থেকে সরে আসতে শুরু করে।
        </p>

        <p>
          এই region-এর নিচে channel formation useful strong current-এর জন্য যথেষ্ট নয়।
        </p>

        <p>
          এই region-এর আশেপাশে বা ওপরে গেলে MOSFET দৃশ্যমান conduction change দেখাতে শুরু করে।
        </p>
      </SectionCard>

      <SectionCard title="OFF region কী?" eyebrow="No Useful Channel">
        <p>
          OFF region-এ gate voltage এত কম থাকে যে useful channel তৈরি হয় না।
        </p>

        <p>
          Practical switching-এর দৃষ্টিতে drain current খুবই কম থাকে বা কার্যত থাকে না।
        </p>

        <p>
          এই অবস্থায় MOSFET একটি open path-এর মতো behave করে।
        </p>
      </SectionCard>

      <SectionCard title="Subthreshold কী?" eyebrow="Weak Conduction">
        <p>
          Subthreshold হলো clearly off আর strongly on-এর মাঝের weak-conduction region।
        </p>

        <p>
          এখানে MOSFET পুরোপুরি blocked নয়, কিন্তু channel এখনও strong switching performance-এর জন্য যথেষ্ট নয়।
        </p>

        <p>
          এতে learner বুঝতে পারে MOSFET turn-on সবসময় zero থেকে maximum conduction-এ instant jump নয়।
        </p>
      </SectionCard>

      <SectionCard title="Linear region কী?" eyebrow="Channel Conduction">
        <p>
          Linear region-এ MOSFET on থাকে এবং drain-source path controllable conductive channel-এর মতো behave করে।
        </p>

        <p>
          Basic learning language-এ এটিকে resistive বা switch-channel style operating region হিসেবে ভাবা যায়।
        </p>

        <p>
          Switching lesson-এ learner-রা সাধারণত এটিকেই practical ON region হিসেবে প্রথম চিনতে শেখে।
        </p>
      </SectionCard>

      <SectionCard title="এখানে saturation কী?" eyebrow="Higher-Region Operation">
        <p>
          এই lesson-এ saturation তখন হয় যখন drain-voltage condition gate overdrive-এর তুলনায় এমন পর্যায়ে যায় যে MOSFET আর simple low-resistance linear case-এর মতো behave করে না।
        </p>

        <p>
          এটি MOSFET operation-এর একটি region name, তাই learner-দের ধরে নেওয়া উচিত নয় যে এটি BJT saturation-এর সঙ্গে একদম একই।
        </p>

        <p>
          এই পার্থক্য গুরুত্বপূর্ণ, কারণ transistor topic-এ একই শব্দ দুই জায়গায় ভিন্ন behavior বোঝাতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Drain voltage, load, আর temperature কেন matter করে?" eyebrow="Real Circuit Effects">
        <p>
          MOSFET behavior শুধু gate voltage দিয়ে ঠিক হয় না।
        </p>

        <p>
          Drain voltage, load resistance, load type, এবং temperature - সবই current, power, এবং effective switching behavior-কে প্রভাবিত করে।
        </p>

        <p>
          এই কারণেই lesson-এ শুধু state name নয়, channel strength, drain current, efficiency, এবং junction temperature-ও দেখানো হয়েছে।
        </p>
      </SectionCard>

      <SectionCard title="মূল beginner rule কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো একটি simple chain follow করা।
        </p>

        <p>
          Gate voltage channel-কে shape করে, channel strength drain current-কে affect করে, আর drain current ঠিক করে load কতটা strongly behave করবে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: MOSFET-কে সবচেয়ে সহজে বোঝা যায় এমন transistor হিসেবে, যার gate field drain-source path কতটা open হবে তা control করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>MOSFET gate voltage এবং electric field দিয়ে control হয়।</li>
          <li>Threshold voltage meaningful turn-on behavior শুরু হওয়ার boundary।</li>
          <li>OFF মানে useful drain-source channel conduction নেই।</li>
          <li>Subthreshold হলো strong turn-on-এর আগের weak-conduction region।</li>
          <li>Linear region হলো আরও direct channel-conduction region।</li>
          <li>MOSFET saturation, BJT saturation-এর মতো এক জিনিস নয়।</li>
          <li>Drain voltage, load, আর temperature real behavior-কে প্রভাবিত করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
