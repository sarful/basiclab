"use client";

import {
  DEFAULT_AC_PEAK_CURRENT,
  DEFAULT_DC_CURRENT,
  DEFAULT_FREQUENCY,
  calculateRmsCurrent,
  getCurrentStrengthPercent,
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
  const dcStrength = getCurrentStrengthPercent(DEFAULT_DC_CURRENT);
  const acStrength = getCurrentStrengthPercent(DEFAULT_AC_PEAK_CURRENT);
  const acRms = calculateRmsCurrent(DEFAULT_AC_PEAK_CURRENT);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Battery থেকে পাওয়া সবচেয়ে simple current type কোনটি?",
      answer: "Battery সাধারণত direct current, অর্থাৎ DC দেয়।",
    },
    {
      question: "Alternating current-এর main idea কী?",
      answer: "Alternating current সময়ের সাথে বারবার direction change করে।",
    },
    {
      question: "দুই ধরনের current-এর peak value একই হলেও behavior কি আলাদা হতে পারে?",
      answer:
        "হ্যাঁ। Value কাছাকাছি হলেও behavior আলাদা হতে পারে, কারণ একটি steady আর অন্যটি alternating হয়।",
    },
    {
      question: "AC-তে frequency কী বোঝায়?",
      answer:
        "Frequency বলে AC pattern কত দ্রুত repeat করছে বা direction change করছে।",
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
              Types of Current
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ আমরা current-এর main types-গুলোকে simple side-by-side way-এ বুঝব।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা steady current আর changing current-কে beginner-friendly ভাষায় ধাপে ধাপে compare করব।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। এক ধরনের current steady থাকে। আরেক ধরনের current সময়ের সাথে বদলায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="DC Current" value={`${DEFAULT_DC_CURRENT.toFixed(1)} A`} tone="red" />
            <ValueCard label="AC Peak" value={`${DEFAULT_AC_PEAK_CURRENT.toFixed(1)} A`} tone="blue" />
            <ValueCard label="Frequency" value={`${DEFAULT_FREQUENCY.toFixed(1)} Hz`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Types of current মানে current কী কীভাবে behave করতে পারে, সেই আলাদা আলাদা form।
        </p>
        <p>
          এই lesson-এ দুইটি main type হলো direct current আর alternating current।
        </p>
        <p>
          Direct current, বা DC, এক steady direction-এ চলে।
        </p>
        <p>
          Alternating current, বা AC, সময়ের সাথে direction change করে এবং repeat pattern follow করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: এই lesson-এ current-এর দুইটি main type কী?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ real electrical system-এ different কাজের জন্য different current type ব্যবহার হয়।
        </p>
        <p>
          Current type আগে বুঝে নিলে device, circuit, safety, আর later lesson অনেক সহজে follow করা যায়।
        </p>
        <p>
          Beginner-রা অনেক সময় শুধু number value দেখে, কিন্তু current behavior-ও যে important, সেটা ভুলে যায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Current type system-এর behavior-এ প্রভাব ফেলে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Battery, electronics, wall outlet, আর machine সব একই current form ব্যবহার করে না।
        </p>
        <p>
          <strong>
            Checkpoint Question: কোনো system শেখার আগে current type জানা কেন useful?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          DC এক direction-এ steady থাকে, তাই এর current pattern flat আর stable দেখায়।
        </p>
        <p>
          AC rise করে, fall করে, আর direction reverse করে, তাই এর current pattern সময়ের সাথে change হয়।
        </p>
        <p>
          এই lesson-এ DC current হলো <strong>{DEFAULT_DC_CURRENT.toFixed(1)} A</strong>, তাই এর strength প্রায় <strong>{dcStrength}%</strong>।
        </p>
        <p>
          AC peak current হলো <strong>{DEFAULT_AC_PEAK_CURRENT.toFixed(1)} A</strong>, আর frequency হলো <strong>{DEFAULT_FREQUENCY.toFixed(1)} Hz</strong>।
        </p>
        <p>
          Simple AC value line:{" "}
          <strong>
            RMS = Peak / sqrt(2) = {DEFAULT_AC_PEAK_CURRENT.toFixed(1)} / sqrt(2) = {acRms.toFixed(2)} A
          </strong>
        </p>
        <p>
          এখানে AC strength প্রায় <strong>{acStrength}%</strong> peak behavior দেখায়। কিন্তু practical comparison-এর জন্য RMS value-ও useful।
        </p>
        <p>
          Beginner-দের common mistake হলো ভাবা সব current value একভাবে read করতে হয়। কিন্তু AC-এর ক্ষেত্রে peak, RMS, আর frequency-এর idea দরকার হয়, আর DC সাধারণত steady value হিসেবে বোঝা হয়।
        </p>
        <p>
          <strong>মূল কথা:</strong> DC steady current level দেয়।
        </p>
        <p>
          <strong>মূল কথা:</strong> AC-এর behavior বুঝতে size-এর পাশাপাশি frequency-ও জানতে হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Current size ছাড়াও AC বোঝার জন্য আর কোন value useful?
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
                <p>একটি battery-powered flashlight আর একটি home wall outlet কল্পনা করুন।</p>
                <p>
                  Flashlight battery DC দেয়, তাই current steady এক direction-এ থাকে।
                </p>
                <p>
                  Wall outlet AC দেয়, তাই current বারবার direction change করে।
                </p>
                <p>
                  এই কারণেই কিছু device battery থেকে সরাসরি কাজ করে, আর কিছু device-এর জন্য adapter বা conversion stage দরকার হয়।
                </p>
                <p>
                  কোনো real device দেখলে আগে এই question করুন: এটি steady current use করছে, নাকি alternating current?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: কোন example সাধারণত AC use করে, flashlight battery নাকি wall outlet?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Current different form-এ থাকতে পারে।</li>
          <li>DC steady এবং এক direction-এ চলে।</li>
          <li>AC সময়ের সাথে direction change করে।</li>
          <li>AC-কে peak, RMS, আর frequency দিয়ে describe করা হয়।</li>
          <li>Battery সাধারণত DC দেয়।</li>
          <li>Wall power সাধারণত AC দেয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
