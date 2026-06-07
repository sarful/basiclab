"use client";

import {
  DEFAULT_LOAD_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
  SHORT_PATH_RESISTANCE,
  solveShortCircuitLesson,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "amber";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
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
  const normalCase = solveShortCircuitLesson(
    "normal",
    DEFAULT_VOLTAGE,
    DEFAULT_LOAD_RESISTANCE,
  );
  const shortCase = solveShortCircuitLesson(
    "short",
    DEFAULT_VOLTAGE,
    DEFAULT_LOAD_RESISTANCE,
  );
  const flowPercent = getFlowPercent(shortCase.current);
  const flowLevel = getFlowLevel(shortCase.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় short circuit কী?",
      answer:
        "Short circuit হলো এমন একটি খুব কম resistance-এর path, যেখানে current স্বাভাবিক load path এ না গিয়ে খুব সহজে source-এ ফিরে যেতে চায়।",
    },
    {
      question: "Short circuit বিপজ্জনক কেন?",
      answer:
        "কারণ এতে current খুব দ্রুত বেড়ে যেতে পারে, ফলে wire গরম হতে পারে, component নষ্ট হতে পারে, বা fire risk তৈরি হতে পারে।",
    },
    {
      question: "Short circuit হলে resistance-এর কী হয়?",
      answer:
        "Resistance খুব কমে যায়, তাই current হঠাৎ অনেক বেড়ে যায়।",
    },
    {
      question: "Normal circuit-এ current কোথা দিয়ে যাওয়া উচিত?",
      answer:
        "Normal circuit-এ current-এর intended load, যেমন resistor, lamp, বা অন্য device-এর মধ্য দিয়ে যাওয়া উচিত।",
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
              Short Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Short circuit একটি অনিরাপদ low-resistance path তৈরি করে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা বিষয়টি ধাপে ধাপে সহজভাবে শিখব। এই lesson বুঝতে advanced theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Normal circuit-এ current load-এর
              মধ্য দিয়ে যায়। Short circuit-এ current আরও সহজ path খুঁজে নেয় এবং
              খুব দ্রুত বেড়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Short Current" value={`${shortCase.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Risk Level" value={flowLevel} tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Short circuit হলো এমন একটি খুব কম resistance-এর path, যেখানে current খুব
          সহজে source থেকে source-এ ফিরে যেতে পারে।
        </p>
        <p>
          সহজ ভাষায়, current তখন normal load path দিয়ে না গিয়ে আরও সহজ shortcut
          path নেয়।
        </p>
        <p>
          এতে intended device bypass হয়ে যেতে পারে এবং current দ্রুত বেড়ে যেতে পারে।
        </p>
        <p>
          Short circuit normal closed circuit-এর মতো নয়। Normal closed circuit-এ
          load-এর মধ্য দিয়ে complete path থাকে। Short circuit-এ unsafe shortcut
          তৈরি হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Short circuit কি normal load path তৈরি করে,
            নাকি unsafe easy path?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ short circuit component নষ্ট করতে পারে, wire
          অতিরিক্ত গরম করতে পারে, protection device trip করাতে পারে, এবং fire risk
          তৈরি করতে পারে।
        </p>
        <p>
          Electrician এবং technician-দের short circuit বুঝতে হয়, যাতে তারা
          dangerous condition prevent করতে পারে এবং fault safely troubleshoot করতে পারে।
        </p>
        <p>
          Real system-এ fuse আর circuit breaker ব্যবহার করা হয়, কারণ short circuit
          current-কে খুব দ্রুত বাড়িয়ে দিতে পারে।
        </p>
        <p>
          <strong>মূল কথা:</strong> খুব কম resistance খুব বেশি current তৈরি করতে পারে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> বিপদের মূল কারণ হলো unwanted easy path।
        </p>
        <p>
          <strong>
            Checkpoint Question: Short circuit হলে protection device কেন গুরুত্বপূর্ণ?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Current voltage এবং resistance-এর উপর নির্ভর করে। Resistance খুব কমে গেলে
          current অনেক বেড়ে যায়।
        </p>
        <p>
          এই lesson-এর normal circuit-এ load resistance হলো{" "}
          <strong>{normalCase.loadResistance.toFixed(1)} Ohm</strong>, তাই current
          তুলনামূলকভাবে controlled থাকে এবং হয়{" "}
          <strong>{normalCase.current.toFixed(2)} A</strong>।
        </p>
        <p>
          কিন্তু short-circuit case-এ effective resistance নেমে আসে{" "}
          <strong>{SHORT_PATH_RESISTANCE.toFixed(2)} Ohm</strong>-এ, তাই current বেড়ে
          হয় <strong>{shortCase.current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ calculation:{" "}
          <strong>
            I = V / R = {DEFAULT_VOLTAGE.toFixed(1)} / {SHORT_PATH_RESISTANCE.toFixed(2)} ={" "}
            {shortCase.current.toFixed(2)} A
          </strong>
        </p>
        <p>
          Beginner-দের common mistake হলো ভাবা যে shorter path সব সময় better। কিন্তু
          short circuit-এ easy path আসলে dangerous, কারণ এটি খুব বেশি current flow করতে দেয়।
        </p>
        <p>
          Short-circuit power হয় <strong>{shortCase.power.toFixed(2)} W</strong>,
          আর flow পৌঁছে যায় প্রায় <strong>{flowPercent}%</strong> পর্যন্ত। তাই lesson
          এটিকে <strong>{flowLevel}</strong> হিসেবে দেখায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Short circuit মানে low resistance এবং high current।
        </p>
        <p>
          <strong>মূল কথা:</strong> High current খুব দ্রুত unsafe হয়ে যেতে পারে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Resistance খুব ছোট হয়ে গেলে current-এর কী হয়?
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
                <p>একটি damaged wire কল্পনা করুন, যার insulation নষ্ট হয়ে গেছে।</p>
                <p>
                  যদি conductor ভুল জায়গায় অন্য conductor বা metal body-কে touch করে,
                  তাহলে current intended load path-এর বদলে আরও easy path পেয়ে যেতে পারে।
                </p>
                <p>
                  এতে wire খুব দ্রুত গরম হতে পারে, আর fuse বা breaker trip করতে পারে।
                </p>
                <p>
                  এই কারণে home wiring, control panel, battery system, এবং machine-এ
                  short-circuit protection খুব গুরুত্বপূর্ণ।
                </p>
                <p>
                  Real short circuit ভাবার সময় এই প্রশ্নটি করুন: current কি unsafe shortcut খুঁজে পেয়েছে?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: একটি damaged wire real circuit-এ বিপজ্জনক কেন?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Short circuit একটি unsafe low-resistance path তৈরি করে।</li>
          <li>Resistance কমে গেলে current দ্রুত বেড়ে যেতে পারে।</li>
          <li>Short circuit intended load-কে bypass করতে পারে।</li>
          <li>High current wire গরম করতে এবং part নষ্ট করতে পারে।</li>
          <li>Fuse এবং breaker short circuit থেকে protection দেয়।</li>
          <li>Normal closed circuit আর short circuit এক জিনিস নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
