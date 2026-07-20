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
      question: "Voltage regulator-এর মূল কাজ কী?",
      answer:
        "এর মূল কাজ হলো input voltage বা load condition কিছুটা বদলালেও operating range-এর মধ্যে output voltage-কে যতটা সম্ভব stable রাখা।",
    },
    {
      question: "Battery বা supply voltage থাকলেই regulator দরকার হয় কেন?",
      answer:
        "কারণ raw supply voltage বাড়তে, কমতে, বা fluctuate করতে পারে, কিন্তু অনেক circuit আরও controlled এবং predictable voltage level চায়।",
    },
    {
      question: "Basic regulator package-এ input, ground, আর output বলতে কী বোঝায়?",
      answer:
        "Input unregulated source গ্রহণ করে, ground reference point দেয়, আর output circuit-এ regulated voltage পৌঁছে দেয়।",
    },
    {
      question: "7805 family beginner lesson-এ এত common কেন?",
      answer:
        "কারণ এটি একটি simple fixed-voltage linear regulator, যা higher DC input থেকে stable 5 V output পাওয়ার ধারণা খুব পরিষ্কারভাবে শেখায়।",
    },
    {
      question: "Raw input আর regulated output-এর সবচেয়ে সহজ difference কী?",
      answer:
        "Raw input তুলনামূলকভাবে বেশি vary করতে পারে, আর regulated output ইচ্ছাকৃতভাবে target value-এর কাছে রাখা হয় যেন circuit safer এবং more reliableভাবে operate করে।",
    },
    {
      question: "Deeper regulator topic-এর আগে এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি beginner-কে regulator কেন লাগে, এর তিনটি terminal কীভাবে কাজ করে, আর stable DC output electronic circuit-কে কীভাবে support করে তার basic mental model তৈরি করে।",
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
              What Is a Voltage Regulator?
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কেন একটি voltage regulator raw supply
              line-এর তুলনায় DC output-কে আরও stable এবং useful রাখে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে সহজ beginner idea হলো: অনেক electronic circuit
              uncontrolled supply চায় না, তারা একটি predictable working
              voltage চায়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই কারণেই lesson-টি regulator-এর purpose, তার three terminals,
              এবং stable output-এর basic idea-এর উপর focus করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Job" value="Stable Output" tone="emerald" />
            <ValueCard label="Basic Part" value="Input-GND-Output" tone="violet" />
            <ValueCard label="Beginner Example" value="7805 Regulator" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="সহজ ভাষায় voltage regulator কী?" eyebrow="Core Concept">
        <p>
          Voltage regulator হলো এমন একটি circuit বা device যা load-এর জন্য
          output voltage-কে desired value-এর কাছাকাছি রাখে।
        </p>

        <p>
          Raw supply variation সরাসরি circuit-এ পাঠানোর বদলে regulator
          তুলনামূলকভাবে আরও controlled DC output দেওয়ার চেষ্টা করে।
        </p>

        <p>
          এই কারণেই এটি electronics-এর সবচেয়ে practical building block-গুলোর
          একটি।
        </p>
      </SectionCard>

      <SectionCard title="Regulation দরকার কেন?" eyebrow="Why It Matters">
        <p>
          Adapter, battery, বা upstream power stage-এর মতো source সবসময় সেই
          exact voltage-এ থাকতে নাও পারে, যা একটি sensitive circuit চায়।
        </p>

        <p>
          Input voltage বদলাতে পারে, load current বদলাতে পারে, আর useful
          operating condition shift করতে পারে।
        </p>

        <p>
          Regulator downstream circuit-কে এই পরিবর্তনের মধ্যেও safer এবং more
          predictable রাখতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="তিনটি terminal-এর মানে কী?" eyebrow="Pin Logic">
        <p>
          Basic regulator package সাধারণত তিনটি terminal দিয়ে শেখানো হয়:
          input, ground, এবং output।
        </p>

        <p>
          Input unregulated supply নেয়, ground reference point হিসেবে কাজ
          করে, আর output regulated voltage load-এ পাঠায়।
        </p>

        <p>
          একবার এই terminal logic clear হলে beginner regulator circuit অনেক
          সহজে বোঝা যায়।
        </p>
      </SectionCard>

      <SectionCard title="7805 এত common example কেন?" eyebrow="Familiar Device">
        <p>
          7805 একটি classic fixed linear regulator, যা higher DC input থেকে
          প্রায় 5 V output দিতে ব্যবহৃত হয়।
        </p>

        <p>
          Beginner lesson-এ এটি popular কারণ এর কাজ খুব সহজে বোঝানো যায়:
          higher input নাও, আর suitable condition-এ stable 5 V output দাও।
        </p>

        <p>
          তাই regulation idea শেখানোর জন্য এটি খুব শক্তিশালী example।
        </p>
      </SectionCard>

      <SectionCard title="Raw input আর regulated output-এর difference কী?" eyebrow="Input vs Output">
        <p>
          Raw input হলো সেই original supply যা regulator-এ ঢোকে, এবং এটি
          তুলনামূলকভাবে কম controlled হতে পারে।
        </p>

        <p>
          Regulated output হলো সেই voltage যা regulator circuit-এর জন্য তার
          target value-এর কাছাকাছি রাখতে চেষ্টা করে।
        </p>

        <p>
          এই difference-ই lesson-এর মূল কথা: supply ঢোকে, stable usable
          voltage বের হয়।
        </p>
      </SectionCard>

      <SectionCard title="Ground এখানে গুরুত্বপূর্ণ কেন?" eyebrow="Reference Point">
        <p>
          Voltage সবসময় একটি reference-এর relative term, আর basic regulator
          lesson-এ ground সেই reference দেয়।
        </p>

        <p>
          Clear reference point ছাড়া input আর output voltage label-এর
          practical meaning থাকত না।
        </p>

        <p>
          এই কারণেই ground regulator-এর essential terminal-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Regulator কি energy তৈরি করে?" eyebrow="Correct Intuition">
        <p>
          না, regulator নিজে extra energy বা voltage শূন্য থেকে তৈরি করে না।
        </p>

        <p>
          এর কাজ হলো input supply load-এ কীভাবে controlled, shaped, এবং
          stabilizedভাবে পৌঁছাবে তা ঠিক করা।
        </p>

        <p>
          এতে beginner voltage regulation-কে voltage generation-এর সঙ্গে
          গুলিয়ে ফেলে না।
        </p>
      </SectionCard>

      <SectionCard title="Stable output electronics-এর জন্য এত useful কেন?" eyebrow="Practical Use">
        <p>
          অনেক IC, sensor, logic circuit, আর small controller তখনই ভালো কাজ
          করে যখন তাদের supply known value-এর কাছে থাকে।
        </p>

        <p>
          Voltage খুব বেশি swing করলে circuit ভুল behave করতে পারে, reset
          হতে পারে, ভুলভাবে heat হতে পারে, বা unreliable হয়ে যেতে পারে।
        </p>

        <p>
          Regulator এই supply condition improve করার সবচেয়ে সহজ tool-গুলোর
          একটি।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          Topic-টা বোঝার সবচেয়ে সহজ উপায় হলো একটি flow মনে রাখা।
        </p>

        <p>
          Raw DC regulator-এ আসে, regulator ground-কে reference নেয়, আর
          circuit-এ আরও steadier output পাঠায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: যখন কোনো circuit raw source-এর চেয়ে আরও
          dependable DC supply চায়, তখন আমরা voltage regulator ব্যবহার করি।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage regulator load-এর জন্য output voltage-কে আরও stable রাখতে সাহায্য করে।</li>
          <li>এটি দরকার হয় কারণ raw supply voltage vary করতে পারে বা কম controlled হতে পারে।</li>
          <li>এর তিনটি basic terminal হলো input, ground, এবং output।</li>
          <li>7805 fixed linear regulation শেখানোর একটি common beginner example।</li>
          <li>Raw input আর regulated output এক জিনিস নয়।</li>
          <li>Ground voltage meaning-এর reference point দেয়।</li>
          <li>Regulator energy delivery control করে; এটি শূন্য থেকে energy তৈরি করে না।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
