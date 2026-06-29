"use client";

import type {
  PnpWorkingControls,
  PnpWorkingMode,
  PnpWorkingState,
} from "./simulationTypes";

/* =========================================================
   PNP TRANSISTOR MODEL CONSTANTS
========================================================= */

const BASE_EMITTER_DROP = 0.7;
const LED_FORWARD_DROP = 2.0;
const SATURATION_VEC = 0.2;
const ACTIVE_BETA = 80;
const FORCED_BETA_SWITCH = 20;

/* =========================================================
   HELPERS
========================================================= */

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

function formatNumber(value: number, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

/* =========================================================
   STATUS MESSAGE
========================================================= */

function buildStatus(
  mode: PnpWorkingMode,
  switchClosed: boolean,
  batteryVoltage: number,
  isLedOn: boolean,
) {
  if (batteryVoltage <= 0) {
    return {
      statusLabel: "No supply voltage",
      statusDescription:
        "VCC is 0V, so the PNP transistor, base current, and LED load current are all OFF.",
    };
  }

  if (!switchClosed) {
    return {
      statusLabel: "Switch open",
      statusDescription:
        "The base is pulled close to the emitter by RPU. VEB is not enough, so the PNP transistor stays OFF.",
    };
  }

  if (mode === "saturated") {
    return {
      statusLabel: isLedOn ? "Saturated ON" : "Saturated",
      statusDescription:
        "The base is pulled low through RB. The PNP transistor is fully ON and supplies current to the LED load.",
    };
  }

  if (mode === "active") {
    return {
      statusLabel: "Active region",
      statusDescription:
        "The PNP transistor is ON, but the base drive is not strong enough for full saturation.",
    };
  }

  return {
    statusLabel: "Cutoff",
    statusDescription:
      "The base-emitter voltage is not enough to turn the PNP transistor ON.",
  };
}

/* =========================================================
   MAIN PNP SIMULATION LOGIC
========================================================= */

export function calculatePnpWorkingState(
  controls: PnpWorkingControls,
): PnpWorkingState {
  const batteryVoltage = clamp(controls.batteryVoltage, 0, 12);
  const rbOhms = clamp(controls.rbOhms, 100, 100000);
  const rpuOhms = clamp(controls.rpuOhms, 100, 200000);
  const rLedOhms = clamp(controls.rLedOhms, 100, 5000);
  const switchClosed = controls.switchClosed;

  /* =========================================================
     BASIC NODE VOLTAGES
     PNP high-side:
     Emitter is connected to +VCC.
  ========================================================= */

  const emitterVoltage = batteryVoltage;

  let baseVoltage = emitterVoltage;
  let baseCurrentA = 0;

  /* =========================================================
     BASE DRIVE LOGIC
     SW OPEN  -> base pulled up to emitter by RPU -> OFF
     SW CLOSE -> base pulled low through RB -> ON if VCC > 0.7V
  ========================================================= */

  if (batteryVoltage > BASE_EMITTER_DROP && switchClosed) {
    baseVoltage = Math.max(0, emitterVoltage - BASE_EMITTER_DROP);

    // Educational simplified PNP base current:
    // current flows from emitter-base junction through RB to ground.
    baseCurrentA = Math.max(0, baseVoltage / rbOhms);
  }

  /* =========================================================
     LOAD CURRENT LIMIT
     Current path:
     +VCC -> PNP Emitter -> Collector -> LED -> R_LED -> GND
  ========================================================= */

  const collectorCurrentLimitA = Math.max(
    0,
    (batteryVoltage - LED_FORWARD_DROP - SATURATION_VEC) / rLedOhms,
  );

  const saturationNeedA =
    collectorCurrentLimitA > 0
      ? collectorCurrentLimitA / FORCED_BETA_SWITCH
      : 0;

  let mode: PnpWorkingMode = "cutoff";
  let collectorCurrentA = 0;

  /* =========================================================
     MODE DECISION
  ========================================================= */

  if (
    batteryVoltage > BASE_EMITTER_DROP &&
    switchClosed &&
    baseCurrentA > 0 &&
    collectorCurrentLimitA > 0
  ) {
    if (baseCurrentA >= saturationNeedA) {
      mode = "saturated";
      collectorCurrentA = collectorCurrentLimitA;
    } else {
      mode = "active";
      collectorCurrentA = Math.min(
        collectorCurrentLimitA,
        baseCurrentA * ACTIVE_BETA,
      );
    }
  }

  if (collectorCurrentA <= 0) {
    mode = "cutoff";
    collectorCurrentA = 0;
  }

  /* =========================================================
     OUTPUT VOLTAGES
  ========================================================= */

  const isLedOn = collectorCurrentA > 0.001;

  const collectorVoltage = isLedOn
    ? mode === "saturated"
      ? Math.max(0, emitterVoltage - SATURATION_VEC)
      : clamp(
          LED_FORWARD_DROP + collectorCurrentA * rLedOhms,
          0,
          Math.max(0, emitterVoltage - SATURATION_VEC),
        )
    : 0;

  const ledBrightness = collectorCurrentLimitA
    ? clamp((collectorCurrentA / collectorCurrentLimitA) * 100, 0, 100)
    : 0;

  const betaEstimate = baseCurrentA > 0 ? collectorCurrentA / baseCurrentA : 0;

  const saturationMargin =
    saturationNeedA > 0 ? baseCurrentA / saturationNeedA : 0;

  const status = buildStatus(mode, switchClosed, batteryVoltage, isLedOn);

  /* =========================================================
     EQUATION PANEL DATA
  ========================================================= */

  const equations = [
    {
      label: "Base drive",
      expression: "IB = (VE - VBE) / RB",
      value: `${formatNumber(baseCurrentA * 1000, 3)} mA`,
      note: `Using VBE = ${BASE_EMITTER_DROP.toFixed(2)}V`,
    },
    {
      label: "Load limit",
      expression: "IC(max) = (VCC - VLED - VEC(sat)) / R_LED",
      value: `${formatNumber(collectorCurrentLimitA * 1000, 3)} mA`,
      note: `Using VLED = ${LED_FORWARD_DROP.toFixed(2)}V`,
    },
    {
      label: "Saturation check",
      expression: "IB(required) = IC(max) / forced beta",
      value: `${formatNumber(saturationNeedA * 1000, 3)} mA`,
      note: `Forced beta = ${FORCED_BETA_SWITCH}`,
    },
    {
      label: "Decision",
      expression: "Compare IB(actual) with IB(required)",
      value:
        mode === "saturated"
          ? "Saturation reached"
          : mode === "active"
            ? "Active region"
            : "Cutoff / blocked",
      note: `Saturation margin = ${formatNumber(saturationMargin, 2)}x`,
    },
  ];

  /* =========================================================
     RETURN STATE
  ========================================================= */

  return {
    batteryVoltage: round(batteryVoltage, 2),
    rbOhms: round(rbOhms, 0),
    rpuOhms: round(rpuOhms, 0),
    rLedOhms: round(rLedOhms, 0),

    switchClosed,
    mode,

    emitterVoltage: round(emitterVoltage, 2),
    baseVoltage: round(baseVoltage, 2),
    collectorVoltage: round(collectorVoltage, 2),

    baseCurrentMa: round(baseCurrentA * 1000, 3),
    collectorCurrentMa: round(collectorCurrentA * 1000, 3),
    ledCurrentMa: round(collectorCurrentA * 1000, 3),

    ledBrightness: round(ledBrightness, 1),

    basePathActive: baseCurrentA > 0,
    loadPathActive: collectorCurrentA > 0,
    isLedOn,

    statusLabel: status.statusLabel,
    statusDescription: status.statusDescription,

    flowMode: controls.flowMode,

    forcedBetaTarget: FORCED_BETA_SWITCH,
    saturationBaseCurrentMa: round(saturationNeedA * 1000, 3),
    collectorCurrentLimitMa: round(collectorCurrentLimitA * 1000, 3),
    betaEstimate: round(betaEstimate, 2),
    saturationMargin: round(saturationMargin, 2),

    equations,
  };
}
