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
      question: "Relay coil-only lesson-এর মূল ধারণা কী?",
      answer:
        "এই lesson relay-এর coil section-কে আলাদা করে শেখায়, যাতে learner full contact-switching story-তে যাওয়ার আগে control side-টা বুঝতে পারে।",
    },
    {
      question: "Coil-কে আলাদা করে পড়ার দরকার কেন?",
      answer:
        "কারণ coil relay-এর control side, আর আগে coil-এর electrical behavior বুঝলে পরে full relay operation follow করা সহজ হয়।",
    },
    {
      question: "Relay coil-এর মধ্যে current flow করলে কী হয়?",
      answer:
        "Coil magnetic field তৈরি করে, যা relay-এর mechanical movement শুরু হওয়ার প্রথম step।",
    },
    {
      question: "Coil আর electromagnetism-এর সম্পর্ক কী?",
      answer:
        "Relay coil energized হলে electromagnet-এর মতো behave করে এবং electrical input-কে magnetic force-এ পরিণত করে।",
    },
    {
      question: "এই lesson full relay working principle-এর চেয়ে সহজ কেন?",
      answer:
        "কারণ এটি শুধু coil side আর magnetic action-এর উপর focus করে, contact change একসাথে track করার দরকার হয় না।",
    },
    {
      question: "Advanced relay circuit-এর আগে এই lesson useful কেন?",
      answer:
        "কারণ অনেক relay control circuit-এর শুরুতেই প্রশ্ন থাকে coil কীভাবে energize হবে এবং সেই energizing action কী করে।",
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
              Relay Coil Only
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ শুধু relay coil-এর উপর focus করা হয়েছে, যাতে learner
              full contact switching-এ যাওয়ার আগে relay-এর control side বুঝতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো: coil সেই অংশ, যা
              electrical input গ্রহণ করে এবং সেটাকে magnetic force-এ বদলে দেয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Coil-কে আলাদা করে শিখলে পরে পুরো relay-কে বোঝা অনেক সহজ হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Relay Side" value="Control Side" tone="emerald" />
            <ValueCard label="Main Action" value="Magnetic Field" tone="violet" />
            <ValueCard label="Electrical Input" value="Coil Current" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Relay coil-কে আলাদা করে শেখানো হয় কেন?" eyebrow="Focused Learning">
        <p>
          Full relay-এর মধ্যে coil system আর switching contact দুটোই থাকে, কিন্তু
          beginner-রা coil-কে আগে আলাদা করে শিখলে topic-টা দ্রুত বুঝতে পারে।
        </p>

        <p>
          এই lesson contact-এর কিছু complexity সরিয়ে দিয়ে শুধু coil কী করে
          সেটার উপর focus করে।
        </p>

        <p>
          এতে প্রথম electromagnetic idea অনেক clearer হয়।
        </p>
      </SectionCard>

      <SectionCard title="Relay coil কী?" eyebrow="Core Part">
        <p>
          Relay coil হলো relay-এর ভিতরের wound conductor section।
        </p>

        <p>
          এটি control side থেকে electrical input নেয় এবং magnetic effect
          তৈরি করে response দেয়।
        </p>

        <p>
          এটাই relay action শুরু করার অংশ।
        </p>
      </SectionCard>

      <SectionCard title="Coil-এ current flow করলে কী হয়?" eyebrow="Magnetic Effect">
        <p>
          Relay coil-এর মধ্যে current flow করলে magnetic field তৈরি হয়।
        </p>

        <p>
          এই magnetic field-ই relay-কে electromechanical device হিসেবে useful
          করে তোলার প্রথম physical force।
        </p>

        <p>
          Coil current না থাকলে এই magnetic action-ও থাকে না।
        </p>
      </SectionCard>

      <SectionCard title="Relay coil-কে electromagnet বলা হয় কেন?" eyebrow="Electrical to Magnetic">
        <p>
          Relay coil energized হলে electromagnet-এর মতো behave করে, কারণ
          electrical input magnetic force তৈরি করে।
        </p>

        <p>
          এই force relay-এর electrical side আর পরের mechanical switching side-এর
          মধ্যে bridge তৈরি করে।
        </p>

        <p>
          তাই coil-ই relay operation-এর আসল starting point।
        </p>
      </SectionCard>

      <SectionCard title="Coil energizing মানে কী?" eyebrow="Powered State">
        <p>
          Coil energizing মানে relay coil যথেষ্ট electrical input পাচ্ছে এবং active হয়ে গেছে।
        </p>

        <p>
          Energized state-এ coil relay movement-এর জন্য প্রয়োজনীয় magnetic
          condition তৈরি করতে পারে।
        </p>

        <p>
          Unenergized state-এ relay তার default rest condition-এ থাকে।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson full relay working principle-এর চেয়ে সহজ কেন?" eyebrow="Reduced Complexity">
        <p>
          Full working principle-এ learner-কে coil current, magnetic field,
          armature motion, আর contact change সব একসাথে track করতে হয়।
        </p>

        <p>
          এই lesson সেই load কমিয়ে শুধু coil আর magnetic behavior-এর উপর focus করে।
        </p>

        <p>
          এতে first layer of understanding আরও শক্ত হয়।
        </p>
      </SectionCard>

      <SectionCard title="Coil পরের relay switching-এর সাথে কীভাবে relate করে?" eyebrow="Next Step Connection">
        <p>
          Coil নিজে external circuit directly switch করে না, কিন্তু এটি সেই
          magnetic action তৈরি করে যা পরে relay-এর moving part-কে contact
          position change করতে সাহায্য করে।
        </p>

        <p>
          তাই এই lesson শুধু coil নিয়ে হলেও, এটি learner-কে পুরো switching
          story-র জন্য প্রস্তুত করে।
        </p>

        <p>
          এই কারণেই এটি একটি important foundation lesson।
        </p>
      </SectionCard>

      <SectionCard title="Practical control circuit-এ coil বুঝতে হবে কেন?" eyebrow="Real Use">
        <p>
          অনেক practical relay circuit design-এর শুরু হয় এই প্রশ্ন থেকে: coil
          কীভাবে safe আর reliableভাবে energize করা হবে?
        </p>

        <p>
          Coil behavior clear হলে relay driving, transistor control, আর power
          switching-এর পরের topic-গুলোও সহজ হয়।
        </p>

        <p>
          এই কারণেই coil-এর জন্য আলাদা lesson রাখা meaningful।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson মনে রাখার সবচেয়ে সহজ উপায় হলো relay coil-কে relay-এর
          control engine হিসেবে ভাবা।
        </p>

        <p>
          Electrical current coil-এ ঢোকে, coil magnetic force তৈরি করে, আর
          সেই force-ই relay action-এর basis হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: আগে relay coil বুঝুন, তারপর relay-এর বাকি
          switching behavior অনেক সহজ হয়ে যাবে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Relay coil relay-এর control side-এর অংশ।</li>
          <li>Coil-এর মধ্যে current flow করলে magnetic field তৈরি হয়।</li>
          <li>Energized coil electromagnet-এর মতো behave করে।</li>
          <li>Coil energizing relay action-এর শুরু।</li>
          <li>এই lesson coil behavior আলাদা করে relay learning সহজ করে।</li>
          <li>Coil বুঝলে full relay working principle follow করা সহজ হয়।</li>
          <li>অনেক practical relay circuit coil-control design দিয়েই শুরু হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
