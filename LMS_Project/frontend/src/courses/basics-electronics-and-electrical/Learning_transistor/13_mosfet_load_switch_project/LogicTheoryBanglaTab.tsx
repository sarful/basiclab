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
      question: "এই MOSFET load switch project-এর মূল ধারণা কী?",
      answer:
        "এখানে একটি N-channel MOSFET low-side electronic switch হিসেবে কাজ করে, যাতে ছোট gate-control action দিয়ে LED load path অন বা অফ করা যায়।",
    },
    {
      question: "এটিকে low-side switch বলা হয় কেন?",
      answer:
        "কারণ NMOS-টি load আর ground-এর মাঝের return path-এ বসানো থাকে, তাই এটি positive supply side নয়, বরং ground-return path control করে।",
    },
    {
      question: "Control switch বন্ধ করলে কী হয়?",
      answer:
        "Gate battery voltage-এর দিকে উঠে যায়, VGS threshold-এর ওপরে যায়, আর NMOS load current conduct করতে পারে।",
    },
    {
      question: "Pull-down resistor কেন গুরুত্বপূর্ণ?",
      answer:
        "এটি control switch open থাকলে gate-কে source level-এর কাছাকাছি ধরে রাখে, ফলে MOSFET accidental floating ON state-এ চলে যায় না।",
    },
    {
      question: "LED-এর সাথে MOSFET আর series resistor দুটোই কেন দরকার?",
      answer:
        "MOSFET current flow হবে কি না তা control করে, আর LED resistor current-কে safe এবং visible operating value-এর মধ্যে limit করে।",
    },
    {
      question: "Gate voltage-এর চেয়ে VGS বেশি গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ MOSFET turn-on gate voltage relative to source-এর উপর নির্ভর করে, শুধু gate-এর absolute voltage number-এর উপর নয়।",
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
              MOSFET Load Switch Project
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ দেখানো হয়েছে কীভাবে একটি N-channel MOSFET practical
              low-side load switch হিসেবে gate voltage ব্যবহার করে LED path
              control করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই project MOSFET theory-কে একটি real switching circuit-এর সাথে
              যুক্ত করে: battery source, control switch, pull-down resistor,
              MOSFET gate, আর LED load path একসাথে কাজ করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই lesson 13 device behavior থেকে usable electronic control
              circuit-এর দিকে একটি practical bridge তৈরি করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Switch Type" value="NMOS Low-Side" tone="emerald" />
            <ValueCard label="Turn-On Rule" value="VGS Above Threshold" tone="violet" />
            <ValueCard label="Load Example" value="LED Path Control" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="এই project কী শেখাতে চায়?" eyebrow="Practical Goal">
        <p>
          এই project-এর মূল উদ্দেশ্য হলো দেখানো যে MOSFET শুধু device symbol
          বা region diagram নয়, বরং একটি working circuit-এর practical
          electronic switch-ও।
        </p>

        <p>
          এই lesson-এ N-channel MOSFET ঠিক করে LED load loop complete থাকবে,
          না broken থাকবে।
        </p>

        <p>
          এর ফলে learner abstract MOSFET behavior-কে visible load switching-এর
          সাথে connect করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="এটিকে low-side switch বলা হয় কেন?" eyebrow="Circuit Position">
        <p>
          MOSFET-টি load-এর ground-return side-এ বসানো থাকে, positive supply
          side-এ নয়।
        </p>

        <p>
          অর্থাৎ LED আর resistor MOSFET-এর ওপরে থাকে, আর NMOS control করে
          current ground-এ ফিরতে পারবে কি না।
        </p>

        <p>
          এই arrangement-কে low-side switching বলা হয়, এবং এটি N-channel
          MOSFET-এর সবচেয়ে common practical use-এর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Control switch বন্ধ করলে কী হয়?" eyebrow="Gate Drive Action">
        <p>
          যখন control switch বন্ধ হয়, gate battery voltage-এর দিকে উঠে যায়।
        </p>

        <p>
          এই project-এ source ground-এর কাছাকাছি থাকে, তাই gate-to-source
          voltage বাড়ে এবং NMOS threshold-এর ওপরে যেতে পারে।
        </p>

        <p>
          একবার VGS যথেষ্ট বড় হলে NMOS একটি usable conduction path তৈরি করে
          এবং load current flow করতে দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Control switch খুললে কী হয়?" eyebrow="Gate Safe-Off State">
        <p>
          যখন control switch open হয়, gate-এ সরাসরি drive path আর থাকে না।
        </p>

        <p>
          তখন pull-down path gate-কে source level-এর কাছাকাছি ধরে রাখে, ফলে
          useful conduction-এর জন্য VGS যথেষ্ট থাকে না।
        </p>

        <p>
          এতে NMOS আবার OFF state-এ ফিরে যায় এবং load current path ভেঙে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Pull-down resistor এত গুরুত্বপূর্ণ কেন?" eyebrow="Gate Stability">
        <p>
          MOSFET gate floating রেখে দেওয়া উচিত নয়, কারণ floating gate charge
          ধরে রাখতে পারে এবং unpredictable switching behavior তৈরি করতে পারে।
        </p>

        <p>
          Pull-down resistor একটি controlled path দেয়, যা control switch open
          থাকলে gate-কে zero volt-এর কাছাকাছি রাখে।
        </p>

        <p>
          এতে OFF condition stable, safe, এবং beginner-এর জন্য সহজে বোঝার
          মতো হয়।
        </p>
      </SectionCard>

      <SectionCard title="LED resistor কেন matter করে?" eyebrow="Load Protection">
        <p>
          MOSFET ঠিক করে current flow হবে কি না, কিন্তু এটি একা safe load
          current value নিশ্চিত করে না।
        </p>

        <p>
          LED-এর সাথে series resistor current limit করে, যাতে LED
          overstress না হয়ে visibleভাবে জ্বলে।
        </p>

        <p>
          এটি একটি গুরুত্বপূর্ণ practical rule শেখায়: switching control আর
          current limiting একই circuit-এ আলাদা কাজ।
        </p>
      </SectionCard>

      <SectionCard title="VGS-ই আসল turn-on variable কেন?" eyebrow="Gate-Source Logic">
        <p>
          অনেক beginner শুরুতে শুধু gate voltage number দেখে, কিন্তু MOSFET
          আসলে gate voltage relative to source অনুযায়ী turn on হয়।
        </p>

        <p>
          এই lesson-এ source ground-এর কাছাকাছি থাকে, তাই gate বাড়ালে VGS-ও
          খুব সহজে বাড়ে।
        </p>

        <p>
          এই কারণেই project-টি gate-source voltage gate voltage-এর চেয়ে বেশি
          গুরুত্বপূর্ণ কেন, তার একটি পরিষ্কার introduction দেয়।
        </p>
      </SectionCard>

      <SectionCard title="পুরো current path কীভাবে কাজ করে?" eyebrow="Complete Loop">
        <p>
          NMOS ON থাকলে current battery থেকে LED resistor হয়ে, LED-এর মধ্য
          দিয়ে, MOSFET drain-source path হয়ে ground-এ ফিরে যেতে পারে।
        </p>

        <p>
          NMOS OFF থাকলে সেই return path ভেঙে যায়, ফলে LED current বন্ধ হয়ে
          যায়।
        </p>

        <p>
          এই simple loop-ই LED-কে MOSFET switching state-এর একটি clear visual
          indicator বানায়।
        </p>
      </SectionCard>

      <SectionCard title="MOSFET theory lesson-এর পরে এই project গুরুত্বপূর্ণ কেন?" eyebrow="Theory to Application">
        <p>
          আগের MOSFET lesson-গুলো channel formation, threshold, depletion,
          enhancement, আর type comparison বোঝায়।
        </p>

        <p>
          এই project সেই idea-গুলোকে একটি control circuit-এ apply করে, যেখানে
          learner দেখতে পারে কীভাবে gate signal বাস্তব load-switching action-এ
          রূপ নেয়।
        </p>

        <p>
          তাই lesson 13 pure device theory থেকে practical electronic design
          thinking-এর দিকে একটি গুরুত্বপূর্ণ transition।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          এই circuit বোঝার সবচেয়ে সহজ উপায় হলো একটি logic chain follow করা।
        </p>

        <p>
          Control switch বন্ধ হয়, gate ওঠে, VGS threshold পার হয়, NMOS turn
          on হয়, return path complete হয়, আর LED জ্বলে ওঠে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি NMOS low-side switch ছোট gate-control
          action দিয়ে বড় load path-কে clean এবং predictableভাবে control করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>এই project-এ একটি N-channel MOSFET low-side load switch হিসেবে ব্যবহার হয়েছে।</li>
          <li>MOSFET LED load loop-এর ground-return path control করে।</li>
          <li>Control switch বন্ধ করলে gate voltage বাড়ে এবং VGS increase হয়।</li>
          <li>Pull-down resistor control open থাকলে gate-কে safely source level-এর কাছে রাখে।</li>
          <li>LED resistor current limit করে, আর MOSFET switching control করে।</li>
          <li>Gate voltage একা নয়, VGS-ই নির্ধারণ করে NMOS turn on হবে কি না।</li>
          <li>এই lesson MOSFET theory-কে practical switching design-এর সাথে connect করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
