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
          রেজিস্টরের গঠন
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          এই স্ক্রিপ্টটি এমনভাবে লেখা হয়েছে যাতে আপনি ধাপে ধাপে বুঝিয়ে বলতে
          পারেন রেজিস্টরের ভিতরে কী থাকে এবং সেই গঠন কেন real circuit
          performance-কে প্রভাবিত করে।
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "এই লেসনে আমরা বুঝব যে resistor শুধু component body-তে লেখা একটি number নয়।",
          "আমরা resistor-এর internal structure, resistive element, ceramic core, coating, আর leads-এর ভূমিকা দেখব, এবং material choice কীভাবে stability, heat, আর precision-কে প্রভাবিত করে তা বুঝব।",
          "লেসনের শেষে student-রা বুঝতে পারবে practical electronics-এ resistor construction কেন গুরুত্বপূর্ণ।",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "অনেক student resistor শিখতে গিয়ে শুরুতে শুধু ohm value-এর দিকেই তাকায়।",
          "কিন্তু বাস্তব resistor হলো একটি physical device, যার structure, material, আর thermal behavior আছে।",
          "এই structure-ই একটি বড় কারণ যে একই রকম value দেখালেও সব resistor একরকম perform করে না।",
        ]}
      />

      <PauseCue>প্রথমে একটি normal resistor দেখান, তারপর cutaway বা exploded internal view-এ যান।</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "একটি resistor একাধিক part একসাথে কাজ করে তৈরি হয়।",
          "এর ভিতরে resistive element current flow-এ opposition তৈরি করে।",
          "আর core, coating, এবং leads resistor-কে stable, safe, এবং circuit-এর জন্য useful রাখে।",
        ]}
      />

      <ScriptBlock
        title="Internal Parts"
        lines={[
          "একটি practical resistor-এ সাধারণত resistive element, supporting core, outer protective body, এবং metal leads থাকে।",
          "Resistive element-এই electrical opposition আসলে তৈরি হয়।",
          "Outer structure শুধু packaging নয়। এটি component-কে protect করে এবং electrical ও thermal performance support করে।",
        ]}
      />

      <ScriptBlock
        title="Ceramic Core"
        lines={[
          "অনেক resistor design-এ ceramic core mechanical support এবং electrical insulation দেয়।",
          "এটি resistor-কে heat আরও কার্যকরভাবে manage করতেও সাহায্য করে।",
          "তাই core শুধু filler material নয়, resistor design-এর একটি গুরুত্বপূর্ণ অংশ।",
        ]}
      />

      <PauseCue>Structure visualizer-এ ceramic core আর resistive layer point করে দেখান।</PauseCue>

      <ScriptBlock
        title="Material Comparison"
        lines={[
          "ভিন্ন resistor material ভিন্ন practical behavior তৈরি করে।",
          "Carbon composition resistor-এ noise বেশি হতে পারে এবং heat-এর কারণে resistance drift-ও বেশি হতে পারে।",
          "Metal film resistor সাধারণত বেশি precise এবং বেশি stable।",
          "Wire-wound resistor power handling এবং heat tolerance-এ শক্তিশালী, তবে এর structure inductive behavior-এর মতো additional effect introduce করতে পারে।",
        ]}
      />

      <ScriptBlock
        title="Heat and Temperature"
        lines={[
          "Resistor electrical energy-এর একটি অংশ heat-এ convert করে, তাই temperature সবসময় এই আলোচনার অংশ।",
          "Temperature বাড়লে material এবং তার temperature coefficient-এর উপর নির্ভর করে resistance shift করতে পারে।",
          "অর্থাৎ resistor behavior শুধু voltage আর current-এর গল্প নয়, thermal condition-ও এখানে গুরুত্বপূর্ণ।",
        ]}
      />

      <ScriptBlock
        title="Why Structure Affects Reliability"
        lines={[
          "যে resistor heat ভালোভাবে manage করতে পারে, সেটি সময়ের সাথে বেশি stable থাকতে পারে।",
          "দুর্বল বা কম উপযুক্ত structure electrical stress বেশি হলে drift করতে পারে, overheat করতে পারে, বা fail করতে পারে।",
          "তাই resistor structure সরাসরি long-term reliability এবং safe operation-কে প্রভাবিত করে।",
        ]}
      />

      <ScriptBlock
        title="Why This Matters for Students"
        lines={[
          "এই lesson student-দের resistor-এর physical body আর circuit-এ মাপা electrical behavior-এর মধ্যে connection তৈরি করতে সাহায্য করে।",
          "Student-রা internal structure বুঝে গেলে tolerance, heat, precision, আর material selection বুঝতেও সহজ হয়।",
          "এই কারণেই এই lesson শুধু static formula discussion না হয়ে cutaway view আর material comparison ব্যবহার করে।",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "একটি common mistake হলো ভাবা যে একই value-এর সব resistor practically identical।",
          "আরেকটি mistake হলো stability, noise, বা heat tolerance গুরুত্বপূর্ণ হলেও material type ignore করা।",
          "অনেক সময় student-রা resistor body-কে শুধু outer cover মনে করে, কিন্তু internal structure-ই performance-এ বড় প্রভাব ফেলে।",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "চলুন main idea আবার দেখি।",
          "একটি resistor-এর real internal structure থাকে, যা specific material এবং layer দিয়ে তৈরি।",
          "এই structure resistance behavior, heat handling, precision, আর reliability-কে প্রভাবিত করে।",
          "রেজিস্টরের ভিতরের গঠন বুঝতে পারলে real electronics কাজের জন্য আরও ভালো সিদ্ধান্ত নেওয়া যায়।",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "পরের lesson-গুলোতে আমরা এই foundation-এর উপর দাঁড়িয়ে resistor construction-কে practical resistor type আর circuit application-এর সাথে connect করব।",
          "Student-রা structure পরিষ্কারভাবে বুঝতে পারলে পরের resistor performance lesson-গুলো অনুসরণ করা অনেক সহজ হবে।",
        ]}
      />
    </div>
  );
}
