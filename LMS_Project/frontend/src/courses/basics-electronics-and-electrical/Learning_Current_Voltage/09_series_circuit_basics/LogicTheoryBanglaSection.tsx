"use client";

import {
  DEFAULT_RESISTANCE_ONE,
  DEFAULT_RESISTANCE_TWO,
  DEFAULT_VOLTAGE,
  LED_DROP,
  getFlowLevel,
  solveSeriesCircuitLesson,
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
  const solved = solveSeriesCircuitLesson(
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE_ONE,
    DEFAULT_RESISTANCE_TWO,
  );
  const flowLevel = getFlowLevel(solved.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় series circuit কী?",
      answer:
        "Series circuit হলো এমন circuit, যেখানে component-গুলো একটার পর একটা একটি single path-এ connected থাকে।",
    },
    {
      question: "Series circuit-এ current-এর কয়টি path থাকে?",
      answer:
        "Series circuit-এ current-এর জন্য only one path থাকে।",
    },
    {
      question: "Series circuit-এ total resistance-এর কী হয়?",
      answer:
        "সব resistance যোগ হয়ে total resistance বড় হয়ে যায়।",
    },
    {
      question: "Series circuit-এ একটি part open হলে কী হয়?",
      answer:
        "একটি part open হলে single path ভেঙে যায়, তাই পুরো circuit বন্ধ হয়ে যায়।",
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
              Series Circuit Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Series circuit-এ current-এর জন্য only one path থাকে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা বিষয়টি ধাপে ধাপে সহজভাবে শিখব। এই lesson বুঝতে advanced theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Series circuit-এ component-গুলো এক লাইনে থাকে,
              তাই একই current সব component-এর মধ্য দিয়ে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${solved.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={flowLevel} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Series circuit হলো এমন circuit, যেখানে component-গুলো একটার পর একটা single path-এ connected থাকে।
        </p>
        <p>
          সহজ ভাষায়, current-এর সামনে শুধুমাত্র একটি road খোলা থাকে।
        </p>
        <p>
          এর মানে resistor one, resistor two, LED, এবং বাকি path-এর মধ্য দিয়ে একই current flow করে।
        </p>
        <p>
          যদি একটি part open হয়ে যায়, তাহলে পুরো path ভেঙে যায় এবং circuit বন্ধ হয়ে যায়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Series circuit-এ current-এর জন্য one path থাকে, নাকি many paths?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ অনেক simple training circuit এবং basic control circuit series connection-এ built হয়।
        </p>
        <p>
          এটি student-দের বুঝতে সাহায্য করে, current কীভাবে behave করে যখন সব part একই path share করে।
        </p>
        <p>
          Technician-রাও continuity test, broken connection খোঁজা, এবং total resistance calculate করার সময় এই idea ব্যবহার করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> একটি part broken হলে পুরো series circuit বন্ধ হয়ে যেতে পারে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> Series connection-এ resistance-গুলো যোগ হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: একটি broken component কেন পুরো series circuit বন্ধ করে দিতে পারে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Series circuit-এ source current-কে একটি complete path-এর মধ্য দিয়ে সব component-এর ভিতর push করে।
        </p>
        <p>
          যেহেতু only one path আছে, তাই সব series component-এর মধ্য দিয়ে same current flow করে।
        </p>
        <p>
          Resistance-গুলো যোগ হয়। এই lesson-এ resistor one হলো{" "}
          <strong>{solved.resistanceOne.toFixed(1)} Ohm</strong> এবং resistor two হলো{" "}
          <strong>{solved.resistanceTwo.toFixed(1)} Ohm</strong>, তাই total resistance হয়{" "}
          <strong>{solved.totalResistance.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          LED-ও প্রায় <strong>{solved.ledDrop.toFixed(1)} V</strong> ব্যবহার করে, তাই resistor-গুলোর জন্য available voltage কিছুটা কমে যায়।
        </p>
        <p>
          সহজ calculation:{" "}
          <strong>
            I = (V - LED drop) / R total = ({solved.voltage.toFixed(1)} - {LED_DROP.toFixed(1)}) /{" "}
            {solved.totalResistance.toFixed(1)} = {solved.current.toFixed(2)} A
          </strong>
        </p>
        <p>
          Beginner-দের common mistake হলো ভাবা যে series-এ প্রতিটি resistor-এর current আলাদা হয়। আসলে পুরো path-এ current একই থাকে।
        </p>
        <p>
          Voltage drop resistor-গুলোর মধ্যে ভাগ হয়ে যায়। এই example-এ একটি drop হলো{" "}
          <strong>{solved.dropOne.toFixed(1)} V</strong> এবং অন্যটি হলো{" "}
          <strong>{solved.dropTwo.toFixed(1)} V</strong>।
        </p>
        <p>
          <strong>মূল কথা:</strong> Series circuit মানে one path এবং shared current।
        </p>
        <p>
          <strong>মূল কথা:</strong> আরও series resistor যোগ করলে total resistance বেড়ে যায়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Series-এ আরেকটি resistor যোগ করলে total resistance-এর কী হয়?
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
                <p>একটি flashlight কল্পনা করুন, যেখানে battery, switch, আর lamp এক লাইনে আছে।</p>
                <p>
                  Current battery থেকে বের হয়ে switch-এর মধ্য দিয়ে যায়, তারপর lamp-এর মধ্য দিয়ে গিয়ে আবার battery-তে ফিরে আসে।
                </p>
                <p>
                  যদি lamp filament break করে, তাহলে single path open হয়ে যায় এবং পুরো flashlight বন্ধ হয়ে যায়।
                </p>
                <p>
                  এই একই idea simple sensor loop, basic training board, এবং অনেক introductory control circuit-এ দেখা যায়।
                </p>
                <p>
                  কোনো real series circuit দেখলে এই প্রশ্নটি ভাবুন: সব part কি একই path-এ এক লাইনে আছে?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Flashlight-style series circuit-এ একটি part open হলে কী হয়?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Series circuit-এ current-এর জন্য only one path থাকে।</li>
          <li>সব series component-এর মধ্যে same current flow করে।</li>
          <li>Series connection-এ resistance-গুলো যোগ হয়।</li>
          <li>Voltage drop component-গুলোর মধ্যে ভাগ হয়ে যায়।</li>
          <li>একটি part open হলে পুরো circuit বন্ধ হয়ে যায়।</li>
          <li>Series circuit basic circuit behavior শেখার জন্য খুব useful।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
