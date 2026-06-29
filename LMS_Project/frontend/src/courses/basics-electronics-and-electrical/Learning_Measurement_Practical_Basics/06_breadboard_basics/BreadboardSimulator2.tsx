"use client";

import React, { useMemo, useState } from "react";

import BreadboardInfoCard from "./components/BreadboardInfoCard";
import BreadboardSimulatorToolbar from "./components/BreadboardSimulatorToolbar";
import { breadboardWireColors, type BreadboardWire } from "./simulatorOneData";
import {
  createSimulatorTwoHoles,
  simulatorTwoColumns,
  simulatorTwoRowY,
  simulatorTwoRowsLeft,
  simulatorTwoRowsRight,
  type BreadboardStripHole,
} from "./simulatorTwoData";
import {
  SimulatorTwoFeatureLabel,
  SimulatorTwoPowerRail,
} from "./simulatorTwoSvgParts";

export default function BreadboardSimulator() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wires, setWires] = useState<BreadboardWire[]>([]);
  const [wireColor, setWireColor] = useState<string>(breadboardWireColors[0]);
  const [showConnection, setShowConnection] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const holes = useMemo(() => createSimulatorTwoHoles(), []);
  const holeMap = useMemo(() => new Map(holes.map((hole) => [hole.id, hole])), [holes]);
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

    setWires((previous) => [
      ...previous,
      { color: wireColor, from: selected, to: id },
    ]);
    setSelected(null);
  }

  function clearAll() {
    setWires([]);
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-4 shadow-xl">
        <BreadboardSimulatorToolbar
          colors={[...breadboardWireColors]}
          description="Click two holes to connect a wire. Click one hole to see internal connection."
          primaryToggleLabel={showConnection ? "Hide Connection" : "Show Connection"}
          secondaryToggleLabel={showLabels ? "Hide Labels" : "Show Labels"}
          selectedColor={wireColor}
          title="Interactive Breadboard Simulator"
          onClear={clearAll}
          onSelectColor={setWireColor}
          onTogglePrimary={() => setShowConnection((value) => !value)}
          onToggleSecondary={() => setShowLabels((value) => !value)}
        />

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

            <SimulatorTwoPowerRail x={85} side="left" />
            <SimulatorTwoPowerRail x={645} side="right" />

            <line x1="95" y1="110" x2="95" y2="950" stroke="#2563eb" strokeWidth="5" />
            <line x1="125" y1="110" x2="125" y2="950" stroke="#ef4444" strokeWidth="5" />
            <line x1="635" y1="110" x2="635" y2="950" stroke="#2563eb" strokeWidth="5" />
            <line x1="665" y1="110" x2="665" y2="950" stroke="#ef4444" strokeWidth="5" />

            <text x="95" y="65" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">
              -
            </text>
            <text x="125" y="65" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">
              +
            </text>
            <text x="635" y="65" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">
              -
            </text>
            <text x="665" y="65" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">
              +
            </text>

            <text x="95" y="1010" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">
              -
            </text>
            <text x="125" y="1010" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">
              +
            </text>
            <text x="635" y="1010" textAnchor="middle" className="fill-blue-700 text-[24px] font-bold">
              -
            </text>
            <text x="665" y="1010" textAnchor="middle" className="fill-red-600 text-[28px] font-bold">
              +
            </text>

            {simulatorTwoRowsLeft.map((row, index) => (
              <text key={row} x={210 + index * 35} y="78" textAnchor="middle" className="fill-black text-[22px]">
                {row}
              </text>
            ))}
            {simulatorTwoRowsRight.map((row, index) => (
              <text key={row} x={420 + index * 35} y="78" textAnchor="middle" className="fill-black text-[22px]">
                {row}
              </text>
            ))}

            {simulatorTwoRowsLeft.map((row, index) => (
              <text key={`b-${row}`} x={210 + index * 35} y="1008" textAnchor="middle" className="fill-black text-[22px]">
                {row}
              </text>
            ))}
            {simulatorTwoRowsRight.map((row, index) => (
              <text key={`br-${row}`} x={420 + index * 35} y="1008" textAnchor="middle" className="fill-black text-[22px]">
                {row}
              </text>
            ))}

            {simulatorTwoColumns.map((column) => (
              <React.Fragment key={column}>
                <text x="175" y={simulatorTwoRowY(column) + 7} textAnchor="middle" className="fill-black text-[19px]">
                  {column}
                </text>
                <text x="585" y={simulatorTwoRowY(column) + 7} textAnchor="middle" className="fill-black text-[19px]">
                  {column}
                </text>
              </React.Fragment>
            ))}

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

            {showConnection &&
              selectedHole &&
              holes
                .filter((hole) => hole.group === selectedHole.group)
                .map((hole) => (
                  <rect
                    key={`hi-${hole.id}`}
                    x={hole.x - 14}
                    y={hole.y - 11}
                    width="28"
                    height="22"
                    rx="4"
                    fill="#facc15"
                    opacity="0.75"
                  />
                ))}

            {wires.map((wire, index) => {
              const fromHole = holeMap.get(wire.from);
              const toHole = holeMap.get(wire.to);
              if (!fromHole || !toHole) return null;
              const midX = (fromHole.x + toHole.x) / 2;

              return (
                <path
                  key={`${wire.from}-${wire.to}-${index}`}
                  d={`M ${fromHole.x} ${fromHole.y} C ${midX} ${fromHole.y - 60}, ${midX} ${toHole.y - 60}, ${toHole.x} ${toHole.y}`}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}

            {holes.map((hole) => {
              const active = selected === hole.id;

              return (
                <g key={hole.id} onClick={() => handleHoleClick(hole.id)} className="cursor-pointer">
                  <rect
                    x={hole.x - 11}
                    y={hole.y - 8}
                    width="22"
                    height="16"
                    rx="3"
                    fill={active ? "#facc15" : "#fff7aa"}
                    stroke="#111827"
                    strokeWidth={active ? 3 : 1.4}
                  />
                  <line x1={hole.x - 8} y1={hole.y} x2={hole.x + 8} y2={hole.y} stroke="#777" strokeWidth="1" />
                  <title>{hole.label}</title>
                </g>
              );
            })}

            {showLabels && (
              <>
                <SimulatorTwoFeatureLabel
                  x={25}
                  y={355}
                  title="Power Rails"
                  text="+ and - supply lines"
                  lineToX={110}
                  lineToY={360}
                />
                <SimulatorTwoFeatureLabel
                  x={210}
                  y={150}
                  title="Terminal Strips"
                  text="A-E connected by column"
                  lineToX={260}
                  lineToY={210}
                />
                <SimulatorTwoFeatureLabel
                  x={430}
                  y={150}
                  title="Terminal Strips"
                  text="F-J connected by column"
                  lineToX={485}
                  lineToY={210}
                />
                <SimulatorTwoFeatureLabel
                  x={210}
                  y={900}
                  title="Rows & Columns"
                  text="A-J rows, 1-30 columns"
                  lineToX={275}
                  lineToY={855}
                />
              </>
            )}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <BreadboardInfoCard title="Terminal Strips" text="A-E and F-J are main component connection zones." />
          <BreadboardInfoCard title="Power Rails" text="Red rail is positive, blue rail is negative/GND." />
          <BreadboardInfoCard title="DIP Support" text="Center gap supports DIP IC placement like 555 timer." />
          <BreadboardInfoCard title="Rows & Columns" text="Hole address like A1, E10, J30 helps circuit building." />
        </div>
      </div>
    </div>
  );
}
