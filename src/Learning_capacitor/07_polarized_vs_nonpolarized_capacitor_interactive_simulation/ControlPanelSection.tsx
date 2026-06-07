type ControlPanelSectionProps = {
  voltage: number;
  setVoltage: (value: number) => void;
  reverse: boolean;
  setReverse: (value: boolean) => void;
  frequency: number;
  setFrequency: (value: number) => void;
};

export function ControlPanelSection({
  voltage,
  setVoltage,
  reverse,
  setReverse,
  frequency,
  setFrequency,
}: ControlPanelSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">Applied Voltage: {voltage}V</label>
        <input
          type="range"
          min="1"
          max="40"
          step="1"
          value={voltage}
          onChange={(e) => setVoltage(Number(e.target.value))}
          className="w-full accent-orange-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Control voltage for the 25V rated polarized capacitor.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-800">Polarized Connection</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setReverse(false)}
            className={`rounded-xl px-3 py-2 text-sm font-bold ${
              !reverse ? "bg-green-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            Correct
          </button>
          <button
            onClick={() => setReverse(true)}
            className={`rounded-xl px-3 py-2 text-sm font-bold ${
              reverse ? "bg-red-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            Reverse
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm text-slate-700">
          AC Frequency: {frequency} Hz
        </label>
        <input
          type="range"
          min="50"
          max="100000"
          step="50"
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Shows how a non-polarized capacitor behaves with AC signals.
        </p>
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm text-slate-700 ring-1 ring-purple-100">
        <p className="font-semibold text-purple-700">Key Difference</p>
        <p className="mt-1">
          Polarized capacitors are mainly for DC filtering and need correct polarity.
          Non-polarized capacitors work well with AC and high-frequency signals.
        </p>
      </div>
    </div>
  );
}
