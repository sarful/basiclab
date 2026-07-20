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
      question: "Relay coil with SPST NC lesson-এর মূল ধারণা কী?",
      answer:
        "এই lesson-এ relay coil-এর সাথে একটি single-pole single-throw normally closed contact দেখানো হয়েছে, যাতে learner energize হওয়ার আগে ও পরে contact path কীভাবে কাজ করে তা বুঝতে পারে।",
    },
    {
      question: "SPST NC মানে কী?",
      answer:
        "SPST NC মানে single-pole single-throw normally closed। অর্থাৎ relay-এর default unenergized অবস্থায় contact path closed থাকে।",
    },
    {
      question: "Normal state-এ কী হয়?",
      answer:
        "Unenergized অবস্থায় NC contact closed থাকে, তাই contact path defaultভাবে available থাকে।",
    },
    {
      question: "Relay coil energized হওয়ার পরে কী হয়?",
      answer:
        "Armature move করে এবং normally closed path open হয়ে যায়। ফলে ওই contact route interrupt হয়।",
    },
    {
      question: "COM-NC-NO changeover lesson-এর তুলনায় এই lesson সহজ কেন?",
      answer:
        "কারণ এখানে learner-কে একই সঙ্গে NC আর NO দুইটা path track করতে হয় না; শুধু একটি normally closed switching path বুঝলেই হয়।",
    },
    {
      question: "Practical control circuit-এ এই lesson useful কেন?",
      answer:
        "কারণ normally closed relay contact এমন circuit-এ useful, যেখানে circuit defaultভাবে connected থাকবে আর coil energized হলে open হবে।",
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
              Relay Coil with SPST NC
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে relay coil একটি single-pole
              single-throw normally closed contact-এর সাথে কাজ করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              সবচেয়ে গুরুত্বপূর্ণ beginner idea হলো: normal state-এ contact
              path closed থাকে, আর coil energized হলে সেই path open হয়।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই এই lesson default-closed relay control behavior-এর একটি সহজ
              introduction।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="SPST NC" tone="emerald" />
            <ValueCard label="Normal State" value="Closed Path" tone="violet" />
            <ValueCard label="Coil Effect" value="Opens Contact" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="SPST NC মানে কী?" eyebrow="Contact Name">
        <p>
          SPST মানে single-pole single-throw, অর্থাৎ একটি simple one-path
          switching arrangement।
        </p>

        <p>
          NC মানে normally closed, তাই relay unenergized default state-এ
          contact path closed থাকে।
        </p>

        <p>
          একসাথে এটি একটি very clear default-closed relay contact example
          দেখায়।
        </p>
      </SectionCard>

      <SectionCard title="Coil energized হওয়ার আগে কী হয়?" eyebrow="Default Path">
        <p>
          Relay coil energized হওয়ার আগে contact normal closed position-এ
          থাকে।
        </p>

        <p>
          এর মানে contact-এর মাধ্যমে electrical path defaultভাবেই available
          থাকে।
        </p>

        <p>
          NC relay contact-এর জন্য এটি সবচেয়ে গুরুত্বপূর্ণ starting idea।
        </p>
      </SectionCard>

      <SectionCard title="Coil energized হওয়ার পরে কী change হয়?" eyebrow="Opening Action">
        <p>
          Relay coil energized হলে relay-এর internal moving part position
          change করে।
        </p>

        <p>
          এই SPST NC case-এ normally closed contact path open হয়ে যায়।
        </p>

        <p>ফলে আগে connected থাকা route interrupt হয়ে যায়।</p>
      </SectionCard>

      <SectionCard title="এটি NO contact-এর থেকে কীভাবে আলাদা?" eyebrow="Default Condition Contrast">
        <p>
          NO contact defaultভাবে open থাকে এবং relay energized হওয়ার পরে
          connect হয়।
        </p>

        <p>
          NC contact ঠিক উল্টো: defaultভাবে connected থাকে এবং coil energized
          হলে open হয়।
        </p>

        <p>
          এই opposite behavior relay learning-এর সবচেয়ে গুরুত্বপূর্ণ beginner
          comparison-গুলোর একটি।
        </p>
      </SectionCard>

      <SectionCard title="Full changeover relay-এর তুলনায় এই lesson সহজ কেন?" eyebrow="Reduced Switching Complexity">
        <p>
          Changeover relay-এ learner-কে COM, NC, আর NO একসাথে track করতে হয়।
        </p>

        <p>
          এই lesson-এ শুধু একটি simple normally closed path বোঝা লাগে।
        </p>

        <p>
          ফলে advanced contact system-এর আগে contact-state idea সহজে clear
          হয়।
        </p>
      </SectionCard>

      <SectionCard title="এখানেও relay coil গুরুত্বপূর্ণ কেন?" eyebrow="Coil as Trigger">
        <p>
          এই lesson NC contact-এর ওপর focus করলেও, coil-ই contact change-এর
          trigger।
        </p>

        <p>Coil energized না হলে contact normal closed state-এই থাকে।</p>

        <p>
          তাই এই lesson আবারও reinforce করে যে coil-ই relay action-এর control
          engine।
        </p>
      </SectionCard>

      <SectionCard title="Practical use-এ SPST NC useful কোথায়?" eyebrow="Practical Use">
        <p>
          SPST NC relay contact useful যখন কোনো circuit defaultভাবে connected
          থাকবে এবং coil activated হলে disconnect হবে।
        </p>

        <p>
          এই ধরনের behavior safety, default-pass, বা fail-state control
          concept-এ helpful হতে পারে।
        </p>

        <p>
          তাই এই lesson শুধু academic না; control logic design-এর সাথেও
          directly relate করে।
        </p>
      </SectionCard>

      <SectionCard title="Relay coil lesson-এর পরে এটি গুরুত্বপূর্ণ কেন?" eyebrow="Learning Progression">
        <p>Relay coil lesson magnetic action কীভাবে শুরু হয় সেটা শেখায়।</p>

        <p>
          এই lesson সেই coil action-এর result-কে একটি real relay output
          path-এ দেখায়।
        </p>

        <p>তাই relay learning-এ এটি একটি natural next step।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে সহজ beginner takeaway কী?" eyebrow="Formula-Free Idea">
        <p>
          SPST NC relay behavior মনে রাখার সবচেয়ে সহজ উপায় হলো একটি sentence
          follow করা।
        </p>

        <p>
          Normal state-এ path closed থাকে, আর coil energized হলে path open
          হয়।
        </p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: একটি SPST NC relay contact defaultভাবে closed
          path দেয়, যা coil active হলেই open হয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>SPST NC মানে single-pole single-throw normally closed।</li>
          <li>Default unenergized state-এ contact path closed থাকে।</li>
          <li>Coil energized হলে NC path open হয়।</li>
          <li>এটি normally open contact-এর উল্টো behavior।</li>
          <li>এই lesson full COM-NC-NO changeover switching-এর চেয়ে সহজ।</li>
          <li>Coil এখনও contact change-এর control trigger।</li>
          <li>এই lesson practical default-closed relay control behavior introduce করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
