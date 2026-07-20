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
          Breadboard Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          Teleprompter-friendly narration for teaching how a breadboard is
          organized and how to place jumper wires with purpose.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>This lesson is about building the correct breadboard-thinking habit.</p>
        <p>Students should understand that a breadboard is not a random hole grid.</p>
        <p>They should remember three structural rules.</p>
        <p>A-E in the same numbered column are connected on the top half.</p>
        <p>F-J in the same numbered column are connected on the bottom half.</p>
        <p>The center gap and the power rails stay separate until we add the right jumper wire.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In the previous lessons, we focused on practical multimeter skills.</p>
        <p>Now we are stepping into another important area of electronics practice.</p>
        <p>That area is breadboard basics.</p>
        <PauseCue label="Short Pause" />
        <p>
          A breadboard helps us build and test circuits without soldering, but
          only if we understand how the holes are connected inside.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: The Main Idea" cue="Teach Slowly">
        <p>Here is the most important idea in this lesson.</p>
        <p>A breadboard has internal connection rules.</p>
        <p>Not every nearby hole is connected.</p>
        <p>Some holes already share one internal strip, and some holes are completely separate.</p>
        <PauseCue label="Emphasize" />
        <p>Good breadboard work starts with knowing what is already connected and what is not.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Terminal Strips" cue="Point to Board">
        <p>Let us begin with the terminal strips.</p>
        <p>On the top half, A through E in the same numbered column are internally connected.</p>
        <p>On the bottom half, F through J in the same numbered column are internally connected.</p>
        <p>That means A8, B8, C8, D8, and E8 already share one internal path.</p>
        <p>But that top group is separate from F8, G8, H8, I8, and J8 below the gap.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: The Center Gap" cue="Board Structure">
        <p>Next, notice the center gap in the middle of the breadboard.</p>
        <p>This gap separates the top half from the bottom half.</p>
        <p>So a hole like E20 is not automatically connected to F20.</p>
        <p>If we want the circuit to continue across that gap, we must add a jumper wire.</p>
        <PauseCue label="Slow Down" />
        <p>The same column number does not guarantee a connection when the center gap is in the way.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Power Rails" cue="Supply Lines">
        <p>Now let us talk about the power rails.</p>
        <p>Power rails help distribute supply voltage and ground along the board.</p>
        <p>But a rail is still separate from the terminal strip beside it.</p>
        <p>That is why connecting Top positive rail 8 to the column 8 terminal row needs a jumper.</p>
        <p>The rail does not feed that row automatically.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Coordinates and Targeting" cue="Read Carefully">
        <p>In breadboard work, coordinates matter.</p>
        <p>Labels such as A8, A14, E20, F20, or C30 tell us the exact hole position.</p>
        <p>Those labels are not decoration.</p>
        <p>They tell us whether two holes are in the same internal group or different groups.</p>
        <p>Careful coordinate reading helps us place wires on purpose instead of guessing.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: When a Jumper Is Needed" cue="Real Cases">
        <p>Let us connect this theory to real actions.</p>
        <p>A8 to A14 needs a jumper because those are different columns.</p>
        <p>Top positive rail 8 to the terminal row for column 8 also needs a jumper.</p>
        <p>E20 to F20 needs a jumper because the center gap breaks that path.</p>
        <p>But if a hole is already in the same internal group, adding a jumper there is unnecessary.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Mistakes" cue="Safety">
        <p>Let us slow down and look at the common mistakes.</p>
        <PauseCue />
        <p>Do not assume that holes in the same row letter are connected across different columns.</p>
        <p>Do not assume the power rail automatically feeds the terminal strip.</p>
        <p>Do not ignore the center gap just because the column numbers match.</p>
        <p>And do not place a jumper where the breadboard already connects the holes internally.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Practical Mindset" cue="Real Work">
        <p>Think of breadboard work as asking one practical question at a time.</p>
        <p>Are these two holes already connected inside the board?</p>
        <p>Is the rail separate from this row?</p>
        <p>Does the center gap block this path?</p>
        <p>Good breadboard building becomes much easier when you answer those questions before placing a wire.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Recap and Closing" cue="End">
        <p>Let us close with the core lesson.</p>
        <p>A-E share one top-half group.</p>
        <p>F-J share one bottom-half group.</p>
        <p>The center gap separates those halves.</p>
        <p>Power rails stay separate from terminal strips until we wire them together.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Read the coordinates carefully, understand the internal groups, and
          use jumper wires only where the breadboard does not already make the
          connection for you.
        </p>
      </ScriptBlock>
    </div>
  );
}
