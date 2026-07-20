"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FaultMode =
  | "normal"
  | "lowWater"
  | "overPressure"
  | "fouledTubes"
  | "feedPumpFailure"
  | "blockedChimney"
  | "weakDraft";

type SimulationState = {
  phase: number;

  fuelRate: number;
  feedwaterRate: number;
  steamDemand: number;
  draftLevel: number;

  effectiveFuelRate: number;
  effectiveFeedwaterRate: number;
  effectiveSteamDemand: number;
  effectiveDraftLevel: number;

  fireIntensity: number;
  flueGasFlow: number;
  heatTransfer: number;
  steamGeneration: number;

  waterLevelPercent: number;
  pressureBar: number;
  waterTempC: number;
  steamTempC: number;
  furnaceTempC: number;
  stackTempC: number;

  efficiencyPercent: number;
  safetyValveOpen: boolean;
  lowWaterAlarm: boolean;
  highPressureAlarm: boolean;

  currentZone: string;
  learningNote: string;
  faultDescription: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computeSimulation(
  phase: number,
  fuelRate: number,
  feedwaterRate: number,
  steamDemand: number,
  draftLevel: number,
  faultMode: FaultMode
): SimulationState {
  const effectiveFuelRate =
    faultMode === "overPressure" ? Math.min(100, fuelRate + 25) : fuelRate;

  const effectiveFeedwaterRate =
    faultMode === "feedPumpFailure"
      ? Math.max(0, feedwaterRate * 0.15)
      : faultMode === "lowWater"
        ? Math.max(0, feedwaterRate * 0.35)
        : feedwaterRate;

  const effectiveSteamDemand =
    faultMode === "overPressure" ? Math.max(10, steamDemand * 0.45) : steamDemand;

  const effectiveDraftLevel =
    faultMode === "blockedChimney"
      ? Math.max(5, draftLevel * 0.25)
      : faultMode === "weakDraft"
        ? Math.max(10, draftLevel * 0.45)
        : draftLevel;

  const fuelFactor = effectiveFuelRate / 100;
  const feedFactor = effectiveFeedwaterRate / 100;
  const demandFactor = effectiveSteamDemand / 100;
  const draftFactor = effectiveDraftLevel / 100;

  const foulingPenalty = faultMode === "fouledTubes" ? 0.48 : 1;
  const draftPenalty =
    faultMode === "blockedChimney" ? 0.42 : faultMode === "weakDraft" ? 0.62 : 1;

  const firePulse = 0.86 + Math.sin(phase * Math.PI * 2) * 0.08;
  const fireIntensity = clamp(fuelFactor * draftFactor * firePulse, 0, 1);

  const flueGasFlow = clamp(fireIntensity * draftPenalty, 0, 1);
  const heatTransfer = clamp(flueGasFlow * foulingPenalty * 0.96, 0, 1);

  const feedEffect = feedFactor * 0.65;
  const demandEffect = demandFactor * 0.75;

  const baseWaterLevel = 62 + feedEffect * 28 - demandEffect * 22 - fuelFactor * 8;

  const waterLevelPercent = clamp(
    faultMode === "lowWater"
      ? baseWaterLevel - 34
      : faultMode === "feedPumpFailure"
        ? baseWaterLevel - 26
        : baseWaterLevel,
    5,
    95
  );

  const lowWaterPenalty = waterLevelPercent < 28 ? 0.62 : 1;

  const steamGeneration = clamp(
    heatTransfer * lowWaterPenalty * (0.55 + waterLevelPercent / 180),
    0,
    1
  );

  const pressureBar = clamp(
    1.2 +
      steamGeneration * 12.5 -
      demandFactor * 5.2 +
      (faultMode === "overPressure" ? 6.5 : 0) +
      (faultMode === "blockedChimney" ? 2.5 : 0),
    0.6,
    22
  );

  const safetyValveOpen = pressureBar > 15.5;
  const highPressureAlarm = pressureBar > 14;
  const lowWaterAlarm = waterLevelPercent < 25;

  const waterTempC = clamp(
    45 + heatTransfer * 128 + pressureBar * 2.2 - demandFactor * 10,
    35,
    210
  );

  const steamTempC = clamp(
    waterTempC + 12 + pressureBar * 2.8 + fireIntensity * 38,
    80,
    285
  );

  const furnaceTempC = clamp(
    250 + fireIntensity * 980 + fuelFactor * 160,
    150,
    1450
  );

  const stackTempC = clamp(
    90 +
      flueGasFlow * 260 +
      (faultMode === "fouledTubes" ? 120 : 0) +
      (faultMode === "blockedChimney" ? 90 : 0),
    60,
    520
  );

  const efficiencyPercent = Math.round(
    clamp(72 + heatTransfer * 18 - (stackTempC - 180) * 0.035, 35, 90)
  );

  const currentZone =
    fireIntensity > 0.65
      ? "Furnace heating"
      : steamGeneration > 0.5
        ? "Steam generation"
        : flueGasFlow > 0.35
          ? "Hot gas through fire tubes"
          : feedFactor > 0.5
            ? "Feedwater entering shell"
            : "Standby heating";

  const learningNote =
    lowWaterAlarm
      ? "Low water exposes fire tubes. In real boilers this is dangerous because overheated metal can fail."
      : safetyValveOpen
        ? "Safety valve is releasing steam because pressure is too high."
        : faultMode === "fouledTubes"
          ? "Fouled tubes reduce heat transfer, so more heat escapes toward the chimney."
          : faultMode === "blockedChimney"
            ? "Blocked chimney restricts draft and slows hot-gas flow."
            : faultMode === "weakDraft"
              ? "Weak draft lowers air supply, combustion strength, and flue-gas flow."
              : steamGeneration > 0.6
                ? "Water absorbs heat from the fire tubes and steam collects in the steam space."
                : flueGasFlow > 0.35
                  ? "Hot gas flows from firebox through fire tubes into the smoke box and chimney."
                  : "Increase fuel and draft to see stronger fire-tube heat transfer.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal educational fire-tube boiler operation."
      : faultMode === "lowWater"
        ? "Low water level exposes tubes and triggers an alarm."
        : faultMode === "overPressure"
          ? "Over pressure occurs when steam generation is high but steam demand is too low."
          : faultMode === "fouledTubes"
            ? "Fouled tubes reduce heat transfer from hot gas to water."
            : faultMode === "feedPumpFailure"
              ? "Feed pump failure reduces incoming water and lowers water level."
              : faultMode === "blockedChimney"
                ? "Blocked chimney restricts flue gas flow and weakens draft."
                : "Weak draft reduces combustion air and lowers flue gas flow.";

  return {
    phase,

    fuelRate,
    feedwaterRate,
    steamDemand,
    draftLevel,

    effectiveFuelRate,
    effectiveFeedwaterRate,
    effectiveSteamDemand,
    effectiveDraftLevel,

    fireIntensity,
    flueGasFlow,
    heatTransfer,
    steamGeneration,

    waterLevelPercent,
    pressureBar: Number(pressureBar.toFixed(1)),
    waterTempC: Math.round(waterTempC),
    steamTempC: Math.round(steamTempC),
    furnaceTempC: Math.round(furnaceTempC),
    stackTempC: Math.round(stackTempC),

    efficiencyPercent,
    safetyValveOpen,
    lowWaterAlarm,
    highPressureAlarm,

    currentZone,
    learningNote,
    faultDescription,
  };
}

export default function FireTubeBoilerLearningSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [fuelRate, setFuelRate] = useState(55);
  const [feedwaterRate, setFeedwaterRate] = useState(55);
  const [steamDemand, setSteamDemand] = useState(45);
  const [draftLevel, setDraftLevel] = useState(70);
  const [faultMode, setFaultMode] = useState<FaultMode>("normal");

  const [showLabels, setShowLabels] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [showHotGas, setShowHotGas] = useState(true);
  const [showSteam, setShowSteam] = useState(true);
  const [showHeat, setShowHeat] = useState(true);
  const [showSafety, setShowSafety] = useState(true);
  const [canvasScale, setCanvasScale] = useState(1);

  const lastFrameRef = useRef<number | null>(null);

  const simulation = useMemo(
    () =>
      computeSimulation(
        phase,
        fuelRate,
        feedwaterRate,
        steamDemand,
        draftLevel,
        faultMode
      ),
    [phase, fuelRate, feedwaterRate, steamDemand, draftLevel, faultMode]
  );

  const graphSamples = useMemo(() => {
    return Array.from({ length: 140 }).map((_, index) =>
      computeSimulation(
        index / 139,
        fuelRate,
        feedwaterRate,
        steamDemand,
        draftLevel,
        faultMode
      )
    );
  }, [fuelRate, feedwaterRate, steamDemand, draftLevel, faultMode]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return;
    }

    let frameId = 0;

    const tick = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;

      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      setPhase((prev) => (prev + delta * speed * 0.18) % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const ControlSlider = ({
    label,
    value,
    min,
    max,
    step = 1,
    suffix = "",
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    onChange: (value: number) => void;
  }) => (
    <label className="block">
      <div className="mb-1 flex justify-between text-xs text-neutral-700">
        <span>{label}</span>
        <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono text-[11px]">
          {value.toFixed(step < 1 ? 1 : 0)}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-neutral-900"
      />
    </label>
  );

  const ToggleButton = ({
    active,
    label,
    onClick,
  }: {
    active: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold ${
        active
          ? "bg-neutral-900 text-white"
          : "border border-neutral-300 bg-white text-neutral-700"
      }`}
    >
      {label}
    </button>
  );

  const GaugeBar = ({
    label,
    value,
    max,
    suffix,
  }: {
    label: string;
    value: number;
    max: number;
    suffix: string;
  }) => {
    const percent = clamp((value / max) * 100, 0, 100);

    return (
      <div>
        <div className="mb-1 flex justify-between text-xs text-neutral-700">
          <span>{label}</span>
          <span className="font-mono">
            {value}
            {suffix}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-neutral-900"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  const StatusPill = ({ active }: { active: boolean }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        active ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {active ? "ON" : "OFF"}
    </span>
  );

  const BoilerStatusTable = () => {
    const rows = [
      {
        name: "Firebox",
        value: simulation.fireIntensity > 0.05 ? "Burning" : "Low",
        active: simulation.fireIntensity > 0.2,
      },
      {
        name: "Draft fan",
        value: simulation.effectiveDraftLevel > 20 ? "Running" : "Weak",
        active: simulation.effectiveDraftLevel > 20,
      },
      {
        name: "Flue gas",
        value: simulation.flueGasFlow > 0.05 ? "Flowing" : "Low",
        active: simulation.flueGasFlow > 0.2,
      },
      {
        name: "Steam generation",
        value: simulation.steamGeneration > 0.05 ? "Active" : "Low",
        active: simulation.steamGeneration > 0.25,
      },
      {
        name: "Safety valve",
        value: simulation.safetyValveOpen ? "Open" : "Closed",
        active: simulation.safetyValveOpen,
      },
      {
        name: "Low water alarm",
        value: simulation.lowWaterAlarm ? "Alarm" : "Normal",
        active: simulation.lowWaterAlarm,
      },
      {
        name: "Tube fouling",
        value: faultMode === "fouledTubes" ? "Dirty" : "Clean",
        active: faultMode === "fouledTubes",
      },
    ];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Boiler Status
        </h3>

        <div className="overflow-hidden rounded-lg border border-neutral-200 text-xs">
          <div className="grid grid-cols-[1fr_auto] bg-neutral-100 px-3 py-2 font-bold text-neutral-700">
            <span>Component</span>
            <span>Status</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[1fr_auto] items-center border-t border-neutral-200 px-3 py-2"
            >
              <span>{row.name}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono">{row.value}</span>
                <StatusPill active={row.active} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MiniGraph = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <h4 className="mb-2 text-xs font-bold text-neutral-900">{title}</h4>

      <svg viewBox="0 0 320 120" className="h-auto w-full">
        <rect x="0" y="0" width="320" height="120" rx="10" fill="#f5f5f5" />
        <line x1="28" y1="95" x2="296" y2="95" stroke="#999" />
        <line x1="28" y1="20" x2="28" y2="95" stroke="#999" />

        {[0, 25, 50, 75, 100].map((mark) => {
          const x = 28 + (mark / 100) * 268;

          return (
            <g key={mark}>
              <line x1={x} y1="20" x2={x} y2="95" stroke="#ddd" />
              <text x={x} y="110" fontSize="8" textAnchor="middle" fill="#666">
                {mark}
              </text>
            </g>
          );
        })}

        {children}
      </svg>
    </div>
  );

  const PressureGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(sample.pressureBar / 22, 0, 1) * 75;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY = 95 - clamp(simulation.pressureBar / 22, 0, 1) * 75;

    return (
      <MiniGraph title="Steam Pressure">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const WaterLevelGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(sample.waterLevelPercent / 100, 0, 1) * 75;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY = 95 - clamp(simulation.waterLevelPercent / 100, 0, 1) * 75;

    return (
      <MiniGraph title="Water Level">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const ComponentMarker = ({
    x,
    y,
    number,
  }: {
    x: number;
    y: number;
    number: number;
  }) =>
    showLabels ? (
      <g>
        <circle cx={x} cy={y} r="14" fill="#111" stroke="#fff" strokeWidth="3" />
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fill="#fff"
        >
          {number}
        </text>
      </g>
    ) : null;

  const LegendPanel = () =>
    showLabels ? (
      <g transform="translate(710 500)">
        <rect
          x="0"
          y="0"
          width="235"
          height="180"
          rx="16"
          fill="#fff"
          opacity="0.94"
          stroke="#111"
          strokeWidth="3"
        />

        <text x="118" y="24" textAnchor="middle" fontSize="13" fontWeight="900">
          Component Legend
        </text>

        {[
          "Firebox + furnace",
          "Fire tubes",
          "Smoke box",
          "Steam outlet + stop valve",
          "Safety valve",
          "Water gauge",
          "Feed pump + check valve",
          "Draft fan / air damper",
          "Blowdown valve",
          "Fusible plug",
        ].map((text, index) => (
          <g key={text} transform={`translate(14 ${45 + index * 13})`}>
            <circle cx="6" cy="-4" r="7" fill="#111" />
            <text x="6" y="0" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">
              {index + 1}
            </text>
            <text x="20" y="0" fontSize="10" fontWeight="700" fill="#111">
              {text}
            </text>
          </g>
        ))}
      </g>
    ) : null;

  const Firebox = () => (
    <g>
      <rect
        x="82"
        y="380"
        width="165"
        height="138"
        rx="24"
        fill="url(#furnaceMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      <rect
        x="112"
        y="412"
        width="106"
        height="76"
        rx="15"
        fill="#111"
        stroke="#333"
        strokeWidth="3"
      />

      <ellipse
        cx="215"
        cy="435"
        rx="85"
        ry="45"
        fill="url(#furnaceTubeGlow)"
        opacity={simulation.fireIntensity * 0.8}
      />

      {Array.from({ length: 9 }).map((_, index) => {
        const flameHeight =
          20 + simulation.fireIntensity * 55 + Math.sin(phase * 18 + index) * 8;

        return (
          <path
            key={index}
            d={`
              M ${122 + index * 10} 482
              C ${110 + index * 10} ${455 - flameHeight * 0.25},
                ${126 + index * 10} ${440 - flameHeight},
                ${122 + index * 10} 420
              C ${146 + index * 10} ${445 - flameHeight},
                ${136 + index * 10} ${465 - flameHeight * 0.3},
                ${139 + index * 10} 482
              Z
            `}
            fill={index % 2 === 0 ? "#f97316" : "#facc15"}
            opacity={0.25 + simulation.fireIntensity * 0.75}
          />
        );
      })}

      <ellipse
        cx="165"
        cy="450"
        rx="95"
        ry="70"
        fill="url(#fireGlow)"
        opacity={simulation.fireIntensity * 0.6}
      />
    </g>
  );

  const DraftFan = () => (
    <g transform="translate(65 545)">
      <rect
        x="0"
        y="0"
        width="110"
        height="70"
        rx="18"
        fill="url(#pumpMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      <circle
        cx="42"
        cy="35"
        r="25"
        fill="#fff"
        stroke="#111"
        strokeWidth="4"
      />

      <g transform={`rotate(${phase * 360 * (1 + simulation.effectiveDraftLevel / 25)} 42 35)`}>
        <path d="M 42 35 L 62 28 L 58 42 Z" fill="#111" />
        <path d="M 42 35 L 25 22 L 33 39 Z" fill="#111" />
        <path d="M 42 35 L 40 57 L 52 45 Z" fill="#111" />
      </g>

      <path
        d="M 105 35 C 132 35, 142 385, 125 420"
        fill="none"
        stroke="#111"
        strokeWidth="5"
        strokeDasharray="8 8"
        opacity="0.7"
      />

      {showHotGas &&
        Array.from({ length: 8 }).map((_, index) => (
          <circle
            key={index}
            cx={100 + ((phase * 120 + index * 14) % 80)}
            cy={35 + Math.sin(phase * 12 + index) * 8}
            r="3"
            fill="#38bdf8"
            opacity={simulation.effectiveDraftLevel / 100}
          />
        ))}
    </g>
  );

  const HotGasArrows = () => {
    if (!showHotGas || simulation.flueGasFlow <= 0.04) return null;

    const tubeYs = [300, 340, 380, 420, 460];

    return (
      <g opacity={simulation.flueGasFlow}>
        <path
          d="M 215 445 C 246 418, 270 382, 305 342"
          fill="none"
          stroke="#fb923c"
          strokeWidth="9"
          strokeLinecap="round"
          markerEnd="url(#hotGasArrow)"
          opacity="0.45"
        />

        {tubeYs.map((y, index) => (
          <g key={y}>
            <path
              d={`M 260 ${y} C 390 ${y - 4}, 525 ${y + 4}, 665 ${y}`}
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
              markerEnd="url(#hotGasArrow)"
              opacity="0.5"
            />

            <circle
              cx={270 + ((phase * 330 + index * 48) % 365)}
              cy={y + Math.sin(phase * 18 + index) * 2}
              r="5"
              fill="#facc15"
              opacity="0.75"
            />
          </g>
        ))}

        <path
          d="M 705 370 C 735 338, 752 285, 760 230"
          fill="none"
          stroke="#71717a"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#smokeArrow)"
          opacity="0.5"
        />
      </g>
    );
  };

  const FireTubes = () => {
    const tubes = [300, 340, 380, 420, 460];

    return (
      <g>
        {tubes.map((y, index) => (
          <g key={y}>
            <rect
              x="240"
              y={y - 11}
              width="420"
              height="22"
              rx="11"
              fill="url(#tubeMetal)"
              stroke="#111"
              strokeWidth="3"
            />

            <rect
              x="250"
              y={y - 5}
              width="400"
              height="10"
              rx="5"
              fill="#f97316"
              opacity={simulation.flueGasFlow * 0.24}
            />

            {faultMode === "fouledTubes" && (
              <g>
                <path
                  d={`M 250 ${y - 7} C 340 ${y - 14}, 445 ${y - 1}, 650 ${y - 9}`}
                  fill="none"
                  stroke="#3f2f1f"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.75"
                />

                {Array.from({ length: 9 }).map((_, stainIndex) => (
                  <circle
                    key={stainIndex}
                    cx={270 + stainIndex * 42}
                    cy={y + Math.sin(stainIndex) * 5}
                    r={3 + (stainIndex % 4)}
                    fill="#3f2f1f"
                    opacity="0.65"
                  />
                ))}
              </g>
            )}

            {showHotGas &&
              simulation.flueGasFlow > 0.04 &&
              Array.from({ length: 7 }).map((_, particleIndex) => {
                const x =
                  255 +
                  ((phase * 330 + particleIndex * 50 + index * 24) % 385);

                return (
                  <circle
                    key={particleIndex}
                    cx={x}
                    cy={y + Math.sin(phase * 20 + particleIndex) * 3}
                    r="3.5"
                    fill="#fb923c"
                    opacity={simulation.flueGasFlow}
                  />
                );
              })}
          </g>
        ))}

        {showHeat &&
          simulation.heatTransfer > 0.05 &&
          tubes.map((y, index) => (
            <g key={`heat-${y}`} opacity={simulation.heatTransfer * 0.58}>
              <path
                d={`M ${300 + index * 26} ${y - 20} C ${
                  312 + index * 26
                } ${y - 48}, ${335 + index * 26} ${y - 48}, ${
                  350 + index * 26
                } ${y - 20}`}
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${460 + index * 20} ${y + 20} C ${
                  475 + index * 20
                } ${y + 48}, ${500 + index * 20} ${y + 48}, ${
                  515 + index * 20
                } ${y + 20}`}
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ))}
      </g>
    );
  };

  const SmokeBox = () => (
    <g>
      <path
        d="
          M 650 270
          L 715 270
          C 745 270 760 295 760 330
          L 760 455
          C 760 490 740 515 705 515
          L 650 515
          C 682 475 695 435 695 390
          C 695 345 682 305 650 270
          Z
        "
        fill="url(#smokeBoxMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      {faultMode === "blockedChimney" && (
        <g>
          <rect
            x="705"
            y="315"
            width="40"
            height="150"
            rx="16"
            fill="#3f3f46"
            opacity="0.8"
            stroke="#111"
            strokeWidth="3"
          />
          <text
            x="725"
            y="300"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill="#dc2626"
          >
            BLOCKED
          </text>
        </g>
      )}

      {showHotGas &&
        simulation.flueGasFlow > 0.04 &&
        Array.from({ length: 13 }).map((_, index) => (
          <circle
            key={index}
            cx={680 + Math.sin(phase * 12 + index) * 22}
            cy={305 + ((index * 29 + phase * 120) % 175)}
            r={7 + (index % 5)}
            fill="#71717a"
            opacity={simulation.flueGasFlow * 0.18}
            filter="url(#smokeBlur)"
          />
        ))}
    </g>
  );

  const WaterAndSteam = () => {
    const waterHeight = (simulation.waterLevelPercent / 100) * 245;
    const waterY = 510 - waterHeight;

    return (
      <g>
        <g clipPath="url(#shellClip)">
          <rect
            x="220"
            y={waterY}
            width="470"
            height={waterHeight}
            fill="url(#waterGradient)"
            opacity="0.8"
          />

          <path
            d={`
              M 220 ${waterY + 8}
              C 290 ${waterY - 12}, 360 ${waterY + 25}, 430 ${waterY + 4}
              C 500 ${waterY - 15}, 610 ${waterY + 15}, 690 ${waterY + 2}
              L 690 520
              L 220 520
              Z
            `}
            fill="#38bdf8"
            opacity="0.45"
          />

          <line
            x1="220"
            y1="354"
            x2="690"
            y2="354"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="10 8"
            opacity="0.95"
          />

          <line
            x1="220"
            y1="440"
            x2="690"
            y2="440"
            stroke="#dc2626"
            strokeWidth="3"
            strokeDasharray="10 8"
            opacity="0.95"
          />

          <text x="605" y="346" fontSize="11" fontWeight="900" fill="#22c55e">
            NORMAL LEVEL
          </text>

          <text x="600" y="432" fontSize="11" fontWeight="900" fill="#dc2626">
            MIN SAFE
          </text>

          {showSteam &&
            simulation.steamGeneration > 0.05 &&
            Array.from({ length: 28 }).map((_, index) => {
              const bubblePhase = (phase * 1.8 + index * 0.08) % 1;
              const x = 255 + ((index * 37) % 390);
              const y = 505 - bubblePhase * waterHeight;

              return (
                <circle
                  key={index}
                  cx={x + Math.sin(phase * 14 + index) * 8}
                  cy={y}
                  r={3 + (index % 4)}
                  fill="#e0f2fe"
                  opacity={simulation.steamGeneration * (1 - bubblePhase * 0.5)}
                />
              );
            })}

          {showSteam &&
            simulation.steamGeneration > 0.05 &&
            Array.from({ length: 18 }).map((_, index) => {
              const steamPhase = (phase * 1.5 + index * 0.09) % 1;
              const x = 250 + ((index * 41) % 390);
              const y = 175 + steamPhase * 95;

              return (
                <circle
                  key={`steam-${index}`}
                  cx={x + Math.sin(phase * 10 + index) * 12}
                  cy={y}
                  r={8 + (index % 5)}
                  fill="#f8fafc"
                  opacity={simulation.steamGeneration * 0.2}
                />
              );
            })}
        </g>
      </g>
    );
  };

  const ExposedTubeWarning = () => {
    if (!simulation.lowWaterAlarm) return null;

    return (
      <g>
        <rect
          x="235"
          y="285"
          width="435"
          height="88"
          rx="16"
          fill="#dc2626"
          opacity="0.18"
          stroke="#dc2626"
          strokeWidth="4"
          strokeDasharray="9 6"
        />

        <text
          x="452"
          y="272"
          textAnchor="middle"
          fontSize="17"
          fontWeight="900"
          fill="#dc2626"
        >
          EXPOSED FIRE TUBES
        </text>

        {[300, 340].map((y) => (
          <path
            key={y}
            d={`M 250 ${y} L 650 ${y}`}
            stroke="#dc2626"
            strokeWidth="5"
            strokeDasharray="10 7"
            opacity="0.75"
          />
        ))}
      </g>
    );
  };

  const PressureGauge = () => {
    const angle = -130 + clamp(simulation.pressureBar / 22, 0, 1) * 260;

    return (
      <g>
        <path
          d="M 690 185 C 735 170, 755 170, 775 175"
          fill="none"
          stroke="#111"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g transform="translate(780 175)">
          <circle
            cx="0"
            cy="0"
            r="52"
            fill="#fff"
            stroke="#111"
            strokeWidth="5"
          />

          {[-120, -60, 0, 60, 120].map((tick) => (
            <line
              key={tick}
              x1={Math.cos((tick * Math.PI) / 180) * 36}
              y1={Math.sin((tick * Math.PI) / 180) * 36}
              x2={Math.cos((tick * Math.PI) / 180) * 45}
              y2={Math.sin((tick * Math.PI) / 180) * 45}
              stroke="#111"
              strokeWidth="3"
            />
          ))}

          <g transform={`rotate(${angle})`}>
            <line
              x1="0"
              y1="0"
              x2="38"
              y2="0"
              stroke={simulation.highPressureAlarm ? "#dc2626" : "#111"}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          <circle cx="0" cy="0" r="5" fill="#111" />

          <text
            x="0"
            y="70"
            textAnchor="middle"
            fontSize="12"
            fontWeight="900"
            fill="#111"
          >
            {simulation.pressureBar} bar
          </text>
        </g>
      </g>
    );
  };

  const WaterLevelGauge = () => {
    const fillHeight = clamp(simulation.waterLevelPercent / 100, 0, 1) * 145;

    return (
      <g>
        <path
          d="M 690 335 H 742"
          fill="none"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 690 455 H 742"
          fill="none"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <g transform="translate(742 300)">
          <rect
            x="0"
            y="0"
            width="46"
            height="166"
            rx="15"
            fill="#fff"
            stroke="#111"
            strokeWidth="4"
          />

          <rect
            x="9"
            y={154 - fillHeight}
            width="28"
            height={fillHeight}
            rx="8"
            fill={simulation.lowWaterAlarm ? "#f97316" : "#38bdf8"}
            opacity="0.82"
          />

          <line x1="-10" y1="118" x2="56" y2="118" stroke="#dc2626" strokeWidth="3" />

          <text x="23" y="191" textAnchor="middle" fontSize="11" fontWeight="900">
            {Math.round(simulation.waterLevelPercent)}%
          </text>
        </g>
      </g>
    );
  };

  const FeedwaterPump = () => (
    <g>
      <rect
        x="70"
        y="175"
        width="120"
        height="80"
        rx="18"
        fill="url(#pumpMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      <circle
        cx="130"
        cy="215"
        r="26"
        fill="#fff"
        stroke="#111"
        strokeWidth="4"
      />

      <g transform={`rotate(${phase * 360 * 3} 130 215)`}>
        <line x1="130" y1="215" x2="153" y2="215" stroke="#111" strokeWidth="5" />
      </g>

      <path
        d="M 190 215 C 220 215, 225 260, 240 300"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.8"
      />

      <g transform="translate(228 275) rotate(65)">
        <rect
          x="-16"
          y="-12"
          width="32"
          height="24"
          rx="6"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="3"
        />
        <path d="M -8 -5 L 8 0 L -8 5 Z" fill="#38bdf8" />
      </g>

      {simulation.effectiveFeedwaterRate > 5 &&
        Array.from({ length: 8 }).map((_, index) => {
          const progress = (phase * 2.2 + index * 0.13) % 1;
          const x = 190 + progress * 55;
          const y = 215 + progress * 85;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#38bdf8"
              opacity={simulation.effectiveFeedwaterRate / 100}
            />
          );
        })}
    </g>
  );

  const SteamOutlet = () => (
    <g>
      <path
        d="M 455 155 C 455 108, 525 108, 525 155"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="5"
      />

      <rect
        x="480"
        y="92"
        width="190"
        height="48"
        rx="17"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="5"
      />

      <g transform="translate(665 116)">
        <circle
          cx="0"
          cy="0"
          r="18"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="4"
        />
        <g transform={`rotate(${phase * 360 * 2})`}>
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#fff" strokeWidth="5" />
        </g>
      </g>

      <path
        d="M 680 116 C 725 116, 760 116, 815 112"
        fill="none"
        stroke="#d4d4d8"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {showSteam &&
        simulation.steamGeneration > 0.05 &&
        Array.from({ length: 22 }).map((_, index) => {
          const x = 505 + ((phase * 280 + index * 24) % 315);
          const y = 116 + Math.sin(phase * 18 + index) * 8;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={6 + (index % 5)}
              fill="#f8fafc"
              opacity={simulation.steamGeneration * 0.45}
            />
          );
        })}

      {showSteam && simulation.steamGeneration > 0.05 && (
        <path
          d="M 505 116 C 600 105, 720 125, 815 112"
          fill="none"
          stroke="#f8fafc"
          strokeWidth="6"
          strokeLinecap="round"
          markerEnd="url(#steamArrow)"
          opacity={simulation.steamGeneration * 0.72}
        />
      )}
    </g>
  );

  const SafetyValve = () => {
    if (!showSafety) return null;

    return (
      <g transform="translate(360 120)">
        <rect
          x="-30"
          y="0"
          width="60"
          height="58"
          rx="13"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="5"
        />

        <path
          d="M -48 0 L 48 0"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M -20 58 L 20 58"
          stroke="#111"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {(simulation.safetyValveOpen || faultMode === "overPressure") && (
          <g>
            {Array.from({ length: 18 }).map((_, index) => (
              <circle
                key={index}
                cx={Math.sin(phase * 20 + index) * 36}
                cy={-10 - ((phase * 95 + index * 15) % 115)}
                r={7 + (index % 5)}
                fill="#f8fafc"
                opacity="0.58"
              />
            ))}

            <path
              d="M 0 -5 C -30 -45, 35 -70, 0 -115"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#steamArrow)"
              opacity="0.8"
            />

            <text
              x="0"
              y="-132"
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#dc2626"
            >
              STEAM RELEASE
            </text>
          </g>
        )}
      </g>
    );
  };

  const FusiblePlug = () => {
    if (!showSafety) return null;

    return (
      <g transform="translate(332 274)">
        <circle
          cx="0"
          cy="0"
          r="13"
          fill={simulation.lowWaterAlarm ? "#dc2626" : "#facc15"}
          stroke="#111"
          strokeWidth="4"
        />

        {simulation.lowWaterAlarm && (
          <g>
            <circle
              cx="0"
              cy="0"
              r={22 + Math.sin(phase * 20) * 4}
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              opacity="0.8"
            />
            <text x="0" y="-30" textAnchor="middle" fontSize="11" fontWeight="900" fill="#dc2626">
              FUSIBLE PLUG WARNING
            </text>
          </g>
        )}
      </g>
    );
  };

  const Chimney = () => (
    <g>
      <path
        d="M 715 340 C 750 305, 760 255, 765 210"
        fill="none"
        stroke="url(#metalDark)"
        strokeWidth="50"
        strokeLinecap="round"
      />

      <rect
        x="730"
        y="80"
        width="74"
        height="150"
        rx="18"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="5"
      />

      {showHotGas &&
        simulation.flueGasFlow > 0.04 &&
        Array.from({ length: 16 }).map((_, index) => {
          const p = (phase * 1.8 + index * 0.06) % 1;
          const x = 767 + Math.sin(phase * 12 + index) * 22;
          const y = 80 - p * 110;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={9 + (index % 6)}
              fill="#71717a"
              opacity={simulation.flueGasFlow * (0.42 - p * 0.16)}
              filter="url(#smokeBlur)"
            />
          );
        })}
    </g>
  );

  const BlowdownValve = () => (
    <g transform="translate(455 535)">
      <path
        d="M 0 0 V 45 H 80"
        fill="none"
        stroke="#111"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="80"
        cy="45"
        r="18"
        fill="url(#metalDark)"
        stroke="#111"
        strokeWidth="4"
      />

      <g transform={`rotate(${phase * 360 * 2} 80 45)`}>
        <line x1="62" y1="45" x2="98" y2="45" stroke="#fff" strokeWidth="5" />
      </g>
    </g>
  );

  const AlarmBanner = () => {
    if (!simulation.lowWaterAlarm && !simulation.highPressureAlarm) return null;

    return (
      <g>
        <rect
          x="235"
          y="555"
          width="420"
          height="48"
          rx="14"
          fill="#991b1b"
          opacity="0.95"
        />
        <text
          x="445"
          y="585"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#fff"
        >
          {simulation.lowWaterAlarm
            ? "LOW WATER: TUBES EXPOSED"
            : "HIGH STEAM PRESSURE ALARM"}
        </text>
      </g>
    );
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-3 sm:p-4">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[390px_1fr]">
        <aside className="order-2 rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm xl:order-1 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Fire-Tube Boiler Simulator
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Final cleaned layout with legend panel, draft fan, safe water marks,
              steam stop valve, fusible plug and layer controls.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {simulation.currentZone}
                </p>
                <p className="text-xs text-neutral-500">
                  Pressure: {simulation.pressureBar} bar
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <ControlSlider
              label="Simulation Speed"
              min={0.2}
              max={3}
              step={0.1}
              value={speed}
              onChange={setSpeed}
            />

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPhase(0);
              }}
              className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
            >
              Reset Animation
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Boiler Controls
            </h3>

            <div className="space-y-3">
              <ControlSlider
                label="Fuel Rate"
                min={0}
                max={100}
                step={5}
                suffix="%"
                value={fuelRate}
                onChange={setFuelRate}
              />

              <ControlSlider
                label="Feedwater Rate"
                min={0}
                max={100}
                step={5}
                suffix="%"
                value={feedwaterRate}
                onChange={setFeedwaterRate}
              />

              <ControlSlider
                label="Steam Demand"
                min={10}
                max={100}
                step={5}
                suffix="%"
                value={steamDemand}
                onChange={setSteamDemand}
              />

              <ControlSlider
                label="Draft / Air Flow"
                min={10}
                max={100}
                step={5}
                suffix="%"
                value={draftLevel}
                onChange={setDraftLevel}
              />

              <ControlSlider
                label="Canvas Scale"
                min={0.6}
                max={2}
                step={0.1}
                suffix="x"
                value={canvasScale}
                onChange={setCanvasScale}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Fault Simulation
            </h3>

            <select
              value={faultMode}
              onChange={(event) => setFaultMode(event.target.value as FaultMode)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold"
            >
              <option value="normal">Normal</option>
              <option value="lowWater">Low water level</option>
              <option value="overPressure">Over pressure</option>
              <option value="fouledTubes">Fouled tubes</option>
              <option value="feedPumpFailure">Feed pump failure</option>
              <option value="blockedChimney">Blocked chimney</option>
              <option value="weakDraft">Weak draft</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {simulation.faultDescription}
            </p>
          </div>

          <div className="mt-4">
            <BoilerStatusTable />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Live Boiler Data
            </h3>

            <div className="space-y-3">
              <GaugeBar
                label="Steam Pressure"
                value={simulation.pressureBar}
                max={22}
                suffix=" bar"
              />

              <GaugeBar
                label="Water Level"
                value={Math.round(simulation.waterLevelPercent)}
                max={100}
                suffix="%"
              />

              <GaugeBar
                label="Heat Transfer"
                value={Math.round(simulation.heatTransfer * 100)}
                max={100}
                suffix="%"
              />

              <GaugeBar
                label="Efficiency"
                value={simulation.efficiencyPercent}
                max={100}
                suffix="%"
              />
            </div>

            <div className="mt-3 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span>Water temperature</span>
                <span className="font-mono">{simulation.waterTempC}°C</span>
              </div>

              <div className="flex justify-between">
                <span>Steam temperature</span>
                <span className="font-mono">{simulation.steamTempC}°C</span>
              </div>

              <div className="flex justify-between">
                <span>Furnace temperature</span>
                <span className="font-mono">{simulation.furnaceTempC}°C</span>
              </div>

              <div className="flex justify-between">
                <span>Stack temperature</span>
                <span className="font-mono">{simulation.stackTempC}°C</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Learning Note
            </h3>
            <p className="text-xs leading-relaxed text-neutral-700">
              {simulation.learningNote}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Visual Layers
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <ToggleButton
                active={showHotGas}
                label="Hot Gas / Chimney Flow"
                onClick={() => setShowHotGas((prev) => !prev)}
              />

              <ToggleButton
                active={showSteam}
                label="Steam / Water Bubbles"
                onClick={() => setShowSteam((prev) => !prev)}
              />

              <ToggleButton
                active={showHeat}
                label="Heat Transfer Waves"
                onClick={() => setShowHeat((prev) => !prev)}
              />

              <ToggleButton
                active={showSafety}
                label="Safety Devices"
                onClick={() => setShowSafety((prev) => !prev)}
              />

              <ToggleButton
                active={showLabels}
                label="Legend / Markers"
                onClick={() => setShowLabels((prev) => !prev)}
              />

              <ToggleButton
                active={showGraphs}
                label="Graphs"
                onClick={() => setShowGraphs((prev) => !prev)}
              />
            </div>
          </div>

          {showGraphs && (
            <div className="mt-4 space-y-3">
              <PressureGraph />
              <WaterLevelGraph />
            </div>
          )}
        </aside>

        <section className="order-1 rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm sm:p-4 xl:order-2">
          <div className="max-h-[calc(100vh-3rem)] overflow-auto rounded-xl border border-neutral-200 bg-neutral-100">
            <div style={{ width: `${canvasScale * 100}%`, minWidth: "720px" }}>
              <svg
                viewBox="0 0 980 720"
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Final fire-tube boiler learning simulator"
              >
                <defs>
                  <clipPath id="shellClip">
                    <rect x="220" y="190" width="470" height="330" rx="65" />
                  </clipPath>

                  <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5f5f5" />
                    <stop offset="45%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  <linearGradient
                    id="metalDark"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#111111" />
                  </linearGradient>

                  <linearGradient id="tubeMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#52525b" />
                    <stop offset="50%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#52525b" />
                  </linearGradient>

                  <linearGradient
                    id="waterGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  <linearGradient
                    id="furnaceMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#111" />
                  </linearGradient>

                  <linearGradient id="pumpMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>

                  <linearGradient id="smokeBoxMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </linearGradient>

                  <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="furnaceTubeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>

                  <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>

                  <marker
                    id="hotGasArrow"
                    markerWidth="14"
                    markerHeight="14"
                    refX="12"
                    refY="7"
                    orient="auto"
                  >
                    <path d="M 0 0 L 14 7 L 0 14 Z" fill="#f97316" />
                  </marker>

                  <marker
                    id="smokeArrow"
                    markerWidth="14"
                    markerHeight="14"
                    refX="12"
                    refY="7"
                    orient="auto"
                  >
                    <path d="M 0 0 L 14 7 L 0 14 Z" fill="#71717a" />
                  </marker>

                  <marker
                    id="steamArrow"
                    markerWidth="14"
                    markerHeight="14"
                    refX="12"
                    refY="7"
                    orient="auto"
                  >
                    <path d="M 0 0 L 14 7 L 0 14 Z" fill="#f8fafc" />
                  </marker>
                </defs>

                <rect width="980" height="720" fill="#f3f4f6" />

                <SteamOutlet />

                <rect
                  x="215"
                  y="185"
                  width="485"
                  height="340"
                  rx="72"
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="7"
                />

                <WaterAndSteam />
                <HotGasArrows />
                <FireTubes />
                <ExposedTubeWarning />
                <SmokeBox />

                <Firebox />
                <DraftFan />
                <FeedwaterPump />
                <SafetyValve />
                <FusiblePlug />
                <Chimney />
                <PressureGauge />
                <WaterLevelGauge />
                <BlowdownValve />
                <AlarmBanner />

                <ComponentMarker x={165} y={450} number={1} />
                <ComponentMarker x={455} y={380} number={2} />
                <ComponentMarker x={720} y={395} number={3} />
                <ComponentMarker x={655} y={116} number={4} />
                <ComponentMarker x={360} y={120} number={5} />
                <ComponentMarker x={765} y={385} number={6} />
                <ComponentMarker x={130} y={215} number={7} />
                <ComponentMarker x={106} y={580} number={8} />
                <ComponentMarker x={535} y={580} number={9} />
                <ComponentMarker x={332} y={274} number={10} />

                <LegendPanel />

                {faultMode === "fouledTubes" && (
                  <g>
                    <rect
                      x="280"
                      y="248"
                      width="340"
                      height="34"
                      rx="10"
                      fill="#111"
                      opacity="0.86"
                    />
                    <text
                      x="450"
                      y="270"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill="#fff"
                    >
                      FOULED TUBE LAYER: HEAT TRANSFER REDUCED
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}