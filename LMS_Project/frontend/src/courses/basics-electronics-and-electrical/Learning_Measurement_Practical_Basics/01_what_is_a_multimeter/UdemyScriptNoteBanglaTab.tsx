"use client";

function ScriptBlock({
  title,
  cue,
  children,
}: {
  title: string;
  cue?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {cue ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            {cue}
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

function PauseCue({ label = "Pause" }: { label?: string }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">[{label}]</p>;
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Udemy Script Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Multimeter কী?
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব practical.</p>
        <p>Student যেন বুঝতে পারে multimeter কী, এর main parts কী, আর mode change করলে কাজ কেন change হয়।</p>
        <p>সবচেয়ে important habit হলো: dial, jack আর probe placement মিলিয়ে তারপর measure করা।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম।</p>
        <PauseCue />
        <p>আজ আমরা practical measurement basics শুরু করছি।</p>
        <p>আর এই phase-এর প্রথম tool হলো multimeter।</p>
        <p>Multimeter হলো এমন একটি measuring tool, যেটা দিয়ে voltage, current, resistance এবং continuity check করা যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: কেন দরকার" cue="Explain">
        <p>Beginner-রা অনেক সময় circuit নিয়ে guess করে।</p>
        <p>Battery weak কি না, power আছে কি না, wire broken কি না, এগুলো শুধু দেখে সবসময় বোঝা যায় না।</p>
        <p>Multimeter guess-এর জায়গায় measurement আনে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Parts of the meter" cue="Point to Meter">
        <p>চলুন meter-এর main parts দেখি।</p>
        <p>Display reading দেখায়।</p>
        <p>Rotary dial job select করে।</p>
        <p>Black lead সাধারণত COM jack-এ থাকে।</p>
        <p>Red lead measurement type অনুযায়ী voltage jack বা current jack-এ যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: চারটা common কাজ" cue="List Clearly">
        <p>Voltage mode electrical push check করে।</p>
        <p>Current mode electrical flow check করে।</p>
        <p>Resistance mode component current flow-কে কত resist করছে সেটা check করে।</p>
        <p>Continuity mode path complete না broken সেটা check করে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: সবচেয়ে important warning" cue="Safety">
        <p>এই lesson-এর সবচেয়ে important warning হলো: সব mode একভাবে use করা যাবে না।</p>
        <PauseCue label="Emphasize" />
        <p>Voltage আর current একভাবে measure হয় না।</p>
        <p>Resistance আর continuity power off অবস্থায় measure করতে হয়।</p>
        <p>আর current jack-এ red lead রেখে voltage measure করতে যাওয়া beginner-এর common mistake।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Practical mindset" cue="Real Work">
        <p>Multimeter-কে question tool হিসেবে ভাবুন।</p>
        <p>প্রতিবার circuit-কে একটাই clear question করবেন।</p>
        <p>Voltage আছে?</p>
        <p>Current flow করছে?</p>
        <p>Resistor value ঠিক আছে?</p>
        <p>Wire complete আছে?</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Recap" cue="Review">
        <p>একবার দ্রুত recap করি।</p>
        <p>Multimeter হলো multi-function measuring tool।</p>
        <p>Dial job change করে।</p>
        <p>Black lead সাধারণত COM-এ থাকে।</p>
        <p>Red lead measurement type অনুযায়ী বদলায়।</p>
        <p>আর safe habit হলো setup verify করে তারপর measure করা।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Closing" cue="End">
        <p>এখন আপনি জানেন multimeter কী এবং কেন এটা important।</p>
        <PauseCue label="Final Emphasis" />
        <p>পরের lesson-এ আমরা multimeter দিয়ে প্রথম practical কাজ শুরু করব: measuring voltage.</p>
      </ScriptBlock>
    </div>
  );
}
