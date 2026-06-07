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
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
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
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
      [{label}]
    </p>
  );
}

function EmphasisLine({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-slate-950">{children}</p>;
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy Script Note Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Voltage কী
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly style-এ লেখা।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব simple.</p>
        <p>Student-রা যেন সহজ ভাষায় বুঝতে পারে voltage কী।</p>
        <p>তারা যেন জানে voltage হলো circuit-এর electrical push.</p>
        <p>এবং তারা যেন এটাও বুঝতে পারে যে resistance একই থাকলে voltage বাড়লে current সাধারণত বেড়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা একটি খুব important beginner question-এর answer শিখব.</p>
        <p>Voltage কী?</p>
        <PauseCue label="Short Pause" />
        <p>তুমি যদি electronics-এ একদম নতুন হও, তাতেও কোনো সমস্যা নেই.</p>
        <p>আমরা এটি simple, practical, আর easy way-এ শিখব.</p>
        <EmphasisLine>
          একদম short sentence-এ বললে, voltage হলো সেই electrical push, যা charge-কে circuit-এর ভেতর move করাতে চায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন এই idea-টা আরও simple করি.</p>
        <PauseCue />
        <p>Voltage আর current এক জিনিস না.</p>
        <p>Voltage হলো push.</p>
        <p>Current হলো সেই push-এর কারণে হওয়া flow.</p>
        <EmphasisLine>
          তাই যখন আমরা voltage-এর কথা বলি, তখন আমরা circuit charge-কে কত জোরে সামনে ঠেলতে চাইছে, সেটার কথা বলি।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Use the Water Pressure Picture" cue="Use Analogy">
        <p>Voltage imagine করার সবচেয়ে সহজ উপায় হলো water pressure.</p>
        <PauseCue />
        <p>Pipe-এর ভেতর পানি আছে, এমনটা ভাবো.</p>
        <p>Water pressure হলো voltage-এর মতো.</p>
        <p>Pressure বেশি হলে পানি আরও জোরে সামনে যেতে চায়.</p>
        <p>Voltage-ও একইভাবে electric charge-কে push করে.</p>
        <EmphasisLine>
          Voltage বেশি মানে electrical pressure বেশি।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Battery" cue="Point to Battery">
        <p>এখন simulation-এর battery-র দিকে তাকাও.</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery হলো voltage-এর source.</p>
        <p>এটাই circuit-এ charge move করানোর push তৈরি করে.</p>
        <p>Battery voltage কম হলে push weak হয়.</p>
        <p>Battery voltage বেশি হলে push strong হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Connect Voltage to Current" cue="Point to Current">
        <p>এবার circuit-এর current value-র দিকে focus করো.</p>
        <PauseCue label="Current দেখাও" />
        <p>Voltage বাড়লে আর resistance একই থাকলে current সাধারণত বেড়ে যায়.</p>
        <p>কারণ push stronger হয়ে যায়.</p>
        <p>Stronger push সাধারণত আরও বেশি charge move করাতে পারে.</p>
        <EmphasisLine>
          Voltage আর current এক না, কিন্তু voltage current-এর ওপর strong effect ফেলে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Show Resistance Still Matters" cue="Point to Resistor">
        <p>এখন resistor-এর দিকে তাকাও.</p>
        <PauseCue label="Resistor দেখাও" />
        <p>Resistance হলো flow-এর বাধা.</p>
        <p>তাই voltage push দিলেও resistance ঠিক করে charge কত সহজে move করতে পারবে.</p>
        <p>এই কারণেই push আর blockage সব সময় একসঙ্গে বুঝতে হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Use the Lesson Values" cue="Explain with Numbers">
        <p>চলো এখন এই lesson-এর actual value ব্যবহার করি.</p>
        <PauseCue />
        <p>Battery দেয় 12 volt.</p>
        <p>Resistor হলো 6 ohm.</p>
        <p>এই combination-এর কারণে current হয় 2 ampere.</p>
        <p>এর মানে circuit-এ medium level-এর electrical push আছে, আর real current flow-ও আছে.</p>
        <EmphasisLine>
          Voltage-ই সেই কারণ, যার জন্য circuit-এ charge move করার মতো enough push তৈরি হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Simple Formula" cue="Explain Formula">
        <p>এই idea-গুলোর সাথে একটি simple formula-ও জড়িত আছে.</p>
        <PauseCue />
        <p>আমরা লিখি: I equals V divided by R.</p>
        <p>মানে current equals voltage divided by resistance.</p>
        <p>তাই এই lesson-এ 12 divided by 6 equals 2.</p>
        <EmphasisLine>
          এই formula দেখায়, resistance একই থাকলে voltage বেশি হলে current-ও সাধারণত বেশি হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি torch light বা small battery fan-এর কথা ভাবো.</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Battery fresh থাকলে voltage stronger হয়.</p>
        <p>এই stronger push light-কে ভালোভাবে জ্বালাতে বা fan-কে ভালোভাবে ঘোরাতে সাহায্য করে.</p>
        <p>Battery weak হলে voltage drop করে, আর device-ও দুর্বল হয়ে যায়.</p>
        <p>এই কারণেই voltage real battery, power supply, আর control system-এ খুব important.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে দ্রুত recap করি.</p>
        <PauseCue />
        <p>Voltage হলো electrical push.</p>
        <p>Voltage অনেকটা water pressure-এর মতো.</p>
        <p>Voltage বেশি হলে push বেশি হয়.</p>
        <p>Resistance একই থাকলে stronger push সাধারণত বেশি current তৈরি করে.</p>
        <p>Voltage আর current related, কিন্তু তারা একই জিনিস না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>তাই main idea খুব simple.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Voltage হলো সেই electrical push, যা charge-কে circuit-এর ভেতর move করাতে চায়।
        </EmphasisLine>
        <p>Voltage বুঝতে পারলে অনেক circuit behavior অনেক বেশি clear লাগবে.</p>
        <p>Next lesson-গুলোতে আমরা এই foundation-এর ওপর আরও build করব.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা একটি খুব important beginner
          question-এর answer শিখব: voltage কী?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          তুমি যদি electronics-এ একদম নতুন হও, তাতেও কোনো সমস্যা নেই. আমরা
          এই lesson simple, practical, আর easy way-এ শিখব.
        </p>
        <PauseCue />
        <p>
          একদম short sentence-এ বললে, voltage হলো সেই electrical push, যা
          charge-কে circuit-এর ভেতর move করাতে চায়.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage আর current এক জিনিস না. Voltage হলো push. Current হলো সেই
          push-এর কারণে হওয়া flow.
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          Voltage imagine করার সহজ উপায় হলো water pressure. Pipe-এর ভেতর
          pressure বেশি হলে পানি আরও জোরে move করতে চায়. Voltage-ও ঠিক
          এভাবেই electric charge-কে push করে.
        </p>
        <PauseCue label="Battery দেখাও" />
        <p>
          এখন simulation-এর battery-র দিকে তাকাও. Battery হলো voltage-এর
          source. এটাই circuit-এ push তৈরি করে.
        </p>
        <PauseCue label="Current দেখাও" />
        <p>
          Voltage বাড়লে আর resistance একই থাকলে current সাধারণত বেড়ে যায়.
          কারণ push stronger হয়ে যায়.
        </p>
        <PauseCue label="Resistor দেখাও" />
        <p>
          একই সঙ্গে resistance-ও important. Resistance charge flow-কে harder
          করে, তাই voltage আর resistance সব সময় একসঙ্গে কাজ করে.
        </p>
        <PauseCue />
        <p>
          এই lesson-এ battery দেয় 12 volt, resistor হলো 6 ohm, আর current
          হয় 2 ampere. এর মানে circuit-এ medium level-এর electrical push আছে
          এবং real current flow-ও আছে.
        </p>
        <PauseCue label="Explain Formula" />
        <p>
          আমরা এটি formula দিয়েও বুঝতে পারি. I equals V divided by R. মানে
          current equals voltage divided by resistance. তাই 12 divided by 6
          equals 2.
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          এখন একটি torch light বা small battery fan-এর কথা ভাবো. Battery
          fresh থাকলে voltage stronger হয়, তাই device-ও ভালোভাবে কাজ করে.
          Battery weak হলে voltage drop করে, আর device-ও দুর্বল হয়ে যায়.
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই একদম clear idea হলো এটা: voltage হলো সেই electrical push, যা
          charge-কে circuit-এর ভেতর move করাতে চায়. Thank you, and next
          lesson-এ আমরা এই foundation-এর ওপর আরও build করব.
        </p>
      </ScriptBlock>
    </div>
  );
}
