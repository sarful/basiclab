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
      question: "এই lesson-এ transistor-এর সবচেয়ে সহজ কাজ কী?",
      answer:
        "এখানে transistor-কে electronically controlled switch হিসেবে দেখানো হয়েছে, যেখানে base-এর ছোট signal collector-emitter-এর বড় current path-কে control করে।",
    },
    {
      question: "Base terminal গুরুত্বপূর্ণ কেন?",
      answer:
        "কারণ base হলো control terminal। যথেষ্ট base bias current না থাকলে transistor ON হয় না।",
    },
    {
      question: "Transistor cut-off-এ থাকলে কী হয়?",
      answer:
        "Collector-emitter path প্রায় OFF থাকে, তাই load current খুব কম থাকে এবং lamp জ্বলে না।",
    },
    {
      question: "Beginner transistor lesson-এ active region বলতে কী বোঝায়?",
      answer:
        "এতে transistor conduction করছে এবং output current control করছে, কিন্তু এখনও full saturation-এ যায়নি।",
    },
    {
      question: "এই simulation-এ saturation বলতে কী বোঝায়?",
      answer:
        "এটি strong ON state, যেখানে transistor এতটাই drive পায় যে load current মূলত load path দ্বারা সীমিত হয় এবং lamp সবচেয়ে বেশি উজ্জ্বল হয়।",
    },
    {
      question: "Base resistor কেন ব্যবহার করা হয়?",
      answer:
        "Base resistor base current limit করে, যাতে control input transistor-কে overstress বা damage না করে।",
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
              What Is a Transistor
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ transistor-কে একটি three-terminal semiconductor device
              হিসেবে পরিচয় করানো হয়েছে, যা switch হিসেবেও কাজ করতে পারে এবং current
              control element হিসেবেও কাজ করতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Beginner level-এর মূল ধারণা হলো base-এ ছোট current collector-emitter
              path-এর বড় current-কে control করতে পারে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই simulation-এ transistor-এর OFF, cut-off, active, এবং saturation
              state-এর সাথে lamp-এর response দেখিয়ে control relationship বোঝানো হয়েছে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Terminals" value="B C E" tone="emerald" />
            <ValueCard label="Main Role" value="Switch" tone="violet" />
            <ValueCard label="Control Idea" value="Small to Large" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Transistor কী?" eyebrow="Core Concept">
        <p>
          Transistor হলো একটি semiconductor device যার তিনটি terminal আছে:
          <strong> base</strong>, <strong>collector</strong>, এবং{" "}
          <strong>emitter</strong>।
        </p>

        <p>
          Basic electronics-এ এটিকে প্রায়ই electronic switch হিসেবে পরিচয় করানো হয়।
        </p>

        <p>
          এটি এমন একটি control device হিসেবেও কাজ করতে পারে যেখানে ছোট input বড় output current-কে প্রভাবিত করে।
        </p>
      </SectionCard>

      <SectionCard title="Transistor useful কেন?" eyebrow="Practical Role">
        <p>
          অনেক circuit-এ weak control signal দিয়ে stronger output load operate করতে হয়।
        </p>

        <p>
          Transistor সেটা সম্ভব করে, কারণ control side আর load side power-এর দিক থেকে সমান নয়।
        </p>

        <p>
          এ কারণেই transistor switching, amplification, indicator driving, এবং অন্য electronic stage control-এ ব্যবহৃত হয়।
        </p>
      </SectionCard>

      <SectionCard title="Base কী কাজ করে?" eyebrow="Control Terminal">
        <p>
          এই lesson-এ base হলো transistor-এর control terminal।
        </p>

        <p>
          যথেষ্ট base bias current থাকলে transistor collector-emitter path দিয়ে current flow করতে দেয়।
        </p>

        <p>
          যথেষ্ট base drive না থাকলে load side-এ supply voltage থাকলেও transistor OFF-ই থেকে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Collector-emitter path-এ কী ঘটে?" eyebrow="Output Path">
        <p>
          Collector-emitter path হলো main output path, যেটি বড় load current বহন করে।
        </p>

        <p>
          Simulation-এ lamp off থাকবে, weak glow করবে, না bright হবে - সেটা এই path-এর conduction-এর ওপর নির্ভর করে।
        </p>

        <p>
          অর্থাৎ transistor নিজে power তৈরি করে না; এটি শুধু load path conduct করবে কি না তা control করে।
        </p>
      </SectionCard>

      <SectionCard title="OFF আর cut-off state কী?" eyebrow="No Conduction">
        <p>
          যখন control condition পূরণ হয় না, transistor OFF বা cut-off state-এ থাকে।
        </p>

        <p>
          এই অবস্থায় collector current খুবই কম থাকে এবং load ব্যবহারযোগ্যভাবে ON হয় না।
        </p>

        <p>
          Beginner level-এ সহজ অর্থ হলো: proper base drive না থাকলে useful output conduction হয় না।
        </p>
      </SectionCard>

      <SectionCard title="Active region কী?" eyebrow="Controlled Conduction">
        <p>
          Active region-এ transistor ON থাকে এবং base drive-এর response দিচ্ছে, কিন্তু এখনও strongest ON state-এ যায়নি।
        </p>

        <p>
          এর মানে output current control হচ্ছে এবং load intermediate level-এ operate করতে পারে।
        </p>

        <p>
          এই lesson-এ active region-কে fully off আর strongly on-এর মাঝের zone হিসেবে ভাবা সহজ।
        </p>
      </SectionCard>

      <SectionCard title="Saturation কী?" eyebrow="Strong ON State">
        <p>
          এই simulation-এ saturation হলো strong ON condition।
        </p>

        <p>
          এখানে transistor এতটা drive পায় যে collector-emitter path load-কে circuit যতটা current দিতে পারে তার কাছাকাছি current flow করতে দেয়।
        </p>

        <p>
          Beginner terms-এ saturation হলো সেই অবস্থা যেখানে transistor সবচেয়ে বেশি closed switch-এর মতো behave করে।
        </p>
      </SectionCard>

      <SectionCard title="Base resistor কেন দরকার?" eyebrow="Protection Logic">
        <p>
          Base input-কে current limiting ছাড়া connect করা উচিত নয়।
        </p>

        <p>
          Base resistor transistor-কে protect করে base current limit করার মাধ্যমে।
        </p>

        <p>
          এ কারণেই lesson-এ control strength আর resistor choice-কে safe transistor operation-এর সাথে যুক্ত করা হয়েছে।
        </p>
      </SectionCard>

      <SectionCard title="Lamp আমাদের কী শেখায়?" eyebrow="Visible Output">
        <p>
          Lamp transistor behavior-এর একটি simple visible result দেখায়।
        </p>

        <p>
          Transistor off থাকলে lamp off থাকে। Conduction শুরু হলে lamp glow করতে শুরু করে। Strong conduction হলে lamp আরও bright হয়।
        </p>

        <p>
          এতে invisible current control আর obvious output effect-এর মধ্যে সম্পর্ক বোঝা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="মূল beginner rule" eyebrow="Formula-Free Idea">
        <p>
          এই lesson বোঝার সহজ উপায় হলো একটি control chain মনে রাখা।
        </p>

        <p>
          Base signal transistor state control করে, transistor state collector-emitter conduction control করে, আর সেই conduction load-কে control করে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: transistor ছোট input দিয়ে ঠিক করতে পারে বড় output path OFF থাকবে, partly ON থাকবে, নাকি strongly ON থাকবে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>একটি transistor-এর তিনটি terminal আছে: base, collector, emitter।</li>
          <li>Base হলো এই lesson-এর control terminal।</li>
          <li>Collector-emitter path বড় load current বহন করে।</li>
          <li>যথেষ্ট base drive না থাকলে transistor off বা cut-off-এ থাকে।</li>
          <li>Active region মানে controlled conduction।</li>
          <li>Saturation হলো strong ON state।</li>
          <li>Base resistor current limit করে transistor-কে protect করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
