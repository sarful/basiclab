export type StarterFamily = "dol" | "star-delta";

export type SimulationMode =
  | "idle"
  | "main"
  | "star"
  | "transfer"
  | "delta"
  | "trip";

export type ElectricalMode =
  | "idle"
  | "main"
  | "star"
  | "transfer"
  | "delta";

export interface MotorSpec {
  horsepower: number;
  rpm: number;
  currentLimit: number;
  loadPercent: number;
}

export interface StarDeltaTelemetryInput {
  horsepower: number;
  rpm: number;
  loadPercent: number;
  currentLimit: number;
  mcbOn: boolean;
  motorRunning: boolean;
  overloadTripped: boolean;
  mainOn: boolean;
  timerOn: boolean;
  starOn: boolean;
  deltaOn: boolean;
  transferOpen: boolean;
}

export interface StarDeltaControlState {
  mcbOn: boolean;
  motorRunning: boolean;
  overloadTripped: boolean;
  mainOn: boolean;
  timerOn: boolean;
  starOn: boolean;
  deltaOn: boolean;
  transferOpen: boolean;
}
