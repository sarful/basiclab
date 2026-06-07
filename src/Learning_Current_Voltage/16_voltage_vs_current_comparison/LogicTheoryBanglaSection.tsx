"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCurrentLevel,
  getVoltageLevel,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "cyan";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow = "কোর্স মডিউল",
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {eyebrow}
        </div>
        <h2 className="mt-4 text-[1rem] font-bold tracking-tight text-slate-950 md:text-[1rem]">
          {title}
        </h2>
        <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
          {children}
        </div>
      </div>
    </section>
  );
}

export function LogicTheoryBanglaSection() {
  const current = calculateCurrent(DEFAULT_VOLTAGE, DEFAULT_RESISTANCE);
  const voltageLevel = getVoltageLevel(DEFAULT_VOLTAGE);
  const currentLevel = getCurrentLevel(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Circuit-এ voltage-এর main কাজ কী?",
      answer:
        "Voltage electrical push দেয়, যা charge-কে move করাতে চেষ্টা করে।",
    },
    {
      question: "Circuit-এ current-এর main কাজ কী?",
      answer:
        "Current দেখায় আসলে কত charge circuit-এর মধ্যে flow করছে।",
    },
    {
      question: "Current খুব বড় না হলেও কি circuit-এ voltage থাকতে পারে?",
      answer:
        "হ্যাঁ। Resistance বেশি হলে বা path complete না হলে voltage থাকতে পারে, কিন্তু current ছোট থাকতে পারে।",
    },
    {
      question: "Beginner-রা voltage আর current-কে কেন confuse করে?",
      answer:
        "কারণ দুটিই একই circuit-এ থাকে, কিন্তু একটি push আর অন্যটি actual flow।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Voltage vs Current Comparison
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ আমরা এমন দুইটি idea আলাদা করে বুঝব, যেগুলো beginner-রা অনেক সময় mix করে ফেলে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা voltage আর current-কে ধাপে ধাপে compare করব, যাতে electrical push আর electrical flow-এর difference একদম clear হয়।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Voltage pushes. Current moves.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Levels" value={`${voltageLevel} / ${currentLevel}`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          এই topic এক simple circuit-এ voltage আর current-কে compare করে।
        </p>
        <p>
          Voltage হলো electrical push, যা charge-কে move করাতে চায়।
        </p>
        <p>
          Current হলো circuit-এর মধ্যে charge-এর actual flow।
        </p>
        <p>
          এই দুইটি idea related, কিন্তু একই জিনিস না।
        </p>
        <p>
          <strong>
            Checkpoint Question: Voltage আর current-এর সবচেয়ে simple difference কী?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ অনেক beginner voltage আর current-কে confuse করে।
        </p>
        <p>
          যদি আপনি এই দুইটি mix করে ফেলেন, তাহলে circuit reading, testing, আর calculation অনেক কঠিন হয়ে যায়।
        </p>
        <p>
          Electrician, technician, আর student-দের বুঝতে হয় তারা push-এর কথা বলছে, নাকি flow-এর কথা বলছে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage আর current একসাথে কাজ করে, কিন্তু তারা different জিনিস describe করে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> Current ছোট বা zero হলেও voltage present থাকতে পারে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Push আর flow-এর idea আলাদা করে বোঝা কেন useful?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          চলুন battery আর resistor-এর একটি simple circuit use করি।
        </p>
        <p>
          এই lesson-এ voltage হলো <strong>{DEFAULT_VOLTAGE.toFixed(1)} V</strong> এবং resistance হলো <strong>{DEFAULT_RESISTANCE.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          তাই current হয় <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          Simple calculation:{" "}
          <strong>
            I = V / R = {DEFAULT_VOLTAGE.toFixed(1)} / {DEFAULT_RESISTANCE.toFixed(1)} = {current.toFixed(2)} A
          </strong>
        </p>
        <p>
          এখানে key comparison হলো, voltage হচ্ছে charge move করার কারণ, আর current হচ্ছে resistance effect করার পরে আমরা যে actual result দেখি।
        </p>
        <p>
          Beginner-দের common mistake হলো বলা যে voltage আর current একই, কারণ দুটোই একই circuit-এ দেখা যায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage হলো push।
        </p>
        <p>
          <strong>মূল কথা:</strong> Current হলো actual flow, যা সেই push-এর কারণে complete path-এর মধ্যে তৈরি হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Formula-তে কোন value push বোঝায় আর কোন value flow বোঝায়?
          </strong>
        </p>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-cyan-300 to-sky-400" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                বাস্তব উদাহরণ
              </div>
              <h2 className="text-[1rem] font-bold tracking-tight text-slate-950 md:text-[1rem]">
                বাস্তব উদাহরণ
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>একটি water pump আর pipe-এর মধ্যে moving water কল্পনা করুন।</p>
                <p>
                  Pump pressure হলো voltage-এর মতো, কারণ এটি water-কে push দেয়।
                </p>
                <p>
                  আর actually যে amount water move করছে, সেটি current-এর মতো।
                </p>
                <p>
                  Path narrow বা blocked হলে flow বদলে যায়, even যদি push still থাকে।
                </p>
                <p>
                  এই comparison বাস্তব troubleshooting-এ useful, কারণ তখন আপনি জিজ্ঞেস করতে শিখবেন সমস্যা weak push-এ, নাকি weak flow-এ।
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Water example-এ voltage কী আর current কী?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage হলো electrical push।</li>
          <li>Current হলো charge-এর actual flow।</li>
          <li>এই দুইটি idea related, কিন্তু same না।</li>
          <li>Resistance affect করে voltage কত current produce করতে পারবে।</li>
          <li>Flow ছোট হলেও circuit-এ push available থাকতে পারে।</li>
          <li>Push আর flow আলাদা করে ভাবলে clear understanding তৈরি হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
