'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

type ControlMode =
  | 'MANUAL_VALVE'
  | 'AUTO_SPEED';

type BreakerState =
  | 'OPEN'
  | 'ARMED'
  | 'CLOSED'
  | 'TRIPPED';

type PartId =
  | 'foundation'
  | 'steamInlet'
  | 'governorValve'
  | 'nozzleChest'
  | 'steamJet'
  | 'movingBlades'
  | 'rotor'
  | 'casing'
  | 'exhaust'
  | 'glandSeal'
  | 'shaft'
  | 'bearing'
  | 'oilSystem'
  | 'coupling'
  | 'generator'
  | 'generatorRotor'
  | 'generatorStator'
  | 'electricalOutput';

type SimulationState = {
  visualAngleDeg: number;
  phaseDifferenceDeg: number;
  governorIntegral: number;

  omegaRadS: number;
  rpm: number;
  angularAccelerationRadS2: number;

  valveCommand: number;
  valvePosition: number;

  steamSourcePressureBar: number;
  exhaustPressureBar: number;
  pressureRatio: number;
  pressureDropBar: number;

  nozzleAreaM2: number;
  chokedFlow: boolean;

  massFlowKgS: number;
  jetVelocityMS: number;

  exhaustDensityKgM3: number;
  exhaustVelocityMS: number;

  bladeSpeedMS: number;
  speedRatio: number;

  steamTorqueNm: number;
  generatorLoadTorqueNm: number;
  synchronizingTorqueNm: number;
  electromagneticTorqueNm: number;
  frictionTorqueNm: number;
  netTorqueNm: number;

  turbinePowerKW: number;
  generatorMechanicalPowerKW: number;
  electricalExportKW: number;
  gridImportKW: number;

  stageEfficiency: number;
  generatorEfficiency: number;

  generatedFrequencyHz: number;
  terminalFrequencyHz: number;

  generatedVoltageV: number;
  terminalVoltageV: number;
  outputCurrentA: number;

  oilPressureBar: number;
  oilTemperatureC: number;
  bearingTemperatureC: number;
  vibrationMmS: number;
};

type ControlsSnapshot = {
  running: boolean;

  controlMode: ControlMode;
  manualValvePercent: number;
  speedSetpointPercent: number;

  electricalLoadPercent: number;
  excitationPercent: number;

  tripActive: boolean;
  breakerClosed: boolean;
  autoSyncArmed: boolean;
};

type MetricDefinition = {
  label: string;
  value: string;
  unit?: string;
  active?: boolean;
  warning?: boolean;
};

type SurfaceMark = {
  y: number;
  opacity: number;
  width: number;
};

type SvgIds = Record<
  | 'steamArrow'
  | 'forceArrow'
  | 'oilArrow'
  | 'electricArrow'
  | 'labelArrow'
  | 'castSteel'
  | 'rearCastSteel'
  | 'machinedSteel'
  | 'rotorSteel'
  | 'rotorSide'
  | 'bladeFront'
  | 'bladeRear'
  | 'cavity'
  | 'exhaust'
  | 'copper'
  | 'generatorRotor'
  | 'oil'
  | 'steamGradient'
  | 'inletSteamGradient'
  | 'exhaustSteamGradient'
  | 'cutFace'
  | 'shadow'
  | 'steamGlow'
  | 'steamTurbulence'
  | 'texture'
  | 'rearRotorClip'
  | 'shaftClip'
  | 'journalClip'
  | 'generatorRotorClip'
  | 'valvePortClip'
  | 'exhaustClip',
  string
>;

const RATED_RPM = 3600;
const MAX_RPM = 4200;
const OVERSPEED_TRIP_RPM = 3960;

const GRID_FREQUENCY_HZ = 60;
const GENERATOR_POLES = 2;

const RATED_VOLTAGE_V = 480;
const RATED_GENERATOR_POWER_KW = 220;
const GENERATOR_POWER_FACTOR = 0.9;

const SYNCHRONOUS_OMEGA_RAD_S =
  (RATED_RPM * 2 * Math.PI) / 60;

const MAX_OMEGA_RAD_S =
  (MAX_RPM * 2 * Math.PI) / 60;

const DISPLAY_RPS_AT_RATED_SPEED =
  0.68;

const MAX_NOZZLE_AREA_M2 =
  8e-4;

const APPROX_MAX_MASS_FLOW_KG_S =
  1.96;

const INITIAL_STATE: SimulationState = {
  visualAngleDeg: 0,
  phaseDifferenceDeg: 0,
  governorIntegral: 0,

  omegaRadS: 0,
  rpm: 0,
  angularAccelerationRadS2: 0,

  valveCommand: 0,
  valvePosition: 0,

  steamSourcePressureBar: 22,
  exhaustPressureBar: 1.05,
  pressureRatio: 1.05 / 22,
  pressureDropBar: 20.95,

  nozzleAreaM2: 0,
  chokedFlow: false,

  massFlowKgS: 0,
  jetVelocityMS: 0,

  exhaustDensityKgM3: 0.55,
  exhaustVelocityMS: 0,

  bladeSpeedMS: 0,
  speedRatio: 0,

  steamTorqueNm: 0,
  generatorLoadTorqueNm: 0,
  synchronizingTorqueNm: 0,
  electromagneticTorqueNm: 0,
  frictionTorqueNm: 0,
  netTorqueNm: 0,

  turbinePowerKW: 0,
  generatorMechanicalPowerKW: 0,
  electricalExportKW: 0,
  gridImportKW: 0,

  stageEfficiency: 0,
  generatorEfficiency: 0.9,

  generatedFrequencyHz: 0,
  terminalFrequencyHz: 0,

  generatedVoltageV: 0,
  terminalVoltageV: 0,
  outputCurrentA: 0,

  oilPressureBar: 2.4,
  oilTemperatureC: 32,
  bearingTemperatureC: 35,
  vibrationMmS: 0.35,
};

const PART_INFORMATION: Record<
  PartId,
  {
    title: string;
    description: string;
  }
> = {
  foundation: {
    title:
      'Foundation and Supports',

    description:
      'The common bedplate, turbine support, bearing pedestal and generator feet maintain the common shaft centreline.',
  },

  steamInlet: {
    title:
      'Pressurised Steam Inlet',

    description:
      'The inlet remains pressurised upstream of the stop valve. Animated streamlines appear only when the valve passes mass flow.',
  },

  governorValve: {
    title:
      'Governor and Stop Valve',

    description:
      'The sliding gate physically uncovers the steam port. Manual mode follows the slider; automatic mode uses PI speed governing.',
  },

  nozzleChest: {
    title:
      'Nozzle Chest and Converging Nozzle',

    description:
      'Steam expands through converging passages. Flow traces contract and accelerate toward the nozzle throat and blade tangent.',
  },

  steamJet: {
    title:
      'High-Velocity Steam Jet',

    description:
      'A narrow, high-speed core strikes only a few upper blade passages. The jet disappears completely at zero valve opening.',
  },

  movingBlades: {
    title:
      'Impulse Moving Blades',

    description:
      'The rotating buckets turn the relative steam velocity and convert tangential momentum change into shaft torque.',
  },

  rotor: {
    title:
      'Turbine Rotor',

    description:
      'The blade row, wheel, hub and shaft rotate together. Display rotation is slowed while physical RPM remains unchanged.',
  },

  casing: {
    title:
      'Horizontally Split Casing',

    description:
      'The casing contains the pressure boundary and diffuser. Split flanges remain outside the open rotor cavity.',
  },

  exhaust: {
    title:
      'Exhaust Hood and Diffuser',

    description:
      'The exhaust stream expands, slows and spreads through the diffuser. Curved streamlines follow the hood rather than moving as parallel arrows.',
  },

  glandSeal: {
    title:
      'Labyrinth Gland Seal',

    description:
      'Alternating stationary teeth reduce shaft leakage without rubbing contact.',
  },

  shaft: {
    title:
      'Rotating Output Shaft',

    description:
      'Moving surface highlights, journal reference, coupling bolts and generator rotor share the same angular phase.',
  },

  bearing: {
    title:
      'Journal Bearing',

    description:
      'Stationary shells support the rotating journal through an oil film supplied before machine roll-up.',
  },

  oilSystem: {
    title:
      'Lubrication Oil System',

    description:
      'Supply oil enters the bearing from above and drain oil leaves below.',
  },

  coupling: {
    title:
      'Flexible Coupling',

    description:
      'The coupling transfers turbine torque to the generator while allowing small alignment tolerances.',
  },

  generator: {
    title:
      'Synchronous Generator',

    description:
      'The generator converts shaft power into three-phase electrical power when its breaker is closed.',
  },

  generatorRotor: {
    title:
      'Generator Rotor',

    description:
      'The two-pole rotor produces 60 Hz at 3600 RPM and rotates in phase with the turbine shaft.',
  },

  generatorStator: {
    title:
      'Generator Stator',

    description:
      'The laminated stator and copper windings remain stationary around the field rotor.',
  },

  electricalOutput: {
    title:
      'Generator Breaker and Output',

    description:
      'Closure requires acceptable speed, frequency, voltage, phase, acceleration and oil pressure. Opening removes electrical torque immediately.',
  },
};

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.max(
    minimum,
    Math.min(maximum, value)
  );
}

function smoothStep(
  edge0: number,
  edge1: number,
  value: number
) {
  const normalized = clamp(
    (value - edge0) /
      Math.max(
        edge1 - edge0,
        0.000001
      ),
    0,
    1
  );

  return (
    normalized *
    normalized *
    (3 - 2 * normalized)
  );
}

function wrap360(
  value: number
) {
  return (
    (
      value % 360
    ) +
    360
  ) % 360;
}

function wrapSignedDegrees(
  value: number
) {
  const wrapped =
    wrap360(value);

  return wrapped > 180
    ? wrapped - 360
    : wrapped;
}

function moveToward(
  current: number,
  target: number,
  maximumDelta: number
) {
  const difference =
    target - current;

  return Math.abs(
    difference
  ) <= maximumDelta
    ? target
    : current +
        Math.sign(
          difference
        ) *
          maximumDelta;
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): [number, number] {
  const angleRad =
    (
      angleDeg *
      Math.PI
    ) /
    180;

  return [
    cx +
      Math.cos(
        angleRad
      ) *
        radius,

    cy +
      Math.sin(
        angleRad
      ) *
        radius,
  ];
}

function pointText(
  [
    x,
    y,
  ]: [
    number,
    number,
  ]
) {
  return `${x.toFixed(
    1
  )} ${y.toFixed(1)}`;
}

function createBladePath(
  cx: number,
  cy: number,
  angleDeg: number
) {
  const p0 = polarPoint(
    cx,
    cy,
    144,
    angleDeg - 2
  );

  const p1 = polarPoint(
    cx,
    cy,
    156,
    angleDeg - 4.2
  );

  const p2 = polarPoint(
    cx,
    cy,
    178,
    angleDeg - 6.7
  );

  const p3 = polarPoint(
    cx,
    cy,
    198,
    angleDeg - 7.4
  );

  const p4 = polarPoint(
    cx,
    cy,
    205,
    angleDeg - 3.1
  );

  const p5 = polarPoint(
    cx,
    cy,
    203,
    angleDeg - 1.7
  );

  const p6 = polarPoint(
    cx,
    cy,
    193,
    angleDeg + 1.8
  );

  const p7 = polarPoint(
    cx,
    cy,
    189,
    angleDeg + 2.7
  );

  const p8 = polarPoint(
    cx,
    cy,
    151,
    angleDeg + 3.1
  );

  const p9 = polarPoint(
    cx,
    cy,
    144,
    angleDeg + 2
  );

  const root = polarPoint(
    cx,
    cy,
    137,
    angleDeg
  );

  return `
    M ${pointText(p0)}

    C ${pointText(p1)}
      ${pointText(p2)}
      ${pointText(p3)}

    C ${pointText(p3)}
      ${pointText(p4)}
      ${pointText(p5)}

    C ${pointText(p5)}
      ${pointText(p6)}
      ${pointText(p7)}

    C ${pointText(p7)}
      ${pointText(p8)}
      ${pointText(p9)}

    Q ${pointText(root)}
      ${pointText(p0)}

    Z
  `;
}

function createBladeRootPath(
  cx: number,
  cy: number,
  angleDeg: number,
  innerRadius = 132,
  outerRadius = 147
) {
  const p1 = polarPoint(
    cx,
    cy,
    innerRadius,
    angleDeg - 2.7
  );

  const p2 = polarPoint(
    cx,
    cy,
    outerRadius,
    angleDeg - 2.7
  );

  const p3 = polarPoint(
    cx,
    cy,
    outerRadius,
    angleDeg + 2.7
  );

  const p4 = polarPoint(
    cx,
    cy,
    innerRadius,
    angleDeg + 2.7
  );

  return `
    M ${pointText(p1)}
    L ${pointText(p2)}
    L ${pointText(p3)}
    L ${pointText(p4)}
    Z
  `;
}

function createBladeCupPath(
  cx: number,
  cy: number,
  angleDeg: number
) {
  const start = polarPoint(
    cx,
    cy,
    163,
    angleDeg - 2.9
  );

  const control1 =
    polarPoint(
      cx,
      cy,
      180,
      angleDeg - 3.3
    );

  const control2 =
    polarPoint(
      cx,
      cy,
      188,
      angleDeg + 0.1
    );

  const end = polarPoint(
    cx,
    cy,
    171,
    angleDeg + 2.9
  );

  return `
    M ${pointText(start)}

    C ${pointText(control1)}
      ${pointText(control2)}
      ${pointText(end)}
  `;
}

function calculateNextState(
  previous: SimulationState,
  controls: ControlsSnapshot,
  deltaTime: number
): SimulationState {
  const loadFraction = clamp(
    controls.electricalLoadPercent /
      100,
    0,
    1
  );

  const excitationFraction =
    clamp(
      controls.excitationPercent /
        100,
      0,
      1.2
    );

  const autoSyncTrimRpm =
    controls.autoSyncArmed &&
    !controls.breakerClosed &&
    controls.controlMode ===
      'AUTO_SPEED'
      ? 6
      : 0;

  const openBreakerSetpointRpm =
    (
      clamp(
        controls.speedSetpointPercent,
        0,
        105
      ) /
      100
    ) *
      RATED_RPM +
    autoSyncTrimRpm;

  const speedSetpointRpm =
    controls.breakerClosed
      ? RATED_RPM
      : openBreakerSetpointRpm;

  const speedErrorNormalized =
    (
      speedSetpointRpm -
      previous.rpm
    ) /
    RATED_RPM;

  const governorFeedForward =
    controls.breakerClosed
      ? 0.08 +
        0.78 *
          loadFraction
      : 0.065;

  const governorKp =
    controls.breakerClosed
      ? 0.5
      : 0.74;

  const governorKi =
    0.15;

  const candidateIntegral =
    clamp(
      previous.governorIntegral +
        speedErrorNormalized *
          deltaTime,
      -0.75,
      0.75
    );

  const unsaturatedAutoCommand =
    governorFeedForward +
    governorKp *
      speedErrorNormalized +
    governorKi *
      candidateIntegral;

  const integralWindup =
    (
      unsaturatedAutoCommand >
        1 &&
      speedErrorNormalized > 0
    ) ||
    (
      unsaturatedAutoCommand <
        0 &&
      speedErrorNormalized < 0
    );

  const governorIntegral =
    controls.controlMode ===
    'AUTO_SPEED'
      ? integralWindup
        ? previous.governorIntegral
        : candidateIntegral
      : 0;

  const automaticValveCommand =
    clamp(
      governorFeedForward +
        governorKp *
          speedErrorNormalized +
        governorKi *
          governorIntegral,
      0,
      1
    );

  const manualValveCommand =
    clamp(
      controls.manualValvePercent /
        100,
      0,
      1
    );

  const valveCommand =
    controls.tripActive
      ? 0
      : controls.controlMode ===
          'MANUAL_VALVE'
        ? manualValveCommand
        : automaticValveCommand;

  const valveActuatorRate =
    controls.tripActive
      ? 8
      : valveCommand >
          previous.valvePosition
        ? 0.9
        : 1.4;

  let valvePosition =
    controls.controlMode ===
      'MANUAL_VALVE' &&
    !controls.tripActive
      ? manualValveCommand
      : moveToward(
          previous.valvePosition,
          valveCommand,
          valveActuatorRate *
            deltaTime
        );

  valvePosition = clamp(
    valvePosition,
    0,
    1
  );

  if (
    valveCommand <=
      0.0001 &&
    valvePosition <=
      0.001
  ) {
    valvePosition = 0;
  }

  if (
    valveCommand >=
      0.9999 &&
    valvePosition >=
      0.999
  ) {
    valvePosition = 1;
  }

  const steamSourcePressureBar =
    22;

  const exhaustPressureBar =
    1.05;

  const sourcePressurePa =
    steamSourcePressureBar *
    100000;

  const exhaustPressurePa =
    exhaustPressureBar *
    100000;

  const pressureRatio =
    exhaustPressurePa /
    sourcePressurePa;

  const pressureDropBar =
    steamSourcePressureBar -
    exhaustPressureBar;

  const steamTemperatureK =
    723.15;

  const steamGamma =
    1.3;

  const steamGasConstant =
    461.5;

  const dischargeCoefficient =
    0.96;

  const nozzleAreaM2 =
    MAX_NOZZLE_AREA_M2 *
    valvePosition;

  const criticalPressureRatio =
    Math.pow(
      2 /
        (
          steamGamma + 1
        ),
      steamGamma /
        (
          steamGamma - 1
        )
    );

  const chokedFlow =
    valvePosition >
      0.0001 &&
    pressureRatio <=
      criticalPressureRatio;

  let massFlowKgS = 0;

  if (
    nozzleAreaM2 > 0
  ) {
    if (chokedFlow) {
      const chokedFactor =
        Math.sqrt(
          steamGamma /
            (
              steamGasConstant *
              steamTemperatureK
            )
        ) *
        Math.pow(
          2 /
            (
              steamGamma + 1
            ),
          (
            steamGamma + 1
          ) /
            (
              2 *
              (
                steamGamma - 1
              )
            )
        );

      massFlowKgS =
        dischargeCoefficient *
        nozzleAreaM2 *
        sourcePressurePa *
        chokedFactor;
    } else {
      const pressureTerm =
        Math.pow(
          pressureRatio,
          2 / steamGamma
        ) -
        Math.pow(
          pressureRatio,
          (
            steamGamma + 1
          ) /
            steamGamma
        );

      const unchokedFactor =
        Math.sqrt(
          Math.max(
            (
              2 *
              steamGamma *
              pressureTerm
            ) /
              (
                steamGasConstant *
                steamTemperatureK *
                (
                  steamGamma - 1
                )
              ),
            0
          )
        );

      massFlowKgS =
        dischargeCoefficient *
        nozzleAreaM2 *
        sourcePressurePa *
        unchokedFactor;
    }
  }

  const effectiveExitPressureRatio =
    Math.max(
      pressureRatio,
      criticalPressureRatio
    );

  const isentropicJetVelocityMS =
    Math.sqrt(
      Math.max(
        (
          2 *
          steamGamma *
          steamGasConstant *
          steamTemperatureK
        ) /
          (
            steamGamma - 1
          ) *
          (
            1 -
            Math.pow(
              effectiveExitPressureRatio,
              (
                steamGamma - 1
              ) /
                steamGamma
            )
          ),
        0
      )
    );

  const jetVelocityMS =
    valvePosition >
    0.0001
      ? clamp(
          isentropicJetVelocityMS *
            0.95,
          0,
          700
        )
      : 0;

  const exhaustTemperatureK =
    420;

  const exhaustDensityKgM3 =
    exhaustPressurePa /
    (
      steamGasConstant *
      exhaustTemperatureK
    );

  const effectiveExhaustAreaM2 =
    0.07;

  const exhaustVelocityMS =
    massFlowKgS > 0
      ? massFlowKgS /
        Math.max(
          exhaustDensityKgM3 *
            effectiveExhaustAreaM2,
          0.001
        )
      : 0;

  const meanBladeRadiusM =
    0.72;

  const bladeSpeedMS =
    previous.omegaRadS *
    meanBladeRadiusM;

  const speedRatio =
    jetVelocityMS >
    0.001
      ? bladeSpeedMS /
        jetVelocityMS
      : 0;

  const nozzleAngleRad =
    (
      10 *
      Math.PI
    ) /
    180;

  const bladeExitAngleRad =
    (
      24 *
      Math.PI
    ) /
    180;

  const inletWhirlVelocityMS =
    jetVelocityMS *
    Math.cos(
      nozzleAngleRad
    );

  const relativeInletVelocityMS =
    Math.max(
      inletWhirlVelocityMS -
        bladeSpeedMS,
      0
    );

  const relativeOutletTangentialMS =
    0.84 *
    relativeInletVelocityMS *
    Math.cos(
      bladeExitAngleRad
    );

  const outletWhirlVelocityMS =
    bladeSpeedMS -
    relativeOutletTangentialMS;

  const whirlVelocityChangeMS =
    Math.max(
      inletWhirlVelocityMS -
        outletWhirlVelocityMS,
      0
    );

  const steamTorqueNm =
    massFlowKgS *
    whirlVelocityChangeMS *
    meanBladeRadiusM *
    0.94;

  const coulombFrictionTorqueNm =
    previous.omegaRadS > 0.2
      ? 8
      : 0;

  const viscousFrictionTorqueNm =
    0.05 *
    previous.omegaRadS;

  const windageTorqueNm =
    0.00034 *
    previous.omegaRadS **
      2;

  const frictionTorqueNm =
    coulombFrictionTorqueNm +
    viscousFrictionTorqueNm +
    windageTorqueNm;

  const targetGeneratorPowerKW =
    controls.breakerClosed
      ? RATED_GENERATOR_POWER_KW *
        loadFraction
      : 0;

  const generatorLoadTorqueNm =
    controls.breakerClosed
      ? (
          targetGeneratorPowerKW *
          1000
        ) /
        SYNCHRONOUS_OMEGA_RAD_S
      : 0;

  const availableShaftTorqueNm =
    steamTorqueNm -
    frictionTorqueNm;

  const reverseTorqueLimitNm =
    (
      RATED_GENERATOR_POWER_KW *
      1000 *
      0.2
    ) /
    SYNCHRONOUS_OMEGA_RAD_S;

  const steadyGeneratorTorqueNm =
    controls.breakerClosed
      ? clamp(
          availableShaftTorqueNm,
          -reverseTorqueLimitNm,
          generatorLoadTorqueNm
        )
      : 0;

  const synchronizingTorqueNm =
    controls.breakerClosed
      ? clamp(
          (
            previous.omegaRadS -
            SYNCHRONOUS_OMEGA_RAD_S
          ) *
            190,
          -650,
          650
        )
      : 0;

  const electromagneticTorqueNm =
    controls.breakerClosed
      ? steadyGeneratorTorqueNm +
        synchronizingTorqueNm
      : 0;

  const netTorqueNm =
    steamTorqueNm -
    electromagneticTorqueNm -
    frictionTorqueNm;

  const combinedRotorInertiaKgM2 =
    12;

  const angularAccelerationRadS2 =
    netTorqueNm /
    combinedRotorInertiaKgM2;

  const freeOmegaRadS =
    clamp(
      previous.omegaRadS +
        angularAccelerationRadS2 *
          deltaTime,
      0,
      MAX_OMEGA_RAD_S
    );

  const omegaRadS =
    controls.breakerClosed
      ? SYNCHRONOUS_OMEGA_RAD_S +
        (
          freeOmegaRadS -
          SYNCHRONOUS_OMEGA_RAD_S
        ) *
          Math.exp(
            -deltaTime /
              0.12
          )
      : freeOmegaRadS;

  const rpm =
    (
      omegaRadS *
      60
    ) /
    (
      2 *
      Math.PI
    );

  const generatedFrequencyHz =
    (
      rpm *
      GENERATOR_POLES
    ) /
    120;

  const visualAngleDeg =
    wrap360(
      previous.visualAngleDeg +
        DISPLAY_RPS_AT_RATED_SPEED *
          clamp(
            rpm /
              RATED_RPM,
            0,
            MAX_RPM /
              RATED_RPM
          ) *
          360 *
          deltaTime
    );

  let phaseDifferenceDeg:
    number;

  if (
    controls.breakerClosed
  ) {
    const targetLoadAngleDeg =
      clamp(
        (
          targetGeneratorPowerKW /
          RATED_GENERATOR_POWER_KW
        ) *
          38,
        0,
        42
      );

    phaseDifferenceDeg =
      previous.phaseDifferenceDeg +
      (
        targetLoadAngleDeg -
        previous.phaseDifferenceDeg
      ) *
        (
          1 -
          Math.exp(
            -deltaTime /
              0.3
          )
        );
  } else {
    phaseDifferenceDeg =
      wrapSignedDegrees(
        previous.phaseDifferenceDeg +
          360 *
            (
              generatedFrequencyHz -
              GRID_FREQUENCY_HZ
            ) *
            deltaTime
      );
  }

  const speedVoltageFactor =
    clamp(
      rpm /
        RATED_RPM,
      0,
      1.08
    );

  const saturationFactor =
    1 -
    0.08 *
      Math.max(
        excitationFraction -
          1,
        0
      );

  const generatedVoltageV =
    RATED_VOLTAGE_V *
    excitationFraction *
    speedVoltageFactor *
    saturationFactor;

  const terminalVoltageV =
    controls.breakerClosed
      ? RATED_VOLTAGE_V
      : generatedVoltageV;

  const terminalFrequencyHz =
    controls.breakerClosed
      ? GRID_FREQUENCY_HZ
      : generatedFrequencyHz;

  const turbinePowerKW =
    (
      steamTorqueNm *
      omegaRadS
    ) /
    1000;

  const generatorMechanicalPowerKW =
    (
      steadyGeneratorTorqueNm *
      omegaRadS
    ) /
    1000;

  const generatorEfficiency =
    clamp(
      0.89 +
        0.055 *
          smoothStep(
            0.05,
            0.8,
            loadFraction
          ),
      0.88,
      0.95
    );

  const signedElectricalPowerKW =
    controls.breakerClosed
      ? generatorMechanicalPowerKW *
        generatorEfficiency
      : 0;

  const electricalExportKW =
    Math.max(
      signedElectricalPowerKW,
      0
    );

  const gridImportKW =
    Math.max(
      -signedElectricalPowerKW,
      0
    );

  const outputCurrentA =
    controls.breakerClosed &&
    terminalVoltageV > 10
      ? (
          Math.abs(
            signedElectricalPowerKW
          ) *
          1000
        ) /
        (
          Math.sqrt(3) *
          terminalVoltageV *
          GENERATOR_POWER_FACTOR
        )
      : 0;

  const nozzleKineticPowerKW =
    massFlowKgS > 0
      ? (
          0.5 *
          massFlowKgS *
          jetVelocityMS **
            2
        ) /
        1000
      : 0;

  const stageEfficiency =
    nozzleKineticPowerKW >
    0.001
      ? clamp(
          turbinePowerKW /
            nozzleKineticPowerKW,
          0,
          0.92
        )
      : 0;

  const oilPressureTargetBar =
    clamp(
      2.4 +
        0.9 *
          Math.sqrt(
            Math.max(
              rpm,
              0
            ) /
              RATED_RPM
          ),
      2.4,
      3.4
    );

  const oilPressureBar =
    previous.oilPressureBar +
    (
      oilPressureTargetBar -
      previous.oilPressureBar
    ) *
      (
        1 -
        Math.exp(
          -deltaTime /
            0.7
        )
      );

  const oilTemperatureTargetC =
    32 +
    frictionTorqueNm *
      0.055 +
    rpm *
      0.0025;

  const oilTemperatureC =
    previous.oilTemperatureC +
    (
      oilTemperatureTargetC -
      previous.oilTemperatureC
    ) *
      (
        1 -
        Math.exp(
          -deltaTime /
            13
        )
      );

  const bearingTemperatureTargetC =
    oilTemperatureC +
    7 +
    frictionTorqueNm *
      0.065;

  const bearingTemperatureC =
    previous.bearingTemperatureC +
    (
      bearingTemperatureTargetC -
      previous.bearingTemperatureC
    ) *
      (
        1 -
        Math.exp(
          -deltaTime /
            17
        )
      );

  const vibrationMmS =
    0.35 +
    rpm /
      7000 +
    Math.abs(
      netTorqueNm
    ) /
      2200 +
    (
      controls.breakerClosed
        ? Math.abs(
            synchronizingTorqueNm
          ) /
          1400
        : 0
    );

  return {
    visualAngleDeg,
    phaseDifferenceDeg,
    governorIntegral,

    omegaRadS,
    rpm,
    angularAccelerationRadS2,

    valveCommand,
    valvePosition,

    steamSourcePressureBar,
    exhaustPressureBar,
    pressureRatio,
    pressureDropBar,

    nozzleAreaM2,
    chokedFlow,

    massFlowKgS,
    jetVelocityMS,

    exhaustDensityKgM3,
    exhaustVelocityMS,

    bladeSpeedMS,
    speedRatio,

    steamTorqueNm,
    generatorLoadTorqueNm,
    synchronizingTorqueNm,
    electromagneticTorqueNm,
    frictionTorqueNm,
    netTorqueNm,

    turbinePowerKW,
    generatorMechanicalPowerKW,
    electricalExportKW,
    gridImportKW,

    stageEfficiency,
    generatorEfficiency,

    generatedFrequencyHz,
    terminalFrequencyHz,

    generatedVoltageV,
    terminalVoltageV,
    outputCurrentA,

    oilPressureBar,
    oilTemperatureC,
    bearingTemperatureC,
    vibrationMmS,
  };
}

function FlowArrow({
  path,
  color,
  width,
  opacity,
  markerId,
  className,
  style,
}: {
  path: string;
  color: string;
  width: number;
  opacity: number;
  markerId?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd={
        markerId
          ? `url(#${markerId})`
          : undefined
      }
      opacity={opacity}
      className={className}
      style={style}
    />
  );
}

function MetricCard({
  label,
  value,
  unit,
  active,
  warning,
}: MetricDefinition) {
  return (
    <div
      className={`rounded-xl border p-3 shadow-sm ${
        warning
          ? 'border-red-300 bg-red-50'
          : active
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-200 bg-white'
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-wide ${
          warning
            ? 'text-red-700'
            : active
              ? 'text-emerald-700'
              : 'text-slate-500'
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1 font-mono text-lg font-black ${
          warning
            ? 'text-red-700'
            : active
              ? 'text-emerald-700'
              : 'text-slate-900'
        }`}
      >
        {value}

        {unit && (
          <span className="ml-1 text-xs font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function DialGauge({
  label,
  value,
  maximum,
  unit,
  warning,
}: {
  label: string;
  value: number;
  maximum: number;
  unit: string;
  warning?: boolean;
}) {
  const needleAngle =
    -120 +
    clamp(
      value /
        maximum,
      0,
      1
    ) *
      240;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-center text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <svg
        viewBox="0 0 200 135"
        className="mt-1 w-full"
      >
        <path
          d="M 30 94 A 70 70 0 1 1 170 94"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="5"
        />

        <path
          d="M 40 94 A 60 60 0 1 1 160 94"
          fill="none"
          stroke={
            warning
              ? '#dc2626'
              : '#2563eb'
          }
          strokeWidth="4"
        />

        {Array.from(
          {
            length: 11,
          },
          (
            _,
            index
          ) => {
            const angleRad =
              (
                (
                  -120 +
                  index *
                    24
                ) *
                Math.PI
              ) /
              180;

            return (
              <line
                key={index}
                x1={
                  100 +
                  Math.sin(
                    angleRad
                  ) *
                    59
                }
                y1={
                  94 -
                  Math.cos(
                    angleRad
                  ) *
                    59
                }
                x2={
                  100 +
                  Math.sin(
                    angleRad
                  ) *
                    70
                }
                y2={
                  94 -
                  Math.cos(
                    angleRad
                  ) *
                    70
                }
                stroke="#334155"
                strokeWidth={
                  index % 5 ===
                  0
                    ? 3
                    : 1.5
                }
              />
            );
          }
        )}

        <g
          transform={`rotate(${needleAngle} 100 94)`}
        >
          <line
            x1="100"
            y1="94"
            x2="100"
            y2="39"
            stroke={
              warning
                ? '#dc2626'
                : '#f97316'
            }
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <circle
          cx="100"
          cy="94"
          r="9"
          fill="#64748b"
          stroke="#0f172a"
          strokeWidth="3"
        />

        <text
          x="100"
          y="126"
          textAnchor="middle"
          fill="#0f172a"
          fontSize="15"
          fontWeight="900"
          fontFamily="monospace"
        >
          {value.toFixed(0)} {unit}
        </text>
      </svg>
    </div>
  );
}

function Callout({
  x,
  y,
  width,
  height,
  lines,
  target,
  markerId,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  lines: string[];
  target: [
    number,
    number,
  ];
  markerId: string;
}) {
  const centerX =
    x + width / 2;

  const centerY =
    y + height / 2;

  const deltaX =
    target[0] -
    centerX;

  const deltaY =
    target[1] -
    centerY;

  const horizontal =
    Math.abs(
      deltaX /
        width
    ) >
    Math.abs(
      deltaY /
        height
    );

  const startX =
    horizontal
      ? deltaX > 0
        ? x + width
        : x
      : centerX;

  const startY =
    horizontal
      ? centerY
      : deltaY > 0
        ? y + height
        : y;

  return (
    <g className="pointer-events-none">
      <line
        x1={startX}
        y1={startY}
        x2={target[0]}
        y2={target[1]}
        stroke="#1e40af"
        strokeWidth="1.35"
        markerEnd={`url(#${markerId})`}
      />

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="5"
        fill="#ffffff"
        fillOpacity="0.96"
        stroke="#1e40af"
        strokeWidth="1.5"
      />

      <text
        x={centerX}
        y={
          centerY -
          (
            lines.length -
            1
          ) *
            8 +
          4
        }
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#172554"
      >
        {lines.map(
          (
            line,
            index
          ) => (
            <tspan
              key={`${line}-${index}`}
              x={centerX}
              dy={
                index
                  ? 17
                  : 0
              }
            >
              {line}
            </tspan>
          )
        )}
      </text>
    </g>
  );
}

const BladeRow = React.memo(
  function BladeRow({
    cx,
    cy,
    bladeCount,
    rear = false,
    ids,
  }: {
    cx: number;
    cy: number;
    bladeCount: number;
    rear?: boolean;
    ids: SvgIds;
  }) {
    return (
      <>
        {Array.from(
          {
            length:
              bladeCount,
          },
          (
            _,
            index
          ) => {
            const angle =
              (
                360 /
                bladeCount
              ) *
                index -
              90;

            return (
              <g key={index}>
                <path
                  d={createBladeRootPath(
                    cx,
                    cy,
                    angle,
                    122,
                    132
                  )}
                  fill={
                    rear
                      ? '#46515f'
                      : '#525d6b'
                  }
                  stroke="#374151"
                  strokeWidth="1.1"
                />

                <path
                  d={createBladeRootPath(
                    cx,
                    cy,
                    angle
                  )}
                  fill={
                    rear
                      ? '#596473'
                      : '#6b7280'
                  }
                  stroke="#374151"
                  strokeWidth="1.3"
                />

                <path
                  d={createBladePath(
                    cx,
                    cy,
                    angle
                  )}
                  fill={`url(#${
                    rear
                      ? ids.bladeRear
                      : ids.bladeFront
                  })`}
                  stroke="#374151"
                  strokeWidth={
                    rear
                      ? 1.6
                      : 1.8
                  }
                  strokeLinejoin="round"
                />

                {!rear && (
                  <>
                    <path
                      d={createBladeCupPath(
                        cx,
                        cy,
                        angle
                      )}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1.2"
                      opacity="0.88"
                    />

                    <path
                      d={createBladeCupPath(
                        cx,
                        cy,
                        angle -
                          0.7
                      )}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.65"
                      opacity="0.55"
                    />
                  </>
                )}
              </g>
            );
          }
        )}
      </>
    );
  }
);

export default function IndustrialImpulseTurbineV10() {
  const safeId =
    useId().replace(
      /:/g,
      ''
    );

  const ids =
    useMemo<SvgIds>(
      () => ({
        steamArrow:
          `steam-arrow-${safeId}`,

        forceArrow:
          `force-arrow-${safeId}`,

        oilArrow:
          `oil-arrow-${safeId}`,

        electricArrow:
          `electric-arrow-${safeId}`,

        labelArrow:
          `label-arrow-${safeId}`,

        castSteel:
          `cast-steel-${safeId}`,

        rearCastSteel:
          `rear-cast-steel-${safeId}`,

        machinedSteel:
          `machined-steel-${safeId}`,

        rotorSteel:
          `rotor-steel-${safeId}`,

        rotorSide:
          `rotor-side-${safeId}`,

        bladeFront:
          `blade-front-${safeId}`,

        bladeRear:
          `blade-rear-${safeId}`,

        cavity:
          `cavity-${safeId}`,

        exhaust:
          `exhaust-${safeId}`,

        copper:
          `copper-${safeId}`,

        generatorRotor:
          `generator-rotor-${safeId}`,

        oil:
          `oil-${safeId}`,

        steamGradient:
          `steam-gradient-${safeId}`,

        inletSteamGradient:
          `inlet-steam-gradient-${safeId}`,

        exhaustSteamGradient:
          `exhaust-steam-gradient-${safeId}`,

        cutFace:
          `cut-face-${safeId}`,

        shadow:
          `shadow-${safeId}`,

        steamGlow:
          `steam-glow-${safeId}`,

        steamTurbulence:
          `steam-turbulence-${safeId}`,

        texture:
          `texture-${safeId}`,

        rearRotorClip:
          `rear-rotor-clip-${safeId}`,

        shaftClip:
          `shaft-clip-${safeId}`,

        journalClip:
          `journal-clip-${safeId}`,

        generatorRotorClip:
          `generator-rotor-clip-${safeId}`,

        valvePortClip:
          `valve-port-clip-${safeId}`,

        exhaustClip:
          `exhaust-clip-${safeId}`,
      }),
      [safeId]
    );

  const [
    running,
    setRunning,
  ] = useState(true);

  const [
    showLabels,
    setShowLabels,
  ] = useState(true);

  const [
    controlMode,
    setControlMode,
  ] =
    useState<ControlMode>(
      'MANUAL_VALVE'
    );

  const [
    manualValvePercent,
    setManualValvePercent,
  ] = useState(0);

  const [
    speedSetpointPercent,
    setSpeedSetpointPercent,
  ] = useState(100);

  const [
    electricalLoadPercent,
    setElectricalLoadPercent,
  ] = useState(40);

  const [
    excitationPercent,
    setExcitationPercent,
  ] = useState(100);

  const [
    tripActive,
    setTripActive,
  ] = useState(false);

  const [
    breakerState,
    setBreakerState,
  ] =
    useState<BreakerState>(
      'OPEN'
    );

  const [
    breakerMessage,
    setBreakerMessage,
  ] = useState(
    'Breaker open'
  );

  const [
    selectedPart,
    setSelectedPart,
  ] =
    useState<PartId>(
      'rotor'
    );

  const [
    simulation,
    setSimulation,
  ] =
    useState<SimulationState>(
      INITIAL_STATE
    );

  const breakerClosed =
    breakerState === 'CLOSED';

  const autoSyncArmed =
    breakerState === 'ARMED';

  const animationFrameRef =
    useRef<number | null>(
      null
    );

  const previousTimeRef =
    useRef<number | null>(
      null
    );

  const simulationAccumulatorRef =
    useRef(0);

  const previousSyncPhaseRef =
    useRef(0);

  const protectionTimerRef =
    useRef<{
      reason: string | null;
      startTime: number | null;
    }>({
      reason: null,
      startTime: null,
    });

  const controlsRef =
    useRef<ControlsSnapshot>({
      running,

      controlMode,
      manualValvePercent,
      speedSetpointPercent,

      electricalLoadPercent,
      excitationPercent,

      tripActive,
      breakerClosed,
      autoSyncArmed,
    });

  useEffect(() => {
    controlsRef.current = {
      running,

      controlMode,
      manualValvePercent,
      speedSetpointPercent,

      electricalLoadPercent,
      excitationPercent,

      tripActive,
      breakerClosed,
      autoSyncArmed,
    };
  }, [
    running,
    controlMode,
    manualValvePercent,
    speedSetpointPercent,
    electricalLoadPercent,
    excitationPercent,
    tripActive,
    breakerClosed,
    autoSyncArmed,
  ]);

  useEffect(() => {
    const animate = (
      currentTime: number
    ) => {
      if (
        previousTimeRef.current ===
        null
      ) {
        previousTimeRef.current =
          currentTime;
      }

      const rawDeltaTime =
        (
          currentTime -
          previousTimeRef.current
        ) /
        1000;

      previousTimeRef.current =
        currentTime;

      if (
        controlsRef.current
          .running
      ) {
        simulationAccumulatorRef.current +=
          clamp(
            rawDeltaTime,
            0,
            0.04
          );

        if (
          simulationAccumulatorRef.current >=
          1 / 30
        ) {
          const step =
            Math.min(
              simulationAccumulatorRef.current,
              0.08
            );

          simulationAccumulatorRef.current =
            0;

          setSimulation(
            (
              previous
            ) =>
              calculateNextState(
                previous,
                controlsRef.current,
                step
              )
          );
        }
      } else {
        simulationAccumulatorRef.current =
          0;
      }

      animationFrameRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animationFrameRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      previousTimeRef.current =
        null;
    };
  }, []);

  const shaftCenterY =
    470;

  const rotorCx =
    780;

  const rotorCy =
    shaftCenterY;

  const rearRotorCx =
    796;

  const rearRotorCy =
    462;

  const bladeCount =
    22;

  const rotorDiscRadius =
    126;

  const bladeRootRadius =
    144;

  const bladeTipRadius =
    202;

  const jetStrikeY =
    rotorCy - 194;

  const nozzleExitX =
    666;

  const bladeEntryX =
    rotorCx -
    Math.sqrt(
      Math.max(
        bladeTipRadius **
          2 -
          (
            jetStrikeY -
            rotorCy
          ) **
            2,
        0
      )
    ) -
    2;

  const bearingCx =
    1175;

  const couplingCx =
    1422;

  const generatorStartX =
    1490;

  const generatorEndX =
    1900;

  const generatorRotorStartX =
    1540;

  const generatorRotorEndX =
    1828;

  const generatorFanCx =
    1850;

  const valveGateHeight =
    44;

  const valveClosedY =
    jetStrikeY -
    valveGateHeight /
      2;

  const valveFullyOpenY =
    jetStrikeY - 68;

  const valveGateY =
    valveClosedY +
    (
      valveFullyOpenY -
      valveClosedY
    ) *
      simulation.valvePosition;

  const valveStemTopY =
    jetStrikeY - 155;

  const valveStemHeight =
    Math.max(
      valveGateY +
        3 -
        valveStemTopY,
      8
    );

  const valvePortTopY =
    jetStrikeY - 17;

  const valvePortBottomY =
    jetStrikeY + 17;

  const gateBottomY =
    valveGateY +
    valveGateHeight;

  const valveOpeningTopY =
    clamp(
      gateBottomY,
      valvePortTopY,
      valvePortBottomY
    );

  const valveOpeningHeight =
    Math.max(
      valvePortBottomY -
        valveOpeningTopY,
      0
    );

  const valveVisualOpenFraction =
    clamp(
      valveOpeningHeight /
        34,
      0,
      1
    );

  const casingOuterPath = `
    M 490 840

    L 490 650

    C 455 608,
      442 548,
      448 480

    C 454 404,
      478 343,
      515 305

    L 515 266

    C 515 162,
      620 103,
      772 103

    L 1010 103

    C 1158 103,
      1260 208,
      1260 357

    L 1260 638

    C 1260 772,
      1148 840,
      994 840

    Z
  `;

  const casingCavityPath = `
    M 570 604

    C 543 574,
      533 531,
      538 484

    C 543 428,
      560 390,
      588 363

    L 588 301

    C 588 228,
      668 176,
      778 176

    L 990 176

    C 1098 176,
      1178 255,
      1178 365

    L 1178 552

    C 1108 594,
      1026 617,
      930 621

    C 830 624,
      747 605,
      684 570

    C 626 583,
      595 596,
      570 604

    Z
  `;

  const upperCutawayLipPath = `
    M 570 604

    C 543 574,
      533 531,
      538 484

    C 543 428,
      560 390,
      588 363

    L 588 301

    C 588 228,
      668 176,
      778 176

    L 990 176

    C 1098 176,
      1178 255,
      1178 365

    L 1178 423
  `;

  const lowerCutawayLipPath = `
    M 570 604

    L 570 748

    C 570 780,
      596 800,
      646 812
  `;

  const exhaustDiffuserPath = `
    M 675 574

    C 730 620,
      807 650,
      904 657

    C 1015 665,
      1135 624,
      1308 645

    L 1308 806

    C 1158 822,
      988 829,
      817 818

    L 640 818

    C 596 756,
      600 645,
      675 574

    Z
  `;

  const exhaustSteamPlumePath = `
    M 812 560

    C 846 588,
      864 618,
      904 642

    C 996 697,
      1128 681,
      1306 674

    L 1306 793

    C 1130 806,
      963 806,
      824 781

    C 772 771,
      738 736,
      744 684

    C 750 626,
      777 585,
      812 560

    Z
  `;

  const shaftPhaseRad =
    (
      simulation.visualAngleDeg *
      Math.PI
    ) /
    180;

  const createSurfaceMarks =
    (
      amplitude: number
    ): SurfaceMark[] =>
      [
        0,
        (
          2 *
          Math.PI
        ) /
          3,
        (
          4 *
          Math.PI
        ) /
          3,
      ].map(
        (
          phaseOffset
        ) => {
          const phase =
            shaftPhaseRad +
            phaseOffset;

          const visibility =
            (
              Math.cos(
                phase
              ) +
              1
            ) /
            2;

          return {
            y:
              shaftCenterY +
              Math.sin(
                phase
              ) *
                amplitude,

            opacity:
              0.22 +
              0.68 *
                visibility,

            width:
              1.4 +
              1.8 *
                visibility,
          };
        }
      );

  const shaftSurfaceMarks =
    createSurfaceMarks(17);

  const generatorSurfaceMarks =
    createSurfaceMarks(31);

  const shaftKeyPhase =
    shaftPhaseRad +
    Math.PI /
      5;

  const shaftKeyY =
    shaftCenterY +
    Math.sin(
      shaftKeyPhase
    ) *
      18;

  const shaftKeyOpacity =
    0.3 +
    0.65 *
      (
        (
          Math.cos(
            shaftKeyPhase
          ) +
          1
        ) /
        2
      );

  const frequencyErrorHz =
    Math.abs(
      simulation.generatedFrequencyHz -
        GRID_FREQUENCY_HZ
    );

  const voltageErrorPercent =
    (
      Math.abs(
        simulation.generatedVoltageV -
          RATED_VOLTAGE_V
      ) /
      RATED_VOLTAGE_V
    ) *
    100;

  const phaseErrorDeg =
    Math.abs(
      simulation.phaseDifferenceDeg
    );

  const speedInClosingRange =
    simulation.rpm >=
      3540 &&
    simulation.rpm <=
      3660;

  const frequencyInClosingRange =
    frequencyErrorHz <=
    0.15;

  const voltageInClosingRange =
    voltageErrorPercent <=
    5;

  const phaseInClosingRange =
    phaseErrorDeg <= 8;

  const accelerationStable =
    Math.abs(
      simulation.angularAccelerationRadS2
    ) <= 0.35;

  const lubricationReady =
    simulation.oilPressureBar >=
    2;

  const automaticGovernorReady =
    controlMode ===
    'AUTO_SPEED';

  const synchronizationPermissive =
    !tripActive &&
    !breakerClosed &&
    automaticGovernorReady &&
    speedInClosingRange &&
    frequencyInClosingRange &&
    voltageInClosingRange &&
    accelerationStable &&
    lubricationReady;

  const syncReady =
    synchronizationPermissive &&
    phaseInClosingRange;

  const autoSyncArmReady =
    !tripActive &&
    !breakerClosed &&
    simulation.rpm >=
      3450 &&
    simulation.rpm <=
      3675 &&
    frequencyErrorHz <=
      0.5 &&
    voltageErrorPercent <=
      10 &&
    lubricationReady;

  const patchControlsRef =
    useCallback(
      (
        patch: Partial<ControlsSnapshot>
      ) => {
        controlsRef.current = {
          ...controlsRef.current,
          ...patch,
        };
      },
      []
    );

  const openBreaker =
    useCallback(
      (
        reason =
          'Breaker opened manually'
      ) => {
        setBreakerState(
          'OPEN'
        );

        setBreakerMessage(
          reason
        );

        patchControlsRef({
          breakerClosed: false,
          autoSyncArmed: false,
        });

        protectionTimerRef.current =
          {
            reason: null,
            startTime: null,
          };
      },
      [patchControlsRef]
    );

  const tripBreaker =
    useCallback(
      (
        reason: string
      ) => {
        setBreakerState(
          'TRIPPED'
        );

        setBreakerMessage(
          reason
        );

        patchControlsRef({
          breakerClosed: false,
          autoSyncArmed: false,
        });

        protectionTimerRef.current =
          {
            reason: null,
            startTime: null,
          };
      },
      [patchControlsRef]
    );

  const closeBreaker =
    useCallback(
      (
        source:
          | 'MANUAL'
          | 'AUTO'
      ) => {
        if (
          tripActive ||
          breakerClosed ||
          !syncReady
        ) {
          return;
        }

        setControlMode(
          'AUTO_SPEED'
        );

        setBreakerState(
          'CLOSED'
        );

        setBreakerMessage(
          source === 'AUTO'
            ? 'Breaker closed automatically at phase coincidence'
            : 'Breaker closed manually in synchronism'
        );

        patchControlsRef({
          controlMode:
            'AUTO_SPEED',

          breakerClosed: true,
          autoSyncArmed: false,
        });

        protectionTimerRef.current =
          {
            reason: null,
            startTime: null,
          };
      },
      [
        tripActive,
        breakerClosed,
        syncReady,
        patchControlsRef,
      ]
    );

  const armAutoSync =
    useCallback(() => {
      if (
        !autoSyncArmReady
      ) {
        return;
      }

      setControlMode(
        'AUTO_SPEED'
      );

      setSpeedSetpointPercent(
        100
      );

      setBreakerState(
        'ARMED'
      );

      setBreakerMessage(
        'Auto-sync armed: waiting for frequency and phase coincidence'
      );

      patchControlsRef({
        controlMode:
          'AUTO_SPEED',

        speedSetpointPercent:
          100,

        breakerClosed: false,
        autoSyncArmed: true,
      });

      previousSyncPhaseRef.current =
        simulation.phaseDifferenceDeg;
    }, [
      autoSyncArmReady,
      patchControlsRef,
      simulation.phaseDifferenceDeg,
    ]);

  const cancelAutoSync =
    useCallback(() => {
      if (
        breakerState ===
        'ARMED'
      ) {
        openBreaker(
          'Auto-sync cancelled'
        );
      }
    }, [
      breakerState,
      openBreaker,
    ]);

  useEffect(() => {
    const previousPhase =
      previousSyncPhaseRef.current;

    const currentPhase =
      simulation.phaseDifferenceDeg;

    const genuineZeroCrossing =
      (
        previousPhase < 0 &&
        currentPhase >= 0 &&
        Math.abs(
          previousPhase
        ) <= 30 &&
        Math.abs(
          currentPhase
        ) <= 30
      ) ||
      (
        previousPhase > 0 &&
        currentPhase <= 0 &&
        Math.abs(
          previousPhase
        ) <= 30 &&
        Math.abs(
          currentPhase
        ) <= 30
      );

    previousSyncPhaseRef.current =
      currentPhase;

    if (
      breakerState ===
        'ARMED' &&
      synchronizationPermissive &&
      (
        genuineZeroCrossing ||
        Math.abs(
          currentPhase
        ) <= 8
      )
    ) {
      closeBreaker(
        'AUTO'
      );
    }
  }, [
    simulation.phaseDifferenceDeg,
    breakerState,
    synchronizationPermissive,
    closeBreaker,
  ]);

  useEffect(() => {
    if (
      !tripActive &&
      simulation.rpm >=
        OVERSPEED_TRIP_RPM
    ) {
      setTripActive(
        true
      );

      patchControlsRef({
        tripActive: true,
      });
    }
  }, [
    simulation.rpm,
    tripActive,
    patchControlsRef,
  ]);

  useEffect(() => {
    if (
      tripActive &&
      breakerState !==
        'TRIPPED'
    ) {
      tripBreaker(
        'Breaker tripped by turbine emergency trip'
      );
    }
  }, [
    tripActive,
    breakerState,
    tripBreaker,
  ]);

  useEffect(() => {
    if (
      !breakerClosed
    ) {
      protectionTimerRef.current =
        {
          reason: null,
          startTime: null,
        };

      return;
    }

    let reason:
      | string
      | null = null;

    let turbineTripRequired =
      false;

    if (
      simulation.rpm <
        3420 ||
      simulation.rpm >
        3780
    ) {
      reason =
        'Generator protection trip: abnormal shaft speed';

      turbineTripRequired =
        true;
    } else if (
      simulation.oilPressureBar <
      1.2
    ) {
      reason =
        'Generator protection trip: low oil pressure';

      turbineTripRequired =
        true;
    } else if (
      simulation.gridImportKW >
      15
    ) {
      reason =
        'Generator protection trip: reverse power';
    }

    if (!reason) {
      protectionTimerRef.current =
        {
          reason: null,
          startTime: null,
        };

      return;
    }

    const now =
      performance.now();

    if (
      protectionTimerRef.current
        .reason !== reason
    ) {
      protectionTimerRef.current =
        {
          reason,
          startTime: now,
        };

      return;
    }

    const startTime =
      protectionTimerRef.current
        .startTime;

    if (
      startTime !== null &&
      now - startTime >=
        250
    ) {
      if (
        turbineTripRequired
      ) {
        setTripActive(
          true
        );

        patchControlsRef({
          tripActive: true,
        });
      }

      tripBreaker(
        reason
      );
    }
  }, [
    breakerClosed,
    simulation.rpm,
    simulation.oilPressureBar,
    simulation.gridImportKW,
    tripBreaker,
    patchControlsRef,
  ]);

  const flowFraction =
    clamp(
      simulation.massFlowKgS /
        APPROX_MAX_MASS_FLOW_KG_S,
      0,
      1
    );

  const upstreamPressureOpacity =
    0.18 +
    0.1 *
      simulation.valvePosition;

  const inletMotionOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.28 +
        0.72 *
          flowFraction;

  const nozzleMistOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.12 +
        0.5 *
          flowFraction;

  const jetOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.25 +
        0.75 *
          flowFraction;

  const exhaustMistOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.08 +
        0.48 *
          flowFraction;

  const exhaustTraceOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.18 +
        0.62 *
          flowFraction;

  const inletFlowDuration =
    clamp(
      2.7 -
        1.45 *
          flowFraction,
      0.9,
      2.7
    );

  const nozzleFlowDuration =
    clamp(
      1.65 -
        0.85 *
          flowFraction,
      0.48,
      1.65
    );

  const jetFlowDuration =
    clamp(
      1 -
        0.52 *
          flowFraction,
      0.32,
      1
    );

  const exhaustFlowDuration =
    clamp(
      3.7 -
        1.8 *
          flowFraction,
      1.35,
      3.7
    );

  const eddyFlowDuration =
    clamp(
      5.2 -
        1.7 *
          flowFraction,
      2.6,
      5.2
    );

  const jetWidth =
    flowFraction <=
    0.001
      ? 0
      : clamp(
          2.2 +
            flowFraction *
              5.2,
          2.2,
          7.4
        );

  const electricalOpacity =
    breakerClosed
      ? clamp(
          0.35 +
            simulation.electricalExportKW /
              500,
          0.35,
          1
        )
      : 0.08;

  const electricalFlowDuration =
    breakerClosed
      ? clamp(
          1.5 -
            simulation.electricalExportKW /
              700,
          0.45,
          1.5
        )
      : 1.8;

  const svgStyle = {
    '--inlet-flow-duration':
      `${inletFlowDuration}s`,

    '--nozzle-flow-duration':
      `${nozzleFlowDuration}s`,

    '--jet-flow-duration':
      `${jetFlowDuration}s`,

    '--exhaust-flow-duration':
      `${exhaustFlowDuration}s`,

    '--eddy-flow-duration':
      `${eddyFlowDuration}s`,

    '--electric-duration':
      `${electricalFlowDuration}s`,
  } as React.CSSProperties &
    Record<
      string,
      string
    >;

  const bearingWarning =
    simulation.bearingTemperatureC >
    90;

  const oilWarning =
    simulation.rpm >
      600 &&
    simulation.oilPressureBar <
      1.2;

  const vibrationWarning =
    simulation.vibrationMmS >
    4.5;

  const frequencyWarning =
    breakerClosed &&
    Math.abs(
      simulation.terminalFrequencyHz -
        GRID_FREQUENCY_HZ
    ) > 0.5;

  const machineStatus =
    tripActive ||
    breakerState ===
      'TRIPPED'
      ? 'TURBINE / GENERATOR TRIP'
      : !running
        ? 'SIMULATION PAUSED'
        : breakerState ===
            'CLOSED'
          ? 'GENERATOR ONLINE'
          : breakerState ===
              'ARMED'
            ? 'AUTO-SYNC WAITING'
            : syncReady
              ? 'BREAKER CLOSE PERMITTED'
              : synchronizationPermissive
                ? 'WAITING FOR PHASE'
                : simulation.rpm <
                    10
                  ? 'STANDBY'
                  : controlMode ===
                      'MANUAL_VALVE'
                    ? 'MANUAL VALVE CONTROL'
                    : 'AUTOMATIC SPEED GOVERNING';

  const resetSystem =
    () => {
      setSimulation(
        INITIAL_STATE
      );

      setRunning(
        true
      );

      setShowLabels(
        true
      );

      setControlMode(
        'MANUAL_VALVE'
      );

      setManualValvePercent(
        0
      );

      setSpeedSetpointPercent(
        100
      );

      setElectricalLoadPercent(
        40
      );

      setExcitationPercent(
        100
      );

      setTripActive(
        false
      );

      setBreakerState(
        'OPEN'
      );

      setBreakerMessage(
        'System reset; breaker open'
      );

      setSelectedPart(
        'rotor'
      );

      controlsRef.current = {
        running: true,

        controlMode:
          'MANUAL_VALVE',

        manualValvePercent:
          0,

        speedSetpointPercent:
          100,

        electricalLoadPercent:
          40,

        excitationPercent:
          100,

        tripActive:
          false,

        breakerClosed:
          false,

        autoSyncArmed:
          false,
      };

      previousTimeRef.current =
        null;

      simulationAccumulatorRef.current =
        0;

      previousSyncPhaseRef.current =
        0;

      protectionTimerRef.current =
        {
          reason: null,
          startTime: null,
        };
    };

  const resetProtection =
    () => {
      setTripActive(
        false
      );

      setBreakerState(
        'OPEN'
      );

      setBreakerMessage(
        'Protection reset; breaker open'
      );

      if (tripActive) {
        setManualValvePercent(
          0
        );

        setSpeedSetpointPercent(
          0
        );

        setControlMode(
          'MANUAL_VALVE'
        );
      }

      patchControlsRef({
        tripActive:
          false,

        breakerClosed:
          false,

        autoSyncArmed:
          false,

        ...(tripActive
          ? {
              controlMode:
                'MANUAL_VALVE' as ControlMode,

              manualValvePercent:
                0,

              speedSetpointPercent:
                0,
            }
          : {}),
      });

      previousSyncPhaseRef.current =
        simulation.phaseDifferenceDeg;

      protectionTimerRef.current =
        {
          reason: null,
          startTime: null,
        };
    };

  const selectPart =
    (
      part: PartId
    ) =>
    (
      event: React.MouseEvent<SVGGElement>
    ) => {
      event.stopPropagation();

      setSelectedPart(
        part
      );
    };

  const inletUpstreamPaths = [
    `
      M 122 ${jetStrikeY - 29}

      C 176 ${jetStrikeY - 31},
        236 ${jetStrikeY - 26},
        309 ${jetStrikeY - 12}
    `,

    `
      M 122 ${jetStrikeY - 15}

      C 184 ${jetStrikeY - 18},
        242 ${jetStrikeY - 14},
        309 ${jetStrikeY - 7}
    `,

    `
      M 122 ${jetStrikeY}

      C 188 ${jetStrikeY},
        245 ${jetStrikeY},
        309 ${jetStrikeY}
    `,

    `
      M 122 ${jetStrikeY + 15}

      C 184 ${jetStrikeY + 18},
        242 ${jetStrikeY + 14},
        309 ${jetStrikeY + 7}
    `,

    `
      M 122 ${jetStrikeY + 29}

      C 176 ${jetStrikeY + 31},
        236 ${jetStrikeY + 26},
        309 ${jetStrikeY + 12}
    `,
  ];

  const nozzleStreamPaths = [
    `
      M 360 ${jetStrikeY - 12}

      C 406 ${jetStrikeY - 19},
        470 ${jetStrikeY - 27},
        532 ${jetStrikeY - 17}

      C 584 ${jetStrikeY - 11},
        623 ${jetStrikeY - 7},
        ${nozzleExitX} ${jetStrikeY - 5}
    `,

    `
      M 360 ${jetStrikeY - 6}

      C 421 ${jetStrikeY - 10},
        478 ${jetStrikeY - 14},
        538 ${jetStrikeY - 10}

      C 590 ${jetStrikeY - 7},
        625 ${jetStrikeY - 4},
        ${nozzleExitX} ${jetStrikeY - 2}
    `,

    `
      M 360 ${jetStrikeY}

      C 423 ${jetStrikeY},
        483 ${jetStrikeY},
        540 ${jetStrikeY}

      C 592 ${jetStrikeY},
        628 ${jetStrikeY},
        ${nozzleExitX} ${jetStrikeY}
    `,

    `
      M 360 ${jetStrikeY + 6}

      C 421 ${jetStrikeY + 10},
        478 ${jetStrikeY + 14},
        538 ${jetStrikeY + 10}

      C 590 ${jetStrikeY + 7},
        625 ${jetStrikeY + 4},
        ${nozzleExitX} ${jetStrikeY + 2}
    `,

    `
      M 360 ${jetStrikeY + 12}

      C 406 ${jetStrikeY + 19},
        470 ${jetStrikeY + 27},
        532 ${jetStrikeY + 17}

      C 584 ${jetStrikeY + 11},
        623 ${jetStrikeY + 7},
        ${nozzleExitX} ${jetStrikeY + 5}
    `,
  ];

  const exhaustInternalPaths = [
    `
      M 842 570

      C 874 599,
        905 628,
        957 647

      C 1052 681,
        1169 660,
        1300 674
    `,

    `
      M 826 591

      C 856 630,
        906 661,
        975 681

      C 1078 712,
        1189 691,
        1302 705
    `,

    `
      M 812 616

      C 834 660,
        887 698,
        966 718

      C 1080 748,
        1194 725,
        1304 739
    `,

    `
      M 802 645

      C 816 690,
        855 734,
        936 760

      C 1043 794,
        1178 769,
        1303 775
    `,
  ];

  const metrics:
    MetricDefinition[] = [
      {
        label:
          'Governor Mode',

        value:
          controlMode ===
          'MANUAL_VALVE'
            ? 'MANUAL'
            : 'AUTO SPEED',
      },

      {
        label:
          'Valve Command',

        value:
          (
            simulation.valveCommand *
            100
          ).toFixed(1),

        unit: '%',

        warning:
          tripActive,
      },

      {
        label:
          'Valve Actual',

        value:
          (
            simulation.valvePosition *
            100
          ).toFixed(1),

        unit: '%',

        warning:
          tripActive,
      },

      {
        label:
          'Rotor Speed',

        value:
          simulation.rpm.toFixed(
            0
          ),

        unit:
          'RPM',
      },

      {
        label:
          'Generated Frequency',

        value:
          simulation.generatedFrequencyHz.toFixed(
            2
          ),

        unit:
          'Hz',
      },

      {
        label:
          'Generated Voltage',

        value:
          simulation.generatedVoltageV.toFixed(
            0
          ),

        unit:
          'V',
      },

      {
        label:
          'Mass Flow',

        value:
          simulation.massFlowKgS.toFixed(
            3
          ),

        unit:
          'kg/s',
      },

      {
        label:
          'Nozzle Velocity',

        value:
          simulation.jetVelocityMS.toFixed(
            0
          ),

        unit:
          'm/s',
      },

      {
        label:
          'Exhaust Velocity',

        value:
          simulation.exhaustVelocityMS.toFixed(
            1
          ),

        unit:
          'm/s',
      },

      {
        label:
          'Exhaust Density',

        value:
          simulation.exhaustDensityKgM3.toFixed(
            3
          ),

        unit:
          'kg/m³',
      },

      {
        label:
          'Nozzle Area',

        value:
          (
            simulation.nozzleAreaM2 *
            1000000
          ).toFixed(0),

        unit:
          'mm²',
      },

      {
        label:
          'Flow Regime',

        value:
          simulation.chokedFlow
            ? 'CHOKED'
            : 'UNCHOKED',
      },

      {
        label:
          'Blade Speed',

        value:
          simulation.bladeSpeedMS.toFixed(
            1
          ),

        unit:
          'm/s',
      },

      {
        label:
          'Speed Ratio',

        value:
          simulation.speedRatio.toFixed(
            3
          ),
      },

      {
        label:
          'Steam Torque',

        value:
          simulation.steamTorqueNm.toFixed(
            0
          ),

        unit:
          'N·m',
      },

      {
        label:
          'Generator Demand',

        value:
          simulation.generatorLoadTorqueNm.toFixed(
            0
          ),

        unit:
          'N·m',

        active:
          breakerClosed,
      },

      {
        label:
          'Electrical Torque',

        value:
          simulation.electromagneticTorqueNm.toFixed(
            0
          ),

        unit:
          'N·m',

        active:
          breakerClosed,
      },

      {
        label:
          'Net Torque',

        value:
          simulation.netTorqueNm.toFixed(
            0
          ),

        unit:
          'N·m',
      },

      {
        label:
          'Turbine Power',

        value:
          simulation.turbinePowerKW.toFixed(
            1
          ),

        unit:
          'kW',
      },

      {
        label:
          'Electrical Export',

        value:
          simulation.electricalExportKW.toFixed(
            1
          ),

        unit:
          'kW',

        active:
          breakerClosed &&
          simulation.electricalExportKW >
            0,
      },

      {
        label:
          'Grid Import',

        value:
          simulation.gridImportKW.toFixed(
            1
          ),

        unit:
          'kW',

        warning:
          breakerClosed &&
          simulation.gridImportKW >
            1,
      },

      {
        label:
          'Output Current',

        value:
          simulation.outputCurrentA.toFixed(
            1
          ),

        unit:
          'A',

        active:
          breakerClosed,
      },

      {
        label:
          'Stage Efficiency',

        value:
          (
            simulation.stageEfficiency *
            100
          ).toFixed(1),

        unit:
          '%',
      },

      {
        label:
          'Oil Pressure',

        value:
          simulation.oilPressureBar.toFixed(
            2
          ),

        unit:
          'bar',

        warning:
          oilWarning,
      },

      {
        label:
          'Bearing Temperature',

        value:
          simulation.bearingTemperatureC.toFixed(
            1
          ),

        unit:
          '°C',

        warning:
          bearingWarning,
      },

      {
        label:
          'Vibration',

        value:
          simulation.vibrationMmS.toFixed(
            2
          ),

        unit:
          'mm/s',

        warning:
          vibrationWarning,
      },

      {
        label:
          'Breaker State',

        value:
          breakerState,

        active:
          breakerState ===
          'CLOSED',

        warning:
          breakerState ===
          'TRIPPED',
      },
    ];

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <style>{`
        @keyframes steamForward {
          from {
            stroke-dashoffset: 120;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes steamEddy {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: 90;
          }
        }

        @keyframes electricForward {
          from {
            stroke-dashoffset: 60;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes tripPulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.3;
          }
        }

        .steam-upstream {
          stroke-dasharray: 17 14;

          animation:
            steamForward
            var(--inlet-flow-duration)
            linear
            infinite;
        }

        .steam-nozzle {
          stroke-dasharray: 15 10;

          animation:
            steamForward
            var(--nozzle-flow-duration)
            linear
            infinite;
        }

        .steam-jet {
          stroke-dasharray: 23 9;

          animation:
            steamForward
            var(--jet-flow-duration)
            linear
            infinite;
        }

        .steam-exhaust {
          stroke-dasharray: 20 16;

          animation:
            steamForward
            var(--exhaust-flow-duration)
            linear
            infinite;
        }

        .steam-eddy {
          stroke-dasharray: 10 12;

          animation:
            steamEddy
            var(--eddy-flow-duration)
            linear
            infinite;
        }

        .electric-flow {
          stroke-dasharray: 18 12;

          animation:
            electricForward
            var(--electric-duration)
            linear
            infinite;
        }

        .simulation-paused .steam-upstream,
        .simulation-paused .steam-nozzle,
        .simulation-paused .steam-jet,
        .simulation-paused .steam-exhaust,
        .simulation-paused .steam-eddy,
        .simulation-paused .electric-flow {
          animation-play-state:
            paused;
        }

        .interactive-part {
          cursor: pointer;

          transition:
            opacity
            150ms
            ease;
        }

        .interactive-part:hover {
          opacity: 0.82;
        }

        .trip-pulse {
          animation:
            tripPulse
            0.8s
            ease-in-out
            infinite;
        }
      `}</style>

      <header className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  tripActive ||
                  breakerState ===
                    'TRIPPED'
                    ? 'trip-pulse bg-red-500'
                    : breakerClosed
                      ? 'bg-emerald-500'
                      : autoSyncArmed
                        ? 'bg-cyan-500'
                        : running
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                }`}
              />

              <h2 className="text-xl font-black text-slate-900">
                Industrial Impulse
                Turbine–Generator V10
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-600">
              Realistic pressurised
              inlet, converging nozzle
              jet, expanding exhaust
              diffuser, rotating shaft,
              generator and protected
              breaker.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setRunning(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
            >
              {running
                ? 'Pause'
                : 'Start'}
            </button>

            <button
              type="button"
              onClick={
                resetSystem
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Reset System
            </button>

            <button
              type="button"
              onClick={() =>
                setShowLabels(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="rounded-lg border border-blue-700 bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              {showLabels
                ? 'Hide Labels'
                : 'Show Labels'}
            </button>

            <button
              type="button"
              disabled={
                breakerClosed ||
                tripActive ||
                breakerState ===
                  'TRIPPED' ||
                (
                  breakerState !==
                    'ARMED' &&
                  !autoSyncArmReady
                )
              }
              onClick={() =>
                breakerState ===
                'ARMED'
                  ? cancelAutoSync()
                  : armAutoSync()
              }
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-black text-white enabled:hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {breakerState ===
              'ARMED'
                ? 'Cancel Auto Sync'
                : 'Arm Auto Sync'}
            </button>

            <button
              type="button"
              disabled={
                !syncReady ||
                breakerClosed ||
                tripActive ||
                breakerState ===
                  'TRIPPED'
              }
              onClick={() =>
                closeBreaker(
                  'MANUAL'
                )
              }
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white enabled:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Close Breaker
            </button>

            <button
              type="button"
              disabled={
                breakerState ===
                  'OPEN' ||
                breakerState ===
                  'TRIPPED'
              }
              onClick={() =>
                breakerState ===
                'ARMED'
                  ? cancelAutoSync()
                  : openBreaker(
                      'Breaker opened manually'
                    )
              }
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-black text-white enabled:hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {breakerState ===
              'ARMED'
                ? 'Cancel Sync'
                : 'Open Breaker'}
            </button>

            <button
              type="button"
              onClick={() => {
                setTripActive(
                  true
                );

                patchControlsRef({
                  tripActive:
                    true,
                });
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700"
            >
              Emergency Trip
            </button>

            {(
              tripActive ||
              breakerState ===
                'TRIPPED'
            ) && (
              <button
                type="button"
                onClick={
                  resetProtection
                }
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-black text-red-700 hover:bg-red-50"
              >
                Reset Protection
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
              Governor Control Mode
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={
                  breakerClosed
                }
                onClick={() => {
                  setControlMode(
                    'MANUAL_VALVE'
                  );

                  patchControlsRef({
                    controlMode:
                      'MANUAL_VALVE',
                  });

                  if (
                    breakerState ===
                    'ARMED'
                  ) {
                    cancelAutoSync();
                  }
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40 ${
                  controlMode ===
                  'MANUAL_VALVE'
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Manual Valve
              </button>

              <button
                type="button"
                disabled={
                  tripActive
                }
                onClick={() => {
                  setControlMode(
                    'AUTO_SPEED'
                  );

                  patchControlsRef({
                    controlMode:
                      'AUTO_SPEED',
                  });
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40 ${
                  controlMode ===
                  'AUTO_SPEED'
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                Automatic Speed
                Governor
              </button>
            </div>
          </div>

          {controlMode ===
          'MANUAL_VALVE' ? (
            <label>
              <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-600">
                <span>
                  Governor Valve
                  Command
                </span>

                <span className="font-mono text-blue-700">
                  {
                    manualValvePercent
                  }
                  %
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={
                  manualValvePercent
                }
                disabled={
                  tripActive
                }
                onChange={(
                  event
                ) =>
                  setManualValvePercent(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                className="w-full accent-blue-700 disabled:opacity-40"
              />

              <div className="mt-1 flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>
                  Fully Closed
                </span>

                <span>
                  Fully Open
                </span>
              </div>
            </label>
          ) : (
            <label>
              <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-600">
                <span>
                  Speed Setpoint
                </span>

                <span className="font-mono text-emerald-700">
                  {
                    speedSetpointPercent
                  }
                  %
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={105}
                step={1}
                value={
                  speedSetpointPercent
                }
                disabled={
                  breakerClosed ||
                  tripActive
                }
                onChange={(
                  event
                ) =>
                  setSpeedSetpointPercent(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                className="w-full accent-emerald-700 disabled:opacity-40"
              />

              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                PI governor controls
                actual valve travel.
              </p>
            </label>
          )}

          <label>
            <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-600">
              <span>
                Generator Load
              </span>

              <span className="font-mono text-orange-600">
                {
                  electricalLoadPercent
                }
                %
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={
                electricalLoadPercent
              }
              onChange={(
                event
              ) =>
                setElectricalLoadPercent(
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="w-full accent-orange-500"
            />
          </label>

          <label>
            <div className="mb-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-600">
              <span>
                Generator Excitation
              </span>

              <span className="font-mono text-emerald-700">
                {
                  excitationPercent
                }
                %
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={120}
              step={1}
              value={
                excitationPercent
              }
              onChange={(
                event
              ) =>
                setExcitationPercent(
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="w-full accent-emerald-600"
            />
          </label>
        </div>

        <div
          className={`mt-4 rounded-xl border p-3 text-sm font-bold ${
            breakerState ===
              'TRIPPED' ||
            tripActive
              ? 'border-red-300 bg-red-50 text-red-700'
              : breakerState ===
                  'CLOSED'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : breakerState ===
                    'ARMED'
                  ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
                  : 'border-slate-300 bg-white text-slate-700'
          }`}
        >
          {breakerMessage}
        </div>
      </header>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-w-0 border-b border-slate-200 bg-white xl:border-b-0 xl:border-r">
          <svg
            viewBox="0 0 2050 970"
            preserveAspectRatio="xMidYMid meet"
            className={`block h-auto w-full ${
              running
                ? ''
                : 'simulation-paused'
            }`}
            style={svgStyle}
            role="img"
            aria-label="Industrial impulse steam turbine connected to a synchronous generator"
            onClick={() =>
              setSelectedPart(
                'rotor'
              )
            }
          >
            <defs>
              <marker
                id={ids.steamArrow}
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 12 6 L 0 12 Z"
                  fill="#2497d0"
                />
              </marker>

              <marker
                id={ids.forceArrow}
                markerWidth="14"
                markerHeight="14"
                refX="12"
                refY="7"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 14 7 L 0 14 Z"
                  fill="#f97316"
                />
              </marker>

              <marker
                id={ids.oilArrow}
                markerWidth="9"
                markerHeight="9"
                refX="8"
                refY="4.5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 9 4.5 L 0 9 Z"
                  fill="#b45309"
                />
              </marker>

              <marker
                id={
                  ids.electricArrow
                }
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 Z"
                  fill="#059669"
                />
              </marker>

              <marker
                id={ids.labelArrow}
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 0 L 9 4.5 L 0 9 Z"
                  fill="#1e40af"
                />
              </marker>

              <linearGradient
                id={ids.castSteel}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#e5e5e1"
                />

                <stop
                  offset="35%"
                  stopColor="#b2b3af"
                />

                <stop
                  offset="68%"
                  stopColor="#d1d2ce"
                />

                <stop
                  offset="100%"
                  stopColor="#7b7f7b"
                />
              </linearGradient>

              <linearGradient
                id={
                  ids.rearCastSteel
                }
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#b8bbb7"
                />

                <stop
                  offset="100%"
                  stopColor="#676d69"
                />
              </linearGradient>

              <linearGradient
                id={
                  ids.machinedSteel
                }
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ffffff"
                />

                <stop
                  offset="18%"
                  stopColor="#cbd3dc"
                />

                <stop
                  offset="43%"
                  stopColor="#74808c"
                />

                <stop
                  offset="64%"
                  stopColor="#eef1f4"
                />

                <stop
                  offset="100%"
                  stopColor="#596270"
                />
              </linearGradient>

              <linearGradient
                id={ids.rotorSteel}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f2f4f6"
                />

                <stop
                  offset="28%"
                  stopColor="#aeb7c1"
                />

                <stop
                  offset="55%"
                  stopColor="#5f6977"
                />

                <stop
                  offset="79%"
                  stopColor="#d3d8de"
                />

                <stop
                  offset="100%"
                  stopColor="#485260"
                />
              </linearGradient>

              <linearGradient
                id={ids.rotorSide}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#46515f"
                />

                <stop
                  offset="100%"
                  stopColor="#aeb7c1"
                />
              </linearGradient>

              <linearGradient
                id={ids.bladeFront}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ffffff"
                />

                <stop
                  offset="27%"
                  stopColor="#dce2e8"
                />

                <stop
                  offset="56%"
                  stopColor="#7c8794"
                />

                <stop
                  offset="82%"
                  stopColor="#f1f4f6"
                />

                <stop
                  offset="100%"
                  stopColor="#56616f"
                />
              </linearGradient>

              <linearGradient
                id={ids.bladeRear}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#87929f"
                />

                <stop
                  offset="100%"
                  stopColor="#3b4653"
                />
              </linearGradient>

              <linearGradient
                id={ids.cavity}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#30343a"
                />

                <stop
                  offset="100%"
                  stopColor="#16191e"
                />
              </linearGradient>

              <linearGradient
                id={ids.exhaust}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#355f72"
                />

                <stop
                  offset="48%"
                  stopColor="#4f8599"
                />

                <stop
                  offset="100%"
                  stopColor="#284f60"
                />
              </linearGradient>

              <linearGradient
                id={ids.copper}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f7c26b"
                />

                <stop
                  offset="38%"
                  stopColor="#b9681e"
                />

                <stop
                  offset="70%"
                  stopColor="#e69a3b"
                />

                <stop
                  offset="100%"
                  stopColor="#7c3f12"
                />
              </linearGradient>

              <linearGradient
                id={
                  ids.generatorRotor
                }
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#eef2f7"
                />

                <stop
                  offset="25%"
                  stopColor="#96a3b2"
                />

                <stop
                  offset="50%"
                  stopColor="#4c5867"
                />

                <stop
                  offset="75%"
                  stopColor="#cbd3dc"
                />

                <stop
                  offset="100%"
                  stopColor="#525d69"
                />
              </linearGradient>

              <linearGradient
                id={ids.oil}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#facc15"
                />

                <stop
                  offset="100%"
                  stopColor="#b45309"
                />
              </linearGradient>

              <radialGradient
                id={
                  ids.steamGradient
                }
              >
                <stop
                  offset="0%"
                  stopColor="#e8f8ff"
                  stopOpacity="0.9"
                />

                <stop
                  offset="55%"
                  stopColor="#81d4f7"
                  stopOpacity="0.34"
                />

                <stop
                  offset="100%"
                  stopColor="#2497d0"
                  stopOpacity="0"
                />
              </radialGradient>

              <linearGradient
                id={
                  ids.inletSteamGradient
                }
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#8dd8f7"
                  stopOpacity="0.16"
                />

                <stop
                  offset="58%"
                  stopColor="#55b9e7"
                  stopOpacity="0.48"
                />

                <stop
                  offset="100%"
                  stopColor="#e5f8ff"
                  stopOpacity="0.88"
                />
              </linearGradient>

              <linearGradient
                id={
                  ids.exhaustSteamGradient
                }
                x1="0"
                y1="0"
                x2="1"
                y2="0.25"
              >
                <stop
                  offset="0%"
                  stopColor="#dff7ff"
                  stopOpacity="0.58"
                />

                <stop
                  offset="42%"
                  stopColor="#83c9e5"
                  stopOpacity="0.34"
                />

                <stop
                  offset="100%"
                  stopColor="#4da3c7"
                  stopOpacity="0.08"
                />
              </linearGradient>

              <pattern
                id={ids.cutFace}
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect
                  width="8"
                  height="8"
                  fill="#c8cac7"
                />

                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="#848884"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </pattern>

              <filter
                id={ids.shadow}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="2"
                  dy="4"
                  stdDeviation="4"
                  floodColor="#64748b"
                  floodOpacity="0.3"
                />
              </filter>

              <filter
                id={ids.steamGlow}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur
                  stdDeviation="7"
                />
              </filter>

              <filter
                id={
                  ids.steamTurbulence
                }
                x="-12%"
                y="-18%"
                width="124%"
                height="136%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.018 0.055"
                  numOctaves="2"
                  seed="17"
                  result="noise"
                />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="9"
                  xChannelSelector="R"
                  yChannelSelector="B"
                />
              </filter>

              <filter
                id={ids.texture}
                x="-5%"
                y="-5%"
                width="110%"
                height="110%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.075"
                  numOctaves="1"
                  seed="8"
                  result="noise"
                />

                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values="
                    0.16 0 0 0 0.45
                    0 0.16 0 0 0.45
                    0 0 0.16 0 0.45
                    0 0 0 0.07 0
                  "
                  result="softNoise"
                />

                <feComposite
                  in="softNoise"
                  in2="SourceAlpha"
                  operator="in"
                  result="clippedNoise"
                />

                <feBlend
                  in="SourceGraphic"
                  in2="clippedNoise"
                  mode="multiply"
                />
              </filter>

              <clipPath
                id={
                  ids.rearRotorClip
                }
              >
                <rect
                  x={
                    rotorCx +
                    80
                  }
                  y={
                    rotorCy -
                    214
                  }
                  width="165"
                  height="428"
                />
              </clipPath>

              <clipPath
                id={ids.shaftClip}
              >
                <rect
                  x="1070"
                  y={
                    shaftCenterY -
                    31
                  }
                  width={
                    generatorStartX -
                    1070
                  }
                  height="62"
                  rx="4"
                />
              </clipPath>

              <clipPath
                id={ids.journalClip}
              >
                <circle
                  cx={bearingCx}
                  cy={shaftCenterY}
                  r="29"
                />
              </clipPath>

              <clipPath
                id={
                  ids.generatorRotorClip
                }
              >
                <rect
                  x={
                    generatorRotorStartX
                  }
                  y={
                    shaftCenterY -
                    43
                  }
                  width={
                    generatorRotorEndX -
                    generatorRotorStartX
                  }
                  height="86"
                  rx="24"
                />
              </clipPath>

              <clipPath
                id={
                  ids.valvePortClip
                }
              >
                <rect
                  x="308"
                  y={
                    valveOpeningTopY
                  }
                  width="54"
                  height={
                    valveOpeningHeight
                  }
                  rx="3"
                />
              </clipPath>

              <clipPath
                id={ids.exhaustClip}
              >
                <path
                  d={
                    exhaustDiffuserPath
                  }
                />
              </clipPath>
            </defs>

            <rect
              width="2050"
              height="970"
              fill="#ffffff"
            />

            <text
              x="1025"
              y="44"
              textAnchor="middle"
              fontSize="31"
              fontWeight="900"
              fill="#172554"
            >
              INDUSTRIAL IMPULSE
              TURBINE–GENERATOR SET
            </text>

            <text
              x="1025"
              y="68"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#64748b"
            >
              REALISTIC INLET
              ACCELERATION AND
              EXPANDING EXHAUST FLOW
            </text>

            <line
              x1="600"
              y1="82"
              x2="1450"
              y2="82"
              stroke="#1e3a8a"
              strokeWidth="2.5"
            />

            {/* Foundation */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'foundation'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <path
                d="
                  M 390 845
                  L 1940 845
                  L 1960 875
                  L 1960 908
                  L 366 908
                  L 366 875
                  Z
                "
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="415"
                y="858"
                width="1500"
                height="18"
                fill="#6b7280"
                stroke="#374151"
                strokeWidth="2"
              />

              {[
                445,
                635,
                825,
                1015,
                1205,
                1395,
                1585,
                1775,
                1905,
              ].map(
                (
                  x
                ) => (
                  <circle
                    key={x}
                    cx={x}
                    cy="890"
                    r="7"
                    fill="#d1d5db"
                    stroke="#4b5563"
                    strokeWidth="2"
                  />
                )
              )}

              {[
                [
                  440,
                  528,
                ],
                [
                  1125,
                  1213,
                ],
                [
                  1570,
                  1660,
                ],
                [
                  1780,
                  1870,
                ],
              ].map(
                (
                  [
                    startX,
                    endX,
                  ],
                  index
                ) => (
                  <path
                    key={index}
                    d={`
                      M ${startX} 908

                      L ${endX} 908

                      L ${
                        endX -
                        10
                      } 936

                      L ${
                        startX +
                        10
                      } 936

                      Z
                    `}
                    fill={`url(#${ids.castSteel})`}
                    stroke="#4b5563"
                    strokeWidth="3"
                  />
                )
              )}
            </g>

            <path
              d="
                M 492 760
                L 625 760
                L 663 845
                L 464 845
                Z
              "
              fill={`url(#${ids.castSteel})`}
              stroke="#4b5563"
              strokeWidth="4"
            />

            {/* Casing */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'casing'
              )}
              filter={`url(#${ids.texture})`}
            >
              <path
                d={casingOuterPath}
                fill={`url(#${ids.rearCastSteel})`}
                stroke="#4b5563"
                strokeWidth="5"
              />
            </g>

            <path
              d={casingCavityPath}
              fill={`url(#${ids.cavity})`}
              stroke="#4b5563"
              strokeWidth="3"
            />

            {[
              upperCutawayLipPath,
              lowerCutawayLipPath,
            ].map(
              (
                path,
                index
              ) => (
                <g key={index}>
                  <path
                    d={path}
                    fill="none"
                    stroke={`url(#${ids.castSteel})`}
                    strokeWidth="20"
                    strokeLinejoin="round"
                  />

                  <path
                    d={path}
                    fill="none"
                    stroke={`url(#${ids.cutFace})`}
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />

                  <path
                    d={path}
                    fill="none"
                    stroke="#596473"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </g>
              )
            )}

            {/* Realistic exhaust diffuser */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'exhaust'
              )}
            >
              <path
                d={
                  exhaustDiffuserPath
                }
                fill={`url(#${ids.exhaust})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <path
                d="
                  M 696 598

                  C 766 644,
                    846 669,
                    937 672

                  C 1047 673,
                    1155 644,
                    1295 658
                "
                fill="none"
                stroke="#a9bec8"
                strokeWidth="3"
                opacity="0.8"
              />

              <g
                clipPath={`url(#${ids.exhaustClip})`}
              >
                <path
                  d={
                    exhaustSteamPlumePath
                  }
                  fill={`url(#${ids.exhaustSteamGradient})`}
                  opacity={
                    exhaustMistOpacity
                  }
                  filter={`url(#${ids.steamTurbulence})`}
                />

                <ellipse
                  cx="945"
                  cy="731"
                  rx="300"
                  ry="76"
                  fill={`url(#${ids.steamGradient})`}
                  opacity={
                    exhaustMistOpacity *
                    0.65
                  }
                  filter={`url(#${ids.steamGlow})`}
                />

                {exhaustInternalPaths.map(
                  (
                    path,
                    index
                  ) => (
                    <FlowArrow
                      key={path}
                      path={path}
                      color={
                        index ===
                        0
                          ? '#dff7ff'
                          : '#7cc7e5'
                      }
                      width={
                        index ===
                        0
                          ? 4.2
                          : 3.2
                      }
                      opacity={
                        exhaustTraceOpacity *
                        (
                          1 -
                          index *
                            0.08
                        )
                      }
                      className="steam-exhaust"
                      style={{
                        animationDelay:
                          `${
                            index *
                            -0.42
                          }s`,
                      }}
                    />
                  )
                )}

                <FlowArrow
                  path="
                    M 860 628

                    C 894 646,
                      910 672,
                      891 697

                    C 872 721,
                      838 716,
                      833 690
                  "
                  color="#9cd8ed"
                  width={2.2}
                  opacity={
                    exhaustTraceOpacity *
                    0.42
                  }
                  className="steam-eddy"
                />

                <FlowArrow
                  path="
                    M 1032 718

                    C 1064 699,
                      1101 704,
                      1114 730

                    C 1128 757,
                      1099 780,
                      1063 772
                  "
                  color="#9cd8ed"
                  width={2.2}
                  opacity={
                    exhaustTraceOpacity *
                    0.35
                  }
                  className="steam-eddy"
                  style={{
                    animationDelay:
                      '-1.1s',
                  }}
                />
              </g>

              <path
                d="
                  M 1308 645

                  L 1348 675

                  L 1348 784

                  L 1308 806

                  Z
                "
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="3"
              />

              <rect
                x="1348"
                y="633"
                width="88"
                height="195"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="1371"
                y="645"
                width="15"
                height="171"
                fill="#64748b"
                stroke="#374151"
                strokeWidth="2"
              />

              <rect
                x="1386"
                y="661"
                width="42"
                height="139"
                rx="8"
                fill="#2b6075"
                stroke="#374151"
                strokeWidth="2"
              />

              {[
                [
                  1362,
                  661,
                ],
                [
                  1422,
                  661,
                ],
                [
                  1362,
                  800,
                ],
                [
                  1422,
                  800,
                ],
              ].map(
                (
                  [
                    x,
                    y,
                  ],
                  index
                ) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#d1d5db"
                    stroke="#4b5563"
                    strokeWidth="3"
                  />
                )
              )}

              {[
                690,
                731,
                773,
              ].map(
                (
                  y,
                  index
                ) => (
                  <FlowArrow
                    key={y}
                    path={`
                      M 1235 ${
                        y -
                        12
                      }

                      C 1300 ${
                        y -
                        8
                      },

                        1350 ${y},

                        1422 ${y}
                    `}
                    color="#77c6e5"
                    width={
                      3.1 -
                      index *
                        0.25
                    }
                    opacity={
                      exhaustTraceOpacity *
                      (
                        0.82 -
                        index *
                          0.08
                      )
                    }
                    markerId={
                      ids.steamArrow
                    }
                    className="steam-exhaust"
                    style={{
                      animationDelay:
                        `${
                          index *
                          -0.5
                        }s`,
                    }}
                  />
                )
              )}

              {[
                700,
                738,
                777,
              ].map(
                (
                  y,
                  index
                ) => (
                  <FlowArrow
                    key={`out-${y}`}
                    path={`
                      M 1393 ${y}

                      C 1418 ${y},

                        1444 ${
                          y +
                          index *
                            3
                        },

                        1467 ${
                          y +
                          index *
                            5
                        }
                    `}
                    color="#8ed4ee"
                    width={2.4}
                    opacity={
                      exhaustTraceOpacity *
                      0.45
                    }
                    className="steam-exhaust"
                    style={{
                      animationDelay:
                        `${
                          -0.3 -
                          index *
                            0.37
                        }s`,
                    }}
                  />
                )
              )}
            </g>

            {/* Split casing flanges */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'casing'
              )}
            >
              <path
                d="M 480 356 L 582 356"
                stroke={`url(#${ids.castSteel})`}
                strokeWidth="22"
              />

              <path
                d="M 998 356 L 1256 356"
                stroke={`url(#${ids.castSteel})`}
                strokeWidth="22"
              />

              {[
                508,
                548,
                1024,
                1077,
                1130,
                1183,
                1232,
              ].map(
                (
                  x
                ) => (
                  <circle
                    key={x}
                    cx={x}
                    cy="356"
                    r="9"
                    fill="#d1d5db"
                    stroke="#4b5563"
                    strokeWidth="3"
                  />
                )
              )}
            </g>

            {/* Realistic pressurised inlet */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'steamInlet'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <ellipse
                cx="88"
                cy={jetStrikeY}
                rx="42"
                ry="74"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <ellipse
                cx="88"
                cy={jetStrikeY}
                rx="24"
                ry="56"
                fill="#2f6278"
                stroke="#4b5563"
                strokeWidth="3"
              />

              <ellipse
                cx="88"
                cy={jetStrikeY}
                rx="19"
                ry="49"
                fill="#64b9da"
                opacity={
                  upstreamPressureOpacity
                }
              />

              <path
                d={`
                  M 88 ${
                    jetStrikeY -
                    56
                  }

                  L 250 ${
                    jetStrikeY -
                    56
                  }

                  C 292 ${
                    jetStrikeY -
                    56
                  },

                    317 ${
                      jetStrikeY -
                      31
                    },

                    336 ${jetStrikeY}

                  C 317 ${
                    jetStrikeY +
                    31
                  },

                    292 ${
                      jetStrikeY +
                      56
                    },

                    250 ${
                      jetStrikeY +
                      56
                    }

                  L 88 ${
                    jetStrikeY +
                    56
                  }

                  Z
                `}
                fill="#3e7489"
                stroke="#4b5563"
                strokeWidth="4"
              />

              <path
                d={`
                  M 95 ${
                    jetStrikeY -
                    48
                  }

                  L 244 ${
                    jetStrikeY -
                    48
                  }

                  C 280 ${
                    jetStrikeY -
                    48
                  },

                    302 ${
                      jetStrikeY -
                      25
                    },

                    322 ${jetStrikeY}

                  C 302 ${
                    jetStrikeY +
                    25
                  },

                    280 ${
                      jetStrikeY +
                      48
                    },

                    244 ${
                      jetStrikeY +
                      48
                    }

                  L 95 ${
                    jetStrikeY +
                    48
                  }

                  Z
                `}
                fill={`url(#${ids.inletSteamGradient})`}
                opacity={
                  upstreamPressureOpacity
                }
              />

              {Array.from(
                {
                  length: 10,
                },
                (
                  _,
                  index
                ) => {
                  const angle =
                    (
                      2 *
                      Math.PI *
                      index
                    ) /
                    10;

                  return (
                    <circle
                      key={index}
                      cx={
                        88 +
                        Math.cos(
                          angle
                        ) *
                          34
                      }
                      cy={
                        jetStrikeY +
                        Math.sin(
                          angle
                        ) *
                          64
                      }
                      r="5"
                      fill="#d1d5db"
                      stroke="#4b5563"
                      strokeWidth="2"
                    />
                  );
                }
              )}

              {inletUpstreamPaths.map(
                (
                  path,
                  index
                ) => (
                  <FlowArrow
                    key={path}
                    path={path}
                    color={
                      index ===
                      2
                        ? '#dff7ff'
                        : '#72c7e8'
                    }
                    width={
                      index ===
                      2
                        ? 3.6
                        : 2.4
                    }
                    opacity={
                      inletMotionOpacity *
                      (
                        index ===
                        2
                          ? 1
                          : 0.78
                      )
                    }
                    className="steam-upstream"
                    style={{
                      animationDelay:
                        `${
                          index *
                          -0.32
                        }s`,
                    }}
                  />
                )
              )}
            </g>

            {/* Governor valve */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'governorValve'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <rect
                x="296"
                y={
                  jetStrikeY -
                  76
                }
                width="77"
                height="152"
                rx="8"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="312"
                y={
                  jetStrikeY -
                  58
                }
                width="45"
                height="116"
                rx="3"
                fill="#4b5563"
                stroke="#d1d5db"
                strokeWidth="2"
              />

              <rect
                x="308"
                y={
                  jetStrikeY -
                  20
                }
                width="53"
                height="40"
                rx="5"
                fill="#173b4b"
                stroke="#374151"
                strokeWidth="2"
              />

              <rect
                x="311"
                y={
                  valveOpeningTopY
                }
                width="47"
                height={
                  valveOpeningHeight
                }
                rx="3"
                fill="#4eb9e6"
                opacity={
                  0.35 +
                  0.55 *
                    valveVisualOpenFraction
                }
              />

              <line
                x1="308"
                y1={
                  jetStrikeY -
                  21
                }
                x2="361"
                y2={
                  jetStrikeY -
                  21
                }
                stroke="#d1d5db"
                strokeWidth="3"
              />

              <line
                x1="308"
                y1={
                  jetStrikeY +
                  21
                }
                x2="361"
                y2={
                  jetStrikeY +
                  21
                }
                stroke="#d1d5db"
                strokeWidth="3"
              />

              <g
                clipPath={`url(#${ids.valvePortClip})`}
              >
                {[
                  -8,
                  0,
                  8,
                ].map(
                  (
                    offset,
                    index
                  ) => (
                    <FlowArrow
                      key={offset}
                      path={`
                        M 302 ${
                          jetStrikeY +
                          offset
                        }

                        C 323 ${
                          jetStrikeY +
                          offset *
                            0.65
                        },

                          343 ${
                            jetStrikeY +
                            offset *
                              0.35
                          },

                          369 ${
                            jetStrikeY +
                            offset *
                              0.2
                          }
                      `}
                      color={
                        index ===
                        1
                          ? '#e7f9ff'
                          : '#66c7e9'
                      }
                      width={
                        index ===
                        1
                          ? 3.2
                          : 2.1
                      }
                      opacity={
                        inletMotionOpacity
                      }
                      className="steam-nozzle"
                      style={{
                        animationDelay:
                          `${
                            index *
                            -0.22
                          }s`,
                      }}
                    />
                  )
                )}
              </g>

              <rect
                x="329"
                y={
                  valveStemTopY
                }
                width="12"
                height={
                  valveStemHeight
                }
                fill={`url(#${ids.machinedSteel})`}
                stroke="#4b5563"
                strokeWidth="2"
              />

              <rect
                x="313"
                y={valveGateY}
                width="44"
                height={
                  valveGateHeight
                }
                rx="3"
                fill={
                  tripActive
                    ? '#dc2626'
                    : '#f59e0b'
                }
                stroke="#374151"
                strokeWidth="2.5"
              />

              <line
                x1="318"
                y1={
                  valveGateY +
                  valveGateHeight /
                    2
                }
                x2="352"
                y2={
                  valveGateY +
                  valveGateHeight /
                    2
                }
                stroke="#fef3c7"
                strokeWidth="2"
              />

              <ellipse
                cx="335"
                cy={
                  jetStrikeY -
                  172
                }
                rx="51"
                ry="19"
                fill="none"
                stroke="#6b7280"
                strokeWidth="8"
              />

              <line
                x1="284"
                y1={
                  jetStrikeY -
                  172
                }
                x2="386"
                y2={
                  jetStrikeY -
                  172
                }
                stroke="#6b7280"
                strokeWidth="5"
              />

              <line
                x1="335"
                y1={
                  jetStrikeY -
                  191
                }
                x2="335"
                y2={
                  jetStrikeY -
                  153
                }
                stroke="#6b7280"
                strokeWidth="5"
              />

              <line
                x1="372"
                y1={
                  valveFullyOpenY
                }
                x2="372"
                y2={valveClosedY}
                stroke="#64748b"
                strokeWidth="2"
              />

              <line
                x1="367"
                y1={
                  valveFullyOpenY
                }
                x2="377"
                y2={
                  valveFullyOpenY
                }
                stroke="#64748b"
                strokeWidth="2"
              />

              <line
                x1="367"
                y1={
                  valveClosedY
                }
                x2="377"
                y2={
                  valveClosedY
                }
                stroke="#64748b"
                strokeWidth="2"
              />

              <text
                x="380"
                y={
                  valveFullyOpenY +
                  4
                }
                fontSize="9"
                fontWeight="800"
                fill="#475569"
              >
                OPEN
              </text>

              <text
                x="380"
                y={
                  valveClosedY +
                  4
                }
                fontSize="9"
                fontWeight="800"
                fill="#475569"
              >
                CLOSED
              </text>
            </g>

            <rect
              x="373"
              y={
                jetStrikeY -
                28
              }
              width="32"
              height="56"
              fill={`url(#${ids.castSteel})`}
              stroke="#4b5563"
              strokeWidth="3"
            />

            {/* Realistic nozzle flow */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'nozzleChest'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <rect
                x="405"
                y={
                  jetStrikeY -
                  68
                }
                width="175"
                height="136"
                rx="10"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="427"
                y={
                  jetStrikeY -
                  48
                }
                width="129"
                height="96"
                rx="6"
                fill="#4b5563"
                stroke="#6b7280"
                strokeWidth="3"
              />

              <path
                d={`
                  M 358 ${
                    jetStrikeY -
                    17
                  }

                  C 420 ${
                    jetStrikeY -
                    29
                  },

                    500 ${
                      jetStrikeY -
                      34
                    },

                    580 ${
                      jetStrikeY -
                      24
                    }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY -
                      8
                    }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY +
                      8
                    }

                  L 580 ${
                    jetStrikeY +
                    24
                  }

                  C 500 ${
                    jetStrikeY +
                    34
                  },

                    420 ${
                      jetStrikeY +
                      29
                    },

                    358 ${
                      jetStrikeY +
                      17
                    }

                  Z
                `}
                fill={`url(#${ids.inletSteamGradient})`}
                opacity={
                  nozzleMistOpacity
                }
                filter={`url(#${ids.steamTurbulence})`}
              />

              {[
                -28,
                -9,
                9,
                28,
              ].map(
                (
                  offset
                ) => (
                  <path
                    key={offset}
                    d={`
                      M 439 ${
                        jetStrikeY +
                        offset -
                        6
                      }

                      L 545 ${
                        jetStrikeY +
                        offset -
                        2
                      }

                      L 545 ${
                        jetStrikeY +
                        offset +
                        2
                      }

                      L 439 ${
                        jetStrikeY +
                        offset +
                        6
                      }

                      Z
                    `}
                    fill="#d8dee5"
                    stroke="#6b7280"
                    strokeWidth="1.7"
                    opacity="0.65"
                  />
                )
              )}

              <path
                d={`
                  M 580 ${
                    jetStrikeY -
                    26
                  }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY -
                      9
                    }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY +
                      9
                    }

                  L 580 ${
                    jetStrikeY +
                    26
                  }

                  Z
                `}
                fill={`url(#${ids.machinedSteel})`}
                stroke="#4b5563"
                strokeWidth="3"
              />

              <path
                d={`
                  M 584 ${
                    jetStrikeY -
                    14
                  }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY -
                      5
                    }

                  L ${nozzleExitX}
                    ${
                      jetStrikeY +
                      5
                    }

                  L 584 ${
                    jetStrikeY +
                    14
                  }

                  Z
                `}
                fill="#22596f"
                opacity="0.82"
              />

              {nozzleStreamPaths.map(
                (
                  path,
                  index
                ) => (
                  <FlowArrow
                    key={path}
                    path={path}
                    color={
                      index ===
                      2
                        ? '#e8f9ff'
                        : '#71c8e8'
                    }
                    width={
                      index ===
                      2
                        ? 3.5
                        : 2.2
                    }
                    opacity={
                      inletMotionOpacity *
                      (
                        index ===
                        2
                          ? 1
                          : 0.78
                      )
                    }
                    className="steam-nozzle"
                    style={{
                      animationDelay:
                        `${
                          index *
                          -0.26
                        }s`,
                    }}
                  />
                )
              )}
            </g>

            {/* Rotor and internal shaft */}

            <rect
              x={rotorCx}
              y={
                shaftCenterY -
                23
              }
              width="215"
              height="46"
              rx="4"
              fill={`url(#${ids.machinedSteel})`}
              stroke="#374151"
              strokeWidth="3"
            />

            <g
              clipPath={`url(#${ids.rearRotorClip})`}
            >
              <g
                transform={`rotate(${simulation.visualAngleDeg} ${rearRotorCx} ${rearRotorCy})`}
              >
                <circle
                  cx={rearRotorCx}
                  cy={rearRotorCy}
                  r={
                    rotorDiscRadius
                  }
                  fill={`url(#${ids.rotorSide})`}
                  stroke="#374151"
                  strokeWidth="4"
                />

                <BladeRow
                  cx={rearRotorCx}
                  cy={rearRotorCy}
                  bladeCount={
                    bladeCount
                  }
                  rear
                  ids={ids}
                />

                <circle
                  cx={rearRotorCx}
                  cy={rearRotorCy}
                  r={
                    bladeTipRadius
                  }
                  fill="none"
                  stroke="#596473"
                  strokeWidth="6"
                />
              </g>
            </g>

            <path
              d={`
                M ${rotorCx}
                  ${
                    rotorCy -
                    rotorDiscRadius
                  }

                A ${rotorDiscRadius}
                  ${rotorDiscRadius}
                  0 0 1
                  ${
                    rotorCx +
                    rotorDiscRadius
                  }
                  ${rotorCy}

                L ${
                  rearRotorCx +
                  rotorDiscRadius
                }
                  ${rearRotorCy}

                A ${rotorDiscRadius}
                  ${rotorDiscRadius}
                  0 0 0
                  ${rearRotorCx}
                  ${
                    rearRotorCy -
                    rotorDiscRadius
                  }

                Z
              `}
              fill={`url(#${ids.rotorSide})`}
              stroke="#4b5563"
              strokeWidth="3"
              opacity="0.88"
            />

            <g
              className="interactive-part"
              onClick={selectPart(
                'movingBlades'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <g
                transform={`rotate(${simulation.visualAngleDeg} ${rotorCx} ${rotorCy})`}
              >
                <BladeRow
                  cx={rotorCx}
                  cy={rotorCy}
                  bladeCount={
                    bladeCount
                  }
                  ids={ids}
                />

                <circle
                  cx={rotorCx}
                  cy={rotorCy}
                  r={
                    bladeTipRadius
                  }
                  fill="none"
                  stroke="#596473"
                  strokeWidth="6"
                />

                <circle
                  cx={rotorCx}
                  cy={rotorCy}
                  r={
                    bladeRootRadius +
                    6
                  }
                  fill="none"
                  stroke="#46515f"
                  strokeWidth="11"
                />
              </g>
            </g>

            <g
              className="interactive-part"
              onClick={selectPart(
                'rotor'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <g
                transform={`rotate(${simulation.visualAngleDeg} ${rotorCx} ${rotorCy})`}
              >
                <circle
                  cx={rotorCx}
                  cy={rotorCy}
                  r={
                    rotorDiscRadius
                  }
                  fill={`url(#${ids.rotorSteel})`}
                  stroke="#374151"
                  strokeWidth="5"
                />

                {[
                  84,
                  92,
                  100,
                  108,
                  116,
                  122,
                ].map(
                  (
                    radius
                  ) => (
                    <circle
                      key={radius}
                      cx={rotorCx}
                      cy={rotorCy}
                      r={radius}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="0.8"
                      opacity="0.24"
                    />
                  )
                )}

                <circle
                  cx={rotorCx}
                  cy={rotorCy}
                  r="71"
                  fill={`url(#${ids.rotorSteel})`}
                  stroke="#374151"
                  strokeWidth="4"
                />

                <circle
                  cx={rotorCx}
                  cy={rotorCy}
                  r="38"
                  fill={`url(#${ids.machinedSteel})`}
                  stroke="#374151"
                  strokeWidth="4"
                />

                {Array.from(
                  {
                    length: 12,
                  },
                  (
                    _,
                    index
                  ) => {
                    const angle =
                      (
                        2 *
                        Math.PI *
                        index
                      ) /
                      12;

                    return (
                      <circle
                        key={index}
                        cx={
                          rotorCx +
                          Math.cos(
                            angle
                          ) *
                            56
                        }
                        cy={
                          rotorCy +
                          Math.sin(
                            angle
                          ) *
                            56
                        }
                        r="7"
                        fill="#e5e7eb"
                        stroke="#374151"
                        strokeWidth="2.2"
                      />
                    );
                  }
                )}
              </g>
            </g>

            {/* Realistic jet and blade exit */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'steamJet'
              )}
            >
              <path
                d={`
                  M ${nozzleExitX}
                    ${jetStrikeY}

                  L ${bladeEntryX}
                    ${jetStrikeY}
                `}
                fill="none"
                stroke="#dff7ff"
                strokeWidth={
                  jetWidth +
                  10
                }
                strokeLinecap="round"
                opacity={
                  jetOpacity *
                  0.5
                }
                filter={`url(#${ids.steamGlow})`}
              />

              {[
                -6,
                0,
                6,
              ].map(
                (
                  offset,
                  index
                ) => (
                  <FlowArrow
                    key={offset}
                    path={`
                      M ${nozzleExitX}
                        ${
                          jetStrikeY +
                          offset
                        }

                      C ${
                        nozzleExitX +
                        20
                      }
                        ${
                          jetStrikeY +
                          offset *
                            0.65
                        },

                        ${
                          bladeEntryX -
                          13
                        }
                        ${
                          jetStrikeY +
                          offset *
                            0.22
                        },

                        ${bladeEntryX}
                        ${
                          jetStrikeY +
                          offset *
                            0.16
                        }
                    `}
                    color={
                      index ===
                      1
                        ? '#e9fbff'
                        : '#4bb6e2'
                    }
                    width={
                      index ===
                      1
                        ? jetWidth
                        : Math.max(
                            jetWidth *
                              0.5,
                            1.5
                          )
                    }
                    opacity={
                      jetOpacity
                    }
                    markerId={
                      index ===
                      1
                        ? ids.steamArrow
                        : undefined
                    }
                    className="steam-jet"
                    style={{
                      animationDelay:
                        `${
                          index *
                          -0.13
                        }s`,
                    }}
                  />
                )
              )}

              <FlowArrow
                path={`
                  M ${
                    bladeEntryX -
                    3
                  }
                    ${jetStrikeY}

                  C ${
                    bladeEntryX +
                    30
                  }
                    ${
                      jetStrikeY +
                      3
                    },

                    750 300,

                    767 329
                `}
                color="#7dd0ed"
                width={2.8}
                opacity={
                  jetOpacity *
                  0.72
                }
                markerId={
                  ids.steamArrow
                }
                className="steam-jet"
              />

              <FlowArrow
                path="
                  M 850 565

                  C 874 592,
                    891 611,
                    922 628
                "
                color="#8fd6ef"
                width={3.2}
                opacity={
                  exhaustTraceOpacity *
                  0.72
                }
                markerId={
                  ids.steamArrow
                }
                className="steam-exhaust"
              />
            </g>

            {/* Gland */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'glandSeal'
              )}
            >
              <rect
                x="978"
                y={
                  shaftCenterY -
                  50
                }
                width="116"
                height="100"
                rx="12"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="986"
                y={
                  shaftCenterY -
                  14
                }
                width="101"
                height="28"
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="2"
              />

              {[
                1000,
                1014,
                1028,
                1042,
                1056,
                1070,
              ].map(
                (
                  x,
                  index
                ) => (
                  <g key={x}>
                    <rect
                      x={x}
                      y={
                        index %
                          2
                          ? shaftCenterY -
                            32
                          : shaftCenterY -
                            40
                      }
                      width="5"
                      height={
                        index %
                          2
                          ? 23
                          : 31
                      }
                      fill="#d1d5db"
                    />

                    <rect
                      x={x}
                      y={
                        shaftCenterY +
                        9
                      }
                      width="5"
                      height={
                        index %
                          2
                          ? 35
                          : 27
                      }
                      fill="#d1d5db"
                    />
                  </g>
                )
              )}
            </g>

            {/* Rotating shaft */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'shaft'
              )}
            >
              <path
                d={`
                  M 1076 ${
                    shaftCenterY -
                    22
                  }

                  L 1384 ${
                    shaftCenterY -
                    22
                  }

                  L 1384 ${
                    shaftCenterY -
                    28
                  }

                  L ${generatorStartX}
                    ${
                      shaftCenterY -
                      28
                    }

                  L ${generatorStartX}
                    ${
                      shaftCenterY +
                      28
                    }

                  L 1384 ${
                    shaftCenterY +
                    28
                  }

                  L 1384 ${
                    shaftCenterY +
                    22
                  }

                  L 1076 ${
                    shaftCenterY +
                    22
                  }

                  Z
                `}
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="4"
              />

              <g
                clipPath={`url(#${ids.shaftClip})`}
              >
                {shaftSurfaceMarks.map(
                  (
                    mark,
                    index
                  ) => (
                    <path
                      key={index}
                      d={`
                        M 1085 ${mark.y}

                        C 1190 ${
                          mark.y -
                          2
                        },

                          1360 ${
                            mark.y +
                            2
                          },

                          ${
                            generatorStartX -
                            5
                          }
                          ${mark.y}
                      `}
                      fill="none"
                      stroke={
                        index ===
                        0
                          ? '#ffffff'
                          : '#475569'
                      }
                      strokeWidth={
                        mark.width
                      }
                      opacity={
                        mark.opacity
                      }
                    />
                  )
                )}

                <line
                  x1="1095"
                  y1={shaftKeyY}
                  x2={
                    generatorStartX -
                    10
                  }
                  y2={shaftKeyY}
                  stroke="#334155"
                  strokeWidth="3"
                  opacity={
                    shaftKeyOpacity
                  }
                />
              </g>
            </g>

            {/* Bearing */}

            <path
              d="
                M 1100 570
                L 1250 570
                L 1238 845
                L 1112 845
                Z
              "
              fill={`url(#${ids.castSteel})`}
              stroke="#4b5563"
              strokeWidth="4"
            />

            <g
              className="interactive-part"
              onClick={selectPart(
                'bearing'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <path
                d={`
                  M ${
                    bearingCx -
                    72
                  }
                    ${
                      shaftCenterY -
                      70
                    }

                  Q ${bearingCx}
                    ${
                      shaftCenterY -
                      122
                    }

                    ${
                      bearingCx +
                      72
                    }
                    ${
                      shaftCenterY -
                      70
                    }

                  L ${
                    bearingCx +
                    72
                  }
                    ${
                      shaftCenterY +
                      105
                    }

                  L ${
                    bearingCx -
                    72
                  }
                    ${
                      shaftCenterY +
                      105
                    }

                  Z
                `}
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <circle
                cx={bearingCx}
                cy={shaftCenterY}
                r="43"
                fill="#d7d7d2"
                stroke="#4b5563"
                strokeWidth="3"
              />

              <line
                x1={
                  bearingCx -
                  48
                }
                y1={
                  shaftCenterY
                }
                x2={
                  bearingCx +
                  48
                }
                y2={
                  shaftCenterY
                }
                stroke="#4b5563"
                strokeWidth="3"
              />

              <circle
                cx={bearingCx}
                cy={shaftCenterY}
                r="34.5"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                opacity={
                  0.25 +
                  simulation.oilPressureBar /
                    13
                }
              />

              <circle
                cx={bearingCx}
                cy={shaftCenterY}
                r="29"
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="3"
              />

              <g
                clipPath={`url(#${ids.journalClip})`}
              >
                {shaftSurfaceMarks.map(
                  (
                    mark,
                    index
                  ) => (
                    <line
                      key={index}
                      x1={
                        bearingCx -
                        29
                      }
                      y1={mark.y}
                      x2={
                        bearingCx +
                        29
                      }
                      y2={mark.y}
                      stroke={
                        index ===
                        0
                          ? '#ffffff'
                          : '#475569'
                      }
                      strokeWidth={
                        mark.width
                      }
                      opacity={
                        mark.opacity
                      }
                    />
                  )
                )}
              </g>

              <g
                transform={`rotate(${simulation.visualAngleDeg} ${bearingCx} ${shaftCenterY})`}
              >
                <line
                  x1={bearingCx}
                  y1={
                    shaftCenterY
                  }
                  x2={
                    bearingCx +
                    23
                  }
                  y2={
                    shaftCenterY
                  }
                  stroke="#334155"
                  strokeWidth="3"
                />

                <circle
                  cx={
                    bearingCx +
                    23
                  }
                  cy={
                    shaftCenterY
                  }
                  r="4"
                  fill="#f97316"
                />
              </g>

              <circle
                cx={
                  bearingCx +
                  49
                }
                cy={
                  shaftCenterY -
                  88
                }
                r="8"
                fill={
                  bearingWarning
                    ? '#dc2626'
                    : '#f59e0b'
                }
                stroke="#4b5563"
                strokeWidth="3"
              />
            </g>

            {/* Oil */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'oilSystem'
              )}
            >
              <FlowArrow
                path={`
                  M 1318 315

                  L 1275 315

                  L 1275 ${
                    shaftCenterY -
                    108
                  }

                  L ${bearingCx}
                    ${
                      shaftCenterY -
                      108
                    }
                `}
                color="#b45309"
                width={3.5}
                opacity={0.95}
                markerId={
                  ids.oilArrow
                }
              />

              <FlowArrow
                path={`
                  M ${bearingCx}
                    ${
                      shaftCenterY +
                      105
                    }

                  L ${bearingCx}
                    626

                  L 1318 626
                `}
                color="#b45309"
                width={3.5}
                opacity={0.95}
                markerId={
                  ids.oilArrow
                }
              />

              <rect
                x="1318"
                y="287"
                width="86"
                height="54"
                rx="7"
                fill="#ffffff"
                stroke="#4b5563"
                strokeWidth="3"
              />

              <rect
                x="1331"
                y="300"
                width="58"
                height="27"
                rx="4"
                fill={`url(#${ids.oil})`}
              />

              <text
                x="1360"
                y="318"
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="#78350f"
              >
                OIL SUPPLY
              </text>

              <rect
                x="1318"
                y="603"
                width="92"
                height="48"
                rx="7"
                fill="#ffffff"
                stroke="#4b5563"
                strokeWidth="3"
              />

              <path
                d="M 1331 636 L 1397 636"
                stroke="#b45309"
                strokeWidth="8"
              />

              <text
                x="1364"
                y="620"
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="#78350f"
              >
                OIL DRAIN
              </text>
            </g>

            {/* Coupling */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'coupling'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <ellipse
                cx={
                  couplingCx -
                  20
                }
                cy={
                  shaftCenterY
                }
                rx="17"
                ry="45"
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="4"
              />

              <ellipse
                cx={
                  couplingCx +
                  20
                }
                cy={
                  shaftCenterY
                }
                rx="17"
                ry="45"
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="4"
              />

              <rect
                x={
                  couplingCx -
                  20
                }
                y={
                  shaftCenterY -
                  31
                }
                width="40"
                height="62"
                fill="#64748b"
                stroke="#374151"
                strokeWidth="3"
              />

              <g
                transform={`rotate(${simulation.visualAngleDeg} ${couplingCx} ${shaftCenterY})`}
              >
                {[
                  0,
                  90,
                  180,
                  270,
                ].map(
                  (
                    angleDeg
                  ) => {
                    const angleRad =
                      (
                        angleDeg *
                        Math.PI
                      ) /
                      180;

                    return (
                      <circle
                        key={
                          angleDeg
                        }
                        cx={
                          couplingCx +
                          Math.cos(
                            angleRad
                          ) *
                            21
                        }
                        cy={
                          shaftCenterY +
                          Math.sin(
                            angleRad
                          ) *
                            31
                        }
                        r="5"
                        fill="#d1d5db"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                    );
                  }
                )}
              </g>
            </g>

            {/* Generator supports */}

            <path
              d="
                M 1540 615
                L 1638 615
                L 1658 845
                L 1520 845
                Z
              "
              fill={`url(#${ids.castSteel})`}
              stroke="#4b5563"
              strokeWidth="4"
            />

            <path
              d="
                M 1762 615
                L 1860 615
                L 1880 845
                L 1742 845
                Z
              "
              fill={`url(#${ids.castSteel})`}
              stroke="#4b5563"
              strokeWidth="4"
            />

            {/* Generator */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'generator'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <path
                d={`
                  M ${generatorStartX}
                    315

                  L 1838 315

                  Q ${generatorEndX}
                    315
                    ${generatorEndX}
                    375

                  L ${generatorEndX}
                    555

                  Q ${generatorEndX}
                    615
                    1838 615

                  L ${generatorStartX}
                    615

                  Q 1460 615
                    1460 575

                  L 1460 355

                  Q 1460 315
                    ${generatorStartX}
                    315

                  Z
                `}
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="5"
                filter={`url(#${ids.texture})`}
              />

              <path
                d="
                  M 1510 342

                  L 1830 342

                  Q 1864 342
                    1864 380

                  L 1864 550

                  Q 1864 588
                    1830 588

                  L 1510 588

                  Z
                "
                fill="#20252b"
                stroke="#4b5563"
                strokeWidth="3"
              />

              <text
                x="1680"
                y="648"
                textAnchor="middle"
                fontSize="16"
                fontWeight="900"
                fill="#374151"
              >
                SYNCHRONOUS GENERATOR
              </text>
            </g>

            {/* Stator */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'generatorStator'
              )}
            >
              <rect
                x="1512"
                y="354"
                width="330"
                height="61"
                rx="12"
                fill="#4b5563"
                stroke="#94a3b8"
                strokeWidth="3"
              />

              <rect
                x="1512"
                y="525"
                width="330"
                height="61"
                rx="12"
                fill="#4b5563"
                stroke="#94a3b8"
                strokeWidth="3"
              />

              {Array.from(
                {
                  length: 12,
                },
                (
                  _,
                  index
                ) =>
                  1534 +
                  index *
                    26
              ).map(
                (
                  x
                ) => (
                  <g key={x}>
                    <path
                      d={`
                        M ${x} 371

                        C ${
                          x +
                          8
                        } 353,

                          ${
                            x +
                            16
                          } 353,

                          ${
                            x +
                            24
                          } 371
                      `}
                      fill="none"
                      stroke={`url(#${ids.copper})`}
                      strokeWidth="7"
                      strokeLinecap="round"
                    />

                    <path
                      d={`
                        M ${x} 568

                        C ${
                          x +
                          8
                        } 586,

                          ${
                            x +
                            16
                          } 586,

                          ${
                            x +
                            24
                          } 568
                      `}
                      fill="none"
                      stroke={`url(#${ids.copper})`}
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </g>
                )
              )}
            </g>

            {/* Generator shaft and rotor */}

            <rect
              x={
                generatorStartX -
                25
              }
              y={
                shaftCenterY -
                20
              }
              width="390"
              height="40"
              fill={`url(#${ids.machinedSteel})`}
              stroke="#374151"
              strokeWidth="3"
            />

            <g
              className="interactive-part"
              onClick={selectPart(
                'generatorRotor'
              )}
            >
              <rect
                x={
                  generatorRotorStartX
                }
                y={
                  shaftCenterY -
                  43
                }
                width={
                  generatorRotorEndX -
                  generatorRotorStartX
                }
                height="86"
                rx="24"
                fill={`url(#${ids.generatorRotor})`}
                stroke="#374151"
                strokeWidth="4"
              />

              <g
                clipPath={`url(#${ids.generatorRotorClip})`}
              >
                {generatorSurfaceMarks.map(
                  (
                    mark,
                    index
                  ) => (
                    <path
                      key={index}
                      d={`
                        M ${
                          generatorRotorStartX +
                          8
                        }
                          ${mark.y}

                        C 1620 ${
                          mark.y -
                          3
                        },

                          1740 ${
                            mark.y +
                            3
                          },

                          ${
                            generatorRotorEndX -
                            8
                          }
                          ${mark.y}
                      `}
                      fill="none"
                      stroke={
                        index ===
                        0
                          ? '#ffffff'
                          : '#334155'
                      }
                      strokeWidth={
                        mark.width
                      }
                      opacity={
                        mark.opacity
                      }
                    />
                  )
                )}

                <line
                  x1={
                    generatorRotorStartX +
                    18
                  }
                  y1={shaftKeyY}
                  x2={
                    generatorRotorEndX -
                    18
                  }
                  y2={shaftKeyY}
                  stroke="#f97316"
                  strokeWidth="3"
                  opacity={
                    shaftKeyOpacity
                  }
                />
              </g>
            </g>

            {/* Cooling fan */}

            <ellipse
              cx={
                generatorFanCx
              }
              cy={
                shaftCenterY
              }
              rx="25"
              ry="57"
              fill="#d8dee5"
              stroke="#374151"
              strokeWidth="4"
            />

            <g
              transform={`rotate(${simulation.visualAngleDeg} ${generatorFanCx} ${shaftCenterY})`}
            >
              {Array.from(
                {
                  length: 6,
                },
                (
                  _,
                  index
                ) =>
                  index *
                  60
              ).map(
                (
                  angleDeg
                ) => (
                  <g
                    key={
                      angleDeg
                    }
                    transform={`rotate(${angleDeg} ${generatorFanCx} ${shaftCenterY})`}
                  >
                    <path
                      d={`
                        M ${
                          generatorFanCx +
                          5
                        }
                          ${
                            shaftCenterY -
                            4
                          }

                        C ${
                          generatorFanCx +
                          16
                        }
                          ${
                            shaftCenterY -
                            12
                          },

                          ${
                            generatorFanCx +
                            23
                          }
                          ${
                            shaftCenterY -
                            18
                          },

                          ${
                            generatorFanCx +
                            30
                          }
                          ${
                            shaftCenterY -
                            13
                          }

                        L ${
                          generatorFanCx +
                          17
                        }
                          ${
                            shaftCenterY +
                            3
                          }

                        Z
                      `}
                      fill="#64748b"
                      stroke="#374151"
                      strokeWidth="1.5"
                    />
                  </g>
                )
              )}

              <circle
                cx={
                  generatorFanCx
                }
                cy={
                  shaftCenterY
                }
                r="10"
                fill={`url(#${ids.machinedSteel})`}
                stroke="#374151"
                strokeWidth="2"
              />
            </g>

            {/* Electrical output */}

            <g
              className="interactive-part"
              onClick={selectPart(
                'electricalOutput'
              )}
              filter={`url(#${ids.shadow})`}
            >
              <rect
                x="1635"
                y="224"
                width="150"
                height="92"
                rx="10"
                fill={`url(#${ids.castSteel})`}
                stroke="#4b5563"
                strokeWidth="4"
              />

              <rect
                x="1654"
                y="244"
                width="112"
                height="48"
                rx="6"
                fill="#ffffff"
                stroke="#475569"
                strokeWidth="3"
              />

              {[
                1674,
                1710,
                1746,
              ].map(
                (
                  x,
                  index
                ) => (
                  <circle
                    key={x}
                    cx={x}
                    cy="268"
                    r="10"
                    fill={
                      breakerClosed
                        ? [
                            '#ef4444',
                            '#facc15',
                            '#2563eb',
                          ][index]
                        : '#94a3b8'
                    }
                    stroke="#374151"
                    strokeWidth="2"
                  />
                )
              )}

              <rect
                x="1798"
                y="244"
                width="78"
                height="48"
                rx="8"
                fill={
                  breakerState ===
                  'CLOSED'
                    ? '#dcfce7'
                    : breakerState ===
                        'TRIPPED'
                      ? '#fee2e2'
                      : breakerState ===
                          'ARMED'
                        ? '#cffafe'
                        : '#ffffff'
                }
                stroke={
                  breakerState ===
                  'CLOSED'
                    ? '#059669'
                    : breakerState ===
                        'TRIPPED'
                      ? '#dc2626'
                      : breakerState ===
                          'ARMED'
                        ? '#0891b2'
                        : '#64748b'
                }
                strokeWidth="3"
              />

              <text
                x="1837"
                y="262"
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="#475569"
              >
                BREAKER
              </text>

              <text
                x="1837"
                y="281"
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill={
                  breakerState ===
                  'CLOSED'
                    ? '#047857'
                    : breakerState ===
                        'TRIPPED'
                      ? '#b91c1c'
                      : breakerState ===
                          'ARMED'
                        ? '#0e7490'
                        : '#475569'
                }
              >
                {breakerState}
              </text>
            </g>

            {[
              {
                color:
                  '#ef4444',

                y:
                  250,
              },

              {
                color:
                  '#d6a800',

                y:
                  270,
              },

              {
                color:
                  '#2563eb',

                y:
                  290,
              },
            ].map(
              (
                phase,
                index
              ) => (
                <path
                  key={phase.y}
                  d={`
                    M 1876 ${
                      phase.y
                    }

                    L 2020 ${
                      phase.y
                    }
                  `}
                  fill="none"
                  stroke={
                    phase.color
                  }
                  strokeWidth="4"
                  strokeDasharray="18 12"
                  markerEnd={`url(#${ids.electricArrow})`}
                  opacity={
                    electricalOpacity
                  }
                  className="electric-flow"
                  style={{
                    animationDelay:
                      `${
                        index *
                        -0.18
                      }s`,
                  }}
                />
              )
            )}

            <text
              x="1940"
              y="226"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill={
                breakerClosed
                  ? '#047857'
                  : '#64748b'
              }
            >
              THREE-PHASE OUTPUT
            </text>

            {/* Torque arrows */}

            <FlowArrow
              path="
                M 694 249

                C 735 232,
                  780 237,
                  818 259
              "
              color="#f97316"
              width={clamp(
                4 +
                  simulation.steamTorqueNm /
                    360,
                4,
                8
              )}
              opacity={
                simulation.massFlowKgS >
                0.001
                  ? 0.92
                  : 0.14
              }
              markerId={
                ids.forceArrow
              }
            />

            <FlowArrow
              path="
                M 860 336

                C 941 398,
                  960 505,
                  899 591
              "
              color="#f97316"
              width={6}
              opacity={
                simulation.rpm >
                5
                  ? 0.92
                  : 0.18
              }
              markerId={
                ids.forceArrow
              }
            />

            <text
              x="1422"
              y={
                shaftCenterY -
                78
              }
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill="#475569"
            >
              SHAFT ROTATION
            </text>

            <FlowArrow
              path={`
                M 1384 ${
                  shaftCenterY -
                  64
                }

                C 1405 ${
                  shaftCenterY -
                  88
                },

                  1445 ${
                    shaftCenterY -
                    88
                  },

                  1467 ${
                    shaftCenterY -
                    62
                  }
              `}
              color="#f97316"
              width={3.5}
              opacity={
                simulation.rpm >
                5
                  ? 0.85
                  : 0.16
              }
              markerId={
                ids.forceArrow
              }
            />

            {/* Selection highlights */}

            {selectedPart ===
              'movingBlades' && (
              <circle
                cx={rotorCx}
                cy={rotorCy}
                r={
                  bladeTipRadius +
                  10
                }
                fill="none"
                stroke="#eab308"
                strokeWidth="4"
                strokeDasharray="13 9"
              />
            )}

            {selectedPart ===
              'rotor' && (
              <circle
                cx={rotorCx}
                cy={rotorCy}
                r={
                  rotorDiscRadius +
                  5
                }
                fill="none"
                stroke="#eab308"
                strokeWidth="4"
              />
            )}

            {[
              'generator',
              'generatorRotor',
              'generatorStator',
              'electricalOutput',
            ].includes(
              selectedPart
            ) && (
              <rect
                x="1450"
                y="210"
                width="470"
                height="420"
                rx="45"
                fill="none"
                stroke="#eab308"
                strokeWidth="4"
                strokeDasharray="14 10"
              />
            )}

            {/* Labels */}

            {showLabels && (
              <>
                <Callout
                  x={42}
                  y={105}
                  width={130}
                  height={40}
                  lines={[
                    'Pressurised Inlet',
                  ]}
                  target={[
                    145,
                    jetStrikeY -
                      49,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={222}
                  y={48}
                  width={145}
                  height={54}
                  lines={[
                    'Governor',
                    'Valve',
                  ]}
                  target={[
                    335,
                    jetStrikeY -
                      103,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={420}
                  y={95}
                  width={145}
                  height={40}
                  lines={[
                    'Converging Nozzle',
                  ]}
                  target={[
                    570,
                    jetStrikeY -
                      25,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={330}
                  y={405}
                  width={160}
                  height={54}
                  lines={[
                    'High-Velocity',
                    'Steam Jet',
                  ]}
                  target={[
                    bladeEntryX -
                      5,
                    jetStrikeY,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={692}
                  y={90}
                  width={175}
                  height={54}
                  lines={[
                    'Impulse Moving',
                    'Blades',
                  ]}
                  target={[
                    rotorCx,
                    rotorCy -
                      bladeTipRadius,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={910}
                  y={257}
                  width={96}
                  height={40}
                  lines={[
                    'Rotor',
                  ]}
                  target={[
                    868,
                    396,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1105}
                  y={88}
                  width={104}
                  height={40}
                  lines={[
                    'Casing',
                  ]}
                  target={[
                    1177,
                    205,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1010}
                  y={676}
                  width={148}
                  height={54}
                  lines={[
                    'Expanding Exhaust',
                    'Diffuser',
                  ]}
                  target={[
                    1080,
                    720,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1250}
                  y={188}
                  width={112}
                  height={40}
                  lines={[
                    'Oil System',
                  ]}
                  target={[
                    1312,
                    315,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1050}
                  y={620}
                  width={126}
                  height={40}
                  lines={[
                    'Journal Bearing',
                  ]}
                  target={[
                    bearingCx,
                    shaftCenterY +
                      43,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1335}
                  y={535}
                  width={108}
                  height={54}
                  lines={[
                    'Flexible',
                    'Coupling',
                  ]}
                  target={[
                    couplingCx,
                    shaftCenterY,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1490}
                  y={104}
                  width={170}
                  height={54}
                  lines={[
                    'Synchronous',
                    'Generator',
                  ]}
                  target={[
                    1570,
                    330,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1678}
                  y={104}
                  width={130}
                  height={40}
                  lines={[
                    'Stator Windings',
                  ]}
                  target={[
                    1720,
                    370,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1570}
                  y={666}
                  width={130}
                  height={40}
                  lines={[
                    'Generator Rotor',
                  ]}
                  target={[
                    1690,
                    shaftCenterY +
                      35,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />

                <Callout
                  x={1820}
                  y={145}
                  width={130}
                  height={40}
                  lines={[
                    'Breaker Output',
                  ]}
                  target={[
                    1888,
                    270,
                  ]}
                  markerId={
                    ids.labelArrow
                  }
                />
              </>
            )}
          </svg>
        </div>

        <aside className="bg-slate-50 p-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Machine Status
                </p>

                <p
                  className={`mt-1 font-mono text-lg font-black ${
                    tripActive ||
                    breakerState ===
                      'TRIPPED'
                      ? 'text-red-600'
                      : breakerClosed
                        ? 'text-emerald-600'
                        : autoSyncArmed
                          ? 'text-cyan-700'
                          : 'text-blue-700'
                  }`}
                >
                  {machineStatus}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {breakerMessage}
                </p>
              </div>

              <span
                className={`h-5 w-5 shrink-0 rounded-full border-4 border-slate-200 ${
                  tripActive ||
                  breakerState ===
                    'TRIPPED'
                    ? 'trip-pulse bg-red-500'
                    : breakerClosed
                      ? 'bg-emerald-500'
                      : autoSyncArmed
                        ? 'bg-cyan-500'
                        : running
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                }`}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <DialGauge
              label="Rotor Speed"
              value={
                simulation.rpm
              }
              maximum={
                MAX_RPM
              }
              unit="RPM"
              warning={
                tripActive
              }
            />

            <DialGauge
              label="Frequency"
              value={
                simulation.terminalFrequencyHz
              }
              maximum={70}
              unit="Hz"
              warning={
                frequencyWarning
              }
            />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-wider text-blue-700">
              Selected Assembly
            </p>

            <h3 className="mt-2 text-xl font-black text-slate-900">
              {
                PART_INFORMATION[
                  selectedPart
                ].title
              }
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {
                PART_INFORMATION[
                  selectedPart
                ].description
              }
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-700">
              Synchronizing Check
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <span
                className={
                  frequencyInClosingRange
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Δf:{' '}
                {frequencyErrorHz.toFixed(
                  3
                )}{' '}
                Hz
              </span>

              <span
                className={
                  voltageInClosingRange
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                ΔV:{' '}
                {voltageErrorPercent.toFixed(
                  1
                )}
                %
              </span>

              <span
                className={
                  phaseInClosingRange
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Phase:{' '}
                {simulation.phaseDifferenceDeg.toFixed(
                  1
                )}
                °
              </span>

              <span
                className={
                  speedInClosingRange
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Speed:{' '}
                {simulation.rpm.toFixed(
                  0
                )}{' '}
                RPM
              </span>

              <span
                className={
                  accelerationStable
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Accel:{' '}
                {simulation.angularAccelerationRadS2.toFixed(
                  2
                )}
              </span>

              <span
                className={
                  lubricationReady
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Oil:{' '}
                {simulation.oilPressureBar.toFixed(
                  2
                )}{' '}
                bar
              </span>

              <span
                className={
                  automaticGovernorReady
                    ? 'font-semibold text-emerald-700'
                    : 'text-slate-600'
                }
              >
                Governor:{' '}
                {automaticGovernorReady
                  ? 'AUTO'
                  : 'MANUAL'}
              </span>

              <strong
                className={
                  syncReady
                    ? 'text-emerald-700'
                    : autoSyncArmReady
                      ? 'text-cyan-700'
                      : 'text-amber-700'
                }
              >
                {syncReady
                  ? 'CLOSE READY'
                  : autoSyncArmReady
                    ? 'ARM READY'
                    : 'NOT READY'}
              </strong>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map(
              (
                metric
              ) => (
                <MetricCard
                  key={
                    metric.label
                  }
                  {...metric}
                />
              )
            )}
          </div>

          {(
            bearingWarning ||
            oilWarning ||
            vibrationWarning ||
            frequencyWarning ||
            breakerState ===
              'TRIPPED'
          ) && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {breakerState ===
                'TRIPPED' &&
                `${breakerMessage}. `}

              {bearingWarning &&
                'High bearing temperature. '}

              {oilWarning &&
                'Low lubrication-oil pressure. '}

              {vibrationWarning &&
                'High machine vibration. '}

              {frequencyWarning &&
                'Terminal frequency abnormal. '}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600 shadow-sm">
            <p className="font-black uppercase tracking-wide text-slate-700">
              Steam-Flow Logic
            </p>

            <p className="mt-2">
              The upstream inlet
              remains visibly
              pressurised when the
              valve is closed, but
              moving streamlines are
              zero because mass flow
              is zero. As the gate
              opens, the visible port
              area increases, nozzle
              traces converge, dash
              speed increases and the
              jet contracts toward the
              blade tangent.
            </p>

            <p className="mt-2">
              After the blade row,
              exhaust density is
              calculated from exhaust
              pressure and temperature.
              Continuity determines
              diffuser inlet velocity.
              The visual stream tube
              then expands, slows,
              curves with the hood and
              develops low-opacity
              eddies before leaving the
              outlet.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}