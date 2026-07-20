'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

type Mode = 'MANUAL' | 'AUTO';

type Breaker =
  | 'OPEN'
  | 'ARMED'
  | 'CLOSED'
  | 'TRIPPED';

type Step =
  | 'IDLE'
  | 'OIL'
  | 'TURNING'
  | 'WARMING'
  | 'ROLLING'
  | 'ACCELERATING'
  | 'EXCITATION'
  | 'SYNCHRONIZING'
  | 'ONLINE'
  | 'ABORTED';

type Stage = {
  n: number;

  pin: number;
  ps: number;
  pout: number;

  tin: number;
  tout: number;

  rho: number;

  radius: number;
  height: number;

  ca: number;
  u: number;

  cw1: number;
  cw2: number;

  work: number;
  torque: number;
  power: number;
  eta: number;
};

type Sim = {
  angle: number;
  phase: number;
  integral: number;

  omega: number;
  rpm: number;
  accel: number;

  msv: number;
  gvCmd: number;
  gv: number;
  bypass: number;

  valveFlow: number;
  turbineFlow: number;
  chest: number;
  choked: boolean;

  casingC: number;
  rotorC: number;
  expansion: number;

  stages: Stage[];

  steamTorque: number;
  friction: number;
  genTorque: number;
  netTorque: number;

  turbineKW: number;
  exportKW: number;
  importKW: number;
  loadActual: number;

  genHz: number;
  terminalHz: number;

  genV: number;
  terminalV: number;

  field: number;
  currentA: number;

  kvar: number;
  pf: number;
  eta: number;

  oilPump: boolean;
  turningGear: boolean;

  oilBar: number;
  oilC: number;

  bearingC: number;
  thrustC: number;

  vibration: number;
  axial: number;
};

type Controls = {
  running: boolean;

  mode: Mode;

  oilPump: boolean;
  turningGear: boolean;
  msvOpen: boolean;

  manualGV: number;
  speedSP: number;

  load: number;
  excitation: number;

  autoStart: boolean;
  step: Step;

  trip: boolean;

  breakerClosed: boolean;
  autoSync: boolean;
};

type Ids = Record<
  | 'steamArrow'
  | 'electricArrow'
  | 'oilArrow'
  | 'steel'
  | 'machined'
  | 'dark'
  | 'drum'
  | 'copper'
  | 'steam'
  | 'exhaust'
  | 'oil'
  | 'shadow'
  | 'glow'
  | 'casingClip'
  | 'exhaustClip'
  | 'shaftClip'
  | 'genClip',
  string
>;

/* =========================================================
   Machine constants
   ========================================================= */

const STAGE_COUNT = 3;

const SOURCE_PRESSURE_BAR = 22;
const EXHAUST_PRESSURE_BAR = 1.05;
const SOURCE_TEMPERATURE_K = 723.15;

const GAMMA = 1.3;
const STEAM_R = 461.5;
const STEAM_CP = 2100;

const CD = 0.96;
const MAX_VALVE_AREA = 9e-4;

const SWALLOWING_COEFFICIENT = 0.096;
const CHEST_GAIN = 5.2;

const ETA_STATOR = 0.93;
const ETA_ROTOR = 0.9;
const ETA_MECH = 0.97;

const RATED_RPM = 3600;
const MAX_RPM = 4200;
const TRIP_RPM = 3960;

const TURNING_GEAR_RPM = 6;
const INERTIA = 34;

const GRID_HZ = 60;
const POLES = 2;

const RATED_V = 480;
const RATED_KW = 220;

const ETA_GEN = 0.94;
const NOMINAL_PF = 0.9;

const SYNC_OMEGA =
  (RATED_RPM * 2 * Math.PI) / 60;

const MAX_OMEGA =
  (MAX_RPM * 2 * Math.PI) / 60;

/*
 * Physical RPM remains calculated normally.
 * These constants affect only the visible SVG movement.
 */
const DISPLAY_RPS_AT_RATED = 1.45;
const MIN_VISIBLE_RPS = 0.18;

/* =========================================================
   Utility functions
   ========================================================= */

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

function response(
  deltaTime: number,
  timeConstant: number
) {
  return (
    1 -
    Math.exp(
      -deltaTime /
        Math.max(
          timeConstant,
          0.001
        )
    )
  );
}

function moveToward(
  value: number,
  target: number,
  maximumStep: number
) {
  if (
    Math.abs(target - value) <=
    maximumStep
  ) {
    return target;
  }

  return (
    value +
    Math.sign(target - value) *
      maximumStep
  );
}

function wrap360(value: number) {
  return (
    ((value % 360) + 360) %
    360
  );
}

function wrapSigned(
  value: number
) {
  const wrapped =
    wrap360(value);

  return wrapped > 180
    ? wrapped - 360
    : wrapped;
}

function isentropicTemperature(
  inletTemperatureK: number,
  outletPressureBar: number,
  inletPressureBar: number
) {
  return (
    inletTemperatureK *
    Math.pow(
      clamp(
        outletPressureBar /
          Math.max(
            inletPressureBar,
            0.001
          ),
        0.001,
        1
      ),
      (GAMMA - 1) / GAMMA
    )
  );
}

/* =========================================================
   Initial reaction-stage values
   ========================================================= */

function createIdleStages(
  chestPressureBar =
    EXHAUST_PRESSURE_BAR + 0.08
): Stage[] {
  const effectiveInletPressure =
    Math.max(
      chestPressureBar,
      EXHAUST_PRESSURE_BAR +
        0.01
    );

  const stagePressureRatio =
    Math.pow(
      EXHAUST_PRESSURE_BAR /
        effectiveInletPressure,
      1 / STAGE_COUNT
    );

  let inletPressureBar =
    effectiveInletPressure;

  let inletTemperatureK =
    SOURCE_TEMPERATURE_K;

  return Array.from(
    {
      length: STAGE_COUNT,
    },
    (_, index) => {
      const outletPressureBar =
        index ===
        STAGE_COUNT - 1
          ? EXHAUST_PRESSURE_BAR
          : inletPressureBar *
            stagePressureRatio;

      const statorExitPressureBar =
        Math.sqrt(
          inletPressureBar *
            outletPressureBar
        );

      const statorExitTemperatureK =
        isentropicTemperature(
          inletTemperatureK,
          statorExitPressureBar,
          inletPressureBar
        );

      const outletTemperatureK =
        isentropicTemperature(
          statorExitTemperatureK,
          outletPressureBar,
          statorExitPressureBar
        );

      const densityKgM3 =
        ((inletPressureBar +
          outletPressureBar) *
          0.5 *
          100000) /
        (STEAM_R *
          (inletTemperatureK +
            outletTemperatureK) *
          0.5);

      const stage: Stage = {
        n: index + 1,

        pin: inletPressureBar,
        ps: statorExitPressureBar,
        pout: outletPressureBar,

        tin: inletTemperatureK,
        tout: outletTemperatureK,

        rho: densityKgM3,

        radius: [
          0.57,
          0.61,
          0.66,
        ][index],

        height: [
          0.045,
          0.085,
          0.165,
        ][index],

        ca: 0,
        u: 0,

        cw1: 0,
        cw2: 0,

        work: 0,
        torque: 0,
        power: 0,
        eta: 0,
      };

      inletPressureBar =
        outletPressureBar;

      inletTemperatureK =
        outletTemperatureK;

      return stage;
    }
  );
}

/* =========================================================
   Initial simulator state
   ========================================================= */

const INITIAL: Sim = {
  angle: 0,
  phase: 0,
  integral: 0,

  omega: 0,
  rpm: 0,
  accel: 0,

  msv: 0,
  gvCmd: 0,
  gv: 0,
  bypass: 0,

  valveFlow: 0,
  turbineFlow: 0,

  chest:
    EXHAUST_PRESSURE_BAR +
    0.08,

  choked: false,

  casingC: 30,
  rotorC: 30,
  expansion: 0,

  stages:
    createIdleStages(),

  steamTorque: 0,
  friction: 0,

  genTorque: 0,
  netTorque: 0,

  turbineKW: 0,
  exportKW: 0,
  importKW: 0,

  loadActual: 0,

  genHz: 0,
  terminalHz: 0,

  genV: 0,
  terminalV: 0,

  field: 0,
  currentA: 0,

  kvar: 0,
  pf: NOMINAL_PF,
  eta: 0,

  oilPump: false,
  turningGear: false,

  oilBar: 0.2,
  oilC: 30,

  bearingC: 32,
  thrustC: 32,

  vibration: 0.2,
  axial: 0,
};

/* =========================================================
   Automatic startup command map
   ========================================================= */

function getAutomaticCommands(
  controls: Controls
) {
  if (!controls.autoStart) {
    return {
      oil:
        controls.oilPump,

      gear:
        controls.turningGear,

      msv:
        controls.msvOpen,

      bypass: 0,

      mode:
        controls.mode,

      speed:
        controls.speedSP,

      manualGV:
        controls.manualGV,

      field:
        controls.excitation,

      load:
        controls.load,

      sync:
        controls.autoSync,
    };
  }

  const baseCommand = {
    oil: true,
    gear: false,
    msv: false,

    bypass: 0,

    mode:
      'AUTO' as Mode,

    speed: 0,
    manualGV: 0,

    field: 0,
    load: 0,

    sync: false,
  };

  switch (controls.step) {
    case 'TURNING':
      return {
        ...baseCommand,
        gear: true,
      };

    case 'WARMING':
      return {
        ...baseCommand,

        gear: true,

        /*
         * Corrected warming bypass.
         * 12% could never reach the 135°C permissive.
         */
        bypass: 0.68,
      };

    case 'ROLLING':
      return {
        ...baseCommand,
        msv: true,
        speed: 18,
      };

    case 'ACCELERATING':
      return {
        ...baseCommand,
        msv: true,
        speed: 100,
      };

    case 'EXCITATION':
      return {
        ...baseCommand,
        msv: true,
        speed: 100,
        field: 100,
      };

    case 'SYNCHRONIZING':
      return {
        ...baseCommand,
        msv: true,
        speed: 100,
        field: 100,
        sync: true,
      };

    case 'ONLINE':
      return {
        ...baseCommand,
        msv: true,
        speed: 100,
        field:
          controls.excitation,
        load:
          controls.load,
      };

    default:
      return baseCommand;
  }
}

/* =========================================================
   Main valve-flow model
   ========================================================= */

function calculateValveFlow(
  valveOpening: number,
  steamChestPressureBar: number
) {
  const upstreamPressurePa =
    SOURCE_PRESSURE_BAR *
    100000;

  const downstreamPressurePa =
    clamp(
      steamChestPressureBar,
      0.05,
      SOURCE_PRESSURE_BAR
    ) *
    100000;

  const pressureRatio =
    downstreamPressurePa /
    upstreamPressurePa;

  const criticalPressureRatio =
    Math.pow(
      2 / (GAMMA + 1),
      GAMMA / (GAMMA - 1)
    );

  const effectiveAreaM2 =
    MAX_VALVE_AREA *
    clamp(
      valveOpening,
      0,
      1
    );

  if (
    effectiveAreaM2 <
    1e-8
  ) {
    return {
      flow: 0,
      choked: false,
    };
  }

  if (
    pressureRatio <=
    criticalPressureRatio
  ) {
    const chokedFlowFactor =
      Math.sqrt(
        GAMMA /
          (STEAM_R *
            SOURCE_TEMPERATURE_K)
      ) *
      Math.pow(
        2 / (GAMMA + 1),
        (GAMMA + 1) /
          (2 *
            (GAMMA - 1))
      );

    return {
      flow:
        CD *
        effectiveAreaM2 *
        upstreamPressurePa *
        chokedFlowFactor,

      choked: true,
    };
  }

  const pressureTerm =
    Math.pow(
      pressureRatio,
      2 / GAMMA
    ) -
    Math.pow(
      pressureRatio,
      (GAMMA + 1) /
        GAMMA
    );

  const flow =
    CD *
    effectiveAreaM2 *
    upstreamPressurePa *
    Math.sqrt(
      Math.max(
        (2 *
          GAMMA *
          pressureTerm) /
          (STEAM_R *
            SOURCE_TEMPERATURE_K *
            (GAMMA - 1)),
        0
      )
    );

  return {
    flow,
    choked: false,
  };
}

function calculateSwallowingFlow(
  steamChestPressureBar: number
) {
  return (
    SWALLOWING_COEFFICIENT *
    Math.max(
      steamChestPressureBar -
        EXHAUST_PRESSURE_BAR,
      0
    )
  );
}

/* =========================================================
   Three-stage Parsons reaction model
   ========================================================= */

function calculateReactionStages(
  massFlowKgS: number,
  omegaRadS: number,
  steamChestPressureBar: number
) {
  const effectiveInletPressure =
    Math.max(
      steamChestPressureBar,
      EXHAUST_PRESSURE_BAR +
        0.01
    );

  const stagePressureRatio =
    Math.pow(
      EXHAUST_PRESSURE_BAR /
        effectiveInletPressure,
      1 / STAGE_COUNT
    );

  let inletPressureBar =
    effectiveInletPressure;

  let inletTemperatureK =
    SOURCE_TEMPERATURE_K;

  let totalTorqueNm = 0;
  let totalPowerKW = 0;

  let totalAvailableWorkJkg =
    0;

  let totalUsefulWorkJkg =
    0;

  const stages = Array.from(
    {
      length: STAGE_COUNT,
    },
    (_, index): Stage => {
      const outletPressureBar =
        index ===
        STAGE_COUNT - 1
          ? EXHAUST_PRESSURE_BAR
          : inletPressureBar *
            stagePressureRatio;

      /*
       * A geometric-mean stator pressure approximates
       * equal logarithmic pressure fall in stator and rotor.
       */
      const statorExitPressureBar =
        Math.sqrt(
          inletPressureBar *
            outletPressureBar
        );

      const statorIsentropicTemperatureK =
        isentropicTemperature(
          inletTemperatureK,
          statorExitPressureBar,
          inletPressureBar
        );

      const statorIsentropicDropJkg =
        Math.max(
          STEAM_CP *
            (inletTemperatureK -
              statorIsentropicTemperatureK),
          0
        );

      const statorActualDropJkg =
        statorIsentropicDropJkg *
        ETA_STATOR;

      const statorExitTemperatureK =
        Math.max(
          inletTemperatureK -
            statorActualDropJkg /
              STEAM_CP,
          330
        );

      const rotorIsentropicTemperatureK =
        isentropicTemperature(
          statorExitTemperatureK,
          outletPressureBar,
          statorExitPressureBar
        );

      const rotorIsentropicDropJkg =
        Math.max(
          STEAM_CP *
            (statorExitTemperatureK -
              rotorIsentropicTemperatureK),
          0
        );

      const rotorActualDropJkg =
        rotorIsentropicDropJkg *
        ETA_ROTOR;

      const outletTemperatureK =
        Math.max(
          statorExitTemperatureK -
            rotorActualDropJkg /
              STEAM_CP,
          315
        );

      const availableStageWorkJkg =
        statorIsentropicDropJkg +
        rotorIsentropicDropJkg;

      const densityKgM3 =
        ((inletPressureBar +
          outletPressureBar) *
          0.5 *
          100000) /
        (STEAM_R *
          (inletTemperatureK +
            outletTemperatureK) *
          0.5);

      const meanRadiusM = [
        0.57,
        0.61,
        0.66,
      ][index];

      const designAxialVelocityMS = [
        105,
        118,
        132,
      ][index];

      const minimumBladeHeightM = [
        0.045,
        0.085,
        0.165,
      ][index];

      const requiredAnnulusAreaM2 =
        massFlowKgS > 0
          ? massFlowKgS /
            Math.max(
              densityKgM3 *
                designAxialVelocityMS,
              0.001
            )
          : 0;

      const bladeHeightM =
        clamp(
          Math.max(
            requiredAnnulusAreaM2 /
              (2 *
                Math.PI *
                meanRadiusM),
            minimumBladeHeightM
          ),
          minimumBladeHeightM,
          0.24
        );

      const annulusAreaM2 =
        2 *
        Math.PI *
        meanRadiusM *
        bladeHeightM;

      const axialVelocityMS =
        massFlowKgS > 0
          ? massFlowKgS /
            Math.max(
              densityKgM3 *
                annulusAreaM2,
              0.001
            )
          : 0;

      const bladeSpeedMS =
        omegaRadS *
        meanRadiusM;

      const statorAngleRad =
        ([
          66,
          64,
          62,
        ][index] *
          Math.PI) /
        180;

      const rotorExitAngleRad =
        ([
          66,
          64,
          62,
        ][index] *
          Math.PI) /
        180;

      const maximumStatorVelocityMS =
        Math.sqrt(
          Math.max(
            2 *
              statorActualDropJkg,
            0
          )
        );

      const desiredInletWhirlMS =
        axialVelocityMS *
        Math.tan(
          statorAngleRad
        );

      const maximumInletWhirlMS =
        Math.sqrt(
          Math.max(
            maximumStatorVelocityMS **
              2 -
              axialVelocityMS ** 2,
            0
          )
        );

      const inletWhirlMS =
        clamp(
          desiredInletWhirlMS,
          0,
          maximumInletWhirlMS
        );

      const relativeInletTangentialMS =
        inletWhirlMS -
        bladeSpeedMS;

      const relativeInletVelocityMS =
        Math.sqrt(
          axialVelocityMS ** 2 +
            relativeInletTangentialMS **
              2
        );

      const maximumRelativeOutletVelocityMS =
        Math.sqrt(
          Math.max(
            relativeInletVelocityMS **
              2 +
              2 *
                rotorActualDropJkg,
            0
          )
        );

      const maximumRelativeTangentialMS =
        Math.sqrt(
          Math.max(
            maximumRelativeOutletVelocityMS **
              2 -
              axialVelocityMS ** 2,
            0
          )
        );

      const desiredRelativeOutletTangentialMS =
        -axialVelocityMS *
        Math.tan(
          rotorExitAngleRad
        );

      const relativeOutletTangentialMS =
        clamp(
          desiredRelativeOutletTangentialMS,
          -maximumRelativeTangentialMS,
          maximumRelativeTangentialMS
        );

      const outletWhirlMS =
        bladeSpeedMS +
        relativeOutletTangentialMS;

      const whirlChangeMS =
        Math.max(
          inletWhirlMS -
            outletWhirlMS,
          0
        );

      const specificWorkJkg =
        clamp(
          bladeSpeedMS *
            whirlChangeMS *
            ETA_MECH,
          0,
          availableStageWorkJkg *
            0.92
        );

      const stageTorqueNm =
        massFlowKgS > 0
          ? massFlowKgS *
            whirlChangeMS *
            meanRadiusM *
            ETA_MECH
          : 0;

      const stagePowerKW =
        (stageTorqueNm *
          omegaRadS) /
        1000;

      const stageEfficiency =
        availableStageWorkJkg >
        1
          ? clamp(
              specificWorkJkg /
                availableStageWorkJkg,
              0,
              0.92
            )
          : 0;

      totalTorqueNm +=
        stageTorqueNm;

      totalPowerKW +=
        stagePowerKW;

      totalAvailableWorkJkg +=
        availableStageWorkJkg;

      totalUsefulWorkJkg +=
        specificWorkJkg;

      const stage: Stage = {
        n: index + 1,

        pin:
          inletPressureBar,

        ps:
          statorExitPressureBar,

        pout:
          outletPressureBar,

        tin:
          inletTemperatureK,

        tout:
          outletTemperatureK,

        rho:
          densityKgM3,

        radius:
          meanRadiusM,

        height:
          bladeHeightM,

        ca:
          axialVelocityMS,

        u:
          bladeSpeedMS,

        cw1:
          inletWhirlMS,

        cw2:
          outletWhirlMS,

        work:
          specificWorkJkg,

        torque:
          stageTorqueNm,

        power:
          stagePowerKW,

        eta:
          stageEfficiency,
      };

      inletPressureBar =
        outletPressureBar;

      inletTemperatureK =
        outletTemperatureK;

      return stage;
    }
  );

  return {
    stages,

    torque:
      totalTorqueNm,

    power:
      totalPowerKW,

    eta:
      totalAvailableWorkJkg >
      1
        ? clamp(
            totalUsefulWorkJkg /
              totalAvailableWorkJkg,
            0,
            0.92
          )
        : 0,
  };
}

/* =========================================================
   Full turbine-generator state calculation
   ========================================================= */

function calculateNextState(
  previous: Sim,
  controls: Controls,
  deltaTime: number
): Sim {
  const commands =
    getAutomaticCommands(
      controls
    );

  const oilPumpRunning =
    commands.oil &&
    !controls.trip;

  const mainStopValveTarget =
    commands.msv &&
    !controls.trip
      ? 1
      : 0;

  const mainStopValve =
    moveToward(
      previous.msv,
      mainStopValveTarget,
      (mainStopValveTarget >
      previous.msv
        ? 0.38
        : 2.5) *
        deltaTime
    );

  const warmingBypass =
    moveToward(
      previous.bypass,
      controls.trip
        ? 0
        : commands.bypass,
      0.5 *
        deltaTime
    );

  const turningGearEngaged =
    commands.gear &&
    oilPumpRunning &&
    previous.rpm < 25 &&
    mainStopValve < 0.02 &&
    !controls.trip;

  const targetRpm =
    controls.breakerClosed
      ? RATED_RPM
      : (clamp(
          commands.speed,
          0,
          105
        ) /
          100) *
          RATED_RPM +
        (commands.sync
          ? 5
          : 0);

  const normalizedSpeedError =
    (targetRpm -
      previous.rpm) /
    RATED_RPM;

  const loadDemandFraction =
    clamp(
      commands.load /
        100,
      0,
      1
    );

  const governorFeedForward =
    controls.breakerClosed
      ? 0.17 +
        0.68 *
          loadDemandFraction
      : targetRpm > 100
        ? 0.1
        : 0;

  const governorKp =
    controls.breakerClosed
      ? 0.48
      : 0.92;

  const governorKi =
    0.2;

  const candidateIntegral =
    clamp(
      previous.integral +
        normalizedSpeedError *
          deltaTime,
      -1.8,
      1.8
    );

  const rawGovernorCommand =
    governorFeedForward +
    governorKp *
      normalizedSpeedError +
    governorKi *
      candidateIntegral;

  const integralWindup =
    (rawGovernorCommand >
      1 &&
      normalizedSpeedError >
        0) ||
    (rawGovernorCommand <
      0 &&
      normalizedSpeedError <
        0);

  const governorIntegral =
    commands.mode ===
    'AUTO'
      ? integralWindup
        ? previous.integral
        : candidateIntegral
      : 0;

  const automaticGovernorCommand =
    clamp(
      governorFeedForward +
        governorKp *
          normalizedSpeedError +
        governorKi *
          governorIntegral,
      0,
      1
    );

  const governorValveCommand =
    controls.trip
      ? 0
      : commands.mode ===
          'MANUAL'
        ? clamp(
            commands.manualGV /
              100,
            0,
            1
          )
        : automaticGovernorCommand;

  const governorValve =
    controls.trip
      ? moveToward(
          previous.gv,
          0,
          7 *
            deltaTime
        )
      : commands.mode ===
          'MANUAL'
        ? governorValveCommand
        : moveToward(
            previous.gv,
            governorValveCommand,
            (governorValveCommand >
            previous.gv
              ? 0.85
              : 1.35) *
              deltaTime
          );

  const effectiveValveOpening =
    mainStopValve *
    governorValve;

  const admission =
    calculateValveFlow(
      effectiveValveOpening,
      previous.chest
    );

  const turbineSwallowingCapacity =
    calculateSwallowingFlow(
      previous.chest
    );

  /*
   * Residual chest pressure continues discharging
   * after the valves close.
   */
  const turbineFlow =
    effectiveValveOpening >
    0.0005
      ? turbineSwallowingCapacity
      : turbineSwallowingCapacity *
        0.18;

  const steamChestPressureBar =
    clamp(
      previous.chest +
        CHEST_GAIN *
          (admission.flow -
            turbineFlow) *
          deltaTime,
      EXHAUST_PRESSURE_BAR +
        0.04,
      SOURCE_PRESSURE_BAR *
        0.985
    );

  const effectiveTurbineFlow =
    clamp(
      turbineFlow,
      0,
      2.3
    );

  const stageResult =
    calculateReactionStages(
      effectiveTurbineFlow,
      previous.omega,
      steamChestPressureBar
    );

  const steamTorqueNm =
    stageResult.torque;

  const frictionTorqueNm =
    (previous.omega > 0.3
      ? 9
      : 0) +
    0.045 *
      previous.omega +
    0.00034 *
      previous.omega ** 2;

  const actualLoadPercent =
    controls.breakerClosed
      ? moveToward(
          previous.loadActual,
          commands.load,
          7 *
            deltaTime
        )
      : moveToward(
          previous.loadActual,
          0,
          20 *
            deltaTime
        );

  const fieldPercent =
    moveToward(
      previous.field,
      controls.trip
        ? 0
        : commands.field,
      28 *
        deltaTime
    );

  const fieldFraction =
    clamp(
      fieldPercent /
        100,
      0,
      1.2
    );

  const generatedVoltageV =
    RATED_V *
    fieldFraction *
    clamp(
      previous.rpm /
        RATED_RPM,
      0,
      1.08
    ) *
    (1 -
      0.08 *
        Math.max(
          fieldFraction -
            1,
          0
        ));

  const availableMechanicalPowerKW =
    ((steamTorqueNm -
      frictionTorqueNm) *
      previous.omega) /
    1000;

  const requestedElectricalPowerKW =
    RATED_KW *
    clamp(
      actualLoadPercent /
        100,
      0,
      1
    );

  const electricalExportKW =
    controls.breakerClosed
      ? Math.min(
          requestedElectricalPowerKW,
          Math.max(
            availableMechanicalPowerKW,
            0
          ) *
            ETA_GEN
        )
      : 0;

  const gridImportKW =
    controls.breakerClosed
      ? Math.max(
          -availableMechanicalPowerKW /
            ETA_GEN,
          0
        )
      : 0;

  /*
   * Generator shaft torque follows actual power,
   * not only the requested load setting.
   */
  const generatorTorqueNm =
    controls.breakerClosed &&
    previous.omega > 1
      ? (electricalExportKW *
          1000) /
          (previous.omega *
            ETA_GEN) -
        (gridImportKW *
          1000 *
          ETA_GEN) /
          previous.omega
      : 0;

  const netTorqueNm =
    steamTorqueNm -
    frictionTorqueNm -
    generatorTorqueNm;

  const angularAcceleration =
    netTorqueNm /
    INERTIA;

  let omegaRadS:
    number;

  /*
   * A closed synchronous breaker locks the shaft
   * to grid synchronous speed.
   */
  if (
    controls.breakerClosed
  ) {
    omegaRadS =
      SYNC_OMEGA;
  } else if (
    turningGearEngaged
  ) {
    const turningGearOmega =
      (TURNING_GEAR_RPM *
        2 *
        Math.PI) /
      60;

    omegaRadS =
      previous.omega +
      (turningGearOmega -
        previous.omega) *
        response(
          deltaTime,
          0.8
        );
  } else {
    omegaRadS =
      clamp(
        previous.omega +
          angularAcceleration *
            deltaTime,
        0,
        MAX_OMEGA
      );
  }

  const rpm =
    (omegaRadS * 60) /
    (2 * Math.PI);

  const generatedFrequencyHz =
    (rpm * POLES) /
    120;

  /*
   * Corrected visible animation.
   * Turning-gear speed receives a minimum visible rate.
   */
  const physicalSpeedFraction =
    clamp(
      rpm / RATED_RPM,
      0,
      MAX_RPM /
        RATED_RPM
    );

  const calculatedVisibleRps =
    DISPLAY_RPS_AT_RATED *
    physicalSpeedFraction;

  const visibleRps =
    rpm < 0.5
      ? 0
      : Math.max(
          calculatedVisibleRps,
          MIN_VISIBLE_RPS
        );

  const visualAngleDeg =
    wrap360(
      previous.angle +
        visibleRps *
          360 *
          deltaTime
    );

  const electricalPhaseDeg =
    controls.breakerClosed
      ? previous.phase +
        (clamp(
          actualLoadPercent *
            0.32,
          0,
          34
        ) -
          previous.phase) *
          response(
            deltaTime,
            0.4
          )
      : wrapSigned(
          previous.phase +
            360 *
              (generatedFrequencyHz -
                GRID_HZ) *
              deltaTime
        );

  const terminalVoltageV =
    controls.breakerClosed
      ? RATED_V
      : generatedVoltageV;

  const terminalFrequencyHz =
    controls.breakerClosed
      ? GRID_HZ
      : generatedFrequencyHz;

  const excitationError =
    fieldFraction - 1;

  const powerFactor =
    controls.breakerClosed
      ? clamp(
          NOMINAL_PF -
            Math.abs(
              excitationError
            ) *
              0.22,
          0.72,
          0.99
        )
      : NOMINAL_PF;

  const apparentPowerKVA =
    powerFactor > 0.01
      ? electricalExportKW /
        powerFactor
      : 0;

  const reactivePowerKVAR =
    controls.breakerClosed
      ? Math.sign(
          excitationError ||
            1
        ) *
        Math.sqrt(
          Math.max(
            apparentPowerKVA ** 2 -
              electricalExportKW **
                2,
            0
          )
        )
      : 0;

  const generatorCurrentA =
    controls.breakerClosed &&
    terminalVoltageV > 10
      ? (Math.max(
          apparentPowerKVA,
          gridImportKW
        ) *
          1000) /
        (Math.sqrt(3) *
          terminalVoltageV)
      : 0;

  const casingTargetC =
    clamp(
      30 +
        warmingBypass *
          185 +
        effectiveTurbineFlow *
          38,
      30,
      330
    );

  const rotorTargetC =
    clamp(
      30 +
        effectiveTurbineFlow *
          118,
      30,
      315
    );

  /*
   * Corrected warm-up response.
   */
  const casingTemperatureC =
    previous.casingC +
    (casingTargetC -
      previous.casingC) *
      response(
        deltaTime,
        warmingBypass > 0
          ? 6
          : 28
      );

  const rotorTemperatureC =
    previous.rotorC +
    (rotorTargetC -
      previous.rotorC) *
      response(
        deltaTime,
        22
      );

  const differentialExpansionMm =
    clamp(
      (rotorTemperatureC -
        casingTemperatureC) *
        0.012,
      -1.2,
      1.8
    );

  const oilPressureTargetBar =
    oilPumpRunning
      ? clamp(
          2.5 +
            0.75 *
              Math.sqrt(
                Math.max(
                  rpm,
                  0
                ) /
                  RATED_RPM
              ),
          2.5,
          3.35
        )
      : clamp(
          0.2 +
            0.55 *
              Math.sqrt(
                Math.max(
                  rpm,
                  0
                ) /
                  RATED_RPM
              ),
          0.2,
          0.85
        );

  const oilPressureBar =
    previous.oilBar +
    (oilPressureTargetBar -
      previous.oilBar) *
      response(
        deltaTime,
        0.8
      );

  const oilTemperatureTargetC =
    30 +
    frictionTorqueNm *
      0.05 +
    rpm *
      0.0018;

  const oilTemperatureC =
    previous.oilC +
    (oilTemperatureTargetC -
      previous.oilC) *
      response(
        deltaTime,
        15
      );

  const bearingTemperatureTargetC =
    oilTemperatureC +
    7 +
    frictionTorqueNm *
      0.055;

  const bearingTemperatureC =
    previous.bearingC +
    (bearingTemperatureTargetC -
      previous.bearingC) *
      response(
        deltaTime,
        20
      );

  const thrustTemperatureTargetC =
    oilTemperatureC +
    8 +
    frictionTorqueNm *
      0.055 +
    Math.abs(
      steamChestPressureBar -
        EXHAUST_PRESSURE_BAR
    ) *
      0.18;

  const thrustTemperatureC =
    previous.thrustC +
    (thrustTemperatureTargetC -
      previous.thrustC) *
      response(
        deltaTime,
        24
      );

  const vibrationMmS =
    0.28 +
    rpm / 8200 +
    Math.abs(
      netTorqueNm
    ) /
      3200 +
    Math.abs(
      differentialExpansionMm
    ) *
      0.18;

  const axialDisplacementMm =
    clamp(
      0.06 +
        (steamChestPressureBar -
          EXHAUST_PRESSURE_BAR) *
          0.006 +
        differentialExpansionMm *
          0.08,
      -0.25,
      0.45
    );

  return {
    angle:
      visualAngleDeg,

    phase:
      electricalPhaseDeg,

    integral:
      governorIntegral,

    omega:
      omegaRadS,

    rpm,

    accel:
      angularAcceleration,

    msv:
      mainStopValve,

    gvCmd:
      governorValveCommand,

    gv:
      governorValve,

    bypass:
      warmingBypass,

    valveFlow:
      admission.flow,

    turbineFlow:
      effectiveTurbineFlow,

    chest:
      steamChestPressureBar,

    choked:
      admission.choked,

    casingC:
      casingTemperatureC,

    rotorC:
      rotorTemperatureC,

    expansion:
      differentialExpansionMm,

    stages:
      stageResult.stages,

    steamTorque:
      steamTorqueNm,

    friction:
      frictionTorqueNm,

    genTorque:
      generatorTorqueNm,

    netTorque:
      netTorqueNm,

    turbineKW:
      stageResult.power,

    exportKW:
      electricalExportKW,

    importKW:
      gridImportKW,

    loadActual:
      actualLoadPercent,

    genHz:
      generatedFrequencyHz,

    terminalHz:
      terminalFrequencyHz,

    genV:
      generatedVoltageV,

    terminalV:
      terminalVoltageV,

    field:
      fieldPercent,

    currentA:
      generatorCurrentA,

    kvar:
      reactivePowerKVAR,

    pf:
      powerFactor,

    eta:
      stageResult.eta,

    oilPump:
      oilPumpRunning,

    turningGear:
      turningGearEngaged,

    oilBar:
      oilPressureBar,

    oilC:
      oilTemperatureC,

    bearingC:
      bearingTemperatureC,

    thrustC:
      thrustTemperatureC,

    vibration:
      vibrationMmS,

    axial:
      axialDisplacementMm,
  };
}

/* =========================================================
   Dashboard components
   ========================================================= */

function Metric({
  tag,
  label,
  value,
  unit,
  tone = 'normal',
}: {
  tag: string;
  label: string;
  value: string;
  unit?: string;

  tone?:
    | 'normal'
    | 'good'
    | 'warning';
}) {
  return (
    <div
      className={`metric ${tone}`}
    >
      <small>{tag}</small>

      <em>{label}</em>

      <b>
        {value}

        {unit ? (
          <span>{unit}</span>
        ) : null}
      </b>
    </div>
  );
}

function Lamp({
  on,
  danger = false,
  children,
}: {
  on: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="lampRow">
      <span
        className={`lamp ${
          on
            ? danger
              ? 'danger'
              : 'on'
            : ''
        }`}
      />

      {children}
    </div>
  );
}

function SynchronizingDial({
  phase,
  ready,
}: {
  phase: number;
  ready: boolean;
}) {
  return (
    <svg
      viewBox="0 0 170 170"
      className="syncDial"
    >
      <circle
        cx="85"
        cy="85"
        r="68"
        fill="#f8fafc"
        stroke="#64748b"
        strokeWidth="5"
      />

      <circle
        cx="85"
        cy="85"
        r="55"
        fill="none"
        stroke={
          ready
            ? '#10b981'
            : '#cbd5e1'
        }
        strokeWidth="4"
      />

      {Array.from(
        {
          length: 12,
        },
        (_, index) => {
          const angleRad =
            (index *
              30 *
              Math.PI) /
            180;

          return (
            <line
              key={index}
              x1={
                85 +
                Math.sin(
                  angleRad
                ) *
                  54
              }
              y1={
                85 -
                Math.cos(
                  angleRad
                ) *
                  54
              }
              x2={
                85 +
                Math.sin(
                  angleRad
                ) *
                  65
              }
              y2={
                85 -
                Math.cos(
                  angleRad
                ) *
                  65
              }
              stroke="#334155"
              strokeWidth={
                index % 3 === 0
                  ? 3
                  : 1.5
              }
            />
          );
        }
      )}

      <text
        x="85"
        y="23"
        textAnchor="middle"
        fontSize="10"
        fontWeight="900"
      >
        IN PHASE
      </text>

      <g
        transform={`rotate(${phase} 85 85)`}
      >
        <line
          x1="85"
          y1="91"
          x2="85"
          y2="36"
          stroke={
            ready
              ? '#059669'
              : '#f97316'
          }
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      <circle
        cx="85"
        cy="85"
        r="9"
        fill="#64748b"
        stroke="#0f172a"
        strokeWidth="3"
      />

      <text
        x="85"
        y="153"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
      >
        {phase.toFixed(1)}°
      </text>
    </svg>
  );
}

function createBladePath(
  x: number,
  y: number,
  moving: boolean,
  scale = 1
) {
  const direction =
    moving
      ? -1
      : 1;

  const halfHeight =
    11.5 *
    scale;

  const halfChord =
    5.8 *
    scale;

  const camber =
    9.5 *
    scale *
    direction;

  return `
    M ${x - halfChord}
      ${y - halfHeight}

    C ${
      x -
      halfChord +
      camber *
        0.24
    }
      ${
        y -
        halfHeight *
          0.48
      },

      ${x + camber}
      ${
        y -
        halfHeight *
          0.08
      },

      ${x + halfChord}
      ${y + halfHeight}

    C ${
      x +
      halfChord -
      camber *
        0.14
    }
      ${
        y +
        halfHeight *
          0.48
      },

      ${
        x -
        camber *
          0.55
      }
      ${
        y +
        halfHeight *
          0.08
      },

      ${x - halfChord}
      ${y - halfHeight}

    Z
  `;
}

function BladeRow({
  x,
  y,
  outer,
  hub,
  moving,
  angle,
  stageNumber,
  ids,
}: {
  x: number;
  y: number;

  outer: number;
  hub: number;

  moving: boolean;
  angle: number;

  stageNumber: number;
  ids: Ids;
}) {
  const bladeCount = 9;

  const availableSpan =
    outer -
    hub -
    40;

  const bladeScale =
    clamp(
      outer / 128,
      0.82,
      1.28
    );

  const upperBladePositions =
    Array.from(
      {
        length:
          bladeCount,
      },
      (_, index) =>
        y -
        outer +
        22 +
        index *
          (availableSpan /
            (bladeCount - 1))
    );

  const lowerBladePositions =
    Array.from(
      {
        length:
          bladeCount,
      },
      (_, index) =>
        y +
        hub +
        20 +
        index *
          (availableSpan /
            (bladeCount - 1))
    );

  const angleRad =
    (angle *
      Math.PI) /
    180;

  const markerX =
    x +
    Math.cos(
      angleRad
    ) *
      13;

  const markerY =
    y +
    Math.sin(
      angleRad
    ) *
      (outer - 17);

  const phaseIndicatorRadius =
    Math.max(
      hub + 14,
      35
    );

  const rotatingSurfaceMarks =
    [0, 120, 240].map(
      (offset) => {
        const phaseRad =
          ((angle + offset) *
            Math.PI) /
          180;

        const frontVisibility =
          Math.max(
            Math.cos(
              phaseRad
            ),
            0
          );

        return {
          y:
            y +
            Math.sin(
              phaseRad
            ) *
              Math.max(
                outer - 26,
                12
              ),

          opacity:
            0.16 +
            0.58 *
              frontVisibility,

          rx:
            10 +
            8 *
              frontVisibility,
        };
      }
    );

  return (
    <g>
      {moving ? (
        <>
          <ellipse
            cx={x}
            cy={y}
            rx="24"
            ry={outer + 10}
            fill={`url(#${ids.dark})`}
            stroke="#334155"
            strokeWidth="4"
          />

          <ellipse
            cx={x}
            cy={y}
            rx="29"
            ry={hub + 11}
            fill={`url(#${ids.drum})`}
            stroke="#334155"
            strokeWidth="3"
          />

          {rotatingSurfaceMarks.map(
            (mark, index) => (
              <ellipse
                key={index}
                cx={x}
                cy={mark.y}
                rx={mark.rx}
                ry="5.2"
                fill="#ffffff"
                opacity={
                  mark.opacity
                }
              />
            )
          )}

          <g
            transform={`rotate(${angle} ${x} ${y})`}
          >
            <line
              x1={x}
              y1={
                y -
                phaseIndicatorRadius
              }
              x2={x}
              y2={
                y +
                phaseIndicatorRadius
              }
              stroke="#fb923c"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.92"
            />

            <circle
              cx={x}
              cy={
                y -
                phaseIndicatorRadius
              }
              r="6"
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth="2"
            />

            <circle
              cx={x}
              cy={
                y +
                phaseIndicatorRadius
              }
              r="4"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        </>
      ) : (
        <>
          <path
            d={`
              M ${x - 20}
                ${y - outer - 14}

              L ${x + 20}
                ${y - outer - 14}

              L ${x + 20}
                ${y - hub - 9}

              L ${x - 20}
                ${y - hub - 9}

              Z

              M ${x - 20}
                ${y + hub + 9}

              L ${x + 20}
                ${y + hub + 9}

              L ${x + 20}
                ${y + outer + 14}

              L ${x - 20}
                ${y + outer + 14}

              Z
            `}
            fill={`url(#${ids.steel})`}
            stroke="#465466"
            strokeWidth="3"
          />

          <ellipse
            cx={x}
            cy={y}
            rx="23"
            ry={hub + 9}
            fill="#5d6a79"
            stroke="#334155"
            strokeWidth="3"
          />
        </>
      )}

      {[
        ...upperBladePositions,
        ...lowerBladePositions,
      ].map(
        (bladeY, index) => (
          <path
            key={index}
            d={createBladePath(
              x,
              bladeY,
              moving,
              bladeScale
            )}
            fill={
              moving
                ? '#eef3f7'
                : '#dbe4ec'
            }
            stroke={
              moving
                ? '#536273'
                : '#617080'
            }
            strokeWidth="1.45"
          />
        )
      )}

      {moving ? (
        <>
          <line
            x1={x}
            y1={y}
            x2={markerX}
            y2={markerY}
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.55"
          />

          <circle
            cx={markerX}
            cy={markerY}
            r="6"
            fill="#f97316"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </>
      ) : null}

      <text
        x={x}
        y={
          y -
          outer -
          31
        }
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill={
          moving
            ? '#b45309'
            : '#1d4ed8'
        }
      >
        {moving
          ? `ROTOR ${stageNumber}`
          : `STATOR ${stageNumber}`}
      </text>
    </g>
  );
}

function ControlToggle({
  title,
  status,
  left,
  right,
  leftActive,
  rightActive,
  leftDisabled,
  rightDisabled,
  onLeft,
  onRight,
  warning = false,
}: {
  title: string;
  status: string;

  left: string;
  right: string;

  leftActive: boolean;
  rightActive: boolean;

  leftDisabled: boolean;
  rightDisabled: boolean;

  onLeft: () => void;
  onRight: () => void;

  warning?: boolean;
}) {
  return (
    <div className="control">
      <div className="control-title">
        <span>{title}</span>
        <span>{status}</span>
      </div>

      <div className="toggle-grid">
        <button
          type="button"
          className={`toggle ${
            warning
              ? 'warning'
              : 'safe'
          } ${
            leftActive
              ? 'active'
              : ''
          }`}
          disabled={
            leftDisabled
          }
          onClick={onLeft}
        >
          {left}
        </button>

        <button
          type="button"
          className={`toggle ${
            rightActive
              ? 'active'
              : ''
          }`}
          disabled={
            rightDisabled
          }
          onClick={onRight}
        >
          {right}
        </button>
      </div>
    </div>
  );
}

function ValveBody({
  x,
  y,
  width,
  height,
  gateY,
  label,
  ids,
  trip,
  compact = false,
}: {
  x: number;
  y: number;

  width: number;
  height: number;

  gateY: number;
  label: string;

  ids: Ids;
  trip: boolean;

  compact?: boolean;
}) {
  const centerX =
    x + width / 2;

  const chamberY =
    compact
      ? 383
      : 378;

  const chamberHeight =
    compact
      ? 84
      : 94;

  const stemTop =
    compact
      ? 178
      : 146;

  const wheelY =
    compact
      ? 160
      : 128;

  const labelY =
    y + height + 32;

  return (
    <g
      filter={`url(#${ids.shadow})`}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        fill={`url(#${ids.steel})`}
        stroke="#465466"
        strokeWidth="4"
      />

      <rect
        x={x + 18}
        y={chamberY}
        width={width - 36}
        height={chamberHeight}
        rx="5"
        fill="#244e61"
        stroke="#334155"
        strokeWidth="3"
      />

      <rect
        x={x + 24}
        y={gateY}
        width="34"
        height={
          compact
            ? 62
            : 66
        }
        rx="4"
        fill={
          trip
            ? '#dc2626'
            : '#f59e0b'
        }
        stroke="#334155"
        strokeWidth="3"
      />

      <rect
        x={centerX - 6}
        y={stemTop}
        width="12"
        height={Math.max(
          gateY -
            stemTop,
          8
        )}
        fill={`url(#${ids.machined})`}
        stroke="#465466"
        strokeWidth="2"
      />

      <ellipse
        cx={centerX}
        cy={wheelY}
        rx={
          compact
            ? 49
            : 54
        }
        ry={
          compact
            ? 17
            : 19
        }
        fill="none"
        stroke="#64748b"
        strokeWidth={
          compact
            ? 7
            : 8
        }
      />

      {!compact ? (
        <line
          x1={centerX - 54}
          y1={wheelY}
          x2={centerX + 54}
          y2={wheelY}
          stroke="#64748b"
          strokeWidth="5"
        />
      ) : null}

      <text
        x={centerX}
        y={labelY}
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
      >
        {label}
      </text>
    </g>
  );
}

/* =========================================================
   Main component
   ========================================================= */

export default function ReactionTurbineV3Industrial() {
  const uniqueId =
    useId().replace(
      /[^a-zA-Z0-9_-]/g,
      ''
    );

  const ids =
    useMemo<Ids>(
      () =>
        Object.fromEntries(
          [
            'steamArrow',
            'electricArrow',
            'oilArrow',
            'steel',
            'machined',
            'dark',
            'drum',
            'copper',
            'steam',
            'exhaust',
            'oil',
            'shadow',
            'glow',
            'casingClip',
            'exhaustClip',
            'shaftClip',
            'genClip',
          ].map(
            (key) => [
              key,
              `rtv3-${key}-${uniqueId}`,
            ]
          )
        ) as Ids,
      [uniqueId]
    );

  const [
    running,
    setRunning,
  ] = useState(true);

  const [
    mode,
    setMode,
  ] =
    useState<Mode>(
      'MANUAL'
    );

  const [
    oilPump,
    setOilPump,
  ] = useState(false);

  const [
    turningGear,
    setTurningGear,
  ] = useState(false);

  const [
    mainStopValveOpen,
    setMainStopValveOpen,
  ] = useState(false);

  const [
    manualGovernorValve,
    setManualGovernorValve,
  ] = useState(0);

  const [
    speedSetpoint,
    setSpeedSetpoint,
  ] = useState(100);

  const [
    loadDemand,
    setLoadDemand,
  ] = useState(40);

  const [
    excitation,
    setExcitation,
  ] = useState(100);

  const [
    autoStart,
    setAutoStart,
  ] = useState(false);

  const [
    startupStep,
    setStartupStep,
  ] =
    useState<Step>(
      'IDLE'
    );

  const [
    tripActive,
    setTripActive,
  ] = useState(false);

  const [
    breakerState,
    setBreakerState,
  ] =
    useState<Breaker>(
      'OPEN'
    );

  const [
    message,
    setMessage,
  ] = useState(
    'Unit available. Start the auxiliary oil pump or use Auto Start.'
  );

  const [
    simulation,
    setSimulation,
  ] =
    useState<Sim>(
      INITIAL
    );

  const breakerClosed =
    breakerState ===
    'CLOSED';

  const autoSyncArmed =
    breakerState ===
    'ARMED';

  const controlsRef =
    useRef<Controls>({
      running,

      mode,

      oilPump,
      turningGear,

      msvOpen:
        mainStopValveOpen,

      manualGV:
        manualGovernorValve,

      speedSP:
        speedSetpoint,

      load:
        loadDemand,

      excitation,

      autoStart,

      step:
        startupStep,

      trip:
        tripActive,

      breakerClosed,

      autoSync:
        autoSyncArmed,
    });

  const frameRef =
    useRef<number | null>(
      null
    );

  const previousTimeRef =
    useRef<number | null>(
      null
    );

  const accumulatorRef =
    useRef(0);

  const previousPhaseRef =
    useRef(0);

  const protectionRef =
    useRef<{
      reason:
        string | null;

      since:
        number | null;

      turbineTrip:
        boolean;
    }>({
      reason: null,
      since: null,
      turbineTrip: false,
    });

  const patchControls =
    useCallback(
      (
        patch:
          Partial<Controls>
      ) => {
        controlsRef.current = {
          ...controlsRef.current,
          ...patch,
        };
      },
      []
    );

  const changeStartupStep =
    useCallback(
      (
        step:
          Step
      ) => {
        setStartupStep(
          step
        );

        patchControls({
          step,
        });
      },
      [patchControls]
    );

  useEffect(() => {
    controlsRef.current = {
      running,

      mode,

      oilPump,
      turningGear,

      msvOpen:
        mainStopValveOpen,

      manualGV:
        manualGovernorValve,

      speedSP:
        speedSetpoint,

      load:
        loadDemand,

      excitation,

      autoStart,

      step:
        startupStep,

      trip:
        tripActive,

      breakerClosed,

      autoSync:
        autoSyncArmed,
    };
  }, [
    running,
    mode,
    oilPump,
    turningGear,
    mainStopValveOpen,
    manualGovernorValve,
    speedSetpoint,
    loadDemand,
    excitation,
    autoStart,
    startupStep,
    tripActive,
    breakerClosed,
    autoSyncArmed,
  ]);

  /* =======================================================
     Fixed-step animation loop
     ======================================================= */

  useEffect(() => {
    function animationLoop(
      timestamp: number
    ) {
      if (
        previousTimeRef.current ===
        null
      ) {
        previousTimeRef.current =
          timestamp;
      }

      const frameDelta =
        clamp(
          (timestamp -
            previousTimeRef.current) /
            1000,
          0,
          0.05
        );

      previousTimeRef.current =
        timestamp;

      if (
        controlsRef.current
          .running
      ) {
        accumulatorRef.current +=
          frameDelta;

        let iterations = 0;

        while (
          accumulatorRef.current >=
            1 / 60 &&
          iterations < 4
        ) {
          setSimulation(
            (previous) =>
              calculateNextState(
                previous,
                controlsRef.current,
                1 / 60
              )
          );

          accumulatorRef.current -=
            1 / 60;

          iterations += 1;
        }
      } else {
        accumulatorRef.current =
          0;
      }

      frameRef.current =
        requestAnimationFrame(
          animationLoop
        );
    }

    frameRef.current =
      requestAnimationFrame(
        animationLoop
      );

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }

      frameRef.current =
        null;

      previousTimeRef.current =
        null;
    };
  }, []);

  /* =======================================================
     Synchronizing permissives
     ======================================================= */

  const frequencyErrorHz =
    Math.abs(
      simulation.genHz -
        GRID_HZ
    );

  const voltageErrorPercent =
    (Math.abs(
      simulation.genV -
        RATED_V
    ) /
      RATED_V) *
    100;

  const phaseErrorDeg =
    Math.abs(
      simulation.phase
    );

  const speedReady =
    simulation.rpm >=
      3565 &&
    simulation.rpm <=
      3640;

  const frequencyReady =
    frequencyErrorHz <=
    0.14;

  const voltageReady =
    voltageErrorPercent <=
    5;

  const phaseReady =
    phaseErrorDeg <=
    9;

  const accelerationReady =
    Math.abs(
      simulation.accel
    ) <= 0.75;

  const oilReady =
    simulation.oilBar >=
    2.25;

  const fieldReady =
    simulation.field >=
    95;

  const casingWarm =
    simulation.casingC >=
    135;

  const synchronizationBaseReady =
    !tripActive &&
    breakerState !==
      'TRIPPED' &&
    !breakerClosed &&
    mode ===
      'AUTO' &&
    speedReady &&
    frequencyReady &&
    voltageReady &&
    accelerationReady &&
    oilReady &&
    fieldReady;

  const synchronizationReady =
    synchronizationBaseReady &&
    phaseReady;

  /* =======================================================
     Breaker and trip operations
     ======================================================= */

  const openBreaker =
    useCallback(
      (
        reason =
          'BRK-101 opened manually.'
      ) => {
        setBreakerState(
          'OPEN'
        );

        setMessage(
          reason
        );

        patchControls({
          breakerClosed:
            false,

          autoSync:
            false,
        });

        protectionRef.current = {
          reason: null,
          since: null,
          turbineTrip: false,
        };
      },
      [patchControls]
    );

  const tripUnit =
    useCallback(
      (
        reason:
          string,

        turbineTrip:
          boolean
      ) => {
        setBreakerState(
          'TRIPPED'
        );

        setMessage(
          reason
        );

        patchControls({
          breakerClosed:
            false,

          autoSync:
            false,
        });

        if (
          turbineTrip
        ) {
          setTripActive(
            true
          );

          setAutoStart(
            false
          );

          changeStartupStep(
            'ABORTED'
          );

          patchControls({
            trip: true,
            autoStart: false,
          });
        }
      },
      [
        changeStartupStep,
        patchControls,
      ]
    );

  const closeBreaker =
    useCallback(
      (
        source:
          | 'MANUAL'
          | 'AUTO'
      ) => {
        if (
          !synchronizationReady ||
          tripActive ||
          breakerClosed
        ) {
          return;
        }

        setMode(
          'AUTO'
        );

        setBreakerState(
          'CLOSED'
        );

        setMessage(
          source ===
          'AUTO'
            ? 'BRK-101 closed automatically at synchronism.'
            : 'BRK-101 closed manually at synchronism.'
        );

        patchControls({
          mode:
            'AUTO',

          breakerClosed:
            true,

          autoSync:
            false,
        });
      },
      [
        synchronizationReady,
        tripActive,
        breakerClosed,
        breakerState,
        patchControls,
      ]
    );

  const armAutoSync =
    useCallback(() => {
      if (
        tripActive ||
        breakerClosed ||
        breakerState ===
          'TRIPPED'
      ) {
        return;
      }

      setMode(
        'AUTO'
      );

      setSpeedSetpoint(
        100
      );

      setBreakerState(
        'ARMED'
      );

      setMessage(
        'Auto-sync armed: matching speed, voltage and phase.'
      );

      patchControls({
        mode:
          'AUTO',

        speedSP:
          100,

        breakerClosed:
          false,

        autoSync:
          true,
      });

      previousPhaseRef.current =
        simulation.phase;
    }, [
      tripActive,
      breakerClosed,
      breakerState,
      patchControls,
      simulation.phase,
    ]);

  useEffect(() => {
    const previousPhase =
      previousPhaseRef.current;

    const currentPhase =
      simulation.phase;

    const genuineZeroCrossing =
      (previousPhase < 0 &&
        currentPhase >= 0 &&
        Math.abs(
          previousPhase
        ) <= 35 &&
        Math.abs(
          currentPhase
        ) <= 35) ||
      (previousPhase > 0 &&
        currentPhase <= 0 &&
        Math.abs(
          previousPhase
        ) <= 35 &&
        Math.abs(
          currentPhase
        ) <= 35);

    previousPhaseRef.current =
      currentPhase;

    if (
      breakerState ===
        'ARMED' &&
      synchronizationBaseReady &&
      (genuineZeroCrossing ||
        Math.abs(
          currentPhase
        ) <= 9)
    ) {
      closeBreaker(
        'AUTO'
      );
    }
  }, [
    breakerState,
    synchronizationBaseReady,
    simulation.phase,
    closeBreaker,
  ]);

  /* =======================================================
     Automatic startup sequence
     ======================================================= */

  useEffect(() => {
    if (
      !autoStart ||
      tripActive
    ) {
      return;
    }

    if (
      startupStep ===
        'OIL' &&
      simulation.oilBar >=
        2.35
    ) {
      changeStartupStep(
        'TURNING'
      );

      setMessage(
        'Oil pressure established. Engaging turning gear.'
      );
    } else if (
      startupStep ===
        'TURNING' &&
      simulation.rpm >=
        4.5
    ) {
      changeStartupStep(
        'WARMING'
      );

      setMessage(
        'Turning gear established. Warming turbine casing.'
      );
    } else if (
      startupStep ===
        'WARMING' &&
      casingWarm
    ) {
      changeStartupStep(
        'ROLLING'
      );

      setMessage(
        'Casing warm. Opening TV-101 and rolling turbine.'
      );
    } else if (
      startupStep ===
        'ROLLING' &&
      simulation.rpm >=
        520
    ) {
      changeStartupStep(
        'ACCELERATING'
      );

      setMessage(
        'Turbine rolling. Accelerating to rated speed.'
      );
    } else if (
      startupStep ===
        'ACCELERATING' &&
      simulation.rpm >=
        3520 &&
      Math.abs(
        simulation.accel
      ) <= 1.2
    ) {
      changeStartupStep(
        'EXCITATION'
      );

      setMessage(
        'Rated speed reached. Applying generator field.'
      );
    } else if (
      startupStep ===
        'EXCITATION' &&
      fieldReady &&
      voltageErrorPercent <=
        10
    ) {
      changeStartupStep(
        'SYNCHRONIZING'
      );

      setBreakerState(
        'ARMED'
      );

      patchControls({
        autoSync:
          true,
      });

      setMessage(
        'Generator excited. Auto-synchronizing BRK-101.'
      );

      previousPhaseRef.current =
        simulation.phase;
    } else if (
      startupStep ===
        'SYNCHRONIZING' &&
      breakerClosed
    ) {
      changeStartupStep(
        'ONLINE'
      );

      setMessage(
        'Unit synchronized. Generator loading ramp enabled.'
      );
    }
  }, [
    autoStart,
    tripActive,
    startupStep,
    simulation.oilBar,
    simulation.rpm,
    simulation.accel,
    simulation.phase,
    casingWarm,
    fieldReady,
    voltageErrorPercent,
    breakerClosed,
    changeStartupStep,
    patchControls,
  ]);

  /* =======================================================
     Protection logic
     ======================================================= */

  useEffect(() => {
    if (
      !tripActive &&
      simulation.rpm >=
        TRIP_RPM
    ) {
      tripUnit(
        'Overspeed trip: TV-101 and GV-101 closing; BRK-101 tripped.',
        true
      );
    }
  }, [
    simulation.rpm,
    tripActive,
    tripUnit,
  ]);

  useEffect(() => {
    if (
      !breakerClosed
    ) {
      protectionRef.current = {
        reason: null,
        since: null,
        turbineTrip: false,
      };

      return;
    }

    let reason:
      string | null =
      null;

    let turbineTrip =
      false;

    if (
      simulation.oilBar <
      1.25
    ) {
      reason =
        'Low lube-oil pressure trip.';

      turbineTrip =
        true;
    } else if (
      simulation.rpm <
        3450 ||
      simulation.rpm >
        3750
    ) {
      reason =
        'Abnormal shaft-speed trip.';

      turbineTrip =
        true;
    } else if (
      simulation.importKW >
      18
    ) {
      reason =
        'Reverse-power trip: generator motoring detected.';
    } else if (
      simulation.vibration >
      4.5
    ) {
      reason =
        'High vibration trip.';

      turbineTrip =
        true;
    } else if (
      Math.abs(
        simulation.axial
      ) >
      0.35
    ) {
      reason =
        'High axial displacement trip.';

      turbineTrip =
        true;
    }

    if (!reason) {
      protectionRef.current = {
        reason: null,
        since: null,
        turbineTrip: false,
      };

      return;
    }

    const currentTime =
      performance.now();

    if (
      protectionRef.current
        .reason !== reason ||
      protectionRef.current
        .since === null
    ) {
      protectionRef.current = {
        reason,
        since:
          currentTime,
        turbineTrip,
      };

      return;
    }

    if (
      currentTime -
        protectionRef.current
          .since >=
      900
    ) {
      tripUnit(
        reason,
        protectionRef.current
          .turbineTrip
      );
    }
  }, [
    breakerClosed,
    simulation.oilBar,
    simulation.rpm,
    simulation.importKW,
    simulation.vibration,
    simulation.axial,
    tripUnit,
  ]);

  /* =======================================================
     User commands
     ======================================================= */

  function startAutomaticSequence() {
    if (
      tripActive ||
      breakerState ===
        'TRIPPED'
    ) {
      return;
    }

    setAutoStart(
      true
    );

    changeStartupStep(
      'OIL'
    );

    setMode(
      'AUTO'
    );

    setBreakerState(
      'OPEN'
    );

    setMessage(
      'Auto start initiated: starting auxiliary oil pump.'
    );

    patchControls({
      autoStart:
        true,

      mode:
        'AUTO',

      breakerClosed:
        false,

      autoSync:
        false,
    });
  }

  function abortAutomaticSequence() {
    setAutoStart(
      false
    );

    changeStartupStep(
      'ABORTED'
    );

    setMainStopValveOpen(
      false
    );

    setManualGovernorValve(
      0
    );

    setExcitation(
      0
    );

    patchControls({
      autoStart:
        false,

      msvOpen:
        false,

      manualGV:
        0,

      excitation:
        0,
    });

    if (
      breakerState ===
        'CLOSED' ||
      breakerState ===
        'ARMED'
    ) {
      openBreaker(
        'Auto start aborted; BRK-101 opened.'
      );
    } else {
      setMessage(
        'Auto start aborted. Steam valves commanded closed.'
      );
    }
  }

  function resetTrip() {
    setTripActive(
      false
    );

    setBreakerState(
      'OPEN'
    );

    setAutoStart(
      false
    );

    changeStartupStep(
      'IDLE'
    );

    setMode(
      'MANUAL'
    );

    setMainStopValveOpen(
      false
    );

    setManualGovernorValve(
      0
    );

    setSpeedSetpoint(
      0
    );

    setExcitation(
      0
    );

    setLoadDemand(
      0
    );

    setMessage(
      'Trip reset. Valves closed and breaker open.'
    );

    patchControls({
      trip:
        false,

      breakerClosed:
        false,

      autoSync:
        false,

      autoStart:
        false,

      mode:
        'MANUAL',

      msvOpen:
        false,

      manualGV:
        0,

      speedSP:
        0,

      excitation:
        0,

      load:
        0,
    });
  }

  function resetUnit() {
    setSimulation(
      INITIAL
    );

    setRunning(
      true
    );

    setMode(
      'MANUAL'
    );

    setOilPump(
      false
    );

    setTurningGear(
      false
    );

    setMainStopValveOpen(
      false
    );

    setManualGovernorValve(
      0
    );

    setSpeedSetpoint(
      100
    );

    setLoadDemand(
      40
    );

    setExcitation(
      100
    );

    setAutoStart(
      false
    );

    setStartupStep(
      'IDLE'
    );

    setTripActive(
      false
    );

    setBreakerState(
      'OPEN'
    );

    setMessage(
      'Unit reset. Start auxiliary oil pump or Auto Start.'
    );

    controlsRef.current = {
      running: true,

      mode:
        'MANUAL',

      oilPump: false,
      turningGear: false,

      msvOpen:
        false,

      manualGV:
        0,

      speedSP:
        100,

      load:
        40,

      excitation:
        100,

      autoStart:
        false,

      step:
        'IDLE',

      trip:
        false,

      breakerClosed:
        false,

      autoSync:
        false,
    };

    previousTimeRef.current =
      null;

    accumulatorRef.current =
      0;

    previousPhaseRef.current =
      0;

    protectionRef.current = {
      reason: null,
      since: null,
      turbineTrip: false,
    };
  }

  /* =======================================================
     SVG geometry and statuses
     ======================================================= */

  const shaftY = 430;

  const stagePositions = [
    {
      stator: 620,
      rotor: 710,
    },
    {
      stator: 845,
      rotor: 940,
    },
    {
      stator: 1075,
      rotor: 1180,
    },
  ];

  const flowFraction =
    clamp(
      simulation.turbineFlow /
        2.1,
      0,
      1
    );

  const steamOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.18 +
        0.72 *
          flowFraction;

  const exhaustOpacity =
    flowFraction <=
    0.001
      ? 0
      : 0.12 +
        0.58 *
          flowFraction;

  const steamAnimationDuration =
    clamp(
      2.5 -
        1.45 *
          flowFraction,
      0.65,
      2.5
    );

  const mainValveGateY =
    398 -
    simulation.msv *
      116;

  const governorValveGateY =
    400 -
    simulation.gv *
      112;

  const shaftSurfaceMarks =
    [0, 120, 240].map(
      (offset) => {
        const phaseRad =
          ((simulation.angle +
            offset) *
            Math.PI) /
          180;

        const frontVisibility =
          Math.max(
            Math.cos(
              phaseRad
            ),
            0
          );

        return {
          y:
            shaftY +
            Math.sin(
              phaseRad
            ) *
              12,

          xOffset:
            Math.cos(
              phaseRad
            ) *
            16,

          opacity:
            0.16 +
            0.72 *
              frontVisibility,

          width:
            1.4 +
            2.2 *
              frontVisibility,
        };
      }
    );

  const stageVisuals =
    simulation.stages.map(
      (stage, index) => ({
        stage,

        outer:
          clamp(
            68 +
              stage.height *
                620,
            94,
            188
          ),

        hub:
          [
            46,
            52,
            60,
          ][index],
      })
    );

  const steamFlowPaths =
    [-72, -36, 0, 36, 72].map(
      (offset) => {
        const direction =
          offset / 72;

        return `
          M 535
            ${
              shaftY +
              offset *
                0.45
            }

          C 570
            ${
              shaftY +
              offset *
                0.55
            },

            595
            ${
              shaftY +
              offset *
                0.68 -
              14 *
                direction
            },

            625
            ${
              shaftY +
              offset *
                0.74 -
              21 *
                direction
            }

          C 660
            ${
              shaftY +
              offset *
                0.78 -
              11 *
                direction
            },

            687
            ${
              shaftY +
              offset *
                0.86 +
              12 *
                direction
            },

            714
            ${
              shaftY +
              offset *
                0.92 +
              22 *
                direction
            }

          C 755
            ${
              shaftY +
              offset *
                0.96 +
              10 *
                direction
            },

            805
            ${
              shaftY +
              offset *
                1.06 -
              12 *
                direction
            },

            850
            ${
              shaftY +
              offset *
                1.12 -
              24 *
                direction
            }

          C 885
            ${
              shaftY +
              offset *
                1.16 -
              11 *
                direction
            },

            915
            ${
              shaftY +
              offset *
                1.24 +
              14 *
                direction
            },

            944
            ${
              shaftY +
              offset *
                1.3 +
              26 *
                direction
            }

          C 990
            ${
              shaftY +
              offset *
                1.34 +
              11 *
                direction
            },

            1040
            ${
              shaftY +
              offset *
                1.48 -
              14 *
                direction
            },

            1080
            ${
              shaftY +
              offset *
                1.56 -
              28 *
                direction
            }

          C 1120
            ${
              shaftY +
              offset *
                1.62 -
              12 *
                direction
            },

            1155
            ${
              shaftY +
              offset *
                1.75 +
              16 *
                direction
            },

            1185
            ${
              shaftY +
              offset *
                1.84 +
              30 *
                direction
            }

          C 1235
            ${
              shaftY +
              offset *
                1.92 +
              18 *
                direction
            },

            1290
            ${
              shaftY +
              offset *
                2.05
            },

            1350
            ${
              shaftY +
              offset *
                2.18
            }
        `;
      }
    );

  const unitStatus =
    tripActive
      ? 'TURBINE / GENERATOR TRIPPED'
      : breakerClosed
        ? 'GENERATOR ONLINE'
        : autoStart
          ? `AUTO START — ${startupStep}`
          : simulation.rpm < 0.5
            ? 'STANDBY'
            : mode ===
                'AUTO'
              ? 'AUTOMATIC SPEED CONTROL'
              : 'MANUAL GOVERNOR CONTROL';

  const generatorStatus =
    simulation.rpm < 0.5
      ? 'STOPPED'
      : simulation.field <
          5
        ? simulation.rpm <
            30
          ? 'TURNING GEAR — FIELD OFF'
          : 'ROTOR TURNING — FIELD OFF'
        : breakerClosed
          ? 'ONLINE — EXPORTING POWER'
          : simulation.genV >
              50
            ? 'EXCITED — BREAKER OPEN'
            : 'VOLTAGE BUILDING';

  const sequenceSteps:
    Step[] = [
      'OIL',
      'TURNING',
      'WARMING',
      'ROLLING',
      'ACCELERATING',
      'EXCITATION',
      'SYNCHRONIZING',
      'ONLINE',
    ];

  const cssVariables = {
    '--steam-duration':
      `${steamAnimationDuration}s`,
  } as React.CSSProperties &
    Record<string, string>;

  return (
    <div
      className="rtv3"
      style={cssVariables}
    >
      <style>{`
        .rtv3,
        .rtv3 * {
          box-sizing: border-box;
        }

        .rtv3 {
          min-height: 100vh;
          padding: 14px;
          color: #172033;
          background: #eaf0f6;
          font-family:
            Inter,
            system-ui,
            sans-serif;
        }

        .rtv3 .shell {
          max-width: 1980px;
          margin: auto;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          border-radius: 18px;
          background: #ffffff;
          box-shadow:
            0 18px 46px
            rgba(15, 23, 42, 0.14);
        }

        .rtv3 .header {
          padding: 16px;
          border-bottom: 1px solid #d8e0ea;
          background:
            linear-gradient(
              #fbfdff,
              #f1f5f9
            );
        }

        .rtv3 .topbar {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .rtv3 .title {
          margin: 0;
          color: #172554;
          font-size: 25px;
          font-weight: 950;
        }

        .rtv3 .subtitle {
          margin: 7px 0 0;
          color: #607087;
          font-size: 13px;
        }

        .rtv3 .buttons {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .rtv3 button {
          font-family: inherit;
        }

        .rtv3 .button {
          border: 0;
          border-radius: 8px;
          padding: 9px 12px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
        }

        .rtv3 .button:disabled,
        .rtv3 .toggle:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .rtv3 .blue {
          background: #1d4ed8;
        }

        .rtv3 .cyan {
          background: #0891b2;
        }

        .rtv3 .green {
          background: #059669;
        }

        .rtv3 .amber {
          background: #d97706;
        }

        .rtv3 .red {
          background: #dc2626;
        }

        .rtv3 .slate {
          background: #475569;
        }

        .rtv3 .light {
          color: #334155;
          background: #ffffff;
          border: 1px solid #cbd5e1;
        }

        .rtv3 .controls {
          display: grid;
          grid-template-columns:
            repeat(
              7,
              minmax(
                145px,
                1fr
              )
            );
          gap: 10px;
          margin-top: 14px;
        }

        .rtv3 .control {
          padding: 10px;
          border: 1px solid #d7e0ea;
          border-radius: 10px;
          background: #ffffff;
        }

        .rtv3 .control-title,
        .rtv3 .control label {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
          color: #526178;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .rtv3 .control input[type="range"] {
          width: 100%;
          accent-color: #2563eb;
        }

        .rtv3 .toggle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .rtv3 .toggle {
          padding: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          color: #475569;
          background: #ffffff;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .rtv3 .toggle.active {
          color: #ffffff;
          background: #1d4ed8;
        }

        .rtv3 .toggle.safe.active {
          background: #059669;
        }

        .rtv3 .toggle.warning.active {
          background: #d97706;
        }

        .rtv3 .message {
          margin-top: 11px;
          padding: 9px 11px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          color: #415168;
          background: #ffffff;
          font-size: 12px;
          font-weight: 750;
        }

        .rtv3 .layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            455px;
        }

        .rtv3 .machine {
          overflow: auto;
          border-right: 1px solid #d8e0ea;
        }

        .rtv3 .machine svg {
          display: block;
          width: 100%;
          min-width: 1350px;
        }

        .rtv3 .sidebar {
          max-height: 1160px;
          overflow: auto;
          padding: 14px;
          background: #f5f8fb;
        }

        .rtv3 .card,
        .rtv3 .status {
          margin-bottom: 11px;
          padding: 12px;
          border: 1px solid #d7e0ea;
          border-radius: 11px;
          background: #ffffff;
        }

        .rtv3 .status.online {
          border-color: #86efac;
          background: #f0fdf4;
        }

        .rtv3 .status.sync {
          border-color: #67e8f9;
          background: #ecfeff;
        }

        .rtv3 .status.trip {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .rtv3 .eyebrow,
        .rtv3 .card h3 {
          margin: 0 0 8px;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .rtv3 .statusValue {
          font-family: monospace;
          font-size: 18px;
          font-weight: 900;
        }

        .rtv3 .statusSub {
          margin-top: 5px;
          color: #526178;
          font-size: 11px;
          font-weight: 700;
        }

        .rtv3 .sequence {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              1fr
            );
          gap: 5px;
        }

        .rtv3 .sequenceStep {
          padding: 7px 5px;
          border: 1px solid #dbe3ec;
          border-radius: 7px;
          color: #64748b;
          background: #f8fafc;
          text-align: center;
          font-size: 8px;
          font-weight: 900;
        }

        .rtv3 .sequenceStep.active {
          border-color: #2563eb;
          color: #1d4ed8;
          background: #dbeafe;
        }

        .rtv3 .sequenceStep.complete {
          border-color: #86efac;
          color: #047857;
          background: #f0fdf4;
        }

        .rtv3 .syncLayout {
          display: grid;
          grid-template-columns:
            155px 1fr;
          gap: 10px;
          align-items: center;
        }

        .rtv3 .syncDial {
          width: 100%;
        }

        .rtv3 .checks {
          display: grid;
          gap: 5px;
          color: #64748b;
          font-size: 11px;
        }

        .rtv3 .ok {
          color: #047857;
          font-weight: 850;
        }

        .rtv3 .lampGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 10px;
        }

        .rtv3 .lampRow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #526178;
          font-size: 10px;
          font-weight: 750;
        }

        .rtv3 .lamp {
          width: 10px;
          height: 10px;
          border: 1px solid #64748b;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .rtv3 .lamp.on {
          background: #22c55e;
          box-shadow:
            0 0 9px
            rgba(34, 197, 94, 0.67);
        }

        .rtv3 .lamp.danger {
          background: #ef4444;
          box-shadow:
            0 0 9px
            rgba(239, 68, 68, 0.67);
        }

        .rtv3 .stage {
          margin-top: 7px;
          padding: 8px;
          border: 1px solid #e1e7ef;
          border-radius: 8px;
          background: #f8fafc;
        }

        .rtv3 .stageHead {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 900;
        }

        .rtv3 .stageGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px 8px;
          margin-top: 5px;
          color: #58677d;
          font-size: 10px;
        }

        .rtv3 .metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .rtv3 .metric {
          padding: 9px;
          border: 1px solid #d7e0ea;
          border-radius: 9px;
          background: #ffffff;
        }

        .rtv3 .metric.good {
          border-color: #86efac;
          background: #f0fdf4;
        }

        .rtv3 .metric.warning {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .rtv3 .metric small {
          display: block;
          color: #1d4ed8;
          font-size: 8px;
          font-weight: 950;
        }

        .rtv3 .metric em {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 8px;
          font-style: normal;
          font-weight: 900;
          text-transform: uppercase;
        }

        .rtv3 .metric b {
          display: block;
          margin-top: 4px;
          font-family: monospace;
          font-size: 15px;
        }

        .rtv3 .metric span {
          margin-left: 4px;
          color: #64748b;
          font-size: 9px;
        }

        @keyframes steamFlowAnimation {
          from {
            stroke-dashoffset: 110;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes electricalFlowAnimation {
          from {
            stroke-dashoffset: 60;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        .rtv3 .steamFlow {
          stroke-dasharray: 20 14;
          animation:
            steamFlowAnimation
            var(--steam-duration)
            linear infinite;
        }

        .rtv3 .electricFlow {
          stroke-dasharray: 18 12;
          animation:
            electricalFlowAnimation
            1s linear infinite;
        }

        .rtv3 .paused .steamFlow,
        .rtv3 .paused .electricFlow {
          animation-play-state: paused;
        }

        @media (max-width: 1540px) {
          .rtv3 .controls {
            grid-template-columns:
              repeat(
                4,
                1fr
              );
          }
        }

        @media (max-width: 1280px) {
          .rtv3 .layout {
            grid-template-columns: 1fr;
          }

          .rtv3 .machine {
            border-right: 0;
          }

          .rtv3 .sidebar {
            max-height: none;
          }
        }

        @media (max-width: 760px) {
          .rtv3 {
            padding: 6px;
          }

          .rtv3 .controls,
          .rtv3 .metrics,
          .rtv3 .syncLayout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="shell">
        <header className="header">
          <div className="topbar">
            <div>
              <h1 className="title">
                ReactionTurbineV3Industrial
              </h1>

              <p className="subtitle">
                Corrected warm-up, visible shaft,
                rotor and generator rotation,
                dynamic steam chest, automatic
                startup and protected synchronization.
              </p>
            </div>

            <div className="buttons">
              <button
                type="button"
                className="button blue"
                onClick={() =>
                  setRunning(
                    (value) =>
                      !value
                  )
                }
              >
                {running
                  ? 'Pause'
                  : 'Start'}
              </button>

              <button
                type="button"
                className="button green"
                disabled={
                  autoStart ||
                  tripActive ||
                  breakerState ===
                    'TRIPPED'
                }
                onClick={
                  startAutomaticSequence
                }
              >
                Auto Start
              </button>

              <button
                type="button"
                className="button amber"
                disabled={
                  !autoStart
                }
                onClick={
                  abortAutomaticSequence
                }
              >
                Abort Auto
              </button>

              <button
                type="button"
                className="button cyan"
                disabled={
                  tripActive ||
                  breakerClosed ||
                  breakerState ===
                    'TRIPPED'
                }
                onClick={() =>
                  autoSyncArmed
                    ? openBreaker(
                        'Auto-sync cancelled; BRK-101 open.'
                      )
                    : armAutoSync()
                }
              >
                {autoSyncArmed
                  ? 'Cancel Auto Sync'
                  : 'Arm Auto Sync'}
              </button>

              <button
                type="button"
                className="button green"
                disabled={
                  !synchronizationReady ||
                  tripActive ||
                  breakerClosed
                }
                onClick={() =>
                  closeBreaker(
                    'MANUAL'
                  )
                }
              >
                Close BRK-101
              </button>

              <button
                type="button"
                className="button slate"
                disabled={
                  breakerState ===
                    'OPEN' ||
                  breakerState ===
                    'TRIPPED'
                }
                onClick={() =>
                  openBreaker()
                }
              >
                Open BRK-101
              </button>

              <button
                type="button"
                className="button red"
                onClick={() =>
                  tripUnit(
                    'Emergency trip: valves closing and breaker tripped.',
                    true
                  )
                }
              >
                Emergency Trip
              </button>

              {(tripActive ||
                breakerState ===
                  'TRIPPED') ? (
                <button
                  type="button"
                  className="button light"
                  onClick={resetTrip}
                >
                  Reset Trip
                </button>
              ) : null}

              <button
                type="button"
                className="button light"
                onClick={resetUnit}
              >
                Reset Unit
              </button>
            </div>
          </div>

          <div className="controls">
            <ControlToggle
              title="Aux oil pump"
              status={
                simulation.oilPump
                  ? 'ON'
                  : 'OFF'
              }
              left="START"
              right="STOP"
              leftActive={oilPump}
              rightActive={!oilPump}
              leftDisabled={
                autoStart ||
                tripActive
              }
              rightDisabled={
                autoStart ||
                tripActive ||
                simulation.rpm >
                  50
              }
              onLeft={() =>
                setOilPump(
                  true
                )
              }
              onRight={() =>
                setOilPump(
                  false
                )
              }
            />

            <ControlToggle
              title="Turning gear"
              status={
                simulation.turningGear
                  ? 'ENGAGED'
                  : 'OFF'
              }
              left="ENGAGE"
              right="RELEASE"
              leftActive={turningGear}
              rightActive={!turningGear}
              leftDisabled={
                autoStart ||
                tripActive ||
                !oilPump ||
                simulation.rpm >
                  20 ||
                mainStopValveOpen
              }
              rightDisabled={autoStart}
              onLeft={() =>
                setTurningGear(
                  true
                )
              }
              onRight={() =>
                setTurningGear(
                  false
                )
              }
              warning
            />

            <ControlToggle
              title="TV-101 main stop"
              status={
                simulation.msv >
                0.98
                  ? 'OPEN'
                  : simulation.msv <
                      0.02
                    ? 'CLOSED'
                    : 'MOVING'
              }
              left="OPEN"
              right="CLOSE"
              leftActive={
                mainStopValveOpen
              }
              rightActive={
                !mainStopValveOpen
              }
              leftDisabled={
                autoStart ||
                tripActive ||
                !oilPump ||
                simulation.oilBar <
                  2.1 ||
                turningGear
              }
              rightDisabled={autoStart}
              onLeft={() =>
                setMainStopValveOpen(
                  true
                )
              }
              onRight={() =>
                setMainStopValveOpen(
                  false
                )
              }
            />

            <ControlToggle
              title="Governor mode"
              status={mode}
              left="MANUAL"
              right="AUTO"
              leftActive={
                mode ===
                'MANUAL'
              }
              rightActive={
                mode ===
                'AUTO'
              }
              leftDisabled={
                autoStart ||
                breakerClosed ||
                tripActive
              }
              rightDisabled={
                tripActive
              }
              onLeft={() =>
                setMode(
                  'MANUAL'
                )
              }
              onRight={() =>
                setMode(
                  'AUTO'
                )
              }
            />

            <div className="control">
              <label>
                <span>
                  {mode ===
                  'MANUAL'
                    ? 'GV-101 position'
                    : 'Speed setpoint'}
                </span>

                <span>
                  {mode ===
                  'MANUAL'
                    ? manualGovernorValve
                    : speedSetpoint}
                  %
                </span>
              </label>

              <input
                type="range"
                min="0"
                max={
                  mode ===
                  'MANUAL'
                    ? 100
                    : 105
                }
                value={
                  mode ===
                  'MANUAL'
                    ? manualGovernorValve
                    : speedSetpoint
                }
                disabled={
                  autoStart ||
                  tripActive ||
                  (mode ===
                    'AUTO' &&
                    breakerClosed)
                }
                onChange={(
                  event
                ) => {
                  const value =
                    Number(
                      event.target
                        .value
                    );

                  if (
                    mode ===
                    'MANUAL'
                  ) {
                    setManualGovernorValve(
                      value
                    );
                  } else {
                    setSpeedSetpoint(
                      value
                    );
                  }
                }}
              />
            </div>

            <div className="control">
              <label>
                <span>
                  AVR excitation
                </span>

                <span>
                  {excitation}%
                </span>
              </label>

              <input
                type="range"
                min="0"
                max="120"
                value={excitation}
                disabled={
                  tripActive ||
                  (autoStart &&
                    startupStep !==
                      'ONLINE')
                }
                onChange={(
                  event
                ) =>
                  setExcitation(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
              />
            </div>

            <div className="control">
              <label>
                <span>
                  Load demand
                </span>

                <span>
                  {loadDemand}%
                </span>
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={loadDemand}
                disabled={
                  tripActive ||
                  !breakerClosed
                }
                onChange={(
                  event
                ) =>
                  setLoadDemand(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
              />
            </div>
          </div>

          <div className="message">
            {message}
          </div>
        </header>

        <div className="layout">
          <main className="machine">
            <svg
              className={
                running
                  ? ''
                  : 'paused'
              }
              viewBox="0 0 2100 920"
              role="img"
              aria-label="Industrial three-stage Parsons reaction turbine generator"
            >
              <defs>
                <marker
                  id={ids.steamArrow}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="5"
                  orient="auto"
                >
                  <path
                    d="M0 0 L10 5 L0 10 Z"
                    fill="#59bfe6"
                  />
                </marker>

                <marker
                  id={ids.electricArrow}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="5"
                  orient="auto"
                >
                  <path
                    d="M0 0 L10 5 L0 10 Z"
                    fill="#059669"
                  />
                </marker>

                <marker
                  id={ids.oilArrow}
                  markerWidth="9"
                  markerHeight="9"
                  refX="8"
                  refY="4.5"
                  orient="auto"
                >
                  <path
                    d="M0 0 L9 4.5 L0 9 Z"
                    fill="#b45309"
                  />
                </marker>

                <linearGradient
                  id={ids.steel}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#eef2f5"
                  />

                  <stop
                    offset="42%"
                    stopColor="#aab5c1"
                  />

                  <stop
                    offset="72%"
                    stopColor="#d8dde2"
                  />

                  <stop
                    offset="100%"
                    stopColor="#687583"
                  />
                </linearGradient>

                <linearGradient
                  id={ids.machined}
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
                    offset="29%"
                    stopColor="#a8b4c0"
                  />

                  <stop
                    offset="54%"
                    stopColor="#526170"
                  />

                  <stop
                    offset="76%"
                    stopColor="#e8edf1"
                  />

                  <stop
                    offset="100%"
                    stopColor="#596676"
                  />
                </linearGradient>

                <linearGradient
                  id={ids.dark}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#667486"
                  />

                  <stop
                    offset="100%"
                    stopColor="#263446"
                  />
                </linearGradient>

                <linearGradient
                  id={ids.drum}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#dce3ea"
                  />

                  <stop
                    offset="38%"
                    stopColor="#667486"
                  />

                  <stop
                    offset="70%"
                    stopColor="#eef2f6"
                  />

                  <stop
                    offset="100%"
                    stopColor="#4b5968"
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
                    stopColor="#ffd27e"
                  />

                  <stop
                    offset="50%"
                    stopColor="#c56a20"
                  />

                  <stop
                    offset="100%"
                    stopColor="#7c3f12"
                  />
                </linearGradient>

                <linearGradient
                  id={ids.steam}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#e4f9ff"
                    stopOpacity="0.75"
                  />

                  <stop
                    offset="52%"
                    stopColor="#82cfe9"
                    stopOpacity="0.36"
                  />

                  <stop
                    offset="100%"
                    stopColor="#55a9c8"
                    stopOpacity="0.08"
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
                    stopColor="#dff7ff"
                    stopOpacity="0.55"
                  />

                  <stop
                    offset="65%"
                    stopColor="#75c5e1"
                    stopOpacity="0.23"
                  />

                  <stop
                    offset="100%"
                    stopColor="#4b9fbd"
                    stopOpacity="0.04"
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
                    floodOpacity="0.28"
                  />
                </filter>

                <filter
                  id={ids.glow}
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur
                    stdDeviation="8"
                  />
                </filter>

                <clipPath
                  id={ids.casingClip}
                >
                  <path
                    d="
                      M520 180
                      C650 110 1125 105 1265 175
                      L1370 265
                      L1370 590
                      L1260 655
                      C1035 720 690 715 520 625
                      Z
                    "
                  />
                </clipPath>

                <clipPath
                  id={ids.exhaustClip}
                >
                  <path
                    d="
                      M1185 220
                      C1305 220 1410 270 1495 360
                      L1495 630
                      C1380 690 1270 705 1165 650
                      Z
                    "
                  />
                </clipPath>

                <clipPath
                  id={ids.shaftClip}
                >
                  <rect
                    x="500"
                    y={shaftY - 30}
                    width="1190"
                    height="60"
                    rx="8"
                  />
                </clipPath>

                <clipPath
                  id={ids.genClip}
                >
                  <circle
                    cx="1935"
                    cy={shaftY}
                    r="76"
                  />
                </clipPath>
              </defs>

              <rect
                width="2100"
                height="920"
                fill="#ffffff"
              />

              <text
                x="1050"
                y="42"
                textAnchor="middle"
                fontSize="31"
                fontWeight="950"
                fill="#172554"
              >
                INDUSTRIAL THREE-STAGE PARSONS
                REACTION TURBINE–GENERATOR
              </text>

              <text
                x="1050"
                y="69"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill="#64748b"
              >
                50% REACTION • DYNAMIC STEAM CHEST •
                AUTOMATIC STARTUP • GRID SYNCHRONIZATION
              </text>

              {/* Foundation */}

              <path
                d="
                  M45 750
                  L2035 750
                  L2065 792
                  L2065 825
                  L20 825
                  L20 792
                  Z
                "
                fill={`url(#${ids.steel})`}
                stroke="#465466"
                strokeWidth="4"
                filter={`url(#${ids.shadow})`}
              />

              <rect
                x="88"
                y="768"
                width="1900"
                height="18"
                fill="#687481"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Main steam inlet */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <ellipse
                  cx="82"
                  cy={shaftY}
                  rx="43"
                  ry="74"
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="4"
                />

                <ellipse
                  cx="82"
                  cy={shaftY}
                  rx="24"
                  ry="55"
                  fill="#37748c"
                  stroke="#465466"
                  strokeWidth="3"
                />

                <path
                  d={`
                    M82 ${shaftY - 55}
                    L225 ${shaftY - 55}

                    C270 ${shaftY - 55}
                      298 ${shaftY - 30}
                      324 ${shaftY}

                    C298 ${shaftY + 30}
                      270 ${shaftY + 55}
                      225 ${shaftY + 55}

                    L82 ${shaftY + 55}
                    Z
                  `}
                  fill="#3c7890"
                  stroke="#465466"
                  strokeWidth="4"
                />

                {[-24, 0, 24].map(
                  (offset, index) => (
                    <path
                      key={offset}
                      d={`
                        M95 ${shaftY + offset}
                        C150 ${shaftY + offset}
                          225 ${shaftY + offset * 0.7}
                          305 ${shaftY + offset * 0.35}
                      `}
                      fill="none"
                      stroke={
                        index === 1
                          ? '#e9fbff'
                          : '#72c7e5'
                      }
                      strokeWidth={
                        index === 1
                          ? 3.6
                          : 2.4
                      }
                      opacity={
                        steamOpacity
                      }
                      className="steamFlow"
                    />
                  )
                )}
              </g>

              <ValveBody
                x={292}
                y={215}
                width={82}
                height={395}
                gateY={
                  mainValveGateY
                }
                label="TV-101 MAIN STOP VALVE"
                ids={ids}
                trip={
                  tripActive
                }
              />

              <ValveBody
                x={390}
                y={260}
                width={78}
                height={330}
                gateY={
                  governorValveGateY
                }
                label="GV-101 GOVERNOR VALVE"
                ids={ids}
                trip={
                  tripActive
                }
                compact
              />

              {/* Steam chest */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <path
                  d="
                    M468 330
                    L535 300
                    L572 332
                    L572 518
                    L535 550
                    L468 520
                    Z
                  "
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="4"
                />

                <path
                  d="
                    M488 350
                    L528 334
                    L550 352
                    L550 498
                    L528 516
                    L488 500
                    Z
                  "
                  fill="#315f74"
                  stroke="#334155"
                  strokeWidth="3"
                />

                <ellipse
                  cx="520"
                  cy={shaftY}
                  rx="34"
                  ry="70"
                  fill={`url(#${ids.steam})`}
                  opacity={
                    0.18 +
                    steamOpacity *
                      0.52
                  }
                />

                <text
                  x="520"
                  y="590"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                >
                  STEAM CHEST
                </text>
              </g>

              {/* Outer and inner casing */}

              <path
                d="
                  M520 180
                  C650 110 1125 105 1265 175
                  L1370 265
                  L1370 590
                  L1260 655
                  C1035 720 690 715 520 625
                  Z
                "
                fill={`url(#${ids.steel})`}
                stroke="#465466"
                strokeWidth="5"
                filter={`url(#${ids.shadow})`}
              />

              <path
                d="
                  M552 220
                  C675 160 1110 150 1235 205
                  L1330 285
                  L1330 555
                  L1235 615
                  C1025 665 720 662 552 600
                  Z
                "
                fill="#202832"
                stroke="#657487"
                strokeWidth="3"
              />

              {/* Horizontal casing split */}

              <path
                d="
                  M548 330
                  C760 310 1125 310 1340 342
                "
                fill="none"
                stroke={`url(#${ids.steel})`}
                strokeWidth="18"
              />

              <path
                d="
                  M548 330
                  C760 310 1125 310 1340 342
                "
                fill="none"
                stroke="#667484"
                strokeWidth="3"
              />

              {[
                610,
                735,
                860,
                985,
                1110,
                1235,
                1320,
              ].map((x) => (
                <circle
                  key={x}
                  cx={x}
                  cy={
                    320 +
                    (x - 610) *
                      0.025
                  }
                  r="7"
                  fill="#d8dde3"
                  stroke="#465466"
                  strokeWidth="2"
                />
              ))}

              {/* Steam field */}

              <g
                clipPath={`url(#${ids.casingClip})`}
              >
                <path
                  d="
                    M545 300
                    C700 220 1130 205 1360 300
                    L1360 600
                    C1090 690 690 650 545 520
                    Z
                  "
                  fill={`url(#${ids.steam})`}
                  opacity={
                    steamOpacity *
                    0.55
                  }
                  filter={`url(#${ids.glow})`}
                />

                {steamFlowPaths.map(
                  (path, index) => (
                    <path
                      key={index}
                      d={path}
                      fill="none"
                      stroke={
                        index === 2
                          ? '#ecfbff'
                          : '#6bc4e5'
                      }
                      strokeWidth={
                        index === 2
                          ? 4.3
                          : 2.6
                      }
                      strokeLinecap="round"
                      markerEnd={
                        index === 2
                          ? `url(#${ids.steamArrow})`
                          : undefined
                      }
                      opacity={
                        steamOpacity *
                        (1 -
                          Math.abs(
                            index - 2
                          ) *
                            0.08)
                      }
                      className="steamFlow"
                      style={{
                        animationDelay:
                          `${index * -0.24}s`,
                      }}
                    />
                  )
                )}
              </g>

              {/* Tapered rotor drum */}

              <path
                d={`
                  M650 ${shaftY - 50}
                  L1208 ${shaftY - 78}
                  L1208 ${shaftY + 78}
                  L650 ${shaftY + 50}
                  Z
                `}
                fill={`url(#${ids.drum})`}
                stroke="#334155"
                strokeWidth="4"
              />

              {/* Main rotating shaft */}

              <rect
                x="530"
                y={shaftY - 21}
                width="1175"
                height="42"
                rx="7"
                fill={`url(#${ids.machined})`}
                stroke="#334155"
                strokeWidth="4"
              />

              <g
                clipPath={`url(#${ids.shaftClip})`}
              >
                {shaftSurfaceMarks.map(
                  (mark, index) => (
                    <path
                      key={index}
                      d={`
                        M ${
                          545 +
                          mark.xOffset
                        }
                          ${
                            mark.y -
                            3
                          }

                        L ${
                          1690 +
                          mark.xOffset
                        }
                          ${
                            mark.y +
                            3
                          }
                      `}
                      fill="none"
                      stroke={
                        index === 0
                          ? '#ffffff'
                          : '#334155'
                      }
                      strokeWidth={
                        mark.width
                      }
                      strokeLinecap="round"
                      opacity={
                        mark.opacity
                      }
                    />
                  )
                )}
              </g>

              {/* Reaction stages */}

              {stagePositions.map(
                (position, index) => {
                  const visual =
                    stageVisuals[
                      index
                    ];

                  return (
                    <g key={index}>
                      <BladeRow
                        x={
                          position.stator
                        }
                        y={shaftY}
                        outer={
                          visual.outer
                        }
                        hub={
                          visual.hub
                        }
                        moving={false}
                        angle={0}
                        stageNumber={
                          index + 1
                        }
                        ids={ids}
                      />

                      <BladeRow
                        x={
                          position.rotor
                        }
                        y={shaftY}
                        outer={
                          visual.outer +
                          4
                        }
                        hub={
                          visual.hub +
                          3
                        }
                        moving
                        angle={
                          simulation.angle +
                          index *
                            57
                        }
                        stageNumber={
                          index + 1
                        }
                        ids={ids}
                      />

                      <text
                        x={
                          (position.stator +
                            position.rotor) /
                          2
                        }
                        y="676"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="850"
                        fill="#dbeafe"
                      >
                        {visual.stage.pin.toFixed(
                          2
                        )}
                        {' → '}
                        {visual.stage.ps.toFixed(
                          2
                        )}
                        {' → '}
                        {visual.stage.pout.toFixed(
                          2
                        )}
                        {' bar'}
                      </text>
                    </g>
                  );
                }
              )}

              {/* Annular exhaust hood */}

              <g>
                <path
                  d="
                    M1180 220
                    C1315 215 1430 270 1510 360
                    L1510 630
                    C1390 700 1265 710 1155 650
                    Z
                  "
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="5"
                />

                <path
                  d="
                    M1215 258
                    C1325 258 1410 305 1470 380
                    L1470 600
                    C1380 652 1285 665 1190 625
                    Z
                  "
                  fill="#2d5f74"
                  stroke="#334155"
                  strokeWidth="3"
                />

                <g
                  clipPath={`url(#${ids.exhaustClip})`}
                >
                  <path
                    d="
                      M1190 275
                      C1310 280 1415 330 1490 405
                      L1490 620
                      C1385 675 1280 680 1178 645
                      Z
                    "
                    fill={`url(#${ids.exhaust})`}
                    opacity={
                      exhaustOpacity
                    }
                    filter={`url(#${ids.glow})`}
                  />

                  {[
                    -90,
                    -45,
                    0,
                    45,
                    90,
                  ].map(
                    (offset, index) => (
                      <path
                        key={offset}
                        d={`
                          M1165
                            ${
                              shaftY +
                              offset *
                                1.45
                            }

                          C1270
                            ${
                              shaftY +
                              offset *
                                1.62
                            }

                            1370
                            ${
                              shaftY +
                              offset *
                                1.86
                            }

                            1480
                            ${
                              shaftY +
                              offset *
                                2.08
                            }
                        `}
                        fill="none"
                        stroke={
                          index === 2
                            ? '#e5f9ff'
                            : '#7bcbe7'
                        }
                        strokeWidth={
                          index === 2
                            ? 3.8
                            : 2.4
                        }
                        opacity={
                          exhaustOpacity *
                          (1 -
                            Math.abs(
                              index - 2
                            ) *
                              0.08)
                        }
                        className="steamFlow"
                      />
                    )
                  )}
                </g>

                <path
                  d="
                    M1225 590
                    L1415 590
                    L1460 752
                    L1175 752
                    Z
                  "
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="4"
                />

                <path
                  d="
                    M1250 608
                    L1392 608
                    L1426 730
                    L1210 730
                    Z
                  "
                  fill="#37748c"
                  stroke="#334155"
                  strokeWidth="3"
                />

                <text
                  x="1320"
                  y="778"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                >
                  CONDENSER EXHAUST
                </text>
              </g>

              {/* Labyrinth gland */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <rect
                  x="1498"
                  y={shaftY - 62}
                  width="98"
                  height="124"
                  rx="14"
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="4"
                />

                <rect
                  x="1512"
                  y={shaftY - 17}
                  width="70"
                  height="34"
                  fill={`url(#${ids.machined})`}
                  stroke="#334155"
                  strokeWidth="2"
                />

                {[
                  1524,
                  1537,
                  1550,
                  1563,
                  1576,
                ].map(
                  (x, index) => (
                    <g key={x}>
                      <rect
                        x={x}
                        y={
                          index % 2
                            ? shaftY -
                              40
                            : shaftY -
                              50
                        }
                        width="4"
                        height={
                          index % 2
                            ? 24
                            : 34
                        }
                        fill="#d7dee5"
                      />

                      <rect
                        x={x}
                        y={
                          shaftY +
                          16
                        }
                        width="4"
                        height={
                          index % 2
                            ? 35
                            : 25
                        }
                        fill="#d7dee5"
                      />
                    </g>
                  )
                )}

                <text
                  x="1547"
                  y="525"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                >
                  GLAND
                </text>
              </g>

              {/* Bearing housing */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <path
                  d="
                    M1600 500
                    L1710 500
                    L1695 750
                    L1615 750
                    Z
                  "
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="4"
                />

                <circle
                  cx="1655"
                  cy={shaftY}
                  r="50"
                  fill="#d4d8dd"
                  stroke="#465466"
                  strokeWidth="4"
                />

                <circle
                  cx="1655"
                  cy={shaftY}
                  r="38"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="5"
                />

                <circle
                  cx="1655"
                  cy={shaftY}
                  r="28"
                  fill={`url(#${ids.machined})`}
                  stroke="#334155"
                  strokeWidth="3"
                />

                <g
                  transform={`rotate(${simulation.angle} 1655 ${shaftY})`}
                >
                  <line
                    x1="1655"
                    y1={shaftY}
                    x2="1680"
                    y2={shaftY}
                    stroke="#f97316"
                    strokeWidth="4"
                  />

                  <circle
                    cx="1680"
                    cy={shaftY}
                    r="4"
                    fill="#f97316"
                  />
                </g>

                <text
                  x="1655"
                  y="780"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                >
                  THRUST / JOURNAL BEARING
                </text>
              </g>

              {/* Auxiliary oil pump */}

              <g>
                <rect
                  x="1580"
                  y="205"
                  width="110"
                  height="66"
                  rx="8"
                  fill="#ffffff"
                  stroke="#465466"
                  strokeWidth="3"
                />

                <rect
                  x="1598"
                  y="225"
                  width="74"
                  height="24"
                  rx="4"
                  fill={`url(#${ids.oil})`}
                />

                <text
                  x="1635"
                  y="242"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="900"
                  fill="#78350f"
                >
                  AUX OIL PUMP
                </text>

                <path
                  d={`
                    M1635 271
                    L1635 ${shaftY - 62}
                  `}
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="4"
                  markerEnd={`url(#${ids.oilArrow})`}
                  opacity={
                    simulation.oilPump
                      ? 0.95
                      : 0.2
                  }
                />
              </g>

              {/* Flexible coupling */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <ellipse
                  cx="1735"
                  cy={shaftY}
                  rx="18"
                  ry="52"
                  fill={`url(#${ids.machined})`}
                  stroke="#334155"
                  strokeWidth="4"
                />

                <ellipse
                  cx="1774"
                  cy={shaftY}
                  rx="18"
                  ry="52"
                  fill={`url(#${ids.machined})`}
                  stroke="#334155"
                  strokeWidth="4"
                />

                <rect
                  x="1735"
                  y={shaftY - 35}
                  width="39"
                  height="70"
                  fill="#64748b"
                  stroke="#334155"
                  strokeWidth="3"
                />

                <g
                  transform={`rotate(${simulation.angle} 1754.5 ${shaftY})`}
                >
                  {[
                    0,
                    90,
                    180,
                    270,
                  ].map((angle) => {
                    const angleRad =
                      (angle *
                        Math.PI) /
                      180;

                    return (
                      <circle
                        key={angle}
                        cx={
                          1754.5 +
                          Math.cos(
                            angleRad
                          ) *
                            20
                        }
                        cy={
                          shaftY +
                          Math.sin(
                            angleRad
                          ) *
                            34
                        }
                        r="5"
                        fill="#f97316"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              </g>

              {/* Synchronous generator */}

              <g
                filter={`url(#${ids.shadow})`}
              >
                <rect
                  x="1810"
                  y="245"
                  width="250"
                  height="360"
                  rx="50"
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="5"
                />

                <rect
                  x="1840"
                  y="282"
                  width="190"
                  height="80"
                  rx="16"
                  fill="#334155"
                />

                <rect
                  x="1840"
                  y="488"
                  width="190"
                  height="80"
                  rx="16"
                  fill="#334155"
                />

                {Array.from(
                  {
                    length: 7,
                  },
                  (_, index) =>
                    1857 +
                    index *
                      25
                ).map((x) => (
                  <g key={x}>
                    <path
                      d={`
                        M${x} 322
                        Q${x + 10} 294
                          ${x + 20} 322
                      `}
                      fill="none"
                      stroke={`url(#${ids.copper})`}
                      strokeWidth="7"
                    />

                    <path
                      d={`
                        M${x} 528
                        Q${x + 10} 556
                          ${x + 20} 528
                      `}
                      fill="none"
                      stroke={`url(#${ids.copper})`}
                      strokeWidth="7"
                    />
                  </g>
                ))}

                <circle
                  cx="1935"
                  cy={shaftY}
                  r="76"
                  fill="#1f2937"
                  stroke="#64748b"
                  strokeWidth="4"
                />

                <g
                  clipPath={`url(#${ids.genClip})`}
                >
                  {[0, 120, 240].map(
                    (offset, index) => {
                      const phaseRad =
                        ((simulation.angle +
                          offset) *
                          Math.PI) /
                        180;

                      return (
                        <rect
                          key={index}
                          x="1882"
                          y={
                            shaftY +
                            Math.sin(
                              phaseRad
                            ) *
                              48 -
                            5
                          }
                          width="106"
                          height="10"
                          rx="5"
                          fill="#ffffff"
                          opacity={
                            0.18 +
                            0.65 *
                              Math.max(
                                Math.cos(
                                  phaseRad
                                ),
                                0
                              )
                          }
                        />
                      );
                    }
                  )}
                </g>

                <g
                  transform={`rotate(${simulation.angle} 1935 ${shaftY})`}
                >
                  <rect
                    x="1921"
                    y={shaftY - 55}
                    width="28"
                    height="110"
                    rx="10"
                    fill="#94a3b8"
                    stroke="#334155"
                    strokeWidth="3"
                  />

                  <rect
                    x="1880"
                    y={shaftY - 14}
                    width="110"
                    height="28"
                    rx="10"
                    fill="#64748b"
                    stroke="#334155"
                    strokeWidth="3"
                  />

                  <line
                    x1="1935"
                    y1={shaftY}
                    x2="1988"
                    y2={shaftY}
                    stroke="#f97316"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="1988"
                    cy={shaftY}
                    r="7"
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  <circle
                    cx="1935"
                    cy={shaftY}
                    r="16"
                    fill="#dbe3ea"
                    stroke="#334155"
                    strokeWidth="3"
                  />
                </g>

                <text
                  x="1935"
                  y="642"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="900"
                >
                  SYNCHRONOUS GENERATOR
                </text>
              </g>

              {/* Generator breaker and output */}

              <g>
                <rect
                  x="1845"
                  y="105"
                  width="150"
                  height="84"
                  rx="12"
                  fill={
                    breakerClosed
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
                    breakerClosed
                      ? '#059669'
                      : breakerState ===
                          'TRIPPED'
                        ? '#dc2626'
                        : breakerState ===
                            'ARMED'
                          ? '#0891b2'
                          : '#64748b'
                  }
                  strokeWidth="4"
                />

                <text
                  x="1920"
                  y="136"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                >
                  BRK-101 GENERATOR BREAKER
                </text>

                <text
                  x="1920"
                  y="166"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="950"
                >
                  {breakerState}
                </text>

                {[
                  118,
                  147,
                  176,
                ].map(
                  (outputY, index) => (
                    <path
                      key={outputY}
                      d={`
                        M1995 ${outputY}
                        L2080 ${outputY}
                      `}
                      fill="none"
                      stroke={
                        [
                          '#ef4444',
                          '#d6a800',
                          '#2563eb',
                        ][index]
                      }
                      strokeWidth="4"
                      markerEnd={`url(#${ids.electricArrow})`}
                      opacity={
                        breakerClosed
                          ? 0.95
                          : 0.12
                      }
                      className="electricFlow"
                    />
                  )
                )}
              </g>
            </svg>
          </main>

          <aside className="sidebar">
            <div
              className={`status ${
                tripActive
                  ? 'trip'
                  : breakerClosed
                    ? 'online'
                    : autoSyncArmed
                      ? 'sync'
                      : ''
              }`}
            >
              <div className="eyebrow">
                UNIT STATUS
              </div>

              <div className="statusValue">
                {unitStatus}
              </div>

              <div className="statusSub">
                {generatorStatus}
              </div>
            </div>

            <div className="card">
              <h3>
                Automatic startup sequence
              </h3>

              <div className="sequence">
                {sequenceSteps.map(
                  (step, index) => {
                    const currentIndex =
                      sequenceSteps.indexOf(
                        startupStep
                      );

                    return (
                      <div
                        key={step}
                        className={`sequenceStep ${
                          startupStep ===
                          step
                            ? 'active'
                            : currentIndex >
                                index
                              ? 'complete'
                              : ''
                        }`}
                      >
                        {step}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="card">
              <h3>
                Protection and permissive lamps
              </h3>

              <div className="lampGrid">
                <Lamp
                  on={
                    simulation.oilPump
                  }
                >
                  Oil pump running
                </Lamp>

                <Lamp on={oilReady}>
                  Oil pressure ready
                </Lamp>

                <Lamp
                  on={
                    simulation.turningGear
                  }
                >
                  Turning gear engaged
                </Lamp>

                <Lamp on={casingWarm}>
                  Casing warm
                </Lamp>

                <Lamp on={fieldReady}>
                  Field ready
                </Lamp>

                <Lamp on={speedReady}>
                  Speed ready
                </Lamp>

                <Lamp on={voltageReady}>
                  Voltage ready
                </Lamp>

                <Lamp on={frequencyReady}>
                  Frequency ready
                </Lamp>

                <Lamp on={phaseReady}>
                  Phase ready
                </Lamp>

                <Lamp on={breakerClosed}>
                  Breaker closed
                </Lamp>

                <Lamp
                  on={tripActive}
                  danger
                >
                  Trip active
                </Lamp>

                <Lamp
                  on={
                    simulation.importKW >
                    1
                  }
                  danger
                >
                  Reverse power
                </Lamp>
              </div>
            </div>

            <div className="card">
              <h3>
                Synchroscope and closing permissives
              </h3>

              <div className="syncLayout">
                <SynchronizingDial
                  phase={
                    simulation.phase
                  }
                  ready={
                    synchronizationReady
                  }
                />

                <div className="checks">
                  <span
                    className={
                      speedReady
                        ? 'ok'
                        : ''
                    }
                  >
                    ST-101:{' '}
                    {simulation.rpm.toFixed(
                      0
                    )}{' '}
                    RPM
                  </span>

                  <span
                    className={
                      frequencyReady
                        ? 'ok'
                        : ''
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
                      voltageReady
                        ? 'ok'
                        : ''
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
                      phaseReady
                        ? 'ok'
                        : ''
                    }
                  >
                    Phase:{' '}
                    {simulation.phase.toFixed(
                      1
                    )}
                    °
                  </span>

                  <span
                    className={
                      accelerationReady
                        ? 'ok'
                        : ''
                    }
                  >
                    Accel:{' '}
                    {simulation.accel.toFixed(
                      2
                    )}{' '}
                    rad/s²
                  </span>

                  <strong
                    className={
                      synchronizationReady
                        ? 'ok'
                        : ''
                    }
                  >
                    {synchronizationReady
                      ? 'BRK-101 CLOSE PERMITTED'
                      : autoSyncArmed
                        ? 'AUTO-SYNC WAITING'
                        : 'NOT READY'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>
                Reaction-stage thermodynamics
              </h3>

              {simulation.stages.map(
                (stage) => (
                  <div
                    className="stage"
                    key={stage.n}
                  >
                    <div className="stageHead">
                      <span>
                        Stage {stage.n}
                      </span>

                      <span>
                        {(
                          stage.eta *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>

                    <div className="stageGrid">
                      <span>
                        Pin:{' '}
                        {stage.pin.toFixed(
                          2
                        )}{' '}
                        bar
                      </span>

                      <span>
                        Pst:{' '}
                        {stage.ps.toFixed(
                          2
                        )}{' '}
                        bar
                      </span>

                      <span>
                        Pout:{' '}
                        {stage.pout.toFixed(
                          2
                        )}{' '}
                        bar
                      </span>

                      <span>
                        Reaction: 50%
                      </span>

                      <span>
                        Blade:{' '}
                        {(
                          stage.height *
                          1000
                        ).toFixed(0)}{' '}
                        mm
                      </span>

                      <span>
                        Ca:{' '}
                        {stage.ca.toFixed(
                          1
                        )}{' '}
                        m/s
                      </span>

                      <span>
                        U:{' '}
                        {stage.u.toFixed(
                          1
                        )}{' '}
                        m/s
                      </span>

                      <span>
                        Work:{' '}
                        {(
                          stage.work /
                          1000
                        ).toFixed(1)}{' '}
                        kJ/kg
                      </span>

                      <span>
                        Torque:{' '}
                        {stage.torque.toFixed(
                          0
                        )}{' '}
                        N·m
                      </span>

                      <span>
                        Power:{' '}
                        {stage.power.toFixed(
                          1
                        )}{' '}
                        kW
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="metrics">
              <Metric
                tag="TV-101"
                label="Main stop valve"
                value={(
                  simulation.msv *
                  100
                ).toFixed(1)}
                unit="%"
              />

              <Metric
                tag="GV-101"
                label="Governor valve"
                value={(
                  simulation.gv *
                  100
                ).toFixed(1)}
                unit="%"
              />

              <Metric
                tag="PT-101"
                label="Main steam pressure"
                value={
                  SOURCE_PRESSURE_BAR.toFixed(
                    2
                  )
                }
                unit="bar"
              />

              <Metric
                tag="PT-102"
                label="Steam chest pressure"
                value={
                  simulation.chest.toFixed(
                    2
                  )
                }
                unit="bar"
              />

              <Metric
                tag="FT-101"
                label="Valve inflow"
                value={
                  simulation.valveFlow.toFixed(
                    3
                  )
                }
                unit="kg/s"
              />

              <Metric
                tag="FT-102"
                label="Turbine flow"
                value={
                  simulation.turbineFlow.toFixed(
                    3
                  )
                }
                unit="kg/s"
              />

              <Metric
                tag="ST-101"
                label="Rotor speed"
                value={
                  simulation.rpm.toFixed(
                    0
                  )
                }
                unit="RPM"
              />

              <Metric
                tag="TT-101"
                label="Casing temperature"
                value={
                  simulation.casingC.toFixed(
                    1
                  )
                }
                unit="°C"
              />

              <Metric
                tag="TT-102"
                label="Rotor temperature"
                value={
                  simulation.rotorC.toFixed(
                    1
                  )
                }
                unit="°C"
              />

              <Metric
                tag="DE-101"
                label="Differential expansion"
                value={
                  simulation.expansion.toFixed(
                    3
                  )
                }
                unit="mm"
                tone={
                  Math.abs(
                    simulation.expansion
                  ) > 1
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="PWR-101"
                label="Turbine power"
                value={
                  simulation.turbineKW.toFixed(
                    1
                  )
                }
                unit="kW"
              />

              <Metric
                tag="ETA-101"
                label="Turbine efficiency"
                value={(
                  simulation.eta *
                  100
                ).toFixed(1)}
                unit="%"
              />

              <Metric
                tag="VT-101"
                label="Generator voltage"
                value={
                  simulation.genV.toFixed(
                    0
                  )
                }
                unit="V"
              />

              <Metric
                tag="FR-101"
                label="Generator frequency"
                value={
                  simulation.genHz.toFixed(
                    2
                  )
                }
                unit="Hz"
              />

              <Metric
                tag="MW-101"
                label="Active power"
                value={
                  simulation.exportKW.toFixed(
                    1
                  )
                }
                unit="kW"
                tone={
                  breakerClosed
                    ? 'good'
                    : 'normal'
                }
              />

              <Metric
                tag="MVAR-101"
                label="Reactive power"
                value={
                  simulation.kvar.toFixed(
                    1
                  )
                }
                unit="kVAr"
              />

              <Metric
                tag="PF-101"
                label="Power factor"
                value={
                  simulation.pf.toFixed(
                    3
                  )
                }
              />

              <Metric
                tag="CT-101"
                label="Generator current"
                value={
                  simulation.currentA.toFixed(
                    1
                  )
                }
                unit="A"
                tone={
                  breakerClosed
                    ? 'good'
                    : 'normal'
                }
              />

              <Metric
                tag="PT-301"
                label="Lube-oil pressure"
                value={
                  simulation.oilBar.toFixed(
                    2
                  )
                }
                unit="bar"
                tone={
                  simulation.oilBar <
                  1.25
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="TT-301"
                label="Journal bearing temp"
                value={
                  simulation.bearingC.toFixed(
                    1
                  )
                }
                unit="°C"
                tone={
                  simulation.bearingC >
                  90
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="TT-302"
                label="Thrust bearing temp"
                value={
                  simulation.thrustC.toFixed(
                    1
                  )
                }
                unit="°C"
                tone={
                  simulation.thrustC >
                  95
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="VI-101"
                label="Bearing vibration"
                value={
                  simulation.vibration.toFixed(
                    2
                  )
                }
                unit="mm/s"
                tone={
                  simulation.vibration >
                  4.5
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="AI-101"
                label="Axial displacement"
                value={
                  simulation.axial.toFixed(
                    3
                  )
                }
                unit="mm"
                tone={
                  Math.abs(
                    simulation.axial
                  ) > 0.35
                    ? 'warning'
                    : 'normal'
                }
              />

              <Metric
                tag="BRK-101"
                label="Generator breaker"
                value={
                  breakerState
                }
                tone={
                  breakerClosed
                    ? 'good'
                    : breakerState ===
                        'TRIPPED'
                      ? 'warning'
                      : 'normal'
                }
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
