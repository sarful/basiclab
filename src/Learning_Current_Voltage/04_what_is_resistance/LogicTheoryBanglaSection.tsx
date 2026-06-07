"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowPercent,
  getResistanceLevel,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";
import { WaterFlowAnalogyPreview } from "../../water-flow analogy/WaterFlowAnalogyPreview";

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
  eyebrow = "Course Module",
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

export function LogicTheoryBanglaSection() {
  const voltage = DEFAULT_VOLTAGE;
  const resistance = DEFAULT_RESISTANCE;
  const current = calculateCurrent(voltage, resistance);
  const resistanceLevel = getResistanceLevel(resistance);
  const flowPercent = getFlowPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় resistance বলতে কী বোঝায়?",
      answer: "Resistance মানে current flow-এর বিপরীত বাধা। এটি charge-এর চলাচল কঠিন করে।",
    },
    {
      question: "Resistance বাড়লে আর voltage একই থাকলে কী হয়?",
      answer: "Current কমে যায়, কারণ charge-এর চলার পথ কঠিন হয়ে যায়।",
    },
    {
      question: "Resistance কি current তৈরি করে?",
      answer: "না। Voltage push তৈরি করে। Resistance ঠিক করে সেই push charge-কে কত সহজে move করাতে পারবে।",
    },
    {
      question: "Water analogy-তে resistance কোন কিছুর মতো?",
      answer: "একটি সরু পাইপ resistance-এর মতো, কারণ এটি flow কমিয়ে দেয়।",
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
              Resistance কী?
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Resistance হলো সার্কিটের সেই অংশ, যা charge-এর চলাচল ধীর করে দেয়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এটি খুব সহজভাবে step by step শিখব। আগে electronics না জানলেও তুমি এই lesson সহজে follow করতে পারবে।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি সরু পাইপ কল্পনা করো। পাইপ যত সরু হবে, পানির flow তত কঠিন হবে। Resistance-ও একই রকমভাবে charge-এর flow কঠিন করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Resistance Level" value={resistanceLevel} tone="cyan" />
            <ValueCard label="Flow Strength" value={`${flowPercent}%`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>
          Resistance হলো current flow-এর বিপরীত বাধা।
        </p>
        <p>
          সহজ ভাষায়, resistance charge-কে সার্কিটের ভেতর দিয়ে move করতে কঠিন করে তোলে।
        </p>
        <p>
          Resistor হলো এমন একটি component, যা এই বাধা controlled way-তে যোগ করে। এটি circuit-এর parts-কে protect করে এবং current কতটুকু যাবে, তা control করতে সাহায্য করে।
        </p>
        <p>
          Pipe-এর ভেতর পানি চলার কথা ভাবো। পাইপ সরু হলে পানি চলতে পারে, কিন্তু তার চলা কঠিন হয়ে যায়। Resistance-ও ঠিক এমনভাবেই কাজ করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Resistance কি charge-কে সহজে চলতে সাহায্য করে, নাকি চলা কঠিন করে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          Resistance গুরুত্বপূর্ণ কারণ এটি current control করে এবং circuit-কে safe রাখতে সাহায্য করে।
        </p>
        <p>
          যথেষ্ট resistance না থাকলে খুব বেশি current flow করতে পারে। এতে wire গরম হতে পারে, part নষ্ট হতে পারে, বা component fail করতে পারে।
        </p>
        <p>
          সঠিক resistance থাকলে lamp ঠিকভাবে জ্বলে, LED safe থাকে, এবং circuit controlled way-তে কাজ করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Resistance circuit-কে protect করে এবং control করে।
        </p>
        <p>
          <strong>যা খেয়াল করবে:</strong> Voltage একই থাকলে resistance বেশি মানে current সাধারণত কম।
        </p>
        <p>
          <strong>
            Checkpoint Question: Circuit-এ resistance দরকার কেন, সব charge-কে freely move করতে দিলেই তো হতো?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>
          Battery voltage দেয়, আর voltage হলো push। Resistance সেই path-এর ভেতর দাঁড়িয়ে charge-এর চলা কঠিন করে।
        </p>
        <p>
          Resistance কম হলে charge সহজে move করতে পারে। Resistance বেশি হলে charge move করা কঠিন হয়, তাই current ছোট হয়ে যায়।
        </p>
        <p>
          Beginner-রা অনেক সময় ভাবে resistance সব current একেবারে বন্ধ করে দেয়। আসলে সবসময় তা নয়। সাধারণত এটি current কমিয়ে দেয়, একেবারে বন্ধ করে না।
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{voltage.toFixed(1)} V</strong>। Resistor হলো <strong>{resistance.toFixed(1)} Ohm</strong>। এই combination-এর কারণে current হয় <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ হিসাব: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          তাই সহজ idea হলো এই: voltage push দেয়, resistance movement slow করে, আর current হলো আমরা যে final result দেখি।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage একই থাকলে resistance বেশি মানে current কম।
        </p>
        <p>
          <strong>মূল কথা:</strong> Resistance current-কে নিয়ন্ত্রণ করে, যাতে circuit-এ current খুব বেশি না হয়ে যায়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Resistance বাড়লে আর voltage একই থাকলে current-এর কী হয়?
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
                Real Device Example
              </div>
              <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                বাস্তব উদাহরণ
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>
                  একটি ছোট electronic board-এর LED-এর কথা ভাবো।
                </p>
                <p>
                  সেই LED-এর সাথে সাধারণত series-এ একটি resistor থাকে। এই resistor current limit করে, যাতে LED নষ্ট না হয়ে যায়।
                </p>
                <p>
                  Resistor খুব ছোট হলে বেশি current flow করতে পারে। Resistor খুব বড় হলে LED dim হয়ে যেতে পারে।
                </p>
                <p>
                  এই কারণেই technician-রা control board, charger, signal circuit, আর অনেক industrial device-এ resistor ব্যবহার করে।
                </p>
                <p>
                  কোনো real device দেখলে এই প্রশ্নটা ভাবো: এখানে resistance কি current-কে safe amount-এ control করছে?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: LED-এর circuit-এ resistance খুব কম হলে কী হতে পারে?
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <WaterFlowAnalogyPreview />
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Resistance হলো current flow-এর বিপরীত বাধা।</li>
          <li>Resistance অনেকটা water system-এর narrow pipe-এর মতো।</li>
          <li>Resistance বেশি মানে charge কম সহজে move করবে।</li>
          <li>Resistance কম মানে current সহজে বাড়তে পারে।</li>
          <li>Resistance circuit-কে protect করে এবং control করে।</li>
          <li>Simulation-এ দেখা যায় resistance কীভাবে current flow বদলে দেয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer দেখে নাও।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
