"use client";

import {
  DEFAULT_AC_PEAK,
  DEFAULT_DC_LEVEL,
  DEFAULT_FREQUENCY,
  getAcStrength,
  getDcStrength,
  getRmsFromPeak,
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
  const dcStrength = Math.round(getDcStrength(DEFAULT_DC_LEVEL));
  const acStrength = Math.round(getAcStrength(DEFAULT_AC_PEAK));
  const acRms = getRmsFromPeak(DEFAULT_AC_PEAK);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় DC কী?",
      answer: "DC মানে direct current। এটি একদিকে steady ভাবে চলে।",
    },
    {
      question: "সহজ ভাষায় AC কী?",
      answer: "AC মানে alternating current। এটি বারবার direction পরিবর্তন করে।",
    },
    {
      question: "Battery সাধারণত AC দেয়, নাকি DC দেয়?",
      answer: "Battery সাধারণত DC দেয়।",
    },
    {
      question: "বাড়ির wall power সাধারণত AC, নাকি DC?",
      answer: "বাড়ির wall power সাধারণত AC হয়।",
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
              AC vs DC Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ আমরা one-way current আর changing current-এর সহজ difference বুঝব।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা DC আর AC-কে beginner-friendly ভাষায় ধাপে ধাপে compare করব।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। DC একদিকে চলে। AC বারবার direction বদলায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Level" value={`${DEFAULT_DC_LEVEL.toFixed(1)} V`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK.toFixed(1)} V`} tone="blue" />
            <ValueCard label="AC Frequency" value={`${DEFAULT_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          AC আর DC হলো electric current-এর দুইটি আলাদা behavior।
        </p>
        <p>
          DC মানে direct current। সহজ ভাষায়, এটি এক main direction-এ চলে।
        </p>
        <p>
          AC মানে alternating current। সহজ ভাষায়, এটি সময়ের সাথে direction বদলায়।
        </p>
        <p>
          এই lesson-এর লক্ষ্য কোনটি সবসময় better তা বলা নয়। লক্ষ্য হলো এদের difference পরিষ্কারভাবে বোঝা।
        </p>
        <p>
          <strong>
            Checkpoint Question: Direction কোনটি change করে, AC নাকি DC?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ real electrical system-এ AC আর DC দুটোই ব্যবহৃত হয়।
        </p>
        <p>
          এই difference বুঝলে battery, charger, adapter, home power, আর industrial system আরও পরিষ্কারভাবে বোঝা যায়।
        </p>
        <p>
          Beginner-রা অনেক সময় ভাবে সব current একইভাবে behave করে। এই ভুল ধারণা পরে confusion তৈরি করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> DC batteries আর electronics-এ খুব common।
        </p>
        <p>
          <strong>মূল কথা:</strong> AC wall outlet আর power distribution system-এ খুব common।
        </p>
        <p>
          <strong>
            Checkpoint Question: কোন system AC না DC ব্যবহার করছে, সেটা জানা কেন useful?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          DC এক direction-এ steady থাকে, তাই এর push একইভাবে থাকে।
        </p>
        <p>
          AC বারবার direction reverse করে, তাই এর push সামনে-পেছনে change হয়।
        </p>
        <p>
          এই lesson-এ DC level হলো <strong>{DEFAULT_DC_LEVEL.toFixed(1)} V</strong>। এতে steady strength প্রায় <strong>{dcStrength}%</strong> হয়।
        </p>
        <p>
          AC side-এর peak হলো <strong>{DEFAULT_AC_PEAK.toFixed(1)} V</strong> এবং frequency হলো <strong>{DEFAULT_FREQUENCY.toFixed(1)} Hz</strong>।
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK.toFixed(1)} / sqrt(2) = {acRms.toFixed(2)} V
          </strong>
        </p>
        <p>
          এখানে AC strength প্রায় <strong>{acStrength}%</strong> peak behavior দেখায়, কিন্তু effective comparison-এর জন্য RMS value useful হয়।
        </p>
        <p>
          Beginner-দের common mistake হলো ভাবা AC মানেই সবসময় বেশি শক্তিশালী আর DC মানেই দুর্বল। আসল difference হলো direction behavior।
        </p>
        <p>
          <strong>মূল কথা:</strong> DC এক direction-এ steady থাকে।
        </p>
        <p>
          <strong>মূল কথা:</strong> AC repeatedly direction change করে, আর frequency বলে কত দ্রুত change হচ্ছে।
        </p>
        <p>
          <strong>
            Checkpoint Question: এই lesson-এ AC direction কত দ্রুত change হচ্ছে, সেটা কোন value বলে?
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
                <p>একটি phone battery আর একটি wall outlet কল্পনা করুন।</p>
                <p>
                  Phone battery DC দেয়, কারণ current এক main direction-এ move করে।
                </p>
                <p>
                  Home wall outlet AC দেয়, কারণ current বারবার direction change করে।
                </p>
                <p>
                  Charger আর adapter useful কারণ এগুলো device-এর প্রয়োজন অনুযায়ী power form convert করতে সাহায্য করে।
                </p>
                <p>
                  কোনো real system দেখলে আগে এই simple question করুন: current কি steady one-way, নাকি alternating?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Battery আর wall outlet-এর মধ্যে কোনটি সাধারণত DC দেয়?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>DC মানে direct current।</li>
          <li>DC এক main direction-এ চলে।</li>
          <li>AC মানে alternating current।</li>
          <li>AC বারবার direction change করে।</li>
          <li>Frequency বলে AC কত দ্রুত direction change করছে।</li>
          <li>Battery সাধারণত DC দেয়, আর wall power সাধারণত AC হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
