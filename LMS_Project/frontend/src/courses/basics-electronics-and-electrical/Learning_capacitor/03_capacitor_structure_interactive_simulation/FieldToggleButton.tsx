type FieldToggleButtonProps = {
  showField: boolean;
  setShowField: (value: boolean) => void;
};

export function FieldToggleButton({
  showField,
  setShowField,
}: FieldToggleButtonProps) {
  return (
    <button
      onClick={() => setShowField(!showField)}
      className={`mb-5 w-full rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition ${
        showField ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-500 hover:bg-slate-600"
      }`}
    >
      {showField ? "Hide Electric Field" : "Show Electric Field"}
    </button>
  );
}
