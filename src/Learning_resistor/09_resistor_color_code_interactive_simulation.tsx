"use client";

import { useMemo, useState } from "react";
import { motion } from "./motion";

type BandMode = 4 | 5 | 6;

type DigitColor = {
  name: string;
  bn: string;
  value: number;
  hex: string;
  text: string;
};

type MultiplierColor = {
  name: string;
  bn: string;
  multiplier: number;
  hex: string;
  text: string;
};

type ToleranceColor = {
  name: string;
  bn: string;
  tolerance: number;
  hex: string;
  text: string;
};

type TempColor = {
  name: string;
  bn: string;
  ppm: number;
  hex: string;
  text: string;
};

const digitColors: DigitColor[] = [
  { name: "Black", bn: "কালো", value: 0, hex: "#111827", text: "text-white" },
  { name: "Brown", bn: "বাদামী", value: 1, hex: "#7c2d12", text: "text-white" },
  { name: "Red", bn: "লাল", value: 2, hex: "#dc2626", text: "text-white" },
  { name: "Orange", bn: "কমলা", value: 3, hex: "#f97316", text: "text-white" },
  { name: "Yellow", bn: "হলুদ", value: 4, hex: "#facc15", text: "text-slate-900" },
  { name: "Green", bn: "সবুজ", value: 5, hex: "#16a34a", text: "text-white" },
  { name: "Blue", bn: "নীল", value: 6, hex: "#2563eb", text: "text-white" },
  { name: "Violet", bn: "বেগুনি", value: 7, hex: "#7c3aed", text: "text-white" },
  { name: "Gray", bn: "ধূসর", value: 8, hex: "#9ca3af", text: "text-slate-900" },
  { name: "White", bn: "সাদা", value: 9, hex: "#f8fafc", text: "text-slate-900" },
];

const multiplierColors: MultiplierColor[] = [
  { name: "Black", bn: "কালো", multiplier: 1, hex: "#111827", text: "text-white" },
  { name: "Brown", bn: "বাদামী", multiplier: 10, hex: "#7c2d12", text: "text-white" },
  { name: "Red", bn: "লাল", multiplier: 100, hex: "#dc2626", text: "text-white" },
  { name: "Orange", bn: "কমলা", multiplier: 1000, hex: "#f97316", text: "text-white" },
  { name: "Yellow", bn: "হলুদ", multiplier: 10000, hex: "#facc15", text: "text-slate-900" },
  { name: "Green", bn: "সবুজ", multiplier: 100000, hex: "#16a34a", text: "text-white" },
  { name: "Blue", bn: "নীল", multiplier: 1000000, hex: "#2563eb", text: "text-white" },
  { name: "Violet", bn: "বেগুনি", multiplier: 10000000, hex: "#7c3aed", text: "text-white" },
  { name: "Gray", bn: "ধূসর", multiplier: 100000000, hex: "#9ca3af", text: "text-slate-900" },
  { name: "White", bn: "সাদা", multiplier: 1000000000, hex: "#f8fafc", text: "text-slate-900" },
  { name: "Gold", bn: "সোনালী", multiplier: 0.1, hex: "#d4af37", text: "text-slate-900" },
  { name: "Silver", bn: "রূপালী", multiplier: 0.01, hex: "#c0c0c0", text: "text-slate-900" },
];

const toleranceColors: ToleranceColor[] = [
  { name: "Brown", bn: "বাদামী", tolerance: 1, hex: "#7c2d12", text: "text-white" },
  { name: "Red", bn: "লাল", tolerance: 2, hex: "#dc2626", text: "text-white" },
  { name: "Green", bn: "সবুজ", tolerance: 0.5, hex: "#16a34a", text: "text-white" },
  { name: "Blue", bn: "নীল", tolerance: 0.25, hex: "#2563eb", text: "text-white" },
  { name: "Violet", bn: "বেগুনি", tolerance: 0.1, hex: "#7c3aed", text: "text-white" },
  { name: "Gray", bn: "ধূসর", tolerance: 0.05, hex: "#9ca3af", text: "text-slate-900" },
  { name: "Gold", bn: "সোনালী", tolerance: 5, hex: "#d4af37", text: "text-slate-900" },
  { name: "Silver", bn: "রূপালী", tolerance: 10, hex: "#c0c0c0", text: "text-slate-900" },
];

const tempColors: TempColor[] = [
  { name: "Brown", bn: "বাদামী", ppm: 100, hex: "#7c2d12", text: "text-white" },
  { name: "Red", bn: "লাল", ppm: 50, hex: "#dc2626", text: "text-white" },
  { name: "Orange", bn: "কমলা", ppm: 15, hex: "#f97316", text: "text-white" },
  { name: "Yellow", bn: "হলুদ", ppm: 25, hex: "#facc15", text: "text-slate-900" },
  { name: "Blue", bn: "নীল", ppm: 10, hex: "#2563eb", text: "text-white" },
  { name: "Violet", bn: "বেগুনি", ppm: 5, hex: "#7c3aed", text: "text-white" },
];

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

function formatResistance(value: number) {
  if (value >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 2)} GΩ`;
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)} MΩ`;
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kΩ`;
  return `${formatNumber(value, 2)} Ω`;
}

function getDigit(name: string) {
  return digitColors.find((item) => item.name === name) || digitColors[0];
}

function getMultiplier(name: string) {
  return multiplierColors.find((item) => item.name === name) || multiplierColors[0];
}

function getTolerance(name: string) {
  return toleranceColors.find((item) => item.name === name) || toleranceColors[6];
}

function getTemp(name: string) {
  return tempColors.find((item) => item.name === name) || tempColors[0];
}

function ColorSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ name: string; bn: string; hex: string; text: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm"
      >
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.bn} ({option.name})
          </option>
        ))}
      </select>
    </label>
  );
}

function ResistorSvg({
  mode,
  bands,
}: {
  mode: BandMode;
  bands: Array<{ label: string; color: string; name: string; value: string }>;
}) {
  const positions = mode === 4 ? [235, 285, 335, 455] : mode === 5 ? [220, 265, 310, 360, 470] : [205, 245, 285, 330, 430, 485];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Interactive Resistor Color Code</h2>
          <p className="text-xs text-slate-600">Color band পরিবর্তন করলে resistance value real-time update হয়।</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{mode}-BAND</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 760 300" className="h-auto w-[760px] sm:w-full">
          <defs>
            <linearGradient id="resBody" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fde6b0" />
              <stop offset="55%" stopColor="#e9c27d" />
              <stop offset="100%" stopColor="#c99755" />
            </linearGradient>
          </defs>

          <text x="380" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            Read bands from left to right: digits → multiplier → tolerance → temp coefficient
          </text>

          <line x1="55" y1="150" x2="185" y2="150" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
          <line x1="575" y1="150" x2="705" y2="150" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

          <path
            d="M185 150 C185 88 230 76 265 90 L495 90 C530 76 575 88 575 150 C575 212 530 224 495 210 L265 210 C230 224 185 212 185 150 Z"
            fill="url(#resBody)"
            stroke="#111827"
            strokeWidth="4"
          />

          {bands.map((band, index) => (
            <g key={`${band.label}-${index}`} className="group cursor-help">
              <motion.rect
                x={positions[index]}
                y="91"
                width="22"
                height="118"
                rx="4"
                fill={band.color}
                stroke="#111827"
                strokeWidth="1.5"
                initial={{ scaleY: 0.9, opacity: 0.8 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
              <text x={positions[index] + 11} y="235" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="700">
                {band.label}
              </text>
              <foreignObject x={positions[index] - 55} y="42" width="135" height="48" className="opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-xl bg-slate-950 px-3 py-2 text-[10px] leading-tight text-white shadow-xl">
                  <p className="font-bold">{band.label}</p>
                  <p>{band.name}</p>
                  <p>{band.value}</p>
                </div>
              </foreignObject>
            </g>
          ))}

          <text x="380" y="270" textAnchor="middle" fill="#64748b" fontSize="12">
            Hover each band to see its role
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function ResistorColorCodeSimulation() {
  const [mode, setMode] = useState<BandMode>(4);
  const [band1, setBand1] = useState("Brown");
  const [band2, setBand2] = useState("Black");
  const [band3, setBand3] = useState("Red");
  const [multiplier, setMultiplier] = useState("Brown");
  const [tolerance, setTolerance] = useState("Gold");
  const [temp, setTemp] = useState("Brown");

  const d1 = getDigit(band1);
  const d2 = getDigit(band2);
  const d3 = getDigit(band3);
  const mult = getMultiplier(multiplier);
  const tol = getTolerance(tolerance);
  const tc = getTemp(temp);

  const significant = mode === 4 ? d1.value * 10 + d2.value : d1.value * 100 + d2.value * 10 + d3.value;
  const resistance = significant * mult.multiplier;
  const minResistance = resistance * (1 - tol.tolerance / 100);
  const maxResistance = resistance * (1 + tol.tolerance / 100);

  const bands = useMemo(() => {
    const base = [
      { label: "Band 1", color: d1.hex, name: `${d1.bn} (${d1.name})`, value: `Digit = ${d1.value}` },
      { label: "Band 2", color: d2.hex, name: `${d2.bn} (${d2.name})`, value: `Digit = ${d2.value}` },
    ];

    if (mode >= 5) {
      base.push({ label: "Band 3", color: d3.hex, name: `${d3.bn} (${d3.name})`, value: `Digit = ${d3.value}` });
    }

    base.push({ label: mode === 4 ? "Band 3" : "Band 4", color: mult.hex, name: `${mult.bn} (${mult.name})`, value: `Multiplier = ×${mult.multiplier}` });
    base.push({ label: mode === 4 ? "Band 4" : "Band 5", color: tol.hex, name: `${tol.bn} (${tol.name})`, value: `Tolerance = ±${tol.tolerance}%` });

    if (mode === 6) {
      base.push({ label: "Band 6", color: tc.hex, name: `${tc.bn} (${tc.name})`, value: `Temp = ${tc.ppm} ppm/°C` });
    }

    return base;
  }, [mode, d1, d2, d3, mult, tol, tc]);

  const formulaText = mode === 4
    ? `${d1.value}${d2.value} × ${mult.multiplier} = ${formatResistance(resistance)}`
    : `${d1.value}${d2.value}${d3.value} × ${mult.multiplier} = ${formatResistance(resistance)}`;

  function applyPreset(value: string) {
    if (value === "220") {
      setMode(4); setBand1("Red"); setBand2("Red"); setMultiplier("Brown"); setTolerance("Gold");
    }
    if (value === "1k") {
      setMode(4); setBand1("Brown"); setBand2("Black"); setMultiplier("Red"); setTolerance("Gold");
    }
    if (value === "10k") {
      setMode(4); setBand1("Brown"); setBand2("Black"); setMultiplier("Orange"); setTolerance("Gold");
    }
    if (value === "precision") {
      setMode(5); setBand1("Brown"); setBand2("Black"); setBand3("Black"); setMultiplier("Brown"); setTolerance("Brown");
    }
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">রেজিস্টর কালার কোড — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Color bands দেখে resistor value, tolerance এবং temperature coefficient বুঝতে শেখার জন্য live simulator।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Resistance</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{formatResistance(resistance)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tolerance</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">±{tol.tolerance}%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Min Value</p>
            <p className="mt-2 text-xl font-bold text-green-600">{formatResistance(minResistance)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Max Value</p>
            <p className="mt-2 text-xl font-bold text-red-600">{formatResistance(maxResistance)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Control Panel</h2>

            <div className="mb-5 grid grid-cols-3 gap-2">
              {[4, 5, 6].map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item as BandMode)}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${mode === item ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  {item}-Band
                </button>
              ))}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2">
              <button onClick={() => applyPreset("220")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">220Ω</button>
              <button onClick={() => applyPreset("1k")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">1kΩ</button>
              <button onClick={() => applyPreset("10k")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">10kΩ</button>
              <button onClick={() => applyPreset("precision")} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">1kΩ 1%</button>
            </div>

            <div className="space-y-4">
              <ColorSelect label="Band 1 / First digit" value={band1} options={digitColors.slice(1)} onChange={setBand1} />
              <ColorSelect label="Band 2 / Second digit" value={band2} options={digitColors} onChange={setBand2} />
              {mode >= 5 && <ColorSelect label="Band 3 / Third digit" value={band3} options={digitColors} onChange={setBand3} />}
              <ColorSelect label={mode === 4 ? "Band 3 / Multiplier" : "Band 4 / Multiplier"} value={multiplier} options={multiplierColors} onChange={setMultiplier} />
              <ColorSelect label={mode === 4 ? "Band 4 / Tolerance" : "Band 5 / Tolerance"} value={tolerance} options={toleranceColors} onChange={setTolerance} />
              {mode === 6 && <ColorSelect label="Band 6 / Temperature coefficient" value={temp} options={tempColors} onChange={setTemp} />}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ResistorSvg mode={mode} bands={bands} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Live Formula</h2>
            <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700 ring-1 ring-blue-100">
              <p className="font-semibold text-blue-700">Calculation</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{formulaText}</p>
              <p className="mt-2">Allowed range: {formatResistance(minResistance)} → {formatResistance(maxResistance)}</p>
              {mode === 6 && <p className="mt-1">Temperature coefficient: {tc.ppm} ppm/°C</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">How to Read</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
                <p className="font-semibold text-green-700">Step 1</p>
                <p>প্রথম 2 বা 3 band হলো significant digit।</p>
              </div>
              <div className="rounded-2xl bg-yellow-50 p-4 ring-1 ring-yellow-100">
                <p className="font-semibold text-yellow-700">Step 2</p>
                <p>Multiplier band digit-এর পরে কত zero/scale হবে তা বলে।</p>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                <p className="font-semibold text-red-700">Step 3</p>
                <p>Tolerance band actual value কতটা কম-বেশি হতে পারে তা দেখায়।</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 font-semibold text-slate-900">Common Mistake Warning</h2>
            <div className={`rounded-2xl p-4 text-sm ring-1 ${d1.value === 0 ? "bg-red-50 text-red-700 ring-red-100" : "bg-green-50 text-green-700 ring-green-100"}`}>
              <p className="font-bold">{d1.value === 0 ? "⚠ Invalid first band" : "✅ Band selection looks valid"}</p>
              <p className="mt-1">{d1.value === 0 ? "প্রথম digit band Black হওয়া উচিত নয়, কারণ leading digit 0 হলে value বিভ্রান্তিকর হয়।" : "প্রথম band non-zero, তাই value পড়া ঠিক আছে।"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="mb-4 font-semibold text-slate-900">Color → Number Mapping Table</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-700">
                  <th className="p-3">Color</th>
                  <th className="p-3">Digit</th>
                  <th className="p-3">Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {digitColors.map((color) => {
                  const multItem = multiplierColors.find((item) => item.name === color.name);
                  return (
                    <tr key={color.name} className="border-t transition hover:bg-blue-50">
                      <td className="p-3 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                          {color.bn} ({color.name})
                        </span>
                      </td>
                      <td className="p-3">{color.value}</td>
                      <td className="p-3">{multItem ? `×${multItem.multiplier}` : "—"}</td>
                    </tr>
                  );
                })}
                <tr className="border-t transition hover:bg-blue-50">
                  <td className="p-3 font-semibold"><span className="inline-flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-slate-300 bg-[#d4af37]" />সোনালী (Gold)</span></td>
                  <td className="p-3">—</td>
                  <td className="p-3">×0.1</td>
                </tr>
                <tr className="border-t transition hover:bg-blue-50">
                  <td className="p-3 font-semibold"><span className="inline-flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-slate-300 bg-[#c0c0c0]" />রূপালী (Silver)</span></td>
                  <td className="p-3">—</td>
                  <td className="p-3">×0.01</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
