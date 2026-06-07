"use client";

import {
  DEFAULT_CURRENT,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  formatNumber,
  getFlowPercent,
  solveOhmsLaw,
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
  const solved = solveOhmsLaw(
    "current",
    DEFAULT_VOLTAGE,
    DEFAULT_CURRENT,
    DEFAULT_RESISTANCE,
  );
  const flowPercent = getFlowPercent(solved.current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Ohm's Law আমাদের কী calculate করতে সাহায্য করে?",
      answer: "Ohm's Law voltage, current, বা resistance calculate করতে সাহায্য করে, যদি বাকি দুইটি value জানা থাকে।",
    },
    {
      question: "I = V / R মানে কী?",
      answer: "এর মানে current equals voltage divided by resistance।",
    },
    {
      question: "Voltage একই থাকলে resistance বাড়লে current-এর কী হয়?",
      answer: "Current কমে যায়, কারণ push একই থাকে কিন্তু opposition বড় হয়ে যায়।",
    },
    {
      question: "বাস্তব কাজে Ohm's Law কেন useful?",
      answer: "এটি technician-দের circuit behavior বুঝতে, component choose করতে, আর test result check করতে সাহায্য করে।",
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
              Ohm&apos;s Law Basics
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Ohm&apos;s Law হলো সেই সহজ rule, যা voltage, current, আর resistance-কে একসঙ্গে যুক্ত করে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এটি step by step খুব সহজভাবে শিখব। এই idea বুঝতে তোমার advanced math জানার দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটিই picture মাথায় রাখো। Voltage হলো push, current হলো flow, আর resistance হলো path-এর বাধা। Ohm&apos;s Law আমাদের বলে এই তিনটি কীভাবে একসঙ্গে কাজ করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${solved.current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Strength" value={`${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>
          Ohm&apos;s Law হলো এমন একটি rule, যা সার্কিটের তিনটি basic value-কে যুক্ত করে: voltage, current, আর resistance।
        </p>
        <p>
          সহজ ভাষায়, এটি আমাদের বলে push, flow, আর opposition কীভাবে একে অপরকে affect করে।
        </p>
        <p>
          এই তিনটির মধ্যে যেকোনো দুইটি value জানা থাকলে আমরা তৃতীয়টি calculate করতে পারি।
        </p>
        <p>
          এর তিনটি common form হলো <strong>I = V / R</strong>, <strong>V = I × R</strong>, আর <strong>R = V / I</strong>।
        </p>
        <p>
          <strong>
            Checkpoint Question: Ohm&apos;s Law কি voltage, current, আর resistance-কে connect করে, নাকি শুধু current-কে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>
          Ohm&apos;s Law গুরুত্বপূর্ণ কারণ এটি circuit build করার আগেই আমাদের circuit কী করবে, তার ধারণা দেয়।
        </p>
        <p>
          এটি student, technician, আর engineer-দের safe value calculate করতে এবং কত current flow করবে তা predict করতে সাহায্য করে।
        </p>
        <p>
          এটি real circuit test করার সময়ও useful। যদি measured value expected value-এর সাথে না মেলে, তাহলে বুঝা যায় কোথাও সমস্যা থাকতে পারে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Ohm&apos;s Law missing circuit value calculate করতে সাহায্য করে।
        </p>
        <p>
          <strong>যা খেয়াল করবে:</strong> এটি design, testing, আর troubleshooting—তিনটিতেই useful।
        </p>
        <p>
          <strong>
            Checkpoint Question: Circuit power on করার আগে expected current জানা useful কেন?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>
          Ohm&apos;s Law voltage, current, আর resistance-এর relationship দেখিয়ে কাজ করে।
        </p>
        <p>
          Voltage বাড়লে আর resistance একই থাকলে current বাড়ে। Resistance বাড়লে আর voltage একই থাকলে current কমে যায়।
        </p>
        <p>
          Beginner-রা অনেক সময় শুধু একটি formula মুখস্থ করে, আর ভুলে যায় যে একই relationship তিনভাবে rearrange করা যায়। এটি একটি common mistake।
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{solved.voltage.toFixed(1)} V</strong>। Resistor হলো <strong>{solved.resistance.toFixed(1)} Ohm</strong>। এই combination-এর কারণে current হয় <strong>{solved.current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ হিসাব: <strong>I = V / R = {formatNumber(solved.voltage, 1)} / {formatNumber(solved.resistance, 1)} = {formatNumber(solved.current, 2)} A</strong>
        </p>
        <p>
          একই relationship আবার <strong>V = I × R</strong> আর <strong>R = V / I</strong> হিসেবেও লেখা যায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Ohm&apos;s Law circuit value তৈরি করে না। এটি শুধু বলে value-গুলো কীভাবে already একসঙ্গে কাজ করছে।
        </p>
        <p>
          <strong>মূল কথা:</strong> একটি value change করলে অন্তত আরেকটি value-ও change হবে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Resistance একই থাকলে voltage বাড়লে current-এর কী হয়?
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
              <h2 className="text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                বাস্তব উদাহরণ
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>
                  একটি technician LED circuit-এর জন্য resistor choose করছে—এমনটি ভাবো।
                </p>
                <p>
                  Technician battery voltage জানে, আর LED-এর safe current-ও জানে। তখন Ohm&apos;s Law ব্যবহার করে সঠিক resistor value calculate করা যায়।
                </p>
                <p>
                  একইভাবে training lab-এ কোনো student voltage আর resistance measure করে circuit on করার আগেই expected current estimate করতে পারে।
                </p>
                <p>
                  এই কারণেই Ohm&apos;s Law training lab, control panel, repair work, আর electronics design-এ ব্যবহার করা হয়।
                </p>
                <p>
                  কোনো real device দেখলে এই প্রশ্নটা ভাবো: কোন দুইটি value আমি জানি, আর কোন value আমি calculate করতে চাই?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: যদি voltage আর resistance জানা থাকে, তাহলে Ohm&apos;s Law দিয়ে কোন value calculate করা যাবে?
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
          <li>Ohm&apos;s Law voltage, current, আর resistance-কে connect করে।</li>
          <li>Voltage হলো push, current হলো flow, আর resistance হলো opposition।</li>
          <li>যেকোনো দুইটি value জানা থাকলে তৃতীয়টি calculate করা যায়।</li>
          <li>I = V / R current calculate করার জন্য ব্যবহৃত হয়।</li>
          <li>V = I × R voltage calculate করার জন্য ব্যবহৃত হয়।</li>
          <li>R = V / I resistance calculate করার জন্য ব্যবহৃত হয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer দেখে নাও।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
