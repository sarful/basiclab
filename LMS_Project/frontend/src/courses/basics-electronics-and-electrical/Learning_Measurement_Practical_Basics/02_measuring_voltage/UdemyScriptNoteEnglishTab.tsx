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
          Measuring Voltage
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly narration for the first real multimeter task:
          checking voltage safely and correctly.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>This lesson is about building the correct beginner habit.</p>
        <p>Students should understand that voltage is measured across two points.</p>
        <p>They should also remember three setup rules.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the voltage jack.</p>
        <p>The dial family must match the source, either DCV or ACV.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In the last lesson, we learned what a multimeter is.</p>
        <p>Now we are ready for the first real measurement job.</p>
        <p>That job is measuring voltage.</p>
        <PauseCue label="Short Pause" />
        <p>
          Measuring voltage means checking the electrical push between two
          points.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: The Main Idea" cue="Teach Slowly">
        <p>Here is the most important idea in this lesson.</p>
        <p>Voltage is measured across two points.</p>
        <p>For example, across battery plus and minus.</p>
        <p>Or across V plus and ground on a DC supply.</p>
        <p>Or across live and neutral on an AC source demo.</p>
        <PauseCue label="Emphasize" />
        <p>Across two points. Not in series.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Before touching the circuit, check the lead positions.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the normal voltage jack.</p>
        <p>On this trainer, that is the V ohm milliamp jack.</p>
        <p>Do not use the 10A jack for this lesson.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Mode Selection" cue="Dial Check">
        <p>Next, choose the correct voltage family on the dial.</p>
        <p>A battery is a DC source, so use DCV.</p>
        <p>A twelve-volt supply is also DC, so again use DCV.</p>
        <p>A mains-style outlet demo is AC, so use ACV.</p>
        <PauseCue label="Slow Down" />
        <p>The source type decides the meter family.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Reading the Display" cue="Point to LCD">
        <p>When the setup is correct, the display gives the voltage reading.</p>
        <p>A healthy battery in this lesson reads about 9 volts.</p>
        <p>The DC supply reads about 12 volts.</p>
        <p>The AC demo source reads about 220 volts.</p>
        <p>
          If the DC probes are reversed, you may see a negative reading instead
          of a positive one.
        </p>
        <p>That negative sign is a polarity clue.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Common Beginner Mistakes" cue="Safety">
        <p>Let us slow down and look at the common mistakes.</p>
        <PauseCue />
        <p>Using the 10A jack for a voltage check is a wrong setup.</p>
        <p>Using current mode instead of voltage mode is also wrong.</p>
        <p>Using ACV for a battery is wrong.</p>
        <p>Using DCV for an AC outlet demo is also wrong.</p>
        <p>The meter is only helpful when the whole setup matches the job.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Practical Mindset" cue="Real Work">
        <p>Think of voltage measurement like asking one clear question.</p>
        <p>Is the source really present?</p>
        <p>How much push is available between these two points?</p>
        <p>Is the polarity what I expected?</p>
        <p>
          Good troubleshooting starts with this kind of simple and disciplined
          question.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Recap" cue="Review">
        <p>Let us review the core lesson.</p>
        <p>Voltage is measured across two points.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the V ohm milliamp jack.</p>
        <p>DC sources use DCV, and AC sources use ACV.</p>
        <p>A negative DC reading often means reversed probes.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Closing" cue="End">
        <p>So now you know the first practical multimeter skill.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Measure voltage across two points, with the correct jack and the
          correct voltage family.
        </p>
        <p>
          In the next lesson, we will continue building measurement confidence
          from this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
