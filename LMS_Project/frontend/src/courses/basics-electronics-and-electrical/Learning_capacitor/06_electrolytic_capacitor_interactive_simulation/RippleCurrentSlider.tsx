import { formatCurrent } from "./logic";

type RippleCurrentSliderProps = {
  rippleCurrent: number;
  setRippleCurrent: (value: number) => void;
};

export function RippleCurrentSlider({
  rippleCurrent,
  setRippleCurrent,
}: RippleCurrentSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Ripple Current: {formatCurrent(rippleCurrent)}
      </label>
      <input
        type="range"
        min="0.05"
        max="2"
        step="0.05"
        value={rippleCurrent}
        onChange={(event) => setRippleCurrent(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
