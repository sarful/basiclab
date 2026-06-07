"use client";

import React, { useMemo, useState } from "react";

type Hole = {
  id: string;
  x: number;
  y: number;
  label: string;
  group: string;
  kind: "power" | "terminal";
};

type Wire = {
  from: string;
  to: string;
  color: string;
};

const W = 1200;
const H = 620;

const rowsTop = ["A", "B", "C", "D", "E"];
const rowsBottom = ["F", "G", "H", "I", "J"];

const wireColors = ["#ef4444", "#2563eb", "#22c55e", "#f59e0b", "#111827"];

export default function BreadboardInteractiveSimulator() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wireColor, setWireColor] = useState(wireColors[0]);
  const [showGroups, setShowGroups] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const holes = useMemo(() => createBreadboardHoles(), []);

  const holeMap = useMemo(() => {
    const map = new Map<string, Hole>();
    holes.forEach((h) => map.set(h.id, h));
    return map;
  }, [holes]);

  function onHoleClick(id: string) {
    if (!selected) {
      setSelected(id);
      return;
    }

    if (selected === id) {
      setSelected(null);
      return;
    }

    setWires((prev) => [...prev, { from: selected, to: id, color: wireColor }]);
    setSelected(null);
  }

  function clearAll() {
    setSelected(null);
    setWires([]);
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Interactive Breadboard Simulator</h1>
            <p className="text-sm text-slate-600">
              Click two holes to connect a jumper wire.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {wireColors.map((c) => (
              <button
                key={c}
                onClick={() => setWireColor(c)}
                className={`h-8 w-8 rounded-full border-2 ${
                  wireColor === c ? "border-black" : "border-slate-300"
                }`}
                style={{ background: c }}
              />
            ))}

            <button
              onClick={() => setShowGroups((v) => !v)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {showGroups ? "Hide Groups" : "Show Groups"}
            </button>

            <button
              onClick={() => setShowLabels((v) => !v)}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
            >
              {showLabels ? "Hide Labels" : "Show Labels"}
            </button>

            <button
              onClick={clearAll}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border bg-slate-50 p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[1000px]">
            <defs>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.18" />
              </filter>

              <linearGradient id="boardGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f7f3e8" />
                <stop offset="100%" stopColor="#e8e1d3" />
              </linearGradient>
            </defs>

            {/* Breadboard body */}
            <rect
              x="30"
              y="35"
              width="1140"
              height="545"
              rx="10"
              fill="url(#boardGrad)"
              stroke="#d3ccbd"
              filter="url(#softShadow)"
            />

            {/* Power rail sections */}
            <RailBox y={45} />
            <RailBox y={495} />

            {/* Terminal strip sections */}
            <rect x="30" y="155" width="1140" height="155" rx="6" fill="#f5efe2" />
            <rect x="30" y="340" width="1140" height="155" rx="6" fill="#f5efe2" />

            {/* DIP center gap */}
            <rect x="30" y="315" width="1140" height="20" fill="#ded8c9" opacity="0.85" />
            <line x1="65" y1="325" x2="1135" y2="325" stroke="#c7bca8" strokeDasharray="8 8" />

            {/* Power rail red/blue lines */}
            <PowerLines y={65} top />
            <PowerLines y={515} />

            {/* Column numbers */}
            {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((n) => {
              const x = colX(n);
              return (
                <g key={`num-${n}`}>
                  <text x={x} y={150} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                    {n}
                  </text>
                  <text x={x} y={490} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                    {n}
                  </text>
                </g>
              );
            })}

            {/* Row labels */}
            {rowsTop.map((r, i) => (
              <React.Fragment key={r}>
                <text x="48" y={185 + i * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {r}
                </text>
                <text x="1152" y={185 + i * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {r}
                </text>
              </React.Fragment>
            ))}

            {rowsBottom.map((r, i) => (
              <React.Fragment key={r}>
                <text x="48" y={375 + i * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {r}
                </text>
                <text x="1152" y={375 + i * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {r}
                </text>
              </React.Fragment>
            ))}

            {/* Connected group highlight */}
            {showGroups &&
              selected &&
              holes
                .filter((h) => h.group === holeMap.get(selected)?.group)
                .map((h) => (
                  <circle key={`hi-${h.id}`} cx={h.x} cy={h.y} r="9" fill="#fde68a" opacity="0.7" />
                ))}

            {/* Jumper wires */}
            {wires.map((w, i) => {
              const a = holeMap.get(w.from);
              const b = holeMap.get(w.to);
              if (!a || !b) return null;

              const midY = Math.min(a.y, b.y) - 40;

              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`}
                  fill="none"
                  stroke={w.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}

            {/* Breadboard holes */}
            {holes.map((h) => {
              const isSelected = selected === h.id;

              return (
                <g key={h.id} onClick={() => onHoleClick(h.id)} className="cursor-pointer">
                  <rect
                    x={h.x - 4.5}
                    y={h.y - 4.5}
                    width="9"
                    height="9"
                    rx="1.2"
                    fill={isSelected ? "#facc15" : "#211f1a"}
                    stroke={isSelected ? "#000" : "#8a8170"}
                    strokeWidth={isSelected ? 2 : 0.7}
                  />
                  <title>{h.label}</title>
                </g>
              );
            })}

            {/* Plus and minus signs */}
            <PowerSigns y={68} />
            <PowerSigns y={538} reverse />

            {/* Educational labels */}
            {showLabels && (
              <>
                <FeatureLabel
                  x={880}
                  y={185}
                  title="Terminal Strips"
                  text="Main connection area: A–E and F–J holes"
                />

                <FeatureLabel
                  x={830}
                  y={75}
                  title="Power Rails"
                  text="+ and − rails distribute VCC and GND"
                />

                <FeatureLabel
                  x={470}
                  y={330}
                  title="DIP Support"
                  text="Center gap supports IC / DIP chip placement"
                />

                <FeatureLabel
                  x={140}
                  y={255}
                  title="Rows & Columns"
                  text="Rows A–J and columns 1–60 locate holes"
                />
              </>
            )}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <InfoCard title="Terminal Strips" text="Main working area where components are inserted." />
          <InfoCard title="Power Rails" text="Used for positive and negative supply lines." />
          <InfoCard title="DIP Support" text="Center gap allows IC chips to sit safely." />
          <InfoCard title="Rows & Columns" text="Labels help locate exact connection points." />
        </div>
      </div>
    </div>
  );
}

function RailBox({ y }: { y: number }) {
  return <rect x="30" y={y} width="1140" height="90" rx="7" fill="#f3eddf" stroke="#d8d0c0" />;
}

function PowerLines({ y, top = false }: { y: number; top?: boolean }) {
  const redY = top ? y : y + 55;
  const blueY = top ? y + 55 : y;

  return (
    <>
      <line x1="80" y1={redY} x2="1120" y2={redY} stroke="#e23b2e" strokeWidth="3" />
      <line x1="80" y1={blueY} x2="1120" y2={blueY} stroke="#1875bd" strokeWidth="3" />
    </>
  );
}

function PowerSigns({ y, reverse = false }: { y: number; reverse?: boolean }) {
  const plusY = reverse ? y + 55 : y;
  const minusY = reverse ? y : y + 55;

  return (
    <>
      <text x="55" y={plusY + 7} className="fill-red-600 text-[28px] font-light">+</text>
      <text x="1135" y={plusY + 7} className="fill-red-600 text-[28px] font-light">+</text>
      <text x="56" y={minusY + 5} className="fill-blue-600 text-[28px] font-light">−</text>
      <text x="1137" y={minusY + 5} className="fill-blue-600 text-[28px] font-light">−</text>
    </>
  );
}

function FeatureLabel({
  x,
  y,
  title,
  text,
}: {
  x: number;
  y: number;
  title: string;
  text: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="285"
        height="66"
        rx="10"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="1.5"
        opacity="0.96"
      />
      <text x={x + 14} y={y + 25} className="fill-slate-900 text-[16px] font-bold">
        {title}
      </text>
      <text x={x + 14} y={y + 48} className="fill-slate-600 text-[12px]">
        {text}
      </text>
    </g>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function colX(col: number) {
  return 70 + (col - 1) * 17.55;
}

function createBreadboardHoles(): Hole[] {
  const holes: Hole[] = [];

  for (let col = 1; col <= 60; col++) {
    rowsTop.forEach((row, ri) => {
      holes.push({
        id: `${row}${col}`,
        x: colX(col),
        y: 180 + ri * 24,
        label: `${row}${col}`,
        group: `top-${col}`,
        kind: "terminal",
      });
    });

    rowsBottom.forEach((row, ri) => {
      holes.push({
        id: `${row}${col}`,
        x: colX(col),
        y: 370 + ri * 24,
        label: `${row}${col}`,
        group: `bottom-${col}`,
        kind: "terminal",
      });
    });
  }

  const railCols = Array.from({ length: 50 }, (_, i) => i + 1);

  railCols.forEach((n) => {
    const x = 95 + (n - 1) * 20.5;

    holes.push({
      id: `TP${n}`,
      x,
      y: 85,
      label: `Top + Rail ${n}`,
      group: `top-plus-${Math.floor((n - 1) / 5)}`,
      kind: "power",
    });

    holes.push({
      id: `TN${n}`,
      x,
      y: 110,
      label: `Top - Rail ${n}`,
      group: `top-minus-${Math.floor((n - 1) / 5)}`,
      kind: "power",
    });

    holes.push({
      id: `BN${n}`,
      x,
      y: 535,
      label: `Bottom - Rail ${n}`,
      group: `bottom-minus-${Math.floor((n - 1) / 5)}`,
      kind: "power",
    });

    holes.push({
      id: `BP${n}`,
      x,
      y: 560,
      label: `Bottom + Rail ${n}`,
      group: `bottom-plus-${Math.floor((n - 1) / 5)}`,
      kind: "power",
    });
  });

  return holes;
}