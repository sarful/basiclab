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
  tone: "emerald" | "orange" | "rose";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "orange"
        ? "border-orange-200 bg-orange-50 text-orange-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-rose-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
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
      question: "ভোল্টেজ আর current measurement-এর setup-এর সবচেয়ে বড় পার্থক্য কী?",
      answer:
        "Voltage দুই পয়েন্টের across measure হয়, কিন্তু current series-এ measure হয় যাতে current meter-এর ভেতর দিয়ে flow করে.",
    },
    {
      question: "Current measurement-এ কখন VΩmA jack ব্যবহার করা হয়?",
      answer:
        "ছোট DC current range-এর জন্য, যেমন 20mA এবং 200mA.",
    },
    {
      question: "Red lead কখন 10A jack-এ নিতে হয়?",
      answer:
        "শুধু high-current test-এর জন্য, যখন dedicated 10A current range দরকার হয়.",
    },
    {
      question: "Current test-এর সময় circuit-এ open gap কেন দরকার?",
      answer:
        "কারণ meter-কে সেই gap bridge করতে হয়, যাতে পুরো current meter-এর ভেতর দিয়ে যায়.",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              কারেন্ট মাপা
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              কারেন্ট মাপা মানে circuit path-এর ভিতর দিয়ে কত electrical flow
              যাচ্ছে সেটা দেখা।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর সবচেয়ে গুরুত্বপূর্ণ beginner rule হলো: current-কে
              meter-এর <strong>ভেতর দিয়ে</strong> যেতে হবে, তাই meter-কে source-এর
              across না বসিয়ে series-এ বসাতে হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Black Lead" value="COM" tone="emerald" />
            <ValueCard label="Main Family" value="DCA" tone="orange" />
            <ValueCard label="High Current Jack" value="10A" tone="rose" />
          </div>
        </div>
      </section>

      <SectionCard title="Current measurement কী?" eyebrow="Core Concept">
        <p>
          Current measurement হলো path-এর ভিতর দিয়ে কত electric charge flow
          করছে সেটা check করা।
        </p>
        <p>
          সহজভাবে বললে, voltage push বোঝায়, আর current actual flow বোঝায়।
        </p>
        <p>
          Current যেহেতু path-এর ভিতরের flow, তাই voltage test-এর মতো meter-কে
          শুধু source-এর across ছোঁয়ালেই হবে না।
        </p>
        <p>
          Circuit-এ একটি gap খুলতে হবে, তারপর meter-কে সেই gap bridge করতে
          হবে, যাতে একই current meter-এর ভিতর দিয়েও যায়।
        </p>
      </SectionCard>

      <SectionCard title="এটা কেন গুরুত্বপূর্ণ?" eyebrow="Why It Matters">
        <p>
          Current measurement দিয়ে বোঝা যায় load সত্যিই expected amount-এর power
          টানছে কি না।
        </p>
        <p>এটা দিয়ে আমরা যেমন practical question-এর উত্তর পাই:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Sensor loop সত্যিই প্রায় 20mA carry করছে কি?</li>
          <li>DC load normal current নিচ্ছে, নাকি too much current নিচ্ছে?</li>
          <li>High-current load-এর জন্য 10A setup দরকার কি না?</li>
          <li>Meter ঠিকভাবে open path-এর ভিতর insert করা হয়েছে কি?</li>
        </ul>
        <p>
          এই কারণেই troubleshooting, commissioning, আর safe circuit learning-এ
          current measurement খুব useful।
        </p>
      </SectionCard>

      <SectionCard
        title="Current setup voltage setup থেকে কীভাবে আলাদা"
        eyebrow="Key Difference"
      >
        <p>
          <strong>Voltage measurement:</strong> meter দুইটি point-এর across
          যায়।
        </p>
        <p>
          <strong>Current measurement:</strong> meter path-এর ভিতরে series-এ
          যায়।
        </p>
        <p>
          অর্থাৎ সাধারণত circuit-এর এক side খুলে red probe source side-এ আর
          black probe load side-এ বসাতে হয়।
        </p>
        <p>
          যদি দুই probe একই node-এ থাকে, তাহলে meter-এর ভিতর দিয়ে current
          যাবে না, তাই reading lesson-এর জন্য meaningful হবে না।
        </p>
      </SectionCard>

      <SectionCard title="Dial আর jack selection rule" eyebrow="Setup Rules">
        <p>
          এই lesson-এ meter family অবশ্যই <strong>DCA</strong> হতে হবে,
          কারণ সব scenario-ই DC current measurement।
        </p>
        <p>
          Black lead <strong>COM</strong>-এ থাকে।
        </p>
        <p>
          ছোট current range যেমন <strong>20mA</strong> এবং{" "}
          <strong>200mA</strong>-এর জন্য red lead <strong>VΩmA</strong>-এ
          থাকে।
        </p>
        <p>
          High-current measurement-এর জন্য red lead-কে dedicated{" "}
          <strong>10A</strong> jack-এ নিতে হবে, আর dial-কেও সেই current range-এর
          সাথে match করতে হবে।
        </p>
        <p>
          High-current test শেষ হলে red lead-কে আবার normal
          voltage-and-small-current jack-এ ফিরিয়ে আনতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="Series measurement example" eyebrow="Practical Logic">
        <p>
          <strong>20mA sensor loop</strong>-এ circuit open করে meter-কে loop-এর
          ভিতরে বসানো হয়, যাতে loop current meter-এর ভিতর দিয়ে যায়।
        </p>
        <p>
          <strong>200mA DC load</strong>-এ positive feed খুলে সেই break-টা meter
          দিয়ে bridge করা যায়।
        </p>
        <p>
          <strong>High-current 10A test</strong>-এও একই series rule apply করে,
          কিন্তু jack আর range 10A setup-এ change করতে হয়।
        </p>
        <p>
          সব ক্ষেত্রেই logic একই: path open করো, meter insert করো, আর current-কে
          meter-এর ভিতর দিয়ে যেতে দাও।
        </p>
      </SectionCard>

      <SectionCard title="যে safety mistake এড়াতে হবে" eyebrow="High Priority">
        <p>
          Current-কে কখনো voltage-এর মতো source-এর across measure করার চেষ্টা
          করা যাবে না।
        </p>
        <p>
          যখন lesson high-current <strong>10A</strong> test চায়, তখন red lead-কে{" "}
          <strong>VΩmA</strong>-এ ফেলে রাখা যাবে না।
        </p>
        <p>
          High-current test শেষ হওয়ার পর red lead-কে <strong>10A</strong>-এ
          ফেলে রাখাও ঠিক না, কারণ পরের measurement-এ risk তৈরি হয়।
        </p>
        <p>
          Dial family, jack selection, আর series placement যদি job-এর সাথে
          match না করে, তাহলে আগে setup ঠিক করতে হবে, তারপর এগোতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Current electrical flow-এর amount বোঝায়।</li>
          <li>Current series-এ measure হয়, source-এর across না।</li>
          <li>Black lead COM-এ থাকে।</li>
          <li>Small current-এর জন্য VΩmA, high current-এর জন্য 10A লাগে।</li>
          <li>Meter-কে open gap bridge করতে হয়, যাতে current তার ভিতর দিয়ে যায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের short question-গুলো দিয়ে main setup rule যাচাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
