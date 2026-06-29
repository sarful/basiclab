"use client";

import {
  DEFAULT_CURRENT,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  formatNumber,
  getPowerPercent,
  solvePowerLesson,
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
  const solved = solvePowerLesson(
    "power",
    DEFAULT_VOLTAGE,
    DEFAULT_CURRENT,
    DEFAULT_RESISTANCE,
  );
  const powerPercent = getPowerPercent(solved.power);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "বৈদ্যুতিক power আমাদের কী বোঝায়?",
      answer: "বৈদ্যুতিক power আমাদের বোঝায় একটি circuit কত দ্রুত electrical energy ব্যবহার করছে বা দিচ্ছে।",
    },
    {
      question: "Power-এর সবচেয়ে common formula কোনটি?",
      answer: "সবচেয়ে common form হলো P = V x I, অর্থাৎ power equals voltage multiplied by current.",
    },
    {
      question: "যদি voltage same থাকে আর current বাড়ে, তাহলে power-এর কী হয়?",
      answer: "Power বাড়ে, কারণ circuit প্রতি second-এ বেশি electrical energy ব্যবহার করছে।",
    },
    {
      question: "Real device-এ power জানা কেন useful?",
      answer: "Power দেখে আমরা বুঝতে পারি device কত জোরে কাজ করছে এবং circuit safe range-এর মধ্যে আছে কি না।",
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
              Power in a Circuit
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Power আমাদের বলে একটি circuit কত দ্রুত electrical energy ব্যবহার করছে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এই lesson-টা খুব সহজভাবে শিখবো। Idea বুঝতে advanced theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Voltage push দেয়, current flow দেখায়, আর power বলে circuit কতটা কাজ করছে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${solved.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Power Level" value={`${powerPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Electrical power আমাদের বলে একটি circuit কত দ্রুত electrical energy ব্যবহার করছে বা দিচ্ছে।
        </p>
        <p>
          সহজ ভাষায়, power দেখায় একটি device কত electrical work করছে।
        </p>
        <p>
          সবচেয়ে common power formula হলো <strong>P = V x I</strong>। অর্থাৎ power equals voltage multiplied by current।
        </p>
        <p>
          Power-এর unit হলো <strong>watt</strong>। Watt দিয়েই electrical power মাপা হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Power কি circuit কত electrical work করছে সেটা বোঝায়, নাকি শুধু resistance কত আছে সেটা বোঝায়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          Power গুরুত্বপূর্ণ কারণ এটা আমাদের বলে একটি device কত জোরে কাজ করছে।
        </p>
        <p>
          এর সাহায্যে আমরা বুঝতে পারি bulb dim নাকি bright, heater weak নাকি strong, বা কোনো component বেশি load নিচ্ছে কি না।
        </p>
        <p>
          Technician-রা power values ব্যবহার করে safe part choose করে, device compare করে, আর circuit normal কাজ করছে কি না সেটা check করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Power দেখায় একটি device প্রতি second-এ কত electrical energy ব্যবহার করছে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> Higher voltage আর higher current usually higher power তৈরি করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: একটি device কত power নিচ্ছে এটা জানা useful কেন?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Power voltage আর current-কে এক relationship-এ এনে কাজ করে।
        </p>
        <p>
          যদি current same থাকে আর voltage বাড়ে, power বাড়ে। আবার যদি voltage same থাকে আর current বাড়ে, তবুও power বাড়ে।
        </p>
        <p>
          Beginner-দের common mistake হলো power-কে voltage আর current থেকে আলাদা কিছু ভাবা। আসলে power এই values-গুলোর একসাথে কাজ করার ফল।
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{solved.voltage.toFixed(1)} V</strong> আর current হলো <strong>{solved.current.toFixed(2)} A</strong>। এই combination-এর কারণে power হয় <strong>{solved.power.toFixed(2)} W</strong>।
        </p>
        <p>
          সহজ calculation: <strong>P = V x I = {formatNumber(solved.voltage, 1)} x {formatNumber(solved.current, 2)} = {formatNumber(solved.power, 2)} W</strong>
        </p>
        <p>
          আপনি power-কে <strong>P = I²R</strong> বা <strong>P = V² / R</strong> হিসেবেও দেখতে পারেন। এগুলোও power-এর formula, শুধু form আলাদা।
        </p>
        <p>
          <strong>মূল কথা:</strong> Power বলে circuit এই মুহূর্তে কত জোরে কাজ করছে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage বা current change হলে power-ও usually change হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: যদি current বাড়ে আর voltage same থাকে, তাহলে power-এর কী হয়?
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
                <p>
                  একটি electric heater বা lamp কল্পনা করুন।
                </p>
                <p>
                  Strong heater সাধারণত বেশি power ব্যবহার করে, আর brighter lamp সাধারণত বোঝায় circuit-এ বেশি power কাজ করছে।
                </p>
                <p>
                  Training lab বা repair কাজের সময় technician আগে voltage আর current measure করতে পারে। তারপর power calculate করে বুঝতে পারে device কতটা heavily কাজ করছে।
                </p>
                <p>
                  এই কারণেই home appliances, industrial machines, lighting systems, আর electrical testing-এ power খুব important।
                </p>
                <p>
                  কোনো real device দেখলে এই question-টা ভাবুন: এই circuit এই মুহূর্তে কত electrical work করছে?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: যদি lamp brighter হয়, তাহলে এটা power সম্পর্কে সাধারণত কী বোঝায়?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Power বলে electrical energy কত দ্রুত ব্যবহার হচ্ছে।</li>
          <li>Power watt-এ measured হয়।</li>
          <li>P = V x I হলো সবচেয়ে common power formula।</li>
          <li>Higher voltage বা higher current সাধারণত higher power তৈরি করে।</li>
          <li>Power দেখে আমরা বুঝি device কত জোরে কাজ করছে।</li>
          <li>Design, testing, আর real electrical work-এ power খুব useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
