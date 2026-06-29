type SupplyVoltageSliderProps = {
  supplyVoltage: number;
  setSupplyVoltage: (value: number) => void;
};

export function SupplyVoltageSlider({
  supplyVoltage,
  setSupplyVoltage,
}: SupplyVoltageSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Supply Voltage: {supplyVoltage}V
      </label>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={supplyVoltage}
        onChange={(event) => setSupplyVoltage(Number(event.target.value))}
        className="w-full accent-purple-500"
      />
    </div>
  );
}
