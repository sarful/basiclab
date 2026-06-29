"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatResistance, materials } from "./logic";

type RatingKey =
  | "heatStress"
  | "stability"
  | "precision"
  | "powerHandling"
  | "noiseControl";

type RatingInfo = {
  label: string;
  value: number;
  tone: string;
};

type MaterialEducationProfile = {
  stability: number;
  precision: number;
  powerHandling: number;
  noiseControl: number;
  tolerance: string;
  bestUse: string;
  beginnerExplanation: string;
};

const educationProfiles: Record<string, MaterialEducationProfile> = {
  carbon: {
    stability: 0.42,
    precision: 0.38,
    powerHandling: 0.58,
    noiseControl: 0.35,
    tolerance: "Low to medium precision",
    bestUse: "Basic low-cost circuits and simple learning projects.",
    beginnerExplanation:
      "Carbon composition resistors use a mixed carbon material inside the body. They are simple and strong, but their value can drift more with heat and age.",
  },
  "metal-film": {
    stability: 0.92,
    precision: 0.94,
    powerHandling: 0.62,
    noiseControl: 0.9,
    tolerance: "High precision",
    bestUse:
      "Accurate measurement circuits, audio circuits, and stable signal paths.",
    beginnerExplanation:
      "Metal film resistors use a thin resistive film on a ceramic core. They are stable, quiet, and accurate, so they are widely used in modern electronics.",
  },
  "wire-wound": {
    stability: 0.78,
    precision: 0.72,
    powerHandling: 0.94,
    noiseControl: 0.72,
    tolerance: "Medium to high precision",
    bestUse:
      "Power circuits, load resistors, and circuits that must handle more heat.",
    beginnerExplanation:
      "Wire wound resistors use a resistive wire wrapped around a ceramic core. They can handle more power, but they may run warmer under heavy load.",
  },
};

function getProfile(materialKey: string): MaterialEducationProfile {
  return (
    educationProfiles[materialKey] ?? {
      stability: 0.6,
      precision: 0.6,
      powerHandling: 0.6,
      noiseControl: 0.6,
      tolerance: "General purpose",
      bestUse: "General electronics learning and simple circuits.",
      beginnerExplanation:
        "This resistor material controls current by forcing charges through a resistive path.",
    }
  );
}

function getHeatTone(stress: number) {
  if (stress > 0.82) return "bg-red-500";
  if (stress > 0.6) return "bg-orange-500";
  if (stress > 0.38) return "bg-yellow-500";
  return "bg-green-500";
}

function getHeatLabel(stress: number) {
  if (stress > 0.82) return "High";
  if (stress > 0.6) return "Warm";
  if (stress > 0.38) return "Moderate";
  return "Low";
}

function RatingBar({ item }: { item: RatingInfo }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600">{item.label}</p>
        <p className="text-xs font-bold text-slate-800">
          {Math.round(item.value * 100)}%
        </p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className={`h-2.5 rounded-full ${item.tone}`}
          initial={false}
          animate={{ width: `${clamp(item.value, 0, 1) * 100}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}

function MiniStructurePreview({
  materialKey,
  shellColor,
  coreColor,
}: {
  materialKey: string;
  shellColor: string;
  coreColor: string;
}) {
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full">
      <defs>
        <linearGradient
          id={`miniShell-${materialKey}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#fdecc8" />
          <stop offset="55%" stopColor="#e8c77f" />
          <stop offset="100%" stopColor="#c98e47" />
        </linearGradient>
      </defs>

      <line
        x1="18"
        y1="66"
        x2="72"
        y2="66"
        stroke="#64748b"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="248"
        y1="66"
        x2="302"
        y2="66"
        stroke="#64748b"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <rect
        x="72"
        y="32"
        width="176"
        height="68"
        rx="34"
        fill={`url(#miniShell-${materialKey})`}
        stroke="#0f172a"
        strokeWidth="2.5"
        opacity="0.45"
      />

      <rect
        x="90"
        y="43"
        width="140"
        height="46"
        rx="23"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="2"
      />

      <rect
        x="105"
        y="51"
        width="110"
        height="30"
        rx="15"
        fill={coreColor}
        opacity="0.36"
        stroke={shellColor}
        strokeWidth="1.5"
      />

      {materialKey === "carbon" ? (
        <>
          {Array.from({ length: 32 }).map((_, index) => (
            <circle
              key={`carbon-preview-${index}`}
              cx={108 + ((index * 19) % 105)}
              cy={54 + ((index * 13) % 25)}
              r={index % 3 === 0 ? 2.8 : 2}
              fill={index % 2 === 0 ? "#111827" : "#475569"}
              opacity="0.8"
            />
          ))}
          <text
            x="160"
            y="119"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
            fontWeight="700"
          >
            Random carbon granules
          </text>
        </>
      ) : materialKey === "wire-wound" ? (
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <ellipse
              key={`wire-preview-${index}`}
              cx={112 + index * 14}
              cy="66"
              rx="8"
              ry="24"
              fill="none"
              stroke={shellColor}
              strokeWidth="3"
              opacity={index % 2 === 0 ? 0.95 : 0.55}
            />
          ))}
          <line
            x1="104"
            y1="66"
            x2="218"
            y2="66"
            stroke={shellColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x="160"
            y="119"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
            fontWeight="700"
          >
            Coil winding on ceramic core
          </text>
        </>
      ) : (
        <>
          <path
            d="M106 66 H120 L130 51 L144 81 L158 51 L172 81 L186 51 L200 81 L214 66"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="160"
            y="119"
            textAnchor="middle"
            fill="#475569"
            fontSize="10"
            fontWeight="700"
          >
            Spiral thin-film track
          </text>
        </>
      )}

      <rect x="92" y="32" width="7" height="68" fill="#ef4444" />
      <rect x="122" y="32" width="7" height="68" fill="#111827" />
      <rect x="193" y="32" width="7" height="68" fill="#f59e0b" />
      <rect x="222" y="32" width="7" height="68" fill="#d4af37" />
    </svg>
  );
}

export function ComparisonPanel({
  voltage,
  baseResistance,
  temperature,
}: {
  voltage: number;
  baseResistance: number;
  temperature: number;
}) {
  const comparisonData = materials.map((material) => {
    const profile = getProfile(material.key);
    const resistance =
      baseResistance *
      material.resistanceFactor *
      (1 + (temperature - 25) * 0.004);
    const current = voltage / Math.max(resistance, 1);
    const power = voltage * current;
    const heatStress = clamp(
      power * material.heatFactor * 0.14 + temperature / 180,
      0,
      1,
    );

    const ratings: Record<RatingKey, RatingInfo> = {
      heatStress: {
        label: "Heat Stress",
        value: heatStress,
        tone: getHeatTone(heatStress),
      },
      stability: {
        label: "Stability",
        value: profile.stability,
        tone: "bg-blue-500",
      },
      precision: {
        label: "Precision",
        value: profile.precision,
        tone: "bg-green-500",
      },
      powerHandling: {
        label: "Power Handling",
        value: profile.powerHandling,
        tone: "bg-orange-500",
      },
      noiseControl: {
        label: "Noise Control",
        value: profile.noiseControl,
        tone: "bg-purple-500",
      },
    };

    return {
      material,
      profile,
      resistance,
      current,
      power,
      heatStress,
      ratings,
    };
  });

  const bestPrecision = comparisonData.reduce((best, item) =>
    item.profile.precision > best.profile.precision ? item : best,
  );

  const bestPower = comparisonData.reduce((best, item) =>
    item.profile.powerHandling > best.profile.powerHandling ? item : best,
  );

  const bestLowCost = comparisonData[0];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Material Comparison</h2>
          <p className="mt-1 text-xs text-slate-600">
            Compare how each resistor construction affects resistance, current,
            power loss, heat, stability, precision, and noise.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
          Temperature: {temperature}°C · Voltage: {voltage}V
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {comparisonData.map(
          ({
            material,
            profile,
            resistance,
            current,
            power,
            heatStress,
            ratings,
          }) => (
            <motion.article
              key={material.key}
              className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{material.label}</h3>
                  <p className="mt-1 text-xs text-slate-500">{material.note}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    heatStress > 0.7
                      ? "bg-red-100 text-red-700"
                      : heatStress > 0.45
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {getHeatLabel(heatStress)} Heat
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <MiniStructurePreview
                  materialKey={material.key}
                  shellColor={material.shellColor}
                  coreColor={material.coreColor}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Resistance
                  </p>
                  <p className="mt-1 font-bold text-yellow-700">
                    {formatResistance(resistance)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Current
                  </p>
                  <p className="mt-1 font-bold text-green-700">
                    {formatCurrent(current)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Power
                  </p>
                  <p className="mt-1 font-bold text-orange-700">
                    {power.toFixed(3)} W
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Tolerance
                  </p>
                  <p className="mt-1 font-bold text-blue-700">
                    {profile.tolerance}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <RatingBar item={ratings.heatStress} />
                <RatingBar item={ratings.stability} />
                <RatingBar item={ratings.precision} />
                <RatingBar item={ratings.powerHandling} />
                <RatingBar item={ratings.noiseControl} />
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-xs text-slate-700 ring-1 ring-blue-100">
                <p className="font-bold text-blue-700">Beginner explanation</p>
                <p className="mt-1 leading-relaxed">
                  {profile.beginnerExplanation}
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-xs text-slate-700 ring-1 ring-emerald-100">
                <p className="font-bold text-emerald-700">Best use case</p>
                <p className="mt-1 leading-relaxed">{profile.bestUse}</p>
              </div>
            </motion.article>
          ),
        )}
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-bold text-slate-900">Which one should I choose?</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-3 text-sm ring-1 ring-slate-200">
            <p className="font-bold text-blue-700">For accuracy</p>
            <p className="mt-1 text-slate-600">
              Choose <b>{bestPrecision.material.label}</b> because it has the
              best stability, precision, and noise control.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3 text-sm ring-1 ring-slate-200">
            <p className="font-bold text-orange-700">For power handling</p>
            <p className="mt-1 text-slate-600">
              Choose <b>{bestPower.material.label}</b> when the resistor must
              handle more current and heat.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-3 text-sm ring-1 ring-slate-200">
            <p className="font-bold text-slate-700">For simple learning</p>
            <p className="mt-1 text-slate-600">
              Choose <b>{bestLowCost.material.label}</b> to understand the basic
              idea of a resistive material opposing current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
