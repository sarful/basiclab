"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type StrokeName = "Intake" | "Compression" | "Power" | "Exhaust";

type FaultMode =
  | "normal"
  | "apexSealLeak"
  | "weakSpark"
  | "richMixture"
  | "leanMixture"
  | "poorCompression"
  | "blockedExhaust";

type FaceName = "A" | "B" | "C";

type Point = {
  x: number;
  y: number;
};

type FaceState = {
  name: FaceName;
  phaseDeg: number;
  strokeName: StrokeName;
  progress: number;
  volumePercent: number;
  pressureBar: number;
  temperatureC: number;
  intake: number;
  compression: number;
  spark: number;
  flame: number;
  exhaust: number;
};

type SimulationState = {
  shaftAngleDeg: number;
  rotorAngleDeg: number;
  eccentricAngleDeg: number;

  housingCenterX: number;
  housingCenterY: number;
  rotorCenterX: number;
  rotorCenterY: number;
  eccentricRadius: number;

  apexPoints: Point[];

  faces: FaceState[];

  intakeFlow: number;
  compressionLevel: number;
  sparkActive: number;
  flameGlow: number;
  exhaustFlow: number;
  smokeLevel: number;
  apexLeak: number;

  pressureBar: number;
  temperatureC: number;
  rpm: number;

  activeLearningNote: string;
  faultDescription: string;

  effectiveThrottle: number;
  effectiveMixture: number;
  effectiveSparkAdvance: number;
};

const FACE_OFFSETS: Array<{ name: FaceName; offset: number }> = [
  { name: "A", offset: 0 },
  { name: "B", offset: 360 },
  { name: "C", offset: 720 },
];

const TIMELINE_EVENTS = [
  { label: "INT", degree: 0 },
  { label: "COMP", degree: 270 },
  { label: "SPK", degree: 530 },
  { label: "PWR", degree: 540 },
  { label: "EXH", degree: 810 },
  { label: "END", degree: 1080 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function circularPulse(valueDeg: number, centerDeg: number, widthDeg: number) {
  const diff = Math.abs(((valueDeg - centerDeg + 540) % 1080) - 540);

  if (diff > widthDeg) return 0;

  return Math.cos((diff / widthDeg) * (Math.PI / 2));
}

function pulse(valueDeg: number, startDeg: number, endDeg: number) {
  if (valueDeg < startDeg || valueDeg > endDeg) return 0;

  const t = (valueDeg - startDeg) / (endDeg - startDeg);

  return Math.sin(Math.PI * t);
}

function getStrokeFromFacePhase(facePhase: number): {
  strokeName: StrokeName;
  progress: number;
} {
  if (facePhase < 270) {
    return { strokeName: "Intake", progress: facePhase / 270 };
  }

  if (facePhase < 540) {
    return { strokeName: "Compression", progress: (facePhase - 270) / 270 };
  }

  if (facePhase < 810) {
    return { strokeName: "Power", progress: (facePhase - 540) / 270 };
  }

  return { strokeName: "Exhaust", progress: (facePhase - 810) / 270 };
}

function getVolumePercent(strokeName: StrokeName, progress: number) {
  if (strokeName === "Intake") return Math.round(18 + progress * 82);
  if (strokeName === "Compression") return Math.round(100 - progress * 82);
  if (strokeName === "Power") return Math.round(18 + progress * 80);

  return Math.round(98 - progress * 80);
}

function pointOnEllipseBoundary(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  angleRad: number,
  scale = 0.97
): Point {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const radius =
    1 / Math.sqrt((cos * cos) / (radiusX * radiusX) + (sin * sin) / (radiusY * radiusY));

  return {
    x: centerX + cos * radius * scale,
    y: centerY + sin * radius * scale,
  };
}

function buildCurvedRotorPath(points: Point[], centerX: number, centerY: number) {
  const [p0, p1, p2] = points;

  const controlPoint = (a: Point, b: Point) => {
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    const dx = midX - centerX;
    const dy = midY - centerY;
    const length = Math.hypot(dx, dy) || 1;

    return {
      x: midX + (dx / length) * 48,
      y: midY + (dy / length) * 48,
    };
  };

  const c01 = controlPoint(p0, p1);
  const c12 = controlPoint(p1, p2);
  const c20 = controlPoint(p2, p0);

  return `
    M ${p0.x} ${p0.y}
    Q ${c01.x} ${c01.y} ${p1.x} ${p1.y}
    Q ${c12.x} ${c12.y} ${p2.x} ${p2.y}
    Q ${c20.x} ${c20.y} ${p0.x} ${p0.y}
    Z
  `;
}

function computeSimulation(
  phase: number,
  speed: number,
  throttle: number,
  mixture: number,
  sparkAdvance: number,
  faultMode: FaultMode
): SimulationState {
  const shaftAngleDeg = phase * 1080;
  const eccentricAngleDeg = shaftAngleDeg;
  const rotorAngleDeg = shaftAngleDeg / 3;

  const housingCenterX = 440;
  const housingCenterY = 360;
  const eccentricRadius = 28;

  const eccentricRad = (eccentricAngleDeg * Math.PI) / 180;

  const rotorCenterX = housingCenterX + Math.cos(eccentricRad) * eccentricRadius;
  const rotorCenterY = housingCenterY + Math.sin(eccentricRad) * eccentricRadius;

  const innerHousingRadiusX = 265;
  const innerHousingRadiusY = 185;

  const rotorAngleRad = ((rotorAngleDeg + 30) * Math.PI) / 180;

  const apexPoints = Array.from({ length: 3 }).map((_, index) => {
    const angle = rotorAngleRad + index * ((2 * Math.PI) / 3);

    return pointOnEllipseBoundary(
      housingCenterX,
      housingCenterY,
      innerHousingRadiusX,
      innerHousingRadiusY,
      angle,
      0.985
    );
  });

  const effectiveThrottle =
    faultMode === "leanMixture" ? Math.max(10, throttle - 10) : throttle;

  const effectiveMixture =
    faultMode === "richMixture"
      ? Math.min(1.4, mixture + 0.25)
      : faultMode === "leanMixture"
        ? Math.max(0.65, mixture - 0.25)
        : mixture;

  const effectiveSparkAdvance = sparkAdvance;

  const throttleFactor = effectiveThrottle / 100;

  const mixtureQuality =
    effectiveMixture > 1.18
      ? 0.76
      : effectiveMixture < 0.82
        ? 0.68
        : 1;

  const compressionQuality =
    faultMode === "poorCompression"
      ? 0.58
      : faultMode === "apexSealLeak"
        ? 0.65
        : 1;

  const sparkQuality = faultMode === "weakSpark" ? 0.45 : 1;
  const exhaustPenalty = faultMode === "blockedExhaust" ? 0.42 : 1;

  const sparkCenter = 540 - effectiveSparkAdvance;

  const faces: FaceState[] = FACE_OFFSETS.map((face) => {
    const facePhase = (shaftAngleDeg + face.offset) % 1080;
    const { strokeName, progress } = getStrokeFromFacePhase(facePhase);

    const intake = strokeName === "Intake" ? Math.sin(Math.PI * progress) : 0;
    const compression =
      strokeName === "Compression" ? Math.sin(Math.PI * progress) : 0;

    const spark = circularPulse(facePhase, sparkCenter, 7);

    const flame =
      pulse(facePhase, sparkCenter + 4, sparkCenter + 155) *
      throttleFactor *
      mixtureQuality *
      sparkQuality *
      compressionQuality;

    const exhaust = strokeName === "Exhaust" ? Math.sin(Math.PI * progress) : 0;

    const volumePercent = getVolumePercent(strokeName, progress);

    const pressureBar = Math.max(
      1,
      Math.round(
        1 +
          compression * 8 * compressionQuality +
          spark * 5 +
          flame * 28 -
          exhaust * 5 +
          (faultMode === "blockedExhaust" ? exhaust * 8 : 0)
      )
    );

    const temperatureC = Math.max(
      35,
      Math.round(
        70 +
          compression * 160 +
          spark * 80 +
          flame * 640 -
          exhaust * 170 +
          (faultMode === "leanMixture" ? 55 : 0) +
          (faultMode === "blockedExhaust" ? 120 : 0)
      )
    );

    return {
      name: face.name,
      phaseDeg: facePhase,
      strokeName,
      progress,
      volumePercent,
      pressureBar,
      temperatureC,
      intake: intake * throttleFactor,
      compression,
      spark,
      flame,
      exhaust: exhaust * exhaustPenalty,
    };
  });

  const intakeFlow = Math.max(...faces.map((face) => face.intake));
  const compressionLevel = Math.max(...faces.map((face) => face.compression));
  const sparkActive = Math.max(...faces.map((face) => face.spark));
  const flameGlow = Math.max(...faces.map((face) => face.flame));
  const exhaustFlow = Math.max(...faces.map((face) => face.exhaust));

  const smokeLevel = clamp(
    exhaustFlow *
      (faultMode === "richMixture"
        ? 1.5
        : faultMode === "blockedExhaust"
          ? 1.7
          : 1),
    0,
    1.7
  );

  const apexLeak =
    faultMode === "apexSealLeak" ? 0.35 + compressionLevel * 0.55 : 0;

  const pressureBar = Math.max(...faces.map((face) => face.pressureBar));
  const temperatureC = Math.max(...faces.map((face) => face.temperatureC));

  const activeFace =
    faces.find((face) => face.spark > 0.05) ||
    faces.find((face) => face.flame > 0.05) ||
    faces.find((face) => face.intake > 0.1) ||
    faces[0];

  const activeLearningNote =
    apexLeak > 0.05
      ? "Apex seal leak is reducing compression between chambers."
      : sparkActive > 0.05
        ? "Spark plugs are firing into the compressed chamber."
        : flameGlow > 0.05
          ? "Combustion follows the chamber shape and turns the eccentric shaft."
          : intakeFlow > 0.05
            ? "Fresh air-fuel mixture enters through the intake port."
            : exhaustFlow > 0.05
              ? "Burnt gas leaves through the exhaust port."
              : activeFace.strokeName === "Compression"
                ? "Rotor is reducing chamber volume and compressing the mixture."
                : "The shaft rotates three times while the rotor turns once.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal Wankel rotary engine operation."
      : faultMode === "apexSealLeak"
        ? "Apex seal leak allows pressure to escape between chambers, reducing compression and power."
        : faultMode === "weakSpark"
          ? "Weak spark causes poor ignition and weak combustion."
          : faultMode === "richMixture"
            ? "Rich mixture means too much fuel. It can increase smoke and reduce efficiency."
            : faultMode === "leanMixture"
              ? "Lean mixture means too much air or too little fuel. It may run hotter and weaker."
              : faultMode === "poorCompression"
                ? "Poor compression reduces chamber pressure before ignition."
                : "Blocked exhaust traps burnt gas and raises temperature.";

  return {
    shaftAngleDeg,
    rotorAngleDeg,
    eccentricAngleDeg,

    housingCenterX,
    housingCenterY,
    rotorCenterX,
    rotorCenterY,
    eccentricRadius,

    apexPoints,

    faces,

    intakeFlow,
    compressionLevel,
    sparkActive,
    flameGlow,
    exhaustFlow,
    smokeLevel,
    apexLeak,

    pressureBar,
    temperatureC,
    rpm: Math.round(speed * 0.09 * 60),

    activeLearningNote,
    faultDescription,

    effectiveThrottle,
    effectiveMixture,
    effectiveSparkAdvance,
  };
}

export default function WankelRotaryEngineLearningSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [throttle, setThrottle] = useState(55);
  const [mixture, setMixture] = useState(1);
  const [sparkAdvance, setSparkAdvance] = useState(10);
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
        sparkAdvance,
        faultMode
      ),
    [phase, speed, throttle, mixture, sparkAdvance, faultMode]
  );

  const graphSamples = useMemo(() => {
    return Array.from({ length: 180 }).map((_, index) =>
      computeSimulation(
        index / 179,
        speed,
        throttle,
        mixture,
        sparkAdvance,
        faultMode
      )
    );
  }, [speed, throttle, mixture, sparkAdvance, faultMode]);

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

      setPhase((prev) => (prev + delta * speed * 0.09) % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed]);

  const stepTimeline = (degreeStep: number) => {
    setIsPlaying(false);

    setPhase((prev) => {
      const next = prev + degreeStep / 1080;
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

  const StatusPill = ({ active }: { active: boolean }) => (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        active ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {active ? "ON" : "OFF"}
    </span>
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

  const ChamberStatusTable = () => (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <h3 className="mb-3 text-sm font-bold text-neutral-900">
        Rotor Face Status
      </h3>

      <div className="overflow-hidden rounded-lg border border-neutral-200 text-xs">
        <div className="grid grid-cols-[45px_1fr_auto] bg-neutral-100 px-3 py-2 font-bold text-neutral-700">
          <span>Face</span>
          <span>Stroke</span>
          <span>Status</span>
        </div>

        {simulation.faces.map((face) => {
          const active =
            face.intake > 0.05 ||
            face.compression > 0.65 ||
            face.spark > 0.05 ||
            face.flame > 0.05 ||
            face.exhaust > 0.05;

          return (
            <div
              key={face.name}
              className="grid grid-cols-[45px_1fr_auto] items-center border-t border-neutral-200 px-3 py-2"
            >
              <span className="font-mono font-bold">{face.name}</span>
              <span>
                {face.strokeName}{" "}
                <span className="text-neutral-500">
                  {Math.round(face.phaseDeg)}°
                </span>
              </span>
              <StatusPill active={active} />
            </div>
          );
        })}
      </div>
    </div>
  );

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

        {[0, 270, 540, 810, 1080].map((degree) => {
          const x = 28 + (degree / 1080) * 268;

          return (
            <g key={degree}>
              <line x1={x} y1="20" x2={x} y2="95" stroke="#ddd" />
              <text x={x} y="110" fontSize="8" textAnchor="middle" fill="#666">
                {degree}
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
        const faceA = sample.faces[0];
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(faceA.pressureBar / 40, 0, 1) * 75;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY =
      95 - clamp(simulation.faces[0].pressureBar / 40, 0, 1) * 75;

    return (
      <MiniGraph title="Face A Pressure Cycle">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const VolumeGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const faceA = sample.faces[0];
        const x = 28 + (index / (graphSamples.length - 1)) * 268;
        const y = 95 - clamp(faceA.volumePercent / 100, 0, 1) * 75;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 28 + phase * 268;
    const currentY =
      95 - clamp(simulation.faces[0].volumePercent / 100, 0, 1) * 75;

    return (
      <MiniGraph title="Face A Chamber Volume">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.5" />
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

  const SmallInsideLabel = ({
    x,
    y,
    text,
  }: {
    x: number;
    y: number;
    text: string;
  }) =>
    showLabels ? (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill="#ffffff"
        opacity="0.9"
      >
        {text}
      </text>
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

  const FlowParticles = ({
    type,
    active,
  }: {
    type: "intake" | "exhaust";
    active: number;
  }) => {
    if (!showFlow || active <= 0.03) return null;

    const points: Array<[number, number]> =
      type === "intake"
        ? [
            [90, 360],
            [180, 360],
            [260, 380],
            [335, 405],
          ]
        : [
            [548, 414],
            [650, 410],
            [760, 395],
            [850, 390],
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
        {Array.from({ length: type === "intake" ? 24 : 28 }).map((_, i) => {
          const progress = (phase * (type === "intake" ? 6 : 4.5) + i / 24) % 1;
          const point = getPoint(progress);

          return (
            <g
              key={`${type}-${i}`}
              transform={`translate(${point.x + Math.sin(i + phase * 12) * 5} ${
                point.y + Math.cos(i + phase * 16) * 5
              }) rotate(${point.angle})`}
            >
              <circle
                r={type === "intake" ? 4.5 : 8 + progress * 7}
                fill={type === "intake" ? "#38bdf8" : "#71717a"}
                opacity={
                  type === "intake"
                    ? 0.75
                    : 0.35 + simulation.smokeLevel * 0.22
                }
                filter={type === "exhaust" ? "url(#smokeBlur)" : undefined}
              />

              {i % 3 === 0 && (
                <path
                  d="M -8 -5 L 9 0 L -8 5 Z"
                  fill={type === "intake" ? "#0ea5e9" : "#52525b"}
                  opacity="0.72"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const ChamberZones = () => (
    <g>
      <path
        d="M 180 360 C 185 250, 300 185, 430 188 C 360 245, 320 315, 320 410 C 270 398, 225 382, 180 360 Z"
        fill="#0284c7"
        opacity={0.14 + simulation.intakeFlow * 0.28}
      />

      <path
        d="M 410 180 C 540 170, 660 235, 700 335 C 610 305, 520 285, 430 300 C 430 260, 425 220, 410 180 Z"
        fill="#f59e0b"
        opacity={0.12 + simulation.compressionLevel * 0.3}
      />

      <path
        d="M 505 300 C 625 300, 705 365, 700 440 C 620 485, 535 470, 465 410 C 480 370, 495 335, 505 300 Z"
        fill="#dc2626"
        opacity={0.14 + simulation.flameGlow * 0.42}
      />

      <path
        d="M 455 430 C 550 490, 650 485, 700 435 C 670 510, 565 545, 430 540 C 335 535, 250 500, 200 440 C 285 455, 370 455, 455 430 Z"
        fill="#71717a"
        opacity={0.13 + simulation.exhaustFlow * 0.25}
      />

      <SmallInsideLabel x={260} y={330} text="INTAKE" />
      <SmallInsideLabel x={500} y={235} text="COMPRESSION" />
      <SmallInsideLabel x={600} y={370} text="POWER" />
      <SmallInsideLabel x={515} y={505} text="EXHAUST" />
    </g>
  );

  const SparkTargetHighlight = () => {
    const opacity = clamp(simulation.sparkActive * 0.9 + simulation.flameGlow * 0.45, 0, 0.9);

    return (
      <g opacity={opacity}>
        <path
          d="M 515 285 C 600 280, 675 325, 700 385 C 645 425, 555 425, 485 380 C 490 345, 500 315, 515 285 Z"
          fill="#fde047"
          opacity="0.35"
        />

        <path
          d="M 515 285 C 600 280, 675 325, 700 385"
          fill="none"
          stroke="#facc15"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <text
          x="625"
          y="315"
          textAnchor="middle"
          fontSize="15"
          fontWeight="900"
          fill="#f97316"
        >
          TARGET CHAMBER
        </text>
      </g>
    );
  };

  const ChamberFlame = () => {
    if (simulation.flameGlow <= 0.03) return null;

    return (
      <g opacity={simulation.flameGlow}>
        <path
          d="
            M 500 310
            C 595 285, 680 335, 700 390
            C 655 450, 545 455, 465 395
            C 470 360, 485 330, 500 310
            Z
          "
          fill="url(#flameGlow)"
        />

        {Array.from({ length: 4 }).map((_, index) => (
          <path
            key={index}
            d={`
              M ${500 - index * 6} ${320 + index * 10}
              C ${575 + index * 8} ${295 + index * 8},
                ${665 - index * 4} ${345 + index * 8},
                ${680 - index * 2} ${390 + index * 6}
              C ${625 - index * 5} ${430 + index * 6},
                ${540 - index * 4} ${435 + index * 5},
                ${480 - index * 4} ${395 + index * 6}
              Z
            `}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            opacity={0.55 - index * 0.1}
          />
        ))}
      </g>
    );
  };

  const EccentricGuide = () => (
    <g>
      <circle
        cx={simulation.housingCenterX}
        cy={simulation.housingCenterY}
        r={simulation.eccentricRadius}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeDasharray="6 6"
        opacity="0.85"
      />

      <line
        x1={simulation.housingCenterX}
        y1={simulation.housingCenterY}
        x2={simulation.rotorCenterX}
        y2={simulation.rotorCenterY}
        stroke="#f59e0b"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />

      <circle
        cx={simulation.housingCenterX}
        cy={simulation.housingCenterY}
        r="7"
        fill="#111"
        stroke="#fff"
        strokeWidth="3"
      />

      <circle
        cx={simulation.rotorCenterX}
        cy={simulation.rotorCenterY}
        r="8"
        fill="#f59e0b"
        stroke="#111"
        strokeWidth="3"
      />

      <g
        transform={`translate(${simulation.housingCenterX} ${simulation.housingCenterY}) rotate(${simulation.shaftAngleDeg})`}
      >
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="3"
          strokeDasharray="3 5"
        />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          return (
            <line
              key={i}
              x1={Math.cos(angle) * 35}
              y1={Math.sin(angle) * 35}
              x2={Math.cos(angle) * 45}
              y2={Math.sin(angle) * 45}
              stroke="#d4d4d8"
              strokeWidth="3"
            />
          );
        })}
      </g>
    </g>
  );

  const RotationRatioIndicator = () => (
    <g transform="translate(690 58)">
      <rect
        x="-18"
        y="-28"
        width="185"
        height="92"
        rx="14"
        fill="#fff"
        opacity="0.88"
        stroke="#111"
        strokeWidth="3"
      />

      <text x="74" y="-7" textAnchor="middle" fontSize="12" fontWeight="900" fill="#111">
        3:1 ROTATION
      </text>

      <g transform="translate(35 33)">
        <circle r="22" fill="url(#shaftMetal)" stroke="#111" strokeWidth="3" />
        <g transform={`rotate(${simulation.shaftAngleDeg})`}>
          <line x1="0" y1="0" x2="18" y2="0" stroke="#111" strokeWidth="4" strokeLinecap="round" />
        </g>
        <text y="39" textAnchor="middle" fontSize="9" fontWeight="800" fill="#111">
          Shaft 3x
        </text>
      </g>

      <g transform="translate(118 33)">
        <circle r="22" fill="url(#rotorMetal)" stroke="#111" strokeWidth="3" />
        <g transform={`rotate(${simulation.rotorAngleDeg})`}>
          <path d="M 0 -16 L 14 9 L -14 9 Z" fill="#fff" stroke="#111" strokeWidth="2" />
        </g>
        <text y="39" textAnchor="middle" fontSize="9" fontWeight="800" fill="#111">
          Rotor 1x
        </text>
      </g>
    </g>
  );

  const Rotor = () => {
    const rotorPath = buildCurvedRotorPath(
      simulation.apexPoints,
      simulation.rotorCenterX,
      simulation.rotorCenterY
    );

    return (
      <g>
        <path
          d={rotorPath}
          fill="url(#rotorMetal)"
          stroke="#111"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        <path
          d={rotorPath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.75"
        />

        <circle
          cx={simulation.rotorCenterX}
          cy={simulation.rotorCenterY}
          r="38"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="5"
        />

        <circle
          cx={simulation.housingCenterX}
          cy={simulation.housingCenterY}
          r="56"
          fill="url(#shaftMetal)"
          stroke="#111"
          strokeWidth="5"
          opacity="0.92"
        />

        {simulation.apexPoints.map((point, index) => {
          const angle =
            (Math.atan2(
              point.y - simulation.housingCenterY,
              point.x - simulation.housingCenterX
            ) *
              180) /
              Math.PI +
            90;

          return (
            <g key={index} transform={`translate(${point.x} ${point.y}) rotate(${angle})`}>
              <rect
                x="-23"
                y="-6"
                width="46"
                height="12"
                rx="6"
                fill="#111"
                stroke="#f5f5f5"
                strokeWidth="3"
              />

              {simulation.apexLeak > 0.05 && (
                <g opacity={simulation.apexLeak}>
                  <circle
                    cx="0"
                    cy="0"
                    r={24 + Math.sin(phase * 30 + index) * 5}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                  />
                  <path
                    d="M -24 0 C -5 -22, 16 22, 38 0"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          );
        })}

        <text
          x={simulation.rotorCenterX}
          y={simulation.rotorCenterY + 5}
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#fff"
        >
          ROTOR
        </text>
      </g>
    );
  };

  const SparkPlugs = () => (
    <g>
      <g transform="translate(560 245) rotate(25)">
        <rect
          x="-12"
          y="-55"
          width="24"
          height="78"
          rx="7"
          fill="url(#metal)"
          stroke="#111"
          strokeWidth="3"
        />

        <path
          d="M -8 20 L 8 20 L 5 50 L -5 50 Z"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="2"
        />
      </g>

      <g transform="translate(600 300) rotate(25)">
        <rect
          x="-12"
          y="-55"
          width="24"
          height="78"
          rx="7"
          fill="url(#metal)"
          stroke="#111"
          strokeWidth="3"
        />

        <path
          d="M -8 20 L 8 20 L 5 50 L -5 50 Z"
          fill="url(#metalDark)"
          stroke="#111"
          strokeWidth="2"
        />
      </g>

      {simulation.sparkActive > 0.03 && (
        <g opacity={simulation.sparkActive}>
          <circle cx="552" cy="305" r="45" fill="url(#sparkGlow)" />
          <path
            d="M 552 290 L 530 325 L 558 312 L 543 350 L 590 292 L 562 305 Z"
            fill="#fde047"
            stroke="#f97316"
            strokeWidth="3"
          />
          <text
            x="555"
            y="250"
            textAnchor="middle"
            fontSize="16"
            fontWeight="900"
            fill="#f97316"
          >
            SPARK
          </text>
        </g>
      )}
    </g>
  );

  return (
    <main className="min-h-screen bg-neutral-100 p-3 sm:p-4">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[390px_1fr]">
        <aside className="order-2 rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm xl:order-1 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Wankel Rotary Engine
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Curved rotor, apex seal contact, chamber zones, spark target, eccentric guide and 3:1 motion.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  Shaft Angle: {Math.round(simulation.shaftAngleDeg)}°
                </p>
                <p className="text-xs text-neutral-500">
                  Rotor Angle: {Math.round(simulation.rotorAngleDeg)}°
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
                onClick={() => stepTimeline(-30)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
              >
                -30°
              </button>

              <button
                type="button"
                onClick={() => stepTimeline(30)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
              >
                +30°
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
                label="Spark Advance"
                min={0}
                max={30}
                step={1}
                suffix="°"
                value={sparkAdvance}
                onChange={setSparkAdvance}
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
              <option value="apexSealLeak">Apex seal leak</option>
              <option value="weakSpark">Weak spark</option>
              <option value="richMixture">Rich mixture</option>
              <option value="leanMixture">Lean mixture</option>
              <option value="poorCompression">Poor compression</option>
              <option value="blockedExhaust">Blocked exhaust</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {simulation.faultDescription}
            </p>
          </div>

          <div className="mt-4">
            <ChamberStatusTable />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Live Engine Data
            </h3>

            <div className="space-y-3">
              <GaugeBar
                label="Peak Pressure"
                value={simulation.pressureBar}
                max={45}
                suffix=" bar"
              />
              <GaugeBar
                label="Peak Temperature"
                value={simulation.temperatureC}
                max={1100}
                suffix="°C"
              />
              <GaugeBar
                label="Apex Seal Leak"
                value={Math.round(simulation.apexLeak * 100)}
                max={100}
                suffix="%"
              />
            </div>

            <div className="mt-3 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span>Throttle</span>
                <span className="font-mono">
                  {simulation.effectiveThrottle}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>Mixture</span>
                <span className="font-mono">
                  {simulation.effectiveMixture.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Spark advance</span>
                <span className="font-mono">
                  {simulation.effectiveSparkAdvance}°
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
              {simulation.activeLearningNote}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Visual Options
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <ToggleButton
                active={showFlow}
                label="Intake / Exhaust Flow"
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
              <PressureGraph />
              <VolumeGraph />
            </div>
          )}
        </aside>

        <section className="order-1 rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm sm:p-4 xl:order-2">
          <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-2 flex justify-between text-xs text-neutral-600">
              <span>0°</span>
              <span className="font-semibold text-neutral-900">
                Face A Cycle: {Math.round(simulation.faces[0].phaseDeg)}°
              </span>
              <span>1080°</span>
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
                    style={{ left: `${(event.degree / 1080) * 100}%` }}
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
                      simulation.faces[0].strokeName === stroke
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
                viewBox="0 0 920 820"
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Updated Wankel rotary engine learning simulator"
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

                  <linearGradient id="rotorMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4d4d8" />
                    <stop offset="50%" stopColor="#52525b" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  <linearGradient id="shaftMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5f5f5" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>

                  <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
                    <stop offset="45%" stopColor="#fb923c" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                    <stop offset="55%" stopColor="#f97316" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>

                  <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" />
                  </filter>
                </defs>

                <rect width="920" height="820" fill="#f3f4f6" />

                <RotationRatioIndicator />

                <path
                  d="
                    M125 360
                    C125 215 245 125 440 125
                    C635 125 755 215 755 360
                    C755 505 635 595 440 595
                    C245 595 125 505 125 360
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="8"
                />

                <path
                  d="
                    M175 360
                    C175 245 270 175 440 175
                    C610 175 705 245 705 360
                    C705 475 610 545 440 545
                    C270 545 175 475 175 360
                    Z
                  "
                  fill="#111"
                  stroke="#222"
                  strokeWidth="5"
                />

                <ChamberZones />

                <path
                  d="
                    M40 330
                    L170 330
                    C215 330 245 350 270 380
                    L245 420
                    C215 395 185 385 145 385
                    L40 385
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="5"
                />

                <path
                  d="
                    M880 375
                    L705 375
                    C660 375 625 395 600 425
                    L625 465
                    C660 440 700 430 745 430
                    L880 430
                    Z
                  "
                  fill="url(#metal)"
                  stroke="#111"
                  strokeWidth="5"
                />

                <SparkTargetHighlight />
                <ChamberFlame />

                <FlowParticles type="intake" active={simulation.intakeFlow} />
                <FlowParticles type="exhaust" active={simulation.exhaustFlow} />

                <SparkPlugs />
                <EccentricGuide />
                <Rotor />

                <LeaderLine x1={440} y1={125} x2={440} y2={70} />
                <Label x={440} y={52} text="Epitrochoid Housing" width={190} />

                <LeaderLine x1={simulation.rotorCenterX} y1={simulation.rotorCenterY} x2={440} y2={640} />
                <Label x={440} y={660} text="Curved Triangular Rotor" width={215} />

                <LeaderLine x1={simulation.housingCenterX} y1={simulation.housingCenterY} x2={210} y2={640} />
                <Label x={185} y={660} text="Eccentric Shaft Guide" width={190} />

                <LeaderLine x1={120} y1={355} x2={100} y2={265} />
                <Label x={100} y={245} text="Intake Port" width={130} />

                <LeaderLine x1={760} y1={410} x2={810} y2={320} />
                <Label x={820} y={300} text="Exhaust Port" width={135} />

                <LeaderLine x1={560} y1={245} x2={670} y2={205} />
                <Label x={700} y={190} text="Spark Target Area" width={170} />

                <LeaderLine x1={simulation.apexPoints[0].x} y1={simulation.apexPoints[0].y} x2={690} y2={590} />
                <Label x={720} y={610} text="Housing-Touching Apex Seals" width={245} />

                {simulation.apexLeak > 0.05 && (
                  <text
                    x="440"
                    y="750"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="900"
                    fill="#ef4444"
                  >
                    APEX SEAL LEAK
                  </text>
                )}
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}