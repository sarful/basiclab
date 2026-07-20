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
      question: "Depletion MOSFET-এর সবচেয়ে সহজ special feature কী?",
      answer:
        "এতে VGS = 0 অবস্থাতেই একটি conducting channel থাকে, তাই gate control এটিকে যথেষ্ট দুর্বল না করা পর্যন্ত এটি normally on থাকে।",
    },
    {
      question: "এটির নাম depletion MOSFET কেন?",
      answer:
        "কারণ gate voltage existing channel-কে deplete বা narrow করতে পারে এবং current কমিয়ে দেয়, enhancement MOSFET-এর মতো channel একেবারে শুরু থেকে build করতে হয় না।",
    },
    {
      question: "এই lesson-এ gate voltage আরও negative হলে কী হয়?",
      answer:
        "Depletion region বড় হয়, channel দুর্বল হয়, আর drain current cutoff-এর দিকে কমতে থাকে।",
    },
    {
      question: "এখানে VGS(off) কী?",
      answer:
        "এটি সেই gate-source voltage যেখানে channel এতটাই deplete হয়ে যায় যে MOSFET cutoff-এ পৌঁছে useful drain current বন্ধ হয়ে যায়।",
    },
    {
      question: "এই simulator-এ positive gate voltage কীভাবে দেখানো হয়েছে?",
      answer:
        "Positive gate voltage existing channel-কে আরও strong করে, ফলে depletion MOSFET enhancement-style stronger conduction-এ যায়।",
    },
    {
      question: "Enhancement MOSFET lesson-এর পর এই lesson গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ এটি ঠিক উল্টো starting condition দেখায়: enhancement MOSFET normally off দিয়ে শুরু হয়, আর depletion MOSFET normally on দিয়ে শুরু হয়।",
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
              Depletion MOSFET Working
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি depletion MOSFET, যেখানে VGS = 0-তেই
              channel already থাকে, gate control দিয়ে সেই channel-কে দুর্বল বা আরও strong করা যায়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো এই device normally on condition থেকে শুরু করে gate voltage-এর উপর ভিত্তি করে weak channel, cutoff, বা stronger conduction-এর দিকে যায়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই কারণেই depletion MOSFET lesson enhancement MOSFET lesson-এর একটি খুব important contrast।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Start State" value="Normally On" tone="emerald" />
            <ValueCard label="Main Effect" value="Channel Depletion" tone="amber" />
            <ValueCard label="Gate Rule" value="Negative VGS Narrows" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Depletion MOSFET আলাদা কেন?" eyebrow="Core Concept">
        <p>
          Depletion MOSFET আলাদা, কারণ VGS = 0 অবস্থাতেই এতে conduction channel already থাকে।
        </p>

        <p>
          এর মানে হলো enhancement MOSFET-এর মতো gate voltage দিয়ে আগে channel build করতে হয় না; এটি শুরুতেই normally on থাকে।
        </p>

        <p>
          এই starting condition-ই পুরো lesson-এর সবচেয়ে গুরুত্বপূর্ণ beginner idea।
        </p>
      </SectionCard>

      <SectionCard title="এখানে 'depletion' বলতে কী বোঝায়?" eyebrow="Channel Narrowing">
        <p>
          Depletion মানে existing channel-কে gate effect দিয়ে narrow বা weaken করা যায়।
        </p>

        <p>
          Gate condition depletion-এর দিকে গেলে drain-source conduction weaker হয়ে যায়।
        </p>

        <p>
          তাই এই device-এ gate channel-কে শূন্য থেকে build করছে না; বরং already থাকা channel-কে reduce করছে।
        </p>
      </SectionCard>

      <SectionCard title="VGS = 0-তে কী হয়?" eyebrow="Normally On State">
        <p>
          VGS = 0-তে depletion MOSFET normally on state-এ থাকে।
        </p>

        <p>
          Channel already present থাকায় gate drive না থাকলেও drain current flow করতে পারে।
        </p>

        <p>
          Enhancement MOSFET-এর সাথে এটিই সবচেয়ে বড় practical contrast।
        </p>
      </SectionCard>

      <SectionCard title="Gate voltage negative হলে কী হয়?" eyebrow="Depletion Action">
        <p>
          Gate voltage আরও negative হলে depletion effect বাড়তে থাকে।
        </p>

        <p>
          Depletion region expand করে, channel narrow হয়, এবং current flow দুর্বল হয়ে যায়।
        </p>

        <p>
          Negative gate effect যথেষ্ট strong হলে MOSFET cutoff-এর দিকেও চলে যেতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Weak channel আর cutoff কী?" eyebrow="Toward OFF">
        <p>
          Weak channel মানে conduction এখনও আছে, কিন্তু channel এতটা narrow হয়েছে যে strong current flow আর সম্ভব হচ্ছে না।
        </p>

        <p>
          Cutoff তখন হয় যখন depletion এতটাই strong হয় যে useful drain current কার্যত বন্ধ হয়ে যায়।
        </p>

        <p>
          এতে learner বোঝে MOSFET turn-off gradual channel weakening-এর মাধ্যমেও হতে পারে, instant jump হিসেবে নয়।
        </p>
      </SectionCard>

      <SectionCard title="VGS(off) কী?" eyebrow="Cutoff Boundary">
        <p>
          VGS(off) হলো সেই gate-source voltage যেখানে channel useful conduction ধরে রাখতে পারে না এবং MOSFET cutoff-এ যায়।
        </p>

        <p>
          এটি এই lesson-এ depletion behavior-এর turn-off boundary হিসেবে কাজ করে।
        </p>

        <p>
          Learner-রা একে এমন point হিসেবে ভাবতে পারে যেখানে original normally-on channel খুব বেশি দুর্বল হয়ে গেছে।
        </p>
      </SectionCard>

      <SectionCard title="Gate voltage positive হলে কী হয়?" eyebrow="Enhancement Effect">
        <p>
          Positive gate voltage already থাকা channel-কে আরও strong করে।
        </p>

        <p>
          এই simulator-এ এটি device-কে normally on state-এর চেয়েও stronger conduction-এর দিকে push করে।
        </p>

        <p>
          এই কারণেই depletion MOSFET lesson-এও enhancement-style stronger region দেখা যায়।
        </p>
      </SectionCard>

      <SectionCard title="Enhancement MOSFET lesson-এর পরে এটি গুরুত্বপূর্ণ কেন?" eyebrow="Learning Contrast">
        <p>
          আগের lesson enhancement MOSFET শেখায়, যেখানে device normally off দিয়ে শুরু হয় এবং gate action channel build করে।
        </p>

        <p>
          এই lesson depletion MOSFET শেখায়, যেখানে device normally on দিয়ে শুরু হয় এবং negative gate action channel weaken করে।
        </p>

        <p>
          এই contrast learner-কে বুঝতে সাহায্য করে যে সব MOSFET type-এর জন্য একই default turn-on story প্রযোজ্য নয়।
        </p>
      </SectionCard>

      <SectionCard title="Drain voltage, load, আর temperature এখনও গুরুত্বপূর্ণ কেন?" eyebrow="Real Operation">
        <p>
          যদিও lesson-এর ফোকাস gate control আর channel depletion, drain voltage, load resistance, আর temperature final operation-এ বড় প্রভাব ফেলে।
        </p>

        <p>
          এগুলো drain current, power, heating, আর visible conduction strength-কে affect করে।
        </p>

        <p>
          এটি learner-কে মনে করিয়ে দেয় যে MOSFET সবসময় full circuit-এর অংশ, isolated concept নয়।
        </p>
      </SectionCard>

      <SectionCard title="মূল beginner rule কী?" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো প্রথমে starting condition মনে রাখা।
        </p>

        <p>
          VGS = 0-তে channel already থাকে, negative gate voltage channel-কে deplete করে, আর positive gate voltage channel-কে আরও strong করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: depletion MOSFET-কে সবচেয়ে ভালো বোঝা যায় normally-on MOSFET হিসেবে, যার gate channel-কে cutoff-এর দিকে দুর্বলও করতে পারে, আবার stronger conduction-এর দিকেও নিতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Depletion MOSFET-এ VGS = 0-তেই channel already present থাকে।</li>
          <li>এ কারণে এটি normally on device হিসেবে শুরু হয়।</li>
          <li>Negative gate voltage channel-কে deplete ও narrow করে।</li>
          <li>Weak channel হলো cutoff-এর আগের reduced-conduction region।</li>
          <li>VGS(off) useful conduction শেষ হওয়ার boundary।</li>
          <li>Positive gate voltage channel-কে আরও strong করে।</li>
          <li>এই lesson enhancement MOSFET lesson-এর গুরুত্বপূর্ণ opposite case।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
