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
      question: "SSR internals circuit lesson-এর focus কী?",
      answer:
        "এই lesson-এ SSR-এর internal operating structure এবং input control stage থেকে output switching stage পর্যন্ত internal circuit কীভাবে কাজ করে তা বোঝানো হয়েছে।",
    },
    {
      question: "SSR কী তা শেখার পরে internals কেন পড়তে হবে?",
      answer:
        "কারণ SSR electronically switch করে এটা জানার পরের ধাপ হলো কোন internal section সেই switching কাজ করে তা বোঝা।",
    },
    {
      question: "SSR-এর কোন internal block-গুলো বেশি গুরুত্বপূর্ণ?",
      answer:
        "সাধারণত input stage, opto-isolation stage, triggering section, আর output power switching section-এর দিকে learner-এর নজর দেওয়া উচিত।",
    },
    {
      question: "Opto-isolation গুরুত্বপূর্ণ কেন?",
      answer:
        "Opto-isolation control signal-কে output side-এ transfer করতে সাহায্য করে, কিন্তু input আর output-এর মধ্যে electrical isolation বজায় রাখে।",
    },
    {
      question: "Internals view আর with-circuit view-এর মধ্যে পার্থক্য কী?",
      answer:
        "Internals view SSR-এর ভেতরের part বোঝায়, আর with-circuit view দেখায় সেই SSR বাস্তব control আর load connection-এ কীভাবে বসে।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ beginner takeaway কী?",
      answer:
        "SSR কোনো simple black box নয়; এর ভিতরে কয়েকটি electronic stage একসাথে কাজ করে isolation, triggering, আর load switching সম্পন্ন করে।",
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
              SSR Internals Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ solid state relay-এর internal operating section-গুলো
              এবং সেগুলো কীভাবে একসাথে কাজ করে তা বোঝানো হয়েছে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো SSR-এর ভিতরে শুধু একটি switching
              element নেই; সেখানে একাধিক electronic stage থাকে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই stage-গুলো বুঝতে পারলে external circuit behavior-ও অনেক সহজে
              বোঝা যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Focus" value="Internal Blocks" tone="emerald" />
            <ValueCard label="Key Isolation" value="Opto Stage" tone="violet" />
            <ValueCard label="Output Action" value="Electronic Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="SSR internals কেন পড়ব?" eyebrow="Learning Progression">
        <p>
          আগের SSR lesson-এ শেখানো হয়েছে যে solid state relay mechanical contact
          নয়, electronicভাবে switch করে।
        </p>

        <p>
          এই lesson সেই switching behavior-এর internal circuit idea আরও গভীরভাবে
          দেখায়।
        </p>

        <p>
          এতে learner শুধু definition না, বরং SSR-এর working structure-ও বুঝতে
          পারে।
        </p>
      </SectionCard>

      <SectionCard title="কোন internal section-গুলো সবচেয়ে গুরুত্বপূর্ণ?" eyebrow="Block Overview">
        <p>
          Basic SSR explanation-এ সাধারণত input stage, isolation stage, trigger
          stage, আর output switching stage সবচেয়ে গুরুত্বপূর্ণ।
        </p>

        <p>
          প্রতিটি stage-এর আলাদা কাজ আছে: signal গ্রহণ করা, isolation দেওয়া,
          এবং switching action forward করা।
        </p>

        <p>
          Block হিসেবে SSR-কে দেখলে internal circuit অনেক সহজে শেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Input stage কী কাজ করে?" eyebrow="Control Entry">
        <p>
          Input stage low-power control side থেকে control signal গ্রহণ করে।
        </p>

        <p>
          এই signal-ই পুরো switching process শুরু করে, যা শেষে load side-কে on
          বা off করে।
        </p>

        <p>তাই input stage হলো SSR control action-এর entry point।</p>
      </SectionCard>

      <SectionCard title="Opto-isolation গুরুত্বপূর্ণ কেন?" eyebrow="Isolation Concept">
        <p>
          Opto-isolation control signal-কে output side-এ influence করতে দেয়,
          কিন্তু input আর output side-এর মধ্যে direct electrical connection
          রাখে না।
        </p>

        <p>
          এতে safety বাড়ে এবং low-power control section load side থেকে protect
          থাকে।
        </p>

        <p>এটি SSR internal design-এর সবচেয়ে গুরুত্বপূর্ণ concept-গুলোর একটি।</p>
      </SectionCard>

      <SectionCard title="Output stage কী কাজ করে?" eyebrow="Load Switching">
        <p>
          Output stage-ই load side-এ actual load current control করে।
        </p>

        <p>
          Moving contact-এর বদলে এটি electronic power switching device ব্যবহার
          করে current flow allow বা stop করে।
        </p>

        <p>এই কারণেই SSR switching fast এবং silent হয়।</p>
      </SectionCard>

      <SectionCard title="এই lesson-এ দুইটি view কেন আছে?" eyebrow="Internals vs Circuit">
        <p>
          Internals view learner-কে SSR package-এর ভিতরে কী হচ্ছে তা বুঝতে
          সাহায্য করে।
        </p>

        <p>
          With-circuit view দেখায় একই SSR বাস্তব control input আর load output
          connection-এ কীভাবে কাজ করে।
        </p>

        <p>দুইটি view একসাথে theory আর application-কে যুক্ত করে।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>সবচেয়ে সহজ rule হলো SSR internals-কে stage chain হিসেবে ভাবা।</p>

        <p>
          Input signal enters, isolation safely transfer করে, আর output
          electronics load switch করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: SSR internal electronic block-গুলোর মাধ্যমে signal
          নেয়, control side isolate করে, আর load side switch করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>এই lesson SSR-এর internal structure বোঝায়।</li>
          <li>SSR operation-কে একাধিক electronic stage হিসেবে বোঝা যায়।</li>
          <li>Input stage control signal গ্রহণ করে।</li>
          <li>Opto-isolation control side আর load side আলাদা রাখে।</li>
          <li>Output stage actual load switching করে।</li>
          <li>Internals view আর with-circuit view একে অপরকে support করে।</li>
          <li>মূল learner goal হলো SSR-কে একটি working internal system হিসেবে বোঝা।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
