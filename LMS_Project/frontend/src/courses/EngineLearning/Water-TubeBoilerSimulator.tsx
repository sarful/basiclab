"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FaultMode =
  | "normal"
  | "lowWater"
  | "overPressure"
  | "tubeLeak"
  | "scaledTubes"
  | "feedPumpFailure"
  | "blockedStack"
  | "weakDraft"
  | "poorCirculation"
  | "burnerTrip";

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

  furnaceIntensity: number;
  hotGasFlow: number;
  heatAbsorption: number;
  waterCirculation: number;
  riserFlow: number;
  downcomerFlow: number;
  steamGeneration: number;

  drumWaterLevelPercent: number;
  pressureBar: number;
  waterTempC: number;
  steamTempC: number;
  furnaceTempC: number;
  stackTempC: number;

  efficiencyPercent: number;
  safetyValveOpen: boolean;
  lowWaterAlarm: boolean;
  highPressureAlarm: boolean;
  tubeLeakActive: boolean;
  tubeScaleActive: boolean;

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
    faultMode === "burnerTrip"
      ? 0
      : faultMode === "overPressure"
        ? Math.min(100, fuelRate + 22)
        : fuelRate;

  const effectiveFeedwaterRate =
    faultMode === "feedPumpFailure"
      ? Math.max(0, feedwaterRate * 0.12)
      : faultMode === "lowWater"
        ? Math.max(0, feedwaterRate * 0.32)
        : feedwaterRate;

  const effectiveSteamDemand =
    faultMode === "overPressure" ? Math.max(10, steamDemand * 0.42) : steamDemand;

  const effectiveDraftLevel =
    faultMode === "blockedStack"
      ? Math.max(5, draftLevel * 0.25)
      : faultMode === "weakDraft"
        ? Math.max(10, draftLevel * 0.45)
        : draftLevel;

  const fuelFactor = effectiveFuelRate / 100;
  const feedFactor = effectiveFeedwaterRate / 100;
  const demandFactor = effectiveSteamDemand / 100;
  const draftFactor = effectiveDraftLevel / 100;

  const scalePenalty = faultMode === "scaledTubes" ? 0.52 : 1;
  const circulationPenalty = faultMode === "poorCirculation" ? 0.45 : 1;
  const leakPenalty = faultMode === "tubeLeak" ? 0.72 : 1;
  const draftPenalty =
    faultMode === "blockedStack" ? 0.42 : faultMode === "weakDraft" ? 0.62 : 1;

  const firePulse = 0.86 + Math.sin(phase * Math.PI * 2) * 0.08;

  const furnaceIntensity = clamp(fuelFactor * draftFactor * firePulse, 0, 1);
  const hotGasFlow = clamp(furnaceIntensity * draftPenalty, 0, 1);

  const heatAbsorption = clamp(
    hotGasFlow * scalePenalty * circulationPenalty * leakPenalty,
    0,
    1
  );

  const drumBaseLevel =
    58 + feedFactor * 30 - demandFactor * 20 - heatAbsorption * 10;

  const drumWaterLevelPercent = clamp(
    faultMode === "lowWater"
      ? drumBaseLevel - 34
      : faultMode === "feedPumpFailure"
        ? drumBaseLevel - 28
        : faultMode === "tubeLeak"
          ? drumBaseLevel - 16
          : drumBaseLevel,
    5,
    95
  );

  const lowWaterPenalty = drumWaterLevelPercent < 25 ? 0.55 : 1;

  const waterCirculation = clamp(
    heatAbsorption * circulationPenalty * lowWaterPenalty,
    0,
    1
  );

  const downcomerFlow = clamp(
    (0.35 + feedFactor * 0.55) * waterCirculation,
    0,
    1
  );

  const riserFlow = clamp(
    waterCirculation * (0.6 + heatAbsorption * 0.55),
    0,
    1
  );

  const steamGeneration = clamp(
    riserFlow * heatAbsorption * (0.55 + drumWaterLevelPercent / 180),
    0,
    1
  );

  const pressureBar = clamp(
    2 +
      steamGeneration * 14.5 -
      demandFactor * 5.8 +
      (faultMode === "overPressure" ? 7 : 0) +
      (faultMode === "blockedStack" ? 2.2 : 0) -
      (faultMode === "tubeLeak" ? 2.5 : 0) -
      (faultMode === "burnerTrip" ? 5 : 0),
    0.5,
    24
  );

  const lowWaterAlarm = drumWaterLevelPercent < 24;
  const highPressureAlarm = pressureBar > 15.5;
  const safetyValveOpen = pressureBar > 17;

  const waterTempC = clamp(
    55 + heatAbsorption * 145 + pressureBar * 2.4 - demandFactor * 8,
    35,
    230
  );

  const steamTempC = clamp(
    waterTempC + 20 + pressureBar * 3.2 + furnaceIntensity * 55,
    80,
    360
  );

  const furnaceTempC = clamp(
    230 + furnaceIntensity * 1050 + fuelFactor * 160,
    120,
    1550
  );

  const stackTempC = clamp(
    80 +
      hotGasFlow * 280 +
      (faultMode === "scaledTubes" ? 130 : 0) +
      (faultMode === "blockedStack" ? 90 : 0),
    50,
    560
  );

  const efficiencyPercent = Math.round(
    clamp(76 + heatAbsorption * 16 - (stackTempC - 180) * 0.035, 35, 92)
  );

  const tubeLeakActive = faultMode === "tubeLeak";
  const tubeScaleActive = faultMode === "scaledTubes";

  const currentZone =
    furnaceIntensity > 0.65
      ? "Furnace heating water tubes"
      : steamGeneration > 0.5
        ? "Steam generation in riser tubes"
        : waterCirculation > 0.35
          ? "Water circulation active"
          : feedFactor > 0.5
            ? "Feedwater entering steam drum"
            : "Standby heating";

  const learningNote =
    lowWaterAlarm
      ? "Low drum water level can reduce circulation and overheat water tubes."
      : safetyValveOpen
        ? "Safety valve is releasing steam because pressure is too high."
        : faultMode === "tubeLeak"
          ? "Tube leak reduces pressure and water level while leaking water/steam into the furnace area."
          : faultMode === "scaledTubes"
            ? "Tube scale reduces heat transfer, so more heat leaves through the stack."
            : faultMode === "poorCirculation"
              ? "Poor circulation reduces water flow through riser tubes and weakens steam generation."
              : faultMode === "burnerTrip"
                ? "Burner trip stops furnace heat, so pressure and steam generation drop."
                : steamGeneration > 0.55
                  ? "Hot gas heats water inside tubes. Steam-water mixture rises to the steam drum."
                  : hotGasFlow > 0.35
                    ? "Hot combustion gas flows around the water tubes and then leaves through the stack."
                    : "Increase fuel and draft to see stronger furnace heat and tube circulation.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal educational water-tube boiler operation."
      : faultMode === "lowWater"
        ? "Low water level reduces safe circulation and can expose tubes to overheating."
        : faultMode === "overPressure"
          ? "Over pressure occurs when steam generation is high but steam demand is low."
          : faultMode === "tubeLeak"
            ? "A tube leak reduces pressure and water level while releasing steam/water into the furnace."
            : faultMode === "scaledTubes"
              ? "Scale deposits insulate the tubes and reduce heat transfer."
              : faultMode === "feedPumpFailure"
                ? "Feed pump failure reduces incoming water and lowers drum level."
                : faultMode === "blockedStack"
                  ? "Blocked stack restricts hot gas flow and weakens draft."
                  : faultMode === "weakDraft"
                    ? "Weak draft lowers combustion air and hot-gas flow."
                    : faultMode === "poorCirculation"
                      ? "Poor circulation reduces water movement through riser tubes."
                      : "Burner trip shuts down furnace heat.";

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

    furnaceIntensity,
    hotGasFlow,
    heatAbsorption,
    waterCirculation,
    riserFlow,
    downcomerFlow,
    steamGeneration,

    drumWaterLevelPercent,
    pressureBar: Number(pressureBar.toFixed(1)),
    waterTempC: Math.round(waterTempC),
    steamTempC: Math.round(steamTempC),
    furnaceTempC: Math.round(furnaceTempC),
    stackTempC: Math.round(stackTempC),

    efficiencyPercent,
    safetyValveOpen,
    lowWaterAlarm,
    highPressureAlarm,
    tubeLeakActive,
    tubeScaleActive,

    currentZone,
    learningNote,
    faultDescription,
  };
}

export default function WaterTubeBoilerSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [fuelRate, setFuelRate] = useState(58);
  const [feedwaterRate, setFeedwaterRate] = useState(60);
  const [steamDemand, setSteamDemand] = useState(48);
  const [draftLevel, setDraftLevel] = useState(72);
  const [faultMode, setFaultMode] = useState<FaultMode>("normal");

  const [showLabels, setShowLabels] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [showHotGas, setShowHotGas] = useState(true);
  const [showWaterFlow, setShowWaterFlow] = useState(true);
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
    return Array.from({ length: 150 }).map((_, index) =>
      computeSimulation(
        index / 149,
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
        name: "Burner / furnace",
        value: simulation.furnaceIntensity > 0.05 ? "Firing" : "Low",
        active: simulation.furnaceIntensity > 0.2,
      },
      {
        name: "Hot gas flow",
        value: simulation.hotGasFlow > 0.05 ? "Flowing" : "Low",
        active: simulation.hotGasFlow > 0.2,
      },
      {
        name: "Water circulation",
        value: simulation.waterCirculation > 0.05 ? "Active" : "Low",
        active: simulation.waterCirculation > 0.25,
      },
      {
        name: "Riser tubes",
        value: simulation.riserFlow > 0.05 ? "Steam-water mix" : "Low",
        active: simulation.riserFlow > 0.25,
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
        name: "Tube leak",
        value: simulation.tubeLeakActive ? "Leak" : "Normal",
        active: simulation.tubeLeakActive,
      },
      {
        name: "Tube scale",
        value: simulation.tubeScaleActive ? "Scaled" : "Clean",
        active: simulation.tubeScaleActive,
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
        const y = 95 - clamp(sample.pressureBar / 24, 0, 1) * 75;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY = 95 - clamp(simulation.pressureBar / 24, 0, 1) * 75;

    return (
      <MiniGraph title="Steam Pressure">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const CirculationGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(sample.waterCirculation, 0, 1) * 75;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY = 95 - clamp(simulation.waterCirculation, 0, 1) * 75;

    return (
      <MiniGraph title="Water Circulation">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const DrumLevelGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(sample.drumWaterLevelPercent / 100, 0, 1) * 75;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY =
      95 - clamp(simulation.drumWaterLevelPercent / 100, 0, 1) * 75;

    return (
      <MiniGraph title="Steam Drum Water Level">
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
      <g transform="translate(715 500)">
        <rect
          x="0"
          y="0"
          width="245"
          height="175"
          rx="16"
          fill="#fff"
          opacity="0.94"
          stroke="#111"
          strokeWidth="3"
        />

        <text x="122" y="24" textAnchor="middle" fontSize="13" fontWeight="900">
          Water-Tube Boiler Legend
        </text>

        {[
          "Burner / furnace",
          "Water-tube bank",
          "Steam drum",
          "Mud drum",
          "Riser tubes",
          "Downcomer",
          "Steam outlet",
          "Safety valve",
          "Feed pump + check valve",
          "Stack / flue gas exit",
        ].map((text, index) => (
          <g key={text} transform={`translate(14 ${45 + index * 13})`}>
            <circle cx="6" cy="-4" r="7" fill="#111" />
            <text
              x="6"
              y="0"
              textAnchor="middle"
              fontSize="8"
              fontWeight="900"
              fill="#fff"
            >
              {index + 1}
            </text>
            <text x="20" y="0" fontSize="10" fontWeight="700" fill="#111">
              {text}
            </text>
          </g>
        ))}
      </g>
    ) : null;

  const SteamDrum = () => {
    const waterHeight = clamp(simulation.drumWaterLevelPercent / 100, 0, 1) * 54;
    const waterY = 150 - waterHeight;

    return (
      <g>
        <rect
          x="300"
          y="95"
          width="390"
          height="70"
          rx="35"
          fill="url(#drumMetal)"
          stroke="#111"
          strokeWidth="6"
        />

        <g clipPath="url(#steamDrumClip)">
          <rect
            x="300"
            y={waterY}
            width="390"
            height={waterHeight}
            fill="url(#waterGradient)"
            opacity="0.78"
          />

          <line
            x1="302"
            y1="132"
            x2="688"
            y2="132"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="8 7"
          />

          <line
            x1="302"
            y1="150"
            x2="688"
            y2="150"
            stroke="#dc2626"
            strokeWidth="3"
            strokeDasharray="8 7"
          />

          {showSteam &&
            simulation.steamGeneration > 0.05 &&
            Array.from({ length: 20 }).map((_, index) => {
              const x = 320 + ((index * 31 + phase * 110) % 340);
              const y = 106 + ((index * 13 + phase * 60) % 42);

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={5 + (index % 4)}
                  fill="#f8fafc"
                  opacity={simulation.steamGeneration * 0.34}
                />
              );
            })}
        </g>

        {simulation.lowWaterAlarm && (
          <text
            x="495"
            y="188"
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill="#dc2626"
          >
            LOW DRUM WATER LEVEL
          </text>
        )}
      </g>
    );
  };

  const MudDrum = () => (
    <g>
      <rect
        x="325"
        y="545"
        width="340"
        height="60"
        rx="30"
        fill="url(#drumMetal)"
        stroke="#111"
        strokeWidth="6"
      />

      <g clipPath="url(#mudDrumClip)">
        <rect
          x="325"
          y="570"
          width="340"
          height="35"
          fill="url(#waterGradient)"
          opacity="0.86"
        />
      </g>
    </g>
  );

  const WaterTubeBank = () => {
    const tubes = [0, 1, 2, 3, 4, 5, 6];

    return (
      <g>
        {tubes.map((tube, index) => {
          const x1 = 345 + index * 42;
          const x2 = 410 + index * 42;

          return (
            <g key={tube}>
              <path
                d={`M ${x1} 545 C ${x1 - 20} 455, ${x2 - 25} 315, ${x2} 165`}
                fill="none"
                stroke="url(#tubeMetal)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              <path
                d={`M ${x1} 545 C ${x1 - 20} 455, ${x2 - 25} 315, ${x2} 165`}
                fill="none"
                stroke="#111"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.75"
              />

              {simulation.tubeScaleActive && (
                <path
                  d={`M ${x1} 545 C ${x1 - 20} 455, ${x2 - 25} 315, ${x2} 165`}
                  fill="none"
                  stroke="#3f2f1f"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="9 8"
                  opacity="0.8"
                />
              )}

              {showWaterFlow &&
                simulation.riserFlow > 0.04 &&
                Array.from({ length: 5 }).map((_, particleIndex) => {
                  const p = (phase * 1.8 + particleIndex * 0.18 + index * 0.04) % 1;
                  const y = 545 - p * 365;
                  const x =
                    x1 +
                    (x2 - x1) * p +
                    Math.sin(p * Math.PI * 2 + index) * 12;

                  return (
                    <circle
                      key={particleIndex}
                      cx={x}
                      cy={y}
                      r={particleIndex % 2 === 0 ? 4 : 6}
                      fill={particleIndex % 2 === 0 ? "#38bdf8" : "#f8fafc"}
                      opacity={simulation.riserFlow * 0.78}
                    />
                  );
                })}

              {showHeat && simulation.heatAbsorption > 0.05 && (
                <g opacity={simulation.heatAbsorption * 0.6}>
                  <path
                    d={`M ${x1 - 18} 440 C ${x1 - 40} 410, ${x1 - 12} 380, ${x1 - 34} 350`}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${x2 + 20} 400 C ${x2 + 45} 370, ${x2 + 18} 335, ${x2 + 42} 305`}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          );
        })}

        {simulation.tubeLeakActive && (
          <g>
            <path
              d="M 505 380 C 548 365, 575 390, 610 368"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 505 380 C 540 420, 600 415, 635 455"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.7"
            />
            <text
              x="610"
              y="350"
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#dc2626"
            >
              TUBE LEAK
            </text>
          </g>
        )}
      </g>
    );
  };

  const Downcomer = () => (
    <g>
      <path
        d="M 310 150 C 235 245, 235 445, 330 575"
        fill="none"
        stroke="url(#tubeMetal)"
        strokeWidth="22"
        strokeLinecap="round"
      />

      <path
        d="M 310 150 C 235 245, 235 445, 330 575"
        fill="none"
        stroke="#111"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />

      {showWaterFlow &&
        simulation.downcomerFlow > 0.04 &&
        Array.from({ length: 12 }).map((_, index) => {
          const p = (phase * 1.4 + index * 0.09) % 1;
          const y = 150 + p * 420;
          const x = 310 - Math.sin(p * Math.PI) * 75;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill="#38bdf8"
              opacity={simulation.downcomerFlow}
            />
          );
        })}
    </g>
  );

  const Furnace = () => (
    <g>
      <path
        d="
          M 220 190
          L 705 190
          L 705 620
          L 220 620
          Z
        "
        fill="url(#furnaceBg)"
        stroke="#111"
        strokeWidth="6"
        opacity="0.92"
      />

      <rect
        x="85"
        y="410"
        width="135"
        height="110"
        rx="22"
        fill="url(#burnerMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      <rect
        x="112"
        y="440"
        width="85"
        height="48"
        rx="12"
        fill="#111"
      />

      {Array.from({ length: 8 }).map((_, index) => {
        const flameHeight =
          15 +
          simulation.furnaceIntensity * 48 +
          Math.sin(phase * 20 + index) * 7;

        return (
          <path
            key={index}
            d={`
              M ${122 + index * 9} 488
              C ${112 + index * 9} ${465 - flameHeight * 0.25},
                ${126 + index * 9} ${450 - flameHeight},
                ${122 + index * 9} 430
              C ${144 + index * 9} ${455 - flameHeight},
                ${136 + index * 9} ${472 - flameHeight * 0.3},
                ${138 + index * 9} 488
              Z
            `}
            fill={index % 2 === 0 ? "#f97316" : "#facc15"}
            opacity={0.25 + simulation.furnaceIntensity * 0.75}
          />
        );
      })}

      <ellipse
        cx="210"
        cy="450"
        rx="130"
        ry="88"
        fill="url(#fireGlow)"
        opacity={simulation.furnaceIntensity * 0.55}
      />
    </g>
  );

  const HotGasFlow = () => {
    if (!showHotGas || simulation.hotGasFlow <= 0.04) return null;

    return (
      <g opacity={simulation.hotGasFlow}>
        <path
          d="M 190 455 C 305 420, 390 395, 485 370 C 590 335, 675 285, 730 230"
          fill="none"
          stroke="#f97316"
          strokeWidth="10"
          strokeLinecap="round"
          markerEnd="url(#hotGasArrow)"
          opacity="0.45"
        />

        <path
          d="M 240 520 C 380 500, 510 460, 650 405 C 705 382, 740 340, 760 280"
          fill="none"
          stroke="#fb923c"
          strokeWidth="8"
          strokeLinecap="round"
          markerEnd="url(#hotGasArrow)"
          opacity="0.38"
        />

        {Array.from({ length: 32 }).map((_, index) => {
          const p = (phase * 1.6 + index * 0.035) % 1;
          const x = 210 + p * 540 + Math.sin(index + phase * 12) * 18;
          const y = 510 - p * 250 + Math.cos(index + phase * 9) * 28;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={5 + (index % 4)}
              fill={index % 2 === 0 ? "#fb923c" : "#facc15"}
              opacity={0.3 + simulation.hotGasFlow * 0.35}
            />
          );
        })}
      </g>
    );
  };

  const Stack = () => (
    <g>
      <path
        d="M 704 190 C 740 155, 750 115, 755 70"
        fill="none"
        stroke="url(#stackMetal)"
        strokeWidth="54"
        strokeLinecap="round"
      />

      <rect
        x="720"
        y="15"
        width="76"
        height="140"
        rx="18"
        fill="url(#drumMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      {faultMode === "blockedStack" && (
        <g>
          <rect
            x="732"
            y="52"
            width="52"
            height="70"
            rx="14"
            fill="#3f3f46"
            stroke="#111"
            strokeWidth="3"
            opacity="0.85"
          />
          <text
            x="758"
            y="140"
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
        simulation.hotGasFlow > 0.04 &&
        Array.from({ length: 16 }).map((_, index) => {
          const p = (phase * 1.7 + index * 0.06) % 1;
          const x = 758 + Math.sin(phase * 12 + index) * 22;
          const y = 10 - p * 100;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={9 + (index % 5)}
              fill="#71717a"
              opacity={simulation.hotGasFlow * (0.4 - p * 0.14)}
              filter="url(#smokeBlur)"
            />
          );
        })}
    </g>
  );

  const SteamOutlet = () => (
    <g>
      <path
        d="M 620 95 C 655 70, 705 70, 760 65"
        fill="none"
        stroke="#d4d4d8"
        strokeWidth="14"
        strokeLinecap="round"
      />

      <g transform="translate(640 92)">
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

      {showSteam &&
        simulation.steamGeneration > 0.05 &&
        Array.from({ length: 16 }).map((_, index) => {
          const x = 525 + ((phase * 240 + index * 26) % 230);
          const y = 92 + Math.sin(phase * 18 + index) * 8;

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
          d="M 520 92 C 600 78, 690 75, 760 65"
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
      <g transform="translate(390 78)">
        <rect
          x="-28"
          y="0"
          width="56"
          height="50"
          rx="12"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="5"
        />

        <path
          d="M -45 0 L 45 0"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {(simulation.safetyValveOpen || faultMode === "overPressure") && (
          <g>
            {Array.from({ length: 16 }).map((_, index) => (
              <circle
                key={index}
                cx={Math.sin(phase * 20 + index) * 35}
                cy={-10 - ((phase * 90 + index * 15) % 105)}
                r={7 + (index % 5)}
                fill="#f8fafc"
                opacity="0.58"
              />
            ))}

            <path
              d="M 0 -5 C -30 -45, 35 -70, 0 -110"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="8"
              strokeLinecap="round"
              markerEnd="url(#steamArrow)"
              opacity="0.8"
            />

            <text
              x="0"
              y="-128"
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#dc2626"
            >
              SAFETY VALVE OPEN
            </text>
          </g>
        )}
      </g>
    );
  };

  const FeedPump = () => (
    <g>
      <rect
        x="70"
        y="180"
        width="120"
        height="80"
        rx="18"
        fill="url(#pumpMetal)"
        stroke="#111"
        strokeWidth="5"
      />

      <circle
        cx="130"
        cy="220"
        r="26"
        fill="#fff"
        stroke="#111"
        strokeWidth="4"
      />

      <g transform={`rotate(${phase * 360 * 3} 130 220)`}>
        <line x1="130" y1="220" x2="153" y2="220" stroke="#111" strokeWidth="5" />
      </g>

      <path
        d="M 190 220 C 230 210, 260 170, 308 132"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.85"
      />

      <g transform="translate(250 170) rotate(-35)">
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

      {showWaterFlow &&
        simulation.effectiveFeedwaterRate > 5 &&
        Array.from({ length: 9 }).map((_, index) => {
          const p = (phase * 2.1 + index * 0.12) % 1;
          const x = 190 + p * 120;
          const y = 220 - p * 88 + Math.sin(index + phase * 10) * 5;

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

  const PressureGauge = () => {
    const angle = -130 + clamp(simulation.pressureBar / 24, 0, 1) * 260;

    return (
      <g>
        <path
          d="M 690 125 C 725 118, 750 120, 780 135"
          fill="none"
          stroke="#111"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g transform="translate(805 145)">
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
    const fillHeight =
      clamp(simulation.drumWaterLevelPercent / 100, 0, 1) * 130;

    return (
      <g>
        <path
          d="M 690 115 H 735"
          fill="none"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M 690 152 H 735"
          fill="none"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <g transform="translate(735 80)">
          <rect
            x="0"
            y="0"
            width="46"
            height="150"
            rx="15"
            fill="#fff"
            stroke="#111"
            strokeWidth="4"
          />

          <rect
            x="9"
            y={138 - fillHeight}
            width="28"
            height={fillHeight}
            rx="8"
            fill={simulation.lowWaterAlarm ? "#f97316" : "#38bdf8"}
            opacity="0.82"
          />

          <line x1="-10" y1="115" x2="56" y2="115" stroke="#dc2626" strokeWidth="3" />

          <text x="23" y="176" textAnchor="middle" fontSize="11" fontWeight="900">
            {Math.round(simulation.drumWaterLevelPercent)}%
          </text>
        </g>
      </g>
    );
  };

  const BlowdownValve = () => (
    <g transform="translate(500 605)">
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
          x="270"
          y="640"
          width="420"
          height="48"
          rx="14"
          fill="#991b1b"
          opacity="0.95"
        />
        <text
          x="480"
          y="670"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#fff"
        >
          {simulation.lowWaterAlarm
            ? "LOW WATER: CIRCULATION RISK"
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
              Water-Tube Boiler Simulator
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Educational model of steam drum, mud drum, riser tubes, downcomer,
              furnace, burner, stack, circulation and safety devices.
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
              <option value="tubeLeak">Tube leak</option>
              <option value="scaledTubes">Scaled tubes</option>
              <option value="feedPumpFailure">Feed pump failure</option>
              <option value="blockedStack">Blocked stack</option>
              <option value="weakDraft">Weak draft</option>
              <option value="poorCirculation">Poor circulation</option>
              <option value="burnerTrip">Burner trip</option>
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
                max={24}
                suffix=" bar"
              />

              <GaugeBar
                label="Drum Water Level"
                value={Math.round(simulation.drumWaterLevelPercent)}
                max={100}
                suffix="%"
              />

              <GaugeBar
                label="Water Circulation"
                value={Math.round(simulation.waterCirculation * 100)}
                max={100}
                suffix="%"
              />

              <GaugeBar
                label="Heat Absorption"
                value={Math.round(simulation.heatAbsorption * 100)}
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
                label="Hot Gas / Stack Flow"
                onClick={() => setShowHotGas((prev) => !prev)}
              />

              <ToggleButton
                active={showWaterFlow}
                label="Water Circulation"
                onClick={() => setShowWaterFlow((prev) => !prev)}
              />

              <ToggleButton
                active={showSteam}
                label="Steam / Drum Bubbles"
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
              <CirculationGraph />
              <DrumLevelGraph />
            </div>
          )}
        </aside>

        <section className="order-1 rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm sm:p-4 xl:order-2">
          <div className="max-h-[calc(100vh-3rem)] overflow-auto rounded-xl border border-neutral-200 bg-neutral-100">
            <div style={{ width: `${canvasScale * 100}%`, minWidth: "740px" }}>
              <svg
                viewBox="0 0 990 720"
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Water-tube boiler learning simulator"
              >
                <defs>
                  <clipPath id="steamDrumClip">
                    <rect x="300" y="95" width="390" height="70" rx="35" />
                  </clipPath>

                  <clipPath id="mudDrumClip">
                    <rect x="325" y="545" width="340" height="60" rx="30" />
                  </clipPath>

                  <linearGradient id="drumMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5f5f5" />
                    <stop offset="45%" stopColor="#9ca3af" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
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

                  <linearGradient id="furnaceBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#52525b" />
                    <stop offset="100%" stopColor="#111" />
                  </linearGradient>

                  <linearGradient id="burnerMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#111" />
                  </linearGradient>

                  <linearGradient id="pumpMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>

                  <linearGradient id="stackMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#18181b" />
                  </linearGradient>

                  <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.72" />
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

                <rect width="990" height="720" fill="#f3f4f6" />

                <Furnace />
                <HotGasFlow />
                <Downcomer />
                <WaterTubeBank />
                <SteamDrum />
                <MudDrum />
                <Stack />
                <SteamOutlet />
                <SafetyValve />
                <FeedPump />
                <PressureGauge />
                <WaterLevelGauge />
                <BlowdownValve />
                <AlarmBanner />

                <ComponentMarker x={152} y={465} number={1} />
                <ComponentMarker x={500} y={380} number={2} />
                <ComponentMarker x={500} y={130} number={3} />
                <ComponentMarker x={500} y={575} number={4} />
                <ComponentMarker x={510} y={315} number={5} />
                <ComponentMarker x={250} y={360} number={6} />
                <ComponentMarker x={640} y={92} number={7} />
                <ComponentMarker x={390} y={78} number={8} />
                <ComponentMarker x={130} y={220} number={9} />
                <ComponentMarker x={758} y={115} number={10} />

                <LegendPanel />

                {simulation.tubeScaleActive && (
                  <g>
                    <rect
                      x="300"
                      y="635"
                      width="390"
                      height="34"
                      rx="10"
                      fill="#111"
                      opacity="0.86"
                    />
                    <text
                      x="495"
                      y="657"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill="#fff"
                    >
                      SCALED TUBES: HEAT TRANSFER REDUCED
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