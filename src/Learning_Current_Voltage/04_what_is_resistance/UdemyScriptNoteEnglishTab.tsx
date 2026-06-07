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
          What is Resistance
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple.</p>
        <p>Students should understand what resistance means in plain English.</p>
        <p>They should know that resistance opposes current flow.</p>
        <p>They should also understand that more resistance usually means less current when voltage stays the same.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to answer one very important beginner question.</p>
        <p>What is resistance?</p>
        <PauseCue label="Short Pause" />
        <p>If you are new to electronics, that is completely okay.</p>
        <p>We will keep this lesson clear, simple, and practical.</p>
        <EmphasisLine>
          In one short sentence, resistance is the opposition to current flow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that even easier.</p>
        <PauseCue />
        <p>Resistance is the part that makes it harder for charge to move.</p>
        <p>It does not usually stop all movement.</p>
        <p>It reduces how easily current can flow through the circuit.</p>
        <EmphasisLine>
          So when we talk about resistance, we are talking about how much the circuit pushes back against charge movement.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Use the Narrow Pipe Picture" cue="Use Analogy">
        <p>Here is the easiest picture to keep in your mind.</p>
        <PauseCue />
        <p>Think about water moving through a pipe.</p>
        <p>If the pipe becomes narrow, the water has a harder time moving through it.</p>
        <p>Resistance works in the same kind of way for electric charge.</p>
        <EmphasisLine>
          More resistance means a harder path for charge.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Resistor" cue="Point to Resistor">
        <p>Now look at the resistor in the simulation.</p>
        <PauseCue label="Point to Resistor" />
        <p>This component is placed in the circuit to control current.</p>
        <p>It adds opposition in a controlled way.</p>
        <p>That is why circuits often use resistors to protect delicate components.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Connect Resistance to Current" cue="Point to Current">
        <p>Next, look at the current value.</p>
        <PauseCue label="Point to Current" />
        <p>If resistance becomes larger and voltage stays the same, current becomes smaller.</p>
        <p>If resistance becomes smaller, current can increase more easily.</p>
        <EmphasisLine>
          Resistance does not create current. It controls how easily current can happen.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Keep Voltage in the Picture" cue="Point to Battery">
        <p>Now look at the battery.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery gives the push, which is voltage.</p>
        <p>The resistor stands in the path and makes that push work harder.</p>
        <p>This is why voltage and resistance must always be understood together.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Use the Lesson Values" cue="Explain with Numbers">
        <p>Let us use the actual values from this lesson.</p>
        <PauseCue />
        <p>The battery gives 12 volts.</p>
        <p>The resistor is 6 ohms.</p>
        <p>Because of that combination, the current becomes 2 amps.</p>
        <p>That shows us a controlled level of current, not an uncontrolled rush of charge.</p>
        <EmphasisLine>
          Resistance is helping manage the current safely.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Simple Formula" cue="Explain Formula">
        <p>There is also a very useful formula here.</p>
        <PauseCue />
        <p>We write it like this: I equals V divided by R.</p>
        <p>That means current equals voltage divided by resistance.</p>
        <p>So in this lesson, 12 divided by 6 gives us 2.</p>
        <EmphasisLine>
          This formula shows that if resistance goes up, current usually goes down, as long as voltage stays the same.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Real-World Example" cue="Connect to Real Life">
        <p>Now think about a small LED on an electronic board.</p>
        <PauseCue label="Give Example" />
        <p>That LED usually has a resistor connected in series with it.</p>
        <p>The resistor limits current so the LED does not burn out.</p>
        <p>If the resistance is too small, too much current may flow.</p>
        <p>If the resistance is too large, the LED may become dim.</p>
        <p>This is why resistance matters so much in practical circuits.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key idea.</p>
        <PauseCue />
        <p>Resistance is opposition to current flow.</p>
        <p>Resistance is like a narrow pipe.</p>
        <p>More resistance means charge moves less easily.</p>
        <p>Less resistance means current can increase more easily.</p>
        <p>Resistance helps protect and control the circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the main idea is simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Resistance is the part of the circuit that pushes back against current flow.
        </EmphasisLine>
        <p>Once you understand resistance, you can understand why circuits need control and protection.</p>
        <p>In the next lessons, we will keep building on that idea.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to answer one very
          important beginner question: what is resistance?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are new to electronics, that is completely okay. We will keep
          this lesson simple, practical, and easy to follow.
        </p>
        <PauseCue />
        <p>
          In one short sentence, resistance is the opposition to current flow.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Resistance is the part that makes it harder for charge to move. It
          does not usually stop all movement. It reduces how easily current can
          flow through the circuit.
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          A simple way to imagine resistance is a narrow pipe. If the pipe
          becomes narrow, water can still move, but it has a harder time. In a
          circuit, resistance works in the same kind of way for electric charge.
        </p>
        <PauseCue label="Point to Resistor" />
        <p>
          Now look at the resistor in the simulation. This component is placed
          in the circuit to control current. It adds opposition in a controlled
          way and helps protect sensitive parts.
        </p>
        <PauseCue label="Point to Current" />
        <p>
          When resistance becomes larger and voltage stays the same, current
          becomes smaller. When resistance becomes smaller, current can increase
          more easily.
        </p>
        <PauseCue label="Point to Battery" />
        <p>
          At the same time, the battery still gives the push, which is voltage.
          So voltage and resistance always work together.
        </p>
        <PauseCue />
        <p>
          In this lesson, the battery gives 12 volts, the resistor is 6 ohms,
          and the current becomes 2 amps. That shows us a controlled level of
          current in the circuit.
        </p>
        <PauseCue label="Explain Formula" />
        <p>
          We can also connect this with a simple formula. I equals V divided by
          R. That means current equals voltage divided by resistance. So 12
          divided by 6 gives us 2.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a small LED on an electronic board. That LED usually has
          a resistor in series with it. The resistor limits current so the LED
          does not burn out. If the resistance is too small, too much current
          may flow. If the resistance is too large, the LED may become dim.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Resistance is the part of the
          circuit that pushes back against current flow. Thank you, and in the
          next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
