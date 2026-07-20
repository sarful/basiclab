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
          Continuity Test
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly narration for teaching how to check whether an
          electrical path is closed or broken using continuity mode.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>This lesson is about building the correct continuity-testing habit.</p>
        <p>Students should understand that continuity answers a simple yes-or-no question about a path.</p>
        <p>They should also remember three setup rules.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the V ohm milliamp jack.</p>
        <p>The circuit must be unpowered before the continuity check begins.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In the previous lessons, we measured voltage, current, and resistance.</p>
        <p>Now we are moving to another practical multimeter skill.</p>
        <p>That skill is the continuity test.</p>
        <PauseCue label="Short Pause" />
        <p>
          A continuity test tells us whether an electrical path is complete
          enough for current to pass from one point to another.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: The Main Idea" cue="Teach Slowly">
        <p>Here is the most important idea in this lesson.</p>
        <p>Continuity testing is a power-off test.</p>
        <p>We are not checking a live operating circuit.</p>
        <p>We are checking whether the path itself is closed or broken.</p>
        <PauseCue label="Emphasize" />
        <p>Power off first, then test for continuity.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Before touching the test points, check the lead positions.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the V ohm milliamp jack.</p>
        <p>For this lesson, we do not move the red lead to the 10A jack.</p>
        <p>Continuity is not a high-current measurement job.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Function" cue="Dial Check">
        <p>Next, choose the correct function on the dial.</p>
        <p>For this lesson, the meter uses the diode or continuity-style function.</p>
        <p>This mode is designed to tell us whether a path is electrically complete.</p>
        <PauseCue label="Slow Down" />
        <p>The function must match the job before the probes touch the circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Probe Placement" cue="Across the Path">
        <p>Now let us focus on where the probes go.</p>
        <p>Place one probe on one test point.</p>
        <p>Place the other probe on the second test point.</p>
        <p>This means the meter is checking across the path between those two points.</p>
        <p>If both probes touch the same point, we are not really testing the path.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Reading the Result" cue="Point to LCD">
        <p>When the path is closed, the meter should detect continuity.</p>
        <p>On many real meters, that means you hear a beep.</p>
        <p>The display may also show a very low resistance value.</p>
        <p>If the path is open or broken, the meter should not beep.</p>
        <p>That tells us the path is not continuous from one end to the other.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Practical Examples" cue="Real Cases">
        <p>A good wire path should show continuity.</p>
        <p>A closed switch contact should also show continuity.</p>
        <p>But a blown fuse should not show continuity.</p>
        <p>A broken wire should not show continuity either.</p>
        <p>The logic stays simple: closed path means continuity, open path means no continuity.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Mistakes" cue="Safety">
        <p>Let us slow down and look at the common mistakes.</p>
        <PauseCue />
        <p>Do not test continuity on a powered circuit.</p>
        <p>Do not leave the dial in voltage or ohms mode when the lesson asks for continuity.</p>
        <p>Do not move the red lead to the 10A jack.</p>
        <p>And do not place both probes on the same test point.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>Let us review the core lesson.</p>
        <p>Continuity tells us whether a path is closed or broken.</p>
        <p>Continuity is tested with power off.</p>
        <p>The meter uses the diode or continuity-style function.</p>
        <p>The black lead stays in COM and the red lead stays in the V ohm milliamp jack.</p>
        <p>One probe goes on each end of the path being tested.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So now you know the next practical multimeter skill.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Turn the power off, choose continuity mode, and test across the path
          with one probe on each side.
        </p>
        <p>
          In the next lessons, we will keep building practical measurement
          confidence one careful step at a time.
        </p>
      </ScriptBlock>
    </div>
  );
}
