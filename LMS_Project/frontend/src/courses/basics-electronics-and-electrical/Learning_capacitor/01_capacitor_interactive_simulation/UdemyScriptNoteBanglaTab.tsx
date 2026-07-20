"use client";

const scriptBlocks = [
  {
    title: "শুরু",
    lines: [
      "এই lesson-এ আমরা শিখব ক্যাপাসিটর কী, কেন এটি electronics-এর একটি গুরুত্বপূর্ণ component, এবং এটি কীভাবে কাজ করে।",
      "ক্যাপাসিটর এমন একটি component, যা কিছু সময়ের জন্য electric charge এবং energy store করতে পারে।",
      "সাধারণভাবে এটি দুইটি conductive plate এবং মাঝখানে dielectric insulating material দিয়ে তৈরি হয়।",
    ],
  },
  {
    title: "মূল ব্যাখ্যা",
    lines: [
      "যখন capacitor-এর দুই পাশে voltage apply করা হয়, তখন plate-গুলোর উপর charge জমা হতে শুরু করে।",
      "একটি plate তুলনামূলক positive হয় এবং অন্যটি negative হয়।",
      "Charge বাড়ার সঙ্গে সঙ্গে capacitor voltage-ও বাড়ে।",
      "এই voltage rise হওয়ার কারণে charging current ধীরে ধীরে কমে যায়।",
      "DC circuit-এ যথেষ্ট সময় পরে capacitor প্রায় full charge হয়ে যায় এবং current প্রায় শূন্যে নেমে আসে।",
    ],
  },
  {
    title: "মূল সূত্র",
    lines: [
      "প্রথম গুরুত্বপূর্ণ সূত্র হলো Q = C x V।",
      "অর্থাৎ stored charge নির্ভর করে capacitance এবং voltage-এর উপর।",
      "দ্বিতীয় গুরুত্বপূর্ণ সূত্র হলো E = one half C V squared।",
      "এটি বলে capacitor তার electric field-এ energy store করে।",
      "আর tau = R x C হলো time constant, যা বলে charging বা discharging কত দ্রুত হবে।",
    ],
  },
  {
    title: "ব্যবহার",
    lines: [
      "Capacitor filter circuit, timing circuit, decoupling circuit, এবং signal coupling circuit-এ খুব বেশি ব্যবহার হয়।",
      "Power supply-তে capacitor ripple কমাতে সাহায্য করে।",
      "Timing circuit-এ capacitor useful delay তৈরি করে।",
    ],
  },
  {
    title: "শেষ কথা",
    lines: [
      "তাই মূল কথা হলো capacitor charge store করে, energy store করে, এবং charging ও discharging-এর সময় voltage ধীরে ধীরে পরিবর্তন করে।",
      "পরবর্তী lesson-গুলোতে আমরা charging, discharging, এবং capacitor-এর practical use আরও বিস্তারিতভাবে দেখব।",
    ],
  },
];

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Udemy Script Bangla
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Lesson 01 Script: ক্যাপাসিটর কী?
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই version-টি Bangla voiceover teaching script হিসেবে লেখা।
        </p>
      </section>

      {scriptBlocks.map((block) => (
        <section
          key={block.title}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:p-6"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {block.title}
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
