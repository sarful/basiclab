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
          Potentiometer
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This script is written in a clear teaching style so you can explain
          what a potentiometer is, how the wiper works, and why voltage-divider
          mode and rheostat mode are both important in practical electronics.
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "In this lesson, we will understand that a potentiometer is not just another resistor. It is an adjustable component used when a circuit needs controllable voltage or controllable resistance.",
          "We will connect the three-terminal structure, the movable wiper, voltage divider mode, and rheostat mode to real applications such as volume control and calibration.",
          "By the end, students should clearly understand why a potentiometer is selected when manual tuning is needed.",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "When students first see a potentiometer, they often think of a simple knob or dial.",
          "But behind that knob is an important electrical idea: adjustable control.",
          "A potentiometer lets us change circuit behavior without replacing parts or redesigning the circuit.",
        ]}
      />

      <PauseCue>Start by showing the potentiometer body and point out the three terminals before explaining the wiper.</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "The main idea is that a potentiometer is a variable resistor with a movable wiper.",
          "As the wiper moves, the ratio of the resistive path changes.",
          "That change can adjust output voltage or effective resistance depending on how the component is connected.",
        ]}
      />

      <ScriptBlock
        title="What the Wiper Does"
        lines={[
          "The wiper is the most important moving part in the potentiometer.",
          "It slides or rotates along the resistive track.",
          "By changing position, it changes how much of the total resistive path is active on each side.",
          "That is why a potentiometer gives smooth control instead of only fixed resistor values.",
        ]}
      />

      <ScriptBlock
        title="Voltage Divider Mode"
        lines={[
          "In voltage divider mode, all three terminals are used.",
          "The potentiometer receives an input voltage and produces an adjustable output voltage at the wiper.",
          "As the wiper moves, the output voltage changes according to the new position ratio.",
          "This is why potentiometers are useful when a circuit needs adjustable reference voltage or user-controlled output level.",
        ]}
      />

      <PauseCue>Move the wiper in voltage-divider mode and show how the output voltage follows the ratio change.</PauseCue>

      <ScriptBlock
        title="Rheostat Mode"
        lines={[
          "In rheostat mode, the potentiometer is used as a two-terminal variable resistor.",
          "Instead of mainly giving an adjustable output voltage, it changes the active resistance seen by the circuit.",
          "That change in active resistance affects current flow.",
          "This mode is useful when we want adjustable current control or resistance tuning.",
        ]}
      />

      <ScriptBlock
        title="Why Potentiometers Are Useful"
        lines={[
          "Potentiometers are useful because many practical systems need tuning after they are built.",
          "Volume control is a classic example.",
          "Calibration is another strong example, because sensor circuits and reference circuits often need fine adjustment.",
          "Their value comes from allowing a person to control electrical behavior in a simple and intuitive way.",
        ]}
      />

      <ScriptBlock
        title="Why a Potentiometer Is Not a Fixed Resistor"
        lines={[
          "A fixed resistor is chosen for one stable value.",
          "A potentiometer is chosen because that value or ratio must be adjustable.",
          "This means we do not use it for the same reason we use an ordinary resistor.",
          "We use it when change itself is part of the design.",
        ]}
      />

      <PauseCue>Switch between divider mode and rheostat mode so students can see the same component behaving in two different ways.</PauseCue>

      <ScriptBlock
        title="Limitations"
        lines={[
          "A potentiometer is very useful, but it is not perfect.",
          "Because it has moving mechanical parts, wear can happen over time.",
          "It is also not ideal for heavy power loads compared with components designed for stronger heat handling.",
          "Good design means using potentiometers where adjustability matters most, not where heavy-duty power handling is the priority.",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "One common mistake is thinking a potentiometer is only for volume control.",
          "Another mistake is forgetting that the same part can work in both voltage divider mode and rheostat mode.",
          "Students also often think the knob changes only a number, but in reality the wiper changes an electrical ratio inside the circuit.",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "So let us review the key idea.",
          "A potentiometer is a three-terminal variable resistor with a movable wiper.",
          "It can be used to adjust voltage in divider mode or resistance in rheostat mode.",
          "It is useful in volume control, calibration, tuning, and adjustable settings.",
          "Its real strength is smooth manual control of circuit behavior.",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "In the next lessons, students will continue connecting component behavior to practical circuit design decisions.",
          "Once the potentiometer concept is clear, it becomes much easier to understand adjustable control inside real electronic systems.",
        ]}
      />
    </div>
  );
}
