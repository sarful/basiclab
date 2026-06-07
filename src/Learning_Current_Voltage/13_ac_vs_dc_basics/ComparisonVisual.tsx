"use client";

type ComparisonVisualProps = {
  dcLevel: number;
  acPeak: number;
  acRms: number;
  frequency: number;
  dcStrength: number;
  acStrength: number;
};

function buildAcWavePath({
  originX,
  originY,
  width,
  amplitude,
  cycles,
}: {
  originX: number;
  originY: number;
  width: number;
  amplitude: number;
  cycles: number;
}) {
  const steps = 48;
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const x = originX + t * width;
    const y = originY - Math.sin(t * Math.PI * 2 * cycles) * amplitude;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  return points.join(" ");
}

export function ComparisonVisual({
  dcLevel,
  acPeak,
  acRms,
  frequency,
  dcStrength,
  acStrength,
}: ComparisonVisualProps) {
  const acWave = buildAcWavePath({
    originX: 60,
    originY: 172,
    width: 400,
    amplitude: 44,
    cycles: Math.max(1, frequency * 0.8),
  });

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
        <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Comparison View
            </div>
            <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
              Watch both current styles
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The left view stays steady like DC. The right view changes back
              and forth like AC.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-xl font-semibold text-slate-950">DC Current</h3>
              <p className="mt-1 text-sm text-slate-600">
                Steady level, one direction.
              </p>
            </div>

            <svg viewBox="0 0 520 260" className="h-[300px] w-full bg-white">
              <text x="56" y="48" fontSize="13" fontWeight="700" fill="#334155">
                Current stays at the same level over time
              </text>
              <line
                x1="56"
                y1="188"
                x2="468"
                y2="188"
                stroke="#94a3b8"
                strokeWidth="1.6"
              />
              <line
                x1="56"
                y1="60"
                x2="56"
                y2="210"
                stroke="#94a3b8"
                strokeWidth="1.6"
              />
              <path
                d={`M 56 ${188 - dcLevel * 10} L 468 ${188 - dcLevel * 10}`}
                stroke="#16a34a"
                strokeWidth="4"
                fill="none"
              />
              <text
                x="474"
                y={188 - dcLevel * 10 + 4}
                fontSize="13"
                fontWeight="700"
                fill="#16a34a"
              >
                {dcLevel.toFixed(1)} A
              </text>
              <text x="56" y="230" fontSize="12" fontWeight="700" fill="#2563eb">
                Strength: {Math.round(dcStrength)}%
              </text>
            </svg>
          </article>

          <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-xl font-semibold text-slate-950">AC Current</h3>
              <p className="mt-1 text-sm text-slate-600">
                Alternates above and below the center line.
              </p>
            </div>

            <svg viewBox="0 0 520 260" className="h-[300px] w-full bg-white">
              <text x="56" y="48" fontSize="13" fontWeight="700" fill="#334155">
                Current changes direction with frequency
              </text>
              <line
                x1="56"
                y1="172"
                x2="468"
                y2="172"
                stroke="#94a3b8"
                strokeWidth="1.6"
              />
              <line
                x1="56"
                y1="60"
                x2="56"
                y2="220"
                stroke="#94a3b8"
                strokeWidth="1.6"
              />
              <path d={acWave} stroke="#2563eb" strokeWidth="4" fill="none" />
              <text x="56" y="230" fontSize="12" fontWeight="700" fill="#2563eb">
                Peak: {acPeak.toFixed(1)} A | RMS: {acRms.toFixed(2)} A | f ={" "}
                {frequency.toFixed(1)} Hz
              </text>
              <text x="56" y="246" fontSize="12" fontWeight="700" fill="#0f766e">
                Strength: {Math.round(acStrength)}%
              </text>
            </svg>
          </article>
        </div>
      </div>
    </section>
  );
}
