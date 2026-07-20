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
  tone: "emerald" | "amber" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-sky-200 bg-sky-50 text-sky-800";

  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-300 to-sky-300" />
      <div className="p-5 md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
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
      question: "এই breadboard-এ একই numbered column-এর A-E কি internally connected?",
      answer:
        "হ্যাঁ। একই numbered column-এর A-E একটি internal terminal-strip group তৈরি করে।",
    },
    {
      question: "E20 এবং F20 কি jumper ছাড়া connected?",
      answer:
        "না। Center gap top আর bottom half-কে আলাদা করে, তাই ওগুলোর মাঝে jumper লাগবে।",
    },
    {
      question: "Power rail কি নিজে থেকেই নিচের terminal strip-এ power দেয়?",
      answer:
        "না। Rail আলাদা থাকে, তাই rail থেকে terminal strip-এ power দিতে jumper wire লাগাতে হয়।",
    },
    {
      question: "A8 বা C30-এর মতো breadboard coordinate কেন গুরুত্বপূর্ণ?",
      answer:
        "কারণ এগুলো exact hole location বোঝায়, তাই কোন hole internally connected আর কোথায় jumper দরকার তা বোঝা যায়।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              ব্রেডবোর্ড বেসিকস
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Breadboard হলো একটি practice board যেখানে soldering ছাড়া circuit
              build আর test করা যায়, কিন্তু তা ঠিকভাবে করতে হলে কোন hole আগে
              থেকেই connected সেটা বুঝতে হবে।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              এই lesson-এর মূল practical idea হলো: breadboard কোনো random grid
              নয়। Internal connection group, power rail, আর center gap ঠিক
              করে দেয় কোথায় electricity যেতে পারবে আর কোথায় পারবে না।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Top Group" value="A-E" tone="emerald" />
            <ValueCard label="Bottom Group" value="F-J" tone="amber" />
            <ValueCard label="Gap Rule" value="Needs Jumper" tone="sky" />
          </div>
        </div>
      </section>

      <SectionCard title="Breadboard কী?" eyebrow="Core Concept">
        <p>
          Breadboard হলো একটি reusable board যেখানে temporary electronic
          circuit build করা যায় soldering ছাড়া।
        </p>
        <p>
          Component আর jumper wire hole-এ বসানো হয়, আর board-এর ভিতরের metal
          strip কিছু hole-কে automatically connect করে।
        </p>
        <p>
          এই lesson-এর আসল learning goal শুধু hole-এ part বসানো নয়। কোন hole
          আগে থেকেই connected আর কোনগুলো আলাদা আছে, সেটি বোঝাই সবচেয়ে জরুরি।
        </p>
      </SectionCard>

      <SectionCard title="Breadboard logic কেন গুরুত্বপূর্ণ" eyebrow="Why It Matters">
        <p>
          Beginner-রা অনেক সময় ভাবে কাছাকাছি hole মানেই connected, কিন্তু
          breadboard এভাবে কাজ করে না।
        </p>
        <p>Practical circuit work-এ আমাদের এমন প্রশ্নের উত্তর জানতে হয়:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>কোন hole একই internal strip share করে?</li>
          <li>কোন hole center gap-এর কারণে আলাদা হয়ে যায়?</li>
          <li>কখন jumper wire সত্যিই দরকার হয়?</li>
          <li>Power rail কি already row-টাকে feed করছে, নাকি wire দিতে হবে?</li>
        </ul>
        <p>
          এই rules বুঝতে পারলে trial and error-এর বদলে purpose নিয়ে wire বসানো
          যায়।
        </p>
      </SectionCard>

      <SectionCard title="Internal terminal group" eyebrow="Connection Logic">
        <p>
          এই lesson-এ একই numbered column-এর <strong>A-E</strong> top half-এ
          একটি internal connection group তৈরি করে।
        </p>
        <p>
          একই numbered column-এর <strong>F-J</strong> bottom half-এ আরেকটি
          আলাদা internal connection group তৈরি করে।
        </p>
        <p>
          অর্থাৎ A8, B8, C8, D8, আর E8 আগে থেকেই internally connected।
        </p>
        <p>
          কিন্তু ওই top-half hole-গুলো F8, G8, H8, I8, বা J8-এর সাথে connected
          নয়, কারণ ওগুলো center gap-এর নিচের group-এ।
        </p>
      </SectionCard>

      <SectionCard title="Center gap কী করে" eyebrow="Critical Structure">
        <p>
          Center gap top terminal strip আর bottom terminal strip-এর connection
          break করে দেয়।
        </p>
        <p>
          তাই দুইটি hole-এর column number একই হলেও, যদি একটি gap-এর উপরে আর
          অন্যটি gap-এর নিচে থাকে, তাহলে তারা electrically separate হতে পারে।
        </p>
        <p>
          এই lesson-এ <strong>E20</strong> আর <strong>F20</strong> ভালো
          example। একই column-এ line up করলেও jumper ছাড়া তারা connected নয়।
        </p>
      </SectionCard>

      <SectionCard title="Power rail কীভাবে কাজ করে" eyebrow="Power Distribution">
        <p>
          Power rail হলো লম্বা distribution line যা board জুড়ে supply voltage
          আর ground carry করতে সাহায্য করে।
        </p>
        <p>
          Power rail অনেক point feed করতে পারে, কিন্তু rail নিজে থেকেই terminal
          strip-এর সাথে connected নয়।
        </p>
        <p>
          তাই <strong>Top + rail 8</strong> থেকে A8-এ connection দেওয়া মানে
          একটি deliberate wiring step, automatic built-in connection নয়।
        </p>
      </SectionCard>

      <SectionCard title="Coordinate কেন গুরুত্বপূর্ণ" eyebrow="Reading the Board">
        <p>
          Breadboard coordinate যেমন A8, C30, বা F20 exact hole location
          বোঝায়।
        </p>
        <p>
          Row letter আর column number একসাথে দেখে বোঝা যায় দুইটি hole একই
          internal group-এ আছে, নাকি আলাদা group-এ।
        </p>
        <p>
          ভালো breadboard কাজ visual closeness দেখে guess করার বদলে coordinate
          পড়ে বোঝার ওপর নির্ভর করে।
        </p>
      </SectionCard>

      <SectionCard title="Jumper wire কখন দরকার" eyebrow="Practical Rule">
        <p>
          Jumper wire তখন দরকার হয়, যখন দুইটি hole-কে connect করতে হবে কিন্তু
          board-এর internal metal strip ওগুলোকে already link করেনি।
        </p>
        <p>
          যেমন A8 থেকে A14-এ jumper দরকার, কারণ ওগুলো different column-এ।
        </p>
        <p>
          Power rail থেকে terminal row-এ connection দিতেও jumper দরকার, কারণ
          rail আর row আলাদা system।
        </p>
        <p>
          আর circuit যদি top half থেকে bottom half-এ যেতে চায়, তাহলে center
          gap jumper দিয়ে cross করতে হবে।
        </p>
      </SectionCard>

      <SectionCard title="Common beginner mistake" eyebrow="High Priority">
        <p>
          একই row letter দেখেই assume করা যাবে না যে different column-এর hole
          automatically connected।
        </p>
        <p>Power rail already terminal strip-কে feed করছে, এমনও assume করা যাবে না।</p>
        <p>
          একই column number দেখেই center gap ignore করা যাবে না।
        </p>
        <p>
          আর যেখানে hole already internally connected, সেখানে অযথা jumper
          বসানোও ঠিক নয়।
        </p>
      </SectionCard>

      <SectionCard title="দ্রুত recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>একই numbered column-এর A-E top half-এ internally connected।</li>
          <li>একই numbered column-এর F-J bottom half-এ internally connected।</li>
          <li>Center gap top আর bottom half-কে আলাদা করে।</li>
          <li>Power rail থেকে terminal strip-এ power দিতে jumper লাগে।</li>
          <li>Breadboard coordinate দেখে সঠিক connection point বোঝা যায়।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>নিচের question-গুলো দিয়ে breadboard-এর core rule ঝালাই করো।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
