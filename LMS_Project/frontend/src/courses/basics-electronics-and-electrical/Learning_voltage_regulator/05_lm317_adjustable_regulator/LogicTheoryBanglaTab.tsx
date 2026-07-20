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
      question: "LM317, 78xx regulator থেকে আলাদা কীভাবে?",
      answer:
        "LM317 adjustable, তাই এর output একটিমাত্র fixed value নয়; external resistor network দিয়ে output set করা যায়, যেখানে 7805 বা 7812-এর মতো regulator fixed output দেয়।",
    },
    {
      question: "LM317-কে adjustable regulator বলা হয় কেন?",
      answer:
        "কারণ এর output voltage part-এর ভিতরে fixed না থেকে adjust pin-এর চারপাশের resistor value বেছে set করা যায়।",
    },
    {
      question: "LM317 circuit-এ resistor network-এর কাজ কী?",
      answer:
        "Resistor network feedback relationship তৈরি করে, যার উপর ভিত্তি করে regulator VOUT control করে এবং output voltage set হয়।",
    },
    {
      question: "Adjust pin গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এই pin regulator-কে resistor-divider condition sense করতে দেয় এবং সেই অনুযায়ী output regulate করতে সাহায্য করে।",
    },
    {
      question: "LM317 কি এখনও linear regulator idea follow করে?",
      answer:
        "হ্যাঁ। এটি এখনও linear regulator, তাই internal voltage drop control করে এবং input output-এর চেয়ে বেশি হলে extra power heat হিসেবে নষ্ট হয়।",
    },
    {
      question: "Fixed regulator family শেখার পরে এই lesson useful কেন?",
      answer:
        "কারণ এটি দেখায় regulation fixed output model থেকে adjustable-output design-এ কীভাবে extend হয়।",
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
              LM317 Adjustable Regulator
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে LM317 regulator fixed output-এর
              বদলে adjustable output voltage দেয়, যেখানে standard 78xx
              regulator একটিমাত্র fixed output দেয়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো: LM317 এখনও linear
              regulator, কিন্তু এর output external resistor network দিয়ে set হয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই topic fixed-voltage regulator থেকে flexible regulated
              output design-এর দিকে একটি গুরুত্বপূর্ণ step।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Part Type" value="Adjustable Linear Regulator" tone="emerald" />
            <ValueCard label="Key Pin" value="Adjust" tone="violet" />
            <ValueCard label="Output Method" value="Set by Resistors" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="সহজভাবে LM317 কী?" eyebrow="Core Concept">
        <p>
          LM317 হলো একটি linear voltage regulator যার output একটিমাত্র fixed
          voltage-এ locked না থেকে different value-তে adjust করা যায়।
        </p>

        <p>
          এই কারণে এটি standard fixed regulator যেমন 7805-এর চেয়ে বেশি
          flexible।
        </p>

        <p>
          Beginner-দের জন্য adjustable regulation বোঝার সবচেয়ে common example-গুলোর
          একটি হলো LM317।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে adjustable বলা হয় কেন?" eyebrow="Variable Output">
        <p>
          Fixed regulator একটি built-in output voltage দেয়, কিন্তু LM317
          external component-এর মাধ্যমে output set করতে দেয়।
        </p>

        <p>
          Practicalভাবে এর মানে হলো designer resistor value বেছে একই regulator
          family থেকে different regulated output voltage পেতে পারে।
        </p>

        <p>
          এটাই fixed আর adjustable regulator-এর সবচেয়ে সহজ beginner difference।
        </p>
      </SectionCard>

      <SectionCard title="Adjust pin কী কাজ করে?" eyebrow="Feedback Control">
        <p>
          Adjust pin-ই LM317-কে simple fixed-output regulator থেকে আলাদা করে।
        </p>

        <p>
          এটি resistor network-এর সঙ্গে কাজ করে, যাতে regulator required
          output condition sense করতে পারে এবং সেই অনুযায়ী voltage control করতে পারে।
        </p>

        <p>
          এভাবেই output fixed না হয়ে settable হয়।
        </p>
      </SectionCard>

      <SectionCard title="LM317 circuit-এ resistor এত গুরুত্বপূর্ণ কেন?" eyebrow="Setting the Output">
        <p>
          Basic LM317 circuit-এ resistor pair feedback relationship define
          করে, যা output voltage determine করে।
        </p>

        <p>
          সাধারণত একটি resistor fixed রাখা হয়, আর অন্যটি change করে final
          output level adjust করা হয়।
        </p>

        <p>
          এই কারণেই lesson-এ resistor value বদলালে output-ও বদলাতে দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="LM317 এখনও linear regulator কীভাবে?" eyebrow="Same Core Behavior">
        <p>
          Output adjustable হলেও LM317 এখনও linear regulator-এর মতোই internal
          voltage drop control করে regulate করে।
        </p>

        <p>
          তাই এটি আগের linear regulator behavior-ই follow করে।
        </p>

        <p>
          এর মানে input output-এর তুলনায় বেশি হলে usual heat-loss tradeoff এখানেও থাকে।
        </p>
      </SectionCard>

      <SectionCard title="Input এখনও যথেষ্ট বেশি হতে হবে কেন?" eyebrow="Headroom Requirement">
        <p>
          Adjustable output থাকলেই sufficient input voltage-এর প্রয়োজন চলে যায় না।
        </p>

        <p>
          Chosen output-এর উপরে regulator-এর এখনও যথেষ্ট input দরকার হয়, যাতে
          এটি proper regulate করতে পারে।
        </p>

        <p>
          তাই LM317 flexible, কিন্তু magical নয়।
        </p>
      </SectionCard>

      <SectionCard title="Practical circuit-এ LM317 useful কেন?" eyebrow="Flexibility">
        <p>
          LM317 useful কারণ এক ধরনের regulator-ই অনেক different output voltage
          need-এর জন্য ব্যবহার করা যায়, শুধু resistor value change করে।
        </p>

        <p>
          এতে প্রতিটি ছোট voltage variation-এর জন্য আলাদা fixed regulator
          model রাখার দরকার কমে যায়।
        </p>

        <p>
          এটি learner-কে দেখায় কীভাবে circuit design choice regulator
          behavior set করে।
        </p>
      </SectionCard>

      <SectionCard title="আগের regulator lesson-গুলোর পর এটি কীভাবে fit করে?" eyebrow="Learning Progression">
        <p>
          আগের lesson-গুলো regulation-এর purpose, linear regulator working, আর
          fixed regulator family যেমন 78xx বোঝায়।
        </p>

        <p>
          এই lesson দেখায় output শুধু fixed part number বেছে নয়, circuit design
          choice দিয়েও set করা যায়।
        </p>

        <p>
          তাই LM317 design-oriented thinking-এর দিকে একটি গুরুত্বপূর্ণ bridge।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          LM317 মনে রাখার সবচেয়ে সহজ উপায় হলো fixed regulator-এর সাথে compare করা।
        </p>

        <p>
          Fixed regulator একটিমাত্র fixed output দেয়, আর LM317 resistor
          selection-এর মাধ্যমে regulated output value define করতে দেয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: LM317 একটি linear regulator, কিন্তু এর চারপাশের
          circuit final output voltage-কে flexible করে তোলে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>LM317 একটি adjustable linear regulator।</li>
          <li>এর output একটিমাত্র fixed internal value নয়; external resistor network দিয়ে set হয়।</li>
          <li>Adjust pin output control enable করার key feature।</li>
          <li>এটি এখনও same general linear regulation principle follow করে।</li>
          <li>Chosen output-এর উপরে যথেষ্ট input headroom এখনও দরকার হয়।</li>
          <li>এটি fixed regulator যেমন 78xx family-এর তুলনায় বেশি flexibility দেয়।</li>
          <li>এই lesson regulator behavior-কে circuit-based output setting-এর সাথে connect করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
