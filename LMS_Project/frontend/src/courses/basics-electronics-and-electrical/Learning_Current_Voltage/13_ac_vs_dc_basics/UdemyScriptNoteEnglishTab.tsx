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

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy English Script
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          AC vs DC Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand the basic difference between AC and DC.</p>
        <p>They should know that DC moves in one steady direction.</p>
        <p>They should also know that AC changes direction again and again.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn the basics of AC and DC.</p>
        <p>This is one of the most useful beginner topics in electricity.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          DC moves one way. AC keeps changing direction.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us make the main idea very easy to picture.</p>
        <PauseCue />
        <p>DC means direct current.</p>
        <p>That means the current moves in one steady direction.</p>
        <p>AC means alternating current.</p>
        <p>That means the current changes direction again and again over time.</p>
        <EmphasisLine>
          The biggest difference is direction behavior.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This topic matters because real electrical systems use both AC and DC.</p>
        <PauseCue />
        <p>Batteries, small electronics, and many portable devices use DC.</p>
        <p>Wall outlets and large power distribution systems usually use AC.</p>
        <p>If you know the difference, later lessons become much easier to understand.</p>
        <EmphasisLine>
          You do not need to memorize everything today. Just understand what each one does.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to DC Side" />
        <p>The DC side shows a steady one-direction push.</p>
        <PauseCue label="Point to AC Side" />
        <p>The AC side shows a push that changes back and forth.</p>
        <p>That back-and-forth behavior is what makes AC different from DC.</p>
        <EmphasisLine>
          Same topic, two different current behaviors.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the DC level is 6 volts.</p>
        <PauseCue />
        <p>The AC peak value is also 6 volts.</p>
        <p>The AC frequency is 2 hertz.</p>
        <p>That means the AC waveform changes direction two times each second cycle pattern in this lesson view.</p>
        <EmphasisLine>
          DC stays steady, while AC changes direction according to frequency.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>There is one simple AC value idea that helps here.</p>
        <PauseCue />
        <p>For AC, we often compare the peak value with the RMS value.</p>
        <p>RMS means root mean square.</p>
        <p>In simple practice, RMS is peak divided by square root of 2.</p>
        <p>So if the peak is 6 volts, the RMS value is about 4.24 volts.</p>
        <EmphasisLine>
          Peak shows the highest AC push, while RMS gives a more useful working value.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a phone battery and a wall outlet.</p>
        <PauseCue label="Give Example" />
        <p>A phone battery gives DC because the current moves one main way.</p>
        <p>A wall outlet gives AC because the current keeps alternating.</p>
        <p>That is why chargers and adapters are needed between many devices and wall power.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a common beginner mistake.</p>
        <PauseCue />
        <p>Some students think AC simply means strong power and DC simply means weak power.</p>
        <p>That is not the real idea.</p>
        <p>The real difference is how the current behaves and how its direction changes.</p>
        <EmphasisLine>
          Do not reduce AC and DC to strong versus weak. Think steady versus alternating.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>DC means direct current.</p>
        <p>DC moves in one steady direction.</p>
        <p>AC means alternating current.</p>
        <p>AC changes direction again and again.</p>
        <p>Frequency tells us how fast AC changes direction.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          DC gives a steady one-way current, and AC gives a current that keeps changing direction.
        </EmphasisLine>
        <p>If you understand that picture, AC and DC will make much more sense in every later lesson.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn the basics of AC and DC. This is one of the most useful beginner topics in electricity.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          DC moves one way. AC keeps changing direction.
        </p>
        <PauseCue />
        <p>
          DC means direct current, and that means the current moves in one steady direction. AC means alternating current, and that means the current changes direction again and again over time.
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          Now look at the simulation. The DC side shows a steady one-direction push. The AC side shows a push that changes back and forth. That back-and-forth behavior is what makes AC different from DC.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the DC level is 6 volts. The AC peak value is also 6 volts, and the AC frequency is 2 hertz. That means the AC behavior changes direction according to that frequency pattern.
        </p>
        <PauseCue label="Formula" />
        <p>
          One useful AC idea is RMS. RMS means root mean square. In simple practice, RMS equals peak divided by square root of 2. So if the peak is 6 volts, the RMS value is about 4.24 volts.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a phone battery and a wall outlet. A phone battery gives DC because the current moves one main way. A wall outlet gives AC because the current keeps alternating. That is why chargers and adapters are so important.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: AC does not simply mean strong power, and DC does not simply mean weak power. The real difference is steady direction versus alternating direction.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. DC gives a steady one-way current, and AC gives a current that keeps changing direction. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
