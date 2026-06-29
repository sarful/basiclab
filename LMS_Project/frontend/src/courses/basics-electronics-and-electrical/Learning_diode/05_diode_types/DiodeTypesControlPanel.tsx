"use client";

type Props = {
  selectedId: string;
  onSelectedIdChange: (value: string) => void;
  diodeOptions: { id: string; name: string }[];
};

export default function DiodeTypesControlPanel({
  selectedId,
  onSelectedIdChange,
  diodeOptions,
}: Props) {
  return (
    <aside className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-5">
      <label className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-500">Diode Type</label>
      <select
        value={selectedId}
        onChange={(event) => onSelectedIdChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-cyan-500"
      >
        {diodeOptions.map((diode) => (
          <option key={diode.id} value={diode.id}>
            {diode.name}
          </option>
        ))}
      </select>
    </aside>
  );
}
