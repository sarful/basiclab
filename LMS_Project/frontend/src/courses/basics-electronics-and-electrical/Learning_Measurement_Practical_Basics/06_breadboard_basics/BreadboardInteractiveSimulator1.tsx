"use client";

import React, { useMemo, useState } from "react";

import BreadboardInfoCard from "./components/BreadboardInfoCard";
import BreadboardSimulatorToolbar from "./components/BreadboardSimulatorToolbar";
import {
  breadboardCanvasSize,
  breadboardWireColors,
  createSimulatorOneHoles,
  simulatorOneColX,
  simulatorOneRowsBottom,
  simulatorOneRowsTop,
  type BreadboardHole,
  type BreadboardWire,
} from "./simulatorOneData";
import {
  SimulatorOneFeatureLabel,
  SimulatorOnePowerLines,
  SimulatorOnePowerSigns,
  SimulatorOneRailBox,
} from "./simulatorOneSvgParts";

export default function BreadboardInteractiveSimulator() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wires, setWires] = useState<BreadboardWire[]>([]);
  const [wireColor, setWireColor] = useState<string>(breadboardWireColors[0]);
  const [showGroups, setShowGroups] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const holes = useMemo(() => createSimulatorOneHoles(), []);

  const holeMap = useMemo(() => {
    const map = new Map<string, BreadboardHole>();
    holes.forEach((hole) => map.set(hole.id, hole));
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

    setWires((previous) => [
      ...previous,
      { color: wireColor, from: selected, to: id },
    ]);
    setSelected(null);
  }

  function clearAll() {
    setSelected(null);
    setWires([]);
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-4 shadow-xl">
        <BreadboardSimulatorToolbar
          colors={[...breadboardWireColors]}
          description="Click two holes to connect a jumper wire."
          primaryToggleLabel={showGroups ? "Hide Groups" : "Show Groups"}
          secondaryToggleLabel={showLabels ? "Hide Labels" : "Show Labels"}
          selectedColor={wireColor}
          title="Interactive Breadboard Simulator"
          onClear={clearAll}
          onSelectColor={setWireColor}
          onTogglePrimary={() => setShowGroups((value) => !value)}
          onToggleSecondary={() => setShowLabels((value) => !value)}
        />

        <div className="overflow-auto rounded-xl border bg-slate-50 p-3">
          <svg
            viewBox={`0 0 ${breadboardCanvasSize.width} ${breadboardCanvasSize.height}`}
            className="h-auto w-full min-w-[1000px]"
          >
            <defs>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.18" />
              </filter>

              <linearGradient id="boardGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f7f3e8" />
                <stop offset="100%" stopColor="#e8e1d3" />
              </linearGradient>
            </defs>

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

            <SimulatorOneRailBox y={45} />
            <SimulatorOneRailBox y={495} />

            <rect x="30" y="155" width="1140" height="155" rx="6" fill="#f5efe2" />
            <rect x="30" y="340" width="1140" height="155" rx="6" fill="#f5efe2" />

            <rect x="30" y="315" width="1140" height="20" fill="#ded8c9" opacity="0.85" />
            <line x1="65" y1="325" x2="1135" y2="325" stroke="#c7bca8" strokeDasharray="8 8" />

            <SimulatorOnePowerLines y={65} top />
            <SimulatorOnePowerLines y={515} />

            {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((number) => {
              const x = simulatorOneColX(number);
              return (
                <g key={`num-${number}`}>
                  <text x={x} y={150} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                    {number}
                  </text>
                  <text x={x} y={490} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                    {number}
                  </text>
                </g>
              );
            })}

            {simulatorOneRowsTop.map((row, index) => (
              <React.Fragment key={row}>
                <text x="48" y={185 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {row}
                </text>
                <text x="1152" y={185 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {row}
                </text>
              </React.Fragment>
            ))}

            {simulatorOneRowsBottom.map((row, index) => (
              <React.Fragment key={row}>
                <text x="48" y={375 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {row}
                </text>
                <text x="1152" y={375 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                  {row}
                </text>
              </React.Fragment>
            ))}

            {showGroups &&
              selected &&
              holes
                .filter((hole) => hole.group === holeMap.get(selected)?.group)
                .map((hole) => (
                  <circle key={`hi-${hole.id}`} cx={hole.x} cy={hole.y} r="9" fill="#fde68a" opacity="0.7" />
                ))}

            {wires.map((wire, index) => {
              const fromHole = holeMap.get(wire.from);
              const toHole = holeMap.get(wire.to);
              if (!fromHole || !toHole) return null;

              const midY = Math.min(fromHole.y, toHole.y) - 40;

              return (
                <path
                  key={`${wire.from}-${wire.to}-${index}`}
                  d={`M ${fromHole.x} ${fromHole.y} C ${fromHole.x} ${midY}, ${toHole.x} ${midY}, ${toHole.x} ${toHole.y}`}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}

            {holes.map((hole) => {
              const isSelected = selected === hole.id;

              return (
                <g key={hole.id} onClick={() => onHoleClick(hole.id)} className="cursor-pointer">
                  <rect
                    x={hole.x - 4.5}
                    y={hole.y - 4.5}
                    width="9"
                    height="9"
                    rx="1.2"
                    fill={isSelected ? "#facc15" : "#211f1a"}
                    stroke={isSelected ? "#000" : "#8a8170"}
                    strokeWidth={isSelected ? 2 : 0.7}
                  />
                  <title>{hole.label}</title>
                </g>
              );
            })}

            <SimulatorOnePowerSigns y={68} />
            <SimulatorOnePowerSigns y={538} reverse />

            {showLabels && (
              <>
                <SimulatorOneFeatureLabel
                  x={880}
                  y={185}
                  title="Terminal Strips"
                  text="Main connection area: A-E and F-J holes"
                />
                <SimulatorOneFeatureLabel
                  x={830}
                  y={75}
                  title="Power Rails"
                  text="+ and - rails distribute VCC and GND"
                />
                <SimulatorOneFeatureLabel
                  x={470}
                  y={330}
                  title="DIP Support"
                  text="Center gap supports IC / DIP chip placement"
                />
                <SimulatorOneFeatureLabel
                  x={140}
                  y={255}
                  title="Rows & Columns"
                  text="Rows A-J and columns 1-60 locate holes"
                />
              </>
            )}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <BreadboardInfoCard title="Terminal Strips" text="Main working area where components are inserted." />
          <BreadboardInfoCard title="Power Rails" text="Used for positive and negative supply lines." />
          <BreadboardInfoCard title="DIP Support" text="Center gap allows IC chips to sit safely." />
          <BreadboardInfoCard title="Rows & Columns" text="Labels help locate exact connection points." />
        </div>
      </div>
    </div>
  );
}
