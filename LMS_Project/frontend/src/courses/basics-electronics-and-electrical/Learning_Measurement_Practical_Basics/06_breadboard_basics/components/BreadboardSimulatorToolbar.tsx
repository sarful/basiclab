"use client";

export default function BreadboardSimulatorToolbar({
  clearLabel = "Clear",
  colors,
  description,
  primaryToggleLabel,
  secondaryToggleLabel,
  selectedColor,
  title,
  onClear,
  onSelectColor,
  onTogglePrimary,
  onToggleSecondary,
}: {
  clearLabel?: string;
  colors: string[];
  description: string;
  primaryToggleLabel: string;
  secondaryToggleLabel: string;
  selectedColor: string;
  title: string;
  onClear: () => void;
  onSelectColor: (color: string) => void;
  onTogglePrimary: () => void;
  onToggleSecondary: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`h-8 w-8 rounded-full border-2 ${
              selectedColor === color ? "border-black" : "border-slate-300"
            }`}
            style={{ background: color }}
          />
        ))}

        <button
          onClick={onTogglePrimary}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
        >
          {primaryToggleLabel}
        </button>

        <button
          onClick={onToggleSecondary}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
        >
          {secondaryToggleLabel}
        </button>

        <button
          onClick={onClear}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
