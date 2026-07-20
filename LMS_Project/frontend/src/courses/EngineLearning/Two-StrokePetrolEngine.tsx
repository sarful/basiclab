"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type StrokeName = "Downstroke" | "Upstroke";

type FaultMode =
  | "normal"
  | "richMixture"
  | "leanMixture"
  | "richOilMix"
  | "poorScavenging"
  | "blockedExhaust"
  | "weakSpark";

type SimulationState = {
  cycleAngleDeg: number;
  crankAngleDeg: number;

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

  intakeReedOpen: number;
  exhaustPortOpen: number;
  transferPortOpen: number;

  crankcaseVacuum: number;
  crankcaseCompression: number;

  intakeFlow: number;
  transferFlow: number;
  exhaustFlow: number;

  sparkActive: number;
  flameGlow: number;
  smokeLevel: number;

  pressureBar: number;
  temperatureC: number;
  cylinderVolumePercent: number;
  crankcasePressureBar: number;
  rpm: number;

  strokeName: StrokeName;
  strokeDescription: string;
  learningNote: string;
  faultDescription: string;

  effectiveThrottle: number;
  effectiveMixture: number;
  effectiveOilMix: number;
  sparkTimingBTDC: number;
  sparkAngle: number;
  throttlePlateAngle: number;
};

const TIMELINE_EVENTS = [
  { label: "TDC", degree: 0 },
  { label: "EPO", degree: 105 },
  { label: "TPO", degree: 125 },
  { label: "BDC", degree: 180 },
  { label: "TPC", degree: 235 },
  { label: "EPC", degree: 255 },
  { label: "Reed", degree: 285 },
  { label: "SPK", degree: 348 },
  { label: "TDC", degree: 360 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function computeSimulation(
  phase: number,
  speed: number,
  throttle: number,
  mixture: number,
  oilMixPercent: number,
  sparkTimingBTDC: number,
  faultMode: FaultMode
): SimulationState {
  const cycleAngleDeg = phase * 360;
  const crankAngleDeg = cycleAngleDeg;
  const crankRad = (crankAngleDeg * Math.PI) / 180;

  const crankCenterX = 420;
  const crankCenterY = 800;
  const crankRadius = 56;
  const rodLength = 325;
  const pistonBasePinY = 390;

  const crankPinX = crankCenterX + Math.sin(crankRad) * crankRadius;
  const crankPinY = crankCenterY - Math.cos(crankRad) * crankRadius;

  const horizontalOffset = crankRadius * Math.sin(crankRad);
  const verticalRodPart = Math.sqrt(
    Math.max(rodLength ** 2 - horizontalOffset ** 2, 0)
  );

  const pistonPinX = 420;
  const pistonPinY =
    crankCenterY - verticalRodPart - crankRadius * Math.cos(crankRad);

  const pistonY = pistonPinY - pistonBasePinY;
  const pistonNorm = clamp(pistonY / 112, 0, 1);

  const pulse = (startDeg: number, endDeg: number) => {
    if (cycleAngleDeg < startDeg || cycleAngleDeg > endDeg) return 0;
    const t = (cycleAngleDeg - startDeg) / (endDeg - startDeg);
    return Math.sin(Math.PI * t);
  };

  const circularPulse = (centerDeg: number, widthDeg: number) => {
    const diff = Math.abs(((cycleAngleDeg - centerDeg + 180) % 360) - 180);
    if (diff > widthDeg) return 0;
    return Math.cos((diff / widthDeg) * (Math.PI / 2));
  };

  const wrappedPulse = (startDeg: number, endDeg: number) => {
    const start = ((startDeg % 360) + 360) % 360;
    const end = ((endDeg % 360) + 360) % 360;
    const duration = end >= start ? end - start : end + 360 - start;
    const relative = (cycleAngleDeg - start + 360) % 360;

    if (relative > duration) return 0;

    const t = relative / duration;
    return Math.sin(Math.PI * t);
  };

  const rangeProgress = (startDeg: number, endDeg: number) => {
    if (cycleAngleDeg < startDeg) return 0;
    if (cycleAngleDeg > endDeg) return 1;
    return (cycleAngleDeg - startDeg) / (endDeg - startDeg);
  };

  const effectiveThrottle =
    faultMode === "leanMixture" ? Math.max(10, throttle - 12) : throttle;

  const effectiveMixture =
    faultMode === "richMixture"
      ? Math.min(1.45, mixture + 0.25)
      : faultMode === "leanMixture"
        ? Math.max(0.65, mixture - 0.25)
        : mixture;

  const effectiveOilMix =
    faultMode === "richOilMix" ? Math.min(8, oilMixPercent + 2.5) : oilMixPercent;

  const throttleFactor = effectiveThrottle / 100;

  const sparkAngle = (360 - sparkTimingBTDC + 360) % 360;

  const exhaustPortOpen = smoothStep(0.52, 0.68, pistonNorm);
  const transferPortOpen = smoothStep(0.68, 0.84, pistonNorm);

  const intakeReedOpen = pulse(205, 345);

  const crankcaseVacuum = pulse(190, 345);
  const crankcaseCompression = pulse(20, 220);

  const scavengingPenalty = faultMode === "poorScavenging" ? 0.45 : 1;
  const exhaustPenalty = faultMode === "blockedExhaust" ? 0.42 : 1;

  const intakeFlow = intakeReedOpen * throttleFactor;

  const transferFlow =
    transferPortOpen *
    crankcaseCompression *
    throttleFactor *
    scavengingPenalty;

  const exhaustFlow =
    exhaustPortOpen *
    (0.45 + transferFlow * 0.9 + circularPulse(75, 80) * 0.6) *
    exhaustPenalty;

  const sparkActive = circularPulse(sparkAngle, 5);

  const mixtureQuality =
    effectiveMixture > 1.18
      ? 0.78
      : effectiveMixture < 0.82
        ? 0.66
        : 1;

  const sparkQuality = faultMode === "weakSpark" ? 0.45 : 1;

  const flameTiming = wrappedPulse(sparkAngle + 4, sparkAngle + 100);

  const flameGlow =
    flameTiming * throttleFactor * mixtureQuality * sparkQuality;

  const compressionProgress = rangeProgress(180, 360);
  const expansionProgress = rangeProgress(0, 180);

  const trappedChargeQuality =
    faultMode === "poorScavenging" ? 0.65 : transferFlow > 0.05 ? 1 : 0.75;

  const pressureBar = Math.max(
    1,
    Math.round(
      1 +
        compressionProgress * 7 +
        sparkActive * 6 +
        flameGlow * 34 * trappedChargeQuality -
        expansionProgress * 9 -
        exhaustPortOpen * 4 +
        (faultMode === "blockedExhaust" ? exhaustPortOpen * 10 : 0)
    )
  );

  const temperatureC = Math.max(
    35,
    Math.round(
      70 +
        compressionProgress * 150 +
        sparkActive * 90 +
        flameGlow * 620 -
        expansionProgress * 210 -
        exhaustPortOpen * 130 +
        (faultMode === "blockedExhaust" ? 120 : 0) +
        (effectiveMixture < 0.82 ? 55 : 0)
    )
  );

  const smokeBase =
    faultMode === "richOilMix"
      ? 1.85
      : faultMode === "richMixture"
        ? 1.35
        : faultMode === "blockedExhaust"
          ? 1.55
          : 1;

  const smokeLevel = clamp(
    exhaustFlow * smokeBase + (effectiveOilMix - 2) * 0.12,
    0,
    1.9
  );

  const crankcasePressureBar = Number(
    (0.6 + crankcaseCompression * 0.85 - crankcaseVacuum * 0.28).toFixed(2)
  );

  const cylinderVolumePercent = Math.round(7 + pistonNorm * 93);

  const strokeName: StrokeName = cycleAngleDeg < 180 ? "Downstroke" : "Upstroke";
  const pistonDirection = cycleAngleDeg < 180 ? "Down" : "Up";

  const strokeDescription =
    strokeName === "Downstroke"
      ? "Power pushes the piston downward. Exhaust port opens first, then transfer port sends fresh charge into the cylinder."
      : "Piston moves upward. It compresses mixture in the cylinder while fresh mixture enters the crankcase through the reed valve.";

  const learningNote =
    sparkActive > 0.05
      ? "Spark plug fires near TDC. Flame will start just after spark timing."
      : flameGlow > 0.05
        ? "Combustion flame follows spark timing and pushes the piston downward."
        : exhaustPortOpen > 0.05 && transferPortOpen <= 0.05
          ? "Piston has uncovered the exhaust port first. Burnt gas starts escaping."
          : transferFlow > 0.05
            ? "Transfer port is uncovered. Crankcase pressure pushes fresh charge into the cylinder."
            : intakeFlow > 0.05
              ? "Reed valve opens. Fresh air-fuel-oil mixture enters the crankcase."
              : crankcaseVacuum > 0.05
                ? "Upstroke creates crankcase vacuum, pulling fresh mixture through the reed valve."
                : crankcaseCompression > 0.05
                  ? "Downstroke compresses the fresh mixture inside the crankcase."
                  : "Watch piston-controlled ports, reed intake, crankcase pressure, and scavenging.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal two-stroke petrol engine operation."
      : faultMode === "richMixture"
        ? "Rich mixture means too much fuel. It increases smoke and reduces clean combustion."
        : faultMode === "leanMixture"
          ? "Lean mixture means too much air or too little fuel. It may run hotter and weaker."
          : faultMode === "richOilMix"
            ? "Too much oil in the fuel mix increases smoke and deposits."
            : faultMode === "poorScavenging"
              ? "Poor scavenging leaves burnt gases inside the cylinder and reduces power."
              : faultMode === "blockedExhaust"
                ? "Blocked exhaust traps gas, raises pressure, and reduces breathing."
                : "Weak spark causes poor ignition and weak combustion.";

  const throttlePlateAngle = -70 + throttleFactor * 70;

  return {
    cycleAngleDeg,
    crankAngleDeg,

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

    intakeReedOpen,
    exhaustPortOpen,
    transferPortOpen,

    crankcaseVacuum,
    crankcaseCompression,

    intakeFlow,
    transferFlow,
    exhaustFlow,

    sparkActive,
    flameGlow,
    smokeLevel,

    pressureBar,
    temperatureC,
    cylinderVolumePercent,
    crankcasePressureBar,
    rpm: Math.round(speed * 0.16 * 60),

    strokeName,
    strokeDescription,
    learningNote,
    faultDescription,

    effectiveThrottle,
    effectiveMixture,
    effectiveOilMix,
    sparkTimingBTDC,
    sparkAngle,
    throttlePlateAngle,
  };
}

export default function TwoStrokePetrolEngineSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [throttle, setThrottle] = useState(55);
  const [mixture, setMixture] = useState(1);
  const [oilMixPercent, setOilMixPercent] = useState(2.5);
  const [sparkTimingBTDC, setSparkTimingBTDC] = useState(12);
  const [faultMode, setFaultMode] = useState<FaultMode>("normal");

  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [canvasScale, setCanvasScale] = useState(1);

  const lastFrameRef = useRef<number | null>(null);

  const simulation = useMemo(
    () =>
      computeSimulation(
        phase,
        speed,
        throttle,
        mixture,
        oilMixPercent,
        sparkTimingBTDC,
        faultMode
      ),
    [phase, speed, throttle, mixture, oilMixPercent, sparkTimingBTDC, faultMode]
  );

  const graphSamples = useMemo(() => {
    return Array.from({ length: 150 }).map((_, index) =>
      computeSimulation(
        index / 149,
        speed,
        throttle,
        mixture,
        oilMixPercent,
        sparkTimingBTDC,
        faultMode
      )
    );
  }, [speed, throttle, mixture, oilMixPercent, sparkTimingBTDC, faultMode]);

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

      setPhase((prev) => (prev + delta * speed * 0.16) % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const stepTimeline = (degreeStep: number) => {
    setIsPlaying(false);
    setPhase((prev) => {
      const next = prev + degreeStep / 360;
      return ((next % 1) + 1) % 1;
    });
  };

  const setStroke = (stroke: StrokeName) => {
    setIsPlaying(false);
    setPhase(stroke === "Downstroke" ? 0 : 0.5);
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

  const CycleStatusTable = () => {
    const rows = [
      {
        name: "Reed intake",
        value: simulation.intakeReedOpen > 0.05 ? "Open" : "Closed",
        active: simulation.intakeReedOpen > 0.05,
      },
      {
        name: "Exhaust port",
        value: simulation.exhaustPortOpen > 0.05 ? "Open" : "Closed",
        active: simulation.exhaustPortOpen > 0.05,
      },
      {
        name: "Transfer port",
        value: simulation.transferPortOpen > 0.05 ? "Open" : "Closed",
        active: simulation.transferPortOpen > 0.05,
      },
      {
        name: "Crankcase vacuum",
        value: simulation.crankcaseVacuum > 0.05 ? "Active" : "Low",
        active: simulation.crankcaseVacuum > 0.05,
      },
      {
        name: "Crankcase compression",
        value: simulation.crankcaseCompression > 0.05 ? "Active" : "Low",
        active: simulation.crankcaseCompression > 0.05,
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
        name: "Piston",
        value: simulation.pistonDirection,
        active: true,
      },
    ];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Real-Time Port Status
        </h3>

        <div className="overflow-hidden rounded-lg border border-neutral-200 text-xs">
          <div className="grid grid-cols-[1fr_auto] bg-neutral-100 px-3 py-2 font-bold text-neutral-700">
            <span>Part</span>
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

      <svg viewBox="0 0 300 110" className="h-auto w-full">
        <rect x="0" y="0" width="300" height="110" rx="10" fill="#f5f5f5" />
        <line x1="25" y1="90" x2="280" y2="90" stroke="#999" />
        <line x1="25" y1="20" x2="25" y2="90" stroke="#999" />

        {[0, 90, 180, 270, 360].map((degree) => {
          const x = 25 + (degree / 360) * 255;

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

  const PortTimingGraph = () => {
    const exhaustPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.exhaustPortOpen * 65;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const transferPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.transferPortOpen * 65;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const reedPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.intakeReedOpen * 65;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <MiniGraph title="Piston-Controlled Port Timing">
        <path d={exhaustPath} fill="none" stroke="#111" strokeWidth="2.3" />
        <path
          d={transferPath}
          fill="none"
          stroke="#666"
          strokeWidth="2.3"
          strokeDasharray="5 4"
        />
        <path
          d={reedPath}
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
          Exhaust
        </text>
        <text x="95" y="18" fontSize="8" fill="#666">
          Transfer
        </text>
        <text x="158" y="18" fontSize="8" fill="#777">
          Reed
        </text>
      </MiniGraph>
    );
  };

  const PressureGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - clamp(sample.pressureBar / 45, 0, 1) * 70;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 25 + phase * 255;
    const currentY = 90 - clamp(simulation.pressureBar / 45, 0, 1) * 70;

    return (
      <MiniGraph title="Cylinder Pressure">
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

  const Flow = ({
    type,
    active,
  }: {
    type: "intake" | "transfer" | "exhaust";
    active: number;
  }) => {
    if (!showFlow || active <= 0.03) return null;

    const paths: Record<"intake" | "transfer" | "exhaust", Array<[number, number]>> =
      {
        intake: [
          [75, 635],
          [160, 635],
          [245, 670],
          [330, 745],
        ],
        transfer: [
          [310, 735],
          [275, 620],
          [315, 520],
          [385, 455],
          [430, 410],
        ],
        exhaust: [
          [505, 430],
          [620, 405],
          [730, 400],
          [840, 400],
        ],
      };

    const points = paths[type];

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

    const color =
      type === "intake" ? "#38bdf8" : type === "transfer" ? "#22c55e" : "#71717a";

    return (
      <g opacity={active}>
        {Array.from({ length: type === "exhaust" ? 30 : 26 }).map((_, i) => {
          const progress = (phase * (type === "exhaust" ? 4.8 : 6.4) + i / 26) % 1;
          const point = getPoint(progress);

          return (
            <g
              key={`${type}-${i}`}
              transform={`translate(${point.x + Math.sin(i + phase * 14) * 5} ${
                point.y + Math.cos(i + phase * 12) * 5
              }) rotate(${point.angle})`}
            >
              <circle
                r={type === "exhaust" ? 9 + progress * 8 : 4.7}
                fill={color}
                opacity={
                  type === "exhaust"
                    ? 0.4 + simulation.smokeLevel * 0.2
                    : 0.78
                }
                filter={type === "exhaust" ? "url(#smokeBlur)" : undefined}
              />

              {i % 3 === 0 && (
                <path
                  d="M -8 -5 L 9 0 L -8 5 Z"
                  fill={color}
                  opacity="0.72"
                />
              )}
            </g>
          );
        })}

        {type === "intake" &&
          Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={`oil-${i}`}
              cx={115 + i * 22 + Math.sin(phase * 20 + i) * 5}
              cy={635 + Math.cos(phase * 16 + i) * 9}
              r="3"
              fill="#facc15"
              opacity={0.35 + simulation.effectiveOilMix * 0.06}
            />
          ))}
      </g>
    );
  };

  const StrongTransferArrow = () => {
    if (simulation.transferFlow <= 0.03) return null;

    return (
      <g opacity={simulation.transferFlow}>
        <path
          d="M 300 735 C 255 620, 300 515, 408 425"
          fill="none"
          stroke="#22c55e"
          strokeWidth="14"
          strokeLinecap="round"
          markerEnd="url(#transferArrow)"
          opacity="0.55"
        />

        <path
          d="M 315 735 C 275 620, 315 530, 430 440"
          fill="none"
          stroke="#bbf7d0"
          strokeWidth="5"
          strokeLinecap="round"
          markerEnd="url(#transferArrowLight)"
          opacity="0.9"
        />
      </g>
    );
  };

  const StrongExhaustArrow = () => {
    if (simulation.exhaustFlow <= 0.03) return null;

    return (
      <g opacity={simulation.exhaustFlow}>
        <path
          d="M 508 430 C 625 390, 735 392, 850 400"
          fill="none"
          stroke="#52525b"
          strokeWidth="16"
          strokeLinecap="round"
          markerEnd="url(#exhaustArrow)"
          opacity={0.45 + simulation.smokeLevel * 0.18}
        />

        <path
          d="M 515 420 C 630 380, 745 385, 855 395"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="5"
          strokeLinecap="round"
          markerEnd="url(#exhaustArrowLight)"
          opacity="0.8"
        />
      </g>
    );
  };

  const CrankcasePressureGlow = () => (
    <g opacity={simulation.crankcaseCompression * 0.65}>
      <ellipse
        cx="420"
        cy="795"
        rx="150"
        ry="170"
        fill="url(#crankcaseGlow)"
      />

      {Array.from({ length: 3 }).map((_, index) => (
        <ellipse
          key={index}
          cx="420"
          cy="795"
          rx={80 + index * 36 + Math.sin(phase * 20 + index) * 8}
          ry={92 + index * 40 + Math.cos(phase * 18 + index) * 8}
          fill="none"
          stroke="#22c55e"
          strokeWidth="4"
          opacity={0.5 - index * 0.12}
        />
      ))}
    </g>
  );

  const CrankcaseVacuumGlow = () => (
    <g opacity={simulation.crankcaseVacuum * 0.55}>
      <ellipse
        cx="420"
        cy="795"
        rx="150"
        ry="170"
        fill="url(#vacuumGlow)"
      />

      {Array.from({ length: 3 }).map((_, index) => (
        <ellipse
          key={index}
          cx="420"
          cy="795"
          rx={145 - index * 30 + Math.sin(phase * 18 + index) * 7}
          ry={165 - index * 35 + Math.cos(phase * 16 + index) * 7}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          opacity={0.45 - index * 0.1}
        />
      ))}
    </g>
  );

  const PortHighlight = ({
    type,
    open,
    x,
    y,
    width,
    height,
  }: {
    type: "transfer" | "exhaust";
    open: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const fill = type === "transfer" ? "#22c55e" : "#71717a";

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="8"
          fill={fill}
          stroke="#111"
          strokeWidth="4"
          opacity={0.2 + open * 0.8}
        />

        {open > 0.05 && (
          <rect
            x={x - 6}
            y={y - 6}
            width={width + 12}
            height={height + 12}
            rx="12"
            fill="none"
            stroke={type === "transfer" ? "#22c55e" : "#52525b"}
            strokeWidth="4"
            opacity="0.85"
          />
        )}
      </g>
    );
  };

  const CarburetorThrottle = () => (
    <g transform="translate(125 610)">
      <rect
        x="-55"
        y="-48"
        width="110"
        height="96"
        rx="18"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="4"
      />

      <circle cx="0" cy="0" r="36" fill="#111" opacity="0.72" />

      <g transform={`rotate(${simulation.throttlePlateAngle})`}>
        <rect
          x="-38"
          y="-5"
          width="76"
          height="10"
          rx="5"
          fill="#e5e7eb"
          stroke="#111"
          strokeWidth="2"
        />
      </g>

      <circle cx="0" cy="0" r="5" fill="#fff" stroke="#111" strokeWidth="2" />

      {showFlow && simulation.intakeFlow > 0.03 && (
        <g opacity={simulation.intakeFlow}>
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              cx={-38 + i * 8}
              cy={Math.sin(phase * 20 + i) * 14}
              r="3"
              fill={i % 2 === 0 ? "#38bdf8" : "#facc15"}
              opacity="0.75"
            />
          ))}
        </g>
      )}
    </g>
  );

  const SparkPlug = () => (
    <g transform="translate(420 125)">
      <rect
        x="-13"
        y="0"
        width="26"
        height="74"
        rx="7"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="3"
      />

      <path
        d="M -8 74 L 8 74 L 5 116 L -5 116 Z"
        fill="url(#metalDark)"
        stroke="#111"
        strokeWidth="2.5"
      />

      {simulation.sparkActive > 0.03 && (
        <g opacity={simulation.sparkActive}>
          <circle cx="0" cy="142" r="46" fill="url(#sparkGlow)" opacity="0.75" />

          <path
            d="M 0 118 L -16 146 L 4 137 L -9 168 L 22 124 L 5 132 Z"
            fill="#fde047"
            stroke="#f97316"
            strokeWidth="3"
          />

          {Array.from({ length: 5 }).map((_, index) => (
            <circle
              key={index}
              cx="0"
              cy="142"
              r={18 + index * 9 + Math.sin(phase * 50 + index) * 3}
              fill="none"
              stroke="#facc15"
              strokeWidth="3"
              opacity={0.8 - index * 0.12}
            />
          ))}

          <text
            x="0"
            y="98"
            textAnchor="middle"
            fontSize="15"
            fontWeight="900"
            fill="#f97316"
          >
            SPARK
          </text>
        </g>
      )}
    </g>
  );

  const ReedValve = () => (
    <g transform="translate(250 650)">
      <rect
        x="-48"
        y="-32"
        width="96"
        height="64"
        rx="13"
        fill="url(#metal)"
        stroke="#111"
        strokeWidth="4"
      />

      <circle cx="-22" cy="0" r="7" fill="#111" opacity="0.65" />
      <circle cx="22" cy="0" r="7" fill="#111" opacity="0.65" />

      <g transform={`rotate(${-28 * simulation.intakeReedOpen})`}>
        <rect
          x="-34"
          y="-5"
          width="68"
          height="10"
          rx="5"
          fill="#111"
          opacity="0.86"
        />
      </g>

      {simulation.intakeReedOpen > 0.05 && (
        <path
          d="M -55 18 C -20 42, 25 42, 60 18"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          opacity="0.8"
          markerEnd="url(#intakeArrow)"
        />
      )}
    </g>
  );

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
              Two-Stroke Petrol Engine
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Final logic update: spark-linked flame, piston-controlled ports, vacuum/compression glow, carburetor and scavenging.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {simulation.strokeName}
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
              Engine Controls
            </h3>

            <div className="space-y-3">
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
                label="Oil Mix"
                min={1}
                max={6}
                step={0.5}
                suffix="%"
                value={oilMixPercent}
                onChange={setOilMixPercent}
              />

              <ControlSlider
                label="Spark Timing BTDC"
                min={0}
                max={30}
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
              <option value="richOilMix">Too much oil</option>
              <option value="poorScavenging">Poor scavenging</option>
              <option value="blockedExhaust">Blocked exhaust</option>
              <option value="weakSpark">Weak spark</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {simulation.faultDescription}
            </p>
          </div>

          <div className="mt-4">
            <CycleStatusTable />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Quick Stroke Jump
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(["Downstroke", "Upstroke"] as StrokeName[]).map((stroke) => (
                <button
                  key={stroke}
                  type="button"
                  onClick={() => setStroke(stroke)}
                  className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold"
                >
                  {stroke}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Live Engine Data
            </h3>

            <div className="space-y-3">
              <GaugeBar
                label="Cylinder Pressure"
                value={simulation.pressureBar}
                max={45}
                suffix=" bar"
              />
              <GaugeBar
                label="Temperature"
                value={simulation.temperatureC}
                max={1000}
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
                <span>Crankcase pressure</span>
                <span className="font-mono">
                  {simulation.crankcasePressureBar} bar
                </span>
              </div>

              <div className="flex justify-between">
                <span>Spark angle</span>
                <span className="font-mono">
                  {Math.round(simulation.sparkAngle)}°
                </span>
              </div>

              <div className="flex justify-between">
                <span>Oil mix</span>
                <span className="font-mono">
                  {simulation.effectiveOilMix.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>Throttle</span>
                <span className="font-mono">{simulation.effectiveThrottle}%</span>
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
                label="Gas / Mixture Flow"
                onClick={() => setShowFlow((prev) => !prev)}
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
              <PortTimingGraph />
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
              <span>360°</span>
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
                    style={{ left: `${(event.degree / 360) * 100}%` }}
                  >
                    <div className="mx-auto h-2 w-[2px] bg-neutral-900" />
                    <div className="mt-1 rounded bg-neutral-900 px-1 text-[8px] font-bold text-white">
                      {event.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-1 text-center text-[11px]">
              {(["Downstroke", "Upstroke"] as StrokeName[]).map((stroke) => (
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
              ))}
            </div>
          </div>

          <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-xl border border-neutral-200 bg-neutral-100">
            <div style={{ width: `${canvasScale * 100}%`, minWidth: "560px" }}>
              <svg
                viewBox="0 0 940 1160"
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Final two-stroke petrol engine simulator"
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

                  <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="55%" stopColor="#f97316" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
                    <stop offset="45%" stopColor="#fb923c" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="crankcaseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.65" />
                    <stop offset="55%" stopColor="#22c55e" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="vacuumGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.6" />
                    <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>

                  <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" />
                  </filter>

                  <marker
                    id="transferArrow"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 12 6 L 0 12 Z" fill="#22c55e" />
                  </marker>

                  <marker
                    id="transferArrowLight"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 12 6 L 0 12 Z" fill="#bbf7d0" />
                  </marker>

                  <marker
                    id="exhaustArrow"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 12 6 L 0 12 Z" fill="#52525b" />
                  </marker>

                  <marker
                    id="exhaustArrowLight"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 12 6 L 0 12 Z" fill="#d4d4d8" />
                  </marker>

                  <marker
                    id="intakeArrow"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 12 6 L 0 12 Z" fill="#38bdf8" />
                  </marker>
                </defs>

                <rect width="940" height="1160" fill="#f3f4f6" />

                <path
                  d="
                    M300 90
                    L540 90
                    L540 600
                    C590 665 620 745 620 840
                    L620 950
                    C620 1035 550 1080 465 1080
                    L375 1080
                    C290 1080 220 1035 220 950
                    L220 840
                    C220 745 250 665 300 600
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="6"
                  opacity="0.92"
                />

                <path
                  d="
                    M320 185
                    L520 185
                    L520 610
                    C560 680 580 760 580 850
                    L580 930
                    C580 990 535 1035 475 1035
                    L365 1035
                    C305 1035 260 990 260 930
                    L260 850
                    C260 760 280 680 320 610
                    Z
                  "
                  fill="#111"
                  stroke="#222"
                  strokeWidth="5"
                />

                <path
                  d="
                    M60 595
                    L180 595
                    C245 595 295 650 330 715
                    L305 770
                    C265 705 225 675 175 675
                    L60 675
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="5"
                />

                <path
                  d="
                    M855 385
                    L650 385
                    C585 385 535 415 505 455
                    L505 510
                    C560 470 610 450 665 450
                    L855 450
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="5"
                />

                <path
                  d="
                    M315 735
                    C250 630 255 515 325 455
                    L360 490
                    C315 545 310 625 365 715
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="5"
                />

                <CrankcaseVacuumGlow />
                <CrankcasePressureGlow />

                <CarburetorThrottle />
                <ReedValve />

                <StrongTransferArrow />
                <StrongExhaustArrow />

                <Flow type="intake" active={simulation.intakeFlow} />
                <Flow type="transfer" active={simulation.transferFlow} />
                <Flow type="exhaust" active={simulation.exhaustFlow} />

                <PortHighlight
                  type="exhaust"
                  open={simulation.exhaustPortOpen}
                  x={505}
                  y={420}
                  width={62}
                  height={58}
                />

                <PortHighlight
                  type="transfer"
                  open={simulation.transferPortOpen}
                  x={292}
                  y={500}
                  width={58}
                  height={58}
                />

                <SparkPlug />

                <circle
                  cx="420"
                  cy="330"
                  r={54 + simulation.flameGlow * 44}
                  fill="url(#flameGlow)"
                  opacity={clamp(simulation.flameGlow, 0, 1)}
                />

                <ConnectingRod />

                <g transform={`translate(0 ${simulation.pistonY})`}>
                  <path
                    d="
                      M325 285
                      C325 250 352 228 388 228
                      L452 228
                      C488 228 515 250 515 285
                      L515 430
                      C515 470 488 498 448 498
                      L392 498
                      C352 498 325 470 325 430
                      Z
                    "
                    fill="url(#metal)"
                    stroke="#111"
                    strokeWidth="6"
                  />

                  <path d="M342 305 H498" stroke="#111" strokeWidth="7" />
                  <path d="M342 330 H498" stroke="#111" strokeWidth="7" />
                  <path d="M342 355 H498" stroke="#111" strokeWidth="7" />

                  <circle
                    cx="420"
                    cy="390"
                    r="27"
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
                    r="96"
                    fill="url(#metalDark)"
                    stroke="#111"
                    strokeWidth="7"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="65"
                    fill="url(#rod)"
                    stroke="#111"
                    strokeWidth="5"
                  />
                  <circle
                    cx="0"
                    cy={-simulation.crankRadius}
                    r="17"
                    fill="#111"
                    stroke="#fff"
                    strokeWidth="4"
                  />
                </g>

                <line x1="645" y1="260" x2="645" y2="380" stroke="#111" strokeWidth="2" />
                <text x="668" y="268" fontSize="13" fontWeight="900" fill="#111">
                  TDC
                </text>
                <text x="668" y="382" fontSize="13" fontWeight="900" fill="#111">
                  BDC
                </text>

                <circle
                  cx="645"
                  cy={268 + simulation.pistonNorm * 108}
                  r="6"
                  fill="#111"
                  stroke="#fff"
                  strokeWidth="2"
                />

                <LeaderLine x1={420} y1={125} x2={420} y2={72} />
                <Label x={420} y={52} text="Spark Plug" width={135} />

                <LeaderLine x1={420} y1={250} x2={220} y2={170} />
                <Label x={180} y={155} text="Combustion Chamber" width={205} />

                <LeaderLine x1={315} y1={530} x2={145} y2={470} />
                <Label x={120} y={455} text="Transfer Port" width={145} />

                <LeaderLine x1={540} y1={445} x2={710} y2={335} />
                <Label x={735} y={320} text="Exhaust Port" width={140} />

                <LeaderLine x1={125} y1={610} x2={125} y2={535} />
                <Label x={125} y={515} text="Carburetor / Throttle" width={205} />

                <LeaderLine x1={250} y1={650} x2={115} y2={560} />
                <Label x={120} y={545} text="Intake Reed Valve" width={180} />

                <LeaderLine x1={420} y1={735} x2={710} y2={690} />
                <Label x={750} y={675} text="Crankcase Pressure" width={210} />

                <LeaderLine x1={420} y1={800} x2={710} y2={840} />
                <Label x={750} y={855} text="Crankshaft" width={135} />

                <LeaderLine x1={725} y1={400} x2={810} y2={350} />
                <Label x={825} y={335} text="Exhaust Smoke" width={150} />

                <LeaderLine x1={382} y1={430 + simulation.pistonY} x2={165} y2={305} />
                <Label x={150} y={290} text="Smaller Piston" width={145} />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}