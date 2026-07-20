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
          রেজিস্টরের ধরন
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই স্ক্রিপ্টটি এমনভাবে লেখা হয়েছে যাতে আপনি সহজ ভাষায় বোঝাতে
          পারেন resistor fixed, variable, আর sensor-based type-এ কীভাবে ভাগ
          হয়, এবং কোন পরিস্থিতিতে কোন resistor type ব্যবহার করা বেশি যুক্তিযুক্ত।
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "এই lesson-এ আমরা বুঝব যে সব resistor একই উদ্দেশ্যে তৈরি হয় না।",
          "আমরা resistor-কে fixed, variable, আর sensor category-তে ভাগ করব, এবং carbon composition, metal film, wire-wound, potentiometer, thermistor, আর LDR-এর মতো উদাহরণ compare করব।",
          "Lesson শেষে student-রা বুঝতে পারবে resistor type নির্বাচন আসলে circuit-এর কাজের ধরন অনুযায়ী করা হয়।",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "অনেক beginner resistor বলতে শুধু একটি ছোট component কল্পনা করে।",
          "কিন্তু practical electronics-এ resistor-এর অনেক family আছে, এবং প্রতিটি family আলাদা কাজের জন্য বেশি উপযোগী।",
          "তাই advanced circuit-এ যাওয়ার আগে resistor types বোঝা খুব গুরুত্বপূর্ণ।",
        ]}
      />

      <PauseCue>শুরুতে fixed, variable, আর sensor এই তিনটি category আলাদা করে দেখান।</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "এই lesson-এর সবচেয়ে গুরুত্বপূর্ণ ধারণা হলো classification।",
          "Basic level-এ resistor-কে fixed resistor, variable resistor, আর sensor resistor এই তিন ভাগে ভাবলে বিষয়টি খুব সহজ হয়ে যায়।",
          "একবার এই তিনটি group পরিষ্কার হলে আলাদা resistor type মনে রাখা অনেক সহজ হয়।",
        ]}
      />

      <ScriptBlock
        title="Fixed Resistors"
        lines={[
          "Fixed resistor ব্যবহার করা হয় যখন circuit-এ একটি নির্দিষ্ট resistance value স্থিরভাবে দরকার হয়।",
          "Carbon composition resistor কম খরচের হলেও সাধারণত কম precise এবং বেশি noisy হতে পারে।",
          "Metal film resistor বেশি accurate এবং stable, তাই measurement বা signal-related কাজের জন্য এটি প্রায়ই ভালো choice।",
          "Wire-wound resistor বেশি power handle করতে পারে, তাই high-power application-এ এটি উপযোগী।",
        ]}
      />

      <ScriptBlock
        title="Variable Resistors"
        lines={[
          "Variable resistor-এর resistance প্রয়োজন অনুযায়ী adjust করা যায়।",
          "এর সবচেয়ে পরিচিত উদাহরণ হলো potentiometer।",
          "Volume control, brightness adjustment, বা calibration setting-এর মতো manual control দরকার হলে potentiometer ব্যবহার করা হয়।",
        ]}
      />

      <ScriptBlock
        title="Sensor Resistors"
        lines={[
          "কিছু resistor পরিবেশের পরিবর্তনের সাথে resistance বদলায়।",
          "Thermistor temperature-এর সাথে resistance change করে, তাই sensing এবং protection-এ এটি কাজে লাগে।",
          "LDR light-এর সাথে resistance change করে, তাই automatic lighting বা basic light detection circuit-এ এটি দরকারি।",
          "এই ধরনের resistor শুধু current limit করে না, environment-এর change-কে electrical signal-এ রূপান্তর করতেও সাহায্য করে।",
        ]}
      />

      <PauseCue>Thermistor আর LDR দেখিয়ে বোঝান কীভাবে environment বদলালে resistance-ও বদলায়।</PauseCue>

      <ScriptBlock
        title="How to Compare Types"
        lines={[
          "কোন resistor type ভালো হবে, তা শুধু component-এর উপর লেখা value দেখে ঠিক করা যায় না।",
          "আমাদের accuracy, power handling, cost, response behavior, stability, আর best application-ও compare করতে হয়।",
          "এই কারণেই simulator students-দের শুধু নাম মুখস্থ না করিয়ে practical priority দিয়ে resistor type compare করতে শেখায়।",
        ]}
      />

      <ScriptBlock
        title="Choosing the Right Type"
        lines={[
          "Low-cost সাধারণ কাজের জন্য simple fixed resistor যথেষ্ট হতে পারে।",
          "Precision দরকার হলে metal film resistor সাধারণত বেশি ভালো choice।",
          "Heat আর power বেশি handle করতে হলে wire-wound resistor দরকার হতে পারে।",
          "Manual adjustment দরকার হলে potentiometer ব্যবহার করতে হবে।",
          "আর sensing দরকার হলে thermistor বা LDR আগে ভাবতে হবে।",
        ]}
      />

      <ScriptBlock
        title="Why One Type Is Not Best for Everything"
        lines={[
          "প্রতিটি resistor type-এর নিজস্ব strength আর limitation আছে।",
          "যে resistor খুব precise, সেটি heavy power dissipation-এর জন্য ideal নাও হতে পারে।",
          "আবার যে resistor power ভালো handle করে, সেটি physical size বা signal sensitivity-এর দিক থেকে less suitable হতে পারে।",
          "ভালো circuit design মানে application-এর জন্য সবচেয়ে মানানসই resistor type বেছে নেওয়া।",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "একটি common mistake হলো ভাবা যে সব resistor basic fixed resistor-এর মতোই behave করে।",
          "আরেকটি mistake হলো শুধু cost দেখে part নির্বাচন করা, কিন্তু accuracy, sensing behavior, বা power need বিবেচনা না করা।",
          "অনেক student ভুলে যায় যে sensor resistor আলাদা design mindset-এর অংশ, কারণ এগুলো environment-এর response অনুযায়ী কাজ করে।",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "চলুন main idea আবার দেখি।",
          "Resistor fixed, variable, বা sensor-based হতে পারে।",
          "Carbon, metal film, আর wire-wound হলো common fixed type।",
          "Potentiometer adjustable, আর thermistor ও LDR temperature ও light-এর response অনুযায়ী কাজ করে।",
          "সেরা resistor type নির্ভর করে circuit-এর কাজের উপর, শুধু resistance value-এর উপর নয়।",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "পরের lesson-গুলোতে আমরা resistor family আর practical resistor behavior আরও গভীরভাবে দেখব।",
          "Student-রা resistor types পরিষ্কারভাবে বুঝে গেলে পরে component selection অনেক সহজ এবং logical হয়ে যাবে।",
        ]}
      />
    </div>
  );
}
