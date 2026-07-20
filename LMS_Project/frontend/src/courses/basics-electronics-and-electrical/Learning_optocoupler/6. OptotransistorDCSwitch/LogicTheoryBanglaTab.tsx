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
      question: "Optotransistor DC switch lessonটি কী নিয়ে?",
      answer:
        "এই lesson-এ বোঝানো হয়েছে কীভাবে transistor-type output-সহ একটি optocoupler low-voltage DC control signal দিয়ে আলাদা DC output circuit switch করতে পারে।",
    },
    {
      question: "এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি একটি practical isolated DC switching application দেখায়, যেখানে input side আর output side আলাদা power supply ব্যবহার করে।",
    },
    {
      question: "মূল beginner idea কী?",
      answer:
        "এক side-এর ছোট input signal direct electrical connection ছাড়াই অন্য side-এর DC load circuit control করতে পারে।",
    },
    {
      question: "এখানে optotransistor-এর কাজ কী?",
      answer:
        "Input LED থেকে optical energy পাওয়ার পরে optotransistor output-side switching element হিসেবে কাজ করে এবং output path on করে।",
    },
    {
      question: "দুইটি আলাদা DC source কেন দেখানো হয়েছে?",
      answer:
        "কারণ এতে বোঝানো হয় control circuit আর output circuit electrically separate থাকতে পারে, কিন্তু switching information light-এর মাধ্যমে transfer হয়।",
    },
    {
      question: "সবচেয়ে গুরুত্বপূর্ণ takeaway কী?",
      answer:
        "Optotransistor-based optocoupler safely এক DC circuit দিয়ে আরেক DC circuit isolate ও control করতে পারে।",
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
              Optotransistor DC Switch
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে optotransistor-based optocoupler
              একটি 5V control side দিয়ে আলাদা 12V DC output circuit switch করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ idea হলো এক DC circuit light-based isolation
              ব্যবহার করে অন্য DC circuit control করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এটি isolated DC switching-এর সবচেয়ে পরিষ্কার practical example-গুলোর
              একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Input Side" value="5V Control" tone="emerald" />
            <ValueCard label="Output Side" value="12V DC Load" tone="violet" />
            <ValueCard label="Main Function" value="Isolated Switching" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Optotransistor DC switch কী?" eyebrow="Topic Overview">
        <p>
          Optotransistor DC switch হলো এমন একটি circuit, যেখানে optocoupler-এর
          output transistor input LED side থেকে light পেয়ে DC output path
          control করে।
        </p>

        <p>
          Input side এক DC source ব্যবহার করতে পারে, আর output side অন্য DC
          source ব্যবহার করতে পারে।
        </p>

        <p>
          তাই এই lesson isolated DC-to-DC control behavior দেখায়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson practical কেন?" eyebrow="Real Circuit Use">
        <p>
          অনেক real electronic system-এ low-voltage controller দিয়ে অন্য DC
          supply বা load safely switch করতে হয়।
        </p>

        <p>
          এই lesson দেখায় direct electrical connection ছাড়াই সেটা কীভাবে করা
          যায়।
        </p>

        <p>
          তাই control-interface learning-এর জন্য এই topic খুব useful।
        </p>
      </SectionCard>

      <SectionCard title="Input side-এ কী ঘটে?" eyebrow="Input Action">
        <p>
          Input side small DC source, switch, আর resistor ব্যবহার করে
          optocoupler-এর internal LED drive করে।
        </p>

        <p>
          Input current flow করলে LED on হয় এবং optocoupler-এর ভিতরে light
          emit করে।
        </p>

        <p>
          এটিই switching process-এর starting point।
        </p>
      </SectionCard>

      <SectionCard title="Output side-এ কী ঘটে?" eyebrow="Output Action">
        <p>
          সেই light output optotransistor-এ পৌঁছে তাকে conduct করতে সাহায্য
          করে।
        </p>

        <p>
          Output transistor on হলে separate DC output circuit-এ current flow
          হতে পারে।
        </p>

        <p>
          এই example-এ output side একটি indicator LED path power করে।
        </p>
      </SectionCard>

      <SectionCard title="5V আর 12V supply আলাদা কেন?" eyebrow="Isolation Meaning">
        <p>
          আলাদা supply দেখানো হয়েছে যাতে বোঝা যায় control side আর output side
          একই power source share করতে বাধ্য নয়।
        </p>

        <p>
          Switching information direct electrical wiring দিয়ে নয়, light-এর
          মাধ্যমে transfer হয়।
        </p>

        <p>
          এটি optocoupler-এর সবচেয়ে গুরুত্বপূর্ণ real-world advantage-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="এখানে optotransistor useful কেন?" eyebrow="Output Device Choice">
        <p>
          Optotransistor DC circuit-এর জন্য strong এবং practical
          transistor-style output response দেয়।
        </p>

        <p>
          তাই এটি indicator switching, logic interface, আর other DC control
          task-এ suitable।
        </p>

        <p>
          এটি optocoupler-এ ব্যবহৃত সবচেয়ে common output device-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ উপায় হলো দুইটি আলাদা DC side-কে track করা।
        </p>

        <p>
          5V input side light পাঠায়, আর 12V output side optotransistor-এর
          মাধ্যমে on হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: optotransistor optocoupler one DC supply-কে
          another DC supply থেকে isolate রেখে switching control transfer করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>এই lesson optotransistor output দিয়ে isolated DC switching দেখায়।</li>
          <li>Input side এক DC source আর output side অন্য DC source ব্যবহার করে।</li>
          <li>Input current flow করলে LED side light পাঠায়।</li>
          <li>Optotransistor output-side DC path on করে।</li>
          <li>দুইটি circuit electrically separate থাকে।</li>
          <li>এটি practical DC control isolation-এর example।</li>
          <li>মূল idea হলো optical coupling দিয়ে DC-to-DC switching।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
