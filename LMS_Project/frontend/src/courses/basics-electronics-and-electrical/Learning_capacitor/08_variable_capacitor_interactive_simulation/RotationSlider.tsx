type RotationSliderProps = {
  rotation: number;
  setRotation: (value: number) => void;
};

export function RotationSlider({ rotation, setRotation }: RotationSliderProps) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Knob Rotation: {rotation} deg</label>
      <input
        type="range"
        min="0"
        max="180"
        step="1"
        value={rotation}
        onChange={(event) => setRotation(Number(event.target.value))}
        className="w-full accent-purple-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        More rotation increases plate overlap and therefore capacitance.
      </p>
    </div>
  );
}
