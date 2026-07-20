"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type StrokeName = "Intake" | "Compression" | "Power" | "Exhaust";
type ZoomMode = "full" | "head" | "cylinder" | "crankcase";

type FaultMode =
  | "normal"
  | "lowCompression"
  | "lateInjection"
  | "excessFuel"
  | "blockedExhaust"
  | "weakSpring";

type PartKey =
  | "airFilter"
  | "intakeValve"
  | "exhaustValve"
  | "fuelInjector"
  | "camshaft"
  | "rockerArm"
  | "piston"
  | "connectingRod"
  | "crankshaft"
  | "cylinder"
  | "exhaust";

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
  fuelInjection: number;
  powerGlow: number;

  pressureBar: number;
  temperatureC: number;
  chamberVolumePercent: number;
  rpm: number;
  smokeLevel: number;

  strokeName: StrokeName;
  strokeDescription: string;
  learningNote: string;
  faultDescription: string;

  intakeValveOpen: boolean;
  exhaustValveOpen: boolean;
  fuelActive: boolean;
  combustionActive: boolean;

  effectiveCompressionRatio: number;
  effectiveFuelQuantity: number;
  injectionStartDeg: number;
  injectionEndDeg: number;
};

const VIEWBOX_MAP: Record<ZoomMode, string> = {
  full: "0 0 800 1120",
  head: "0 0 800 520",
  cylinder: "190 250 420 520",
  crankcase: "150 640 500 430",
};

const FAULT_LABELS: Record<FaultMode, string> = {
  normal: "Normal",
  lowCompression: "Low compression",
  lateInjection: "Late injection",
  excessFuel: "Excess fuel",
  blockedExhaust: "Blocked exhaust",
  weakSpring: "Weak valve spring",
};

const PART_INFO: Record<PartKey, { title: string; description: string }> = {
  airFilter: {
    title: "Air Filter / Intake",
    description:
      "Fresh air enters through the intake side. In a real diesel engine, filtered air flows into the cylinder during the intake stroke.",
  },
  intakeValve: {
    title: "Intake Valve",
    description:
      "The intake valve opens during the intake stroke so fresh air can enter the cylinder.",
  },
  exhaustValve: {
    title: "Exhaust Valve",
    description:
      "The exhaust valve opens during the exhaust stroke so burnt gases can leave the cylinder.",
  },
  fuelInjector: {
    title: "Fuel Injector",
    description:
      "A CI engine injects fuel near the end of compression. There is no spark plug because hot compressed air ignites the fuel.",
  },
  camshaft: {
    title: "Camshaft",
    description:
      "The camshaft rotates at half crankshaft speed. Its lobes push followers and rocker arms to open the valves once per 720° engine cycle.",
  },
  rockerArm: {
    title: "Rocker Arm",
    description:
      "The rocker arm transfers cam lobe motion to the valve stem, pushing the valve open against the spring.",
  },
  piston: {
    title: "Piston",
    description:
      "The piston moves between TDC and BDC. It compresses air and receives force from combustion.",
  },
  connectingRod: {
    title: "Connecting Rod",
    description:
      "The connecting rod links the piston pin to the crank pin and converts piston motion into crankshaft rotation.",
  },
  crankshaft: {
    title: "Crankshaft",
    description:
      "The crankshaft converts the piston’s up-down motion into rotary motion.",
  },
  cylinder: {
    title: "Cylinder",
    description:
      "The cylinder guides piston movement and contains air compression, fuel injection, combustion, and exhaust.",
  },
  exhaust: {
    title: "Exhaust System",
    description:
      "Burnt gases leave through the exhaust valve and flow out through the exhaust pipe. Faults can increase smoke.",
  },
};

const LESSONS = [
  {
    id: "air",
    title: "Lesson 1: Air Intake",
    degree: 90,
    part: "intakeValve" as PartKey,
    text: "The intake cam lobe opens the intake valve through the rocker arm while the piston moves downward.",
  },
  {
    id: "compression",
    title: "Lesson 2: Compression",
    degree: 260,
    part: "piston" as PartKey,
    text: "Both valves are closed. The piston moves upward and compresses air, raising temperature and pressure.",
  },
  {
    id: "injection",
    title: "Lesson 3: Fuel Injection",
    degree: 345,
    part: "fuelInjector" as PartKey,
    text: "Fuel is injected into very hot compressed air near the end of the compression stroke.",
  },
  {
    id: "power",
    title: "Lesson 4: Power Stroke",
    degree: 400,
    part: "piston" as PartKey,
    text: "Combustion pushes the piston downward and produces useful power.",
  },
  {
    id: "exhaust",
    title: "Lesson 5: Exhaust",
    degree: 610,
    part: "exhaustValve" as PartKey,
    text: "The exhaust cam lobe opens the exhaust valve through the rocker arm so burnt gases leave the cylinder.",
  },
  {
    id: "camshaft",
    title: "Lesson 6: Camshaft Timing",
    degree: 90,
    part: "camshaft" as PartKey,
    text: "The crankshaft completes 720° while the camshaft completes 360°. This is why each valve opens once per four-stroke cycle.",
  },
];

const TIMELINE_EVENTS = [
  { label: "TDC", degree: 0 },
  { label: "IVO", degree: 10 },
  { label: "IVC", degree: 165 },
  { label: "BDC", degree: 180 },
  { label: "SOI", degree: 338 },
  { label: "SOC", degree: 360 },
  { label: "TDC", degree: 360 },
  { label: "BDC", degree: 540 },
  { label: "EVO", degree: 550 },
  { label: "EVC", degree: 710 },
  { label: "TDC", degree: 720 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computeSimulation(
  phase: number,
  speed: number,
  compressionRatio: number,
  fuelQuantity: number,
  faultMode: FaultMode,
): SimulationState {
  const cycleAngleDeg = phase * 720;
  const crankAngleDeg = cycleAngleDeg;
  const camAngleDeg = cycleAngleDeg / 2;

  const crankRad = (crankAngleDeg * Math.PI) / 180;

  const crankCenterX = 400;
  const crankCenterY = 895;
  const crankRadius = 48;
  const rodLength = 312;
  const pistonBasePinY = 535;

  const crankPinX = crankCenterX + Math.sin(crankRad) * crankRadius;
  const crankPinY = crankCenterY - Math.cos(crankRad) * crankRadius;

  const horizontalOffset = crankRadius * Math.sin(crankRad);
  const verticalRodPart = Math.sqrt(
    Math.max(rodLength ** 2 - horizontalOffset ** 2, 0),
  );

  const pistonPinX = 400;
  const pistonPinY =
    crankCenterY - verticalRodPart - crankRadius * Math.cos(crankRad);

  const pistonY = pistonPinY - pistonBasePinY;
  const pistonNorm = clamp(pistonY / 96, 0, 1);

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

  const effectiveCompressionRatio =
    faultMode === "lowCompression"
      ? Math.max(10, compressionRatio - 5)
      : compressionRatio;

  const effectiveFuelQuantity =
    faultMode === "excessFuel"
      ? Math.min(130, fuelQuantity + 35)
      : fuelQuantity;

  const injectionStartDeg = faultMode === "lateInjection" ? 370 : 338;
  const injectionEndDeg = faultMode === "lateInjection" ? 414 : 378;

  const baseIntakeOpen = pulse(10, 165);
  const baseExhaustOpen = pulse(550, 710);

  const weakSpringLeak =
    faultMode === "weakSpring"
      ? Math.max(pulse(155, 225), pulse(700, 720)) * 0.25
      : 0;

  const intakeOpen = Math.max(baseIntakeOpen, weakSpringLeak);
  const exhaustOpen = Math.max(baseExhaustOpen, weakSpringLeak);

  const fuelInjection = pulse(injectionStartDeg, injectionEndDeg);

  const compressionFactor = (effectiveCompressionRatio - 14) / 8;
  const fuelFactor = effectiveFuelQuantity / 100;

  const compressionProgress = rangeProgress(180, 360);
  const powerProgress = rangeProgress(360, 540);
  const exhaustProgress = rangeProgress(540, 720);

  const combustionPenalty =
    faultMode === "lowCompression"
      ? 0.62
      : faultMode === "lateInjection"
        ? 0.72
        : 1;

  const powerGlow =
    pulse(360, 455) * (0.45 + fuelFactor * 0.75) * combustionPenalty;

  const expansionDrop = powerProgress * (18 + fuelFactor * 10);
  const exhaustDrop = exhaustProgress * 18;
  const blockedBackPressure =
    faultMode === "blockedExhaust" ? exhaustProgress * 18 : 0;

  const pressureBar = Math.max(
    1,
    Math.round(
      1 +
        compressionProgress * (22 + compressionFactor * 18) +
        fuelInjection * (10 + fuelFactor * 18) +
        powerGlow * (32 + fuelFactor * 35) -
        expansionDrop -
        exhaustDrop +
        blockedBackPressure,
    ),
  );

  const temperatureC = Math.max(
    40,
    Math.round(
      80 +
        compressionProgress * (320 + compressionFactor * 260) +
        fuelInjection * (100 + fuelFactor * 180) +
        powerGlow * (360 + fuelFactor * 480) -
        powerProgress * (220 + fuelFactor * 120) -
        exhaustProgress * 240 +
        (faultMode === "blockedExhaust" ? exhaustProgress * 120 : 0),
    ),
  );

  const clearanceVolumePercent = 100 / effectiveCompressionRatio;
  const chamberVolumePercent = Math.round(
    clearanceVolumePercent + pistonNorm * (100 - clearanceVolumePercent),
  );

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
      ? "Air enters the cylinder while the piston moves downward. The intake valve is open."
      : strokeName === "Compression"
        ? "Both valves are mostly closed. Air is compressed, raising pressure and temperature."
        : strokeName === "Power"
          ? "Injected diesel fuel burns in hot compressed air and pushes the piston downward."
          : "The exhaust valve opens and burnt gases leave the cylinder.";

  const faultDescription =
    faultMode === "normal"
      ? "Normal operation. Valve timing, fuel injection, compression, and exhaust are working as expected."
      : faultMode === "lowCompression"
        ? "Low compression reduces pressure and temperature, making combustion weaker."
        : faultMode === "lateInjection"
          ? "Late injection delays combustion and reduces power timing efficiency."
          : faultMode === "excessFuel"
            ? "Excess fuel increases heat and smoke because more fuel is injected than ideal."
            : faultMode === "blockedExhaust"
              ? "Blocked exhaust traps gas and keeps pressure and temperature higher during exhaust."
              : "Weak valve spring causes delayed valve closing and small leakage.";

  const learningNote =
    fuelInjection > 0.05
      ? "Fuel injection is active. Diesel fuel is sprayed into hot compressed air."
      : powerGlow > 0.05
        ? "Combustion is active. Expanding gas pushes the piston downward."
        : cycleAngleDeg >= 180 && cycleAngleDeg < 360
          ? "Compression is increasing air temperature and pressure before injection."
          : exhaustOpen > 0.05
            ? "The exhaust cam lobe is lifting the rocker, opening the exhaust valve."
            : intakeOpen > 0.05
              ? "The intake cam lobe is lifting the rocker, opening the intake valve."
              : "Transition zone. Watch the camshaft, rocker arms, valves, and piston.";

  const smokeBase =
    faultMode === "excessFuel"
      ? 1.5
      : faultMode === "blockedExhaust"
        ? 1.3
        : faultMode === "lowCompression"
          ? 1.15
          : 1;

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
    fuelInjection,
    powerGlow,

    pressureBar,
    temperatureC,
    chamberVolumePercent,
    rpm: Math.round(speed * 0.12 * 2 * 60),
    smokeLevel: clamp(exhaustOpen * smokeBase, 0, 1.6),

    strokeName,
    strokeDescription,
    learningNote,
    faultDescription,

    intakeValveOpen: intakeOpen > 0.05,
    exhaustValveOpen: exhaustOpen > 0.05,
    fuelActive: fuelInjection > 0.05,
    combustionActive: powerGlow > 0.05,

    effectiveCompressionRatio,
    effectiveFuelQuantity,
    injectionStartDeg,
    injectionEndDeg,
  };
}

export default function DieselEngineLearningSimulator() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [compressionRatio, setCompressionRatio] = useState(18);
  const [fuelQuantity, setFuelQuantity] = useState(55);
  const [faultMode, setFaultMode] = useState<FaultMode>("normal");

  const [zoomMode, setZoomMode] = useState<ZoomMode>("full");
  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);
  const [showFuelSpray, setShowFuelSpray] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [cutawayOpacity, setCutawayOpacity] = useState(0.82);
  const [canvasScale, setCanvasScale] = useState(1);

  const [selectedPart, setSelectedPart] = useState<PartKey>("camshaft");
  const [activeLesson, setActiveLesson] = useState<string>("");

  const lastFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const simulation = useMemo(
    () =>
      computeSimulation(
        phase,
        speed,
        compressionRatio,
        fuelQuantity,
        faultMode,
      ),
    [phase, speed, compressionRatio, fuelQuantity, faultMode],
  );

  const graphSamples = useMemo(() => {
    return Array.from({ length: 140 }).map((_, index) =>
      computeSimulation(
        index / 139,
        speed,
        compressionRatio,
        fuelQuantity,
        faultMode,
      ),
    );
  }, [speed, compressionRatio, fuelQuantity, faultMode]);

  const intakeTravel = simulation.intakeOpen * 18;
  const exhaustTravel = simulation.exhaustOpen * 18;

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

  const stopSound = () => {
    try {
      oscillatorRef.current?.stop();
    } catch {
      // Ignore browser audio nonsense.
    }

    oscillatorRef.current?.disconnect();
    gainRef.current?.disconnect();

    oscillatorRef.current = null;
    gainRef.current = null;
  };

  const prepareAudioContext = () => {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
  };

  useEffect(() => {
    if (!soundEnabled || !isPlaying) {
      stopSound();
      return;
    }

    prepareAudioContext();

    const context = audioContextRef.current;
    if (!context) return;

    if (!oscillatorRef.current || !gainRef.current) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sawtooth";
      gain.gain.value = 0.02;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();

      oscillatorRef.current = oscillator;
      gainRef.current = gain;
    }
  }, [soundEnabled, isPlaying]);

  useEffect(() => {
    const context = audioContextRef.current;
    const oscillator = oscillatorRef.current;
    const gain = gainRef.current;

    if (!context || !oscillator || !gain || !soundEnabled || !isPlaying) return;

    const faultNoiseBoost =
      faultMode === "blockedExhaust" || faultMode === "excessFuel" ? 12 : 0;

    const targetFrequency =
      32 + speed * 24 + simulation.powerGlow * 28 + faultNoiseBoost;

    const targetVolume = 0.016 + simulation.powerGlow * 0.026;

    oscillator.frequency.setTargetAtTime(
      targetFrequency,
      context.currentTime,
      0.05,
    );

    gain.gain.setTargetAtTime(targetVolume, context.currentTime, 0.08);
  }, [soundEnabled, isPlaying, speed, simulation.powerGlow, faultMode]);

  useEffect(() => {
    return () => stopSound();
  }, []);

  const setStroke = (
    stroke: "intake" | "compression" | "power" | "exhaust",
  ) => {
    setIsPlaying(false);

    if (stroke === "intake") setPhase(0);
    if (stroke === "compression") setPhase(0.25);
    if (stroke === "power") setPhase(0.5);
    if (stroke === "exhaust") setPhase(0.75);
  };

  const stepTimeline = (degreeStep: number) => {
    setIsPlaying(false);

    setPhase((prev) => {
      const next = prev + degreeStep / 720;
      return ((next % 1) + 1) % 1;
    });
  };

  const runLesson = (lessonId: string) => {
    const lesson = LESSONS.find((item) => item.id === lessonId);
    if (!lesson) return;

    setIsPlaying(false);
    setActiveLesson(lesson.id);
    setSelectedPart(lesson.part);
    setPhase(lesson.degree / 720);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;

      if (next) prepareAudioContext();
      else stopSound();

      return next;
    });
  };

  const Selectable = ({
    part,
    children,
  }: {
    part: PartKey;
    children: React.ReactNode;
  }) => (
    <g
      onPointerEnter={() => setSelectedPart(part)}
      onClick={() => setSelectedPart(part)}
      className="cursor-pointer"
    >
      {children}
    </g>
  );

  const ControlSlider = ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    suffix = "",
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
      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-neutral-700">
        <span>{label}</span>
        <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono text-[11px]">
          {Number(value).toFixed(step < 1 ? 1 : 0)}
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
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-neutral-900 text-white"
          : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"
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
            className="h-full rounded-full bg-neutral-900 transition-all"
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
        name: "Intake valve",
        value: simulation.intakeValveOpen ? "Open" : "Closed",
        active: simulation.intakeValveOpen,
      },
      {
        name: "Exhaust valve",
        value: simulation.exhaustValveOpen ? "Open" : "Closed",
        active: simulation.exhaustValveOpen,
      },
      {
        name: "Fuel injection",
        value: simulation.fuelActive ? "Active" : "Off",
        active: simulation.fuelActive,
      },
      {
        name: "Combustion",
        value: simulation.combustionActive ? "Active" : "Off",
        active: simulation.combustionActive,
      },
      {
        name: "Piston direction",
        value: simulation.pistonDirection,
        active: true,
      },
      {
        name: "Fault mode",
        value: FAULT_LABELS[faultMode],
        active: faultMode !== "normal",
      },
    ];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Real-Time Cycle Status
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
              <span className="text-neutral-700">{row.name}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-neutral-700">{row.value}</span>
                <StatusPill active={row.active} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PartInfoPanel = () => {
    const info = PART_INFO[selectedPart];

    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <h3 className="mb-1 text-sm font-bold text-neutral-900">
          Component Info
        </h3>
        <p className="text-xs font-bold text-neutral-700">{info.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-600">
          {info.description}
        </p>
      </div>
    );
  };

  const GuidedLessons = () => (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <h3 className="mb-3 text-sm font-bold text-neutral-900">
        Guided Lesson Mode
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            type="button"
            onClick={() => runLesson(lesson.id)}
            className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
              activeLesson === lesson.id
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {lesson.title}
          </button>
        ))}
      </div>

      {activeLesson && (
        <p className="mt-3 text-xs leading-relaxed text-neutral-600">
          {LESSONS.find((item) => item.id === activeLesson)?.text}
        </p>
      )}
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

      <svg viewBox="0 0 300 110" className="h-auto w-full">
        <rect x="0" y="0" width="300" height="110" rx="10" fill="#f5f5f5" />

        <line x1="25" y1="90" x2="280" y2="90" stroke="#999" strokeWidth="1" />
        <line x1="25" y1="20" x2="25" y2="90" stroke="#999" strokeWidth="1" />

        {[0, 180, 360, 540, 720].map((degree) => {
          const x = 25 + (degree / 720) * 255;

          return (
            <g key={degree}>
              <line
                x1={x}
                y1="20"
                x2={x}
                y2="90"
                stroke="#d0d0d0"
                strokeWidth="1"
              />
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

    const fuelPath = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - sample.fuelInjection * 66;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 25 + phase * 255;

    return (
      <MiniGraph title="Real Valve Timing Diagram">
        <path d={intakePath} fill="none" stroke="#111" strokeWidth="2.4" />
        <path
          d={exhaustPath}
          fill="none"
          stroke="#666"
          strokeWidth="2.4"
          strokeDasharray="5 4"
        />
        <path
          d={fuelPath}
          fill="none"
          stroke="#999"
          strokeWidth="2.2"
          strokeDasharray="2 3"
        />

        <line
          x1={currentX}
          y1="18"
          x2={currentX}
          y2="92"
          stroke="#000"
          strokeWidth="1.5"
        />

        <text x="40" y="18" fontSize="8" fill="#111">
          Intake
        </text>
        <text x="96" y="18" fontSize="8" fill="#666">
          Exhaust
        </text>
        <text x="165" y="18" fontSize="8" fill="#777">
          Injection
        </text>
      </MiniGraph>
    );
  };

  const PistonGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 20 + sample.pistonNorm * 70;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 25 + phase * 255;
    const currentY = 20 + simulation.pistonNorm * 70;

    return (
      <MiniGraph title="Piston Position: TDC ↔ BDC">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.4" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
        <text x="34" y="18" fontSize="9" fill="#555">
          TDC
        </text>
        <text x="34" y="104" fontSize="9" fill="#555">
          BDC
        </text>
      </MiniGraph>
    );
  };

  const PressureGraph = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 25 + (index / (graphSamples.length - 1)) * 255;
        const y = 90 - clamp(sample.pressureBar / 100, 0, 1) * 70;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX = 25 + phase * 255;
    const currentY = 90 - clamp(simulation.pressureBar / 100, 0, 1) * 70;

    return (
      <MiniGraph title="Pressure Curve">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.4" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
      </MiniGraph>
    );
  };

  const PVDiagram = () => {
    const path = graphSamples
      .map((sample, index) => {
        const x = 25 + clamp(sample.chamberVolumePercent / 100, 0, 1) * 255;
        const y = 90 - clamp(sample.pressureBar / 100, 0, 1) * 70;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const currentX =
      25 + clamp(simulation.chamberVolumePercent / 100, 0, 1) * 255;
    const currentY = 90 - clamp(simulation.pressureBar / 100, 0, 1) * 70;

    return (
      <MiniGraph title="P-V Diagram">
        <path d={path} fill="none" stroke="#111" strokeWidth="2.4" />
        <circle cx={currentX} cy={currentY} r="5" fill="#111" />
        <text x="185" y="104" fontSize="9" fill="#555">
          Volume →
        </text>
        <text x="35" y="18" fontSize="9" fill="#555">
          Pressure
        </text>
      </MiniGraph>
    );
  };

  const Spring = ({
    x,
    y,
    rotate,
    compress,
    travel,
  }: {
    x: number;
    y: number;
    rotate: number;
    compress: number;
    travel: number;
  }) => {
    const weakSpringScale = faultMode === "weakSpring" ? 0.65 : 1;
    const finalGap = 13.2 * (1 - compress * 0.22 * weakSpringScale);
    const capY = 8 * finalGap + 1 + travel * 0.12;

    return (
      <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(0.82)`}>
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2={110 - travel * 0.2}
          stroke="#d8d0c2"
          strokeWidth="3"
          opacity="0.62"
        />

        <rect
          x="-18"
          y="-12"
          width="36"
          height="14"
          rx="7"
          fill="url(#springMetal)"
          stroke="#151515"
          strokeWidth="1.8"
        />

        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={i * finalGap + 8}
            rx="24"
            ry="6.2"
            fill="none"
            stroke="url(#springMetal)"
            strokeWidth="6.3"
          />
        ))}

        <rect
          x="-16"
          y={capY}
          width="32"
          height="13"
          rx="7"
          fill="url(#springMetal)"
          stroke="#151515"
          strokeWidth="1.8"
        />
      </g>
    );
  };

  const Valve = ({
    x,
    y,
    rotate,
    openOffset,
  }: {
    x: number;
    y: number;
    rotate: number;
    openOffset: number;
  }) => (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) translate(0 ${openOffset})`}
    >
      <rect
        x="-10"
        y="-166"
        width="20"
        height="166"
        rx="10"
        fill="url(#valveStem)"
        stroke="#151515"
        strokeWidth="2.7"
      />

      <ellipse
        cx="0"
        cy="8"
        rx="42"
        ry="14"
        fill="url(#valveHead)"
        stroke="#151515"
        strokeWidth="3.5"
      />
    </g>
  );

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
        r="27"
        fill="url(#crankMetal)"
        stroke="#151515"
        strokeWidth="3"
      />

      <g transform={`rotate(${rotation})`}>
        <path
          d="
            M 0 -52
            C 22 -49 35 -27 31 -5
            C 28 18 13 29 0 29
            C -13 29 -28 18 -31 -5
            C -35 -27 -22 -49 0 -52
            Z
          "
          fill="url(#rodMetal)"
          stroke="#151515"
          strokeWidth="3"
        />

        <circle cx="0" cy="0" r="14" fill="url(#crankMetal)" />
      </g>

      <circle
        cx="0"
        cy={-47 + lift * 7}
        r="6"
        fill="#111"
        stroke="#f5ead5"
        strokeWidth="2"
      />

      {showLabels && (
        <g transform="translate(0 -72)">
          <rect
            x="-36"
            y="-12"
            width="72"
            height="22"
            rx="7"
            fill="#111"
            opacity="0.82"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            fontWeight="700"
          >
            {label}
          </text>
        </g>
      )}
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
    const rollerY = camY - 44 + lift * 6;
    const pushEndY = valveY - 132 + lift * 16;

    return (
      <Selectable part="rockerArm">
        <g>
          <path
            d={`
              M ${pivotX - 18} ${pivotY + 28}
              L ${pivotX} ${pivotY - 10}
              L ${pivotX + 18} ${pivotY + 28}
              Z
            `}
            fill="url(#crankMetal)"
            stroke="#151515"
            strokeWidth="3"
          />

          <circle
            cx={pivotX}
            cy={pivotY}
            r="13"
            fill="url(#rodMetal)"
            stroke="#151515"
            strokeWidth="3"
          />

          <g transform={`rotate(${rockerAngle} ${pivotX} ${pivotY})`}>
            <path
              d={`
                M ${pivotX - 82} ${pivotY - 7}
                C ${pivotX - 35} ${pivotY - 15}
                  ${pivotX + 35} ${pivotY - 15}
                  ${pivotX + 82} ${pivotY - 7}
                L ${pivotX + 82} ${pivotY + 7}
                C ${pivotX + 35} ${pivotY + 15}
                  ${pivotX - 35} ${pivotY + 15}
                  ${pivotX - 82} ${pivotY + 7}
                Z
              `}
              fill="url(#rodMetal)"
              stroke="#151515"
              strokeWidth="3"
            />

            <circle
              cx={camX}
              cy={rollerY}
              r="13"
              fill="url(#crankMetal)"
              stroke="#151515"
              strokeWidth="3"
            />
            <circle cx={camX} cy={rollerY} r="5" fill="#111" />

            <rect
              x={valveX - 20}
              y={pushEndY - 6}
              width="40"
              height="12"
              rx="6"
              fill="url(#crankMetal)"
              stroke="#151515"
              strokeWidth="2.5"
            />
          </g>

          <line
            x1={valveX}
            y1={pushEndY}
            x2={valveX}
            y2={valveY - 98 + lift * 18}
            stroke="#d8d0c2"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </Selectable>
    );
  };

  const CamshaftAndRockers = () => {
    const intakePeakCrank = (10 + 165) / 2;
    const exhaustPeakCrank = (550 + 710) / 2;

    const intakePeakCam = intakePeakCrank / 2;
    const exhaustPeakCam = exhaustPeakCrank / 2;

    const intakeCamRotation = simulation.camAngleDeg - intakePeakCam;
    const exhaustCamRotation = simulation.camAngleDeg - exhaustPeakCam;

    return (
      <g>
        <Selectable part="camshaft">
          <g>
            <line
              x1="245"
              y1="218"
              x2="555"
              y2="218"
              stroke="url(#crankMetal)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            <line
              x1="250"
              y1="210"
              x2="550"
              y2="210"
              stroke="#fff"
              strokeWidth="3"
              opacity="0.25"
              strokeLinecap="round"
            />

            {[250, 400, 550].map((x) => (
              <g key={x}>
                <rect
                  x={x - 22}
                  y="197"
                  width="44"
                  height="42"
                  rx="8"
                  fill="url(#crankMetal)"
                  stroke="#151515"
                  strokeWidth="3"
                  opacity="0.9"
                />
                <circle cx={x} cy="218" r="10" fill="#111" opacity="0.55" />
              </g>
            ))}

            <CamLobe
              x={315}
              y={218}
              rotation={intakeCamRotation}
              lift={simulation.intakeOpen}
              label="Intake Cam"
            />

            <CamLobe
              x={485}
              y={218}
              rotation={exhaustCamRotation}
              lift={simulation.exhaustOpen}
              label="Exhaust Cam"
            />
          </g>
        </Selectable>

        <RockerAssembly
          side="intake"
          pivotX={340}
          pivotY={275}
          valveX={355}
          valveY={335}
          camX={315}
          camY={218}
          lift={simulation.intakeOpen}
        />

        <RockerAssembly
          side="exhaust"
          pivotX={460}
          pivotY={275}
          valveX={445}
          valveY={335}
          camX={485}
          camY={218}
          lift={simulation.exhaustOpen}
        />

        {showLabels && (
          <g>
            <rect
              x="334"
              y="174"
              width="132"
              height="24"
              rx="8"
              fill="#111"
              opacity="0.82"
            />
            <text
              x="400"
              y="190"
              textAnchor="middle"
              fill="#fff"
              fontSize="11"
              fontWeight="700"
            >
              1/2-Speed Camshaft
            </text>
          </g>
        )}
      </g>
    );
  };

  const FlowParticles = ({
    type,
    active,
  }: {
    type: "intake" | "exhaust";
    active: number;
  }) => {
    if (!showFlow || active <= 0.02) return null;

    const intakePoints: Array<[number, number]> = [
      [72, 260],
      [125, 260],
      [180, 268],
      [230, 305],
      [278, 355],
      [330, 390],
    ];

    const exhaustPoints: Array<[number, number]> = [
      [470, 390],
      [520, 350],
      [570, 300],
      [625, 268],
      [690, 260],
      [745, 260],
    ];

    const points = type === "intake" ? intakePoints : exhaustPoints;

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

    if (type === "intake") {
      return (
        <g opacity={active}>
          <path
            d="M 74 258 C 140 252, 202 270, 250 320 C 280 350, 305 375, 333 390"
            fill="none"
            stroke="url(#inletAirGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.52"
            filter="url(#airSoftBlur)"
          />

          {Array.from({ length: 18 }).map((_, i) => {
            const progress = (phase * 7 + i / 18) % 1;
            const point = getPoint(progress);
            const fade =
              progress < 0.12
                ? progress / 0.12
                : progress > 0.9
                  ? (1 - progress) / 0.1
                  : 1;

            return (
              <g
                key={`air-${i}`}
                transform={`translate(${point.x} ${point.y}) rotate(${point.angle})`}
                opacity={clamp(fade, 0, 1)}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="8"
                  ry="4"
                  fill="#7dd3fc"
                  opacity="0.45"
                />
                <path
                  d="M -8 0 L 8 0"
                  stroke="#e0f2fe"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {Array.from({ length: 7 }).map((_, i) => {
            const swirl = phase * 18 + i;

            return (
              <ellipse
                key={`swirl-${i}`}
                cx={325 + Math.sin(swirl) * 12}
                cy={392 + i * 7}
                rx={14 - i}
                ry="4"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="1.6"
                opacity="0.34"
              />
            );
          })}
        </g>
      );
    }

    return (
      <g opacity={active}>
        <path
          d="M 470 390 C 520 350, 560 305, 615 282 C 665 260, 710 260, 746 260"
          fill="none"
          stroke="#71717a"
          strokeWidth={10 + simulation.smokeLevel * 5}
          strokeLinecap="round"
          opacity={0.18 + simulation.smokeLevel * 0.24}
          filter="url(#smokeBlur)"
        />

        {Array.from({ length: 16 }).map((_, i) => {
          const progress = (phase * 4.3 + i / 16) % 1;
          const point = getPoint(progress);

          const turbulenceX =
            Math.sin(phase * 16 + i * 1.7) * (4 + progress * 10);
          const turbulenceY =
            Math.cos(phase * 13 + i * 1.3) * (3 + progress * 6);

          const size = 5 + progress * 15 + simulation.smokeLevel * 5;
          const fade =
            progress < 0.1
              ? progress / 0.1
              : progress > 0.82
                ? (1 - progress) / 0.18
                : 1;

          return (
            <ellipse
              key={`smoke-${i}`}
              cx={point.x + turbulenceX}
              cy={point.y + turbulenceY}
              rx={size * 1.25}
              ry={size * 0.8}
              fill="url(#exhaustSmokeGradient)"
              opacity={clamp(
                fade * (0.35 + simulation.smokeLevel * 0.35),
                0,
                0.85,
              )}
              filter="url(#smokeBlur)"
            />
          );
        })}

        {Array.from({ length: faultMode === "normal" ? 5 : 12 }).map((_, i) => {
          const progress = (phase * 5.2 + i / 12) % 1;
          const point = getPoint(progress);

          return (
            <circle
              key={`soot-${i}`}
              cx={point.x + Math.sin(phase * 21 + i) * 8}
              cy={point.y + Math.cos(phase * 18 + i) * 6}
              r={2.5 + progress * 3}
              fill="#3f3f46"
              opacity={
                faultMode === "excessFuel" || faultMode === "blockedExhaust"
                  ? 0.28
                  : 0.1
              }
            />
          );
        })}
      </g>
    );
  };

  const ConnectingRod = () => {
    const dx = simulation.crankPinX - simulation.pistonPinX;
    const dy = simulation.crankPinY - simulation.pistonPinY;
    const length = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return (
      <Selectable part="connectingRod">
        <g
          transform={`translate(${simulation.pistonPinX} ${simulation.pistonPinY}) rotate(${angle})`}
          filter="url(#smallShadow)"
        >
          <path
            d={`
              M 0 -15
              C ${length * 0.28} -11 ${length * 0.72} -11 ${length} -15
              L ${length} 15
              C ${length * 0.72} 11 ${length * 0.28} 11 0 15
              Z
            `}
            fill="url(#rodMetal)"
            stroke="#151515"
            strokeWidth="5"
          />

          <circle
            cx="0"
            cy="0"
            r="27"
            fill="url(#rodMetal)"
            stroke="#151515"
            strokeWidth="4"
          />
          <circle cx="0" cy="0" r="14" fill="url(#pinHole)" />

          <circle
            cx={length}
            cy="0"
            r="28"
            fill="url(#rodMetal)"
            stroke="#151515"
            strokeWidth="4"
          />
          <circle cx={length} cy="0" r="14" fill="url(#pinHole)" />
        </g>
      </Selectable>
    );
  };

  const TdcBdcMarker = () => (
    <g>
      <line
        x1="550"
        y1="380"
        x2="550"
        y2="495"
        stroke="#111"
        strokeWidth="2"
        opacity="0.65"
      />

      <line x1="540" y1="388" x2="560" y2="388" stroke="#111" strokeWidth="2" />
      <line x1="540" y1="485" x2="560" y2="485" stroke="#111" strokeWidth="2" />

      <rect
        x="563"
        y="374"
        width="48"
        height="24"
        rx="7"
        fill="#111"
        opacity="0.82"
      />
      <text
        x="587"
        y="389"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontWeight="700"
      >
        TDC
      </text>

      <rect
        x="563"
        y="472"
        width="48"
        height="24"
        rx="7"
        fill="#111"
        opacity="0.82"
      />
      <text
        x="587"
        y="487"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontWeight="700"
      >
        BDC
      </text>

      <circle
        cx="550"
        cy={388 + simulation.pistonNorm * 97}
        r="6"
        fill="#111"
        stroke="#fff"
        strokeWidth="2"
      />
    </g>
  );

  const Label = ({ x, y, text }: { x: number; y: number; text: string }) =>
    showLabels ? (
      <g transform={`translate(${x} ${y})`}>
        <rect
          x="-58"
          y="-14"
          width="116"
          height="26"
          rx="8"
          fill="#111"
          opacity="0.82"
        />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="700"
        >
          {text}
        </text>
      </g>
    ) : null;

  return (
    <main className="min-h-screen w-full bg-neutral-100 p-3 sm:p-4">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[390px_1fr]">
        <aside className="order-2 max-h-none overflow-visible rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm xl:order-1 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Diesel Learning Simulator
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Realistic camshaft, rocker arms, airflow, exhaust, faults, guided
              lessons and canvas scale.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {simulation.strokeName} Stroke
                </p>
                <p className="text-xs text-neutral-500">
                  {Math.round(simulation.cycleAngleDeg)}° crank angle
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
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
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                -10°
              </button>

              <button
                type="button"
                onClick={() => stepTimeline(10)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
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
              className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Reset Timeline
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Engine Parameters
            </h3>

            <div className="space-y-3">
              <ControlSlider
                label="Compression Ratio"
                min={14}
                max={22}
                step={1}
                suffix=":1"
                value={compressionRatio}
                onChange={setCompressionRatio}
              />

              <ControlSlider
                label="Fuel Quantity"
                min={20}
                max={100}
                step={5}
                suffix="%"
                value={fuelQuantity}
                onChange={setFuelQuantity}
              />

              <ControlSlider
                label="Cutaway Opacity"
                min={0.25}
                max={1}
                step={0.05}
                value={cutawayOpacity}
                onChange={setCutawayOpacity}
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
              Fault Simulation Mode
            </h3>

            <select
              value={faultMode}
              onChange={(event) =>
                setFaultMode(event.target.value as FaultMode)
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800"
            >
              <option value="normal">Normal</option>
              <option value="lowCompression">Low compression</option>
              <option value="lateInjection">Late injection</option>
              <option value="excessFuel">Excess fuel</option>
              <option value="blockedExhaust">Blocked exhaust</option>
              <option value="weakSpring">Weak valve spring</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {simulation.faultDescription}
            </p>
          </div>

          <div className="mt-4">
            <GuidedLessons />
          </div>

          <div className="mt-4">
            <PartInfoPanel />
          </div>

          <div className="mt-4">
            <CycleStatusTable />
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="mb-2 text-sm font-bold text-neutral-900">
              Quick Stroke Jump
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStroke("intake")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold hover:bg-neutral-100"
              >
                Intake
              </button>

              <button
                type="button"
                onClick={() => setStroke("compression")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold hover:bg-neutral-100"
              >
                Compression
              </button>

              <button
                type="button"
                onClick={() => setStroke("power")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold hover:bg-neutral-100"
              >
                Power
              </button>

              <button
                type="button"
                onClick={() => setStroke("exhaust")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-xs font-semibold hover:bg-neutral-100"
              >
                Exhaust
              </button>
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
                max={100}
                suffix=" bar"
              />

              <GaugeBar
                label="Temperature"
                value={simulation.temperatureC}
                max={1500}
                suffix="°C"
              />

              <GaugeBar
                label="Cylinder Volume"
                value={simulation.chamberVolumePercent}
                max={100}
                suffix="%"
              />
            </div>

            <div className="mt-3 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span>Camshaft angle</span>
                <span className="font-mono">
                  {Math.round(simulation.camAngleDeg)}°
                </span>
              </div>

              <div className="flex justify-between">
                <span>Crankshaft angle</span>
                <span className="font-mono">
                  {Math.round(simulation.crankAngleDeg)}°
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
                label="Airflow / Smoke"
                onClick={() => setShowFlow((prev) => !prev)}
              />

              <ToggleButton
                active={showFuelSpray}
                label="Fuel Spray"
                onClick={() => setShowFuelSpray((prev) => !prev)}
              />

              <ToggleButton
                active={showLabels}
                label="Labels"
                onClick={() => setShowLabels((prev) => !prev)}
              />

              <ToggleButton
                active={showGraphs}
                label="Learning Graphs"
                onClick={() => setShowGraphs((prev) => !prev)}
              />

              <ToggleButton
                active={soundEnabled}
                label={soundEnabled ? "Sound On" : "Sound Off"}
                onClick={toggleSound}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <h3 className="mb-3 text-sm font-bold text-neutral-900">
              Zoom Mode
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(["full", "head", "cylinder", "crankcase"] as ZoomMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setZoomMode(mode)}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold capitalize ${
                      zoomMode === mode
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {mode}
                  </button>
                ),
              )}
            </div>
          </div>

          {showGraphs && (
            <div className="mt-4 space-y-3">
              <ValveTimingGraph />
              <PistonGraph />
              <PressureGraph />
              <PVDiagram />
            </div>
          )}
        </aside>

        <section className="order-1 rounded-2xl border border-neutral-300 bg-white p-3 shadow-sm sm:p-4 xl:order-2">
          <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-neutral-600">
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
                    <div
                      className={`mt-1 rounded px-1 text-[8px] font-bold text-white ${
                        event.label === "TDC" || event.label === "BDC"
                          ? "bg-neutral-700"
                          : "bg-neutral-900"
                      }`}
                    >
                      {event.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[11px]">
              {(
                ["Intake", "Compression", "Power", "Exhaust"] as StrokeName[]
              ).map((name) => (
                <div
                  key={name}
                  className={`rounded py-1 ${
                    simulation.strokeName === name
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-500"
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-xl border border-neutral-200 bg-neutral-100">
            <div
              style={{
                width: `${canvasScale * 100}%`,
                minWidth: "320px",
              }}
            >
              <svg
                viewBox={VIEWBOX_MAP[zoomMode]}
                className="h-auto w-full rounded-xl bg-neutral-100"
                role="img"
                aria-label="Interactive diesel engine learning simulator"
              >
                <defs>
                  <radialGradient id="background" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="72%" stopColor="#f3f3f3" />
                    <stop offset="100%" stopColor="#e6e6e6" />
                  </radialGradient>

                  <linearGradient
                    id="outerMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f6f1e6" />
                    <stop offset="28%" stopColor="#d8d0c2" />
                    <stop offset="52%" stopColor="#4b463f" />
                    <stop offset="100%" stopColor="#181716" />
                  </linearGradient>

                  <linearGradient
                    id="pipeMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#d9d2c4" />
                    <stop offset="43%" stopColor="#f3ecdd" />
                    <stop offset="100%" stopColor="#1a1816" />
                  </linearGradient>

                  <linearGradient
                    id="blackCavity"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#302d28" />
                    <stop offset="55%" stopColor="#090909" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>

                  <linearGradient
                    id="pistonMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#111111" />
                    <stop offset="35%" stopColor="#f8f1dd" />
                    <stop offset="72%" stopColor="#47423c" />
                    <stop offset="100%" stopColor="#0b0b0b" />
                  </linearGradient>

                  <linearGradient
                    id="rodMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4c4338" />
                    <stop offset="23%" stopColor="#e6d8bd" />
                    <stop offset="68%" stopColor="#fff1d0" />
                    <stop offset="100%" stopColor="#342d25" />
                  </linearGradient>

                  <linearGradient
                    id="crankMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#111111" />
                    <stop offset="49%" stopColor="#e7dece" />
                    <stop offset="100%" stopColor="#090909" />
                  </linearGradient>

                  <linearGradient
                    id="springMetal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0c0c0c" />
                    <stop offset="50%" stopColor="#f5efe2" />
                    <stop offset="100%" stopColor="#080808" />
                  </linearGradient>

                  <linearGradient
                    id="valveStem"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#141414" />
                    <stop offset="35%" stopColor="#d8d0c2" />
                    <stop offset="100%" stopColor="#121212" />
                  </linearGradient>

                  <linearGradient
                    id="valveHead"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#070707" />
                    <stop offset="38%" stopColor="#ded5c6" />
                    <stop offset="100%" stopColor="#111111" />
                  </linearGradient>

                  <linearGradient
                    id="injectorBody"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#101010" />
                    <stop offset="35%" stopColor="#f4ecdc" />
                    <stop offset="100%" stopColor="#151515" />
                  </linearGradient>

                  <linearGradient
                    id="injectorNozzle"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f7ead0" />
                    <stop offset="55%" stopColor="#746a5e" />
                    <stop offset="100%" stopColor="#111111" />
                  </linearGradient>

                  <linearGradient
                    id="inletAirGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#bae6fd" stopOpacity="0" />
                    <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.65" />
                    <stop
                      offset="100%"
                      stopColor="#e0f2fe"
                      stopOpacity="0.15"
                    />
                  </linearGradient>

                  <radialGradient
                    id="exhaustSmokeGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor="#f5f5f5" stopOpacity="0.75" />
                    <stop offset="45%" stopColor="#9ca3af" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#3f3f46" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="pinHole" cx="50%" cy="45%" r="70%">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="#3a3a3a" />
                  </radialGradient>

                  <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff7cc" stopOpacity="1" />
                    <stop offset="40%" stopColor="#ffb347" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="fuelSpray" cx="50%" cy="0%" r="90%">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
                    <stop offset="45%" stopColor="#facc15" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>

                  <filter
                    id="smallShadow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="5"
                      floodColor="#000000"
                      floodOpacity="0.32"
                    />
                  </filter>

                  <filter
                    id="smokeBlur"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2.6" />
                  </filter>

                  <filter
                    id="airSoftBlur"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="1.1" />
                  </filter>
                </defs>

                <rect width="800" height="1120" fill="url(#background)" />

                <Selectable part="cylinder">
                  <g opacity={cutawayOpacity}>
                    <path
                      d="
                        M244 56
                        C213 56 190 82 190 120
                        L190 192
                        L126 192
                        C83 192 58 219 58 258
                        L58 305
                        L184 305
                        C220 305 246 331 253 368
                        L265 430
                        L265 700
                        C230 738 210 788 210 845
                        L210 960
                        C210 1013 248 1050 300 1050
                        L500 1050
                        C552 1050 590 1013 590 960
                        L590 845
                        C590 788 570 738 535 700
                        L535 430
                        L547 368
                        C554 331 580 305 616 305
                        L742 305
                        L742 258
                        C742 219 717 192 674 192
                        L610 192
                        L610 120
                        C610 82 587 56 556 56
                        L480 56
                        C448 56 426 82 426 120
                        L426 184
                        L374 184
                        L374 120
                        C374 82 352 56 320 56
                        Z
                      "
                      fill="url(#outerMetal)"
                      stroke="#141414"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                  </g>
                </Selectable>

                <Selectable part="airFilter">
                  <path
                    d="
                      M58 232
                      L168 232
                      C224 232 266 267 280 322
                      L292 378
                      L258 392
                      C247 337 214 292 166 292
                      L58 292
                      Z
                    "
                    fill="url(#pipeMetal)"
                    stroke="#151515"
                    strokeWidth="5.8"
                    strokeLinejoin="round"
                  />
                </Selectable>

                <Selectable part="exhaust">
                  <path
                    d="
                      M742 232
                      L632 232
                      C576 232 534 267 520 322
                      L508 378
                      L542 392
                      C553 337 586 292 634 292
                      L742 292
                      Z
                    "
                    fill="url(#pipeMetal)"
                    stroke="#151515"
                    strokeWidth="5.8"
                    strokeLinejoin="round"
                  />
                </Selectable>

                <FlowParticles type="intake" active={simulation.intakeOpen} />
                <FlowParticles type="exhaust" active={simulation.exhaustOpen} />

                <Selectable part="cylinder">
                  <path
                    d="
                      M306 386
                      L494 386
                      L494 707
                      C529 745 548 792 548 845
                      L548 928
                      C548 970 523 1002 484 1002
                      L316 1002
                      C277 1002 252 970 252 928
                      L252 845
                      C252 792 271 745 306 707
                      Z
                    "
                    fill="url(#blackCavity)"
                    stroke="#080808"
                    strokeWidth="4.5"
                  />
                </Selectable>

                <TdcBdcMarker />

                <CamshaftAndRockers />

                <Selectable part="intakeValve">
                  <Spring
                    x={250}
                    y={102}
                    rotate={-24}
                    compress={simulation.intakeOpen}
                    travel={intakeTravel}
                  />
                  <Valve
                    x={355}
                    y={335}
                    rotate={-23}
                    openOffset={intakeTravel}
                  />
                </Selectable>

                <Selectable part="exhaustValve">
                  <Spring
                    x={550}
                    y={102}
                    rotate={24}
                    compress={simulation.exhaustOpen}
                    travel={exhaustTravel}
                  />
                  <Valve
                    x={445}
                    y={335}
                    rotate={23}
                    openOffset={exhaustTravel}
                  />
                </Selectable>

                <Selectable part="fuelInjector">
                  <g transform="translate(400 66)">
                    <rect
                      x="-13"
                      y="0"
                      width="26"
                      height="72"
                      rx="8"
                      fill="url(#injectorBody)"
                      stroke="#151515"
                      strokeWidth="2.8"
                    />

                    <rect
                      x="-24"
                      y="70"
                      width="48"
                      height="22"
                      rx="5"
                      fill="url(#rodMetal)"
                      stroke="#151515"
                      strokeWidth="2.5"
                    />

                    <path
                      d="M -8 92 L 8 92 L 4 122 L -4 122 Z"
                      fill="url(#injectorNozzle)"
                      stroke="#151515"
                      strokeWidth="2.4"
                    />

                    {showFuelSpray && simulation.fuelInjection > 0.02 && (
                      <g opacity={simulation.fuelInjection}>
                        <path
                          d="M 0 122 L -54 258 L 54 258 Z"
                          fill="url(#fuelSpray)"
                          opacity="0.52"
                        />

                        {Array.from({ length: 18 }).map((_, i) => {
                          const row = Math.floor(i / 6);
                          const col = i % 6;
                          const px =
                            -30 + col * 12 + Math.sin(phase * 30 + i) * 2;
                          const py =
                            145 + row * 32 + Math.cos(phase * 24 + i) * 4;

                          return (
                            <circle
                              key={i}
                              cx={px}
                              cy={py}
                              r={2.2 + simulation.fuelInjection * 1.5}
                              fill="#facc15"
                              opacity={0.4 + simulation.fuelInjection * 0.45}
                            />
                          );
                        })}
                      </g>
                    )}
                  </g>
                </Selectable>

                <path
                  d="
                    M282 370
                    C314 324 356 306 400 306
                    C444 306 486 324 518 370
                    L496 414
                    L304 414
                    Z
                  "
                  fill="url(#crankMetal)"
                  stroke="#151515"
                  strokeWidth="5"
                />

                <circle
                  cx="400"
                  cy="405"
                  r={65 + simulation.powerGlow * 25}
                  fill="url(#fireGlow)"
                  opacity={Math.min(simulation.powerGlow, 1)}
                />

                <ConnectingRod />

                <Selectable part="piston">
                  <g
                    transform={`translate(0 ${simulation.pistonY})`}
                    filter="url(#smallShadow)"
                  >
                    <path
                      d="
                        M282 438
                        C282 394 313 365 356 365
                        L444 365
                        C487 365 518 394 518 438
                        L518 562
                        C518 608 489 638 444 638
                        L430 638
                        L413 695
                        L387 695
                        L370 638
                        L356 638
                        C311 638 282 608 282 562
                        Z
                      "
                      fill="url(#pistonMetal)"
                      stroke="#151515"
                      strokeWidth="5.8"
                    />

                    <path
                      d="M300 421 H500"
                      stroke="#f7f1df"
                      strokeWidth="5"
                      opacity="0.82"
                    />
                    <path
                      d="M298 446 H502 M298 462 H502 M298 478 H502 M298 494 H502"
                      stroke="#090909"
                      strokeWidth="7.5"
                    />

                    <circle
                      cx="400"
                      cy="535"
                      r="32"
                      fill="#111111"
                      stroke="#d7cebf"
                      strokeWidth="5"
                    />
                    <circle cx="400" cy="535" r="22" fill="url(#pinHole)" />
                  </g>
                </Selectable>

                <Selectable part="crankshaft">
                  <g
                    transform={`translate(${simulation.crankCenterX} ${simulation.crankCenterY}) rotate(${simulation.crankAngleDeg})`}
                    filter="url(#smallShadow)"
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="90"
                      fill="url(#crankMetal)"
                      stroke="#151515"
                      strokeWidth="6.5"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="66"
                      fill="url(#rodMetal)"
                      stroke="#151515"
                      strokeWidth="4.8"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="43"
                      fill="url(#crankMetal)"
                      stroke="#151515"
                      strokeWidth="4"
                    />

                    <circle
                      cx="0"
                      cy={-simulation.crankRadius}
                      r="15"
                      fill="#111"
                      stroke="#f5ead5"
                      strokeWidth="4"
                    />

                    <rect
                      x="-108"
                      y="-40"
                      width="40"
                      height="80"
                      rx="8"
                      fill="url(#rodMetal)"
                      stroke="#151515"
                      strokeWidth="3.8"
                    />

                    <rect
                      x="68"
                      y="-40"
                      width="40"
                      height="80"
                      rx="8"
                      fill="url(#rodMetal)"
                      stroke="#151515"
                      strokeWidth="3.8"
                    />
                  </g>
                </Selectable>

                <Label x={400} y={330} text="Fuel Injector" />
                <Label x={400} y={405} text="Combustion" />
                <Label x={400} y={535} text="Piston" />
                <Label x={400} y={735} text="Connecting Rod" />
                <Label x={400} y={905} text="Crankshaft" />
                <Label x={185} y={250} text="Intake Air" />
                <Label x={615} y={250} text="Exhaust" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
