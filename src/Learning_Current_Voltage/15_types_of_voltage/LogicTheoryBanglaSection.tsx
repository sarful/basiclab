"use client";

import {
  calculateCurrent,
  calculateRms,
  DEFAULT_AC_FREQUENCY,
  DEFAULT_AC_PEAK_VOLTAGE,
  DEFAULT_AC_RESISTANCE,
  DEFAULT_DC_RESISTANCE,
  DEFAULT_DC_VOLTAGE,
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
  const dcCurrent = calculateCurrent(DEFAULT_DC_VOLTAGE, DEFAULT_DC_RESISTANCE);
  const acRmsVoltage = calculateRms(DEFAULT_AC_PEAK_VOLTAGE);
  const acRmsCurrent = calculateCurrent(acRmsVoltage, DEFAULT_AC_RESISTANCE);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "DC voltage আর AC voltage-এর সবচেয়ে simple difference কী?",
      answer:
        "DC voltage steady থাকে, আর AC voltage repeat pattern-এ direction change করে।",
    },
    {
      question: "AC voltage-এর জন্য RMS কেন useful?",
      answer:
        "RMS AC-এর একটি practical working value দেয়, তাই steady DC-এর সাথে compare করা সহজ হয়।",
    },
    {
      question: "Voltage বাড়লে আর resistance একই থাকলে current-এর কী হয়?",
      answer:
        "Current বাড়ে, কারণ stronger voltage push একই resistance-এর মধ্যে বেশি charge move করায়।",
    },
    {
      question: "AC voltage-এ frequency কী বোঝায়?",
      answer:
        "Frequency বোঝায় AC pattern কত দ্রুত repeat করছে।",
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
              Types of Voltage
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ আমরা steady voltage আর changing voltage-কে খুব simple way-এ compare করব।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা DC voltage আর AC voltage-কে beginner-friendly ভাষায় ধাপে ধাপে বুঝব।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। এক ধরনের voltage steady থাকে। আরেক ধরনের voltage সময়ের সাথে বদলায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Voltage" value={`${DEFAULT_DC_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} V`} tone="blue" />
            <ValueCard label="Frequency" value={`${DEFAULT_AC_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Types of voltage মানে voltage কী কীভাবে behave করতে পারে, সেই আলাদা আলাদা form।
        </p>
        <p>
          এই lesson-এ দুইটি main type হলো direct voltage আর alternating voltage।
        </p>
        <p>
          Direct voltage, বা DC voltage, steady থাকে এবং এক direction-এ push দেয়।
        </p>
        <p>
          Alternating voltage, বা AC voltage, repeat pattern-এ direction change করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: এই lesson-এ voltage-এর দুইটি main type কী?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ সব electrical system একই ধরনের voltage use করে না।
        </p>
        <p>
          কিছু system steady source চায়, আবার কিছু system changing voltage pattern-এর সাথে কাজ করে।
        </p>
        <p>
          Voltage type আগে বুঝে নিলে current, power, device behavior, আর later lesson অনেক সহজে বোঝা যায়।
        </p>
        <p>
          Beginner-রা অনেক সময় শুধু voltage number দেখে, কিন্তু voltage behavior-ও equally important।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage type system-এ charge push করার ধরন বদলে দেয়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Battery আর wall power সাধারণত different voltage form use করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: কোনো device বোঝার আগে voltage type জানা কেন useful?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          DC voltage এক steady level-এ থাকে, তাই charge-এর উপর push-ও steady থাকে।
        </p>
        <p>
          AC voltage rise করে, fall করে, আর direction reverse করে, তাই push সময়ের সাথে বদলায়।
        </p>
        <p>
          এই lesson-এ DC voltage হলো <strong>{DEFAULT_DC_VOLTAGE.toFixed(1)} V</strong> এবং resistance হলো <strong>{DEFAULT_DC_RESISTANCE.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          তাই DC current হয় <strong>{dcCurrent.toFixed(2)} A</strong>।
        </p>
        <p>
          AC peak voltage হলো <strong>{DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} V</strong>, frequency হলো <strong>{DEFAULT_AC_FREQUENCY.toFixed(1)} Hz</strong>, আর resistance হলো <strong>{DEFAULT_AC_RESISTANCE.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK_VOLTAGE.toFixed(1)} / sqrt(2) = {acRmsVoltage.toFixed(2)} V
          </strong>
        </p>
        <p>
          এই RMS voltage আর একই resistance দিয়ে AC RMS current হয় <strong>{acRmsCurrent.toFixed(2)} A</strong>।
        </p>
        <p>
          Beginner-দের common mistake হলো AC voltage-কে DC voltage-এর মতো same way-এ read করা। কিন্তু AC-এর জন্য peak, RMS, আর frequency-এর মতো extra idea দরকার হয়।
        </p>
        <p>
          <strong>মূল কথা:</strong> DC voltage steady push দেয়।
        </p>
        <p>
          <strong>মূল কথা:</strong> AC voltage-এর behavior বোঝার জন্য size-এর পাশাপাশি frequency-ও দরকার।
        </p>
        <p>
          <strong>
            Checkpoint Question: Voltage size ছাড়াও AC বোঝার জন্য আর কোন value useful?
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
                <p>একটি battery charger আর একটি wall outlet কল্পনা করুন।</p>
                <p>
                  Battery side সাধারণত steady DC voltage-এ কাজ করে।
                </p>
                <p>
                  Wall outlet সাধারণত AC voltage দেয়, যা বারবার direction change করে।
                </p>
                <p>
                  এই কারণেই অনেক electronic device outlet আর final circuit-এর মাঝে adapter, rectifier, বা power supply stage use করে।
                </p>
                <p>
                  কোনো real system দেখলে আগে এই question করুন: voltage steady, নাকি alternating?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: কোন source সাধারণত AC voltage দেয়, battery না wall outlet?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Voltage different form-এ থাকতে পারে।</li>
          <li>DC voltage steady এবং one-directional।</li>
          <li>AC voltage সময়ের সাথে direction change করে।</li>
          <li>AC-কে peak, RMS, আর frequency দিয়ে describe করা হয়।</li>
          <li>Steady voltage steady push দেয়।</li>
          <li>Changing voltage changing push তৈরি করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
