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
      question: "SSR40DA Relay কী?",
      answer:
        "SSR40DA একটি solid state relay, যা low-power control input ব্যবহার করে mechanical contact ছাড়া AC load switch করতে পারে।",
    },
    {
      question: "এটিকে solid state relay বলা হয় কেন?",
      answer:
        "কারণ এটি switching-এর জন্য semiconductor device ব্যবহার করে, coil-driven armature আর mechanical contact system ব্যবহার করে না।",
    },
    {
      question: "SSR40DA-এর basic purpose কী?",
      answer:
        "এর কাজ হলো control side আর load side-এর মধ্যে isolation রেখে load-কে electronically switch করা।",
    },
    {
      question: "SSR আর electromagnetic relay-এর মধ্যে পার্থক্য কী?",
      answer:
        "Electromagnetic relay-এ moving contact থাকে, কিন্তু SSR-এ optocoupler আর power switching device-এর মতো electronic part থাকে।",
    },
    {
      question: "Modern control circuit-এ SSR useful কেন?",
      answer:
        "কারণ এটি silent operation, fast switching, long life, আর কম mechanical wear দেয়।",
    },
    {
      question: "এই lesson-এ learner-এর focus কী হওয়া উচিত?",
      answer:
        "Learner-এর focus হওয়া উচিত যে SSR load-কে electronically switch করে এবং physical contact movement ব্যবহার করে না।",
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
              SSR40DA Relay
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ SSR40DA solid state relay-এর basic idea বোঝানো হয়েছে,
              যা mechanical contact ছাড়া load switch করতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ concept হলো control side আর load side-এর মধ্যে
              switching electronicভাবে হয়, moving metal contact দিয়ে নয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই SSR-এর operation traditional relay-এর থেকে আলাদা।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Relay Type" value="Solid State" tone="emerald" />
            <ValueCard label="Switching Style" value="Electronic" tone="violet" />
            <ValueCard label="Mechanical Parts" value="None" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="SSR40DA Relay কী?" eyebrow="Topic Overview">
        <p>
          SSR40DA একটি solid state relay, যা mechanical contact mechanism-এর
          বদলে electronic control method ব্যবহার করে load switch করে।
        </p>

        <p>
          সাধারণত এটি low-power control signal নেয় এবং সেই signal দিয়ে
          higher-power AC load side control করে।
        </p>

        <p>
          তাই এই lesson এমন এক relay type introduce করে, যেটি moving contact
          ছাড়াই কাজ করে।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে solid state relay বলা হয় কেন?" eyebrow="Naming Logic">
        <p>
          এটিকে solid state বলা হয় কারণ switching action semiconductor
          device-এর মাধ্যমে হয়।
        </p>

        <p>
          Electromagnetic relay-এর মতো এখানে armature এক contact point থেকে
          আরেকটিতে physically move করে না।
        </p>

        <p>এটাই learner-এর জন্য প্রথম গুরুত্বপূর্ণ contrast।</p>
      </SectionCard>

      <SectionCard title="Control side কীভাবে load side-কে সাহায্য করে?" eyebrow="Isolation Idea">
        <p>
          SSR-এ control side একটি small signal দেয়, যা internal electronic
          switching stage activate করে।
        </p>

        <p>
          সেই stage load side-কে on বা off করে, কিন্তু direct mechanical
          contact movement ব্যবহার করে না।
        </p>

        <p>এতে compact form-এ control-to-load isolation পাওয়া যায়।</p>
      </SectionCard>

      <SectionCard title="SSR normal relay থেকে কীভাবে আলাদা?" eyebrow="Relay Comparison">
        <p>
          Normal electromagnetic relay-এ coil, armature, আর mechanical contact
          থাকে।
        </p>

        <p>
          কিন্তু SSR-এ optocoupler আর power switching device-এর মতো internal
          electronic part switching-এর কাজ করে।
        </p>

        <p>
          এই কারণেই SSR silently operate করে এবং mechanical contact wear এড়ায়।
        </p>
      </SectionCard>

      <SectionCard title="Practical use-এ SSR useful কেন?" eyebrow="Practical Advantage">
        <p>
          SSR useful যেখানে silent switching, fast response, আর long operating
          life দরকার।
        </p>

        <p>
          Moving contact না থাকায় traditional relay-এর তুলনায় mechanical wear
          কম হয়।
        </p>

        <p>
          এই কারণে automation আর industrial control application-এ SSR অনেক
          popular।
        </p>
      </SectionCard>

      <SectionCard title="Beginner-দের focus কী হওয়া উচিত?" eyebrow="Beginner Focus">
        <p>
          Beginner-দের প্রথমে switching concept-এর ওপর focus করা উচিত, full
          semiconductor detail-এর ওপর নয়।
        </p>

        <p>
          মূল idea হলো: SSR load-কে electronically switch করে এবং physical
          metal contact movement ব্যবহার করে না।
        </p>

        <p>
          এই idea clear হলে learner পরে internal SSR circuit আরও সহজে বুঝতে
          পারবে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ memory rule কী?" eyebrow="Formula-Free Idea">
        <p>সবচেয়ে সহজ rule হলো normal relay-এর সাথে compare করা।</p>

        <p>
          Normal relay moving contact দিয়ে switch করে। SSR electronics দিয়ে
          switch করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: SSR40DA load-কে relay-এর মতো control করে, কিন্তু
          switching কাজটি semiconductor circuitry দিয়ে করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SSR40DA একটি solid state relay।</li>
          <li>এটি mechanical contact ছাড়া load switch করে।</li>
          <li>Control side internal electronic switching activate করে।</li>
          <li>এটি electromagnetic relay-এর থেকে আলাদা।</li>
          <li>SSR operation silent এবং mechanical wear কম।</li>
          <li>এটি modern control ও automation system-এ useful।</li>
          <li>মূল beginner idea হলো contact movement-এর বদলে electronic switching।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
