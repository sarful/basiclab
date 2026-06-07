"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
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

export default function LogicTheoryBanglaTab() {
  const voltage = DEFAULT_VOLTAGE;
  const resistance = DEFAULT_RESISTANCE;
  const current = calculateCurrent(voltage, resistance);
  const flowLevel = getFlowLevel(current);
  const flowPercent = getFlowPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় বিদ্যুৎ কী বোঝায়?",
      answer: "বিদ্যুৎ মানে electric charge একটি complete path-এর ভেতর দিয়ে move করছে।",
    },
    {
      question: "Path ভেঙে গেলে charge কি move করতে পারে?",
      answer: "না। Charge move করার জন্য complete path দরকার।",
    },
    {
      question: "Water analogy-তে resistance কিসের মতো?",
      answer: "Narrow pipe resistance-কে বোঝায়।",
    },
    {
      question: "Current আমাদের কী জানায়?",
      answer: "Current জানায় আসলে কত charge flow করছে।",
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
              বিদ্যুৎ কী?
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              বিদ্যুৎ হলো electric charge-এর flow, যা একটি complete path-এর ভেতর দিয়ে চলতে পারে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এটি step by step খুব সহজভাবে শিখব। আগে electronics না জানলেও তুমি এই lesson বুঝতে পারবে।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একবার water flow-এর picture মাথায় আনো। Pipe complete থাকলে পানি move করে। বিদ্যুৎও একই ধরনের নিয়ম follow করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Charge Flow" value={`${current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={`${flowLevel} - ${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>বিদ্যুৎ হলো electric charge-এর movement, যা একটি complete path-এর মধ্যে হয়।</p>
        <p>
          Electric charge হলো ছোট electrical quantity, যা circuit-এর ভেতর move করে। Circuit মানে wire আর component দিয়ে তৈরি একটি complete পথ।
        </p>
        <p>
          Closed pipe loop-এর মধ্যে পানি flow করার কথা ভাবো। Pipe complete থাকলে পানি move করতে পারে। Pipe ভেঙে গেলে flow বন্ধ হয়ে যায়। এই lesson-এ আমরা একই water-flow analogy ব্যবহার করব।
        </p>
        <p>
          <strong>Checkpoint Question: যদি path ভেঙে যায়, তাহলে electric charge কি circuit-এর ভেতর move করতে পারবে?</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>বিদ্যুৎ গুরুত্বপূর্ণ কারণ modern device-এর প্রায় সবকিছুই এটি ব্যবহার করে কাজ করে।</p>
        <p>
          Phone charger, fan, light, motor, আর control panel সবই depend করে electric charge-এর সঠিক movement-এর ওপর।
        </p>
        <p>
          যদি তুমি বিদ্যুতের basic idea বুঝতে পারো, তাহলে পরের topic যেমন current, voltage, resistance, আর circuit testing অনেক সহজ লাগবে।
        </p>
        <p>
          <strong>Checkpoint Question: এমন একটি real device-এর নাম বলো, যেটি কাজ করতে electricity প্রয়োজন।</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>প্রথমে source push দেয়। এই lesson-এ battery হলো source।</p>
        <p>
          Voltage হলো electrical push। সহজ ভাষায়, voltage charge-কে circuit-এর ভেতর move করাতে চায়।
        </p>
        <p>
          Resistance হলো সেই অংশ, যা movement-কে কঠিন করে। সহজভাবে বললে, resistance charge-এর flow-কে slow করে দেয়, ঠিক যেমন narrow pipe পানির flow কমিয়ে দেয়।
        </p>
        <p>
          Current হলো actual flow। সহজ ভাষায়, current আমাদের বলে আসলে কত charge really moving after push and resistance work together.
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{voltage.toFixed(1)} V</strong>। Resistor হলো <strong>{resistance.toFixed(1)} Ohm</strong>। এই combination-এর কারণে current হয় <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ হিসাব: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          তাই order খুব simple: source push দেয়, path complete থাকে, resistance movement slow করে, আর current result দেখায়।
        </p>
        <p>
          <strong>Checkpoint Question: Voltage, resistance, আর current-এর মধ্যে কোন term electrical push বোঝায়?</strong>
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
                <p>একটি simple torch light বা battery light-এর কথা ভাবো।</p>
                <p>
                  যখন switch close হয়, path complete হয়ে যায়। তখন charge battery থেকে bulb-এর দিকে যায়, তারপর আবার ফিরে আসে।
                </p>
                <p>
                  যদি battery weak হয়, push smaller হয়। যদি path damage হয়, light জ্বলে না। যদি lamp-এর resistance বেশি হয়, less current flows.
                </p>
                <p>
                  এই same logic home lighting, machine panel, alarm circuit, আর electronic board-এও কাজ করে।
                </p>
                <p>
                  <strong>Checkpoint Question: একটি torch light-এ lamp জ্বলার আগে কোন condition ঠিক থাকতে হবে?</strong>
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
          <li>বিদ্যুৎ মানে electric charge move করছে।</li>
          <li>Charge move করার জন্য complete path দরকার।</li>
          <li>Voltage push দেয়।</li>
          <li>Resistance movement slow করে।</li>
          <li>Current actual flow দেখায়।</li>
          <li>Water-flow analogy একই idea বুঝতে সাহায্য করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer দেখে নাও।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
