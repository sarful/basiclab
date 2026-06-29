"use client";

import {
  DEFAULT_RESISTANCE_ONE,
  DEFAULT_RESISTANCE_TWO,
  DEFAULT_VOLTAGE,
  getFlowLevel,
  solveSeriesVsParallelLesson,
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
  const solved = solveSeriesVsParallelLesson(
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE_ONE,
    DEFAULT_RESISTANCE_TWO,
  );
  const comparisonFlowLevel = getFlowLevel(solved.parallelTotalCurrent);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "Series আর parallel circuit-এর main path difference কী?",
      answer:
        "Series circuit-এ current-এর জন্য one path থাকে, আর parallel circuit-এ current-এর জন্য more than one path থাকে।",
    },
    {
      question: "Series circuit-এ কোন জিনিস same থাকে?",
      answer:
        "Series circuit-এ সব component-এর মধ্য দিয়ে same current flow করে।",
    },
    {
      question: "Parallel circuit-এ কোন জিনিস same থাকে?",
      answer:
        "Parallel circuit-এ প্রতিটি branch-এর across same voltage থাকে।",
    },
    {
      question: "Parallel-এর একটি branch open হলে কি সব branch বন্ধ হয়ে যায়?",
      answer:
        "না। অন্য branch-গুলোর path complete থাকলে তারা চলতে পারে।",
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
              Series vs Parallel Comparison
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ আমরা one-path circuit আর multi-path circuit-এর পার্থক্য খুব সহজভাবে তুলনা করব।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা step by step দেখব current, voltage, আর resistance series আর
              parallel circuit-এ কীভাবে behave করে।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একটি simple picture মনে রাখুন। Series মানে one road। Parallel মানে many roads।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage" value={`${solved.voltage.toFixed(1)} V`} tone="red" />
            <ValueCard
              label="Parallel Total Current"
              value={`${solved.parallelTotalCurrent.toFixed(2)} A`}
              tone="blue"
            />
            <ValueCard label="Flow Level" value={comparisonFlowLevel} tone="cyan" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="মূল ধারণা">
        <p>
          এই topic-এ আমরা দুইটি important circuit type compare করি: series circuit এবং parallel circuit।
        </p>
        <p>
          Series circuit current-কে only one path দেয়।
        </p>
        <p>
          Parallel circuit current-কে more than one path দেয়।
        </p>
        <p>
          এই দুইটিকে পাশাপাশি compare করলে current আর voltage-এর behavior অনেক সহজে বোঝা যায়।
        </p>
        <p>
          <strong>
            Checkpoint Question: Series আর parallel circuit-এর সবচেয়ে simple difference কী?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="কেন দরকার">
        <p>
          এই comparison গুরুত্বপূর্ণ কারণ student-রা অনেক সময় series আর parallel-এর rules মিশিয়ে ফেলে।
        </p>
        <p>
          যদি এই দুই idea mix হয়ে যায়, তাহলে circuit calculation অনেক কঠিন হয়ে যায়।
        </p>
        <p>
          Technician, electrician, আর student-দের আগে বুঝতে হবে তারা series circuit-এ কাজ করছে, নাকি parallel circuit-এ।
        </p>
        <p>
          <strong>মূল কথা:</strong> Series আর parallel circuit এক rules follow করে না।
        </p>
        <p>
          <strong>যা লক্ষ্য করবেন:</strong> Series current same রাখে, আর parallel voltage same রাখে।
        </p>
        <p>
          <strong>
            Checkpoint Question: Calculation করার আগে circuit series নাকি parallel, এটা জানা কেন দরকার?
          </strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="কীভাবে কাজ করে">
        <p>
          এখন আমরা একই দুইটি resistor দুই ধরনের circuit-এ compare করি।
        </p>
        <p>
          এই lesson-এ resistor one হলো <strong>{solved.resistanceOne.toFixed(1)} Ohm</strong> এবং resistor two হলো{" "}
          <strong>{solved.resistanceTwo.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          Series case-এ resistor-দুটি যোগ হয়, তাই total resistance হয়{" "}
          <strong>{solved.seriesTotalResistance.toFixed(1)} Ohm</strong>।
        </p>
        <p>
          সহজ series calculation:{" "}
          <strong>
            I = V / R total = {solved.voltage.toFixed(1)} / {solved.seriesTotalResistance.toFixed(1)} ={" "}
            {solved.seriesCurrent.toFixed(2)} A
          </strong>
        </p>
        <p>
          Parallel case-এ প্রতিটি branch full <strong>{solved.voltage.toFixed(1)} V</strong> পায়।
        </p>
        <p>
          তাই branch current দুটি হয়{" "}
          <strong>{solved.parallelCurrentOne.toFixed(2)} A</strong> এবং{" "}
          <strong>{solved.parallelCurrentTwo.toFixed(2)} A</strong>, আর total current হয়{" "}
          <strong>{solved.parallelTotalCurrent.toFixed(2)} A</strong>।
        </p>
        <p>
          Beginner-দের common mistake হলো series rule parallel-এর মধ্যে ব্যবহার করা, অথবা parallel rule series-এর মধ্যে ব্যবহার করা।
        </p>
        <p>
          <strong>মূল কথা:</strong> Series circuit resistance যোগ করে এবং one path-এ current share করে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Parallel circuit branch-গুলোর across same voltage রাখে এবং branch current যোগ করে total current দেয়।
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
                <p>একটি flashlight আর একটি house light circuit কল্পনা করুন।</p>
                <p>
                  Simple flashlight সাধারণত series circuit-এর মতো, কারণ current switch আর bulb-এর মধ্য দিয়ে one main path follow করে।
                </p>
                <p>
                  House light-গুলো সাধারণত parallel, কারণ প্রতিটি light একই source voltage চায় এবং একটি light নষ্ট হলে অন্য light বন্ধ হওয়া উচিত না।
                </p>
                <p>
                  এই comparison theory-কে real device, real building, আর real control system-এর সাথে connect করতে সাহায্য করে।
                </p>
                <p>
                  কোনো circuit দেখলে প্রথমে এই প্রশ্ন করুন: current-এর জন্য one path আছে, নাকি several paths?
                </p>
                <p>
                  <strong>
                    Checkpoint Question: কোন real system সাধারণত parallel, house light circuit নাকি simple flashlight?
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="রিভিউ">
        <ul className="list-disc space-y-2 pl-5">
          <li>Series circuit current-কে one path দেয়।</li>
          <li>Parallel circuit current-কে more than one path দেয়।</li>
          <li>Series-এ সব component-এর মধ্যে same current flow করে।</li>
          <li>Parallel-এ সব branch-এর across same voltage থাকে।</li>
          <li>Series resistance সরাসরি যোগ হয়।</li>
          <li>Parallel branch current-গুলো যোগ হয়ে total current তৈরি করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="নিজেকে যাচাই করুন">
        <p>Answer দেখার জন্য প্রতিটি question খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
