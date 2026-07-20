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
      question: "এই lesson-এ transistor-এর দুইটি main family কী?",
      answer:
        "এগুলো হলো BJT এবং FET। এগুলো আলাদা family হিসেবে grouped, কারণ control method আলাদা।",
    },
    {
      question: "BJT কীভাবে control হয়?",
      answer:
        "BJT মূলত current controlled device হিসেবে শেখানো হয়, যেখানে base drive collector current-কে influence করে।",
    },
    {
      question: "FET কীভাবে control হয়?",
      answer:
        "FET মূলত gate-এর electric field দ্বারা control হয়, যা channel-এর conduction-কে প্রভাবিত করে।",
    },
    {
      question: "NPN আর PNP-এর basic difference কী?",
      answer:
        "দুটোই BJT family-র transistor, কিন্তু carrier emphasis এবং symbol-arrow direction convention একে অপরের opposite।",
    },
    {
      question: "এই lesson-এ JFET আর MOSFET-এর main difference কী?",
      answer:
        "দুটোই FET, কিন্তু JFET junction field দিয়ে channel control করে, আর MOSFET insulated gate field ব্যবহার করে।",
    },
    {
      question: "N-channel আর P-channel compare করা হয় কেন?",
      answer:
        "কারণ channel type বদলালে carrier behavior এবং current-flow direction interpretation-ও বদলে যায়।",
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
              Transistor Types
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ transistor-এর main family-গুলো compare করা হয়েছে এবং
              দেখানো হয়েছে কীভাবে control method ও current-flow behavior অনুযায়ী
              transistor type আলাদা করা যায়।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এখানে মূল ধারণা হলো সব transistor একইভাবে conduction control করে না।
              কিছু current controlled, আর কিছু field controlled।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson learner-কে “transistor কী” থেকে “আমি কোন ধরনের transistor দেখছি” এই চিন্তায় এগিয়ে দেয়।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Family 1" value="BJT" tone="emerald" />
            <ValueCard label="Family 2" value="FET" tone="violet" />
            <ValueCard label="Key Idea" value="Control Type" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="Transistor type শেখা দরকার কেন?" eyebrow="Core Concept">
        <p>
          Transistor শব্দটি শুধু একটি exact device form বোঝায় না।
        </p>

        <p>
          Transistor-এর ভিন্ন family ও type আছে, এবং প্রতিটির control behavior, symbol style, এবং current-flow logic আলাদা।
        </p>

        <p>
          Type শেখা learner-কে confusion থেকে বাঁচায়, বিশেষ করে যখন circuit-এ আগের lesson-এর transistor-এর মতো না হয়ে অন্য transistor use করা হয়।
        </p>
      </SectionCard>

      <SectionCard title="BJT আর FET-এর difference কী?" eyebrow="Two Families">
        <p>
          এই lesson-এ transistor-গুলোকে মূলত <strong>BJT</strong> এবং <strong>FET</strong> family-তে ভাগ করা হয়েছে।
        </p>

        <p>
          BJT-কে current-controlled device হিসেবে শেখানো হয়েছে, আর FET-কে field-controlled device হিসেবে শেখানো হয়েছে।
        </p>

        <p>
          অর্থাৎ দুইটিই transistor হলেও family বদলালে control idea-ও বদলে যায়।
        </p>
      </SectionCard>

      <SectionCard title="BJT family-র type কীভাবে আলাদা?" eyebrow="NPN And PNP">
        <p>
          BJT family-র মধ্যে lesson-টি <strong>NPN</strong> এবং <strong>PNP</strong> transistor compare করে।
        </p>

        <p>
          দুটিই bipolar junction transistor, কিন্তু carrier emphasis এবং direction convention গুরুত্বপূর্ণভাবে opposite।
        </p>

        <p>
          এই কারণেই NPN আর PNP-এর symbol arrow direction এবং current-flow explanation এক নয়।
        </p>
      </SectionCard>

      <SectionCard title="FET family-র type কীভাবে আলাদা?" eyebrow="JFET And MOSFET">
        <p>
          FET family-র মধ্যে lesson-টি <strong>JFET</strong> এবং <strong>MOSFET</strong> compare করে।
        </p>

        <p>
          JFET junction electric field দিয়ে conduction control করে, আর MOSFET insulated gate field ব্যবহার করে channel influence করে।
        </p>

        <p>
          তাই দুটোই FET family-তে পড়লেও control establish করার পদ্ধতি এক নয়।
        </p>
      </SectionCard>

      <SectionCard title="N-channel আর P-channel compare করা হয় কেন?" eyebrow="Channel Logic">
        <p>
          FET-কে channel type অনুযায়ীও ভাগ করা হয়, যেমন N-channel এবং P-channel।
        </p>

        <p>
          Channel type বদলালে majority carrier idea এবং current-flow direction-এর সাধারণ ব্যাখ্যাও বদলে যায়।
        </p>

        <p>
          এতে learner বুঝতে পারে কেন দেখতে কাছাকাছি device-ও circuit-এ ভিন্ন behavior দেখাতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে important control comparison কী?" eyebrow="Control Behavior">
        <p>
          Beginner learner-এর জন্য lesson-টি বোঝার সহজ উপায় হলো প্রথমে এই প্রশ্ন করা:
          <em> device-টি কী দিয়ে control হয়?</em>
        </p>

        <p>
          BJT-তে lesson base drive এবং current control-কে গুরুত্ব দেয়। FET-এ lesson gate action এবং field control-কে গুরুত্ব দেয়।
        </p>

        <p>
          এই একটি comparison transistor family-গুলোকে পরিষ্কারভাবে আলাদা করতে সাহায্য করে।
        </p>
      </SectionCard>

      <SectionCard title="Current-flow language কেন বদলে যায়?" eyebrow="Flow Interpretation">
        <p>
          এই lesson দেখায় যে carrier type এবং device family flow description-কে প্রভাবিত করে।
        </p>

        <p>
          উদাহরণ হিসেবে NPN আর PNP একই carrier emphasis ব্যবহার করে না, আর N-channel এবং P-channel device-এও flow convention ভিন্ন হয়।
        </p>

        <p>
          তাই learner-এর শুধু একটি transistor flow explanation মুখস্থ করে সব transistor-এ apply করা ঠিক হবে না।
        </p>
      </SectionCard>

      <SectionCard title="এই lesson গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>
          আগের lesson-গুলো transistor কী, এর structure কেমন, আর terminal কী কাজ করে - সেগুলো বোঝায়।
        </p>

        <p>
          এই lesson classification যোগ করে, যাতে learner real circuit-এ কোন transistor family ও subtype use হচ্ছে তা identify করতে শুরু করতে পারে।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: transistor type দ্রুত চিনতে হলে আগে family দেখুন, তারপর device কী দিয়ে control হয়, এবং symbol ও flow direction কী বলছে তা দেখুন।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>সব transistor একই type নয়; এগুলো বিভিন্ন family-তে grouped।</li>
          <li>এই lesson-এ BJT এবং FET হলো দুইটি main family।</li>
          <li>BJT-কে এখানে current controlled হিসেবে বোঝানো হয়েছে।</li>
          <li>FET-কে এখানে field controlled হিসেবে বোঝানো হয়েছে।</li>
          <li>NPN এবং PNP হলো BJT subtype এবং direction convention opposite।</li>
          <li>JFET এবং MOSFET হলো FET subtype এবং gate-control idea আলাদা।</li>
          <li>N-channel এবং P-channel device carrier ও flow interpretation-এ ভিন্ন।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
