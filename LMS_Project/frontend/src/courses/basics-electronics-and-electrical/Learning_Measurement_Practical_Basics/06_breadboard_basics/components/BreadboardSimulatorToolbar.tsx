"use client";

export default function BreadboardSimulatorToolbar({
  layout = "top",
  primaryToggleLabel,
  secondaryToggleLabel,
  onClear,
  onTogglePrimary,
  onToggleSecondary,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: {
  layout?: "side" | "top";
  primaryToggleLabel: string;
  secondaryToggleLabel: string;
  onClear: () => void;
  onTogglePrimary: () => void;
  onToggleSecondary: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}) {
  const isSide = layout === "side";

  return (
    <div
      className={
        isSide
          ? "rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5"
          : "rounded-[24px] border border-slate-200 bg-white/95 p-3 shadow-sm sm:rounded-[28px] sm:p-4"
      }
    >
      <div className={isSide ? "grid gap-2" : "flex flex-wrap items-center gap-3"}>
        <button
          type="button"
          onClick={onClear}
          className="min-h-[44px] min-w-[120px] rounded-xl border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={onTogglePrimary}
          className="min-h-[44px] min-w-[200px] rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {primaryToggleLabel}
        </button>
        <button
          type="button"
          onClick={onToggleSecondary}
          className="min-h-[44px] min-w-[200px] rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          {secondaryToggleLabel}
        </button>
        <div className="ml-auto flex min-w-[260px] flex-1 flex-wrap justify-end gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={onZoomOut}
            className="min-h-[44px] min-w-[86px] flex-1 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Zoom -
          </button>
          <button
            type="button"
            onClick={onZoomReset}
            className="min-h-[44px] min-w-[96px] border-x border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Fit view
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="min-h-[44px] min-w-[86px] flex-1 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Zoom +
          </button>
        </div>
      </div>
    </div>
  );
}
