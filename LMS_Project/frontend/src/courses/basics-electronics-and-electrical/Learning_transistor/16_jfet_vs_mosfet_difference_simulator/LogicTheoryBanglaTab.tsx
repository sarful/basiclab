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
      question: "JFET আর MOSFET-এর সবচেয়ে গুরুত্বপূর্ণ structural difference কী?",
      answer:
        "JFET-এ PN-junction gate থাকে যা সরাসরি semiconductor region-এর সাথে যুক্ত, আর MOSFET-এ oxide দিয়ে আলাদা করা insulated gate থাকে।",
    },
    {
      question: "MOSFET-এর input resistance সাধারণত JFET-এর চেয়ে বেশি কেন?",
      answer:
        "কারণ MOSFET gate oxide-insulated, তাই gate current প্রায় zero, আর JFET gate reverse-biased junction হিসেবে small leakage দেখাতে পারে।",
    },
    {
      question: "JFET আর enhancement MOSFET-এ channel existence কীভাবে আলাদা?",
      answer:
        "JFET-এ শুরু থেকেই channel থাকে, আর enhancement MOSFET usable channel ছাড়া শুরু হয় এবং gate field দিয়ে channel তৈরি করতে হয়।",
    },
    {
      question: "JFET-কে enhancement MOSFET-এর চেয়ে depletion MOSFET-এর সাথে বেশি compare করা হয় কেন?",
      answer:
        "কারণ JFET আর depletion MOSFET দুটোই starting condition-এ existing channel নিয়ে normally on ধরনের behavior দেখায়।",
    },
    {
      question: "Control mechanism-এর difference কী?",
      answer:
        "JFET মূলত PN-junction structure-এর depletion region বাড়িয়ে current control করে, আর MOSFET insulated gate-এর electric field action দিয়ে channel control করে।",
    },
    {
      question: "JFET আর MOSFET আলাদা আলাদা শেখার পরে এই comparison lesson useful কেন?",
      answer:
        "কারণ এটি isolated fact-গুলোকে side-by-side understanding-এ বদলে দেয়, যেখানে gate structure, channel behavior, আর input characteristic-এর পার্থক্য একসাথে দেখা যায়।",
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
              JFET vs MOSFET Difference
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ JFET আর MOSFET family-কে side by side compare করা
              হয়েছে, যাতে learner পরিষ্কারভাবে বুঝতে পারে gate structure,
              channel behavior, আর control method কীভাবে আলাদা।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              JFET আর MOSFET-কে শুধু দুইটি আলাদা নাম হিসেবে না দেখে, এই topic
              বোঝায় কেন তাদের construction আলাদা input behavior, আলাদা control
              logic, আর আলাদা default channel state তৈরি করে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই lesson 16 field effect transistor family-গুলোর উপর একটি
              গুরুত্বপূর্ণ summary lesson।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Comparison" value="JFET vs MOSFET" tone="emerald" />
            <ValueCard label="Gate Contrast" value="Junction vs Oxide" tone="violet" />
            <ValueCard label="Channel Story" value="Existing vs Created" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="JFET আর MOSFET-কে একসাথে compare করা দরকার কেন?" eyebrow="Big Picture">
        <p>
          JFET আর MOSFET দুটোই field effect transistor family-র অংশ, কিন্তু
          এদের construction আর control method এক নয়।
        </p>

        <p>
          Side-by-side comparison learner-কে বুঝতে সাহায্য করে কেন এরা ভিন্ন
          behave করে, শুধু আলাদা definition মুখস্থ করার বদলে।
        </p>

        <p>
          এই lesson আলাদা transistor topic-গুলোকে একটি connected view-তে আনে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে বড় construction difference কী?" eyebrow="Gate Structure">
        <p>
          সবচেয়ে বড় structural difference হলো gate নিজেই।
        </p>

        <p>
          JFET-এ PN-junction gate থাকে যা semiconductor region-এর সাথে touch
          করে, আর MOSFET-এ metal gate semiconductor থেকে oxide layer দিয়ে
          insulated থাকে।
        </p>

        <p>
          এই একটিমাত্র design difference-ই পরের অনেক practical behavior
          difference explain করে।
        </p>
      </SectionCard>

      <SectionCard title="Channel existence কীভাবে আলাদা?" eyebrow="Starting Condition">
        <p>
          JFET শুরু থেকেই existing channel নিয়ে থাকে, তাই basic starting
          condition-এ এটিকে naturally normally on style device হিসেবে ভাবা যায়।
        </p>

        <p>
          Enhancement MOSFET usable channel ছাড়া শুরু হয় এবং electric field
          action দিয়ে channel তৈরি করতে হয়।
        </p>

        <p>
          Depletion MOSFET এই comparison-এ মাঝামাঝি অবস্থায় থাকে, কারণ এটিতেও
          existing channel থাকে, তবে gate insulated হয়।
        </p>
      </SectionCard>

      <SectionCard title="Control mechanism কীভাবে আলাদা?" eyebrow="Channel Control">
        <p>
          JFET মূলত PN-junction structure-এর ভিতরে depletion region change
          করে current control করে।
        </p>

        <p>
          MOSFET insulated gate থেকে তৈরি electric field action দিয়ে current
          control করে।
        </p>

        <p>
          এই কারণেই MOSFET story-তে oxide, field effect, আর channel creation
          বা channel modification আরও স্পষ্টভাবে আসে।
        </p>
      </SectionCard>

      <SectionCard title="MOSFET-এর input resistance সাধারণত বেশি কেন?" eyebrow="Input Behavior">
        <p>
          MOSFET gate oxide দিয়ে insulated থাকায় normal operation-এ gate
          current প্রায় লাগে না।
        </p>

        <p>
          JFET gate junction হওয়ায়, যদিও এটি reverse biased থাকে এবং খুব কম
          current নেয়, তবুও এটি MOSFET gate-এর মতো ideally isolated নয়।
        </p>

        <p>
          এই কারণেই MOSFET input resistance-কে সাধারণত JFET-এর তুলনায় খুব
          বেশি বা extremely high বলা হয়।
        </p>
      </SectionCard>

      <SectionCard title="JFET-কে depletion MOSFET-এর সাথে compare করা হয় কেন?" eyebrow="Closer Match">
        <p>
          JFET আর depletion MOSFET-কে প্রায়ই compare করা হয়, কারণ দুটোই
          starting state-এ existing channel নিয়ে শুরু করে।
        </p>

        <p>
          ফলে দুটোই enhancement MOSFET-এর তুলনায় naturally normally on ধরনের
          device বলে মনে হয়।
        </p>

        <p>
          তবে মূল পার্থক্য হলো JFET এখনও junction gate ব্যবহার করে, আর
          depletion MOSFET insulated MOS gate structure ধরে রাখে।
        </p>
      </SectionCard>

      <SectionCard title="Enhancement MOSFET এখানে strong contrast কেন?" eyebrow="Created Channel">
        <p>
          Enhancement MOSFET আলাদা কারণ এটি ready conduction channel নিয়ে
          শুরু করে না।
        </p>

        <p>
          বরং meaningful conduction শুরু হওয়ার আগে gate field-কে usable
          inversion channel তৈরি করতে হয়।
        </p>

        <p>
          তাই এটি JFET-এর সাথে depletion MOSFET-এর তুলনায় আরও শক্ত contrast
          তৈরি করে।
        </p>
      </SectionCard>

      <SectionCard title="Carrier flow আর current direction compare করার দরকার কেন?" eyebrow="Visualization">
        <p>
          Device structure আরও সহজে বোঝা যায় যখন learner channel-এর ভিতরে
          current আর carrier কীভাবে move করছে তা-ও দেখতে পারে।
        </p>

        <p>
          Carrier flow আর conventional current compare করলে physical transistor
          behavior standard circuit language-এর সাথে connect হয়।
        </p>

        <p>
          Comparison simulator-এ এটি আরও useful, কারণ একই control idea
          different device-এ দেখা হচ্ছে।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          এই device-গুলো compare করার সবচেয়ে সহজ উপায় হলো তিনটি প্রশ্ন করা।
        </p>

        <p>
          Channel আগে থেকেই আছে কি না, gate structure কেমন, আর channel
          control হচ্ছে কীভাবে?
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: JFET মানে existing channel-এর junction-gate
          control, আর MOSFET মানে insulated-gate field control যা channel তৈরি
          করতে বা modify করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>JFET আর MOSFET দুটোই field effect transistor, কিন্তু gate structure আলাদা।</li>
          <li>JFET-এ PN-junction gate থাকে, আর MOSFET-এ oxide-insulated gate থাকে।</li>
          <li>JFET existing channel নিয়ে শুরু হয়, আর enhancement MOSFET-এ channel তৈরি করতে হয়।</li>
          <li>Depletion MOSFET starting channel behavior-এ JFET-এর কাছাকাছি, কিন্তু gate construction-এ নয়।</li>
          <li>MOSFET input resistance সাধারণত বেশি, কারণ gate ভালোভাবে insulated।</li>
          <li>JFET depletion-region behavior দিয়ে current control করে, আর MOSFET electric field control ব্যবহার করে।</li>
          <li>এই lesson construction, control, আর input behavior-কে একটি comparison view-তে আনে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
