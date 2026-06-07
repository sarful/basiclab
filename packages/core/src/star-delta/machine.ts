import type { StarDeltaControlState } from "../../../types/src";

export const STAR_DELTA_IDLE_STATE: StarDeltaControlState = {
  mcbOn: true,
  motorRunning: false,
  overloadTripped: false,
  mainOn: false,
  timerOn: false,
  starOn: false,
  deltaOn: false,
  transferOpen: false,
};

export function resolveStoppedState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  return {
    ...state,
    motorRunning: false,
    overloadTripped: false,
    mainOn: false,
    timerOn: false,
    starOn: false,
    deltaOn: false,
    transferOpen: false,
  };
}

export function resolveTrippedState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  return {
    ...state,
    motorRunning: false,
    overloadTripped: true,
    mainOn: false,
    timerOn: false,
    starOn: false,
    deltaOn: false,
    transferOpen: false,
  };
}

export function resolveStartState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  if (!state.mcbOn || state.overloadTripped) {
    return state;
  }

  return {
    ...state,
    motorRunning: true,
    overloadTripped: false,
    mainOn: true,
    timerOn: true,
    starOn: true,
    deltaOn: false,
    transferOpen: false,
  };
}

export function resolveTransferState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  return {
    ...state,
    starOn: false,
    deltaOn: false,
    transferOpen: true,
  };
}

export function resolveDeltaPickupState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  return {
    ...state,
    transferOpen: false,
    deltaOn: true,
  };
}

export function resolveFaultState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  if (!state.mcbOn) {
    return state;
  }

  return resolveTrippedState(state);
}

export function resolveMcbToggleState(
  state: StarDeltaControlState,
): StarDeltaControlState {
  const nextMcbOn = !state.mcbOn;

  if (!nextMcbOn) {
    return {
      ...resolveStoppedState(state),
      mcbOn: false,
    };
  }

  return {
    ...state,
    mcbOn: true,
  };
}
