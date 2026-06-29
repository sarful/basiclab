"use client";

import type { ReactNode } from "react";

import { WaterFlowAnalogyPreview } from "../../water-flow analogy/WaterFlowAnalogyPreview";
import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../shared/quiz_accordion";
import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  getFlowPercent,
} from "./logic";

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
  children: ReactNode;
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
      question: "সহজ ভাষায় বিদ্যুৎ কী?",
      answer:
        "বিদ্যুৎ হলো electric charge-এর flow একটি complete closed path-এর মধ্যে।",
    },
    {
      question: "Electric charge কী?",
      answer:
        "Electric charge হলো একটি মৌলিক electrical property। Metal wire-এর ভেতরে electron এই charge বহন করে।",
    },
    {
      question: "Electron কী?",
      answer:
        "Electron হলো খুব ছোট negatively charged particle, যা metal conductor-এর ভেতরে move করতে পারে।",
    },
    {
      question: "Path ভেঙে গেলে charge কি move করতে পারে?",
      answer: "না। Charge move করার জন্য complete closed circuit path প্রয়োজন।",
    },
    {
      question: "Voltage কী কাজ করে?",
      answer:
        "Voltage charge-কে circuit-এর মধ্যে move করার জন্য electrical push দেয়।",
    },
    {
      question: "Resistance কী কাজ করে?",
      answer:
        "Resistance charge-এর movement-কে কঠিন করে এবং current কমিয়ে দেয়।",
    },
    {
      question: "Current আমাদের কী জানায়?",
      answer: "Current জানায় circuit-এর মধ্যে আসলে কত charge flow করছে।",
    },
    {
      question: "Water analogy-তে voltage কিসের মতো?",
      answer:
        "Water pressure voltage-এর মতো কাজ করে, কারণ pressure পানি push করে আর voltage charge push করে।",
    },
    {
      question: "Water analogy-তে resistance কিসের মতো?",
      answer:
        "Narrow pipe resistance-এর মতো কাজ করে, কারণ narrow pipe flow কমিয়ে দেয়।",
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
              বিদ্যুৎ হলো electric charge-এর flow, যা একটি complete closed
              circuit path-এর মধ্যে ঘটে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সহজভাবে বললে, যখন charge একটি সম্পূর্ণ পথে চলাচল করতে পারে, তখনই
              electricity কাজ করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এ আমরা step by step শিখব। আগে electronics না জানলেও তুমি
              সহজেই বুঝতে পারবে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard
              label="Voltage Push"
              value={`${voltage.toFixed(1)} V`}
              tone="red"
            />
            <ValueCard
              label="Charge Flow"
              value={`${current.toFixed(2)} A`}
              tone="blue"
            />
            <ValueCard
              label="Flow Level"
              value={`${flowLevel} - ${flowPercent}%`}
              tone="cyan"
            />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>
          বিদ্যুৎ হলো electric charge-এর movement, যা একটি complete closed
          circuit-এর মধ্যে হয়।
        </p>

        <p>
          Electric charge হলো একটি মৌলিক electrical property। Metal wire-এর
          ভেতরে electron নামের ক্ষুদ্র কণাগুলো charge বহন করে।
        </p>

        <p>
          Circuit হলো wire এবং component দিয়ে তৈরি একটি complete closed path।
          Path complete থাকলে charge চলতে পারে, আর path ভেঙে গেলে charge flow
          বন্ধ হয়ে যায়।
        </p>

        <p>
          <strong>
            Checkpoint Question: যদি circuit path ভেঙে যায়, তাহলে electric
            charge কি move করতে পারবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          বিদ্যুৎ গুরুত্বপূর্ণ কারণ modern device-এর প্রায় সবকিছুই electricity
          ব্যবহার করে কাজ করে।
        </p>

        <p>
          Phone charger, fan, light, motor, computer, control panel এবং sensor
          circuit—সবই depend করে electric charge-এর সঠিক movement-এর ওপর।
        </p>

        <p>
          যদি তুমি electricity-এর basic idea বুঝতে পারো, তাহলে current, voltage,
          resistance, Ohm&apos;s law এবং circuit testing অনেক সহজ লাগবে।
        </p>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <strong>নিরাপত্তা সতর্কতা:</strong> এই lesson শুধুমাত্র concept শেখার
          জন্য। বাস্তব electrical system বিপজ্জনক হতে পারে, তাই practical কাজের
          সময় অবশ্যই proper safety rules follow করতে হবে।
        </p>

        <p>
          <strong>
            Checkpoint Question: এমন একটি real device-এর নাম বলো, যেটি কাজ করতে
            electricity প্রয়োজন।
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>প্রথমে source push দেয়। এই lesson-এ battery হলো source।</p>

        <p>
          Voltage হলো electrical push। সহজ ভাষায়, voltage charge-কে circuit-এর
          মধ্যে move করাতে চায়।
        </p>

        <p>
          Resistance হলো সেই অংশ, যা movement-কে কঠিন করে। সহজভাবে বললে,
          resistance charge-এর flow slow করে দেয়, ঠিক যেমন narrow pipe পানির
          flow কমিয়ে দেয়।
        </p>

        <p>
          Current হলো actual flow। সহজ ভাষায়, current আমাদের বলে circuit-এর
          মধ্যে আসলে কত charge flow করছে।
        </p>

        <p>
          এই simulation-এ battery দেয় <strong>{voltage.toFixed(1)} V</strong>।
          Resistor হলো <strong>{resistance.toFixed(1)} Ohm</strong>। এই
          combination-এর কারণে current হয়{" "}
          <strong>{current.toFixed(2)} A</strong>।
        </p>

        <p>
          সহজ হিসাব:{" "}
          <strong>
            I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} ={" "}
            {current.toFixed(2)} A
          </strong>
        </p>

        <p>
          তাই order খুব simple: source push দেয়, path complete থাকে, resistance
          movement slow করে, আর current result দেখায়।
        </p>

        <p>
          <strong>
            Checkpoint Question: Voltage, resistance, আর current-এর মধ্যে কোন
            term electrical push বোঝায়?
          </strong>
        </p>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-cyan-300 to-sky-400" />

        <div className="p-5 md:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Water Analogy
            </div>

            <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
              পানির flow দিয়ে সহজভাবে বুঝি
            </h2>

            <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
              <p>
                ভাবো, একটি pump pipe-এর মধ্যে পানি ঠেলে পাঠাচ্ছে। Pipe complete
                থাকলে পানি flow করতে পারে।
              </p>

              <p>Voltage হলো water pressure-এর মতো। এটি charge-কে push করে।</p>

              <p>
                Current হলো কত পানি বাস্তবে flow করছে, তার মতো। Circuit-এ এটি
                actual charge flow বোঝায়।
              </p>

              <p>
                Resistance হলো narrow pipe-এর মতো। Narrow pipe যেমন পানি flow
                কমিয়ে দেয়, resistance তেমনি charge flow কমিয়ে দেয়।
              </p>

              <p>
                এই analogy beginner-দের জন্য circuit-এর ভেতরের behaviour কল্পনা
                করা সহজ করে।
              </p>
            </div>
          </div>

          <div className="mt-5">
            <WaterFlowAnalogyPreview />
          </div>
        </div>
      </section>

      <SectionCard title="বাস্তব উদাহরণ" eyebrow="Real Device Example">
        <p>একটি torch light বা battery light-এর কথা ভাবো।</p>

        <p>
          Switch open থাকলে path broken থাকে। তাই charge flow করতে পারে না এবং
          light জ্বলে না।
        </p>

        <p>
          Switch close করলে circuit complete হয়। তখন battery থেকে charge lamp-এর
          মধ্য দিয়ে flow করে এবং light জ্বলে ওঠে।
        </p>

        <p>
          Battery weak হলে voltage push কমে যায়। Path damaged হলে current flow
          ঠিকভাবে হয় না। Component resistance বেশি হলে current কমে যায়।
        </p>

        <p>
          এই একই logic home wiring, industrial control panel, PLC system, sensor
          circuit এবং electronic device-এ ব্যবহৃত হয়।
        </p>

        <p>
          <strong>
            Checkpoint Question: Torch light জ্বলার জন্য switch-এর কী অবস্থা
            থাকতে হবে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>বিদ্যুৎ মানে electric charge-এর flow।</li>
          <li>Charge flow করার জন্য complete closed circuit path দরকার।</li>
          <li>Metal wire-এর ভেতরে electron charge বহন করে।</li>
          <li>Voltage charge-কে push করে।</li>
          <li>Resistance charge-এর movement slow করে।</li>
          <li>Current actual charge flow দেখায়।</li>
          <li>Water-flow analogy দিয়ে concept সহজে কল্পনা করা যায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question open করে answer check করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
