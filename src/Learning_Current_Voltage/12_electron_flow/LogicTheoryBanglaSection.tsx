"use client";

import {
  DEFAULT_DIRECTION,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  calculateCurrent,
  getDriftDescription,
  getFlowLevel,
  getFlowPercent,
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
  const current = calculateCurrent(DEFAULT_VOLTAGE, DEFAULT_RESISTANCE);
  const flowPercent = getFlowPercent(current);
  const flowLevel = getFlowLevel(current);
  const driftText = getDriftDescription(DEFAULT_DIRECTION);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় electron flow কী?",
      answer:
        "Electron flow মানে electrons conductor-এর মধ্যে negative terminal থেকে positive terminal-এর দিকে move করে।",
    },
    {
      question: "Basic DC circuit-এ electron কোন দিকে move করে?",
      answer:
        "Electrons negative terminal থেকে positive terminal-এর দিকে move করে।",
    },
    {
      question: "Conventional current কী?",
      answer:
        "Conventional current হলো diagram-এ ব্যবহৃত standard current direction, যা positive থেকে negative-এর দিকে দেখানো হয়।",
    },
    {
      question: "Electron flow আর conventional current কি opposite direction-এ হতে পারে?",
      answer:
        "হ্যাঁ। Basic DC circuit-এ এই দুই direction opposite হয়।",
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
              Electron Flow
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Electron flow বোঝায় কীভাবে negatively charged electrons circuit-এর মধ্যে move করে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা বিষয়টি ধাপে ধাপে সহজ ভাষায় শিখব। এই lesson বুঝতে advanced
              theory দরকার নেই।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Basic DC circuit-এ electrons negative side থেকে positive side-এর দিকে drift করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${DEFAULT_VOLTAGE.toFixed(1)} V`} tone="red" />
            <ValueCard label="Current" value={`${current.toFixed(2)} A`} tone="blue" />
            <ValueCard label="Flow Level" value={`${flowLevel} - ${flowPercent}%`} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          Electron flow মানে complete circuit-এর মধ্যে electrons conductor-এর ভিতর দিয়ে move করে।
        </p>
        <p>
          Electron হলো negatively charged particle। সহজ ভাষায়, এগুলো tiny charge carrier যা wire-এর ভিতরে move করে।
        </p>
        <p>
          Basic DC circuit-এ electron flow negative terminal থেকে positive terminal-এর দিকে যায়।
        </p>
        <p>
          এটি conventional current থেকে আলাদা, কারণ conventional current diagram-এ positive থেকে negative-এর দিকে দেখানো হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Simple DC circuit-এ electrons negative থেকে positive-এ যায়, নাকি positive থেকে negative-এ?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই topic গুরুত্বপূর্ণ কারণ beginner-রা অনেক সময় current direction আর electron direction-কে একই জিনিস মনে করে।
        </p>
        <p>
          Electron flow বুঝতে পারলে circuit diagram, troubleshooting, আর electrical explanation follow করা সহজ হয়।
        </p>
        <p>
          Technician আর student-রা অনেক সময় symbol আর diagram-এ conventional current ব্যবহার করে, কিন্তু real electrons কী করছে সেটা জানা খুব useful।
        </p>
        <p>
          <strong>মূল কথা:</strong> Electron flow conductor-এর ভিতরে আসলে কী move করছে, সেটি explain করতে সাহায্য করে।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> Diagram current direction আর electron movement direction basic DC circuit-এ opposite হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Electron flow আর conventional current দুটোই জানা useful কেন?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          Battery-এর মতো source একটি electric push তৈরি করে, আর সেই push electrons-কে circuit-এর মধ্যে drift করতে সাহায্য করে।
        </p>
        <p>
          Electrons কোথাও থেকে হঠাৎ jump করে আসে না। তারা wire আর component দিয়ে তৈরি complete path-এর মধ্যে move করে।
        </p>
        <p>
          এই lesson-এ battery দেয় <strong>{DEFAULT_VOLTAGE.toFixed(1)} V</strong> এবং circuit resistance হলো{" "}
          <strong>{DEFAULT_RESISTANCE.toFixed(1)} Ohm</strong>, তাই current হয়{" "}
          <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ calculation:{" "}
          <strong>
            I = V / R = {DEFAULT_VOLTAGE.toFixed(1)} / {DEFAULT_RESISTANCE.toFixed(1)} = {current.toFixed(2)} A
          </strong>
        </p>
        <p>
          এই simulation-এ default direction view হলো: <strong>{driftText}</strong>
        </p>
        <p>
          Beginner-দের common mistake হলো electrons আর conventional current একই direction-এ move করে ভাবা। আসলে basic DC circuit-এ তারা opposite direction দেখায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Electron flow wire-এর ভিতরে real negative charge-এর movement describe করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Conventional current এখনো বেশিরভাগ circuit diagram-এ standard direction হিসেবে ব্যবহৃত হয়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Electron flow আর conventional current-এর main direction difference কী?
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
                <p>একটি battery, wire, আর small lamp কল্পনা করুন।</p>
                <p>
                  যখন path complete থাকে, তখন electrons wire-এর মধ্যে drift করে এবং lamp জ্বলে উঠতে পারে।
                </p>
                <p>
                  Training lab, textbook, আর circuit diagram-এ আপনি সাধারণত conventional current arrow দেখবেন। কিন্তু metal conductor-এর ভিতরে real moving charge হলো electrons।
                </p>
                <p>
                  এই idea semiconductor, battery, grounding, আর পরে electronics topic বোঝার সময়ও সাহায্য করে।
                </p>
                <p>
                  কোনো real circuit দেখলে নিজেকে জিজ্ঞেস করুন: আমি কি real moving electron-এর কথা বলছি, নাকি diagram-এর standard current direction-এর কথা বলছি?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: Battery আর lamp circuit-এ wire-এর ভিতরে আসলে কী move করে?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Electron flow মানে electrons conductor-এর মধ্যে move করে।</li>
          <li>Electron হলো negatively charged particle।</li>
          <li>Simple DC circuit-এ electrons negative থেকে positive-এর দিকে move করে।</li>
          <li>Conventional current positive থেকে negative-এর দিকে দেখানো হয়।</li>
          <li>Basic DC circuit-এ এই দুই direction opposite হয়।</li>
          <li>এই difference জানা circuit understanding আর troubleshooting-এ সাহায্য করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
