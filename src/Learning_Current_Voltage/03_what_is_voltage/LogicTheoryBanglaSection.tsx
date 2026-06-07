"use client";

import {
  DEFAULT_VOLTAGE,
  getPressureLevel,
  getPressurePercent,
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
  const resistance = 6;
  const current = voltage / resistance;
  const pressureLevel = getPressureLevel(voltage);
  const pressurePercent = getPressurePercent(voltage);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় voltage কী বোঝায়?",
      answer: "Voltage মানে electrical push বা electrical pressure।",
    },
    {
      question: "Voltage আর current কি একই জিনিস?",
      answer: "না। Voltage হলো push, আর current হলো সেই push-এর কারণে হওয়া flow.",
    },
    {
      question: "Voltage বাড়লে আর resistance একই থাকলে সাধারণত কী হয়?",
      answer: "Push stronger হয়, তাই current সাধারণত বেড়ে যায়।",
    },
    {
      question: "Water analogy-তে voltage কোন জিনিসের মতো?",
      answer: "Water pressure voltage-কে বোঝায়।",
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
              Voltage কী?
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Voltage হলো সেই electrical push, যা charge-কে circuit-এর ভেতর move করাতে চায়।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এটি খুব সহজভাবে step by step শিখব। আগে electronics না জানলেও তুমি এই lesson follow করতে পারবে।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একবার water pressure-এর picture মাথায় আনো। Pressure বেশি হলে পানির push বেশি হয়। Voltage-ও একই ধরনের কাজ করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Pressure Level" value={pressureLevel} tone="cyan" />
            <ValueCard label="Flow Strength" value={`${pressurePercent}%`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>Voltage হলো electrical push, যা charge-কে circuit-এর ভেতর দিয়ে এগিয়ে নিতে চায়।</p>
        <p>
          সহজ ভাষায়, voltage আমাদের বলে push কতটা strong। এটি actual flow নয়। এটি flow হওয়ার আগে push কতটা আছে, সেটা বোঝায়।
        </p>
        <p>
          Pipe-এর ভেতর পানির pressure কল্পনা করো। Pressure বেশি হলে পানি আরও জোরে সামনে যেতে চায়। Voltage-ও ঠিক এমনভাবেই charge-কে push করে।
        </p>
        <p>
          <strong>Checkpoint Question: Voltage কি electrical push বোঝায়, নাকি actual charge flow বোঝায়?</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>Voltage গুরুত্বপূর্ণ কারণ এটি circuit-এ কাজ শুরু করার push দেয়।</p>
        <p>
          Voltage যথেষ্ট না হলে lamp dim হতে পারে, motor দুর্বলভাবে চলতে পারে, বা device একদমই start নাও করতে পারে।
        </p>
        <p>
          Voltage বাড়লে push বাড়ে। Resistance একই থাকলে এই stronger push সাধারণত আরও বেশি current তৈরি করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage হলো circuit-এর শুরুতে থাকা electrical push।
        </p>
        <p>
          <strong>যা খেয়াল করবে:</strong> Circuit complete থাকলেও voltage কম হলে device ঠিকমতো কাজ নাও করতে পারে।
        </p>
        <p>
          <strong>Checkpoint Question: Weak battery থাকলে lamp কেন কম আলো দেয়?</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>
          Battery voltage তৈরি করে। এই voltage charge-কে battery-এর এক পাশ থেকে circuit-এর ভেতর দিয়ে অন্য পাশে যেতে push দেয়।
        </p>
        <p>
          Path complete থাকলে এই push current তৈরি করতে পারে। Path ভেঙে গেলে push থাকতে পারে, কিন্তু current চলতে পারে না।
        </p>
        <p>
          Resistance charge move করাকে harder করে। তাই voltage আর resistance একসঙ্গে current-কে affect করে।
        </p>
        <p>
          Beginner-রা অনেক সময় voltage আর current-কে একই জিনিস মনে করে। আসলে তারা এক নয়। Voltage হলো push। Current হলো moving charge।
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{voltage.toFixed(1)} V</strong>। Resistor হলো <strong>{resistance.toFixed(1)} Ohm</strong>। এই combination-এর কারণে current হয় <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ হিসাব: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          তাই voltage বাড়লে push stronger হয়, আর resistance একই থাকলে current সাধারণত বেড়ে যায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Voltage বেশি মানে electrical pressure বেশি।
        </p>
        <p>
          <strong>মূল কথা:</strong> Stronger electrical pressure সাধারণত আরও বেশি current তৈরি করে, যদি resistance একই থাকে।
        </p>
        <p>
          <strong>Checkpoint Question: Voltage বাড়লে আর resistance একই থাকলে current-এর কী হয়?</strong>
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
                <p>একটি torch light বা ছোট battery fan-এর কথা ভাবো।</p>
                <p>
                  Battery fresh থাকলে voltage stronger হয়। এর মানে electrical push-ও stronger হয়।
                </p>
                <p>
                  এই stronger push-এর কারণে lamp brighter হতে পারে বা fan ভালোভাবে spin করতে পারে। Battery weak হলে push কমে যায়।
                </p>
                <p>
                  এই কারণেই technician-রা battery, power supply, control panel, আর electronic board test করার সময় voltage check করে।
                </p>
                <p>
                  Real device দেখলে এই প্রশ্নটা ভাবো: electrical push কি device-টাকে ঠিকভাবে কাজ করানোর জন্য যথেষ্ট?
                </p>
                <p>
                  <strong>Checkpoint Question: Battery-র voltage কমে গেলে সাধারণত device-এর কী হয়?</strong>
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
          <li>Voltage হলো electrical push।</li>
          <li>Voltage অনেকটা water pressure-এর মতো।</li>
          <li>Voltage বেশি হলে push বেশি হয়।</li>
          <li>Voltage আর resistance মিলে current-কে affect করে।</li>
          <li>Voltage আর current একই জিনিস নয়।</li>
          <li>Simulation-এ stronger push circuit-এ কীভাবে কাজ করে, সেটা দেখা যায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer দেখে নাও।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
