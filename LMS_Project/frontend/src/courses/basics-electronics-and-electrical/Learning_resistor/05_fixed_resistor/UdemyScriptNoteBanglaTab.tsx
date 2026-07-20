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
          ফিক্সড রেজিস্টর
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই স্ক্রিপ্টটি এমনভাবে লেখা হয়েছে যাতে আপনি সহজভাবে বোঝাতে পারেন
          fixed resistor কী, স্থির resistance কেন গুরুত্বপূর্ণ, এবং কীভাবে
          value, tolerance, আর power rating দেখে সঠিক resistor নির্বাচন করতে হয়।
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "এই lesson-এ আমরা বুঝব যে fixed resistor হলো এমন একটি component যা circuit-এ একটি স্থির resistance value দেওয়ার জন্য তৈরি করা হয়।",
          "আমরা resistance value, tolerance, আর power rating-কে real circuit behavior-এর সঙ্গে connect করব, এবং carbon composition, metal film, আর wire-wound-এর মতো common fixed resistor type compare করব।",
          "Lesson শেষে student-রা বুঝতে পারবে circuit-এর বাস্তব কাজ অনুযায়ী fixed resistor কীভাবে বেছে নিতে হয়।",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "একটি fixed resistor দেখতে খুব simple মনে হতে পারে, কিন্তু practical electronics-এ এর ভূমিকা খুবই গুরুত্বপূর্ণ।",
          "এটি current control করতে সাহায্য করে, voltage drop তৈরি করে, operating condition set করে, এবং অন্য component-কে protect করে।",
          "এই কারণেই fixed resistor বোঝা electronics training-এর সবচেয়ে গুরুত্বপূর্ণ foundation-গুলোর একটি।",
        ]}
      />

      <PauseCue>শুরুতে একটি resistor দেখিয়ে বোঝান যে normal operation-এ এর value স্থির থাকার কথা।</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "এই lesson-এর মূল ধারণা হলো stability।",
          "Fixed resistor তখন ব্যবহার করা হয় যখন adjustable value নয়, একটি নির্দিষ্ট intended resistance value দরকার হয়।",
          "এই stable value circuit-কে predictable এবং repeatable behavior দেয়।",
        ]}
      />

      <ScriptBlock
        title="What a Fixed Resistor Does"
        lines={[
          "একটি fixed resistor current flow-কে controlled way-তে oppose করে।",
          "Circuit-এর ধরন অনুযায়ী এটি current limiting, voltage division, bias control, বা protection-এর জন্য ব্যবহার হতে পারে।",
          "এটি basic component হলেও circuit-এর অনেক বড় behavior এর সঠিক কাজের উপর নির্ভর করে।",
        ]}
      />

      <ScriptBlock
        title="Resistance Value"
        lines={[
          "Student-রা প্রথমে যে জিনিসটি দেখে তা হলো resistance value।",
          "Resistance বেশি হলে সাধারণত current আরও বেশি কমে যায়, আর resistance কম হলে current বেশি flow করতে পারে।",
          "এই কারণেই resistor value অবশ্যই circuit-এর কাজের সঙ্গে match করতে হবে, সেটা LED protection, signal shaping, বা voltage control যাই হোক না কেন।",
        ]}
      />

      <PauseCue>Resistance selector ব্যবহার করে দেখান ohm value বদলালে current behavior কীভাবে বদলায়।</PauseCue>

      <ScriptBlock
        title="Tolerance"
        lines={[
          "Resistor-এর উপর লেখা resistance value হলো target value, কিন্তু বাস্তব component কখনও একেবারে perfectly exact হয় না।",
          "Tolerance বলে actual resistor value label value থেকে কতটা vary করতে পারে।",
          "Basic circuit-এ wider tolerance acceptable হতে পারে, কিন্তু measurement বা sensing circuit-এ tighter tolerance অনেক বেশি গুরুত্বপূর্ণ হয়ে যায়।",
        ]}
      />

      <ScriptBlock
        title="Power Rating"
        lines={[
          "Resistor শুধু current control করে না, electrical energy-কে heat-এও convert করে।",
          "এই কারণেই power rating খুব গুরুত্বপূর্ণ।",
          "যদি একটি resistor-কে তার design limit-এর চেয়ে বেশি power dissipate করতে বাধ্য করা হয়, তাহলে এটি overheat করতে পারে, drift করতে পারে, বা fail করতে পারে।",
          "ভালো resistor selection মানে expected load safely survive করতে পারবে কি না সেটিও check করা।",
        ]}
      />

      <ScriptBlock
        title="Common Fixed Resistor Types"
        lines={[
          "সব fixed resistor একইভাবে তৈরি হয় না।",
          "Carbon composition resistor simple এবং low-cost, কিন্তু সাধারণত precision কম এবং noise বেশি।",
          "Metal film resistor বেশি accurate, বেশি stable, এবং quieter, তাই precise circuit-এর জন্য এটি খুব ভালো choice।",
          "Wire-wound resistor বিশেষভাবে useful যখন বেশি power handling এবং better heat dissipation দরকার হয়।",
        ]}
      />

      <PauseCue>Carbon, metal film, আর wire-wound-এর মধ্যে switch করে তাদের strength compare করুন।</PauseCue>

      <ScriptBlock
        title="How to Choose the Right One"
        lines={[
          "যদি circuit simple হয় এবং cost সবচেয়ে গুরুত্বপূর্ণ হয়, তাহলে basic low-cost resistor যথেষ্ট হতে পারে।",
          "যদি accuracy আর low noise বেশি গুরুত্বপূর্ণ হয়, তাহলে metal film সাধারণত better choice।",
          "যদি heat আর power handling সবচেয়ে গুরুত্বপূর্ণ হয়, তাহলে wire-wound প্রায়ই stronger option।",
          "তাই সঠিক resistor শুধু value দেখে বেছে নেওয়া হয় না। Value, tolerance, power rating, আর application fit একসঙ্গে বিবেচনা করতে হয়।",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "একটি common mistake হলো শুধু ohm value দেখে resistor select করা।",
          "আরেকটি mistake হলো tolerance আর power rating ignore করা, যদিও এই দুটো circuit reliability-কে খুব strongly affect করে।",
          "অনেক student আবার ধরে নেয় যে একই label value হলে সব fixed resistor একইভাবে behave করবে, যা বাস্তবে সত্য নয়।",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "চলুন key idea আবার দেখি।",
          "A fixed resistor provides one stable resistance value in a circuit.",
          "এর selection depends on resistance value, tolerance, and power rating.",
          "Carbon composition, metal film, আর wire-wound resistor ভিন্ন practical need serve করে।",
          "সেরা fixed resistor হলো যেটি circuit-এর real job safely match করে।",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "পরের lesson-গুলোতে student-রা resistor behavior-কে আরও advanced circuit design decision-এর সঙ্গে connect করবে।",
          "Fixed resistor fundamentals পরিষ্কার হলে color code, power rating, আর resistor circuit-এর মতো পরের topic-গুলো অনেক সহজ হয়ে যায়।",
        ]}
      />
    </div>
  );
}
