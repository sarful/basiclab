"use client";

const VOLTAGE_CONTROL = {
  min: -12,
  max: 12,
  step: 0.1,
  threshold: 0.7,
} as const;

function getRegion(voltage: number) {
  if (voltage < 0) return "Reverse Bias";
  if (voltage < VOLTAGE_CONTROL.threshold) return "Below Threshold";
  return "Forward Bias";
}

export function VoltageControlCard({
  voltage,
  onVoltageChange,
}: {
  voltage: number;
  onVoltageChange: (voltage: number) => void;
}) {
  const region = getRegion(voltage);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <label
            htmlFor="voltage"
            className="text-base font-black text-slate-900"
          >
            Voltage Controller
          </label>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Move left for reverse bias, move right for forward bias.
          </p>
        </div>

        <div className="text-right">
          <span className="rounded-xl bg-white px-4 py-2 font-mono text-xl font-black text-slate-900 shadow-sm">
            {voltage.toFixed(1)}V
          </span>
          <p
            className={`mt-2 text-xs font-black uppercase ${
              voltage < 0
                ? "text-red-600"
                : voltage < VOLTAGE_CONTROL.threshold
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {region}
          </p>
        </div>
      </div>

      <input
        id="voltage"
        type="range"
        min={VOLTAGE_CONTROL.min}
        max={VOLTAGE_CONTROL.max}
        step={VOLTAGE_CONTROL.step}
        value={voltage}
        onChange={(event) => onVoltageChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />

      <div className="mt-2 grid grid-cols-5 text-xs font-bold text-slate-500">
        <span>-12V</span>
        <span className="text-center">Reverse</span>
        <span className="text-center">0V</span>
        <span className="text-center text-orange-600">≈0.7V</span>
        <span className="text-right">+12V</span>
      </div>
    </div>
  );
}
