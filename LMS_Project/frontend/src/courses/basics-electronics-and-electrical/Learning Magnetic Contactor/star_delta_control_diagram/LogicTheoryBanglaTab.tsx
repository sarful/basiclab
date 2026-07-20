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
      question: "Simple DOL starter-এর বদলে star-delta starter কেন ব্যবহার করা হয়?",
      answer:
        "কারণ এটি motor-কে প্রথমে star mode-এ start করে starting current এবং starting stress কমায়, তারপর normal running-এর জন্য delta mode-এ transfer করে।",
    },
    {
      question: "এই lesson-এ START command দেওয়ার পর প্রথমে কী ঘটে?",
      answer:
        "প্রথমে main contactor path এবং star path energized হয়, ফলে motor star connection-এ start হয় এবং timer count শুরু করে।",
    },
    {
      question: "Star-delta circuit-এ timer কী কাজ করে?",
      answer:
        "Timer motor-কে star mode-এ accelerate করার জন্য একটি delay দেয়, তারপর circuit-কে delta mode-এ transfer করতে সাহায্য করে।",
    },
    {
      question: "Star আর delta-এর মাঝে transfer-open gap কেন রাখা হয়?",
      answer:
        "এই gap নিশ্চিত করে যে changeover-এর সময় star এবং delta contactor একসাথে ON না থাকে।",
    },
    {
      question: "Star আর delta কখনও একসাথে ON থাকা যাবে না কেন?",
      answer:
        "কারণ এতে একটি unsafe electrical condition তৈরি হয় এবং গুরুতর fault হতে পারে।",
    },
    {
      question: "Overload trip করলে কী হওয়া উচিত?",
      answer:
        "Control sequence drop-out হবে, contactor release করবে, এবং motor নিরাপদে stop করবে।",
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
              Star-Delta Control Diagram
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি star-delta starter timed switching
              ব্যবহার করে একটি three-phase motor-কে direct full-voltage start-এর তুলনায়
              আরও smooth ভাবে start করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল লক্ষ্য হলো start sequence, star থেকে delta-এ timer-controlled
              transfer, এবং safe changeover-এর জন্য interlocking logic বোঝা।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই lesson DOL starter theory-এর পরের practical ধাপ, বিশেষ করে বড় motor-এর
              ক্ষেত্রে যেখানে starting current কমানো জরুরি।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Start Mode" value="Star" tone="emerald" />
            <ValueCard label="Run Mode" value="Delta" tone="violet" />
            <ValueCard label="Transfer Logic" value="Timer" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Star-delta starter কেন ব্যবহার করা হয়?" eyebrow="Core Concept">
        <p>
          একটি star-delta starter ব্যবহার করা হয় যখন motor-কে start-এর সময় সরাসরি full heavy stress
          দেওয়া ঠিক নয়।
        </p>

        <p>
          এই circuit প্রথমে motor-কে star connection-এ start করে, তারপর পরে delta mode-এ change করে।
        </p>

        <p>
          এতে simple DOL method-এর তুলনায় starting current কমে এবং startup process আরও controlled হয়।
        </p>
      </SectionCard>

      <SectionCard title="Star mode আর delta mode-এর মূল ধারণা কী?" eyebrow="Two Running Stages">
        <p>
          এই lesson-এ <strong>star mode</strong> হলো starting stage।
        </p>

        <p>
          Motor কিছুটা accelerate করার পর circuit <strong>delta mode</strong>-এ change হয় normal running-এর জন্য।
        </p>

        <p>
          অর্থাৎ starter শুধু motor ON বা OFF করছে না, বরং sequence-এর প্রতিটি stage-এ motor কোন connection-এ থাকবে সেটাও ঠিক করছে।
        </p>
      </SectionCard>

      <SectionCard title="START চাপলে কী ঘটে?" eyebrow="Startup Sequence">
        <p>
          প্রথমে control circuit healthy থাকতে হবে: MCB ON, overload trip নয়, এবং কোনো active fault condition নেই।
        </p>

        <p>
          START command দেওয়ার পর main contactor path এবং star path প্রথমে energized হয়।
        </p>

        <p>
          ফলে motor star mode-এ start হয় এবং একই সাথে timer background-এ run শুরু করে।
        </p>
      </SectionCard>

      <SectionCard title="Timer কী কাজ করে?" eyebrow="Timer Logic">
        <p>
          Timer ঠিক করে কখন starter star mode ছেড়ে delta mode-এ যাওয়ার জন্য প্রস্তুত হবে।
        </p>

        <p>
          এর কাজ motor-কে নিজে start করা নয়, বরং সঠিক delay দেওয়া যাতে motor accelerate করতে পারে এবং তারপর next switching stage শুরু হয়।
        </p>

        <p>
          Timer না থাকলে transfer খুব তাড়াতাড়ি, খুব দেরিতে, বা unsafe overlap-এর সাথে হতে পারত।
        </p>
      </SectionCard>

      <SectionCard title="Transfer-open gap কেন রাখা হয়?" eyebrow="Safe Changeover">
        <p>
          Changeover-এর সময় delta contactor ON হওয়ার আগে star contactor অবশ্যই release করতে হবে।
        </p>

        <p>
          এই ছোট transfer-open gap দুইটি switching state-এর মাঝে safe separation তৈরি করে।
        </p>

        <p>
          এর উদ্দেশ্য হলো transition-এর সময় star এবং delta যেন একসাথে active না থাকে তা নিশ্চিত করা।
        </p>
      </SectionCard>

      <SectionCard title="Star আর delta একসাথে ON হওয়া যাবে না কেন?" eyebrow="Interlocking Rule">
        <p>
          Star এবং delta contactor কখনও একসাথে ON থাকা যাবে না।
        </p>

        <p>
          যদি overlap হয়, তাহলে circuit একটি abnormal এবং dangerous electrical condition-এ চলে যায়।
        </p>

        <p>
          এই কারণেই interlocking logic star-delta control diagram-এর সবচেয়ে গুরুত্বপূর্ণ ধারণাগুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Delta-এ transfer হওয়ার পর কী ঘটে?" eyebrow="Normal Running">
        <p>
          Timer-controlled transfer safely complete হওয়ার পর delta path active হয় normal motor running-এর জন্য।
        </p>

        <p>
          তখন startup stage শেষ হয় এবং motor তার regular running configuration-এ continue করে।
        </p>

        <p>
          পুরো sequence-এর শেষ লক্ষ্য হলো controlled starting এবং stable running।
        </p>
      </SectionCard>

      <SectionCard title="Sequence কীভাবে stop হয়?" eyebrow="Stop And Fault Response">
        <p>
          STOP command দিলে, MCB OFF করলে, বা overload protection trip করলে sequence stop হতে হবে।
        </p>

        <p>
          তখন contactor state drop-out করবে এবং motor একটি safe stopped condition-এ ফিরে যাবে।
        </p>

        <p>
          একটি ভালো starter শুধু সঠিকভাবে start করলেই হবে না, clean এবং safe ভাবে stop করতেও হবে।
        </p>
      </SectionCard>

      <SectionCard title="DOL-এর পর এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>
          DOL theory direct starting logic শেখায়, কিন্তু star-delta শেখায় staged starting process।
        </p>

        <p>
          তাই এখানে learner-কে শুধু simple ON/OFF switching নয়, sequence timing, transition state, এবং interlocking নিয়েও ভাবতে হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: star-delta control সবচেয়ে সহজে বোঝা যায় যদি এটিকে timed three-part sequence হিসেবে দেখা হয়: star-এ start, safely separate, তারপর delta-এ run।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Star-delta starter starting current এবং startup stress কমাতে ব্যবহৃত হয়।</li>
          <li>Motor প্রথমে star mode-এ start হয়।</li>
          <li>Timer changeover কখন হবে তা নিয়ন্ত্রণ করে।</li>
          <li>Transfer-open gap safe handover নিশ্চিত করে।</li>
          <li>Star আর delta কখনও একসাথে active থাকা যাবে না।</li>
          <li>Transfer-এর পর motor delta mode-এ normal running চালায়।</li>
          <li>Stop, trip, বা supply loss হলে system safe OFF state-এ ফিরতে হবে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
