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
          Measuring Resistance
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly narration for learning how to measure
          resistance safely with the ohms family.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>This lesson is about building the correct resistance-measurement habit.</p>
        <p>Students should understand that resistance is measured with power off.</p>
        <p>They should also remember three setup rules.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the V ohm milliamp jack.</p>
        <p>The dial must be set to the ohms family, and the probes must go across the resistor.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In the previous lessons, we practiced voltage and current measurement.</p>
        <p>Now we are moving to another important meter job.</p>
        <p>That job is measuring resistance.</p>
        <PauseCue label="Short Pause" />
        <p>
          Measuring resistance means checking how strongly a component opposes
          current flow.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: The Main Idea" cue="Teach Slowly">
        <p>Here is the most important idea in this lesson.</p>
        <p>Resistance is measured with power off.</p>
        <p>The meter uses its own internal test method.</p>
        <p>So we do not combine ohms measurement with a live powered circuit.</p>
        <PauseCue label="Emphasize" />
        <p>Power off first, then measure resistance.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Before touching the component, check the lead positions.</p>
        <p>The black lead stays in COM.</p>
        <p>The red lead stays in the V ohm milliamp jack.</p>
        <p>Do not move the red lead to the 10A jack for a resistance check.</p>
        <p>That jack is for high current, not for ohms measurement.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Family and Range" cue="Dial Check">
        <p>Next, choose the correct family on the dial.</p>
        <p>For this lesson, the family is the ohms family, shown by the omega symbol.</p>
        <p>A 220 ohm or 680 ohm resistor fits well in a lower ohms range.</p>
        <p>A 2.2 kilo-ohm resistor needs a higher range, such as 20k.</p>
        <PauseCue label="Slow Down" />
        <p>The expected resistor value helps you choose the best ohms range.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Probe Placement" cue="Across the Resistor">
        <p>Now let us focus on the resistor itself.</p>
        <p>To measure resistance correctly, place one probe on each resistor terminal.</p>
        <p>This means the meter is measuring across the component.</p>
        <p>If both probes are on the same side, the reading is not meaningful for this lesson.</p>
        <p>The meter must bridge both resistor leads to show the correct value.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Reading the Display" cue="Point to LCD">
        <p>When the setup is correct, the display shows the resistor value.</p>
        <p>A low-value resistor may show around 220 ohms.</p>
        <p>Another resistor may show around 680 ohms.</p>
        <p>A larger resistor may show around 2.20 kilo-ohms.</p>
        <p>The reading depends on both the real resistor value and the selected ohms range.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Beginner Mistakes" cue="Safety">
        <p>Let us slow down and look at the common mistakes.</p>
        <PauseCue />
        <p>Do not measure resistance on a live powered circuit.</p>
        <p>Do not leave the dial in voltage or current mode.</p>
        <p>Do not use the 10A jack for an ohms test.</p>
        <p>And do not leave both probes on the same side of the resistor.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Practical Mindset" cue="Real Work">
        <p>Think of resistance measurement as asking one clear question.</p>
        <p>How much does this component resist current flow?</p>
        <p>Is this resistor close to the value I expect?</p>
        <p>Did I choose the correct range and place the probes properly?</p>
        <p>Good troubleshooting starts with these simple, careful checks.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>Let us review the core lesson.</p>
        <p>Resistance tells us how strongly a component opposes current flow.</p>
        <p>Resistance is measured with power off.</p>
        <p>The meter must be in the ohms family.</p>
        <p>The black lead stays in COM and the red lead stays in the V ohm milliamp jack.</p>
        <p>One probe goes on each resistor terminal.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So now you know the next practical multimeter skill.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Turn power off, choose the ohms family, and measure across the
          resistor with one probe on each side.
        </p>
        <p>
          In the next lessons, we will keep building practical measurement
          confidence step by step.
        </p>
      </ScriptBlock>
    </div>
  );
}
