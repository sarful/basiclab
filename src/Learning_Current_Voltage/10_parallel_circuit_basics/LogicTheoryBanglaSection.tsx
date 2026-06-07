"use client";

import {
  DEFAULT_BRANCH_ONE,
  DEFAULT_BRANCH_THREE,
  DEFAULT_BRANCH_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  solveParallelCircuitLesson,
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
  const solved = solveParallelCircuitLesson(
    DEFAULT_VOLTAGE,
    DEFAULT_BRANCH_ONE,
    DEFAULT_BRANCH_TWO,
    DEFAULT_BRANCH_THREE,
  );
  const flowLevel = getFlowLevel(solved.totalCurrent);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় parallel circuit কী?",
      answer:
        "Parallel circuit হলো এমন circuit, যেখানে current-এর জন্য একের বেশি path থাকে।",
    },
    {
      question: "Parallel branch-গুলোর across কী একই থাকে?",
      answer:
        "প্রতিটি parallel branch-এর across voltage একই থাকে।",
    },
    {
      question: "Parallel circuit-এ total current কীভাবে বের করা হয়?",
      answer:
        "সব branch current যোগ করলে total current পাওয়া যায়।",
    },
    {
      question: "Parallel circuit-এ একটি branch open হলে কী হয়?",
      answer:
        "অন্য branch-গুলোর path complete থাকলে সেগুলো কাজ চালিয়ে যেতে পারে।",
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
              Parallel Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Parallel circuit-এ current একের বেশি path দিয়ে চলতে পারে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা বিষয়টি ধাপে ধাপে সহজ ভাষায় শিখব। এই lesson বুঝতে advanced
              theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Parallel branch-গুলো একই source-এর
              সাথে যুক্ত আলাদা আলাদা road-এর মতো।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard
              label="Total Current"
              value={`${solved.totalCurrent.toFixed(2)} A`}
              tone="blue"
            />
            <ValueCard label="Flow Level" value={flowLevel} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Parallel circuit হলো এমন circuit, যেখানে current-এর জন্য একের বেশি path থাকে।
        </p>
        <p>
          সহজ ভাষায়, source একই push একসাথে কয়েকটি branch-এ দিতে পারে।
        </p>
        <p>
          প্রতিটি branch একই source-এর across connected থাকে, তাই প্রতিটি branch
          একই voltage পায়।
        </p>
        <p>
          তারপর current branch-গুলোর resistance অনুযায়ী ভাগ হয়ে যায়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Parallel circuit-এ current-এর জন্য one path থাকে, নাকি more than one path?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ অনেক real electrical system parallel connection ব্যবহার করে।
        </p>
        <p>
          House wiring, building load, আর machine panel-এ parallel circuit খুব common।
        </p>
        <p>
          Parallel design-এর ফলে একটি branch বন্ধ হলেও অন্য branch অনেক সময় কাজ চালিয়ে যেতে পারে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Parallel circuit এক source থেকে অনেক load চালাতে সাহায্য করে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> প্রতিটি branch একই voltage পায়, কিন্তু current এক নাও হতে পারে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Parallel circuit কেন useful, যখন এক source থেকে কয়েকটি load চালাতে হয়?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Parallel circuit-এ source voltage প্রতিটি branch-এর across দেখা যায়।
        </p>
        <p>
          এর মানে branch one, branch two, আর branch three প্রতিটিই{" "}
          <strong>{solved.voltage.toFixed(1)} V</strong> পায়।
        </p>
        <p>
          Branch current বের করতে একই voltage-কে প্রতিটি branch resistance দিয়ে ভাগ করা হয়।
        </p>
        <p>
          এই lesson-এ branch current তিনটি হলো{" "}
          <strong>{solved.currentOne.toFixed(2)} A</strong>,{" "}
          <strong>{solved.currentTwo.toFixed(2)} A</strong>, এবং{" "}
          <strong>{solved.currentThree.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ branch calculation:{" "}
          <strong>
            I1 = {solved.voltage.toFixed(1)} / {solved.branchOneResistance.toFixed(1)} ={" "}
            {solved.currentOne.toFixed(2)} A
          </strong>
          {", "}
          <strong>
            I2 = {solved.voltage.toFixed(1)} / {solved.branchTwoResistance.toFixed(1)} ={" "}
            {solved.currentTwo.toFixed(2)} A
          </strong>
          {", "}
          <strong>
            I3 = {solved.voltage.toFixed(1)} / {solved.branchThreeResistance.toFixed(1)} ={" "}
            {solved.currentThree.toFixed(2)} A
          </strong>
        </p>
        <p>
          তারপর total current হয় <strong>{solved.branchRuleText}</strong>।
        </p>
        <p>
          Beginner-দের common mistake হলো ভাবা যে সব branch-এ current একই থাকবে।
          আসলে voltage একই থাকে, কিন্তু current branch resistance-এর ওপর নির্ভর করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> সব branch-এর across একই voltage থাকে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Total current হলো সব branch current-এর যোগফল।
        </p>
        <p>
          <strong>
            Checkpoint Question: Parallel circuit-এ total current বের করতে কী কী যোগ করতে হয়?
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
                <p>একটি বাড়ির light circuit কল্পনা করুন।</p>
                <p>
                  সাধারণত প্রতিটি light parallel-এ connected থাকে, তাই প্রতিটি
                  light একই source voltage পায়।
                </p>
                <p>
                  যদি একটি light নষ্ট হয়ে যায়, তবুও অন্য light-গুলো চালু থাকতে পারে,
                  কারণ তাদের branch এখনো complete থাকে।
                </p>
                <p>
                  একই idea distribution board, machine panel, এবং অনেক control system-এ দেখা যায়।
                </p>
                <p>
                  কোনো real parallel circuit দেখলে খেয়াল করুন, প্রতিটি load কি একই source-এর across connected?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: House light circuit-এ একটি light নষ্ট হলেও অন্য light-গুলো কেন চলতে পারে?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Parallel circuit-এ current-এর জন্য একের বেশি path থাকে।</li>
          <li>প্রতিটি branch একই source voltage পায়।</li>
          <li>Branch current branch resistance-এর ওপর নির্ভর করে।</li>
          <li>Total current হলো সব branch current-এর যোগফল।</li>
          <li>একটি branch বন্ধ হলেও অন্য branch কাজ করতে পারে।</li>
          <li>Parallel circuit real electrical system-এ খুব common।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
