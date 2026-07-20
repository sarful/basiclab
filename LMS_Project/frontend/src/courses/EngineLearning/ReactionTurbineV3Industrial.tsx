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
type Breaker = 'OPEN' | 'ARMED' | 'CLOSED' | 'TRIPPED';
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
  bladeHeight: number;
  flowArea: number;
  axialVelocity: number;
  bladeSpeed: number;
  speedRatio: number;
  work: number;
  torque: number;
  power: number;
  efficiency: number;
};

type Simulation = {
  angle: number;
  phase: number;
  governorIntegral: number;
  omega: number;
  rpm: number;
  acceleration: number;
  speedReference: number;
  mainStopValve: number;
  governorValveCommand: number;
  governorValve: number;
  warmingBypass: number;
  valveFlow: number;
  turbineFlow: number;
  chestPressure: number;
  flowChoked: boolean;
  casingTemperature: number;
  rotorTemperature: number;
  differentialExpansion: number;
  stages: Stage[];
  steamTorque: number;
  frictionTorque: number;
  generatorTorque: number;
  netTorque: number;
  turbinePower: number;
  electricalPower: number;
  gridImport: number;
  actualLoad: number;
  generatedFrequency: number;
  terminalFrequency: number;
  generatedVoltage: number;
  terminalVoltage: number;
  field: number;
  current: number;
  reactivePower: number;
  powerFactor: number;
  overallEfficiency: number;
  oilPumpRunning: boolean;
  turningGearEngaged: boolean;
  oilPressure: number;
  oilTemperature: number;
  frontBearingTemperature: number;
  rearBearingTemperature: number;
  thrustBearingTemperature: number;
  vibrationX: number;
  vibrationY: number;
  axialDisplacement: number;
};

type Controls = {
  running: boolean;
  mode: Mode;
  oilPump: boolean;
  turningGear: boolean;
  mainStopValveOpen: boolean;
  manualGovernorValve: number;
  speedSetpoint: number;
  loadDemand: number;
  excitation: number;
  autoStart: boolean;
  startupStep: Step;
  tripActive: boolean;
  breakerClosed: boolean;
  autoSyncArmed: boolean;
};

type SvgIds = Record<
  | 'steamArrow'
  | 'electricArrow'
  | 'oilArrow'
  | 'steel'
  | 'steelDark'
  | 'machined'
  | 'rotorDrum'
  | 'copper'
  | 'steam'
  | 'exhaustSteam'
  | 'oil'
  | 'shadow'
  | 'steamGlow'
  | 'casingClip'
  | 'exhaustClip'
  | 'shaftClip'
  | 'generatorEndClip',
  string
>;

const STAGE_COUNT = 3;
const SOURCE_PRESSURE_BAR = 22;
const EXHAUST_PRESSURE_BAR = 1.05;
const SOURCE_TEMPERATURE_K = 723.15;
const STEAM_GAMMA = 1.3;
const STEAM_R = 461.5;
const STEAM_CP = 2100;
const VALVE_CD = 0.96;
const MAX_VALVE_AREA_M2 = 9e-4;
const SWALLOWING_COEFFICIENT = 0.096;
const CHEST_GAIN = 5.2;
const STATOR_EFFICIENCY = 0.93;
const ROTOR_EFFICIENCY = 0.9;
const MECHANICAL_EFFICIENCY = 0.97;
const RATED_RPM = 3600;
const MAX_RPM = 4200;
const OVERSPEED_TRIP_RPM = 3960;
const TURNING_GEAR_RPM = 6;
const ROTOR_INERTIA = 34;
const GRID_FREQUENCY_HZ = 60;
const GENERATOR_POLES = 2;
const RATED_VOLTAGE_V = 480;
const RATED_GENERATOR_KW = 220;
const GENERATOR_EFFICIENCY = 0.94;
const NOMINAL_POWER_FACTOR = 0.9;
const SYNCHRONOUS_OMEGA = (RATED_RPM * 2 * Math.PI) / 60;
const MAX_OMEGA = (MAX_RPM * 2 * Math.PI) / 60;
const DISPLAY_RPS_AT_RATED = 1.45;
const MIN_VISIBLE_RPS = 0.2;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value));

const moveToward = (value: number, target: number, maximumStep: number) => {
  if (Math.abs(target - value) <= maximumStep) return target;
  return value + Math.sign(target - value) * maximumStep;
};

const response = (deltaTime: number, timeConstant: number) =>
  1 - Math.exp(-deltaTime / Math.max(timeConstant, 0.001));

const wrap360 = (value: number) => ((value % 360) + 360) % 360;

const wrapSigned = (value: number) => {
  const wrapped = wrap360(value);
  return wrapped > 180 ? wrapped - 360 : wrapped;
};

function isentropicOutletTemperature(
  inletTemperatureK: number,
  outletPressureBar: number,
  inletPressureBar: number
) {
  return (
    inletTemperatureK *
    Math.pow(
      clamp(outletPressureBar / Math.max(inletPressureBar, 0.001), 0.001, 1),
      (STEAM_GAMMA - 1) / STEAM_GAMMA
    )
  );
}

function createIdleStages(chestPressureBar = EXHAUST_PRESSURE_BAR + 0.08): Stage[] {
  const inlet = Math.max(chestPressureBar, EXHAUST_PRESSURE_BAR + 0.01);
  const pressureRatio = Math.pow(EXHAUST_PRESSURE_BAR / inlet, 1 / STAGE_COUNT);
  let pin = inlet;
  let tin = SOURCE_TEMPERATURE_K;

  return Array.from({ length: STAGE_COUNT }, (_, index) => {
    const pout = index === STAGE_COUNT - 1 ? EXHAUST_PRESSURE_BAR : pin * pressureRatio;
    const ps = Math.sqrt(pin * pout);
    const ts = isentropicOutletTemperature(tin, ps, pin);
    const tout = isentropicOutletTemperature(ts, pout, ps);
    const rho = (((pin + pout) * 0.5) * 100000) / (STEAM_R * ((tin + tout) * 0.5));

    const stage: Stage = {
      n: index + 1,
      pin,
      ps,
      pout,
      tin,
      tout,
      rho,
      radius: [0.57, 0.61, 0.66][index],
      bladeHeight: [0.045, 0.085, 0.165][index],
      flowArea: [0.0055, 0.0095, 0.017][index],
      axialVelocity: 0,
      bladeSpeed: 0,
      speedRatio: 0,
      work: 0,
      torque: 0,
      power: 0,
      efficiency: 0,
    };

    pin = pout;
    tin = tout;
    return stage;
  });
}

const INITIAL_SIMULATION: Simulation = {
  angle: 0,
  phase: 0,
  governorIntegral: 0,
  omega: 0,
  rpm: 0,
  acceleration: 0,
  speedReference: 0,
  mainStopValve: 0,
  governorValveCommand: 0,
  governorValve: 0,
  warmingBypass: 0,
  valveFlow: 0,
  turbineFlow: 0,
  chestPressure: EXHAUST_PRESSURE_BAR + 0.08,
  flowChoked: false,
  casingTemperature: 30,
  rotorTemperature: 30,
  differentialExpansion: 0,
  stages: createIdleStages(),
  steamTorque: 0,
  frictionTorque: 0,
  generatorTorque: 0,
  netTorque: 0,
  turbinePower: 0,
  electricalPower: 0,
  gridImport: 0,
  actualLoad: 0,
  generatedFrequency: 0,
  terminalFrequency: 0,
  generatedVoltage: 0,
  terminalVoltage: 0,
  field: 0,
  current: 0,
  reactivePower: 0,
  powerFactor: NOMINAL_POWER_FACTOR,
  overallEfficiency: 0,
  oilPumpRunning: false,
  turningGearEngaged: false,
  oilPressure: 0.2,
  oilTemperature: 30,
  frontBearingTemperature: 32,
  rearBearingTemperature: 32,
  thrustBearingTemperature: 32,
  vibrationX: 0.18,
  vibrationY: 0.2,
  axialDisplacement: 0,
};

function automaticCommands(controls: Controls) {
  if (!controls.autoStart) {
    return {
      oil: controls.oilPump,
      gear: controls.turningGear,
      mainStopValve: controls.mainStopValveOpen,
      warmingBypass: 0,
      mode: controls.mode,
      speedSetpoint: controls.speedSetpoint,
      manualGovernorValve: controls.manualGovernorValve,
      excitation: controls.excitation,
      loadDemand: controls.loadDemand,
      autoSync: controls.autoSyncArmed,
    };
  }

  const base = {
    oil: true,
    gear: false,
    mainStopValve: false,
    warmingBypass: 0,
    mode: 'AUTO' as Mode,
    speedSetpoint: 0,
    manualGovernorValve: 0,
    excitation: 0,
    loadDemand: 0,
    autoSync: false,
  };

  switch (controls.startupStep) {
    case 'TURNING':
      return { ...base, gear: true };
    case 'WARMING':
      return { ...base, gear: true, warmingBypass: 0.68 };
    case 'ROLLING':
      return { ...base, mainStopValve: true, speedSetpoint: 18 };
    case 'ACCELERATING':
      return { ...base, mainStopValve: true, speedSetpoint: 100 };
    case 'EXCITATION':
      return { ...base, mainStopValve: true, speedSetpoint: 100, excitation: 100 };
    case 'SYNCHRONIZING':
      return {
        ...base,
        mainStopValve: true,
        speedSetpoint: 100,
        excitation: 100,
        autoSync: true,
      };
    case 'ONLINE':
      return {
        ...base,
        mainStopValve: true,
        speedSetpoint: 100,
        excitation: controls.excitation,
        loadDemand: controls.loadDemand,
      };
    default:
      return base;
  }
}

function calculateValveFlow(valveOpening: number, chestPressureBar: number) {
  const upstreamPressurePa = SOURCE_PRESSURE_BAR * 100000;
  const downstreamPressurePa = clamp(chestPressureBar, 0.05, SOURCE_PRESSURE_BAR) * 100000;
  const pressureRatio = downstreamPressurePa / upstreamPressurePa;
  const criticalPressureRatio = Math.pow(
    2 / (STEAM_GAMMA + 1),
    STEAM_GAMMA / (STEAM_GAMMA - 1)
  );
  const effectiveAreaM2 = MAX_VALVE_AREA_M2 * clamp(valveOpening, 0, 1);

  if (effectiveAreaM2 < 1e-8) return { flow: 0, choked: false };

  if (pressureRatio <= criticalPressureRatio) {
    const chokedFactor =
      Math.sqrt(STEAM_GAMMA / (STEAM_R * SOURCE_TEMPERATURE_K)) *
      Math.pow(
        2 / (STEAM_GAMMA + 1),
        (STEAM_GAMMA + 1) / (2 * (STEAM_GAMMA - 1))
      );

    return {
      flow: VALVE_CD * effectiveAreaM2 * upstreamPressurePa * chokedFactor,
      choked: true,
    };
  }

  const pressureTerm =
    Math.pow(pressureRatio, 2 / STEAM_GAMMA) -
    Math.pow(pressureRatio, (STEAM_GAMMA + 1) / STEAM_GAMMA);

  return {
    flow:
      VALVE_CD *
      effectiveAreaM2 *
      upstreamPressurePa *
      Math.sqrt(
        Math.max(
          (2 * STEAM_GAMMA * pressureTerm) /
            (STEAM_R * SOURCE_TEMPERATURE_K * (STEAM_GAMMA - 1)),
          0
        )
      ),
    choked: false,
  };
}

function calculateSwallowingFlow(chestPressureBar: number) {
  return SWALLOWING_COEFFICIENT * Math.max(chestPressureBar - EXHAUST_PRESSURE_BAR, 0);
}

function calculateReactionStages(
  massFlowKgS: number,
  omegaRadS: number,
  chestPressureBar: number
) {
  const inletPressure = Math.max(chestPressureBar, EXHAUST_PRESSURE_BAR + 0.01);
  const stagePressureRatio = Math.pow(EXHAUST_PRESSURE_BAR / inletPressure, 1 / STAGE_COUNT);
  let pin = inletPressure;
  let tin = SOURCE_TEMPERATURE_K;
  let totalTorque = 0;
  let totalPower = 0;
  let totalAvailableWork = 0;
  let totalUsefulWork = 0;

  const stages = Array.from({ length: STAGE_COUNT }, (_, index): Stage => {
    const pout = index === STAGE_COUNT - 1 ? EXHAUST_PRESSURE_BAR : pin * stagePressureRatio;
    const ps = Math.sqrt(pin * pout);

    const statorIsentropicTemperature = isentropicOutletTemperature(tin, ps, pin);
    const statorIsentropicDrop = Math.max(
      STEAM_CP * (tin - statorIsentropicTemperature),
      0
    );
    const statorActualDrop = statorIsentropicDrop * STATOR_EFFICIENCY;
    const statorExitTemperature = Math.max(tin - statorActualDrop / STEAM_CP, 330);

    const rotorIsentropicTemperature = isentropicOutletTemperature(
      statorExitTemperature,
      pout,
      ps
    );
    const rotorIsentropicDrop = Math.max(
      STEAM_CP * (statorExitTemperature - rotorIsentropicTemperature),
      0
    );
    const rotorActualDrop = rotorIsentropicDrop * ROTOR_EFFICIENCY;
    const tout = Math.max(statorExitTemperature - rotorActualDrop / STEAM_CP, 315);

    const availableStageWork = statorActualDrop + rotorActualDrop;
    const meanTemperature = (tin + tout) * 0.5;
    const meanPressurePa = ((pin + pout) * 0.5) * 100000;
    const rho = meanPressurePa / (STEAM_R * meanTemperature);
    const radius = [0.57, 0.61, 0.66][index];
    const bladeHeight = [0.045, 0.085, 0.165][index];
    const flowArea = [0.0055, 0.0095, 0.017][index];
    const axialVelocity =
      massFlowKgS > 0 ? massFlowKgS / Math.max(rho * flowArea, 0.0001) : 0;
    const bladeSpeed = omegaRadS * radius;
    const idealStageVelocity = Math.sqrt(Math.max(2 * availableStageWork, 1));
    const speedRatio = bladeSpeed / idealStageVelocity;
    const speedMatching = Math.exp(-Math.pow((speedRatio - 0.58) / 0.34, 2));
    const flowMatching = clamp(0.55 + 0.45 * (massFlowKgS / 1.15), 0.55, 1);
    const stageEfficiency = clamp(
      0.2 + 0.68 * speedMatching * flowMatching,
      0.18,
      0.88
    );
    const specificWork = availableStageWork * stageEfficiency * MECHANICAL_EFFICIENCY;
    const aerodynamicPowerW = massFlowKgS * specificWork;
    const stageTorque = aerodynamicPowerW / Math.max(omegaRadS, 34);
    const stagePower = (stageTorque * omegaRadS) / 1000;

    totalTorque += stageTorque;
    totalPower += stagePower;
    totalAvailableWork += availableStageWork;
    totalUsefulWork += specificWork;

    const stage: Stage = {
      n: index + 1,
      pin,
      ps,
      pout,
      tin,
      tout,
      rho,
      radius,
      bladeHeight,
      flowArea,
      axialVelocity,
      bladeSpeed,
      speedRatio,
      work: specificWork,
      torque: stageTorque,
      power: stagePower,
      efficiency: stageEfficiency,
    };

    pin = pout;
    tin = tout;
    return stage;
  });

  return {
    stages,
    torque: totalTorque,
    power: totalPower,
    efficiency:
      totalAvailableWork > 1 ? clamp(totalUsefulWork / totalAvailableWork, 0, 0.9) : 0,
  };
}

function calculateNextState(
  previous: Simulation,
  controls: Controls,
  deltaTime: number
): Simulation {
  const commands = automaticCommands(controls);
  const oilPumpRunning = commands.oil && !controls.tripActive;
  const mainStopValveTarget = commands.mainStopValve && !controls.tripActive ? 1 : 0;
  const mainStopValve = moveToward(
    previous.mainStopValve,
    mainStopValveTarget,
    (mainStopValveTarget > previous.mainStopValve ? 0.38 : 2.5) * deltaTime
  );
  const warmingBypass = moveToward(
    previous.warmingBypass,
    controls.tripActive ? 0 : commands.warmingBypass,
    0.55 * deltaTime
  );

  const turningGearEngaged =
    commands.gear &&
    oilPumpRunning &&
    previous.rpm < 25 &&
    mainStopValve < 0.02 &&
    !controls.tripActive;

  const targetRpmCommand = controls.breakerClosed
    ? RATED_RPM
    : (clamp(commands.speedSetpoint, 0, 105) / 100) * RATED_RPM +
      (commands.autoSync ? 5 : 0);

  const speedRampRateRpmS = controls.breakerClosed
    ? 1200
    : controls.autoStart && controls.startupStep === 'ROLLING'
      ? 110
      : controls.autoStart && controls.startupStep === 'ACCELERATING'
        ? 240
        : 180;

  const speedReference = moveToward(
    previous.speedReference,
    targetRpmCommand,
    speedRampRateRpmS * deltaTime
  );

  const normalizedSpeedError = (speedReference - previous.rpm) / RATED_RPM;
  const loadFraction = clamp(commands.loadDemand / 100, 0, 1);
  const governorFeedForward = controls.breakerClosed
    ? 0.16 + 0.68 * loadFraction
    : speedReference > 100
      ? 0.035 + 0.075 * clamp(speedReference / RATED_RPM, 0, 1)
      : 0;
  const governorKp = controls.breakerClosed ? 0.5 : 0.82;
  const governorKi = controls.breakerClosed ? 0.2 : 0.12;
  const candidateIntegral = clamp(
    previous.governorIntegral + normalizedSpeedError * deltaTime,
    -1.8,
    1.8
  );
  const rawGovernorCommand =
    governorFeedForward + governorKp * normalizedSpeedError + governorKi * candidateIntegral;
  const integralWindup =
    (rawGovernorCommand > 1 && normalizedSpeedError > 0) ||
    (rawGovernorCommand < 0 && normalizedSpeedError < 0);
  const governorIntegral =
    commands.mode === 'AUTO'
      ? integralWindup
        ? previous.governorIntegral
        : candidateIntegral
      : 0;
  const accelerationDamping = 0.035 * Math.max(previous.acceleration, 0);
  const overspeedBias = previous.rpm > speedReference + 40
    ? clamp((previous.rpm - speedReference - 40) / 450, 0, 0.65)
    : 0;
  const automaticGovernorCommand = clamp(
    governorFeedForward +
      governorKp * normalizedSpeedError +
      governorKi * governorIntegral -
      accelerationDamping -
      overspeedBias,
    0,
    1
  );
  const governorValveCommand = controls.tripActive
    ? 0
    : commands.mode === 'MANUAL'
      ? clamp(commands.manualGovernorValve / 100, 0, 1)
      : automaticGovernorCommand;
  const governorValve = controls.tripActive
    ? moveToward(previous.governorValve, 0, 7 * deltaTime)
    : commands.mode === 'MANUAL'
      ? governorValveCommand
      : moveToward(
          previous.governorValve,
          governorValveCommand,
          (governorValveCommand > previous.governorValve ? 0.85 : 1.35) * deltaTime
        );

  const effectiveOpening = mainStopValve * governorValve;
  const admission = calculateValveFlow(effectiveOpening, previous.chestPressure);
  const swallowingCapacity = calculateSwallowingFlow(previous.chestPressure);
  const turbineFlow =
    effectiveOpening > 0.0005 ? swallowingCapacity : swallowingCapacity * 0.18;
  const chestPressure = clamp(
    previous.chestPressure +
      CHEST_GAIN * (admission.flow - turbineFlow) * deltaTime,
    EXHAUST_PRESSURE_BAR + 0.04,
    SOURCE_PRESSURE_BAR * 0.985
  );
  const effectiveFlow = clamp(turbineFlow, 0, 2.3);
  const stageResult = calculateReactionStages(effectiveFlow, previous.omega, chestPressure);
  const steamTorque = stageResult.torque;
  const frictionTorque =
    (previous.omega > 0.3 ? 9 : 0) +
    0.045 * previous.omega +
    0.00034 * previous.omega ** 2;

  const actualLoad = controls.breakerClosed
    ? moveToward(previous.actualLoad, commands.loadDemand, 7 * deltaTime)
    : moveToward(previous.actualLoad, 0, 20 * deltaTime);
  const field = moveToward(
    previous.field,
    controls.tripActive ? 0 : commands.excitation,
    28 * deltaTime
  );
  const fieldFraction = clamp(field / 100, 0, 1.2);
  const generatedVoltage =
    RATED_VOLTAGE_V *
    fieldFraction *
    clamp(previous.rpm / RATED_RPM, 0, 1.08) *
    (1 - 0.08 * Math.max(fieldFraction - 1, 0));

  const availableMechanicalPower =
    ((steamTorque - frictionTorque) * previous.omega) / 1000;
  const requestedElectricalPower =
    RATED_GENERATOR_KW * clamp(actualLoad / 100, 0, 1);
  const electricalPower = controls.breakerClosed
    ? Math.min(
        requestedElectricalPower,
        Math.max(availableMechanicalPower, 0) * GENERATOR_EFFICIENCY
      )
    : 0;
  const gridImport = controls.breakerClosed
    ? Math.max(-availableMechanicalPower / GENERATOR_EFFICIENCY, 0)
    : 0;
  const generatorTorque =
    controls.breakerClosed && previous.omega > 1
      ? (electricalPower * 1000) / (previous.omega * GENERATOR_EFFICIENCY) -
        (gridImport * 1000 * GENERATOR_EFFICIENCY) / previous.omega
      : 0;
  const netTorque = steamTorque - frictionTorque - generatorTorque;
  const acceleration = netTorque / ROTOR_INERTIA;

  let omega: number;
  if (controls.breakerClosed) {
    omega = SYNCHRONOUS_OMEGA;
  } else if (turningGearEngaged) {
    const gearOmega = (TURNING_GEAR_RPM * 2 * Math.PI) / 60;
    omega = previous.omega + (gearOmega - previous.omega) * response(deltaTime, 0.8);
  } else {
    omega = clamp(previous.omega + acceleration * deltaTime, 0, MAX_OMEGA);
  }

  const rpm = (omega * 60) / (2 * Math.PI);
  const generatedFrequency = (rpm * GENERATOR_POLES) / 120;
  const physicalSpeedFraction = clamp(rpm / RATED_RPM, 0, MAX_RPM / RATED_RPM);
  const visibleRps =
    rpm < 0.5
      ? 0
      : Math.max(DISPLAY_RPS_AT_RATED * physicalSpeedFraction, MIN_VISIBLE_RPS);
  const angle = wrap360(previous.angle + visibleRps * 360 * deltaTime);
  const phase = controls.breakerClosed
    ? previous.phase +
      (clamp(actualLoad * 0.32, 0, 34) - previous.phase) * response(deltaTime, 0.4)
    : wrapSigned(
        previous.phase +
          360 * (generatedFrequency - GRID_FREQUENCY_HZ) * deltaTime
      );
  const terminalVoltage = controls.breakerClosed ? RATED_VOLTAGE_V : generatedVoltage;
  const terminalFrequency = controls.breakerClosed ? GRID_FREQUENCY_HZ : generatedFrequency;
  const excitationError = fieldFraction - 1;
  const powerFactor = controls.breakerClosed
    ? clamp(NOMINAL_POWER_FACTOR - Math.abs(excitationError) * 0.22, 0.72, 0.99)
    : NOMINAL_POWER_FACTOR;
  const apparentPower = powerFactor > 0.01 ? electricalPower / powerFactor : 0;
  const reactivePower = controls.breakerClosed
    ? Math.sign(excitationError || 1) *
      Math.sqrt(Math.max(apparentPower ** 2 - electricalPower ** 2, 0))
    : 0;
  const current =
    controls.breakerClosed && terminalVoltage > 10
      ? (Math.max(apparentPower, gridImport) * 1000) /
        (Math.sqrt(3) * terminalVoltage)
      : 0;

  const casingTarget = clamp(
    30 + warmingBypass * 185 + effectiveFlow * 38,
    30,
    330
  );
  const rotorTarget = clamp(30 + effectiveFlow * 118, 30, 315);
  const casingTemperature =
    previous.casingTemperature +
    (casingTarget - previous.casingTemperature) *
      response(deltaTime, warmingBypass > 0 ? 6 : 28);
  const rotorTemperature =
    previous.rotorTemperature +
    (rotorTarget - previous.rotorTemperature) * response(deltaTime, 22);
  const differentialExpansion = clamp(
    (rotorTemperature - casingTemperature) * 0.012,
    -1.2,
    1.8
  );

  const oilPressureTarget = oilPumpRunning
    ? clamp(
        2.5 + 0.75 * Math.sqrt(Math.max(rpm, 0) / RATED_RPM),
        2.5,
        3.35
      )
    : clamp(
        0.2 + 0.55 * Math.sqrt(Math.max(rpm, 0) / RATED_RPM),
        0.2,
        0.85
      );
  const oilPressure =
    previous.oilPressure +
    (oilPressureTarget - previous.oilPressure) * response(deltaTime, 0.8);
  const oilTemperatureTarget = 30 + frictionTorque * 0.05 + rpm * 0.0018;
  const oilTemperature =
    previous.oilTemperature +
    (oilTemperatureTarget - previous.oilTemperature) * response(deltaTime, 15);
  const frontBearingTarget = oilTemperature + 6 + frictionTorque * 0.05;
  const rearBearingTarget = oilTemperature + 8 + frictionTorque * 0.057;
  const thrustBearingTarget =
    oilTemperature + 9 + frictionTorque * 0.055 + Math.abs(chestPressure - EXHAUST_PRESSURE_BAR) * 0.18;
  const frontBearingTemperature =
    previous.frontBearingTemperature +
    (frontBearingTarget - previous.frontBearingTemperature) * response(deltaTime, 18);
  const rearBearingTemperature =
    previous.rearBearingTemperature +
    (rearBearingTarget - previous.rearBearingTemperature) * response(deltaTime, 20);
  const thrustBearingTemperature =
    previous.thrustBearingTemperature +
    (thrustBearingTarget - previous.thrustBearingTemperature) * response(deltaTime, 24);
  const vibrationBase =
    0.24 +
    rpm / 8500 +
    Math.abs(netTorque) / 3600 +
    Math.abs(differentialExpansion) * 0.16;
  const vibrationX = vibrationBase + 0.04 * Math.sin((angle * Math.PI) / 180);
  const vibrationY = vibrationBase + 0.05 * Math.cos((angle * Math.PI) / 180);
  const axialDisplacement = clamp(
    0.04 +
      (chestPressure - EXHAUST_PRESSURE_BAR) * 0.006 +
      differentialExpansion * 0.08,
    -0.25,
    0.45
  );

  return {
    angle,
    phase,
    governorIntegral,
    omega,
    rpm,
    acceleration,
    speedReference,
    mainStopValve,
    governorValveCommand,
    governorValve,
    warmingBypass,
    valveFlow: admission.flow,
    turbineFlow: effectiveFlow,
    chestPressure,
    flowChoked: admission.choked,
    casingTemperature,
    rotorTemperature,
    differentialExpansion,
    stages: stageResult.stages,
    steamTorque,
    frictionTorque,
    generatorTorque,
    netTorque,
    turbinePower: stageResult.power,
    electricalPower,
    gridImport,
    actualLoad,
    generatedFrequency,
    terminalFrequency,
    generatedVoltage,
    terminalVoltage,
    field,
    current,
    reactivePower,
    powerFactor,
    overallEfficiency: stageResult.efficiency,
    oilPumpRunning,
    turningGearEngaged,
    oilPressure,
    oilTemperature,
    frontBearingTemperature,
    rearBearingTemperature,
    thrustBearingTemperature,
    vibrationX,
    vibrationY,
    axialDisplacement,
  };
}

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
  tone?: 'normal' | 'good' | 'warning';
}) {
  return (
    <div className={`metric ${tone}`}>
      <small>{tag}</small>
      <em>{label}</em>
      <b>
        {value}
        {unit ? <span>{unit}</span> : null}
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
      <span className={`lamp ${on ? (danger ? 'danger' : 'on') : ''}`} />
      {children}
    </div>
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
          className={`toggle ${warning ? 'warning' : 'safe'} ${leftActive ? 'active' : ''}`}
          disabled={leftDisabled}
          onClick={onLeft}
        >
          {left}
        </button>
        <button
          type="button"
          className={`toggle ${rightActive ? 'active' : ''}`}
          disabled={rightDisabled}
          onClick={onRight}
        >
          {right}
        </button>
      </div>
    </div>
  );
}

function SynchronizingDial({ phase, ready }: { phase: number; ready: boolean }) {
  return (
    <svg viewBox="0 0 170 170" className="syncDial">
      <circle cx="85" cy="85" r="68" fill="#f8fafc" stroke="#64748b" strokeWidth="5" />
      <circle
        cx="85"
        cy="85"
        r="55"
        fill="none"
        stroke={ready ? '#10b981' : '#cbd5e1'}
        strokeWidth="4"
      />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * 30 * Math.PI) / 180;
        return (
          <line
            key={index}
            x1={85 + Math.sin(angle) * 54}
            y1={85 - Math.cos(angle) * 54}
            x2={85 + Math.sin(angle) * 65}
            y2={85 - Math.cos(angle) * 65}
            stroke="#334155"
            strokeWidth={index % 3 === 0 ? 3 : 1.5}
          />
        );
      })}
      <text x="85" y="23" textAnchor="middle" fontSize="10" fontWeight="900">
        IN PHASE
      </text>
      <g transform={`rotate(${phase} 85 85)`}>
        <line
          x1="85"
          y1="91"
          x2="85"
          y2="36"
          stroke={ready ? '#059669' : '#f97316'}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <circle cx="85" cy="85" r="9" fill="#64748b" stroke="#0f172a" strokeWidth="3" />
      <text x="85" y="153" textAnchor="middle" fontSize="11" fontWeight="900">
        {phase.toFixed(1)}°
      </text>
    </svg>
  );
}

function bladePath(x: number, y: number, moving: boolean, scale = 1) {
  const direction = moving ? -1 : 1;
  const halfHeight = 10.8 * scale;
  const halfChord = 5.2 * scale;
  const camber = 8.8 * scale * direction;
  return `
    M ${x - halfChord} ${y - halfHeight}
    C ${x - halfChord + camber * 0.2} ${y - halfHeight * 0.5},
      ${x + camber} ${y - halfHeight * 0.08},
      ${x + halfChord} ${y + halfHeight}
    C ${x + halfChord - camber * 0.14} ${y + halfHeight * 0.5},
      ${x - camber * 0.5} ${y + halfHeight * 0.08},
      ${x - halfChord} ${y - halfHeight}
    Z
  `;
}

function BladeRow({
  x,
  shaftY,
  outer,
  hub,
  moving,
  angle,
  stageNumber,
  ids,
}: {
  x: number;
  shaftY: number;
  outer: number;
  hub: number;
  moving: boolean;
  angle: number;
  stageNumber: number;
  ids: SvgIds;
}) {
  const bladeCount = 10;
  const availableSpan = outer - hub - 37;
  const scale = clamp(outer / 132, 0.78, 1.25);
  const upper = Array.from(
    { length: bladeCount },
    (_, index) =>
      shaftY - outer + 20 + index * (availableSpan / Math.max(bladeCount - 1, 1))
  );
  const lower = Array.from(
    { length: bladeCount },
    (_, index) =>
      shaftY + hub + 18 + index * (availableSpan / Math.max(bladeCount - 1, 1))
  );
  const phaseIndicatorRadius = Math.max(hub + 14, 36);
  const surfaceMarks = [0, 120, 240].map((offset) => {
    const radians = ((angle + offset) * Math.PI) / 180;
    const front = Math.max(Math.cos(radians), 0);
    return {
      y: shaftY + Math.sin(radians) * Math.max(outer - 25, 12),
      opacity: 0.14 + 0.62 * front,
      rx: 9 + 9 * front,
    };
  });

  return (
    <g>
      {moving ? (
        <>
          <ellipse
            cx={x}
            cy={shaftY}
            rx="23"
            ry={outer + 9}
            fill={`url(#${ids.steelDark})`}
            stroke="#334155"
            strokeWidth="4"
          />
          <ellipse
            cx={x}
            cy={shaftY}
            rx="29"
            ry={hub + 11}
            fill={`url(#${ids.rotorDrum})`}
            stroke="#334155"
            strokeWidth="3"
          />
          {surfaceMarks.map((mark, index) => (
            <ellipse
              key={index}
              cx={x}
              cy={mark.y}
              rx={mark.rx}
              ry="4.8"
              fill="#ffffff"
              opacity={mark.opacity}
            />
          ))}
          <g transform={`rotate(${angle} ${x} ${shaftY})`}>
            <line
              x1={x}
              y1={shaftY - phaseIndicatorRadius}
              x2={x}
              y2={shaftY + phaseIndicatorRadius}
              stroke="#fb923c"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx={x}
              cy={shaftY - phaseIndicatorRadius}
              r="6"
              fill="#f97316"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx={x}
              cy={shaftY + phaseIndicatorRadius}
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
              M ${x - 20} ${shaftY - outer - 13}
              L ${x + 20} ${shaftY - outer - 13}
              L ${x + 20} ${shaftY - hub - 9}
              L ${x - 20} ${shaftY - hub - 9}
              Z
              M ${x - 20} ${shaftY + hub + 9}
              L ${x + 20} ${shaftY + hub + 9}
              L ${x + 20} ${shaftY + outer + 13}
              L ${x - 20} ${shaftY + outer + 13}
              Z
            `}
            fill={`url(#${ids.steel})`}
            stroke="#465466"
            strokeWidth="3"
          />
          <ellipse
            cx={x}
            cy={shaftY}
            rx="22"
            ry={hub + 9}
            fill="#5d6a79"
            stroke="#334155"
            strokeWidth="3"
          />
        </>
      )}

      {[...upper, ...lower].map((bladeY, index) => (
        <path
          key={index}
          d={bladePath(x, bladeY, moving, scale)}
          fill={moving ? '#eef3f7' : '#dbe4ec'}
          stroke={moving ? '#536273' : '#617080'}
          strokeWidth="1.4"
        />
      ))}

      <text
        x={x}
        y={shaftY - outer - 29}
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill={moving ? '#b45309' : '#1d4ed8'}
      >
        {moving ? `R${stageNumber}` : `S${stageNumber}`}
      </text>
    </g>
  );
}

function Bearing({
  x,
  shaftY,
  label,
  angle,
  ids,
  thrust = false,
}: {
  x: number;
  shaftY: number;
  label: string;
  angle: number;
  ids: SvgIds;
  thrust?: boolean;
}) {
  return (
    <g filter={`url(#${ids.shadow})`}>
      <path
        d={`
          M ${x - 48} ${shaftY + 62}
          L ${x + 48} ${shaftY + 62}
          L ${x + 35} 750
          L ${x - 35} 750
          Z
        `}
        fill={`url(#${ids.steel})`}
        stroke="#465466"
        strokeWidth="4"
      />
      <circle
        cx={x}
        cy={shaftY}
        r={thrust ? 46 : 42}
        fill="#d4d8dd"
        stroke="#465466"
        strokeWidth="4"
      />
      {thrust ? (
        <>
          <circle cx={x} cy={shaftY} r="35" fill="none" stroke="#f59e0b" strokeWidth="5" />
          <circle cx={x} cy={shaftY} r="29" fill="none" stroke="#64748b" strokeWidth="3" />
        </>
      ) : (
        <circle cx={x} cy={shaftY} r="32" fill="none" stroke="#f59e0b" strokeWidth="5" />
      )}
      <circle
        cx={x}
        cy={shaftY}
        r="24"
        fill={`url(#${ids.machined})`}
        stroke="#334155"
        strokeWidth="3"
      />
      <g transform={`rotate(${angle} ${x} ${shaftY})`}>
        <line
          x1={x}
          y1={shaftY}
          x2={x + 22}
          y2={shaftY}
          stroke="#f97316"
          strokeWidth="4"
        />
        <circle cx={x + 22} cy={shaftY} r="4" fill="#f97316" />
      </g>
      <text x={x} y="782" textAnchor="middle" fontSize="10" fontWeight="900">
        {label}
      </text>
    </g>
  );
}

function ValveBody({
  x,
  shaftY,
  opening,
  label,
  ids,
  trip,
  compact = false,
}: {
  x: number;
  shaftY: number;
  opening: number;
  label: string;
  ids: SvgIds;
  trip: boolean;
  compact?: boolean;
}) {
  const width = compact ? 76 : 82;
  const height = compact ? 325 : 380;
  const top = compact ? 250 : 205;
  const centerX = x + width / 2;
  const chamberTop = shaftY - 49;
  const gateY = chamberTop + 14 - opening * 105;
  const wheelY = compact ? 155 : 122;

  return (
    <g filter={`url(#${ids.shadow})`}>
      <rect
        x={x}
        y={top}
        width={width}
        height={height}
        rx="12"
        fill={`url(#${ids.steel})`}
        stroke="#465466"
        strokeWidth="4"
      />
      <rect
        x={x + 17}
        y={chamberTop}
        width={width - 34}
        height="98"
        rx="6"
        fill="#244e61"
        stroke="#334155"
        strokeWidth="3"
      />
      <rect
        x={centerX - 17}
        y={gateY}
        width="34"
        height="64"
        rx="4"
        fill={trip ? '#dc2626' : '#f59e0b'}
        stroke="#334155"
        strokeWidth="3"
      />
      <rect
        x={centerX - 6}
        y={compact ? 174 : 140}
        width="12"
        height={Math.max(gateY - (compact ? 174 : 140), 8)}
        fill={`url(#${ids.machined})`}
        stroke="#465466"
        strokeWidth="2"
      />
      <ellipse
        cx={centerX}
        cy={wheelY}
        rx={compact ? 48 : 54}
        ry={compact ? 17 : 19}
        fill="none"
        stroke="#64748b"
        strokeWidth={compact ? 7 : 8}
      />
      <line
        x1={centerX - (compact ? 48 : 54)}
        y1={wheelY}
        x2={centerX + (compact ? 48 : 54)}
        y2={wheelY}
        stroke="#64748b"
        strokeWidth="4"
      />
      <text
        x={centerX}
        y={top + height + 30}
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
      >
        {label}
      </text>
      <text
        x={centerX}
        y={top + height + 45}
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        fill="#64748b"
      >
        {(opening * 100).toFixed(0)}% OPEN
      </text>
    </g>
  );
}

export default function ReactionTurbineV3Industrial() {
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = useMemo<SvgIds>(
    () =>
      Object.fromEntries(
        [
          'steamArrow',
          'electricArrow',
          'oilArrow',
          'steel',
          'steelDark',
          'machined',
          'rotorDrum',
          'copper',
          'steam',
          'exhaustSteam',
          'oil',
          'shadow',
          'steamGlow',
          'casingClip',
          'exhaustClip',
          'shaftClip',
          'generatorEndClip',
        ].map((key) => [key, `rtv3-${key}-${uniqueId}`])
      ) as SvgIds,
    [uniqueId]
  );

  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<Mode>('MANUAL');
  const [oilPump, setOilPump] = useState(false);
  const [turningGear, setTurningGear] = useState(false);
  const [mainStopValveOpen, setMainStopValveOpen] = useState(false);
  const [manualGovernorValve, setManualGovernorValve] = useState(0);
  const [speedSetpoint, setSpeedSetpoint] = useState(100);
  const [loadDemand, setLoadDemand] = useState(40);
  const [excitation, setExcitation] = useState(100);
  const [autoStart, setAutoStart] = useState(false);
  const [startupStep, setStartupStep] = useState<Step>('IDLE');
  const [tripActive, setTripActive] = useState(false);
  const [breakerState, setBreakerState] = useState<Breaker>('OPEN');
  const [message, setMessage] = useState(
    'Unit available. Start the auxiliary oil pump or use Auto Start.'
  );
  const [simulation, setSimulation] = useState<Simulation>(INITIAL_SIMULATION);

  const breakerClosed = breakerState === 'CLOSED';
  const autoSyncArmed = breakerState === 'ARMED';

  const controlsRef = useRef<Controls>({
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
  });

  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const previousPhaseRef = useRef(0);
  const protectionRef = useRef<{
    reason: string | null;
    since: number | null;
    turbineTrip: boolean;
  }>({ reason: null, since: null, turbineTrip: false });

  const patchControls = useCallback((patch: Partial<Controls>) => {
    controlsRef.current = { ...controlsRef.current, ...patch };
  }, []);

  const setSequenceStep = useCallback(
    (nextStep: Step) => {
      setStartupStep(nextStep);
      patchControls({ startupStep: nextStep });
    },
    [patchControls]
  );

  useEffect(() => {
    controlsRef.current = {
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

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (previousTimeRef.current === null) previousTimeRef.current = timestamp;
      const frameDelta = clamp((timestamp - previousTimeRef.current) / 1000, 0, 0.05);
      previousTimeRef.current = timestamp;

      if (controlsRef.current.running) {
        accumulatorRef.current += frameDelta;
        let iterations = 0;
        while (accumulatorRef.current >= 1 / 60 && iterations < 4) {
          setSimulation((previous) =>
            calculateNextState(previous, controlsRef.current, 1 / 60)
          );
          accumulatorRef.current -= 1 / 60;
          iterations += 1;
        }
      } else {
        accumulatorRef.current = 0;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      previousTimeRef.current = null;
    };
  }, []);

  const frequencyError = Math.abs(simulation.generatedFrequency - GRID_FREQUENCY_HZ);
  const voltageError =
    (Math.abs(simulation.generatedVoltage - RATED_VOLTAGE_V) / RATED_VOLTAGE_V) * 100;
  const phaseError = Math.abs(simulation.phase);
  const speedReady = simulation.rpm >= 3565 && simulation.rpm <= 3640;
  const frequencyReady = frequencyError <= 0.14;
  const voltageReady = voltageError <= 5;
  const phaseReady = phaseError <= 9;
  const accelerationReady = Math.abs(simulation.acceleration) <= 0.75;
  const oilReady = simulation.oilPressure >= 2.25;
  const fieldReady = simulation.field >= 95;
  const casingWarm = simulation.casingTemperature >= 135;
  const synchronizationBaseReady =
    !tripActive &&
    breakerState !== 'TRIPPED' &&
    !breakerClosed &&
    mode === 'AUTO' &&
    speedReady &&
    frequencyReady &&
    voltageReady &&
    accelerationReady &&
    oilReady &&
    fieldReady;
  const synchronizationReady = synchronizationBaseReady && phaseReady;

  const openBreaker = useCallback(
    (reason = 'BRK-101 opened manually.') => {
      setBreakerState('OPEN');
      setMessage(reason);
      patchControls({ breakerClosed: false, autoSyncArmed: false });
      protectionRef.current = { reason: null, since: null, turbineTrip: false };
    },
    [patchControls]
  );

  const tripUnit = useCallback(
    (reason: string, turbineTrip: boolean) => {
      setBreakerState('TRIPPED');
      setMessage(reason);
      patchControls({ breakerClosed: false, autoSyncArmed: false });

      if (turbineTrip) {
        setTripActive(true);
        setAutoStart(false);
        setSequenceStep('ABORTED');
        patchControls({ tripActive: true, autoStart: false });
      }
    },
    [patchControls, setSequenceStep]
  );

  const closeBreaker = useCallback(
    (source: 'MANUAL' | 'AUTO') => {
      if (
        !synchronizationReady ||
        tripActive ||
        breakerClosed
      ) {
        return;
      }

      setMode('AUTO');
      setBreakerState('CLOSED');
      setMessage(
        source === 'AUTO'
          ? 'BRK-101 closed automatically at synchronism.'
          : 'BRK-101 closed manually at synchronism.'
      );
      patchControls({
        mode: 'AUTO',
        breakerClosed: true,
        autoSyncArmed: false,
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

  const armAutoSync = useCallback(() => {
    if (tripActive || breakerClosed || breakerState === 'TRIPPED') return;
    setMode('AUTO');
    setSpeedSetpoint(100);
    setBreakerState('ARMED');
    setMessage('Auto-sync armed: matching speed, voltage and phase.');
    patchControls({
      mode: 'AUTO',
      speedSetpoint: 100,
      breakerClosed: false,
      autoSyncArmed: true,
    });
    previousPhaseRef.current = simulation.phase;
  }, [tripActive, breakerClosed, breakerState, patchControls, simulation.phase]);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    const currentPhase = simulation.phase;
    const zeroCrossing =
      (previousPhase < 0 &&
        currentPhase >= 0 &&
        Math.abs(previousPhase) <= 35 &&
        Math.abs(currentPhase) <= 35) ||
      (previousPhase > 0 &&
        currentPhase <= 0 &&
        Math.abs(previousPhase) <= 35 &&
        Math.abs(currentPhase) <= 35);
    previousPhaseRef.current = currentPhase;

    if (
      breakerState === 'ARMED' &&
      synchronizationBaseReady &&
      (zeroCrossing || Math.abs(currentPhase) <= 9)
    ) {
      closeBreaker('AUTO');
    }
  }, [breakerState, synchronizationBaseReady, simulation.phase, closeBreaker]);

  useEffect(() => {
    if (!autoStart || tripActive) return;

    if (startupStep === 'OIL' && simulation.oilPressure >= 2.35) {
      setSequenceStep('TURNING');
      setMessage('Oil pressure established. Engaging turning gear.');
    } else if (startupStep === 'TURNING' && simulation.rpm >= 4.5) {
      setSequenceStep('WARMING');
      setMessage('Turning gear established. Warming turbine casing.');
    } else if (startupStep === 'WARMING' && casingWarm) {
      setSequenceStep('ROLLING');
      setMessage('Casing warm. Releasing turning gear and rolling turbine.');
    } else if (startupStep === 'ROLLING' && simulation.rpm >= 520) {
      setSequenceStep('ACCELERATING');
      setMessage('Turbine rolling. Accelerating through the speed range.');
    } else if (
      startupStep === 'ACCELERATING' &&
      simulation.rpm >= 3520 &&
      Math.abs(simulation.acceleration) <= 1.2
    ) {
      setSequenceStep('EXCITATION');
      setMessage('Rated speed reached. Applying generator field.');
    } else if (
      startupStep === 'EXCITATION' &&
      fieldReady &&
      voltageError <= 10
    ) {
      setSequenceStep('SYNCHRONIZING');
      setBreakerState('ARMED');
      patchControls({ autoSyncArmed: true });
      setMessage('Generator excited. Auto-synchronizing BRK-101.');
      previousPhaseRef.current = simulation.phase;
    } else if (startupStep === 'SYNCHRONIZING' && breakerClosed) {
      setSequenceStep('ONLINE');
      setMessage('Unit synchronized. Generator loading ramp enabled.');
    }
  }, [
    autoStart,
    tripActive,
    startupStep,
    simulation.oilPressure,
    simulation.rpm,
    simulation.acceleration,
    simulation.phase,
    casingWarm,
    fieldReady,
    voltageError,
    breakerClosed,
    setSequenceStep,
    patchControls,
  ]);

  useEffect(() => {
    if (!tripActive && simulation.rpm >= OVERSPEED_TRIP_RPM) {
      tripUnit(
        'Overspeed trip: TV-101 and GV-101 closing; BRK-101 tripped.',
        true
      );
    }
  }, [simulation.rpm, tripActive, tripUnit]);

  useEffect(() => {
    if (!breakerClosed) {
      protectionRef.current = { reason: null, since: null, turbineTrip: false };
      return;
    }

    let reason: string | null = null;
    let turbineTrip = false;

    if (simulation.oilPressure < 1.25) {
      reason = 'Low lube-oil pressure trip.';
      turbineTrip = true;
    } else if (simulation.rpm < 3450 || simulation.rpm > 3750) {
      reason = 'Abnormal shaft-speed trip.';
      turbineTrip = true;
    } else if (simulation.gridImport > 18) {
      reason = 'Reverse-power trip: generator motoring detected.';
    } else if (Math.max(simulation.vibrationX, simulation.vibrationY) > 4.5) {
      reason = 'High bearing vibration trip.';
      turbineTrip = true;
    } else if (Math.abs(simulation.axialDisplacement) > 0.35) {
      reason = 'High axial displacement trip.';
      turbineTrip = true;
    }

    if (!reason) {
      protectionRef.current = { reason: null, since: null, turbineTrip: false };
      return;
    }

    const now = performance.now();
    if (
      protectionRef.current.reason !== reason ||
      protectionRef.current.since === null
    ) {
      protectionRef.current = { reason, since: now, turbineTrip };
      return;
    }

    if (now - protectionRef.current.since >= 900) {
      tripUnit(reason, protectionRef.current.turbineTrip);
    }
  }, [
    breakerClosed,
    simulation.oilPressure,
    simulation.rpm,
    simulation.gridImport,
    simulation.vibrationX,
    simulation.vibrationY,
    simulation.axialDisplacement,
    tripUnit,
  ]);

  function startAutomaticSequence() {
    if (tripActive || breakerState === 'TRIPPED') return;
    setAutoStart(true);
    setSequenceStep('OIL');
    setMode('AUTO');
    setBreakerState('OPEN');
    setMessage('Auto start initiated: starting auxiliary oil pump.');
    patchControls({
      autoStart: true,
      mode: 'AUTO',
      breakerClosed: false,
      autoSyncArmed: false,
    });
  }

  function abortAutomaticSequence() {
    setAutoStart(false);
    setSequenceStep('ABORTED');
    setMainStopValveOpen(false);
    setManualGovernorValve(0);
    setExcitation(0);
    patchControls({
      autoStart: false,
      mainStopValveOpen: false,
      manualGovernorValve: 0,
      excitation: 0,
    });

    if (breakerState === 'CLOSED' || breakerState === 'ARMED') {
      openBreaker('Auto start aborted; BRK-101 opened.');
    } else {
      setMessage('Auto start aborted. Steam valves commanded closed.');
    }
  }

  function resetTrip() {
    setTripActive(false);
    setBreakerState('OPEN');
    setAutoStart(false);
    setSequenceStep('IDLE');
    setMode('MANUAL');
    setMainStopValveOpen(false);
    setManualGovernorValve(0);
    setSpeedSetpoint(0);
    setExcitation(0);
    setLoadDemand(0);
    setMessage('Trip reset. Valves closed and breaker open.');
    patchControls({
      tripActive: false,
      breakerClosed: false,
      autoSyncArmed: false,
      autoStart: false,
      mode: 'MANUAL',
      mainStopValveOpen: false,
      manualGovernorValve: 0,
      speedSetpoint: 0,
      excitation: 0,
      loadDemand: 0,
    });
  }

  function resetUnit() {
    setSimulation(INITIAL_SIMULATION);
    setRunning(true);
    setMode('MANUAL');
    setOilPump(false);
    setTurningGear(false);
    setMainStopValveOpen(false);
    setManualGovernorValve(0);
    setSpeedSetpoint(100);
    setLoadDemand(40);
    setExcitation(100);
    setAutoStart(false);
    setStartupStep('IDLE');
    setTripActive(false);
    setBreakerState('OPEN');
    setMessage('Unit reset. Start auxiliary oil pump or Auto Start.');
    controlsRef.current = {
      running: true,
      mode: 'MANUAL',
      oilPump: false,
      turningGear: false,
      mainStopValveOpen: false,
      manualGovernorValve: 0,
      speedSetpoint: 100,
      loadDemand: 40,
      excitation: 100,
      autoStart: false,
      startupStep: 'IDLE',
      tripActive: false,
      breakerClosed: false,
      autoSyncArmed: false,
    };
    previousTimeRef.current = null;
    accumulatorRef.current = 0;
    previousPhaseRef.current = 0;
    protectionRef.current = { reason: null, since: null, turbineTrip: false };
  }

  const shaftY = 438;
  const stagePositions = [
    { stator: 675, rotor: 770 },
    { stator: 900, rotor: 1000 },
    { stator: 1140, rotor: 1250 },
  ];
  const flowFraction = clamp(simulation.turbineFlow / 2.1, 0, 1);
  const steamOpacity = flowFraction <= 0.001 ? 0 : 0.18 + 0.72 * flowFraction;
  const exhaustOpacity = flowFraction <= 0.001 ? 0 : 0.12 + 0.58 * flowFraction;
  const steamDuration = clamp(2.5 - 1.45 * flowFraction, 0.65, 2.5);
  const stageVisuals = simulation.stages.map((stage, index) => ({
    stage,
    outer: clamp(66 + stage.bladeHeight * 650, 96, 190),
    hub: [45, 52, 60][index],
  }));
  const shaftSurfaceMarks = [0, 120, 240].map((offset) => {
    const phase = ((simulation.angle + offset) * Math.PI) / 180;
    const front = Math.max(Math.cos(phase), 0);
    return {
      y: shaftY + Math.sin(phase) * 12,
      xOffset: Math.cos(phase) * 16,
      opacity: 0.16 + 0.72 * front,
      width: 1.4 + 2.2 * front,
    };
  });

  const steamSegments = [
    'M 595 414 C 625 390 650 372 680 360',
    'M 690 360 C 724 374 748 398 775 420',
    'M 795 420 C 838 388 870 366 905 350',
    'M 915 350 C 955 370 978 404 1005 430',
    'M 1025 430 C 1070 390 1104 360 1145 338',
    'M 1155 338 C 1198 365 1227 410 1255 447',
    'M 1275 447 C 1340 458 1395 492 1460 548',
  ];

  const unitStatus = tripActive
    ? 'TURBINE / GENERATOR TRIPPED'
    : breakerClosed
      ? 'GENERATOR ONLINE'
      : autoStart
        ? `AUTO START — ${startupStep}`
        : simulation.rpm < 0.5
          ? 'STANDBY'
          : mode === 'AUTO'
            ? 'AUTOMATIC SPEED CONTROL'
            : 'MANUAL GOVERNOR CONTROL';

  const generatorStatus =
    simulation.rpm < 0.5
      ? 'STOPPED'
      : simulation.field < 5
        ? simulation.rpm < 30
          ? 'TURNING GEAR — FIELD OFF'
          : 'ROTOR TURNING — FIELD OFF'
        : breakerClosed
          ? 'ONLINE — EXPORTING POWER'
          : simulation.generatedVoltage > 50
            ? 'EXCITED — BREAKER OPEN'
            : 'VOLTAGE BUILDING';

  const sequenceSteps: Step[] = [
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
    '--steam-duration': `${steamDuration}s`,
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="rtv3" style={cssVariables}>
      <style>{`
        .rtv3,.rtv3 *{box-sizing:border-box}.rtv3{min-height:100vh;padding:14px;color:#172033;background:#e8eef5;font-family:Inter,system-ui,sans-serif}.rtv3 .shell{max-width:1980px;margin:auto;overflow:hidden;border:1px solid #cbd5e1;border-radius:18px;background:#fff;box-shadow:0 18px 46px rgba(15,23,42,.14)}.rtv3 .header{padding:16px;border-bottom:1px solid #d8e0ea;background:linear-gradient(#fbfdff,#f1f5f9)}.rtv3 .topbar{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}.rtv3 .title{margin:0;color:#172554;font-size:25px;font-weight:950}.rtv3 .subtitle{margin:7px 0 0;color:#607087;font-size:13px}.rtv3 .buttons{display:flex;gap:7px;flex-wrap:wrap}.rtv3 button{font-family:inherit}.rtv3 .button{border:0;border-radius:8px;padding:9px 12px;color:#fff;font-size:12px;font-weight:850;cursor:pointer}.rtv3 .button:disabled,.rtv3 .toggle:disabled{opacity:.38;cursor:not-allowed}.rtv3 .blue{background:#1d4ed8}.rtv3 .cyan{background:#0891b2}.rtv3 .green{background:#059669}.rtv3 .amber{background:#d97706}.rtv3 .red{background:#dc2626}.rtv3 .slate{background:#475569}.rtv3 .light{color:#334155;background:#fff;border:1px solid #cbd5e1}.rtv3 .controls{display:grid;grid-template-columns:repeat(7,minmax(145px,1fr));gap:10px;margin-top:14px}.rtv3 .control{padding:10px;border:1px solid #d7e0ea;border-radius:10px;background:#fff}.rtv3 .control-title,.rtv3 .control label{display:flex;justify-content:space-between;gap:10px;margin-bottom:8px;color:#526178;font-size:9px;font-weight:900;text-transform:uppercase}.rtv3 .control input[type=range]{width:100%;accent-color:#2563eb}.rtv3 .toggle-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.rtv3 .toggle{padding:8px;border:1px solid #cbd5e1;border-radius:7px;color:#475569;background:#fff;font-size:10px;font-weight:850;cursor:pointer}.rtv3 .toggle.active{color:#fff;background:#1d4ed8}.rtv3 .toggle.safe.active{background:#059669}.rtv3 .toggle.warning.active{background:#d97706}.rtv3 .message{margin-top:11px;padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;color:#415168;background:#fff;font-size:12px;font-weight:750}.rtv3 .layout{display:grid;grid-template-columns:minmax(0,1fr) 455px}.rtv3 .machine{overflow:auto;border-right:1px solid #d8e0ea;background:#f8fafc}.rtv3 .machine svg{display:block;width:100%;min-width:1380px}.rtv3 .sidebar{max-height:1200px;overflow:auto;padding:14px;background:#f5f8fb}.rtv3 .card,.rtv3 .status{margin-bottom:11px;padding:12px;border:1px solid #d7e0ea;border-radius:11px;background:#fff}.rtv3 .status.online{border-color:#86efac;background:#f0fdf4}.rtv3 .status.sync{border-color:#67e8f9;background:#ecfeff}.rtv3 .status.trip{border-color:#fca5a5;background:#fef2f2}.rtv3 .eyebrow,.rtv3 .card h3{margin:0 0 8px;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase}.rtv3 .statusValue{font-family:monospace;font-size:18px;font-weight:900}.rtv3 .statusSub{margin-top:5px;color:#526178;font-size:11px;font-weight:700}.rtv3 .sequence{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.rtv3 .sequenceStep{padding:7px 5px;border:1px solid #dbe3ec;border-radius:7px;color:#64748b;background:#f8fafc;text-align:center;font-size:8px;font-weight:900}.rtv3 .sequenceStep.active{border-color:#2563eb;color:#1d4ed8;background:#dbeafe}.rtv3 .sequenceStep.complete{border-color:#86efac;color:#047857;background:#f0fdf4}.rtv3 .syncLayout{display:grid;grid-template-columns:155px 1fr;gap:10px;align-items:center}.rtv3 .syncDial{width:100%}.rtv3 .checks{display:grid;gap:5px;color:#64748b;font-size:11px}.rtv3 .ok{color:#047857;font-weight:850}.rtv3 .lampGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px}.rtv3 .lampRow{display:flex;align-items:center;gap:7px;color:#526178;font-size:10px;font-weight:750}.rtv3 .lamp{width:10px;height:10px;border:1px solid #64748b;border-radius:50%;background:#cbd5e1}.rtv3 .lamp.on{background:#22c55e;box-shadow:0 0 9px rgba(34,197,94,.67)}.rtv3 .lamp.danger{background:#ef4444;box-shadow:0 0 9px rgba(239,68,68,.67)}.rtv3 .stage{margin-top:7px;padding:8px;border:1px solid #e1e7ef;border-radius:8px;background:#f8fafc}.rtv3 .stageHead{display:flex;justify-content:space-between;font-size:12px;font-weight:900}.rtv3 .stageGrid{display:grid;grid-template-columns:1fr 1fr;gap:3px 8px;margin-top:5px;color:#58677d;font-size:10px}.rtv3 .metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rtv3 .metric{padding:9px;border:1px solid #d7e0ea;border-radius:9px;background:#fff}.rtv3 .metric.good{border-color:#86efac;background:#f0fdf4}.rtv3 .metric.warning{border-color:#fca5a5;background:#fef2f2}.rtv3 .metric small{display:block;color:#1d4ed8;font-size:8px;font-weight:950}.rtv3 .metric em{display:block;margin-top:2px;color:#64748b;font-size:8px;font-style:normal;font-weight:900;text-transform:uppercase}.rtv3 .metric b{display:block;margin-top:4px;font-family:monospace;font-size:15px}.rtv3 .metric span{margin-left:4px;color:#64748b;font-size:9px}@keyframes steamFlowAnimation{from{stroke-dashoffset:110}to{stroke-dashoffset:0}}@keyframes electricalFlowAnimation{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}.rtv3 .steamFlow{stroke-dasharray:20 14;animation:steamFlowAnimation var(--steam-duration) linear infinite}.rtv3 .electricFlow{stroke-dasharray:18 12;animation:electricalFlowAnimation 1s linear infinite}.rtv3 .paused .steamFlow,.rtv3 .paused .electricFlow{animation-play-state:paused}@media(max-width:1540px){.rtv3 .controls{grid-template-columns:repeat(4,1fr)}}@media(max-width:1280px){.rtv3 .layout{grid-template-columns:1fr}.rtv3 .machine{border-right:0}.rtv3 .sidebar{max-height:none}}@media(max-width:760px){.rtv3{padding:6px}.rtv3 .controls,.rtv3 .metrics,.rtv3 .syncLayout{grid-template-columns:1fr}}
      `}</style>

      <div className="shell">
        <header className="header">
          <div className="topbar">
            <div>
              <h1 className="title">ReactionTurbineV3Industrial</h1>
              <p className="subtitle">
                Realistic industrial cutaway, corrected rotor torque, visible shaft motion,
                dynamic steam chest, startup sequence and generator synchronization.
              </p>
            </div>
            <div className="buttons">
              <button className="button blue" type="button" onClick={() => setRunning((v) => !v)}>
                {running ? 'Pause' : 'Start'}
              </button>
              <button
                className="button green"
                type="button"
                disabled={autoStart || tripActive || breakerState === 'TRIPPED'}
                onClick={startAutomaticSequence}
              >
                Auto Start
              </button>
              <button
                className="button amber"
                type="button"
                disabled={!autoStart}
                onClick={abortAutomaticSequence}
              >
                Abort Auto
              </button>
              <button
                className="button cyan"
                type="button"
                disabled={tripActive || breakerClosed || breakerState === 'TRIPPED'}
                onClick={() =>
                  autoSyncArmed
                    ? openBreaker('Auto-sync cancelled; BRK-101 open.')
                    : armAutoSync()
                }
              >
                {autoSyncArmed ? 'Cancel Auto Sync' : 'Arm Auto Sync'}
              </button>
              <button
                className="button green"
                type="button"
                disabled={!synchronizationReady || tripActive || breakerClosed}
                onClick={() => closeBreaker('MANUAL')}
              >
                Close BRK-101
              </button>
              <button
                className="button slate"
                type="button"
                disabled={breakerState === 'OPEN' || breakerState === 'TRIPPED'}
                onClick={() => openBreaker()}
              >
                Open BRK-101
              </button>
              <button
                className="button red"
                type="button"
                onClick={() => tripUnit('Emergency trip: valves closing and breaker tripped.', true)}
              >
                Emergency Trip
              </button>
              {(tripActive || breakerState === 'TRIPPED') && (
                <button className="button light" type="button" onClick={resetTrip}>
                  Reset Trip
                </button>
              )}
              <button className="button light" type="button" onClick={resetUnit}>
                Reset Unit
              </button>
            </div>
          </div>

          <div className="controls">
            <ControlToggle
              title="Aux oil pump"
              status={simulation.oilPumpRunning ? 'RUNNING' : 'OFF'}
              left="START"
              right="STOP"
              leftActive={oilPump}
              rightActive={!oilPump}
              leftDisabled={autoStart || tripActive}
              rightDisabled={autoStart || tripActive || simulation.rpm > 50}
              onLeft={() => setOilPump(true)}
              onRight={() => setOilPump(false)}
            />
            <ControlToggle
              title="Turning gear"
              status={simulation.turningGearEngaged ? 'ENGAGED' : 'OFF'}
              left="ENGAGE"
              right="RELEASE"
              leftActive={turningGear}
              rightActive={!turningGear}
              leftDisabled={
                autoStart ||
                tripActive ||
                !oilPump ||
                simulation.rpm > 20 ||
                mainStopValveOpen
              }
              rightDisabled={autoStart}
              onLeft={() => setTurningGear(true)}
              onRight={() => setTurningGear(false)}
              warning
            />
            <ControlToggle
              title="TV-101 main stop"
              status={
                simulation.mainStopValve > 0.98
                  ? 'OPEN'
                  : simulation.mainStopValve < 0.02
                    ? 'CLOSED'
                    : 'MOVING'
              }
              left="OPEN"
              right="CLOSE"
              leftActive={mainStopValveOpen}
              rightActive={!mainStopValveOpen}
              leftDisabled={
                autoStart ||
                tripActive ||
                !oilPump ||
                simulation.oilPressure < 2.1 ||
                turningGear
              }
              rightDisabled={autoStart}
              onLeft={() => setMainStopValveOpen(true)}
              onRight={() => setMainStopValveOpen(false)}
            />
            <ControlToggle
              title="Governor mode"
              status={mode}
              left="MANUAL"
              right="AUTO"
              leftActive={mode === 'MANUAL'}
              rightActive={mode === 'AUTO'}
              leftDisabled={autoStart || breakerClosed || tripActive}
              rightDisabled={tripActive}
              onLeft={() => setMode('MANUAL')}
              onRight={() => setMode('AUTO')}
            />
            <div className="control">
              <label>
                <span>{mode === 'MANUAL' ? 'GV-101 position' : 'Speed setpoint'}</span>
                <span>{mode === 'MANUAL' ? manualGovernorValve : speedSetpoint}%</span>
              </label>
              <input
                type="range"
                min="0"
                max={mode === 'MANUAL' ? 100 : 105}
                value={mode === 'MANUAL' ? manualGovernorValve : speedSetpoint}
                disabled={autoStart || tripActive || (mode === 'AUTO' && breakerClosed)}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (mode === 'MANUAL') setManualGovernorValve(value);
                  else setSpeedSetpoint(value);
                }}
              />
            </div>
            <div className="control">
              <label>
                <span>AVR excitation</span>
                <span>{excitation}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="120"
                value={excitation}
                disabled={tripActive || (autoStart && startupStep !== 'ONLINE')}
                onChange={(event) => setExcitation(Number(event.target.value))}
              />
            </div>
            <div className="control">
              <label>
                <span>Load demand</span>
                <span>{loadDemand}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={loadDemand}
                disabled={tripActive || !breakerClosed}
                onChange={(event) => setLoadDemand(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="message">{message}</div>
        </header>

        <div className="layout">
          <main className="machine">
            <svg
              className={running ? '' : 'paused'}
              viewBox="0 0 2220 900"
              role="img"
              aria-label="Industrial three-stage Parsons reaction turbine generator"
            >
              <defs>
                <marker id={ids.steamArrow} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill="#59bfe6" />
                </marker>
                <marker id={ids.electricArrow} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill="#059669" />
                </marker>
                <marker id={ids.oilArrow} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                  <path d="M0 0 L9 4.5 L0 9 Z" fill="#b45309" />
                </marker>
                <linearGradient id={ids.steel} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f1f4f7" />
                  <stop offset="38%" stopColor="#a9b4c0" />
                  <stop offset="72%" stopColor="#d9dee3" />
                  <stop offset="100%" stopColor="#667483" />
                </linearGradient>
                <linearGradient id={ids.steelDark} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#697789" />
                  <stop offset="100%" stopColor="#263446" />
                </linearGradient>
                <linearGradient id={ids.machined} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="29%" stopColor="#a8b4c0" />
                  <stop offset="54%" stopColor="#526170" />
                  <stop offset="76%" stopColor="#e8edf1" />
                  <stop offset="100%" stopColor="#596676" />
                </linearGradient>
                <linearGradient id={ids.rotorDrum} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dce3ea" />
                  <stop offset="38%" stopColor="#667486" />
                  <stop offset="70%" stopColor="#eef2f6" />
                  <stop offset="100%" stopColor="#4b5968" />
                </linearGradient>
                <linearGradient id={ids.copper} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffd27e" />
                  <stop offset="50%" stopColor="#c56a20" />
                  <stop offset="100%" stopColor="#7c3f12" />
                </linearGradient>
                <linearGradient id={ids.steam} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e4f9ff" stopOpacity="0.75" />
                  <stop offset="52%" stopColor="#82cfe9" stopOpacity="0.36" />
                  <stop offset="100%" stopColor="#55a9c8" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id={ids.exhaustSteam} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dff7ff" stopOpacity="0.58" />
                  <stop offset="65%" stopColor="#75c5e1" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#4b9fbd" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id={ids.oil} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#64748b" floodOpacity="0.28" />
                </filter>
                <filter id={ids.steamGlow} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <clipPath id={ids.casingClip}>
                  <path d="M575 182 C730 105 1215 105 1360 185 L1470 280 L1470 610 L1360 675 C1115 730 760 725 575 635 Z" />
                </clipPath>
                <clipPath id={ids.exhaustClip}>
                  <path d="M1260 220 C1390 220 1510 275 1595 370 L1595 650 C1475 705 1360 715 1240 660 Z" />
                </clipPath>
                <clipPath id={ids.shaftClip}>
                  <rect x="555" y={shaftY - 31} width="1280" height="62" rx="8" />
                </clipPath>
                <clipPath id={ids.generatorEndClip}>
                  <circle cx="2040" cy={shaftY} r="72" />
                </clipPath>
              </defs>

              <rect width="2220" height="900" fill="#ffffff" />
              <text x="1110" y="42" textAnchor="middle" fontSize="31" fontWeight="950" fill="#172554">
                INDUSTRIAL THREE-STAGE PARSONS REACTION TURBINE–GENERATOR
              </text>
              <text x="1110" y="68" textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b">
                50% REACTION • DYNAMIC STEAM CHEST • DUAL BEARINGS • TURNING GEAR • GRID SYNCHRONIZATION
              </text>

              <path
                d="M35 752 L2160 752 L2190 794 L2190 830 L18 830 L18 794 Z"
                fill={`url(#${ids.steel})`}
                stroke="#465466"
                strokeWidth="4"
                filter={`url(#${ids.shadow})`}
              />
              <rect x="80" y="770" width="2040" height="18" fill="#687481" stroke="#334155" strokeWidth="2" />

              <g filter={`url(#${ids.shadow})`}>
                <ellipse cx="74" cy={shaftY} rx="42" ry="72" fill={`url(#${ids.steel})`} stroke="#465466" strokeWidth="4" />
                <ellipse cx="74" cy={shaftY} rx="23" ry="54" fill="#37748c" stroke="#465466" strokeWidth="3" />
                <path
                  d={`M74 ${shaftY - 54} L225 ${shaftY - 54} C270 ${shaftY - 54} 300 ${shaftY - 30} 328 ${shaftY} C300 ${shaftY + 30} 270 ${shaftY + 54} 225 ${shaftY + 54} L74 ${shaftY + 54} Z`}
                  fill="#3c7890"
                  stroke="#465466"
                  strokeWidth="4"
                />
                {[-24, 0, 24].map((offset, index) => (
                  <path
                    key={offset}
                    d={`M90 ${shaftY + offset} C150 ${shaftY + offset} 235 ${shaftY + offset * 0.7} 310 ${shaftY + offset * 0.35}`}
                    fill="none"
                    stroke={index === 1 ? '#e9fbff' : '#72c7e5'}
                    strokeWidth={index === 1 ? 3.6 : 2.4}
                    opacity={steamOpacity}
                    className="steamFlow"
                  />
                ))}
              </g>

              <ValveBody
                x={295}
                shaftY={shaftY}
                opening={simulation.mainStopValve}
                label="TV-101 MAIN STOP VALVE"
                ids={ids}
                trip={tripActive}
              />
              <ValveBody
                x={394}
                shaftY={shaftY}
                opening={simulation.governorValve}
                label="GV-101 GOVERNOR VALVE"
                ids={ids}
                trip={tripActive}
                compact
              />

              <g filter={`url(#${ids.shadow})`}>
                <path d="M470 330 L545 296 L585 332 L585 528 L545 562 L470 528 Z" fill={`url(#${ids.steel})`} stroke="#465466" strokeWidth="4" />
                <path d="M492 350 L538 331 L561 352 L561 508 L538 529 L492 510 Z" fill="#315f74" stroke="#334155" strokeWidth="3" />
                <ellipse cx="528" cy={shaftY} rx="35" ry="74" fill={`url(#${ids.steam})`} opacity={0.18 + steamOpacity * 0.52} />
                <text x="528" y="600" textAnchor="middle" fontSize="11" fontWeight="900">STEAM CHEST</text>
              </g>

              <path
                d="M575 182 C730 105 1215 105 1360 185 L1470 280 L1470 610 L1360 675 C1115 730 760 725 575 635 Z"
                fill={`url(#${ids.steel})`}
                stroke="#465466"
                strokeWidth="5"
                filter={`url(#${ids.shadow})`}
              />
              <path
                d="M610 222 C755 160 1195 150 1330 212 L1430 300 L1430 575 L1330 635 C1100 680 790 675 610 610 Z"
                fill="#202832"
                stroke="#657487"
                strokeWidth="3"
              />

              <path d="M605 330 C850 305 1200 310 1435 350" fill="none" stroke={`url(#${ids.steel})`} strokeWidth="18" />
              <path d="M605 330 C850 305 1200 310 1435 350" fill="none" stroke="#667484" strokeWidth="3" />
              {[655, 790, 925, 1060, 1195, 1330, 1410].map((x) => (
                <circle key={x} cx={x} cy={322 + (x - 655) * 0.027} r="7" fill="#d8dde3" stroke="#465466" strokeWidth="2" />
              ))}

              <g clipPath={`url(#${ids.casingClip})`}>
                <path
                  d="M595 290 C760 215 1215 205 1460 305 L1460 625 C1175 705 760 665 595 530 Z"
                  fill={`url(#${ids.steam})`}
                  opacity={steamOpacity * 0.52}
                  filter={`url(#${ids.steamGlow})`}
                />
                {steamSegments.map((segment, index) => (
                  <g key={segment}>
                    {[-18, 0, 18].map((offset, lineIndex) => (
                      <path
                        key={offset}
                        d={segment}
                        transform={`translate(0 ${offset})`}
                        fill="none"
                        stroke={lineIndex === 1 ? '#eafcff' : '#70c7e6'}
                        strokeWidth={lineIndex === 1 ? 3.5 : 2}
                        strokeLinecap="round"
                        markerEnd={lineIndex === 1 ? `url(#${ids.steamArrow})` : undefined}
                        opacity={steamOpacity * (lineIndex === 1 ? 1 : 0.72)}
                        className="steamFlow"
                        style={{ animationDelay: `${-(index * 0.17 + lineIndex * 0.11)}s` }}
                      />
                    ))}
                  </g>
                ))}
              </g>

              <path
                d={`M700 ${shaftY - 48} L1280 ${shaftY - 80} L1280 ${shaftY + 80} L700 ${shaftY + 48} Z`}
                fill={`url(#${ids.rotorDrum})`}
                stroke="#334155"
                strokeWidth="4"
              />
              <rect x="570" y={shaftY - 21} width="1260" height="42" rx="7" fill={`url(#${ids.machined})`} stroke="#334155" strokeWidth="4" />
              <g clipPath={`url(#${ids.shaftClip})`}>
                {shaftSurfaceMarks.map((mark, index) => (
                  <path
                    key={index}
                    d={`M ${590 + mark.xOffset} ${mark.y - 3} L ${1810 + mark.xOffset} ${mark.y + 3}`}
                    fill="none"
                    stroke={index === 0 ? '#ffffff' : '#334155'}
                    strokeWidth={mark.width}
                    strokeLinecap="round"
                    opacity={mark.opacity}
                  />
                ))}
              </g>

              <Bearing x={615} shaftY={shaftY} label="FRONT JOURNAL" angle={simulation.angle} ids={ids} />

              {stagePositions.map((position, index) => {
                const visual = stageVisuals[index];
                return (
                  <g key={index}>
                    <BladeRow
                      x={position.stator}
                      shaftY={shaftY}
                      outer={visual.outer}
                      hub={visual.hub}
                      moving={false}
                      angle={0}
                      stageNumber={index + 1}
                      ids={ids}
                    />
                    <BladeRow
                      x={position.rotor}
                      shaftY={shaftY}
                      outer={visual.outer + 4}
                      hub={visual.hub + 3}
                      moving
                      angle={simulation.angle + index * 57}
                      stageNumber={index + 1}
                      ids={ids}
                    />
                    {index < 2 && (
                      <g>
                        <rect
                          x={position.rotor + 44}
                          y={shaftY - 31}
                          width="18"
                          height="62"
                          fill="#8d99a7"
                          stroke="#334155"
                          strokeWidth="2"
                        />
                        {[0, 1, 2, 3].map((seal) => (
                          <line
                            key={seal}
                            x1={position.rotor + 47 + seal * 4}
                            y1={shaftY - 28}
                            x2={position.rotor + 47 + seal * 4}
                            y2={shaftY + 28}
                            stroke="#e2e8f0"
                            strokeWidth="2"
                          />
                        ))}
                      </g>
                    )}
                  </g>
                );
              })}

              <g>
                <path
                  d="M1260 220 C1390 215 1518 275 1605 375 L1605 650 C1480 715 1350 725 1235 662 Z"
                  fill={`url(#${ids.steel})`}
                  stroke="#465466"
                  strokeWidth="5"
                />
                <path
                  d="M1295 260 C1400 260 1495 312 1560 395 L1560 615 C1465 667 1365 680 1270 640 Z"
                  fill="#2d5f74"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <g clipPath={`url(#${ids.exhaustClip})`}>
                  <path
                    d="M1270 278 C1400 285 1510 340 1585 420 L1585 638 C1475 695 1365 700 1255 660 Z"
                    fill={`url(#${ids.exhaustSteam})`}
                    opacity={exhaustOpacity}
                    filter={`url(#${ids.steamGlow})`}
                  />
                  {[-88, -44, 0, 44, 88].map((offset, index) => (
                    <path
                      key={offset}
                      d={`M1265 ${shaftY + offset * 1.35} C1375 ${shaftY + offset * 1.58} 1475 ${shaftY + offset * 1.82} 1580 ${shaftY + offset * 2.02}`}
                      fill="none"
                      stroke={index === 2 ? '#e5f9ff' : '#7bcbe7'}
                      strokeWidth={index === 2 ? 3.8 : 2.4}
                      opacity={exhaustOpacity * (1 - Math.abs(index - 2) * 0.08)}
                      className="steamFlow"
                    />
                  ))}
                </g>
                <path d="M1300 610 L1492 610 L1540 754 L1250 754 Z" fill={`url(#${ids.steel})`} stroke="#465466" strokeWidth="4" />
                <path d="M1325 627 L1468 627 L1504 733 L1287 733 Z" fill="#37748c" stroke="#334155" strokeWidth="3" />
                <text x="1395" y="782" textAnchor="middle" fontSize="11" fontWeight="900">CONDENSER EXHAUST</text>
              </g>

              <g filter={`url(#${ids.shadow})`}>
                <rect x="1595" y={shaftY - 62} width="98" height="124" rx="14" fill={`url(#${ids.steel})`} stroke="#465466" strokeWidth="4" />
                <rect x="1609" y={shaftY - 17} width="70" height="34" fill={`url(#${ids.machined})`} stroke="#334155" strokeWidth="2" />
                {[1621, 1634, 1647, 1660, 1673].map((x, index) => (
                  <g key={x}>
                    <rect x={x} y={index % 2 ? shaftY - 40 : shaftY - 50} width="4" height={index % 2 ? 24 : 34} fill="#d7dee5" />
                    <rect x={x} y={shaftY + 16} width="4" height={index % 2 ? 35 : 25} fill="#d7dee5" />
                  </g>
                ))}
                <text x="1644" y="525" textAnchor="middle" fontSize="10" fontWeight="900">GLAND SEAL</text>
              </g>

              <Bearing x={1740} shaftY={shaftY} label="THRUST / REAR JOURNAL" angle={simulation.angle} ids={ids} thrust />

              <g>
                <rect x="1682" y="203" width="116" height="68" rx="8" fill="#fff" stroke="#465466" strokeWidth="3" />
                <rect x="1700" y="224" width="80" height="25" rx="4" fill={`url(#${ids.oil})`} />
                <text x="1740" y="241" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f">AUX OIL PUMP</text>
                <path d={`M1740 271 L1740 ${shaftY - 58}`} fill="none" stroke="#b45309" strokeWidth="4" markerEnd={`url(#${ids.oilArrow})`} opacity={simulation.oilPumpRunning ? 0.95 : 0.2} />
              </g>

              <g filter={`url(#${ids.shadow})`}>
                <ellipse cx="1815" cy={shaftY} rx="18" ry="52" fill={`url(#${ids.machined})`} stroke="#334155" strokeWidth="4" />
                <ellipse cx="1854" cy={shaftY} rx="18" ry="52" fill={`url(#${ids.machined})`} stroke="#334155" strokeWidth="4" />
                <rect x="1815" y={shaftY - 35} width="39" height="70" fill="#64748b" stroke="#334155" strokeWidth="3" />
                <g transform={`rotate(${simulation.angle} 1834.5 ${shaftY})`}>
                  {[0, 90, 180, 270].map((angle) => {
                    const radians = (angle * Math.PI) / 180;
                    return (
                      <circle
                        key={angle}
                        cx={1834.5 + Math.cos(radians) * 20}
                        cy={shaftY + Math.sin(radians) * 34}
                        r="5"
                        fill="#f97316"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              </g>

              <g filter={`url(#${ids.shadow})`}>
                <rect x="1885" y="245" width="300" height="370" rx="52" fill={`url(#${ids.steel})`} stroke="#465466" strokeWidth="5" />
                <rect x="1915" y="282" width="240" height="80" rx="16" fill="#334155" />
                <rect x="1915" y="505" width="240" height="80" rx="16" fill="#334155" />
                {Array.from({ length: 9 }, (_, index) => 1933 + index * 24).map((x) => (
                  <g key={x}>
                    <path d={`M${x} 322 Q${x + 10} 294 ${x + 20} 322`} fill="none" stroke={`url(#${ids.copper})`} strokeWidth="7" />
                    <path d={`M${x} 545 Q${x + 10} 573 ${x + 20} 545`} fill="none" stroke={`url(#${ids.copper})`} strokeWidth="7" />
                  </g>
                ))}
                <rect x="1910" y={shaftY - 42} width="190" height="84" rx="31" fill={`url(#${ids.machined})`} stroke="#334155" strokeWidth="4" />
                <line x1="1922" y1={shaftY} x2="2088" y2={shaftY} stroke="#fff" strokeWidth="3" opacity="0.7" />
                <circle cx="2110" cy={shaftY} r="72" fill="#1f2937" stroke="#64748b" strokeWidth="4" />
                <g clipPath={`url(#${ids.generatorEndClip})`} transform="translate(70 0)">
                  {[0, 120, 240].map((offset, index) => {
                    const phase = ((simulation.angle + offset) * Math.PI) / 180;
                    return (
                      <rect
                        key={index}
                        x="1987"
                        y={shaftY + Math.sin(phase) * 46 - 5}
                        width="106"
                        height="10"
                        rx="5"
                        fill="#fff"
                        opacity={0.16 + 0.65 * Math.max(Math.cos(phase), 0)}
                      />
                    );
                  })}
                </g>
                <g transform={`rotate(${simulation.angle} 2110 ${shaftY})`}>
                  <rect x="2096" y={shaftY - 54} width="28" height="108" rx="10" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
                  <rect x="2056" y={shaftY - 14} width="108" height="28" rx="10" fill="#64748b" stroke="#334155" strokeWidth="3" />
                  <line x1="2110" y1={shaftY} x2="2162" y2={shaftY} stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="2162" cy={shaftY} r="7" fill="#f97316" stroke="#fff" strokeWidth="2" />
                  <circle cx="2110" cy={shaftY} r="16" fill="#dbe3ea" stroke="#334155" strokeWidth="3" />
                </g>
                <text x="2035" y="650" textAnchor="middle" fontSize="14" fontWeight="900">SYNCHRONOUS GENERATOR</text>
              </g>

              <g>
                <rect
                  x="1940"
                  y="100"
                  width="160"
                  height="86"
                  rx="12"
                  fill={breakerClosed ? '#dcfce7' : breakerState === 'TRIPPED' ? '#fee2e2' : breakerState === 'ARMED' ? '#cffafe' : '#fff'}
                  stroke={breakerClosed ? '#059669' : breakerState === 'TRIPPED' ? '#dc2626' : breakerState === 'ARMED' ? '#0891b2' : '#64748b'}
                  strokeWidth="4"
                />
                <text x="2020" y="132" textAnchor="middle" fontSize="11" fontWeight="900">BRK-101 GENERATOR BREAKER</text>
                <text x="2020" y="163" textAnchor="middle" fontSize="16" fontWeight="950">{breakerState}</text>
                {[116, 146, 176].map((y, index) => (
                  <path
                    key={y}
                    d={`M2100 ${y} L2200 ${y}`}
                    fill="none"
                    stroke={['#ef4444', '#d6a800', '#2563eb'][index]}
                    strokeWidth="4"
                    markerEnd={`url(#${ids.electricArrow})`}
                    opacity={breakerClosed ? 0.95 : 0.12}
                    className="electricFlow"
                  />
                ))}
              </g>

              <g filter={`url(#${ids.shadow})`}>
                <rect x="1784" y="610" width="112" height="62" rx="10" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                <circle cx="1812" cy="641" r="17" fill="#64748b" stroke="#334155" strokeWidth="3" />
                <g transform={`rotate(${simulation.angle * 2} 1812 641)`}>
                  <line x1="1812" y1="641" x2="1827" y2="641" stroke="#f97316" strokeWidth="4" />
                </g>
                <text x="1863" y="638" textAnchor="middle" fontSize="9" fontWeight="900">TURNING</text>
                <text x="1863" y="651" textAnchor="middle" fontSize="9" fontWeight="900">GEAR</text>
                <text x="1840" y="690" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">
                  {simulation.turningGearEngaged ? 'ENGAGED' : 'DISENGAGED'}
                </text>
              </g>
            </svg>
          </main>

          <aside className="sidebar">
            <div className={`status ${tripActive ? 'trip' : breakerClosed ? 'online' : autoSyncArmed ? 'sync' : ''}`}>
              <div className="eyebrow">UNIT STATUS</div>
              <div className="statusValue">{unitStatus}</div>
              <div className="statusSub">{generatorStatus}</div>
            </div>

            <div className="card">
              <h3>Automatic startup sequence</h3>
              <div className="sequence">
                {sequenceSteps.map((step, index) => {
                  const currentIndex = sequenceSteps.indexOf(startupStep);
                  return (
                    <div
                      key={step}
                      className={`sequenceStep ${
                        startupStep === step ? 'active' : currentIndex > index ? 'complete' : ''
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3>Protection and permissives</h3>
              <div className="lampGrid">
                <Lamp on={simulation.oilPumpRunning}>Oil pump running</Lamp>
                <Lamp on={oilReady}>Oil pressure ready</Lamp>
                <Lamp on={simulation.turningGearEngaged}>Turning gear engaged</Lamp>
                <Lamp on={casingWarm}>Casing warm</Lamp>
                <Lamp on={fieldReady}>Field ready</Lamp>
                <Lamp on={speedReady}>Speed ready</Lamp>
                <Lamp on={voltageReady}>Voltage ready</Lamp>
                <Lamp on={frequencyReady}>Frequency ready</Lamp>
                <Lamp on={phaseReady}>Phase ready</Lamp>
                <Lamp on={breakerClosed}>Breaker closed</Lamp>
                <Lamp on={tripActive} danger>Trip active</Lamp>
                <Lamp on={simulation.gridImport > 1} danger>Reverse power</Lamp>
              </div>
            </div>

            <div className="card">
              <h3>Synchroscope and closing permissives</h3>
              <div className="syncLayout">
                <SynchronizingDial phase={simulation.phase} ready={synchronizationReady} />
                <div className="checks">
                  <span className={speedReady ? 'ok' : ''}>ST-101: {simulation.rpm.toFixed(0)} RPM</span>
                  <span className={frequencyReady ? 'ok' : ''}>Δf: {frequencyError.toFixed(3)} Hz</span>
                  <span className={voltageReady ? 'ok' : ''}>ΔV: {voltageError.toFixed(1)}%</span>
                  <span className={phaseReady ? 'ok' : ''}>Phase: {simulation.phase.toFixed(1)}°</span>
                  <span className={accelerationReady ? 'ok' : ''}>Accel: {simulation.acceleration.toFixed(2)} rad/s²</span>
                  <strong className={synchronizationReady ? 'ok' : ''}>
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
              <h3>Reaction-stage thermodynamics</h3>
              {simulation.stages.map((stage) => (
                <div className="stage" key={stage.n}>
                  <div className="stageHead">
                    <span>Stage {stage.n}</span>
                    <span>{(stage.efficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="stageGrid">
                    <span>Pin: {stage.pin.toFixed(2)} bar</span>
                    <span>Pst: {stage.ps.toFixed(2)} bar</span>
                    <span>Pout: {stage.pout.toFixed(2)} bar</span>
                    <span>Reaction: 50%</span>
                    <span>Blade: {(stage.bladeHeight * 1000).toFixed(0)} mm</span>
                    <span>Ca: {stage.axialVelocity.toFixed(1)} m/s</span>
                    <span>U: {stage.bladeSpeed.toFixed(1)} m/s</span>
                    <span>U/C₀: {stage.speedRatio.toFixed(2)}</span>
                    <span>Work: {(stage.work / 1000).toFixed(1)} kJ/kg</span>
                    <span>Power: {stage.power.toFixed(1)} kW</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="metrics">
              <Metric tag="TV-101" label="Main stop valve" value={(simulation.mainStopValve * 100).toFixed(1)} unit="%" />
              <Metric tag="GV-101" label="Governor valve" value={(simulation.governorValve * 100).toFixed(1)} unit="%" />
              <Metric tag="PT-101" label="Main steam pressure" value={SOURCE_PRESSURE_BAR.toFixed(2)} unit="bar" />
              <Metric tag="PT-102" label="Steam chest pressure" value={simulation.chestPressure.toFixed(2)} unit="bar" />
              <Metric tag="FT-101" label="Valve inflow" value={simulation.valveFlow.toFixed(3)} unit="kg/s" />
              <Metric tag="FT-102" label="Turbine flow" value={simulation.turbineFlow.toFixed(3)} unit="kg/s" />
              <Metric tag="ST-101" label="Rotor speed" value={simulation.rpm.toFixed(0)} unit="RPM" />
              <Metric tag="TT-101" label="Casing temperature" value={simulation.casingTemperature.toFixed(1)} unit="°C" />
              <Metric tag="TT-102" label="Rotor temperature" value={simulation.rotorTemperature.toFixed(1)} unit="°C" />
              <Metric tag="DE-101" label="Differential expansion" value={simulation.differentialExpansion.toFixed(3)} unit="mm" tone={Math.abs(simulation.differentialExpansion) > 1 ? 'warning' : 'normal'} />
              <Metric tag="PWR-101" label="Turbine power" value={simulation.turbinePower.toFixed(1)} unit="kW" />
              <Metric tag="ETA-101" label="Overall efficiency" value={(simulation.overallEfficiency * 100).toFixed(1)} unit="%" />
              <Metric tag="VT-101" label="Generator voltage" value={simulation.generatedVoltage.toFixed(0)} unit="V" />
              <Metric tag="FR-101" label="Generator frequency" value={simulation.generatedFrequency.toFixed(2)} unit="Hz" />
              <Metric tag="MW-101" label="Active power" value={simulation.electricalPower.toFixed(1)} unit="kW" tone={breakerClosed ? 'good' : 'normal'} />
              <Metric tag="MVAR-101" label="Reactive power" value={simulation.reactivePower.toFixed(1)} unit="kVAr" />
              <Metric tag="PF-101" label="Power factor" value={simulation.powerFactor.toFixed(3)} />
              <Metric tag="CT-101" label="Generator current" value={simulation.current.toFixed(1)} unit="A" tone={breakerClosed ? 'good' : 'normal'} />
              <Metric tag="PT-301" label="Lube-oil pressure" value={simulation.oilPressure.toFixed(2)} unit="bar" tone={simulation.oilPressure < 1.25 ? 'warning' : 'normal'} />
              <Metric tag="TT-301" label="Front bearing temp" value={simulation.frontBearingTemperature.toFixed(1)} unit="°C" />
              <Metric tag="TT-302" label="Rear bearing temp" value={simulation.rearBearingTemperature.toFixed(1)} unit="°C" />
              <Metric tag="TT-303" label="Thrust bearing temp" value={simulation.thrustBearingTemperature.toFixed(1)} unit="°C" tone={simulation.thrustBearingTemperature > 95 ? 'warning' : 'normal'} />
              <Metric tag="VI-101X" label="Vibration X" value={simulation.vibrationX.toFixed(2)} unit="mm/s" tone={simulation.vibrationX > 4.5 ? 'warning' : 'normal'} />
              <Metric tag="VI-101Y" label="Vibration Y" value={simulation.vibrationY.toFixed(2)} unit="mm/s" tone={simulation.vibrationY > 4.5 ? 'warning' : 'normal'} />
              <Metric tag="AI-101" label="Axial displacement" value={simulation.axialDisplacement.toFixed(3)} unit="mm" tone={Math.abs(simulation.axialDisplacement) > 0.35 ? 'warning' : 'normal'} />
              <Metric tag="BRK-101" label="Generator breaker" value={breakerState} tone={breakerClosed ? 'good' : breakerState === 'TRIPPED' ? 'warning' : 'normal'} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
