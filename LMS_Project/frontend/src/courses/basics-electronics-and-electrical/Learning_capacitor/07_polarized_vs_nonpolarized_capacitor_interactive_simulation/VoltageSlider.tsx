type VoltageSliderProps = {
  voltage: number;
  setVoltage: (value: number) => void;
};

export function VoltageSlider({ voltage, setVoltage }: VoltageSliderProps) {
  return (
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
  );
}
