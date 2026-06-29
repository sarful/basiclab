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
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">[{label}]</p>;
}

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy Script Note English
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          What is a Multimeter
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly version for recording the first practical lesson.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is very practical.</p>
        <p>Students should understand what a multimeter is, what its main parts do, and why the selected mode matters.</p>
        <p>They should leave this lesson with one strong safety habit.</p>
        <p>Always match the dial, the jack, and the probe placement to the job.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are starting practical measurement basics.</p>
        <p>And the first tool we need to know is the multimeter.</p>
        <PauseCue label="Short Pause" />
        <p>A multimeter is a measuring tool used in electrical and electronics work.</p>
        <p>It can check several things with one device, such as voltage, current, resistance, and continuity.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Why Beginners Need It" cue="Teach Slowly">
        <p>Without a meter, beginners often guess.</p>
        <p>They guess whether power is present, whether a battery is weak, or whether a wire is broken.</p>
        <p>A multimeter helps replace guessing with measurement.</p>
        <PauseCue label="Emphasize" />
        <p>That is why this tool is so important.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Main Parts" cue="Point to Meter">
        <p>Now let us look at the basic parts.</p>
        <p>The display shows the reading.</p>
        <p>The rotary dial selects the job.</p>
        <p>The black lead usually goes in the COM jack.</p>
        <p>The red lead may stay in the voltage jack, or move to the current jack, depending on the measurement.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Four Common Jobs" cue="List Clearly">
        <p>First, voltage mode checks electrical push.</p>
        <p>Second, current mode checks electrical flow.</p>
        <p>Third, resistance mode checks how much a component resists current flow.</p>
        <p>Fourth, continuity mode checks whether a path is complete.</p>
        <PauseCue label="Short Pause" />
        <p>Same tool, but very different jobs.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: The Big Beginner Warning" cue="Safety">
        <p>Here is the most important warning in this lesson.</p>
        <PauseCue label="Slow Down" />
        <p>Do not treat every mode the same.</p>
        <p>Voltage and current are not measured in the same way.</p>
        <p>Resistance and continuity are checked with power off.</p>
        <p>And you should not leave the red lead in the current jack when you switch back to a voltage test.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Practical Mindset" cue="Connect to Real Work">
        <p>Think of the multimeter like a question tool.</p>
        <p>You ask the circuit one clear question at a time.</p>
        <p>Is voltage present?</p>
        <p>Is current flowing?</p>
        <p>Is this resistor about the right value?</p>
        <p>Is this wire open or complete?</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Recap" cue="Review">
        <p>Let us quickly review.</p>
        <p>A multimeter is a multi-function measuring tool.</p>
        <p>The dial changes the job.</p>
        <p>The black lead usually stays in COM.</p>
        <p>The red lead position depends on what you are measuring.</p>
        <p>And the safe habit is to verify the setup before you touch the circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Closing" cue="End">
        <p>So now you know what a multimeter is and why it matters.</p>
        <PauseCue label="Final Emphasis" />
        <p>In the next lesson, we will begin using this tool for the first actual job: measuring voltage.</p>
      </ScriptBlock>
    </div>
  );
}
