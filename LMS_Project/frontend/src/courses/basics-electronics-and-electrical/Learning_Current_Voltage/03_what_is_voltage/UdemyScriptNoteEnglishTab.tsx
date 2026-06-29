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
          Udemy Script Note English
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          What is Voltage
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is very simple.</p>
        <p>Students should understand what voltage means in plain English.</p>
        <p>They should know that voltage is the electrical push in a circuit.</p>
        <p>They should also understand that more voltage usually creates stronger current when resistance stays the same.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to answer one important beginner question.</p>
        <p>What is voltage?</p>
        <PauseCue label="Short Pause" />
        <p>If you are new to electronics, that is completely fine.</p>
        <p>We will keep this clear, simple, and practical.</p>
        <EmphasisLine>
          In one short sentence, voltage is the electrical push that tries to move charge through a circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that idea even easier.</p>
        <PauseCue />
        <p>Voltage is not the same thing as current.</p>
        <p>Voltage is the push.</p>
        <p>Current is the flow that happens because of that push.</p>
        <EmphasisLine>
          So when we talk about voltage, we are talking about how strongly the circuit is trying to move charge.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Use the Water Pressure Picture" cue="Use Analogy">
        <p>Here is the easiest way to imagine voltage.</p>
        <PauseCue />
        <p>Think about water inside a pipe.</p>
        <p>Water pressure is like voltage.</p>
        <p>If the pressure becomes stronger, the water wants to move harder.</p>
        <p>Voltage works in the same kind of way for electric charge.</p>
        <EmphasisLine>
          More voltage means stronger electrical pressure.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Battery" cue="Point to Battery">
        <p>Now look at the battery in the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery is the source of voltage.</p>
        <p>It creates the push that tries to move charge through the circuit.</p>
        <p>If the battery voltage is low, the push is weak.</p>
        <p>If the battery voltage is high, the push is strong.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Connect Voltage to Current" cue="Point to Current">
        <p>Next, look at the current value in the circuit.</p>
        <PauseCue label="Point to Current" />
        <p>When voltage increases and resistance stays the same, current usually increases too.</p>
        <p>That happens because the push becomes stronger.</p>
        <p>Stronger push usually moves more charge through the path.</p>
        <EmphasisLine>
          Voltage does not equal current, but voltage has a strong effect on current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Show Resistance Still Matters" cue="Point to Resistor">
        <p>Now look at the resistor.</p>
        <PauseCue label="Point to Resistor" />
        <p>Resistance is the part that makes flow harder.</p>
        <p>So even if voltage gives the push, resistance still controls how easily charge can move.</p>
        <p>This is why push and blockage must always be understood together.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Use the Lesson Values" cue="Explain with Numbers">
        <p>Let us use the actual values from this lesson.</p>
        <PauseCue />
        <p>The battery gives 12 volts.</p>
        <p>The resistor is 6 ohms.</p>
        <p>Because of that combination, the current becomes 2 amps.</p>
        <p>That means the circuit has a medium level of electrical push and a real flow of current.</p>
        <EmphasisLine>
          Voltage is the reason the circuit has enough push to move charge.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Simple Formula" cue="Explain Formula">
        <p>There is also a simple formula that connects these ideas.</p>
        <PauseCue />
        <p>We write it like this: I equals V divided by R.</p>
        <p>That means current equals voltage divided by resistance.</p>
        <p>So in this lesson, 12 divided by 6 gives us 2.</p>
        <EmphasisLine>
          This formula shows that more voltage usually means more current, if resistance stays the same.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Real-World Example" cue="Connect to Real Life">
        <p>Now think about a torch light or a small battery fan.</p>
        <PauseCue label="Give Example" />
        <p>If the battery is fresh, the voltage is stronger.</p>
        <p>That stronger push helps the light shine better or the fan turn more strongly.</p>
        <p>If the battery becomes weak, the voltage drops and the device becomes weaker.</p>
        <p>This is why voltage matters so much in real batteries, power supplies, and control systems.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us quickly review.</p>
        <PauseCue />
        <p>Voltage is the electrical push.</p>
        <p>Voltage is like water pressure.</p>
        <p>More voltage means stronger push.</p>
        <p>Stronger push usually produces more current if resistance stays the same.</p>
        <p>Voltage and current are related, but they are not the same thing.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the key idea is simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Voltage is the electrical push that tries to move charge through the circuit.
        </EmphasisLine>
        <p>Once you understand voltage, the behavior of many circuits starts to make more sense.</p>
        <p>In the next lessons, we will keep building on this foundation.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to answer one very
          important beginner question: what is voltage?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are new to electronics, that is completely okay. We will keep
          this lesson simple, practical, and easy to follow.
        </p>
        <PauseCue />
        <p>
          In one short sentence, voltage is the electrical push that tries to
          move charge through a circuit.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage is not the same thing as current. Voltage is the push.
          Current is the flow that happens because of that push.
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          A simple way to imagine voltage is water pressure in a pipe. If the
          pressure becomes stronger, the water wants to move harder. Voltage
          works in the same way for electric charge.
        </p>
        <PauseCue label="Point to Battery" />
        <p>
          Now look at the battery in the simulation. The battery is the source
          of voltage. It creates the push that tries to move charge through the
          circuit.
        </p>
        <PauseCue label="Point to Current" />
        <p>
          When voltage increases and resistance stays the same, current usually
          increases too. That happens because the push becomes stronger.
        </p>
        <PauseCue label="Point to Resistor" />
        <p>
          At the same time, resistance still matters. Resistance makes charge
          flow harder, so voltage and resistance always work together.
        </p>
        <PauseCue />
        <p>
          In this lesson, the battery gives 12 volts, the resistor is 6 ohms,
          and the current becomes 2 amps. That shows us a medium level of
          electrical push with real current flowing in the circuit.
        </p>
        <PauseCue label="Explain Formula" />
        <p>
          We can also connect this with a simple formula. I equals V divided by
          R. That means current equals voltage divided by resistance. So 12
          divided by 6 gives us 2.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a torch light or a small battery fan. If the battery is
          fresh, the voltage is stronger, so the device usually works better.
          If the battery becomes weak, the voltage drops and the device becomes
          weaker.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Voltage is the electrical push
          that tries to move charge through the circuit. Thank you, and in the
          next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
