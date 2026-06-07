"use client";

import {
  calculateCurrent,
  DEFAULT_RESISTANCE,
  DEFAULT_VOLTAGE,
  getCurrentLevel,
  getCurrentPercent,
} from "./logic";
import { QuizAccordion, type QuizAccordionItem } from "../shared/quiz_accordion";
import { WaterFlowAnalogyPreview } from "../../water-flow analogy/WaterFlowAnalogyPreview";

function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "blue" | "cyan";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-cyan-200 bg-cyan-50 text-cyan-700";

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
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
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

export function LogicTheoryBanglaSection() {
  const voltage = DEFAULT_VOLTAGE;
  const resistance = DEFAULT_RESISTANCE;
  const current = calculateCurrent(voltage, resistance);
  const currentLevel = getCurrentLevel(current);
  const currentPercent = getCurrentPercent(current);

  const quizItems: QuizAccordionItem[] = [
    {
      question: "সহজ ভাষায় current কী বোঝায়?",
      answer: "Current মানে circuit-এর ভেতর দিয়ে কত electric charge flow করছে।",
    },
    {
      question: "Open circuit-এ current চলতে পারে কি?",
      answer: "না। Current চলার জন্য complete path দরকার।",
    },
    {
      question: "Voltage বাড়লে আর resistance একই থাকলে current-এর কী হয়?",
      answer: "সাধারণত current বেড়ে যায়, কারণ electrical push stronger হয়।",
    },
    {
      question: "Water analogy-তে current কোন জিনিসের মতো?",
      answer: "Water flow electric current-কে বোঝায়।",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Logic &amp; Theory (Bangla)
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Current কী?
            </h1>
            <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
              Current হলো complete path-এর মধ্যে দিয়ে electric charge flow করার পরিমাণ।
            </p>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              আমরা এটি খুব simple way-এ শিখব। তুমি যদি beginner হও, তাহলেও সহজে follow করতে পারবে।
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              একবার water flow-এর picture মাথায় আনো। Push বেশি হলে flow বাড়ে। Blockage বেশি হলে flow কমে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            <ValueCard label="Voltage Push" value={`${voltage.toFixed(1)} V`} tone="red" />
            <ValueCard label="Resistance" value={`${resistance.toFixed(1)} Ohm`} tone="cyan" />
            <ValueCard label="Current Flow" value={`${current.toFixed(2)} A`} tone="blue" />
          </div>
        </div>
      </section>

      <SectionCard title="এটা কী?" eyebrow="Core Concept">
        <p>Current হলো circuit-এর মধ্যে electric charge flow করা।</p>
        <p>
          সহজ ভাষায়, current আমাদের বলে আসলে কত charge move করছে। প্রতি second-এ বেশি charge গেলে current বেশি হয়।
        </p>
        <p>
          Pipe-এর মধ্যে পানি চলার কথা ভাবো। যদি অনেক পানি move করে, flow strong হয়। যদি অল্প পানি move করে, flow weak হয়। Current-ও একই ধরনের idea follow করে।
        </p>
        <p>
          <strong>Checkpoint Question: Current কি push বোঝায়, blockage বোঝায়, নাকি actual flow বোঝায়?</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা গুরুত্বপূর্ণ কেন?" eyebrow="Why It Matters">
        <p>Current গুরুত্বপূর্ণ কারণ এটি বলে circuit আসলে real কাজ করছে কি না।</p>
        <p>
          Light জ্বলে, fan ঘোরে, motor চলে তখনই, যখন enough current circuit-এর মধ্যে move করতে পারে।
        </p>
        <p>
          Current খুব কম হলে device weak হতে পারে বা কাজ নাও করতে পারে। Current খুব বেশি হলে circuit unsafe হতে পারে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Current আমাদের জানায় energy সত্যি সত্যি circuit-এর মধ্যে move করছে কি না।
        </p>
        <p>
          <strong>যা খেয়াল করবে:</strong> Voltage থাকলেও enough current না থাকলে device ঠিকমতো কাজ নাও করতে পারে।
        </p>
        <p>
          <strong>Checkpoint Question: Lamp বা motor-এর জন্য current কেন important?</strong>
        </p>
      </SectionCard>

      <SectionCard title="এটা কীভাবে কাজ করে?" eyebrow="How It Works">
        <p>Current mainly দুইটি জিনিসের ওপর depend করে: voltage এবং resistance।</p>
        <p>
          Voltage হলো electrical push। Voltage বাড়লে এটি charge-কে circuit-এর মধ্যে আরও বেশি move করাতে চায়।
        </p>
        <p>
          Resistance হলো flow-এর opposition। Resistance বাড়লে charge move করা harder হয়ে যায়।
        </p>
        <p>
          তাই current হলো এই দুইটার result। Push বেশি হলে সাধারণত current বাড়ে। Resistance বেশি হলে সাধারণত current কমে।
        </p>
        <p>
          Beginner-রা অনেক সময় current আর voltage-কে একই জিনিস ভাবতে পারে। আসলে তারা এক নয়। Voltage হলো push। Current হলো সেই push-এর কারণে হওয়া flow।
        </p>
        <p>
          এই simulation-এ battery দেয় <strong>{voltage.toFixed(1)} V</strong>। Resistor হলো <strong>{resistance.toFixed(1)} Ohm</strong>। এই combination-এর কারণে current হয় <strong>{current.toFixed(2)} A</strong>।
        </p>
        <p>
          সহজ হিসাব: <strong>I = V / R = {voltage.toFixed(1)} / {resistance.toFixed(1)} = {current.toFixed(2)} A</strong>
        </p>
        <p>
          এই কারণেই simulation-এ voltage slider বা resistance slider move করলে current বদলে যায়।
        </p>
        <p>
          <strong>মূল কথা:</strong> Push বাড়লে আর resistance একই থাকলে current বাড়ে।
        </p>
        <p>
          <strong>মূল কথা:</strong> Resistance বাড়লে আর voltage একই থাকলে current কমে।
        </p>
        <p>
          <strong>Checkpoint Question: Resistance বড় হলে আর voltage same থাকলে current-এর কী হয়?</strong>
        </p>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-cyan-300 to-sky-400" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Real Device Example
              </div>
              <h2 className="mt-4 text-[1.4rem] font-bold tracking-tight text-slate-950 md:text-[1.55rem]">
                বাস্তব উদাহরণ
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
                <p>আবার একটি torch light-এর কথা ভাবো।</p>
                <p>
                  Battery ভালো থাকলে আর path complete থাকলে charge bulb-এর মধ্যে দিয়ে move করে। এই moving charge-টাই current।
                </p>
                <p>
                  Battery weak হলে current কমে যায়। Path ভেঙে গেলে current বন্ধ হয়ে যায়। Resistance বেশি হলে bulb dim হয়ে যায়।
                </p>
                <p>
                  এই একই কারণেই technician-রা lamp, motor, charger, আর control circuit test করার সময় current check করে।
                </p>
                <p>
                  যখন real device দেখবে, এই প্রশ্নটা ভাবো: enough charge কি সত্যি move করছে, নাকি flow খুব weak?
                </p>
                <p>
                  <strong>Checkpoint Question: একটি simple lamp circuit-এ path ভেঙে গেলে current-এর কী হয়?</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <WaterFlowAnalogyPreview />
          </div>
        </div>
      </section>

      <SectionCard title="Quick recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Current হলো electric charge-এর actual flow।</li>
          <li>Current চলার জন্য complete path দরকার।</li>
          <li>Voltage সাধারণত current বাড়ায়।</li>
          <li>Resistance সাধারণত current কমায়।</li>
          <li>Ohm&apos;s Law দিয়ে current calculate করা যায়: I = V / R.</li>
          <li>Water flow analogy current বুঝতে সাহায্য করে।</li>
        </ul>
      </SectionCard>

      <SectionCard title="Knowledge check quiz" eyebrow="Check Yourself">
        <p>প্রতিটি question খুলে answer দেখে নাও।</p>
        <QuizAccordion items={quizItems} />
      </SectionCard>
    </div>
  );
}
