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
      question: "আলাদা আলাদা MOSFET lesson-এর পরে এই simulator কেন দরকার?",
      answer:
        "কারণ এটি enhancement, depletion, N-channel, এবং P-channel MOSFET-কে একসাথে তুলনা করার সুযোগ দেয়, ফলে learner একই জায়গায় তাদের পার্থক্য বুঝতে পারে।",
    },
    {
      question: "Enhancement আর depletion MOSFET-এর সবচেয়ে সহজ পার্থক্য কী?",
      answer:
        "Enhancement MOSFET normally off দিয়ে শুরু হয় এবং channel তৈরি করতে gate action দরকার হয়, আর depletion MOSFET existing channel নিয়ে normally on দিয়ে শুরু হয়।",
    },
    {
      question: "N-channel আর P-channel device-এর মূল contrast কী?",
      answer:
        "এদের gate polarity requirement একে অপরের উল্টো, আর dominant carrier-ও আলাদা: N-channel-এ electron, P-channel-এ hole।",
    },
    {
      question: "এই comparison-এ threshold কেন গুরুত্বপূর্ণ?",
      answer:
        "Threshold enhancement device-এ useful channel formation কোথা থেকে শুরু হচ্ছে তা বোঝায়, আর depletion device-এ cutoff-style boundary turn-off behavior বোঝাতে সাহায্য করে।",
    },
    {
      question: "দুটি MOSFET side by side দেখানোর সুবিধা কী?",
      answer:
        "একই drain voltage, load, আর gate setting রেখে different MOSFET family একই condition-এ কীভাবে respond করে তা সহজে দেখা যায়।",
    },
    {
      question: "Theory lesson-এও load type আর drain voltage কেন গুরুত্বপূর্ণ?",
      answer:
        "কারণ MOSFET behavior শুধু gate theory দিয়ে শেষ হয় না; external circuit-ই current, power, visible output, আর operating region নির্ধারণ করে।",
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
              MOSFET Types Comparison
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ একাধিক MOSFET family-কে একসাথে comparison view-তে
              আনা হয়েছে, যাতে learner বুঝতে পারে enhancement, depletion,
              N-channel, আর P-channel device একই condition-এ কীভাবে আলাদা আচরণ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আলাদা আলাদা device আলাদা করে শেখার বদলে এখানে দেখা যায় কীভাবে
              channel type, gate polarity, threshold behavior, আর load response
              এক MOSFET family থেকে আরেকটিতে বদলে যায়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই lesson 12 মূলত একটি summary-and-contrast lesson, যা আগের
              MOSFET topic-গুলোকে একসাথে connect করে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Main Goal" value="Compare Families" tone="emerald" />
            <ValueCard label="Big Contrast" value="Enhancement vs Depletion" tone="violet" />
            <ValueCard label="Side-by-Side Focus" value="N vs P Channel" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="একটি lesson-এ MOSFET type compare করা দরকার কেন?" eyebrow="Big Picture">
        <p>
          আগের lesson-গুলোতে নির্দিষ্ট MOSFET idea একেকটি করে বোঝানো হয়েছে,
          কিন্তু সেই idea-গুলোকে পাশাপাশি রাখলে আসল understanding আরও শক্ত হয়।
        </p>

        <p>
          এই simulator learner-কে দেখায় gate voltage, drain voltage, আর load
          একসাথে change করলে different MOSFET family কীভাবে respond করে।
        </p>

        <p>
          এই comparison approach আলাদা আলাদা fact-কে একটিমাত্র connected mental
          model-এ রূপ দেয়।
        </p>
      </SectionCard>

      <SectionCard title="Enhancement আর depletion MOSFET-এর starting state আলাদা" eyebrow="Starting State">
        <p>
          Enhancement MOSFET normally off condition থেকে শুরু হয় এবং useful
          conduction channel তৈরি করতে যথেষ্ট gate voltage দরকার হয়।
        </p>

        <p>
          Depletion MOSFET existing channel নিয়ে শুরু হয়, তাই এটি normally on
          থাকে এবং gate action এটিকে cutoff-এর দিকে দুর্বল করতে পারে।
        </p>

        <p>
          এই starting-state difference পুরো MOSFET topic-এর সবচেয়ে গুরুত্বপূর্ণ
          ধারণাগুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="N-channel আর P-channel-এর মধ্যে কী বদলায়?" eyebrow="Polarity Rule">
        <p>
          N-channel আর P-channel MOSFET শুধু mirror label নয়; এদের gate
          polarity behavior উল্টো হয় এবং dominant carrier-ও আলাদা হয়।
        </p>

        <p>
          N-channel device মূলত electron-এর সাথে সম্পর্কিত, আর P-channel
          device মূলত hole-এর সাথে সম্পর্কিত।
        </p>

        <p>
          তাই যে gate setting একটি type-কে সাহায্য করে, সেটি অন্য type-এর
          useful operation-এর বিরুদ্ধে যেতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Side-by-side view এত গুরুত্বপূর্ণ কেন?" eyebrow="Same Conditions">
        <p>
          সবচেয়ে শক্তিশালী comparison হয় তখন, যখন দুটি MOSFET একই operating
          condition-এ দেখা যায়।
        </p>

        <p>
          যদি gate voltage, drain voltage, আর load shared থাকে, তাহলে learner
          সহজে বুঝতে পারে শুধুমাত্র device type বদলালে channel strength,
          region, আর current behavior কীভাবে বদলায়।
        </p>

        <p>
          এতে confusion কমে যায় এবং theory-কে বিশ্বাস করা সহজ হয়।
        </p>
      </SectionCard>

      <SectionCard title="Threshold আর cutoff idea একসাথে কীভাবে fit করে?" eyebrow="Operating Boundaries">
        <p>
          Enhancement MOSFET theory-তে threshold voltage খুব গুরুত্বপূর্ণ,
          কারণ এটি useful channel formation কোথা থেকে শুরু হচ্ছে তা বোঝায়।
        </p>

        <p>
          Depletion MOSFET theory cutoff-style boundary দিয়ে সহজে বোঝা যায়,
          যেখানে gate action existing channel-কে দুর্বল করতে করতে useful
          current বন্ধ করে দেয়।
        </p>

        <p>
          এই দুই idea এক lesson-এ থাকলে learner বুঝতে পারে সব MOSFET family
          একই turn-on এবং turn-off story follow করে না।
        </p>
      </SectionCard>

      <SectionCard title="Region name-গুলো এখনও গুরুত্বপূর্ণ কেন?" eyebrow="OFF to Saturation">
        <p>
          এই simulator শুধু ON আর OFF state compare করে না; threshold, weak
          channel, linear operation, cutoff, বা saturation-এর মতো region-ও দেখায়।
        </p>

        <p>
          এই নামগুলো গুরুত্বপূর্ণ, কারণ এগুলো বলে MOSFET কীভাবে operate করছে,
          শুধু current আছে কি নেই তা নয়।
        </p>

        <p>
          যে learner region change বোঝে, সে পরের circuit lesson-গুলোতে device
          behavior আরও ঠিকভাবে interpret করতে পারে।
        </p>
      </SectionCard>

      <SectionCard title="Load type আর drain voltage এখনও matter করে কেন?" eyebrow="Circuit Context">
        <p>
          MOSFET কখনও theory-only object হিসেবে operate করে না; এটি সবসময়
          circuit-এর অংশ হিসেবে কাজ করে।
        </p>

        <p>
          তাই drain voltage আর load type এখনও drain current, power, visible
          output, আর final operating region-কে প্রভাবিত করে, যদিও gate theory
          lesson-এর মূল focus।
        </p>

        <p>
          এই কারণেই comparison lab একটি single textbook definition-এর তুলনায়
          বেশি বাস্তবধর্মী।
        </p>
      </SectionCard>

      <SectionCard title="Carrier flow আর conventional current দুটোই দেখানো হয় কেন?" eyebrow="Two Viewpoints">
        <p>
          অনেক beginner confused হয়ে যায়, কারণ carrier motion আর conventional
          current direction সবসময় একই ভাষায় বোঝানো হয় না।
        </p>

        <p>
          দুই viewpoint একসাথে দেখালে learner বুঝতে পারে একই device-কে
          physical carrier বা standard circuit-current language দুটো দিয়েই
          ব্যাখ্যা করা যায়।
        </p>

        <p>
          এটি বিশেষ করে N-channel আর P-channel family compare করার সময় খুবই
          useful।
        </p>
      </SectionCard>

      <SectionCard title="সবচেয়ে practical beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          Lesson 12 বোঝার সবচেয়ে সহজ উপায় হলো তিনটি জিনিস ধারাবাহিকভাবে compare
          করা: starting state, required gate polarity, এবং resulting channel strength।
        </p>

        <p>
          এই তিনটি idea clear হয়ে গেলে current, region, আর load behavior
          predict করা অনেক সহজ হয়ে যায়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: MOSFET name-গুলোকে আলাদা label হিসেবে মুখস্থ
          করবেন না। প্রতিটি type-কে তার start condition, gate rule, carrier
          type, আর একই circuit condition-এ channel response দিয়ে পড়ুন।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Lesson 12 একটি comparison lesson, যা আগের MOSFET topic-গুলোকে connect করে।</li>
          <li>Enhancement MOSFET normally off দিয়ে শুরু হয়, আর depletion MOSFET normally on দিয়ে শুরু হয়।</li>
          <li>N-channel আর P-channel device-এর gate-polarity behavior একে অপরের উল্টো।</li>
          <li>Threshold enhancement device-এর জন্য central, আর cutoff-style behavior depletion device-এর জন্য central।</li>
          <li>একই condition-এ side-by-side comparison আসল device difference পরিষ্কার করে।</li>
          <li>Load type আর drain voltage current, power, আর visible operation-কে shape করে।</li>
          <li>Region name বলে device কীভাবে operate করছে, শুধু ON কি OFF তা নয়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
