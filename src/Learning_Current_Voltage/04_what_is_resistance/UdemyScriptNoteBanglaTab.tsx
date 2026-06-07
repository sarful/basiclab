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
          Udemy Script Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Resistance কী
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly style-এ লেখা।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব simple.</p>
        <p>Student-রা যেন সহজ ভাষায় বুঝতে পারে resistance কী।</p>
        <p>তারা যেন জানে resistance current flow-এর বিপরীত বাধা।</p>
        <p>আর তারা যেন এটাও বুঝতে পারে, voltage একই থাকলে resistance বাড়লে current সাধারণত কমে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা একটি খুব important beginner question-এর answer শিখব.</p>
        <p>Resistance কী?</p>
        <PauseCue label="Short Pause" />
        <p>তুমি যদি electronics-এ একেবারে নতুন হও, তাতেও কোনো সমস্যা নেই.</p>
        <p>আমরা এটি simple, practical, আর easy way-তে শিখব.</p>
        <EmphasisLine>
          একদম short sentence-এ বললে, resistance হলো current flow-এর বিপরীত বাধা।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন এই idea-টা আরও সহজ করি.</p>
        <PauseCue />
        <p>Resistance হলো সেই part, যা charge-এর চলা কঠিন করে.</p>
        <p>এটি সাধারণত সব movement একেবারে বন্ধ করে না.</p>
        <p>এটি current কত সহজে flow করবে, সেটাকে কমিয়ে দেয়.</p>
        <EmphasisLine>
          তাই resistance মানে হলো circuit charge-এর movement-এর বিপরীতে কতটা বাধা দিচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Use the Narrow Pipe Picture" cue="Use Analogy">
        <p>এটি imagine করার সবচেয়ে সহজ picture হলো narrow pipe.</p>
        <PauseCue />
        <p>ভাবো পানি একটি পাইপের ভেতর দিয়ে যাচ্ছে.</p>
        <p>পাইপ সরু হলে পানি চলতে পারে, কিন্তু তার চলা কঠিন হয়ে যায়.</p>
        <p>Resistance-ও electric charge-এর জন্য একই ধরনের কাজ করে.</p>
        <EmphasisLine>
          Resistance বেশি মানে charge-এর path বেশি কঠিন।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Resistor" cue="Point to Resistor">
        <p>এখন simulation-এর resistor-এর দিকে তাকাও.</p>
        <PauseCue label="Resistor দেখাও" />
        <p>এই component circuit-এ current control করার জন্য বসানো হয়.</p>
        <p>এটি controlled way-তে opposition যোগ করে.</p>
        <p>এই কারণেই circuit-এ sensitive part protect করার জন্য resistor ব্যবহার করা হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Connect Resistance to Current" cue="Point to Current">
        <p>এবার current value-এর দিকে focus করো.</p>
        <PauseCue label="Current দেখাও" />
        <p>Resistance বড় হলে আর voltage একই থাকলে current ছোট হয়ে যায়.</p>
        <p>Resistance ছোট হলে current সহজে বাড়তে পারে.</p>
        <EmphasisLine>
          Resistance current তৈরি করে না। এটি ঠিক করে current কত সহজে হতে পারবে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Keep Voltage in the Picture" cue="Point to Battery">
        <p>এখন battery-এর দিকে তাকাও.</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery push দেয়, আর সেই push-ই হলো voltage.</p>
        <p>Resistor সেই path-এ দাঁড়িয়ে push-এর কাজ কঠিন করে দেয়.</p>
        <p>এই কারণেই voltage আর resistance সবসময় একসঙ্গে বুঝতে হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Use the Lesson Values" cue="Explain with Numbers">
        <p>চলো lesson-এর actual value ব্যবহার করি.</p>
        <PauseCue />
        <p>Battery দেয় 12 volt.</p>
        <p>Resistor হলো 6 ohm.</p>
        <p>এই combination-এর কারণে current হয় 2 ampere.</p>
        <p>এর মানে circuit-এ current controlled level-এ আছে, uncontrolled rush নয়.</p>
        <EmphasisLine>
          Resistance current-কে safely manage করতে সাহায্য করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Simple Formula" cue="Explain Formula">
        <p>এখানে একটি useful formula-ও আছে.</p>
        <PauseCue />
        <p>আমরা লিখি: I equals V divided by R.</p>
        <p>মানে current equals voltage divided by resistance.</p>
        <p>তাই এই lesson-এ 12 divided by 6 equals 2.</p>
        <EmphasisLine>
          এই formula দেখায়, voltage একই থাকলে resistance বাড়লে current সাধারণত কমে যায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি small LED-এর কথা ভাবো.</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>সেই LED-এর সাথে সাধারণত series-এ একটি resistor থাকে.</p>
        <p>Resistor current limit করে, যাতে LED নষ্ট না হয়ে যায়.</p>
        <p>Resistance খুব ছোট হলে বেশি current flow করতে পারে.</p>
        <p>Resistance খুব বড় হলে LED dim হয়ে যেতে পারে.</p>
        <p>এই কারণেই practical circuit-এ resistance খুব important.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে key idea-গুলো review করি.</p>
        <PauseCue />
        <p>Resistance হলো current flow-এর বিপরীত বাধা.</p>
        <p>Resistance অনেকটা narrow pipe-এর মতো.</p>
        <p>Resistance বেশি মানে charge কম সহজে move করবে.</p>
        <p>Resistance কম মানে current সহজে বাড়তে পারে.</p>
        <p>Resistance circuit-কে protect করে এবং control করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>তাই main idea খুব simple.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Resistance হলো circuit-এর সেই অংশ, যা current flow-এর বিপরীতে বাধা দেয়।
        </EmphasisLine>
        <p>Resistance বুঝতে পারলে তুমি বুঝতে পারবে circuit-এ control আর protection কেন দরকার.</p>
        <p>Next lesson-গুলোতে আমরা এই idea-এর ওপর আরও build করব.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা একটি খুব important beginner
          question-এর answer শিখব: resistance কী?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          তুমি যদি electronics-এ একেবারে নতুন হও, তাতেও কোনো সমস্যা নেই। আমরা
          এই lesson simple, practical, আর easy way-তে শিখব।
        </p>
        <PauseCue />
        <p>
          একদম short sentence-এ বললে, resistance হলো current flow-এর বিপরীত বাধা।
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Resistance হলো সেই part, যা charge-এর চলা কঠিন করে। এটি সাধারণত সব
          movement একেবারে বন্ধ করে না। এটি current কত সহজে flow করবে, সেটাকে
          কমিয়ে দেয়।
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          Resistance imagine করার সহজ উপায় হলো narrow pipe। পাইপ সরু হলে পানি
          চলতে পারে, কিন্তু তার চলা কঠিন হয়ে যায়। Circuit-এ resistance-ও
          electric charge-এর জন্য একই রকম কাজ করে।
        </p>
        <PauseCue label="Resistor দেখাও" />
        <p>
          এখন resistor-এর দিকে তাকাও। এই component circuit-এ current control
          করার জন্য বসানো হয়। এটি controlled way-তে opposition যোগ করে এবং
          sensitive part protect করতে সাহায্য করে।
        </p>
        <PauseCue label="Current দেখাও" />
        <p>
          Resistance বড় হলে আর voltage একই থাকলে current ছোট হয়ে যায়।
          Resistance ছোট হলে current সহজে বাড়তে পারে।
        </p>
        <PauseCue label="Battery দেখাও" />
        <p>
          একই সঙ্গে battery push দেয়, আর সেই push-ই হলো voltage। তাই voltage আর
          resistance সবসময় একসঙ্গে কাজ করে।
        </p>
        <PauseCue />
        <p>
          এই lesson-এ battery দেয় 12 volt, resistor হলো 6 ohm, আর current হয় 2
          ampere। এর মানে circuit-এ current controlled level-এ আছে।
        </p>
        <PauseCue label="Explain Formula" />
        <p>
          আমরা এটিকে formula দিয়েও বুঝতে পারি। I equals V divided by R। মানে
          current equals voltage divided by resistance। তাই 12 divided by 6
          equals 2।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          এখন একটি small LED-এর কথা ভাবো। সেই LED-এর সাথে সাধারণত series-এ একটি
          resistor থাকে। Resistor current limit করে, যাতে LED নষ্ট না হয়ে যায়।
          Resistance খুব ছোট হলে বেশি current flow করতে পারে। Resistance খুব বড়
          হলে LED dim হয়ে যেতে পারে।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই clear idea হলো এই: resistance হলো circuit-এর সেই অংশ, যা current
          flow-এর বিপরীতে বাধা দেয়। Thank you, and next lesson-এ আমরা এই
          foundation-এর ওপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
