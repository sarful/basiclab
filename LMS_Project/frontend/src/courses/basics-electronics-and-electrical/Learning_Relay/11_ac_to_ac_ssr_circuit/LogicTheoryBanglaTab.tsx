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
      question: "AC to AC SSR circuit কী?",
      answer:
        "AC to AC SSR circuit হলো এমন একটি arrangement যেখানে control signal ব্যবহার করে solid state relay-এর মাধ্যমে electronically AC load switch করা হয়।",
    },
    {
      question: "DC to DC SSR-এর পরে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি দেখায় load type বদলালে SSR application-ও বদলায়, আর AC load switching-এর নিজস্ব practical behavior ও circuit structure আছে।",
    },
    {
      question: "এই lesson-এর মূল beginner idea কী?",
      answer:
        "Learner-এর বোঝা উচিত যে SSR control আর load function আলাদা রেখে electronically AC load control করছে।",
    },
    {
      question: "এটি DC to DC SSR circuit থেকে কীভাবে আলাদা?",
      answer:
        "মূল পার্থক্য হলো output side। এখানে load side AC based, তাই lesson-এ AC switching application-এর ওপর focus করা হয়েছে।",
    },
    {
      question: "AC load control-এ SSR useful কেন?",
      answer:
        "কারণ এটি silent, fast, এবং electronically controlled switching দেয়, mechanical contact wear ছাড়াই।",
    },
    {
      question: "Learner-এর circuit-এ কী observe করা উচিত?",
      answer:
        "Control input কীভাবে SSR-কে command দেয় এবং SSR তারপর external circuit-এ AC load path control করে - এটি observe করা উচিত।",
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
              AC to AC SSR Circuit
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি solid state relay AC to AC
              relay circuit arrangement-এ electronically AC load switch করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো control action relay-কে command দেয়,
              আর output side AC load path handle করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson learner-কে SSR theory থেকে practical AC load control-এ
              নিয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Role" value="Control Signal" tone="emerald" />
            <ValueCard label="Output Role" value="AC Load" tone="violet" />
            <ValueCard label="Switching Style" value="Electronic" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="AC to AC SSR circuit কী?" eyebrow="Topic Overview">
        <p>
          AC to AC SSR circuit হলো একটি practical SSR application, যেখানে relay
          electronically AC load path control করে।
        </p>

        <p>
          External circuit এমনভাবে arranged থাকে যাতে SSR control action আর AC
          load-এর মধ্যে switching link হিসেবে কাজ করে।
        </p>

        <p>তাই এই lesson বাস্তব AC load switching application-এর ওপর focus করে।</p>
      </SectionCard>

      <SectionCard title="এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>
          আগের lesson-গুলোতে SSR definition, internal structure, আর DC load
          application শেখানো হয়েছে।
        </p>

        <p>
          এই lesson সেই understanding-কে AC load control-এর দিকে expand করে,
          যা practical system-এ খুব common।
        </p>

        <p>
          এটি দেখায় actual output type-এর context-এ SSR behavior বোঝা দরকার।
        </p>
      </SectionCard>

      <SectionCard title="Beginner-দের প্রথমে কী দেখা উচিত?" eyebrow="Beginner Focus">
        <p>
          প্রথমে বুঝতে হবে control side আর load side এখনও আলাদা role পালন করে।
        </p>

        <p>
          Control side switching command দেয়, আর output side AC load path handle
          করে।
        </p>

        <p>এই cause-and-effect relation-টাই lesson-এর core।</p>
      </SectionCard>

      <SectionCard title="এটি DC to DC SSR থেকে কীভাবে আলাদা?" eyebrow="AC vs DC Application">
        <p>DC to DC SSR lesson-এ switched load side DC based থাকে।</p>

        <p>
          কিন্তু এই lesson-এ switched load side AC based, তাই output application
          context আলাদা।
        </p>

        <p>
          এই পার্থক্য গুরুত্বপূর্ণ, কারণ relay application অনেকটাই load type-এর
          ওপর নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="AC load control-এ SSR useful কেন?" eyebrow="Practical Advantage">
        <p>
          SSR useful কারণ এটি moving contact ছাড়াই silently AC load switch
          করতে পারে।
        </p>

        <p>
          এতে mechanical wear কমে যায় এবং অনেক application-এ switching life
          বাড়তে পারে।
        </p>

        <p>
          এই কারণে heater, lamp, industrial load, আর automation system-এ SSR
          popular।
        </p>
      </SectionCard>

      <SectionCard title="Circuit view কী explain করতে সাহায্য করে?" eyebrow="Applied Observation">
        <p>
          Circuit view control input, relay switching role, আর AC load response
          একসাথে track করতে সাহায্য করে।
        </p>

        <p>
          তাই learner শুধু SSR-এর definition পড়ে না, বরং circuit application-ও
          বোঝে।
        </p>

        <p>এটি theory topic-কে practical circuit lesson-এ পরিণত করে।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>সবচেয়ে সহজ rule হলো circuit-কে command side আর load side-এ ভাগ করা।</p>

        <p>
          Control action SSR-কে বলে কী করতে হবে, আর SSR তারপর electronically AC
          load path control করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: AC to AC SSR circuit-এ control signal safely AC
          load path-কে electronic relay switching-এর মাধ্যমে command করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>AC to AC SSR circuit AC load switching-এর জন্য ব্যবহৃত হয়।</li>
          <li>Control side আর load side এখনও আলাদা role পালন করে।</li>
          <li>এই lesson-এ output side AC based।</li>
          <li>SSR moving contact ছাড়াই electronic switching দেয়।</li>
          <li>এটি practical AC load application-এ useful।</li>
          <li>Circuit view command-to-load behavior বোঝায়।</li>
          <li>মূল idea হলো safely electronic AC load control।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
