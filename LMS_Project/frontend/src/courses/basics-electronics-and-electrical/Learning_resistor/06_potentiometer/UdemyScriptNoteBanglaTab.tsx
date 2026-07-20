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
          পটেনশিওমিটার
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই স্ক্রিপ্টটি এমনভাবে লেখা হয়েছে যাতে আপনি সহজভাবে বোঝাতে পারেন
          potentiometer কী, wiper কীভাবে কাজ করে, এবং কেন voltage-divider
          mode আর rheostat mode practical electronics-এ দুটোই গুরুত্বপূর্ণ।
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "এই lesson-এ আমরা বুঝব যে potentiometer শুধু আরেকটি resistor নয়। এটি এমন একটি adjustable component যা circuit-এ controllable voltage বা controllable resistance দরকার হলে ব্যবহার করা হয়।",
          "আমরা three-terminal structure, movable wiper, voltage divider mode, আর rheostat mode-কে volume control ও calibration-এর মতো real application-এর সঙ্গে connect করব।",
          "Lesson শেষে student-রা পরিষ্কারভাবে বুঝতে পারবে manual tuning দরকার হলে কেন potentiometer বেছে নেওয়া হয়।",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "অনেক student প্রথমে potentiometer দেখলে একে শুধু একটি knob বা dial মনে করে।",
          "কিন্তু সেই knob-এর পেছনে একটি গুরুত্বপূর্ণ electrical idea আছে: adjustable control।",
          "Potentiometer circuit-এর behavior change করতে দেয়, parts replace না করেই এবং circuit redesign না করেই।",
        ]}
      />

      <PauseCue>
        শুরুতে potentiometer body দেখান এবং wiper ব্যাখ্যা করার আগে তিনটি
        terminal দেখিয়ে দিন।
      </PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "এই lesson-এর মূল ধারণা হলো potentiometer হলো movable wiper-সহ একটি variable resistor।",
          "Wiper move করলে resistive path-এর ratio বদলে যায়।",
          "এই change component কীভাবে connected আছে তার উপর নির্ভর করে output voltage বা effective resistance adjust করতে পারে।",
        ]}
      />

      <ScriptBlock
        title="What the Wiper Does"
        lines={[
          "Potentiometer-এর সবচেয়ে গুরুত্বপূর্ণ moving part হলো wiper।",
          "এটি resistive track-এর উপর slide বা rotate করে।",
          "Position বদলালে total resistive path-এর কোন অংশ কতটা active থাকবে সেটি বদলে যায়।",
          "এই কারণেই potentiometer fixed resistor value-এর বদলে smooth control দেয়।",
        ]}
      />

      <ScriptBlock
        title="Voltage Divider Mode"
        lines={[
          "Voltage divider mode-এ তিনটি terminal-ই ব্যবহার করা হয়।",
          "Potentiometer input voltage নেয় এবং wiper point-এ adjustable output voltage দেয়।",
          "Wiper move করলে output voltage position ratio অনুযায়ী change করে।",
          "এই কারণেই adjustable reference voltage বা user-controlled output level দরকার হলে potentiometer useful।",
        ]}
      />

      <PauseCue>
        Voltage-divider mode-এ wiper move করে দেখান output voltage কীভাবে
        ratio change-এর সাথে সাথে বদলায়।
      </PauseCue>

      <ScriptBlock
        title="Rheostat Mode"
        lines={[
          "Rheostat mode-এ potentiometer-কে two-terminal variable resistor হিসেবে ব্যবহার করা হয়।",
          "এখানে এটি mainly adjustable output voltage দেওয়ার বদলে circuit-এর active resistance change করে।",
          "Active resistance change হলে current flow-ও বদলায়।",
          "এই mode useful যখন adjustable current control বা resistance tuning দরকার হয়।",
        ]}
      />

      <ScriptBlock
        title="Why Potentiometers Are Useful"
        lines={[
          "Potentiometer useful কারণ অনেক practical system build হওয়ার পরও tuning দরকার হয়।",
          "Volume control এর classic example।",
          "Calibration-ও খুব গুরুত্বপূর্ণ example, কারণ sensor circuit আর reference circuit-এ প্রায়ই fine adjustment দরকার হয়।",
          "এর আসল value হলো মানুষকে simple এবং intuitive way-তে electrical behavior control করার সুযোগ দেওয়া।",
        ]}
      />

      <ScriptBlock
        title="Why a Potentiometer Is Not a Fixed Resistor"
        lines={[
          "Fixed resistor বেছে নেওয়া হয় এক stable value-এর জন্য।",
          "Potentiometer বেছে নেওয়া হয় কারণ সেই value বা ratio adjustable হওয়া দরকার।",
          "এর মানে আমরা একে ordinary resistor ব্যবহারের একই কারণে ব্যবহার করি না।",
          "আমরা এটি ব্যবহার করি যখন change নিজেই design-এর একটি অংশ।",
        ]}
      />

      <PauseCue>
        Divider mode আর rheostat mode-এর মধ্যে switch করে দেখান একই component
        দুইভাবে behave করতে পারে।
      </PauseCue>

      <ScriptBlock
        title="Limitations"
        lines={[
          "Potentiometer খুব useful হলেও এটি perfect নয়।",
          "কারণ এতে moving mechanical part আছে, তাই সময়ের সঙ্গে wear হতে পারে।",
          "Heavy power load-এর জন্যও এটি সবসময় ideal নয়, especially stronger heat-handling component-এর তুলনায়।",
          "ভালো design মানে potentiometer-কে adjustability সবচেয়ে গুরুত্বপূর্ণ যেখানে, সেখানে ব্যবহার করা; heavy-duty power handling যেখানে priority, সেখানে নয়।",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "একটি common mistake হলো ভাবা potentiometer শুধু volume control-এর জন্য।",
          "আরেকটি mistake হলো ভুলে যাওয়া যে একই part voltage divider mode এবং rheostat mode দুটোতেই কাজ করতে পারে।",
          "অনেক student আবার ভাবে knob শুধু একটি number change করে, কিন্তু বাস্তবে wiper circuit-এর ভেতরে একটি electrical ratio change করে।",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "চলুন key idea আবার দেখি।",
          "A potentiometer is a three-terminal variable resistor with a movable wiper.",
          "এটি divider mode-এ voltage adjust করতে পারে, আর rheostat mode-এ resistance adjust করতে পারে।",
          "Volume control, calibration, tuning, আর adjustable setting-এ এটি useful।",
          "এর আসল strength হলো circuit behavior-এর smooth manual control।",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "পরের lesson-গুলোতে student-রা component behavior-কে practical circuit design decision-এর সঙ্গে আরও গভীরভাবে connect করবে।",
          "Potentiometer concept পরিষ্কার হলে real electronic system-এর adjustable control বোঝা অনেক সহজ হয়ে যায়।",
        ]}
      />
    </div>
  );
}
