"use client";

import type { ClipperMode, ClipperState } from "./clipperTypes";

const VIEW = {
  width: 760,
  height: 340,
  plotX: 52,
  plotWidth: 650,
  inputZeroY: 108,
  positiveZeroY: 188,
  negativeZeroY: 268,
  amplitude: 46,
} as const;

const STYLE = {
  axis: "#0f172a",
  cursor: "#facc15",
  grid: "#dbe4f0",
  input: "#60a5fa",
  negative: "#ef4444",
  positive: "#22c55e",
} as const;

function xForT(t: number) {
  return VIEW.plotX + Math.min(1, Math.max(0, t)) * VIEW.plotWidth;
}

function buildPath(
  data: ClipperState["waveform"],
  yZero: number,
  getValue: (point: ClipperState["waveform"][number]) => number,
  scale: number,
) {
  return data
    .map((point, index) => {
      const x =
        VIEW.plotX + (index / Math.max(1, data.length - 1)) * VIEW.plotWidth;
      const y = yZero - getValue(point) * scale;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function ClipperTimeCursorSection({
  autoRun,
  mode,
  onAutoRunToggle,
  onTimeCursorChange,
  state,
  timeCursor,
}: {
  autoRun: boolean;
  mode: ClipperMode;
  onAutoRunToggle: () => void;
  onTimeCursorChange: (value: number) => void;
  state: ClipperState;
  timeCursor: number;
}) {
  const point = state.timeCursorPoint;
  const scale = VIEW.amplitude / Math.max(1, state.inputAmplitude);
  const inputPath = buildPath(
    state.waveform,
    VIEW.inputZeroY,
    (wavePoint) => wavePoint.vin,
    scale,
  );
  const positivePath = buildPath(
    state.waveform,
    VIEW.positiveZeroY,
    (wavePoint) => wavePoint.voutPositive,
    scale,
  );
  const negativePath = buildPath(
    state.waveform,
    VIEW.negativeZeroY,
    (wavePoint) => wavePoint.voutNegative,
    scale,
  );

  const cursorX = xForT(point.t);
  const inputCursorY = VIEW.inputZeroY - point.vin * scale;
  const positiveCursorY = VIEW.positiveZeroY - point.voutPositive * scale;
  const negativeCursorY = VIEW.negativeZeroY - point.voutNegative * scale;

  const isPositiveHalf = point.vin >= 0;
  const positiveCircuitFocused = mode === "positive" || mode === "both";
  const negativeCircuitFocused = mode === "negative" || mode === "both";
  const positiveClipActive = point.positiveClipped;
  const negativeClipActive = point.negativeClipped;

  const activeModeLabel =
    mode === "positive"
      ? "Positive clipper preview"
      : mode === "negative"
        ? "Negative clipper preview"
        : "Both clipper previews";

  const positiveStateLabel = positiveClipActive
    ? "Shunt branch ON"
    : isPositiveHalf
      ? "Positive half is passing"
      : "Negative half passes unchanged";

  const negativeStateLabel = negativeClipActive
    ? "Shunt branch ON"
    : !isPositiveHalf
      ? "Negative half is passing"
      : "Positive half passes unchanged";

  const positiveExplanation = positiveClipActive
    ? `Vin exceeded +${state.positiveClipThreshold.toFixed(1)}V, so the positive clipper limits the output peak.`
    : isPositiveHalf
      ? "Positive half-cycle is present, but it is still below the positive clip threshold."
      : "The positive clipper does not act during this negative-half sample."
    ;

  const negativeExplanation = negativeClipActive
    ? `Vin went below ${state.negativeClipThreshold.toFixed(1)}V, so the negative clipper limits the output valley.`
    : !isPositiveHalf
      ? "Negative half-cycle is present, but it is still above the negative clip threshold."
      : "The negative clipper does not act during this positive-half sample."
    ;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Time Analysis
          </p>
          <h3 className="text-xl font-black text-slate-950">
            Time Cursor / Switching Preview
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Move the cursor to compare the positive clipper and negative clipper
            at the same instant of the AC waveform.
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoRunToggle}
          className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm transition ${
            autoRun
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {autoRun ? "Auto Run ON" : "Auto Run OFF"}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={0.999}
        step={0.001}
        value={timeCursor}
        onChange={(event) => onTimeCursorChange(Number(event.target.value))}
        className="mb-5 w-full accent-amber-500"
      />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <svg
            viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Clipper circuit time cursor waveform preview"
          >
            <rect width={VIEW.width} height={VIEW.height} fill="#ffffff" />
            <rect
              x="26"
              y="30"
              width="708"
              height="278"
              rx="22"
              fill="#f8fafc"
              stroke="#e2e8f0"
            />

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const x = VIEW.plotX + ratio * VIEW.plotWidth;
              return (
                <g key={ratio}>
                  <line
                    x1={x}
                    y1="44"
                    x2={x}
                    y2="292"
                    stroke={STYLE.grid}
                    strokeDasharray="4 6"
                  />
                </g>
              );
            })}

            <line
              x1={VIEW.plotX}
              y1={VIEW.inputZeroY}
              x2={VIEW.plotX + VIEW.plotWidth}
              y2={VIEW.inputZeroY}
              stroke={STYLE.axis}
              strokeWidth="1.5"
            />
            <line
              x1={VIEW.plotX}
              y1={VIEW.positiveZeroY}
              x2={VIEW.plotX + VIEW.plotWidth}
              y2={VIEW.positiveZeroY}
              stroke={STYLE.axis}
              strokeWidth="1.5"
            />
            <line
              x1={VIEW.plotX}
              y1={VIEW.negativeZeroY}
              x2={VIEW.plotX + VIEW.plotWidth}
              y2={VIEW.negativeZeroY}
              stroke={STYLE.axis}
              strokeWidth="1.5"
            />

            <text x="58" y="80" fontSize="13" fontWeight="900" fill={STYLE.input}>
              Vin
            </text>
            <text
              x="58"
              y="160"
              fontSize="13"
              fontWeight="900"
              fill={STYLE.positive}
            >
              Positive clipped output
            </text>
            <text
              x="58"
              y="240"
              fontSize="13"
              fontWeight="900"
              fill={STYLE.negative}
            >
              Negative clipped output
            </text>

            <path
              d={inputPath}
              fill="none"
              stroke={STYLE.input}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={positivePath}
              fill="none"
              stroke={STYLE.positive}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={positiveCircuitFocused ? 1 : 0.2}
            />
            <path
              d={negativePath}
              fill="none"
              stroke={STYLE.negative}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={negativeCircuitFocused ? 1 : 0.2}
            />

            <line
              x1={cursorX}
              y1="44"
              x2={cursorX}
              y2="292"
              stroke={STYLE.cursor}
              strokeWidth="3"
            />
            <circle cx={cursorX} cy={inputCursorY} r="5.5" fill={STYLE.cursor} />
            <circle
              cx={cursorX}
              cy={positiveCursorY}
              r="5.5"
              fill={STYLE.cursor}
            />
            <circle
              cx={cursorX}
              cy={negativeCursorY}
              r="5.5"
              fill={STYLE.cursor}
            />

            <rect
              x="486"
              y="46"
              width="190"
              height="36"
              rx="14"
              fill={isPositiveHalf ? "#ecfdf5" : "#fef2f2"}
              stroke={isPositiveHalf ? "#22c55e" : "#ef4444"}
            />
            <text
              x="581"
              y="68"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill={isPositiveHalf ? "#15803d" : "#dc2626"}
            >
              {isPositiveHalf
                ? "Positive Half-Cycle Active"
                : "Negative Half-Cycle Active"}
            </text>
          </svg>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Preview Mode
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {activeModeLabel}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Cursor Position
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {(point.t * 360).toFixed(0)} deg electrical angle
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Input Sample
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              Vin = {point.vin.toFixed(2)}V
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Switching Preview
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {state.switchingPreviewLabel}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {point.conducting
                ? "At this instant one clipping branch is active and limits the waveform."
                : "At this instant the waveform is below both clip thresholds, so no clipping branch is active."}
            </p>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${
              positiveClipActive
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Positive Diode Clipping Circuit
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {positiveStateLabel}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-600">
              Vout+ sample = {point.voutPositive.toFixed(2)}V
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {positiveExplanation}
            </p>
          </div>

          <div
            className={`rounded-2xl border px-4 py-3 ${
              negativeClipActive
                ? "border-rose-200 bg-rose-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Negative Diode Clipping Circuit
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">
              {negativeStateLabel}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-600">
              Vout- sample = {point.voutNegative.toFixed(2)}V
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {negativeExplanation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
