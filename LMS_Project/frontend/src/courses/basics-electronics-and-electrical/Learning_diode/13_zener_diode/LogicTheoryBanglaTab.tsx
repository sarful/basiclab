"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";
import { getZenerState } from "./logic";

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
  const sample = getZenerState(7, 5.1, "reverse");

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Zener diode-কে normal diode থেকে আলাদা কী করে?",
      answer:
        "Zener diode এমনভাবে design করা হয় যাতে এটি নির্দিষ্ট Zener voltage-এ safely reverse breakdown-এ কাজ করতে পারে।",
    },
    {
      question: "Reverse voltage Zener voltage-এ পৌঁছালে কী হয়?",
      answer:
        "Diode breakdown-এ প্রবেশ করে এবং conduct শুরু করে, একই সঙ্গে voltage-কে তার Zener value-এর কাছাকাছি ধরে রাখে।",
    },
    {
      question: "Zener circuit-এ series resistor গুরুত্বপূর্ণ কেন?",
      answer:
        "এটি current limit করে, যাতে diode breakdown-এ থেকেও damage না হয়।",
    },
    {
      question: "Regulation-এর জন্য Zener diode useful কেন?",
      answer:
        "কারণ breakdown active হলে input বা load কিছুটা বদলালেও output voltage সাধারণত Zener voltage-এর কাছাকাছি থাকে।",
    },
    {
      question: "Zener diode forward bias-এও কাজ করে কি?",
      answer:
        "হ্যাঁ। Forward bias-এ এটি সাধারণ silicon diode-এর মতো প্রায় 0.7 V drop নিয়ে behave করে।",
    },
    {
      question: "Reverse bias-এ Zener voltage-এর নিচে কী হয়?",
      answer:
        "Diode breakdown-এ যায় না, তাই reverse current খুব ছোট থাকে এবং clamping হয় না।",
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
              Zener Diode
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Zener diode হলো special diode, যা safely reverse breakdown-এ কাজ
              করার জন্য তৈরি করা হয়, যাতে এটি প্রায় constant voltage ধরে
              রাখতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল ফোকাস হলো Zener voltage, reverse breakdown,
              voltage clamping, current limiting, এবং simple regulator
              circuit-এ Zener diode এত বেশি ব্যবহৃত হয় কেন।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              Reference এবং protection task-এর জন্য এটি সবচেয়ে গুরুত্বপূর্ণ
              practical diode-গুলোর একটি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Zener Voltage" value="5.1 V" tone="violet" />
            <ValueCard label="Output Clamp" value={`${sample.outputVoltage.toFixed(2)} V`} tone="emerald" />
            <ValueCard label="Current" value={`${sample.currentMA.toFixed(1)} mA`} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Zener diode কী?" eyebrow="Core Concept">
        <p>
          Zener diode হলো এমন একটি diode, যা controlled reverse-bias
          operation-এর জন্য বিশেষভাবে design করা হয়।
        </p>

        <p>
          Ordinary diode-এর বিপরীতে, এটি নির্দিষ্ট voltage-এ reverse breakdown-এ
          প্রবেশ করার জন্য তৈরি, এবং current limit থাকলে এটি নষ্ট হয় না।
        </p>

        <p>
          তাই এটি শুধু rectification নয়, voltage control-এর জন্যও useful।
        </p>
      </SectionCard>

      <SectionCard title="Zener voltage কী?" eyebrow="Breakdown Point">
        <p>
          Zener voltage, যাকে সাধারণত <strong>Vz</strong> লেখা হয়, হলো সেই
          reverse voltage যেখানে diode breakdown conduction শুরু করে।
        </p>

        <p>
          এই point-এ পৌঁছানোর পরে diode reverse direction-এ শক্তভাবে conduct
          করতে শুরু করে এবং voltage-কে সেই value-এর কাছাকাছি ধরে রাখে।
        </p>

        <p>
          এই property-টাই regulator circuit-এ Zener diode-কে valuable করে তোলে।
        </p>
      </SectionCard>

      <SectionCard title="Reverse breakdown কীভাবে সাহায্য করে?" eyebrow="Voltage Clamping">
        <p>
          Reverse bias-এ Zener voltage-এর নিচে current খুব ছোট থাকে।
        </p>

        <p>
          Reverse voltage Zener voltage-এ পৌঁছালে বা তা অতিক্রম করলে diode
          breakdown-এ প্রবেশ করে এবং conduct শুরু করে।
        </p>

        <p>
          তখন diode conduct করার সময় তার across voltage supply-এর সঙ্গে
          ইচ্ছামতো বাড়ে না, বরং Zener voltage-এর কাছাকাছি থাকে।
        </p>

        <p>
          <strong>
            Checkpoint Question: input voltage যদি Zener voltage-এর উপরে ওঠে,
            তাহলে diode-এর across কোন quantity প্রায় fixed থাকে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Series resistor কেন দরকার?" eyebrow="Current Limiting">
        <p>
          Zener diode-কে current limiting ছাড়া সরাসরি strong supply-এর across
          সংযোগ করা উচিত নয়।
        </p>

        <p>
          Series resistor অতিরিক্ত voltage absorb করে এবং diode-এর মধ্য দিয়ে
          flow হওয়া current limit করে।
        </p>

        <p>
          এই resistor না থাকলে breakdown current খুব বেশি হয়ে diode damage
          করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Zener diode regulator হিসেবে useful কেন?" eyebrow="Regulation">
        <p>
          Regulator circuit-এর কাজ হলো output voltage-কে তুলনামূলক steady রাখা।
        </p>

        <p>
          Zener reverse breakdown-এ থাকলে input voltage বা load কিছুটা বদলালেও
          output সাধারণত Zener voltage-এর কাছাকাছি থাকতে পারে।
        </p>

        <p>
          এ কারণেই Zener diode simple এবং practical voltage reference বা clamp
          হিসেবে ব্যবহৃত হয়।
        </p>
      </SectionCard>

      <SectionCard title="Load condition circuit-কে কীভাবে প্রভাবিত করে?" eyebrow="Load Effect">
        <p>
          Load available current-এর একটি অংশ নিয়ে নেয়, আর বাকি অংশ Zener
          ব্যবহার করে।
        </p>

        <p>
          Heavier load মানে বেশি load current, ফলে Zener diode-এর জন্য কম
          current বাকি থাকে।
        </p>

        <p>
          Load খুব heavy হয়ে গেলে diode breakdown থেকে বেরিয়ে আসতে পারে, আর
          regulation effect দুর্বল হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Forward bias-এ কী হয়?" eyebrow="Comparison Mode">
        <p>
          Forward bias-এ Zener diode অনেকটাই normal silicon diode-এর মতো
          behave করে।
        </p>

        <p>
          এটি সাধারণত প্রায় 0.7 V forward drop-এর কাছাকাছি conduct শুরু করে।
        </p>

        <p>
          তাই Zener diode-এর special behavior মূলত reverse breakdown নিয়ে,
          forward conduction নিয়ে নয়।
        </p>
      </SectionCard>

      <SectionCard title="এখানে breakdown safe কিন্তু normal diode-এ unsafe কেন?" eyebrow="Device Design">
        <p>
          Ordinary diode সাধারণ ব্যবহারে reverse breakdown-এ থাকার জন্য তৈরি
          করা হয় না।
        </p>

        <p>
          Zener diode এমনভাবে manufacture করা হয় যাতে নির্দিষ্ট reverse
          voltage-এ controlled breakdown ঘটে।
        </p>

        <p>
          এই controlled construction-ই একে reliable clamping device হিসেবে
          কাজ করতে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="মূল ব্যবহারিক নিয়ম" eyebrow="Formula-Free Idea">
        <p>
          Zener diode বোঝার সহজ উপায় হলো এটিকে reverse-bias voltage clamp
          হিসেবে ভাবা।
        </p>

        <p>
          Zener voltage-এর নিচে খুব কম কিছু ঘটে। Voltage breakdown level-এ
          পৌঁছালে diode conduct করে এবং voltage-কে Vz-এর কাছে ধরে রাখে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: Zener diode voltage stabilize বা limit করতে পারে,
          কিন্তু current safe রাখতে অবশ্যই proper series resistor লাগবে।
        </p>
      </SectionCard>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Application Insight">
        <p>
          Zener diode simple voltage regulator, voltage reference circuit, এবং
          overvoltage protection design-এ ব্যবহার করা হয়।
        </p>

        <p>
          যখন circuit-এ কম খরচে একটি known level-এ voltage hold বা cap করা
          দরকার হয়, তখন এটি বিশেষভাবে useful।
        </p>

        <p>
          এই lesson breakdown conduction এবং clamp behavior দুটোই দেখিয়ে সেই
          practical idea-টাই mirror করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Zener diode controlled reverse breakdown-এর জন্য তৈরি।</li>
          <li>Zener voltage হলো সেই breakdown voltage যেখানে clamping শুরু হয়।</li>
          <li>Breakdown-এ diode voltage-কে Vz-এর কাছাকাছি ধরে রাখে।</li>
          <li>Current safely limit করতে series resistor প্রয়োজন।</li>
          <li>Zener diode simple regulation এবং protection-এর জন্য useful।</li>
          <li>Heavy load বেশি current নিয়ে regulation দুর্বল করতে পারে।</li>
          <li>Forward bias-এ diode normal silicon diode-এর মতো behave করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
