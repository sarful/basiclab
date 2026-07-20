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
      question: "DPDT relay-এর মূল ধারণা কী?",
      answer:
        "DPDT relay-এ দুইটি আলাদা changeover contact set থাকে, তাই একটি relay coil একসাথে দুইটি common line-কে NC আর NO output-এর মধ্যে switch করতে পারে।",
    },
    {
      question: "DPDT মানে কী?",
      answer:
        "DPDT মানে double-pole double-throw। অর্থাৎ এখানে দুইটি pole থাকে এবং প্রতিটি pole দুইটি contact position-এর মধ্যে switch করতে পারে।",
    },
    {
      question: "DPDT আর SPDT-এর সম্পর্ক কী?",
      answer:
        "DPDT-কে সহজভাবে দুইটি SPDT contact set হিসেবে ভাবা যায়, যেগুলো একই relay coil দ্বারা একসাথে operate হয়।",
    },
    {
      question: "Default state-এ কী হয়?",
      answer:
        "Unenergized state-এ দুইটি common terminal সাধারণত তাদের normally closed contact-এর সাথে connected থাকে।",
    },
    {
      question: "Coil energized হওয়ার পরে কী হয়?",
      answer:
        "Coil energized হলে দুইটি common terminal একসাথে NC side থেকে NO side-এ switch হয়।",
    },
    {
      question: "Control circuit-এ DPDT useful কেন?",
      answer:
        "কারণ একটি relay একসাথে দুইটি আলাদা path control করতে পারে, যা reversing, interlocking, আর multi-line switching-এর জন্য useful।",
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
              Relay DPDT
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              এই lesson-এ বোঝানো হয়েছে কীভাবে একটি DPDT relay একটি relay coil
              ব্যবহার করে দুইটি common line-কে NC আর NO contact-এর মধ্যে switch
              করে।
            </p>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              মূল idea হলো একটি relay একসাথে দুইটি changeover action করতে পারে।
            </p>

            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              তাই DPDT relay, SPST বা SPDT-এর তুলনায় আরও advanced control logic
              বোঝার জন্য useful।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Contact Type" value="DPDT" tone="emerald" />
            <ValueCard label="Default Paths" value="2 x COM to NC" tone="violet" />
            <ValueCard label="Coil Effect" value="2 x COM to NO" tone="amber" />
          </div>
        </div>
      </section>

      <SectionCard title="DPDT মানে কী?" eyebrow="Contact Name">
        <p>
          DPDT মানে double-pole double-throw। অর্থাৎ এখানে দুইটি আলাদা pole
          থাকে এবং প্রতিটি pole দুইটি position-এর মধ্যে switch করতে পারে।
        </p>

        <p>
          Relay-এর ভাষায় সাধারণত এর মানে হলো দুইটি common terminal, দুইটি NC
          contact, আর দুইটি NO contact।
        </p>

        <p>
          ফলে একটি relay একসাথে দুইটি independent changeover path control করতে
          পারে।
        </p>
      </SectionCard>

      <SectionCard title="DPDT আর SPDT-এর সম্পর্ক কী?" eyebrow="Building Concept">
        <p>SPDT relay-এ একটি common terminal NC আর NO-এর মধ্যে change হয়।</p>

        <p>
          DPDT relay-এ একই idea থাকে, তবে সেখানে একটির বদলে দুইটি changeover
          contact set থাকে।
        </p>

        <p>
          Beginner-দের জন্য সহজ মনে রাখার উপায় হলো: DPDT মানে দুইটি SPDT system
          একসাথে কাজ করছে।
        </p>
      </SectionCard>

      <SectionCard title="Normal state-এ কী হয়?" eyebrow="Default Condition">
        <p>
          Normal unenergized state-এ দুইটি common terminal সাধারণত তাদের NC
          contact-এর সাথে connected থাকে।
        </p>

        <p>অর্থাৎ দুইটি contact section-ই defaultভাবে NC connection দেয়।</p>

        <p>দুইটি NO path coil energized না হওয়া পর্যন্ত disconnected থাকে।</p>
      </SectionCard>

      <SectionCard title="Coil energized হওয়ার পরে কী change হয়?" eyebrow="Dual Changeover Action">
        <p>
          Relay coil energized হলে magnetic action internal switching mechanism-কে
          move করায়।
        </p>

        <p>দুইটি common terminal একসাথে NC থেকে NO-তে change হয়।</p>

        <p>
          এই synchronized dual switching-ই DPDT relay-এর সবচেয়ে গুরুত্বপূর্ণ
          operating feature।
        </p>
      </SectionCard>

      <SectionCard title="DPDT useful কেন?" eyebrow="Practical Advantage">
        <p>
          DPDT useful যখন একই coil command দিয়ে দুইটি আলাদা line-এর state change
          করতে হয়।
        </p>

        <p>
          Reversing circuit, signal selection, interlocking, আর multi-path
          control system-এ এটি খুব useful।
        </p>

        <p>ফলে কিছু design-এ একাধিক relay-এর দরকার কমে যায়।</p>
      </SectionCard>

      <SectionCard title="এটি SPDT-এর চেয়ে advanced কেন?" eyebrow="Learning Progression">
        <p>SPDT একটি common terminal এবং একটি changeover action introduce করে।</p>

        <p>
          DPDT একই idea-কে বাড়িয়ে দুইটি contact group-এর ওপর apply করে, যেগুলো
          একসাথে কাজ করে।
        </p>

        <p>
          তাই এটি learner-কে basic contact logic থেকে আরও complex relay system-এর
          দিকে নিয়ে যায়।
        </p>
      </SectionCard>

      <SectionCard title="Beginner memory rule কী?" eyebrow="Formula-Free Idea">
        <p>
          সবচেয়ে সহজ উপায় হলো দুইটি common terminal-কে একসাথে follow করা।
        </p>

        <p>Normal state-এ দুইটিই NC-তে থাকে। Energized হলে দুইটিই NO-তে যায়।</p>

        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Practical takeaway: DPDT relay এক coil দিয়ে coordinated দুইটি SPDT
          switchover-এর মতো কাজ করে।
        </p>
      </SectionCard>

      <SectionCard title="সংক্ষিপ্ত পুনরালোচনা" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>DPDT মানে double-pole double-throw।</li>
          <li>এতে দুইটি changeover contact section থাকে।</li>
          <li>এটিকে দুইটি SPDT set-এর মতো বোঝা যায়।</li>
          <li>Default state-এ সাধারণত দুইটি COM terminal-ই NC-তে থাকে।</li>
          <li>Coil energized হলে দুইটি COM terminal-ই NO-তে যায়।</li>
          <li>DPDT একসাথে দুইটি path switch করার জন্য useful।</li>
          <li>এটি advanced relay control task-এ common।</li>
        </ul>
      </SectionCard>

      <SectionCard title="নিজেকে যাচাই করুন" eyebrow="Check Yourself">
        <p>উত্তর দেখার জন্য প্রতিটি প্রশ্ন খুলুন।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
