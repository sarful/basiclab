"use client";

type ScriptBlockProps = {
  title: string;
  lines: string[];
};

function ScriptBlock({ title, lines }: ScriptBlockProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
        {title}
      </div>
      <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function PauseCue({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      Pause cue: {children}
    </div>
  );
}

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-slate-300 bg-white/95 p-5 shadow-xl backdrop-blur md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Udemy Script Note English
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Resistor Structure
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This script is designed for clear, step-by-step instruction so you
          can explain what is physically inside a resistor and why that
          structure affects real circuit performance.
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "In this lesson, we will understand that a resistor is not only a number printed on a component body.",
          "We will explore the internal structure of a resistor, the role of the resistive element, ceramic core, coating, and leads, and how material choice affects stability, heat, and precision.",
          "By the end, students should understand why resistor construction matters in practical electronics.",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "When many students first learn about resistors, they only focus on the ohm value.",
          "But a real resistor is a physical device with structure, material, and thermal behavior.",
          "That structure is one of the reasons different resistors can perform differently even when their values look similar.",
        ]}
      />

      <PauseCue>Show a normal resistor first, then move to the cutaway or exploded internal view.</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "A resistor is built from multiple parts working together.",
          "Inside the resistor, the resistive element creates opposition to current flow.",
          "Around that, the core, coating, and leads help the resistor stay stable, safe, and useful in a circuit.",
        ]}
      />

      <ScriptBlock
        title="Internal Parts"
        lines={[
          "A practical resistor usually includes a resistive element, a supporting core, an outer protective body, and metal leads.",
          "The resistive element is where electrical opposition really happens.",
          "The outer structure is not just packaging. It helps protect the component and support electrical and thermal performance.",
        ]}
      />

      <ScriptBlock
        title="Ceramic Core"
        lines={[
          "In many resistor designs, the ceramic core provides mechanical support and electrical insulation.",
          "It also helps the resistor manage heat more effectively.",
          "So the core is an important part of the resistor design, not just a filler material.",
        ]}
      />

      <PauseCue>Point to the ceramic core and resistive layer in the structure visualizer.</PauseCue>

      <ScriptBlock
        title="Material Comparison"
        lines={[
          "Different resistor materials create different practical behaviors.",
          "Carbon composition resistors can have more noise and more resistance drift under heat.",
          "Metal film resistors are usually more precise and more stable.",
          "Wire-wound resistors are stronger in power handling and heat tolerance, but their structure can introduce additional effects such as inductive behavior.",
        ]}
      />

      <ScriptBlock
        title="Heat and Temperature"
        lines={[
          "A resistor converts part of electrical energy into heat, so temperature is always part of the story.",
          "As temperature increases, resistance may shift depending on the material and its temperature coefficient.",
          "That means resistor behavior is not only about voltage and current, but also about thermal conditions.",
        ]}
      />

      <ScriptBlock
        title="Why Structure Affects Reliability"
        lines={[
          "A resistor that manages heat well can remain more stable over time.",
          "A weaker or less suitable structure may drift, overheat, or fail when electrical stress becomes too high.",
          "So resistor structure directly affects long-term reliability and safe operation.",
        ]}
      />

      <ScriptBlock
        title="Why This Matters for Students"
        lines={[
          "This lesson helps students connect the physical body of a resistor to the electrical behavior they measure in a circuit.",
          "Once students understand the internal structure, it becomes easier to understand tolerance, heat, precision, and material selection.",
          "That is why this lesson uses cutaway views and material comparison instead of only a static formula discussion.",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "A common mistake is thinking that all resistors with the same value are practically identical.",
          "Another mistake is ignoring material type when stability, noise, or heat tolerance is important.",
          "Students also sometimes think the resistor body is just an outer cover, without realizing that internal structure affects performance.",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "So let us review the main idea.",
          "A resistor has a real internal structure made from specific materials and layers.",
          "That structure affects resistance behavior, heat handling, precision, and reliability.",
          "Understanding the inside of a resistor helps us make better choices in real electronics work.",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "In the next lessons, we will build on this foundation and connect resistor construction to practical resistor types and circuit applications.",
          "Once students understand the structure clearly, later lessons on resistor performance become much easier to follow.",
        ]}
      />
    </div>
  );
}
