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
          What is Current
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is very clear.</p>
        <p>Students should understand what current means in simple English.</p>
        <p>They should know that current is the actual flow of electric charge.</p>
        <p>They should also understand that voltage tends to increase current, while resistance tends to reduce it.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to answer a simple question.</p>
        <p>What is current?</p>
        <PauseCue label="Short Pause" />
        <p>If you are new to electronics, do not worry.</p>
        <p>We will keep this simple and practical.</p>
        <EmphasisLine>
          In one short sentence, current is the amount of electric charge moving through a circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that idea even easier.</p>
        <PauseCue />
        <p>Electric charge moves only when the path is complete.</p>
        <p>If more charge moves each second, the current is higher.</p>
        <p>If less charge moves each second, the current is lower.</p>
        <EmphasisLine>
          So current tells us the real flow happening in the circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Connect Current to Voltage" cue="Point to Voltage">
        <p>Now look at the voltage value in the simulation.</p>
        <PauseCue label="Point to Voltage" />
        <p>Voltage is the electrical push.</p>
        <p>If the push becomes stronger, charge usually moves more easily.</p>
        <p>That often means current goes up.</p>
        <EmphasisLine>
          Voltage does not mean current, but voltage has a strong effect on current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Connect Current to Resistance" cue="Point to Resistor">
        <p>Next, look at the resistor.</p>
        <PauseCue label="Point to Resistor" />
        <p>Resistance is the part that makes charge flow harder.</p>
        <p>If resistance becomes larger, current usually becomes smaller.</p>
        <p>This is why push and blockage must be understood together.</p>
        <EmphasisLine>
          More resistance usually means less current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Show the Current Value" cue="Point to Current">
        <p>Now let us focus on the current reading itself.</p>
        <PauseCue label="Point to Current" />
        <p>This number tells us how much charge is really moving.</p>
        <p>In this simulation, the battery gives 12 volts.</p>
        <p>The resistor is 6 ohms.</p>
        <p>Because of that combination, the current becomes 2 amps.</p>
        <EmphasisLine>
          Current is not just a number. It tells us what the circuit is actually doing.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Simple Formula" cue="Explain Formula">
        <p>There is also a very useful formula for current.</p>
        <PauseCue />
        <p>We write it like this: I equals V divided by R.</p>
        <p>That means current equals voltage divided by resistance.</p>
        <p>So in this lesson, we can say 12 divided by 6 equals 2.</p>
        <EmphasisLine>
          I equals V over R is one of the most useful ideas in beginner electronics.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Water Analogy" cue="Use Analogy">
        <p>Here is a simple way to imagine current.</p>
        <PauseCue />
        <p>Think about water moving through a pipe.</p>
        <p>The water flow is like electric current.</p>
        <p>The pump pressure is like voltage.</p>
        <p>The narrow pipe is like resistance.</p>
        <EmphasisLine>
          More pressure gives more flow. More restriction gives less flow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>Now think about a torch light.</p>
        <PauseCue label="Give Example" />
        <p>If the battery is healthy and the path is complete, current flows and the lamp turns on.</p>
        <p>If the battery becomes weak, the current becomes smaller.</p>
        <p>If the path breaks, current stops.</p>
        <p>This same idea is used in lights, fans, chargers, motors, and control panels.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us quickly review.</p>
        <PauseCue />
        <p>Current is the actual flow of electric charge.</p>
        <p>Current needs a complete path.</p>
        <p>Voltage tends to increase current.</p>
        <p>Resistance tends to reduce current.</p>
        <p>We can also calculate current with I equals V over R.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the key idea is simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Current tells us how much electric charge is actually moving in the circuit.
        </EmphasisLine>
        <p>Once you understand current, many other circuit ideas become easier.</p>
        <p>In the next lesson, we will continue building this foundation.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to answer one simple
          question: what is current?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are a complete beginner, that is perfectly fine. We will keep
          this lesson simple, practical, and easy to follow.
        </p>
        <PauseCue />
        <p>
          In one short sentence, current is the amount of electric charge moving
          through a circuit.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          In simple English, current tells us the real flow happening in the
          circuit. If more charge moves each second, current is higher. If less
          charge moves each second, current is lower.
        </p>
        <PauseCue label="Point to Voltage" />
        <p>
          Now look at the voltage in the simulation. Voltage is the electrical
          push. If that push becomes stronger, charge usually moves more easily,
          so current usually goes up.
        </p>
        <PauseCue label="Point to Resistor" />
        <p>
          Next, look at the resistor. Resistance is the part that makes charge
          flow harder. If resistance becomes larger, current usually becomes
          smaller.
        </p>
        <PauseCue label="Point to Current" />
        <p>
          So current depends on both push and blockage. In this lesson, the
          battery gives 12 volts, the resistor is 6 ohms, and the current
          becomes 2 amps.
        </p>
        <PauseCue />
        <p>
          We can also calculate current with a simple formula. I equals V
          divided by R. That means current equals voltage divided by resistance.
          So 12 divided by 6 gives us 2.
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          A simple way to picture current is water flowing through a pipe.
          Water flow is like current. Pump pressure is like voltage. A narrow
          pipe is like resistance. More pressure gives more flow. More
          restriction gives less flow.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a torch light. If the battery is healthy and the path is
          complete, current flows and the lamp turns on. If the battery becomes
          weak, current becomes smaller. If the path breaks, current stops.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Current tells us how much
          electric charge is actually moving in the circuit. Thank you, and in
          the next lesson we will continue building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
