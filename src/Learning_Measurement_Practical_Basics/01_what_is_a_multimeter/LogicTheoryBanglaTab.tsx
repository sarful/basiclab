"use client";

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300" />
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
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Logic & Theory Bangla
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Multimeter কী?
        </h1>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-7 text-slate-800">
          Multimeter হলো এমন একটি electrical measuring tool, যেটা দিয়ে একই যন্ত্রে voltage, current, resistance আর continuity check করা যায়।
        </p>
      </section>

      <SectionCard title="সহজ ভাষায় Multimeter" eyebrow="মূল ধারণা">
        <p>Multimeter মানে multi-purpose meter.</p>
        <p>একই meter বিভিন্ন কাজ করতে পারে, কিন্তু সব কাজ একভাবে করে না।</p>
        <p>তাই beginner-এর প্রথম কাজ হলো meter-এর dial কোন mode-এ আছে, red lead কোন jack-এ আছে, আর probes কোথায় ধরতে হবে সেটা বোঝা।</p>
      </SectionCard>

      <SectionCard title="কেন এটা দরকার?" eyebrow="কেন গুরুত্বপূর্ণ">
        <p>Meter ছাড়া beginner অনেক সময় শুধু আন্দাজ করে।</p>
        <p>কিন্তু practical electronics-এ guess করা ভালো অভ্যাস না।</p>
        <p>Multimeter বলে দিতে পারে battery-তে voltage আছে কি না, circuit-এ current flow হচ্ছে কি না, resistor-এর value ঠিক আছে কি না, wire complete আছে কি না।</p>
      </SectionCard>

      <SectionCard title="Main parts" eyebrow="যন্ত্রের অংশ">
        <p><strong>Display:</strong> reading দেখায়।</p>
        <p><strong>Rotary dial:</strong> কোন কাজ করতে চান সেটা select করে।</p>
        <p><strong>COM jack:</strong> সাধারণত black lead এখানে থাকে।</p>
        <p><strong>V / ohm jack:</strong> voltage, resistance, continuity-র জন্য red lead সাধারণত এখানে থাকে।</p>
        <p><strong>Current jack:</strong> current measure করার সময় red lead এখানে নিতে হয়।</p>
      </SectionCard>

      <SectionCard title="চারটা beginner measurement" eyebrow="Practical Use">
        <p><strong>Voltage:</strong> দুই point-এর মধ্যে electrical push কত আছে।</p>
        <p><strong>Current:</strong> path-এর ভিতর দিয়ে flow কত যাচ্ছে।</p>
        <p><strong>Resistance:</strong> component current flow-কে কত resist করছে।</p>
        <p><strong>Continuity:</strong> path complete নাকি open সেটা check করে।</p>
      </SectionCard>

      <SectionCard title="সবচেয়ে জরুরি safety rules" eyebrow="Safety">
        <p>Black lead বেশিরভাগ সময় COM-এ থাকবে।</p>
        <p>Current measure না করলে red lead current jack-এ রেখে দেবেন না।</p>
        <p>Resistance বা continuity powered circuit-এ measure করবেন না।</p>
        <p>যদি doubt থাকে, measure করার আগে dial, jack, probe placement আবার দেখে নিন।</p>
      </SectionCard>

      <SectionCard title="ছোট recap" eyebrow="Review">
        <ul className="list-disc space-y-2 pl-5">
          <li>Multimeter একাধিক measurement করার tool।</li>
          <li>Mode change করলে meter-এর কাজও change হয়।</li>
          <li>Voltage আর current একভাবে measure করা হয় না।</li>
          <li>Resistance আর continuity power off অবস্থায় measure করতে হয়।</li>
        </ul>
      </SectionCard>
    </div>
  );
}
