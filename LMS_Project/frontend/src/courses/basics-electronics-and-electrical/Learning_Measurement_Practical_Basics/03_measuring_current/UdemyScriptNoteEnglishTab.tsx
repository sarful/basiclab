"use client";

import type { ReactNode } from "react";

function ScriptBlock({
  title,
  cue,
  children,
}: {
  title: string;
  cue?: string;
  children: ReactNode;
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

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy Script Note English
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Measuring Current
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly narration for the next practical multimeter
          skill: measuring current safely in series.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>This lesson is about building the correct current-measurement habit.</p>
        <p>Students should understand that current is measured in series, not across the source.</p>
        <p>They should also remember three setup rules.</p>
        <p>The black lead stays in COM.</p>
        <p>Small current uses the V ohm milliamp jack.</p>
        <p>Higher current may require the dedicated 10A jack and 10A range.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In the previous lesson, we learned how to measure voltage.</p>
        <p>Now we are moving to the next practical job.</p>
        <p>That job is measuring current.</p>
        <PauseCue label="Short Pause" />
        <p>
          Measuring current means checking how much electrical flow is moving
          through a circuit path.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: The Main Idea" cue="Teach Slowly">
        <p>Here is the most important idea in this lesson.</p>
        <p>Current must flow through the meter.</p>
        <p>That means the meter cannot be used like a voltage test.</p>
        <p>You do not place it across the source.</p>
        <p>You open the path and insert the meter in series.</p>
        <PauseCue label="Emphasize" />
        <p>Current is measured in series, not across the source.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Before touching the circuit, check the lead positions.</p>
        <p>The black lead stays in COM.</p>
        <p>For small current tests, the red lead stays in the V ohm milliamp jack.</p>
        <p>For higher current tests, the red lead may need to move to the 10A jack.</p>
        <p>That decision depends on the expected current range.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Family and Range" cue="Dial Check">
        <p>Next, choose the correct family on the dial.</p>
        <p>In this lesson, the family is DCA because the scenarios are DC current tests.</p>
        <p>A small sensor loop may use a 20 milliamp or 200 milliamp range.</p>
        <p>A larger load may require the 10A range.</p>
        <PauseCue label="Slow Down" />
        <p>The expected current decides both the dial range and the red jack choice.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Series Placement" cue="Open the Circuit">
        <p>Now let us focus on the path itself.</p>
        <p>To measure current, we create an open gap in the circuit path.</p>
        <p>Then we bridge that gap with the meter leads.</p>
        <p>The red probe usually goes on the source side.</p>
        <p>The black probe usually goes on the load side.</p>
        <p>That way, current passes through the meter before reaching the load.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Reading the Display" cue="Point to LCD">
        <p>When the setup is correct, the display shows the current reading.</p>
        <p>A small sensor loop may read around 18.5 milliamps.</p>
        <p>A moderate DC load may read around 160 milliamps.</p>
        <p>A high-current test may read around 8.40 amps.</p>
        <p>If the probes are reversed, the reading may become negative.</p>
        <p>That negative sign tells us the current direction reference is reversed.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Beginner Mistakes" cue="Safety">
        <p>Let us slow down and look at the common mistakes.</p>
        <PauseCue />
        <p>Do not measure current the same way you measure voltage.</p>
        <p>Do not leave the red lead in the small-current jack for a test that requires 10A.</p>
        <p>Do not leave the red lead in the 10A jack after the test is over.</p>
        <p>And do not forget to open the path, because current must pass through the meter.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Practical Mindset" cue="Real Work">
        <p>Think of current measurement as asking one clear question.</p>
        <p>How much flow is really passing through this path?</p>
        <p>Is the load drawing the amount of current I expected?</p>
        <p>Am I using the correct jack and range for this job?</p>
        <p>Good troubleshooting starts with these careful questions.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>Let us review the core lesson.</p>
        <p>Current tells us the amount of electrical flow.</p>
        <p>Current is measured in series.</p>
        <p>The black lead stays in COM.</p>
        <p>Small current may use the V ohm milliamp jack.</p>
        <p>Higher current may require the 10A jack and 10A range.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So now you know the next practical multimeter skill.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Open the path, insert the meter in series, and match the jack and
          range to the expected current.
        </p>
        <p>
          In the next lessons, we will keep building measurement confidence one
          practical step at a time.
        </p>
      </ScriptBlock>
    </div>
  );
}
