type ControlPanelSectionProps = {
  pressed: boolean;
  setPressed: (value: boolean) => void;
  testsPassed: boolean;
  coilEnergized: boolean;
};

export default function ControlPanelSection({
  pressed,
  setPressed,
  testsPassed,
  coilEnergized,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="text-lg font-black text-slate-900">Controls</h2>

      <button
        type="button"
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className={`mt-5 w-full rounded-3xl px-5 py-7 text-xl font-black shadow-lg transition ${
          pressed
            ? "translate-y-1 bg-blue-700 text-white"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {pressed ? "PUSH BUTTON PRESSED" : "PRESS PUSH BUTTON"}
      </button>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {coilEnergized
            ? "The DC control path is complete. The relay coil energizes, COM moves to NO, and the AC lamp turns ON."
            : "With the pushbutton released, the relay coil is off. COM stays on the NC side, so the NO-side AC lamp remains OFF."}
        </p>
        <p className="mt-3 text-sm font-black text-slate-900">
          Self tests: {testsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}
