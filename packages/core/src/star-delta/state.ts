import type { ElectricalMode, StarDeltaTelemetryInput } from "../../../types/src";

export function resolveElectricalMode({
  motorRunning,
  transferOpen,
  deltaOn,
  starOn,
}: Pick<
  StarDeltaTelemetryInput,
  "motorRunning" | "transferOpen" | "deltaOn" | "starOn"
>): ElectricalMode {
  if (!motorRunning) return "idle";
  if (transferOpen) return "transfer";
  if (deltaOn) return "delta";
  if (starOn) return "star";
  return "main";
}

export function resolveModeLabel({
  mcbOn,
  overloadTripped,
  transferOpen,
  deltaOn,
  starOn,
  mainOn,
}: Pick<
  StarDeltaTelemetryInput,
  "mcbOn" | "overloadTripped" | "transferOpen" | "deltaOn" | "starOn" | "mainOn"
>) {
  if (!mcbOn) return "Isolated";
  if (overloadTripped) return "Fault Trip";
  if (transferOpen) return "Open Transition";
  if (deltaOn) return "Delta Mode";
  if (starOn) return "Star Mode";
  if (mainOn) return "Main Picked";
  return "Idle";
}

export function resolveFlowStateLabel({
  mcbOn,
  overloadTripped,
  transferOpen,
  deltaOn,
  starOn,
  timerOn,
  mainOn,
}: Pick<
  StarDeltaTelemetryInput,
  | "mcbOn"
  | "overloadTripped"
  | "transferOpen"
  | "deltaOn"
  | "starOn"
  | "timerOn"
  | "mainOn"
>) {
  if (!mcbOn) return "MCB Off";
  if (overloadTripped) return "Trip Active";
  if (transferOpen) return "Timer Transfer Gap";
  if (deltaOn) return "Running in Delta";
  if (starOn) return "Starting in Star";
  if (timerOn) return "Timer Active";
  if (mainOn) return "Main Energized";
  return "Idle";
}

export function resolveFlowDescription({
  mcbOn,
  overloadTripped,
  transferOpen,
  deltaOn,
  starOn,
  timerOn,
  mainOn,
}: Pick<
  StarDeltaTelemetryInput,
  | "mcbOn"
  | "overloadTripped"
  | "transferOpen"
  | "deltaOn"
  | "starOn"
  | "timerOn"
  | "mainOn"
>) {
  if (!mcbOn) {
    return "MCB is OFF. Both power and control paths are isolated.";
  }
  if (overloadTripped) {
    return "Overload relay has tripped. Main, timer, star, and delta paths are dropped.";
  }
  if (transferOpen) {
    return "Star contactor is open. The timer is holding a safe transfer gap before delta pickup.";
  }
  if (deltaOn) {
    return "Main and delta contactors are active. Motor is running in delta mode.";
  }
  if (starOn) {
    return "Main and star contactors are active. Timer is counting before delta changeover.";
  }
  if (timerOn) {
    return "Timer is energized and the transfer sequence is armed.";
  }
  if (mainOn) {
    return "Main contactor is picked up and waiting for the timer branch.";
  }
  return "Starter is ready. Press Start to energize MAIN, TIMER, and STAR.";
}

export function resolveTripReasonText(
  overloadTripped: boolean,
  motorCurrent: number,
  currentLimit: number,
) {
  if (!overloadTripped) return "No active trip.";
  return `Current Draw ${motorCurrent.toFixed(1)}A > Limit ${currentLimit.toFixed(1)}A`;
}
