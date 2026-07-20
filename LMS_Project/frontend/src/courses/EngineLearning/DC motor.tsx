"use client";

import React, {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

type DcMotor3DSimulationProps = {
  className?: string;
};

type Vec3 = [number, number, number];
type Direction = 1 | -1;

type LearningPreset =
  | "complete"
  | "construction"
  | "field"
  | "commutation"
  | "speed";

type Face3D = {
  points: Vec3[];
  fill: string;
  stroke?: string;
  alpha?: number;
};

type Line3D = {
  points: Vec3[];
  color: string;
  width: number;
  alpha?: number;
  dash?: number[];
};

type ScenePart = {
  faces: Face3D[];
  lines: Line3D[];
};

type PartInstance = {
  part: ScenePart;
  localRotationX: number;
};

type DcMotorControls = {
  powered: boolean;
  paused: boolean;
  cutaway: boolean;
  direction: Direction;

  armatureVoltage: number;
  fieldVoltage: number;
  loadPercent: number;
  starterResistance: number;
  currentLimitA: number;
  currentLimitEnabled: boolean;
  fieldLossProtection: boolean;
  simulationSpeed: number;
  inertiaPU: number;

  housingOpacity: number;

  showBase: boolean;
  showHousing: boolean;
  showPoles: boolean;
  showFieldCoils: boolean;
  showArmatureCore: boolean;
  showArmatureWindings: boolean;
  showCommutator: boolean;
  showBrushes: boolean;
  showBearings: boolean;
  showFanGuard: boolean;

  showMainField: boolean;
  showFluxCircuit: boolean;
  showArmatureField: boolean;
  showCurrentArrows: boolean;
  showTorqueArrow: boolean;
  showLabels: boolean;
};

type MotorPhysicalState = {
  fieldCurrentA: number;
  armatureCurrentA: number;
  omegaRadPerSec: number;
  rotorAngleRad: number;
  temperatureC: number;
};

type CommutationResult = {
  positiveSegment: number;
  negativeSegment: number;
  coilCurrents: number[];
  slotCurrents: number[];
  commutatingCoils: number[];
  armatureMmfAngleRad: number;
  armatureMmfPU: number;
};

type MotorTelemetry = {
  fieldCurrentA: number;
  armatureCurrentA: number;

  fieldFluxPU: number;
  armatureMmfPU: number;
  armatureMmfAngleRad: number;

  backEmfV: number;
  armatureResistiveDropV: number;
  starterDropV: number;
  inductiveDropV: number;

  electromagneticTorqueNm: number;
  loadTorqueNm: number;
  frictionTorqueNm: number;

  speedRpm: number;
  rotorAngleRad: number;

  electricalInputPowerW: number;
  mechanicalOutputPowerW: number;
  copperLossW: number;
  rotationalLossW: number;
  efficiencyPercent: number;

  temperatureC: number;

  positiveSegment: number;
  negativeSegment: number;
  commutatingCoils: number[];
  coilCurrents: number[];
  slotCurrents: number[];

  currentLimited: boolean;
  armatureContactorClosed: boolean;
  fieldLossDetected: boolean;

  torqueDirection: Direction;
  status: string;
  warning: string;
};

type ProjectedPoint = {
  x: number;
  y: number;
  z: number;
  visible: boolean;
};

type TransformedFace = {
  face: Face3D;
  transformed: Vec3[];
  projected: ProjectedPoint[];
  depth: number;
};

type TransformedLineSegment = {
  start: ProjectedPoint;
  end: ProjectedPoint;
  color: string;
  width: number;
  alpha: number;
  dash: number[];
  depth: number;
};

const PI = Math.PI;
const TWO_PI = Math.PI * 2;

const SLOT_COUNT = 12;
const COIL_COUNT = 12;
const COMMUTATOR_SEGMENTS = 12;

const SLOT_STEP = TWO_PI / SLOT_COUNT;
const SEGMENT_STEP = TWO_PI / COMMUTATOR_SEGMENTS;

const COIL_PITCH_SLOTS = 5;

const ARMATURE_LENGTH = 2.72;
const ARMATURE_HALF_LENGTH = ARMATURE_LENGTH / 2;

const ARMATURE_BACK_IRON_RADIUS = 0.49;
const ARMATURE_OUTER_RADIUS = 0.68;
const ARMATURE_CONDUCTOR_RADIUS = 0.59;

const POLE_SHOE_INNER_RADIUS = 0.755;
const POLE_SHOE_OUTER_RADIUS = 1.01;
const POLE_ARC_LENGTH = PI * 0.58;

const YOKE_INNER_RADIUS = 1.2;
const YOKE_OUTER_RADIUS = 1.5;

const COMMUTATOR_X = -1.76;
const COMMUTATOR_LENGTH = 0.52;
const COMMUTATOR_INNER_RADIUS = 0.18;
const COMMUTATOR_OUTER_RADIUS = 0.35;

const POSITIVE_BRUSH_AXIS = PI / 2;
const NEGATIVE_BRUSH_AXIS = PI * 1.5;

const ARMATURE_RESISTANCE = 0.9;
const ARMATURE_INDUCTANCE = 0.085;

const FIELD_RESISTANCE = 180;
const FIELD_INDUCTANCE = 6.5;

const RATED_FIELD_CURRENT = 1;
const RATED_ARMATURE_CURRENT = 14;
const RATED_TORQUE = 10;

const BACK_EMF_CONSTANT = 0.82;
const TORQUE_CONSTANT = 0.82;

const VISCOUS_FRICTION = 0.013;
const COULOMB_FRICTION = 0.12;
const BASE_INERTIA = 0.045;

const AMBIENT_TEMPERATURE = 25;
const THERMAL_CAPACITY = 1900;
const THERMAL_RESISTANCE = 0.11;

const FIELD_PROTECTION_LEVEL = 0.18;
const FIELD_WARNING_LEVEL = 0.26;

const COLORS = {
  background: "#eaf0f4",

  base: "#56626b",
  baseDark: "#3f4951",

  housing: "#717c85",
  housingLight: "#929ca4",
  housingDark: "#3d474f",

  yoke: "#465159",
  poleCore: "#566169",
  poleShoe: "#7e8991",

  fieldCoil: "#bd6e39",
  fieldCoilLight: "#df9458",
  fieldCoilDark: "#7f4527",

  armatureBackIron: "#747e85",
  armatureTooth: "#a7afb5",
  armatureToothDark: "#828c93",
  armatureSlot: "#20272d",

  copper: "#c7783c",
  copperLight: "#e19a5e",
  copperDark: "#8e4e2b",

  shaft: "#d9dee1",

  commutatorCopper: "#ca793e",
  commutatorCopperAlt: "#aa5b30",
  commutatorMica: "#20272d",

  brush: "#20262b",
  brushHolder: "#59636b",
  positive: "#dc2626",
  negative: "#2563eb",

  bearing: "#d7dcdf",
  bearingDark: "#707a82",

  fan: "#4d5961",

  mainField: "#06a7c4",
  mainFieldDark: "#087f94",
  armatureField: "#f97316",
  torque: "#7c3aed",

  currentPositive: "#ef4444",
  currentNegative: "#2563eb",
  currentNeutral: "#94a3b8",

  success: "#047857",
  warning: "#b91c1c",
};

const INITIAL_CONTROLS: DcMotorControls = {
  powered: true,
  paused: false,
  cutaway: true,
  direction: 1,

  armatureVoltage: 180,
  fieldVoltage: 180,
  loadPercent: 40,
  starterResistance: 3.5,
  currentLimitA: 32,
  currentLimitEnabled: true,
  fieldLossProtection: true,
  simulationSpeed: 0.35,
  inertiaPU: 0.75,

  housingOpacity: 0.9,

  showBase: true,
  showHousing: true,
  showPoles: true,
  showFieldCoils: true,
  showArmatureCore: true,
  showArmatureWindings: true,
  showCommutator: true,
  showBrushes: true,
  showBearings: true,
  showFanGuard: true,

  showMainField: true,
  showFluxCircuit: true,
  showArmatureField: true,
  showCurrentArrows: true,
  showTorqueArrow: true,
  showLabels: true,
};

const INITIAL_TELEMETRY: MotorTelemetry = {
  fieldCurrentA: 1,
  armatureCurrentA: 0,

  fieldFluxPU: 1,
  armatureMmfPU: 0,
  armatureMmfAngleRad: PI / 2,

  backEmfV: 0,
  armatureResistiveDropV: 0,
  starterDropV: 0,
  inductiveDropV: 0,

  electromagneticTorqueNm: 0,
  loadTorqueNm: 4,
  frictionTorqueNm: 0,

  speedRpm: 0,
  rotorAngleRad: 0,

  electricalInputPowerW: 180,
  mechanicalOutputPowerW: 0,
  copperLossW: 180,
  rotationalLossW: 0,
  efficiencyPercent: 0,

  temperatureC: AMBIENT_TEMPERATURE,

  positiveSegment: 3,
  negativeSegment: 9,
  commutatingCoils: [],
  coilCurrents: Array.from(
    { length: COIL_COUNT },
    () => 0,
  ),
  slotCurrents: Array.from(
    { length: SLOT_COUNT },
    () => 0,
  ),

  currentLimited: false,
  armatureContactorClosed: true,
  fieldLossDetected: false,

  torqueDirection: 1,
  status: "Ready",
  warning: "",
};

const buttonStyle: CSSProperties = {
  minHeight: 36,
  padding: "7px 11px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#ffffff",
  color: "#172033",
  fontSize: 12,
  fontWeight: 760,
  cursor: "pointer",
};

const cardStyle: CSSProperties = {
  border: "1px solid #d8e0e6",
  borderRadius: 10,
  background: "#ffffff",
  padding: 12,
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(
    minimum,
    Math.min(maximum, value),
  );
}

function positiveModulo(
  value: number,
  modulus: number,
): number {
  return (
    ((value % modulus) + modulus) %
    modulus
  );
}

function normalizeAngle(angle: number): number {
  return positiveModulo(angle, TWO_PI);
}

function normalizeSignedAngle(
  angle: number,
): number {
  let normalized = normalizeAngle(angle);

  if (normalized > PI) {
    normalized -= TWO_PI;
  }

  return normalized;
}

function angularDistance(
  first: number,
  second: number,
): number {
  return Math.abs(
    normalizeSignedAngle(first - second),
  );
}

function smoothStep(value: number): number {
  const x = clamp(value, 0, 1);

  return x * x * (3 - 2 * x);
}

function slotAngle(index: number): number {
  return (
    positiveModulo(index, SLOT_COUNT) *
    SLOT_STEP
  );
}

function segmentAngle(index: number): number {
  return (
    positiveModulo(
      index,
      COMMUTATOR_SEGMENTS,
    ) * SEGMENT_STEP
  );
}

function radialPoint(
  x: number,
  radius: number,
  angle: number,
): Vec3 {
  return [
    x,
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
  ];
}

function addVec(
  first: Vec3,
  second: Vec3,
): Vec3 {
  return [
    first[0] + second[0],
    first[1] + second[1],
    first[2] + second[2],
  ];
}

function subtractVec(
  first: Vec3,
  second: Vec3,
): Vec3 {
  return [
    first[0] - second[0],
    first[1] - second[1],
    first[2] - second[2],
  ];
}

function scaleVec(
  vector: Vec3,
  scale: number,
): Vec3 {
  return [
    vector[0] * scale,
    vector[1] * scale,
    vector[2] * scale,
  ];
}

function crossVec(
  first: Vec3,
  second: Vec3,
): Vec3 {
  return [
    first[1] * second[2] -
      first[2] * second[1],

    first[2] * second[0] -
      first[0] * second[2],

    first[0] * second[1] -
      first[1] * second[0],
  ];
}

function lengthVec(vector: Vec3): number {
  return Math.hypot(
    vector[0],
    vector[1],
    vector[2],
  );
}

function normalizeVec(vector: Vec3): Vec3 {
  const length = lengthVec(vector);

  if (length < 0.000001) {
    return [0, 0, 0];
  }

  return [
    vector[0] / length,
    vector[1] / length,
    vector[2] / length,
  ];
}

function rotateX(
  point: Vec3,
  angle: number,
): Vec3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return [
    point[0],
    point[1] * cosine -
      point[2] * sine,
    point[1] * sine +
      point[2] * cosine,
  ];
}

function rotateY(
  point: Vec3,
  angle: number,
): Vec3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return [
    point[0] * cosine +
      point[2] * sine,
    point[1],
    -point[0] * sine +
      point[2] * cosine,
  ];
}

function transformPoint(
  point: Vec3,
  localRotationX: number,
  yaw: number,
  pitch: number,
): Vec3 {
  const local = rotateX(
    point,
    localRotationX,
  );

  const pitched = rotateX(
    local,
    pitch,
  );

  return rotateY(pitched, yaw);
}

function projectPoint(
  point: Vec3,
  width: number,
  height: number,
  cameraDistance: number,
): ProjectedPoint {
  const denominator =
    cameraDistance - point[2];

  if (denominator <= 0.08) {
    return {
      x: 0,
      y: 0,
      z: point[2],
      visible: false,
    };
  }

  const perspective =
    cameraDistance / denominator;

  const scale = Math.min(
    width / 9.4,
    height / 5.15,
  );

  return {
    x:
      width / 2 +
      point[0] *
        scale *
        perspective,

    y:
      height * 0.52 -
      point[1] *
        scale *
        perspective,

    z: point[2],

    visible:
      perspective > 0 &&
      perspective < 8,
  };
}

function parseHexColor(
  color: string,
): [number, number, number] {
  const normalized = color.replace(
    "#",
    "",
  );

  const value = Number.parseInt(
    normalized,
    16,
  );

  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ];
}

function shadeColor(
  color: string,
  brightness: number,
): string {
  const [red, green, blue] =
    parseHexColor(color);

  const adjustedRed = clamp(
    Math.round(red * brightness),
    0,
    255,
  );

  const adjustedGreen = clamp(
    Math.round(green * brightness),
    0,
    255,
  );

  const adjustedBlue = clamp(
    Math.round(blue * brightness),
    0,
    255,
  );

  return `rgb(${adjustedRed}, ${adjustedGreen}, ${adjustedBlue})`;
}

function findNearestSegment(
  rotorAngle: number,
  brushAxis: number,
): number {
  const localAngle = normalizeAngle(
    brushAxis - rotorAngle,
  );

  return positiveModulo(
    Math.round(
      localAngle / SEGMENT_STEP,
    ),
    COMMUTATOR_SEGMENTS,
  );
}

function calculateCommutation(
  rotorAngle: number,
  armatureCurrent: number,
  direction: Direction,
): CommutationResult {
  const positiveBrushAxis =
    direction === 1
      ? POSITIVE_BRUSH_AXIS
      : NEGATIVE_BRUSH_AXIS;

  const negativeBrushAxis =
    direction === 1
      ? NEGATIVE_BRUSH_AXIS
      : POSITIVE_BRUSH_AXIS;

  const positiveSegment =
    findNearestSegment(
      rotorAngle,
      positiveBrushAxis,
    );

  const negativeSegment =
    findNearestSegment(
      rotorAngle,
      negativeBrushAxis,
    );

  const coilCurrents = Array.from(
    { length: COIL_COUNT },
    () => 0,
  );

  const slotCurrents = Array.from(
    { length: SLOT_COUNT },
    () => 0,
  );

  const commutatingCoils: number[] = [];

  const pathCurrent =
    armatureCurrent / 2;

  const commutationZone =
    SEGMENT_STEP * 0.7;

  for (
    let coilIndex = 0;
    coilIndex < COIL_COUNT;
    coilIndex += 1
  ) {
    const relativeIndex =
      positiveModulo(
        coilIndex - positiveSegment,
        COIL_COUNT,
      );

    const pathSign =
      relativeIndex <
      COIL_COUNT / 2
        ? 1
        : -1;

    const coilBoundaryAngle =
      normalizeAngle(
        rotorAngle +
          (coilIndex + 1) *
            SEGMENT_STEP,
      );

    const distanceToPositiveBrush =
      angularDistance(
        coilBoundaryAngle,
        positiveBrushAxis,
      );

    const distanceToNegativeBrush =
      angularDistance(
        coilBoundaryAngle,
        negativeBrushAxis,
      );

    const nearestBrushDistance =
      Math.min(
        distanceToPositiveBrush,
        distanceToNegativeBrush,
      );

    const commutationFactor =
      smoothStep(
        nearestBrushDistance /
          commutationZone,
      );

    if (commutationFactor < 0.92) {
      commutatingCoils.push(coilIndex);
    }

    const coilCurrent =
      pathCurrent *
      pathSign *
      commutationFactor;

    coilCurrents[coilIndex] =
      coilCurrent;

    const firstSlot = coilIndex;

    const secondSlot =
      positiveModulo(
        coilIndex +
          COIL_PITCH_SLOTS,
        SLOT_COUNT,
      );

    slotCurrents[firstSlot] +=
      coilCurrent;

    slotCurrents[secondSlot] -=
      coilCurrent;
  }

  let mmfY = 0;
  let mmfZ = 0;
  let currentSum = 0;

  for (
    let slotIndex = 0;
    slotIndex < SLOT_COUNT;
    slotIndex += 1
  ) {
    const current =
      slotCurrents[slotIndex];

    const worldAngle =
      rotorAngle +
      slotAngle(slotIndex);

    mmfY +=
      current *
      Math.cos(worldAngle);

    mmfZ +=
      current *
      Math.sin(worldAngle);

    currentSum +=
      Math.abs(current);
  }

  const mmfMagnitude =
    Math.hypot(mmfY, mmfZ);

  const armatureMmfAngleRad =
    mmfMagnitude > 0.0001
      ? Math.atan2(mmfZ, mmfY)
      : PI / 2;

  const armatureMmfPU =
    currentSum > 0.0001
      ? clamp(
          mmfMagnitude /
            currentSum *
            Math.abs(
              armatureCurrent,
            ) /
            RATED_ARMATURE_CURRENT *
            2.1,
          0,
          1.5,
        )
      : 0;

  return {
    positiveSegment,
    negativeSegment,
    coilCurrents,
    slotCurrents,
    commutatingCoils,
    armatureMmfAngleRad,
    armatureMmfPU,
  };
}

function stepMotorModel(
  state: MotorPhysicalState,
  controls: DcMotorControls,
  elapsedSeconds: number,
  requestedStep: number,
): MotorTelemetry {
  const simulationDelta =
    controls.paused
      ? 0
      : clamp(
          elapsedSeconds *
            controls.simulationSpeed,
          0,
          0.035,
        );

  if (
    controls.paused &&
    requestedStep !== 0
  ) {
    state.rotorAngleRad =
      normalizeAngle(
        state.rotorAngleRad +
          requestedStep,
      );
  }

  const fieldVoltage =
    controls.powered
      ? controls.fieldVoltage
      : 0;

  let fieldCurrentDerivative = 0;

  if (simulationDelta > 0) {
    fieldCurrentDerivative =
      (fieldVoltage -
        FIELD_RESISTANCE *
          state.fieldCurrentA) /
      FIELD_INDUCTANCE;

    state.fieldCurrentA +=
      fieldCurrentDerivative *
      simulationDelta;

    state.fieldCurrentA = clamp(
      state.fieldCurrentA,
      0,
      1.45,
    );
  }

  const unsaturatedFlux =
    Math.tanh(
      state.fieldCurrentA / 0.76,
    );

  const ratedUnsaturatedFlux =
    Math.tanh(
      RATED_FIELD_CURRENT / 0.76,
    );

  const fieldFluxPU = clamp(
    unsaturatedFlux /
      ratedUnsaturatedFlux,
    0,
    1.2,
  );

  const fieldLossDetected =
    controls.powered &&
    fieldFluxPU <
      FIELD_PROTECTION_LEVEL;

  const armatureContactorClosed =
    controls.powered &&
    (
      !controls.fieldLossProtection ||
      !fieldLossDetected
    );

  const appliedArmatureVoltage =
    armatureContactorClosed
      ? controls.direction *
        controls.armatureVoltage
      : 0;

  const initialBackEmf =
    BACK_EMF_CONSTANT *
    fieldFluxPU *
    state.omegaRadPerSec;

  const totalResistance =
    ARMATURE_RESISTANCE +
    controls.starterResistance;

  const unrestrictedDerivative =
    (appliedArmatureVoltage -
      totalResistance *
        state.armatureCurrentA -
      initialBackEmf) /
    ARMATURE_INDUCTANCE;

  let armatureCurrentDerivative =
    unrestrictedDerivative;

  let currentLimited = false;

  if (
    controls.currentLimitEnabled &&
    armatureContactorClosed &&
    simulationDelta > 0
  ) {
    const predictedCurrent =
      state.armatureCurrentA +
      unrestrictedDerivative *
        simulationDelta;

    if (
      Math.abs(predictedCurrent) >
      controls.currentLimitA
    ) {
      currentLimited = true;

      const targetCurrent =
        Math.sign(
          predictedCurrent ||
            appliedArmatureVoltage ||
            controls.direction,
        ) *
        controls.currentLimitA;

      armatureCurrentDerivative =
        (targetCurrent -
          state.armatureCurrentA) /
        simulationDelta;
    }
  }

  if (simulationDelta > 0) {
    state.armatureCurrentA +=
      armatureCurrentDerivative *
      simulationDelta;

    const hardLimit =
      controls.currentLimitEnabled
        ? controls.currentLimitA
        : 180;

    state.armatureCurrentA = clamp(
      state.armatureCurrentA,
      -hardLimit,
      hardLimit,
    );
  }

  const commutation =
    calculateCommutation(
      state.rotorAngleRad,
      state.armatureCurrentA,
      controls.direction,
    );

  const electromagneticTorqueNm =
    TORQUE_CONSTANT *
    fieldFluxPU *
    state.armatureCurrentA;

  const loadTorqueNm =
    RATED_TORQUE *
    1.3 *
    controls.loadPercent /
    100;

  const motionDirection =
    Math.abs(
      state.omegaRadPerSec,
    ) > 0.03
      ? Math.sign(
          state.omegaRadPerSec,
        )
      : Math.sign(
          electromagneticTorqueNm ||
            controls.direction,
        );

  const viscousTorque =
    VISCOUS_FRICTION *
    state.omegaRadPerSec;

  const coulombTorque =
    Math.abs(
      state.omegaRadPerSec,
    ) > 0.03
      ? COULOMB_FRICTION *
        Math.sign(
          state.omegaRadPerSec,
        )
      : 0;

  const frictionTorqueNm =
    viscousTorque +
    coulombTorque;

  const inertia =
    BASE_INERTIA *
    (0.45 + controls.inertiaPU);

  if (simulationDelta > 0) {
    const netTorque =
      electromagneticTorqueNm -
      loadTorqueNm *
        motionDirection -
      frictionTorqueNm;

    state.omegaRadPerSec +=
      netTorque /
      inertia *
      simulationDelta;

    state.omegaRadPerSec = clamp(
      state.omegaRadPerSec,
      -420,
      420,
    );

    if (
      !controls.powered &&
      Math.abs(
        state.omegaRadPerSec,
      ) < 0.035
    ) {
      state.omegaRadPerSec = 0;
    }

    state.rotorAngleRad =
      normalizeAngle(
        state.rotorAngleRad +
          state.omegaRadPerSec *
            simulationDelta,
      );
  }

  const updatedCommutation =
    calculateCommutation(
      state.rotorAngleRad,
      state.armatureCurrentA,
      controls.direction,
    );

  const speedRpm =
    state.omegaRadPerSec *
    60 /
    TWO_PI;

  const backEmfV =
    BACK_EMF_CONSTANT *
    fieldFluxPU *
    state.omegaRadPerSec;

  const armatureResistiveDropV =
    ARMATURE_RESISTANCE *
    state.armatureCurrentA;

  const starterDropV =
    controls.starterResistance *
    state.armatureCurrentA;

  const inductiveDropV =
    ARMATURE_INDUCTANCE *
    armatureCurrentDerivative;

  const armatureInputPowerW =
    Math.abs(
      appliedArmatureVoltage *
      state.armatureCurrentA,
    );

  const fieldInputPowerW =
    Math.abs(
      fieldVoltage *
      state.fieldCurrentA,
    );

  const electricalInputPowerW =
    armatureInputPowerW +
    fieldInputPowerW;

  const mechanicalOutputPowerW =
    Math.max(
      0,
      Math.abs(
        loadTorqueNm *
        state.omegaRadPerSec,
      ),
    );

  const armatureCopperLoss =
    state.armatureCurrentA *
    state.armatureCurrentA *
    ARMATURE_RESISTANCE;

  const starterLoss =
    state.armatureCurrentA *
    state.armatureCurrentA *
    controls.starterResistance;

  const fieldCopperLoss =
    state.fieldCurrentA *
    state.fieldCurrentA *
    FIELD_RESISTANCE;

  const copperLossW =
    armatureCopperLoss +
    starterLoss +
    fieldCopperLoss;

  const brushLoss =
    Math.abs(
      state.armatureCurrentA,
    ) * 1.6;

  const ironLoss =
    controls.powered
      ? 24 *
        fieldFluxPU *
        fieldFluxPU *
        clamp(
          Math.abs(speedRpm) /
            1800,
          0,
          1.4,
        )
      : 0;

  const mechanicalLoss =
    Math.abs(
      frictionTorqueNm *
      state.omegaRadPerSec,
    );

  const rotationalLossW =
    brushLoss +
    ironLoss +
    mechanicalLoss;

  const totalLoss =
    copperLossW +
    rotationalLossW;

  if (simulationDelta > 0) {
    const cooling =
      0.32 +
      0.68 *
      clamp(
        Math.abs(speedRpm) /
          1800,
        0,
        1,
      );

    const effectiveThermalResistance =
      THERMAL_RESISTANCE /
      cooling;

    const heatRemoved =
      (state.temperatureC -
        AMBIENT_TEMPERATURE) /
      effectiveThermalResistance;

    state.temperatureC +=
      (totalLoss - heatRemoved) /
      THERMAL_CAPACITY *
      simulationDelta;

    state.temperatureC = clamp(
      state.temperatureC,
      AMBIENT_TEMPERATURE,
      170,
    );
  }

  const efficiencyPercent =
    electricalInputPowerW > 1
      ? clamp(
          mechanicalOutputPowerW /
            electricalInputPowerW *
            100,
          0,
          95,
        )
      : 0;

  let status = "Motoring";
  let warning = "";

  if (!controls.powered) {
    status =
      Math.abs(speedRpm) > 2
        ? "Coasting"
        : "Stopped";
  } else if (
    controls.fieldLossProtection &&
    fieldLossDetected
  ) {
    status = "Field protection active";
    warning =
      "The armature contactor is open until the field flux reaches a safe level.";
  } else if (
    fieldFluxPU <
    FIELD_WARNING_LEVEL
  ) {
    status = "Field weakened";
    warning =
      "Low field flux reduces torque per ampere and can produce overspeed.";
  } else if (
    Math.abs(speedRpm) < 60
  ) {
    status = "Starting";
  } else if (
    Math.sign(speedRpm) !==
    controls.direction
  ) {
    status = "Reversing";
  } else if (currentLimited) {
    status = "Current limited";
  }

  if (
    state.temperatureC > 120
  ) {
    status = "Thermal warning";
    warning =
      "The winding temperature is above the recommended operating range.";
  }

  if (
    Math.abs(
      state.armatureCurrentA,
    ) >
    RATED_ARMATURE_CURRENT * 2.2
  ) {
    warning =
      "Armature current is high. Increase starter resistance or reduce load.";
  }

  return {
    fieldCurrentA:
      state.fieldCurrentA,

    armatureCurrentA:
      state.armatureCurrentA,

    fieldFluxPU,

    armatureMmfPU:
      updatedCommutation
        .armatureMmfPU,

    armatureMmfAngleRad:
      updatedCommutation
        .armatureMmfAngleRad,

    backEmfV,
    armatureResistiveDropV,
    starterDropV,
    inductiveDropV,

    electromagneticTorqueNm,
    loadTorqueNm,
    frictionTorqueNm,

    speedRpm,
    rotorAngleRad:
      state.rotorAngleRad,

    electricalInputPowerW,
    mechanicalOutputPowerW,
    copperLossW,
    rotationalLossW,
    efficiencyPercent,

    temperatureC:
      state.temperatureC,

    positiveSegment:
      updatedCommutation
        .positiveSegment,

    negativeSegment:
      updatedCommutation
        .negativeSegment,

    commutatingCoils:
      updatedCommutation
        .commutatingCoils,

    coilCurrents:
      updatedCommutation
        .coilCurrents,

    slotCurrents:
      updatedCommutation
        .slotCurrents,

    currentLimited,
    armatureContactorClosed,
    fieldLossDetected,

    torqueDirection:
      electromagneticTorqueNm >= 0
        ? 1
        : -1,

    status,
    warning,
  };
}

class SceneBuilder {
  readonly faces: Face3D[] = [];
  readonly lines: Line3D[] = [];

  addFace(
    points: Vec3[],
    fill: string,
    stroke?: string,
    alpha = 1,
  ): void {
    this.faces.push({
      points,
      fill,
      stroke,
      alpha,
    });
  }

  addLine(
    points: Vec3[],
    color: string,
    width: number,
    alpha = 1,
    dash: number[] = [],
  ): void {
    this.lines.push({
      points,
      color,
      width,
      alpha,
      dash,
    });
  }

  addBox(
    center: Vec3,
    size: Vec3,
    color: string,
    rotationX = 0,
  ): void {
    const halfX = size[0] / 2;
    const halfY = size[1] / 2;
    const halfZ = size[2] / 2;

    const localPoints: Vec3[] = [
      [-halfX, -halfY, -halfZ],
      [halfX, -halfY, -halfZ],
      [halfX, halfY, -halfZ],
      [-halfX, halfY, -halfZ],

      [-halfX, -halfY, halfZ],
      [halfX, -halfY, halfZ],
      [halfX, halfY, halfZ],
      [-halfX, halfY, halfZ],
    ];

    const points = localPoints.map(
      (point) =>
        addVec(
          rotateX(
            point,
            rotationX,
          ),
          center,
        ),
    );

    const faces = [
      [0, 1, 2, 3],
      [4, 7, 6, 5],
      [0, 4, 5, 1],
      [3, 2, 6, 7],
      [1, 5, 6, 2],
      [0, 3, 7, 4],
    ];

    faces.forEach((indices) => {
      this.addFace(
        indices.map(
          (index) => points[index],
        ),
        color,
        "#26323a",
      );
    });
  }

  addCylinderX(
    center: Vec3,
    length: number,
    radius: number,
    color: string,
    segments = 28,
    cap = true,
  ): void {
    const startX =
      center[0] - length / 2;

    const endX =
      center[0] + length / 2;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const firstAngle =
        index /
        segments *
        TWO_PI;

      const secondAngle =
        (index + 1) /
        segments *
        TWO_PI;

      this.addFace(
        [
          [
            startX,
            center[1] +
              Math.cos(firstAngle) *
                radius,
            center[2] +
              Math.sin(firstAngle) *
                radius,
          ],
          [
            endX,
            center[1] +
              Math.cos(firstAngle) *
                radius,
            center[2] +
              Math.sin(firstAngle) *
                radius,
          ],
          [
            endX,
            center[1] +
              Math.cos(secondAngle) *
                radius,
            center[2] +
              Math.sin(secondAngle) *
                radius,
          ],
          [
            startX,
            center[1] +
              Math.cos(secondAngle) *
                radius,
            center[2] +
              Math.sin(secondAngle) *
                radius,
          ],
        ],
        color,
        "#26323a",
      );
    }

    if (cap) {
      const startCap: Vec3[] = [];
      const endCap: Vec3[] = [];

      for (
        let index = 0;
        index < segments;
        index += 1
      ) {
        const angle =
          index /
          segments *
          TWO_PI;

        startCap.unshift([
          startX,
          center[1] +
            Math.cos(angle) *
              radius,
          center[2] +
            Math.sin(angle) *
              radius,
        ]);

        endCap.push([
          endX,
          center[1] +
            Math.cos(angle) *
              radius,
          center[2] +
            Math.sin(angle) *
              radius,
        ]);
      }

      this.addFace(
        startCap,
        color,
        "#26323a",
      );

      this.addFace(
        endCap,
        color,
        "#26323a",
      );
    }
  }

  addShellArcX(
    center: Vec3,
    length: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    angleLength: number,
    color: string,
    segments = 32,
    alpha = 1,
  ): void {
    const startX =
      center[0] - length / 2;

    const endX =
      center[0] + length / 2;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const firstAngle =
        startAngle +
        angleLength *
        index /
        segments;

      const secondAngle =
        startAngle +
        angleLength *
        (index + 1) /
        segments;

      const outerStartFirst: Vec3 = [
        startX,
        center[1] +
          Math.cos(firstAngle) *
            outerRadius,
        center[2] +
          Math.sin(firstAngle) *
            outerRadius,
      ];

      const outerEndFirst: Vec3 = [
        endX,
        center[1] +
          Math.cos(firstAngle) *
            outerRadius,
        center[2] +
          Math.sin(firstAngle) *
            outerRadius,
      ];

      const outerEndSecond: Vec3 = [
        endX,
        center[1] +
          Math.cos(secondAngle) *
            outerRadius,
        center[2] +
          Math.sin(secondAngle) *
            outerRadius,
      ];

      const outerStartSecond: Vec3 = [
        startX,
        center[1] +
          Math.cos(secondAngle) *
            outerRadius,
        center[2] +
          Math.sin(secondAngle) *
            outerRadius,
      ];

      const innerStartFirst: Vec3 = [
        startX,
        center[1] +
          Math.cos(firstAngle) *
            innerRadius,
        center[2] +
          Math.sin(firstAngle) *
            innerRadius,
      ];

      const innerEndFirst: Vec3 = [
        endX,
        center[1] +
          Math.cos(firstAngle) *
            innerRadius,
        center[2] +
          Math.sin(firstAngle) *
            innerRadius,
      ];

      const innerEndSecond: Vec3 = [
        endX,
        center[1] +
          Math.cos(secondAngle) *
            innerRadius,
        center[2] +
          Math.sin(secondAngle) *
            innerRadius,
      ];

      const innerStartSecond: Vec3 = [
        startX,
        center[1] +
          Math.cos(secondAngle) *
            innerRadius,
        center[2] +
          Math.sin(secondAngle) *
            innerRadius,
      ];

      this.addFace(
        [
          outerStartFirst,
          outerEndFirst,
          outerEndSecond,
          outerStartSecond,
        ],
        color,
        "#26323a",
        alpha,
      );

      this.addFace(
        [
          innerStartSecond,
          innerEndSecond,
          innerEndFirst,
          innerStartFirst,
        ],
        color,
        "#26323a",
        alpha,
      );

      this.addFace(
        [
          innerStartFirst,
          outerStartFirst,
          outerStartSecond,
          innerStartSecond,
        ],
        color,
        "#26323a",
        alpha,
      );

      this.addFace(
        [
          outerEndFirst,
          innerEndFirst,
          innerEndSecond,
          outerEndSecond,
        ],
        color,
        "#26323a",
        alpha,
      );
    }

    const endAngle =
      startAngle + angleLength;

    const radialFace = (
      angle: number,
    ): Vec3[] => [
      [
        startX,
        center[1] +
          Math.cos(angle) *
            innerRadius,
        center[2] +
          Math.sin(angle) *
            innerRadius,
      ],
      [
        startX,
        center[1] +
          Math.cos(angle) *
            outerRadius,
        center[2] +
          Math.sin(angle) *
            outerRadius,
      ],
      [
        endX,
        center[1] +
          Math.cos(angle) *
            outerRadius,
        center[2] +
          Math.sin(angle) *
            outerRadius,
      ],
      [
        endX,
        center[1] +
          Math.cos(angle) *
            innerRadius,
        center[2] +
          Math.sin(angle) *
            innerRadius,
      ],
    ];

    this.addFace(
      radialFace(startAngle),
      color,
      "#26323a",
      alpha,
    );

    this.addFace(
      radialFace(endAngle).reverse(),
      color,
      "#26323a",
      alpha,
    );
  }

  addRingX(
    x: number,
    radius: number,
    color: string,
    width: number,
    segments = 40,
    alpha = 1,
  ): void {
    const points: Vec3[] = [];

    for (
      let index = 0;
      index <= segments;
      index += 1
    ) {
      const angle =
        index /
        segments *
        TWO_PI;

      points.push([
        x,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
      ]);
    }

    this.addLine(
      points,
      color,
      width,
      alpha,
    );
  }

  build(): ScenePart {
    return {
      faces: this.faces,
      lines: this.lines,
    };
  }
}

function mergeParts(
  ...parts: ScenePart[]
): ScenePart {
  return {
    faces: parts.flatMap(
      (part) => part.faces,
    ),
    lines: parts.flatMap(
      (part) => part.lines,
    ),
  };
}

function buildBasePart(): ScenePart {
  const builder =
    new SceneBuilder();

  builder.addBox(
    [0, -1.7, 0],
    [5.15, 0.34, 1.8],
    COLORS.base,
  );

  builder.addBox(
    [-1.55, -1.99, 0],
    [0.56, 0.72, 1.5],
    COLORS.base,
    -0.15,
  );

  builder.addBox(
    [1.55, -1.99, 0],
    [0.56, 0.72, 1.5],
    COLORS.base,
    0.15,
  );

  builder.addBox(
    [-1.55, -2.21, 0],
    [1.66, 0.34, 2.18],
    COLORS.baseDark,
  );

  builder.addBox(
    [1.55, -2.21, 0],
    [1.66, 0.34, 2.18],
    COLORS.baseDark,
  );

  const terminalX = -0.15;

  builder.addBox(
    [terminalX, 1.55, 0],
    [1.9, 0.16, 1.04],
    COLORS.housingDark,
  );

  builder.addBox(
    [terminalX, 1.88, 0],
    [1.92, 0.64, 1.04],
    COLORS.housing,
  );

  builder.addBox(
    [terminalX, 2.21, 0],
    [2.08, 0.16, 1.16],
    COLORS.housingLight,
  );

  [
    terminalX - 0.55,
    terminalX - 0.18,
    terminalX + 0.18,
    terminalX + 0.55,
  ].forEach((x) => {
    builder.addCylinderX(
      [x, 1.89, 0.16],
      0.32,
      0.065,
      COLORS.bearing,
      12,
    );
  });

  return builder.build();
}

function buildHousingPart(
  cutaway: boolean,
  opacity: number,
): ScenePart {
  const builder =
    new SceneBuilder();

  if (cutaway) {
    builder.addShellArcX(
      [0, 0, 0],
      4.48,
      YOKE_INNER_RADIUS,
      YOKE_OUTER_RADIUS,
      PI * 0.58,
      PI * 1.52,
      COLORS.yoke,
      46,
      opacity,
    );

    builder.addShellArcX(
      [0, 0, 0],
      4.58,
      YOKE_OUTER_RADIUS,
      1.58,
      PI * 0.58,
      PI * 1.52,
      COLORS.housing,
      46,
      opacity,
    );
  } else {
    builder.addShellArcX(
      [0, 0, 0],
      4.48,
      YOKE_INNER_RADIUS,
      YOKE_OUTER_RADIUS,
      0,
      TWO_PI,
      COLORS.yoke,
      52,
      opacity,
    );

    builder.addShellArcX(
      [0, 0, 0],
      4.58,
      YOKE_OUTER_RADIUS,
      1.58,
      0,
      TWO_PI,
      COLORS.housing,
      52,
      opacity,
    );
  }

  for (
    let index = 0;
    index < 16;
    index += 1
  ) {
    const angle =
      index /
      16 *
      TWO_PI;

    const visible =
      !cutaway ||
      normalizeAngle(
        angle - PI * 0.58,
      ) <=
        PI * 1.52;

    if (!visible) {
      continue;
    }

    builder.addBox(
      [
        0,
        Math.cos(angle) * 1.66,
        Math.sin(angle) * 1.66,
      ],
      [4.4, 0.11, 0.19],
      COLORS.housingLight,
      angle,
    );
  }

  (
    [
      [-2.43, -1],
      [2.43, 1],
    ] as Array<
      [number, Direction]
    >
  ).forEach(
    ([x, direction]) => {
      const startAngle = cutaway
        ? PI * 0.58
        : 0;

      const arcLength = cutaway
        ? PI * 1.52
        : TWO_PI;

      builder.addShellArcX(
        [x, 0, 0],
        0.3,
        0.78,
        1.53,
        startAngle,
        arcLength,
        COLORS.housing,
        38,
        opacity,
      );

      builder.addShellArcX(
        [
          x + direction * 0.24,
          0,
          0,
        ],
        0.2,
        0.62,
        1.23,
        startAngle,
        arcLength,
        COLORS.housingLight,
        34,
        opacity,
      );
    },
  );

  return builder.build();
}

function buildPolePart(): ScenePart {
  const builder =
    new SceneBuilder();

  builder.addBox(
    [0, 1.08, 0],
    [2.75, 0.35, 0.7],
    COLORS.poleCore,
  );

  builder.addBox(
    [0, -1.08, 0],
    [2.75, 0.35, 0.7],
    COLORS.poleCore,
  );

  builder.addBox(
    [0, 1.3, 0],
    [2.92, 0.18, 0.86],
    COLORS.yoke,
  );

  builder.addBox(
    [0, -1.3, 0],
    [2.92, 0.18, 0.86],
    COLORS.yoke,
  );

  builder.addShellArcX(
    [0, 0, 0],
    2.98,
    POLE_SHOE_INNER_RADIUS,
    POLE_SHOE_OUTER_RADIUS,
    -POLE_ARC_LENGTH / 2,
    POLE_ARC_LENGTH,
    COLORS.poleShoe,
    28,
  );

  builder.addShellArcX(
    [0, 0, 0],
    2.98,
    POLE_SHOE_INNER_RADIUS,
    POLE_SHOE_OUTER_RADIUS,
    PI - POLE_ARC_LENGTH / 2,
    POLE_ARC_LENGTH,
    COLORS.poleShoe,
    28,
  );

  return builder.build();
}

function addRectangularLoop(
  builder: SceneBuilder,
  y: number,
  halfLengthX: number,
  halfWidthZ: number,
  color: string,
  width: number,
): void {
  builder.addLine(
    [
      [-halfLengthX, y, -halfWidthZ],
      [halfLengthX, y, -halfWidthZ],
      [halfLengthX, y, halfWidthZ],
      [-halfLengthX, y, halfWidthZ],
      [-halfLengthX, y, -halfWidthZ],
    ],
    color,
    width,
  );
}

function buildFieldCoilPart(): ScenePart {
  const builder =
    new SceneBuilder();

  for (
    let index = 0;
    index < 12;
    index += 1
  ) {
    const ratio = index / 11;

    const offset =
      -0.11 + ratio * 0.22;

    const topColor =
      index % 2 === 0
        ? COLORS.fieldCoilLight
        : COLORS.fieldCoil;

    const bottomColor =
      index % 2 === 0
        ? COLORS.fieldCoil
        : COLORS.fieldCoilDark;

    addRectangularLoop(
      builder,
      1.08 + offset,
      1.28,
      0.44,
      topColor,
      3.6,
    );

    addRectangularLoop(
      builder,
      -1.08 - offset,
      1.28,
      0.44,
      bottomColor,
      3.6,
    );
  }

  builder.addLine(
    [
      [-1.28, 1.12, 0.45],
      [-1.38, 1.52, 0.45],
      [-0.68, 1.58, 0.3],
    ],
    COLORS.fieldCoil,
    4,
  );

  builder.addLine(
    [
      [1.28, 1.12, 0.45],
      [1.16, 1.53, 0.45],
      [0.02, 1.58, 0.3],
    ],
    COLORS.fieldCoil,
    4,
  );

  builder.addLine(
    [
      [-1.28, -1.12, 0.45],
      [-0.95, 1.53, -0.25],
    ],
    COLORS.fieldCoilDark,
    4,
  );

  builder.addLine(
    [
      [1.28, -1.12, 0.45],
      [0.55, 1.53, -0.25],
    ],
    COLORS.fieldCoilDark,
    4,
  );

  return builder.build();
}

function buildArmatureCorePart(): ScenePart {
  const builder =
    new SceneBuilder();

  builder.addCylinderX(
    [0, 0, 0],
    ARMATURE_LENGTH,
    ARMATURE_BACK_IRON_RADIUS,
    COLORS.armatureBackIron,
    42,
  );

  for (
    let toothIndex = 0;
    toothIndex < SLOT_COUNT;
    toothIndex += 1
  ) {
    const angle =
      (toothIndex + 0.5) *
      SLOT_STEP;

    const radius =
      (
        ARMATURE_BACK_IRON_RADIUS +
        ARMATURE_OUTER_RADIUS
      ) / 2;

    builder.addBox(
      radialPoint(
        0,
        radius,
        angle,
      ),
      [
        ARMATURE_LENGTH - 0.05,
        ARMATURE_OUTER_RADIUS -
          ARMATURE_BACK_IRON_RADIUS,
        0.13,
      ],
      toothIndex % 2 === 0
        ? COLORS.armatureTooth
        : COLORS.armatureToothDark,
      angle,
    );
  }

  for (
    let slotIndex = 0;
    slotIndex < SLOT_COUNT;
    slotIndex += 1
  ) {
    const angle =
      slotAngle(slotIndex);

    builder.addLine(
      [
        radialPoint(
          -ARMATURE_HALF_LENGTH +
            0.04,
          0.64,
          angle,
        ),
        radialPoint(
          ARMATURE_HALF_LENGTH -
            0.04,
          0.64,
          angle,
        ),
      ],
      COLORS.armatureSlot,
      4,
    );
  }

  for (
    let index = 0;
    index < 30;
    index += 1
  ) {
    const x =
      -ARMATURE_HALF_LENGTH +
      0.06 +
      index /
      29 *
      (ARMATURE_LENGTH - 0.12);

    builder.addRingX(
      x,
      ARMATURE_BACK_IRON_RADIUS -
        0.005,
      index % 2 === 0
        ? COLORS.armatureToothDark
        : "#59636a",
      1,
      34,
      0.75,
    );
  }

  builder.addCylinderX(
    [-0.05, 0, 0],
    5.38,
    0.145,
    COLORS.shaft,
    30,
  );

  builder.addCylinderX(
    [-3.53, 0, 0],
    1.98,
    0.126,
    COLORS.shaft,
    26,
  );

  builder.addCylinderX(
    [3.03, 0, 0],
    1.14,
    0.105,
    COLORS.shaft,
    26,
  );

  builder.addBox(
    [-3.76, 0.12, 0],
    [0.84, 0.04, 0.1],
    "#aeb6bb",
  );

  return builder.build();
}

function buildArmatureWindingPart(): ScenePart {
  const builder =
    new SceneBuilder();

  for (
    let coilIndex = 0;
    coilIndex < COIL_COUNT;
    coilIndex += 1
  ) {
    const firstSlot = coilIndex;

    const secondSlot =
      positiveModulo(
        coilIndex +
          COIL_PITCH_SLOTS,
        SLOT_COUNT,
      );

    const firstAngle =
      slotAngle(firstSlot);

    const secondAngleUnwrapped =
      firstAngle +
      COIL_PITCH_SLOTS *
        SLOT_STEP;

    const secondAngle =
      normalizeAngle(
        secondAngleUnwrapped,
      );

    const firstRadius =
      ARMATURE_CONDUCTOR_RADIUS -
      0.018;

    const secondRadius =
      ARMATURE_CONDUCTOR_RADIUS +
      0.018;

    const color =
      coilIndex % 2 === 0
        ? COLORS.copperLight
        : COLORS.copper;

    builder.addLine(
      [
        radialPoint(
          -ARMATURE_HALF_LENGTH +
            0.06,
          firstRadius,
          firstAngle,
        ),
        radialPoint(
          ARMATURE_HALF_LENGTH -
            0.06,
          firstRadius,
          firstAngle,
        ),
      ],
      color,
      3.1,
    );

    builder.addLine(
      [
        radialPoint(
          -ARMATURE_HALF_LENGTH +
            0.06,
          secondRadius,
          secondAngle,
        ),
        radialPoint(
          ARMATURE_HALF_LENGTH -
            0.06,
          secondRadius,
          secondAngle,
        ),
      ],
      color,
      3.1,
    );

    (
      [-1, 1] as Direction[]
    ).forEach((endDirection) => {
      const coreX =
        endDirection *
        (ARMATURE_HALF_LENGTH -
          0.06);

      const outerX =
        endDirection *
        (ARMATURE_HALF_LENGTH +
          0.17);

      const endRadius =
        0.72 +
        coilIndex % 3 *
          0.012;

      const points: Vec3[] = [
        radialPoint(
          coreX,
          firstRadius,
          firstAngle,
        ),
        radialPoint(
          outerX,
          endRadius,
          firstAngle,
        ),
      ];

      const steps = 16;

      for (
        let step = 1;
        step < steps;
        step += 1
      ) {
        const ratio =
          step / steps;

        points.push(
          radialPoint(
            outerX +
              Math.sin(ratio * PI) *
                0.045 *
                endDirection,
            endRadius,
            firstAngle +
              (
                secondAngleUnwrapped -
                firstAngle
              ) *
                ratio,
          ),
        );
      }

      points.push(
        radialPoint(
          outerX,
          endRadius,
          secondAngle,
        ),
        radialPoint(
          coreX,
          secondRadius,
          secondAngle,
        ),
      );

      builder.addLine(
        points,
        color,
        3.1,
      );
    });

    const firstSegmentAngle =
      segmentAngle(coilIndex);

    const secondSegmentAngle =
      segmentAngle(
        coilIndex + 1,
      );

    builder.addLine(
      [
        radialPoint(
          -ARMATURE_HALF_LENGTH +
            0.06,
          firstRadius,
          firstAngle,
        ),
        radialPoint(
          -ARMATURE_HALF_LENGTH -
            0.15,
          0.72,
          firstAngle,
        ),
        radialPoint(
          COMMUTATOR_X + 0.24,
          0.45,
          firstSegmentAngle,
        ),
        radialPoint(
          COMMUTATOR_X + 0.2,
          COMMUTATOR_OUTER_RADIUS -
            0.01,
          firstSegmentAngle,
        ),
      ],
      COLORS.copperDark,
      2,
    );

    builder.addLine(
      [
        radialPoint(
          -ARMATURE_HALF_LENGTH +
            0.06,
          secondRadius,
          secondAngle,
        ),
        radialPoint(
          -ARMATURE_HALF_LENGTH -
            0.16,
          0.73,
          secondAngle,
        ),
        radialPoint(
          COMMUTATOR_X + 0.24,
          0.45,
          secondSegmentAngle,
        ),
        radialPoint(
          COMMUTATOR_X + 0.2,
          COMMUTATOR_OUTER_RADIUS -
            0.01,
          secondSegmentAngle,
        ),
      ],
      COLORS.copperDark,
      2,
    );
  }

  return builder.build();
}

function buildCommutatorPart(): ScenePart {
  const builder =
    new SceneBuilder();

  builder.addCylinderX(
    [COMMUTATOR_X, 0, 0],
    COMMUTATOR_LENGTH,
    COMMUTATOR_OUTER_RADIUS -
      0.055,
    COLORS.commutatorMica,
    36,
  );

  const gap =
    SEGMENT_STEP * 0.09;

  for (
    let segmentIndex = 0;
    segmentIndex <
    COMMUTATOR_SEGMENTS;
    segmentIndex += 1
  ) {
    builder.addShellArcX(
      [COMMUTATOR_X, 0, 0],
      COMMUTATOR_LENGTH,
      COMMUTATOR_OUTER_RADIUS -
        0.05,
      COMMUTATOR_OUTER_RADIUS,
      segmentIndex *
        SEGMENT_STEP +
        gap / 2,
      SEGMENT_STEP - gap,
      segmentIndex % 2 === 0
        ? COLORS.commutatorCopper
        : COLORS.commutatorCopperAlt,
      5,
    );
  }

  builder.addRingX(
    COMMUTATOR_X -
      COMMUTATOR_LENGTH / 2,
    COMMUTATOR_OUTER_RADIUS,
    COLORS.commutatorMica,
    3,
    36,
  );

  builder.addRingX(
    COMMUTATOR_X +
      COMMUTATOR_LENGTH / 2,
    COMMUTATOR_OUTER_RADIUS,
    COLORS.commutatorMica,
    3,
    36,
  );

  return builder.build();
}

function buildCommutatorHighlightPart(
  color: string,
): ScenePart {
  const builder =
    new SceneBuilder();

  const gap =
    SEGMENT_STEP * 0.13;

  builder.addShellArcX(
    [COMMUTATOR_X, 0, 0],
    COMMUTATOR_LENGTH + 0.03,
    COMMUTATOR_OUTER_RADIUS +
      0.006,
    COMMUTATOR_OUTER_RADIUS +
      0.035,
    gap / 2,
    SEGMENT_STEP - gap,
    color,
    6,
    0.9,
  );

  return builder.build();
}

function buildBrushPart(
  positiveAtFront: boolean,
): ScenePart {
  const builder =
    new SceneBuilder();

  const frontColor =
    positiveAtFront
      ? COLORS.positive
      : COLORS.negative;

  const rearColor =
    positiveAtFront
      ? COLORS.negative
      : COLORS.positive;

  builder.addBox(
    [COMMUTATOR_X, 0, 0.445],
    [0.38, 0.25, 0.19],
    COLORS.brush,
  );

  builder.addBox(
    [COMMUTATOR_X, 0, -0.445],
    [0.38, 0.25, 0.19],
    COLORS.brush,
  );

  builder.addBox(
    [COMMUTATOR_X, 0, 0.63],
    [0.5, 0.35, 0.3],
    COLORS.brushHolder,
  );

  builder.addBox(
    [COMMUTATOR_X, 0, -0.63],
    [0.5, 0.35, 0.3],
    COLORS.brushHolder,
  );

  builder.addLine(
    [
      [COMMUTATOR_X, 0, 0.71],
      [COMMUTATOR_X - 0.08, 0.72, 0.71],
      [-0.58, 1.58, 0.42],
    ],
    frontColor,
    5,
  );

  builder.addLine(
    [
      [COMMUTATOR_X, 0, -0.71],
      [COMMUTATOR_X - 0.08, 0.72, -0.71],
      [0.15, 1.58, -0.42],
    ],
    rearColor,
    5,
  );

  return builder.build();
}

function buildBearingPart(): ScenePart {
  const builder =
    new SceneBuilder();

  [-2.2, 2.2].forEach((x) => {
    builder.addCylinderX(
      [x, 0, 0],
      0.36,
      0.56,
      COLORS.housingDark,
      28,
    );

    builder.addCylinderX(
      [x, 0, 0],
      0.39,
      0.39,
      COLORS.bearingDark,
      28,
    );

    builder.addCylinderX(
      [x, 0, 0],
      0.42,
      0.23,
      COLORS.bearing,
      28,
    );

    builder.addRingX(
      x - 0.19,
      0.4,
      COLORS.bearing,
      2,
      28,
    );

    builder.addRingX(
      x + 0.19,
      0.4,
      COLORS.bearing,
      2,
      28,
    );
  });

  return builder.build();
}

function buildRotorFanPart(): ScenePart {
  const builder =
    new SceneBuilder();

  const fanX = 3.18;

  builder.addCylinderX(
    [fanX, 0, 0],
    0.28,
    0.24,
    COLORS.fan,
    24,
  );

  for (
    let index = 0;
    index < 6;
    index += 1
  ) {
    const angle =
      index / 6 * TWO_PI;

    builder.addBox(
      radialPoint(
        fanX,
        0.49,
        angle,
      ),
      [0.1, 0.57, 0.14],
      COLORS.fan,
      angle + 0.38,
    );
  }

  return builder.build();
}

function buildFanGuardPart(): ScenePart {
  const builder =
    new SceneBuilder();

  const startX = 2.9;
  const endX = 3.68;
  const radius = 1.02;

  builder.addRingX(
    startX,
    radius,
    COLORS.housingDark,
    3,
    34,
  );

  builder.addRingX(
    endX,
    radius,
    COLORS.housingDark,
    3,
    34,
  );

  [3.1, 3.31, 3.52].forEach(
    (x) => {
      builder.addRingX(
        x,
        radius,
        COLORS.housingDark,
        1.8,
        34,
      );
    },
  );

  for (
    let index = 0;
    index < 22;
    index += 1
  ) {
    const angle =
      index / 22 * TWO_PI;

    builder.addLine(
      [
        radialPoint(
          startX,
          radius,
          angle,
        ),
        radialPoint(
          endX,
          radius,
          angle,
        ),
      ],
      COLORS.housingDark,
      1.8,
    );
  }

  return builder.build();
}

function buildMainFieldOverlay(
  fluxPU: number,
): ScenePart {
  const builder =
    new SceneBuilder();

  const alpha = clamp(
    0.35 + fluxPU * 0.5,
    0.35,
    0.9,
  );

  builder.addLine(
    [
      [0, 0.73, 0],
      [0, -0.73, 0],
    ],
    COLORS.mainField,
    6,
    alpha,
  );

  builder.addLine(
    [
      [0, -0.73, 0],
      [0, -0.53, 0.11],
    ],
    COLORS.mainField,
    6,
    alpha,
  );

  builder.addLine(
    [
      [0, -0.73, 0],
      [0, -0.53, -0.11],
    ],
    COLORS.mainField,
    6,
    alpha,
  );

  return builder.build();
}

function buildFluxCircuitOverlay(
  fluxPU: number,
): {
  rear: ScenePart;
  front: ScenePart;
} {
  const rearBuilder =
    new SceneBuilder();

  const frontBuilder =
    new SceneBuilder();

  const opacity = clamp(
    0.25 + fluxPU * 0.4,
    0.25,
    0.72,
  );

  const addCircuit = (
    builder: SceneBuilder,
    x: number,
    side: Direction,
    color: string,
    width: number,
  ): void => {
    builder.addLine(
      [
        [x, 0.92, 0],
        [x, 0.69, side * 0.15],
        [x, 0.36, side * 0.28],
        [x, 0, side * 0.34],
        [x, -0.36, side * 0.28],
        [x, -0.69, side * 0.15],
        [x, -0.92, 0],
        [x, -1.24, side * 0.4],
        [x, -0.55, side * 1.35],
        [x, 0.55, side * 1.35],
        [x, 1.24, side * 0.4],
        [x, 0.92, 0],
      ],
      color,
      width,
      opacity,
    );
  };

  [-0.55, 0, 0.55].forEach(
    (x, index) => {
      addCircuit(
        rearBuilder,
        x,
        -1,
        index === 1
          ? COLORS.mainField
          : COLORS.mainFieldDark,
        index === 1 ? 3.2 : 2.1,
      );

      addCircuit(
        frontBuilder,
        x,
        1,
        index === 1
          ? COLORS.mainField
          : COLORS.mainFieldDark,
        index === 1 ? 3.2 : 2.1,
      );
    },
  );

  return {
    rear: rearBuilder.build(),
    front: frontBuilder.build(),
  };
}

function buildArmatureFieldOverlay(
  angle: number,
  magnitude: number,
): ScenePart {
  const builder =
    new SceneBuilder();

  const radius =
    0.38 +
    clamp(magnitude, 0, 1.4) *
      0.26;

  const firstPoint: Vec3 = [
    0,
    -Math.cos(angle) * radius,
    -Math.sin(angle) * radius,
  ];

  const secondPoint: Vec3 = [
    0,
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
  ];

  builder.addLine(
    [firstPoint, secondPoint],
    COLORS.armatureField,
    5,
    0.9,
  );

  const headAngleA =
    angle + PI - 0.22;

  const headAngleB =
    angle + PI + 0.22;

  builder.addLine(
    [
      secondPoint,
      [
        0,
        Math.cos(headAngleA) *
          (radius - 0.15),
        Math.sin(headAngleA) *
          (radius - 0.15),
      ],
    ],
    COLORS.armatureField,
    5,
    0.9,
  );

  builder.addLine(
    [
      secondPoint,
      [
        0,
        Math.cos(headAngleB) *
          (radius - 0.15),
        Math.sin(headAngleB) *
          (radius - 0.15),
      ],
    ],
    COLORS.armatureField,
    5,
    0.9,
  );

  return builder.build();
}

function buildCurrentArrowOverlay(
  slotCurrents: number[],
): ScenePart {
  const builder =
    new SceneBuilder();

  const maximum = Math.max(
    ...slotCurrents.map(
      (value) => Math.abs(value),
    ),
    0.001,
  );

  slotCurrents.forEach(
    (current, slotIndex) => {
      const magnitude =
        Math.abs(current) /
        maximum;

      if (magnitude < 0.08) {
        return;
      }

      const angle =
        slotAngle(slotIndex);

      const radius = 0.7;

      const startX =
        current >= 0
          ? -0.34
          : 0.34;

      const endX =
        current >= 0
          ? 0.34
          : -0.34;

      const color =
        current >= 0
          ? COLORS.currentPositive
          : COLORS.currentNegative;

      const start = radialPoint(
        startX,
        radius,
        angle,
      );

      const end = radialPoint(
        endX,
        radius,
        angle,
      );

      builder.addLine(
        [start, end],
        color,
        3.2 +
          magnitude * 1.2,
        0.9,
      );

      const headX =
        current >= 0
          ? endX - 0.12
          : endX + 0.12;

      const tangentY =
        -Math.sin(angle) * 0.07;

      const tangentZ =
        Math.cos(angle) * 0.07;

      builder.addLine(
        [
          end,
          [
            headX,
            end[1] + tangentY,
            end[2] + tangentZ,
          ],
        ],
        color,
        3,
        0.9,
      );

      builder.addLine(
        [
          end,
          [
            headX,
            end[1] - tangentY,
            end[2] - tangentZ,
          ],
        ],
        color,
        3,
        0.9,
      );
    },
  );

  return builder.build();
}

function buildTorqueOverlay(
  direction: Direction,
  torquePU: number,
): ScenePart {
  const builder =
    new SceneBuilder();

  const radius =
    0.78 +
    clamp(torquePU, 0, 1.3) *
      0.11;

  const startAngle =
    direction === 1
      ? -PI * 0.2
      : PI * 0.2;

  const length =
    direction === 1
      ? PI * 1.35
      : -PI * 1.35;

  const points: Vec3[] = [];

  for (
    let index = 0;
    index <= 40;
    index += 1
  ) {
    const angle =
      startAngle +
      length *
      index /
      40;

    points.push([
      0,
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
    ]);
  }

  builder.addLine(
    points,
    COLORS.torque,
    4.5,
    0.9,
    [8, 5],
  );

  const finalAngle =
    startAngle + length;

  const tip = radialPoint(
    0,
    radius,
    finalAngle,
  );

  const tangent =
    finalAngle +
    (
      direction === 1
        ? PI / 2
        : -PI / 2
    );

  builder.addLine(
    [
      tip,
      [
        0,
        tip[1] -
          Math.cos(tangent - 0.55) *
            0.18,
        tip[2] -
          Math.sin(tangent - 0.55) *
            0.18,
      ],
    ],
    COLORS.torque,
    5,
    0.9,
  );

  builder.addLine(
    [
      tip,
      [
        0,
        tip[1] -
          Math.cos(tangent + 0.55) *
            0.18,
        tip[2] -
          Math.sin(tangent + 0.55) *
            0.18,
      ],
    ],
    COLORS.torque,
    5,
    0.9,
  );

  return builder.build();
}

function transformFaces(
  instances: PartInstance[],
  yaw: number,
  pitch: number,
  width: number,
  height: number,
  cameraDistance: number,
): TransformedFace[] {
  const transformedFaces: TransformedFace[] =
    [];

  instances.forEach((instance) => {
    instance.part.faces.forEach(
      (face) => {
        const transformed =
          face.points.map((point) =>
            transformPoint(
              point,
              instance.localRotationX,
              yaw,
              pitch,
            ),
          );

        const projected =
          transformed.map((point) =>
            projectPoint(
              point,
              width,
              height,
              cameraDistance,
            ),
          );

        const visible =
          projected.some(
            (point) => point.visible,
          );

        if (!visible) {
          return;
        }

        const depth =
          transformed.reduce(
            (sum, point) =>
              sum + point[2],
            0,
          ) /
          transformed.length;

        transformedFaces.push({
          face,
          transformed,
          projected,
          depth,
        });
      },
    );
  });

  return transformedFaces.sort(
    (first, second) =>
      first.depth - second.depth,
  );
}

function transformLines(
  instances: PartInstance[],
  yaw: number,
  pitch: number,
  width: number,
  height: number,
  cameraDistance: number,
): TransformedLineSegment[] {
  const segments: TransformedLineSegment[] =
    [];

  instances.forEach((instance) => {
    instance.part.lines.forEach(
      (line) => {
        for (
          let index = 0;
          index <
          line.points.length - 1;
          index += 1
        ) {
          const firstWorld =
            transformPoint(
              line.points[index],
              instance.localRotationX,
              yaw,
              pitch,
            );

          const secondWorld =
            transformPoint(
              line.points[index + 1],
              instance.localRotationX,
              yaw,
              pitch,
            );

          const firstProjected =
            projectPoint(
              firstWorld,
              width,
              height,
              cameraDistance,
            );

          const secondProjected =
            projectPoint(
              secondWorld,
              width,
              height,
              cameraDistance,
            );

          if (
            !firstProjected.visible &&
            !secondProjected.visible
          ) {
            continue;
          }

          segments.push({
            start: firstProjected,
            end: secondProjected,
            color: line.color,
            width: line.width,
            alpha: line.alpha ?? 1,
            dash: line.dash ?? [],
            depth:
              (firstWorld[2] +
                secondWorld[2]) /
              2,
          });
        }
      },
    );
  });

  return segments.sort(
    (first, second) =>
      first.depth - second.depth,
  );
}

function drawFace(
  context: CanvasRenderingContext2D,
  transformedFace: TransformedFace,
): void {
  const {
    face,
    transformed,
    projected,
  } = transformedFace;

  if (projected.length < 3) {
    return;
  }

  const edgeA = subtractVec(
    transformed[1],
    transformed[0],
  );

  const edgeB = subtractVec(
    transformed[2],
    transformed[0],
  );

  const normal = normalizeVec(
    crossVec(edgeA, edgeB),
  );

  const light = normalizeVec([
    -0.35,
    0.75,
    1,
  ]);

  const diffuse = Math.abs(
    normal[0] * light[0] +
      normal[1] * light[1] +
      normal[2] * light[2],
  );

  const brightness =
    0.58 + diffuse * 0.48;

  context.beginPath();

  context.moveTo(
    projected[0].x,
    projected[0].y,
  );

  for (
    let index = 1;
    index < projected.length;
    index += 1
  ) {
    context.lineTo(
      projected[index].x,
      projected[index].y,
    );
  }

  context.closePath();

  context.globalAlpha =
    face.alpha ?? 1;

  context.fillStyle = shadeColor(
    face.fill,
    brightness,
  );

  context.fill();

  if (face.stroke) {
    context.strokeStyle =
      face.stroke;

    context.lineWidth = 0.7;
    context.globalAlpha =
      Math.min(
        face.alpha ?? 1,
        0.5,
      );

    context.stroke();
  }

  context.globalAlpha = 1;
}

function drawLineSegment(
  context: CanvasRenderingContext2D,
  segment: TransformedLineSegment,
): void {
  context.beginPath();

  context.moveTo(
    segment.start.x,
    segment.start.y,
  );

  context.lineTo(
    segment.end.x,
    segment.end.y,
  );

  context.strokeStyle =
    segment.color;

  context.lineWidth =
    segment.width;

  context.globalAlpha =
    segment.alpha;

  context.lineCap = "round";
  context.lineJoin = "round";

  context.setLineDash(
    segment.dash,
  );

  context.stroke();

  context.setLineDash([]);
  context.globalAlpha = 1;
}

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  yaw: number,
  pitch: number,
  cameraDistance: number,
  solidInstances: PartInstance[],
  rearOverlayInstances: PartInstance[],
  frontOverlayInstances: PartInstance[],
): void {
  const gradient =
    context.createRadialGradient(
      width * 0.52,
      height * 0.34,
      20,
      width * 0.52,
      height * 0.34,
      Math.max(width, height),
    );

  gradient.addColorStop(
    0,
    "#ffffff",
  );

  gradient.addColorStop(
    0.58,
    "#edf3f6",
  );

  gradient.addColorStop(
    1,
    "#dbe3e8",
  );

  context.fillStyle = gradient;

  context.fillRect(
    0,
    0,
    width,
    height,
  );

  const rearLines =
    transformLines(
      rearOverlayInstances,
      yaw,
      pitch,
      width,
      height,
      cameraDistance,
    );

  rearLines.forEach((line) =>
    drawLineSegment(
      context,
      line,
    ),
  );

  const faces =
    transformFaces(
      solidInstances,
      yaw,
      pitch,
      width,
      height,
      cameraDistance,
    );

  faces.forEach((face) =>
    drawFace(
      context,
      face,
    ),
  );

  const componentLines =
    transformLines(
      solidInstances,
      yaw,
      pitch,
      width,
      height,
      cameraDistance,
    );

  const farComponentLines =
    componentLines.filter(
      (line) => line.depth < 0,
    );

  const nearComponentLines =
    componentLines.filter(
      (line) => line.depth >= 0,
    );

  farComponentLines.forEach(
    (line) =>
      drawLineSegment(
        context,
        line,
      ),
  );

  nearComponentLines.forEach(
    (line) =>
      drawLineSegment(
        context,
        line,
      ),
  );

  const frontLines =
    transformLines(
      frontOverlayInstances,
      yaw,
      pitch,
      width,
      height,
      cameraDistance,
    );

  frontLines.forEach((line) =>
    drawLineSegment(
      context,
      line,
    ),
  );
}

function ToggleRow({
  label,
  checked,
  color = "#1d4ed8",
  onChange,
}: {
  label: string;
  checked: boolean;
  color?: string;
  onChange: (
    checked: boolean,
  ) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        gap: 10,
        color: "#334155",
        fontSize: 12,
        fontWeight: 720,
      }}
    >
      <span>{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        style={{
          width: 17,
          height: 17,
          accentColor: color,
        }}
      />
    </label>
  );
}

function ControlSlider({
  label,
  value,
  minimum,
  maximum,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  unit: string;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 6,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 8,
          color: "#334155",
          fontSize: 12,
          fontWeight: 720,
        }}
      >
        <span>{label}</span>

        <span
          style={{
            fontVariantNumeric:
              "tabular-nums",
          }}
        >
          {value.toFixed(
            step < 1 ? 2 : 0,
          )}{" "}
          {unit}
        </span>
      </span>

      <input
        type="range"
        min={minimum}
        max={maximum}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        style={{
          width: "100%",
          accentColor: "#1d4ed8",
        }}
      />
    </label>
  );
}

function TelemetryItem({
  label,
  value,
  alert = false,
  accent,
}: {
  label: string;
  value: string;
  alert?: boolean;
  accent?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 2,
        border: alert
          ? "1px solid #fca5a5"
          : "1px solid #e2e8f0",
        borderRadius: 8,
        background: alert
          ? "#fff1f2"
          : "#f8fafc",
        padding: "8px 9px",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: 9,
          fontWeight: 820,
          letterSpacing:
            "0.04em",
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: alert
            ? COLORS.warning
            : accent ??
              "#0f172a",
          fontSize: 13,
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function MeterBar({
  label,
  value,
  maximum,
  unit,
  color,
}: {
  label: string;
  value: number;
  maximum: number;
  unit: string;
  color: string;
}) {
  const ratio = clamp(
    Math.abs(value) /
      Math.max(maximum, 0.001),
    0,
    1,
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "110px 1fr 78px",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          color: "#475569",
          fontSize: 10,
          fontWeight: 720,
        }}
      >
        {label}
      </span>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition:
              "width 100ms linear",
          }}
        />
      </div>

      <strong
        style={{
          color: "#0f172a",
          fontSize: 11,
          textAlign: "right",
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        {value.toFixed(1)} {unit}
      </strong>
    </div>
  );
}

function CommutationPanel({
  telemetry,
  direction,
  idPrefix,
}: {
  telemetry: MotorTelemetry;
  direction: Direction;
  idPrefix: string;
}) {
  const size = 330;
  const center = size / 2;

  const armatureRadius = 86;
  const slotRadius = 76;
  const commutatorRadius = 44;

  const maximumCurrent = Math.max(
    ...telemetry.slotCurrents.map(
      (value) => Math.abs(value),
    ),
    0.001,
  );

  const positiveBrushAngle =
    direction === 1
      ? POSITIVE_BRUSH_AXIS
      : NEGATIVE_BRUSH_AXIS;

  const negativeBrushAngle =
    direction === 1
      ? NEGATIVE_BRUSH_AXIS
      : POSITIVE_BRUSH_AXIS;

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <strong
          style={{
            fontSize: 13,
          }}
        >
          Commutation and slot currents
        </strong>

        <span
          style={{
            color: "#64748b",
            fontSize: 10,
          }}
        >
          physical rotor position
        </span>
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: "block",
          width: "100%",
          maxWidth: 390,
          margin: "0 auto",
        }}
        role="img"
        aria-labelledby={`${idPrefix}-commutation-title`}
      >
        <title
          id={`${idPrefix}-commutation-title`}
        >
          Brushed DC motor armature
          current and commutator contact
          map
        </title>

        <circle
          cx={center}
          cy={center}
          r="138"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        <path
          d={`
            M ${center - 58} ${center - 108}
            Q ${center} ${center - 141}
              ${center + 58} ${center - 108}
          `}
          fill="none"
          stroke={COLORS.positive}
          strokeWidth="18"
          strokeLinecap="round"
        />

        <path
          d={`
            M ${center - 58} ${center + 108}
            Q ${center} ${center + 141}
              ${center + 58} ${center + 108}
          `}
          fill="none"
          stroke={COLORS.negative}
          strokeWidth="18"
          strokeLinecap="round"
        />

        <text
          x={center}
          y={center - 126}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="13"
          fontWeight="900"
        >
          N
        </text>

        <text
          x={center}
          y={center + 133}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="13"
          fontWeight="900"
        >
          S
        </text>

        <circle
          cx={center}
          cy={center}
          r={armatureRadius}
          fill="#a7afb5"
          stroke="#4f5961"
          strokeWidth="2"
        />

        {telemetry.slotCurrents.map(
          (current, slotIndex) => {
            const angle =
              telemetry.rotorAngleRad +
              slotAngle(slotIndex);

            const x =
              center +
              Math.sin(angle) *
                slotRadius;

            const y =
              center -
              Math.cos(angle) *
                slotRadius;

            const magnitude =
              Math.abs(current) /
              maximumCurrent;

            const color =
              Math.abs(current) <
              0.02
                ? COLORS.currentNeutral
                : current > 0
                  ? COLORS.currentPositive
                  : COLORS.currentNegative;

            return (
              <g
                key={`slot-${slotIndex}`}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={7 + magnitude * 2}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {current > 0.02 ? (
                  <circle
                    cx={x}
                    cy={y}
                    r="2.4"
                    fill="#ffffff"
                  />
                ) : null}

                {current < -0.02 ? (
                  <>
                    <line
                      x1={x - 3}
                      y1={y - 3}
                      x2={x + 3}
                      y2={y + 3}
                      stroke="#ffffff"
                      strokeWidth="1.8"
                    />

                    <line
                      x1={x + 3}
                      y1={y - 3}
                      x2={x - 3}
                      y2={y + 3}
                      stroke="#ffffff"
                      strokeWidth="1.8"
                    />
                  </>
                ) : null}
              </g>
            );
          },
        )}

        <circle
          cx={center}
          cy={center}
          r={commutatorRadius}
          fill={COLORS.commutatorMica}
          stroke="#334155"
          strokeWidth="2"
        />

        {Array.from(
          {
            length:
              COMMUTATOR_SEGMENTS,
          },
          (_, segmentIndex) => {
            const startAngle =
              telemetry.rotorAngleRad +
              segmentIndex *
                SEGMENT_STEP;

            const endAngle =
              startAngle +
              SEGMENT_STEP * 0.9;

            const startX =
              center +
              Math.sin(startAngle) *
                commutatorRadius;

            const startY =
              center -
              Math.cos(startAngle) *
                commutatorRadius;

            const endX =
              center +
              Math.sin(endAngle) *
                commutatorRadius;

            const endY =
              center -
              Math.cos(endAngle) *
                commutatorRadius;

            const fill =
              segmentIndex ===
              telemetry.positiveSegment
                ? COLORS.positive
                : segmentIndex ===
                    telemetry.negativeSegment
                  ? COLORS.negative
                  : segmentIndex % 2 === 0
                    ? COLORS.commutatorCopper
                    : COLORS.commutatorCopperAlt;

            return (
              <path
                key={`segment-${segmentIndex}`}
                d={`
                  M ${center} ${center}
                  L ${startX} ${startY}
                  A ${commutatorRadius}
                    ${commutatorRadius}
                    0 0 1
                    ${endX} ${endY}
                  Z
                `}
                fill={fill}
                stroke={
                  COLORS.commutatorMica
                }
                strokeWidth="1.4"
              />
            );
          },
        )}

        {[
          {
            angle:
              positiveBrushAngle,
            color: COLORS.positive,
            label: "+",
          },
          {
            angle:
              negativeBrushAngle,
            color: COLORS.negative,
            label: "−",
          },
        ].map((brush) => {
          const brushRadius = 111;

          const x =
            center +
            Math.sin(brush.angle) *
              brushRadius;

          const y =
            center -
            Math.cos(brush.angle) *
              brushRadius;

          return (
            <g key={brush.label}>
              <rect
                x={x - 15}
                y={y - 11}
                width="30"
                height="22"
                rx="5"
                fill={brush.color}
              />

              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="15"
                fontWeight="900"
              >
                {brush.label}
              </text>
            </g>
          );
        })}

        <line
          x1={center}
          y1={center}
          x2={
            center +
            Math.sin(
              telemetry
                .armatureMmfAngleRad,
            ) *
              105
          }
          y2={
            center -
            Math.cos(
              telemetry
                .armatureMmfAngleRad,
            ) *
              105
          }
          stroke={
            COLORS.armatureField
          }
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 6,
          marginTop: 8,
        }}
      >
        <TelemetryItem
          label="Positive brush"
          value={`S${
            telemetry.positiveSegment + 1
          }`}
          accent={COLORS.positive}
        />

        <TelemetryItem
          label="Negative brush"
          value={`S${
            telemetry.negativeSegment + 1
          }`}
          accent={COLORS.negative}
        />

        <TelemetryItem
          label="Commutating"
          value={
            telemetry.commutatingCoils
              .length > 0
              ? telemetry
                  .commutatingCoils
                  .map(
                    (coil) =>
                      `C${coil + 1}`,
                  )
                  .join(", ")
              : "None"
          }
        />
      </div>

      <div
        style={{
          marginTop: 8,
          borderRadius: 8,
          background: "#f1f5f9",
          padding: 8,
          color: "#475569",
          fontSize: 10,
          lineHeight: 1.45,
        }}
      >
        Red dots show positive axial
        conductor current. Blue crosses
        show current in the opposite
        direction. Brush contact and coil
        reversal are calculated from the
        physical rotor angle.
      </div>
    </div>
  );
}

export default function DcMotor3DSimulation({
  className = "",
}: DcMotor3DSimulationProps) {
  const idPrefix =
    useId().replace(/:/g, "");

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const viewportRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const northLabelRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const southLabelRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const positiveBrushLabelRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const negativeBrushLabelRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const controlsRef =
    useRef<DcMotorControls>({
      ...INITIAL_CONTROLS,
    });

  const stepRequestRef =
    useRef(0);

  const yawRef = useRef(-0.56);
  const pitchRef = useRef(-0.16);
  const zoomRef = useRef(8.8);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
  });

  const [
    controls,
    setControls,
  ] = useState<DcMotorControls>({
    ...INITIAL_CONTROLS,
  });

  const [
    telemetry,
    setTelemetry,
  ] = useState<MotorTelemetry>({
    ...INITIAL_TELEMETRY,
  });

  const [
    preset,
    setPreset,
  ] = useState<LearningPreset>(
    "complete",
  );

  const updateControls = (
    updater: (
      current: DcMotorControls,
    ) => DcMotorControls,
  ): void => {
    setControls((current) => {
      const next = updater(current);

      controlsRef.current = next;

      return next;
    });
  };

  const applyPreset = (
    nextPreset: LearningPreset,
  ): void => {
    setPreset(nextPreset);

    updateControls((current) => {
      if (
        nextPreset ===
        "construction"
      ) {
        return {
          ...current,
          cutaway: true,
          paused: true,

          showBase: true,
          showHousing: true,
          showPoles: true,
          showFieldCoils: true,
          showArmatureCore: true,
          showArmatureWindings: true,
          showCommutator: true,
          showBrushes: true,
          showBearings: true,
          showFanGuard: true,

          showMainField: false,
          showFluxCircuit: false,
          showArmatureField: false,
          showCurrentArrows: false,
          showTorqueArrow: false,
          showLabels: true,
        };
      }

      if (nextPreset === "field") {
        return {
          ...current,
          cutaway: true,
          paused: false,

          showBase: true,
          showHousing: true,
          showPoles: true,
          showFieldCoils: true,
          showArmatureCore: true,
          showArmatureWindings: true,
          showCommutator: true,
          showBrushes: true,

          showMainField: true,
          showFluxCircuit: true,
          showArmatureField: true,
          showCurrentArrows: false,
          showTorqueArrow: true,
          showLabels: true,
        };
      }

      if (
        nextPreset ===
        "commutation"
      ) {
        return {
          ...current,
          cutaway: true,
          paused: true,

          showBase: false,
          showHousing: false,
          showPoles: true,
          showFieldCoils: false,
          showArmatureCore: true,
          showArmatureWindings: true,
          showCommutator: true,
          showBrushes: true,
          showBearings: false,
          showFanGuard: false,

          showMainField: true,
          showFluxCircuit: false,
          showArmatureField: true,
          showCurrentArrows: true,
          showTorqueArrow: true,
          showLabels: true,
        };
      }

      if (nextPreset === "speed") {
        return {
          ...current,
          cutaway: true,
          paused: false,

          showBase: true,
          showHousing: true,
          showPoles: true,
          showFieldCoils: true,
          showArmatureCore: true,
          showArmatureWindings: true,
          showCommutator: true,
          showBrushes: true,

          showMainField: true,
          showFluxCircuit: true,
          showArmatureField: false,
          showCurrentArrows: false,
          showTorqueArrow: true,
          showLabels: true,
        };
      }

      return {
        ...INITIAL_CONTROLS,
      };
    });
  };

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const basePart =
      buildBasePart();

    const housingCutPart =
      buildHousingPart(
        true,
        INITIAL_CONTROLS
          .housingOpacity,
      );

    const housingFullPart =
      buildHousingPart(
        false,
        INITIAL_CONTROLS
          .housingOpacity,
      );

    const polePart =
      buildPolePart();

    const fieldCoilPart =
      buildFieldCoilPart();

    const armatureCorePart =
      buildArmatureCorePart();

    const armatureWindingPart =
      buildArmatureWindingPart();

    const commutatorPart =
      buildCommutatorPart();

    const positiveHighlightPart =
      buildCommutatorHighlightPart(
        COLORS.positive,
      );

    const negativeHighlightPart =
      buildCommutatorHighlightPart(
        COLORS.negative,
      );

    const bearingPart =
      buildBearingPart();

    const rotorFanPart =
      buildRotorFanPart();

    const fanGuardPart =
      buildFanGuardPart();

    const physicalState: MotorPhysicalState =
      {
        fieldCurrentA: 1,
        armatureCurrentA: 0,
        omegaRadPerSec: 0,
        rotorAngleRad: 0,
        temperatureC:
          AMBIENT_TEMPERATURE,
      };

    let animationFrame = 0;
    let previousTime =
      performance.now();

    let previousTelemetryUpdate = 0;
    let disposed = false;

    const resizeCanvas = (): void => {
      const rectangle =
        canvas.getBoundingClientRect();

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      const width = Math.max(
        1,
        Math.floor(
          rectangle.width *
            pixelRatio,
        ),
      );

      const height = Math.max(
        1,
        Math.floor(
          rectangle.height *
            pixelRatio,
        ),
      );

      if (
        canvas.width !== width ||
        canvas.height !== height
      ) {
        canvas.width = width;
        canvas.height = height;
      }

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );
    };

    const updateLabels = (
      width: number,
      height: number,
      controlsSnapshot: DcMotorControls,
    ): void => {
      const projectStaticLabel = (
        point: Vec3,
      ): ProjectedPoint => {
        const transformed =
          transformPoint(
            point,
            0,
            yawRef.current,
            pitchRef.current,
          );

        return projectPoint(
          transformed,
          width,
          height,
          zoomRef.current,
        );
      };

      const north =
        projectStaticLabel(
          [0, 0.94, 0],
        );

      const south =
        projectStaticLabel(
          [0, -0.94, 0],
        );

      const frontBrush =
        projectStaticLabel([
          COMMUTATOR_X,
          0,
          0.48,
        ]);

      const rearBrush =
        projectStaticLabel([
          COMMUTATOR_X,
          0,
          -0.48,
        ]);

      const setPosition = (
        element:
          | HTMLDivElement
          | null,
        point: ProjectedPoint,
        visible: boolean,
      ): void => {
        if (!element) {
          return;
        }

        element.style.display =
          visible && point.visible
            ? "grid"
            : "none";

        element.style.left =
          `${point.x}px`;

        element.style.top =
          `${point.y}px`;
      };

      setPosition(
        northLabelRef.current,
        north,
        controlsSnapshot.cutaway &&
          controlsSnapshot.showLabels &&
          controlsSnapshot.showPoles,
      );

      setPosition(
        southLabelRef.current,
        south,
        controlsSnapshot.cutaway &&
          controlsSnapshot.showLabels &&
          controlsSnapshot.showPoles,
      );

      const positiveBrushPoint =
        controlsSnapshot.direction === 1
          ? frontBrush
          : rearBrush;

      const negativeBrushPoint =
        controlsSnapshot.direction === 1
          ? rearBrush
          : frontBrush;

      setPosition(
        positiveBrushLabelRef.current,
        positiveBrushPoint,
        controlsSnapshot.cutaway &&
          controlsSnapshot.showLabels &&
          controlsSnapshot.showBrushes,
      );

      setPosition(
        negativeBrushLabelRef.current,
        negativeBrushPoint,
        controlsSnapshot.cutaway &&
          controlsSnapshot.showLabels &&
          controlsSnapshot.showBrushes,
      );
    };

    const render = (
      time: number,
    ): void => {
      if (disposed) {
        return;
      }

      resizeCanvas();

      const rectangle =
        canvas.getBoundingClientRect();

      const width = Math.max(
        rectangle.width,
        1,
      );

      const height = Math.max(
        rectangle.height,
        1,
      );

      const elapsedSeconds =
        Math.min(
          (time - previousTime) /
            1000,
          0.05,
        );

      previousTime = time;

      const requestedStep =
        stepRequestRef.current;

      stepRequestRef.current = 0;

      const controlsSnapshot =
        controlsRef.current;

      const currentTelemetry =
        stepMotorModel(
          physicalState,
          controlsSnapshot,
          elapsedSeconds,
          requestedStep,
        );

      const solidInstances: PartInstance[] =
        [];

      if (
        controlsSnapshot.showBase
      ) {
        solidInstances.push({
          part: basePart,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot.showPoles
      ) {
        solidInstances.push({
          part: polePart,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot
          .showFieldCoils
      ) {
        solidInstances.push({
          part: fieldCoilPart,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot
          .showBearings
      ) {
        solidInstances.push({
          part: bearingPart,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot
          .showArmatureCore
      ) {
        solidInstances.push({
          part: armatureCorePart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad,
        });

        solidInstances.push({
          part: rotorFanPart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad,
        });
      }

      if (
        controlsSnapshot
          .showArmatureWindings
      ) {
        solidInstances.push({
          part: armatureWindingPart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad,
        });
      }

      if (
        controlsSnapshot
          .showCommutator
      ) {
        solidInstances.push({
          part: commutatorPart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad,
        });

        solidInstances.push({
          part: positiveHighlightPart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad +
            currentTelemetry
              .positiveSegment *
              SEGMENT_STEP,
        });

        solidInstances.push({
          part: negativeHighlightPart,
          localRotationX:
            currentTelemetry
              .rotorAngleRad +
            currentTelemetry
              .negativeSegment *
              SEGMENT_STEP,
        });
      }

      if (
        controlsSnapshot.showBrushes
      ) {
        solidInstances.push({
          part: buildBrushPart(
            controlsSnapshot.direction ===
              1,
          ),
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot
          .showFanGuard
      ) {
        solidInstances.push({
          part: fanGuardPart,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot
          .showHousing
      ) {
        const housingPart =
          controlsSnapshot.cutaway
            ? housingCutPart
            : housingFullPart;

        solidInstances.push({
          part: {
            faces:
              housingPart.faces.map(
                (face) => ({
                  ...face,
                  alpha:
                    controlsSnapshot
                      .housingOpacity,
                }),
              ),
            lines:
              housingPart.lines,
          },
          localRotationX: 0,
        });
      }

      const rearOverlays: PartInstance[] =
        [];

      const frontOverlays: PartInstance[] =
        [];

      if (
        controlsSnapshot.cutaway &&
        controlsSnapshot
          .showFluxCircuit &&
        currentTelemetry.fieldFluxPU >
          0.02
      ) {
        const fluxParts =
          buildFluxCircuitOverlay(
            currentTelemetry
              .fieldFluxPU,
          );

        rearOverlays.push({
          part: fluxParts.rear,
          localRotationX: 0,
        });

        frontOverlays.push({
          part: fluxParts.front,
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot.cutaway &&
        controlsSnapshot
          .showMainField &&
        currentTelemetry.fieldFluxPU >
          0.02
      ) {
        frontOverlays.push({
          part: buildMainFieldOverlay(
            currentTelemetry
              .fieldFluxPU,
          ),
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot.cutaway &&
        controlsSnapshot
          .showArmatureField &&
        currentTelemetry.armatureMmfPU >
          0.02
      ) {
        frontOverlays.push({
          part: buildArmatureFieldOverlay(
            currentTelemetry
              .armatureMmfAngleRad,
            currentTelemetry
              .armatureMmfPU,
          ),
          localRotationX: 0,
        });
      }

      if (
        controlsSnapshot.cutaway &&
        controlsSnapshot
          .showCurrentArrows &&
        Math.abs(
          currentTelemetry
            .armatureCurrentA,
        ) > 0.05
      ) {
        frontOverlays.push({
          part: buildCurrentArrowOverlay(
            currentTelemetry
              .slotCurrents,
          ),
          localRotationX:
            currentTelemetry
              .rotorAngleRad,
        });
      }

      if (
        controlsSnapshot.cutaway &&
        controlsSnapshot
          .showTorqueArrow &&
        Math.abs(
          currentTelemetry
            .electromagneticTorqueNm,
        ) > 0.08
      ) {
        frontOverlays.push({
          part: buildTorqueOverlay(
            currentTelemetry
              .torqueDirection,
            Math.abs(
              currentTelemetry
                .electromagneticTorqueNm,
            ) /
              RATED_TORQUE,
          ),
          localRotationX: 0,
        });
      }

      drawScene(
        context,
        width,
        height,
        yawRef.current,
        pitchRef.current,
        zoomRef.current,
        solidInstances,
        rearOverlays,
        frontOverlays,
      );

      updateLabels(
        width,
        height,
        controlsSnapshot,
      );

      if (
        time -
          previousTelemetryUpdate >=
        100
      ) {
        previousTelemetryUpdate =
          time;

        setTelemetry(
          currentTelemetry,
        );
      }

      animationFrame =
        requestAnimationFrame(
          render,
        );
    };

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            resizeCanvas,
          )
        : null;

    resizeObserver?.observe(canvas);

    window.addEventListener(
      "resize",
      resizeCanvas,
    );

    resizeCanvas();

    animationFrame =
      requestAnimationFrame(
        render,
      );

    return () => {
      disposed = true;

      cancelAnimationFrame(
        animationFrame,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        resizeCanvas,
      );
    };
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): void => {
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget
      .setPointerCapture(
        event.pointerId,
      );
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): void => {
    const drag = dragRef.current;

    if (
      !drag.active ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX - drag.x;

    const deltaY =
      event.clientY - drag.y;

    drag.x = event.clientX;
    drag.y = event.clientY;

    yawRef.current +=
      deltaX * 0.007;

    pitchRef.current = clamp(
      pitchRef.current +
        deltaY * 0.006,
      -1.05,
      1.05,
    );
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): void => {
    if (
      dragRef.current.pointerId ===
      event.pointerId
    ) {
      dragRef.current.active = false;
      dragRef.current.pointerId = -1;
    }

    if (
      event.currentTarget
        .hasPointerCapture(
          event.pointerId,
        )
    ) {
      event.currentTarget
        .releasePointerCapture(
          event.pointerId,
        );
    }
  };

  const handleWheel = (
    event: ReactWheelEvent<HTMLCanvasElement>,
  ): void => {
    event.preventDefault();

    zoomRef.current = clamp(
      zoomRef.current +
        event.deltaY * 0.008,
      6,
      14,
    );
  };

  const resetView = (): void => {
    yawRef.current = -0.56;
    pitchRef.current = -0.16;
    zoomRef.current = 8.8;
  };

  const presets: Array<{
    key: LearningPreset;
    label: string;
  }> = [
    {
      key: "complete",
      label: "Complete Motor",
    },
    {
      key: "construction",
      label: "Construction",
    },
    {
      key: "field",
      label: "Magnetic Field",
    },
    {
      key: "commutation",
      label: "Commutation",
    },
    {
      key: "speed",
      label: "Speed Control",
    },
  ];

  const maximumVoltage = Math.max(
    Math.abs(
      controls.armatureVoltage,
    ),
    1,
  );

  const maximumPower = Math.max(
    telemetry.electricalInputPowerW,
    telemetry.mechanicalOutputPowerW,
    telemetry.copperLossW,
    telemetry.rotationalLossW,
    1,
  );

  return (
    <section
      className={className}
      style={{
        width: "100%",
        overflow: "hidden",
        background:
          COLORS.background,
        color: "#111827",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .dc-fixed-canvas {
          cursor: grab;
        }

        .dc-fixed-canvas:active {
          cursor: grabbing;
        }

        .dc-fixed-button:hover {
          filter: brightness(0.97);
        }

        .dc-fixed-main {
          display: grid;
          grid-template-columns: 365px minmax(0, 1fr);
          min-height: 790px;
        }

        .dc-fixed-panel {
          height: 790px;
          overflow-y: auto;
        }

        .dc-fixed-viewport {
          position: relative;
          width: 100%;
          height: 790px;
          min-width: 0;
          overflow: hidden;
          background: #eaf0f4;
        }

        .dc-fixed-analysis {
          display: grid;
          grid-template-columns:
            minmax(300px, 0.92fr)
            minmax(0, 1.08fr);
          gap: 12px;
          padding: 12px;
          border-top: 1px solid #cbd5e1;
          background: #f8fafc;
        }

        .dc-fixed-equations {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(210px, 1fr));
          gap: 10px;
          padding: 12px;
          border-top: 1px solid #cbd5e1;
          background: #ffffff;
        }

        @media (max-width: 1100px) {
          .dc-fixed-main {
            grid-template-columns: 1fr;
          }

          .dc-fixed-panel {
            height: auto;
            max-height: none;
            border-right: 0 !important;
            border-bottom: 1px solid #cbd5e1;
          }

          .dc-fixed-viewport {
            height: 680px;
          }

          .dc-fixed-analysis {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 14,
          padding: "14px 18px",
          borderBottom:
            "1px solid #cbd5e1",
          background: "#ffffff",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 860,
              letterSpacing:
                "-0.025em",
            }}
          >
            BRUSHED DC MOTOR —
            INTERACTIVE 3D SIMULATION
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: "#64748b",
              fontSize: 13,
            }}
          >
            Separately excited two-pole
            DC motor with slotted
            armature, distributed
            windings, 12-segment
            commutator and fixed carbon
            brushes
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            type="button"
            className="dc-fixed-button"
            onClick={() =>
              updateControls(
                (current) => ({
                  ...current,
                  powered:
                    !current.powered,
                }),
              )
            }
            style={{
              ...buttonStyle,
              borderColor:
                controls.powered
                  ? COLORS.success
                  : COLORS.warning,
              background:
                controls.powered
                  ? COLORS.success
                  : "#ffffff",
              color:
                controls.powered
                  ? "#ffffff"
                  : COLORS.warning,
            }}
          >
            {controls.powered
              ? "Stop Motor"
              : "Start Motor"}
          </button>

          <button
            type="button"
            className="dc-fixed-button"
            onClick={() =>
              updateControls(
                (current) => ({
                  ...current,
                  paused:
                    !current.paused,
                }),
              )
            }
            style={{
              ...buttonStyle,
              borderColor:
                controls.paused
                  ? COLORS.torque
                  : "#cbd5e1",
              background:
                controls.paused
                  ? COLORS.torque
                  : "#ffffff",
              color:
                controls.paused
                  ? "#ffffff"
                  : "#172033",
            }}
          >
            {controls.paused
              ? "Resume"
              : "Pause"}
          </button>

          <button
            type="button"
            className="dc-fixed-button"
            onClick={() => {
              stepRequestRef.current +=
                PI / 12;

              updateControls(
                (current) => ({
                  ...current,
                  paused: true,
                }),
              );
            }}
            style={buttonStyle}
          >
            Step 15°
          </button>

          <button
            type="button"
            className="dc-fixed-button"
            onClick={() =>
              updateControls(
                (current) => ({
                  ...current,
                  cutaway:
                    !current.cutaway,
                }),
              )
            }
            style={{
              ...buttonStyle,
              borderColor:
                controls.cutaway
                  ? "#111827"
                  : "#cbd5e1",
              background:
                controls.cutaway
                  ? "#111827"
                  : "#ffffff",
              color:
                controls.cutaway
                  ? "#ffffff"
                  : "#172033",
            }}
          >
            {controls.cutaway
              ? "Show Full Motor"
              : "Show Cutaway"}
          </button>

          <button
            type="button"
            className="dc-fixed-button"
            onClick={resetView}
            style={buttonStyle}
          >
            Reset View
          </button>
        </div>
      </header>

      <div className="dc-fixed-main">
        <aside
          className="dc-fixed-panel"
          style={{
            display: "grid",
            alignContent: "start",
            gap: 10,
            padding: 12,
            borderRight:
              "1px solid #cbd5e1",
            background: "#f8fafc",
          }}
        >
          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 9px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              LEARNING PRESETS
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 7,
              }}
            >
              {presets.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    applyPreset(
                      item.key,
                    )
                  }
                  style={{
                    ...buttonStyle,
                    minHeight: 34,
                    padding: "6px 7px",
                    background:
                      preset === item.key
                        ? "#1d4ed8"
                        : "#ffffff",
                    borderColor:
                      preset === item.key
                        ? "#1d4ed8"
                        : "#cbd5e1",
                    color:
                      preset === item.key
                        ? "#ffffff"
                        : "#334155",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              ELECTRICAL AND MECHANICAL
              INPUTS
            </h2>

            <div
              style={{
                display: "grid",
                gap: 13,
              }}
            >
              <ControlSlider
                label="Armature voltage"
                value={
                  controls.armatureVoltage
                }
                minimum={0}
                maximum={240}
                step={5}
                unit="V"
                onChange={(
                  armatureVoltage,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      armatureVoltage,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Field voltage"
                value={
                  controls.fieldVoltage
                }
                minimum={0}
                maximum={200}
                step={5}
                unit="V"
                onChange={(
                  fieldVoltage,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      fieldVoltage,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Mechanical load"
                value={
                  controls.loadPercent
                }
                minimum={0}
                maximum={140}
                step={1}
                unit="%"
                onChange={(
                  loadPercent,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      loadPercent,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Rotor inertia"
                value={
                  controls.inertiaPU
                }
                minimum={0.1}
                maximum={1.6}
                step={0.1}
                unit="p.u."
                onChange={(
                  inertiaPU,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      inertiaPU,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Simulation speed"
                value={
                  controls.simulationSpeed
                }
                minimum={0.05}
                maximum={1}
                step={0.05}
                unit="×"
                onChange={(
                  simulationSpeed,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      simulationSpeed,
                    }),
                  )
                }
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 7,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    updateControls(
                      (current) => ({
                        ...current,
                        direction: 1,
                      }),
                    )
                  }
                  style={{
                    ...buttonStyle,
                    background:
                      controls.direction ===
                      1
                        ? "#1d4ed8"
                        : "#ffffff",
                    color:
                      controls.direction ===
                      1
                        ? "#ffffff"
                        : "#172033",
                  }}
                >
                  Forward
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateControls(
                      (current) => ({
                        ...current,
                        direction: -1,
                      }),
                    )
                  }
                  style={{
                    ...buttonStyle,
                    background:
                      controls.direction ===
                      -1
                        ? "#1d4ed8"
                        : "#ffffff",
                    color:
                      controls.direction ===
                      -1
                        ? "#ffffff"
                        : "#172033",
                  }}
                >
                  Reverse
                </button>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              STARTER AND PROTECTION
            </h2>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <ControlSlider
                label="Starter resistance"
                value={
                  controls.starterResistance
                }
                minimum={0}
                maximum={8}
                step={0.25}
                unit="Ω"
                onChange={(
                  starterResistance,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      starterResistance,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Current limit"
                value={
                  controls.currentLimitA
                }
                minimum={10}
                maximum={60}
                step={1}
                unit="A"
                onChange={(
                  currentLimitA,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      currentLimitA,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Electronic current limit"
                checked={
                  controls
                    .currentLimitEnabled
                }
                onChange={(
                  currentLimitEnabled,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      currentLimitEnabled,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Field-loss protection"
                checked={
                  controls
                    .fieldLossProtection
                }
                color={COLORS.warning}
                onChange={(
                  fieldLossProtection,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      fieldLossProtection,
                    }),
                  )
                }
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              ELECTROMAGNETIC OVERLAYS
            </h2>

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              <ToggleRow
                label="Stationary N–S field"
                checked={
                  controls.showMainField
                }
                color={
                  COLORS.mainField
                }
                onChange={(
                  showMainField,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showMainField,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Continuous magnetic circuit"
                checked={
                  controls.showFluxCircuit
                }
                color={
                  COLORS.mainFieldDark
                }
                onChange={(
                  showFluxCircuit,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showFluxCircuit,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Armature MMF axis"
                checked={
                  controls
                    .showArmatureField
                }
                color={
                  COLORS.armatureField
                }
                onChange={(
                  showArmatureField,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showArmatureField,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Distributed current arrows"
                checked={
                  controls
                    .showCurrentArrows
                }
                color={
                  COLORS.currentPositive
                }
                onChange={(
                  showCurrentArrows,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showCurrentArrows,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Torque direction"
                checked={
                  controls.showTorqueArrow
                }
                color={COLORS.torque}
                onChange={(
                  showTorqueArrow,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showTorqueArrow,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Projected part labels"
                checked={
                  controls.showLabels
                }
                onChange={(
                  showLabels,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showLabels,
                    }),
                  )
                }
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              COMPONENT VISIBILITY
            </h2>

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              <ToggleRow
                label="Base and terminal box"
                checked={
                  controls.showBase
                }
                onChange={(
                  showBase,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showBase,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Outer frame and yoke"
                checked={
                  controls.showHousing
                }
                onChange={(
                  showHousing,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showHousing,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Pole cores and curved shoes"
                checked={
                  controls.showPoles
                }
                onChange={(
                  showPoles,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showPoles,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Layered field windings"
                checked={
                  controls.showFieldCoils
                }
                color={
                  COLORS.fieldCoil
                }
                onChange={(
                  showFieldCoils,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showFieldCoils,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Slotted armature core"
                checked={
                  controls
                    .showArmatureCore
                }
                onChange={(
                  showArmatureCore,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showArmatureCore,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Distributed armature coils"
                checked={
                  controls
                    .showArmatureWindings
                }
                color={COLORS.copper}
                onChange={(
                  showArmatureWindings,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showArmatureWindings,
                    }),
                  )
                }
              />

              <ToggleRow
                label="12-segment commutator"
                checked={
                  controls.showCommutator
                }
                color={
                  COLORS.commutatorCopper
                }
                onChange={(
                  showCommutator,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showCommutator,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Fixed carbon brushes"
                checked={
                  controls.showBrushes
                }
                onChange={(
                  showBrushes,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showBrushes,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Bearings"
                checked={
                  controls.showBearings
                }
                onChange={(
                  showBearings,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showBearings,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Fan guard"
                checked={
                  controls.showFanGuard
                }
                onChange={(
                  showFanGuard,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showFanGuard,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Housing opacity"
                value={
                  controls.housingOpacity
                }
                minimum={0.15}
                maximum={1}
                step={0.05}
                unit=""
                onChange={(
                  housingOpacity,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      housingOpacity,
                    }),
                  )
                }
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 9px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              LIVE MOTOR DATA
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 7,
              }}
            >
              <TelemetryItem
                label="Speed"
                value={`${telemetry.speedRpm.toFixed(
                  0,
                )} rpm`}
              />

              <TelemetryItem
                label="Armature current"
                value={`${telemetry.armatureCurrentA.toFixed(
                  1,
                )} A`}
                alert={
                  Math.abs(
                    telemetry
                      .armatureCurrentA,
                  ) >
                  RATED_ARMATURE_CURRENT *
                    2
                }
              />

              <TelemetryItem
                label="Field current"
                value={`${telemetry.fieldCurrentA.toFixed(
                  2,
                )} A`}
              />

              <TelemetryItem
                label="Back EMF"
                value={`${telemetry.backEmfV.toFixed(
                  1,
                )} V`}
                accent={
                  COLORS.mainField
                }
              />

              <TelemetryItem
                label="Field flux"
                value={`${telemetry.fieldFluxPU.toFixed(
                  2,
                )} p.u.`}
                alert={
                  controls.powered &&
                  telemetry.fieldFluxPU <
                    FIELD_WARNING_LEVEL
                }
              />

              <TelemetryItem
                label="Armature MMF"
                value={`${telemetry.armatureMmfPU.toFixed(
                  2,
                )} p.u.`}
                accent={
                  COLORS.armatureField
                }
              />

              <TelemetryItem
                label="EM torque"
                value={`${telemetry.electromagneticTorqueNm.toFixed(
                  1,
                )} Nm`}
                accent={COLORS.torque}
              />

              <TelemetryItem
                label="Load torque"
                value={`${telemetry.loadTorqueNm.toFixed(
                  1,
                )} Nm`}
              />

              <TelemetryItem
                label="Efficiency"
                value={`${telemetry.efficiencyPercent.toFixed(
                  1,
                )} %`}
              />

              <TelemetryItem
                label="Temperature"
                value={`${telemetry.temperatureC.toFixed(
                  0,
                )} °C`}
                alert={
                  telemetry.temperatureC >
                  100
                }
              />
            </div>

            {telemetry.warning ? (
              <div
                style={{
                  marginTop: 9,
                  border:
                    "1px solid #fca5a5",
                  borderRadius: 8,
                  background: "#fff1f2",
                  color: COLORS.warning,
                  padding: 9,
                  fontSize: 11,
                  fontWeight: 750,
                  lineHeight: 1.4,
                }}
              >
                {telemetry.warning}
              </div>
            ) : null}
          </div>
        </aside>

        <div
          ref={viewportRef}
          className="dc-fixed-viewport"
        >
          <canvas
            ref={canvasRef}
            className="dc-fixed-canvas"
            aria-label="Interactive brushed DC motor three-dimensional simulation"
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            onWheel={handleWheel}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              touchAction: "none",
              outline: "none",
            }}
          />

          <div
            ref={northLabelRef}
            style={{
              position: "absolute",
              zIndex: 12,
              width: 29,
              height: 29,
              marginLeft: -14.5,
              marginTop: -14.5,
              display: "none",
              placeItems: "center",
              border:
                "2px solid #ffffff",
              borderRadius: 999,
              background:
                COLORS.positive,
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 900,
              pointerEvents: "none",
              boxShadow:
                "0 4px 12px rgba(15,23,42,0.24)",
            }}
          >
            N
          </div>

          <div
            ref={southLabelRef}
            style={{
              position: "absolute",
              zIndex: 12,
              width: 29,
              height: 29,
              marginLeft: -14.5,
              marginTop: -14.5,
              display: "none",
              placeItems: "center",
              border:
                "2px solid #ffffff",
              borderRadius: 999,
              background:
                COLORS.negative,
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 900,
              pointerEvents: "none",
              boxShadow:
                "0 4px 12px rgba(15,23,42,0.24)",
            }}
          >
            S
          </div>

          <div
            ref={
              positiveBrushLabelRef
            }
            style={{
              position: "absolute",
              zIndex: 12,
              display: "none",
              placeItems: "center",
              transform:
                "translate(-50%, -50%)",
              border:
                "2px solid #ffffff",
              borderRadius: 7,
              background:
                COLORS.positive,
              color: "#ffffff",
              padding: "4px 7px",
              fontSize: 11,
              fontWeight: 900,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow:
                "0 4px 12px rgba(15,23,42,0.24)",
            }}
          >
            + BRUSH
          </div>

          <div
            ref={
              negativeBrushLabelRef
            }
            style={{
              position: "absolute",
              zIndex: 12,
              display: "none",
              placeItems: "center",
              transform:
                "translate(-50%, -50%)",
              border:
                "2px solid #ffffff",
              borderRadius: 7,
              background:
                COLORS.negative,
              color: "#ffffff",
              padding: "4px 7px",
              fontSize: 11,
              fontWeight: 900,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow:
                "0 4px 12px rgba(15,23,42,0.24)",
            }}
          >
            − BRUSH
          </div>

          <div
            style={{
              position: "absolute",
              left: 14,
              top: 14,
              maxWidth: 350,
              border:
                "1px solid rgba(148,163,184,0.8)",
              borderRadius: 9,
              background:
                "rgba(255,255,255,0.94)",
              padding: 10,
              color: "#334155",
              fontSize: 11,
              lineHeight: 1.45,
              pointerEvents: "none",
              boxShadow:
                "0 4px 14px rgba(15,23,42,0.1)",
            }}
          >
            <strong>
              DC motor energy conversion
            </strong>

            <br />

            Field current → stationary
            N–S flux → brush current →
            commutator switching →
            armature conductor force →
            torque → speed → back EMF
          </div>

          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              display: "grid",
              gap: 7,
              pointerEvents: "none",
              zIndex: 14,
            }}
          >
            {[
              {
                text: `MOTOR: ${
                  controls.powered
                    ? "ENERGIZED"
                    : "OFF"
                }`,
                color: controls.powered
                  ? COLORS.success
                  : COLORS.warning,
              },
              {
                text: `CONTACTOR: ${
                  telemetry
                    .armatureContactorClosed
                    ? "CLOSED"
                    : "OPEN"
                }`,
                color: telemetry
                  .armatureContactorClosed
                  ? COLORS.success
                  : COLORS.warning,
              },
              {
                text: `STATUS: ${telemetry.status.toUpperCase()}`,
                color: "#334155",
              },
              {
                text: `SPEED: ${telemetry.speedRpm.toFixed(
                  0,
                )} RPM`,
                color: "#334155",
              },
              {
                text: `ARMATURE: ${telemetry.armatureCurrentA.toFixed(
                  1,
                )} A${
                  telemetry.currentLimited
                    ? " · LIMITED"
                    : ""
                }`,
                color: telemetry.currentLimited
                  ? COLORS.warning
                  : "#334155",
              },
              {
                text: `FLUX: ${telemetry.fieldFluxPU.toFixed(
                  2,
                )} P.U.`,
                color:
                  COLORS.mainField,
              },
              {
                text: `TORQUE: ${telemetry.electromagneticTorqueNm.toFixed(
                  1,
                )} NM`,
                color: COLORS.torque,
              },
              {
                text: `CONTACT: S${
                  telemetry.positiveSegment +
                  1
                }+ / S${
                  telemetry.negativeSegment +
                  1
                }−`,
                color: "#334155",
              },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  border:
                    "1px solid rgba(148,163,184,0.8)",
                  borderRadius: 8,
                  background:
                    "rgba(255,255,255,0.95)",
                  padding: "7px 10px",
                  color: item.color,
                  fontSize: 11,
                  fontWeight: 850,
                  minWidth: 150,
                }}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              border:
                "1px solid rgba(148,163,184,0.8)",
              borderRadius: 8,
              background:
                "rgba(255,255,255,0.92)",
              padding: "8px 10px",
              color: "#475569",
              fontSize: 12,
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            Drag: rotate · Wheel: zoom ·
            Pause and step to inspect
            commutation
          </div>
        </div>
      </div>

      <div className="dc-fixed-analysis">
        <CommutationPanel
          telemetry={telemetry}
          direction={
            controls.direction
          }
          idPrefix={idPrefix}
        />

        <div
          style={{
            display: "grid",
            gap: 12,
            alignContent: "start",
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <strong
                style={{
                  fontSize: 13,
                }}
              >
                Armature voltage balance
              </strong>

              <span
                style={{
                  color: "#64748b",
                  fontSize: 10,
                }}
              >
                Va = Eb + IaRa + IaRs +
                La·di/dt
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              <MeterBar
                label="Back EMF"
                value={
                  telemetry.backEmfV
                }
                maximum={maximumVoltage}
                unit="V"
                color={
                  COLORS.mainField
                }
              />

              <MeterBar
                label="Armature I·R"
                value={
                  telemetry
                    .armatureResistiveDropV
                }
                maximum={maximumVoltage}
                unit="V"
                color={
                  COLORS.armatureField
                }
              />

              <MeterBar
                label="Starter I·R"
                value={
                  telemetry.starterDropV
                }
                maximum={maximumVoltage}
                unit="V"
                color={
                  COLORS.fieldCoil
                }
              />

              <MeterBar
                label="L di/dt"
                value={
                  telemetry.inductiveDropV
                }
                maximum={maximumVoltage}
                unit="V"
                color={COLORS.torque}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <strong
                style={{
                  fontSize: 13,
                }}
              >
                Power flow
              </strong>

              <span
                style={{
                  color: "#64748b",
                  fontSize: 10,
                }}
              >
                η = Pout / Pin
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              <MeterBar
                label="Electrical input"
                value={
                  telemetry
                    .electricalInputPowerW
                }
                maximum={maximumPower}
                unit="W"
                color="#1d4ed8"
              />

              <MeterBar
                label="Mechanical output"
                value={
                  telemetry
                    .mechanicalOutputPowerW
                }
                maximum={maximumPower}
                unit="W"
                color={COLORS.success}
              />

              <MeterBar
                label="Copper loss"
                value={
                  telemetry.copperLossW
                }
                maximum={maximumPower}
                unit="W"
                color={
                  COLORS.armatureField
                }
              />

              <MeterBar
                label="Rotational loss"
                value={
                  telemetry
                    .rotationalLossW
                }
                maximum={maximumPower}
                unit="W"
                color={COLORS.torque}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin: "0 0 9px",
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              OPERATING STATE
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 7,
              }}
            >
              <TelemetryItem
                label="Rotor position"
                value={`${(
                  normalizeAngle(
                    telemetry.rotorAngleRad,
                  ) *
                  180 /
                  PI
                ).toFixed(1)}°`}
              />

              <TelemetryItem
                label="Positive contact"
                value={`Segment ${
                  telemetry.positiveSegment +
                  1
                }`}
                accent={
                  COLORS.positive
                }
              />

              <TelemetryItem
                label="Negative contact"
                value={`Segment ${
                  telemetry.negativeSegment +
                  1
                }`}
                accent={
                  COLORS.negative
                }
              />

              <TelemetryItem
                label="Commutating coils"
                value={
                  telemetry
                    .commutatingCoils
                    .length > 0
                    ? telemetry
                        .commutatingCoils
                        .map(
                          (coil) =>
                            `C${coil + 1}`,
                        )
                        .join(", ")
                    : "None"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dc-fixed-equations">
        <div
          style={{
            ...cardStyle,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <strong>Field circuit</strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            Vf = IfRf + Lf·dIf/dt
          </span>
        </div>

        <div
          style={{
            ...cardStyle,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <strong>
            Armature circuit
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            Va = Eb + Ia(Ra + Rs) +
            La·dIa/dt
          </span>
        </div>

        <div
          style={{
            ...cardStyle,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <strong>Back EMF</strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            Eb = ke·Φ·ω
          </span>
        </div>

        <div
          style={{
            ...cardStyle,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <strong>
            Electromagnetic torque
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            Te = kt·Φ·Ia
          </span>
        </div>

        <div
          style={{
            ...cardStyle,
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <strong>
            Mechanical motion
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            J·dω/dt = Te − Tl − Bω −
            Tf
          </span>
        </div>
      </div>
    </section>
  );
}