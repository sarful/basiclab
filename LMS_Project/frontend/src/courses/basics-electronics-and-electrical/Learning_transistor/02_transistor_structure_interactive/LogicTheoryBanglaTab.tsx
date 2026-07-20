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
      question: "একটি transistor-এর তিনটি semiconductor region কেন দরকার?",
      answer:
        "কারণ emitter, base, এবং collector - প্রতিটির কাজ আলাদা, এবং transistor তখনই ঠিকভাবে কাজ করে যখন এই তিনটি region আলাদা doping ও role নিয়ে সাজানো থাকে।",
    },
    {
      question: "Emitter heavily doped হয় কেন?",
      answer:
        "কারণ emitter-এর কাজ হলো transistor action-এর মধ্যে অনেক charge carrier supply করা।",
    },
    {
      question: "Base খুব thin এবং lightly doped হয় কেন?",
      answer:
        "যাতে ছোট base current দিয়েই transistor action control করা যায়, কিন্তু base নিজে বেশি carrier absorb না করে।",
    },
    {
      question: "Collector-এর প্রধান কাজ কী?",
      answer:
        "Collector transistor-এর মাধ্যমে আসা carrier gather করে এবং output current বহন করে।",
    },
    {
      question: "Full working operation শেখার আগে transistor structure জানা জরুরি কেন?",
      answer:
        "কারণ bias এবং current flow apply করার পরে transistor কেন ওইভাবে behave করে, তার physical কারণ structure থেকেই বোঝা যায়।",
    },
    {
      question: "একই lesson-এ NPN এবং PNP structure compare করা হয় কেন?",
      answer:
        "কারণ দুটোরই তিনটি region আছে, কিন্তু material arrangement এবং carrier behavior একে অপরের mirror-এর মতো উল্টোভাবে কাজ করে।",
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
              Transistor Structure
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি transistor ভেতরে তিনটি region নিয়ে
              গঠিত হয়, যাতে এটি current-কে useful ভাবে control করতে পারে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল লক্ষ্য হলো emitter, base, এবং collector-এর structural role বোঝা,
              এবং কেন এই region-গুলোর doping level ও purpose একরকম নয় তা বোঝা।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson পরের terminal, biasing, এবং current flow lesson-গুলোর জন্য foundation তৈরি করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Region 1" value="Emitter" tone="emerald" />
            <ValueCard label="Region 2" value="Base" tone="amber" />
            <ValueCard label="Region 3" value="Collector" tone="violet" />
          </div>
        </div>
      </section>

      <SectionCard title="Transistor structure আগে পড়া দরকার কেন?" eyebrow="Core Concept">
        <p>
          Transistor operation শেখার আগে এর internal structure জানা খুব helpful।
        </p>

        <p>
          Structure বোঝায় কেন একটি terminal control করে, একটি carrier supply করে, আর আরেকটি output current collect করে।
        </p>

        <p>
          অন্যভাবে বললে, structure-ই হলো সেই physical কারণ যার জন্য transistor useful electronic control device হিসেবে কাজ করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="তিনটি main region কী কী?" eyebrow="Three Layers">
        <p>
          একটি basic bipolar transistor তিনটি semiconductor region দিয়ে তৈরি:
          <strong> emitter</strong>, <strong>base</strong>, এবং <strong>collector</strong>।
        </p>

        <p>
          এই region-গুলো একরকম নয়। প্রতিটির আলাদা electrical job আছে।
        </p>

        <p>
          তাই transistor structure শুধু তিনটি অংশ পাশাপাশি বসানো নয়; এটি একটি intentionally designed arrangement।
        </p>
      </SectionCard>

      <SectionCard title="Emitter heavily doped হয় কেন?" eyebrow="Carrier Source">
        <p>
          Emitter-এর কাজ হলো transistor action-এর মধ্যে charge carrier supply করা।
        </p>

        <p>
          এই কাজের জন্য emitter heavily doped করা হয়, যাতে এটি শক্তভাবে carrier inject করতে পারে।
        </p>

        <p>
          সহজ ভাষায়, emitter হলো source side, যাকে proper bias-এর সময় plenty of carrier দিতে প্রস্তুত থাকতে হয়।
        </p>
      </SectionCard>

      <SectionCard title="Base thin এবং lightly doped হয় কেন?" eyebrow="Control Region">
        <p>
          Base হলো transistor-এর control region।
        </p>

        <p>
          এটিকে খুব thin এবং lightly doped করা হয়, যাতে ছোট base influence দিয়েই বড় transistor action control করা যায়।
        </p>

        <p>
          এটি beginner-level-এর সবচেয়ে গুরুত্বপূর্ণ ধারণাগুলোর একটি: base আকারে ও current-এ ছোট হলেও control effect-এ খুব শক্তিশালী।
        </p>
      </SectionCard>

      <SectionCard title="Collector কী কাজ করে?" eyebrow="Output Region">
        <p>
          Collector transistor action-এর মাধ্যমে আসা carrier collect করে এবং output current বহন করে।
        </p>

        <p>
          এটি device-এর useful output side handle করার জন্য দায়ী।
        </p>

        <p>
          তাই base control করে, emitter supply করে, আর collector output result গ্রহণ করে।
        </p>
      </SectionCard>

      <SectionCard title="Doping level আলাদা হওয়া দরকার কেন?" eyebrow="Layer Design">
        <p>
          যদি তিনটি region একইভাবে doped হতো, তাহলে তারা আলাদা electrical job ঠিকমতো করতে পারত না।
        </p>

        <p>
          Emitter-এর দরকার strong carrier supply, base-এর দরকার sensitive control behavior, আর collector-এর দরকার output current receive ও carry করা।
        </p>

        <p>
          এই আলাদা doping level-ই তিনটি role-কে সম্ভব করে তোলে।
        </p>
      </SectionCard>

      <SectionCard title="NPN আর PNP structure-এর সম্পর্ক কী?" eyebrow="Type Comparison">
        <p>
          NPN এবং PNP - দুই ধরনের transistor-ই emitter, base, collector এই তিন region ব্যবহার করে।
        </p>

        <p>
          পার্থক্য হলো semiconductor type-এর arrangement এবং কোন ধরনের charge carrier গুরুত্বপূর্ণ হয়ে ওঠে।
        </p>

        <p>
          এই lesson learner-কে বোঝায় যে transistor type material arrangement বদলায়, কিন্তু purposeful three-region structure-এর দরকার বদলায় না।
        </p>
      </SectionCard>

      <SectionCard title="এই structure later lesson-এ কেন গুরুত্বপূর্ণ?" eyebrow="Learning Foundation">
        <p>
          পরের lesson-গুলোতে terminal, biasing, switching, এবং current flow নিয়ে আলোচনা হবে।
        </p>

        <p>
          Thin base, strong emitter, আর output-handling collector-এর কারণ না জানলে ওই lesson-গুলো পুরোপুরি বোঝা কঠিন।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: transistor structure-ই সেই physical কারণ, যার জন্য base-এর ছোট control action collector current path-এর ওপর বড় প্রভাব ফেলতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>একটি transistor-এর তিনটি main region আছে: emitter, base, collector।</li>
          <li>Emitter heavily doped হয়, যাতে strong carrier supply দিতে পারে।</li>
          <li>Base thin এবং lightly doped হয় control sensitivity-এর জন্য।</li>
          <li>Collector carrier gather করে এবং output current বহন করে।</li>
          <li>ভিন্ন doping level প্রতিটি region-কে ভিন্ন কাজ করতে সাহায্য করে।</li>
          <li>NPN এবং PNP দুটোই three-region structure ব্যবহার করে, কিন্তু material arrangement আলাদা।</li>
          <li>Structure বোঝা transistor operation শেখার foundation।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
