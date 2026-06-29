import type {
  FaultMode,
  LearningTaskResult,
  NpnWorkingControls,
  NpnWorkingMode,
  NpnWorkingState,
  PresetMode,
} from "./simulationTypes";

const BASE_EMITTER_DROP = 0.7;
const LED_FORWARD_DROP = 2;
const SATURATION_VCE = 0.2;
const ACTIVE_BETA = 80;
const FORCED_BETA_SWITCH = 20;

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

export const PRESET_VALUES: Record<
  Exclude<PresetMode, "manual">,
  Pick<NpnWorkingControls, "batteryVoltage" | "rbOhms" | "rpdOhms" | "rLedOhms" | "switchClosed" | "faultMode">
> = {
  safe_off: {
    batteryVoltage: 5,
    rbOhms: 10000,
    rpdOhms: 100000,
    rLedOhms: 1000,
    switchClosed: false,
    faultMode: "none",
  },
  switch_on: {
    batteryVoltage: 5,
    rbOhms: 10000,
    rpdOhms: 100000,
    rLedOhms: 1000,
    switchClosed: true,
    faultMode: "none",
  },
  weak_base: {
    batteryVoltage: 5,
    rbOhms: 47000,
    rpdOhms: 100000,
    rLedOhms: 330,
    switchClosed: true,
    faultMode: "none",
  },
  fault_check: {
    batteryVoltage: 5,
    rbOhms: 10000,
    rpdOhms: 100000,
    rLedOhms: 1000,
    switchClosed: true,
    faultMode: "led_reverse",
  },
};

function buildStatus(
  mode: NpnWorkingMode,
  switchClosed: boolean,
  faultMode: FaultMode,
  isLedOn: boolean,
) {
  if (faultMode === "rb_open") {
    return {
      statusLabel: "RB open fault",
      statusDescription: "The base resistor path is broken, so no base current can enter the transistor.",
    };
  }

  if (faultMode === "rpd_open") {
    return {
      statusLabel: switchClosed ? "Pull-down missing" : "Floating base risk",
      statusDescription: "The base pull-down path is removed. In real hardware this makes the input more noise-sensitive and less predictable.",
    };
  }

  if (faultMode === "led_reverse") {
    return {
      statusLabel: "LED reverse fault",
      statusDescription: "Collector current path is blocked because the LED is reverse-connected.",
    };
  }

  if (faultMode === "collector_open") {
    return {
      statusLabel: "Collector open fault",
      statusDescription: "The collector load path is disconnected, so the transistor may get base drive but cannot feed the LED branch.",
    };
  }

  if (faultMode === "low_supply") {
    return {
      statusLabel: "Low supply test",
      statusDescription: "The supply is intentionally reduced to show how transistor switching behavior changes when headroom disappears.",
    };
  }

  if (!switchClosed) {
    return {
      statusLabel: "Switch open",
      statusDescription: "Base drive is disconnected, so the transistor stays OFF and the LED path is open.",
    };
  }

  if (mode === "saturated") {
    return {
      statusLabel: isLedOn ? "Saturated ON" : "Saturated",
      statusDescription: "Base current is strong enough to drive the transistor like a closed switch and the LED load path conducts.",
    };
  }

  if (mode === "active") {
    return {
      statusLabel: "Active region",
      statusDescription: "The transistor is conducting, but the base drive is still limiting collector current before full saturation.",
    };
  }

  return {
    statusLabel: "Cutoff",
    statusDescription: "The base-emitter junction is not driven enough to start conduction, so current cannot reach the LED path.",
  };
}

function buildLearningTasks(state: {
  switchClosed: boolean;
  isLedOn: boolean;
  mode: NpnWorkingMode;
  baseCurrentMa: number;
  collectorCurrentMa: number;
  saturationMargin: number;
  faultMode: FaultMode;
}): LearningTaskResult[] {
  return [
    {
      id: "task-led-off",
      title: "Task 1",
      target: "Keep the LED OFF with the switch open.",
      passed: !state.switchClosed && !state.isLedOn,
      feedback:
        !state.switchClosed && !state.isLedOn
          ? "Correct. No base drive means the transistor stays in cutoff."
          : "Open the switch so base current becomes zero and the LED path stops conducting.",
    },
    {
      id: "task-saturate",
      title: "Task 2",
      target: "Drive the transistor into saturation and turn the LED ON.",
      passed:
        state.switchClosed &&
        state.isLedOn &&
        state.mode === "saturated" &&
        state.saturationMargin >= 1,
      feedback:
        state.switchClosed &&
        state.isLedOn &&
        state.mode === "saturated" &&
        state.saturationMargin >= 1
          ? "Good. The base drive is strong enough to force switching saturation."
          : "Close the switch and reduce base resistance or load demand until the transistor reaches saturation.",
    },
    {
      id: "task-active",
      title: "Task 3",
      target: "Create an active-region case where the LED conducts but saturation is not reached.",
      passed:
        state.switchClosed &&
        state.isLedOn &&
        state.mode === "active" &&
        state.collectorCurrentMa > 0,
      feedback:
        state.switchClosed &&
        state.isLedOn &&
        state.mode === "active"
          ? "Nice. Collector current exists, but base drive is still limiting full switching."
          : "Try increasing RB or decreasing R_LED to make collector current demand larger than the available saturation drive.",
    },
    {
      id: "task-fault",
      title: "Task 4",
      target: "Select a fault mode and identify why the LED path fails or becomes unreliable.",
      passed: state.faultMode !== "none",
      feedback:
        state.faultMode !== "none"
          ? "Fault mode active. Use the status card and equations to explain the failure mechanism."
          : "Choose one fault mode to practice troubleshooting logic.",
    },
  ];
}

export function calculateNpnWorkingState(
  controls: NpnWorkingControls,
): NpnWorkingState {
  const batteryVoltage =
    controls.faultMode === "low_supply"
      ? 1.8
      : clamp(controls.batteryVoltage, 0, 12);
  const rbOhms = clamp(controls.rbOhms, 100, 100000);
  const rpdOhms = clamp(controls.rpdOhms, 100, 200000);
  const rLedOhms = clamp(controls.rLedOhms, 100, 5000);
  const switchClosed = controls.switchClosed;
  const emitterVoltage = 0;

  const loadPathBlocked =
    controls.faultMode === "led_reverse" || controls.faultMode === "collector_open";
  const ledForwardDrop = controls.faultMode === "led_reverse" ? batteryVoltage + 1 : LED_FORWARD_DROP;
  const effectiveRbOhms = controls.faultMode === "rb_open" ? Number.POSITIVE_INFINITY : rbOhms;
  const effectiveRpdOhms = controls.faultMode === "rpd_open" ? Number.POSITIVE_INFINITY : rpdOhms;

  const collectorCurrentLimitA = loadPathBlocked
    ? 0
    : Math.max(0, (batteryVoltage - ledForwardDrop - SATURATION_VCE) / rLedOhms);

  let baseVoltage = 0;
  let baseCurrentA = 0;

  if (switchClosed && batteryVoltage > BASE_EMITTER_DROP && Number.isFinite(effectiveRbOhms)) {
    baseVoltage = BASE_EMITTER_DROP;
    const rbCurrentA = Math.max(0, (batteryVoltage - baseVoltage) / effectiveRbOhms);
    const pullDownCurrentA = Number.isFinite(effectiveRpdOhms)
      ? baseVoltage / effectiveRpdOhms
      : 0;
    baseCurrentA = Math.max(0, rbCurrentA - pullDownCurrentA);
  }

  const saturationNeedA =
    collectorCurrentLimitA > 0 ? collectorCurrentLimitA / FORCED_BETA_SWITCH : 0;

  let mode: NpnWorkingMode = "cutoff";
  let collectorCurrentA = 0;

  if (baseCurrentA > 0) {
    if (baseCurrentA >= saturationNeedA && collectorCurrentLimitA > 0) {
      mode = "saturated";
      collectorCurrentA = collectorCurrentLimitA;
    } else {
      mode = "active";
      collectorCurrentA = Math.min(collectorCurrentLimitA, baseCurrentA * ACTIVE_BETA);
      if (collectorCurrentA <= 0) {
        mode = "cutoff";
      }
    }
  }

  const isLedOn = collectorCurrentA > 0.001;
  const ledBrightness = collectorCurrentLimitA
    ? clamp((collectorCurrentA / collectorCurrentLimitA) * 100, 0, 100)
    : 0;
  const collectorVoltage =
    !isLedOn
      ? batteryVoltage
      : mode === "saturated"
      ? SATURATION_VCE
      : Math.max(
          SATURATION_VCE,
          batteryVoltage - collectorCurrentA * rLedOhms - Math.min(ledForwardDrop, batteryVoltage),
        );
  const betaEstimate = baseCurrentA > 0 ? collectorCurrentA / baseCurrentA : 0;
  const saturationMargin =
    saturationNeedA > 0 ? baseCurrentA / saturationNeedA : 0;

  const status = buildStatus(mode, switchClosed, controls.faultMode, isLedOn);

  const equations = [
    {
      label: "Base drive",
      expression: "IB = (VCC - VBE) / RB - VB / RPD",
      value: `${formatNumber(baseCurrentA * 1000, 3)} mA`,
      note: Number.isFinite(effectiveRbOhms)
        ? `Using VBE = ${BASE_EMITTER_DROP.toFixed(2)}V`
        : "RB path open, so base current is forced to zero",
    },
    {
      label: "Load limit",
      expression: "IC(max) = (VCC - VLED - VCE(sat)) / R_LED",
      value: `${formatNumber(collectorCurrentLimitA * 1000, 3)} mA`,
      note: loadPathBlocked
        ? "Load path blocked by selected fault"
        : `Using VLED = ${Math.min(ledForwardDrop, batteryVoltage).toFixed(2)}V`,
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
        baseCurrentA >= saturationNeedA && collectorCurrentLimitA > 0
          ? "Saturation reached"
          : isLedOn
            ? "Active region"
            : "Cutoff / blocked",
      note: `Saturation margin = ${formatNumber(saturationMargin, 2)}x`,
    },
  ];

  const learningTasks = buildLearningTasks({
    switchClosed,
    isLedOn,
    mode,
    baseCurrentMa: baseCurrentA * 1000,
    collectorCurrentMa: collectorCurrentA * 1000,
    saturationMargin,
    faultMode: controls.faultMode,
  });

  return {
    batteryVoltage: round(batteryVoltage, 2),
    rbOhms: round(rbOhms, 0),
    rpdOhms: round(rpdOhms, 0),
    rLedOhms: round(rLedOhms, 0),
    switchClosed,
    mode,
    baseVoltage: round(baseVoltage, 2),
    collectorVoltage: round(collectorVoltage, 2),
    emitterVoltage,
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
    faultMode: controls.faultMode,
    presetMode: controls.presetMode,
    forcedBetaTarget: FORCED_BETA_SWITCH,
    saturationBaseCurrentMa: round(saturationNeedA * 1000, 3),
    collectorCurrentLimitMa: round(collectorCurrentLimitA * 1000, 3),
    betaEstimate: round(betaEstimate, 2),
    saturationMargin: round(saturationMargin, 2),
    equations,
    learningTasks,
  };
}
