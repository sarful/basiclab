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
          Power in a Circuit
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand what electrical power means in plain English.</p>
        <p>They should know that power tells us how fast electrical energy is being used.</p>
        <p>They should also understand the basic formula, P equals V times I.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn what power means in a circuit.</p>
        <p>This is a very useful idea in basic electronics.</p>
        <PauseCue label="Short Pause" />
        <p>If you are a beginner, that is completely okay.</p>
        <p>We will keep this lesson simple, clear, and practical.</p>
        <EmphasisLine>
          In one short sentence, power tells us how quickly electrical energy is being used.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that idea easier.</p>
        <PauseCue />
        <p>Voltage is the push.</p>
        <p>Current is the flow.</p>
        <p>Power tells us how strongly the circuit is working.</p>
        <p>So when power is higher, the circuit is doing more electrical work each second.</p>
        <EmphasisLine>
          Power is not separate from the circuit. It comes from voltage and current working together.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Introduce the Formula" cue="Show Formula">
        <p>The most common power formula is this.</p>
        <PauseCue />
        <p>P equals V times I.</p>
        <p>That means power equals voltage multiplied by current.</p>
        <p>P is power.</p>
        <p>V is voltage.</p>
        <p>I is current.</p>
        <EmphasisLine>
          This one formula is enough to understand the basic idea of power in a circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Explain Why It Matters" cue="Connect to Use">
        <p>Power matters because it tells us how much work a device is doing.</p>
        <PauseCue />
        <p>A brighter lamp often means more power.</p>
        <p>A stronger heater often means more power.</p>
        <p>And if power becomes too high, a part may become unsafe or overloaded.</p>
        <EmphasisLine>
          This is why power is important in design, testing, troubleshooting, and real electrical work.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>Now let us use the values from this lesson.</p>
        <PauseCue />
        <p>The voltage is 12 volts.</p>
        <p>The current is 1.5 amps.</p>
        <p>So power equals 12 times 1.5.</p>
        <p>That gives us 18 watts.</p>
        <EmphasisLine>
          This is a simple example of calculating power from voltage and current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the circuit in the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery provides the voltage push.</p>
        <PauseCue label="Point to Current" />
        <p>The moving charge is current.</p>
        <PauseCue label="Point to Output" />
        <p>Power tells us how much electrical work this whole circuit is doing.</p>
        <p>So when voltage and current work together, the power level changes too.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Show What Changes Power" cue="Use Controls">
        <p>As you change the values in the simulation, notice what happens.</p>
        <PauseCue />
        <p>If voltage goes up and current stays the same, power goes up.</p>
        <p>If current goes up and voltage stays the same, power also goes up.</p>
        <p>If either one becomes smaller, power becomes smaller too.</p>
        <EmphasisLine>
          Power depends on both voltage and current, not only one of them.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>Now think about a lamp or a heater.</p>
        <PauseCue label="Give Example" />
        <p>A small night lamp uses low power.</p>
        <p>A room heater uses much higher power.</p>
        <p>That difference helps us understand how strongly each device is working and how much electrical energy it needs.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>Here is one common beginner mistake.</p>
        <PauseCue />
        <p>Some students think power and current are the same thing.</p>
        <p>They are not the same.</p>
        <p>Current is the flow of charge. Power is the rate of electrical work.</p>
        <EmphasisLine>
          Current is one part of the story. Power tells us the bigger result.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Power tells us how quickly electrical energy is being used.</p>
        <p>It is measured in watts.</p>
        <p>The main formula is P equals V times I.</p>
        <p>Higher voltage or higher current usually means higher power.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the big idea is simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Power in a circuit tells us how strongly the circuit is working and how quickly electrical energy is being used.
        </EmphasisLine>
        <p>Once you understand this, it becomes much easier to read and explain real electrical devices.</p>
        <p>In the next lessons, we will keep building on this foundation.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn what power
          means in a circuit.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are a beginner, that is completely okay. We will keep this
          lesson simple, clear, and practical.
        </p>
        <PauseCue />
        <p>
          In one short sentence, power tells us how quickly electrical energy
          is being used.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage is the push. Current is the flow. Power tells us how strongly
          the circuit is working.
        </p>
        <PauseCue label="Show Formula" />
        <p>
          The most common formula is P equals V times I. That means power
          equals voltage multiplied by current.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the voltage is 12 volts and the current is 1.5 amps.
          So power equals 12 times 1.5, which gives us 18 watts.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the circuit. The battery provides the voltage push. The
          moving charge is current. And power tells us how much electrical work
          the circuit is doing.
        </p>
        <PauseCue label="Use Controls" />
        <p>
          As we change the values in the simulation, we can see that if voltage
          goes up, power goes up. If current goes up, power also goes up.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a lamp or a heater. A small lamp uses low power, while a
          heater uses much more power. That helps us understand how strongly
          each device is working.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: current and power are not the same
          thing. Current is the flow of charge, while power is the rate of
          electrical work.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Power in a circuit tells us how
          strongly the circuit is working and how quickly electrical energy is
          being used. Thank you, and in the next lesson we will keep building
          on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
