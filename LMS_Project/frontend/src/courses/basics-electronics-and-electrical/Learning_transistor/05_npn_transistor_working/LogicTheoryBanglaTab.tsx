"use client";

import type { ReactNode } from "react";

import {
  QuizAccordion,
  type QuizAccordionItem,
} from "../../Learning_Current_Voltage/shared/quiz_accordion";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "violet" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

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
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />
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
  const quizItems: QuizAccordionItem[] = [
    {
      question: "এই lesson-এ NPN transistor কীভাবে turn on হয়?",
      answer:
        "যখন base-emitter junction যথেষ্ট drive পায়, তখন base current flow শুরু হয় এবং transistor conduction শুরু করে।",
    },
    {
      question: "Switch open থাকলে কী হয়?",
      answer:
        "Base drive disconnected থাকে, তাই transistor cutoff-এ থাকে এবং LED path off থাকে।",
    },
    {
      question: "এই simulation-এ active region বলতে কী বোঝায়?",
      answer:
        "Transistor conduction করছে, কিন্তু full saturation-এ যাওয়ার আগে base drive এখনও collector current limit করছে।",
    },
    {
      question: "এখানে saturation কী?",
      answer:
        "Saturation হলো strong switching state, যেখানে base drive এতটাই বেশি যে transistor LED load path-এর জন্য প্রায় closed switch-এর মতো behave করে।",
    },
    {
      question: "Base resistance এত গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ base resistance ঠিক করে কত base current flow করবে, আর সেটাই নির্ধারণ করে transistor cutoff, active region, না saturation-এ থাকবে।",
    },
    {
      question: "এই lesson-এ fault mode useful কেন?",
      answer:
        "কারণ এগুলো দেখায় যে base drive বা supply থাকলেও key path open, reverse, বা missing হলে transistor ঠিকভাবে কাজ নাও করতে পারে।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic &amp; Theory
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              NPN Transistor Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি NPN transistor একটি simple LED load
              circuit-এ practical switching device হিসেবে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো base drive, collector current, LED load
              control, এবং cutoff, active, আর saturation state-এর মধ্যে পরিবর্তন।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson fault logic-ও introduce করে, যাতে learner বুঝতে পারে base path
              বা load path-এর problem হলে result কীভাবে বদলে যায়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Device Type" value="NPN" tone="emerald" />
            <ValueCard label="Main Load" value="LED" tone="amber" />
            <ValueCard label="Switch Goal" value="Cutoff to Sat" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="এই NPN lesson কী শেখাচ্ছে?" eyebrow="Core Concept">
        <p>
          এই lesson শেখায় কীভাবে একটি NPN transistor ছোট base-drive path ব্যবহার করে একটি load path control করে।
        </p>

        <p>
          Circuit-টি একটি practical switching idea দেখায়: control side ঠিক করে transistor off থাকবে, partly conduct করবে, না hard on হবে।
        </p>

        <p>
          তাই এটি শুধু symbolic transistor lesson নয়, বরং practical behavior বোঝায়।
        </p>
      </SectionCard>

      <SectionCard title="Switch open থাকলে কী হয়?" eyebrow="Cutoff State">
        <p>
          Switch open থাকলে base drive transistor থেকে disconnected থাকে।
        </p>

        <p>
          যথেষ্ট base-emitter drive না থাকলে transistor cutoff-এ থাকে।
        </p>

        <p>
          এই অবস্থায় collector current LED branch-এ proper flow করতে পারে না, তাই LED off থাকে।
        </p>
      </SectionCard>

      <SectionCard title="Switch closed হলে কী হয়?" eyebrow="Base Drive Starts">
        <p>
          Switch closed হলে base path conduct করার সুযোগ পায়।
        </p>

        <p>
          যদি base-emitter junction যথেষ্ট forward drive পায়, তবে base current flow শুরু হয়।
        </p>

        <p>
          এই base current-ই transistor-কে collector-emitter path open করতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Base resistance এত গুরুত্বপূর্ণ কেন?" eyebrow="Control Strength">
        <p>
          Base resistance সরাসরি ঠিক করে কত base current transistor-এ ঢুকতে পারবে।
        </p>

        <p>
          Base resistance বেশি হলে base drive কমে যায়, আর কম হলে base drive বাড়তে পারে।
        </p>

        <p>
          এই কারণেই base path condition বদলালেই transistor cutoff, active region, বা saturation-এ যেতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="এখানে active region কী?" eyebrow="Partial Conduction">
        <p>
          Active region-এ transistor conduct করছে এবং LED path current carry করতে পারে, কিন্তু transistor এখনও strongest ON state-এ যায়নি।
        </p>

        <p>
          এই অবস্থায় collector current এখনও available base drive দ্বারা limit হচ্ছে।
        </p>

        <p>
          এটি useful middle state, কারণ এতে বোঝা যায় transistor শুধু OFF বা fully ON - এই দুই অবস্থায়ই সীমাবদ্ধ নয়।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson-এ saturation কী?" eyebrow="Strong Switching">
        <p>
          Saturation হলো NPN transistor-এর strong switching condition।
        </p>

        <p>
          এই অবস্থায় base drive এতটাই বেশি হয় যে transistor collector-emitter path-এর জন্য closed-switch behavior-এর খুব কাছাকাছি যায়।
        </p>

        <p>
          ফলে LED branch strongly conduct করে এবং LED proper ভাবে turn on হয়।
        </p>
      </SectionCard>

      <SectionCard title="Load resistance আর supply কেন matter করে?" eyebrow="Load Demand">
        <p>
          Collector path শুধু transistor-এর ওপর নির্ভর করে না; supply voltage এবং load path resistance-এর ওপরও নির্ভর করে।
        </p>

        <p>
          Transistor-এর drive condition ভালো হলেও load branch-এর নিজের current limit circuit value-এর কারণে থেকে যায়।
        </p>

        <p>
          তাই switching behavior-কে transistor-only event হিসেবে নয়, full circuit relationship হিসেবে বোঝা দরকার।
        </p>
      </SectionCard>

      <SectionCard title="Pull-down আর fault case কেন যোগ করা হয়েছে?" eyebrow="Troubleshooting Logic">
        <p>
          Real circuit শুধু এক ধরনের fault-এ fail করে না।
        </p>

        <p>
          Base resistor path open হতে পারে, pull-down missing হতে পারে, LED reverse হতে পারে, collector path open হতে পারে, বা supply voltage খুব কম হতে পারে।
        </p>

        <p>
          এই fault example-গুলো learner-কে বোঝায় যে wrong result control-path failure, load-path failure, বা poor operating condition - যেকোনো কারণে হতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="মূল working rule কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো একটি cause-and-effect chain follow করা।
        </p>

        <p>
          Base drive transistor mode ঠিক করে, transistor mode collector-emitter conduction ঠিক করে, আর সেই conduction ঠিক করে LED branch কাজ করবে কি না।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি NPN transistor controlled switch-এর মতো কাজ করে, কিন্তু proper switching হবে কি না তা base path এবং load path - দুইটির ওপরই নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>NPN transistor base drive ব্যবহার করে collector current control করে।</li>
          <li>Switch open থাকলে cutoff হয় এবং LED OFF থাকে।</li>
          <li>Switch closed হলে base current transistor action শুরু করে।</li>
          <li>Base resistance transistor mode-কে শক্তভাবে প্রভাবিত করে।</li>
          <li>Active region মানে conduction আছে, কিন্তু full saturation নেই।</li>
          <li>Saturation হলো strong ON switching state।</li>
          <li>Fault থাকলে circuit normal-looking হলেও proper operation block হতে পারে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
