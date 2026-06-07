"use client";

import React, { useMemo, useState } from "react";

type Hole = {
  id: string;
  x: number;
  y: number;
  group: string;
  label: string;
  type: "terminal" | "power";
};

type Wire = {
  from: string;
  to: string;
  color: string;
};

const ROWS_LEFT = ["A", "B", "C", "D", "E"];
const ROWS_RIGHT = ["F", "G", "H", "I", "J"];
const COLS = Array.from({ length: 30 }, (_, i) => i + 1);
const COLORS = ["#ef4444", "#2563eb", "#22c55e", "#f59e0b", "#111827"];

export default function BreadboardSimulator() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wireColor, setWireColor] = useState(COLORS[0]);
  const [showConnection, setShowConnection] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const holes = useMemo(() => createHoles(), []);
  const holeMap = useMemo(() => new Map(holes.map((h) => [h.id, h])), [holes]);

  const selectedHole = selected ? holeMap.get(selected) : null;

  function handleHoleClick(id: string) {
    if (!selected) {
      setSelected(id);
      return;
    }

    if (selected === id) {
      setSelected(null);
      return;
    }

    setWires((p) => [...p, { from: selected, to: id, color: wireColor }]);
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Interactive Breadboard Simulator</h1>
            <p className="text-sm text-slate-600">
              Click two holes to connect a wire. Click one hole to see internal connection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setWireColor(c)}
                className={`h-8 w-8 rounded-full border-2 ${
                  wireColor === c ? "border-black" : "border-slate-300"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}

            <button
              onClick={() => setShowConnection((v) => !v)}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {showConnection ? "Hide Connection" : "Show Connection"}
            </button>

            <button
              onClick={() => setShowLabels((v) => !v)}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
            >
              {showLabels ? "Hide Labels" : "Show Labels"}
            </button>

            <button
              onClick={() => {
                setWires([]);
                setSelected(null);
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border bg-slate-50 p-3">
          <svg viewBox="0 0 760 1060" className="mx-auto h-auto w-full max-w-[760px]">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.18" />
              </filter>
            </defs>

            <rect
              x="50"
              y="30"
              width="660"
              height="1000"
              rx="18"
              fill="#f8f5df"
              stroke="#111827"
              strokeWidth="3"
              filter="url(#shadow)"
            />

            {/* Power rails */}
            <PowerRail x={85} y={95} side="left" />
            <PowerRail x={645} y={95} side="right" />

            {/* Red/blue rail lines */}
            <line x1="95" y1="110" x2="95" y2="950" stroke="#2563eb" strokeWidth="5" />
            <line x1="125" y1="110" x2="125" y2="950" stroke="#ef4444" strokeWidth="5" />
            <line x1="635" y1="110" x2="635" y2="950" stroke="#2563eb" strokeWidth="5" />
            <line x1="665" y1="110" x2="665" y2="950" stroke="#ef4444" strokeWidth="5" />

            <text x="95" y="65" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">−</text>
            <text x="125" y="65" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">+</text>
            <text x="635" y="65" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">−</text>
            <text x="665" y="65" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">+</text>

            <text x="95" y="1010" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">−</text>
            <text x="125" y="1010" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">+</text>
            <text x="635" y="1010" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">−</text>
            <text x="665" y="1010" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">+</text>

            {/* Header row labels */}
            {ROWS_LEFT.map((r, i) => (
              <text key={r} x={210 + i * 35} y="78" textAnchor="middle" className="fill-black text-[22px]">
                {r}
              </text>
            ))}
            {ROWS_RIGHT.map((r, i) => (
              <text key={r} x={420 + i * 35} y="78" textAnchor="middle" className="fill-black text-[22px]">
                {r}
              </text>
            ))}

            {/* Bottom row labels */}
            {ROWS_LEFT.map((r, i) => (
              <text key={`b-${r}`} x={210 + i * 35} y="1008" textAnchor="middle" className="fill-black text-[22px]">
                {r}
              </text>
            ))}
            {ROWS_RIGHT.map((r, i) => (
              <text key={`br-${r}`} x={420 + i * 35} y="1008" textAnchor="middle" className="fill-black text-[22px]">
                {r}
              </text>
            ))}

            {/* Column numbers */}
            {COLS.map((n) => (
              <React.Fragment key={n}>
                <text x="175" y={rowY(n) + 7} textAnchor="middle" className="fill-black text-[19px]">
                  {n}
                </text>
                <text x="585" y={rowY(n) + 7} textAnchor="middle" className="fill-black text-[19px]">
                  {n}
                </text>
              </React.Fragment>
            ))}

            {/* DIP support center gap */}
            <rect x="365" y="95" width="30" height="860" fill="#efe8c7" stroke="#c7b36b" strokeDasharray="8 8" />
            {showLabels && (
              <g>
                <rect x="260" y="465" width="240" height="70" rx="12" fill="white" stroke="#334155" />
                <text x="380" y="493" textAnchor="middle" className="fill-slate-900 text-[18px] font-bold">
                  DIP Support
                </text>
                <text x="380" y="518" textAnchor="middle" className="fill-slate-600 text-[13px]">
                  IC chip sits across this center gap
                </text>
              </g>
            )}

            {/* Connection highlight */}
            {showConnection &&
              selectedHole &&
              holes
                .filter((h) => h.group === selectedHole.group)
                .map((h) => (
                  <rect
                    key={`hi-${h.id}`}
                    x={h.x - 14}
                    y={h.y - 11}
                    width="28"
                    height="22"
                    rx="4"
                    fill="#facc15"
                    opacity="0.75"
                  />
                ))}

            {/* Wires */}
            {wires.map((w, i) => {
              const a = holeMap.get(w.from);
              const b = holeMap.get(w.to);
              if (!a || !b) return null;
              const midX = (a.x + b.x) / 2;

              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} C ${midX} ${a.y - 60}, ${midX} ${b.y - 60}, ${b.x} ${b.y}`}
                  fill="none"
                  stroke={w.color}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}

            {/* Holes */}
            {holes.map((h) => {
              const active = selected === h.id;

              return (
                <g key={h.id} onClick={() => handleHoleClick(h.id)} className="cursor-pointer">
                  <rect
                    x={h.x - 11}
                    y={h.y - 8}
                    width="22"
                    height="16"
                    rx="3"
                    fill={active ? "#facc15" : "#fff7aa"}
                    stroke={active ? "#111827" : "#111827"}
                    strokeWidth={active ? 3 : 1.4}
                  />
                  <line x1={h.x - 8} y1={h.y} x2={h.x + 8} y2={h.y} stroke="#777" strokeWidth="1" />
                  <title>{h.label}</title>
                </g>
              );
            })}

            {/* Educational labels */}
            {showLabels && (
              <>
                <FeatureLabel
                  x={25}
                  y={355}
                  title="Power Rails"
                  text="+ and − supply lines"
                  lineToX={110}
                  lineToY={360}
                />

                <FeatureLabel
                  x={210}
                  y={150}
                  title="Terminal Strips"
                  text="A–E connected by column"
                  lineToX={260}
                  lineToY={210}
                />

                <FeatureLabel
                  x={430}
                  y={150}
                  title="Terminal Strips"
                  text="F–J connected by column"
                  lineToX={485}
                  lineToY={210}
                />

                <FeatureLabel
                  x={210}
                  y={900}
                  title="Rows & Columns"
                  text="A–J rows, 1–30 columns"
                  lineToX={275}
                  lineToY={855}
                />
              </>
            )}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <InfoCard title="Terminal Strips" text="A–E and F–J are main component connection zones." />
          <InfoCard title="Power Rails" text="Red rail is positive, blue rail is negative/GND." />
          <InfoCard title="DIP Support" text="Center gap supports DIP IC placement like 555 timer." />
          <InfoCard title="Rows & Columns" text="Hole address like A1, E10, J30 helps circuit building." />
        </div>
      </div>
    </div>
  );
}

function PowerRail({ x, y, side }: { x: number; y: number; side: "left" | "right" }) {
  const holes = Array.from({ length: 30 }, (_, i) => i + 1);
  const blueX = side === "left" ? x + 10 : x - 10;
  const redX = side === "left" ? x + 40 : x + 20;

  return (
    <>
      {holes.map((n) => (
        <React.Fragment key={`${side}-rail-${n}`}>
          <rect
            x={blueX - 10}
            y={rowY(n) - 8}
            width="22"
            height="16"
            rx="3"
            fill="#fff7aa"
            stroke="#111827"
            strokeWidth="1.4"
          />
          <rect
            x={redX - 10}
            y={rowY(n) - 8}
            width="22"
            height="16"
            rx="3"
            fill="#fff7aa"
            stroke="#111827"
            strokeWidth="1.4"
          />
        </React.Fragment>
      ))}
    </>
  );
}

function FeatureLabel({
  x,
  y,
  title,
  text,
  lineToX,
  lineToY,
}: {
  x: number;
  y: number;
  title: string;
  text: string;
  lineToX: number;
  lineToY: number;
}) {
  return (
    <g>
      <line x1={x + 90} y1={y + 60} x2={lineToX} y2={lineToY} stroke="#0f172a" strokeWidth="2" />
      <rect x={x} y={y} width="180" height="62" rx="10" fill="white" stroke="#0f172a" opacity="0.96" />
      <text x={x + 12} y={y + 24} className="fill-slate-900 text-[15px] font-bold">
        {title}
      </text>
      <text x={x + 12} y={y + 47} className="fill-slate-600 text-[12px]">
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

function rowY(n: number) {
  return 105 + (n - 1) * 28;
}

function createHoles(): Hole[] {
  const holes: Hole[] = [];

  COLS.forEach((col) => {
    ROWS_LEFT.forEach((row, i) => {
      holes.push({
        id: `${row}${col}`,
        x: 210 + i * 35,
        y: rowY(col),
        group: `left-${col}`,
        label: `${row}${col} connected with A-E column ${col}`,
        type: "terminal",
      });
    });

    ROWS_RIGHT.forEach((row, i) => {
      holes.push({
        id: `${row}${col}`,
        x: 420 + i * 35,
        y: rowY(col),
        group: `right-${col}`,
        label: `${row}${col} connected with F-J column ${col}`,
        type: "terminal",
      });
    });

    holes.push({
      id: `L-${col}`,
      x: 95,
      y: rowY(col),
      group: "left-negative-rail",
      label: `Left negative rail ${col}`,
      type: "power",
    });

    holes.push({
      id: `L+${col}`,
      x: 125,
      y: rowY(col),
      group: "left-positive-rail",
      label: `Left positive rail ${col}`,
      type: "power",
    });

    holes.push({
      id: `R-${col}`,
      x: 635,
      y: rowY(col),
      group: "right-negative-rail",
      label: `Right negative rail ${col}`,
      type: "power",
    });

    holes.push({
      id: `R+${col}`,
      x: 665,
      y: rowY(col),
      group: "right-positive-rail",
      label: `Right positive rail ${col}`,
      type: "power",
    });
  });

  return holes;
}