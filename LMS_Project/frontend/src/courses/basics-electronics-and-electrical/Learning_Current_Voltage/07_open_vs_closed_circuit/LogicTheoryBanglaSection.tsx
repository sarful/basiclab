"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCircuitExplanation,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "red" | "blue";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

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
  const closedCurrent = calculateCurrent(
    "closed",
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE,
  );
  const openCurrent = calculateCurrent(
    "open",
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE,
  );

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Open circuit আর closed circuit-এর main difference কী?",
      answer: "Closed circuit-এ পূর্ণ path থাকে, কিন্তু open circuit-এ path ভাঙা থাকে।",
    },
    {
      question: "Open circuit-এ কি current flow করতে পারে?",
      answer: "না। Path broken হলে current flow করতে পারে না।",
    },
    {
      question: "Open circuit হলে LED off হয়ে যায় কেন?",
      answer: "কারণ current পুরো loop complete করতে পারে না, তাই load কাজ করে না।",
    },
    {
      question: "Electronics-এ closed path important কেন?",
      answer: "কারণ electrical charge-কে source থেকে বের হয়ে আবার source-এ ফেরার জন্য complete loop দরকার।",
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
              Open Circuit vs Closed Circuit
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              একটি circuit তখনই কাজ করে, যখন electrical path complete থাকে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা lesson-টা ধাপে ধাপে শিখবো। এটা বুঝতে advanced electrical theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Closed circuit হলো full loop, আর open circuit হলো broken path যেখানে movement থেমে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Closed State" value="Current Flows" tone="amber" />
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Closed Current" value={`${closedCurrent.toFixed(2)} A`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Closed circuit-এ source থেকে charge বের হয়ে components-এর মধ্য দিয়ে আবার source-এ ফেরার জন্য complete path থাকে।
        </p>
        <p>
          Open circuit-এ সেই path-এর কোথাও না কোথাও break থাকে।
        </p>
        <p>
          সহজ ভাষায়, closed circuit charge-কে move করতে দেয়, কিন্তু open circuit charge-কে থামিয়ে দেয়।
        </p>
        <p>
          এই কারণেই switch একটি device-কে on বা off করতে পারে। এটা path-কে close করে বা open করে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Circuit কি path complete হলে কাজ করে, নাকি path broken হলে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই idea গুরুত্বপূর্ণ কারণ প্রতিটি working electrical circuit-এর জন্য complete path দরকার।
        </p>
        <p>
          যদি path break হয়ে যায়, current সঙ্গে সঙ্গে থেমে যায় এবং load কাজ করা বন্ধ করে।
        </p>
        <p>
          Student, technician, আর electrician-রা প্রতিদিন এই idea ব্যবহার করে switch, fuse, broken wire, আর loose connection check করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Current flow করার জন্য complete path দরকার।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> ছোট একটি break-ও পুরো circuit থামিয়ে দিতে পারে।
        </p>
        <p>
          <strong>
            Checkpoint Question: একটি broken wire কেন পুরো circuit stop করে দিতে পারে?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Closed circuit-এ battery charge-কে পুরো loop-এর মধ্যে push করে, তাই current components-এর মধ্য দিয়ে move করে source-এ ফিরে যেতে পারে।
        </p>
        <p>
          Open circuit-এ loop-এর মধ্যে break থাকে, তাই charge path complete করতে পারে না।
        </p>
        <p>
          Beginner-দের common mistake হলো শুধু voltage থাকলেই device কাজ করবে ভাবা। আসলে voltage থাকতে পারে, কিন্তু complete path ছাড়া current flow করবে না।
        </p>
        <p>
          এই lesson-এ closed circuit explanation হলো: <strong>{getCircuitExplanation("closed")}</strong>
        </p>
        <p>
          Open state-এ current হয়ে যায় <strong>{openCurrent.toFixed(2)} A</strong>, কারণ path broken।
        </p>
        <p>
          Closed state-এ <strong>{DEFAULT_VOLTAGE.toFixed(1)} V</strong> আর <strong>{DEFAULT_RESISTANCE.toFixed(1)} Ohm</strong> থাকলে current হয় <strong>{closedCurrent.toFixed(2)} A</strong>।
        </p>
        <p>
          <strong>মূল কথা:</strong> Current শুধু complete loop-এ flow করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Path-এর একটি break পুরো circuit-কে থামিয়ে দেয়, শুধু একটি part-কে না।
        </p>
        <p>
          <strong>
            Checkpoint Question: Circuit open হলে LED off হয়ে যায় কেন?
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
                <p>
                  একটি wall switch আর room light কল্পনা করুন।
                </p>
                <p>
                  Switch on করলে path close হয় এবং light on হয়।
                </p>
                <p>
                  Switch off করলে path open হয় এবং light off হয়ে যায়।
                </p>
                <p>
                  একই idea door switch, emergency stop button, fuse holder, আর অনেক control panel-এ ব্যবহার হয়।
                </p>
                <p>
                  কোনো real device দেখলে এই question-টা ভাবুন: path complete, নাকি কোথাও break আছে?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Room light circuit-এ switch path open করলে সাধারণত কী হয়?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Closed circuit-এ complete path থাকে।</li>
          <li>Open circuit-এ broken path থাকে।</li>
          <li>Current শুধু closed circuit-এ flow করে।</li>
          <li>Open circuit হলে load off হয়ে যায়।</li>
          <li>Switch path open বা close করে কাজ করে।</li>
          <li>একটি break পুরো circuit stop করে দিতে পারে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
