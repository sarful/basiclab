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

type AcInductionMotorPhase2Props = {
  className?: string;
};

type Vec3 = [number, number, number];
type Mat4 = Float32Array;
type Direction = 1 | -1;
type PhaseKey = "A" | "B" | "C";

type GeometryData = {
  vertices: Float32Array;
  indices: Uint32Array;
};

type GpuGeometry = {
  vao: WebGLVertexArrayObject;
  vertexBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  indexCount: number;
};

type ShaderLocations = {
  program: WebGLProgram;
  mvp: WebGLUniformLocation;
  model: WebGLUniformLocation;
  cameraPosition: WebGLUniformLocation;
  opacity: WebGLUniformLocation;
};

type ViewerControls = {
  powered: boolean;
  paused: boolean;
  cutaway: boolean;

  frequency: number;
  voltage: number;
  poles: number;
  loadPercent: number;
  direction: Direction;
  playbackRate: number;

  showBase: boolean;
  showHousing: boolean;
  showStator: boolean;
  showRotor: boolean;
  showBearings: boolean;
  showFanGuard: boolean;
  showAirGap: boolean;

  showPhaseMMF: boolean;
  showStatorField: boolean;
  showRotorField: boolean;
  showFluxLines: boolean;
  showPoleMarkers: boolean;
  showTorqueAngle: boolean;
  showRotationGuide: boolean;

  phases: Record<PhaseKey, boolean>;
  housingOpacity: number;
};

type SimulationState = {
  rotorOmega: number;
  visualRotorAngle: number;
  visualElectricalAngle: number;
  statorFluxPU: number;
  rotorFluxPU: number;
};

type MotorTelemetry = {
  synchronousRpm: number;
  rotorRpm: number;
  slipPercent: number;
  slipFrequencyHz: number;

  phaseA: number;
  phaseB: number;
  phaseC: number;
  alphaCurrent: number;
  betaCurrent: number;
  lineCurrentA: number;

  electromagneticTorqueNm: number;
  loadTorqueNm: number;
  breakdownTorqueNm: number;

  statorFluxPU: number;
  rotorFluxPU: number;

  torqueAngleElectricalDeg: number;
  torqueAngleMechanicalDeg: number;
  statorFieldMechanicalAngle: number;
  rotorFieldMechanicalAngle: number;
  visualElectricalAngle: number;

  fieldDirection: "CW" | "CCW";
  status: string;
};

type PhaseDefinition = {
  phase: PhaseKey;
  color: string;
  positiveSlot: number;
  negativeSlot: number;
  endRadius: number;
  axialOffset: number;
};

const PI = Math.PI;
const TWO_PI = Math.PI * 2;

const SLOT_COUNT = 24;
const SLOT_STEP = TWO_PI / SLOT_COUNT;

const CORE_LENGTH = 2.9;
const CORE_HALF = CORE_LENGTH / 2;

const ROTOR_RADIUS = 0.68;
const STATOR_BORE_RADIUS = 0.76;
const AIR_GAP_RADIUS =
  (ROTOR_RADIUS + STATOR_BORE_RADIUS) / 2;

const TOOTH_OUTER_RADIUS = 1.03;
const STATOR_OUTER_RADIUS = 1.25;
const HOUSING_INNER_RADIUS = 1.33;
const HOUSING_OUTER_RADIUS = 1.48;

const CUTAWAY_START = (2 * PI) / 3;
const CUTAWAY_LENGTH = (5 * PI) / 3;

const RATED_VOLTAGE = 400;
const RATED_FREQUENCY = 50;
const RATED_CURRENT = 11;
const RATED_TORQUE = 35;

const BREAKDOWN_SLIP = 0.2;
const BREAKDOWN_TORQUE_MULTIPLIER = 2.2;
const TEACHING_FIELD_HZ = 0.28;

const COLORS = {
  background: "#eaf0f4",

  housing: "#6f7b85",
  housingLight: "#8b969f",
  housingDark: "#3f4951",
  frame: "#55616a",

  stator: "#404950",
  statorLight: "#6a757d",
  slot: "#20272d",

  rotor: "#a3abb1",
  rotorDark: "#4f5961",
  shaft: "#d9dee1",

  bearing: "#d7dcdf",
  bearingDark: "#707a82",
  fan: "#4b5760",

  phaseA: "#dc2626",
  phaseB: "#d59b00",
  phaseC: "#2563eb",

  statorField: "#00a8c6",
  statorFieldDark: "#087f94",
  rotorField: "#f97316",
  torque: "#7c3aed",
  north: "#dc2626",
  south: "#2563eb",
  rotation: "#0f172a",
  airGap: "#06b6d4",
};

const PHASES: PhaseDefinition[] = [
  {
    phase: "A",
    color: COLORS.phaseA,
    positiveSlot: 0,
    negativeSlot: 12,
    endRadius: 1.13,
    axialOffset: 0.13,
  },
  {
    phase: "B",
    color: COLORS.phaseB,
    positiveSlot: 8,
    negativeSlot: 20,
    endRadius: 1.18,
    axialOffset: 0.19,
  },
  {
    phase: "C",
    color: COLORS.phaseC,
    positiveSlot: 16,
    negativeSlot: 4,
    endRadius: 1.23,
    axialOffset: 0.25,
  },
];

const INITIAL_CONTROLS: ViewerControls = {
  powered: true,
  paused: false,
  cutaway: true,

  frequency: 50,
  voltage: 400,
  poles: 4,
  loadPercent: 35,
  direction: 1,
  playbackRate: 0.35,

  showBase: true,
  showHousing: true,
  showStator: true,
  showRotor: true,
  showBearings: true,
  showFanGuard: true,
  showAirGap: true,

  showPhaseMMF: true,
  showStatorField: true,
  showRotorField: true,
  showFluxLines: true,
  showPoleMarkers: true,
  showTorqueAngle: true,
  showRotationGuide: true,

  phases: {
    A: true,
    B: true,
    C: true,
  },

  housingOpacity: 0.95,
};

const INITIAL_TELEMETRY: MotorTelemetry = {
  synchronousRpm: 1500,
  rotorRpm: 0,
  slipPercent: 100,
  slipFrequencyHz: 50,

  phaseA: 0,
  phaseB: 0,
  phaseC: 0,
  alphaCurrent: 0,
  betaCurrent: 0,
  lineCurrentA: 0,

  electromagneticTorqueNm: 0,
  loadTorqueNm: 0,
  breakdownTorqueNm: 0,

  statorFluxPU: 0,
  rotorFluxPU: 0,

  torqueAngleElectricalDeg: 0,
  torqueAngleMechanicalDeg: 0,
  statorFieldMechanicalAngle: 0,
  rotorFieldMechanicalAngle: 0,
  visualElectricalAngle: 0,

  fieldDirection: "CW",
  status: "Starting",
};

const buttonStyle: CSSProperties = {
  minHeight: 36,
  padding: "7px 11px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#ffffff",
  color: "#172033",
  fontSize: 12,
  fontWeight: 750,
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

function normalizeAngle(
  angle: number,
): number {
  let normalized = angle % TWO_PI;

  if (normalized < 0) {
    normalized += TWO_PI;
  }

  return normalized;
}

function normalizeSignedAngle(
  angle: number,
): number {
  let normalized =
    normalizeAngle(angle);

  if (normalized > PI) {
    normalized -= TWO_PI;
  }

  return normalized;
}

function slotAngle(
  slotIndex: number,
): number {
  const normalizedSlot =
    ((slotIndex % SLOT_COUNT) +
      SLOT_COUNT) %
    SLOT_COUNT;

  return normalizedSlot * SLOT_STEP;
}

function angleInsideArc(
  angle: number,
  start: number,
  length: number,
): boolean {
  if (length >= TWO_PI - 0.0001) {
    return true;
  }

  const relative = normalizeAngle(
    normalizeAngle(angle) -
      normalizeAngle(start),
  );

  return relative <= length;
}

function hexToRgb(
  hex: string,
): Vec3 {
  const value = Number.parseInt(
    hex.replace("#", ""),
    16,
  );

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

function vecAdd(
  a: Vec3,
  b: Vec3,
): Vec3 {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ];
}

function vecSub(
  a: Vec3,
  b: Vec3,
): Vec3 {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ];
}

function vecScale(
  vector: Vec3,
  scale: number,
): Vec3 {
  return [
    vector[0] * scale,
    vector[1] * scale,
    vector[2] * scale,
  ];
}

function vecLength(
  vector: Vec3,
): number {
  return Math.hypot(
    vector[0],
    vector[1],
    vector[2],
  );
}

function vecNormalize(
  vector: Vec3,
): Vec3 {
  const length = vecLength(vector);

  if (length < 0.000001) {
    return [0, 0, 0];
  }

  return [
    vector[0] / length,
    vector[1] / length,
    vector[2] / length,
  ];
}

function vecCross(
  a: Vec3,
  b: Vec3,
): Vec3 {
  return [
    a[1] * b[2] -
      a[2] * b[1],

    a[2] * b[0] -
      a[0] * b[2],

    a[0] * b[1] -
      a[1] * b[0],
  ];
}

function mat4Multiply(
  a: Mat4,
  b: Mat4,
): Mat4 {
  const output =
    new Float32Array(16);

  for (
    let column = 0;
    column < 4;
    column += 1
  ) {
    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      output[column * 4 + row] =
        a[row] *
          b[column * 4] +
        a[4 + row] *
          b[column * 4 + 1] +
        a[8 + row] *
          b[column * 4 + 2] +
        a[12 + row] *
          b[column * 4 + 3];
    }
  }

  return output;
}

function mat4Perspective(
  fieldOfViewRadians: number,
  aspect: number,
  near: number,
  far: number,
): Mat4 {
  const f =
    1 /
    Math.tan(
      fieldOfViewRadians / 2,
    );

  const rangeInverse =
    1 / (near - far);

  return new Float32Array([
    f / aspect,
    0,
    0,
    0,

    0,
    f,
    0,
    0,

    0,
    0,
    (near + far) *
      rangeInverse,
    -1,

    0,
    0,
    near *
      far *
      rangeInverse *
      2,
    0,
  ]);
}

function mat4LookAt(
  eye: Vec3,
  target: Vec3,
  up: Vec3,
): Mat4 {
  const zAxis = vecNormalize(
    vecSub(eye, target),
  );

  const xAxis = vecNormalize(
    vecCross(up, zAxis),
  );

  const yAxis = vecCross(
    zAxis,
    xAxis,
  );

  return new Float32Array([
    xAxis[0],
    yAxis[0],
    zAxis[0],
    0,

    xAxis[1],
    yAxis[1],
    zAxis[1],
    0,

    xAxis[2],
    yAxis[2],
    zAxis[2],
    0,

    -(
      xAxis[0] * eye[0] +
      xAxis[1] * eye[1] +
      xAxis[2] * eye[2]
    ),

    -(
      yAxis[0] * eye[0] +
      yAxis[1] * eye[1] +
      yAxis[2] * eye[2]
    ),

    -(
      zAxis[0] * eye[0] +
      zAxis[1] * eye[1] +
      zAxis[2] * eye[2]
    ),

    1,
  ]);
}

function mat4RotationX(
  angle: number,
): Mat4 {
  const cosine =
    Math.cos(angle);

  const sine =
    Math.sin(angle);

  return new Float32Array([
    1,
    0,
    0,
    0,

    0,
    cosine,
    sine,
    0,

    0,
    -sine,
    cosine,
    0,

    0,
    0,
    0,
    1,
  ]);
}

function mat4RotationY(
  angle: number,
): Mat4 {
  const cosine =
    Math.cos(angle);

  const sine =
    Math.sin(angle);

  return new Float32Array([
    cosine,
    0,
    -sine,
    0,

    0,
    1,
    0,
    0,

    sine,
    0,
    cosine,
    0,

    0,
    0,
    0,
    1,
  ]);
}

function mat4RotationZ(
  angle: number,
): Mat4 {
  const cosine =
    Math.cos(angle);

  const sine =
    Math.sin(angle);

  return new Float32Array([
    cosine,
    sine,
    0,
    0,

    -sine,
    cosine,
    0,
    0,

    0,
    0,
    1,
    0,

    0,
    0,
    0,
    1,
  ]);
}

function mat4Scale(
  x: number,
  y: number,
  z: number,
): Mat4 {
  return new Float32Array([
    x,
    0,
    0,
    0,

    0,
    y,
    0,
    0,

    0,
    0,
    z,
    0,

    0,
    0,
    0,
    1,
  ]);
}

function rotateVector(
  vector: Vec3,
  rotation: Vec3,
): Vec3 {
  let [x, y, z] = vector;

  const cosineX =
    Math.cos(rotation[0]);

  const sineX =
    Math.sin(rotation[0]);

  const y1 =
    y * cosineX -
    z * sineX;

  const z1 =
    y * sineX +
    z * cosineX;

  y = y1;
  z = z1;

  const cosineY =
    Math.cos(rotation[1]);

  const sineY =
    Math.sin(rotation[1]);

  const x2 =
    x * cosineY +
    z * sineY;

  const z2 =
    -x * sineY +
    z * cosineY;

  x = x2;
  z = z2;

  const cosineZ =
    Math.cos(rotation[2]);

  const sineZ =
    Math.sin(rotation[2]);

  const x3 =
    x * cosineZ -
    y * sineZ;

  const y3 =
    x * sineZ +
    y * cosineZ;

  return [x3, y3, z];
}

function projectPoint(
  point: Vec3,
  matrix: Mat4,
  width: number,
  height: number,
): {
  x: number;
  y: number;
  visible: boolean;
} {
  const x =
    matrix[0] * point[0] +
    matrix[4] * point[1] +
    matrix[8] * point[2] +
    matrix[12];

  const y =
    matrix[1] * point[0] +
    matrix[5] * point[1] +
    matrix[9] * point[2] +
    matrix[13];

  const z =
    matrix[2] * point[0] +
    matrix[6] * point[1] +
    matrix[10] * point[2] +
    matrix[14];

  const w =
    matrix[3] * point[0] +
    matrix[7] * point[1] +
    matrix[11] * point[2] +
    matrix[15];

  if (w <= 0.0001) {
    return {
      x: 0,
      y: 0,
      visible: false,
    };
  }

  const normalizedX = x / w;
  const normalizedY = y / w;
  const normalizedZ = z / w;

  return {
    x:
      (normalizedX * 0.5 + 0.5) *
      width,

    y:
      (1 -
        (normalizedY * 0.5 + 0.5)) *
      height,

    visible:
      normalizedX >= -1.2 &&
      normalizedX <= 1.2 &&
      normalizedY >= -1.2 &&
      normalizedY <= 1.2 &&
      normalizedZ >= -1.2 &&
      normalizedZ <= 1.2,
  };
}

function stepMotorModel(
  state: SimulationState,
  controls: ViewerControls,
  deltaSeconds: number,
  electricalStepRadians: number,
): MotorTelemetry {
  const polePairs =
    controls.poles / 2;

  const synchronousMechanicalOmega =
    (controls.direction *
      TWO_PI *
      controls.frequency) /
    Math.max(polePairs, 1);

  const synchronousMagnitude =
    Math.max(
      Math.abs(
        synchronousMechanicalOmega,
      ),
      0.001,
    );

  const synchronousRpm =
    Math.abs(
      (synchronousMechanicalOmega *
        60) /
        TWO_PI,
    );

  const physicalDelta =
    controls.paused
      ? 0
      : deltaSeconds;

  const visualDelta =
    controls.paused
      ? 0
      : deltaSeconds *
        controls.playbackRate;

  if (electricalStepRadians !== 0) {
    state.visualElectricalAngle =
      normalizeAngle(
        state.visualElectricalAngle +
          controls.direction *
            electricalStepRadians,
      );
  } else if (
    controls.powered &&
    visualDelta > 0
  ) {
    const visualElectricalOmega =
      controls.direction *
      TWO_PI *
      TEACHING_FIELD_HZ *
      (controls.frequency /
        RATED_FREQUENCY);

    state.visualElectricalAngle =
      normalizeAngle(
        state.visualElectricalAngle +
          visualElectricalOmega *
            visualDelta,
      );
  }

  const ratedVf =
    RATED_VOLTAGE /
    RATED_FREQUENCY;

  const actualVf =
    controls.voltage /
    Math.max(
      controls.frequency,
      1,
    );

  const requestedFlux =
    controls.powered
      ? clamp(
          actualVf / ratedVf,
          0,
          1.2,
        )
      : 0;

  const fluxTimeConstant =
    controls.powered
      ? 0.12
      : 0.28;

  if (physicalDelta > 0) {
    state.statorFluxPU +=
      (requestedFlux -
        state.statorFluxPU) *
      (1 -
        Math.exp(
          -physicalDelta /
            fluxTimeConstant,
        ));
  }

  const signedSlip =
    (synchronousMechanicalOmega -
      state.rotorOmega) /
    synchronousMagnitude;

  const absoluteSlip =
    clamp(
      Math.abs(signedSlip),
      0,
      2,
    );

  const breakdownTorqueNm =
    RATED_TORQUE *
    BREAKDOWN_TORQUE_MULTIPLIER *
    state.statorFluxPU *
    state.statorFluxPU;

  const torqueSlipFactor =
    absoluteSlip > 0.000001
      ? (2 *
          absoluteSlip *
          BREAKDOWN_SLIP) /
        (absoluteSlip *
          absoluteSlip +
          BREAKDOWN_SLIP *
            BREAKDOWN_SLIP)
      : 0;

  const electromagneticTorqueNm =
    controls.powered
      ? Math.sign(
          synchronousMechanicalOmega -
            state.rotorOmega ||
            controls.direction,
        ) *
        breakdownTorqueNm *
        torqueSlipFactor
      : 0;

  const loadTorqueNm =
    RATED_TORQUE *
    1.1 *
    (controls.loadPercent / 100);

  const motionDirection =
    Math.abs(state.rotorOmega) >
    0.001
      ? Math.sign(
          state.rotorOmega,
        )
      : controls.powered
        ? controls.direction
        : 0;

  const viscousTorqueNm =
    0.012 *
    state.rotorOmega;

  const inertia = 0.11;

  if (physicalDelta > 0) {
    const netTorqueNm =
      electromagneticTorqueNm -
      loadTorqueNm *
        motionDirection -
      viscousTorqueNm;

    state.rotorOmega +=
      (netTorqueNm / inertia) *
      physicalDelta;

    if (
      !controls.powered &&
      Math.abs(
        state.rotorOmega,
      ) < 0.03
    ) {
      state.rotorOmega = 0;
    }

    if (
      controls.powered &&
      controls.direction > 0 &&
      state.rotorOmega >
        synchronousMechanicalOmega
    ) {
      state.rotorOmega =
        synchronousMechanicalOmega;
    }

    if (
      controls.powered &&
      controls.direction < 0 &&
      state.rotorOmega <
        synchronousMechanicalOmega
    ) {
      state.rotorOmega =
        synchronousMechanicalOmega;
    }
  }

  const speedRatio =
    clamp(
      Math.abs(
        state.rotorOmega,
      ) /
        synchronousMagnitude,
      0,
      1.05,
    );

  if (visualDelta > 0) {
    const visualMechanicalFieldOmega =
      (TWO_PI *
        TEACHING_FIELD_HZ *
        (controls.frequency /
          RATED_FREQUENCY)) /
      Math.max(polePairs, 1);

    state.visualRotorAngle =
      normalizeAngle(
        state.visualRotorAngle +
          controls.direction *
            visualMechanicalFieldOmega *
            speedRatio *
            visualDelta,
      );
  }

  const rotorRpm =
    (state.rotorOmega * 60) /
    TWO_PI;

  const slip =
    controls.powered
      ? clamp(
          Math.abs(
            (synchronousMechanicalOmega -
              state.rotorOmega) /
              synchronousMagnitude,
          ),
          0,
          2,
        )
      : 0;

  const slipPercent =
    slip * 100;

  const slipFrequencyHz =
    slip *
    controls.frequency;

  const rotorFluxTarget =
    controls.powered
      ? state.statorFluxPU *
        clamp(
          0.3 +
            (0.7 * slip) /
              (slip + 0.08),
          0,
          1,
        )
      : 0;

  if (physicalDelta > 0) {
    state.rotorFluxPU +=
      (rotorFluxTarget -
        state.rotorFluxPU) *
      (1 -
        Math.exp(
          -physicalDelta / 0.2,
        ));
  }

  const voltagePU =
    controls.voltage /
    RATED_VOLTAGE;

  const magnetizingCurrentA =
    RATED_CURRENT *
    0.3 *
    state.statorFluxPU;

  const rotorCurrentA =
    controls.powered
      ? RATED_CURRENT *
        voltagePU *
        (0.12 +
          (5.3 * slip) /
            (slip + 0.45))
      : 0;

  const lineCurrentA =
    controls.powered
      ? Math.sqrt(
          magnetizingCurrentA *
            magnetizingCurrentA +
            rotorCurrentA *
              rotorCurrentA,
        )
      : 0;

  const phasePeak =
    lineCurrentA *
    Math.SQRT2;

  const theta =
    state.visualElectricalAngle;

  const phaseA =
    controls.powered
      ? phasePeak *
        Math.cos(theta)
      : 0;

  const phaseB =
    controls.powered
      ? phasePeak *
        Math.cos(
          theta -
            controls.direction *
              (TWO_PI / 3),
        )
      : 0;

  const phaseC =
    controls.powered
      ? phasePeak *
        Math.cos(
          theta +
            controls.direction *
              (TWO_PI / 3),
        )
      : 0;

  const alphaCurrent =
    (2 / 3) *
    (phaseA -
      0.5 * phaseB -
      0.5 * phaseC);

  const betaCurrent =
    (2 / 3) *
    ((Math.sqrt(3) / 2) *
      (phaseB - phaseC));

  const statorFieldElectricalAngle =
    Math.atan2(
      betaCurrent,
      alphaCurrent,
    );

  const statorFieldMechanicalAngle =
    statorFieldElectricalAngle /
    Math.max(polePairs, 1);

  const torqueUtilization =
    breakdownTorqueNm > 0.001
      ? clamp(
          Math.abs(
            electromagneticTorqueNm /
              breakdownTorqueNm,
          ),
          0,
          0.96,
        )
      : 0;

  const torqueAngleElectrical =
    Math.asin(
      torqueUtilization,
    );

  const torqueSign =
    Math.sign(
      electromagneticTorqueNm ||
        controls.direction,
    );

  const rotorFieldElectricalAngle =
    statorFieldElectricalAngle -
    torqueSign *
      torqueAngleElectrical;

  const rotorFieldMechanicalAngle =
    rotorFieldElectricalAngle /
    Math.max(polePairs, 1);

  let status = "Running";

  if (
    !controls.powered &&
    Math.abs(rotorRpm) < 1
  ) {
    status = "De-energized";
  } else if (!controls.powered) {
    status = "Coasting";
  } else if (
    Math.abs(rotorRpm) <
    synchronousRpm * 0.1
  ) {
    status = "Starting";
  } else if (
    slipPercent > 15
  ) {
    status = "High slip";
  } else {
    status = "Motoring";
  }

  return {
    synchronousRpm,
    rotorRpm,
    slipPercent,
    slipFrequencyHz,

    phaseA,
    phaseB,
    phaseC,
    alphaCurrent,
    betaCurrent,
    lineCurrentA,

    electromagneticTorqueNm,
    loadTorqueNm,
    breakdownTorqueNm,

    statorFluxPU:
      state.statorFluxPU,

    rotorFluxPU:
      state.rotorFluxPU,

    torqueAngleElectricalDeg:
      (torqueAngleElectrical *
        180) /
      PI,

    torqueAngleMechanicalDeg:
      (torqueAngleElectrical *
        180) /
      (PI *
        Math.max(
          polePairs,
          1,
        )),

    statorFieldMechanicalAngle,
    rotorFieldMechanicalAngle,

    visualElectricalAngle:
      state.visualElectricalAngle,

    fieldDirection:
      controls.direction === 1
        ? "CW"
        : "CCW",

    status,
  };
}

class GeometryBuilder {
  private readonly vertices: number[] =
    [];

  private readonly indices: number[] =
    [];

  addVertex(
    position: Vec3,
    normal: Vec3,
    color: Vec3,
  ): number {
    const index =
      this.vertices.length / 9;

    this.vertices.push(
      position[0],
      position[1],
      position[2],

      normal[0],
      normal[1],
      normal[2],

      color[0],
      color[1],
      color[2],
    );

    return index;
  }

  addTriangle(
    a: number,
    b: number,
    c: number,
  ): void {
    this.indices.push(a, b, c);
  }

  addQuad(
    p0: Vec3,
    p1: Vec3,
    p2: Vec3,
    p3: Vec3,

    n0: Vec3,
    n1: Vec3,
    n2: Vec3,
    n3: Vec3,

    color: Vec3,
  ): void {
    const i0 = this.addVertex(
      p0,
      n0,
      color,
    );

    const i1 = this.addVertex(
      p1,
      n1,
      color,
    );

    const i2 = this.addVertex(
      p2,
      n2,
      color,
    );

    const i3 = this.addVertex(
      p3,
      n3,
      color,
    );

    this.addTriangle(
      i0,
      i1,
      i2,
    );

    this.addTriangle(
      i0,
      i2,
      i3,
    );
  }

  addBox(
    center: Vec3,
    size: Vec3,
    colorHex: string,
    rotation: Vec3 = [
      0,
      0,
      0,
    ],
  ): void {
    const color =
      hexToRgb(colorHex);

    const halfX =
      size[0] / 2;

    const halfY =
      size[1] / 2;

    const halfZ =
      size[2] / 2;

    const transformPoint = (
      point: Vec3,
    ): Vec3 =>
      vecAdd(
        rotateVector(
          point,
          rotation,
        ),
        center,
      );

    const transformNormal = (
      normal: Vec3,
    ): Vec3 =>
      vecNormalize(
        rotateVector(
          normal,
          rotation,
        ),
      );

    const faces: Array<{
      points: [
        Vec3,
        Vec3,
        Vec3,
        Vec3,
      ];
      normal: Vec3;
    }> = [
      {
        points: [
          [
            halfX,
            -halfY,
            -halfZ,
          ],
          [
            halfX,
            halfY,
            -halfZ,
          ],
          [
            halfX,
            halfY,
            halfZ,
          ],
          [
            halfX,
            -halfY,
            halfZ,
          ],
        ],
        normal: [1, 0, 0],
      },

      {
        points: [
          [
            -halfX,
            -halfY,
            halfZ,
          ],
          [
            -halfX,
            halfY,
            halfZ,
          ],
          [
            -halfX,
            halfY,
            -halfZ,
          ],
          [
            -halfX,
            -halfY,
            -halfZ,
          ],
        ],
        normal: [-1, 0, 0],
      },

      {
        points: [
          [
            -halfX,
            halfY,
            -halfZ,
          ],
          [
            -halfX,
            halfY,
            halfZ,
          ],
          [
            halfX,
            halfY,
            halfZ,
          ],
          [
            halfX,
            halfY,
            -halfZ,
          ],
        ],
        normal: [0, 1, 0],
      },

      {
        points: [
          [
            -halfX,
            -halfY,
            halfZ,
          ],
          [
            -halfX,
            -halfY,
            -halfZ,
          ],
          [
            halfX,
            -halfY,
            -halfZ,
          ],
          [
            halfX,
            -halfY,
            halfZ,
          ],
        ],
        normal: [0, -1, 0],
      },

      {
        points: [
          [
            -halfX,
            -halfY,
            halfZ,
          ],
          [
            halfX,
            -halfY,
            halfZ,
          ],
          [
            halfX,
            halfY,
            halfZ,
          ],
          [
            -halfX,
            halfY,
            halfZ,
          ],
        ],
        normal: [0, 0, 1],
      },

      {
        points: [
          [
            halfX,
            -halfY,
            -halfZ,
          ],
          [
            -halfX,
            -halfY,
            -halfZ,
          ],
          [
            -halfX,
            halfY,
            -halfZ,
          ],
          [
            halfX,
            halfY,
            -halfZ,
          ],
        ],
        normal: [0, 0, -1],
      },
    ];

    faces.forEach((face) => {
      const normal =
        transformNormal(
          face.normal,
        );

      this.addQuad(
        transformPoint(
          face.points[0],
        ),

        transformPoint(
          face.points[1],
        ),

        transformPoint(
          face.points[2],
        ),

        transformPoint(
          face.points[3],
        ),

        normal,
        normal,
        normal,
        normal,

        color,
      );
    });
  }

  addCylinderX(
    center: Vec3,
    length: number,
    radius: number,
    colorHex: string,
    segments = 32,
  ): void {
    const color =
      hexToRgb(colorHex);

    const startX =
      center[0] -
      length / 2;

    const endX =
      center[0] +
      length / 2;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angle0 =
        (index / segments) *
        TWO_PI;

      const angle1 =
        ((index + 1) /
          segments) *
        TWO_PI;

      const normal0: Vec3 = [
        0,
        Math.cos(angle0),
        Math.sin(angle0),
      ];

      const normal1: Vec3 = [
        0,
        Math.cos(angle1),
        Math.sin(angle1),
      ];

      const p0: Vec3 = [
        startX,

        center[1] +
          radius *
            Math.cos(angle0),

        center[2] +
          radius *
            Math.sin(angle0),
      ];

      const p1: Vec3 = [
        endX,

        center[1] +
          radius *
            Math.cos(angle0),

        center[2] +
          radius *
            Math.sin(angle0),
      ];

      const p2: Vec3 = [
        endX,

        center[1] +
          radius *
            Math.cos(angle1),

        center[2] +
          radius *
            Math.sin(angle1),
      ];

      const p3: Vec3 = [
        startX,

        center[1] +
          radius *
            Math.cos(angle1),

        center[2] +
          radius *
            Math.sin(angle1),
      ];

      this.addQuad(
        p0,
        p1,
        p2,
        p3,

        normal0,
        normal0,
        normal1,
        normal1,

        color,
      );
    }
  }

  addCylinderBetween(
    start: Vec3,
    end: Vec3,
    radius: number,
    colorHex: string,
    segments = 10,
  ): void {
    const color =
      hexToRgb(colorHex);

    const direction =
      vecNormalize(
        vecSub(end, start),
      );

    const temporary: Vec3 =
      Math.abs(
        direction[0],
      ) < 0.9
        ? [1, 0, 0]
        : [0, 1, 0];

    const axisU =
      vecNormalize(
        vecCross(
          direction,
          temporary,
        ),
      );

    const axisV =
      vecNormalize(
        vecCross(
          direction,
          axisU,
        ),
      );

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angle0 =
        (index / segments) *
        TWO_PI;

      const angle1 =
        ((index + 1) /
          segments) *
        TWO_PI;

      const radial0 = vecAdd(
        vecScale(
          axisU,
          Math.cos(angle0) *
            radius,
        ),

        vecScale(
          axisV,
          Math.sin(angle0) *
            radius,
        ),
      );

      const radial1 = vecAdd(
        vecScale(
          axisU,
          Math.cos(angle1) *
            radius,
        ),

        vecScale(
          axisV,
          Math.sin(angle1) *
            radius,
        ),
      );

      this.addQuad(
        vecAdd(
          start,
          radial0,
        ),

        vecAdd(
          end,
          radial0,
        ),

        vecAdd(
          end,
          radial1,
        ),

        vecAdd(
          start,
          radial1,
        ),

        vecNormalize(radial0),
        vecNormalize(radial0),
        vecNormalize(radial1),
        vecNormalize(radial1),

        color,
      );
    }
  }

  addCylinderShellX(
    center: Vec3,
    length: number,
    innerRadius: number,
    outerRadius: number,
    colorHex: string,
    thetaStart = 0,
    thetaLength = TWO_PI,
    segments = 48,
  ): void {
    const color =
      hexToRgb(colorHex);

    const startX =
      center[0] -
      length / 2;

    const endX =
      center[0] +
      length / 2;

    const fullCircle =
      Math.abs(
        thetaLength -
          TWO_PI,
      ) < 0.0001;

    for (
      let index = 0;
      index < segments;
      index += 1
    ) {
      const angle0 =
        thetaStart +
        thetaLength *
          (index /
            segments);

      const angle1 =
        thetaStart +
        thetaLength *
          ((index + 1) /
            segments);

      const outerNormal0: Vec3 =
        [
          0,
          Math.cos(angle0),
          Math.sin(angle0),
        ];

      const outerNormal1: Vec3 =
        [
          0,
          Math.cos(angle1),
          Math.sin(angle1),
        ];

      const innerNormal0: Vec3 =
        [
          0,
          -Math.cos(angle0),
          -Math.sin(angle0),
        ];

      const innerNormal1: Vec3 =
        [
          0,
          -Math.cos(angle1),
          -Math.sin(angle1),
        ];

      const outerStart0: Vec3 =
        [
          startX,

          center[1] +
            outerRadius *
              Math.cos(angle0),

          center[2] +
            outerRadius *
              Math.sin(angle0),
        ];

      const outerEnd0: Vec3 =
        [
          endX,

          center[1] +
            outerRadius *
              Math.cos(angle0),

          center[2] +
            outerRadius *
              Math.sin(angle0),
        ];

      const outerEnd1: Vec3 =
        [
          endX,

          center[1] +
            outerRadius *
              Math.cos(angle1),

          center[2] +
            outerRadius *
              Math.sin(angle1),
        ];

      const outerStart1: Vec3 =
        [
          startX,

          center[1] +
            outerRadius *
              Math.cos(angle1),

          center[2] +
            outerRadius *
              Math.sin(angle1),
        ];

      const innerStart0: Vec3 =
        [
          startX,

          center[1] +
            innerRadius *
              Math.cos(angle0),

          center[2] +
            innerRadius *
              Math.sin(angle0),
        ];

      const innerEnd0: Vec3 =
        [
          endX,

          center[1] +
            innerRadius *
              Math.cos(angle0),

          center[2] +
            innerRadius *
              Math.sin(angle0),
        ];

      const innerEnd1: Vec3 =
        [
          endX,

          center[1] +
            innerRadius *
              Math.cos(angle1),

          center[2] +
            innerRadius *
              Math.sin(angle1),
        ];

      const innerStart1: Vec3 =
        [
          startX,

          center[1] +
            innerRadius *
              Math.cos(angle1),

          center[2] +
            innerRadius *
              Math.sin(angle1),
        ];

      this.addQuad(
        outerStart0,
        outerEnd0,
        outerEnd1,
        outerStart1,

        outerNormal0,
        outerNormal0,
        outerNormal1,
        outerNormal1,

        color,
      );

      this.addQuad(
        innerStart1,
        innerEnd1,
        innerEnd0,
        innerStart0,

        innerNormal1,
        innerNormal1,
        innerNormal0,
        innerNormal0,

        color,
      );

      this.addQuad(
        innerStart0,
        outerStart0,
        outerStart1,
        innerStart1,

        [-1, 0, 0],
        [-1, 0, 0],
        [-1, 0, 0],
        [-1, 0, 0],

        color,
      );

      this.addQuad(
        outerEnd0,
        innerEnd0,
        innerEnd1,
        outerEnd1,

        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],

        color,
      );
    }

    if (!fullCircle) {
      const createCutFace = (
        angle: number,
        normal: Vec3,
      ): void => {
        const outerStart: Vec3 =
          [
            startX,

            center[1] +
              outerRadius *
                Math.cos(angle),

            center[2] +
              outerRadius *
                Math.sin(angle),
          ];

        const outerEnd: Vec3 =
          [
            endX,

            center[1] +
              outerRadius *
                Math.cos(angle),

            center[2] +
              outerRadius *
                Math.sin(angle),
          ];

        const innerEnd: Vec3 =
          [
            endX,

            center[1] +
              innerRadius *
                Math.cos(angle),

            center[2] +
              innerRadius *
                Math.sin(angle),
          ];

        const innerStart: Vec3 =
          [
            startX,

            center[1] +
              innerRadius *
                Math.cos(angle),

            center[2] +
              innerRadius *
                Math.sin(angle),
          ];

        this.addQuad(
          outerStart,
          outerEnd,
          innerEnd,
          innerStart,

          normal,
          normal,
          normal,
          normal,

          color,
        );
      };

      const endAngle =
        thetaStart +
        thetaLength;

      createCutFace(
        thetaStart,
        [
          0,
          Math.sin(
            thetaStart,
          ),
          -Math.cos(
            thetaStart,
          ),
        ],
      );

      createCutFace(
        endAngle,
        [
          0,
          -Math.sin(
            endAngle,
          ),
          Math.cos(
            endAngle,
          ),
        ],
      );
    }
  }

  addSphere(
    center: Vec3,
    radius: number,
    colorHex: string,
    latitudeSegments = 8,
    longitudeSegments = 12,
  ): void {
    const color =
      hexToRgb(colorHex);

    const baseIndex =
      this.vertices.length / 9;

    for (
      let latitude = 0;
      latitude <=
      latitudeSegments;
      latitude += 1
    ) {
      const verticalAngle =
        (latitude /
          latitudeSegments) *
        PI;

      const sinVertical =
        Math.sin(
          verticalAngle,
        );

      const cosVertical =
        Math.cos(
          verticalAngle,
        );

      for (
        let longitude = 0;
        longitude <=
        longitudeSegments;
        longitude += 1
      ) {
        const horizontalAngle =
          (longitude /
            longitudeSegments) *
          TWO_PI;

        const normal: Vec3 = [
          Math.cos(
            horizontalAngle,
          ) * sinVertical,

          cosVertical,

          Math.sin(
            horizontalAngle,
          ) * sinVertical,
        ];

        this.addVertex(
          [
            center[0] +
              normal[0] *
                radius,

            center[1] +
              normal[1] *
                radius,

            center[2] +
              normal[2] *
                radius,
          ],

          normal,
          color,
        );
      }
    }

    const rowLength =
      longitudeSegments + 1;

    for (
      let latitude = 0;
      latitude <
      latitudeSegments;
      latitude += 1
    ) {
      for (
        let longitude = 0;
        longitude <
        longitudeSegments;
        longitude += 1
      ) {
        const current =
          baseIndex +
          latitude *
            rowLength +
          longitude;

        const next =
          current +
          rowLength;

        this.addTriangle(
          current,
          next,
          current + 1,
        );

        this.addTriangle(
          current + 1,
          next,
          next + 1,
        );
      }
    }
  }

  addTorusX(
    center: Vec3,
    majorRadius: number,
    tubeRadius: number,
    colorHex: string,
    majorStart = 0,
    majorLength = TWO_PI,
    majorSegments = 40,
    tubeSegments = 8,
  ): void {
    const color =
      hexToRgb(colorHex);

    const baseIndex =
      this.vertices.length / 9;

    for (
      let majorIndex = 0;
      majorIndex <=
      majorSegments;
      majorIndex += 1
    ) {
      const majorAngle =
        majorStart +
        majorLength *
          (majorIndex /
            majorSegments);

      const cosMajor =
        Math.cos(
          majorAngle,
        );

      const sinMajor =
        Math.sin(
          majorAngle,
        );

      for (
        let tubeIndex = 0;
        tubeIndex <=
        tubeSegments;
        tubeIndex += 1
      ) {
        const tubeAngle =
          (tubeIndex /
            tubeSegments) *
          TWO_PI;

        const cosTube =
          Math.cos(
            tubeAngle,
          );

        const sinTube =
          Math.sin(
            tubeAngle,
          );

        const radialDistance =
          majorRadius +
          tubeRadius *
            sinTube;

        const normal =
          vecNormalize([
            cosTube,

            sinTube *
              cosMajor,

            sinTube *
              sinMajor,
          ]);

        this.addVertex(
          [
            center[0] +
              tubeRadius *
                cosTube,

            center[1] +
              radialDistance *
                cosMajor,

            center[2] +
              radialDistance *
                sinMajor,
          ],

          normal,
          color,
        );
      }
    }

    const rowLength =
      tubeSegments + 1;

    for (
      let majorIndex = 0;
      majorIndex <
      majorSegments;
      majorIndex += 1
    ) {
      for (
        let tubeIndex = 0;
        tubeIndex <
        tubeSegments;
        tubeIndex += 1
      ) {
        const current =
          baseIndex +
          majorIndex *
            rowLength +
          tubeIndex;

        const next =
          current +
          rowLength;

        this.addTriangle(
          current,
          next,
          current + 1,
        );

        this.addTriangle(
          current + 1,
          next,
          next + 1,
        );
      }
    }
  }

  addTubePolyline(
    points: Vec3[],
    radius: number,
    colorHex: string,
    closed = false,
  ): void {
    const count =
      closed
        ? points.length
        : points.length - 1;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      this.addCylinderBetween(
        points[index],

        points[
          (index + 1) %
            points.length
        ],

        radius,
        colorHex,
        8,
      );
    }
  }

  build(): GeometryData {
    return {
      vertices:
        new Float32Array(
          this.vertices,
        ),

      indices:
        new Uint32Array(
          this.indices,
        ),
    };
  }
}

function radialPoint(
  x: number,
  radius: number,
  angle: number,
): Vec3 {
  return [
    x,

    Math.cos(angle) *
      radius,

    Math.sin(angle) *
      radius,
  ];
}

function buildBaseGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  builder.addBox(
    [0, -1.65, 0],
    [5.15, 0.34, 1.72],
    COLORS.frame,
  );

  builder.addBox(
    [-1.55, -1.9, 0],
    [0.52, 0.66, 1.5],
    COLORS.frame,
    [0, 0, -0.15],
  );

  builder.addBox(
    [1.55, -1.9, 0],
    [0.52, 0.66, 1.5],
    COLORS.frame,
    [0, 0, 0.15],
  );

  builder.addBox(
    [-1.55, -2.12, 0],
    [1.6, 0.34, 2.18],
    COLORS.frame,
  );

  builder.addBox(
    [1.55, -2.12, 0],
    [1.6, 0.34, 2.18],
    COLORS.frame,
  );

  const terminalX = -0.55;

  builder.addBox(
    [terminalX, 1.42, 0],
    [1.75, 0.14, 0.98],
    COLORS.housingDark,
  );

  builder.addBox(
    [
      terminalX - 0.81,
      1.72,
      0,
    ],
    [0.12, 0.62, 0.98],
    COLORS.housing,
  );

  builder.addBox(
    [
      terminalX + 0.81,
      1.72,
      0,
    ],
    [0.12, 0.62, 0.98],
    COLORS.housing,
  );

  builder.addBox(
    [
      terminalX,
      1.72,
      -0.43,
    ],
    [1.62, 0.62, 0.12],
    COLORS.housing,
  );

  builder.addBox(
    [terminalX, 2.04, 0],
    [1.9, 0.16, 1.08],
    COLORS.housingLight,
  );

  [
    terminalX - 0.42,
    terminalX,
    terminalX + 0.42,
  ].forEach((x) => {
    builder.addCylinderBetween(
      [x, 1.56, 0.12],
      [x, 1.88, 0.12],
      0.07,
      COLORS.bearing,
      14,
    );

    builder.addCylinderBetween(
      [x, 1.86, 0.12],
      [x, 1.92, 0.12],
      0.105,
      COLORS.bearingDark,
      10,
    );
  });

  builder.addBox(
    [1.03, 1.58, 0],
    [0.38, 0.28, 0.42],
    COLORS.housing,
  );

  builder.addTorusX(
    [1.03, 1.91, 0],
    0.28,
    0.07,
    COLORS.housing,
    0,
    TWO_PI,
    34,
    8,
  );

  return builder.build();
}

function buildHousingGeometry(
  cutaway: boolean,
): GeometryData {
  const builder =
    new GeometryBuilder();

  const start =
    cutaway
      ? CUTAWAY_START
      : 0;

  const length =
    cutaway
      ? CUTAWAY_LENGTH
      : TWO_PI;

  builder.addCylinderShellX(
    [0, 0, 0],
    4.5,
    HOUSING_INNER_RADIUS,
    HOUSING_OUTER_RADIUS,
    COLORS.housing,
    start,
    length,
    64,
  );

  builder.addTorusX(
    [-2.2, 0, 0],
    1.4,
    0.09,
    COLORS.housingDark,
    start,
    length,
    48,
    8,
  );

  builder.addTorusX(
    [2.2, 0, 0],
    1.4,
    0.09,
    COLORS.housingDark,
    start,
    length,
    48,
    8,
  );

  for (
    let index = 0;
    index < 18;
    index += 1
  ) {
    const angle =
      (index / 18) *
      TWO_PI;

    if (
      cutaway &&
      !angleInsideArc(
        angle,
        start,
        length,
      )
    ) {
      continue;
    }

    builder.addBox(
      [
        0,
        Math.cos(angle) *
          1.59,

        Math.sin(angle) *
          1.59,
      ],

      [4.38, 0.13, 0.22],
      COLORS.housingLight,
      [angle, 0, 0],
    );
  }

  const covers: Array<
    [number, Direction]
  > = [
    [-2.42, -1],
    [2.42, 1],
  ];

  covers.forEach(
    ([baseX, direction]) => {
      builder.addCylinderShellX(
        [baseX, 0, 0],
        0.28,
        0.78,
        1.5,
        COLORS.housing,
        start,
        length,
        48,
      );

      builder.addCylinderShellX(
        [
          baseX +
            direction * 0.22,
          0,
          0,
        ],
        0.18,
        0.67,
        1.24,
        COLORS.housingLight,
        start,
        length,
        44,
      );

      builder.addCylinderShellX(
        [
          baseX +
            direction * 0.37,
          0,
          0,
        ],
        0.14,
        0.54,
        0.84,
        COLORS.housingDark,
        start,
        length,
        38,
      );
    },
  );

  return builder.build();
}

function buildStatorGeometry(
  cutaway: boolean,
): GeometryData {
  const builder =
    new GeometryBuilder();

  const start =
    cutaway
      ? CUTAWAY_START
      : 0;

  const length =
    cutaway
      ? CUTAWAY_LENGTH
      : TWO_PI;

  builder.addCylinderShellX(
    [0, 0, 0],
    CORE_LENGTH,
    TOOTH_OUTER_RADIUS,
    STATOR_OUTER_RADIUS,
    COLORS.stator,
    start,
    length,
    64,
  );

  for (
    let index = 0;
    index < 34;
    index += 1
  ) {
    const x =
      -CORE_HALF +
      (index *
        CORE_LENGTH) /
        33;

    builder.addTorusX(
      [x, 0, 0],
      1.14,
      0.012,

      index % 2 === 0
        ? COLORS.statorLight
        : COLORS.stator,

      start,
      length,
      42,
      5,
    );
  }

  for (
    let index = 0;
    index < SLOT_COUNT;
    index += 1
  ) {
    const angle =
      (index + 0.5) *
      SLOT_STEP;

    if (
      cutaway &&
      !angleInsideArc(
        angle,
        start,
        length,
      )
    ) {
      continue;
    }

    const toothDepth =
      TOOTH_OUTER_RADIUS -
      STATOR_BORE_RADIUS;

    const toothRadius =
      (TOOTH_OUTER_RADIUS +
        STATOR_BORE_RADIUS) /
      2;

    builder.addBox(
      [
        0,

        Math.cos(angle) *
          toothRadius,

        Math.sin(angle) *
          toothRadius,
      ],

      [
        CORE_LENGTH - 0.04,
        toothDepth,
        0.115,
      ],

      index % 2 === 0
        ? COLORS.statorLight
        : COLORS.stator,

      [angle, 0, 0],
    );

    builder.addBox(
      [
        0,

        Math.cos(angle) *
          (STATOR_BORE_RADIUS +
            0.022),

        Math.sin(angle) *
          (STATOR_BORE_RADIUS +
            0.022),
      ],

      [
        CORE_LENGTH - 0.02,
        0.045,
        0.15,
      ],

      COLORS.statorLight,
      [angle, 0, 0],
    );
  }

  for (
    let slot = 0;
    slot < SLOT_COUNT;
    slot += 1
  ) {
    const angle =
      slotAngle(slot);

    if (
      cutaway &&
      !angleInsideArc(
        angle,
        start,
        length,
      )
    ) {
      continue;
    }

    builder.addBox(
      [
        0,

        Math.cos(angle) *
          0.815,

        Math.sin(angle) *
          0.815,
      ],

      [
        CORE_LENGTH - 0.08,
        0.035,
        0.085,
      ],

      COLORS.slot,
      [angle, 0, 0],
    );
  }

  return builder.build();
}

function addPhaseWinding(
  builder: GeometryBuilder,
  definition: PhaseDefinition,
  cutaway: boolean,
): void {
  const distributedOffsets = [
    -1,
    0,
    1,
  ];

  const radialLayers = [0, 1];

  const start =
    cutaway
      ? CUTAWAY_START
      : 0;

  const length =
    cutaway
      ? CUTAWAY_LENGTH
      : TWO_PI;

  distributedOffsets.forEach(
    (
      slotOffset,
      offsetIndex,
    ) => {
      radialLayers.forEach(
        (layer) => {
          const positiveAngle =
            slotAngle(
              definition.positiveSlot +
                slotOffset,
            ) +
            (layer - 0.5) *
              0.018;

          const negativeAngle =
            slotAngle(
              definition.negativeSlot +
                slotOffset,
            ) +
            (layer - 0.5) *
              0.018;

          const conductorRadius =
            0.9 +
            layer * 0.04;

          const conductorThickness =
            0.018 +
            offsetIndex *
              0.0015;

          const positiveVisible =
            !cutaway ||
            angleInsideArc(
              positiveAngle,
              start,
              length,
            );

          const negativeVisible =
            !cutaway ||
            angleInsideArc(
              negativeAngle,
              start,
              length,
            );

          if (positiveVisible) {
            builder.addCylinderX(
              radialPoint(
                0,
                conductorRadius,
                positiveAngle,
              ),

              CORE_LENGTH -
                0.12,

              conductorThickness,
              definition.color,
              14,
            );
          }

          if (negativeVisible) {
            builder.addCylinderX(
              radialPoint(
                0,
                conductorRadius,
                negativeAngle,
              ),

              CORE_LENGTH -
                0.12,

              conductorThickness,
              definition.color,
              14,
            );
          }

          if (
            positiveVisible &&
            negativeVisible
          ) {
            [-1, 1].forEach(
              (endDirection) => {
                const coreEndX =
                  endDirection *
                  (CORE_HALF -
                    0.05);

                const outerX =
                  endDirection *
                  (CORE_HALF +
                    definition.axialOffset +
                    layer *
                      0.025);

                const arcPoints: Vec3[] =
                  [
                    radialPoint(
                      coreEndX,
                      conductorRadius,
                      positiveAngle,
                    ),

                    radialPoint(
                      outerX,
                      definition.endRadius,
                      positiveAngle,
                    ),
                  ];

                const arcSteps = 18;

                const unwrappedNegative =
                  positiveAngle +
                  PI;

                for (
                  let step = 1;
                  step < arcSteps;
                  step += 1
                ) {
                  const ratio =
                    step / arcSteps;

                  const angle =
                    positiveAngle +
                    (unwrappedNegative -
                      positiveAngle) *
                      ratio;

                  arcPoints.push(
                    radialPoint(
                      outerX +
                        endDirection *
                          Math.sin(
                            ratio *
                              PI,
                          ) *
                          0.055,

                      definition.endRadius,
                      angle,
                    ),
                  );
                }

                arcPoints.push(
                  radialPoint(
                    outerX,
                    definition.endRadius,
                    negativeAngle,
                  ),

                  radialPoint(
                    coreEndX,
                    conductorRadius,
                    negativeAngle,
                  ),
                );

                builder.addTubePolyline(
                  arcPoints,
                  conductorThickness,
                  definition.color,
                  false,
                );
              },
            );
          }
        },
      );
    },
  );
}

function buildPhaseWindingGeometry(
  phase: PhaseKey,
  cutaway: boolean,
): GeometryData {
  const builder =
    new GeometryBuilder();

  const definition =
    PHASES.find(
      (item) =>
        item.phase === phase,
    );

  if (definition) {
    addPhaseWinding(
      builder,
      definition,
      cutaway,
    );
  }

  return builder.build();
}

function buildBearingGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  [-2.05, 2.05].forEach(
    (x) => {
      builder.addCylinderShellX(
        [x, 0, 0],
        0.34,
        0.19,
        0.58,
        COLORS.housingDark,
        0,
        TWO_PI,
        36,
      );

      builder.addTorusX(
        [x - 0.17, 0, 0],
        0.42,
        0.065,
        COLORS.bearingDark,
        0,
        TWO_PI,
        34,
        8,
      );

      builder.addTorusX(
        [x + 0.17, 0, 0],
        0.42,
        0.065,
        COLORS.bearingDark,
        0,
        TWO_PI,
        34,
        8,
      );

      builder.addTorusX(
        [x, 0, 0],
        0.225,
        0.05,
        COLORS.bearing,
        0,
        TWO_PI,
        32,
        7,
      );

      for (
        let index = 0;
        index < 10;
        index += 1
      ) {
        const angle =
          (index / 10) *
          TWO_PI;

        builder.addSphere(
          [
            x,

            Math.cos(angle) *
              0.325,

            Math.sin(angle) *
              0.325,
          ],

          0.072,
          COLORS.bearing,
          8,
          12,
        );
      }
    },
  );

  return builder.build();
}

function buildFanGuardGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  const startX = 2.92;
  const endX = 3.65;
  const radius = 1.02;

  builder.addCylinderShellX(
    [
      startX - 0.06,
      0,
      0,
    ],

    0.16,
    0.86,
    1.07,
    COLORS.housingDark,
    0,
    TWO_PI,
    40,
  );

  builder.addTorusX(
    [startX, 0, 0],
    radius,
    0.04,
    COLORS.housingDark,
    0,
    TWO_PI,
    42,
    7,
  );

  builder.addTorusX(
    [endX, 0, 0],
    radius,
    0.04,
    COLORS.housingDark,
    0,
    TWO_PI,
    42,
    7,
  );

  for (
    let index = 0;
    index < 24;
    index += 1
  ) {
    const angle =
      (index / 24) *
      TWO_PI;

    builder.addCylinderBetween(
      [
        startX,

        Math.cos(angle) *
          radius,

        Math.sin(angle) *
          radius,
      ],

      [
        endX,

        Math.cos(angle) *
          radius,

        Math.sin(angle) *
          radius,
      ],

      0.012,
      COLORS.housingDark,
      7,
    );
  }

  [3.1, 3.28, 3.46].forEach(
    (x) => {
      builder.addTorusX(
        [x, 0, 0],
        radius,
        0.014,
        COLORS.housingDark,
        0,
        TWO_PI,
        40,
        5,
      );
    },
  );

  return builder.build();
}

function buildRotorGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  builder.addCylinderX(
    [0, 0, 0],

    CORE_LENGTH - 0.08,

    ROTOR_RADIUS,
    COLORS.rotor,
    56,
  );

  for (
    let index = 0;
    index < 38;
    index += 1
  ) {
    const x =
      -CORE_HALF +
      0.06 +
      (index *
        (CORE_LENGTH -
          0.12)) /
        37;

    builder.addTorusX(
      [x, 0, 0],

      ROTOR_RADIUS -
        0.014,

      0.008,

      index % 2 === 0
        ? COLORS.rotorDark
        : "#7b858c",

      0,
      TWO_PI,
      40,
      5,
    );
  }

  const barRadius = 0.605;
  const skew = 0.17;

  for (
    let index = 0;
    index < 28;
    index += 1
  ) {
    const angle =
      (index / 28) *
      TWO_PI;

    builder.addCylinderBetween(
      [
        -CORE_HALF +
          0.05,

        Math.cos(
          angle -
            skew / 2,
        ) * barRadius,

        Math.sin(
          angle -
            skew / 2,
        ) * barRadius,
      ],

      [
        CORE_HALF -
          0.05,

        Math.cos(
          angle +
            skew / 2,
        ) * barRadius,

        Math.sin(
          angle +
            skew / 2,
        ) * barRadius,
      ],

      0.022,
      COLORS.rotorDark,
      8,
    );
  }

  builder.addTorusX(
    [
      -CORE_HALF +
        0.03,
      0,
      0,
    ],

    barRadius,
    0.06,
    COLORS.rotorDark,
    0,
    TWO_PI,
    38,
    8,
  );

  builder.addTorusX(
    [
      CORE_HALF -
        0.03,
      0,
      0,
    ],

    barRadius,
    0.06,
    COLORS.rotorDark,
    0,
    TWO_PI,
    38,
    8,
  );

  builder.addCylinderX(
    [-0.05, 0, 0],
    5.25,
    0.145,
    COLORS.shaft,
    36,
  );

  builder.addCylinderX(
    [-3.5, 0, 0],
    1.95,
    0.128,
    COLORS.shaft,
    32,
  );

  builder.addCylinderX(
    [3.02, 0, 0],
    1.12,
    0.104,
    COLORS.shaft,
    30,
  );

  builder.addBox(
    [-3.72, 0.122, 0],
    [0.84, 0.04, 0.1],
    "#aeb6bb",
  );

  const fanX = 3.18;

  builder.addCylinderX(
    [fanX, 0, 0],
    0.28,
    0.24,
    COLORS.fan,
    30,
  );

  for (
    let index = 0;
    index < 5;
    index += 1
  ) {
    const angle =
      (index / 5) *
      TWO_PI;

    builder.addBox(
      [
        fanX,

        Math.cos(angle) *
          0.48,

        Math.sin(angle) *
          0.48,
      ],

      [0.1, 0.56, 0.15],
      COLORS.fan,
      [angle + 0.38, 0.1, 0],
    );
  }

  return builder.build();
}

function buildAirGapGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  [-1.28, 0, 1.28].forEach(
    (x) => {
      builder.addTorusX(
        [x, 0, 0],
        AIR_GAP_RADIUS,
        0.011,
        COLORS.airGap,
        0,
        TWO_PI,
        48,
        6,
      );
    },
  );

  return builder.build();
}

function buildArrowGeometry(
  color: string,
  length: number,
  thickness: number,
): GeometryData {
  const builder =
    new GeometryBuilder();

  builder.addSphere(
    [0, 0, 0],

    thickness * 1.5,

    color,
    8,
    12,
  );

  builder.addCylinderBetween(
    [0, 0, 0],
    [0, length, 0],
    thickness,
    color,
    12,
  );

  builder.addCylinderBetween(
    [0, length, 0],

    [
      0,
      length - 0.16,
      0.11,
    ],

    thickness,
    color,
    12,
  );

  builder.addCylinderBetween(
    [0, length, 0],

    [
      0,
      length - 0.16,
      -0.11,
    ],

    thickness,
    color,
    12,
  );

  return builder.build();
}

function buildFieldRingGeometry(
  color: string,
  radius: number,
): GeometryData {
  const builder =
    new GeometryBuilder();

  builder.addTorusX(
    [0, 0, 0],
    radius,
    0.013,
    color,
    0,
    TWO_PI,
    64,
    6,
  );

  return builder.build();
}

function buildFluxPathGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  [-1.05, 0, 1.05].forEach(
    (x) => {
      [
        0.3,
        0.47,
        0.64,
      ].forEach(
        (
          spread,
          spreadIndex,
        ) => {
          const right: Vec3[] = [
            [x, 0.88, 0],

            [
              x,
              0.72,
              spread * 0.48,
            ],

            [
              x,
              0.42,
              spread * 0.88,
            ],

            [x, 0, spread],

            [
              x,
              -0.42,
              spread * 0.88,
            ],

            [
              x,
              -0.72,
              spread * 0.48,
            ],

            [x, -0.88, 0],
          ];

          const left =
            right.map(
              ([
                pointX,
                pointY,
                pointZ,
              ]) =>
                [
                  pointX,
                  pointY,
                  -pointZ,
                ] as Vec3,
            );

          builder.addTubePolyline(
            right,

            0.009 +
              spreadIndex *
                0.0015,

            COLORS.statorField,
            false,
          );

          builder.addTubePolyline(
            left,

            0.009 +
              spreadIndex *
                0.0015,

            COLORS.statorField,
            false,
          );
        },
      );
    },
  );

  return builder.build();
}

function buildPoleGeometry(
  color: string,
  y: number,
): GeometryData {
  const builder =
    new GeometryBuilder();

  builder.addSphere(
    [0, y, 0],
    0.085,
    color,
    10,
    16,
  );

  return builder.build();
}

function buildDirectionGuideGeometry(): GeometryData {
  const builder =
    new GeometryBuilder();

  const radius = 0.97;

  builder.addTorusX(
    [0, 0, 0],

    radius,
    0.009,
    COLORS.rotation,

    -PI * 0.15,
    PI * 1.28,

    54,
    5,
  );

  builder.addCylinderBetween(
    [
      0,

      Math.cos(
        PI * 1.13,
      ) * radius,

      Math.sin(
        PI * 1.13,
      ) * radius,
    ],

    [
      0,

      Math.cos(
        PI * 1.13,
      ) *
        radius +
        0.11,

      Math.sin(
        PI * 1.13,
      ) *
        radius +
        0.03,
    ],

    0.016,
    COLORS.rotation,
    10,
  );

  builder.addCylinderBetween(
    [
      0,

      Math.cos(
        PI * 1.13,
      ) * radius,

      Math.sin(
        PI * 1.13,
      ) * radius,
    ],

    [
      0,

      Math.cos(
        PI * 1.13,
      ) *
        radius +
        0.035,

      Math.sin(
        PI * 1.13,
      ) *
        radius -
        0.11,
    ],

    0.016,
    COLORS.rotation,
    10,
  );

  return builder.build();
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader =
    gl.createShader(type);

  if (!shader) {
    throw new Error(
      "Unable to create WebGL shader.",
    );
  }

  gl.shaderSource(
    shader,
    source,
  );

  gl.compileShader(shader);

  if (
    !gl.getShaderParameter(
      shader,
      gl.COMPILE_STATUS,
    )
  ) {
    const message =
      gl.getShaderInfoLog(
        shader,
      ) ??
      "Unknown shader compilation error.";

    gl.deleteShader(shader);

    throw new Error(message);
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
): ShaderLocations {
  const vertexSource = `#version 300 es
    precision highp float;

    layout(location = 0) in vec3 aPosition;
    layout(location = 1) in vec3 aNormal;
    layout(location = 2) in vec3 aColor;

    uniform mat4 uMVP;
    uniform mat4 uModel;

    out vec3 vNormal;
    out vec3 vColor;
    out vec3 vWorldPosition;

    void main() {
      vec4 worldPosition =
        uModel *
        vec4(
          aPosition,
          1.0
        );

      vWorldPosition =
        worldPosition.xyz;

      vNormal =
        normalize(
          mat3(uModel) *
          aNormal
        );

      vColor = aColor;

      gl_Position =
        uMVP *
        vec4(
          aPosition,
          1.0
        );
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    in vec3 vNormal;
    in vec3 vColor;
    in vec3 vWorldPosition;

    uniform vec3 uCameraPosition;
    uniform float uOpacity;

    out vec4 outputColor;

    void main() {
      vec3 normal =
        normalize(vNormal);

      vec3 keyLight =
        normalize(
          vec3(
            -0.45,
            0.88,
            0.68
          )
        );

      vec3 fillLight =
        normalize(
          vec3(
            0.72,
            0.25,
            -0.5
          )
        );

      float diffuse =
        max(
          dot(
            normal,
            keyLight
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            fillLight
          ),
          0.0
        ) * 0.22;

      vec3 viewDirection =
        normalize(
          uCameraPosition -
          vWorldPosition
        );

      vec3 halfVector =
        normalize(
          keyLight +
          viewDirection
        );

      float specular =
        pow(
          max(
            dot(
              normal,
              halfVector
            ),
            0.0
          ),
          30.0
        ) * 0.28;

      float rim =
        pow(
          1.0 -
          max(
            dot(
              normal,
              viewDirection
            ),
            0.0
          ),
          2.5
        ) * 0.08;

      vec3 color =
        vColor *
        (
          0.2 +
          diffuse * 0.9 +
          fill
        ) +
        vec3(
          specular +
          rim
        );

      color =
        pow(
          color,
          vec3(
            1.0 / 2.2
          )
        );

      outputColor =
        vec4(
          color,
          uOpacity
        );
    }
  `;

  const vertexShader =
    createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexSource,
    );

  const fragmentShader =
    createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentSource,
    );

  const program =
    gl.createProgram();

  if (!program) {
    throw new Error(
      "Unable to create WebGL program.",
    );
  }

  gl.attachShader(
    program,
    vertexShader,
  );

  gl.attachShader(
    program,
    fragmentShader,
  );

  gl.linkProgram(program);

  gl.deleteShader(
    vertexShader,
  );

  gl.deleteShader(
    fragmentShader,
  );

  if (
    !gl.getProgramParameter(
      program,
      gl.LINK_STATUS,
    )
  ) {
    const message =
      gl.getProgramInfoLog(
        program,
      ) ??
      "Unknown WebGL linking error.";

    gl.deleteProgram(program);

    throw new Error(message);
  }

  const mvp =
    gl.getUniformLocation(
      program,
      "uMVP",
    );

  const model =
    gl.getUniformLocation(
      program,
      "uModel",
    );

  const cameraPosition =
    gl.getUniformLocation(
      program,
      "uCameraPosition",
    );

  const opacity =
    gl.getUniformLocation(
      program,
      "uOpacity",
    );

  if (
    !mvp ||
    !model ||
    !cameraPosition ||
    !opacity
  ) {
    gl.deleteProgram(program);

    throw new Error(
      "Unable to locate required WebGL uniforms.",
    );
  }

  return {
    program,
    mvp,
    model,
    cameraPosition,
    opacity,
  };
}

function uploadGeometry(
  gl: WebGL2RenderingContext,
  geometry: GeometryData,
): GpuGeometry {
  const vao =
    gl.createVertexArray();

  const vertexBuffer =
    gl.createBuffer();

  const indexBuffer =
    gl.createBuffer();

  if (
    !vao ||
    !vertexBuffer ||
    !indexBuffer
  ) {
    throw new Error(
      "Unable to create WebGL buffers.",
    );
  }

  gl.bindVertexArray(vao);

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    vertexBuffer,
  );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    geometry.vertices,
    gl.STATIC_DRAW,
  );

  const stride =
    9 *
    Float32Array
      .BYTES_PER_ELEMENT;

  gl.enableVertexAttribArray(0);

  gl.vertexAttribPointer(
    0,
    3,
    gl.FLOAT,
    false,
    stride,
    0,
  );

  gl.enableVertexAttribArray(1);

  gl.vertexAttribPointer(
    1,
    3,
    gl.FLOAT,
    false,
    stride,

    3 *
      Float32Array
        .BYTES_PER_ELEMENT,
  );

  gl.enableVertexAttribArray(2);

  gl.vertexAttribPointer(
    2,
    3,
    gl.FLOAT,
    false,
    stride,

    6 *
      Float32Array
        .BYTES_PER_ELEMENT,
  );

  gl.bindBuffer(
    gl.ELEMENT_ARRAY_BUFFER,
    indexBuffer,
  );

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    geometry.indices,
    gl.STATIC_DRAW,
  );

  gl.bindVertexArray(null);

  return {
    vao,
    vertexBuffer,
    indexBuffer,

    indexCount:
      geometry.indices.length,
  };
}

function deleteGpuGeometry(
  gl: WebGL2RenderingContext,
  geometry: GpuGeometry,
): void {
  gl.deleteVertexArray(
    geometry.vao,
  );

  gl.deleteBuffer(
    geometry.vertexBuffer,
  );

  gl.deleteBuffer(
    geometry.indexBuffer,
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
}: {
  label: string;
  value: string;
  alert?: boolean;
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
          fontWeight: 800,

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
            ? "#b91c1c"
            : "#0f172a",

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

function WaveformPanel({
  telemetry,
}: {
  telemetry: MotorTelemetry;
}) {
  const width = 640;
  const height = 210;

  const left = 36;
  const right = 14;
  const top = 20;
  const bottom = 30;

  const plotWidth =
    width - left - right;

  const plotHeight =
    height - top - bottom;

  const middleY =
    top + plotHeight / 2;

  const phases = [
    {
      key: "A",
      color: COLORS.phaseA,
      offset: 0,
    },

    {
      key: "B",
      color: COLORS.phaseB,
      offset: -TWO_PI / 3,
    },

    {
      key: "C",
      color: COLORS.phaseC,
      offset: TWO_PI / 3,
    },
  ];

  const paths =
    phases.map((phase) => {
      const points: string[] =
        [];

      for (
        let index = 0;
        index <= 180;
        index += 1
      ) {
        const angle =
          (index / 180) *
          TWO_PI;

        const value =
          Math.cos(
            angle +
              phase.offset,
          );

        const x =
          left +
          (index / 180) *
            plotWidth;

        const y =
          middleY -
          value *
            plotHeight *
            0.36;

        points.push(
          `${
            index === 0
              ? "M"
              : "L"
          }${x.toFixed(
            2,
          )} ${y.toFixed(
            2,
          )}`,
        );
      }

      return {
        ...phase,
        d: points.join(" "),
      };
    });

  const cursorX =
    left +
    (normalizeAngle(
      telemetry.visualElectricalAngle,
    ) /
      TWO_PI) *
      plotWidth;

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          gap: 10,
          marginBottom: 7,
        }}
      >
        <strong
          style={{
            fontSize: 13,
          }}
        >
          Three-phase current waveforms
        </strong>

        <span
          style={{
            color: "#64748b",
            fontSize: 10,
          }}
        >
          {(
            (normalizeAngle(
              telemetry.visualElectricalAngle,
            ) *
              180) /
            PI
          ).toFixed(0)}
          ° electrical
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        role="img"
        aria-label="Balanced three-phase current waveform with electrical angle cursor"
      >
        <rect
          x={left}
          y={top}
          width={plotWidth}
          height={plotHeight}
          rx="6"
          fill="#f8fafc"
          stroke="#dbe2e8"
        />

        {[
          0,
          0.25,
          0.5,
          0.75,
          1,
        ].map((ratio) => (
          <line
            key={ratio}
            x1={
              left +
              ratio *
                plotWidth
            }
            y1={top}
            x2={
              left +
              ratio *
                plotWidth
            }
            y2={
              top +
              plotHeight
            }
            stroke="#e2e8f0"
          />
        ))}

        <line
          x1={left}
          y1={middleY}
          x2={
            left +
            plotWidth
          }
          y2={middleY}
          stroke="#94a3b8"
        />

        {paths.map((phase) => (
          <path
            key={phase.key}
            d={phase.d}
            fill="none"
            stroke={phase.color}
            strokeWidth="2.2"
          />
        ))}

        <line
          x1={cursorX}
          y1={top}
          x2={cursorX}
          y2={
            top +
            plotHeight
          }
          stroke="#111827"
          strokeDasharray="4 4"
        />

        {[
          0,
          90,
          180,
          270,
          360,
        ].map(
          (
            degree,
            index,
          ) => (
            <text
              key={degree}
              x={
                left +
                (index / 4) *
                  plotWidth
              }
              y={
                height - 8
              }
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {degree}°
            </text>
          ),
        )}
      </svg>
    </div>
  );
}

function PhasorPanel({
  telemetry,
  idPrefix,
}: {
  telemetry: MotorTelemetry;
  idPrefix: string;
}) {
  const size = 220;
  const center = size / 2;
  const radius = 78;

  const maximumPhase =
    Math.max(
      Math.abs(
        telemetry.phaseA,
      ),

      Math.abs(
        telemetry.phaseB,
      ),

      Math.abs(
        telemetry.phaseC,
      ),

      0.001,
    );

  const phaseVectors = [
    {
      label: "A",
      value: telemetry.phaseA,
      axis: 0,
      color: COLORS.phaseA,
    },

    {
      label: "B",
      value: telemetry.phaseB,
      axis: -TWO_PI / 3,
      color: COLORS.phaseB,
    },

    {
      label: "C",
      value: telemetry.phaseC,
      axis: TWO_PI / 3,
      color: COLORS.phaseC,
    },
  ];

  const resultantMagnitude =
    Math.hypot(
      telemetry.alphaCurrent,
      telemetry.betaCurrent,
    );

  const resultantAngle =
    Math.atan2(
      telemetry.betaCurrent,
      telemetry.alphaCurrent,
    );

  const resultantScale =
    clamp(
      resultantMagnitude /
        Math.max(
          maximumPhase,
          0.001,
        ),

      0,
      1,
    );

  return (
    <div
      style={{
        ...cardStyle,

        display: "grid",
        alignContent: "start",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          gap: 10,
          marginBottom: 5,
        }}
      >
        <strong
          style={{
            fontSize: 13,
          }}
        >
          Phase MMF and resultant field
        </strong>

        <span
          style={{
            color: "#64748b",
            fontSize: 10,
          }}
        >
          αβ plane
        </span>
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: "block",
          width: "100%",
          maxWidth: 250,
          margin: "0 auto",
        }}
        role="img"
        aria-label="Three phase MMF space vector diagram"
      >
        <defs>
          {[
            COLORS.phaseA,
            COLORS.phaseB,
            COLORS.phaseC,
            COLORS.statorField,
          ].map(
            (
              color,
              index,
            ) => (
              <marker
                key={color}
                id={`${idPrefix}-phasor-${index}`}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path
                  d="M0 0 L7 3.5 L0 7 Z"
                  fill={color}
                />
              </marker>
            ),
          )}
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#f8fafc"
          stroke="#cbd5e1"
        />

        <line
          x1={
            center -
            radius -
            12
          }
          y1={center}
          x2={
            center +
            radius +
            12
          }
          y2={center}
          stroke="#94a3b8"
        />

        <line
          x1={center}
          y1={
            center -
            radius -
            12
          }
          x2={center}
          y2={
            center +
            radius +
            12
          }
          stroke="#94a3b8"
        />

        {phaseVectors.map(
          (
            vector,
            index,
          ) => {
            const direction =
              vector.value < 0
                ? vector.axis +
                  PI
                : vector.axis;

            const magnitude =
              Math.abs(
                vector.value,
              ) /
              maximumPhase;

            const x =
              center +
              Math.cos(
                direction,
              ) *
                radius *
                magnitude;

            const y =
              center -
              Math.sin(
                direction,
              ) *
                radius *
                magnitude;

            return (
              <line
                key={vector.label}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={
                  vector.color
                }
                strokeWidth="2.5"
                markerEnd={`url(#${idPrefix}-phasor-${index})`}
              />
            );
          },
        )}

        <line
          x1={center}
          y1={center}
          x2={
            center +
            Math.cos(
              resultantAngle,
            ) *
              radius *
              resultantScale
          }
          y2={
            center -
            Math.sin(
              resultantAngle,
            ) *
              radius *
              resultantScale
          }
          stroke={
            COLORS.statorField
          }
          strokeWidth="4"
          markerEnd={`url(#${idPrefix}-phasor-3)`}
        />

        <text
          x={
            center +
            radius +
            4
          }
          y={center - 4}
          fontSize="10"
          fill="#64748b"
        >
          α
        </text>

        <text
          x={center + 5}
          y={
            center -
            radius -
            4
          }
          fontSize="10"
          fill="#64748b"
        >
          β
        </text>
      </svg>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap: 6,

          color: "#475569",
          fontSize: 10,
        }}
      >
        <span>
          <b
            style={{
              color:
                COLORS.phaseA,
            }}
          >
            ●
          </b>{" "}
          Phase A MMF
        </span>

        <span>
          <b
            style={{
              color:
                COLORS.phaseB,
            }}
          >
            ●
          </b>{" "}
          Phase B MMF
        </span>

        <span>
          <b
            style={{
              color:
                COLORS.phaseC,
            }}
          >
            ●
          </b>{" "}
          Phase C MMF
        </span>

        <span>
          <b
            style={{
              color:
                COLORS.statorField,
            }}
          >
            ●
          </b>{" "}
          Resultant field
        </span>
      </div>
    </div>
  );
}

export default function AcInductionMotorPhase2({
  className = "",
}: AcInductionMotorPhase2Props) {
  const idPrefix =
    useId().replace(
      /:/g,
      "",
    );

  const torqueMarkerId =
    `${idPrefix}-torque-arrow`;

  const rotationMarkerId =
    `${idPrefix}-rotation-arrow`;

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const viewportRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const torquePathRef =
    useRef<SVGPathElement | null>(
      null,
    );

  const torqueLabelRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const rotationPathRef =
    useRef<SVGPathElement | null>(
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

  const controlsRef =
    useRef<ViewerControls>({
      ...INITIAL_CONTROLS,
    });

  const stepRequestRef =
    useRef(0);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
  });

  const yawRef =
    useRef(-0.58);

  const pitchRef =
    useRef(-0.18);

  const zoomRef =
    useRef(8.8);

  const [
    controls,
    setControls,
  ] = useState<ViewerControls>({
    ...INITIAL_CONTROLS,
  });

  const [
    telemetry,
    setTelemetry,
  ] = useState<MotorTelemetry>({
    ...INITIAL_TELEMETRY,
  });

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const updateControls = (
    updater: (
      current: ViewerControls,
    ) => ViewerControls,
  ): void => {
    setControls((current) => {
      const next =
        updater(current);

      controlsRef.current =
        next;

      return next;
    });
  };

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl =
      canvas.getContext(
        "webgl2",
        {
          antialias: true,
          alpha: false,
          depth: true,

          powerPreference:
            "high-performance",
        },
      );

    if (!gl) {
      setError(
        "WebGL 2 is unavailable in this preview environment.",
      );

      return;
    }

    let shader:
      | ShaderLocations
      | null = null;

    let baseGeometry:
      | GpuGeometry
      | null = null;

    let housingCutGeometry:
      | GpuGeometry
      | null = null;

    let housingFullGeometry:
      | GpuGeometry
      | null = null;

    let statorCutGeometry:
      | GpuGeometry
      | null = null;

    let statorFullGeometry:
      | GpuGeometry
      | null = null;

    let rotorGeometry:
      | GpuGeometry
      | null = null;

    let bearingGeometry:
      | GpuGeometry
      | null = null;

    let fanGuardGeometry:
      | GpuGeometry
      | null = null;

    let airGapGeometry:
      | GpuGeometry
      | null = null;

    let phaseAArrowGeometry:
      | GpuGeometry
      | null = null;

    let phaseBArrowGeometry:
      | GpuGeometry
      | null = null;

    let phaseCArrowGeometry:
      | GpuGeometry
      | null = null;

    let statorFieldArrowGeometry:
      | GpuGeometry
      | null = null;

    let rotorFieldArrowGeometry:
      | GpuGeometry
      | null = null;

    let statorFieldRingGeometry:
      | GpuGeometry
      | null = null;

    let rotorFieldRingGeometry:
      | GpuGeometry
      | null = null;

    let fluxPathGeometry:
      | GpuGeometry
      | null = null;

    let northPoleGeometry:
      | GpuGeometry
      | null = null;

    let southPoleGeometry:
      | GpuGeometry
      | null = null;

    let directionGuideGeometry:
      | GpuGeometry
      | null = null;

    const windingGeometry: Record<
      PhaseKey,
      {
        cut:
          | GpuGeometry
          | null;

        full:
          | GpuGeometry
          | null;
      }
    > = {
      A: {
        cut: null,
        full: null,
      },

      B: {
        cut: null,
        full: null,
      },

      C: {
        cut: null,
        full: null,
      },
    };

    let frameId = 0;

    let previousTime =
      performance.now();

    let previousTelemetryTime = 0;
    let disposed = false;

    const simulationState: SimulationState =
      {
        rotorOmega: 0,
        visualRotorAngle: 0,
        visualElectricalAngle: 0,
        statorFluxPU: 0,
        rotorFluxPU: 0,
      };

    try {
      shader =
        createProgram(gl);

      baseGeometry =
        uploadGeometry(
          gl,
          buildBaseGeometry(),
        );

      housingCutGeometry =
        uploadGeometry(
          gl,
          buildHousingGeometry(
            true,
          ),
        );

      housingFullGeometry =
        uploadGeometry(
          gl,
          buildHousingGeometry(
            false,
          ),
        );

      statorCutGeometry =
        uploadGeometry(
          gl,
          buildStatorGeometry(
            true,
          ),
        );

      statorFullGeometry =
        uploadGeometry(
          gl,
          buildStatorGeometry(
            false,
          ),
        );

      rotorGeometry =
        uploadGeometry(
          gl,
          buildRotorGeometry(),
        );

      bearingGeometry =
        uploadGeometry(
          gl,
          buildBearingGeometry(),
        );

      fanGuardGeometry =
        uploadGeometry(
          gl,
          buildFanGuardGeometry(),
        );

      airGapGeometry =
        uploadGeometry(
          gl,
          buildAirGapGeometry(),
        );

      (
        [
          "A",
          "B",
          "C",
        ] as PhaseKey[]
      ).forEach((phase) => {
        windingGeometry[
          phase
        ].cut = uploadGeometry(
          gl,

          buildPhaseWindingGeometry(
            phase,
            true,
          ),
        );

        windingGeometry[
          phase
        ].full = uploadGeometry(
          gl,

          buildPhaseWindingGeometry(
            phase,
            false,
          ),
        );
      });

      phaseAArrowGeometry =
        uploadGeometry(
          gl,

          buildArrowGeometry(
            COLORS.phaseA,
            0.58,
            0.018,
          ),
        );

      phaseBArrowGeometry =
        uploadGeometry(
          gl,

          buildArrowGeometry(
            COLORS.phaseB,
            0.58,
            0.018,
          ),
        );

      phaseCArrowGeometry =
        uploadGeometry(
          gl,

          buildArrowGeometry(
            COLORS.phaseC,
            0.58,
            0.018,
          ),
        );

      statorFieldArrowGeometry =
        uploadGeometry(
          gl,

          buildArrowGeometry(
            COLORS.statorField,
            0.82,
            0.03,
          ),
        );

      rotorFieldArrowGeometry =
        uploadGeometry(
          gl,

          buildArrowGeometry(
            COLORS.rotorField,
            0.69,
            0.025,
          ),
        );

      statorFieldRingGeometry =
        uploadGeometry(
          gl,

          buildFieldRingGeometry(
            COLORS.statorFieldDark,
            0.84,
          ),
        );

      rotorFieldRingGeometry =
        uploadGeometry(
          gl,

          buildFieldRingGeometry(
            COLORS.rotorField,
            0.71,
          ),
        );

      fluxPathGeometry =
        uploadGeometry(
          gl,
          buildFluxPathGeometry(),
        );

      northPoleGeometry =
        uploadGeometry(
          gl,

          buildPoleGeometry(
            COLORS.north,
            0.88,
          ),
        );

      southPoleGeometry =
        uploadGeometry(
          gl,

          buildPoleGeometry(
            COLORS.south,
            -0.88,
          ),
        );

      directionGuideGeometry =
        uploadGeometry(
          gl,

          buildDirectionGuideGeometry(),
        );
    } catch (setupError) {
      setError(
        setupError instanceof Error
          ? setupError.message
          : "Unable to initialise the motor renderer.",
      );

      return;
    }

    gl.enable(
      gl.DEPTH_TEST,
    );

    gl.depthFunc(
      gl.LEQUAL,
    );

    gl.disable(
      gl.CULL_FACE,
    );

    gl.enable(gl.BLEND);

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
    );

    const resize = (): void => {
      const rect =
        canvas.getBoundingClientRect();

      const pixelRatio =
        Math.min(
          window.devicePixelRatio ||
            1,
          2,
        );

      const width =
        Math.max(
          1,

          Math.floor(
            rect.width *
              pixelRatio,
          ),
        );

      const height =
        Math.max(
          1,

          Math.floor(
            rect.height *
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

      gl.viewport(
        0,
        0,
        width,
        height,
      );
    };

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            resize,
          )
        : null;

    resizeObserver?.observe(
      canvas,
    );

    window.addEventListener(
      "resize",
      resize,
    );

    const drawGeometry = (
      geometry: GpuGeometry,
      model: Mat4,
      viewProjection: Mat4,
      cameraPosition: Vec3,
      opacity = 1,
      depthWrite = true,
    ): Mat4 => {
      if (!shader) {
        return viewProjection;
      }

      const mvp =
        mat4Multiply(
          viewProjection,
          model,
        );

      gl.uniformMatrix4fv(
        shader.mvp,
        false,
        mvp,
      );

      gl.uniformMatrix4fv(
        shader.model,
        false,
        model,
      );

      gl.uniform3f(
        shader.cameraPosition,

        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
      );

      gl.uniform1f(
        shader.opacity,
        opacity,
      );

      gl.depthMask(
        depthWrite &&
          opacity >= 0.999,
      );

      gl.bindVertexArray(
        geometry.vao,
      );

      gl.drawElements(
        gl.TRIANGLES,
        geometry.indexCount,
        gl.UNSIGNED_INT,
        0,
      );

      gl.depthMask(true);

      return mvp;
    };

    const updateFieldOverlay = (
      globalMvp: Mat4,
      statorFieldMvp: Mat4,
      rotorFieldMvp: Mat4,
      activeControls: ViewerControls,
      currentTelemetry: MotorTelemetry,
    ): void => {
      const viewport =
        viewportRef.current;

      if (!viewport) {
        return;
      }

      const rect =
        viewport.getBoundingClientRect();

      const center =
        projectPoint(
          [0, 0, 0],
          globalMvp,
          rect.width,
          rect.height,
        );

      const statorTip =
        projectPoint(
          [0, 0.82, 0],
          statorFieldMvp,
          rect.width,
          rect.height,
        );

      const rotorTip =
        projectPoint(
          [0, 0.69, 0],
          rotorFieldMvp,
          rect.width,
          rect.height,
        );

      const north =
        projectPoint(
          [0, 0.88, 0],
          statorFieldMvp,
          rect.width,
          rect.height,
        );

      const south =
        projectPoint(
          [0, -0.88, 0],
          statorFieldMvp,
          rect.width,
          rect.height,
        );

      const northLabel =
        northLabelRef.current;

      const southLabel =
        southLabelRef.current;

      if (northLabel) {
        northLabel.style.display =
          activeControls.cutaway &&
          activeControls.showPoleMarkers &&
          activeControls.showStatorField &&
          currentTelemetry.statorFluxPU >
            0.02 &&
          north.visible
            ? "grid"
            : "none";

        northLabel.style.left =
          `${north.x}px`;

        northLabel.style.top =
          `${north.y}px`;
      }

      if (southLabel) {
        southLabel.style.display =
          activeControls.cutaway &&
          activeControls.showPoleMarkers &&
          activeControls.showStatorField &&
          currentTelemetry.statorFluxPU >
            0.02 &&
          south.visible
            ? "grid"
            : "none";

        southLabel.style.left =
          `${south.x}px`;

        southLabel.style.top =
          `${south.y}px`;
      }

      const torquePath =
        torquePathRef.current;

      const torqueLabel =
        torqueLabelRef.current;

      if (
        torquePath &&
        torqueLabel &&
        activeControls.cutaway &&
        currentTelemetry.statorFluxPU >
          0.02 &&
        activeControls.showTorqueAngle &&
        activeControls.showStatorField &&
        activeControls.showRotorField &&
        center.visible &&
        statorTip.visible &&
        rotorTip.visible
      ) {
        const statorAngle =
          Math.atan2(
            statorTip.y -
              center.y,

            statorTip.x -
              center.x,
          );

        const rotorAngle =
          Math.atan2(
            rotorTip.y -
              center.y,

            rotorTip.x -
              center.x,
          );

        const delta =
          normalizeSignedAngle(
            rotorAngle -
              statorAngle,
          );

        const radius =
          Math.min(
            Math.hypot(
              statorTip.x -
                center.x,

              statorTip.y -
                center.y,
            ),

            Math.hypot(
              rotorTip.x -
                center.x,

              rotorTip.y -
                center.y,
            ),
          ) * 0.64;

        const startX =
          center.x +
          Math.cos(
            statorAngle,
          ) * radius;

        const startY =
          center.y +
          Math.sin(
            statorAngle,
          ) * radius;

        const endX =
          center.x +
          Math.cos(
            rotorAngle,
          ) * radius;

        const endY =
          center.y +
          Math.sin(
            rotorAngle,
          ) * radius;

        const sweepFlag =
          delta > 0
            ? 1
            : 0;

        torquePath.style.display =
          "block";

        torquePath.setAttribute(
          "d",

          `M ${startX.toFixed(
            2,
          )} ${startY.toFixed(
            2,
          )} A ${radius.toFixed(
            2,
          )} ${radius.toFixed(
            2,
          )} 0 0 ${sweepFlag} ${endX.toFixed(
            2,
          )} ${endY.toFixed(
            2,
          )}`,
        );

        const middleAngle =
          statorAngle +
          delta / 2;

        const labelRadius =
          radius + 24;

        torqueLabel.style.display =
          "block";

        torqueLabel.style.left =
          `${
            center.x +
            Math.cos(
              middleAngle,
            ) *
              labelRadius
          }px`;

        torqueLabel.style.top =
          `${
            center.y +
            Math.sin(
              middleAngle,
            ) *
              labelRadius
          }px`;

        torqueLabel.textContent =
          `δ = ${currentTelemetry.torqueAngleElectricalDeg.toFixed(
            1,
          )}° electrical`;
      } else {
        if (torquePath) {
          torquePath.style.display =
            "none";
        }

        if (torqueLabel) {
          torqueLabel.style.display =
            "none";
        }
      }

      const rotationPath =
        rotationPathRef.current;

      if (
        rotationPath &&
        activeControls.cutaway &&
        currentTelemetry.statorFluxPU >
          0.02 &&
        activeControls.showRotationGuide &&
        center.visible
      ) {
        const radius = 66;

        const startAngle =
          activeControls.direction === 1
            ? -PI * 0.75
            : PI * 0.75;

        const endAngle =
          activeControls.direction === 1
            ? PI * 0.8
            : -PI * 0.8;

        const startX =
          center.x +
          Math.cos(
            startAngle,
          ) * radius;

        const startY =
          center.y +
          Math.sin(
            startAngle,
          ) * radius;

        const endX =
          center.x +
          Math.cos(
            endAngle,
          ) * radius;

        const endY =
          center.y +
          Math.sin(
            endAngle,
          ) * radius;

        const sweepFlag =
          activeControls.direction === 1
            ? 1
            : 0;

        rotationPath.style.display =
          "block";

        rotationPath.setAttribute(
          "d",

          `M ${startX.toFixed(
            2,
          )} ${startY.toFixed(
            2,
          )} A ${radius} ${radius} 0 1 ${sweepFlag} ${endX.toFixed(
            2,
          )} ${endY.toFixed(
            2,
          )}`,
        );
      } else if (rotationPath) {
        rotationPath.style.display =
          "none";
      }
    };

    const render = (
      time: number,
    ): void => {
      if (
        disposed ||
        !shader ||
        !baseGeometry ||
        !housingCutGeometry ||
        !housingFullGeometry ||
        !statorCutGeometry ||
        !statorFullGeometry ||
        !rotorGeometry ||
        !bearingGeometry ||
        !fanGuardGeometry ||
        !airGapGeometry ||
        !phaseAArrowGeometry ||
        !phaseBArrowGeometry ||
        !phaseCArrowGeometry ||
        !statorFieldArrowGeometry ||
        !rotorFieldArrowGeometry ||
        !statorFieldRingGeometry ||
        !rotorFieldRingGeometry ||
        !fluxPathGeometry ||
        !northPoleGeometry ||
        !southPoleGeometry ||
        !directionGuideGeometry
      ) {
        return;
      }

      resize();

      const deltaSeconds =
        Math.min(
          (time -
            previousTime) /
            1000,

          0.05,
        );

      previousTime = time;

      const stepRadians =
        stepRequestRef.current;

      stepRequestRef.current = 0;

      const activeControls =
        controlsRef.current;

      const currentTelemetry =
        stepMotorModel(
          simulationState,
          activeControls,
          deltaSeconds,
          stepRadians,
        );

      gl.clearColor(
        0.918,
        0.945,
        0.962,
        1,
      );

      gl.clear(
        gl.COLOR_BUFFER_BIT |
          gl.DEPTH_BUFFER_BIT,
      );

      gl.useProgram(
        shader.program,
      );

      const projection =
        mat4Perspective(
          (41 * PI) / 180,

          canvas.width /
            canvas.height,

          0.1,
          100,
        );

      const cameraPosition: Vec3 =
        [
          0,
          0.18,
          zoomRef.current,
        ];

      const view =
        mat4LookAt(
          cameraPosition,
          [0, -0.12, 0],
          [0, 1, 0],
        );

      const viewProjection =
        mat4Multiply(
          projection,
          view,
        );

      const globalModel =
        mat4Multiply(
          mat4RotationY(
            yawRef.current,
          ),

          mat4Multiply(
            mat4RotationX(
              pitchRef.current,
            ),

            mat4RotationZ(
              -0.02,
            ),
          ),
        );

      const globalMvp =
        mat4Multiply(
          viewProjection,
          globalModel,
        );

      const rotorModel =
        mat4Multiply(
          globalModel,

          mat4RotationX(
            simulationState
              .visualRotorAngle,
          ),
        );

      if (
        activeControls.showBase
      ) {
        drawGeometry(
          baseGeometry,
          globalModel,
          viewProjection,
          cameraPosition,
        );
      }

      if (
        activeControls.showStator
      ) {
        drawGeometry(
          activeControls.cutaway
            ? statorCutGeometry
            : statorFullGeometry,

          globalModel,
          viewProjection,
          cameraPosition,
        );
      }

      (
        [
          "A",
          "B",
          "C",
        ] as PhaseKey[]
      ).forEach((phase) => {
        if (
          !activeControls
            .phases[phase]
        ) {
          return;
        }

        const selected =
          activeControls.cutaway
            ? windingGeometry[
                phase
              ].cut
            : windingGeometry[
                phase
              ].full;

        if (selected) {
          drawGeometry(
            selected,
            globalModel,
            viewProjection,
            cameraPosition,
          );
        }
      });

      if (
        activeControls.showAirGap
      ) {
        drawGeometry(
          airGapGeometry,
          globalModel,
          viewProjection,
          cameraPosition,
          0.95,
          false,
        );
      }

      if (
        activeControls.showBearings
      ) {
        drawGeometry(
          bearingGeometry,
          globalModel,
          viewProjection,
          cameraPosition,
        );
      }

      if (
        activeControls.showRotor
      ) {
        drawGeometry(
          rotorGeometry,
          rotorModel,
          viewProjection,
          cameraPosition,
        );
      }

      if (
        activeControls.showFanGuard
      ) {
        drawGeometry(
          fanGuardGeometry,
          globalModel,
          viewProjection,
          cameraPosition,
        );
      }

      if (
        activeControls.showHousing
      ) {
        drawGeometry(
          activeControls.cutaway
            ? housingCutGeometry
            : housingFullGeometry,

          globalModel,
          viewProjection,
          cameraPosition,

          activeControls
            .housingOpacity,

          activeControls
            .housingOpacity >=
            0.999,
        );
      }

      const statorFieldScale =
        clamp(
          currentTelemetry
            .statorFluxPU,

          0.05,
          1.2,
        );

      const rotorFieldScale =
        clamp(
          currentTelemetry
            .rotorFluxPU,

          0.05,
          1.1,
        );

      const statorFieldModel =
        mat4Multiply(
          globalModel,

          mat4Multiply(
            mat4RotationX(
              currentTelemetry
                .statorFieldMechanicalAngle,
            ),

            mat4Scale(
              1,
              statorFieldScale,
              statorFieldScale,
            ),
          ),
        );

      const rotorFieldModel =
        mat4Multiply(
          globalModel,

          mat4Multiply(
            mat4RotationX(
              currentTelemetry
                .rotorFieldMechanicalAngle,
            ),

            mat4Scale(
              1,
              rotorFieldScale,
              rotorFieldScale,
            ),
          ),
        );

      const statorFieldMvp =
        mat4Multiply(
          viewProjection,
          statorFieldModel,
        );

      const rotorFieldMvp =
        mat4Multiply(
          viewProjection,
          rotorFieldModel,
        );

      const fieldVisible =
        activeControls.cutaway &&
        currentTelemetry.statorFluxPU >
          0.02 &&
        (
          activeControls.showPhaseMMF ||
          activeControls.showStatorField ||
          activeControls.showRotorField ||
          activeControls.showFluxLines
        );

      if (fieldVisible) {
        gl.disable(
          gl.DEPTH_TEST,
        );

        if (
          activeControls
            .showStatorField
        ) {
          drawGeometry(
            statorFieldRingGeometry,
            globalModel,
            viewProjection,
            cameraPosition,
            0.88,
            false,
          );

          drawGeometry(
            statorFieldArrowGeometry,
            statorFieldModel,
            viewProjection,
            cameraPosition,
            1,
            false,
          );
        }

        if (
          activeControls
            .showFluxLines
        ) {
          drawGeometry(
            fluxPathGeometry,
            statorFieldModel,
            viewProjection,
            cameraPosition,
            0.82,
            false,
          );
        }

        if (
          activeControls
            .showRotorField
        ) {
          drawGeometry(
            rotorFieldRingGeometry,
            globalModel,
            viewProjection,
            cameraPosition,
            0.8,
            false,
          );

          drawGeometry(
            rotorFieldArrowGeometry,
            rotorFieldModel,
            viewProjection,
            cameraPosition,
            1,
            false,
          );
        }

        if (
          activeControls
            .showPoleMarkers
        ) {
          drawGeometry(
            northPoleGeometry,
            statorFieldModel,
            viewProjection,
            cameraPosition,
            1,
            false,
          );

          drawGeometry(
            southPoleGeometry,
            statorFieldModel,
            viewProjection,
            cameraPosition,
            1,
            false,
          );
        }

        if (
          activeControls
            .showRotationGuide
        ) {
          const directionModel =
            activeControls.direction ===
            1
              ? globalModel
              : mat4Multiply(
                  globalModel,

                  mat4RotationX(
                    PI,
                  ),
                );

          drawGeometry(
            directionGuideGeometry,
            directionModel,
            viewProjection,
            cameraPosition,
            0.8,
            false,
          );
        }

        if (
          activeControls
            .showPhaseMMF
        ) {
          const phaseMaximum =
            Math.max(
              Math.abs(
                currentTelemetry
                  .phaseA,
              ),

              Math.abs(
                currentTelemetry
                  .phaseB,
              ),

              Math.abs(
                currentTelemetry
                  .phaseC,
              ),

              0.001,
            );

          const phaseDefinitions: Array<{
            geometry: GpuGeometry;
            value: number;
            electricalAxis: number;
          }> = [
            {
              geometry:
                phaseAArrowGeometry,

              value:
                currentTelemetry
                  .phaseA,

              electricalAxis: 0,
            },

            {
              geometry:
                phaseBArrowGeometry,

              value:
                currentTelemetry
                  .phaseB,

              electricalAxis:
                -TWO_PI / 3,
            },

            {
              geometry:
                phaseCArrowGeometry,

              value:
                currentTelemetry
                  .phaseC,

              electricalAxis:
                TWO_PI / 3,
            },
          ];

          phaseDefinitions.forEach(
            (phase) => {
              const magnitude =
                Math.abs(
                  phase.value,
                ) /
                phaseMaximum;

              if (
                magnitude < 0.02
              ) {
                return;
              }

              const electricalDirection =
                phase.electricalAxis +
                (
                  phase.value < 0
                    ? PI
                    : 0
                );

              const mechanicalDirection =
                electricalDirection /
                Math.max(
                  activeControls.poles /
                    2,

                  1,
                );

              const phaseScale =
                0.18 +
                magnitude *
                  0.7;

              const phaseModel =
                mat4Multiply(
                  globalModel,

                  mat4Multiply(
                    mat4RotationX(
                      mechanicalDirection,
                    ),

                    mat4Scale(
                      1,
                      phaseScale,
                      phaseScale,
                    ),
                  ),
                );

              drawGeometry(
                phase.geometry,
                phaseModel,
                viewProjection,
                cameraPosition,
                1,
                false,
              );
            },
          );
        }

        gl.enable(
          gl.DEPTH_TEST,
        );
      }

      updateFieldOverlay(
        globalMvp,
        statorFieldMvp,
        rotorFieldMvp,
        activeControls,
        currentTelemetry,
      );

      gl.bindVertexArray(null);

      if (
        time -
          previousTelemetryTime >=
        100
      ) {
        previousTelemetryTime =
          time;

        setTelemetry(
          currentTelemetry,
        );
      }

      frameId =
        requestAnimationFrame(
          render,
        );
    };

    resize();

    frameId =
      requestAnimationFrame(
        render,
      );

    return () => {
      disposed = true;

      cancelAnimationFrame(
        frameId,
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        resize,
      );

      [
        baseGeometry,

        housingCutGeometry,
        housingFullGeometry,

        statorCutGeometry,
        statorFullGeometry,

        rotorGeometry,
        bearingGeometry,
        fanGuardGeometry,
        airGapGeometry,

        windingGeometry.A.cut,
        windingGeometry.A.full,

        windingGeometry.B.cut,
        windingGeometry.B.full,

        windingGeometry.C.cut,
        windingGeometry.C.full,

        phaseAArrowGeometry,
        phaseBArrowGeometry,
        phaseCArrowGeometry,

        statorFieldArrowGeometry,
        rotorFieldArrowGeometry,

        statorFieldRingGeometry,
        rotorFieldRingGeometry,

        fluxPathGeometry,
        northPoleGeometry,
        southPoleGeometry,
        directionGuideGeometry,
      ].forEach((geometry) => {
        if (geometry) {
          deleteGpuGeometry(
            gl,
            geometry,
          );
        }
      });

      if (shader) {
        gl.deleteProgram(
          shader.program,
        );
      }
    };
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): void => {
    dragRef.current = {
      active: true,
      pointerId:
        event.pointerId,
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
    const drag =
      dragRef.current;

    if (
      !drag.active ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      drag.x;

    const deltaY =
      event.clientY -
      drag.y;

    drag.x =
      event.clientX;

    drag.y =
      event.clientY;

    yawRef.current +=
      deltaX *
      0.0075;

    pitchRef.current =
      clamp(
        pitchRef.current +
          deltaY *
            0.006,

        -1.08,
        1.08,
      );
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): void => {
    if (
      dragRef.current
        .pointerId ===
      event.pointerId
    ) {
      dragRef.current.active =
        false;

      dragRef.current.pointerId =
        -1;
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

    zoomRef.current =
      clamp(
        zoomRef.current +
          event.deltaY *
            0.008,

        6.3,
        14,
      );
  };

  const resetView = (): void => {
    yawRef.current = -0.58;
    pitchRef.current = -0.18;
    zoomRef.current = 8.8;
  };

  const synchronousFormula =
    (120 *
      controls.frequency) /
    controls.poles;

  return (
    <section
      className={className}
      style={{
        width: "100%",
        overflow: "hidden",

        border: 0,

        background:
          COLORS.background,

        color: "#111827",

        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .phase2-canvas {
          cursor: grab;
        }

        .phase2-canvas:active {
          cursor: grabbing;
        }

        .phase2-button:hover {
          filter: brightness(0.97);
        }

        .phase2-main {
          display: grid;
          grid-template-columns: 350px minmax(0, 1fr);
          min-height: 760px;
        }

        .phase2-panel {
          max-height: 900px;
          overflow-y: auto;
        }

        .phase2-analysis {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(270px, 0.8fr);
          gap: 12px;
          padding: 12px;
          border-top: 1px solid #cbd5e1;
          background: #f8fafc;
        }

        @media (max-width: 1080px) {
          .phase2-main {
            grid-template-columns: 1fr;
          }

          .phase2-panel {
            max-height: none;
            border-right: 0 !important;
            border-bottom: 1px solid #cbd5e1;
          }

          .phase2-analysis {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header
        style={{
          display: "flex",
          flexWrap: "wrap",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap: 14,

          padding:
            "14px 18px",

          borderBottom:
            "1px solid #cbd5e1",

          background:
            "#ffffff",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,

              fontSize: 22,
              fontWeight: 850,

              letterSpacing:
                "-0.025em",
            }}
          >
            AC INDUCTION MOTOR — PHASE 2
            ELECTROMAGNETIC FIELD
          </h1>

          <p
            style={{
              margin:
                "4px 0 0",

              color: "#64748b",

              fontSize: 13,
            }}
          >
            Three-phase MMF vectors,
            rotating stator field, N/S
            poles, air-gap flux paths,
            rotor field and torque-angle
            visualization
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
            className="phase2-button"
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
                  ? "#047857"
                  : "#b91c1c",

              background:
                controls.powered
                  ? "#047857"
                  : "#ffffff",

              color:
                controls.powered
                  ? "#ffffff"
                  : "#b91c1c",
            }}
          >
            {controls.powered
              ? "Stop Motor"
              : "Start Motor"}
          </button>

          <button
            type="button"
            className="phase2-button"
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
                  ? "#7c3aed"
                  : "#cbd5e1",

              background:
                controls.paused
                  ? "#7c3aed"
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
            className="phase2-button"
            onClick={() => {
              stepRequestRef.current +=
                PI / 6;

              updateControls(
                (current) => ({
                  ...current,
                  paused: true,
                }),
              );
            }}
            style={buttonStyle}
          >
            Step 30°
          </button>

          <button
            type="button"
            className="phase2-button"
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
            className="phase2-button"
            onClick={resetView}
            style={buttonStyle}
          >
            Reset View
          </button>
        </div>
      </header>

      <div className="phase2-main">
        <aside
          className="phase2-panel"
          style={{
            display: "grid",
            alignContent: "start",

            gap: 10,
            padding: 12,

            borderRight:
              "1px solid #cbd5e1",

            background:
              "#f8fafc",
          }}
        >
          <div style={cardStyle}>
            <h2
              style={{
                margin:
                  "0 0 10px",

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
                gap: 12,
              }}
            >
              <ControlSlider
                label="Supply frequency"
                value={
                  controls.frequency
                }
                minimum={10}
                maximum={60}
                step={1}
                unit="Hz"
                onChange={(
                  frequency,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      frequency,
                    }),
                  )
                }
              />

              <ControlSlider
                label="Line voltage"
                value={
                  controls.voltage
                }
                minimum={80}
                maximum={460}
                step={5}
                unit="V"
                onChange={(voltage) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      voltage,
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
                maximum={120}
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

              <label
                style={{
                  display: "grid",
                  gap: 6,

                  color: "#334155",

                  fontSize: 12,
                  fontWeight: 720,
                }}
              >
                <span>
                  Number of poles
                </span>

                <select
                  value={
                    controls.poles
                  }
                  onChange={(event) =>
                    updateControls(
                      (current) => ({
                        ...current,

                        poles:
                          Number(
                            event.target
                              .value,
                          ),
                      }),
                    )
                  }
                  style={{
                    width: "100%",

                    border:
                      "1px solid #cbd5e1",

                    borderRadius: 7,

                    background:
                      "#ffffff",

                    padding:
                      "8px 9px",

                    color: "#0f172a",
                    fontWeight: 700,
                  }}
                >
                  {[2, 4, 6, 8].map(
                    (poles) => (
                      <option
                        key={poles}
                        value={poles}
                      >
                        {poles} poles
                      </option>
                    ),
                  )}
                </select>
              </label>

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
                  CW sequence
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
                  CCW sequence
                </button>
              </div>

              <ControlSlider
                label="Teaching playback"
                value={
                  controls.playbackRate
                }
                minimum={0.05}
                maximum={1}
                step={0.05}
                unit="×"
                onChange={(
                  playbackRate,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      playbackRate,
                    }),
                  )
                }
              />

              <div
                style={{
                  borderRadius: 8,

                  background:
                    "#eff6ff",

                  padding: 9,

                  color: "#1e3a8a",

                  fontSize: 11,
                  lineHeight: 1.45,
                }}
              >
                <strong>
                  Nₛ = 120f / P
                </strong>

                <br />

                Nₛ = 120 ×{" "}
                {controls.frequency} /{" "}
                {controls.poles} ={" "}
                {synchronousFormula.toFixed(
                  0,
                )}{" "}
                rpm
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin:
                  "0 0 10px",

                fontSize: 13,
                fontWeight: 850,
              }}
            >
              ELECTROMAGNETIC VISUALIZATION
            </h2>

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              <ToggleRow
                label="Phase A/B/C MMF vectors"
                checked={
                  controls.showPhaseMMF
                }
                color={
                  COLORS.phaseA
                }
                onChange={(
                  showPhaseMMF,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showPhaseMMF,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Resultant stator field"
                checked={
                  controls.showStatorField
                }
                color={
                  COLORS.statorField
                }
                onChange={(
                  showStatorField,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showStatorField,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Induced rotor field"
                checked={
                  controls.showRotorField
                }
                color={
                  COLORS.rotorField
                }
                onChange={(
                  showRotorField,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showRotorField,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Curved air-gap flux paths"
                checked={
                  controls.showFluxLines
                }
                color={
                  COLORS.statorField
                }
                onChange={(
                  showFluxLines,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showFluxLines,
                    }),
                  )
                }
              />

              <ToggleRow
                label="North and south poles"
                checked={
                  controls.showPoleMarkers
                }
                color={COLORS.north}
                onChange={(
                  showPoleMarkers,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showPoleMarkers,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Torque-angle arc"
                checked={
                  controls.showTorqueAngle
                }
                color={
                  COLORS.torque
                }
                onChange={(
                  showTorqueAngle,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showTorqueAngle,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Field rotation guide"
                checked={
                  controls.showRotationGuide
                }
                color={
                  COLORS.rotation
                }
                onChange={(
                  showRotationGuide,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showRotationGuide,
                    }),
                  )
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: 5,
                marginTop: 10,

                color: "#475569",

                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <span>
                <b
                  style={{
                    color:
                      COLORS.phaseA,
                  }}
                >
                  ●
                </b>{" "}
                Phase A MMF
              </span>

              <span>
                <b
                  style={{
                    color:
                      COLORS.phaseB,
                  }}
                >
                  ●
                </b>{" "}
                Phase B MMF
              </span>

              <span>
                <b
                  style={{
                    color:
                      COLORS.phaseC,
                  }}
                >
                  ●
                </b>{" "}
                Phase C MMF
              </span>

              <span>
                <b
                  style={{
                    color:
                      COLORS.statorField,
                  }}
                >
                  ●
                </b>{" "}
                Stator field
              </span>

              <span>
                <b
                  style={{
                    color:
                      COLORS.rotorField,
                  }}
                >
                  ●
                </b>{" "}
                Rotor field
              </span>

              <span>
                <b
                  style={{
                    color:
                      COLORS.torque,
                  }}
                >
                  ●
                </b>{" "}
                Torque angle δ
              </span>
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                margin:
                  "0 0 10px",

                fontSize: 13,
                fontWeight: 850,
              }}
            >
              CONSTRUCTION VISIBILITY
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
                label="Housing and end covers"
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
                label="Stator core, teeth and slots"
                checked={
                  controls.showStator
                }
                onChange={(
                  showStator,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showStator,
                    }),
                  )
                }
              />

              <ToggleRow
                label="Rotor, shaft and fan"
                checked={
                  controls.showRotor
                }
                onChange={(
                  showRotor,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showRotor,
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

              <ToggleRow
                label="Uniform air-gap guide"
                checked={
                  controls.showAirGap
                }
                color={
                  COLORS.airGap
                }
                onChange={(
                  showAirGap,
                ) =>
                  updateControls(
                    (current) => ({
                      ...current,
                      showAirGap,
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
                margin:
                  "0 0 9px",

                fontSize: 13,
                fontWeight: 850,
              }}
            >
              LIVE ELECTROMAGNETIC DATA
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
                label="Synchronous speed"
                value={`${telemetry.synchronousRpm.toFixed(
                  0,
                )} rpm`}
              />

              <TelemetryItem
                label="Rotor speed"
                value={`${telemetry.rotorRpm.toFixed(
                  0,
                )} rpm`}
              />

              <TelemetryItem
                label="Slip"
                value={`${telemetry.slipPercent.toFixed(
                  1,
                )} %`}
                alert={
                  telemetry.slipPercent >
                  20
                }
              />

              <TelemetryItem
                label="Rotor frequency"
                value={`${telemetry.slipFrequencyHz.toFixed(
                  2,
                )} Hz`}
              />

              <TelemetryItem
                label="Line current"
                value={`${telemetry.lineCurrentA.toFixed(
                  1,
                )} A`}
                alert={
                  telemetry.lineCurrentA >
                  RATED_CURRENT *
                    1.6
                }
              />

              <TelemetryItem
                label="EM torque"
                value={`${telemetry.electromagneticTorqueNm.toFixed(
                  1,
                )} Nm`}
              />

              <TelemetryItem
                label="Load torque"
                value={`${telemetry.loadTorqueNm.toFixed(
                  1,
                )} Nm`}
              />

              <TelemetryItem
                label="Torque angle"
                value={`${telemetry.torqueAngleElectricalDeg.toFixed(
                  1,
                )}° e`}
              />

              <TelemetryItem
                label="Stator flux"
                value={`${telemetry.statorFluxPU.toFixed(
                  2,
                )} p.u.`}
              />

              <TelemetryItem
                label="Rotor flux"
                value={`${telemetry.rotorFluxPU.toFixed(
                  2,
                )} p.u.`}
              />
            </div>
          </div>
        </aside>

        <div
          ref={viewportRef}
          style={{
            position: "relative",

            width: "100%",
            minHeight: 760,

            overflow: "hidden",

            background:
              "radial-gradient(circle at 50% 35%, #ffffff 0%, #edf3f6 58%, #dbe3e8 100%)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="phase2-canvas"
            aria-label="Interactive three-dimensional AC induction motor electromagnetic field model"
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
              minHeight: 760,

              touchAction:
                "none",

              outline: "none",
            }}
          />

          {error ? (
            <div
              style={{
                position: "absolute",
                inset: 20,

                display: "grid",
                placeItems: "center",

                border:
                  "1px solid #fca5a5",

                borderRadius: 12,

                background:
                  "rgba(254,242,242,0.96)",

                color: "#991b1b",

                padding: 24,

                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          ) : null}

          <svg
            aria-hidden="true"
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              inset: 0,

              pointerEvents:
                "none",

              overflow:
                "visible",

              zIndex: 8,
            }}
          >
            <defs>
              <marker
                id={
                  torqueMarkerId
                }
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0 0 L8 4 L0 8 Z"
                  fill={
                    COLORS.torque
                  }
                />
              </marker>

              <marker
                id={
                  rotationMarkerId
                }
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0 0 L8 4 L0 8 Z"
                  fill={
                    COLORS.rotation
                  }
                />
              </marker>
            </defs>

            <path
              ref={torquePathRef}
              fill="none"
              stroke={
                COLORS.torque
              }
              strokeWidth="2.4"
              strokeDasharray="6 4"
              markerEnd={`url(#${torqueMarkerId})`}
            />

            <path
              ref={
                rotationPathRef
              }
              fill="none"
              stroke={
                COLORS.rotation
              }
              strokeWidth="2"
              strokeDasharray="7 5"
              markerEnd={`url(#${rotationMarkerId})`}
            />
          </svg>

          <div
            ref={northLabelRef}
            style={{
              position: "absolute",
              zIndex: 10,

              width: 25,
              height: 25,

              marginLeft: -12.5,
              marginTop: -12.5,

              display: "none",
              placeItems: "center",

              border:
                "2px solid #ffffff",

              borderRadius: 999,

              background:
                COLORS.north,

              color: "#ffffff",

              fontSize: 12,
              fontWeight: 900,

              pointerEvents:
                "none",

              boxShadow:
                "0 4px 12px rgba(15,23,42,0.22)",
            }}
          >
            N
          </div>

          <div
            ref={southLabelRef}
            style={{
              position: "absolute",
              zIndex: 10,

              width: 25,
              height: 25,

              marginLeft: -12.5,
              marginTop: -12.5,

              display: "none",
              placeItems: "center",

              border:
                "2px solid #ffffff",

              borderRadius: 999,

              background:
                COLORS.south,

              color: "#ffffff",

              fontSize: 12,
              fontWeight: 900,

              pointerEvents:
                "none",

              boxShadow:
                "0 4px 12px rgba(15,23,42,0.22)",
            }}
          >
            S
          </div>

          <div
            ref={torqueLabelRef}
            style={{
              position: "absolute",
              zIndex: 10,

              display: "none",

              transform:
                "translate(-50%, -50%)",

              border: `1px solid ${COLORS.torque}`,

              borderRadius: 7,

              background:
                "rgba(255,255,255,0.94)",

              padding:
                "5px 7px",

              color:
                COLORS.torque,

              fontSize: 10,
              fontWeight: 850,

              whiteSpace:
                "nowrap",

              pointerEvents:
                "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 14,
              top: 14,

              maxWidth: 330,

              border:
                "1px solid rgba(148,163,184,0.78)",

              borderRadius: 9,

              background:
                "rgba(255,255,255,0.94)",

              padding: 10,

              color: "#334155",

              fontSize: 11,
              lineHeight: 1.45,

              boxShadow:
                "0 4px 14px rgba(15,23,42,0.1)",
            }}
          >
            <strong>
              Field formation sequence
            </strong>

            <br />

            iA, iB, iC → phase MMFs →
            resultant stator field →
            induced rotor field → torque
            angle δ → electromagnetic
            torque
          </div>

          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,

              display: "grid",
              gap: 7,

              pointerEvents:
                "none",

              zIndex: 12,
            }}
          >
            <div
              style={{
                border:
                  "1px solid rgba(148,163,184,0.78)",

                borderRadius: 8,

                background:
                  "rgba(255,255,255,0.94)",

                padding:
                  "7px 10px",

                color:
                  controls.powered
                    ? "#047857"
                    : "#b91c1c",

                fontSize: 11,
                fontWeight: 850,
              }}
            >
              MOTOR:{" "}
              {controls.powered
                ? "ENERGIZED"
                : "OFF"}
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(148,163,184,0.78)",

                borderRadius: 8,

                background:
                  "rgba(255,255,255,0.94)",

                padding:
                  "7px 10px",

                color: "#334155",

                fontSize: 11,
                fontWeight: 850,
              }}
            >
              FIELD:{" "}
              {telemetry.synchronousRpm.toFixed(
                0,
              )}{" "}
              RPM{" "}
              {telemetry.fieldDirection}
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(148,163,184,0.78)",

                borderRadius: 8,

                background:
                  "rgba(255,255,255,0.94)",

                padding:
                  "7px 10px",

                color: "#334155",

                fontSize: 11,
                fontWeight: 850,
              }}
            >
              ROTOR:{" "}
              {Math.abs(
                telemetry.rotorRpm,
              ).toFixed(0)}{" "}
              RPM
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(148,163,184,0.78)",

                borderRadius: 8,

                background:
                  "rgba(255,255,255,0.94)",

                padding:
                  "7px 10px",

                color:
                  telemetry.slipPercent >
                  20
                    ? "#b91c1c"
                    : "#334155",

                fontSize: 11,
                fontWeight: 850,
              }}
            >
              SLIP:{" "}
              {telemetry.slipPercent.toFixed(
                1,
              )}
              %
            </div>

            <div
              style={{
                border:
                  "1px solid rgba(148,163,184,0.78)",

                borderRadius: 8,

                background:
                  "rgba(255,255,255,0.94)",

                padding:
                  "7px 10px",

                color:
                  COLORS.torque,

                fontSize: 11,
                fontWeight: 850,
              }}
            >
              δ:{" "}
              {telemetry.torqueAngleElectricalDeg.toFixed(
                1,
              )}
              ° ELECTRICAL
            </div>
          </div>

          <div
            style={{
              position: "absolute",

              left: 14,
              bottom: 14,

              pointerEvents:
                "none",

              border:
                "1px solid rgba(148,163,184,0.78)",

              borderRadius: 8,

              background:
                "rgba(255,255,255,0.92)",

              padding:
                "8px 10px",

              color: "#475569",

              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Drag: rotate · Wheel: zoom ·
            Pause and step through the
            electrical cycle
          </div>
        </div>
      </div>

      <div className="phase2-analysis">
        <WaveformPanel
          telemetry={telemetry}
        />

        <PhasorPanel
          telemetry={telemetry}
          idPrefix={idPrefix}
        />
      </div>

      <footer
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: 10,
          padding: 12,

          borderTop:
            "1px solid #cbd5e1",

          background:
            "#ffffff",
        }}
      >
        <div
          style={{
            ...cardStyle,

            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <strong>
            Electrical angle
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            θₑ = 2πft
          </span>
        </div>

        <div
          style={{
            ...cardStyle,

            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <strong>
            Mechanical field angle
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            θₘ = θₑ / pole pairs
          </span>
        </div>

        <div
          style={{
            ...cardStyle,

            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <strong>Slip</strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            s = (Nₛ − Nᵣ) / Nₛ
          </span>
        </div>

        <div
          style={{
            ...cardStyle,

            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <strong>
            Rotor electrical frequency
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            fᵣ = s × f
          </span>
        </div>

        <div
          style={{
            ...cardStyle,

            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <strong>
            Torque production
          </strong>

          <br />

          <span
            style={{
              color: "#64748b",
            }}
          >
            Tₑ ∝ Φₛ Φᵣ sin δ
          </span>
        </div>
      </footer>
    </section>
  );
}