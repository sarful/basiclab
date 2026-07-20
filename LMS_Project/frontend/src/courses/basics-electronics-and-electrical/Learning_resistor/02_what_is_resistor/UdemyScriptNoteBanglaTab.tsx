"use client";

type ScriptBlockProps = {
  title: string;
  lines: string[];
};

function ScriptBlock({ title, lines }: ScriptBlockProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
        {title}
      </div>
      <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function PauseCue({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      Pause cue: {children}
    </div>
  );
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-slate-300 bg-white/95 p-5 shadow-xl backdrop-blur md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Udemy Script Bangla
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          রেজিস্টর কী
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই স্ক্রিপ্টটি এমনভাবে লেখা হয়েছে যাতে একজন ইন্সট্রাক্টর ধীরে,
          পরিষ্কারভাবে, আর বাস্তব উদাহরণ দিয়ে রেজিস্টরের মূল ধারণা শেখাতে
          পারেন।
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "এই লেসনে আমরা বুঝব রেজিস্টর কী এবং কেন এটি ইলেকট্রনিক্সের সবচেয়ে গুরুত্বপূর্ণ কম্পোনেন্টগুলোর একটি।",
          "আমরা দেখব রেজিস্টর কীভাবে কারেন্টের প্রবাহে বাধা দেয়, ভোল্টেজ ড্রপ তৈরি করে, LED-এর মতো কম্পোনেন্টকে সুরক্ষা দেয়, এবং বৈদ্যুতিক শক্তির একটি অংশকে তাপে রূপান্তর করে।",
          "সাথে আমরা রেজিস্টরের ohm value আর power rating-এর সম্পর্কও বুঝব, যাতে function আর safety দুটোই পরিষ্কার হয়।",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "শুরুর দিকে রেজিস্টরকে খুব সাধারণ একটা কম্পোনেন্ট মনে হতে পারে।",
          "কিন্তু বাস্তব সার্কিটে রেজিস্টর অত্যন্ত গুরুত্বপূর্ণ কাজ করে।",
          "এটি আমাদের কারেন্টকে নিয়ন্ত্রণ করতে সাহায্য করে, যাতে সার্কিটে অনিয়ন্ত্রিত কারেন্ট প্রবাহ না ঘটে।",
        ]}
      />

      <PauseCue>রেজিস্টরের symbol, একটি real resistor, এবং circuit path দেখান।</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "রেজিস্টর হলো এমন একটি কম্পোনেন্ট যা electric current-এর প্রবাহে বাধা দেয়।",
          "সহজ ভাষায় বললে, এটি কারেন্ট চলাকে কঠিন করে তোলে।",
          "এই কারণেই রেজিস্টর সার্কিটে নিয়ন্ত্রণ আনে।",
        ]}
      />

      <ScriptBlock
        title="Current Limiting"
        lines={[
          "যদি supply voltage একই থাকে, তাহলে resistance কম হলে সাধারণত বেশি কারেন্ট প্রবাহিত হয়।",
          "আর resistance বেশি হলে কারেন্ট কমে যায়।",
          "তাই যখন আমরা কারেন্টকে নিরাপদ বা প্রয়োজনীয় সীমায় রাখতে চাই, তখন রেজিস্টর ব্যবহার করি।",
        ]}
      />

      <ScriptBlock
        title="Voltage Drop"
        lines={[
          "রেজিস্টর শুধু কারেন্টকেই প্রভাবিত করে না, এটি নিজের উপর voltage drop-ও তৈরি করে।",
          "অর্থাৎ source voltage-এর একটি অংশ রেজিস্টরের উপর দেখা যায়।",
          "ফলে রেজিস্টরের পরে যে ভোল্টেজ পাওয়া যায়, তা input voltage-এর চেয়ে কম হতে পারে।",
        ]}
      />

      <PauseCue>Simulator-এ input voltage, resistor drop, আর output voltage point করে দেখান।</PauseCue>

      <ScriptBlock
        title="Protecting an LED"
        lines={[
          "সবচেয়ে পরিচিত উদাহরণগুলোর একটি হলো LED circuit।",
          "LED-কে proper current control ছাড়া সরাসরি voltage source-এর সাথে যুক্ত করা উচিত নয়।",
          "একটি series resistor কারেন্ট সীমিত রাখে, তাই LED আরও নিরাপদভাবে কাজ করতে পারে।",
        ]}
      />

      <ScriptBlock
        title="Heat and Power"
        lines={[
          "রেজিস্টরের মধ্য দিয়ে কারেন্ট প্রবাহিত হলে বৈদ্যুতিক শক্তির একটি অংশ তাপে রূপান্তরিত হয়।",
          "এই কারণেই resistor-এর power rating থাকে, যেমন one quarter watt বা half watt।",
          "যদি resistor-এর উপর তার rating-এর চেয়ে বেশি power পড়ে, তাহলে সেটি অতিরিক্ত গরম হতে পারে বা নষ্ট হতে পারে।",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "অনেক শিক্ষার্থী মনে করে resistance শুধু কারেন্ট বদলায়, আর কিছু করে না।",
          "কিন্তু বাস্তবে একটি resistor একই সঙ্গে current limit করতে পারে, voltage drop তৈরি করতে পারে, এবং heat release করতে পারে।",
          "আরেকটি common mistake হলো শুধু ohm value দেখে resistor বেছে নেওয়া, কিন্তু power rating উপেক্ষা করা।",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "চলুন মূল ধারণাগুলো আবার দেখি।",
          "রেজিস্টর কারেন্ট প্রবাহে বাধা দেয়।",
          "এটি কারেন্ট নিয়ন্ত্রণ করে, voltage drop তৈরি করে, sensitive component-কে সুরক্ষা দেয়, এবং শক্তির একটি অংশকে তাপে রূপান্তর করে।",
          "এই কারণেই resistor ইলেকট্রনিক্সের সবচেয়ে basic এবং সবচেয়ে useful component-গুলোর একটি।",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "পরের লেসনগুলোতে আমরা এই resistor ধারণাকে আরও practical circuit situation-এ ব্যবহার করব এবং দেখব resistor value কীভাবে circuit behavior বদলায়।",
          "এই লেসনটি ভালোভাবে বুঝতে পারলে পরের অনেক electronics concept শেখা আরও সহজ হয়ে যাবে।",
        ]}
      />
    </div>
  );
}
