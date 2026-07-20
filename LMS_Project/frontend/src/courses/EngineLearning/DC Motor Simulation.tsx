"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type MotorPart =
  | "power"
  | "brushes"
  | "commutator"
  | "armature"
  | "magnets"
  | "shaft"
  | "gear";

type Polarity = 1 | -1;

interface MotorPartInfo {
  title: string;
  description: string;
  material: string;
}

interface MotorTelemetry {
  theta: number;
  omega: number;
  current: number;
  electromagneticTorque: number;
  netTorque: number;
  acceleration: number;
  backEmf: number;
  resistance: number;
  copperLoss: number;
  temperature: number;
  loadTorque: number;
  overloadSeconds: number;
}

const MOTOR_PARTS: Record<MotorPart, MotorPartInfo> = {
  power: {
    title: "DC Power Supply",
    description:
      "Provides direct current to the motor. Reversing the terminal polarity reverses armature current and motor torque.",
    material: "Copper conductor with insulated cable",
  },
  brushes: {
    title: "Carbon Brushes",
    description:
      "Transfer electrical current from the stationary supply circuit to the rotating commutator.",
    material: "Carbon or graphite",
  },
  commutator: {
    title: "Split-Ring Commutator",
    description:
      "Reverses the armature winding connection after every half-turn so torque continues in the required direction.",
    material: "Copper segments separated by insulation",
  },
  armature: {
    title: "Armature and Winding",
    description:
      "The rotating steel core carries copper windings and becomes an electromagnet when current flows.",
    material: "Laminated steel core and copper wire",
  },
  magnets: {
    title: "Permanent Magnets",
    description:
      "Create a permanent magnetic field from the upper north pole through the armature to the lower south pole.",
    material: "Ferrite or rare-earth magnet",
  },
  shaft: {
    title: "Motor Shaft",
    description:
      "Transfers rotational mechanical power from the armature to the output mechanism.",
    material: "Hardened steel",
  },
  gear: {
    title: "Output Shaft and Gear",
    description:
      "Transfers shaft rotation to an external wheel, fan, machine, or transmission.",
    material: "Steel or engineering polymer",
  },
};

const MOTOR = {
  resistanceAt25: 2.2,
  copperTemperatureCoefficient: 0.00393,

  backEmfConstant: 0.035,
  torqueConstant: 0.035,

  rotorInertia: 0.003,
  viscousFriction: 0.00035,
  staticFrictionTorque: 0.012,

  maximumLoadTorque: 0.18,
  maximumCurrent: 8,
  continuousCurrentLimit: 6.2,
  maximumOmega: 520,

  ambientTemperature: 25,
  thermalCapacity: 110,
  coolingCoefficient: 1.35,
  thermalDeratingStart: 85,
  thermalTripTemperature: 110,

  overloadDelay: 1.5,
  startupGraceTime: 1.2,
};

const INITIAL_TELEMETRY: MotorTelemetry = {
  theta: 0,
  omega: 0,
  current: 0,
  electromagneticTorque: 0,
  netTorque: 0,
  acceleration: 0,
  backEmf: 0,
  resistance: MOTOR.resistanceAt25,
  copperLoss: 0,
  temperature: MOTOR.ambientTemperature,
  loadTorque: 0,
  overloadSeconds: 0,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function signOf(value: number) {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}

function wrapAngle(angle: number) {
  const fullRotation = Math.PI * 2;
  return ((angle % fullRotation) + fullRotation) % fullRotation;
}

export default function DCMotorSimulation() {
  const [running, setRunning] = useState(false);
  const [polarity, setPolarity] = useState<Polarity>(1);
  const [voltage, setVoltage] = useState(12);
  const [loadPercent, setLoadPercent] = useState(25);

  const [telemetry, setTelemetry] =
    useState<MotorTelemetry>(INITIAL_TELEMETRY);

  const [thermalTrip, setThermalTrip] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<MotorPart>("armature");

  const [showLabels, setShowLabels] = useState(true);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showMagneticField, setShowMagneticField] =
    useState(true);
  const [showForces, setShowForces] = useState(true);
  const [showArmaturePoles, setShowArmaturePoles] =
    useState(true);

  const modelRef = useRef<MotorTelemetry>(INITIAL_TELEMETRY);
  const animationFrameRef = useRef<number | null>(null);
  const transientGraceRef = useRef(MOTOR.startupGraceTime);

  /*
   * Allow a short current transient during startup and polarity reversal
   * before classifying the condition as sustained overload.
   */
  useEffect(() => {
    transientGraceRef.current = MOTOR.startupGraceTime;
  }, [running, polarity]);

  useEffect(() => {
    let previousTime = performance.now();
    let previousUiUpdate = previousTime;

    const updatePhysics = (currentTime: number) => {
      const deltaTime = Math.min(
        (currentTime - previousTime) / 1000,
        0.025,
      );

      previousTime = currentTime;

      const previous = modelRef.current;

      transientGraceRef.current = Math.max(
        0,
        transientGraceRef.current - deltaTime,
      );

      const resistance =
        MOTOR.resistanceAt25 *
        (1 +
          MOTOR.copperTemperatureCoefficient *
            (previous.temperature -
              MOTOR.ambientTemperature));

      const motorPowered =
        running && voltage > 0 && !thermalTrip;

      const appliedVoltage = motorPowered
        ? polarity * voltage
        : 0;

      const backEmf =
        MOTOR.backEmfConstant * previous.omega;

      let armatureCurrent = motorPowered
        ? (appliedVoltage - backEmf) / resistance
        : 0;

      armatureCurrent = clamp(
        armatureCurrent,
        -MOTOR.maximumCurrent,
        MOTOR.maximumCurrent,
      );

      const thermalDerating =
        previous.temperature <= MOTOR.thermalDeratingStart
          ? 1
          : clamp(
              1 -
                (previous.temperature -
                  MOTOR.thermalDeratingStart) /
                  60,
              0.4,
              1,
            );

      const electromagneticTorque =
        MOTOR.torqueConstant *
        armatureCurrent *
        thermalDerating;

      const loadTorqueMagnitude =
        (loadPercent / 100) *
        MOTOR.maximumLoadTorque;

      const viscousFrictionTorque =
        MOTOR.viscousFriction * previous.omega;

      let netTorque = 0;

      /*
       * Static-load logic:
       * At zero speed, a resisting mechanical load holds the shaft still
       * until motor torque exceeds the load and static friction.
       *
       * This prevents a heavy passive load from making the shaft drift
       * backward when the motor cannot overcome it.
       */
      if (Math.abs(previous.omega) < 0.5) {
        const availableTorque =
          electromagneticTorque - viscousFrictionTorque;

        const breakawayTorque =
          loadTorqueMagnitude +
          MOTOR.staticFrictionTorque;

        if (
          Math.abs(availableTorque) <= breakawayTorque
        ) {
          netTorque = 0;
        } else {
          netTorque =
            availableTorque -
            Math.sign(availableTorque) *
              breakawayTorque;
        }
      } else {
        netTorque =
          electromagneticTorque -
          Math.sign(previous.omega) *
            loadTorqueMagnitude -
          viscousFrictionTorque;
      }

      const acceleration =
        netTorque / MOTOR.rotorInertia;

      let nextOmega =
        previous.omega + acceleration * deltaTime;

      nextOmega = clamp(
        nextOmega,
        -MOTOR.maximumOmega,
        MOTOR.maximumOmega,
      );

      /*
       * Stop cleanly at zero when only passive load and friction are
       * slowing the shaft. Reversal is still allowed when opposite
       * electromagnetic torque is strong enough.
       */
      const crossedZero =
        previous.omega !== 0 &&
        Math.sign(previous.omega) !==
          Math.sign(nextOmega);

      const motorCanReverse =
        Math.abs(electromagneticTorque) >
        loadTorqueMagnitude +
          MOTOR.staticFrictionTorque;

      if (crossedZero && !motorCanReverse) {
        nextOmega = 0;
      }

      if (
        Math.abs(previous.omega) < 0.5 &&
        netTorque === 0
      ) {
        nextOmega = 0;
      }

      const nextTheta = wrapAngle(
        previous.theta + nextOmega * deltaTime,
      );

      const copperLoss =
        armatureCurrent *
        armatureCurrent *
        resistance;

      const coolingPower =
        MOTOR.coolingCoefficient *
        (previous.temperature -
          MOTOR.ambientTemperature);

      const temperatureRate =
        (copperLoss - coolingPower) /
        MOTOR.thermalCapacity;

      const nextTemperature = Math.max(
        MOTOR.ambientTemperature,
        previous.temperature +
          temperatureRate * deltaTime,
      );

      const overCurrent =
        Math.abs(armatureCurrent) >
        MOTOR.continuousCurrentLimit;

      let overloadSeconds =
        previous.overloadSeconds;

      if (
        overCurrent &&
        transientGraceRef.current <= 0
      ) {
        overloadSeconds += deltaTime;
      } else {
        overloadSeconds = Math.max(
          0,
          overloadSeconds - deltaTime * 1.8,
        );
      }

      const nextTelemetry: MotorTelemetry = {
        theta: nextTheta,
        omega: nextOmega,
        current: armatureCurrent,
        electromagneticTorque,
        netTorque,
        acceleration,
        backEmf: MOTOR.backEmfConstant * nextOmega,
        resistance,
        copperLoss,
        temperature: nextTemperature,
        loadTorque: loadTorqueMagnitude,
        overloadSeconds,
      };

      modelRef.current = nextTelemetry;

      if (
        nextTemperature >=
          MOTOR.thermalTripTemperature &&
        !thermalTrip
      ) {
        setThermalTrip(true);
        setRunning(false);
      }

      if (currentTime - previousUiUpdate >= 40) {
        setTelemetry({ ...nextTelemetry });
        previousUiUpdate = currentTime;
      }

      animationFrameRef.current =
        requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current =
      requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    };
  }, [
    loadPercent,
    polarity,
    running,
    thermalTrip,
    voltage,
  ]);

  const rpm =
    (Math.abs(telemetry.omega) * 60) /
    (2 * Math.PI);

  const signedRpm =
    (telemetry.omega * 60) /
    (2 * Math.PI);

  const motorPowered =
    running && voltage > 0 && !thermalTrip;

  const actualDirection: Polarity =
    telemetry.omega > 0.2
      ? 1
      : telemetry.omega < -0.2
        ? -1
        : polarity;

  const electricalCurrentDirection: Polarity =
    telemetry.current > 0.03
      ? 1
      : telemetry.current < -0.03
        ? -1
        : polarity;

  /*
   * Split-ring commutation phase changes every half mechanical turn.
   */
  const commutatorPhase: Polarity =
    Math.cos(telemetry.theta) >= 0 ? 1 : -1;

  const displayedCoilPolarity = (
    electricalCurrentDirection * commutatorPhase
  ) as Polarity;

  const armatureLeftPole =
    displayedCoilPolarity === 1 ? "N" : "S";

  const armatureRightPole =
    displayedCoilPolarity === 1 ? "S" : "N";

  const torqueDirection: Polarity =
    telemetry.electromagneticTorque > 0.001
      ? 1
      : telemetry.electromagneticTorque < -0.001
        ? -1
        : polarity;

  const motorRotating =
    Math.abs(telemetry.omega) > 0.7;

  const reversing =
    motorPowered &&
    Math.abs(telemetry.omega) > 2 &&
    signOf(telemetry.omega) !== polarity;

  const stalled =
    motorPowered &&
    rpm < 30 &&
    Math.abs(telemetry.current) > 3 &&
    loadPercent >= 70;

  const overloaded =
    motorPowered &&
    (telemetry.overloadSeconds >=
      MOTOR.overloadDelay ||
      (loadPercent >= 92 &&
        rpm < 250 &&
        Math.abs(telemetry.current) > 4));

  const overheating =
    telemetry.temperature >= 90;

  const showBrushSparks =
    motorPowered &&
    Math.abs(telemetry.current) > 5.2 &&
    (reversing || overloaded || stalled);

  /*
   * Steady-state speed estimate:
   *
   * V = Ke*w + R*(loadTorque + B*w)/Kt
   */
  const estimatedTargetOmega = Math.max(
    0,
    (voltage -
      (telemetry.resistance /
        MOTOR.torqueConstant) *
        telemetry.loadTorque) /
      (MOTOR.backEmfConstant +
        (telemetry.resistance *
          MOTOR.viscousFriction) /
          MOTOR.torqueConstant),
  );

  const estimatedTargetRpm =
    (estimatedTargetOmega * 60) /
    (2 * Math.PI);

  const starting =
    motorPowered &&
    !stalled &&
    !reversing &&
    rpm <
      Math.max(
        20,
        estimatedTargetRpm * 0.75,
      );

  const status = thermalTrip
    ? "Thermal Trip"
    : overheating
      ? "Overheating"
      : stalled
        ? "Stalled"
        : reversing
          ? "Reversing"
          : overloaded
            ? "Overload"
            : !motorPowered
              ? "Stopped"
              : starting
                ? "Starting"
                : "Running";

  const statusClasses: Record<string, string> = {
    Stopped: "bg-slate-100 text-slate-700",
    Starting: "bg-blue-100 text-blue-700",
    Running: "bg-emerald-100 text-emerald-700",
    Reversing: "bg-violet-100 text-violet-700",
    Overload: "bg-orange-100 text-orange-700",
    Stalled: "bg-red-100 text-red-700",
    Overheating: "bg-red-100 text-red-700",
    "Thermal Trip": "bg-red-600 text-white",
  };

  const appliedVoltage = motorPowered
    ? polarity * voltage
    : 0;

  const electricalInputPower = Math.abs(
    appliedVoltage * telemetry.current,
  );

  /*
   * Useful shaft output power is load torque multiplied by shaft speed.
   */
  const outputPower =
    telemetry.loadTorque *
    Math.abs(telemetry.omega);

  const efficiency =
    electricalInputPower > 0.01
      ? clamp(
          (outputPower / electricalInputPower) *
            100,
          0,
          95,
        )
      : 0;

  const normalizedSpeed = clamp(
    rpm / 4000,
    0,
    1,
  );

  const rotationDuration = clamp(
    3.4 - normalizedSpeed * 2.9,
    0.42,
    3.4,
  );

  const rotationStyle: CSSProperties = {
    animationDuration: `${rotationDuration}s`,
    animationDirection:
      actualDirection === 1
        ? "normal"
        : "reverse",
    animationPlayState: motorRotating
      ? "running"
      : "paused",
  };

  const shaftStyle: CSSProperties = {
    animationDuration: `${Math.max(
      0.35,
      rotationDuration * 0.68,
    )}s`,
    animationDirection:
      actualDirection === 1
        ? "normal"
        : "reverse",
    animationPlayState: motorRotating
      ? "running"
      : "paused",
  };

  const currentFlowStyle: CSSProperties = {
    animationDuration: `${clamp(
      2.6 -
        Math.abs(telemetry.current) * 0.22,
      0.45,
      2.6,
    )}s`,
    animationDirection:
      electricalCurrentDirection === 1
        ? "normal"
        : "reverse",
    animationPlayState:
      motorPowered &&
      Math.abs(telemetry.current) > 0.03
        ? "running"
        : "paused",
  };

  const topTerminalPositive = polarity === 1;
  const bottomTerminalPositive =
    !topTerminalPositive;

  const topWireColor = topTerminalPositive
    ? "#dc2626"
    : "#263238";

  const bottomWireColor = bottomTerminalPositive
    ? "#dc2626"
    : "#263238";

  const temperatureRatio = clamp(
    (telemetry.temperature -
      MOTOR.ambientTemperature) /
      (MOTOR.thermalTripTemperature -
        MOTOR.ambientTemperature),
    0,
    1,
  );

  const windingHotColor =
    telemetry.temperature >= 90
      ? "#dc2626"
      : telemetry.temperature >= 70
        ? "#f97316"
        : "#e11d48";

  const temperatureStatus = thermalTrip
    ? "Thermal trip"
    : telemetry.temperature >= 90
      ? "Overheating"
      : telemetry.temperature >= 70
        ? "Hot"
        : telemetry.temperature >= 50
          ? "Warm"
          : "Normal";

  const reversePolarity = () => {
    if (!thermalTrip) {
      setPolarity((previous) =>
        previous === 1 ? -1 : 1,
      );
    }
  };

  const resetSimulation = () => {
    const resetTelemetry = {
      ...INITIAL_TELEMETRY,
    };

    modelRef.current = resetTelemetry;
    transientGraceRef.current =
      MOTOR.startupGraceTime;

    setTelemetry(resetTelemetry);
    setRunning(false);
    setPolarity(1);
    setVoltage(12);
    setLoadPercent(25);
    setThermalTrip(false);
    setSelectedPart("armature");

    setShowLabels(true);
    setShowCurrent(true);
    setShowMagneticField(true);
    setShowForces(true);
    setShowArmaturePoles(true);
  };

  return (
    <section className="min-h-screen w-full bg-white p-3 text-slate-900 sm:p-5 lg:p-8">
      <div className="mx-auto max-w-[1580px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <header className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">
              Interactive DC Motor Simulation
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Realistic permanent-magnet field, commutation,
              load, temperature and polarity reversal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={thermalTrip}
              onClick={() =>
                setRunning((previous) => !previous)
              }
              className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400 ${
                running
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {thermalTrip
                ? "Thermal Trip"
                : running
                  ? "Stop Motor"
                  : "Start Motor"}
            </button>

            <button
              type="button"
              disabled={thermalTrip}
              onClick={reversePolarity}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Reverse Polarity
            </button>

            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* Motor illustration */}
          <div className="relative min-h-[620px] overflow-hidden bg-white">
            <svg
              viewBox="0 0 1200 760"
              preserveAspectRatio="xMidYMid meet"
              className="h-full min-h-[620px] w-full select-none"
              role="img"
              aria-label="Interactive permanent-magnet brushed DC motor"
            >
              <defs>
                <linearGradient
                  id="housingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#edf2f4" />
                  <stop offset="78%" stopColor="#aeb9be" />
                  <stop offset="100%" stopColor="#f8fafb" />
                </linearGradient>

                <linearGradient
                  id="metalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f8fbfc" />
                  <stop offset="22%" stopColor="#98a5ab" />
                  <stop offset="48%" stopColor="#ffffff" />
                  <stop offset="73%" stopColor="#6f7c83" />
                  <stop offset="100%" stopColor="#dce4e7" />
                </linearGradient>

                <linearGradient
                  id="darkMetalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#78858b" />
                  <stop offset="38%" stopColor="#20282c" />
                  <stop offset="68%" stopColor="#56636a" />
                  <stop offset="100%" stopColor="#111619" />
                </linearGradient>

                <linearGradient
                  id="northMagnetGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ff6b5e" />
                  <stop offset="50%" stopColor="#ef2b1d" />
                  <stop offset="100%" stopColor="#a80e09" />
                </linearGradient>

                <linearGradient
                  id="southMagnetGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#47baff" />
                  <stop offset="50%" stopColor="#0877df" />
                  <stop offset="100%" stopColor="#03418e" />
                </linearGradient>

                <linearGradient
                  id="copperGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ffe0a6" />
                  <stop offset="28%" stopColor="#dc8b30" />
                  <stop offset="52%" stopColor="#ffc76a" />
                  <stop offset="76%" stopColor="#97511c" />
                  <stop offset="100%" stopColor="#ec9f41" />
                </linearGradient>

                <linearGradient
                  id="rotorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#20272b" />
                  <stop offset="20%" stopColor="#7b878d" />
                  <stop offset="43%" stopColor="#e7ecee" />
                  <stop offset="57%" stopColor="#929da2" />
                  <stop offset="78%" stopColor="#343c40" />
                  <stop offset="100%" stopColor="#111619" />
                </linearGradient>

                <linearGradient
                  id="fieldGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                    stopOpacity="0.38"
                  />
                  <stop
                    offset="35%"
                    stopColor="#2563eb"
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="70%"
                    stopColor="#3b82f6"
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="100%"
                    stopColor="#2563eb"
                    stopOpacity="0.38"
                  />
                </linearGradient>

                <pattern
                  id="rotorPattern"
                  width="26"
                  height="26"
                  patternUnits="userSpaceOnUse"
                  patternTransform="skewX(-16)"
                >
                  <rect
                    width="26"
                    height="26"
                    fill="transparent"
                  />

                  <rect
                    width="7"
                    height="26"
                    fill="#111619"
                  />

                  <rect
                    x="9"
                    width="3"
                    height="26"
                    fill="#ffffff"
                    opacity="0.68"
                  />
                </pattern>

                <pattern
                  id="shaftPattern"
                  width="18"
                  height="18"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width="18"
                    height="18"
                    fill="transparent"
                  />

                  <rect
                    width="18"
                    height="4"
                    fill="#ffffff"
                    opacity="0.65"
                  />

                  <rect
                    y="10"
                    width="18"
                    height="4"
                    fill="#4b5960"
                    opacity="0.3"
                  />
                </pattern>

                <filter
                  id="motorShadow"
                  x="-30%"
                  y="-40%"
                  width="170%"
                  height="190%"
                >
                  <feDropShadow
                    dx="0"
                    dy="14"
                    stdDeviation="13"
                    floodColor="#0f172a"
                    floodOpacity="0.2"
                  />
                </filter>

                <filter
                  id="smallShadow"
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="4"
                    floodColor="#0f172a"
                    floodOpacity="0.3"
                  />
                </filter>

                <filter
                  id="selectionGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur
                    stdDeviation="4"
                    result="blur"
                  />

                  <feFlood
                    floodColor="#facc15"
                    floodOpacity="0.4"
                  />

                  <feComposite
                    in2="blur"
                    operator="in"
                  />

                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="fieldGlow"
                  x="-40%"
                  y="-40%"
                  width="180%"
                  height="180%"
                >
                  <feGaussianBlur
                    stdDeviation="1.5"
                    result="blur"
                  />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="heatGlow"
                  x="-60%"
                  y="-60%"
                  width="220%"
                  height="220%"
                >
                  <feGaussianBlur
                    stdDeviation={
                      3 + temperatureRatio * 6
                    }
                    result="blur"
                  />

                  <feFlood
                    floodColor={
                      telemetry.temperature >= 90
                        ? "#dc2626"
                        : "#f97316"
                    }
                    floodOpacity={
                      temperatureRatio * 0.65
                    }
                  />

                  <feComposite
                    in2="blur"
                    operator="in"
                  />

                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="terminalGlow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur
                    stdDeviation={
                      2 + voltage / 12
                    }
                    result="blur"
                  />

                  <feFlood
                    floodColor="#ef291b"
                    floodOpacity={
                      0.3 + voltage / 40
                    }
                  />

                  <feComposite
                    in2="blur"
                    operator="in"
                  />

                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter
                  id="sparkGlow"
                  x="-200%"
                  y="-200%"
                  width="400%"
                  height="400%"
                >
                  <feGaussianBlur
                    stdDeviation="2.5"
                    result="blur"
                  />

                  <feFlood
                    floodColor="#fde047"
                    floodOpacity="0.9"
                  />

                  <feComposite
                    in2="blur"
                    operator="in"
                  />

                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <clipPath id="rotorClip">
                  <rect
                    x="500"
                    y="330"
                    width="240"
                    height="110"
                    rx="45"
                  />
                </clipPath>

                <clipPath id="shaftClip">
                  <rect
                    x="305"
                    y="368"
                    width="650"
                    height="34"
                    rx="10"
                  />
                </clipPath>

                <clipPath id="outputShaftClip">
                  <rect
                    x="925"
                    y="361"
                    width="82"
                    height="48"
                    rx="8"
                  />
                </clipPath>

                <marker
                  id="fieldArrow"
                  markerWidth="9"
                  markerHeight="9"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0 0 L8 4 L0 8 Z"
                    fill="#2563eb"
                  />
                </marker>

                <marker
                  id="returnFieldArrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                >
                  <path
                    d="M0 0 L7 3.5 L0 7 Z"
                    fill="#64748b"
                  />
                </marker>

                <marker
                  id="forceArrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0 0 L8 4 L0 8 Z"
                    fill="#16a34a"
                  />
                </marker>

                <marker
                  id="rotationArrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0 0 L8 4 L0 8 Z"
                    fill="#0f172a"
                  />
                </marker>
              </defs>

              <rect
                width="1200"
                height="760"
                fill="#ffffff"
              />

              <ellipse
                cx="650"
                cy="585"
                rx="410"
                ry="44"
                fill="#0f172a"
                opacity="0.1"
              />

              {/* External power wiring */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("power")
                }
                filter={
                  selectedPart === "power"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <path
                  d="M110 165 H250 Q280 165 280 195 V292"
                  fill="none"
                  stroke="#182126"
                  strokeWidth="19"
                  strokeLinecap="round"
                  filter="url(#smallShadow)"
                />

                <path
                  d="M110 165 H250"
                  fill="none"
                  stroke={topWireColor}
                  strokeWidth="11"
                  strokeLinecap="round"
                />

                <path
                  d="M110 250 H205 Q280 250 280 315 V477"
                  fill="none"
                  stroke="#182126"
                  strokeWidth="17"
                  strokeLinecap="round"
                  filter="url(#smallShadow)"
                />

                <path
                  d="M110 250 H205 Q280 250 280 315"
                  fill="none"
                  stroke={bottomWireColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                />

                <circle
                  cx="110"
                  cy="165"
                  r="15"
                  fill={topWireColor}
                  stroke="#111827"
                  strokeWidth="4"
                  filter={
                    topTerminalPositive
                      ? "url(#terminalGlow)"
                      : "url(#smallShadow)"
                  }
                />

                <circle
                  cx="110"
                  cy="165"
                  r="9"
                  fill="#ffffff"
                />

                <text
                  x="110"
                  y="170"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="900"
                  fill={topWireColor}
                >
                  {topTerminalPositive ? "+" : "−"}
                </text>

                <circle
                  cx="110"
                  cy="250"
                  r="15"
                  fill={bottomWireColor}
                  stroke="#111827"
                  strokeWidth="4"
                  filter={
                    bottomTerminalPositive
                      ? "url(#terminalGlow)"
                      : "url(#smallShadow)"
                  }
                />

                <circle
                  cx="110"
                  cy="250"
                  r="9"
                  fill="#ffffff"
                />

                <text
                  x="110"
                  y="255"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="900"
                  fill={bottomWireColor}
                >
                  {bottomTerminalPositive
                    ? "+"
                    : "−"}
                </text>
              </g>

              {/* Motor steel housing */}
              <g filter="url(#motorShadow)">
                <path
                  d="M340 218
                     Q362 172 418 172
                     H842
                     Q898 172 920 220
                     L945 286
                     V494
                     Q945 548 882 563
                     H400
                     Q332 554 332 496
                     V286
                     Q332 246 340 218 Z"
                  fill="url(#housingGradient)"
                  stroke="#1f2937"
                  strokeWidth="6"
                />

                <path
                  d="M368 242
                     Q381 207 422 207
                     H830
                     Q870 207 885 243
                     L911 296
                     V475
                     Q911 513 866 528
                     H416
                     Q372 518 372 475
                     V296
                     Q372 265 368 242 Z"
                  fill="#ffffff"
                  stroke="#89969c"
                  strokeWidth="4"
                />
              </g>

              {/* Top north permanent magnet */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("magnets")
                }
                filter={
                  selectedPart === "magnets"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <path
                  d="M450 238 H790 L815 258 V306 L791 323 H450 Z"
                  fill="url(#northMagnetGradient)"
                  stroke="#750c08"
                  strokeWidth="5"
                />

                <path
                  d="M450 238 L470 220 H810 L790 238 Z"
                  fill="#ff8d82"
                  stroke="#a61c15"
                  strokeWidth="3"
                />

                <text
                  x="620"
                  y="295"
                  textAnchor="middle"
                  fontSize="47"
                  fontWeight="900"
                  fill="#ffffff"
                >
                  N
                </text>

                {/* Bottom south permanent magnet */}
                <path
                  d="M450 447 H791 L815 464 V512 L790 534 H450 Z"
                  fill="url(#southMagnetGradient)"
                  stroke="#052b58"
                  strokeWidth="5"
                />

                <path
                  d="M450 447 L470 429 H810 L791 447 Z"
                  fill="#58c1ff"
                  stroke="#075ca8"
                  strokeWidth="3"
                />

                <text
                  x="620"
                  y="505"
                  textAnchor="middle"
                  fontSize="47"
                  fontWeight="900"
                  fill="#ffffff"
                >
                  S
                </text>
              </g>

              {/* Permanent magnetic field remains visible when stopped */}
              {showMagneticField && (
                <g
                  pointerEvents="none"
                  filter="url(#fieldGlow)"
                >
                  {/* Main N → S air-gap flux */}
                  <g
                    fill="none"
                    stroke="url(#fieldGradient)"
                    strokeLinecap="round"
                    strokeDasharray="12 9"
                    opacity="0.78"
                  >
                    {[535, 575, 620, 665, 705].map(
                      (x, index) => (
                        <g key={x}>
                          <path
                            d={`M${x} 318 C${
                              x - 5
                            } 325 ${x - 5} 330 ${x} 339`}
                            strokeWidth={
                              index === 2 ? 3.4 : 2.7
                            }
                            markerEnd="url(#fieldArrow)"
                            className={`field-line field-delay-${index}`}
                          />

                          <path
                            d={`M${x} 431 C${
                              x + 5
                            } 438 ${x + 5} 443 ${x} 452`}
                            strokeWidth={
                              index === 2 ? 3.4 : 2.7
                            }
                            markerEnd="url(#fieldArrow)"
                            className={`field-line field-delay-${index}`}
                          />
                        </g>
                      ),
                    )}
                  </g>

                  {/* Flux return through steel housing: S → N */}
                  <g
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="8 10"
                    opacity="0.32"
                  >
                    <path
                      d="M790 519 C894 551 925 487 925 388 C925 280 894 214 790 245"
                      markerEnd="url(#returnFieldArrow)"
                      className="return-field-line"
                    />

                    <path
                      d="M450 519 C350 551 349 474 349 388 C349 284 350 214 450 245"
                      markerEnd="url(#returnFieldArrow)"
                      className="return-field-line"
                    />
                  </g>

                  <g transform="translate(620 197)">
                    <rect
                      x="-54"
                      y="-14"
                      width="108"
                      height="28"
                      rx="14"
                      fill="#eff6ff"
                      stroke="#93c5fd"
                      strokeWidth="1.5"
                    />

                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="800"
                      fill="#1d4ed8"
                    >
                      N → S FIELD
                    </text>
                  </g>
                </g>
              )}

              {/* Main shaft */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("shaft")
                }
                filter={
                  selectedPart === "shaft"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <rect
                  x="305"
                  y="368"
                  width="650"
                  height="34"
                  rx="10"
                  fill="url(#metalGradient)"
                  stroke="#273239"
                  strokeWidth="5"
                />

                <g clipPath="url(#shaftClip)">
                  <rect
                    x="300"
                    y="342"
                    width="660"
                    height="90"
                    fill="url(#shaftPattern)"
                    className="shaft-surface"
                    style={shaftStyle}
                  />
                </g>
              </g>

              {/* Split-ring commutator */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("commutator")
                }
                filter={
                  selectedPart === "commutator"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <path
                  d="M225 326 H305 V381 H225 Q207 373 207 353 Q207 334 225 326 Z"
                  fill={
                    commutatorPhase === 1
                      ? "#f59e0b"
                      : "#c97820"
                  }
                  stroke="#4b260b"
                  strokeWidth="5"
                />

                <path
                  d="M225 389 H305 V444 H225 Q207 436 207 416 Q207 397 225 389 Z"
                  fill={
                    commutatorPhase === -1
                      ? "#f59e0b"
                      : "#c97820"
                  }
                  stroke="#4b260b"
                  strokeWidth="5"
                />

                <line
                  x1="210"
                  y1="385"
                  x2="305"
                  y2="385"
                  stroke="#201108"
                  strokeWidth="7"
                />

                <path
                  d="M233 331 V439"
                  stroke="#ffe4aa"
                  strokeWidth="4"
                  opacity="0.55"
                />
              </g>

              {/* Carbon brushes touching commutator */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("brushes")
                }
                filter={
                  selectedPart === "brushes"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <rect
                  x="242"
                  y="294"
                  width="83"
                  height="27"
                  rx="4"
                  fill="#263137"
                  stroke="#080b0d"
                  strokeWidth="4"
                />

                <path
                  d="M282 294 V270"
                  stroke="#1b2327"
                  strokeWidth="11"
                  strokeLinecap="round"
                />

                <rect
                  x="242"
                  y="450"
                  width="83"
                  height="27"
                  rx="4"
                  fill="#263137"
                  stroke="#080b0d"
                  strokeWidth="4"
                />

                <path
                  d="M282 477 V500"
                  stroke="#1b2327"
                  strokeWidth="11"
                  strokeLinecap="round"
                />

                {/* Contact pieces */}
                <rect
                  x="273"
                  y="319"
                  width="25"
                  height="16"
                  rx="3"
                  fill="#111827"
                />

                <rect
                  x="273"
                  y="438"
                  width="25"
                  height="16"
                  rx="3"
                  fill="#111827"
                />
              </g>

              {/* Complete electrical current route */}
              {showCurrent &&
                motorPowered &&
                Math.abs(telemetry.current) >
                  0.03 && (
                  <g
                    fill="none"
                    stroke="#facc15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 20"
                    opacity={clamp(
                      0.5 +
                        Math.abs(
                          telemetry.current,
                        ) /
                          12,
                      0.5,
                      1,
                    )}
                    pointerEvents="none"
                  >
                    {/* Top terminal to upper brush */}
                    <path
                      d="M110 165 H250 Q280 165 280 195 V294"
                      strokeWidth="5"
                      className="current-route"
                      style={currentFlowStyle}
                    />

                    {/* Upper brush into commutator */}
                    <path
                      d="M280 307 H296 V341 H260"
                      strokeWidth="4.5"
                      className="current-route"
                      style={currentFlowStyle}
                    />

                    {/* Through armature winding */}
                    <path
                      d="M260 341
                         C340 336 420 338 505 350
                         C485 360 482 401 505 420
                         C555 451 685 451 735 420
                         C758 401 755 360 735 350
                         C680 323 555 323 505 350"
                      strokeWidth="4.5"
                      className="current-route"
                      style={currentFlowStyle}
                    />

                    {/* Return to lower commutator */}
                    <path
                      d="M735 420
                         C640 458 400 458 260 424"
                      strokeWidth="4.5"
                      className="current-route"
                      style={currentFlowStyle}
                    />

                    {/* Lower brush to return terminal */}
                    <path
                      d="M260 424 H296 V463 H280
                         V315
                         Q280 250 205 250
                         H110"
                      strokeWidth="5"
                      className="current-route"
                      style={currentFlowStyle}
                    />
                  </g>
                )}

              {/* Brush sparking under sustained stress */}
              {showBrushSparks && (
                <g
                  className="brush-sparks"
                  filter="url(#sparkGlow)"
                  pointerEvents="none"
                >
                  <path
                    d="M298 323 l6 8 l9 -2 l-6 8 l3 9 l-8 -5 l-7 6 l2 -9 l-9 -4 l9 -3 z"
                    fill="#fde047"
                  />

                  <path
                    d="M298 439 l5 8 l9 -2 l-6 8 l3 9 l-8 -5 l-7 6 l2 -9 l-9 -4 l9 -3 z"
                    fill="#f59e0b"
                  />
                </g>
              )}

              {/* Armature */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("armature")
                }
                filter={
                  telemetry.temperature >= 70
                    ? "url(#heatGlow)"
                    : selectedPart === "armature"
                      ? "url(#selectionGlow)"
                      : undefined
                }
              >
                {/* Copper winding sides */}
                <path
                  d="M510 346
                     C486 353 477 369 477 385
                     C477 405 488 421 510 428"
                  fill="none"
                  stroke={windingHotColor}
                  strokeWidth="17"
                  strokeLinecap="round"
                />

                <path
                  d="M730 346
                     C754 353 763 369 763 385
                     C763 405 752 421 730 428"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="17"
                  strokeLinecap="round"
                />

                {/* Laminated steel rotor */}
                <rect
                  x="500"
                  y="330"
                  width="240"
                  height="110"
                  rx="45"
                  fill="url(#rotorGradient)"
                  stroke="#101518"
                  strokeWidth="7"
                />

                <g clipPath="url(#rotorClip)">
                  <rect
                    x="470"
                    y="290"
                    width="300"
                    height="200"
                    fill="url(#rotorPattern)"
                    className="rotor-surface"
                    style={rotationStyle}
                  />

                  <rect
                    x="500"
                    y="316"
                    width="240"
                    height="20"
                    fill="#ffffff"
                    opacity="0.22"
                    className="rotor-highlight"
                    style={shaftStyle}
                  />
                </g>

                <rect
                  x="500"
                  y="330"
                  width="240"
                  height="110"
                  rx="45"
                  fill="none"
                  stroke="#101518"
                  strokeWidth="7"
                />

                <rect
                  x="496"
                  y="344"
                  width="13"
                  height="82"
                  rx="5"
                  fill={
                    electricalCurrentDirection === 1
                      ? windingHotColor
                      : "#0284c7"
                  }
                />

                <rect
                  x="731"
                  y="344"
                  width="13"
                  height="82"
                  rx="5"
                  fill={
                    electricalCurrentDirection === 1
                      ? "#0284c7"
                      : windingHotColor
                  }
                />

                {/* Armature poles switch every half-turn */}
                {showArmaturePoles &&
                  motorPowered && (
                    <>
                      <g transform="translate(535 385)">
                        <circle
                          r="17"
                          fill={
                            armatureLeftPole === "N"
                              ? "#dc2626"
                              : "#2563eb"
                          }
                          stroke="#ffffff"
                          strokeWidth="3"
                        />

                        <text
                          y="6"
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="900"
                          fill="#ffffff"
                        >
                          {armatureLeftPole}
                        </text>
                      </g>

                      <g transform="translate(705 385)">
                        <circle
                          r="17"
                          fill={
                            armatureRightPole === "N"
                              ? "#dc2626"
                              : "#2563eb"
                          }
                          stroke="#ffffff"
                          strokeWidth="3"
                        />

                        <text
                          y="6"
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="900"
                          fill="#ffffff"
                        >
                          {armatureRightPole}
                        </text>
                      </g>
                    </>
                  )}
              </g>

              {/* Small tangential force couple */}
              {showForces &&
                motorPowered &&
                Math.abs(
                  telemetry.electromagneticTorque,
                ) > 0.003 && (
                  <g
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.78"
                    pointerEvents="none"
                  >
                    {torqueDirection === 1 ? (
                      <>
                        <path
                          d="M474 355 V393"
                          markerEnd="url(#forceArrow)"
                        />

                        <path
                          d="M766 415 V377"
                          markerEnd="url(#forceArrow)"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M474 415 V377"
                          markerEnd="url(#forceArrow)"
                        />

                        <path
                          d="M766 355 V393"
                          markerEnd="url(#forceArrow)"
                        />
                      </>
                    )}
                  </g>
                )}

              {/* Output bearing */}
              <path
                d="M857 323
                   H914
                   Q937 323 937 346
                   V424
                   Q937 447 914 447
                   H857 Z"
                fill="url(#metalGradient)"
                stroke="#273239"
                strokeWidth="5"
              />

              {/* Output shaft and gear */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedPart("gear")
                }
                filter={
                  selectedPart === "gear"
                    ? "url(#selectionGlow)"
                    : undefined
                }
              >
                <rect
                  x="925"
                  y="361"
                  width="82"
                  height="48"
                  rx="8"
                  fill="url(#metalGradient)"
                  stroke="#273239"
                  strokeWidth="5"
                />

                <g clipPath="url(#outputShaftClip)">
                  <rect
                    x="920"
                    y="330"
                    width="92"
                    height="110"
                    fill="url(#shaftPattern)"
                    className="output-shaft-surface"
                    style={shaftStyle}
                  />
                </g>

                <rect
                  x="925"
                  y="361"
                  width="82"
                  height="48"
                  rx="8"
                  fill="none"
                  stroke="#273239"
                  strokeWidth="5"
                />

                <rect
                  x="994"
                  y="371"
                  width="28"
                  height="28"
                  rx="5"
                  fill="url(#metalGradient)"
                  stroke="#273239"
                  strokeWidth="4"
                />

                <g transform="translate(1056 385)">
                  <g
                    className="gear-rotation"
                    style={rotationStyle}
                  >
                    {Array.from({
                      length: 12,
                    }).map((_, index) => (
                      <rect
                        key={index}
                        x="-7"
                        y="-55"
                        width="14"
                        height="24"
                        rx="2"
                        fill="#263238"
                        stroke="#101518"
                        strokeWidth="3"
                        transform={`rotate(${index * 30})`}
                      />
                    ))}

                    <circle
                      r="41"
                      fill="url(#darkMetalGradient)"
                      stroke="#101518"
                      strokeWidth="5"
                    />

                    <circle
                      r="26"
                      fill="#657279"
                      stroke="#11171a"
                      strokeWidth="4"
                    />

                    <circle
                      r="12"
                      fill="#d5dde1"
                      stroke="#263238"
                      strokeWidth="4"
                    />

                    <circle r="5" fill="#46535a" />

                    <circle
                      cx="0"
                      cy="-19"
                      r="4"
                      fill="#ffffff"
                    />
                  </g>
                </g>
              </g>

              {/* Status badge */}
              <g transform="translate(620 154)">
                <rect
                  x="-72"
                  y="-18"
                  width="144"
                  height="36"
                  rx="18"
                  fill={
                    thermalTrip
                      ? "#dc2626"
                      : overheating || stalled
                        ? "#fee2e2"
                        : overloaded
                          ? "#ffedd5"
                          : reversing
                            ? "#ede9fe"
                            : motorPowered
                              ? "#dcfce7"
                              : "#f1f5f9"
                  }
                  stroke={
                    thermalTrip
                      ? "#991b1b"
                      : overheating || stalled
                        ? "#ef4444"
                        : overloaded
                          ? "#f97316"
                          : reversing
                            ? "#8b5cf6"
                            : motorPowered
                              ? "#22c55e"
                              : "#94a3b8"
                  }
                  strokeWidth="2"
                />

                <text
                  y="6"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="900"
                  fill={
                    thermalTrip
                      ? "#ffffff"
                      : overheating || stalled
                        ? "#b91c1c"
                        : overloaded
                          ? "#c2410c"
                          : reversing
                            ? "#6d28d9"
                            : motorPowered
                              ? "#15803d"
                              : "#475569"
                  }
                >
                  {status.toUpperCase()}
                </text>
              </g>

              {/* Rotation direction */}
              {motorRotating && (
                <path
                  d={
                    actualDirection === 1
                      ? "M566 309 Q620 279 674 309"
                      : "M674 309 Q620 279 566 309"
                  }
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="5"
                  strokeLinecap="round"
                  markerEnd="url(#rotationArrow)"
                />
              )}

              {/* Diagram labels */}
              {showLabels && (
                <g
                  fill="#111827"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontWeight="700"
                  className="motor-labels"
                >
                  <text x="64" y="120" fontSize="27">
                    Power Supply (
                    {topTerminalPositive ? "+" : "−"})
                  </text>

                  <text x="64" y="228" fontSize="27">
                    Power Supply (
                    {bottomTerminalPositive
                      ? "+"
                      : "−"}
                    )
                  </text>

                  <text x="305" y="112" fontSize="26">
                    Brushes
                  </text>

                  <path
                    d="M355 124 L302 288"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <text x="70" y="394" fontSize="26">
                    Commutator
                  </text>

                  <path
                    d="M205 388 H235"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <text
                    x="620"
                    y="92"
                    textAnchor="middle"
                    fontSize="27"
                  >
                    Armature
                  </text>

                  <text
                    x="620"
                    y="124"
                    textAnchor="middle"
                    fontSize="27"
                  >
                    Electromagnet
                  </text>

                  <path
                    d="M620 128 V142"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <text
                    x="850"
                    y="105"
                    textAnchor="middle"
                    fontSize="26"
                  >
                    Permanent
                  </text>

                  <text
                    x="850"
                    y="137"
                    textAnchor="middle"
                    fontSize="26"
                  >
                    Magnets
                  </text>

                  <path
                    d="M850 147 L790 220"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <text
                    x="620"
                    y="581"
                    textAnchor="middle"
                    fontSize="27"
                  >
                    Shaft
                  </text>

                  <path
                    d="M620 552 V407"
                    stroke="#111827"
                    strokeWidth="3"
                  />

                  <text
                    x="1070"
                    y="510"
                    textAnchor="middle"
                    fontSize="24"
                  >
                    Output Shaft
                  </text>

                  <text
                    x="1070"
                    y="540"
                    textAnchor="middle"
                    fontSize="24"
                  >
                    and Gear
                  </text>

                  <path
                    d="M1059 485 L1056 432"
                    stroke="#111827"
                    strokeWidth="3"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Control panel */}
          <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Motor Control
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Simulation Panel
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[status]}`}
              >
                {status}
              </span>
            </div>

            {thermalTrip && (
              <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3">
                <p className="text-sm font-bold text-red-700">
                  Thermal protection activated
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  The winding reached{" "}
                  {MOTOR.thermalTripTemperature}°C.
                  Reset the simulation before restarting.
                </p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={thermalTrip}
                onClick={() =>
                  setRunning(
                    (previous) => !previous,
                  )
                }
                className={`rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400 ${
                  running
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {running ? "Stop" : "Start"}
              </button>

              <button
                type="button"
                disabled={thermalTrip}
                onClick={reversePolarity}
                className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Reverse
              </button>
            </div>

            <button
              type="button"
              onClick={resetSimulation}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Reset Simulation
            </button>

            {/* Polarity */}
            <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                    Applied Polarity
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {topTerminalPositive
                      ? "Top + / Bottom −"
                      : "Top − / Bottom +"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-white ${
                      topTerminalPositive
                        ? "bg-red-500"
                        : "bg-slate-700"
                    }`}
                  >
                    {topTerminalPositive
                      ? "+"
                      : "−"}
                  </span>

                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-white ${
                      bottomTerminalPositive
                        ? "bg-red-500"
                        : "bg-slate-700"
                    }`}
                  >
                    {bottomTerminalPositive
                      ? "+"
                      : "−"}
                  </span>
                </div>
              </div>
            </div>

            <ControlSlider
              id="voltage"
              label="Supply Voltage"
              value={voltage}
              minimum={0}
              maximum={24}
              unit="V"
              accentClass="accent-blue-600"
              valueClass="bg-blue-100 text-blue-700"
              onChange={setVoltage}
              leftLabel="0 V"
              middleLabel="12 V"
              rightLabel="24 V"
            />

            <ControlSlider
              id="load"
              label="Mechanical Load"
              value={loadPercent}
              minimum={0}
              maximum={100}
              unit="%"
              accentClass="accent-amber-500"
              valueClass="bg-amber-100 text-amber-700"
              onChange={setLoadPercent}
              leftLabel="No load"
              rightLabel="Full load"
            />

            {/* Temperature */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Winding Temperature
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      overheating
                        ? "text-red-600"
                        : telemetry.temperature >= 70
                          ? "text-orange-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {temperatureStatus}
                  </p>
                </div>

                <span
                  className={`rounded-lg px-2 py-1 text-sm font-bold ${
                    overheating
                      ? "bg-red-100 text-red-700"
                      : telemetry.temperature >= 70
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {telemetry.temperature.toFixed(1)}
                  °C
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    overheating
                      ? "bg-red-500"
                      : telemetry.temperature >= 70
                        ? "bg-orange-500"
                        : telemetry.temperature >= 50
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${temperatureRatio * 100}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>25°C</span>
                <span>85°C derating</span>
                <span>110°C trip</span>
              </div>
            </div>

            {/* Live readings */}
            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Live Readings
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <ReadingCard
                  label="Speed"
                  value={`${Math.round(rpm).toLocaleString()} RPM`}
                />

                <ReadingCard
                  label="Signed RPM"
                  value={Math.round(
                    signedRpm,
                  ).toLocaleString()}
                />

                <ReadingCard
                  label="Armature Current"
                  value={`${telemetry.current.toFixed(2)} A`}
                  warning={
                    Math.abs(telemetry.current) >
                    MOTOR.continuousCurrentLimit
                  }
                />

                <ReadingCard
                  label="Motor Torque"
                  value={`${telemetry.electromagneticTorque.toFixed(3)} N·m`}
                />

                <ReadingCard
                  label="Net Torque"
                  value={`${telemetry.netTorque.toFixed(3)} N·m`}
                />

                <ReadingCard
                  label="Load Torque"
                  value={`${telemetry.loadTorque.toFixed(3)} N·m`}
                />

                <ReadingCard
                  label="Back EMF"
                  value={`${telemetry.backEmf.toFixed(2)} V`}
                />

                <ReadingCard
                  label="Resistance"
                  value={`${telemetry.resistance.toFixed(2)} Ω`}
                />

                <ReadingCard
                  label="Copper Loss"
                  value={`${telemetry.copperLoss.toFixed(1)} W`}
                  warning={
                    telemetry.copperLoss > 80
                  }
                />

                <ReadingCard
                  label="Output Power"
                  value={`${outputPower.toFixed(1)} W`}
                />

                <ReadingCard
                  label="Efficiency"
                  value={`${efficiency.toFixed(0)}%`}
                />

                <ReadingCard
                  label="Direction"
                  value={
                    rpm < 5
                      ? "Stopped"
                      : actualDirection === 1
                        ? "Clockwise"
                        : "Counterclockwise"
                  }
                />
              </div>
            </div>

            {/* Display options */}
            <div className="mt-5 space-y-2">
              <ToggleRow
                label="Show labels"
                checked={showLabels}
                onChange={setShowLabels}
              />

              <ToggleRow
                label="Show full current route"
                checked={showCurrent}
                onChange={setShowCurrent}
              />

              <ToggleRow
                label="Show N → S magnetic field"
                checked={showMagneticField}
                onChange={setShowMagneticField}
              />

              <ToggleRow
                label="Show force direction"
                checked={showForces}
                onChange={setShowForces}
              />

              <ToggleRow
                label="Show armature N/S poles"
                checked={showArmaturePoles}
                onChange={setShowArmaturePoles}
              />
            </div>

            {/* Selected component */}
            <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                Selected Component
              </p>

              <h3 className="mt-2 text-lg font-bold text-slate-950">
                {MOTOR_PARTS[selectedPart].title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {
                  MOTOR_PARTS[selectedPart]
                    .description
                }
              </p>

              <div className="mt-3 border-t border-amber-200 pt-3">
                <p className="text-xs font-bold text-amber-800">
                  Typical material
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {
                    MOTOR_PARTS[selectedPart]
                      .material
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {(Object.keys(
                MOTOR_PARTS,
              ) as MotorPart[]).map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() =>
                    setSelectedPart(part)
                  }
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                    selectedPart === part
                      ? "border-amber-400 bg-amber-50 text-amber-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {MOTOR_PARTS[part].title}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Visualization Legend
              </h3>

              <div className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                <p>
                  <span className="font-bold text-blue-600">
                    Blue arrows:
                  </span>{" "}
                  permanent magnetic field from the
                  upper N pole to the lower S pole.
                </p>

                <p>
                  <span className="font-bold text-slate-500">
                    Grey dashed paths:
                  </span>{" "}
                  return flux through the steel housing.
                </p>

                <p>
                  <span className="font-bold text-yellow-600">
                    Yellow dashes:
                  </span>{" "}
                  current through the brushes,
                  commutator and winding.
                </p>

                <p>
                  <span className="font-bold text-emerald-600">
                    Green arrows:
                  </span>{" "}
                  opposing conductor forces that produce
                  motor torque.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .rotor-surface,
        .rotor-highlight,
        .shaft-surface,
        .output-shaft-surface,
        .gear-rotation,
        .current-route,
        .field-line,
        .return-field-line,
        .brush-sparks {
          will-change: transform, opacity,
            stroke-dashoffset;
        }

        .rotor-surface {
          animation-name: rotor-surface-motion;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .rotor-highlight {
          animation-name: rotor-highlight-motion;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .shaft-surface,
        .output-shaft-surface {
          animation-name: shaft-surface-motion;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .gear-rotation {
          animation-name: gear-rotation;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-box: fill-box;
          transform-origin: center;
        }

        .current-route {
          animation-name: current-route-motion;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .field-line {
          animation-name: field-flow;
          animation-duration: 2.7s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .field-delay-0 {
          animation-delay: 0s;
        }

        .field-delay-1 {
          animation-delay: -0.3s;
        }

        .field-delay-2 {
          animation-delay: -0.6s;
        }

        .field-delay-3 {
          animation-delay: -0.9s;
        }

        .field-delay-4 {
          animation-delay: -1.2s;
        }

        .return-field-line {
          animation-name: return-field-flow;
          animation-duration: 4.2s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .brush-sparks {
          animation: spark-flash 0.16s
            steps(2, end) infinite;
        }

        .motor-labels text {
          paint-order: stroke;
          stroke: rgba(255, 255, 255, 0.96);
          stroke-width: 3px;
          stroke-linejoin: round;
        }

        @keyframes rotor-surface-motion {
          from {
            transform: translateY(-26px);
          }

          to {
            transform: translateY(26px);
          }
        }

        @keyframes rotor-highlight-motion {
          from {
            transform: translateY(-20px);
            opacity: 0.14;
          }

          50% {
            opacity: 0.42;
          }

          to {
            transform: translateY(95px);
            opacity: 0.14;
          }
        }

        @keyframes shaft-surface-motion {
          from {
            transform: translateY(-18px);
          }

          to {
            transform: translateY(18px);
          }
        }

        @keyframes gear-rotation {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes current-route-motion {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -104;
          }
        }

        @keyframes field-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -42;
          }
        }

        @keyframes return-field-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: 36;
          }
        }

        @keyframes spark-flash {
          0%,
          100% {
            opacity: 0.15;
          }

          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rotor-surface,
          .rotor-highlight,
          .shaft-surface,
          .output-shaft-surface,
          .gear-rotation,
          .current-route,
          .field-line,
          .return-field-line,
          .brush-sparks {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

interface ReadingCardProps {
  label: string;
  value: string;
  warning?: boolean;
}

function ReadingCard({
  label,
  value,
  warning = false,
}: ReadingCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        warning
          ? "border-red-300 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          warning
            ? "text-red-500"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-bold ${
          warning
            ? "text-red-700"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({
  label,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <span className="pr-3 text-sm font-semibold text-slate-700">
        {label}
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="sr-only"
        />

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </label>
  );
}

interface ControlSliderProps {
  id: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  unit: string;
  accentClass: string;
  valueClass: string;
  onChange: (value: number) => void;
  leftLabel: string;
  middleLabel?: string;
  rightLabel: string;
}

function ControlSlider({
  id,
  label,
  value,
  minimum,
  maximum,
  unit,
  accentClass,
  valueClass,
  onChange,
  leftLabel,
  middleLabel,
  rightLabel,
}: ControlSliderProps) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-bold text-slate-700"
        >
          {label}
        </label>

        <span
          className={`rounded-lg px-2 py-1 text-sm font-bold ${valueClass}`}
        >
          {value} {unit}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={minimum}
        max={maximum}
        step="1"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className={`mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 ${accentClass}`}
      />

      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{leftLabel}</span>

        {middleLabel && <span>{middleLabel}</span>}

        <span>{rightLabel}</span>
      </div>
    </div>
  );
}