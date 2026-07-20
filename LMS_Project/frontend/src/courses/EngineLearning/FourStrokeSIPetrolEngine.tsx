"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type StrokeName = "Intake" | "Compression" | "Power" | "Exhaust";

type FaultMode =
  | "normal"
  | "richMixture"
  | "leanMixture"
  | "lateSpark"
  | "earlySparkKnock"
  | "weakSpark";

type FuelSystemMode = "carburetor" | "portInjection" | "directInjection";
type MixtureStatus = "Lean" | "Ideal" | "Rich";

type SimulationState = {
  cycleAngleDeg: number;
  crankAngleDeg: number;
  camAngleDeg: number;

  crankCenterX: number;
  crankCenterY: number;
  crankRadius: number;
  crankPinX: number;
  crankPinY: number;

  pistonPinX: number;
  pistonPinY: number;
  pistonY: number;
  pistonNorm: number;
  pistonDirection: "Up" | "Down";

  intakeOpen: number;
  exhaustOpen: number;

  airFlow: number;
  mixtureFlow: number;
  exhaustFlow: number;

  carbFuelMist: number;
  portFuelSpray: number;
  directFuelSpray: number;

  sparkActive: number;
  coilCharge: number;
  ecuIgnitionSignal: number;
  flameGlow: number;
  knockIntensity: number;

  pressureBar: number;
  temperatureC: number;
  cylinderVolumePercent: number;
  rpm: number;

  strokeName: StrokeName;
  strokeDescription: string;
  learningNote: string;
  faultDescription: string;

  effectiveThrottle: number;
  effectiveMixture: number;
  effectiveSparkTiming: number;
  afr: number;
  mixtureStatus: MixtureStatus;
  sparkAngle: number;
  throttlePlateAngle: number;

  mapKpa: number;
  o2Voltage: number;
  coolantTempC: number;
  crankSensorDeg: number;
  knockSensorPercent: number;
  injectorPulseMs: number;
  fuelPressureBar: number;
};

const FUEL_SYSTEM_LABELS: Record<FuelSystemMode, string> = {
  carburetor: "Carburetor",
  portInjection: "Port Fuel Injection",
  directInjection: "Direct Injection",
};

const TIMELINE_EVENTS = [
  { label: "TDC", degree: 0 },
  { label: "IVO", degree: 10 },
  { label: "IVC", degree: 170 },
  { label: "BDC", degree: 180 },
  { label: "SPK", degree: 348 },
  { label: "TDC", degree: 360 },
  { label: "BDC", degree: 540 },
  { label: "EVO", degree: 545 },
  { label: "EVC", degree: 710 },
  { label: "TDC", degree: 720 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computeSimulation(
  phase: number,
  speed: number,
  throttle: number,
  mixture: number,
  sparkTimingBTDC: number,
  faultMode: FaultMode,
  fuelSystemMode: FuelSystemMode
): SimulationState {
  const cycleAngleDeg = phase * 720;
  const crankAngleDeg = cycleAngleDeg;
  const camAngleDeg = cycleAngleDeg / 2;

  const crankRad = (crankAngleDeg * Math.PI) / 180;

  const crankCenterX = 410;
  const crankCenterY = 875;
  const crankRadius = 54;
  const rodLength = 330;
  const pistonBasePinY = 515;

  const crankPinX = crankCenterX + Math.sin(crankRad) * crankRadius;
  const crankPinY = crankCenterY - Math.cos(crankRad) * crankRadius;

  const horizontalOffset = crankRadius * Math.sin(crankRad);
  const verticalRodPart = Math.sqrt(
    Math.max(rodLength ** 2 - horizontalOffset ** 2, 0)
  );

  const pistonPinX = 410;
  const pistonPinY =
    crankCenterY - verticalRodPart - crankRadius * Math.cos(crankRad);

  const pistonY = pistonPinY - pistonBasePinY;
  const pistonNorm = clamp(pistonY / 108, 0, 1);

  const pulse = (startDeg: number, endDeg: number) => {
    if (cycleAngleDeg < startDeg || cycleAngleDeg > endDeg) return 0;
    const t = (cycleAngleDeg - startDeg) / (endDeg - startDeg);
    return Math.sin(Math.PI * t);
  };

  const rangeProgress = (startDeg: number, endDeg: number) => {
    if (cycleAngleDeg < startDeg) return 0;
    if (cycleAngleDeg > endDeg) return 1;
    return (cycleAngleDeg - startDeg) / (endDeg - startDeg);
  };

  const effectiveThrottle =
    faultMode === "leanMixture" ? Math.max(10, throttle - 10) : throttle;

  const effectiveMixture =
    faultMode === "richMixture"
      ? Math.min(1.45, mixture + 0.28)
      : faultMode === "leanMixture"
        ? Math.max(0.62, mixture - 0.28)
        : mixture;

  const effectiveSparkTiming =
    faultMode === "lateSpark"
      ? Math.max(0, sparkTimingBTDC - 18)
      : faultMode === "earlySparkKnock"
        ? Math.min(42, sparkTimingBTDC + 18)
        : sparkTimingBTDC;

  const sparkAngle = 360 - effectiveSparkTiming;

  const intakeOpen = pulse(10, 170);
  const exhaustOpen = pulse(545, 710);

  const throttleFactor = effectiveThrottle / 100;
  const airFlow = intakeOpen * throttleFactor;

  const carbFuelMist =
    fuelSystemMode === "carburetor" ? intakeOpen * throttleFactor : 0;

  const portFuelSpray =
    fuelSystemMode === "portInjection" ? pulse(0, 170) * throttleFactor : 0;

  const directFuelSpray =
    fuelSystemMode === "directInjection" ? pulse(300, 352) * throttleFactor : 0;

  const mixtureFlow =
    fuelSystemMode === "carburetor"
      ? carbFuelMist
      : fuelSystemMode === "portInjection"
        ? Math.max(airFlow, portFuelSpray * 0.9)
        : airFlow;

  const sparkActive = pulse(sparkAngle - 2, sparkAngle + 4);
  const coilCharge =
    cycleAngleDeg >= sparkAngle - 45 && cycleAngleDeg < sparkAngle ? 1 : 0;
  const ecuIgnitionSignal = pulse(sparkAngle - 10, sparkAngle + 2);

  const compressionProgress = rangeProgress(180, 360);
  const powerProgress = rangeProgress(360, 540);
  const exhaustProgress = rangeProgress(540, 720);

  const afr = 14.7 / effectiveMixture;
  const mixtureStatus: MixtureStatus =
    afr > 15.2 ? "Lean" : afr < 14.2 ? "Rich" : "Ideal";

  const mixtureQuality =
    effectiveMixture > 1.18
      ? 0.76
      : effectiveMixture < 0.82
        ? 0.68
        : 1;

  const sparkQuality = faultMode === "weakSpark" ? 0.45 : 1;

  const fuelReady =
    fuelSystemMode === "directInjection"
      ? rangeProgress(300, 352)
      : rangeProgress(15, 170);

  const flameGlow =
    pulse(sparkAngle + 4, sparkAngle + 100) *
    throttleFactor *
    mixtureQuality *
    sparkQuality *
    clamp(fuelReady, 0.2, 1);

  const knockIntensity =
    faultMode === "earlySparkKnock" && cycleAngleDeg > 335 && cycleAngleDeg < 395
      ? pulse(335, 395)
      : 0;

  const pressureBar = Math.max(
    1,
    Math.round(
      1 +
        compressionProgress * 13 +
        sparkActive * 8 +
        flameGlow * 40 -
        powerProgress * 16 -
        exhaustProgress * 8 +
        knockIntensity * 22
    )
  );

  const temperatureC = Math.max(
    35,
    Math.round(
      70 +
        compressionProgress * 190 +
        sparkActive * 90 +
        flameGlow * 700 -
        powerProgress * 270 -
        exhaustProgress * 200 +
        knockIntensity * 170 +
        (mixtureStatus === "Lean" ? 40 : 0)
    )
  );

  const cylinderVolumePercent = Math.round(8 + pistonNorm * 92);

  const strokeName: StrokeName =
    cycleAngleDeg < 180
      ? "Intake"
      : cycleAngleDeg < 360
        ? "Compression"
        : cycleAngleDeg < 540
          ? "Power"
          : "Exhaust";

  const pistonDirection =
    (cycleAngleDeg >= 0 && cycleAngleDeg < 180) ||
    (cycleAngleDeg >= 360 && cycleAngleDeg < 540)
      ? "Down"
      : "Up";

  const strokeDescription =
    strokeName === "Intake"
      ? fuelSystemMode === "directInjection"
        ? "Air enters the cylinder. Fuel is injected later during compression."
        : "Air-fuel mixture enters the cylinder while the piston moves downward."
      : strokeName === "Compression"
        ? "Both valves are closed. The piston compresses the cylinder charge before spark ignition."
        : strokeName === "Power"
          ? "The spark plug ignites the compressed charge and combustion pushes the piston downward."
          : "The exhaust valve opens and burnt gases leave the cylinder.";

  const learningNote =
    knockIntensity > 0.05
      ? "Knock is happening. Spark is too early, so pressure rises harshly near TDC."
      : directFuelSpray > 0.05
        ? "Direct injector is spraying fuel into the cylinder during compression."
        : portFuelSpray > 0.05
          ? "Port injector is spraying fuel near the intake valve."
          : carbFuelMist > 0.05
            ? "Carburetor is preparing air-fuel mixture before the intake valve."
            : sparkActive > 0.05
              ? "Spark plug is firing. ECU signal and ignition coil are active."
              : flameGlow > 0.05
                ? "Flame is expanding after spark ignition and pushing the piston downward."
                : mixtureFlow > 0.05
                  ? "Throttle plate is allowing intake flow into the cylinder."
                  : exhaustOpen > 0.05
                    ? "Exhaust valve is open. Burnt gases are leaving the cylinder."
                    : strokeName === "Compression"
                      ? "Cylinder charge is being compressed before spark ignition."
                      : "Watch fuel system, ignition circuit, sensors, valves, piston and crank.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal SI petrol engine operation."
      : faultMode === "richMixture"
        ? "Rich mixture means too much fuel. It can waste fuel, reduce efficiency, and create more smoke."
        : faultMode === "leanMixture"
          ? "Lean mixture means too much air or too little fuel. Combustion becomes weak and hotter."
          : faultMode === "lateSpark"
            ? "Late spark delays combustion and reduces useful power."
            : faultMode === "earlySparkKnock"
              ? "Early spark can cause knocking because pressure rises too soon."
              : "Weak spark causes poor ignition and weak combustion.";

  const throttlePlateAngle = -70 + throttleFactor * 70;

  const mapKpa = Math.round(25 + effectiveThrottle * 0.72 + intakeOpen * 8);
  const o2Voltage =
    mixtureStatus === "Rich" ? 0.82 : mixtureStatus === "Lean" ? 0.18 : 0.45;

  const coolantTempC = Math.round(
    82 + flameGlow * 18 + knockIntensity * 14 + (mixtureStatus === "Lean" ? 6 : 0)
  );

  const injectorPulseMs =
    fuelSystemMode === "carburetor"
      ? 0
      : Number((1.4 + throttleFactor * 4.4 * effectiveMixture).toFixed(1));

  const fuelPressureBar =
    fuelSystemMode === "carburetor"
      ? 0.4
      : fuelSystemMode === "portInjection"
        ? 3.2
        : 90;

  return {
    cycleAngleDeg,
    crankAngleDeg,
    camAngleDeg,

    crankCenterX,
    crankCenterY,
    crankRadius,
    crankPinX,
    crankPinY,

    pistonPinX,
    pistonPinY,
    pistonY,
    pistonNorm,
    pistonDirection,

    intakeOpen,
    exhaustOpen,

    airFlow,
    mixtureFlow,
    exhaustFlow: exhaustOpen,

    carbFuelMist,
    portFuelSpray,
    directFuelSpray,

    sparkActive,
    coilCharge,
    ecuIgnitionSignal,
    flameGlow,
    knockIntensity,

    pressureBar,
    temperatureC,
    cylinderVolumePercent,
    rpm: Math.round(speed * 0.12 * 2 * 60),

    strokeName,
    strokeDescription,
    learningNote,
    faultDescription,

    effectiveThrottle,
    effectiveMixture,
    effectiveSparkTiming,
    afr,
    mixtureStatus,
    sparkAngle,
    throttlePlateAngle,

    mapKpa,
    o2Voltage,
    coolantTempC,
    crankSensorDeg: Math.round(crankAngleDeg % 720),
    knockSensorPercent: Math.round(knockIntensity * 100),
    injectorPulseMs,
    fuelPressureBar,
  };
}

export default function FourStrokeSIPetrolEngineSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [throttle, setThrottle] = useState(55);
  const [mixture, setMixture] = useState(1);
  const [sparkTimingBTDC, setSparkTimingBTDC] = useState(12);
  const [faultMode, setFaultMode] = useState<FaultMode>("normal");
  const [fuelSystemMode, setFuelSystemMode] =
    useState<FuelSystemMode>("portInjection");

  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [showFuelSystem, setShowFuelSystem] = useState(true);
  const [showIgnition, setShowIgnition] = useState(true);
  const [canvasScale, setCanvasScale] = useState(1);

  const lastFrameRef = useRef<number | null>(null);

  const simulation = useMemo(
    () =>
      computeSimulation(
        phase,
        speed,
        throttle,
        mixture,
        sparkTimingBTDC,
        faultMode,
        fuelSystemMode
      ),
    [phase, speed, throttle, mixture, sparkTimingBTDC, faultMode, fuelSystemMode]
  );

  const graphSamples = useMemo(() => {
    return Array.from({ length: 160 }).map((_, index) =>
      computeSimulation(
        index / 159,
        speed,
        throttle,
        mixture,
        sparkTimingBTDC,
        faultMode,
        fuelSystemMode
      )
    );
  }, [speed, throttle, mixture, sparkTimingBTDC, faultMode, fuelSystemMode]);

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

      setPhase((prev) => (prev + delta * speed * 0.12) % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const setStroke = (stroke: StrokeName) => {
    setIsPlaying(false);

    if (stroke === "Intake") setPhase(0);
    if (stroke === "Compression") setPhase(0.25);
    if (stroke === "Power") setPhase(0.5);
    if (stroke === "Exhaust") setPhase(0.75);
  };

  const stepTimeline = (degreeStep: number) => {
    setIsPlaying(false);

    setPhase((prev) => {
      const next = prev + degreeStep / 720;
      return ((next % 1) + 1) % 1;
    });
  };

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
          {value.toFixed(step < 1 ? 2 : 0)}
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

  const CycleStatusTable = () => {
    const fuelActive =
      simulation.carbFuelMist > 0.05 ||
      simulation.portFuelSpray > 0.05 ||
      simulation.directFuelSpray > 0.05;

    const rows = [
      {
        name: "Fuel system",
        value: FUEL_SYSTEM_LABELS[fuelSystemMode],
        active: true,
      },
      {
        name: "Intake valve",
        value: simulation.intakeOpen > 0.05 ? "Open" : "Closed",
        active: simulation.intakeOpen > 0.05,
      },
      {
        name: "Exhaust valve",
        value: simulation.exhaustOpen > 0.05 ? "Open" : "Closed",
        active: simulation.exhaustOpen > 0.05,
      },
      {
        name: "Fuel delivery",
        value: fuelActive ? "Active" : "Off",
        active: fuelActive,
      },
      {
        name: "Ignition coil",
        value: simulation.coilCharge > 0.5 ? "Charging" : "Idle",
        active: simulation.coilCharge > 0.5,
      },
      {
        name: "Spark plug",
        value: simulation.sparkActive > 0.05 ? "Fire" : "Off",
        active: simulation.sparkActive > 0.05,
      },
      {
        name: "Flame",
        value: simulation.flameGlow > 0.05 ? "Burning" : "Off",
        active: simulation.flameGlow > 0.05,
      },
      {
        name: "Knock",
        value: simulation.knockIntensity > 0.05 ? "Detected" : "No",
        active: simulation.knockIntensity > 0.05,
      },
      {
        name: "Piston",
        value: simulation.pistonDirection,
        active: true,
      },
    ];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Real-Time Cycle Table
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

  const ECUSensorPanel = () => {
    const rows = [
      ["TPS", `${simulation.effectiveThrottle}%`],
      ["MAP", `${simulation.mapKpa} kPa`],
      ["O2 Sensor", `${simulation.o2Voltage.toFixed(2)} V`],
      ["Coolant Temp", `${simulation.coolantTempC}°C`],
      ["Crank Sensor", `${simulation.crankSensorDeg}°`],
      ["Knock Sensor", `${simulation.knockSensorPercent}%`],
      [
        "Injector Pulse",
        fuelSystemMode === "carburetor"
          ? "N/A"
          : `${simulation.injectorPulseMs.toFixed(1)} ms`,
      ],
      ["Fuel Pressure", `${simulation.fuelPressureBar.toFixed(1)} bar`],
      ["Spark Timing", `${simulation.effectiveSparkTiming}° BTDC`],
    ];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          ECU Sensor Panel
        </h3>

        <div className="overflow-hidden rounded-lg border border-neutral-200 text-xs">
          {rows.map(([name, value]) => (
            <div
              key={name}
              className="grid grid-cols-[1fr_auto] border-b border-neutral-200 px-3 py-2 last:border-b-0"
            >
              <span className="text-neutral-700">{name}</span>
              <span className="font-mono font-semibold text-neutral-900">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AFRGauge = () => {
    const afrPercent = clamp(
      ((simulation.afr - 11.5) / (17.5 - 11.5)) * 100,
      0,
      100
    );

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-2 text-sm font-bold text-neutral-900">AFR Gauge</h3>

        <div className="mb-1 flex justify-between text-[10px] font-semibold text-neutral-500">
          <span>Rich</span>
          <span>14.7 Ideal</span>
          <span>Lean</span>
        </div>

        <div className="relative h-3 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-500 to-neutral-200">
          <div
            className="absolute top-1/2 h-5 w-2 -translate-y-1/2 rounded bg-white shadow ring-2 ring-neutral-900"
            style={{ left: `${afrPercent}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-neutral-700">
          <span>AFR</span>
          <span className="font-mono">{simulation.afr.toFixed(2)} : 1</span>
        </div>

        <div className="mt-1 flex justify-between text-xs text-neutral-700">
          <span>Status</span>
          <span className="font-bold">{simulation.mixtureStatus}</span>
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

      <svg viewBox="0 0 300 110" className="h-auto w-full">
        <rect x="0" y="0" width="300" height="110" rx="10" fill="#f5f5f5" />
        <line x1="25" y1="90" x2="280" y2="90" stroke="#999" />
        <line x1="25" y1="20" x2="25" y2="90" stroke="#999" />

        {[0, 180, 360, 540, 720].map((degree) => {
          const x = 25 + (degree / 720) * 255;

          return (
            <g key={degree}>
              <line x1={x} y1="20" x2={x} y2="90" stroke="#ddd" />
              <text x={x} y="103" fontSize="8" textAnchor="middle" fill="#666">
                {degree}
              </text>
            </g>
          );
        })}

        {children}
      </svg>
    </div>
  );

  const SparkTimingGraph = () => {
    const sparkPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.sparkActive * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const flamePath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.flameGlow * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const knockPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.knockIntensity * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <MiniGraph title="Spark / Flame / Knock Timing">
        <path d={sparkPath} fill="none" stroke="#111" strokeWidth="2.3" />
        <path
          d={flamePath}
          fill="none"
          stroke="#666"
          strokeWidth="2.3"
          strokeDasharray="5 4"
        />
        <path
          d={knockPath}
          fill="none"
          stroke="#999"
          strokeWidth="2.1"
          strokeDasharray="2 3"
        />

        <line
          x1={25 + phase * 255}
          y1="18"
          x2={25 + phase * 255}
          y2="92"
          stroke="#111"
          strokeWidth="1.5"
        />

        <text x="38" y="18" fontSize="8" fill="#111">
          Spark
        </text>
        <text x="86" y="18" fontSize="8" fill="#666">
          Flame
        </text>
        <text x="135" y="18" fontSize="8" fill="#777">
          Knock
        </text>
      </MiniGraph>
    );
  };

  const ValveTimingGraph = () => {
    const intakePath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.intakeOpen * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const exhaustPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.exhaustOpen * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <MiniGraph title="Valve Timing Diagram">
        <path d={intakePath} fill="none" stroke="#111" strokeWidth="2.4" />
        <path
          d={exhaustPath}
          fill="none"
          stroke="#666"
          strokeWidth="2.4"
          strokeDasharray="5 4"
        />

        <line
          x1={25 + phase * 255}
          y1="18"
          x2={25 + phase * 255}
          y2="92"
          stroke="#111"
          strokeWidth="1.5"
        />

        <text x="40" y="18" fontSize="8" fill="#111">
          Intake
        </text>
        <text x="92" y="18" fontSize="8" fill="#666">
          Exhaust
        </text>
      </MiniGraph>
    );
  };

  const PressureGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - clamp(sample.pressureBar / 65, 0, 1) * 70;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 25 + phase * 255;
    const currentY = 90 - clamp(simulation.pressureBar / 65, 0, 1) * 70;

    return (
      <MiniGraph title="Cylinder Pressure Curve">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.4" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const Label = ({
    x,
    y,
    text,
    width = 150,
  }: {
    x: number;
    y: number;
    text: string;
    width?: number;
  }) =>
    showLabels ? (
      <g transform={`translate(${x} ${y})`} pointerEvents="none">
        <rect
          x={-width / 2}
          y="-15"
          width={width}
          height="30"
          rx="9"
          fill="#111"
          opacity="0.9"
        />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="13"
          fontWeight="800"
        >
          {text}
        </text>
      </g>
    ) : null;

  const SmallLabel = ({
    x,
    y,
    text,
    width = 90,
  }: {
    x: number;
    y: number;
    text: string;
    width?: number;
  }) =>
    showLabels ? (
      <g transform={`translate(${x} ${y})`} pointerEvents="none">
        <rect
          x={-width / 2}
          y="-12"
          width={width}
          height="24"
          rx="8"
          fill="#111"
          opacity="0.88"
        />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="800"
        >
          {text}
        </text>
      </g>
    ) : null;

  const LeaderLine = ({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) =>
    showLabels ? (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#111"
        strokeWidth="2"
        strokeDasharray="5 5"
        opacity="0.7"
      />
    ) : null;

  const Valve = ({
    x,
    y,
    rotate,
    open,
  }: {
    x: number;
    y: number;
    rotate: number;
    open: number;
  }) => (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) translate(0 ${open * 20})`}>
      <rect
        x="-9"
        y="-142"
        width="18"
        height="142"
        rx="9"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="2.5"
      />
      <ellipse
        cx="0"
        cy="8"
        rx="38"
        ry="13"
        fill="url(#metalDark)"
        stroke="#111"
        strokeWidth="3"
      />
    </g>
  );

  const Spring = ({
    x,
    y,
    rotate,
    open,
  }: {
    x: number;
    y: number;
    rotate: number;
    open: number;
  }) => {
    const gap = 12 * (1 - open * 0.22);

    return (
      <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(0.82)`}>
        <line x1="0" y1="-8" x2="0" y2="105" stroke="#ccc" strokeWidth="3" />

        {Array.from({ length: 8 }).map((_, index) => (
          <ellipse
            key={index}
            cx="0"
            cy={index * gap + 8}
            rx="23"
            ry="6"
            fill="none"
            stroke="url(#springMetal)"
            strokeWidth="6"
          />
        ))}
      </g>
    );
  };

  const CamLobe = ({
    x,
    y,
    rotation,
    lift,
    label,
  }: {
    x: number;
    y: number;
    rotation: number;
    lift: number;
    label: string;
  }) => (
    <g transform={`translate(${x} ${y})`}>
      <circle
        cx="0"
        cy="0"
        r="25"
        fill="url(#metalDark)"
        stroke="#111"
        strokeWidth="3"
      />

      <g transform={`rotate(${rotation})`}>
        <path
          d="
            M 0 -50
            C 22 -47 34 -25 30 -4
            C 26 18 13 28 0 28
            C -13 28 -26 18 -30 -4
            C -34 -25 -22 -47 0 -50
            Z
          "
          fill="url(#rod)"
          stroke="#111"
          strokeWidth="3"
        />
        <circle cx="0" cy="0" r="13" fill="url(#metal)" />
      </g>

      <circle
        cx="0"
        cy={-44 + lift * 7}
        r="6"
        fill="#111"
        stroke="#fff"
        strokeWidth="2"
      />

      <circle
        cx="0"
        cy={-44 + lift * 7}
        r={8 + lift * 4}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        opacity={lift > 0.05 ? 0.85 : 0}
      />

      <SmallLabel x={0} y={-76} text={label} width={92} />
    </g>
  );

  const RockerAssembly = ({
    side,
    pivotX,
    pivotY,
    valveX,
    valveY,
    camX,
    camY,
    lift,
  }: {
    side: "intake" | "exhaust";
    pivotX: number;
    pivotY: number;
    valveX: number;
    valveY: number;
    camX: number;
    camY: number;
    lift: number;
  }) => {
    const direction = side === "intake" ? -1 : 1;
    const rockerAngle = direction * (lift * 11 - 3);
    const rollerY = camY - 42 + lift * 6;
    const pushEndY = valveY - 118 + lift * 16;

    return (
      <g>
        <path
          d={`M ${pivotX - 18} ${pivotY + 28} L ${pivotX} ${pivotY - 10} L ${
            pivotX + 18
          } ${pivotY + 28} Z`}
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="3"
        />

        <circle
          cx={pivotX}
          cy={pivotY}
          r="12"
          fill="url(#rod)"
          stroke="#111"
          strokeWidth="3"
        />

        <g transform={`rotate(${rockerAngle} ${pivotX} ${pivotY})`}>
          <path
            d={`
              M ${pivotX - 80} ${pivotY - 7}
              C ${pivotX - 35} ${pivotY - 15}
                ${pivotX + 35} ${pivotY - 15}
                ${pivotX + 80} ${pivotY - 7}
              L ${pivotX + 80} ${pivotY + 7}
              C ${pivotX + 35} ${pivotY + 15}
                ${pivotX - 35} ${pivotY + 15}
                ${pivotX - 80} ${pivotY + 7}
              Z
            `}
            fill="url(#rod)"
            stroke="#111"
            strokeWidth="3"
          />

          <circle
            cx={camX}
            cy={rollerY}
            r="12"
            fill="url(#metalDark)"
            stroke="#111"
            strokeWidth="3"
          />
          <circle cx={camX} cy={rollerY} r="5" fill="#111" />

          <rect
            x={valveX - 19}
            y={pushEndY - 6}
            width="38"
            height="12"
            rx="6"
            fill="url(#metalDark)"
            stroke="#111"
            strokeWidth="2.5"
          />
        </g>

        <line
          x1={valveX}
          y1={pushEndY}
          x2={valveX}
          y2={valveY - 90 + lift * 18}
          stroke="#d8d0c2"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {lift > 0.05 && (
          <path
            d={`M ${camX} ${rollerY + 8} C ${camX + direction * 20} ${
              rollerY + 24
            } ${pivotX} ${pivotY - 10} ${valveX} ${pushEndY}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
      </g>
    );
  };

  const CamshaftAndRockers = () => {
    const intakePeakCrank = (10 + 170) / 2;
    const exhaustPeakCrank = (545 + 710) / 2;

    const intakePeakCam = intakePeakCrank / 2;
    const exhaustPeakCam = exhaustPeakCrank / 2;

    const intakeCamRotation = simulation.camAngleDeg - intakePeakCam;
    const exhaustCamRotation = simulation.camAngleDeg - exhaustPeakCam;

    return (
      <g>
        <line
          x1="245"
          y1="205"
          x2="555"
          y2="205"
          stroke="url(#metalDark)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {[250, 410, 570].map((x) => (
          <g key={x}>
            <rect
              x={x - 21}
              y="184"
              width="42"
              height="42"
              rx="8"
              fill="url(#metalDark)"
              stroke="#111"
              strokeWidth="3"
            />
            <circle cx={x} cy="205" r="9" fill="#111" opacity="0.6" />
          </g>
        ))}

        <CamLobe
          x={315}
          y={205}
          rotation={intakeCamRotation}
          lift={simulation.intakeOpen}
          label="Intake Cam"
        />

        <CamLobe
          x={500}
          y={205}
          rotation={exhaustCamRotation}
          lift={simulation.exhaustOpen}
          label="Exhaust Cam"
        />

        <RockerAssembly
          side="intake"
          pivotX={345}
          pivotY={264}
          valveX={365}
          valveY={330}
          camX={315}
          camY={205}
          lift={simulation.intakeOpen}
        />

        <RockerAssembly
          side="exhaust"
          pivotX={480}
          pivotY={264}
          valveX={455}
          valveY={330}
          camX={500}
          camY={205}
          lift={simulation.exhaustOpen}
        />

        <SmallLabel x={410} y={160} text="1/2-Speed Camshaft" width={155} />
      </g>
    );
  };

  const ThrottleBody = () => (
    <g transform="translate(88 315)">
      <rect
        x="-48"
        y="-50"
        width="96"
        height="100"
        rx="20"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="4"
      />

      <circle cx="0" cy="0" r="38" fill="#111" opacity="0.75" />

      <g transform={`rotate(${simulation.throttlePlateAngle})`}>
        <rect
          x="-40"
          y="-5"
          width="80"
          height="10"
          rx="5"
          fill="#e5e7eb"
          stroke="#111"
          strokeWidth="2"
        />
      </g>

      <circle cx="0" cy="0" r="5" fill="#fff" stroke="#111" strokeWidth="2" />

      <SmallLabel x={0} y={-70} text="Throttle Body" width={120} />
    </g>
  );

  const FuelLinePulse = ({
    points,
    active,
  }: {
    points: Array<[number, number]>;
    active: boolean;
  }) => {
    if (!active) return null;

    const progress = (phase * 5) % 1;
    const p = progress * (points.length - 1);
    const index = Math.min(Math.floor(p), points.length - 2);
    const t = p - index;

    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];

    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;

    return (
      <circle
        cx={x}
        cy={y}
        r="6"
        fill="#facc15"
        stroke="#111"
        strokeWidth="2"
      />
    );
  };

  const FuelSystemVisualizer = () => {
    if (!showFuelSystem) return null;

    const fuelActive =
      simulation.carbFuelMist > 0.05 ||
      simulation.portFuelSpray > 0.05 ||
      simulation.directFuelSpray > 0.05;

    const fuelLinePoints: Array<[number, number]> =
      fuelSystemMode === "directInjection"
        ? [
            [45, 92],
            [165, 92],
            [275, 105],
            [350, 135],
          ]
        : fuelSystemMode === "portInjection"
          ? [
              [45, 92],
              [150, 112],
              [220, 210],
              [270, 288],
            ]
          : [
              [45, 92],
              [70, 170],
              [88, 392],
            ];

    const fuelLinePath =
      fuelSystemMode === "directInjection"
        ? "M 45 92 C 155 82, 270 98, 350 135"
        : fuelSystemMode === "portInjection"
          ? "M 45 92 C 140 105, 215 205, 270 288"
          : "M 45 92 C 62 170, 76 260, 88 392";

    return (
      <g>
        <g transform="translate(-20 55)">
          <rect
            x="0"
            y="0"
            width="112"
            height="66"
            rx="14"
            fill="url(#metal)"
            stroke="#111"
            strokeWidth="4"
          />
          <text x="56" y="25" textAnchor="middle" fontSize="12" fontWeight="900">
            FUEL
          </text>
          <text x="56" y="45" textAnchor="middle" fontSize="11" fontWeight="800">
            {simulation.fuelPressureBar.toFixed(1)} bar
          </text>
        </g>

        <path
          d={fuelLinePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="10 6"
          opacity="0.9"
        />
        <FuelLinePulse points={fuelLinePoints} active={fuelActive} />

        {fuelSystemMode === "carburetor" && (
          <g>
            <rect
              x="35"
              y="388"
              width="108"
              height="78"
              rx="16"
              fill="url(#metal)"
              stroke="#111"
              strokeWidth="4"
            />
            <rect
              x="55"
              y="435"
              width="70"
              height="25"
              rx="8"
              fill="#facc15"
              stroke="#111"
              strokeWidth="3"
              opacity="0.8"
            />
            <text x="89" y="422" textAnchor="middle" fontSize="12" fontWeight="900">
              CARB
            </text>

            {simulation.carbFuelMist > 0.05 &&
              Array.from({ length: 14 }).map((_, i) => (
                <circle
                  key={i}
                  cx={125 + i * 12 + Math.sin(phase * 24 + i) * 4}
                  cy={340 + Math.cos(phase * 18 + i) * 8}
                  r="3.2"
                  fill="#facc15"
                  opacity="0.72"
                />
              ))}

            <SmallLabel x={88} y={485} text="Carburetor" width={105} />
          </g>
        )}

        {fuelSystemMode === "portInjection" && (
          <g>
            <g transform="translate(270 288) rotate(-30)">
              <rect
                x="-11"
                y="-48"
                width="22"
                height="62"
                rx="7"
                fill="url(#metal)"
                stroke="#111"
                strokeWidth="3"
              />
              <path
                d="M -8 14 L 8 14 L 4 38 L -4 38 Z"
                fill="url(#metalDark)"
                stroke="#111"
                strokeWidth="2"
              />
            </g>

            {simulation.portFuelSpray > 0.05 && (
              <g opacity={simulation.portFuelSpray}>
                <path
                  d="M 280 315 L 355 405 L 300 420 Z"
                  fill="#facc15"
                  opacity="0.35"
                />
                {Array.from({ length: 16 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={285 + Math.sin(phase * 30 + i) * 14 + i * 3.4}
                    cy={322 + Math.cos(phase * 18 + i) * 10 + i * 4.6}
                    r="2.8"
                    fill="#facc15"
                    opacity="0.72"
                  />
                ))}
              </g>
            )}

            <SmallLabel x={270} y={240} text="Port Injector" width={116} />
          </g>
        )}

        {fuelSystemMode === "directInjection" && (
          <g>
            <g transform="translate(350 90) rotate(-12)">
              <rect
                x="-13"
                y="0"
                width="26"
                height="82"
                rx="8"
                fill="url(#metal)"
                stroke="#111"
                strokeWidth="3"
              />
              <path
                d="M -8 82 L 8 82 L 4 118 L -4 118 Z"
                fill="url(#metalDark)"
                stroke="#111"
                strokeWidth="2.5"
              />
            </g>

            {simulation.directFuelSpray > 0.05 && (
              <g opacity={simulation.directFuelSpray}>
                <path
                  d="M 343 198 L 320 390 L 440 390 Z"
                  fill="#facc15"
                  opacity="0.4"
                />
                {Array.from({ length: 22 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={340 + Math.sin(phase * 40 + i) * 28}
                    cy={230 + i * 8 + Math.cos(phase * 24 + i) * 8}
                    r="2.8"
                    fill="#facc15"
                    opacity="0.74"
                  />
                ))}
              </g>
            )}

            <SmallLabel x={350} y={64} text="Direct Injector" width={125} />
          </g>
        )}
      </g>
    );
  };

  const IgnitionPulse = ({ active }: { active: boolean }) => {
    if (!active) return null;

    const points: Array<[number, number]> = [
      [807, 90],
      [807, 176],
      [790, 290],
      [690, 260],
      [570, 172],
      [420, 130],
    ];

    const progress = (phase * 6) % 1;
    const p = progress * (points.length - 1);
    const index = Math.min(Math.floor(p), points.length - 2);
    const t = p - index;

    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];

    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;

    return (
      <g>
        <circle cx={x} cy={y} r="8" fill="#facc15" stroke="#111" strokeWidth="2" />
        <circle cx={x} cy={y} r="15" fill="#facc15" opacity="0.25" />
      </g>
    );
  };

  const IgnitionSystem = () => {
    if (!showIgnition) return null;

    const wireActive =
      simulation.coilCharge > 0.5 ||
      simulation.ecuIgnitionSignal > 0.05 ||
      simulation.sparkActive > 0.05;

    return (
      <g>
        <g transform="translate(745 48)">
          <rect
            x="0"
            y="0"
            width="105"
            height="60"
            rx="12"
            fill="url(#metal)"
            stroke="#111"
            strokeWidth="4"
          />
          <line x1="17" y1="21" x2="40" y2="21" stroke="#111" strokeWidth="3" />
          <line x1="28" y1="10" x2="28" y2="32" stroke="#111" strokeWidth="3" />
          <line x1="65" y1="21" x2="88" y2="21" stroke="#111" strokeWidth="3" />
          <text x="52" y="48" textAnchor="middle" fontSize="11" fontWeight="900">
            Battery
          </text>
        </g>

        <g transform="translate(748 148)">
          <rect
            x="0"
            y="0"
            width="100"
            height="78"
            rx="15"
            fill="url(#metalDark)"
            stroke="#111"
            strokeWidth="4"
          />
          <ellipse
            cx="50"
            cy="39"
            rx="30"
            ry="22"
            fill="url(#rod)"
            stroke="#111"
            strokeWidth="3"
          />
          <text x="50" y="97" textAnchor="middle" fontSize="11" fontWeight="900">
            Ignition Coil
          </text>
        </g>

        <g transform="translate(742 280)">
          <rect
            x="0"
            y="0"
            width="112"
            height="78"
            rx="13"
            fill="#111"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <text x="56" y="30" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff">
            ECU
          </text>
          <text x="56" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ddd">
            IGNITION
          </text>
        </g>

        <path
          d="M 800 108 C 805 125 805 140 800 148"
          fill="none"
          stroke={wireActive ? "#f59e0b" : "#111"}
          strokeWidth={wireActive ? 5 : 3}
          strokeLinecap="round"
        />

        <path
          d="M 800 226 C 800 250 800 265 798 280"
          fill="none"
          stroke={simulation.ecuIgnitionSignal > 0.05 ? "#f59e0b" : "#111"}
          strokeWidth={simulation.ecuIgnitionSignal > 0.05 ? 5 : 3}
          strokeLinecap="round"
        />

        <path
          d="M 748 188 C 670 162 555 112 420 130"
          fill="none"
          stroke={wireActive ? "#f59e0b" : "#111"}
          strokeWidth={wireActive ? 5 : 3}
          strokeLinecap="round"
          strokeDasharray={wireActive ? "0" : "8 6"}
        />

        <IgnitionPulse active={wireActive} />

        <SmallLabel x={800} y={386} text="Ignition System" width={150} />
      </g>
    );
  };

  const Flow = ({
    type,
    active,
  }: {
    type: "mixture" | "exhaust";
    active: number;
  }) => {
    if (!showFlow || active <= 0.03) return null;

    const points: Array<[number, number]> =
      type === "mixture"
        ? [
            [38, 315],
            [88, 315],
            [170, 325],
            [270, 365],
            [350, 420],
          ]
        : [
            [470, 420],
            [565, 370],
            [650, 330],
            [740, 315],
            [805, 315],
          ];

    const getPoint = (progress: number) => {
      const p = progress * (points.length - 1);
      const index = Math.min(Math.floor(p), points.length - 2);
      const t = p - index;

      const [x1, y1] = points[index];
      const [x2, y2] = points[index + 1];

      return {
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
        angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
      };
    };

    return (
      <g opacity={active}>
        {Array.from({ length: type === "mixture" ? 30 : 24 }).map((_, i) => {
          const progress = (phase * (type === "mixture" ? 6 : 4.5) + i / 24) % 1;
          const point = getPoint(progress);

          return (
            <g
              key={`${type}-${i}`}
              transform={`translate(${point.x + Math.sin(i + phase * 12) * 4} ${
                point.y + Math.cos(i + phase * 14) * 4
              }) rotate(${point.angle})`}
            >
              <circle
                r={type === "mixture" ? 4.2 : 9 + progress * 8}
                fill={type === "mixture" ? "#38bdf8" : "#71717a"}
                opacity={type === "mixture" ? 0.7 : 0.38}
                filter={type === "exhaust" ? "url(#smokeBlur)" : undefined}
              />
              {i % 3 === 0 && (
                <path
                  d="M -7 -4 L 7 0 L -7 4 Z"
                  fill={type === "mixture" ? "#0ea5e9" : "#52525b"}
                  opacity="0.62"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const SparkPlug = () => (
    <g transform="translate(410 80)">
      <rect
        x="-14"
        y="0"
        width="28"
        height="76"
        rx="7"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="3"
      />

      <path
        d="M -8 76 L 8 76 L 5 118 L -5 118 Z"
        fill="url(#metalDark)"
        stroke="#111"
        strokeWidth="2.5"
      />

      <line x1="-13" y1="94" x2="13" y2="94" stroke="#111" strokeWidth="3" />

      {simulation.sparkActive > 0.03 && (
        <g opacity={simulation.sparkActive}>
          <path
            d="M 0 122 L -12 144 L 4 136 L -6 160 L 18 126 L 4 133 Z"
            fill="#fde047"
            stroke="#f97316"
            strokeWidth="2"
          />
          <circle cx="0" cy="142" r="28" fill="url(#sparkGlow)" opacity="0.7" />
        </g>
      )}
    </g>
  );

  const KnockRings = () => {
    if (simulation.knockIntensity <= 0.03) return null;

    return (
      <g opacity={simulation.knockIntensity}>
        {Array.from({ length: 4 }).map((_, i) => (
          <circle
            key={i}
            cx={410}
            cy={430}
            r={45 + i * 18 + Math.sin(phase * 40 + i) * 5}
            fill="none"
            stroke="#991b1b"
            strokeWidth="3"
            opacity={0.65 - i * 0.12}
          />
        ))}

        <text
          x="410"
          y="320"
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill="#991b1b"
        >
          KNOCK
        </text>
      </g>
    );
  };

  const ConnectingRod = () => {
    const dx = simulation.crankPinX - simulation.pistonPinX;
    const dy = simulation.crankPinY - simulation.pistonPinY;
    const length = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return (
      <g
        transform={`translate(${simulation.pistonPinX} ${simulation.pistonPinY}) rotate(${angle})`}
      >
        <path
          d={`
            M 0 -18
            C ${length * 0.28} -13 ${length * 0.72} -13 ${length} -18
            L ${length} 18
            C ${length * 0.72} 13 ${length * 0.28} 13 0 18
            Z
          `}
          fill="url(#rod)"
          stroke="#111"
          strokeWidth="6"
        />

        <circle cx="0" cy="0" r="28" fill="url(#rod)" stroke="#111" strokeWidth="4" />
        <circle cx="0" cy="0" r="12" fill="#111" />

        <circle cx={length} cy="0" r="30" fill="url(#rod)" stroke="#111" strokeWidth="4" />
        <circle cx={length} cy="0" r="13" fill="#111" />
      </g>
    );
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-3 sm:p-4">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[390px_1fr]">
        <aside className="order-2 rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm xl:order-1 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Four-Stroke SI Petrol Engine
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Fixed layout, cleaner flow, clearer fuel and ignition systems.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {simulation.strokeName} Stroke
                </p>
                <p className="text-xs text-neutral-500">
                  {Math.round(simulation.cycleAngleDeg)}° crank angle
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

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => stepTimeline(-10)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
              >
                -10°
              </button>

              <button
                type="button"
                onClick={() => stepTimeline(10)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
              >
                +10°
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPhase(0);
              }}
              className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
            >
              Reset Timeline
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              SI Engine Controls
            </h3>

            <div className="space-y-3">
              <label className="block">
                <div className="mb-1 text-xs text-neutral-700">Fuel System Mode</div>
                <select
                  value={fuelSystemMode}
                  onChange={(event) =>
                    setFuelSystemMode(event.target.value as FuelSystemMode)
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold"
                >
                  <option value="carburetor">Carburetor</option>
                  <option value="portInjection">Port Fuel Injection</option>
                  <option value="directInjection">Direct Injection</option>
                </select>
              </label>

              <ControlSlider
                label="Throttle Opening"
                min={10}
                max={100}
                step={5}
                suffix="%"
                value={throttle}
                onChange={setThrottle}
              />

              <ControlSlider
                label="Air-Fuel Mixture"
                min={0.7}
                max={1.3}
                step={0.05}
                value={mixture}
                onChange={setMixture}
              />

              <ControlSlider
                label="Spark Timing BTDC"
                min={0}
                max={35}
                step={1}
                suffix="°"
                value={sparkTimingBTDC}
                onChange={setSparkTimingBTDC}
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
              <option value="richMixture">Rich mixture</option>
              <option value="leanMixture">Lean mixture</option>
              <option value="lateSpark">Late spark</option>
              <option value="earlySparkKnock">Early spark / knock</option>
              <option value="weakSpark">Weak spark</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {simulation.faultDescription}
            </p>
          </div>

          <div className="mt-4">
            <AFRGauge />
          </div>

          <div className="mt-4">
            <ECUSensorPanel />
          </div>

          <div className="mt-4">
            <CycleStatusTable />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Quick Stroke Jump
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(["Intake", "Compression", "Power", "Exhaust"] as StrokeName[]).map(
                (stroke) => (
                  <button
                    key={stroke}
                    type="button"
                    onClick={() => setStroke(stroke)}
                    className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold"
                  >
                    {stroke}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Live Engine Data
            </h3>

            <div className="space-y-3">
              <GaugeBar
                label="Pressure"
                value={simulation.pressureBar}
                max={65}
                suffix=" bar"
              />
              <GaugeBar
                label="Temperature"
                value={simulation.temperatureC}
                max={1200}
                suffix="°C"
              />
              <GaugeBar
                label="Cylinder Volume"
                value={simulation.cylinderVolumePercent}
                max={100}
                suffix="%"
              />
            </div>

            <div className="mt-3 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span>Effective throttle</span>
                <span className="font-mono">{simulation.effectiveThrottle}%</span>
              </div>

              <div className="flex justify-between">
                <span>Effective mixture</span>
                <span className="font-mono">
                  {simulation.effectiveMixture.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Spark timing</span>
                <span className="font-mono">
                  {simulation.effectiveSparkTiming}° BTDC
                </span>
              </div>

              <div className="flex justify-between">
                <span>Camshaft angle</span>
                <span className="font-mono">
                  {Math.round(simulation.camAngleDeg)}°
                </span>
              </div>

              <div className="flex justify-between">
                <span>Animation RPM</span>
                <span className="font-mono">{simulation.rpm}</span>
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
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Stroke Explanation
            </h3>
            <p className="text-xs leading-relaxed text-neutral-700">
              {simulation.strokeDescription}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Visual Options
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <ToggleButton
                active={showFlow}
                label="Mixture / Exhaust Flow"
                onClick={() => setShowFlow((prev) => !prev)}
              />

              <ToggleButton
                active={showFuelSystem}
                label="Fuel System"
                onClick={() => setShowFuelSystem((prev) => !prev)}
              />

              <ToggleButton
                active={showIgnition}
                label="Ignition System"
                onClick={() => setShowIgnition((prev) => !prev)}
              />

              <ToggleButton
                active={showLabels}
                label="Labels"
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
              <ValveTimingGraph />
              <SparkTimingGraph />
              <PressureGraph />
            </div>
          )}
        </aside>

        <section className="order-1 rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm sm:p-4 xl:order-2">
          <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-2 flex justify-between text-xs text-neutral-600">
              <span>0°</span>
              <span className="font-semibold text-neutral-900">
                Timeline: {Math.round(simulation.cycleAngleDeg)}°
              </span>
              <span>720°</span>
            </div>

            <div className="relative pb-8">
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(phase * 1000)}
                onChange={(event) => {
                  setIsPlaying(false);
                  setPhase(Number(event.target.value) / 1000);
                }}
                className="w-full accent-neutral-900"
              />

              <div className="pointer-events-none absolute left-0 right-0 top-7 h-5">
                {TIMELINE_EVENTS.map((event, index) => (
                  <div
                    key={`${event.label}-${event.degree}-${index}`}
                    className="absolute -translate-x-1/2 text-center"
                    style={{ left: `${(event.degree / 720) * 100}%` }}
                  >
                    <div className="mx-auto h-2 w-[2px] bg-neutral-900" />
                    <div className="mt-1 rounded bg-neutral-900 px-1 text-[8px] font-bold text-white">
                      {event.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[11px]">
              {(["Intake", "Compression", "Power", "Exhaust"] as StrokeName[]).map(
                (stroke) => (
                  <div
                    key={stroke}
                    className={`rounded py-1 ${
                      simulation.strokeName === stroke
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-500"
                    }`}
                  >
                    {stroke}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-xl border border-neutral-200 bg-neutral-100">
            <div style={{ width: `${canvasScale * 100}%`, minWidth: "560px" }}>
              <svg
                viewBox="0 0 1020 1260"
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Fixed four-stroke spark ignition petrol engine simulator"
              >
                <defs>
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

                  <linearGradient id="rod" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4b5563" />
                    <stop offset="50%" stopColor="#e5e7eb" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>

                  <linearGradient id="springMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#111111" />
                    <stop offset="50%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#111111" />
                  </linearGradient>

                  <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="60%" stopColor="#f97316" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
                    <stop offset="45%" stopColor="#fb923c" stopOpacity="0.78" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>

                  <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>

                <rect width="1020" height="1260" fill="#f3f4f6" />

                <g transform="translate(90 110)">
                  <path
                    d="
                      M250 80
                      L570 80
                      L570 710
                      C610 750 630 810 630 875
                      L630 975
                      C630 1035 580 1065 520 1065
                      L300 1065
                      C240 1065 190 1035 190 975
                      L190 875
                      C190 810 210 750 250 710
                      Z
                    "
                    fill="url(#metal)"
                    stroke="#111"
                    strokeWidth="6"
                    opacity="0.9"
                  />

                  <path
                    d="
                      M305 360
                      L515 360
                      L515 710
                      C548 755 570 805 570 870
                      L570 940
                      C570 985 535 1015 490 1015
                      L330 1015
                      C285 1015 250 985 250 940
                      L250 870
                      C250 805 272 755 305 710
                      Z
                    "
                    fill="#111"
                    stroke="#222"
                    strokeWidth="5"
                  />

                  <path
                    d="
                      M30 285
                      L160 285
                      C235 285 285 330 328 410
                      L292 430
                      C250 365 205 345 155 345
                      L30 345
                      Z
                    "
                    fill="url(#metal)"
                    stroke="#111"
                    strokeWidth="5"
                  />

                  <path
                    d="
                      M810 285
                      L660 285
                      C585 285 535 330 492 410
                      L528 430
                      C570 365 615 345 665 345
                      L810 345
                      Z
                    "
                    fill="url(#metal)"
                    stroke="#111"
                    strokeWidth="5"
                  />

                  <ThrottleBody />
                  <FuelSystemVisualizer />
                  <IgnitionSystem />

                  <Flow type="mixture" active={simulation.mixtureFlow} />
                  <Flow type="exhaust" active={simulation.exhaustFlow} />

                  <CamshaftAndRockers />

                  <Spring
                    x={255}
                    y={95}
                    rotate={-24}
                    open={simulation.intakeOpen}
                  />
                  <Valve
                    x={365}
                    y={330}
                    rotate={-23}
                    open={simulation.intakeOpen}
                  />

                  <Spring
                    x={570}
                    y={95}
                    rotate={24}
                    open={simulation.exhaustOpen}
                  />
                  <Valve
                    x={455}
                    y={330}
                    rotate={23}
                    open={simulation.exhaustOpen}
                  />

                  <SparkPlug />
                  <KnockRings />

                  <circle
                    cx="410"
                    cy="430"
                    r={58 + simulation.flameGlow * 40}
                    fill="url(#flameGlow)"
                    opacity={clamp(simulation.flameGlow, 0, 1)}
                  />

                  <ConnectingRod />

                  <g transform={`translate(0 ${simulation.pistonY})`}>
                    <path
                      d="
                        M295 430
                        C295 390 325 365 365 365
                        L455 365
                        C495 365 525 390 525 430
                        L525 585
                        C525 630 495 660 450 660
                        L370 660
                        C325 660 295 630 295 585
                        Z
                      "
                      fill="url(#metal)"
                      stroke="#111"
                      strokeWidth="6"
                    />

                    <path d="M312 445 H508" stroke="#111" strokeWidth="8" />
                    <path d="M312 472 H508" stroke="#111" strokeWidth="8" />
                    <path d="M312 499 H508" stroke="#111" strokeWidth="8" />

                    <circle
                      cx="410"
                      cy="535"
                      r="31"
                      fill="#111"
                      stroke="#e5e7eb"
                      strokeWidth="5"
                    />
                  </g>

                  <g
                    transform={`translate(${simulation.crankCenterX} ${simulation.crankCenterY}) rotate(${simulation.crankAngleDeg})`}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="92"
                      fill="url(#metalDark)"
                      stroke="#111"
                      strokeWidth="7"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="62"
                      fill="url(#rod)"
                      stroke="#111"
                      strokeWidth="5"
                    />
                    <circle
                      cx="0"
                      cy={-simulation.crankRadius}
                      r="16"
                      fill="#111"
                      stroke="#fff"
                      strokeWidth="4"
                    />
                  </g>

                  <line
                    x1="650"
                    y1="395"
                    x2="650"
                    y2="500"
                    stroke="#111"
                    strokeWidth="2"
                  />
                  <text
                    x="672"
                    y="403"
                    fontSize="13"
                    fontWeight="900"
                    fill="#111"
                  >
                    TDC
                  </text>
                  <text
                    x="672"
                    y="503"
                    fontSize="13"
                    fontWeight="900"
                    fill="#111"
                  >
                    BDC
                  </text>

                  <circle
                    cx="650"
                    cy={403 + simulation.pistonNorm * 97}
                    r="6"
                    fill="#111"
                    stroke="#fff"
                    strokeWidth="2"
                  />

                  <LeaderLine x1={410} y1={80} x2={410} y2={52} />
                  <Label x={410} y={35} text="Spark Plug" width={135} />

                  <LeaderLine x1={385} y1={430} x2={235} y2={490} />
                  <Label x={190} y={505} text="Combustion Flame" width={180} />

                  <LeaderLine x1={505} y1={520 + simulation.pistonY} x2={675} y2={560} />
                  <Label x={735} y={560} text="Piston" width={110} />

                  <LeaderLine x1={470} y1={720} x2={680} y2={750} />
                  <Label x={750} y={750} text="Connecting Rod" width={175} />

                  <LeaderLine x1={480} y1={875} x2={680} y2={900} />
                  <Label x={745} y={900} text="Crankshaft" width={145} />

                  <LeaderLine x1={175} y1={332} x2={165} y2={258} />
                  <Label x={165} y={238} text="Intake Flow" width={135} />

                  <LeaderLine x1={645} y1={332} x2={655} y2={258} />
                  <Label x={655} y={238} text="Exhaust Gas" width={135} />
                </g>
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}